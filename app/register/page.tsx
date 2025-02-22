"use client";

import React, { useEffect, useState } from "react";
import getAccessToken from "@/hooks/checkAuth";
import { useRouter } from "next/navigation";
import { saveDetails } from "./actions";

export default function Register() {
  const [isSaving, setIsSaving] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [githubUsername, setGithubUsername] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [isDetailsSubmitted, setIsDetailsSubmitted] = useState(false);

  const router = useRouter();

  const handleGithubAuth = async () => {
    setIsConnecting(true);

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://git-blogger.vercel.app"
        : "http://localhost:3000";

    try {
      const client_id = process.env.NEXT_PUBLIC_GIT_CLIENT_ID;
      const redirectUri = encodeURIComponent(`${baseUrl}/auth/callback`);
      const scope = encodeURIComponent("repo read:user");
      const state = "INIT_GIT_AUTH";

      window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await saveDetails({
        gitusername: githubUsername,
        gitrepo: githubRepo
      });

      if(res.success){
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsDetailsSubmitted(true);
        setGithubUsername("");
        setGithubRepo("");
      }
    } catch (error) {
      console.error('Error saving details:', error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    async function checkAccess() {
      const hasGithubAccess = await getAccessToken();
      if (!hasGithubAccess.success) {
        router.push("/register");
      } else {
        router.push("/new");
      }
    }

    checkAccess();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-black">
      <div className="max-w-md w-full space-y-8 p-8 rounded-xl shadow-lg backdrop-blur-sm bg-white/15 border border-white/20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Connect with GitHub</h2>
          <p className="text-sm mt-2 text-white/80">
            Link your GitHub account to start managing your blog
          </p>
        </div>

        <form onSubmit={handleSubmitDetails} className="mt-8 space-y-4">
          <div>
            <label htmlFor="username" className="text-sm text-white/80">
              Your github username
            </label>
            <input
              id="username"
              type="text"
              required
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              className="w-full px-3 py-2 mt-2 border border-white/20 rounded-md bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Enter your GitHub username"
            />
          </div>

          <div>
            <label htmlFor="repo" className="text-sm text-white/80">
              Your blog repo name
            </label>
            <input
              id="repo"
              type="text"
              required
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              className="w-full px-3 py-2 mt-2 border border-white/20 rounded-md bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Enter your blog repository name"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full mt-2 px-4 py-2 text-white border border-transparent rounded-md bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            {isSaving ? "Saving..." : "Save Details"}
          </button>
        </form>

        <div className="relative flex items-center gap-4 py-2">
          <div className="flex-grow border-t border-white/20"></div>
          <span className="text-sm text-white/60">then click</span>
          <div className="flex-grow border-t border-white/20"></div>
        </div>

        <button
          onClick={handleGithubAuth}
          disabled={!isDetailsSubmitted || isConnecting}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          {isConnecting ? (
            <span>Connecting...</span>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  clipRule="evenodd"
                />
              </svg>
              Continue with GitHub
            </>
          )}
        </button>

        <p className="text-sm mt-4 text-white/70 text-center">
          We need this access to ensure the app works without interruptions.
        </p>
      </div>
    </div>
  );
}
