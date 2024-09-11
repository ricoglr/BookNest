import React from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, Button, TouchableOpacity, Modal, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateKitap } from '../kitapSlice';
import { Kitap } from '../kitapTypes';
import { useTheme } from '../Contexts/ThemeContext';
import * as Animatable from 'react-native-animatable';
import { ActionSheetIOS } from 'react-native';

const HomeScreen = () => {
  const { theme, fontSize } = useTheme();
  const kitaplar = useSelector((state: RootState) => state.kitaplar.kitaplar);
  const dispatch = useDispatch();

  const [selectedBookId, setSelectedBookId] = React.useState<string | null>(null);
  const [summary, setSummary] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [modalContent, setModalContent] = React.useState<Kitap | null>(null);
  const [editSummary, setEditSummary] = React.useState('');

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
      setShowModal(false);
    }
  };

  const handlePress = (kitap: Kitap) => {
    setModalContent(kitap);
    setEditSummary(kitap.summary || '');
    setShowModal(true);
  };


  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#333' : '#F8F9FA' }]}>

      {selectedBookId && (
        <SummaryInput summary={summary} setSummary={setSummary} handleSave={handleSave} fontSize={fontSize} />
      )}

      <BookList books={okunduKitaplar} onPress={handlePress} fontSize={fontSize} theme={theme} />

      {modalContent && (
        <BookModal
          modalContent={modalContent}
          showModal={showModal}
          setShowModal={setShowModal}
          setShowEditModal={setShowEditModal}
          fontSize={fontSize}
          theme={theme}
        />
      )}

      {modalContent && (
        <EditModal
          modalContent={modalContent}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          editSummary={editSummary}
          setEditSummary={setEditSummary}
          handleEdit={handleEdit}
          fontSize={fontSize}
          theme={theme}
        />
      )}
    </View>
  );
};

const SummaryInput = ({ summary, setSummary, handleSave, fontSize }) => (
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

const BookList = ({ books, onPress, fontSize, theme }) => (
  <Animatable.View animation="fadeInUp" duration={600} style={styles.listContainer}>
    <FlatList
      data={books}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.item, { backgroundColor: theme === 'dark' ? '#444' : '#FFF' }]}
          onPress={() => onPress(item)}
        >
          <View style={styles.textContainer}>
            <Text style={[styles.text, { fontSize }]}>{item.kitapAdı}</Text>
            <Text style={[styles.subText, { fontSize }]}>Yazar: {item.yazar}</Text>
            <Text style={[styles.summaryText, { fontSize }]}>
              {item.summary ? (
                item.summary.length > 100 ? `${item.summary.substring(0, 100)}...` : item.summary
              ) : (
                'Özet mevcut değil'
              )}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  </Animatable.View>
);

const BookModal = ({ modalContent, showModal, setShowModal, setShowEditModal, fontSize, theme }) => (
  <Modal
    visible={showModal}
    transparent
    animationType="slide"
    onRequestClose={() => setShowModal(false)}
  >
    <View style={styles.modalContainer}>
      <View style={[styles.modalContent, { backgroundColor: theme === 'dark' ? '#555' : '#FFF' }]}>
        <Text style={[styles.modalTitle, { fontSize }]}>{modalContent.kitapAdı}</Text>
        <Text style={[styles.modalAuthor, { fontSize }]}>Yazar: {modalContent.yazar}</Text>
        <Text style={[styles.modalSummary, { fontSize }]}>{modalContent.summary}</Text>
        <View style={styles.modalButtons}>
          <Button title="Düzenle" onPress={() => setShowEditModal(true)} color="#007BFF" />
          <Button title="Kapat" onPress={() => setShowModal(false)} color="#6c757d" />
        </View>
      </View>
    </View>
  </Modal>
);

const EditModal = ({ modalContent, showEditModal, setShowEditModal, editSummary, setEditSummary, handleEdit, fontSize, theme }) => (
  <Modal
    visible={showEditModal}
    transparent
    animationType="slide"
    onRequestClose={() => setShowEditModal(false)}
  >
    <View style={styles.modalContainer}>
      <View style={[styles.modalContent, { backgroundColor: theme === 'dark' ? '#555' : '#FFF' }]}>
        <Text style={[styles.modalTitle, { fontSize }]}>Özeti Düzenle</Text>
        <TextInput
          style={[styles.textInput, { fontSize }]}
          placeholder="Özeti güncelleyin..."
          value={editSummary}
          onChangeText={setEditSummary}
          multiline
        />
        <View style={styles.modalButtons}>
          <Button title="Kaydet" onPress={handleEdit} color="#007BFF" />
          <Button title="Kapat" onPress={() => setShowEditModal(false)} color="#6c757d" />
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20, // Daha geniş padding
    backgroundColor: '#F8F9FA',
  },
  summaryContainer: {
    marginTop: 20, // Daha geniş boşluk
  },
  textInput: {
    height: 120, // Daha yüksek metin girişi alanı
    borderColor: '#d1d1d1',
    borderWidth: 1,
    borderRadius: 10, // Daha yuvarlak köşeler
    padding: 15, // Daha fazla iç boşluk
    marginBottom: 10,
  },
  item: {
    padding: 20,
    borderRadius: 20, // Daha yuvarlak kenarlar
    marginBottom: 15,
    borderColor: 'transparent', // Kenarlık yerine gölge
    shadowColor: '#000', // Gölge rengi
    shadowOffset: { width: 0, height: 2 }, // Gölge yönü
    shadowOpacity: 0.2, // Gölge opaklığı
    shadowRadius: 10, // Gölge genişliği
    backgroundColor: '#FFF',
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontWeight: '600', // Daha belirgin yazı
  },
  subText: {
    color: '#888',
    marginTop: 5,
  },
  summaryText: {
    color: '#666',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Daha hafif arka plan rengi
  },
  modalContent: {
    width: '85%', // Daha geniş modal
    padding: 25,
    borderRadius: 15, // Daha yuvarlak köşeler
  },
  modalTitle: {
    fontWeight: '600',
    marginBottom: 10,
  },
  modalAuthor: {
    color: '#666',
    marginBottom: 10,
  },
  modalSummary: {
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default HomeScreen;
