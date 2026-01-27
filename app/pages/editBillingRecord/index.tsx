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
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { BaseTab } from '@/components/Base';
import CustomKeyboard from '@/components/CustomKeyboard';
import { disburse, income } from '@/app/pages/addBillingRecord/model/kind';
import { BillingRecord, BILLING_TYPES } from '@/app/pages/addBillingRecord/model/billing';
import { StorageService } from '@/utils/storage';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Calendar from '@/app/pages/tool/components/calendar';

const { width, height } = Dimensions.get('window');

const EditBillingRecord = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { recordId } = useLocalSearchParams<{ recordId: string }>();
  
  const [tabValue, setTabValue] = useState(1);
  const [amount, setAmount] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [recordDate, setRecordDate] = useState('');
  const [originalRecord, setOriginalRecord] = useState<BillingRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const panes = [
    { id: 1, title: '支出' },
    { id: 2, title: '收入' },
  ];

  const currentType = tabValue === 1 ? BILLING_TYPES.EXPENSE : BILLING_TYPES.INCOME;
  const currentCategories = tabValue === 1 ? disburse : income;

  // 加载原始账单数据
  const loadOriginalRecord = async () => {
    console.log('编辑页面加载数据, recordId:', recordId);
    if (!recordId) return;
    
    try {
      setLoading(true);
      const allRecords = await StorageService.getBillingRecords();
      const record = allRecords.find(r => r.id === recordId);
      
      if (record) {
        setOriginalRecord(record);
        setTabValue(record.type === BILLING_TYPES.EXPENSE ? 1 : 2);
        setAmount(record.amount.toString());
        setSelectedCategory(record.category);
        setDescription(record.description || '');
        setRecordDate(record.date);
      } else {
        Alert.alert('错误', '找不到该账单记录');
        router.back();
      }
    } catch (error) {
      console.error('加载账单记录失败:', error);
      Alert.alert('错误', '加载账单记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOriginalRecord();
  }, [recordId]);

  // 监听页面焦点变化，重新加载数据
  useFocusEffect(
    useCallback(() => {
      loadOriginalRecord();
    }, [recordId])
  );

  const onChange = (value: number) => {
    setTabValue(value);
    setSelectedCategory(''); // 切换类型时清空分类选择
  };

  const handleKeyPress = (key: string) => {
    if (key === '.') {
      if (!amount.includes('.')) {
        setAmount(amount + '.');
      }
    } else {
      if (amount === '0') {
        setAmount(key);
      } else {
        setAmount(amount + key);
      }
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

  const formatAmount = (amount: string) => {
    if (!amount || amount === '0' || amount === '.') {
      return '0';
    }
    return amount;
  };

  // 处理点击金额区域
  const handleAmountPress = () => {
    setIsKeyboardVisible(true);
  };

  // 处理点击其他地方隐藏键盘
  const handleDismissKeyboard = () => {
    setIsKeyboardVisible(false);
  };

  // 处理日期选择
  const handleDateSelect = (date: string) => {
    setRecordDate(date);
    setIsCalendarVisible(false);
  };

  // 处理点击日期区域
  const handleDatePress = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  // 处理备注输入
  const handleDescriptionFocus = () => {
    setIsDescriptionFocused(true);
    setIsKeyboardVisible(false);
    setIsCalendarVisible(false);
  };

  const handleDescriptionBlur = () => {
    setIsDescriptionFocused(false);
  };

  const handleConfirm = async () => {
    if (!selectedCategory) {
      Alert.alert('提示', '请选择分类');
      return;
    }

    if (!amount || amount === '0' || amount === '.') {
      Alert.alert('提示', '请输入金额');
      return;
    }

    if (!originalRecord) {
      Alert.alert('错误', '原始记录不存在');
      return;
    }

    try {
      const categoryLabel = currentCategories.find(cat => cat.value === selectedCategory)?.label || selectedCategory;
      
      const updatedRecord: BillingRecord = {
        ...originalRecord,
        type: currentType,
        amount: parseFloat(amount),
        category: selectedCategory,
        categoryLabel,
        description: description.trim(),
        date: recordDate,
        updatedAt: new Date().toISOString(),
      };

      await StorageService.updateBillingRecord(updatedRecord);
      Alert.alert('成功', '账单修改成功', [
        { text: '确定', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('修改账单失败:', error);
      Alert.alert('错误', '修改账单失败');
    }
  };

  const renderCategoryGrid = () => {
    return (
      <View style={styles.categoryGrid}>
        {currentCategories.map((category) => (
          <TouchableOpacity
            key={category.value}
            style={[
              styles.categoryItem,
              {
                backgroundColor: selectedCategory === category.value ? colors.systemGreen : colors.buttonBackground,
              },
            ]}
            onPress={() => setSelectedCategory(category.value)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.categoryText,
              { color: selectedCategory === category.value ? '#ffffff' : colors.text }
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.keyboardBackground }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <View style={[styles.container, { backgroundColor: colors.keyboardBackground }]}>
        <BaseTab
          value={tabValue}
          panes={panes}
          onChange={onChange}
          content={
            <View style={styles.content}>
              {/* 日期显示区域 */}
              <TouchableOpacity 
                style={[
                  styles.dateContainer,
                  { 
                    backgroundColor: colors.buttonBackground,
                    borderColor: isCalendarVisible ? colors.systemGreen : 'transparent'
                  }
                ]}
                onPress={handleDatePress}
                activeOpacity={0.8}
              >
                <Text style={[styles.dateText, { color: colors.text }]}>
                  记账日期：{recordDate}
                </Text>
                <Text style={[styles.dateHint, { color: colors.text }]}>
                  点击选择日期
                </Text>
              </TouchableOpacity>
              
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
                <TextInput
                  style={[
                    styles.descriptionInput,
                    { 
                      backgroundColor: colors.buttonBackground,
                      borderColor: isDescriptionFocused ? colors.systemGreen : 'transparent',
                      color: colors.text
                    }
                  ]}
                  placeholder="添加备注..."
                  placeholderTextColor="#999999"
                  value={description}
                  onChangeText={setDescription}
                  onFocus={handleDescriptionFocus}
                  onBlur={handleDescriptionBlur}
                  multiline
                  maxLength={100}
                />
              </View>
            </View>
          }
        />

        {/* 日历组件 */}
        {isCalendarVisible && (
          <View style={styles.calendarContainer}>
            <Calendar 
              mode="datePicker"
              onDateSelect={handleDateSelect} 
              selectedDate={recordDate}
            />
          </View>
        )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  dateContainer: {
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  dateHint: {
    fontSize: 12,
    opacity: 0.6,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: (width - 60) / 3,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
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
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionInput: {
    borderRadius: 8,
    padding: 12,
    minHeight: 50,
    borderWidth: 2,
    borderColor: 'transparent',
    textAlignVertical: 'top',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  keyboardContainer: {
    // 背景色通过动态样式设置
  },
  calendarContainer: {
    height: 400,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default EditBillingRecord;
