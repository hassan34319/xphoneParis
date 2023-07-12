import { NextApiRequest, NextApiResponse } from "next";
import { redirect } from "next/navigation";

import { NextResponse } from 'next/server';

export async function GET(request : NextApiRequest) {
  redirect('/error')
}
