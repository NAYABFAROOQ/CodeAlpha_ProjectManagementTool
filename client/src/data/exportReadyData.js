// ExportReady Seed Data & Regulatory Rule Base for Sialkot Surgical Instrument Exporters

export const FACTORY_PROFILE = {
  id: "fac-sialkot-001",
  name: "Apex Surgical Industries (Pvt) Ltd",
  city: "Sialkot, Punjab, Pakistan",
  chamberReg: "SCCI-2024-8841",
  ntn: "4198201-9",
  fdaFei: "3009418291",
  usAgent: "MedTech Regulatory Associates LLC, 1209 Orange St, Wilmington, DE 19801",
  importAlertStatus: "Conditional / Subject to 76-01 Third-Party Verification",
  greenListEligibility: "Eligible upon 3 consecutive clean verified shipments",
  facilities: [
    { name: "Forging & Stamping Unit", location: "Small Industrial Estate, Sialkot", status: "Operational" },
    { name: "Chemical Passivation & Cleaning Lab", location: "Sambrial Road, Sialkot", status: "Validation In-Progress" },
    { name: "Laser Marking & Clean Packing Facility", location: "Daska Road, Sialkot", status: "Certified Class 8" }
  ]
};

export const REGULATORY_RULES = [
  { id: "R-01", code: "FDA-76-01-MTC", title: "ASTM F899 Raw Material Verification", standard: "ASTM F899 / FDA 76-01", description: "Independent spectrometer chemical analysis verifying AISI 420/410/316 composition before forging.", severity: "BLOCKER", defaultLeadDays: { min: 4, likely: 7, max: 18 } },
  { id: "R-02", code: "FDA-820-PASS", title: "ASTM A967 Chemical Passivation Validation", standard: "21 CFR 820.75 / ASTM A967", description: "Validated chemical passivation cycle (Citric or Nitric) accompanied by copper sulfate and water immersion test.", severity: "BLOCKER", defaultLeadDays: { min: 3, likely: 5, max: 14 } },
  { id: "R-03", code: "FDA-820-DHR", title: "Device History Record & Lot Traceability", standard: "21 CFR 820.184", description: "Complete batch production record detailing heat number, operator sign-off, and laser marking lot ID.", severity: "GAP", defaultLeadDays: { min: 2, likely: 3, max: 6 } },
  { id: "R-04", code: "FDA-820-CAL", title: "Hardness & Dimensional Gauge Calibration", standard: "21 CFR 820.72", description: "NIST/PCSIR traceable calibration certificates for Rockwell C hardness testers and optical comparators.", severity: "GAP", defaultLeadDays: { min: 2, likely: 4, max: 8 } },
  { id: "R-05", code: "ISO-13485-QMS", title: "Active ISO 13485:2016 Scope of Registration", standard: "ISO 13485:2016 Clause 4.2", description: "Valid accredited registrar certificate covering manufacture of non-sterile reusable surgical instruments.", severity: "BLOCKER", defaultLeadDays: { min: 14, likely: 30, max: 60 } },
  { id: "R-06", code: "BUYER-FEI-01", title: "US Importer FEI & Active Registration", standard: "21 CFR 807", description: "Active FDA establishment registration and verified US Agent for the importing consignee.", severity: "BUYER_BLOCKER", defaultLeadDays: { min: 1, likely: 2, max: 5 } }
];

