import DynamicQuizClient from './client';
import { ConstructQuizLoop } from '@/lib/tools';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import SQL from '@/lib/sql';

export default async function DynamicQuizServer({ params }) {
    async function ServerFinishQuiz(answers){
        "use server"
    for (const answer of answers){
            await SQL.InsertAnswer(answer.team, answer.idQuiz, answer.idCategory, answer.idQuestion, answer.idQuestionOption, answer.optionCorrect ) 
            
        };
    }
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
    let quizStructure = []
    if (session.currQuizID) {
        quizStructure = await ConstructQuizLoop(session.currQuizID)
        if (!Array.isArray(quizStructure) && quizStructure !== undefined && quizStructure !== null)
            quizStructure = [quizStructure];
    }
    return (<DynamicQuizClient FinishQuiz={ServerFinishQuiz} quizID={session.currQuizID} SetTeamName={SetTeamName} quizData={quizStructure} />)
}