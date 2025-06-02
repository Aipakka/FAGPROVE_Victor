import { getIronSession } from 'iron-session';
import bcrypt from "bcrypt"


//Logger inn bruker
//henter ut passord hash Basert på brukernavn skrevet inn
//dette må bli gjort for at hashen skal bli den samme når hashen blir sjekket
//blir gjort gjennom bcrypt.compare(passord, hash)
//om loginn er valid setter session gjennom iron-session 
export async function VerifyLoginn(username, password) {
    const dbPassword = await SQL.GetUserPassword(username);
    if (!dbPassword[0].Password)
        return 'noUserFound';
    const passwordHash = dbPassword[0].Password;
    
    if (await bcrypt.compare(password, passwordHash)) {

        const simpleUserData = await SQL.GetUserWithUserAndPass(username, passwordHash);
        if (simpleUserData === 'error')
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

            //session verdier, session."name" bliur opprettet av session om det ikke eksisterer
            session.idUser = simpleUserData[0].idUsers;
            session.admin = simpleUserData[0].admin;
            return 'loginnSuccess'
        } catch (error) {
            console.log(error)
            return 'sessionErr'
        }
    }


}