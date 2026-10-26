# ExportReady — System Architecture & Product Requirements Document (PRD)
## Individual Final Year Project (FYP) Draft Specification
**Project Title:** ExportReady: An Export-Readiness Compliance Decision-Support SaaS for Sialkot Surgical Instrument Exporters  
**Target Domain:** Medical Device Regulatory Compliance (US FDA Import Alert 76-01, 21 CFR Part 820 QMSR, ISO 13485:2016, ASTM F899, ASTM A967)  
**Author / Candidate:** Individual FYP Student Candidate  
**Academic Year:** 2026–2027  
**Target Audience:** Final Year Project Evaluation Committee & Technical Supervisors  

---

## Executive Summary

Sialkot, Pakistan produces over 70% of the world’s hand-held surgical instruments (forceps, scalpels, dissecting scissors, needle holders). Despite superior metallurgical craftsmanship, small-to-medium enterprises (SMEs) face catastrophic shipment detentions at US ports of entry under **FDA Import Alert 76-01** (*"Detention Without Physical Examination of Surgical Instruments from Specified Pakistani Manufacturers"*). 

The root problem is **information asymmetry and post-manufacturing discovery**: factories accept buyer Purchase Orders (POs) without verifying whether their physical quality evidence satisfies US statutory requirements under **21 CFR Part 820 (QMSR)** and **ASTM standards (ASTM F899 for metallurgy, ASTM A967 for passivation)**. When documentation fails at US customs or during foreign inspections, goods are confiscated or re-exported, causing millions of dollars in liquidated damages.

**ExportReady** is a multi-tenant compliance decision-support SaaS engineered specifically for Sialkot surgical instrument manufacturers. It transforms static compliance paper into an intelligent, cryptographically verifiable, and operationally executable decision pipeline.

---

## Comparative Architectural Critique: Groupmate Draft vs. Individual Draft

The original 16-feature draft developed by my project peer laid a solid baseline in basic CRUD operations, deterministic rule evaluation, and generic RAG. However, an academic evaluation committee requires deep algorithmic contributions and solutions tailored to the actual historical causes of Pakistani export rejections.

Below is the architectural comparison justifying my individual draft:

| Architectural Dimension | Groupmate Draft (16 Features) | My Individual Refined Draft (20 Features) | FYP Engineering Justification |
| :--- | :--- | :--- | :--- |
| **Integrity & Fraud Prevention** | Unsecured Evidence Vault with basic file uploads. | **Cryptographic Tamper-Evident Ledger (SHA-256 Backward Chaining & Backdating Detection)** | FDA Import Alert 76-01 exists because of forged or retroactively altered paper certificates. A backward-chained hash log mathematically guarantees document immutability. |
| **Delivery Feasibility Logic** | Naive deterministic arithmetic ($\sum \text{LeadTime} \le \text{Deadline}$). | **10,000-Iteration Monte Carlo Lead-Time Simulator (PERT Distributions + Tornado Sensitivity)** | Testing labs in Pakistan (PCSIR, Metal Testing Labs) suffer severe backlog variance. Stochastic modeling provides true $P(\text{on-time})$ and sensitivity ranking. |
| **Regulatory Enforcement** | Generic text-retrieval RAG chatbot. | **Mock FDA QMSR 483 Inspection Simulator** | Pre-empts formal FDA Form 483 inspection citations by synthesizing 32 checklist points with Evidence Vault verification states. |
| **Customs Clearance Modeling** | Unilateral factory-side rule validation only. | **Bilateral Importer/Buyer Clearance (`BUYER-SIDE BLOCKER`)** | Detentions frequently occur when the US Importer of Record or US Agent lacks active FDA FEI registration, regardless of factory perfection. |
| **Commercial Viability** | Purely technical rule checks. | **Compliance Cost & Quotation Estimator (in PKR)** | Factory owners refuse to adopt compliance tools unless they can forecast whether testing fees will erase their gross export profit margin. |
| **Execution Architecture** | Static report generation. | **Reactive Gap Remediation Kanban with Auto-Trigger Re-evaluations** | Converts compliance gaps into scheduled tasks with Critical Path Method (CPM) back-calculated deadlines. |

