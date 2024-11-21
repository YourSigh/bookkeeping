import React, { useState, useRef } from "react";
import { TextInput, StyleSheet, View, Animated, TextInputProps } from "react-native";

interface BaseInputProps extends TextInputProps {
  placeholder?: string;
  value: string;
  placeholderStyle?: any;
}

const BaseInput = ({ placeholder, value, placeholderStyle, ...props }: BaseInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const placeholderPosition = useRef(new Animated.Value(10)).current;
  const placeholderFontSize = useRef(new Animated.Value(16)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(placeholderPosition, {
        toValue: -12, // 移动到边框左上角
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.parallel([
        Animated.timing(placeholderPosition, {
          toValue: 12, // 恢复到初始位置
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const handleChange = (text: string) => {
    if (props?.keyboardType === 'decimal-pad') {
        // 过滤非数字和小数点
        const filteredText = text.replace(/[^0-9.]/g, '');
        props.onChangeText && props.onChangeText(filteredText);
    } else {
        props.onChangeText && props.onChangeText(text);
    }
  }

  return (
    <View style={[styles.container, isFocused && styles.containerFocused]}>
      {/* 动态的占位符 */}
      {placeholder && <Animated.Text
        style={[
          styles.placeholder,
          {
            transform: [{ translateY: placeholderPosition }],
            fontSize: placeholderFontSize,
            color: isFocused ? "#1daa1d" : "#999",
          },
          placeholderStyle,
        ]}
      >
        {placeholder}
      </Animated.Text>}

      {/* 输入框 */}
      <TextInput
        style={styles.input}
        selectionColor="#1daa1d"
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        {...props}
        onChangeText={handleChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderColor: "#ccc",
    margin: 12,
  },
  containerFocused: {
    borderColor: "#1daa1d",
  },
  placeholder: {
    position: "absolute",
    lineHeight: 24,
    left: 15,
    zIndex: 1, // 确保在边框上方
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 8, // 给文字两边留一点空间
  },
  input: {
    fontSize: 16,
    padding: 0,
    margin: 0,
  },
});

export default BaseInput;
