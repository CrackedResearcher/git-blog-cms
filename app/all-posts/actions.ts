"use server"

import { cookies } from "next/headers"

interface BlogPost {
    title: string;
    description: string;
    link: string;
    uid: string;
  }


  const fetchGithubFile = async (url: string, accessToken: string) => {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
  
    return response.json();
  };
  
  const parseGithubContent = (content: string) => {

    const decodedContent = Buffer.from(content, "base64").toString();
  
    const jsonString = decodedContent
      .replace(/export const BLOG_DATA =/, "")
      .trim()
      .replace(/;$/, "");
  
    const validJsonString = jsonString
      .replace(/(\w+):/g, '"$1":')
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]");
  
    return JSON.parse(validJsonString);
  };


export const deleteBlogFromData = async (blogUid: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore?.get("github_access_token");
  const username = cookieStore?.get("gitusername")?.value;
  const repo = cookieStore?.get("gitrepo")?.value;

  if(!accessToken || !username || !repo){
      return {
          success: false,
          error: 'Missing required credentials',
          redirect: '/register'
      };
  }

  try {
    const dataPath = 'app/blog-data.ts';
    const dataUrl = `https://api.github.com/repos/${username}/${repo}/contents/${dataPath}`;

    const dataResponse = await fetch(dataUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (!dataResponse.ok) {
      return {
        success: false,
        error: 'Failed to fetch blog-data.ts'
      };
    }

    const data = await dataResponse.json();
    const blogs = parseGithubContent(data.content); 

    const updatedBlogs = blogs.filter((blog: any) => blog.uid !== blogUid);
    const updatedContent = `export const BLOG_DATA = ${JSON.stringify(updatedBlogs, null, 2)};`;


    const updateResponse = await fetch(dataUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        message: `Remove blog post with UID: ${blogUid}`,
        content: Buffer.from(updatedContent).toString('base64'),
        sha: data.sha,
        branch: 'main'
      })
    });

    if (!updateResponse.ok) {
      return {
        success: false,
        error: 'Failed to update blog-data.ts'
      };
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return {
      success: false,
      error: 'Failed to delete blog post'
    };
  }
};


  
  export const listAllBlogPosts = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore?.get("github_access_token");
    const username = cookieStore?.get("gitusername")?.value;
    const repo = cookieStore?.get("gitrepo")?.value;
  
    if (!accessToken || !username || !repo) {
      return {
        success: false,
        error: "Missing required credentials",
        redirect: "/register",
      };
    }
  
    try {
      const dataPath = "app/blog-data.ts";
      const dataUrl = `https://api.github.com/repos/${username}/${repo}/contents/${dataPath}`;
  
      const data = await fetchGithubFile(dataUrl, accessToken.value);

      const blogs = parseGithubContent(data.content);
  
      return {
        success: true,
        data: blogs as BlogPost[],
      };
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch blog posts",
      };
    }
  };