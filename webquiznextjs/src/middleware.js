import { getIronSession } from 'iron-session';
import { NextResponse } from 'next/server';

//blir kjørt mellom hver request, kaster ut brukere som ikke har admin data i session når de prøver å gå til /admin
export async function middleware(request) {
    const needsSession = ["/admin", "/quiz"]
    if (needsSession.some(url => request.nextUrl.pathname.startsWith(url))) {
        const session = await getIronSession(request.cookies, {
            password: process.env.SESSION_PWD,
            cookieName: 'session',
        });
        // console.log('MW:',session)
        if (!session.admin ) {
            if (request.nextUrl.pathname.startsWith("/admin") && session.userLevel != 10) {
                session.destroy()
                return NextResponse.redirect(new URL('/', request.url));
            }

        }
        if(!session.currQuizID){
             if (request.nextUrl.pathname.startsWith("/quiz")) {
                session.destroy()
                return NextResponse.redirect(new URL('/', request.url));
            }
        }
        //utvider session
        const response = NextResponse.next();
        response.cookies.set('session', request.cookies.get('session').value, { maxAge: 60 * 30 });
        return response;
    }
}