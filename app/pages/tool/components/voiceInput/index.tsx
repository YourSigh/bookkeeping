import React, { Suspense } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

/**
 * 语音识别依赖原生模块，在 Expo Go 中会报错 "Cannot find native module 'ExpoSpeechRecognition'"。
 * 使用懒加载 + 错误处理：加载失败或运行时报错时显示说明，引导用户使用开发构建。
 */
function VoiceInputFallback() {
  return (
    <View style={styles.container}>
      <View style={styles.fallbackBox}>
        <Text style={styles.fallbackTitle}>无法使用语音识别</Text>
        <Text style={styles.fallbackDesc}>
          语音识别依赖原生模块，无法在 Expo Go 中运行。请使用开发构建：
        </Text>
        <Text style={styles.fallbackCode}>npx expo run:ios</Text>
        <Text style={styles.fallbackCode}>npx expo run:android</Text>
      </View>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={20} color="#333" />
        <Text style={styles.backBtnText}>返回上一页</Text>
      </TouchableOpacity>
    </View>
  );
}

class VoiceInputErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError = () => ({ hasError: true });

  componentDidCatch(error: Error) {
    if (error?.message?.includes('ExpoSpeechRecognition') || error?.message?.includes('native module')) {
      this.setState({ hasError: true });
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const VoiceInputContent = React.lazy(() =>
  import('./VoiceInputContent').catch(() => ({ default: VoiceInputFallback }))
);

export default function VoiceInput() {
  return (
    <VoiceInputErrorBoundary fallback={<VoiceInputFallback />}>
      <Suspense fallback={
        <View style={styles.container}>
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      }>
        <VoiceInputContent />
      </Suspense>
    </VoiceInputErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
  },
  fallbackBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    maxWidth: 320,
  },
  fallbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  fallbackDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  fallbackCode: {
    fontSize: 13,
    color: '#1daa1d',
    marginBottom: 4,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backBtnText: {
    fontSize: 16,
    color: '#333',
  },
});
