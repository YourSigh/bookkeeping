import React from'react';
import { View, Text, StyleSheet } from'react-native';

interface Props {
  isSelect: boolean,
  consume: number,
  date: number,
}

const CalendarItem: React.FC<Props> = ({isSelect, consume, date}) => {
  return (
    <View style={[isSelect? styles.selected: null, styles.calendarItem]}>
      <Text style={[{color: isSelect ? '#1daa1d': 'black'}, styles.textDate]}>{date}</Text>
      <Text style={{color: consume >= 0 ? 'red': 'green'}}>{consume >= 0 ? '+' + consume : consume}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    selected: {
        borderRadius: 30,
        backgroundColor: '#ccffaa',
        color: '#fff',
    },
    calendarItem: {
        padding: 10,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textDate: {
        fontSize: 20,
    }
});

export default CalendarItem;