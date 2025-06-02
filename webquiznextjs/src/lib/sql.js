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
    //opprette brukere i DB, vil ikke være en del av nettsiden funksjonalitet med mindre den utvides til brukere med loginn
    static async LagBruker(userName, passwordHash, admin) {

        try {
            const sql = neon(process.env.DATABASE_URL);
            await sql.query(`INSERT INTO "users" ("username", "passwordHash", "admin") values ($1, $2, $3)`, [userName, passwordHash, admin]);
            const result = await sql.query(`SELECT * FROM "users" WHERE "username" = $1`, [userName])
            return result
        } catch (error) {
            console.log('SQL error: ', error);
            return 'error'
        }
    }
}