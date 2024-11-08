import React, { useState, useRef } from "react";
import { View, Text, PanResponder, Animated, Dimensions } from "react-native";

// 链表节点定义
class ListNode {
	value: any;
	next: ListNode | null;
	prev: ListNode | null;

	constructor(value: any) {
		this.value = value;
		this.next = null;
		this.prev = null;
	}
}

interface ImageSliderProps {
	data?: Array<any> | null;
	element?: (item: any) => JSX.Element | null;
	handleRightslide?: () => Array<any> | void;
	handleLeftslide?: () => Array<any> | void;
}

const ImageSlider = ({
	data = null,
	element,
	handleRightslide,
	handleLeftslide,
}: ImageSliderProps) => {
	const screenWidth = Dimensions.get("window").width;
	const threshold = screenWidth / 4; // 滑动超过四分之一屏幕宽度则切换
	const position = useRef(new Animated.Value(0)).current;
	const [containerWidth, setContainerWidth] = useState(0);

	// 初始化链表
	const node0 = new ListNode((data && data[0]) || 0);
	const node1 = new ListNode((data && data[1]) || 1);
	const node2 = new ListNode((data && data[2]) || 2);
	node0.next = node1;
	node1.next = node2;
	node2.prev = node1;
	node1.prev = node0;

	const [currentNode, setCurrentNode] = useState<ListNode | null>(node1);

	// 定义手势响应器
	const panResponder = PanResponder.create({
		onMoveShouldSetPanResponder: (_evt, gestureState) => {
			return Math.abs(gestureState.dx) > 20;
		},
		onPanResponderMove: Animated.event([null, { dx: position }], {
			useNativeDriver: false,
		}),
		onPanResponderRelease: (_evt, gestureState) => {
			if (gestureState.dx > threshold) {
				goToPreviousNode();
			} else if (gestureState.dx < -threshold) {
				goToNextNode();
			} else {
				// 如果没有滑动超过阈值，重置位置
				Animated.spring(position, {
					toValue: 0,
					useNativeDriver: false,
				}).start();
			}
		},
	});

	// 切换到下一个节点并更新链表，创建新节点
	const goToNextNode = () => {
		if (currentNode && currentNode.next) {
			// 滑动到下一个节点
			Animated.timing(position, {
				toValue: -containerWidth,
				duration: 300,
				useNativeDriver: false,
			}).start(() => {
				position.setValue(0);
				let newNodeValue;
				if (handleLeftslide) {
					newNodeValue = handleLeftslide();
				} else {
					newNodeValue = currentNode.next && currentNode.next.value + 1; // 新节点的值
				}

				let newNode = new ListNode(newNodeValue);
				newNode.prev = currentNode.next;
				newNode.next = currentNode.next?.next || null;

				if (currentNode.next?.next) {
					currentNode.next.next.prev = newNode;
				}

				currentNode.next && (currentNode.next.next = newNode);

				// 更新currentNode为新节点
				setCurrentNode(currentNode.next); // 这里确保 currentNode 非 null
			});
		}
	};

	// 切换到上一个节点并更新链表，创建新节点
	const goToPreviousNode = () => {
		if (currentNode && currentNode.prev) {
			// 滑动到上一个节点
			Animated.timing(position, {
				toValue: containerWidth,
				duration: 300,
				useNativeDriver: false,
			}).start(() => {
				position.setValue(0);

				let newNodeValue;
				if (handleRightslide) {
					newNodeValue = handleRightslide();
				} else {
					newNodeValue = currentNode.prev && currentNode.prev.value - 1; // 新节点的值
				}
				let newNode = new ListNode(newNodeValue);
				newNode.next = currentNode.prev;
				newNode.prev = currentNode.prev?.prev || null;

				if (currentNode.prev?.prev) {
					currentNode.prev.prev.next = newNode;
				}

				currentNode.prev && (currentNode.prev.prev = newNode);

				// 更新currentNode为新节点
				setCurrentNode(currentNode.prev); // 这里确保 currentNode 非 null
			});
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
			<View style={{ width: "100%", overflow: "hidden" }}>
				<Animated.View
					{...panResponder.panHandlers}
					style={{
						transform: [{ translateX: position }],
						width: containerWidth * 3, // 内部容器宽度为3倍屏幕宽度
						flexDirection: "row",
						marginLeft: -containerWidth, // 初始位置使第二个元素居中
					}}
				>
					{/* 显示前一个节点 */}
					<View
						style={{
							width: containerWidth,
							alignItems: "center",
						}}
					>
						<View>
							{(element && element(currentNode && currentNode.prev? currentNode.prev.value: null)) || 
								(<Text style={{ fontSize: 50 }}>
									{currentNode && currentNode.prev? currentNode.prev.value: null}
								</Text>)}
						</View>
					</View>

					{/* 显示当前节点 */}
					<View
						style={{
							width: containerWidth,
							alignItems: "center",
						}}
					>
						<View>
							{(element && element(currentNode ? currentNode.value : null)) || 
								(<Text style={{ fontSize: 50 }}>
									{currentNode ? currentNode.value : null}
								</Text>)}
						</View>
					</View>

					{/* 显示下一个节点 */}
					<View
						style={{
							width: containerWidth,
							alignItems: "center",
						}}
					>
						<View>
							{(element && element(currentNode && currentNode.next ? currentNode.next.value : null)) || 
								(<Text style={{ fontSize: 50 }}>
									{currentNode && currentNode.next ? currentNode.next.value : null}
								</Text>)}
						</View>
					</View>
				</Animated.View>
			</View>
		</View>
	);
};

export default ImageSlider;
