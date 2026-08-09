import { useMemo } from "react";
import {
  COUNTRIES,
  INDIA_STATES,
  getCitiesForState,
} from "@/data/india-locations";

const selectClass =
  "h-11 w-full rounded-xl border border-[#dce8e0] bg-[#f8fbf8] px-3 text-sm outline-none focus:ring-2 focus:ring-emerald/25";

export function LocationFields({
  country,
  state,
  city,
  onCountryChange,
  onStateChange,
  onCityChange,
  errors = {},
  className = "",
  selectClassName = selectClass,
}) {
  const cities = useMemo(() => {
    if (country !== "India" || !state) return [];
    return getCitiesForState(state);
  }, [country, state]);

  const isIndia = country === "India";

  return (
    <div className={`grid gap-3 sm:grid-cols-3 ${className}`}>
      <div>
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#7a9586]">
          Country *
        </label>
        <select
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className={`${selectClassName} ${errors.country ? "border-red-400" : ""}`}
        >
          <option value="">Select country</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.country ? (
          <p className="mt-1 text-[10px] text-red-500">{errors.country}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#7a9586]">
          State *
        </label>
        {isIndia ? (
          <select
            value={state}
            onChange={(e) => onStateChange(e.target.value)}
            className={`${selectClassName} ${errors.state ? "border-red-400" : ""}`}
            disabled={!country}
          >
            <option value="">Select state</option>
            {INDIA_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={state}
            onChange={(e) => onStateChange(e.target.value)}
            placeholder="State / Province"
            disabled={!country}
            className={`${selectClassName} ${errors.state ? "border-red-400" : ""}`}
          />
        )}
        {errors.state ? (
          <p className="mt-1 text-[10px] text-red-500">{errors.state}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#7a9586]">
          City *
        </label>
        {isIndia && cities.length > 0 ? (
          <select
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className={`${selectClassName} ${errors.city ? "border-red-400" : ""}`}
            disabled={!state}
          >
            <option value="">Select city</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="City"
            disabled={!state && isIndia}
            className={`${selectClassName} ${errors.city ? "border-red-400" : ""}`}
          />
        )}
        {errors.city ? (
          <p className="mt-1 text-[10px] text-red-500">{errors.city}</p>
        ) : null}
      </div>
    </div>
  );
}
