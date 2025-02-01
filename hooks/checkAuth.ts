"use server"
import { cookies } from "next/headers"
export default async function getAccessToken(){
    const cookiesStore = await cookies();

    if(cookiesStore.has("github_access_token")){
        return {
            success: true,
        }
    } else {
        return {
            success: false,
        }
    }
}