import { Link } from "expo-router";
import { Text, View } from "react-native";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export default function Index() {
  const { user, token, checkAuth } = useAuthStore();
  console.log(user, token);

  useEffect(() => {
    checkAuth()
  }, [])
  
  return (
    <View>
      <Text>Welcome {user?.username} to BookStore</Text>

      <Link href="/(auth)">Log in</Link>
      <Link href="/(auth)/signup">Sign up</Link>
    </View>
  );
}
