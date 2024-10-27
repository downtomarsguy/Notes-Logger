import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { createServerClient } from '@supabase/auth-helpers-remix';
import type { LoaderFunctionArgs } from '@remix-run/node';

// Import banners
import mathBanner from "../assets/math-banner.jpg";

// Import icons
import { IoMdSend } from "react-icons/io";

// Meta configuration
export const meta: MetaFunction = () => {
  return [
    { title: "Login" },
    { name: "description", content: "Notes-Logger Login" },
  ];
};

interface Passcode {
  passcode: string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
    { request, response }
  );

  const { data } = await supabaseClient.from('passcode').select('*');

  return json(
    { data },
    {
      headers: response.headers,
    }
  );
};

export default function App() {
  const [inputPasscode, setInputPasscode] = useState("");
  const navigate = useNavigate();
  const { data } = useLoaderData<{ data: Passcode[] }>(); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    console.log(JSON.stringify(data, null));

    if (data && data.length > 0 && inputPasscode === data[0].passcode) {
      navigate("/dashboard");
    } else {
      alert("Invalid passcode. Please try again.");
    }
  };

  return (
    <div className="flex h-screen font-arima">
      <div className="flex flex-col justify-center items-start w-1/2 p-7">
        <form onSubmit={handleSubmit}>
          <div className="text-base font-bold mb-4">Super Secret Passcode:</div>
          <input
            type="password"
            name="passcode"
            placeholder="Enter passcode.."
            value={inputPasscode}
            onChange={(e) => setInputPasscode(e.target.value)}
            className="bg-white bg-opacity-20 px-3 py-2 text-base rounded-sm font-sans"
          /> <br />
          <button type="submit" className="flex items-center bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 px-3 py-2 mt-2 rounded-sm">
            <span className="mr-2 font-sans text-base">Submit</span>
            <IoMdSend />
          </button>
        </form>
      </div>
      <div className="w-3/5 relative">
        <img src={mathBanner} alt="Banner" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 to-transparent" />
      </div>
    </div>
  );
}
