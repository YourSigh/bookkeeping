import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router, useSegments } from 'expo-router';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();

  // 定义三个菜单的路由名称
  const mainRoutes = ['(tabs)', 'tool', 'settings'];

  // 自定义头部
  const Header = () => {
    return (
      <View style={{ height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ccffaa' }}>
        {!mainRoutes.includes(segments[segments.length - 1]) && (
          <TouchableOpacity  style={{ position: 'absolute', left: 10 }} onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
        )}
        <Text style={{ fontSize: 20, color: Colors[colorScheme ?? 'light'].text }}>
          记账APP
        </Text>
      </View>
    );
  };
  

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1daa1d',
        tabBarInactiveTintColor: Colors[colorScheme?? 'light'].text,
        tabBarStyle: {
          backgroundColor: '#ccffaa', // 设置背景颜色
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tool"
        options={{
          title: '工具',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="tool" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '我的',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="user" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
