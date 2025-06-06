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
/**
 * 
 * @param {*} quizid id for the quiz to be constructed 
 * @returns categories and all children needed to render quiz for user
 */
export async function ConstructQuizLoop(quizid) {
    let quizStructure = [];
    let categories = await SQL.GetCategories(quizid)
    try {
        if (!Array.isArray(categories) && categories !== undefined && categories !== null)
            categories = [categories];
        for (const category of categories) {

            quizStructure.push({ category: category.categoryName, id: category.idCategories, questions: await ConstructCategoryQuestion(category) })
        }
        return quizStructure
    } catch (error) {
        return error
    }
}
/**
 * 
 * @param {*} category category to gather questions from
 * @returns questions to the related category
 */
async function ConstructCategoryQuestion(category) {
    let categoryStructure = [];
    let questions = await SQL.GetQuestions(category.idCategories);
    if (!Array.isArray(questions) && questions !== undefined && questions !== null)
        questions = [questions];
    for (const question of questions) {
        categoryStructure.push({ question: question.question, id: question.idQuestion, options: await ContrustQuestionOptions(question) })
    }
    return categoryStructure;
}
/**
 * 
 * @param {*} question question to gather the options to
 * @returns  options to the related question
 */
async function ContrustQuestionOptions(question) {
    let questionStructure = [];
    let options = await SQL.GetOptions(question.idQuestion)
    if (!Array.isArray(options) && options !== undefined && options !== null)
        options = [options];
    for (const option of options) {
        questionStructure.push({ text: option.optionText, id: option.idQuestionOption, correct: option.correctAnswer });
    }
    return questionStructure;
}


export async function InsertQuizLoop(quizList) {
    try {
        if (!Array.isArray(quizList) && quizList !== undefined && quizList !== null)
            quizList = [quizList];
        const res = await QuizezInList(quizList)
        console.log('ressss, ', res)

        if (res?.error) {
            return res
        } else
            return 'fileReadToDBsuccess'
    } catch (error) {
        return error
    }


}
//legger til alle quizer fra fil i databasen
async function QuizezInList(quizList) {
    try {
        let errorStuff = [];
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
            if (quizID?.error) {
                console.log('quizid: ', quizID)
                errorStuff.push(quizID.error);
                console.log('errstuffloop: ', errorStuff)
            }
            await CategoriesInQuiz(quiz, quizID);

        });
        console.log('errstuff: ', errorStuff)

        if (errorStuff?.error) {
            console.log('errstuff: ', errorStuff)
            return errorStuff

        }
    } catch (error) {
        console.log('funk errrrr: ', error)
        return (error)
    }
}
//legger inn alle kategorier til en quiz i databasen
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
//legger inn alle spørsmål til en kategori i databasen
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

//legger inn all svar til et spørsmål i databasen
async function AnswersToQuestion(question, questionID) {
    try {
        await question.answers.forEach(async answer => {
            await SQL.InsertOption(answer.text, answer.correct, questionID)
        });
    } catch (error) {
        return (error)
    }

}