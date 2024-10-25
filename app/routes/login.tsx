import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";

// import banners
import lightBanner from "../assets/light-city-banner.jpg";
import darkBanner from "../assets/dark-city-banner.jpg";
import swBanner from "../assets/sw-banner.jpg";
import mountainsBanner from "../assets/mountains-banner.jpg";
import mathBanner from "../assets/math-banner.jpg";

// import icons
import { IoMdSend } from "react-icons/io";

// import & configure supabase
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://dlyekcnhxiztyoznvuni.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export const meta: MetaFunction = () => {
  return [
    { title: "Login" },
    { name: "description", content: "Notes-Logger Login" },
  ];
};

export default function App() {
  const [pc, setPc] = useState<any[] | null>(null);
  const [inputPasscode, setInputPasscode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getCountries();
  }, []);

  async function getCountries() {
    const { data } = await supabase.from("passcode").select();
    setPc(data || []);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 

    if (pc && pc.some((item) => item.passcode === inputPasscode)) {
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
