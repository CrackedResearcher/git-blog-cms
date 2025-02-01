"use client"
import getAccessToken from '@/hooks/checkAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  CodeToggle,
  InsertTable,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  imagePlugin,
  InsertImage,
  frontmatterPlugin,
  codeBlockPlugin,
  sandpackPlugin,
  markdownShortcutPlugin,
  directivesPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

const Editor = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [content, setContent] = useState('');
  const title = searchParams.get('title') || '';
  const description = searchParams.get('description') || '';

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
    <>
      <div className="pointer-events-none fixed left-0 top-0 z-10 h-12 w-full bg-gray-100 to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-zinc-950" />
      
      <main className="max-w-3xl mx-auto px-4 mt-24 pb-20">
        {/* Title Section */}
        <div className="space-y-4 mb-8 font-sans">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {description}
          </p>
        </div>

        {/* Divider */}
        <div className="border-b border-gray-200 dark:border-gray-800 mb-8 font-sans text-gray-300" />

        {/* Editor Section */}
        <div className="prose prose-gray dark:prose-invert max-w-none text-gray-300">
          <MDXEditor
            markdown={content}
            onChange={setContent}
            placeholder="Write something here..."
            className="text-gray-200 bg-transparent"
            contentEditableClassName="prose"
            
            plugins={[
              
              toolbarPlugin(
                {
                  toolbarContents: () => (
                    <>
                      <UndoRedo />
                      <BoldItalicUnderlineToggles />
                      <ListsToggle />
                      <CodeToggle />
                      <InsertTable />
                      <InsertImage />
                    </>
                  )
                }
              ),
              listsPlugin(),
              quotePlugin(),
              headingsPlugin(),
              linkPlugin(),
              linkDialogPlugin(),
              imagePlugin(),
              tablePlugin(),
              thematicBreakPlugin(),
              frontmatterPlugin(),
              codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
              sandpackPlugin(),
              codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' } }),
              directivesPlugin(),
              diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
              markdownShortcutPlugin()
            ]} 
          />
        </div>

        {/* Save Button */}
        <div className="fixed bottom-6 right-6 flex gap-3 font-sans">
          <button
            className="px-4 py-1.5 border border-white/20 text-white rounded-md bg-white/10 backdrop-blur-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 transition-colors"
          >
            Save Draft
          </button>
          <button
            className="px-4 py-1.5 bg-white text-black rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-colors"
          >
            Publish Now
          </button>
        </div>
      </main>
    </>
  );
}

export default Editor;