export interface Address {
  id: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  type: 'HOME' | 'WORK' | 'OTHER';
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  addresses: Address[];
  rewardPoints: number;
}
