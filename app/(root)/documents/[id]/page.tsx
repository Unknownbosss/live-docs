"use client"

import { Editor } from "@/components/editor/Editor";
import Header from "@/components/Header";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const Document = () => {
  return (
    <div>
      <Header>
        <div className="flex w-fit items-center justify-center gap-2">
          <p className="document-title">Share</p>
        </div>
        <Show when="signed-out">
          <SignInButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </Header>
      <Editor />
    </div>
  );
};

export default Document;
