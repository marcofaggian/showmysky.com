"use client";

import type { DeviceLocation } from "@/components/ip/DeviceLocation";
import getLocation from "@/components/ip/getLocation";
import getLocationName from "@/components/ip/getLocationName";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [canAsk, setCanAsk] = useState<boolean>(false);
  const [location, setLocation] = useState<DeviceLocation>();

  useEffect(() => {
    if (navigator.geolocation && canAsk) {
      (async () =>
        new Promise<DeviceLocation | null>((res) =>
          navigator.geolocation.getCurrentPosition(
            (position) =>
              res({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                alt: position.coords.altitude,
              }),
            () => res(null),
            { enableHighAccuracy: true },
          ),
        )
          .then(async (browserLocation) => {
            // No HTML5 Geolocalization support, return geoip fallback values
            if (!browserLocation) {
              console.log(
                "Could not get location from browser, use fallback from GeoIP",
              );
              browserLocation = await getLocation();
            }
            const extendedLoc = await getLocationName(browserLocation);
            setLocation(extendedLoc);
          })
          .catch(console.error))();
    }
  }, [canAsk]);

  return (
    <div className="flex h-screen w-screen items-center justify-center gap-2">
      <button onClick={() => setCanAsk(true)}>
        Access my location only here
      </button>
      {location && <pre>{JSON.stringify(location, null, 2)}</pre>}
    </div>
  );
}
