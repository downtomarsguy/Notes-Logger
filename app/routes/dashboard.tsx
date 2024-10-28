// existing imports
import { useNavigate, useLoaderData } from "@remix-run/react";

// import icons
import { FaRegSquarePlus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

// supabase configuration
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
        <div className="flex flex-row mt-2 gap-[10px]">
          <button className="flex items-center bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 px-3 py-2 rounded-[3px]">
            <span className="mr-2 font-sans text-sm font-bold">Add File</span>
            <FaPlus />
          </button>
          <div className="flex flex-row gap-[5px]">
            <input
              type="text"
              name="passcode"
              placeholder="Search Files.."
              className="bg-white bg-opacity-20 px-3 py-2 w-[360px] text-sm font-bold rounded-[3px] font-sans"
            />
            <button className="flex items-center bg-white bg-opacity-40 hover:bg-opacity-50 active:bg-opacity-60 px-3 py-2 rounded-[3px]">
              <FaSearch size={14} />
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
