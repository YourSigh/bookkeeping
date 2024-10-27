function generateCalendar(year, month) {
	const adjustedMonth = month - 1;
	const daysInMonth = new Date(year, adjustedMonth + 1, 0).getDate();

	const calendar = [];

	for (let i = 1; i <= daysInMonth; i++) {
		const date = new Date(year, adjustedMonth, i);
		calendar.push({
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate(),
			weekday: date.getDay(), // 0 表示星期日，6 表示星期六
		});
	}

	return calendar;
}
