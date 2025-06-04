import DynamicQuizClient from './client';
import { ConstructQuizLoop } from '@/lib/tools';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

export default async function DynamicQuizServer({ params }) {
    async function SetTeamName(teamname) {
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
        session.teamname = teamname;
        await session.save()
        return 'success'
    }

    const userCookies = await cookies();
    const session = await getIronSession(userCookies, {
        password: process.env.SESSION_PWD,
        cookieName: 'session',
        cookieOptions: {
            maxAge: 60 * 30
        }
    });
    console.log('sess: ',session)
    if (session.currQuizID) {
        const quizStructure = await ConstructQuizLoop(session.currQuizID)
        console.log('qs: ', quizStructure)

    }
    return (<DynamicQuizClient SetTeamName={SetTeamName} />)
}