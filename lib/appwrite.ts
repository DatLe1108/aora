import { FormProp } from "@/app/(tabs)/create";
import { getErrorMessage } from "@/utils/utils";
import * as ImagePicker from "expo-image-picker";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Models,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.aora",
  projectId: "67840ad200267305326e",
  databaseId: "67840bef001a3d0ce4fc",
  userCollectionId: "67840c050005d9c9d307",
  videoCollectionId: "67857c19000a02f4144f",
  storageId: "67840e43000cfef10356",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) {
      throw new Error("An error occurred");
    }

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export const getCurrentUser = async (): Promise<Models.Document> => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) {
      throw new Error("An error occurred");
    }

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) {
      throw new Error("An error occurred");
    }

    return currentUser.documents[0];
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export const getAllPost = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
    ]);

    return posts.documents;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export const getLatestPost = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
      Query.limit(7),
    ]);
    return posts.documents;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export const searchPosts = async (query: string | string[]) => {
  try {
    const searchQuery = typeof query === "string" ? query : query[0];
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", searchQuery),
    ]);
    return posts.documents;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export const getUserPosts = async (userId: string | undefined) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
    ]);
    return posts.documents;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

const getFilePreview = async (fileId: string, type: string) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top" as ImageGravity,
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) {
      throw new Error("An error occurred");
    }

    return fileUrl;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

const uploadFile = async (
  file: ImagePicker.ImagePickerAsset | null,
  type: string
) => {
  if (!file) {
    return;
  }

  const asset = {
    name: file.fileName || "",
    type: file.mimeType || "",
    size: file.fileSize || 0,
    uri: file.uri || "",
  };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export const createVideo = async (form: FormProp) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);
    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};
