import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

interface SummaryInputProps {
  summary: string;
  setSummary: React.Dispatch<React.SetStateAction<string>>;
  handleSave: () => void;
  fontSize: number;
}

const SummaryInput: React.FC<SummaryInputProps> = ({ summary, setSummary, handleSave, fontSize }) => (
  <View style={styles.summaryContainer}>
    <TextInput
      style={[styles.textInput, { fontSize }]}
      placeholder="Kitap özeti girin..."
      value={summary}
      onChangeText={setSummary}
      multiline
    />
    <Button title="Kaydet" onPress={handleSave} color="#007BFF" />
  </View>
);

const styles = StyleSheet.create({
  summaryContainer: {
    marginTop: 20,
  },
  textInput: {
    height: 120,
    borderColor: '#d1d1d1',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
});

export default SummaryInput;
