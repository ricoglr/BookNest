import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { FAB, Portal, Modal, Provider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setKitaplar, addKitap, updateKitap } from '../kitapSlice';
import { Kitap } from '../kitapTypes'; 

const STORAGE_KEY = '@kitaplar';

const ToReadScreen = () => {
  // State tanımlamaları
  const [kitapAdı, setKitapAdı] = useState<string>('');
  const [yazar, setYazar] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const kitaplar = useSelector((state: RootState) => state.kitaplar.kitaplar);
  const dispatch = useDispatch();

  // Kitapları AsyncStorage'dan yükle
  useEffect(() => {
    loadKitaplar();
  }, []);

  const loadKitaplar = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue) {
        dispatch(setKitaplar(JSON.parse(jsonValue)));
      }
    } catch (error) {
      console.error("Kitaplar yüklenirken bir hata oluştu:", error);
    }
  };

  // Kitapları AsyncStorage'a kaydet
  const saveKitaplar = async (kitaplar: Kitap[]) => {
    try {
      const jsonValue = JSON.stringify(kitaplar);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error("Kitaplar kaydedilirken bir hata oluştu:", error);
    }
  };

  // Yeni kitap ekle
  const ekleKitap = () => {
    if (kitapAdı.trim() && yazar.trim()) {
      const yeniKitap: Kitap = { id: Math.random().toString(), kitapAdı, yazar, durum: 'bekliyor' };
      dispatch(addKitap(yeniKitap));
      saveKitaplar([...kitaplar, yeniKitap]);
      setKitapAdı('');
      setYazar('');
      hideModal();
    }
  };

  // Kitap durumunu güncelle
  const guncelleDurum = (id: string, yeniDurum: 'bekliyor' | 'okunuyor' | 'okundu') => {
    const kitap = kitaplar.find(k => k.id === id);
    if (kitap) {
      const güncellenmişKitap = { ...kitap, durum: yeniDurum };
      dispatch(updateKitap(güncellenmişKitap));
      saveKitaplar(kitaplar.map(k => (k.id === id ? güncellenmişKitap : k)));
    }
  };

  // Kitap sıralamasını güncelle
  const onDragEnd = ({ data }: { data: Kitap[] }) => {
    dispatch(setKitaplar(data));
    saveKitaplar(data);
  };

  // Modal görünürlüğünü kontrol et
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  // Kitapları render et
  const renderItem = ({ item, drag, isActive }: { item: Kitap, drag: () => void, isActive: boolean }) => (
    <ScaleDecorator>
      <TouchableOpacity
        style={[
          styles.item,
          styles[item.durum],
          isActive && styles.itemActive
        ]}
        onLongPress={drag}
        onPress={() => {
          const durumlar: ('bekliyor' | 'okunuyor' | 'okundu')[] = ['bekliyor', 'okunuyor', 'okundu'];
          const mevcutDurumIndex = durumlar.indexOf(item.durum);
          const yeniDurum = durumlar[(mevcutDurumIndex + 1) % durumlar.length];
          guncelleDurum(item.id, yeniDurum);
        }}
      >
        <Text style={styles.text}>{item.kitapAdı}</Text>
        <Text style={styles.subText}>Yazar: {item.yazar}</Text>
        <Text style={styles.status}>Durum: {item.durum.charAt(0).toUpperCase() + item.durum.slice(1)}</Text>
      </TouchableOpacity>
    </ScaleDecorator>
  );

  // Render edilen bileşen
  return (
    <Provider>
      <View style={styles.container}>
        <DraggableFlatList
          data={kitaplar}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onDragEnd={onDragEnd}
        />

        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
            <TextInput
              style={styles.input}
              placeholder="Kitap Adı"
              value={kitapAdı}
              onChangeText={setKitapAdı}
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              placeholder="Yazar"
              value={yazar}
              onChangeText={setYazar}
              placeholderTextColor="#aaa"
            />
            <Button title="Kitap Ekle" onPress={ekleKitap} color="#2196F3" />
          </Modal>
        </Portal>

        <FAB
          style={styles.fab}
          small
          icon={({ size, color }) => <MaterialCommunityIcons name="plus" size={size} color={color} />}
          onPress={showModal}
        />
      </View>
    </Provider>
  );
};

// Stil tanımları
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fafafa',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 16,
    color: '#000',
    borderRadius: 8,
    fontSize: 16,
  },
  item: {
    padding: 20,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemActive: {
    transform: [{ scale: 1.02 }],
    backgroundColor: '#f0f0f0',
  },
  bekliyor: {
    borderLeftColor: '#007bff',
    borderLeftWidth: 5,
  },
  okunuyor: {
    borderLeftColor: '#ff5722',
    borderLeftWidth: 5,
  },
  okundu: {
    borderLeftColor: '#4caf50',
    borderLeftWidth: 5,
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
  status: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#2196F3',
    elevation: 8,
    borderRadius: 50,
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ToReadScreen;
