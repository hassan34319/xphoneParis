import { NextApiRequest } from "next";
import { redirect } from "next/navigation";

export async function GET(request : Request) {
  Response.redirect('/success', 302)
}
export async function POST(request : Request) {
  Response.redirect('/success', 302)
}