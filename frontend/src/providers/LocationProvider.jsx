import { createContext, useContext, useEffect, useState } from "react";

const LocationContext = createContext(null);

const STORAGE_KEY = "himu-user-location";
const REQUESTED_KEY = "himu-location-requested";

// React Strict Mode remounts components in development. Keep this outside the
// component so it cannot open the browser permission prompt twice.
let locationRequestStarted = false;

function readCachedLocation() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

async function reverseGeocode(latitude, longitude) {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to resolve location");
  const data = await response.json();
  const city =
    data.city ||
    data.locality ||
    data.principalSubdivision ||
    data.countryName ||
    "Nearby";
  const region = data.principalSubdivisionCode || data.principalSubdivision || "";
  return {
    city,
    region,
    country: data.countryName || "",
    label: region && region !== city ? `${city}, ${region}` : city,
    latitude,
    longitude,
  };
}

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(() => readCachedLocation());
  const [status, setStatus] = useState(() =>
    readCachedLocation() ? "ready" : "idle",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      setError("Location is not supported on this device");
      return;
    }

    const cached = readCachedLocation();
    if (cached?.label) {
      setLocation(cached);
      setStatus("ready");
      return;
    }

    // After a visitor dismisses the browser prompt, do not request it again in
    // the same tab. Repeated requests trigger Chrome's geolocation warning.
    if (locationRequestStarted || sessionStorage.getItem(REQUESTED_KEY)) {
      setStatus("denied");
      setError("Location permission was not granted");
      return;
    }

    locationRequestStarted = true;
    sessionStorage.setItem(REQUESTED_KEY, "true");
    setStatus("requesting");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const next = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude,
          );
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          setLocation(next);
          setStatus("ready");
          setError("");
        } catch (err) {
          const fallback = {
            city: "Your area",
            region: "",
            country: "",
            label: "Your area",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
          setLocation(fallback);
          setStatus("ready");
          setError(err.message || "Showing approximate location");
        }
      },
      (geoError) => {
        setStatus("denied");
        setError(geoError.message || "Location permission denied");
      },
      {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 10 * 60 * 1000,
      },
    );
  }, []);

  return (
    <LocationContext.Provider value={{ location, status, error }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationInfo() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocationInfo must be used within LocationProvider");
  return ctx;
}
