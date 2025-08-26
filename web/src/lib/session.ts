import { getIronSession, IronSessionData } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData extends IronSessionData {
  merchant_id?: number;
  user_id?: number;
  email?: string;
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "mioro-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession() {
  return await getIronSession<SessionData>(cookies(), sessionOptions);
}
