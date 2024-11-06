import React from'react';
import { View, Text, StyleSheet, TouchableOpacity } from'react-native';

interface Props {
  isSelect: boolean,
  consume: number,
  date: number,
  timestamp: number,
  isThisMonth: boolean,
  onClick: () => void;
}

const CalendarItem: React.FC<Props> = ({isSelect, consume, date, timestamp, isThisMonth, onClick}) => {
  const isNow = timestamp === new Date(new Date().setHours(0, 0, 0, 0)).getTime()
  return (
    <TouchableOpacity onPress={onClick} style={[isSelect? (isNow? styles.nowDate : styles.selected) : null, styles.calendarItem, isThisMonth? null : styles.notThisMonth]}>
      <Text style={[{color: isNow ? '#1daa1d': 'black'}, styles.textDate]}>{date}</Text>
      <Text style={[
        { color: consume >= 0 ? 'red' : 'green' },
      ]}>
        {consume >= 0 ? '+' + consume : consume}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    selected: {
      backgroundColor: '#eee',
    },
    nowDate: {
      backgroundColor: '#ccffaa',
    },
    calendarItem: {
      padding: 10,
      width: "14.28%",
      height: 55,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
    },
    textDate: {
      fontSize: 18,
      fontWeight: 600,
    },
    notThisMonth: {
      opacity: 0,
    }
});

export default CalendarItem;