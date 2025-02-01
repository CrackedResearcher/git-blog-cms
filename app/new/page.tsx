'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import getAccessToken from '@/hooks/checkAuth';

const NewBlogPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {

      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push(`/editor?title=${title}&description=${description}`);
    } catch (error) {
      console.error('Error creating blog:', error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    async function checkAccess() {
      const hasGithubAccess = await getAccessToken();
      if (!hasGithubAccess.success) {
        router.push('/register');
      }
    }
    
    checkAccess();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-black">
      <div className="max-w-md w-full space-y-8 p-8 rounded-xl shadow-lg backdrop-blur-sm bg-white/10 border border-white/20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white font-sans">Create New Blog</h2>
          <p className="text-sm mt-2 text-white/80">
            Whats on your mind.. what do you want to write about today?
          </p>
        </div>

        <form onSubmit={handleCreateBlog} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="text-sm font-medium text-white/90">
                Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="test-xs mt-1 block w-full px-3 py-2 bg-black/30 border border-white/10 rounded-md text-gray-300 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                placeholder="Enter your blog title"
              />
            </div>
            <div>
              <label htmlFor="description" className="text-sm font-medium text-white/90">
                Description
              </label>
              <textarea
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="test-xs mt-1 block w-full px-3 py-2 bg-black/30 border border-white/10 rounded-md text-gray-300 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                placeholder="Write a brief description of your blog"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                creating...
              </>
            ) : (
              'create new blog'
            )}
          </button>
        </form>

        <p className="text-xs mt-4 text-white/70 text-center">
          Your blog will be created as a new file at <code className="px-1 rounded bg-black/40  text-gray-300">blog/{title}.mdx</code> and will be accessible on your blog.
        </p>
      </div>
    </div>
  );
};

export default NewBlogPage;