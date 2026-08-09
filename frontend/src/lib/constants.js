export const COMPANY = {
  name: "HIMU Pharmacy",
  shortName: "HIMU",
  fullForm: "Healthcare Innovation for Medical Upliftment",
  tagline: "Advancing Healthcare Through Innovation",
  type: "Pharmaceutical Manufacturing Company",
  licenseNumber: "ABCDEFGHIJKLMN",
  cinNumber: "U47721RJ2026PTC115427",
  email: "Customercare@himupharmaceutical.com",
  phone: "+91 7419363737",
  address: "38 Ambikanagar, Mandrela Road, Chirawa, Dist. Jhunjhunu, Rajasthan - 333026",
  officeHours: "24/7 Customer Support",
  url: "https://www.himupharmaceutical.com",
};

/** City-wise offices shown in footer / contact */
export const COMPANY_OFFICES = [
  {
    label: "Head Office — Chirawa",
    city: "Chirawa",
    address:
      "38 Ambikanagar, Mandrela Road, Chirawa, Dist. Jhunjhunu, Rajasthan - 333026",
  },
  {
    label: "Bhiwani Office",
    city: "Bhiwani",
    address: "21, Railway Road, Bhiwani, Haryana - 127021",
  },
  {
    label: "Nalagarh Office",
    city: "Nalagarh",
    address: "Nikuwal Road, New Nalagarh, Himachal Pradesh - 174101",
  },
];
export const SOCIAL_LINKS = [{
  name: "LinkedIn",
  href: "https://linkedin.com",
  icon: "linkedin"
}, {
  name: "Twitter",
  href: "https://twitter.com",
  icon: "twitter"
}, {
  name: "Facebook",
  href: "https://facebook.com",
  icon: "facebook"
}, {
  name: "Instagram",
  href: "https://instagram.com",
  icon: "instagram"
}, {
  name: "YouTube",
  href: "https://youtube.com",
  icon: "youtube"
}];
export const STATS = [{
  label: "Years Experience",
  value: 20,
  suffix: "+"
}, {
  label: "Medicines",
  value: 500,
  suffix: "+"
}, {
  label: "Research Scientists",
  value: 100,
  suffix: "+"
}, {
  label: "Countries Served",
  value: 50,
  suffix: "+"
}];
export const PRODUCT_DISCLAIMER = "Disclaimer: The information provided on this website is for educational and informational purposes only. All medicines, product names, compositions, images, certificates, license numbers, and company details are dummy/demo content created for demonstration purposes only. This website does not sell medicines online and should not be considered a substitute for professional medical advice. Always consult a qualified healthcare professional before using any medication.";
export const NAV_LINKS = [{
  name: "Home",
  href: "/"
}, {
  name: "About Us",
  href: "/about",
  children: [{
    name: "About Us",
    href: "/about"
  }, {
    name: "Manufacturing",
    href: "/manufacturing"
  }, {
    name: "Quality",
    href: "/quality"
  }]
}, {
  name: "Products",
  href: "/products",
  children: [{
    name: "Skin Care",
    href: "/categories/skin-care"
  }]
}, {
  name: "Jobs",
  href: "/jobs"
}, {
  name: "Contact",
  href: "/contact"
}];
