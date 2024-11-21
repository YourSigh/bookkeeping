import {
    View,
    StyleSheet,
    Text,
    Image,
    PanResponder,
    Animated,
    Dimensions,
} from "react-native";
import { useRef, useEffect } from "react";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const SuspensionBall = () => {
    const initialX = width - 80 - 10; // 初始位置的 X 坐标
    const initialY = height - 150 - 70; // 初始位置的 Y 坐标

    const pan = useRef(
        new Animated.ValueXY({ x: initialX, y: initialY })
    ).current;

    // 保存当前值
    const currentPosition = useRef({ x: initialX, y: initialY });
    const pressStartTime = useRef(0); // 记录按下的时间

    useEffect(() => {
        const xListener = pan.x.addListener((value) => {
            currentPosition.current.x = value.value;
        });
        const yListener = pan.y.addListener((value) => {
            currentPosition.current.y = value.value;
        });

        return () => {
            pan.x.removeListener(xListener);
            pan.y.removeListener(yListener);
        };
    }, [pan]);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            pressStartTime.current = Date.now(); // 记录按下时间
            // 重置偏移值
            pan.setOffset({
                x: currentPosition.current.x,
                y: currentPosition.current.y,
            });
            pan.setValue({ x: 0, y: 0 }); // 清零偏移量
        },
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
            useNativeDriver: false,
        }),
        onPanResponderRelease: (evt, gestureState) => {
            const pressDuration = Date.now() - pressStartTime.current; // 计算按下时长
            const distanceMoved = Math.sqrt(
                gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy
            ); // 计算位移距离
            if (pressDuration < 200 && distanceMoved < 10) {
                handlePress(); // 触发点击逻辑
            } else {
                const moveToRight =
                    currentPosition.current.x + gestureState.dx > width / 2; // 判断吸附方向
                const finalX = moveToRight ? width - 70 - 10 : 10; // 左右吸附边缘
                const finalY = currentPosition.current.y;

                // 重置偏移值并吸附到目标位置
                pan.flattenOffset();
                Animated.spring(pan, {
                    toValue: { x: finalX, y: finalY },
                    useNativeDriver: false,
                }).start();

                // 更新当前位置
                currentPosition.current = { x: finalX, y: finalY };
            }
        },
    });

    const handlePress = () => {
        router.push({
            pathname: "/pages/addBillingRecord",
        })
    };

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                {
                    transform: [{ translateX: pan.x }, { translateY: pan.y }],
                },
                styles.container,
            ]}
        >
            <Image
                source={require("@/assets/images/writing.jpg")}
                style={styles.ball}
            />
            <Text style={styles.text}>记一笔</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        overflow: "hidden",
        elevation: 5,
    },
    ball: {
        width: "100%",
        height: "100%",
    },
    text: {
        backgroundColor: "#ccffaa",
        opacity: 0.8,
        position: "absolute",
        bottom: 0,
        width: "100%",
        textAlign: "center",
        fontSize: 10,
        height: 18,
        color: "#1daa1d",
    },
});

export default SuspensionBall;
