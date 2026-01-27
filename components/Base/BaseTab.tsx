import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface BaseTabProps {
  value: string|number;
  panes: Array<{id: string|number, title: string}>;
  content: React.ReactNode;
  onChange: (value: any) => void;
}

const BaseTab = (props: BaseTabProps) => {

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {props.panes.map(i => {
            return (
              <TouchableOpacity
                key={i.id}
                style={styles.tabItem}
                onPress={() => props.onChange(i.id)}
              >
                <Text style={i.id === props.value? styles.activeTab : styles.tabText}>
                  {i.title}
                </Text>
              </TouchableOpacity>
            )
        })}
      </View>
      <View style={styles.contentContainer}>{props.content}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ccffaa",
  },
  tabItem: {
    padding: 10,
  },
  tabText: {
    fontSize: 16,
  },
  activeTab: {
    fontSize: 16,
    color: "#1daa1d",
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    fontSize: 18,
  },
});

export default BaseTab;
