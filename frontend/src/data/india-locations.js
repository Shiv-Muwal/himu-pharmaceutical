/** Countries A–Z (India first for checkout convenience, rest alphabetical). */
export const COUNTRIES = [
  "India",
  "Afghanistan",
  "Australia",
  "Bangladesh",
  "Bhutan",
  "Canada",
  "China",
  "France",
  "Germany",
  "Indonesia",
  "Japan",
  "Malaysia",
  "Maldives",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Pakistan",
  "Singapore",
  "South Africa",
  "Sri Lanka",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
].sort((a, b) => {
  if (a === "India") return -1;
  if (b === "India") return 1;
  return a.localeCompare(b);
});

/** Indian states / UTs → major cities (both sorted A–Z). */
export const INDIA_STATE_CITIES = {
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Andhra Pradesh": [
    "Anantapur",
    "Guntur",
    "Kakinada",
    "Kurnool",
    "Nellore",
    "Rajahmundry",
    "Tirupati",
    "Vijayawada",
    "Visakhapatnam",
  ],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang"],
  Assam: ["Dibrugarh", "Guwahati", "Jorhat", "Silchar", "Tezpur"],
  Bihar: ["Bhagalpur", "Gaya", "Muzaffarpur", "Patna", "Purnia"],
  Chandigarh: ["Chandigarh"],
  Chhattisgarh: ["Bhilai", "Bilaspur", "Durg", "Korba", "Raipur"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
  Delhi: ["New Delhi", "Delhi", "Dwarka", "Rohini", "Saket"],
  Goa: ["Mapusa", "Margao", "Panaji", "Vasco da Gama"],
  Gujarat: [
    "Ahmedabad",
    "Anand",
    "Bhavnagar",
    "Gandhinagar",
    "Jamnagar",
    "Rajkot",
    "Surat",
    "Vadodara",
  ],
  Haryana: [
    "Ambala",
    "Faridabad",
    "Gurugram",
    "Hisar",
    "Karnal",
    "Panipat",
    "Rohtak",
    "Sonipat",
  ],
  "Himachal Pradesh": ["Dharamshala", "Mandi", "Shimla", "Solan"],
  "Jammu and Kashmir": ["Anantnag", "Jammu", "Srinagar", "Udhampur"],
  Jharkhand: ["Bokaro", "Dhanbad", "Jamshedpur", "Ranchi"],
  Karnataka: [
    "Belagavi",
    "Bengaluru",
    "Hubballi",
    "Kalaburagi",
    "Mangaluru",
    "Mysuru",
    "Shivamogga",
  ],
  Kerala: [
    "Alappuzha",
    "Kochi",
    "Kollam",
    "Kozhikode",
    "Thiruvananthapuram",
    "Thrissur",
  ],
  Ladakh: ["Kargil", "Leh"],
  Lakshadweep: ["Kavaratti"],
  "Madhya Pradesh": [
    "Bhopal",
    "Gwalior",
    "Indore",
    "Jabalpur",
    "Rewa",
    "Sagar",
    "Ujjain",
  ],
  Maharashtra: [
    "Aurangabad",
    "Mumbai",
    "Nagpur",
    "Nashik",
    "Navi Mumbai",
    "Pune",
    "Thane",
  ],
  Manipur: ["Imphal"],
  Meghalaya: ["Shillong"],
  Mizoram: ["Aizawl"],
  Nagaland: ["Dimapur", "Kohima"],
  Odisha: ["Bhubaneswar", "Cuttack", "Puri", "Rourkela"],
  Puducherry: ["Karaikal", "Puducherry"],
  Punjab: [
    "Amritsar",
    "Bathinda",
    "Jalandhar",
    "Ludhiana",
    "Mohali",
    "Patiala",
  ],
  Rajasthan: [
    "Ajmer",
    "Alwar",
    "Bikaner",
    "Chirawa",
    "Jaipur",
    "Jaisalmer",
    "Jodhpur",
    "Kota",
    "Udaipur",
  ],
  Sikkim: ["Gangtok"],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Salem",
    "Tiruchirappalli",
    "Tirunelveli",
    "Vellore",
  ],
  Telangana: ["Hyderabad", "Karimnagar", "Nizamabad", "Warangal"],
  Tripura: ["Agartala"],
  "Uttar Pradesh": [
    "Agra",
    "Allahabad",
    "Bareilly",
    "Ghaziabad",
    "Kanpur",
    "Lucknow",
    "Meerut",
    "Noida",
    "Varanasi",
  ],
  Uttarakhand: ["Dehradun", "Haridwar", "Nainital", "Rishikesh"],
  "West Bengal": [
    "Asansol",
    "Durgapur",
    "Howrah",
    "Kolkata",
    "Siliguri",
  ],
};

export const INDIA_STATES = Object.keys(INDIA_STATE_CITIES).sort((a, b) =>
  a.localeCompare(b),
);

export function getCitiesForState(state) {
  const cities = INDIA_STATE_CITIES[state] || [];
  return [...cities].sort((a, b) => a.localeCompare(b));
}

export function matchStateFromLabel(region = "") {
  const q = String(region).toLowerCase().trim();
  if (!q) return "";
  return (
    INDIA_STATES.find(
      (s) =>
        s.toLowerCase() === q ||
        s.toLowerCase().includes(q) ||
        q.includes(s.toLowerCase()),
    ) || ""
  );
}

export function matchCityFromLabel(city = "", state = "") {
  const q = String(city).toLowerCase().trim();
  if (!q) return "";
  const list = state ? getCitiesForState(state) : INDIA_STATES.flatMap(getCitiesForState);
  return (
    list.find(
      (c) =>
        c.toLowerCase() === q ||
        c.toLowerCase().includes(q) ||
        q.includes(c.toLowerCase()),
    ) || ""
  );
}
