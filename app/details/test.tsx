import { View, Text, Button } from 'react-native';
import { router } from 'expo-router';

export default function Details() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>这里是详情页</Text>

      <Button title="返回上一页"  onPress={() => router.back()} />
    </View>
  );
}
