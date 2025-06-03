"use server"
import { getIronSession } from 'iron-session';
import bcrypt from "bcrypt"
import SQL from './sql';
import { cookies } from 'next/headers';
//Logger inn bruker
//henter ut passord hash Basert på brukernavn skrevet inn
//dette må bli gjort for at hashen skal bli den samme når hashen blir sjekket
//blir gjort gjennom bcrypt.compare(passord, hash)
//om loginn er valid setter session gjennom iron-session 
export async function VerifyLoginn(username, password) {
    const dbPassword = await SQL.GetUserPassword(username);
    if (!dbPassword[0].passwordHash)
        return 'noUserFound';
    const passwordHash = dbPassword[0].passwordHash;

    if (await bcrypt.compare(password, passwordHash)) {

        const userData = await SQL.GetUserWithUserAndPass(username, passwordHash);
        if (userData === 'error')
            return 'sqlErr'
        try {
            const userCookies = await cookies();
            const session = await getIronSession(userCookies, {
                password: process.env.SESSION_PWD,
                cookieName: 'session',
                cookieOptions: {
                    maxAge: 60 * 30
                }
            });

            //session verdier, session."variabelNavn" blir opprettet av session om det ikke eksisterer
            session.idUser = userData[0].idUsers;
            session.admin = userData[0].admin;
            await session.save();
            return 'loginnSuccess'
        } catch (error) {
            console.log(error)
            return 'sessionErr'
        }
    } else {
        return 'pwdFeil'
    }


}

[
    {
        "quizName": "programering",
        "description": "quiz om programmering",
        "categories": [
            {
                "categoryName": "syntax",
                "questions": [
                    {
                        "question": "Hvordan definerer du en variabel som ikke kan endres?",
                        "answers": [
                            {
                                "text": "const",
                                "correct": true
                            }
                        ]
                    }
                ]
            }
        ]
    }
]

export async function InsertQuizLoop(quizList) {
    try {
        if (!Array.isArray(quizList) && quizList !== undefined && quizList !== null)
            quizList = [quizList];
        await QuizezInList(quizList)
        return 'fileReadToDBsuccess'
    } catch (error) {
        return error
    }


}
async function QuizezInList(quizList) {
    try {
        const userCookies = await cookies();
        const session = await getIronSession(userCookies, {
            password: process.env.SESSION_PWD,
            cookieName: 'session',
            cookieOptions: {
                maxAge: 60 * 30
            }
        });
        await quizList.forEach(async quiz => {
            if (!Array.isArray(quiz.categories) && quiz.categories !== undefined && quiz.categories !== null)
                quiz.categories = [quiz.categories];
            let quizID = await SQL.InsertQuiz(quiz.quizName, quiz.description, session.idUser)
            await CategoriesInQuiz(quiz, quizID);

        });
    } catch (error) {
        return (error)
    }
}
async function CategoriesInQuiz(quiz, quizID) {
    try {

        await quiz.categories.forEach(async category => {
            if (!Array.isArray(category.questions) && category.questions !== undefined && category.questions !== null)
                category.questions = [category.questions];
            let categoryID = await SQL.InsertCategory(category.categoryName, quizID)
            await QuestionsInCategory(category, categoryID);
        });
    } catch (error) {
        return (error)
    }
}
async function QuestionsInCategory(category, categoryID) {
    try {
        await category.questions.forEach(async question => {
            if (!Array.isArray(question.answers) && question.answers !== undefined && question.answers !== null)
                question.answers = [question.answers];
            let questionID = await SQL.InsertQuestion(question.question, categoryID)
            await AnswersToQuestion(question, questionID)
        });
    } catch (error) {
        return (error)
    }

}
async function AnswersToQuestion(question, questionID) {
    try {
        await question.answers.forEach(async answer => {
            await SQL.InsertOption(answer.text, answer.correct, questionID)
        });
    } catch (error) {
        return (error)
    }

}