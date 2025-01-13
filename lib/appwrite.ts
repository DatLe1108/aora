import { getErrorMessage } from "@/utils/utils";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Models,
  Query,
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
    const posts = await databases.listDocuments(databaseId, videoCollectionId);

    return posts.documents;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};