---

## Comprehensive 20-Feature Specification

### Module A: Identity, Isolation & Facility Profile
1. **Multi-Tenant Authentication & Strict Tenant Isolation (JWT + Bcrypt):**
   - Multi-tenant architecture with mandatory `factory_id` claim in JWT payloads.
   - Enforces PostgreSQL Row-Level Security (RLS) guaranteeing absolute zero cross-tenant data leakage.
   - Role-Based Access Control (RBAC): *Factory Administrator*, *Quality Assurance Manager*, and *System Auditor*.
2. **Sialkot Factory Regulatory Profile:**
   - Captures Sialkot Chamber of Commerce & Industry (SCCI) registration number, National Tax Number (NTN), FDA Establishment Identifier (FEI), US FDA Green List / Red List status under Import Alert 76-01, and registered passivation facilities.

### Module B: Document Intelligence & Cryptographic Integrity
3. **Cryptographic Tamper-Evident Evidence Ledger (SHA-256 Backward Chaining):**
   - Every uploaded document is hashed with SHA-256 and chained to the previous record's hash (`prev_hash`).
   - Genesis block initialized per tenant.
   - An automated backdating heuristic compares document claimed issue date against upload timestamp ($>30\text{ days}$ delta flags `TAMPER_SUSPECT_BACKDATED`).
   - Verification badge rendered on UI: *"Chain Intact: 42 of 42 Documents Verifiably Unchanged"*.
4. **Evidence Vault with 4-Grade Proof Engine:**
   - Evaluates compliance assets across 5 regulatory pillars: Steel Mill Test Certificate (MTC), Chemical Passivation Report, Device History Record (DHR), Equipment Calibration Logs, and ISO 13485:2016 Certification.
   - 4-Tier Grading:
     - `MET` (Third-Party Accredited Lab Verified, ISO 17025 certified).
     - `MET_WITH_AUDIT_RISK` (Document-Backed internal factory report).
     - `GAP` (Self-Declared unverified claim).
     - `BLOCKER` (Expired or missing mandatory statutory record).
5. **Smart Document OCR & Metallurgical Inspector:**
   - Automated text extraction (Pytesseract / PDFPlumber) parsing metallurgical chemical composition (Carbon %, Chromium %, Molybdenum %).
   - Matches extracted alloy against ASTM F899 standards for surgical instruments (e.g., verifying Grade 420 Martensitic Stainless Steel for cutting scissors vs. 316L Austenitic for implantable probes).

### Module C: Order Intake & NLP Regulatory Parser
6. **Buyer Purchase Order Intake Engine:**
   - Ingests US buyer PO metadata: PO Number, Instrument Product Code, Medical Device Classification (Class I Reusable vs. Class I Non-Sterile), Order Quantity, Contract Value (USD), Shipment Deadline, and free-text Quality Clauses.
7. **NLP Buyer Condition Matcher:**
   - Sentence tokenization and semantic embedding generation via `all-MiniLM-L6-v2`.
   - Cosine similarity matching against 25 codified statutory rules (FDA 76-01, 21 CFR 820.70, ASTM A967, ASTM F899).
   - Human-in-the-loop Confirm/Reject UI verifying extracted constraints.
8. **Bilateral Buyer & Importer Vetting (`BUYER-SIDE BLOCKER`):**
   - Validates buyer's US FDA FEI registration and designated US Agent credentials.
   - Generates a distinct `BUYER-SIDE BLOCKER` if the buyer or their US Agent is deregistered, decoupling factory readiness from importer jurisdictional clearance.

### Module D: Decision Core & Optimization
9. **Deterministic Multi-Pillar Decision Engine:**
   - Maps confirmed order requirements against the Evidence Vault.
   - Categorizes each rule into: `MET`, `GAP`, or `BLOCKER`.
   - Prevents order acceptance if any statutory hard blocker is unresolved.
