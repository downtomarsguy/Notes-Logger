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
      return <span key={index} className="font-arima font-bold">{part.slice(2, -2).trim()}</span>;
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

  const content = `
  `;

  return (
    <div className="flex justify-center">
      <div className="w-3/5 mt-24">
        <h1 className="text-3xl mb-5 font-bold">Geometric Sequences Assignment</h1>
        <div className="my-4 border-b border-2 border-white opacity-30 mx-1" />
        {parseContent(content)}
      </div>
    </div>
  );
}
