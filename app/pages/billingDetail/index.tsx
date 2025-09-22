import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { BillingRecord } from '@/app/pages/addBillingRecord/model/billing';
import { StorageService } from '@/utils/storage';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const BillingDetail = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { date } = useLocalSearchParams<{ date: string }>();
  
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadBillingRecords = async () => {
    try {
      const allRecords = await StorageService.getBillingRecords();
      const dayRecords = allRecords.filter(record => record.date === date);
      
      // 按创建时间倒序排列
      const sortedRecords = dayRecords.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setBillingRecords(sortedRecords);
    } catch (error) {
      console.error('加载账单记录失败:', error);
      Alert.alert('错误', '加载账单记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date) {
      loadBillingRecords();
    }
  }, [date]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBillingRecords();
    setRefreshing(false);
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTotalStats = () => {
    const totalIncome = billingRecords
      .filter(record => record.type === 'income')
      .reduce((sum, record) => sum + record.amount, 0);
    
    const totalExpense = billingRecords
      .filter(record => record.type === 'expense')
      .reduce((sum, record) => sum + record.amount, 0);
    
    return {
      totalIncome,
      totalExpense,
      netAmount: totalIncome - totalExpense,
      recordCount: billingRecords.length,
    };
  };

  const renderBillingItem = ({ item }: { item: BillingRecord }) => (
    <View style={[styles.billingItem, { backgroundColor: colors.buttonBackground }]}>
      <View style={styles.billingItemLeft}>
        <Text style={[styles.categoryText, { color: colors.text }]}>
          {item.categoryLabel}
        </Text>
        <Text style={[styles.descriptionText, { color: colors.text }]}>
          {item.description || '无备注'}
        </Text>
        <Text style={[styles.timeText, { color: colors.text }]}>
          {formatTime(item.createdAt)}
        </Text>
      </View>
      <View style={styles.billingItemRight}>
        <Text
          style={[
            styles.amountText,
            {
              color: item.type === 'income' ? colors.systemGreen : '#FF3B30',
            },
          ]}
        >
          {item.type === 'income' ? '+' : '-'}¥{formatAmount(item.amount)}
        </Text>
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors.text }]}>
        该日期暂无账单记录
      </Text>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.systemGreen }]}
        onPress={() => router.push('/pages/addBillingRecord')}
      >
        <Text style={styles.addButtonText}>记一笔</Text>
      </TouchableOpacity>
    </View>
  );

  const stats = getTotalStats();

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.keyboardBackground }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.keyboardBackground }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {date} 账单详情
        </Text>
      </View>

      {/* 统计信息 */}
      {billingRecords.length > 0 && (
        <View style={[styles.statsContainer, { backgroundColor: colors.buttonBackground }]}>
          <View style={styles.statsRow}>
            <Text style={[styles.statsLabel, { color: colors.text }]}>收入</Text>
            <Text style={[styles.statsValue, { color: colors.systemGreen }]}>
              +¥{formatAmount(stats.totalIncome)}
            </Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={[styles.statsLabel, { color: colors.text }]}>支出</Text>
            <Text style={[styles.statsValue, { color: '#FF3B30' }]}>
              -¥{formatAmount(stats.totalExpense)}
            </Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={[styles.statsLabel, { color: colors.text }]}>净额</Text>
            <Text style={[
              styles.statsValue,
              { color: stats.netAmount >= 0 ? colors.systemGreen : '#FF3B30' }
            ]}>
              {stats.netAmount >= 0 ? '+' : ''}¥{formatAmount(stats.netAmount)}
            </Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={[styles.statsLabel, { color: colors.text }]}>记录数</Text>
            <Text style={[styles.statsValue, { color: colors.text }]}>
              {stats.recordCount}笔
            </Text>
          </View>
        </View>
      )}

      <FlatList
        data={billingRecords}
        renderItem={renderBillingItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.systemGreen}
          />
        }
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50, // 状态栏高度
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  statsContainer: {
    margin: 20,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  statsValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  billingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  billingItemLeft: {
    flex: 1,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    opacity: 0.5,
  },
  billingItemRight: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.6,
  },
  addButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BillingDetail;
