import { View, Text, StyleSheet } from 'react-native';
import BaseSelect from '@/components/Base/BaseSelect';

export default function LandmineHeader() {
    return (
        <View>
            <BaseSelect options={[1, 2, 3]}></BaseSelect>
            <View></View>
        </View>
    )
}

const styles = StyleSheet.create({
})