export const SAMPLE_ORDERS = [
  {
    id: "ord-8821",
    poNumber: "PO-8821-US",
    buyer: "MedSurge Distribution Inc, Chicago, IL",
    buyerFei: "3004128901",
    buyerStatus: "Active",
    productName: "Mayo Dissecting Scissors 6.75\" Curved",
    productCode: "SURG-SC-420",
    steelGrade: "AISI 420 Martensitic Stainless Steel",
    standard: "ASTM F899",
    deviceClass: "Class I Reusable",
    quantity: 5000,
    unitPrice: 9.70,
    totalValue: 48500,
    intakeDate: "2026-10-21",
    deadline: "2026-11-20",
    daysRemaining: 30,
    status: "AT RISK",
    p_ontime: 64.2,
    p50_days: 24,
    p90_days: 36,
    remediationDays: 14,
    rulesConfirmed: ["R-01", "R-02", "R-03", "R-04", "R-05", "R-06"],
    gaps: [
      { id: "GAP-8821-01", code: "GAP-PASS-A967", title: "ASTM A967 Chemical Passivation Certificate", min: 3, likely: 5, max: 14, costPkr: 85000, owner: "QA Lab", sensitivity: 0.82 },
      { id: "GAP-8821-02", code: "GAP-MTC-F899", title: "PCSIR Spectrometer Material Test Certificate", min: 4, likely: 7, max: 18, costPkr: 65000, owner: "Procurement", sensitivity: 0.65 },
      { id: "GAP-8821-03", code: "GAP-CAL-HRC", title: "Rockwell Hardness Tester Recalibration", min: 2, likely: 3, max: 6, costPkr: 35000, owner: "Tooling", sensitivity: 0.22 }
    ],
    gatekeeper: {
      commercialInvoiceReady: false,
      packingListReady: false,
      blockerCount: 2,
      gapCount: 1,
      metCount: 3
    }
  },
  {
    id: "ord-8822",
    poNumber: "PO-8822-US",
    buyer: "Titan Medical Supply, Dallas, TX",
    buyerFei: "3018290192",
    buyerStatus: "Active",
    productName: "Surgical Scalpel Handles #3 & #4",
    productCode: "SURG-SH-316",
    steelGrade: "AISI 316 Austenitic Stainless Steel",
    standard: "ASTM F899",
    deviceClass: "Class I Reusable",
    quantity: 12000,
    unitPrice: 3.00,
    totalValue: 36000,
    intakeDate: "2026-10-20",
    deadline: "2026-11-15",
    daysRemaining: 25,
    status: "FEASIBLE",
    p_ontime: 91.5,
    p50_days: 12,
    p90_days: 18,
    remediationDays: 6,
    rulesConfirmed: ["R-01", "R-02", "R-03"],
    gaps: [
      { id: "GAP-8822-01", code: "GAP-DHR-LOT", title: "Laser Marking Lot Inspection Record", min: 2, likely: 3, max: 5, costPkr: 25000, owner: "QA Pack", sensitivity: 0.45 }
    ],
    gatekeeper: {
      commercialInvoiceReady: true,
      packingListReady: true,
      blockerCount: 0,
      gapCount: 1,
      metCount: 5
    }
  },
  {
    id: "ord-8823",
    poNumber: "PO-8823-US",
    buyer: "Apex Surgical Global, Newark, NJ",
    buyerFei: "INACTIVE_FEI",
    buyerStatus: "Deregistered / Inactive",
    productName: "Halsted Mosquito Hemostatic Forceps 5\"",
    productCode: "SURG-HF-410",
    steelGrade: "AISI 410 Martensitic Stainless Steel",
    standard: "ASTM F899",
    deviceClass: "Class I Reusable",
    quantity: 3500,
    unitPrice: 8.20,
    totalValue: 28700,
    intakeDate: "2026-10-18",
    deadline: "2026-12-05",
    daysRemaining: 45,
    status: "BUYER BLOCKER",
    p_ontime: 15.0,
    p50_days: 35,
    p90_days: 52,
    remediationDays: 20,
    rulesConfirmed: ["R-06"],
    gaps: [
      { id: "GAP-8823-01", code: "BUYER-FEI-01", title: "Buyer US Importer FEI Inactive at FDA Portal", min: 10, likely: 20, max: 40, costPkr: 0, owner: "Buyer Liaison", sensitivity: 0.95 }
    ],
    gatekeeper: {
      commercialInvoiceReady: false,
      packingListReady: false,
      blockerCount: 1,
      gapCount: 0,
      metCount: 4
    }
  },
  {
    id: "ord-8824",
    poNumber: "PO-8824-US",
    buyer: "Pacific Health Instruments, Seattle, WA",
    buyerFei: "3007198214",
    buyerStatus: "Active",
    productName: "Metzenbaum Scissors TC Gold Handle 7\"",
    productCode: "SURG-TC-420",
    steelGrade: "AISI 420 + Tungsten Carbide Inserts",
    standard: "ASTM F899",
    deviceClass: "Class I Reusable",
    quantity: 1800,
    unitPrice: 23.50,
    totalValue: 42300,
    intakeDate: "2026-10-19",
    deadline: "2026-11-28",
    daysRemaining: 38,
    status: "FEASIBLE",
    p_ontime: 88.0,
    p50_days: 15,
    p90_days: 22,
    remediationDays: 8,
    rulesConfirmed: ["R-01", "R-02", "R-04"],
    gaps: [
      { id: "GAP-8824-01", code: "GAP-TC-BRAZE", title: "Tungsten Carbide Vacuum Brazing Shear Test", min: 3, likely: 5, max: 9, costPkr: 75000, owner: "Heat Treatment", sensitivity: 0.58 }
    ],
    gatekeeper: {
      commercialInvoiceReady: true,
      packingListReady: true,
      blockerCount: 0,
      gapCount: 1,
      metCount: 5
    }
  },
  {
    id: "ord-8825",
    poNumber: "PO-8825-US",
    buyer: "MedSurge Distribution Inc, Chicago, IL",
    buyerFei: "3004128901",
    buyerStatus: "Active",
    productName: "Crile Hemostatic Forceps Curved 5.5\"",
    productCode: "SURG-CF-410",
    steelGrade: "AISI 410 Martensitic Stainless Steel",
    standard: "ASTM F899",
    deviceClass: "Class I Reusable",
    quantity: 4000,
    unitPrice: 5.50,
    totalValue: 22000,
    intakeDate: "2026-10-21",
    deadline: "2026-12-10",
    daysRemaining: 50,
    status: "FEASIBLE",
    p_ontime: 94.0,
    p50_days: 10,
    p90_days: 16,
    remediationDays: 5,
    rulesConfirmed: ["R-01", "R-02"],
    gaps: [],
    gatekeeper: {
      commercialInvoiceReady: true,
      packingListReady: true,
      blockerCount: 0,
      gapCount: 0,
      metCount: 6
    }
  },
  {
    id: "ord-8826",
    poNumber: "PO-8826-US",
    buyer: "Eastern Surgical Supply, Boston, MA",
    buyerFei: "3001829402",
    buyerStatus: "Active",
    productName: "Adson Micro Tissue Forceps 1x2 Teeth",
    productCode: "SURG-TF-304",
    steelGrade: "AISI 304 Austenitic Stainless Steel",
    standard: "ASTM F899",
    deviceClass: "Class I Reusable",
    quantity: 2200,
    unitPrice: 6.60,
    totalValue: 14520,
    intakeDate: "2026-10-15",
    deadline: "2026-11-18",
    daysRemaining: 28,
    status: "AT RISK",
    p_ontime: 52.4,
    p50_days: 20,
    p90_days: 32,
    remediationDays: 16,
    rulesConfirmed: ["R-01", "R-02", "R-04"],
    gaps: [
      { id: "GAP-8826-01", code: "GAP-PASS-A967", title: "Copper Sulfate Porosity Passivation Test", min: 4, likely: 6, max: 12, costPkr: 60000, owner: "QA Lab", sensitivity: 0.76 }
    ],
    gatekeeper: {
      commercialInvoiceReady: false,
      packingListReady: false,
      blockerCount: 1,
      gapCount: 1,
      metCount: 3
    }
  }
];

