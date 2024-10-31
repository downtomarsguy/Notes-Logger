import { useParams } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import "../styles.css"

// meta configuration
export const meta: MetaFunction = () => {
  const { topic } = useParams();

  return [
    { title: parseHeader(topic || "pages") },
    { name: "description", content: "Notes-Logger Login" },
  ];
};

// supabase configuration
import { useLoaderData } from "@remix-run/react";
import { createServerClient } from '@supabase/auth-helpers-remix';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from "@remix-run/node";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { topic } = params;
  
  const response = new Response();
  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
    { request, response }
  );
  
  const { data, error } = await supabaseClient
    .from('files')
    .select('*')
    .ilike('path', `%${topic}%`)
    .single();

  if (error) {
    console.error('Error fetching data:', error);
    return json({ data: null }, { headers: response.headers });
  }

  return json(
    { data, supabaseUrl: process.env.SUPABASE_URL, supabaseKey: process.env.SUPABASE_KEY },
    {
      headers: response.headers,
    }
  );
};

interface File {
  path: string;
  fileContent: string;
}

// file parser
import pkg from 'react-katex';
const { BlockMath } = pkg;
import 'katex/dist/katex.min.css';

const parseContent = (content: string) => {
  const lines = content.split('\n');
  let inMathBlock = false;
  let mathContent = '';

  return lines.map((line, index) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('$$')) {
      if (inMathBlock) {
        inMathBlock = false;
        const mathToRender = mathContent + '\n';
        mathContent = '';
        return (
          <BlockMath key={index}>
            {mathToRender.trim()}
          </BlockMath>
        );
      } else {
        inMathBlock = true;
        mathContent = '';
        return null;
      }
    }

    if (inMathBlock) {
      mathContent += trimmedLine + '\n';
      return null;
    }

    if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
      return <span key={index} className="arima-font font-bold">{trimmedLine.slice(2, -2).trim()}</span>;
    }

    if (trimmedLine === '') {
      return <br key={index} />;
    }

    return <p key={index}>{trimmedLine}</p>;
  });
};

// header parser
const parseHeader = (topic: string) => {
  return topic
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function App() {
  const { data } = useLoaderData<{ data: File | null, supabaseUrl: string, supabaseKey: string }>();
  const { topic } = useParams();

  if (!data) {
    return <div>Error 404: File not found.</div>;
  }

  const parsedHeader = parseHeader(topic || '');

  return (
    <div className="flex justify-center">
      <div className="w-3/5 mt-24">
        <h1 className="text-3xl mb-5 font-bold arima-font">{parsedHeader}</h1>
        <div className="my-4 border-b border-[1.5px] border-white opacity-30 mx-1" />
        {parseContent(data.fileContent)}
      </div>
    </div>
  );
}
