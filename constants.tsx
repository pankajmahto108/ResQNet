
import React from 'react';
import { Hospital, Helpline, Injury, BloodStock } from './types';
import { 
  Activity, 
  MapPin, 
  Droplet, 
  PhoneCall, 
  ShieldCheck, 
  Flame, 
  Siren, 
  Stethoscope,
  Heart
} from 'lucide-react';

export const INJURIES: Injury[] = [
  {
    id: 'bleeding',
    title: 'Severe Bleeding',
    description: 'Loss of blood from wounds or injuries.',
    steps: [
      'Apply direct pressure with a clean cloth.',
      'Elevate the wound above heart level.',
      'Maintain pressure until medical help arrives.'
    ],
    dos: ['Use gloves if available', 'Keep victim calm'],
    donts: ['Remove soaked bandages', 'Apply a tourniquet unless trained']
  },
  {
    id: 'burns',
    title: 'Burns',
    description: 'Heat, chemical, or electrical damage to skin.',
    steps: [
      'Cool the burn with running cool (not cold) water for 10-20 mins.',
      'Cover loosely with sterile non-stick bandage.',
      'Seek help if skin is charred or blistered.'
    ],
    dos: ['Remove jewelry near burn area', 'Keep the person warm'],
    donts: ['Apply butter or ice', 'Pop blisters']
  },
  {
    id: 'fracture',
    title: 'Fractures',
    description: 'Broken or cracked bones.',
    steps: [
      'Immobilize the area.',
      'Apply cold packs to reduce swelling.',
      'Treat for shock if necessary.'
    ],
    dos: ['Check for circulation beyond break', 'Splint in position found'],
    donts: ['Try to realign the bone', 'Massage the area']
  }
];

export const MOCK_HOSPITALS: Hospital[] = [
  {
    id: 'h1',
    name: 'City Trauma Center',
    rating: 4.8,
    distance: '1.2 km',
    eta: '5 mins',
    specialization: ['Trauma', 'Cardiac', 'Neurology'],
    isEmergencyReady: true,
    isVerified: true,
    lat: 12.9716,
    lng: 77.5946,
    contact: '+1 800-123-4567',
    beds: 12,
    address: '12th Cross, Central Business District'
  },
  {
    id: 'h2',
    name: 'General Wellness Hospital',
    rating: 4.2,
    distance: '3.5 km',
    eta: '12 mins',
    specialization: ['General Medicine', 'Pediatrics'],
    isEmergencyReady: true,
    isVerified: true,
    lat: 12.9816,
    lng: 77.6046,
    contact: '+1 800-987-6543',
    beds: 45,
    address: 'Indiranagar Main Road'
  },
  {
    id: 'h3',
    name: 'St. Mary’s Emergency',
    rating: 4.5,
    distance: '2.1 km',
    eta: '8 mins',
    specialization: ['Burn Care', 'Orthopedics'],
    isEmergencyReady: true,
    isVerified: false,
    lat: 12.9616,
    lng: 77.5846,
    contact: '+1 800-444-5555',
    beds: 8,
    address: 'Richmond Circle'
  }
];

export const MOCK_BLOOD: BloodStock[] = [
  { hospitalId: 'h1', hospitalName: 'City Trauma Center', group: 'O+', units: 15, lastUpdated: '10m ago', distance: '1.2 km' },
  { hospitalId: 'h1', hospitalName: 'City Trauma Center', group: 'B-', units: 2, lastUpdated: '1h ago', distance: '1.2 km' },
  { hospitalId: 'h2', hospitalName: 'General Wellness', group: 'A+', units: 24, lastUpdated: '5m ago', distance: '3.5 km' },
  { hospitalId: 'h3', hospitalName: 'St. Mary’s', group: 'AB+', units: 5, lastUpdated: '30m ago', distance: '2.1 km' }
];

export const MOCK_HELPLINES: Helpline[] = [
  { id: '1', category: 'Medical', name: 'Ambulance (National)', number: '102', locationScope: 'National' },
  { id: '2', category: 'Police', name: 'Emergency Police', number: '100', locationScope: 'National' },
  { id: '3', category: 'Fire', name: 'Fire Services', number: '101', locationScope: 'National' },
  { id: '4', category: 'Women', name: 'Women Helpline', number: '1091', locationScope: 'National' },
  { id: '5', category: 'Medical', name: 'Blood Bank Hub', number: '104', locationScope: 'State' }
];

export const APP_MODULES = [
  { id: 'injury', label: 'Injury Guidance', icon: <Activity className="w-6 h-6" />, color: 'bg-blue-500' },
  { id: 'hospital', label: 'Hospitals', icon: <MapPin className="w-6 h-6" />, color: 'bg-green-500' },
  { id: 'blood', label: 'Blood Stock', icon: <Droplet className="w-6 h-6" />, color: 'bg-red-500' },
  { id: 'helpline', label: 'Helplines', icon: <PhoneCall className="w-6 h-6" />, color: 'bg-orange-500' },
  { id: 'trusted', label: 'Trusted Care', icon: <ShieldCheck className="w-6 h-6" />, color: 'bg-purple-500' },
];
