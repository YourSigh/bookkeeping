import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SuspensionBall from '@/components/SuspensionBall';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { router, useSegments } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Colors } from '@/constants/Colors';
import Constants from 'expo-constants';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// 自定义头部
const Header = () => {
  // 定义三个菜单的路由名称
  const mainRoutes = ['(tabs)', 'tool', 'settings'];

  const segments = useSegments();
  const colorScheme = useColorScheme();
  return (
    <View style={styles.header}>
      {!mainRoutes.includes(segments[segments.length - 1]) && (
        <TouchableOpacity  style={{ position: 'absolute', left: 10, bottom: 18, }} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
      )}
      <Text style={{ fontSize: 20, color: Colors[colorScheme ?? 'light'].text }}>
        记账APP
      </Text>
    </View>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={() => ({
          header: () => <Header />,
        })}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <SuspensionBall></SuspensionBall>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60 + Constants.statusBarHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccffaa',
    paddingTop: Constants.statusBarHeight,
    position:'relative',
    flexDirection: 'row',
  }
});
