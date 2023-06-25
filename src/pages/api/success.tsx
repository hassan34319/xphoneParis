import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    // Perform any necessary processing or validation here

    // Redirect to the failure URL
    res.redirect(307, "https://xphones.fr/success");
  } else {
    res.redirect(307, "https://xphones.fr/success");
  }
};

export default handler;