import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import { weekMap } from "@/app/pages/tool/utils/day";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

interface Props {
	date: number;
}

const CalendarHeader: React.FC<Props> = ({ date }) => {
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? 'light'];
	
	const currentDate = new Date(date);
	return (
		<View style={styles.container}>
			<View style={{ flexDirection: "row", alignItems: "flex-end" }}>
				<Text style={[styles.headerBoldText, { color: colors.text }]}>
					{currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
					{currentDate.getDate()}日
				</Text>
				<Text style={[styles.headerText, { color: colors.text }]}>
					周{weekMap[currentDate.getDay()]}
				</Text>
			</View>
			<View>
                <Entypo name="dots-three-vertical" size={20} color={colors.text} />
            </View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 8,
	},
	headerBoldText: {
		fontSize: 20,
		fontWeight: "bold",
	},
	headerText: {
		fontSize: 14,
		opacity: 0.6,
		marginLeft: 5,
		marginBottom: 2,
	},
});

export default CalendarHeader;
