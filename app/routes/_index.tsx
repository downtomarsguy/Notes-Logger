// general imports
import { Link } from "@remix-run/react";

// import and configure technology icons
import { RiRemixRunFill } from "react-icons/ri";
import { RiReactjsFill } from "react-icons/ri";
import { BiLogoTypescript } from "react-icons/bi";
import { RiSupabaseFill } from "react-icons/ri";
import { RiTailwindCssFill } from "react-icons/ri";
import { IoLogoVercel } from "react-icons/io5";

const technologies = [
  { icon: <RiRemixRunFill key="remix" size={23} />, name: "Remix" },
  { icon: <RiReactjsFill key="react" size={25} />, name: "React" },
  { icon: <BiLogoTypescript key="typescript" size={25} />, name: "TypeScript" },
  { icon: <RiSupabaseFill key="supabase" size={20} />, name: "Supabase" },
  { icon: <RiTailwindCssFill key="tailwind" size={25} />, name: "Tailwind CSS" },
  { icon: <IoLogoVercel key="vercel" size={20} />, name: "Vercel" },
];

// meta configuration
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Home" },
    { name: "description", content: "Notes-Logger Homepage" },
  ];
};

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-arima">
      <nav className="flex justify-between items-center py-4 px-7 bg-slate-900 text-white">
        <div className="flex items-center">
          <span className="text-xl font-bold">Notes Logger</span>
        </div>

        <div className="space-x-5">
          <a href="https://github.com/deitysilver/Notes-Logger" className="text-gray-300 font-semibold hover:text-white no-underline">Github</a>
          <a href="https://www.figma.com/design/otjVWyqgvFaz5Nx9ObPvF4/Notes-Logger?node-id=0-1&node-type=canvas&t=w23JOt4pFyiwdH9d-0" className="text-gray-300 font-semibold hover:text-white no-underline">Figma</a>
        </div>
      </nav>

      <div className="flex-grow flex">
        <div className="mt-36 mb-36 ml-7">
          <h1 className="text-6xl">Welcome to Notes Logger</h1>
          <h1 className="text-xl font-light ml-2 mt-4">Created for markdown and latex display purposes as Google Docs lacks said features.</h1>
          <div className="mt-2 ml-2 flex flex-row">
            <div className="py-16 px-20 rounded-md border-4 border-slate-900">
              <a href="https://www.figma.com/design/otjVWyqgvFaz5Nx9ObPvF4/Notes-Logger?node-id=0-1&node-type=canvas&t=w23JOt4pFyiwdH9d-0" className="text-gray-300 font-semibold hover:text-white no-underline">Design File</a>
            </div>
            <div className="py-16 px-20 ml-3 rounded-md bg-slate-900 border-4 border-slate-900">
              <a href="https://github.com/deitysilver/Notes-Logger" className="text-gray-300 font-semibold hover:text-white no-underline">Source Code</a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow flex p-2 bg-indigo-600 bg-opacity-35 justify-center items-center">
        <div className="flex overflow-x-auto whitespace-nowrap justify-center">
          {technologies.map(({ icon, name }) => (
            <div className="flex items-center mx-6" key={name}>
              {icon}
              <span className="ml-4 text-white font-bold">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
