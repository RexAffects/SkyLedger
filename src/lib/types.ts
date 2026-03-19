export interface CitizenReport {
  id: string;
  latitude: number;
  longitude: number;
  observed_at: string;
  observation_type: string;
  aircraft_count: number | null;
  duration_minutes: number | null;
  trail_behavior: string | null;
  notes: string | null;
  photo_urls: string[];
  evidence_hash: string;
  exif_data: Record<string, unknown> | null;
  weather_conditions: Record<string, unknown> | null;
  verification_level: number;
  status: string;
  created_at: string;
}

export interface ReportFormData {
  latitude: number;
  longitude: number;
  observed_at: string;
  observation_type: string;
  aircraft_count: number | null;
  duration_minutes: number | null;
  trail_behavior: string | null;
  notes: string;
  photo: File | null;
  evidence_hash: string;
  exif_data: Record<string, unknown> | null;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
