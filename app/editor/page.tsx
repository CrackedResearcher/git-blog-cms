"use client";
import getAccessToken from "@/hooks/checkAuth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "@mdxeditor/editor/style.css";
import { debounce } from "lodash";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const EditorComponent = dynamic(
  () => import("../../components/EditorComponent"),
  {
    ssr: false,
  }
);

const Editor = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [content, setContent] = useState("");
  const title = searchParams.get("title") || "";
  const description = searchParams.get("description") || "";

  const handleSaveDraft = async () => {
    console.log("Draft content:", content);
  };

  const handlePublishToGithub = async () => {
    console.log("content that will be published:", content);
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
          <Suspense fallback={null}>
            <EditorComponent
              markdown={content}
              onChange={debouncedSetContent}
            />
          </Suspense>
        </div>

        <div className="fixed bottom-6 right-6 flex gap-3 font-sans">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <button
              onClick={handleSaveDraft}
              className="px-4 py-1.5 border border-white/20 text-white rounded-md bg-white/10 backdrop-blur-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 transition-colors"
            >
              Save Draft
            </button>
          </motion.div>

          <Dialog>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <DialogTrigger asChild>
                <Button className="px-4 py-1.5 bg-white text-black rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-colors">
                  Publish Now
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[465px]">
                <DialogHeader>
                  <DialogTitle>Wanna publish this?</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to publish this article? This action
                    will make your content publicly available on your blog.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="submit"
                      className="mt-3"
                      onClick={handlePublishToGithub}
                    >
                      yes, publish now!
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </motion.div>
          </Dialog>
        </div>
      </main>
    </>
  );
};

export default function MyEditor() {
  return (
    <>
      <Suspense>
        <Editor />
      </Suspense>
    </>
  );
}
