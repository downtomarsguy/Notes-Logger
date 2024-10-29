import { json } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import pkg from 'react-katex';
const { BlockMath } = pkg;
import 'katex/dist/katex.min.css';
import type { MetaFunction } from "@remix-run/node";

const parseContent = (content:any) => {
  const regex = /(\*\*([\s\S]*?)\*\*)|(\$\$([\s\S]*?)\$\$)|([^\*\$]+)/g;

  const parts = content.match(regex) || [];

  return parts.map((part:any, index:any) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2).trim()}</strong>;
    } else if (part.startsWith('$$') && part.endsWith('$$')) {
      return (
        <BlockMath key={index}>
          {part.slice(2, -2).trim()}
        </BlockMath>
      );
    } else {
      return <p key={index}>{part.trim()}</p>;
    }
  });
};

// meta configuration
export const meta: MetaFunction = () => {
  return [
    { title: "topic" },
  ];
};

export default function App() {
  const { topic } = useParams();

  const content = `  `;

  return (
    <div className="flex justify-center">
      <div className="font-sans w-3/4 mt-16">
        <h1>{topic}</h1>
        {parseContent(content)}
      </div>
    </div>
  );
}
