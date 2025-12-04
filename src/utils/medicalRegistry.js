// src/utils/medicalRegistry.js

// 1. MOCK DATABASE (For Demo - These IDs will return "Success")
const MOCK_REGISTRY = {
  "MED-2024-001": {
    name: "Dr. Sarah Jenkins",
    status: "Active",
    qualification: "MBBS, MD (Psychiatry)",
    council: "Medical Council of India",
    year: 2018,
    validUntil: "2028-12-31"
  },
  "MED-2024-002": {
    name: "Dr. Aravind Patel",
    status: "Active",
    qualification: "PhD, Clinical Psychology",
    council: "Rehabilitation Council",
    year: 2015,
    validUntil: "2025-06-30"
  },
  // REAL NPI ID for Testing (If using US Data)
  "1234567890": {
    name: "Dr. Real Example",
    status: "Active",
    qualification: "MD",
    council: "NPI Registry USA",
    year: 2010,
    validUntil: "Lifetime"
  }
};

// 2. FUNCTION TO CHECK ID
export const verifyMedicalId = async (licenseId) => {
  return new Promise((resolve, reject) => {
    console.log("Connecting to Government Registry API...");
    
    // Simulate API Network Delay (1.5 seconds)
    setTimeout(() => {
      const data = MOCK_REGISTRY[licenseId];
      
      if (data) {
        resolve({ success: true, data: data });
      } else {
        // If ID is random/wrong
        resolve({ success: false, error: "License ID not found in National Registry." });
      }
    }, 1500);
  });
};