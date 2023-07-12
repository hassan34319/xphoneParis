import { NextApiRequest } from "next";
import { redirect } from "next/navigation";

export async function GET(request : Request) {
  return Response.redirect('https://test-xphones.vercel.app/failure', 302)
}
export async function POST(request : Request) {
  return Response.redirect('https://test-xphones.vercel.app/failure', 302)
}