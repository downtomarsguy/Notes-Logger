// general imports
import "../styles.css";

// import icons
import { FaPlus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { RiFileUploadFill } from "react-icons/ri";
import { FaLink } from "react-icons/fa6";

// supabase configuration
import { useNavigate, useLoaderData } from "@remix-run/react";
import { createServerClient } from '@supabase/auth-helpers-remix';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
    { request, response }
  );

  const { data } = await supabaseClient.from('files').select('*');
  
  return json(
    { data, supabaseUrl: process.env.SUPABASE_URL, supabaseKey: process.env.SUPABASE_KEY },
    {
      headers: response.headers,
    }
  );
};

// meta configuration 
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Notes LoggerDashboard" },
  ];
};

interface Title {
  title: string;
}

export default function App() {
  const navigate = useNavigate();
  const { data, supabaseUrl, supabaseKey } = useLoaderData<{ data: Title[], supabaseUrl: string, supabaseKey: string }>();

  return (
    <div className="flex justify-center">
      <div className="font-sans w-3/4 mt-16">
        <p className="font-arima font-bold text-4xl">Dashboard</p>
        <div className="flex flex-row mt-2 gap-[10px] w-full">
          <button className="flex items-center bg-emerald-500 hover:bg-emerald-600 hover:text-slate-200 active:bg-emerald-700 active:text-slate-300 px-3 py-2 rounded-[3px]">
            <span className="mr-2 font-sans text-sm font-bold w-16">Add File</span>
            <FaPlus />
          </button>
          <div className="flex flex-row gap-[5px] w-full">
            <input
              type="text"
              name="searchfiles"
              placeholder="Search Files.."
              className="bg-white bg-opacity-20 px-3 py-2 w-full text-sm font-bold rounded-[3px] font-sans"
            />
            <button className="flex items-center bg-white bg-opacity-40 hover:bg-opacity-50 active:bg-opacity-60 px-3 py-2 rounded-[3px]">
              <FaSearch size={14} />
            </button>
          </div>
        </div>
        <div className="flex flex-row mt-5 gap-[10px] w-full">
          <div className="flex flex-col gap-4 dashboard-opacity w-full p-4 rounded-[3px]">
            <div className="flex flex-row items-center gap-4">
              <span className="w-1/3 text-right font-semibold text-base">Title</span>
              <input
                type="text"
                name="title"
                placeholder="Add Title.."
                className="bg-white bg-opacity-20 px-3 py-2 w-full text-sm font-bold rounded-[3px] font-sans"
              />
            </div>
            <div className="flex flex-row items-center gap-4">
              <span className="w-1/3 text-right font-semibold text-base">Import File</span>
              <button className="flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 hover:text-slate-200 active:bg-sky-600 active:text-slate-300 px-3 py-2 rounded-[3px] w-full">
                <span className="mr-2 font-sans text-sm font-bold">Attach</span>
                <FaLink />
              </button>
            </div>
            <button className="flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 hover:text-slate-200 active:bg-emerald-700 active:text-slate-300 px-3 py-2 rounded-[3px]">
              <span className="mr-2 font-sans text-sm font-bold">Upload File</span>
              <RiFileUploadFill />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
