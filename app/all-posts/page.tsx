"use client";

import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { deleteBlogFromData, listAllBlogPosts } from "./actions";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import getAccessToken from "@/hooks/checkAuth";

interface BlogPost {
  title: string;
  description: string;
  link: string;
  uid: string;
}

const ViewAllPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await listAllBlogPosts();
        if (result.success && result.data) {
          //  type guard
          setPosts(result.data);
        } else if (result.redirect) {
          router.push(result.redirect);
        } else {
          toast.error(result.error || "Failed to fetch posts");
        }
      } catch (error) {
        toast.error("Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [router]);

  const handleToggleSelect = (uid: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(uid)) {
      newSelected.delete(uid);
    } else {
      newSelected.add(uid);
    }
    setSelectedPosts(newSelected);
  };

  const handleDelete = async () => {
    if (selectedPosts.size === 0) {
      toast.error("Please select posts to delete");
      return;
    }

    setIsDeleting(true);
    try {
      for (const uid of selectedPosts) {
        const result = await deleteBlogFromData(uid);
        if (result.success) {
          setPosts(posts.filter((post) => post.uid !== uid));
          toast.success(`Deleted post successfully`);
        } else if (result.redirect) {
          router.push(result.redirect);
          return;
        } else {
          toast.error(result.error || "Failed to delete post");
        }
      }
      setSelectedPosts(new Set());
    } catch (error) {
      toast.error("Failed to delete posts");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    async function checkAccess() {
      const hasGithubAccess = await getAccessToken();
      if (!hasGithubAccess.success) {
        router.push("/register");
      }
    }
    checkAccess();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading posts...</div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 pb-8 relative min-h-screen pt-24">
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-950 z-10 border-b dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center relative">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-sans">
            Manage Posts
          </h1>
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {selectedPosts.size > 0 && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-sans"
              >
                {isDeleting
                  ? "Deleting..."
                  : `Delete Selected (${selectedPosts.size})`}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-12">
        {posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No blog posts found
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.uid}
              className="flex items-center space-x-4 p-4 border dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <Checkbox
                id={post.uid}
                checked={selectedPosts.has(post.uid)}
                onCheckedChange={() => handleToggleSelect(post.uid)}
                className="min-w-[20px] min-h-[20px] border-gray-600 dark:border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <div
                className="flex-1 cursor-pointer"
                onClick={() => handleToggleSelect(post.uid)}
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {post.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <Toaster
        richColors
        position="bottom-left"
        toastOptions={{
          style: {
            maxWidth: "320px",
            minWidth: "200px",
          },
        }}
      />
    </main>
  );
};

export default ViewAllPosts;
