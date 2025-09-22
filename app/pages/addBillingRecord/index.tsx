import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { router } from 'expo-router';
import { BaseTab } from '@/components/Base';
import CustomKeyboard from '@/components/CustomKeyboard';
import { disburse, income } from './model/kind';
import { BillingRecord, BILLING_TYPES } from './model/billing';
import { StorageService } from '@/utils/storage';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width, height } = Dimensions.get('window');

const AddBillingRecord = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [tabValue, setTabValue] = useState(1);
  const [amount, setAmount] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const panes = [
    { id: 1, title: '支出' },
    { id: 2, title: '收入' },
  ];

  const currentCategories = tabValue === 1 ? disburse : income;
  const currentType = tabValue === 1 ? BILLING_TYPES.EXPENSE : BILLING_TYPES.INCOME;

  const onChange = (value: number) => {
    setTabValue(value);
    setSelectedCategory('');
  };

  const handleKeyPress = (key: string) => {
    if (key === '.') {
      // 处理小数点
      if (!amount.includes('.')) {
        setAmount(amount + '.');
      }
    } else if (amount === '0' && key !== '0') {
      setAmount(key);
    } else if (amount !== '0') {
      setAmount(amount + key);
    }
  };

  const handleDelete = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount('0');
    }
  };

  const handleClear = () => {
    setAmount('0');
  };

  // 处理点击金额区域
  const handleAmountPress = () => {
    setIsKeyboardVisible(true);
  };

  // 处理点击其他地方隐藏键盘
  const handleDismissKeyboard = () => {
    setIsKeyboardVisible(false);
  };

  const handleConfirm = async () => {
    if (!selectedCategory) {
      Alert.alert('提示', '请选择分类');
      return;
    }

    if (amount === '0') {
      Alert.alert('提示', '请输入金额');
      return;
    }

    const categoryLabel = currentCategories.find(cat => cat.value === selectedCategory)?.label || '';

    const billingRecord: BillingRecord = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      type: currentType,
      category: selectedCategory,
      categoryLabel,
      description: description.trim(),
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    try {
      await StorageService.saveBillingRecord(billingRecord);
      Alert.alert('成功', '记账成功！', [
        {
          text: '确定',
          onPress: () => {
            // 重置表单
            setAmount('0');
            setSelectedCategory('');
            setDescription('');
            setIsKeyboardVisible(false);
            // 返回上一页
            router.back();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('错误', '保存失败，请重试');
    }
  };

  const formatAmount = (amount: string) => {
    // 如果金额为空或只有小数点，显示0.00
    if (!amount || amount === '.') {
      return '0.00';
    }
    
    const num = parseFloat(amount);
    // 如果解析失败，返回原始字符串
    if (isNaN(num)) {
      return amount;
    }
    
    return num.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const renderCategoryGrid = () => {
    return (
      <View style={styles.categoryGrid}>
        {currentCategories.map((category) => (
          <TouchableOpacity
            key={category.value}
            style={[
              styles.categoryItem,
              { backgroundColor: colors.buttonBackground },
              selectedCategory === category.value && { backgroundColor: colors.selectedBackground },
            ]}
            onPress={() => setSelectedCategory(category.value)}
          >
            <Text
              style={[
                styles.categoryText,
                { color: colors.text },
                selectedCategory === category.value && styles.selectedCategoryText,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <View style={[styles.container, { backgroundColor: colors.keyboardBackground }]}>
        <BaseTab
          value={tabValue}
          panes={panes}
          onChange={onChange}
          content={
            <View style={styles.content}>
              {/* 金额显示区域 */}
              <TouchableOpacity 
                style={[
                  styles.amountContainer, 
                  { 
                    backgroundColor: colors.buttonBackground,
                    borderColor: isKeyboardVisible ? colors.systemGreen : 'transparent'
                  }
                ]}
                onPress={handleAmountPress}
                activeOpacity={0.8}
              >
                <Text style={[styles.currencySymbol, { color: colors.text }]}>¥</Text>
                <Text style={[styles.amountText, { color: colors.text }]}>{formatAmount(amount)}</Text>
              </TouchableOpacity>

            {/* 分类选择区域 */}
            <View style={styles.categoryContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>选择分类</Text>
              {renderCategoryGrid()}
            </View>

            {/* 备注区域 */}
            <View style={styles.descriptionContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>备注（可选）</Text>
              <View style={[styles.descriptionInput, { backgroundColor: colors.buttonBackground }]}>
                <Text style={styles.descriptionPlaceholder}>
                  {description || '添加备注...'}
                </Text>
              </View>
            </View>
          </View>
        }
      />

      {/* 自定义键盘 */}
      {isKeyboardVisible && (
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={[styles.keyboardContainer, { backgroundColor: colors.keyboardBackground }]}>
            <CustomKeyboard
              onKeyPress={handleKeyPress}
              onDelete={handleDelete}
              onConfirm={handleConfirm}
              onClear={handleClear}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    paddingVertical: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    marginRight: 8,
  },
  amountText: {
    fontSize: 32,
    fontWeight: '700',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: (width - 60) / 3,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionInput: {
    borderRadius: 8,
    padding: 12,
    minHeight: 50,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  descriptionPlaceholder: {
    fontSize: 16,
    color: '#999999',
  },
  keyboardToggle: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  keyboardToggleText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  keyboardContainer: {
    // 背景色通过动态样式设置
  },
});

export default AddBillingRecord;