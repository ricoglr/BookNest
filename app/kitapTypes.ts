// kitapTypes.ts
export type Kitap = {
    id: string;
    kitapAdı: string;
    yazar: string;
    durum: 'bekliyor' | 'okunuyor' | 'okundu';
    summary?: string; // Bu özelliği ekleyin
};
