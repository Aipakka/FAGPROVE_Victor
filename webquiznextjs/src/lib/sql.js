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
            const result = await sql.query(`SELECT "passwordHash" FROM "users" WHERE "username" = $1 `, [username]);
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
    //SQL SELECT henter alle quizer
    static async InsertQuizez() {
        try {
            const sql = neon(process.env.DATABASE_URL);
            const result = await sql.query(`INSERT INTO "quiz" ("idQuiz", "quizName", "description") values ($1, "`);
            return result
        } catch (error) {
            console.log('SQL error: ', error);
            return 'error'
        }
    }
}