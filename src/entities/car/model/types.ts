export type CarCategory = 'sedan' | 'suv' | 'sport' | 'electric' | 'luxury';

export interface CarWorkingHours {
  start: string; // "08:00"
  end: string;   // "22:00"
}

export interface Car {
  id: string;
  name: string;          // Название (напр. "BMW M5 Competition")
  brand: string;         // Бренд (напр. "BMW")
  image: string;         // Ссылка на фото
  pricePerHour: number;  // Цена в час ($)
  category: CarCategory;
  workingHours: CarWorkingHours;
  bufferTime: number;    // Время на мойку после аренды (мин)
}