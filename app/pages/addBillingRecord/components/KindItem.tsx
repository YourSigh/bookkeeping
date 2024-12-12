import { View, Text, StyleSheet } from "react-native";

interface KindItemProps {
  isSelected: boolean;
  icon: string;
  label: string;
  id: number|string;
}

export default function KindItem(props: KindItemProps) {
  return <View style={styles.kinditem}>KindItem</View>;
}

const styles = StyleSheet.create({
  kinditem: {},
});