10. **10,000-Iteration Monte Carlo Lead-Time Risk Simulator:**
    - Models compliance gap resolution lead times using three-point PERT distributions (Minimum, Most Likely, Maximum days).
    - Executes 10,000 stochastic runs in $<500\text{ ms}$.
    - Generates Probability of On-Time Delivery ($P(\text{on-time})$), P50 median date, and P90 conservative delivery date.
    - Sensitivity Tornado Chart calculating Pearson correlation coefficients ($\rho$) to rank schedule bottleneck drivers.
    - Interactive 3-way What-If scenario comparisons (Baseline vs. Expedited Testing vs. Lab Delay).
11. **0/1 Knapsack Remediation Optimization Solver:**
    - Dual solver: Greedy heuristic vs. 0/1 Dynamic Programming exact algorithm.
    - Under a constrained timeline (e.g., 14 days before vessel cutoff), selects the optimal subset of compliance gap resolutions that maximizes unlocked export revenue or total cleared orders.
12. **Compliance Cost & Quotation Estimator (in PKR):**
    - Calculates financial remediation investment across 3 options: In-House SOP, Outsourced Accredited Lab (PCSIR Lahore / Metal Testing Lab Sialkot), or Full System Certification.
    - Computes net order margin: $\text{Net Profit} = \text{Order Revenue (PKR)} - \text{Manufacturing Cost} - \text{Remediation Investment}$.

### Module E: Regulatory Inspection & Remediation Workflow
13. **Mock FDA QMSR 483 Inspection Simulator:**
    - Simulates an on-site FDA foreign inspection under 21 CFR Part 820 QMSR and ISO 13485.
    - 32 targeted checklist questions spanning the 8 statutory quality pillars.
    - Correlates questionnaire responses directly with Evidence Vault data to output an Inspection Readiness Score (0–100).
    - Synthesizes realistic simulated FDA Form 483 Inspectional Observations with exact statutory citations (e.g., 21 CFR 820.75 for Passivation Process Validation).
14. **Reactive Gap Remediation Kanban Board:**
    - Automatically converts evaluated GAPs into actionable task cards.
    - Back-calculates task due dates from the vessel shipment deadline using the Critical Path Method (CPM).
    - Re-evaluates decision engine state reactively upon new evidence upload.
15. **ISO 13485:2016 6-Stage Certification Roadmap:**
    - Guided interactive implementation roadmap for Sialkot SMEs transitioning from uncertified workshops to ISO 13485:2016 compliance.
    - Directory of accredited notified bodies operating in Pakistan.

### Module F: Analytics, Export Gatekeeping & Governance
16. **Executive Compliance Dashboard & Risk Matrix:**
    - High-density Recharts compliance heatmap.
    - Risk Matrix plotting Schedule Effort vs. Revenue Value (bubble size = USD contract size).
    - Revenue Bottleneck Pareto chart.
17. **Export Document Gatekeeper:**
    - Hard statutory gate locking the generation of Commercial Invoices and Packing Lists until all order items achieve verified Document-Backed status.
18. **One-Click Traceable Audit PDF Certificate:**
    - Generates tamper-proof audit certificates citing exact CFR sections, Import Alert 76-01 clauses, and embedding the SHA-256 Ledger sequence stamp.
19. **Admin Regulatory Rule Base Manager:**
    - Centralized rule management interface with semantic versioning (e.g., Rule Base v2.4).
    - Every order evaluation permanently logs the exact rule-base version applied.
20. **Buyer Trust Verification Portal:**
    - Cryptographically signed, expiring, read-only URL allowing US buyers to verify proof grades and SHA-256 ledger integrity for a specific PO with zero tenant leak vectors.

---

## End-to-End System Workflow

