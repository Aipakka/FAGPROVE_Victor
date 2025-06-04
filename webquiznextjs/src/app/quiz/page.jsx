import DynamicQuizClient from './client';
import { ConstructQuizLoop } from '@/lib/tools';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

export default async function DynamicQuizServer({ params }) {
    const userCookies = await cookies();
    const session = await getIronSession(userCookies, {
        password: process.env.SESSION_PWD,
        cookieName: 'session',
        cookieOptions: {
            maxAge: 60 * 30
        }
    });
    console.log('sess ',  session)
    console.log('sess log',  session.currQuizID)
    if (session.quizid) {
        const quizStructure = await ConstructQuizLoop( session.currQuizID)
    }
    return (<DynamicQuizClient />)
}