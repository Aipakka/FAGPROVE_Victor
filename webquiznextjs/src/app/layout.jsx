"use server"
import Header from '@/components/header';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { VerifyLoginn } from '@/lib/tools'

import "./globals.css";


export default async function RootLayout({ children }) {
  //server side funksjon trengs, istendefor å direkte hente verifyloginn() funksjonen fordi cookies kan bare bli endret i route handlers eller server actions
    async function ServerWrapperLoginn(username, password) {
    "use server"
    const res = await VerifyLoginn(username, password);
    return res
  }
  const userCookies = await cookies();
  const session = await getIronSession(userCookies, {
    password: process.env.SESSION_PWD,
    cookieName: 'session',
    cookieOptions: {
      maxAge: 60 * 30
    }
  })
  let admin = false;
  if (session.admin)
      admin = true;

  return (
    <html lang="en" >
      <body className={`flex w-[100dvw] h-[100dvh]`}>
        <Header admin={admin} VerifyLoginn={ServerWrapperLoginn}/>
        {children}
      </body>
    </html >
  );
}
