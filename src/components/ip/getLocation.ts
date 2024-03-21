"use client";

import { DeviceLocation } from "./DeviceLocation";

export interface GetIPLocationDTO {
  ip: string;
  network: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  country_code: string;
  country_code_iso3: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
}

export default async function getLocation(): Promise<DeviceLocation> {
  const res = await fetch(`https://ipapi.co/json`);
  if (res.ok) {
    const loc = (await res.json()) as GetIPLocationDTO;
    return {
      accuracy: 20_000,
      lat: loc.latitude,
      lng: loc.longitude,
      alt: 0,
    };
  } else {
    throw new Error("Cannot detect position");
  }
}
