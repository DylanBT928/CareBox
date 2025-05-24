import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-purple-700">
        Welcome to CareBox
      </Text>
      <Text className="mt-2 text-base text-gray-600">
        Track your health supplies with ease
      </Text>
    </View>
  );
}
