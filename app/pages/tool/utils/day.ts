// 根据传入的年和月生成当月的数据
export function generateCalendar(year: number, month: number) {
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
            isThisMonth: date.getMonth() === adjustedMonth,
		});
	}

	return calendar;
}

export const weekMap: Record<number, string> = {
	0: "日",
	1: "一",
	2: "二",
	3: "三",
	4: "四",
	5: "五",
	6: "六",
};
