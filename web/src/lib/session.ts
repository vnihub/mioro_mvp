import { getIronSession, IronSessionData } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData extends IronSessionData {
  merchant_id?: number;
  user_id?: number;
  email?: string;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "mioro-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function getSession() {
  return getIronSession<SessionData>(cookies(), sessionOptions);
}
