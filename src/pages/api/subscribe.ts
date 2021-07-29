import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { query as q } from "faunadb";

import { stripe } from "../../services/stripe";
import { fauna } from "../../services/fauna";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.setHeader("Allow", "POST").status(405).end("Method Not Allowed");
  }

  const session = await getSession({ req });

  const user = await fauna.query<User>(
    q.Get(
      q.Match(
        q.Index("user_by_email"), q.Casefold(session.user.email)
      )
    )
  );

  let customerIdCreated = user.data.stripe_customer_id;

  if (!customerIdCreated) {
    const stripeCustomer = await stripe.customers.create({
      email: session.user.email,
      // metadata
    });

    await fauna.query(
      q.Update(q.Ref(
        q.Collection("users"), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
      })
    );

    customerIdCreated = stripeCustomer.id;
  }

  const stripeCheckoutSession = await stripe.checkout.sessions.create({
    customer: customerIdCreated,
    payment_method_types: ["card"],
    billing_address_collection: "required",
    line_items: [{ price: "price_1JGaACFP1FKESbtlLc3Htkrp", quantity: 1 }],
    mode: "subscription",
    allow_promotion_codes: true,
    success_url: process.env.STRIPE_SUCCESS_URL,
    cancel_url: process.env.STRIPE_CANCEL_URL,
  });

  return res.status(200).json({ sessionId: stripeCheckoutSession.id });
};
