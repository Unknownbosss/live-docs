/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $isRootOrShadowRoot,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  RangeSelection,
  NodeSelection,
} from 'lexical';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType,
} from '@lexical/rich-text';
import { 
  $createCodeNode, 
  $isCodeNode, 
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP
} from '@lexical/code';
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from '@lexical/list';
import { TOGGLE_LINK_COMMAND, $isLinkNode } from '@lexical/link';
import { $setBlocksType } from '@lexical/selection';
import { $findMatchingParent } from '@lexical/utils';
import React from 'react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { 
  Undo2, 
  Redo2, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Link2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify 
} from 'lucide-react';

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const activeBlock = useActiveBlock();

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));

      // Update link
      const node = selection.anchor.getNode();
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, $updateToolbar]);

  function toggleBlock(type: 'h1' | 'h2' | 'h3' | 'quote' | 'bullet' | 'number' | 'code') {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      if (type === 'bullet') {
        if (activeBlock === 'bullet') {
          return editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        } else {
          return editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }
      }

      if (type === 'number') {
        if (activeBlock === 'number') {
          return editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        } else {
          return editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }
      }

      if (activeBlock === type) {
        return $setBlocksType(selection, () => $createParagraphNode());
      }

      if (type === 'h1' || type === 'h2' || type === 'h3') {
        return $setBlocksType(selection, () => $createHeadingNode(type as HeadingTagType));
      }

      if (type === 'quote') {
        return $setBlocksType(selection, () => $createQuoteNode());
      }

      if (type === 'code') {
        return $setBlocksType(selection, () => $createCodeNode());
      }
    }
  }

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <Undo2 className="size-4" />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        <Redo2 className="size-4" />
      </button>

      <Divider />

      <button
        onClick={() => editor.update(() => toggleBlock('h1'))}
        data-active={activeBlock === 'h1' ? '' : undefined}
        className={'toolbar-item spaced ' + (activeBlock === 'h1' ? 'active' : '')}
      >
        <Heading1 className="size-4" />
      </button>
      <button
        onClick={() => editor.update(() => toggleBlock('h2'))}
        data-active={activeBlock === 'h2' ? '' : undefined}
        className={'toolbar-item spaced ' + (activeBlock === 'h2' ? 'active' : '')}
      >
        <Heading2 className="size-4" />
      </button>
      <button
        onClick={() => editor.update(() => toggleBlock('h3'))}
        data-active={activeBlock === 'h3' ? '' : undefined}
        className={'toolbar-item spaced ' + (activeBlock === 'h3' ? 'active' : '')}
      >
        <Heading3 className="size-4" />
      </button>

      <Divider />

      <button
        onClick={() => editor.update(() => toggleBlock('bullet'))}
        className={'toolbar-item spaced ' + (activeBlock === 'bullet' ? 'active' : '')}
      >
        <List className="size-4" />
      </button>
      <button
        onClick={() => editor.update(() => toggleBlock('number'))}
        className={'toolbar-item spaced ' + (activeBlock === 'number' ? 'active' : '')}
      >
        <ListOrdered className="size-4" />
      </button>
      <button
        onClick={() => editor.update(() => toggleBlock('quote'))}
        className={'toolbar-item spaced ' + (activeBlock === 'quote' ? 'active' : '')}
      >
        <Quote className="size-4" />
      </button>
      <button
        onClick={() => editor.update(() => toggleBlock('code'))}
        className={'toolbar-item spaced ' + (activeBlock === 'code' ? 'active' : '')}
      >
        <Code className="size-4" />
      </button>

      <Divider />

      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
        aria-label="Format Bold"
      >
        <Bold className="size-4" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
        aria-label="Format Italics"
      >
        <Italic className="size-4" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
        aria-label="Format Underline"
      >
        <Underline className="size-4" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')}
        aria-label="Format Strikethrough"
      >
        <Strikethrough className="size-4" />
      </button>
      <button
        onClick={insertLink}
        className={'toolbar-item spaced ' + (isLink ? 'active' : '')}
        aria-label="Insert Link"
      >
        <Link2 className="size-4" />
      </button>

      <Divider />

      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className="toolbar-item spaced"
        aria-label="Left Align"
      >
        <AlignLeft className="size-4" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className="toolbar-item spaced"
        aria-label="Center Align"
      >
        <AlignCenter className="size-4" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className="toolbar-item spaced"
        aria-label="Right Align"
      >
        <AlignRight className="size-4" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className="toolbar-item"
        aria-label="Justify Align"
      >
        <AlignJustify className="size-4" />
      </button>{' '}
    </div>
  );
}

function useActiveBlock() {
  const [editor] = useLexicalComposerContext();

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      return editor.registerUpdateListener(onStoreChange);
    },
    [editor],
  );

  const getSnapshot = useCallback(() => {
    return editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return null;

      const anchor = selection.anchor.getNode();
      let element =
        anchor.getKey() === 'root'
          ? anchor
          : $findMatchingParent(anchor, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchor.getTopLevelElementOrThrow();
      }

      if ($isHeadingNode(element)) {
        return element.getTag();
      }

      if ($isListNode(element)) {
        const parentList = $findMatchingParent(anchor, (node) => $isListNode(node));
        const listType = parentList ? (parentList as ListNode).getListType() : element.getListType();
        return listType; // 'bullet' or 'number'
      }

      return element.getType();
    });
  }, [editor]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
