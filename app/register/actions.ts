"use server"
import { cookies } from "next/headers"

export async function saveDetails({gitrepo, gitusername}: { gitrepo: string, gitusername: string}){
    const cookieStore = await cookies();
    cookieStore.set('gitrepo', gitrepo, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      cookieStore.set('gitusername', gitusername, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });   

    return {
        success: true
    }
}