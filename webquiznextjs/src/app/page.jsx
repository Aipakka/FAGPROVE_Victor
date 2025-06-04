import ClientIndex from './client';
import bcrypt from "bcrypt"
import SQL from '@/lib/sql';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

async function GetQuizez() {
  "use server"
  const res = SQL.GetQuizes()
  return res
}

async function StartQuiz(quizID) {
  "use server"
  const userCookies = await cookies();
  const session = await getIronSession(userCookies, {
    password: process.env.SESSION_PWD,
    cookieName: 'session',
    cookieOptions: {
      maxAge: 60 * 30
    }
  });

  //session verdier, session."variabelNavn" blir opprettet av session om det ikke eksisterer
  session.currQuizID = quizID;
  await session.save()
  return 'success'

}
export default function ServerIndex() {
  return (<ClientIndex StartQuiz={StartQuiz} GetQuizez={GetQuizez} />
  );
}
