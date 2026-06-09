"use client";

import CollaborativeRoom from "@/components/CollaborativeRoom";
import Editor from "@/components/editor/Editor";
import Header from "@/components/Header";
import { Show, SignIn, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const Document = () => {
  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom />
    </main>
  );
};

export default Document;
