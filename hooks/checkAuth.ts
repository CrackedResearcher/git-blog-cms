"use server"
import { cookies } from "next/headers"
export default async function getAccessToken(){
    const cookiesStore = await cookies();

    if(cookiesStore.has("github_access_token") && cookiesStore.has("gitusername") && cookiesStore.has("gitrepo")){
        return {
            success: true,
        }
    } else {
        return {
            success: false,
        }
    }
}