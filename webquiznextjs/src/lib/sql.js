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
            const result = await sql.query(`SELECT "idQuiz", "quizName", "description" FROM "quiz"`);
            return result
        } catch (error) {
            console.log('SQL error: ', error);
            return 'error'
        }
    }
    //SQL SELECT quiz categories
    /**
     * 
     * @param {*} parentID integer - id of parent quiz in DB
     * @returns result from categories SQL table from parameters
     */
    static async GetCategories(parentID) {
        try {
            const sql = neon(process.env.DATABASE_URL);
            const result = await sql.query(`SELECT "categoryName", "idCategories" FROM "categories" WHERE "parentQuizID" = $1 ORDER BY RANDOM()`, [Number(parentID)]);
            return result
        } catch (error) {
            // console.log('SQL error: ', error);
            return 'error'
        }
    }
    //SQL SELECT category questions
    /**
     * 
     * @param {*} parentID integer - id of parent category in DB
     * @returns result from questions SQL table from parameters
     */
    static async GetQuestions(parentID) {
        try {
            const sql = neon(process.env.DATABASE_URL);
            const result = await sql.query(`SELECT "question", "idQuestion" FROM "questions" WHERE "parentCategoryID" = $1 ORDER BY RANDOM()`, [Number(parentID)]);
            return result
        } catch (error) {
            // console.log('SQL error: ', error);
            return 'error'
        }
    }
    //SQL SELECT question options
    /**
     * 
     * @param {*} parentID integer - id of parent question in DB
     * @returns result from questionOptions SQL table from parameters
     */
    static async GetOptions(parentID) {
        try {
            const sql = neon(process.env.DATABASE_URL);
            const result = await sql.query(`SELECT "optionText", "idQuestionOption", "correctAnswer" FROM "questionOptions" WHERE "parentQuestionID" = $1 ORDER BY RANDOM()`, [Number(parentID)]);
            return result
        } catch (error) {
            // console.log('SQL error: ', error);
            return 'error'
        }
    }
    //SQL INSERT for en en quiz
    /**
     * 
     * @param {*} quizName string, quiz name
     * @param {*} description string, quiz description
     * @param {*} idUser integer, id of user importing quiz
     * @returns 
     */
    static async InsertQuiz(quizName, description, idUser) {
        try {
            console.log('InsertQuiz: ', quizName, description, idUser)
            const sql = neon(process.env.DATABASE_URL);
            await sql.query(`INSERT INTO "quiz" ("quizName", "description", "createdByUser") values ($1, $2, $3)`, [String(quizName), String(description), Number(idUser)]);
            const result = await sql.query(`SELECT "idQuiz" FROM "quiz" WHERE "quizName" = $1 AND "description" = $2`, [String(quizName), String(description)])
            return result[0].idQuiz
        } catch (error) {
            // console.log('SQL error: ', error);
            return 'error'
        }
    }
    //SQL INSERT for kategorier
    static async InsertCategory(categoryName, parentID) {
        try {
            const sql = neon(process.env.DATABASE_URL);
            await sql.query(`INSERT INTO "categories" ( "categoryName", "parentQuizID") values ($1, $2)`, [String(categoryName), Number(parentID)]);
            const result = await sql.query(`SELECT "idCategories" FROM "categories" WHERE "categoryName" = $1 AND "parentQuizID" = $2`, [String(categoryName), Number(parentID)])
            return result[0].idCategories
        } catch (error) {
            // console.log('SQL error: ', error);
            return 'error'
        }
    }
    //SQL INSERT for spørsmål
    static async InsertQuestion(question, parentID) {
        try {
            const sql = neon(process.env.DATABASE_URL);
            await sql.query(`INSERT INTO "questions" ("question", "parentCategoryID") values ($1, $2)`, [String(question), Number(parentID)]);
            const result = await sql.query(`SELECT "idQuestion" FROM "questions" WHERE "question" = $1 AND "parentCategoryID" = $2`, [String(question), Number(parentID)])
            return result[0].idQuestion
        } catch (error) {
            // console.log('SQL error: ', error);
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
            // console.log('SQL error: ', error);
            return 'error'
        }
    }
}