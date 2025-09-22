import { BillingRecord } from '@/app/pages/addBillingRecord/model/billing';
import { StorageService } from './storage';

export interface DayBillingStats {
  date: string; // YYYY-MM-DD 格式
  totalIncome: number;
  totalExpense: number;
  netAmount: number; // 净收入 = 收入 - 支出
  recordCount: number; // 记录数量
}

export interface MonthBillingStats {
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  recordCount: number;
  dailyStats: DayBillingStats[];
}

export class BillingStatsService {
  // 获取指定日期的账单统计
  static async getDayStats(date: string): Promise<DayBillingStats> {
    try {
      const records = await StorageService.getBillingRecords();
      const dayRecords = records.filter(record => record.date === date);
      
      const totalIncome = dayRecords
        .filter(record => record.type === 'income')
        .reduce((sum, record) => sum + record.amount, 0);
      
      const totalExpense = dayRecords
        .filter(record => record.type === 'expense')
        .reduce((sum, record) => sum + record.amount, 0);
      
      return {
        date,
        totalIncome,
        totalExpense,
        netAmount: totalIncome - totalExpense,
        recordCount: dayRecords.length,
      };
    } catch (error) {
      console.error('获取日统计失败:', error);
      return {
        date,
        totalIncome: 0,
        totalExpense: 0,
        netAmount: 0,
        recordCount: 0,
      };
    }
  }

  // 获取指定月份的账单统计
  static async getMonthStats(year: number, month: number): Promise<MonthBillingStats> {
    try {
      const records = await StorageService.getBillingRecords();
      const monthRecords = records.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getFullYear() === year && recordDate.getMonth() + 1 === month;
      });

      const totalIncome = monthRecords
        .filter(record => record.type === 'income')
        .reduce((sum, record) => sum + record.amount, 0);
      
      const totalExpense = monthRecords
        .filter(record => record.type === 'expense')
        .reduce((sum, record) => sum + record.amount, 0);

      // 按日期分组统计
      const dailyStatsMap = new Map<string, DayBillingStats>();
      
      monthRecords.forEach(record => {
        const dayStats = dailyStatsMap.get(record.date) || {
          date: record.date,
          totalIncome: 0,
          totalExpense: 0,
          netAmount: 0,
          recordCount: 0,
        };

        if (record.type === 'income') {
          dayStats.totalIncome += record.amount;
        } else {
          dayStats.totalExpense += record.amount;
        }
        
        dayStats.recordCount++;
        dayStats.netAmount = dayStats.totalIncome - dayStats.totalExpense;
        dailyStatsMap.set(record.date, dayStats);
      });

      const dailyStats = Array.from(dailyStatsMap.values())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return {
        year,
        month,
        totalIncome,
        totalExpense,
        netAmount: totalIncome - totalExpense,
        recordCount: monthRecords.length,
        dailyStats,
      };
    } catch (error) {
      console.error('获取月统计失败:', error);
      return {
        year,
        month,
        totalIncome: 0,
        totalExpense: 0,
        netAmount: 0,
        recordCount: 0,
        dailyStats: [],
      };
    }
  }

  // 获取指定日期范围内的账单统计
  static async getDateRangeStats(startDate: string, endDate: string): Promise<DayBillingStats[]> {
    try {
      const records = await StorageService.getBillingRecords();
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const rangeRecords = records.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= start && recordDate <= end;
      });

      const dailyStatsMap = new Map<string, DayBillingStats>();
      
      rangeRecords.forEach(record => {
        const dayStats = dailyStatsMap.get(record.date) || {
          date: record.date,
          totalIncome: 0,
          totalExpense: 0,
          netAmount: 0,
          recordCount: 0,
        };

        if (record.type === 'income') {
          dayStats.totalIncome += record.amount;
        } else {
          dayStats.totalExpense += record.amount;
        }
        
        dayStats.recordCount++;
        dayStats.netAmount = dayStats.totalIncome - dayStats.totalExpense;
        dailyStatsMap.set(record.date, dayStats);
      });

      return Array.from(dailyStatsMap.values())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error) {
      console.error('获取日期范围统计失败:', error);
      return [];
    }
  }

  // 格式化金额显示
  static formatAmount(amount: number): string {
    if (amount === 0) return '';
    return amount > 0 ? `+${amount.toFixed(0)}` : amount.toFixed(0);
  }

  // 获取金额显示颜色
  static getAmountColor(amount: number): string {
    if (amount > 0) return '#34C759'; // 绿色 - 收入
    if (amount < 0) return '#FF3B30'; // 红色 - 支出
    return '#999999'; // 灰色 - 无数据
  }
}
