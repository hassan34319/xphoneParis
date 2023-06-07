import type { NextApiRequest, NextApiResponse } from "next";
const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const params = {
        submit_type: "pay",
        mode: "payment",
        payment_method_types: ["card"],
        phone_number_collection: {
          enabled: true,
        },
        billing_address_collection: "auto",
        shipping_address_collection: {
          allowed_countries: ["FR"],
        },
        shipping_options: [
          { shipping_rate: "shr_1LetyqB2CLyY86wQX1Ucz9mO" },
          { shipping_rate: "shr_1LetyFB2CLyY86wQvqiVBbdw" },
        ],
        line_items: req.body.map((item: any) => {
          return {
            price_data: {
              currency: "eur",
              product_data: {
                name: item.name,
                images: [item.image],
                metadata: {
                  Nom: item.name,
                  marque: item.brand,
                  categorie: item.category,
                  couleur: item.color,
                  grade: item.grade,
                  capacite: item.capacity,
                  prix: item.price,
                },
              },
              unit_amount: item.price * 100,
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: item.quantity,
          };
        }),

        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/`,
      };

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);

      res.status(200).json(session);
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
