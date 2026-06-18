"use server";

import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { getAccessType, parseStringify } from "../utils";
import { redirect } from "next/navigation";

export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled Document",
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      defaultAccesses: [],
      usersAccesses,
      metadata,
    });

    revalidatePath("/");

    return parseStringify(room);
  } catch (error) {
    console.error(`Error happened while creating a document:`, error);
  }
};

export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    const hasAccess = Object.keys(room.usersAccesses).includes(userId);

    if (!hasAccess) {
      throw new Error("You are not authorized to access this document");
    }
    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while fetching document: ${error}`);
  }
};

export const updateDocument = async ({
  roomId,
  title,
}: {
  roomId: string;
  title: string;
}) => {
  try {
    const room = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });
    revalidatePath(`/documents/${roomId}`);
    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while updating document: ${error}`);
  }
};

export const getDocuments = async ({ email }: { email: string }) => {
  try {
    const rooms = await liveblocks.getRooms({
      userId: email,
    });

    return parseStringify(rooms);
  } catch (error) {
    console.log(`Error happened while fetching documents: ${error}`);
  }
};
export const updateDocumentAccess = async ({
  roomId,
  email,
  userType,
  updatedBy,
}: ShareDocumentParams) => {
  try {
    const userAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType,
    };

    const room = await liveblocks.updateRoom(roomId, {
      usersAccesses: userAccesses,
    });
    if (room) {
      // todo: send email to user
    }

    revalidatePath(`/documents/${roomId}`);

    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while updating document access: ${error}`);
  }
};

export const removeCollaborator = async ({
  roomId,
  email,
}: {
  roomId: string;
  email: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    if (room.metadata.email === email) {
      throw new Error("You cannot remove yourself from the document");
    }

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: {
        [email]: null,
      },
    });
    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error happened while removing collaborator: ${error}`);
  }
};


export const deleteDocument = async (roomId: string) => {
  try {
    await liveblocks.deleteRoom(roomId);
    revalidatePath("/");
    redirect("/");
  } catch (error) {
    console.log(`Error happened while deleting document: ${error}`);
  }
};