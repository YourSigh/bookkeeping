import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CalendarHeader from "./components/CalendarHeader";
import CalendarItem from "./components/CalendarItem";
import { generateCalendar, weekMap } from '@/app/pages/tool/utils/day'
import { useState, useEffect } from "react";

export default function Calendar() {
	const currentDate = new Date();
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth() + 1;

	const calendarData = generateCalendar(year, month);
	// 给第一个元素前面添加周日到第一个元素之间的元素
	const firstDay = calendarData[0].weekday;
	for (let i = 0; i < firstDay; i++) {
		calendarData.unshift({ day: 0, weekday: i, year: year, month: month, isThisMonth: false });
	}
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

	const [selectedDate, setSelectedDate] = useState<number | null>(currentDate.getDate());
	return (
		<View style={styles.calendar}>
			<CalendarHeader date={Date.now()} />
			<View style={styles.calendarContainer}>
				{weekElement}
			</View>
			<View style={styles.calendarContainer}>
				{calendarData.map((day, index) => (
					<CalendarItem 
						key={index}
						consume={randomNumbers[index]} 
						date={day.day} 
						isSelect={day.day === selectedDate}
						isThisMonth={day.isThisMonth}
						onClick={() => setSelectedDate(day.day)}
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
