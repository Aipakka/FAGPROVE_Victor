import AdminClient from './client';
import SQL from '@/lib/sql';
async function GetQuizez() {
    "use server"
    const res = SQL.GetQuizes()
    return res
}
export default function AdminServer() {
    return (<AdminClient getQuizez={GetQuizez}/>)
}