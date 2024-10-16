import React from 'react';
import { View, Text, Image, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

interface Tool {
    id: number;
    name: string;
    icon: any;
}
  
interface ToolItemProps {
    tool: Tool;
}

const toolList = [
    {
        id: 1,
        name: '扫雷',
        icon: require('@/assets/images/landmine.png'),
    }
]

const ToolItem: React.FC<ToolItemProps> = ({ tool }) => {
  return (
    <View style={styles.toolItem}>
        <TouchableOpacity onPress={() => {
                router.push('/details/test')
                router.setParams({title: '测试'})
            }}>
            <Image source={tool.icon} style={styles.itemImage} />
        </TouchableOpacity>
        <Text style={styles.itemText}>{tool.name}</Text>
    </View>
  );
};

const ToolScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>工具</Text>
      {toolList.map((tool) => (
        <ToolItem key={tool.id} tool={tool} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  toolItem: {
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemText: {
    textAlign: 'center',
  }
});

export default ToolScreen;
