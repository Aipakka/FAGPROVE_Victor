import ClientIndex from './client';
import bcrypt from "bcrypt"
import SQL from '@/lib/sql';
async function GetQuizez() {
  "use server"
  return('QUIZER')
}
export default function Home() {

  return (<ClientIndex GetQuizez={GetQuizez} />
  );
}
