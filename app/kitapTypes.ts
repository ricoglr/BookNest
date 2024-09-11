// kitapTypes.ts
export type Kitap = {
    id: string;
    kitapAdı: string;
    yazar: string;
    durum: 'bekliyor' | 'okunuyor' | 'okundu';
};
