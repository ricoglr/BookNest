// app/screens/SettingsScreen.js
import React, { useContext } from 'react';
import { StyleSheet, View, Text, Slider, Switch, Button } from 'react-native';
import { ThemeContext } from './ThemeContext'; // Bu yolu kontrol edin

const SettingsScreen = () => {
  const { theme, fontSize, setTheme, setFontSize } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { fontSize }]}>Tema Seçimi:</Text>
      <Switch
        value={theme === 'dark'}
        onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
      />
      <Text style={[styles.label, { fontSize }]}>Font Boyutu:</Text>
      <Slider
        style={styles.slider}
        minimumValue={12}
        maximumValue={24}
        step={1}
        value={fontSize}
        onValueChange={(value) => setFontSize(value)}
      />
      <Button title="Uygula" onPress={() => { /* Uygulama işlemleri */ }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f5',
  },
  label: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  slider: {
    marginVertical: 20,
  },
});

export default SettingsScreen;
