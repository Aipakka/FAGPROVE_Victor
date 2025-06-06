import ClientIndex from './client';
import bcrypt from "bcrypt"
import SQL from '@/lib/sql';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';


/**
 * henter quizer fra databasen
 * @returns quizer fra databassen
 */
async function GetQuizez() {
  "use server"
  const res = SQL.GetQuizes()
  return res
}


/**
 * setter session verdi for quiz bruker starter
 * @param {*} quizID integer, id for quiz som bruker starter 
 * @returns status på operasjonen, vil alltids være success
 */
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

/**
 * render av siden, dette er funksjonen som blir kalt
 * bruker client.jsx på samme nivå som komponent for å rendere allt bruker ser å bruker
 * @returns render av client content
 */
export default function ServerIndex() {
  return (<ClientIndex StartQuiz={StartQuiz} GetQuizez={GetQuizez} />
  );
}