export const EVIDENCE_VAULT_RECORDS = [
  {
    id: "ev-01",
    seq: 42,
    documentTitle: "Mill Test Certificate (MTC) - AISI 420 Heat #M-9912",
    documentType: "STEEL_MTC",
    pillar: "Pillar 1: Raw Material Metallurgy (ASTM F899)",
    issuer: "PCSIR Laboratories Complex, Lahore",
    issueDate: "2026-09-12",
    uploadedAt: "2026-10-21 14:22:10 UTC",
    fileHash: "8f434346648f6b96df89dda901c5176b10e6d07961fd76e5d8a0c20f1c4bb7c1",
    prevHash: "e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
    proofGrade: "MET",
    statusBadge: "Third-Party Verified",
    tamperFlag: false,
    notes: "Direct optical emission spectrometry matches ASTM F899 Class 420 specifications (C: 0.20%, Cr: 13.2%)."
  },
  {
    id: "ev-02",
    seq: 41,
    documentTitle: "Suspect Mill Test Certificate - Heat #B-4180 (Flagged)",
    documentType: "STEEL_MTC",
    pillar: "Pillar 1: Raw Material Metallurgy (ASTM F899)",
    issuer: "Self-Declared Supplier Paper (Unverified Lab)",
    issueDate: "2026-01-10",
    uploadedAt: "2026-10-21 16:45:00 UTC",
    fileHash: "3b29ac871f920839e248b9f1a8c01d4b68e920fa58b192e4c9281a0e74b391cf",
    prevHash: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
    proofGrade: "GAP",
    statusBadge: "TAMPER SUSPECT (BACKDATED)",
    tamperFlag: true,
    tamperReason: "Claimed issue date (Jan 10, 2026) diverges by 284 days from upload timestamp. Proof grade downgraded from Third-Party to Self-Declared.",
    notes: "Potential backdating violation under FDA 76-01 inspection protocols."
  },
  {
    id: "ev-03",
    seq: 40,
    documentTitle: "ASTM A967 Citric Acid Passivation Validation Report",
    documentType: "PASSIVATION_REPORT",
    pillar: "Pillar 2: Chemical Passivation (ASTM A967)",
    issuer: "Metal Testing & Passivation Center, Sialkot",
    issueDate: "2026-10-05",
    uploadedAt: "2026-10-20 11:15:32 UTC",
    fileHash: "9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e",
    prevHash: "6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d",
    proofGrade: "MET",
    statusBadge: "Third-Party Verified",
    tamperFlag: false,
    notes: "Copper sulfate test (Practice D) and 24-hr water immersion test showed zero rust spots."
  },
  {
    id: "ev-04",
    seq: 39,
    documentTitle: "Device History Record (DHR) - Batch #MS-8821",
    documentType: "DHR_RECORD",
    pillar: "Pillar 3: Device History Records (21 CFR 820.184)",
    issuer: "Apex Surgical In-House QA Department",
    issueDate: "2026-10-18",
    uploadedAt: "2026-10-20 09:30:14 UTC",
    fileHash: "2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b",
    prevHash: "5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c",
    proofGrade: "MET_AUDIT_RISK",
    statusBadge: "Document-Backed (Internal)",
    tamperFlag: false,
    notes: "Internal QA traveler signed by operator; missing final packaging sterilization indicator."
  },
  {
    id: "ev-05",
    seq: 38,
    documentTitle: "Rockwell Hardness Tester (HRC) Calibration Certificate",
    documentType: "CALIBRATION_LOG",
    pillar: "Pillar 4: Equipment Calibration (21 CFR 820.72)",
    issuer: "National Institute of Calibration, Islamabad",
    issueDate: "2026-08-15",
    uploadedAt: "2026-10-19 14:10:00 UTC",
    fileHash: "4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f",
    prevHash: "1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a",
    proofGrade: "MET",
    statusBadge: "Third-Party Verified",
    tamperFlag: false,
    notes: "Traceable to NIST standards. Certificate valid through August 2027."
  },
  {
    id: "ev-06",
    seq: 37,
    documentTitle: "ISO 13485:2016 Quality Management System Certificate",
    documentType: "ISO_CERTIFICATE",
    pillar: "Pillar 5: Quality System (ISO 13485 / QMSR)",
    issuer: "SGS United Kingdom Ltd (Accredited Registrar)",
    issueDate: "2024-05-10",
    uploadedAt: "2026-10-18 10:00:00 UTC",
    fileHash: "7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c",
    prevHash: "9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    proofGrade: "MET",
    statusBadge: "Third-Party Verified",
    tamperFlag: false,
    notes: "Scope covers manufacture of reusable non-sterile medical devices. Surveillance audit completed."
  }
];

