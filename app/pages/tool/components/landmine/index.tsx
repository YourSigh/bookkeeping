import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import LandmineHeader from './components/LandmineHeader';


export default function Landmine() {
  return (
    <View style={styles.landmine}>
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