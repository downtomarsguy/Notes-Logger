import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

// import icons
import { FaGithub } from "react-icons/fa";

export const meta: MetaFunction = () => {
  return [
    { title: "Home" },
    { name: "description", content: "Notes-Logger Login" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col font-arima">
      {/* navbar */}
      <nav className="flex justify-between items-center py-4 px-7 bg-slate-900 text-white">
        <div className="flex items-center">
          <span className="text-xl font-bold">Notes Logger</span>
        </div>

        <div className="space-x-4">
          <a href="https://github.com/deitysilver/Notes-Logger" className="text-gray-300 font-semibold hover:text-white no-underline">Github</a>
          <Link to="/login" className="text-gray-300 font-semibold hover:text-white no-underline">Login</Link>
        </div>
      </nav>

      <div className="flex-grow flex">
        <div className="mt-36 ml-7">
          <h1 className="text-6xl">Welcome to Notes Logger</h1>
          <h1 className="text-xl font-light ml-2 mt-4">Created for markdown and latex display purposes as Google Docs lacks said features.</h1>
          <div className="mt-2 ml-2 flex flex-row">
            <div className="py-16 px-24 rounded-md border-4 border-slate-900">
              <Link to="/login" className="text-gray-300 font-semibold hover:text-white no-underline">Login</Link>
            </div>
            <div className="py-16 px-20 ml-3 rounded-md bg-slate-900 border-4 border-slate-900">
              <a href="https://github.com/deitysilver/Notes-Logger" className="text-gray-300 font-semibold hover:text-white no-underline">Source Code</a>
            </div>            
          </div>          
        </div>
      </div>
    </div>
  );
}
