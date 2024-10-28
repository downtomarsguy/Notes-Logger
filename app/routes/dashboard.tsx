// general imports
import "../styles.css";

// import icons
import { FaPlus, FaSearch, FaExclamation } from "react-icons/fa";
import { RiFileUploadFill, RiFile2Fill } from "react-icons/ri";
import { FaLink } from "react-icons/fa6";
import { IoMdRemoveCircle } from 'react-icons/io';
import { FaCircleExclamation } from "react-icons/fa6";

// supabase configuration
import { useNavigate, useLoaderData } from "@remix-run/react";
import { createServerClient } from '@supabase/auth-helpers-remix';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from "@remix-run/node";
import { useState } from 'react';

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
    { name: "description", content: "Notes Logger Dashboard" },
  ];
};

interface Title {
  title: string;
}

export default function App() {
  const navigate = useNavigate();
  const { data, supabaseUrl, supabaseKey } = useLoaderData<{ data: Title[], supabaseUrl: string, supabaseKey: string }>();
  const [fileName, setFileName] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileError(false);

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContent(content);
      };
      reader.readAsText(file);
    }
  };

  function formatFileName(fileName: String) {  
    if (fileName.length <= 10 + 4) {
      return fileName;
    }
  
    const start = fileName.slice(0, 10); 
    const end = fileName.slice(-4);
  
    return `${start}..${end}`;
  }

  const handleUpload = async () => {
    if (!title) {
      setTitleError(true);
    } else {
      setTitleError(false);
    }

    if (!fileName) {
      setFileError(true);
    } else {
      setFileError(false);
    }

    if (title && fileName && fileContent) {
      console.log("Uploading file with title:", title);
      console.log("File contents:", fileContent);
      const supabaseClient = createServerClient(
        supabaseUrl,
        supabaseKey,
        { request: new Request(''), response: new Response() }
      );

      const { error } = await supabaseClient
        .from('files')
        .insert([{ title, fileContent }]);

      if (error) {
        console.error('Error inserting file:', error);
      }
    }
  };

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
              <div className="relative w-full">
                <input
                  type="text"
                  name="title"
                  placeholder="Add Title.."
                  className={`bg-white bg-opacity-20 px-3 py-2 w-full text-sm font-bold rounded-[3px] font-sans ${titleError ? 'border-rose-500 border' : ''}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {titleError && <FaCircleExclamation className="absolute right-2 top-1/2 transform -translate-y-1/2 text-rose-500" />}
              </div>
            </div>
            <div className="flex flex-row items-center gap-4">
              <span className="w-1/3 text-right font-semibold text-base">Import File</span>
              <div className="relative w-full">
                <button
                  onClick={() => {
                    const fileInput = document.getElementById('file-input') as HTMLInputElement | null;
                    if (fileInput) {
                      fileInput.click();
                    }
                  }} 
                  className="flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 hover:text-slate-200 active:bg-sky-600 active:text-slate-300 px-3 py-2 rounded-[3px] w-full"
                >
                  <span className="mr-2 font-sans text-sm font-bold">Attach</span>
                  <FaLink />
                </button>
                <input
                  id="file-input"
                  type="file"
                  accept=".md"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {fileError && <FaCircleExclamation className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white" />}
              </div>
            </div>
            {fileName && 
              <div className="flex justify-end">
                <div 
                  className={`w-32 h-40 rounded-[5px] flex flex-col justify-between items-center ${isHovered ? 'bg-rose-500 bg-opacity-40' : 'bg-white bg-opacity-20'}`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={() => { setFileName(""); setIsHovered(false) }}
                >
                  <div className="flex-grow flex items-center justify-center">
                    {isHovered ? <IoMdRemoveCircle size={60} color="rgb(244, 63, 94)" /> : <RiFile2Fill size={60} />}
                  </div>
                  <div className={`flex justify-center items-end w-full rounded-b-[5px] ${isHovered ? 'bg-rose-500 bg-opacity-40' : 'bg-white bg-opacity-20'}`}>
                    <span className="text-xs py-2">{ formatFileName(fileName) }</span>
                  </div>
                </div>
              </div>
            }
            <button onClick={handleUpload} className="flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 hover:text-slate-200 active:bg-emerald-700 active:text-slate-300 px-3 py-2 rounded-[3px]">
              <span className="mr-2 font-sans text-sm font-bold">Upload File</span>
              <RiFileUploadFill />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
