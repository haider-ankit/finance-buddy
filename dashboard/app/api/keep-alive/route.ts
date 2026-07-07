// dashboard/app/api/keep-alive/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // We ping the /merchants endpoint just to trigger the Render server
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
    
    const response = await fetch(`${backendUrl}/merchants`, {
      // Prevent Next.js from aggressively caching this fetch
      cache: 'no-store', 
    });

    if (response.ok) {
      console.log("Render backend successfully pinged and kept awake.");
      return NextResponse.json({ status: "Success", message: "Backend is awake" });
    } else {
      return NextResponse.json({ status: "Warning", message: "Backend responded with an error" }, { status: 500 });
    }
  } catch (error) {
    console.error("Keep-alive ping failed:", error);
    return NextResponse.json({ status: "Error", message: "Could not reach backend" }, { status: 500 });
  }
}