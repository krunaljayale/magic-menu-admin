// src/pages/api/logout.ts
import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const expiredJWT = serialize("jwt_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });

  const expiredUserId = serialize("user_id", "", {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });

  res.setHeader("Set-Cookie", [expiredJWT, expiredUserId]);
  return res.status(200).json({ message: "Logged out successfully" });
}
