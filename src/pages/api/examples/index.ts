import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const users = [
    { id: 1, name: "al" },
    { id: 2, name: "ce" },
    { id: 3, name: "mi" },
  ];

  return res.json(users);
};
