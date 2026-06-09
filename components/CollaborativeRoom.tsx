"use client";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

import Editor from "@/components/editor/Editor";
import Header from "@/components/Header";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import ActiveCollaborators from "./ActiveCollaborators";

const CollaborativeRoom = ({ roomId, roomMetadata }: CollaborativeRoomProps) => {
  
  
  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        <div className="collaborative-room">
          <Header>
            <div className="flex w-fit items-center justify-center gap-2">
              <p className="document-title">Share</p>
            </div>

            <div className="flex w-full flex-1 justify-end gap-2 sm:gap-2">
              <ActiveCollaborators />
              <Show when="signed-out">
                <SignInButton />
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </Header>
          <Editor />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;
