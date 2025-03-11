import { NextApiRequest } from "next";
import { redirect } from "next/navigation";

export async function GET(request : Request) {
  return Response.redirect('https://xphones.fr/success', 302)
}
export async function POST(request : Request) {
  return Response.redirect('https://xphones.fr/success', 302)
}