import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Picker bileşeni için import

import { useBooks } from './BookContext'; // Kitap context'i için custom hook

// SummaryScreen bileşeni
const SummaryScreen = () => {
  // BookContext'ten okunan kitaplar ve kitap durumunu güncelleme işlevlerini alıyoruz
  const { readBooks, markBookAsRead } = useBooks();
  
  // Seçilen kitabın ID'sini ve özetini tutmak için state'ler
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [summary, setSummary] = useState('');

  // Kaydetme işlemini gerçekleştiren fonksiyon
  const handleSave = () => {
    // Seçilen kitap ID'si ve özet varsa
    if (selectedBookId && summary) {
      // Seçilen kitabı bul
      const bookToUpdate = readBooks.find(book => book.id === selectedBookId);
      
      // Kitap bulunduysa, özetle birlikte güncelle
      if (bookToUpdate) {
        markBookAsRead({ ...bookToUpdate, summary });
        
        // Özet alanını temizle
        setSummary('');
        // Seçilen kitabı sıfırla
        setSelectedBookId(null);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Okunan Kitaplar</Text>
      
      {/* Kitap seçimi için Picker bileşeni */}
      <Picker
        selectedValue={selectedBookId}
        onValueChange={(itemValue) => setSelectedBookId(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Kitap seçin..." value={null} />
        {/* Okunan kitapları listele */}
        {readBooks.map((book) => (
          <Picker.Item key={book.id} label={book.title} value={book.id} />
        ))}
      </Picker>

      {/* Seçilen kitap varsa, özet yazma alanını göster */}
      {selectedBookId && (
        <View style={styles.summaryContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Kitabın özetini yazın..."
            value={summary}
            onChangeText={setSummary}
            multiline
          />
          <Button title="Kaydet" onPress={handleSave} />
        </View>
      )}
    </View>
  );
};

// Stil tanımları
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  summaryContainer: {
    marginTop: 16,
  },
  textInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
  },
});

export default SummaryScreen;
