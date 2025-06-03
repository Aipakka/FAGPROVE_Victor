import { neon } from "@neondatabase/serverless";
export default class SQL {
    //Copy paste for ny sqlquery
    static async sqlquery() {
        try {
            const sql = neon(process.env.DATABASE_URL);
            const result = await sql.query(``);
            return result
        } catch (error) {
            console.log('SQL error: ', error);
            return 'error'
        }
    }
    //SQL for å opprette brukere i DB, vil ikke være en del av nettsiden funksjonalitet med mindre den utvides til brukere med loginn
    static async LagBruker(username, passwordHash, admin) {

        try {
            const sql = neon(process.env.DATABASE_URL);
            await sql.query(`INSERT INTO "users" ("username", "passwordHash", "admin") values ($1, $2, $3)`, [username, passwordHash, admin]);
            const result = await sql.query(`SELECT * FROM "users" WHERE "username" = $1`, [username])
            return result
        } catch (error) {
            console.log('SQL error: ', error);
            return 'error'
        }
    }
    //SQL SELECT for å hente bruker fra databasen
    static async GetUserWithUserAndPass(username, passwordHash) {
        try {
            const sql = neon(process.env.DATABASE_URL);
            const result = await sql.query(`SELECT "idUsers", "admin" FROM "users" WHERE "username" = $1 and "passwordHash" = $2`, [username, passwordHash]);
            return result
        } catch (error) {
            console.log('SQL error: ', error);
            return 'error'
        }
    }
    //SQL SELECT for å hente brukers passord fra databasen, for å verifisere loginn
    static async GetUserPassword(username) {
        try {
            const sql = neon(process.env.DATABASE_URL);
            const result = await sql.query(`SELECT "passwordHash" FROM "users" WHERE "username" = $1`, [username]);
            // const result = await sql.query(`SELECT "passwordHash" FROM "users" `);
            return result
        } catch (error) {
            console.log('SQL error: ', error);
            return 'error'
        }
    }
    //SQL SELECT for å hente brukers navn fra databasen, basert på id
    static async GetUserFromID(idUser) {
        try {
            const sql = neon(process.env.DATABASE_URL);
            const result = await sql.query(`SELECT "username" FROM "users" WHERE "idUsers" = $1`, [idUser]);
            // const result = await sql.query(`SELECT "passwordHash" FROM "users" `);
            return result
        } catch (error) {
            console.log('SQL error: ', error);
            return 'error'
        }
    }

    //SQL SELECT henter alle quizer
    static async GetQuizes() {
        try {
            const sql = neon(process.env.DATABASE_URL);
            const result = await sql.query(`SELECT ("idQuiz", "quizName", "description") FROM "quiz"`);
            return result
        } catch (error) {
            console.log('SQL error: ', error);
            return 'error'
        }
    }
    //SQL INSERT for en en quiz
    static async InsertQuiz(quizName, description) {
        try {
            const sql = neon(process.env.DATABASE_URL);
            await sql.query(`INSERT INTO "quiz" ("quizName", "description") values ($1, $2)"`, [String(quizName), String(description)]);
            const result = await sql.query(`SELECT "idQuiz" FROM "questions WHERE "quizName" = $1 AND "description" = $2`, [String(quizName), String(description)])
            console.log('IQu res: ', result)
            return result.idQuiz
        } catch (error) {
            console.log('InsertQuiz: ', quizName, description)
            console.log('SQL error: ', error);
            return 'error'
        }
    }
    //SQL INSERT for kategorier
    static async InsertCategory(categoryName, parentID) {
        try {
            const sql = neon(process.env.DATABASE_URL);
            await sql.query(`INSERT INTO "categories" ( "categoryName", "parentQuizID") values ($1, $2)`, [String(categoryName), Number(parentID)]);
            const result = await sql.query(`SELECT "idCategories" FROM "questions WHERE "categoryName" = $1 AND "parentQuizID" = $2`, [String(categoryName), Number(parentID)])
            console.log('IC res: ', result)
            return result.idCategories
        } catch (error) {
            console.info('InsertCategory: ', categoryName, parentID)
            console.log('SQL error: ', error);
            return 'error'
        }
    }
    //SQL INSERT for spørsmål
    static async InsertQuestion(question, parentID) {
        try {
            const sql = neon(process.env.DATABASE_URL);
            await sql.query(`INSERT INTO "questions" ("question", "parentCategoryID") values ($1, $2)`, [String(question), Number(parentID)]);
            const result = await sql.query(`SELECT "idQuestion" FROM "questions WHERE "question" = $1 AND "parentCategoryID" = $2`, [String(question), Number(parentID)])
            console.log('IQ res: ', result)
            return result.idQuestion
        } catch (error) {
            console.info('InsertQuestion: ', question, parentID)
            console.log('SQL error: ', error);
            return 'error'
        }
    }
    //SQL INSERT for alternativer
    static async InsertOption(optionText, correctAnswer, parentID) {
        try {
            const sql = neon(process.env.DATABASE_URL);
            const result = await sql.query(`INSERT INTO "questionOptions" ("optionText", "parentQuestionID", "correctAnswer") values ($1, $2, $3)`, [String(optionText), Number(parentID), Boolean(correctAnswer)]);
            return result
        } catch (error) {
            console.log('InsertOption: ', optionText, correctAnswer, parentID)
            console.log('SQL error: ', error);
            return 'error'
        }
    }
}