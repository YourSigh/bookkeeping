import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CalendarHeader from "./components/CalendarHeader";
import CalendarItem from "./components/CalendarItem";
import { generateCalendar, weekMap } from "@/app/pages/tool/utils/day";
import { useState, useEffect, useCallback } from "react";
import ImageSlider from "@/components/ImageSlider";
import { BillingStatsService, DayBillingStats } from "@/utils/billingStats";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";

// 生成日历数据，并自动填充周日到第一个元素之间的数据
const getMounthData = (year: number, month: number) => {
	const data = generateCalendar(year, month);
	const firstDay = data[0].weekday;
	for (let i = 0; i < firstDay; i++) {
		data.unshift({
			day: 0,
			weekday: i,
			year: year,
			month: month,
			isThisMonth: false,
			timestamp: 0,
		});
	}
	return data;
};

// 生成上个月数据
const lastMounthData = (year: number, month: number) => {
	if (month === 1) {
		return getMounthData(year - 1, 12);
	} else {
		return getMounthData(year, month - 1);
	}
};

// 生成下个月数据
const nextMounthData = (year: number, month: number) => {
	if (month === 12) {
		return getMounthData(year + 1, 1);
	} else {
		return getMounthData(year, month + 1);
	}
};

// 生成星期元素
const weekElement = () => {
	const weekElement = [];
	for (let i = 0; i < 7; i++) {
		weekElement.push(
			<Text
				key={i}
				style={styles.calendarItem}
			>
				{weekMap[i]}
			</Text>
		);
	}
	return weekElement;
};

export default function Calendar() {
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? 'light'];
	
	const currentDate = new Date();
	const [year, setYear] = useState(currentDate.getFullYear());
	const [month, setMonth] = useState(currentDate.getMonth() + 1);

	// 使用 useState 来存储日历数据
	const [calendarData, setCalendarData] = useState([
		lastMounthData(year, month),
		getMounthData(year, month),
		nextMounthData(year, month),
	]);

	// 存储账单统计数据
	const [billingStats, setBillingStats] = useState<Map<string, DayBillingStats>>(new Map());
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setCalendarData([
			lastMounthData(year, month),
			getMounthData(year, month),
			nextMounthData(year, month),
		]);
		loadBillingStats();
	}, [year, month]);

	// 加载账单统计数据
	const loadBillingStats = async () => {
		setLoading(true);
		try {
			const monthStats = await BillingStatsService.getMonthStats(year, month);
			const statsMap = new Map<string, DayBillingStats>();
			
			monthStats.dailyStats.forEach(dayStat => {
				statsMap.set(dayStat.date, dayStat);
			});
			
			setBillingStats(statsMap);
		} catch (error) {
			console.error('加载账单统计失败:', error);
		} finally {
			setLoading(false);
		}
	};

	// 处理滑动事件
	const handleSlide = useCallback((direction: "left" | "right") => {
		if (direction === "right") {
			if (month === 1) {
				setYear(year - 1);
				setMonth(12);
				return lastMounthData(year - 1, 12);
			} else {
				setMonth(month - 1);
				return lastMounthData(year, month - 1);
			}
		} else {
			if (month === 12) {
				setYear(year + 1);
				setMonth(1);
				return nextMounthData(year + 1, 1);
			} else {
				setMonth(month + 1);
				return nextMounthData(year, month + 1);
			}
		}
	}, [year, month]);

	// 获取指定日期的账单数据
	const getDayBillingData = (day: any) => {
		if (!day.isThisMonth || day.day === 0) {
			return { amount: 0, hasData: false };
		}
		
		const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.day.toString().padStart(2, '0')}`;
		const dayStats = billingStats.get(dateStr);
		
		if (dayStats) {
			return {
				amount: dayStats.netAmount,
				hasData: true,
				income: dayStats.totalIncome,
				expense: dayStats.totalExpense,
				recordCount: dayStats.recordCount,
			};
		}
		
		return { amount: 0, hasData: false };
	};

	// 处理日期点击事件
	const handleDateClick = (day: any) => {
		if (!day.isThisMonth || day.day === 0) {
			return;
		}
		
		const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.day.toString().padStart(2, '0')}`;
		router.push({
			pathname: '/pages/billingDetail',
			params: { date: dateStr }
		});
	};

	const [selectedDate, setSelectedDate] = useState<number | null>(
		new Date(new Date().setHours(0, 0, 0, 0)).getTime()
	);

	const MemoizedCalendarItem = React.memo(CalendarItem);
	return (
		<View style={[styles.calendar, { backgroundColor: colors.background }]}>
			<CalendarHeader date={selectedDate || Date.now()} />
			<View style={styles.calendarContainer}>{weekElement()}</View>
			<ImageSlider
				data={calendarData}
				element={(item) => (
					<View style={styles.calendarContainer}>
						{item && item.map((day: any, index: number) => {
							const billingData = getDayBillingData(day);
							return (
								<MemoizedCalendarItem
									key={index}
									consume={billingData.amount}
									date={day.day}
									timestamp={day.timestamp}
									isSelect={day.timestamp === selectedDate}
									isThisMonth={day.isThisMonth}
									onClick={() => {
										setSelectedDate(day.timestamp);
										handleDateClick(day);
									}}
									hasData={billingData.hasData}
									income={billingData.income || 0}
									expense={billingData.expense || 0}
									recordCount={billingData.recordCount || 0}
								/>
							);
						})}
					</View>
				)}
				handleRightslide={() => handleSlide("right")}
				handleLeftslide={() => handleSlide("left")}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	calendar: {
		width: "100%",
		height: "100%",
		padding: 10,
	},
	calendarContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	calendarItem: {
		width: "14.28%",
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
		color: "#999",
		height: 20,
		lineHeight: 20,
		fontSize: 10,
	},
});
