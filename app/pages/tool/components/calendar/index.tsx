import React from'react';
import { View, Text, StyleSheet } from'react-native';
import CalendarHeader from'./components/CalendarHeader';

export default function Calendar() {
  return (
    <View style={styles.calendar}>
      <CalendarHeader date={Date.now()} />
    </View>
  );
}

const styles = StyleSheet.create({
    calendar: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        padding: 10,
    }
});