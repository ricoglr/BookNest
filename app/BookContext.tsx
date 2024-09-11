import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Kitap nesnesinin yapısını tanımlayan tip
type Kitap = {
  id: string;
  kitapAdı: string;
  yazar: string;
  durum: 'bekliyor' | 'okunuyor' | 'okundu'; // Kitap durumları
};

// Kitaplar ile ilgili işlemler ve verileri tanımlayan context tipi
type BookContextType = {
  kitaplar: Kitap[]; // Kitapların listesi
  setKitaplar: React.Dispatch<React.SetStateAction<Kitap[]>>; // Kitapları güncellemek için kullanılan fonksiyon
  loadKitaplar: () => Promise<void>; // Kitapları yükleyen fonksiyon
  saveKitaplar: (kitaplar: Kitap[]) => Promise<void>; // Kitapları kaydeden fonksiyon
};

// AsyncStorage anahtarı
const STORAGE_KEY = '@kitaplar';

// Kitaplar için oluşturulan context
export const BookContext = createContext<BookContextType | undefined>(undefined);

// Kitapları yönetmek için kullanılan context sağlayıcısı
export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Kitapların tutulduğu state
  const [kitaplar, setKitaplar] = useState<Kitap[]>([]);

  // AsyncStorage'dan kitapları yükleyen fonksiyon
  const loadKitaplar = async () => {
    try {
      // AsyncStorage'dan veri al
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      // Veri varsa, JSON'dan kitaplar listesine çevir ve state'e set et
      if (jsonValue != null) {
        setKitaplar(JSON.parse(jsonValue));
      }
    } catch (e) {
      // Hata durumunda konsola hata mesajı yaz
      console.error("Kitaplar yüklenirken bir hata oluştu:", e);
    }
  };

  // Kitapları AsyncStorage'a kaydeden fonksiyon
  const saveKitaplar = async (kitaplar: Kitap[]) => {
    try {
      // Kitapları JSON formatına çevir
      const jsonValue = JSON.stringify(kitaplar);
      // JSON veriyi AsyncStorage'a kaydet
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      // Hata durumunda konsola hata mesajı yaz
      console.error("Kitaplar kaydedilirken bir hata oluştu:", e);
    }
  };

  // Component mount edildiğinde kitapları yükle
  useEffect(() => {
    loadKitaplar();
  }, []);

  return (
    // Context sağlayıcısı, children'ları ve context değerini sağlar
    <BookContext.Provider value={{ kitaplar, setKitaplar, loadKitaplar, saveKitaplar }}>
      {children}
    </BookContext.Provider>
  );
};
