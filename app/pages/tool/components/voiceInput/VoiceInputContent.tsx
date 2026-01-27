import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState, useCallback, useEffect } from 'react';
import { ExpoSpeechRecognitionModule } from 'expo-speech-recognition';
import AntDesign from '@expo/vector-icons/AntDesign';

type Sub = { remove: () => void };
const Speech = ExpoSpeechRecognitionModule as typeof ExpoSpeechRecognitionModule & {
  addListener(event: string, listener: (...args: unknown[]) => void): Sub;
};

export default function VoiceInputContent() {
  const [recognizing, setRecognizing] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');

  useEffect(() => {
    const startSub = Speech.addListener('start', () => setRecognizing(true));
    const endSub = Speech.addListener('end', () => setRecognizing(false));
    const resultSub = Speech.addListener('result', (event: unknown) => {
      const e = event as { results?: { transcript?: string }[]; isFinal?: boolean };
      const t = e.results?.[0]?.transcript ?? '';
      if (e.isFinal) {
        setFinalTranscript((prev) => (prev ? `${prev}${t}` : t));
        setInterimTranscript('');
      } else {
        setInterimTranscript(t);
      }
    });
    const errorSub = Speech.addListener('error', (event: unknown) => {
      const e = event as { error?: string };
      if (e.error !== 'aborted') {
        console.warn('Speech recognition error:', e.error);
      }
    });
    return () => {
      startSub.remove();
      endSub.remove();
      resultSub.remove();
      errorSub.remove();
    };
  }, []);

  const handleStart = useCallback(async () => {
    const result = await Speech.requestPermissionsAsync();
    if (!result.granted) {
      Alert.alert('需要权限', '请允许使用麦克风与语音识别，以便进行语音录入。');
      return;
    }
    setFinalTranscript('');
    setInterimTranscript('');
    Speech.start({
      lang: 'zh-CN',
      interimResults: true,
      continuous: false,
      // 使用设备端识别，避免因无法访问 Google/云端服务导致 network 报错（如国内网络）
      requiresOnDeviceRecognition: true,
    });
  }, []);

  const handleStop = useCallback(() => {
    Speech.stop();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.resultBox}>
        <Text style={styles.resultLabel}>语音识别内容</Text>
        <ScrollView
          style={styles.resultScroll}
          contentContainerStyle={styles.resultContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.resultText}>
            {finalTranscript + interimTranscript || (recognizing ? '正在听…' : '点击下方按钮开始录音')}
          </Text>
        </ScrollView>
      </View>

      <View style={styles.actions}>
        {!recognizing ? (
          <TouchableOpacity style={styles.recordBtn} onPress={handleStart}>
            <AntDesign name="sound" size={48} color="#fff" />
            <Text style={styles.recordBtnText}>开始录音</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.recordBtn, styles.recordBtnStop]} onPress={handleStop}>
            <AntDesign name="pausecircle" size={48} color="#fff" />
            <Text style={styles.recordBtnText}>停止录音</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={20} color="#333" />
          <Text style={styles.backBtnText}>返回上一页</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  resultBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    minHeight: 160,
  },
  resultLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  resultScroll: {
    flex: 1,
  },
  resultContent: {
    paddingBottom: 16,
  },
  resultText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 26,
  },
  actions: {
    alignItems: 'center',
    gap: 16,
  },
  recordBtn: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1daa1d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordBtnStop: {
    backgroundColor: '#e74c3c',
  },
  recordBtnText: {
    marginTop: 8,
    fontSize: 16,
    color: '#fff',
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
