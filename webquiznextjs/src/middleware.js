import { getIronSession } from 'iron-session';
import { NextResponse } from 'next/server';

/**
 * //blir kjørt mellom hver request, kaster ut brukere som ikke har admin data i session når de prøver å gå til /admin
 * @param {*} request NextResponse, request brukeren gjør
 * @returns sender response tilbake til brukeren
 */
export async function middleware(request) {
    /**
     * url endepunkt som skal sjekkes for fusk
     */
    const needsSession = ["/admin", "/quiz"]
    if (needsSession.some(url => request.nextUrl.pathname.startsWith(url))) {
        //henter session
        const session = await getIronSession(request.cookies, {
            password: process.env.SESSION_PWD,
            cookieName: 'session',
        });
        //ser etter session admin info
        if (!session.admin ) {
            //sjekker om bruker er der de skal
            //ødelegger session og hiver dem ut hvis ikke
            if (request.nextUrl.pathname.startsWith("/admin") && session.userLevel != 10) {
                session.destroy()
                return NextResponse.redirect(new URL('/', request.url));
                
            }

        }
        //ser etter om buker gjør en quiz
        if(!session.currQuizID){
            //sjekker om bruker er der de skal
            //ødelegger session og hiver dem ut hvis ikke
             if (request.nextUrl.pathname.startsWith("/quiz")) {
                session.destroy()
                return NextResponse.redirect(new URL('/', request.url));
            }
        }
        //utvider session siden bruker har tilgang der de gikk til
        const response = NextResponse.next();
        response.cookies.set('session', request.cookies.get('session').value, { maxAge: 60 * 30 });
        return response;
    }
}