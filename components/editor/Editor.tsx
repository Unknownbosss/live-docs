import { useEffect, useState } from "react";
import type { EditorState } from "lexical";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";

import {
  AnchoredThreads,
  FloatingComposer,
  FloatingThreads,
  FloatingToolbar,
  liveblocksConfig,
  LiveblocksPlugin,
} from "@liveblocks/react-lexical";
import { useSyncStatus, useThreads } from "@liveblocks/react/suspense";

import ToolbarPlugin from "./plugins/ToolbarPlugin";
import Theme from "./plugins/Theme";
import Loader from "../Loader";
import Comments from "../Comments";

function MyOnChangePlugin({
  onChange,
}: {
  onChange: (editorState: EditorState) => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);

  return null;
}

function onError(error: Error, editor: any) {
  console.error(error);
}

export default function Editor({ roomId, currentUserType }: { roomId: string, currentUserType: UserType }) {
  const syncStatus = useSyncStatus({ smooth: true });
  const {threads} = useThreads()
  const initialConfig = liveblocksConfig({
    namespace: "MyEditor",
    theme: Theme,
    nodes: [HeadingNode, ListNode, ListItemNode, LinkNode, QuoteNode, CodeNode, CodeHighlightNode, HorizontalRuleNode],
    onError,
    editable: currentUserType === "editor",
  });

  const [editorState, setEditorState] = useState<EditorState | null>(null);

  function onChange(state: EditorState) {
    setEditorState(state);
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container size-full">
        <div className="toolbar-wrapper flex min-w-full justify-between">
          <ToolbarPlugin />
          {/* {currentUserType === "editor" && <DeleteModal roomId={roomId} />} */}
        </div>

        <div className="editor-wrapper flex flex-col items-center justify-start lg:flex-row lg:items-start">

          {/* TODO: add syncronization status that allows debouncing*/}
          {/* {syncStatus === "synchronizing" ? (
            <Loader />

          ) : (   )} */}

            <div className="editor-inner min-h-[1100px] relative mb-5 h-fit w-full max-w-[800px] shadowm-md lg:mb-10">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className="editor-input h-full"
                    aria-placeholder="Enter some text..."
                    placeholder={
                      <div className="editor-placeholder">
                        Enter some text...
                      </div>
                    }
                  />
                }
                ErrorBoundary={LexicalErrorBoundary}
              />

              {currentUserType === "editor" && <FloatingToolbar />}
              <HistoryPlugin />
              <AutoFocusPlugin />
              <ListPlugin />
              <LinkPlugin />
              <HorizontalRulePlugin />
              <TabIndentationPlugin />
              <MarkdownShortcutPlugin />
              <MyOnChangePlugin onChange={onChange} />
            </div>
        

          <LiveblocksPlugin>
            <FloatingComposer className="w-[350px]"/>
            <FloatingThreads threads={threads}/>
            <AnchoredThreads threads={threads} />
            <Comments />
          </LiveblocksPlugin>
        </div>
      </div>
    </LexicalComposer>
  );
}
