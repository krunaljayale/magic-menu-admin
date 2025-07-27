import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { token, userId } = req.body;

  if (!token || !userId) {
    return res.status(400).json({ error: "Missing data" });
  }

  res.setHeader("Set-Cookie", [
    serialize("jwt_token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }),
    serialize("user_id", userId, {
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    }),
  ]);

  return res.status(200).json({ success: true });
}