```
+-----------------------------------------------------------------------------------+
|                           STAGE 1: TENANT SETUP & EVIDENCE LEDGER                |
|  - Register Sialkot Factory (SCCI Reg, FDA FEI, Green List Status)               |
|  - Ingest Quality Evidence into Vault (MTC, Passivation, DHR, Calibration)        |
|  - Compute SHA-256 File Hash -> Link to prev_hash (Tamper-Evident Ledger)        |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                           STAGE 2: ORDER INTAKE & NLP MATCHING                    |
|  - Ingest Buyer PO Metadata (Dissecting Scissors, 5,000 pcs, $48,500, Nov 20)     |
|  - Tokenize & Embed Quality Clauses using MiniLM-L6-v2 Embeddings                 |
|  - Cosine Similarity Matching against 25 Regulatory Rules -> Human Confirmation   |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                           STAGE 3: BILATERAL DECISION ENGINE                      |
|  - Factory-Side Evaluation: Cross-reference rules with Evidence Vault             |
|    * Classify as MET, GAP, or BLOCKER                                             |
|  - Buyer-Side Vetting: Verify Buyer FEI & US Agent -> Flag BUYER-SIDE BLOCKERS    |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                           STAGE 4: STOCHASTIC RISK & ECONOMIC OPTIMIZATION        |
|  - Execute 10,000-run Monte Carlo Simulation with PERT Gap Distributions          |
|    * Output P(on-time) [64.2%], P50 [Nov 14], P90 [Nov 26] & Tornado Sensitivity |
|  - Run 0/1 Knapsack Optimizer to maximize unlocked order revenue under lead time  |
|  - Calculate Compliance Testing Cost in PKR vs Export Profit Margin               |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                           STAGE 5: GAP REMEDIATION & MOCK INSPECTION              |
|  - Convert GAPs to Kanban Task Cards with CPM Back-Calculated Deadlines           |
|  - Execute Mock FDA QMSR Inspection Wizard (32 Questions across 8 Pillars)         |
|  - Compute Readiness Score (58/100) & Generate Simulated Form 483 Observations    |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                           STAGE 6: EXPORT GATEKEEPING & AUDIT RELEASE             |
|  - Gatekeeper verifies all critical items reach Document-Backed grade             |
|  - Unlock Commercial Invoice & Packing List Generation                            |
|  - Generate Cryptographically Signed Audit PDF with SHA-256 Ledger Stamp          |
+-----------------------------------------------------------------------------------+
```

---

## Mathematical Formulations

### 1. Cryptographic Ledger Hash Chaining
For document $i$ uploaded at sequence $k$ within tenant $T$:
$$\text{Payload}_k = \text{SHA256}(F_k) \,||\, \text{Type}_k \,||\, \text{Date}_{\text{claimed}} \,||\, \text{Timestamp}_{\text{UTC}}$$
$$H_k = \text{SHA256}(H_{k-1} \,||\, \text{Payload}_k)$$
Where $H_0 = \text{SHA256}(\text{"GENESIS\_BLOCK\_"} \,||\, \text{TenantID})$.

**Backdating Heuristic:**
$$\Delta_{\text{days}} = |\text{Date}_{\text{upload}} - \text{Date}_{\text{claimed}}|$$
$$\text{If } \Delta_{\text{days}} > 30 \implies \text{Status} = \text{TAMPER\_SUSPECT\_BACKDATED} \implies \text{Grade} = \text{SELF\_DECLARED}$$

### 2. Monte Carlo Lead-Time Simulation (PERT Distribution)
For each compliance gap $g \in G$, with three-point estimates: minimum $a_g$, most likely $m_g$, and maximum $b_g$:
$$\mu_g = \frac{a_g + 4m_g + b_g}{6}, \quad \sigma_g = \frac{b_g - a_g}{6}$$
$$\alpha_g = 1 + 4\left(\frac{m_g - a_g}{b_g - a_g}\right), \quad \beta_g = 1 + 4\left(\frac{b_g - m_g}{b_g - a_g}\right)$$
$$X_g \sim a_g + (b_g - a_g) \cdot \text{Beta}(\alpha_g, \beta_g)$$

For iteration $j \in \{1, \dots, N\}$ where $N = 10,000$:
$$T^{(j)} = \sum_{g \in G} X_g^{(j)}$$
$$P(\text{on-time}) = \frac{1}{N} \sum_{j=1}^{N} \mathbb{I}\left(T^{(j)} \le D_{\text{deadline}} - D_{\text{intake}}\right)$$

