import { NextApiRequest } from "next";
import { redirect } from "next/navigation";

export async function GET(request : NextApiRequest) {
  redirect('/success')
}
export async function POST(request : NextApiRequest) {
  redirect('/success')
}