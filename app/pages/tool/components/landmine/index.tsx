import { View, Text, Button, StyleSheet } from 'react-native';
import { BaseInput } from '@/components/Base/index';
import { router } from 'expo-router';
import LandmineHeader from './components/LandmineHeader';
import { useState } from 'react';

export default function Landmine() {
  const [value, setValue] = useState('');
  return (
    <View style={styles.landmine}>
      <BaseInput keyboardType="decimal-pad" value={value} onChangeText={setValue}></BaseInput>
      <LandmineHeader></LandmineHeader>
      <Button title="返回上一页"  onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  landmine: {
    flex: 1,
  }
})