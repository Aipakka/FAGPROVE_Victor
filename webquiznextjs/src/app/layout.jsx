"use server"
import Header from '@/components/header';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import "./globals.css";


export default async function RootLayout({ children }) {
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
        <Header admin={admin}/>
        {children}
      </body>
    </html >
  );
}
