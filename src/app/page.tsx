"use client";
import { Redirect } from "next";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
export default function Home() {
  // Inside your component
  const router = useRouter();
  return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* <SidebarTrigger/> */}
        <h1 className="mb-4">this is home page</h1>
        
        <Button onClick={() => router.push('/insight')} variant={"outline"}>Go to Live Demo</Button>
      </div>
  );
}



