import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, Button, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateKitap } from '../kitapSlice';
import { Kitap } from '../kitapTypes';

const HomeScreen = () => {
  const kitaplar = useSelector((state: RootState) => state.kitaplar.kitaplar);
  const dispatch = useDispatch();

  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [summary, setSummary] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalContent, setModalContent] = useState<Kitap | null>(null);
  const [editSummary, setEditSummary] = useState('');

  const okunduKitaplar = kitaplar.filter(kitap => kitap.durum === 'okundu');

  const handleSave = () => {
    if (selectedBookId && summary) {
      const bookToUpdate = kitaplar.find(kitap => kitap.id === selectedBookId);
      if (bookToUpdate) {
        dispatch(updateKitap({ ...bookToUpdate, summary }));
        setSummary('');
        setSelectedBookId(null);
      }
    }
  };

  const handleEdit = () => {
    if (modalContent) {
      dispatch(updateKitap({ ...modalContent, summary: editSummary }));
      setEditSummary('');
      setShowEditModal(false);
      setShowModal(false); // Modal'ı kapat
    }
  };

  const handlePress = (kitap: Kitap) => {
    setModalContent(kitap);
    setEditSummary(kitap.summary || ''); // Detaylı özet olarak mevcut özet set edilir
    setShowModal(true);
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedBookId}
        onValueChange={(itemValue) => setSelectedBookId(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Kitap seçin..." value={null} />
        {okunduKitaplar.map((book) => (
          <Picker.Item key={book.id} label={book.kitapAdı} value={book.id} />
        ))}
      </Picker>

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

      <FlatList
        data={okunduKitaplar}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.text}>{item.kitapAdı}</Text>
            <Text style={styles.subText}>Yazar: {item.yazar}</Text>
            {item.summary ? (
              <Text style={styles.summaryText}>
                {item.summary.length > 100
                  ? `${item.summary.substring(0, 100)}...` 
                  : item.summary}
              </Text>
            ) : (
              <Text style={styles.summaryText}>Özet mevcut değil</Text>
            )}
          </TouchableOpacity>
        )}
      />

      {/* Detaylı özet kartı */}
      {modalContent && (
        <Modal
          visible={showModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{modalContent.kitapAdı}</Text>
              <Text style={styles.modalAuthor}>Yazar: {modalContent.yazar}</Text>
              <Text style={styles.modalSummary}>{modalContent.summary}</Text>
              <Button title="Düzenle" onPress={() => setShowEditModal(true)} />
              <Button title="Kapat" onPress={() => setShowModal(false)} />
            </View>
          </View>
        </Modal>
      )}

      {/* Özet düzenleme modal'ı */}
      {modalContent && (
        <Modal
          visible={showEditModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Özeti Düzenle</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Kitabın özetini güncelleyin..."
                value={editSummary}
                onChangeText={setEditSummary}
                multiline
              />
              <Button title="Kaydet" onPress={handleEdit} />
              <Button title="Kapat" onPress={() => setShowEditModal(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

// Stil tanımları
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fafafa',
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
  item: {
    padding: 20,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  summaryText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalAuthor: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  modalSummary: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;
