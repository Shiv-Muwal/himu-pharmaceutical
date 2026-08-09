import { createContext, useCallback, useContext, useEffect, useState } from "react";

const LocationContext = createContext(null);

const STORAGE_KEY = "himu-user-location";

let inFlight = false;

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
  const region = data.principalSubdivision || data.principalSubdivisionCode || "";
  const country = data.countryName || "";
  return {
    city,
    region,
    country,
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

  const requestLocation = useCallback((options = {}) => {
    const { forcePrompt = true } = options;

    if (typeof window === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      setError("Location is not supported on this device");
      return;
    }

    if (inFlight) return;
    inFlight = true;
    setStatus("requesting");
    setError("");

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
        } finally {
          inFlight = false;
        }
      },
      (geoError) => {
        inFlight = false;
        setStatus("denied");
        setError(geoError.message || "Location permission denied");
        if (forcePrompt) {
          // Keep last known city if permission denied mid-session
          const cached = readCachedLocation();
          if (cached?.label) {
            setLocation(cached);
          }
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  }, []);

  // Ask for current city on every page load / visit
  useEffect(() => {
    requestLocation({ forcePrompt: true });
  }, [requestLocation]);

  return (
    <LocationContext.Provider
      value={{ location, status, error, requestLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationInfo() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocationInfo must be used within LocationProvider");
  return ctx;
}
