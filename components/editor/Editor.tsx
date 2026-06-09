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

import ToolbarPlugin from "./plugins/ToolbarPlugin";
import Theme from "./plugins/Theme";

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

export default function Editor() {
  const initialConfig = {
    namespace: "MyEditor",
    theme: Theme,
    nodes: [HeadingNode, ListNode, ListItemNode, LinkNode, QuoteNode, CodeNode, CodeHighlightNode, HorizontalRuleNode],
    onError,
  };

  const [editorState, setEditorState] = useState<EditorState | null>(null);

  function onChange(state: EditorState) {
    setEditorState(state);
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container size-full">
        <div className="toolbar-wrapper flex min-w-full justify-between">
          <ToolbarPlugin />
        </div>

        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="editor-input h-full"
              aria-placeholder="Enter some text..."
              placeholder={
                <div className="editor-placeholder">Enter some text...</div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <LinkPlugin />
        <HorizontalRulePlugin />
        <TabIndentationPlugin />
        <MarkdownShortcutPlugin />
        <MyOnChangePlugin onChange={onChange} />
      </div>
    </LexicalComposer>
  );
}
