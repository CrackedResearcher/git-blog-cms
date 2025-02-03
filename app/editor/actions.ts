"use server"

import { cookies } from "next/headers"

export async function publishBlog(){
    const cookieStore = await cookies();

    const res = await fetch(`https://api.github.com/repos/`)
}