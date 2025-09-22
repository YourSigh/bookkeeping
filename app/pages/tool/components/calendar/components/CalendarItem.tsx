import React from'react';
import { View, Text, StyleSheet, TouchableOpacity } from'react-native';
import { BillingStatsService } from '@/utils/billingStats';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Props {
  isSelect: boolean,
  consume: number,
  date: number,
  timestamp: number,
  isThisMonth: boolean,
  onClick: () => void;
  hasData?: boolean;
  income?: number;
  expense?: number;
  recordCount?: number;
}

const CalendarItem: React.FC<Props> = ({
  isSelect, 
  consume, 
  date, 
  timestamp, 
  isThisMonth, 
  onClick, 
  hasData = false,
  income = 0,
  expense = 0,
  recordCount = 0
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const isNow = timestamp === new Date(new Date().setHours(0, 0, 0, 0)).getTime();
  
  // 获取金额显示文本和颜色
  const getAmountDisplay = () => {
    if (!hasData || !isThisMonth) {
      return { text: '', color: colors.text };
    }
    
    if (recordCount === 0) {
      return { text: '', color: colors.text };
    }
    
    // 如果有收入也有支出，显示净额
    if (income > 0 && expense > 0) {
      return {
        text: BillingStatsService.formatAmount(consume),
        color: BillingStatsService.getAmountColor(consume)
      };
    }
    
    // 只有收入
    if (income > 0) {
      return {
        text: `+${income.toFixed(0)}`,
        color: colors.systemGreen
      };
    }
    
    // 只有支出
    if (expense > 0) {
      return {
        text: `-${expense.toFixed(0)}`,
        color: '#FF3B30'
      };
    }
    
    return { text: '', color: colors.text };
  };

  const amountDisplay = getAmountDisplay();

  return (
    <TouchableOpacity 
      onPress={onClick} 
      style={[
        isSelect ? (isNow ? styles.nowDate : styles.selected) : null, 
        styles.calendarItem, 
        isThisMonth ? null : styles.notThisMonth,
        hasData && isThisMonth ? styles.hasData : null
      ]}
    >
      <Text style={[
        { color: isNow ? colors.systemGreen : colors.text }, 
        styles.textDate
      ]}>
        {date}
      </Text>
      {amountDisplay.text ? (
        <Text style={[
          styles.amountText,
          { color: amountDisplay.color }
        ]}>
          {amountDisplay.text}
        </Text>
      ) : null}
      {recordCount > 1 && (
        <Text style={[styles.recordCount, { color: colors.text }]}>
          {recordCount}笔
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    selected: {
      backgroundColor: '#eee',
    },
    nowDate: {
      backgroundColor: '#ccffaa',
    },
    calendarItem: {
      padding: 8,
      width: "14.28%",
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
    },
    hasData: {
      backgroundColor: '#f8f9fa',
      borderWidth: 1,
      borderColor: '#e9ecef',
    },
    textDate: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
    },
    amountText: {
      fontSize: 10,
      fontWeight: '500',
      marginBottom: 1,
    },
    recordCount: {
      fontSize: 8,
      opacity: 0.7,
    },
    notThisMonth: {
      opacity: 0.3,
    }
});

export default CalendarItem;