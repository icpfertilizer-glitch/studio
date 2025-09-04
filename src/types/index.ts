export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  status: 'active' | 'blocked';
}

export interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  isActive: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  userDisplayName: string;
  topic: string;
  contactNumber: string;
  date: string; // "yyyy-MM-dd"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}
