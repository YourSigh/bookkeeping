import React from 'react';
import { View, Text, Image, Button, StyleSheet, Alert } from 'react-native';

const ProfileScreen: React.FC = () => {
  const handleLogout = () => {
    Alert.alert('提示', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      { text: '确定', onPress: () => console.log('用户已退出') },
    ]);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://example.com/avatar.png' }}
        style={styles.avatar}
      />
      <Text style={styles.username}>用户名</Text>
      <Button title="退出登录" onPress={handleLogout} color="#FF6347" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ProfileScreen;
