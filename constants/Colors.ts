/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // 系统绿色
    systemGreen: '#34C759',
    // 键盘背景色
    keyboardBackground: '#f8f9fa',
    // 按钮背景色
    buttonBackground: '#ffffff',
    // 选中状态背景色
    selectedBackground: '#34C759',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // 系统绿色
    systemGreen: '#34C759',
    // 键盘背景色
    keyboardBackground: '#1c1c1e',
    // 按钮背景色
    buttonBackground: '#2c2c2e',
    // 选中状态背景色
    selectedBackground: '#34C759',
  },
};
