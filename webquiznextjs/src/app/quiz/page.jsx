import DynamicQuizClient from './client';
import { ConstructQuizLoop } from '@/lib/tools';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import SQL from '@/lib/sql';

/**
 * render av siden, dette er funksjonen som blir kalt
 * bruker client.jsx på samme nivå som komponent for å rendere allt bruker ser å bruker
 * @returns render av client content
 */
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
        for (const answer of answers) {
            let res = await SQL.InsertAnswer(answer.team, answer.idQuiz, answer.idCategory, answer.idQuestion, answer.idQuestionOption, answer.optionCorrect)
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