export interface SearchRoomDTO {
  checkInDate: string;
  checkOutDate: string;
  numberOfAdults: number;
  numberOfChildren: number;
  roomType: string;
}

export interface Room {
  roomId?: string;
  roomNumber: number;
  roomType: string;
  pricePerNight: number;
  roomStatus?: string;
  availability?: boolean;
  numberOfAdults: number;
  numberOfChildren: number;
  amenities?: string[];
  maxOccupancy: number;
  description?: string;
}

export interface CreateRoomDTO {
  roomNumber: number;
  roomType: string;
  pricePerNight: number;
  numberOfAdults: number;
  numberOfChildren: number;
  maxOccupancy: number;
  description: string;
}

export const ROOM_TYPES = ["standard", "deluxe", "suite", "supreme"];

export const AMENITIES = [
  "Wi-Fi",
  "TV",
  "AC",
  "Mini-Bar",
  "Room Service",
  "Balcony",
  "Sea View",
  "City View",
];
