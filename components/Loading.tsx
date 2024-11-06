import React from 'react';
import { View, Modal, ActivityIndicator, StyleSheet } from 'react-native';

interface Props {
  visible: boolean;
}

const FullScreenLoader = ({ visible }:Props) => (
  <Modal
    transparent={true}
    animationType="fade"
    visible={visible}
  >
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ccffaa" />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明背景
  },
});

export default FullScreenLoader;
