export interface DeviceLocation {
  lat: number;
  lng: number;
  alt: number | null;
  accuracy: number;
  short_name?: string;
  country?: string;
  street_address?: string;
}