export const MOCK_AUDIT_QUESTIONS = [
  {
    id: "q-01",
    pillar: "Management Controls",
    code: "QMSR-MGT-01",
    cfr: "21 CFR 820.20",
    text: "Has executive management established an approved Quality Policy and documented quality objectives aligned with ISO 13485:2016?",
    severity: "MAJOR",
    points: 10,
    autoEvaluated: true,
    suggestedAnswer: "YES"
  },
  {
    id: "q-02",
    pillar: "Production & Process Controls",
    code: "QMSR-PPC-04",
    cfr: "21 CFR 820.75 / ASTM A967",
    text: "Are validation protocols (IQ/OQ/PQ) formally executed and signed off for all automated and manual passivation chemical baths?",
    severity: "CRITICAL",
    points: 10,
    autoEvaluated: true,
    suggestedAnswer: "NO"
  },
  {
    id: "q-03",
    pillar: "Purchasing & Raw Materials",
    code: "QMSR-PUR-02",
    cfr: "21 CFR 820.50 / ASTM F899",
    text: "Do procedures require chemical spectrometer verification from an accredited laboratory for each received heat lot of stainless steel?",
    severity: "CRITICAL",
    points: 10,
    autoEvaluated: true,
    suggestedAnswer: "PARTIAL"
  },
  {
    id: "q-04",
    pillar: "Traceability & DHR",
    code: "QMSR-DHR-01",
    cfr: "21 CFR 820.184",
    text: "Does each Device History Record maintain unbroken lot traceability linking raw material heat number to final laser-marked product?",
    severity: "MAJOR",
    points: 10,
    autoEvaluated: true,
    suggestedAnswer: "PARTIAL"
  },
  {
    id: "q-05",
    pillar: "Equipment Calibration",
    code: "QMSR-CAL-03",
    cfr: "21 CFR 820.72",
    text: "Are calibration recall dates actively tracked with automated lockout preventing the use of expired measuring gauges?",
    severity: "MAJOR",
    points: 10,
    autoEvaluated: true,
    suggestedAnswer: "YES"
  },
  {
    id: "q-06",
    pillar: "Corrective & Preventive Action (CAPA)",
    code: "QMSR-CAPA-02",
    cfr: "21 CFR 820.100",
    text: "Does the factory maintain a root-cause investigation procedure for any batch failing copper sulfate passivation testing?",
    severity: "CRITICAL",
    points: 10,
    autoEvaluated: true,
    suggestedAnswer: "NO"
  }
];

export const SIMULATED_483_OBSERVATIONS = [
  {
    id: "obs-483-1",
    number: "Observation 1",
    severity: "CRITICAL",
    cfr: "21 CFR 820.75(a)",
    title: "Inadequate Process Validation for Chemical Passivation",
    text: "Processes whose results cannot be fully verified by subsequent inspection have not been validated according to established procedures. Specifically, your facility operates automated nitric and citric acid passivation baths without documented Installation, Operational, or Performance Qualification (IQ/OQ/PQ) runs.",
    remediation: "Halt lot release; execute validation protocol with copper sulfate coupon testing per ASTM A967."
  },
  {
    id: "obs-483-2",
    number: "Observation 2",
    severity: "MAJOR",
    cfr: "21 CFR 820.50(a)(1)",
    title: "Failure to Adequately Evaluate and Verify Suppliers",
    text: "Suppliers of raw materials (AISI 420 stainless steel bar stock) have not been evaluated to ensure conformance to specified requirements. Mill Test Certificates were accepted on self-declaration without periodic independent third-party laboratory re-verification.",
    remediation: "Establish supplier audit schedule and mandate PCSIR-verified spectrometer reports for every billet heat."
  }
];
