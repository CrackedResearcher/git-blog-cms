"use client";
import getAccessToken from "@/hooks/checkAuth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "@mdxeditor/editor/style.css";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import { createBlogPost } from "./actions";
import { toast } from "react-hot-toast";

const EditorComponent = dynamic(
  () => import("../../components/EditorComponent"),
  {
    ssr: false,
  }
);

const Editor = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [content, setContent] = useState<string>(""); 
  const title = searchParams.get("title") || "";
  const description = searchParams.get("description") || "";
  const [isPublishing, setIsPublishing] = useState(false);

  const handleSaveDraft = async () => {
    try {
      localStorage.setItem("blog-draft-save", content);
      toast.promise(Promise.resolve(), {
        loading: "Saving draft...",
        success: "Draft saved successfully",
        error: "Could not save draft. Retry..",
      });
    } catch (error) {
      toast.error("Failed to save draft");
    }
  };

  const handlePublishToGithub = async () => {
    setIsPublishing(true);
    try {
      const result = await createBlogPost(title, content, description);
      // toast.success("Blog post published successfully!");

      if (result?.redirect) {
        router.push(result.redirect);
      } else {
        localStorage.removeItem("blog-draft-save");
        toast.success("Blog post published successfully!");
      }
    } catch (error) {
      console.error("Failed to publish:", error);
      toast.error("Failed to publish blog post");
    } finally {
      setIsPublishing(false);
    }
    if(localStorage.getItem("blog-draft-save")){
      router.push("/new");
    }
  };

  const debouncedSetContent = useCallback(
    debounce((value: string) => {
      setContent(value);
    }, 300),
    []
  );

  useEffect(() => {
    async function checkAccess() {
      const hasGithubAccess = await getAccessToken();
      if (!hasGithubAccess.success) {
        router.push("/register");
      }
    }
    checkAccess();
  }, [router]);

  useEffect(() => {
    const savedDraft = localStorage.getItem("blog-draft-save");
    if (savedDraft) {
      setContent(savedDraft || "");
      setTimeout(() => {
        toast.success("Draft loaded successfully", {
          duration: 3000,
        });
      }, 300);
    }
  }, []);

  useEffect(() => {
    return () => debouncedSetContent.cancel();
  }, [debouncedSetContent]);

  return (
    <>
      <div className="pointer-events-none fixed left-0 top-0 z-10 h-12 w-full bg-gray-100 to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-zinc-950" />

      <main className="max-w-3xl mx-auto px-4 mt-24 pb-20">
        <div className="space-y-4 mb-8 font-sans">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {description}
          </p>
        </div>

        <div className="border-b dark:border-gray-800 mb-8 font-sans text-gray-300" />

        <div className="prose prose-gray dark:prose-invert max-w-none p-0">
        <div className="prose prose-gray dark:prose-invert max-w-none p-0">
  <Suspense fallback={<div className="h-[500px]">Loading editor...</div>}>
    <EditorComponent markdown={content || ""} onChange={debouncedSetContent} />
  </Suspense>
</div>
        </div>

        <div className="fixed bottom-6 right-6 flex gap-3 font-sans">
          <button
            onClick={handleSaveDraft}
            className="px-4 py-1.5 border border-white/20 text-white rounded-md bg-white/10 backdrop-blur-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 transition-colors"
          >
            Save Draft
          </button>

          <Button
            onClick={handlePublishToGithub}
            disabled={isPublishing}
            className="px-4 py-1.5 bg-white text-black rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-colors"
          >
            {isPublishing ? "Publishing..." : "Publish Now"}
          </Button>
        </div>
      </main>
    </>
  );
};

export default function MyEditor() {
  return (
    <>
      <Suspense fallback={<div>Loading editor...</div>}>
        <Editor />
      </Suspense>
    </>
  );
}
