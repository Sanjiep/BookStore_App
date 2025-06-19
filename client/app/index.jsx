import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View>
      <Text>Welcome to BookStore</Text>

      <Link href="/(auth)">Log in</Link>
      <Link href="/(auth)/signup">Sign up</Link>
    </View>
  );
}
