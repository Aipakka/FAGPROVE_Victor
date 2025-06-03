"use server"
import Header from '@/components/header';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { VerifyLoginn, InsertQuizLoop } from '@/lib/tools'
import SQL from '@/lib/sql';

import "./globals.css";


export default async function RootLayout({ children }) {
  //server side funksjon trengs, istendefor å direkte hente verifyloginn() funksjonen fordi cookies kan bare bli endret i route handlers eller server actions
  async function ServerWrapperLoginn(username, password) {
    "use server"
    const res = await VerifyLoginn(username, password);
    return res
  }
  async function ServerWrapperInsertQuizLoop(quizlist) {
    "use server"
    const res = await InsertQuizLoop(quizlist);
    return res
  }
  async function ServerWrapperdestroySession() {
    "use server"
    const userCookies = await cookies();
    const session = await getIronSession(userCookies, {
      password: process.env.SESSION_PWD,
      cookieName: 'session',
      cookieOptions: {
        maxAge: 60 * 30
      }
    })
    session.destroy()
  }
 
  const userCookies = await cookies();
  const session = await getIronSession(userCookies, {
    password: process.env.SESSION_PWD,
    cookieName: 'session',
    cookieOptions: {
      maxAge: 60 * 30
    }
  })
  const admName = await SQL.GetUserFromID(session.idUser)
  console.log('admnm: ', admName)
  return (
    <html lang="en" >
      <body className={`flex w-[100dvw] h-[100dvh]`}>
        <Header adminName={admName[0]?.username} admin={session.admin} VerifyLoginn={ServerWrapperLoginn} destroySession={ServerWrapperdestroySession} readFileToDB={ServerWrapperInsertQuizLoop}/>
        {children}
      </body>
    </html >
  );
}
