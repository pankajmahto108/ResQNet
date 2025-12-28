
export type Severity = 'Low' | 'Medium' | 'High';

export interface Hospital {
  id: string;
  name: string;
  rating: number;
  distance: string;
  eta: string;
  specialization: string[];
  isEmergencyReady: boolean;
  isVerified: boolean;
  lat: number;
  lng: number;
  contact: string;
  beds: number;
  address: string;
}

export interface BloodStock {
  hospitalId: string;
  hospitalName: string;
  group: string;
  units: number;
  lastUpdated: string;
  distance: string;
}

export interface Helpline {
  id: string;
  category: 'Medical' | 'Police' | 'Fire' | 'Disaster' | 'Women';
  name: string;
  number: string;
  locationScope: string;
}

export interface Injury {
  id: string;
  title: string;
  description: string;
  steps: string[];
  dos: string[];
  donts: string[];
}
