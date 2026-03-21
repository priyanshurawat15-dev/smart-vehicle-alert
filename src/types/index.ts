export interface Vehicle {
  id: string;

  model?: string;   // 👈 ADD
  color?: string; 
  
  qr_code: string;
  vehicle_number: string;
  owner_name?: string;
  owner_email?: string;
  created_at: string;
  updated_at: string;
}

export interface EmergencyContact {
  id: string;
  vehicle_id: string;
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  relationship: string;
  priority: number;
  created_at: string;
}

export interface ParkingAlert {
  id: string;
  vehicle_id: string;
  message: string;
  alert_type: 'wrong_parking' | 'blocking' | 'custom';
  location_lat?: number;
  location_lng?: number;
  is_read: boolean;
  created_at: string;
}

export interface Incident {
  id: string;
  vehicle_id: string;
  description: string;
  incident_type: 'damage' | 'accident' | 'other';
  photo_url?: string;
  location_lat?: number;
  location_lng?: number;
  reporter_contact?: string;
  is_resolved: boolean;
  created_at: string;
}

export interface EmergencyActivation {
  id: string;
  vehicle_id: string;
  location_lat: number;
  location_lng: number;
  activation_note?: string;
  contacts_notified: any[];
  created_at: string;
}
