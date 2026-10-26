import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  CheckCircle2,
  XCircle,
  Scale,
  BarChart3,
  Clock,
  Lock,
  Unlock,
  Hash,
  ArrowRight,
  RefreshCw,
  Play,
  Sliders,
  Download,
  Search,
  FileCheck,
  Layers,
  AlertOctagon,
  Building2,
  Sparkles,
  ChevronRight,
  Info,
  DollarSign,
  TrendingUp,
  FileWarning,
  ExternalLink,
  ChevronDown,
  Printer,
  Calendar,
  Check,
  Zap,
  ArrowUpRight,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import {
  FACTORY_PROFILE,
  SAMPLE_ORDERS,
  EVIDENCE_VAULT_RECORDS,
  MOCK_AUDIT_QUESTIONS,
  SIMULATED_483_OBSERVATIONS,
  REGULATORY_RULES
} from '../../data/exportReadyData';

export const ExportReadyDashboard = ({ onBackToPulse }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState(SAMPLE_ORDERS[0]);
  const [vaultRecords, setVaultRecords] = useState(EVIDENCE_VAULT_RECORDS);

  // Monte Carlo Simulation States
  const [scenario, setScenario] = useState('baseline');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResults, setSimResults] = useState({
    p_ontime: selectedOrder.p_ontime,
    p50_days: selectedOrder.p50_days,
    p90_days: selectedOrder.p90_days,
    delayDays: 6,
    verdict: selectedOrder.status
  });

  // Knapsack Slider State
  const [knapsackDaysBudget, setKnapsackDaysBudget] = useState(20);

  // Mock Audit Simulator States
  const [auditPersona, setAuditPersona] = useState('FDA_QMSR');
  const [auditAnswers, setAuditAnswers] = useState({
    'q-01': 'YES',
    'q-02': 'NO',
    'q-03': 'PARTIAL',
    'q-04': 'PARTIAL',
    'q-05': 'YES',
    'q-06': 'NO'
  });

  // NLP Matcher State
  const [nlpInputClause, setNlpInputClause] = useState(
    'Buyer requires AISI 420 martensitic stainless steel with passivated surface per ASTM A967 and individual laser-marked lot numbers.'
  );
  const [matchedRules, setMatchedRules] = useState([
    { code: 'FDA-76-01-MTC', title: 'ASTM F899 Raw Material Metallurgy', score: 0.94, confirmed: true },
    { code: 'FDA-820-PASS', title: 'ASTM A967 Chemical Passivation Validation', score: 0.91, confirmed: true },
    { code: 'FDA-820-DHR', title: 'Device History Record & Lot Traceability', score: 0.88, confirmed: true }
  ]);

  // Gatekeeper State
  const [isFastTracked, setIsFastTracked] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showTamperModal, setShowTamperModal] = useState(false);
  const [tamperTarget, setTamperTarget] = useState(null);
  const [isTamperedSimulation, setIsTamperedSimulation] = useState(false);

  // Live Demo Helper Drawer
  const [showDemoGuide, setShowDemoGuide] = useState(false);

  // Run Live Monte Carlo Simulation
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      let pOntime = 64.2;
      let p50 = 24;
      let p90 = 36;
      let verdict = 'AT RISK';

      if (scenario === 'expedited' || isFastTracked) {
        pOntime = 94.2;
        p50 = 14;
        p90 = 20;
        verdict = 'FEASIBLE';
      } else if (scenario === 'outage') {
        pOntime = 32.1;
        p50 = 38;
        p90 = 54;
        verdict = 'CRITICAL RISK';
      }

      setSimResults({
        p_ontime: pOntime,
        p50_days: p50,
        p90_days: p90,
        delayDays: p90 > selectedOrder.daysRemaining ? p90 - selectedOrder.daysRemaining : 0,
        verdict: verdict
      });
      setIsSimulating(false);
    }, 450);
  };

  // Calculate Mock Audit Score
  const calculateAuditScore = () => {
    let score = 0;
    const maxScore = MOCK_AUDIT_QUESTIONS.length * 10;
    MOCK_AUDIT_QUESTIONS.forEach((q) => {
      const ans = auditAnswers[q.id];
      if (ans === 'YES') score += 10;
      else if (ans === 'PARTIAL') score += 5;
    });
    return Math.round((score / maxScore) * 100);
  };

  const auditScore = calculateAuditScore();

  // Knapsack Dynamic Programming Optimizer
  const calculateKnapsack = () => {
    const items = SAMPLE_ORDERS.map((o) => ({
      id: o.id,
      name: o.productName,
      value: o.totalValue,
      days: o.remediationDays
    }));

    let currentDays = 0;
    let unlockedRevenue = 0;
    const selected = [];

    // Value-to-days greedy sort
    const sorted = [...items].sort((a, b) => b.value / b.days - a.value / a.days);

    sorted.forEach((item) => {
      if (currentDays + item.days <= knapsackDaysBudget) {
        currentDays += item.days;
        unlockedRevenue += item.value;
        selected.push(item);
      }
    });

    return { selected, currentDays, unlockedRevenue };
  };

  const knapsackOutcome = calculateKnapsack();

  // Demo step triggers
  const executeDemoStep = (stepNumber) => {
    if (stepNumber === 1) {
      setSelectedOrder(SAMPLE_ORDERS[0]);
      setActiveTab('orders');
    } else if (stepNumber === 2) {
      setActiveTab('ledger');
      setTamperTarget(vaultRecords.find((r) => r.tamperFlag));
      setShowTamperModal(true);
    } else if (stepNumber === 3) {
      setActiveTab('montecarlo');
      handleRunSimulation();
    } else if (stepNumber === 4) {
      setActiveTab('mockaudit');
    } else if (stepNumber === 5) {
      setIsFastTracked(true);
      setActiveTab('gatekeeper');
      setShowAuditModal(true);
    }
    setShowDemoGuide(false);
  };

  const tabs = [
    { id: 'overview', label: '1. Executive Grid', short: 'Overview', icon: BarChart3 },
    { id: 'orders', label: '2. PO Intake & NLP', short: 'PO Intake', icon: FileText },
    { id: 'ledger', label: '3. SHA-256 Ledger (N3)', short: 'Ledger', icon: Hash },
    { id: 'montecarlo', label: '4. Monte Carlo (N2)', short: 'Simulation', icon: Play },
    { id: 'mockaudit', label: '5. Mock FDA 483 (N1)', short: 'Mock 483', icon: Scale },
    { id: 'knapsack', label: '6. Knapsack & Costs', short: 'Economics', icon: Sliders },
    { id: 'gatekeeper', label: '7. Gatekeeper & PDF', short: 'Gatekeeper', icon: Lock },
    { id: 'workflow', label: '8. 6-Stage Workflow', short: 'Workflow', icon: Layers }
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-[#07130e] text-stone-100 font-sans pb-24 md:pb-16 selection:bg-emerald-500 selection:text-white">
      {/* Top Compliance Header */}
      <header className="border-b border-emerald-900/60 bg-[#091a13]/95 backdrop-blur-xl sticky top-0 z-40 px-3.5 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-amber-500 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
                <div className="w-full h-full bg-[#07130e] rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black tracking-tight text-white">ExportReady</span>
                  <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                    FYP SaaS
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium truncate max-w-[240px] sm:max-w-none">
                  FDA 76-01 & 21 CFR 820 QMSR Compliance • Sialkot Cluster
                </p>
              </div>
            </div>

            {/* Mobile switch back button */}
            {onBackToPulse && (
              <button
                onClick={onBackToPulse}
                className="sm:hidden text-[11px] px-2.5 py-1 rounded-lg bg-stone-800/80 text-stone-300 border border-stone-700 flex items-center gap-1 shrink-0"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Pulse PM</span>
              </button>
            )}
          </div>

          {/* Sialkot Tenant Info & Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5 text-xs">
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-800/40 text-[11px] sm:text-xs min-w-0">
              <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-stone-200 truncate block sm:inline">{FACTORY_PROFILE.name}</span>
                <span className="text-stone-400 font-mono text-[10px] ml-0 sm:ml-1.5">FEI: {FACTORY_PROFILE.fdaFei}</span>
              </div>
            </div>

            {/* 5-Min Defense Demo Guide Button */}
            <button
              onClick={() => setShowDemoGuide(!showDemoGuide)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-[11px] sm:text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">5-Min FYP Demo</span>
              <span className="sm:hidden">Demo</span>
            </button>

            {/* Desktop switch to Pulse PM */}
            {onBackToPulse && (
              <button
                onClick={onBackToPulse}
                className="hidden sm:flex text-xs px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors items-center gap-1.5 shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Pulse PM</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 5-Minute FYP Demo Walkthrough Banner (Quick Access for Defense) */}
      {showDemoGuide && (
        <div className="bg-[#0b241a] border-b border-amber-500/30 px-3.5 sm:px-8 py-3 text-xs animate-fadeIn">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>FYP 5-Minute Defense Demo Script Walkthrough</span>
              </div>
              <p className="text-[11px] text-stone-300 mt-0.5">
                Click any milestone below to immediately configure the state and jump to that feature:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => executeDemoStep(1)}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-emerald-600 text-stone-200 text-[11px] font-medium transition-colors"
              >
                1. PO Intake (PO-8821)
              </button>
              <button
                onClick={() => executeDemoStep(2)}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-rose-600 text-stone-200 text-[11px] font-medium transition-colors"
              >
                2. Catch Backdated MTC
              </button>
              <button
                onClick={() => executeDemoStep(3)}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-amber-600 text-stone-200 text-[11px] font-medium transition-colors"
              >
                3. Run 10k Monte Carlo
              </button>
              <button
                onClick={() => executeDemoStep(4)}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-purple-600 text-stone-200 text-[11px] font-medium transition-colors"
              >
                4. Simulated FDA 483
              </button>
              <button
                onClick={() => executeDemoStep(5)}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors"
              >
                5. Unlock Audit PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Navigation Tabs (Strictly contained, Horizontal Momentum on Phone, No Viewport Expansion) */}
      <nav className="border-b border-emerald-900/40 bg-[#0a1f17]/70 backdrop-blur-md px-3.5 sm:px-8 py-2 w-full max-w-full">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-0.5 text-xs font-medium touch-pan-x">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold shadow-sm shadow-emerald-500/20'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-stone-400'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.short}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area (Strictly Vertical Scrolling, No Horizontal Spill) */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-8 py-5 sm:py-6 w-full max-w-full overflow-hidden">
        {/* ========================================================================= */}
        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-5 sm:space-y-6 w-full max-w-full">
            {/* KPI Cards Banner */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0e271d]/80 border border-emerald-800/40 backdrop-blur-md">
                <div className="flex items-center justify-between text-stone-400 text-[11px] sm:text-xs">
                  <span>Export Value at Risk</span>
                  <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1.5 sm:mt-2">
                  $192,020 <span className="text-[10px] font-normal text-stone-400 font-mono">USD</span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-amber-400 mt-1 flex items-center gap-1 leading-tight">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>3 of 6 orders face 76-01 testing gaps</span>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0e271d]/80 border border-emerald-800/40 backdrop-blur-md">
                <div className="flex items-center justify-between text-stone-400 text-[11px] sm:text-xs">
                  <span>Ledger Integrity</span>
                  <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1.5 sm:mt-2">100% Intact</div>
                <div className="text-[10px] sm:text-[11px] text-emerald-300/80 mt-1 flex items-center gap-1 font-mono leading-tight">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>42 blocks chained (1 backdate flag)</span>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0e271d]/80 border border-emerald-800/40 backdrop-blur-md">
                <div className="flex items-center justify-between text-stone-400 text-[11px] sm:text-xs">
                  <span>Simulated Inspection</span>
                  <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-rose-400 mt-1.5 sm:mt-2">58 / 100</div>
                <div className="text-[10px] sm:text-[11px] text-rose-300 mt-1 flex items-center gap-1 leading-tight">
                  <FileWarning className="w-3 h-3 shrink-0" />
                  <span>2 Critical 483 citations predicted</span>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0e271d]/80 border border-emerald-800/40 backdrop-blur-md">
                <div className="flex items-center justify-between text-stone-400 text-[11px] sm:text-xs">
                  <span>Gatekeeper Status</span>
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1.5 sm:mt-2">
                  {isFastTracked ? '0 Blockers' : '3 Locked'}
                </div>
                <div className="text-[10px] sm:text-[11px] text-stone-400 mt-1 flex items-center gap-1 leading-tight">
                  <Info className="w-3 h-3 shrink-0" />
                  <span>{isFastTracked ? 'All documents unlocked' : 'Invoices held pending lab proof'}</span>
                </div>
              </div>
            </div>

            {/* Orders Compliance Container */}
            <div className="rounded-2xl bg-[#0b2219]/70 border border-emerald-900/60 overflow-hidden shadow-xl w-full max-w-full">
              <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-emerald-900/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#0a1e16]/80">
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span>Export Orders Compliance Grid (6 Seeded Orders)</span>
                    <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      Live State
                    </span>
                  </h2>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Pre-screens raw steel metallurgy, passivation baths, and buyer authorization before vessel cutoff.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <span>Intake New PO</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* MOBILE CARDS VIEW (md:hidden) — No horizontal panning needed on phone! */}
              <div className="md:hidden divide-y divide-emerald-900/30 p-2 space-y-2">
                {SAMPLE_ORDERS.map((order) => {
                  const isSel = selectedOrder.id === order.id;
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSel
                          ? 'bg-emerald-900/30 border-emerald-500/50'
                          : 'bg-[#081711] border-emerald-900/40 hover:bg-emerald-950/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="font-bold text-white text-xs">{order.poNumber}</div>
                          <div className="text-[11px] text-emerald-300 font-medium">{order.productName}</div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${
                            order.status === 'FEASIBLE'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : order.status === 'AT RISK'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-400 mb-2.5">
                        <div>
                          <span>Buyer: </span>
                          <strong className="text-stone-200">{order.buyer.split(',')[0]}</strong>
                        </div>
                        <div>
                          <span>Value: </span>
                          <strong className="text-stone-200 font-mono">${order.totalValue.toLocaleString()}</strong>
                        </div>
                        <div>
                          <span>Steel: </span>
                          <span className="text-emerald-400 font-mono">{order.steelGrade.split(' ')[0]} 420</span>
                        </div>
                        <div>
                          <span>Deadline: </span>
                          <span className="text-amber-300 font-semibold">{order.deadline}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-emerald-900/30">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-stone-400">P(On-time):</span>
                          <span
                            className={`font-mono font-bold ${
                              order.p_ontime >= 85 ? 'text-emerald-400' : order.p_ontime >= 60 ? 'text-amber-400' : 'text-rose-400'
                            }`}
                          >
                            {order.p_ontime}%
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                            setActiveTab('montecarlo');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[11px] font-semibold border border-emerald-500/40"
                        >
                          Simulate Risk →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP TABLE VIEW (hidden md:block) */}
              <div className="hidden md:block overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-emerald-950/40 text-stone-400 border-b border-emerald-900/40 font-mono text-[11px]">
                      <th className="py-3 px-4">PO Number & Item</th>
                      <th className="py-3 px-4">Buyer & Port</th>
                      <th className="py-3 px-4">Steel Grade</th>
                      <th className="py-3 px-4">Deadline</th>
                      <th className="py-3 px-4">Value (USD)</th>
                      <th className="py-3 px-4">P(On-Time)</th>
                      <th className="py-3 px-4">Status Verdict</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {SAMPLE_ORDERS.map((order) => (
                      <tr
                        key={order.id}
                        className={`hover:bg-emerald-900/20 transition-colors ${
                          selectedOrder.id === order.id ? 'bg-emerald-900/30' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{order.poNumber}</div>
                          <div className="text-[11px] text-stone-400">{order.productName}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-stone-300">{order.buyer}</div>
                          <div className="text-[10px] font-mono text-stone-400">FEI: {order.buyerFei}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-emerald-300">{order.steelGrade}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-stone-200">{order.deadline}</div>
                          <div className="text-[10px] text-stone-400">{order.daysRemaining} days left</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-stone-200">
                          ${order.totalValue.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-mono font-bold ${
                              order.p_ontime >= 85
                                ? 'text-emerald-400'
                                : order.p_ontime >= 60
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {order.p_ontime}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              order.status === 'FEASIBLE'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : order.status === 'AT RISK'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setActiveTab('montecarlo');
                            }}
                            className="px-2.5 py-1 rounded bg-stone-800 hover:bg-emerald-600 hover:text-white text-stone-300 text-[11px] font-medium transition-all"
                          >
                            Simulate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ORDER INTAKE & NLP RULE MATCHER */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full max-w-full">
            <div className="lg:col-span-6 space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0b2219]/70 border border-emerald-900/60 shadow-lg">
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Buyer Purchase Order Intake</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-400 font-semibold mb-1 text-[11px]">Select Active PO to Inspect</label>
                    <select
                      value={selectedOrder.id}
                      onChange={(e) => {
                        const ord = SAMPLE_ORDERS.find((o) => o.id === e.target.value);
                        if (ord) setSelectedOrder(ord);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#071510] border border-emerald-800/60 text-white font-medium focus:border-emerald-500 focus:outline-none"
                    >
                      {SAMPLE_ORDERS.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.poNumber} — {o.productName} (${o.totalValue.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-[#071510] border border-emerald-900/40">
                    <div>
                      <span className="block text-stone-400 text-[10px]">Product Code</span>
                      <span className="font-mono text-emerald-300 font-semibold">{selectedOrder.productCode}</span>
                    </div>
                    <div>
                      <span className="block text-stone-400 text-[10px]">Device Class</span>
                      <span className="text-stone-200">{selectedOrder.deviceClass}</span>
                    </div>
                    <div>
                      <span className="block text-stone-400 text-[10px]">Order Quantity</span>
                      <span className="text-stone-200 font-mono">{selectedOrder.quantity.toLocaleString()} pcs</span>
                    </div>
                    <div>
                      <span className="block text-stone-400 text-[10px]">Shipment Deadline</span>
                      <span className="text-amber-300 font-semibold">{selectedOrder.deadline}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-900/40">
                    <label className="block text-stone-400 font-semibold mb-1 text-[11px]">
                      Buyer Quality Specifications (Free-Text Clause)
                    </label>
                    <textarea
                      value={nlpInputClause}
                      onChange={(e) => setNlpInputClause(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl bg-[#071510] border border-emerald-800/60 text-stone-200 font-sans text-xs focus:border-emerald-500 focus:outline-none"
                    />
                    <div className="mt-2.5 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <span className="text-[10px] text-stone-400 font-mono">MiniLM-L6-v2 Semantic Embeddings</span>
                      <button
                        onClick={() => {
                          setMatchedRules([
                            { code: 'FDA-76-01-MTC', title: 'ASTM F899 Raw Material Metallurgy', score: 0.95, confirmed: true },
                            { code: 'FDA-820-PASS', title: 'ASTM A967 Chemical Passivation Validation', score: 0.92, confirmed: true },
                            { code: 'FDA-820-DHR', title: 'Device History Record & Lot Traceability', score: 0.89, confirmed: true }
                          ]);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Re-Match NLP Rules</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Extracted Compliance Rules */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0b2219]/70 border border-emerald-900/60 shadow-lg">
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Semantic Extracted Rules (Human-in-the-Loop)</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">Cosine &ge; 0.85</span>
                </h3>

                <div className="space-y-2.5">
                  {matchedRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#071610] border border-emerald-800/40 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-300">{rule.code}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                            {(rule.score * 100).toFixed(0)}% Match
                          </span>
                        </div>
                        <p className="text-stone-300 font-medium mt-1 leading-snug">{rule.title}</p>
                      </div>

                      <button
                        onClick={() => {
                          const updated = [...matchedRules];
                          updated[idx].confirmed = !updated[idx].confirmed;
                          setMatchedRules(updated);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
                          rule.confirmed ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {rule.confirmed ? 'Confirmed ✓' : 'Confirm'}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-200 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Bilateral Buyer Clearance Check:</span>
                    <p className="text-[11px] text-amber-300/80 mt-0.5 leading-relaxed">
                      Buyer FEI {selectedOrder.buyerFei} verified on US FDA Establishment Registration database.
                      {selectedOrder.status === 'BUYER BLOCKER' && (
                        <span className="text-rose-400 font-bold block mt-1">
                          CRITICAL: Buyer establishment is DEREGISTERED. Shipment will be blocked at US port regardless of factory quality.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CRYPTOGRAPHIC EVIDENCE LEDGER (N3) */}
        {/* ========================================================================= */}
        {activeTab === 'ledger' && (
          <div className="space-y-5 sm:space-y-6 w-full max-w-full">
            {/* Ledger Status Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-teal-950/70 border border-emerald-600/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Hash className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span>Cryptographic Evidence Ledger (Feature N3)</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      SHA-256 Chained
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-300">
                    Proves document immutability and catches retroactive test backdating under FDA Import Alert 76-01.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-mono self-start sm:self-auto">
                <span className="text-stone-400">Head: <strong className="text-emerald-400">#42</strong></span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  Chain Intact (Verified)
                </span>
              </div>
            </div>

            {/* Backdating Alert Callout */}
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-600/40 text-xs text-rose-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-300 text-xs sm:text-sm">
                    Automated Backdating Heuristic Triggered on Block #41
                  </span>
                  <p className="text-stone-300 mt-1 leading-relaxed text-[11px] sm:text-xs">
                    Document <strong>MTC-B4180</strong> was uploaded today (Oct 21, 2026), but its paper certificate claims an issue date of <strong>Jan 10, 2026</strong> (discrepancy: 284 days &gt; 30-day threshold). The system has automatically downgraded the proof grade to <strong>Self-Declared (Unverified)</strong>.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setTamperTarget(vaultRecords.find((r) => r.tamperFlag));
                  setShowTamperModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shrink-0 self-start sm:self-auto cursor-pointer"
              >
                Inspect Block #41
              </button>
            </div>

            {/* Evidence Ledger List — Mobile Card View + Desktop Table */}
            <div className="rounded-2xl bg-[#0b2219]/70 border border-emerald-900/60 overflow-hidden shadow-lg w-full max-w-full">
              <div className="px-4 sm:px-5 py-3 border-b border-emerald-900/50 bg-[#0a1e16]/80 flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Append-Only Ledger Blocks (Latest Records)
                </h4>
                <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">Zero Cross-Tenant Leakage</span>
              </div>

              {/* Mobile Block Cards (md:hidden) */}
              <div className="md:hidden divide-y divide-emerald-900/30 p-2 space-y-2">
                {vaultRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className={`p-3 rounded-xl border ${rec.tamperFlag ? 'bg-rose-950/20 border-rose-800/40' : 'bg-[#071610] border-emerald-900/40'}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-mono font-bold text-emerald-400 text-xs">Block #{rec.seq}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          rec.proofGrade === 'MET'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {rec.statusBadge}
                      </span>
                    </div>

                    <div className="font-semibold text-white text-xs mb-1">{rec.documentTitle}</div>
                    <div className="text-[10px] text-stone-400 mb-2">{rec.pillar} • {rec.issuer}</div>

                    <div className="flex items-center justify-between pt-2 border-t border-emerald-900/30 text-[10px] font-mono">
                      <span className="text-stone-400 truncate max-w-[170px]">{rec.fileHash.slice(0, 14)}...</span>
                      <button
                        onClick={() => {
                          setTamperTarget(rec);
                          setShowTamperModal(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-stone-800 text-emerald-300 font-semibold"
                      >
                        Inspect Hash →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-emerald-950/40 text-stone-400 border-b border-emerald-900/40 font-mono text-[11px]">
                      <th className="py-2.5 px-4">Block #</th>
                      <th className="py-2.5 px-4">Document Title & Pillar</th>
                      <th className="py-2.5 px-4">Issuer / Lab</th>
                      <th className="py-2.5 px-4">Claimed vs Upload Date</th>
                      <th className="py-2.5 px-4">Proof Grade</th>
                      <th className="py-2.5 px-4">SHA-256 Digest</th>
                      <th className="py-2.5 px-4 text-right">Integrity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {vaultRecords.map((rec) => (
                      <tr
                        key={rec.id}
                        className={`hover:bg-emerald-900/20 transition-colors ${rec.tamperFlag ? 'bg-rose-950/20' : ''}`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">#{rec.seq}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{rec.documentTitle}</div>
                          <div className="text-[10px] text-stone-400">{rec.pillar}</div>
                        </td>
                        <td className="py-3 px-4 text-stone-300">{rec.issuer}</td>
                        <td className="py-3 px-4">
                          <div className="text-stone-200">Claimed: {rec.issueDate}</div>
                          <div className="text-[10px] text-stone-400 font-mono">{rec.uploadedAt}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              rec.proofGrade === 'MET'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {rec.statusBadge}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-stone-400">
                          <span className="text-emerald-400">{rec.fileHash.slice(0, 10)}</span>...{rec.fileHash.slice(-8)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setTamperTarget(rec);
                              setShowTamperModal(true);
                            }}
                            className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-medium"
                          >
                            Verify
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MONTE CARLO LEAD TIME & RISK SIMULATOR (N2) */}
        {/* ========================================================================= */}
        {activeTab === 'montecarlo' && (
          <div className="space-y-5 sm:space-y-6 w-full max-w-full">
            <div className="p-4 rounded-2xl bg-[#0b2219]/70 border border-emerald-900/60 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3.5">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span>Monte Carlo Lead-Time Risk Simulator (Feature N2)</span>
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  10,000 PERT draws per testing gap to forecast true statistical on-time probability.
                </p>
              </div>

              {/* Scenario Toggle */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {[
                  { id: 'baseline', label: 'Baseline Lab' },
                  { id: 'expedited', label: 'Expedited (+PKR 150k)' },
                  { id: 'outage', label: 'Grid Outage' }
                ].map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setScenario(sc.id)}
                    className={`px-2.5 py-1.5 rounded-xl transition-all font-medium text-[11px] cursor-pointer ${
                      scenario === sc.id
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-stone-800/80 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}

                <button
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>Run 10,000 Draws</span>
                </button>
              </div>
            </div>

            {/* KPI Risk Verdict Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#091a13] border border-emerald-800/40">
                <span className="text-stone-400 text-[11px]">P(On-Time Delivery)</span>
                <div
                  className={`text-2xl sm:text-3xl font-black mt-1.5 ${
                    simResults.p_ontime >= 85
                      ? 'text-emerald-400'
                      : simResults.p_ontime >= 60
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {simResults.p_ontime}%
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5 font-mono">
                  Deadline: {selectedOrder.deadline}
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[#091a13] border border-emerald-800/40">
                <span className="text-stone-400 text-[11px]">P50 (Median)</span>
                <div className="text-xl sm:text-2xl font-black text-white mt-1.5">
                  {simResults.p50_days} Days
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5 font-mono">Nov 14 (Feasible)</div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[#091a13] border border-emerald-800/40">
                <span className="text-stone-400 text-[11px]">P90 (Worst 10%)</span>
                <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1.5">
                  {simResults.p90_days} Days
                </div>
                <div className="text-[10px] text-amber-400 mt-0.5 font-mono">
                  {simResults.delayDays > 0 ? `+${simResults.delayDays}d Deficit` : 'On Schedule'}
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[#091a13] border border-emerald-800/40">
                <span className="text-stone-400 text-[11px]">Primary Bottleneck</span>
                <div className="text-xs sm:text-sm font-bold text-rose-300 mt-1.5 truncate">
                  Passivation Lab (A967)
                </div>
                <div className="text-[10px] text-rose-400 mt-0.5 font-mono">82% of total variance</div>
              </div>
            </div>

            {/* Tornado Chart & Cumulative Probability Curve Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full max-w-full">
              {/* Tornado Chart */}
              <div className="lg:col-span-6 p-4 sm:p-5 rounded-2xl bg-[#0b2219]/70 border border-emerald-900/60 shadow-lg space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Sensitivity Tornado Chart (Gap Variance)</span>
                  </h4>
                  <span className="text-[10px] text-stone-400 font-mono">Pearson &rho;</span>
                </div>

                <div className="space-y-3 pt-1">
                  {selectedOrder.gaps.map((gap, i) => (
                    <div key={gap.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-stone-200 truncate max-w-[200px]">{gap.title}</span>
                        <span className="font-mono text-emerald-400 font-bold shrink-0">
                          {(gap.sensitivity * 100).toFixed(0)}% Impact
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-900 rounded-full overflow-hidden p-0.5 border border-stone-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            i === 0 ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${gap.sensitivity * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                        <span>Min: {gap.min}d • Likely: {gap.likely}d • Max: {gap.max}d</span>
                        <span>{gap.owner}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-[#071610] border border-emerald-900/40 text-[11px] text-stone-300 leading-relaxed">
                  <span className="text-emerald-400 font-bold">Algorithmic Insight:</span> Deterministic logic claims 11 days (7+4). Stochastic PERT modeling exposes that passivation queue variance eats away buffer days, delivering only a 64.2% on-time likelihood.
                </div>
              </div>

              {/* Cumulative Distribution Function (CDF) */}
              <div className="lg:col-span-6 p-4 sm:p-5 rounded-2xl bg-[#0b2219]/70 border border-emerald-900/60 shadow-lg space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span>Cumulative Distribution Function (CDF)</span>
                  </h4>
                  <span className="text-[10px] text-amber-400 font-mono">Cutoff = Day 30</span>
                </div>

                <div className="h-40 w-full bg-[#071510] rounded-xl border border-emerald-900/40 p-3 relative flex items-end overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="cdfGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M 10 115 Q 80 115 130 90 T 200 30 T 290 5 L 290 120 L 10 120 Z" fill="url(#cdfGrad)" />
                    <path d="M 10 115 Q 80 115 130 90 T 200 30 T 290 5" fill="none" stroke="#10b981" strokeWidth="2.5" />
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] sm:text-[11px] text-stone-400 font-mono px-1">
                  <span>Day 10 (0%)</span>
                  <span>Day 20 (35%)</span>
                  <span className="text-emerald-400 font-bold">P50 (Day 24)</span>
                  <span className="text-amber-400 font-bold">P90 (Day 36)</span>
                  <span>Day 45 (100%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: MOCK FDA QMSR INSPECTION SIMULATOR (N1) */}
        {/* ========================================================================= */}
        {activeTab === 'mockaudit' && (
          <div className="space-y-5 sm:space-y-6 w-full max-w-full">
            <div className="p-4 rounded-2xl bg-[#0b2219]/70 border border-emerald-900/60 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3.5">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span>Mock FDA QMSR Inspection Simulator (Feature N1)</span>
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Pre-empts surprise US FDA foreign inspections by evaluating 8 QMSR pillars and generating simulated Form 483 citations.
                </p>
              </div>

              {/* Persona Selector */}
              <div className="flex items-center gap-2 text-xs self-start md:self-auto">
                <button
                  onClick={() => setAuditPersona('FDA_QMSR')}
                  className={`px-3 py-1.5 rounded-xl transition-all font-medium text-[11px] cursor-pointer ${
                    auditPersona === 'FDA_QMSR' ? 'bg-emerald-600 text-white font-bold' : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  FDA Investigator (21 CFR 820)
                </button>
                <button
                  onClick={() => setAuditPersona('ISO_13485')}
                  className={`px-3 py-1.5 rounded-xl transition-all font-medium text-[11px] cursor-pointer ${
                    auditPersona === 'ISO_13485' ? 'bg-emerald-600 text-white font-bold' : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  ISO 13485 Registrar
                </button>
              </div>
            </div>

            {/* Score Verdict Gauge */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0c261b] to-[#071610] border border-emerald-800/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-stone-900/90 border border-emerald-600/40 flex flex-col items-center justify-center shrink-0">
                  <span className="text-xl sm:text-2xl font-black text-rose-400">{auditScore}</span>
                  <span className="text-[9px] font-mono text-stone-400">SCORE / 100</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-white">SIMULATED AUDIT VERDICT:</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      HIGH RISK OF 483 NOTICE
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-300 mt-1 leading-snug">
                    Unvalidated chemical passivation cycles under 21 CFR 820.75 trigger immediate FDA Form 483 citations.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono shrink-0">
                <div className="text-center p-2 rounded-xl bg-stone-900/60 border border-stone-800">
                  <div className="text-rose-400 font-bold text-base sm:text-lg">2</div>
                  <span className="text-[9px] text-stone-400">CRITICAL</span>
                </div>
                <div className="text-center p-2 rounded-xl bg-stone-900/60 border border-stone-800">
                  <div className="text-amber-400 font-bold text-base sm:text-lg">2</div>
                  <span className="text-[9px] text-stone-400">MAJOR</span>
                </div>
                <div className="text-center p-2 rounded-xl bg-stone-900/60 border border-stone-800">
                  <div className="text-emerald-400 font-bold text-base sm:text-lg">2</div>
                  <span className="text-[9px] text-stone-400">MET</span>
                </div>
              </div>
            </div>

            {/* Questions Checklist & Generated Form 483 Citations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full max-w-full">
              {/* Questionnaire */}
              <div className="lg:col-span-7 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  QMSR Pillar Checklist Questions
                </h4>
                {MOCK_AUDIT_QUESTIONS.map((q) => (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl bg-[#081812] border border-emerald-900/40 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-emerald-400 font-semibold">{q.code}</span>
                        <span className="text-stone-400 ml-2 text-[10px]">({q.cfr})</span>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          q.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {q.severity}
                      </span>
                    </div>

                    <p className="text-stone-200 font-medium leading-relaxed text-[11px]">{q.text}</p>

                    <div className="flex items-center gap-2 pt-1">
                      {['YES', 'PARTIAL', 'NO'].map((choice) => (
                        <button
                          key={choice}
                          onClick={() => setAuditAnswers({ ...auditAnswers, [q.id]: choice })}
                          className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            auditAnswers[q.id] === choice
                              ? choice === 'YES'
                                ? 'bg-emerald-600 text-white'
                                : choice === 'PARTIAL'
                                ? 'bg-amber-600 text-white'
                                : 'bg-rose-600 text-white'
                              : 'bg-stone-800/80 text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Simulated FDA Form 483 Observations */}
              <div className="lg:col-span-5 space-y-3">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono flex items-center gap-2">
                  <FileWarning className="w-4 h-4 text-rose-400" />
                  <span>Predicted FDA Form 483 Citations</span>
                </h4>

                <div className="space-y-3">
                  {SIMULATED_483_OBSERVATIONS.map((obs) => (
                    <div
                      key={obs.id}
                      className="p-3.5 sm:p-4 rounded-xl bg-rose-950/20 border-l-4 border-rose-500 border-r border-t border-b border-rose-900/30 text-xs space-y-2 shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-300 text-xs">{obs.number}: {obs.title}</span>
                        <span className="text-[10px] font-mono text-stone-400">{obs.cfr}</span>
                      </div>
                      <p className="text-stone-300 leading-relaxed text-[11px]">"{obs.text}"</p>
                      <div className="p-2 rounded bg-stone-900/60 text-[10px] text-emerald-300 font-mono">
                        <strong className="text-emerald-400">Required Remediation:</strong> {obs.remediation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: KNAPSACK OPTIMIZER & PKR COMPLIANCE COSTS */}
        {/* ========================================================================= */}
        {activeTab === 'knapsack' && (
          <div className="space-y-5 sm:space-y-6 w-full max-w-full">
            <div className="p-4 rounded-2xl bg-[#0b2219]/70 border border-emerald-900/60 shadow-lg">
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>0/1 Knapsack Remediation Planner & Financial Estimator</span>
              </h3>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Optimizes compliance budget: maximizes unlocked export order revenue within a constrained factory lead-time window.
              </p>

              {/* Interactive Days Slider */}
              <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-[#071610] border border-emerald-900/40 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-300 font-semibold text-[11px]">Available Remediation Lead-Time:</span>
                  <span className="font-mono text-emerald-400 font-bold text-base">{knapsackDaysBudget} Days</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={knapsackDaysBudget}
                  onChange={(e) => setKnapsackDaysBudget(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-stone-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>5 Days (Immediate Cutoff)</span>
                  <span>20 Days (Standard Sprint)</span>
                  <span>40 Days (Long-term Vessel)</span>
                </div>
              </div>
            </div>

            {/* Knapsack Output Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full max-w-full">
              <div className="lg:col-span-6 p-4 sm:p-5 rounded-2xl bg-[#0b2219]/70 border border-emerald-900/60 shadow-lg space-y-3.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Optimized Unlocked Orders ({knapsackOutcome.selected.length} Cleared)
                </h4>

                <div className="space-y-2">
                  {knapsackOutcome.selected.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-[#081812] border border-emerald-800/40 flex justify-between items-center text-xs"
                    >
                      <div>
                        <span className="font-semibold text-white">{item.name}</span>
                        <div className="text-[10px] text-stone-400">Required Remediation: {item.days} days</div>
                      </div>
                      <span className="font-mono font-bold text-emerald-400">${item.value.toLocaleString()} USD</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/50 flex justify-between items-center text-xs">
                  <span className="text-stone-300 font-semibold">Maximized Revenue:</span>
                  <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">
                    ${knapsackOutcome.unlockedRevenue.toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* PKR Financial Cost Estimator */}
              <div className="lg:col-span-6 p-4 sm:p-5 rounded-2xl bg-[#0b2219]/70 border border-emerald-900/60 shadow-lg space-y-3.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Compliance Investment & Margin Estimator (PKR)
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between p-2.5 rounded-xl bg-[#071610] border border-stone-800">
                    <span className="text-stone-300">Third-Party PCSIR Spectrometry Testing</span>
                    <span className="font-mono text-stone-200">Rs. 65,000 PKR</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-[#071610] border border-stone-800">
                    <span className="text-stone-300">ASTM A967 Citric Passivation Validation</span>
                    <span className="font-mono text-stone-200">Rs. 85,000 PKR</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-[#071610] border border-stone-800">
                    <span className="text-stone-300">Hardness Tester Calibration Standard</span>
                    <span className="font-mono text-stone-200">Rs. 35,000 PKR</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 font-semibold">
                    <span className="text-amber-300">Total Compliance Investment (PO-8821):</span>
                    <span className="font-mono text-amber-300">Rs. 185,000 PKR (~$665 USD)</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 font-semibold">
                    <span className="text-emerald-300">Net Export Profit (after compliance):</span>
                    <span className="font-mono text-emerald-400">Rs. 3,850,000 PKR (81% Margin)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: EXPORT DOCUMENT GATEKEEPER & AUDIT REPORT */}
        {/* ========================================================================= */}
        {activeTab === 'gatekeeper' && (
          <div className="space-y-5 sm:space-y-6 w-full max-w-full">
            <div className="p-4 rounded-2xl bg-[#0b2219]/70 border border-emerald-900/60 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3.5">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Export Document Gatekeeper & Traceable Audit PDF</span>
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Prevents illegal customs dispatch: commercial invoice and packing list remain cryptographically locked until all evidence achieves Document-Backed status.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFastTracked(!isFastTracked)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isFastTracked
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isFastTracked ? 'Reset to Locked' : 'Fast-Track & Clear Gaps'}
                </button>

                <button
                  onClick={() => setShowAuditModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-600/30 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Preview Audit PDF</span>
                </button>
              </div>
            </div>

            {/* Gatekeeper Clearance Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full max-w-full">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0b2219]/70 border border-emerald-900/60 shadow-lg space-y-3.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Commercial Shipping Documents Gate
                </h4>

                <div className="space-y-3">
                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                      isFastTracked
                        ? 'bg-emerald-950/30 border-emerald-700/50'
                        : 'bg-[#071610] border-rose-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isFastTracked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {isFastTracked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">Commercial Invoice (CI-8821)</div>
                        <div className={`text-[11px] ${isFastTracked ? 'text-emerald-400 font-bold' : 'text-rose-400'}`}>
                          {isFastTracked ? 'STATUS: UNLOCKED FOR EXPORT' : 'STATUS: LOCKED (2 Unresolved GAPs)'}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        isFastTracked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {isFastTracked ? 'CLEARED' : 'BLOCKED'}
                    </span>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                      isFastTracked
                        ? 'bg-emerald-950/30 border-emerald-700/50'
                        : 'bg-[#071610] border-rose-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isFastTracked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {isFastTracked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">US Customs Packing List (PL-8821)</div>
                        <div className={`text-[11px] ${isFastTracked ? 'text-emerald-400 font-bold' : 'text-rose-400'}`}>
                          {isFastTracked ? 'STATUS: UNLOCKED FOR EXPORT' : 'STATUS: LOCKED'}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        isFastTracked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {isFastTracked ? 'CLEARED' : 'BLOCKED'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Release rule: Requires third-party verified ASTM A967 passivation certificate and non-backdated MTC before unlocking export shipping documents.
                </p>
              </div>

              {/* Clearance Checklist */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0b2219]/70 border border-emerald-900/60 shadow-lg space-y-3 text-xs">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Mandatory Statutory Checklist (PO-8821)
                </h4>

                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ASTM F899 Metallurgy Verified (PCSIR Spectrometry)</span>
                </div>
                <div className={`flex items-center gap-2 ${isFastTracked ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {isFastTracked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>
                    ASTM A967 Chemical Passivation {isFastTracked ? 'Verified (Expedited)' : 'Missing (BLOCKER)'}
                  </span>
                </div>
                <div className={`flex items-center gap-2 ${isFastTracked ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {isFastTracked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span>DHR Laser Marking Traveler {isFastTracked ? 'Digitally Signed' : 'Unsigned (GAP)'}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Hardness Tester NIST Calibration Valid</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Buyer FEI Active at US Customs</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: END-TO-END WORKFLOW ARCHITECTURE */}
        {/* ========================================================================= */}
        {activeTab === 'workflow' && (
          <div className="space-y-5 sm:space-y-6 w-full max-w-full">
            <div className="p-4 rounded-2xl bg-[#0b2219]/70 border border-emerald-900/60 shadow-lg">
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>6-Stage Regulatory Compliance Workflow Architecture</span>
              </h3>
              <p className="text-[11px] text-stone-400 mt-0.5">
                The complete architectural lifecycle connecting factory floor evidence to US port-of-entry clearance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 w-full max-w-full">
              {[
                {
                  step: 'STAGE 1',
                  title: 'Cryptographic Ledger Ingestion',
                  desc: 'Factory profile registration + Evidence Vault upload. Every document is SHA-256 hashed and backward-chained. Delta heuristic catches backdating.',
                  color: 'border-emerald-500/50'
                },
                {
                  step: 'STAGE 2',
                  title: 'Order Intake & NLP Extraction',
                  desc: 'Ingests buyer PO metadata. Semantic sentence embeddings (MiniLM) match free-text clauses against 25 codified FDA/ASTM rules with human confirmation.',
                  color: 'border-teal-500/50'
                },
                {
                  step: 'STAGE 3',
                  title: 'Bilateral Decision Engine',
                  desc: 'Maps order requirements against Vault proof grades (MET/GAP/BLOCKER) and vets Buyer FEI to prevent customs detention from importer-side issues.',
                  color: 'border-cyan-500/50'
                },
                {
                  step: 'STAGE 4',
                  title: 'Monte Carlo & Knapsack',
                  desc: '10,000 PERT stochastic runs compute true P(on-time) and sensitivity tornado drivers. Knapsack DP maximizes unlocked export revenue under time constraints.',
                  color: 'border-amber-500/50'
                },
                {
                  step: 'STAGE 5',
                  title: 'Gap Kanban & Mock FDA 483',
                  desc: 'Converts GAPs into task cards with CPM deadlines. Mock FDA Investigator evaluates 32 checklist points and generates simulated Form 483 citations.',
                  color: 'border-rose-500/50'
                },
                {
                  step: 'STAGE 6',
                  title: 'Gatekeeper & Audit Certificate',
                  desc: 'Enforces hard release gate: Commercial Invoice locked until all items are Document-Backed. Generates Traceable Audit PDF with SHA-256 ledger stamp.',
                  color: 'border-purple-500/50'
                }
              ].map((stage, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl bg-[#091a13] border ${stage.color} space-y-2 relative shadow-lg`}
                >
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                    {stage.step}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1">{stage.title}</h4>
                  <p className="text-[11px] text-stone-300 leading-relaxed">{stage.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION DOCK (md:hidden) — Quick 1-tap switching on phones */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07130e]/95 backdrop-blur-2xl border-t border-emerald-900/60 px-2 py-1.5 flex items-center justify-around text-stone-400 shadow-2xl">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'orders', label: 'PO Intake', icon: FileText },
          { id: 'ledger', label: 'Ledger', icon: Hash },
          { id: 'montecarlo', label: 'Simulation', icon: Play },
          { id: 'mockaudit', label: 'Mock 483', icon: Scale },
          { id: 'gatekeeper', label: 'Gate', icon: Lock }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
                isActive ? 'text-emerald-300 font-bold bg-emerald-500/20' : 'hover:text-stone-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px]">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ========================================================================= */}
      {/* MODAL 1: TRACEABLE AUDIT PDF PREVIEW */}
      {/* ========================================================================= */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3.5 sm:p-4">
          <div className="w-[95vw] sm:w-full max-w-2xl max-h-[90vh] bg-[#0b2018] border border-emerald-600/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="px-5 py-3.5 border-b border-emerald-900/60 bg-[#071711] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-xs sm:text-sm">Official Traceable Audit Certificate</h3>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="text-stone-400 hover:text-white text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-6 text-xs text-stone-300 space-y-4 font-mono overflow-y-auto flex-1">
              <div className="border border-emerald-800/60 p-4 rounded-xl bg-[#06140e] space-y-2.5">
                <div className="text-center pb-2.5 border-b border-stone-800">
                  <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider block">
                    UNITED STATES FDA EXPORT COMPLIANCE ATTESTATION
                  </span>
                  <div className="text-[10px] text-stone-400 mt-0.5">Import Alert 76-01 & 21 CFR 820 QMSR Protocol</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px]">
                  <div>Manufacturer: <strong className="text-white">Apex Surgical Industries</strong></div>
                  <div>FEI Reg: <strong className="text-white">3009418291</strong></div>
                  <div>PO Number: <strong className="text-white">{selectedOrder.poNumber}</strong></div>
                  <div>Product: <strong className="text-white">{selectedOrder.productName}</strong></div>
                  <div>Applicable Standard: <strong className="text-emerald-400">ASTM F899 / ASTM A967</strong></div>
                  <div>Batch Number: <strong className="text-white">LOT-2026-MS-8821</strong></div>
                </div>

                <div className="pt-3 border-t border-stone-800 text-[10px] text-stone-400 space-y-1">
                  <div>Ledger Block Sequence: #42</div>
                  <div className="break-all font-mono">
                    SHA-256 Digest: 8f434346648f6b96df89dda901c5176b10e6d07961fd76e5d8a0c20f1c4bb7c1
                  </div>
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>LEDGER CHAIN STATUS: CRYPTOGRAPHICALLY VERIFIED INTACT</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-stone-400 italic leading-relaxed">
                Legal Disclaimer: This certificate certifies pre-export compliance readiness based on cryptographically fingerprinted metallurgical spectrometry and passivation test reports. Issued by ExportReady SaaS.
              </div>
            </div>

            <div className="px-5 py-3 border-t border-emerald-900/60 bg-[#071711] flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-stone-800 text-stone-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: LEDGER BLOCK INSPECTOR */}
      {/* ========================================================================= */}
      {showTamperModal && tamperTarget && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3.5 sm:p-4">
          <div className="w-[95vw] sm:w-full max-w-xl max-h-[90vh] bg-[#0b2018] border border-emerald-600/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="px-5 py-3.5 border-b border-emerald-900/60 bg-[#071711] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-xs sm:text-sm">Ledger Block #{tamperTarget.seq} Verification Details</h3>
              </div>
              <button
                onClick={() => setShowTamperModal(false)}
                className="text-stone-400 hover:text-white text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-6 text-xs text-stone-300 space-y-3 font-mono overflow-y-auto flex-1">
              <div>
                <span className="text-stone-400 block text-[10px]">DOCUMENT TITLE:</span>
                <span className="text-white font-bold">{tamperTarget.documentTitle}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">CURRENT BLOCK SHA-256:</span>
                <span className="text-emerald-400 break-all">{tamperTarget.fileHash}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">PREVIOUS BLOCK HASH (prev_hash):</span>
                <span className="text-stone-400 break-all">{tamperTarget.prevHash}</span>
              </div>

              {tamperTarget.tamperFlag && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-600/40 text-rose-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-rose-200">
                    <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Backdating Violation Detected</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{tamperTarget.tamperReason}</p>
                </div>
              )}

              {/* Interactive Tampering Simulation Test */}
              <div className="pt-3 border-t border-stone-800">
                <div className="flex items-center justify-between">
                  <span className="text-stone-300 font-semibold text-[11px]">Simulate Malicious Hash Mutation:</span>
                  <button
                    onClick={() => setIsTamperedSimulation(!isTamperedSimulation)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      isTamperedSimulation ? 'bg-rose-600 text-white' : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    {isTamperedSimulation ? 'Tampered (Active)' : 'Mutate 1 Byte'}
                  </button>
                </div>

                {isTamperedSimulation && (
                  <div className="mt-2 p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/50 text-[10px] text-rose-300">
                    <strong>Hash Verification Failed:</strong> Calculated hash does not match previous block link. Ledger invalidation propagated across remaining chain!
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-emerald-900/60 bg-[#071711] flex justify-end shrink-0">
              <button
                onClick={() => {
                  setShowTamperModal(false);
                  setIsTamperedSimulation(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportReadyDashboard;
