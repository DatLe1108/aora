import { getErrorMessage } from "@/utils/utils";
import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { Models } from "react-native-appwrite";

type useAppwriteProps = {
  fn: () => Promise<Models.Document[]>;
};

const useAppwrite = ({ fn }: useAppwriteProps) => {
  const [data, setData] = useState<Models.Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fn();
      setData(response);
    } catch (error: unknown) {
      Alert.alert("Error", getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, refetch, isLoading };
};

export default useAppwrite;
