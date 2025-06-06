"use server"
import Header from '@/components/header';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { VerifyLoginn, InsertQuizLoop } from '@/lib/tools'
import SQL from '@/lib/sql';

import "./globals.css";

/**
 * alle routinger som blir gjort på websiden blir lagt inni HTML som ligger i denne layout filen
 * Blir brukt for å rendere data som gjerne skal alltid kunne bloi brukt på siden
 * f. eks Header, Footer 
 * @param {*} param0 
 * @returns render to client
 */
export default async function RootLayout({ children }) {
  //server side funksjon trengs, istendefor å direkte hente verifyloginn() funksjonen fordi cookies kan bare bli endret i route handlers eller server actions
  /**
   * 
   * @param {*} username string, brukernavn sendt fra client
   * @param {*} password string, passord sendt fra client
   * @returns 
   */
  async function ServerWrapperLoginn(username, password) {
    "use server"
    const res = await VerifyLoginn(username, password);
    return res
  }
  /**
   * 
   * @param {*} quizlist JSON, data lest inn fra JSON fil admin laster opp fra client
   * @returns success status 
   */
  async function ServerWrapperInsertQuizLoop(quizlist) {
    "use server"
    const res = await InsertQuizLoop(quizlist);
    console.log('qrtd: ', res)
    return res
  }
  /**
   * Ødelegger session når kall fra klient om å logge ut eller stoppe quiz blir sendt
   */
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

  //henter admin navn fra session til å vises i header
  const userCookies = await cookies();
  const session = await getIronSession(userCookies, {
    password: process.env.SESSION_PWD,
    cookieName: 'session',
    cookieOptions: {
      maxAge: 60 * 30
    }
  })
  const admName = await SQL.GetUserFromID(session.idUser)

  return (
    <html lang="en" >
      <body className='' style={{ marginTop: '72px' }}>
        {/* Komponent for header, som skal være tilgjengelig på alle sider med variert funksjonalitet. */}
        <Header adminName={admName[0]?.username} admin={session.admin} inQuiz={session.currQuizID ? true : false} VerifyLoginn={ServerWrapperLoginn} destroySession={ServerWrapperdestroySession} readFileToDB={ServerWrapperInsertQuizLoop} />
        <main className={`flex flex-col  items-center `}>
          {children}
        </main>
      </body>
    </html >
  );
}
