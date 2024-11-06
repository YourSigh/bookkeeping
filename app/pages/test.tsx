import React, { useRef } from "react";
import {
	View,
	FlatList,
	Dimensions,
	NativeScrollEvent,
	NativeSyntheticEvent,
	Text,
} from "react-native";

const { width } = Dimensions.get("window");

const ImageSlider = ({data = null, item = null}) => {
	const flatListRef = useRef<FlatList<any> | null>(null);
	console.log(data)
	const dataRef = useRef(data || [1, 2, 3]);

	const handleScrollEnd = (
		event: NativeSyntheticEvent<NativeScrollEvent>
	) => {
		const currentOffsetX = event.nativeEvent.contentOffset.x;
		const layoutWidth = event.nativeEvent.layoutMeasurement.width;

		if (currentOffsetX === layoutWidth) {
			return;
		} else if (currentOffsetX === 0) {
			// 右滑
			dataRef.current = dataRef.current.map((item) => item - 1);
		} else {
			// 左滑
			dataRef.current = dataRef.current.map((item) => item + 1);
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
				data={dataRef.current}
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
						<Text style={{ fontSize: 32 }}>{item.day}</Text>
					</View>
				)}
			/>
		</View>
	);
};

export default ImageSlider;
