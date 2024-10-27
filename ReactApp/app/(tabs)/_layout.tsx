import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";

import { useSession } from "@/utils/ctx";

export default function TabLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return <Stack screenOptions={{
    headerShown: false,
  }}/>;
}
