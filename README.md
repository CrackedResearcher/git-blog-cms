this is the git-blogger 

High level architecture of this:

[User] → [Next.js UI] → [Editor (MDX)] → [Vercel API Routes] → [GitHub API]
                               ↓
                   [Image Uploads/CDN]
                               ↓
                   [Git Push Automation]
