// import { useColorScheme } from "react-native";

// const colorScheme = useColorScheme();

export default ({ colors: themeColors }) => {
  console.log(themeColors);
  return {
    "ui-kit.ActionBar.ActionBarItem.ActionBarItem": {
      tint: themeColors.action.primary
    },
  };
};
