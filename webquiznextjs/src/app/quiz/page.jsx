import DynamicQuizClient from './client';
import { ConstructQuizLoop } from '@/lib/tools';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import SQL from '@/lib/sql';

export default async function DynamicQuizServer({ params }) {
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

    async function ServerFinishQuiz(answers) {
        "use server"
        console.log('ansrs: ', answers)
        for (const answer of answers) {
            console.log('for ansr: ', answer)
            let res = await SQL.InsertAnswer(answer.team, answer.idQuiz, answer.idCategory, answer.idQuestion, answer.idQuestionOption, answer.optionCorrect)
            console.log('sql res, ', res)

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
        const res = await SQL.CheckCompletion(teamname, session.currQuizID);
        if (res === 'noTeam'){
        //session verdier, session."variabelNavn" blir opprettet av session om det ikke eksisterer
        session.teamname = teamname;
        await session.save()
        return 'success'
        } else{
            return('Team har allered svart')
        }

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
    return (<DynamicQuizClient destroySession={ServerWrapperdestroySession} FinishQuiz={ServerFinishQuiz} quizID={session.currQuizID} SetTeamName={SetTeamName} quizData={quizStructure} />)
}