"use client";
import { RefObject } from "react";

import {
  MDXEditor,
  MDXEditorMethods,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
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
  markdownShortcutPlugin,
  BlockTypeSelect,
  frontmatterPlugin,
} from "@mdxeditor/editor";
import { FC } from "react";
import "@mdxeditor/editor/style.css";

interface EditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  editorRef?: RefObject<MDXEditorMethods | null>;
}

const Editor: FC<EditorProps> = ({ markdown, onChange, editorRef }) => {
  return (
    <MDXEditor
      ref={editorRef}
      markdown={markdown}
      onChange={onChange}
      placeholder="Write something here..."
      className="dark-theme dark-editor !bg-transparent"
      contentEditableClassName="dark-editor dark-theme !bg-transparent !text-gray-300"
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <BlockTypeSelect />
              <ListsToggle />
              <CodeToggle />
              <InsertTable />
              <InsertImage />
            </>
          ),
        }),
        listsPlugin(),
        quotePlugin(),
        tablePlugin(),
        frontmatterPlugin(),
        headingsPlugin(),
        markdownShortcutPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin({
          imageUploadHandler: () => {
            return Promise.resolve("");
          },
        }),
      ]}
    />
  );
};

export default Editor;
