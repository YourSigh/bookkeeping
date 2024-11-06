import React, { useRef, useState } from "react";
import {
	View,
	FlatList,
	Dimensions,
	NativeScrollEvent,
	NativeSyntheticEvent,
	Text,
} from "react-native";

const { width } = Dimensions.get("window");

const ImageSlider = () => {
	const flatListRef = useRef<FlatList<any> | null>(null);
	const [data, setData] = useState([1, 2, 3]);

	const handleScrollEnd = (
		event: NativeSyntheticEvent<NativeScrollEvent>
	) => {
		const currentOffsetX = event.nativeEvent.contentOffset.x;
		if (currentOffsetX === event.nativeEvent.layoutMeasurement.width) {
			return;
		} else if (currentOffsetX === 0) {
			// 右滑
			const newData = data.map((item) => item - 1);
			setData(newData);
		} else {
			// 左滑
			const newData = data.map((item) => item + 1);
			setData(newData);
		}

		// 重置位置
		if (flatListRef.current) {
			flatListRef.current.scrollToIndex({ index: 1, animated: false });
		}
	};

	return (
		<View>
			<FlatList
				ref={flatListRef}
				data={data}
				keyExtractor={(item) => item.toString()}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onMomentumScrollEnd={handleScrollEnd}
				initialScrollIndex={1} // 初始位置设为中间
				getItemLayout={(_, index) => ({
					length: width,
					offset: width * index,
					index,
				})}
				renderItem={({ item }) => (
					<View
						style={{
							width,
							justifyContent: "center",
							alignItems: "center",
							backgroundColor: "#f0f0f0",
							padding: 20,
						}}
					>
						<Text style={{ fontSize: 32 }}>{item}</Text>
					</View>
				)}
			/>
		</View>
	);
};

export default ImageSlider;
