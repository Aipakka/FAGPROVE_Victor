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
     * @returns IDen til quiz opprettet
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
    //SQL INSERT legger inn kategoriene til en quiz i databasen
    /**
     * 
     * @param {*} categoryName string, category name 
     * @param {*} parentID  integer, id of parent quiz
     * @returns  IDen til kategori opprettet
     */
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
    //SQL INSERT legger inn spørsmål til en kategori i databasen
    /**
     * 
     * @param {*} question string, question  
     * @param {*} parentID integer, id of parent category
     * @returns  IDen til spørsmål opprettet
     */
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
    //SQL INSERT legger inn alternativer til et spørsmål i databasen
    /**
     * 
     * @param {*} optionText string, option string 
     * @param {*} correctAnswer boolean, boolen value if answer is right or wrong
     * @param {*} parentID integer, id of parent question
     * @returns result of INSERT query
     */
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
    //SQL INSERT, legger inn bruker i databasenog gir tilbake IDen til brukeren som er opprettet
    /**
     * 
     * @param {*} teamName string, lagnavn  
     * @param {*} idQuiz integer, id of quiz team has done
     * check if team exists before inserting team, because InsertAnswer is called in a loop, and it will try inserting multiple times, fail and do rollback
     * early check stops the insert attempt that would create a duplicate
     * @returns  id of team inserted, 
     */
    static async InsertTeam(teamName, idQuiz) {
        try {
            const sql = neon(process.env.DATABASE_URL);
            console.log('it1: ', teamName, idQuiz)
            const checkForTeam = await sql.query(`SELECT "idTeam" FROM "teams" WHERE "name" = $1 AND "quizTakenID" = $2`, [String(team), Number(idQuiz)])
            console.log('it2: ', checkForTeam)
            if (checkForTeam[0].idTeam)
                return checkForTeam[0].idTeam
            await sql.query(`INSERT INTO "teams" ("name", "quizTakenID") values ($1, $2)`, [String(team), Number(idQuiz)]);
            const result = await sql.query(`SELECT "idTeam" FROM "teams" WHERE "name" = $1 AND "quizTakenID" = $2`, [String(team), Number(idQuiz)])
            console.log('it3: ', checkForTeam)
            return result[0].idTeam

        } catch (error) {
            // console.log('SQL error: ', error);
            return 'error'
        }
    }
    //SQL INSERT for svar fra teamNavn til spesifisert, quiz, kategori & spørsmål
    /**
     * 
     * @param {*} team string
     * @param {*} idQuiz integer
     * @param {*} idCategory integer
     * @param {*} idQuestion integer
     * @param {*} idQuestionOption integer
     * @param {*} optionCorrect boolean
     * @returns result of INSERT query
     */
    static async InsertAnswer(team, idQuiz, idCategory, idQuestion, idQuestionOption, optionCorrect) {
        try {
            console.log('ia1: ', team, idQuiz, idCategory, idQuestion, idQuestionOption, optionCorrect)
            const sql = neon(process.env.DATABASE_URL);
            const teamID = await this.InsertTeam(team, idQuiz);
            console.log('ia2: ', teamID)
            const result = await sql.query(`INSERT INTO "answers" ("teamID", "parentQuestionID", "categoryID", "questionID", "questionOptionID", "correctAnswer") values ($1, $2, $3, $4, $5, $6)`, [Number(teamID), Number(idQuiz), Number(idCategory), Number(idQuestion), Number(idQuestionOption), Boolean(optionCorrect)]);
            console.log('ia3: ',result)
            return result
        } catch (error) {
            // console.log('SQL error: ', error);
            return 'error'
        }
    }
}