import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    // Perform any necessary processing or validation here
    // Set cache-control headers to prevent caching
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    // Redirect to the failure URL
    res.writeHead(302, {
        Location: "https://xphones.fr/failure",
      });;
    // Redirect to the failure URL
  } else {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.writeHead(302, {
        Location: "https://xphones.fr/failure",
      });;
  }
};

export default handler;