**Sensitivity Tornado Correlation:**
$$\rho_g = \frac{\sum_{j=1}^{N} (X_g^{(j)} - \bar{X}_g)(T^{(j)} - \bar{T})}{\sqrt{\sum_{j=1}^{N} (X_g^{(j)} - \bar{X}_g)^2 \sum_{j=1}^{N} (T^{(j)} - \bar{T})^2}}$$

### 3. 0/1 Knapsack Optimization for Compliance Fixes
Given $M$ orders, each order $i$ having contract value $V_i$, and requiring a set of gap resolutions $S_i$ with total days $W_i = \sum_{g \in S_i} \text{Days}_g$. Given remaining factory days $C$:
$$\max \sum_{i=1}^{M} V_i \cdot x_i \quad \text{subject to} \quad \sum_{i=1}^{M} W_i \cdot x_i \le C, \quad x_i \in \{0, 1\}$$

---

## Sprint Implementation Plan (3 Weeks)

| Sprint Week | Focus Area | Deliverables Shipped | Modules & Files |
| :---: | :--- | :--- | :--- |
| **Week 1** | **Cryptographic Ledger & Core Verification** | - DB migrations for `evidence_ledger`.<br>- SHA-256 hash chaining engine with genesis initialization.<br>- Backdating heuristic detection.<br>- Evidence Vault UI with cryptographic verification badges. | `db/migrations/001_ledger.sql`<br>`services/ledgerService.js`<br>`components/VaultLedger.jsx`<br>`data/seedEvidence.js` |
| **Week 2** | **Monte Carlo Risk Engine & Knapsack** | - 10,000 PERT stochastic simulation worker.<br>- Recharts CDF cumulative curve & Tornado bar chart.<br>- 0/1 Knapsack optimizer with revenue slider.<br>- PKR compliance cost estimator. | `services/monteCarloEngine.js`<br>`components/RiskSimulator.jsx`<br>`components/KnapsackPlanner.jsx`<br>`components/TornadoChart.jsx` |
| **Week 3** | **Mock FDA Investigator & Export Gatekeeper** | - 32-question QMSR audit wizard across 8 pillars.<br>- Automated 483 observation generator.<br>- Export Gatekeeper commercial invoice release lock.<br>- Traceable Audit Certificate with ledger block. | `services/auditSimulator.js`<br>`components/MockAuditWizard.jsx`<br>`components/GatekeeperModal.jsx`<br>`components/AuditReportView.jsx` |

---

## Live Demo Presentation Script (5 Minutes)

- **Minute 0:00 - 1:00:** Introduce Sialkot's export crisis under FDA Import Alert 76-01. Open PO-8821 for 5,000 Mayo Dissecting Scissors ($48,500 USD). Run the compliance check to demonstrate the initial `GAP DETECTED` status.
- **Minute 1:00 - 2:00:** Navigate to the Evidence Vault & Ledger. Demonstrate the 42-block cryptographic chain. Showcase the backdating detection on a suspect Mill Test Certificate whose claimed date diverges by 284 days, triggering automatic downgrade.
- **Minute 2:00 - 3:15:** Run the 10,000-run Monte Carlo Lead-Time Simulator. Prove why naive arithmetic (11 days) fails: the real $P(\text{on-time})$ is only **64.2%** due to local lab passivation backlogs. Highlight the Tornado Chart pointing to ASTM A967 testing as the primary bottleneck.
- **Minute 3:15 - 4:15:** Switch to the Mock FDA QMSR Inspection Simulator. Show how missing passivation validation protocols produce a simulated FDA Form 483 citation under 21 CFR 820.75, dropping the factory readiness score to 58/100 (High Risk).
- **Minute 4:15 - 5:00:** Resolve the gap via expedited testing. Show $P(\text{on-time})$ surging to **94.2%**, gatekeeper unlocking the commercial invoice, and generating the final Traceable Audit Certificate complete with cryptographic ledger stamp.
