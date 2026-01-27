import AsyncStorage from '@react-native-async-storage/async-storage';
import { BillingRecord } from '@/app/pages/addBillingRecord/model/billing';

export class StorageService {
  // 保存账单记录
  static async saveBillingRecord(record: BillingRecord): Promise<void> {
    try {
      const existingRecords = await this.getBillingRecords();
      const updatedRecords = [...existingRecords, record];
      await AsyncStorage.setItem('billing_records', JSON.stringify(updatedRecords));
    } catch (error) {
      console.error('保存账单记录失败:', error);
      throw error;
    }
  }

  // 获取所有账单记录
  static async getBillingRecords(): Promise<BillingRecord[]> {
    try {
      const records = await AsyncStorage.getItem('billing_records');
      return records ? JSON.parse(records) : [];
    } catch (error) {
      console.error('获取账单记录失败:', error);
      return [];
    }
  }

  // 删除账单记录
  static async deleteBillingRecord(id: string): Promise<void> {
    try {
      const existingRecords = await this.getBillingRecords();
      const updatedRecords = existingRecords.filter(record => record.id !== id);
      await AsyncStorage.setItem('billing_records', JSON.stringify(updatedRecords));
    } catch (error) {
      console.error('删除账单记录失败:', error);
      throw error;
    }
  }

  // 更新账单记录
  static async updateBillingRecord(updatedRecord: BillingRecord): Promise<void> {
    try {
      const existingRecords = await this.getBillingRecords();
      const updatedRecords = existingRecords.map(record => 
        record.id === updatedRecord.id ? updatedRecord : record
      );
      await AsyncStorage.setItem('billing_records', JSON.stringify(updatedRecords));
    } catch (error) {
      console.error('更新账单记录失败:', error);
      throw error;
    }
  }
}
