// general imports
import React from "react"; // Ensure React is imported
import { useParams, Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import "../styles.css";

// import icons
import { AiFillHome } from "react-icons/ai";
import { FaDownload } from "react-icons/fa6";

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
import { createServerClient } from "@supabase/auth-helpers-remix";
import type { LoaderFunctionArgs } from "@remix-run/node";
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
    .from("files")
    .select("*")
    .ilike("path", `%${topic}%`)
    .single();

  if (error) {
    console.error("Error fetching data:", error);
    return json({ data: null }, { headers: response.headers });
  }

  return json(
    {
      data,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
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
import pkg from "react-katex";
const { BlockMath } = pkg;
import "katex/dist/katex.min.css";

// header levels hashmap
const headerLevelMap: { [key: number]: string } = {
  1: "text-5xl",
  2: "text-4xl",
  3: "text-3xl",
  4: "text-2xl",
  5: "text-xl",
  6: "text-lg",
};

const parseContent = (content: string) => {
  const lines = content.split("\n");
  let inMathBlock = false;
  let mathContent = "";

  return lines.map((line, index) => {
    const trimmedLine = line.trim();

    // Match image syntax (e.g., ![alt](image_url))
    const imageRegex = /!\[.*?\]\((.*?)\)/;
    const imageMatch = trimmedLine.match(imageRegex);
    if (imageMatch) {
      const imageUrl = imageMatch[1];
      return (
        <img
          key={index}
          src={imageUrl}
          alt=""
          className="my-4 max-w-full h-auto"
        />
      );
    }

    const headerMatch = trimmedLine.match(/^#{1,6}\s/);
    if (headerMatch) {
      const headerLevel = headerMatch[0].trim().length;
      const headerText = trimmedLine.slice(headerLevel).trim();

      const headerClass = headerLevelMap[headerLevel] || "text-base";

      return React.createElement(
        `h${headerLevel}` as keyof JSX.IntrinsicElements,
        { key: index, className: `${headerClass} font-bold` },
        headerText
      );
    }

    if (trimmedLine.startsWith("$$")) {
      if (inMathBlock) {
        inMathBlock = false;
        const mathToRender = mathContent + "\n";
        mathContent = "";
        return <BlockMath key={index}>{mathToRender.trim()}</BlockMath>;
      } else {
        inMathBlock = true;
        mathContent = "";
        return null;
      }
    }

    if (inMathBlock) {
      mathContent += trimmedLine + "\n";
      return null;
    }

    if (trimmedLine.startsWith("**") && trimmedLine.endsWith("**")) {
      return (
        <span key={index} className="arima-font font-bold">
          {trimmedLine.slice(2, -2).trim()}
        </span>
      );
    }

    if (trimmedLine === "") {
      return <br key={index} />;
    }

    return <p key={index}>{trimmedLine}</p>;
  });
};

// header parser
const parseHeader = (topic: string) => {
  return topic
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function App() {
  const { data } = useLoaderData<{
    data: File | null;
    supabaseUrl: string;
    supabaseKey: string;
  }>();
  const { topic } = useParams();

  const handleDownload = () => {
    if (!data.fileContent) return;

    const blob = new Blob([data.fileContent], { type: "text/markdown" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = `${topic}.md` || `untitled.md`;
    link.click();

    URL.revokeObjectURL(url);
  };

  if (!data) {
    return (
      <div className="flex justify-center">
        <div className="w-3/5 mt-24">
          <h1 className="text-3xl mb-5 font-bold arima-font">
            Error 404: Page Not Found
          </h1>
        </div>
      </div>
    );
  }

  const parsedHeader = parseHeader(topic || "");

  return (
    <div className="relative">
      <div className="sticky top-8 left-8 p-3 z-10 bg-slate-900 w-min rounded-md">
        <Link to="/">
          <AiFillHome className="text-white text-2xl cursor-pointer" />
        </Link>
      </div>

      <div className="flex justify-center">
        <div className="w-3/5 mt-24 mb-24">
          <h1 className="text-3xl mb-5 font-bold arima-font">{parsedHeader}</h1>
          <div className="my-4 border-b border-[1.5px] border-white opacity-30 mx-1" />
          {parseContent(data.fileContent)}
          <div className="my-4 border-b border-[1.5px] border-white opacity-30 mx-1" />
          <button
            onClick={handleDownload}
            className="flex items-center bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 px-3 py-2 mt-10 rounded-sm"
          >
            <span className="mr-2 font-sans text-base">
              Download Raw Markdown File
            </span>
            <FaDownload />
          </button>
        </div>
      </div>
    </div>
  );
}
