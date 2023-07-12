import { NextApiRequest } from "next";
import { redirect } from "next/navigation";

export async function GET(request : NextApiRequest) {
  redirect('/failure')
}
export async function POST(request : NextApiRequest) {
  redirect('/failure')
}