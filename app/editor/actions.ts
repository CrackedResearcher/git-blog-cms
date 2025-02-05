"use server"

import { cookies } from "next/headers"

export const createBlogPost = async (
  folderName: string, 
  content: string,
  description: string,
) => {
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
    const blogPath = `app/blog/${folderName}/page.mdx`;
    const blogUrl = `https://api.github.com/repos/${username}/${repo}/contents/${blogPath}`;
    const encodedContent = Buffer.from(content).toString('base64');

    const blogResponse = await fetch(blogUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        message: `Create blog post: ${folderName}`,
        content: encodedContent,
        branch: 'main'
      })
    });

    if (!blogResponse.ok) {
      return {
        success: false,
        error: `GitHub API error: ${blogResponse.status}`
      };
    }

    // now just update blog-data.ts
    const dataPath = 'app/blog-data.ts';
    const dataUrl = `https://api.github.com/repos/${username}/${repo}/contents/${dataPath}`;

    // fetching current blog-data.ts content
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

    const title = folderName.split('-').join(' ');
    const data = await dataResponse.json();
    const currentContent = Buffer.from(data.content, 'base64').toString();

    const sanitizeText = (text: string) => {
      const sanitizedText = text.replace(/"/g, "'");
      return sanitizedText.replace(/\\/g, "\\\\");
    };
    
    const newBlogEntry = {
      title,
      description: sanitizeText(description),
      link: `/blog/${folderName}`,
      uid: `blog-${Date.now()}`,
    };

    const updatedContent = currentContent.replace(
      'export const BLOG_DATA = [',
      `export const BLOG_DATA = [
    ${JSON.stringify(newBlogEntry, null, 2)},`
    );

    // push updated blog-data.ts
    const updateResponse = await fetch(dataUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        message: `Update blog-data.ts for ${folderName}`,
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
      success: true,
      data: await blogResponse.json()
    };
  } catch (error) {
    console.error('Error creating blog post:', error);
    return {
      success: false,
      error: 'Failed to create blog post'
    };
  }
};