import { BlurView } from "expo-blur";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/Feather";

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <BlurView
      intensity={50}
      tint="light"
      style={{
        flexDirection: "row",
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const iconNameMap: Record<string, string> = {
          Home: "home",
          Add: "plus-circle",
          History: "clipboard",
          Settings: "settings",
        };

        const onPress = () => navigation.navigate(route.name);

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={{ flex: 1, alignItems: "center", paddingVertical: 10 }}
          >
            <Icon
              name={iconNameMap[route.name]}
              size={24}
              color={isFocused ? "#4F46E5" : "#6B7280"}
            />
            <Text
              style={{ fontSize: 12, color: isFocused ? "#4F46E5" : "#6B7280" }}
            >
              {typeof label === "string" ? label : route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </BlurView>
  );
}
