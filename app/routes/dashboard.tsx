// existing imports
import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

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

export default function App() {
  return (
    <div className="font-sans">
      hello
    </div>
  );
}
