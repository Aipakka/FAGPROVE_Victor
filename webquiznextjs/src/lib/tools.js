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
    }else{
        return 'pwdFeil'
    }


}