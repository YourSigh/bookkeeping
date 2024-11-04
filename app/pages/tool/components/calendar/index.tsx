import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CalendarHeader from "./components/CalendarHeader";
import CalendarItem from "./components/CalendarItem";
import { generateCalendar, weekMap } from '@/app/pages/tool/utils/day'
import { useState, useEffect } from "react";

// 生成日历数据，并自动填充周日到第一个元素之间的数据
const getMounthData = (year: number, month: number) => {
	const data = generateCalendar(year, month);
	const firstDay = data[0].weekday;
	for (let i = 0; i < firstDay; i++) {
		data.unshift({ day: 0, weekday: i, year: year, month: month, isThisMonth: false, timestamp: 0 });
	}
	return data;
}

export default function Calendar() {
	const currentDate = new Date();
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth() + 1;

	const calendarData = getMounthData(year, month);
	const weekElement = [];
	for (let i = 0; i < 7; i++) {
		weekElement.push(
			<Text key={i} style={styles.calendarItem}>
				{weekMap[i]}
			</Text>
		);
	}
	// 使用 useState 来存储随机数
	const [randomNumbers, setRandomNumbers] = useState<number[]>([]);

	useEffect(() => {
	  const numbers = calendarData.map(() => Math.floor(Math.random() * 201) - 100);
	  setRandomNumbers(numbers);
	}, []);

	const [selectedDate, setSelectedDate] = useState<number | null>(new Date(new Date().setHours(0, 0, 0, 0)).getTime());
	return (
		<View style={styles.calendar}>
			<CalendarHeader date={ selectedDate || Date.now()} />
			<View style={styles.calendarContainer}>
				{weekElement}
			</View>
			<View style={styles.calendarContainer}>
				{calendarData.map((day, index) => (
					<CalendarItem 
						key={index}
						consume={randomNumbers[index]} 
						date={day.day} 
						isSelect={day.timestamp === selectedDate}
						isThisMonth={day.isThisMonth}
						onClick={() => setSelectedDate(day.timestamp)}
					/>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	calendar: {
		width: "100%",
		height: "100%",
		backgroundColor: "#fff",
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
	}
});
