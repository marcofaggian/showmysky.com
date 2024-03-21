import { DeviceLocation } from "./DeviceLocation";

export interface OSMPlacesDTO {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  category: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: Address;
  boundingbox?: string[] | null;
}
export interface Address {
  village: string;
  town: string;
  county: string;
  "ISO3166-2-lvl6": string;
  state: string;
  "ISO3166-2-lvl4": string;
  postcode: string;
  country: string;
  country_code: string;
  road?: string;
}

export default async function getLocationName(
  pos: DeviceLocation,
): Promise<DeviceLocation> {
  console.log("Geocoding position... ");
  const ll = `Lat ${pos.lat.toFixed(3)}° Lon ${pos.lng.toFixed(3)}°`;
  const loc = {
    short_name: pos.accuracy > 500 ? `Near ${ll}` : ll,
    country: "Unknown",
    lng: pos.lng,
    lat: pos.lat,
    alt: pos.alt ? pos.alt : 0,
    accuracy: pos.accuracy,
    street_address: "",
  };
  const response = await fetch(
    "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" +
      pos.lat +
      "&lon=" +
      pos.lng,
    { headers: { "Content-Type": "application/json; charset=UTF-8" } },
  );

  if (response.ok) {
    const res = (await response.json()) as OSMPlacesDTO;
    const city = res.address.town
      ? res.address.town
      : res.address.village
        ? res.address.village
        : res.name;
    loc.short_name = pos.accuracy > 500 ? `Near ${city}` : city;
    loc.country = res.address.country;
    if (pos.accuracy < 50) {
      loc.street_address = res.address.road
        ? res.address.road
        : res.display_name;
    }
    return loc;
  } else {
    console.log("Geocoder failed due to: " + response.statusText);
    return loc;
  }
}
