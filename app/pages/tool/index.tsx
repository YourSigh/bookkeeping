import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import { ToolList } from './model/menu';

interface Tool {
  id: number;
  name: string;
  logo: any;
  path: any;
}

interface ToolItemProps {
  tool: Tool;
}

const ToolItem: React.FC<ToolItemProps> = ({ tool }) => {
  return (
    <View style={styles.toolItem}>
      <TouchableOpacity onPress={() => {
        router.push({
          pathname: tool.path,
        });
        router.setParams({ title: '测试' });
      }}>
        <Image source={tool.logo} style={styles.itemImage} />
      </TouchableOpacity>
      <Text style={styles.itemText}>{tool.name}</Text>
    </View>
  );
};

const ToolContent: React.FC = () => {
  const formatData = (data: any[], numColumns: number) => {
    const totalRows = Math.floor(data.length / numColumns);
    let totalLastRow = data.length - (totalRows * numColumns);

    while (totalLastRow !== 0 && totalLastRow !== numColumns) {
      data.push(null);
      totalLastRow++;
    }
    return data;
  };

  const renderItem = ({ item }: { item: Tool | null }) => {
    if (!item) {
      return <View style={[styles.toolItem, { backgroundColor: 'transparent' }]} />;
    }
    return <ToolItem tool={item} />;
  };

  return (
    <FlatList
      data={formatData(ToolList, 3)}
      renderItem={renderItem}
      keyExtractor={(item, index) => (item ? item.id.toString() : index.toString())}
      numColumns={3}
    />
  );
};

const ToolScreen: React.FC = () => {
  return (
    <View style={styles.toolContainer}>
      <Text style={styles.toolTitle}>工具</Text>
      <ToolContent />
    </View>
  );
};

const styles = StyleSheet.create({
  toolTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  toolContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolItem: {
    flex: 1,
    alignItems: 'center',
    margin: 5,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemText: {
    textAlign: 'center',
  },
});

export default ToolScreen;
