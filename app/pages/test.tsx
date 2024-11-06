import React, { useEffect, useRef, useState } from "react";
import {
	View,
	FlatList,
	Dimensions,
	NativeScrollEvent,
	NativeSyntheticEvent,
	Text,
} from "react-native";

interface ImageSliderProps {
	data?: Array<any> | null;
	element?: (item: any) => JSX.Element | null;
	handleRightslide?: () => Array<any> | void;
	handleLeftslide?: () => Array<any> | void;
}

const ImageSlider = ({data = null, element, handleRightslide, handleLeftslide}:ImageSliderProps) => {
	const flatListRef = useRef<FlatList<any> | null>(null);
	const [dataState, setDataState] = useState([1, 2, 3]);
	const [containerWidth, setContainerWidth] = useState(0);

	const handleScrollEnd = (
		event: NativeSyntheticEvent<NativeScrollEvent>
	) => {
		const currentOffsetX = event.nativeEvent.contentOffset.x;
		const layoutWidth = event.nativeEvent.layoutMeasurement.width;
		if (currentOffsetX === layoutWidth) {
			return;
		} else if (currentOffsetX === 0) {
			// 右滑
			(handleRightslide ? handleRightslide : () => {
				const newData = dataState.map((item) => item - 1)
				setDataState(newData);
			})();
		} else {
			// 左滑
			(handleLeftslide? handleLeftslide : () => {
				const newData = dataState.map((item) => item + 1)
				setDataState(newData);
			})();
		}

		// 重置位置
		if (flatListRef.current) {
			flatListRef.current.scrollToIndex({ index: 1, animated: false });
		}
	};

	return (
		<View
			style={{
				flex: 1,
			}}
			onLayout={(event) => {
				const { width } = event.nativeEvent.layout;
				setContainerWidth(width);
			}}
		>
			<FlatList
				ref={flatListRef}
				data={data || dataState}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onMomentumScrollEnd={handleScrollEnd}
				initialScrollIndex={1} // 初始位置设为中间
				getItemLayout={(_, index) => ({
					length: containerWidth,
					offset: containerWidth * index,
					index,
				})}
				renderItem={({ item }) => (
					<View
						style={{
							width: containerWidth,
							alignItems: "center",
						}}
					>
						<View>{element && element(item) || <Text style={{fontSize: 50}}>{item}</Text>}</View>
					</View>
				)}
			/>
		</View>
	);
};

export default ImageSlider;
