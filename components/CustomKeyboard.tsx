import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface CustomKeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onConfirm: () => void;
  onClear: () => void;
}

const { width } = Dimensions.get('window');
const keyWidth = (width - 60) / 4; // 4列布局，减去边距

const CustomKeyboard: React.FC<CustomKeyboardProps> = ({
  onKeyPress,
  onDelete,
  onConfirm,
  onClear,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const keys = [
    ['1', '2', '3', '⌫'],
    ['4', '5', '6', 'C'],
    ['7', '8', '9', ''],
    ['返回', '0', '.', '确认'],
  ];

  const handleKeyPress = (key: string) => {
    if (key === '⌫') {
      onDelete();
    } else if (key === 'C') {
      onClear();
    } else if (key === '确认') {
      onConfirm();
    } else if (key === '返回') {
      // 返回按钮暂时不处理，由外部控制
    } else {
      onKeyPress(key);
    }
  };

  const renderKey = (key: string, index: number) => {
    const isSpecialKey = key === '⌫' || key === 'C' || key === '返回';
    const isConfirmKey = key === '确认';
    const isNumberKey = /^[0-9]$/.test(key) || key === '.';
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.key,
          isSpecialKey && styles.specialKey,
          isConfirmKey && styles.confirmKey,
        ]}
        onPress={() => handleKeyPress(key)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.keyText,
          isSpecialKey && styles.specialKeyText,
          isConfirmKey && styles.confirmKeyText,
        ]}>
          {key}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.keyboardBackground }]}>
      <View style={styles.keyboard}>
        {keys.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((key, keyIndex) => {
              // 第三行第四列是空的，用于确认按钮的跨行显示
              if (rowIndex === 2 && keyIndex === 3) {
                return <View key={keyIndex} style={styles.emptyKey} />;
              }
              // 第四行第四列是确认按钮，需要跨行显示
              if (rowIndex === 3 && keyIndex === 3) {
                return (
                  <View key={keyIndex} style={styles.confirmKeyContainer}>
                    <TouchableOpacity
                      style={[styles.confirmKey, { backgroundColor: colors.systemGreen }]}
                      onPress={() => handleKeyPress(key)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.confirmKeyText}>{key}</Text>
                    </TouchableOpacity>
                  </View>
                );
              }
              return renderKey(key, keyIndex);
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  keyboard: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  key: {
    width: keyWidth,
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  specialKey: {
    backgroundColor: '#f0f0f0',
  },
  confirmKeyContainer: {
    width: keyWidth,
    height: 50,
    position: 'relative',
  },
  confirmKey: {
    backgroundColor: '#34C759', // iOS系统绿色
    width: keyWidth,
    height: 108, // 跨两行的高度 (50 + 8 + 50)
    position: 'absolute',
    top: -58, // 向上偏移一行的高度
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyKey: {
    width: keyWidth,
    height: 50,
  },
  keyText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333333',
  },
  specialKeyText: {
    color: '#666666',
  },
  confirmKeyText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default CustomKeyboard;
