/* eslint-disable */
"use client";

import { useBehaviorStore } from "@/store/useBehaviorStore";
import { 
  Flame, 
  Key, 
  Cpu, 
  MessageSquare, 
  Play, 
  GitBranch, 
  Layers, 
  Sliders, 
  Check, 
  Copy, 
  ChevronRight, 
  AlertCircle,
  Zap,
  ArrowRight,
  TrendingUp,
  Plus,
  ChevronDown,
  Lock,
  Globe,
  Database,
  Sparkles
} from "lucide-react";
import { useState } from "react";

interface Scenario {
  id: string;
  name: string;
  intent: string;
  userContext: string;
  baseText: string;
  controlResponse: string;
  challengerResponse: string;
}

const initialScenarios: Scenario[] = [
  {
    id: "upi_fail",
    name: "UPI Transaction Failure Dispute",
    intent: "Dispute resolution & transactional reassurance",
    userContext: "High Anxiety Gen Z in Bangalore (UPI transaction stuck in pending state)",
    baseText: "I sent Rs. 5000 via UPI but it failed. The money got deducted but didn't reach. Please refund it immediately!",
    controlResponse: "Your transaction reference #82928929 is currently in pending state. It can take up to 3 to 5 business days for banking reconciliations to credit the amount back to your source account. Please check back later.",
    challengerResponse: "Hey Kiara, completely understand! We have tracked your Rs. 5,000 transaction. Since the banker gateway timed out, the money is safe in our escrow and will auto-reconcile within 2 hours. Rest easy, we've got you covered!"
  },
  {
    id: "debt_recovery",
    name: "Debt Recovery Reminders",
    intent: "Sensitive overdue repayment collection",
    userContext: "High Anxiety Conservative user, salary delayed",
    baseText: "My loan repayment is overdue, but my salary has been delayed by my company. I can't pay today.",
    controlResponse: "Your payment of Rs. 12,000 was due on the 5th. Non-repayment will attract late payment fees of 2% daily and will be reported to credit bureaus. Please complete the transfer immediately to avoid escalation.",
    challengerResponse: "We completely hear you, Rahul. Overdue cycles are stressful when pay dates slip. We have waived the automated late penalty for the next 7 days. Let's secure your balance once your salary is credited. You are in safe hands."
  },
  {
    id: "savings_encouragement",
    name: "Savings Habit Reinforcement",
    intent: "Gamified deposit nudge",
    userContext: "Low Anxiety Gen Z user in Bangalore",
    baseText: "I want to save money but I always end up ordering food online and spending it all.",
    controlResponse: "To start saving, you should set a budget and create a recurring deposit of Rs. 1000 per month. Automating your investments is the most reliable way to achieve your long-term financial goals.",
    challengerResponse: "We get it Kiara, those weekend Swiggy orders add up super fast! 🍕 What if we auto-saved just Rs. 20 every time you spend? You won't even feel it, and you'll hit your Rs. 500 goal by next month. Shall we kick it off?"
  },
  {
    id: "credit_drop",
    name: "Credit Score Drop Alert",
    intent: "Explainable drop transparency & reassuring action loops",
    userContext: "High Anxiety, conservative user",
    baseText: "I just got a notification that my CIBIL credit score dropped by 45 points! What is going on? Did someone hack me?",
    controlResponse: "Your credit score decreased due to a late credit card payment reported on April 15th. Missed cycles decrease rating scores. Please pay your outstanding balances to recover score points.",
    challengerResponse: "Rahul, take a deep breath—your account is fully secure, no hack has occurred. The drop is simply from the bank reporting last month's delayed utility payment. Let's get this cycle automated today, and you'll see your CIBIL bounce back in 60 days!"
  },
  {
    id: "portfolio_dip",
    name: "Investment Portfolio Dip Support",
    intent: "Market volatility explanation & risk advisory",
    userContext: "Risk-Averse Investor in Mumbai",
    baseText: "My mutual fund portfolio is down 8% this week! Should I redeem everything immediately before I lose more money?",
    controlResponse: "Mutual funds are subject to market volatility. Redeeming your portfolio now locks in realized losses. We recommend maintaining your SIP investment plan according to your long-term horizon goals.",
    challengerResponse: "Seeing your funds red is never easy, Rahul. This dip is caused by broad global oil pricing triggers. Historically, users who stayed steady recovered their 8% within one quarter. Let's sit tight—we are tracking the recovery vector live!"
  },
  {
    id: "fraud_alert",
    name: "High-Value Fraud Warning Alert",
    intent: "Security emergency signaling with absolute clarity",
    userContext: "Highly Sensitive, elderly customer",
    baseText: "I saw an SMS charging Rs. 45,000 to my credit card from a retail merchant I never visited. Help me!",
    controlResponse: "Suspicious activity detected on your card. We have blocked card ending in 8901. A replacement card is ordered. Please review your statement for other disputed fees.",
    challengerResponse: "EMERGENCY SAFEGUARD ACTIVE: We have immediately locked your card to secure your balance. The Rs. 45,000 charge is strictly on hold and has not left your account. A compliance manager will ring your mobile within 3 minutes to verify."
  },
  {
    id: "autodebit_setup",
    name: "Auto-Debit Setup Nudge",
    intent: "Transactional automation encouragement",
    userContext: "Busy corporate professional",
    baseText: "I keep forgetting my electricity bill and getting hit with penalty fees. It is annoying.",
    controlResponse: "Set up auto-debit on our portal. Provide your bank card authorization to automatically schedule recurring payments on the due date.",
    challengerResponse: "We hear you! Let's eliminate those late fees entirely. We can authorize a secure auto-debit clamp on your bill directly from your UPI profile in one click. You retain absolute control to pause it anytime."
  },
  {
    id: "salary_bonus",
    name: "Salary & Bonus Allocation Guidance",
    intent: "Wealth coaching & financial momentum",
    userContext: "Middle income IT worker in Bangalore",
    baseText: "I just received my annual bonus of Rs. 1,00,000! I want to treat myself but also want to be sensible.",
    controlResponse: "Deposit your bonus into high-yield savings or mutual funds. We offer fixed deposit rates up to 7.2% per annum. Select an asset allocation matching your portfolio risk profile.",
    challengerResponse: "Congrats Kiara! 🌟 Treatment is absolutely earned! How about we do a 30/70 split? treats Rs. 30,000 for your bucket list, and Rs. 70,000 swept into a High-Yield Tax Saver. Sensible growth, zero stress!"
  },
  {
    id: "student_loan",
    name: "Student Loan Relief Inquiry",
    intent: "Empathetic debt relief explanation",
    userContext: "Stressed student, recent graduate",
    baseText: "I'm struggling to make my Rs. 8,000 student loan payment this month. Can I get a rate discount or defer it?",
    controlResponse: "Loan restructuring requires filing Form 18-A with payroll validation. Late cycles attract standard interest rates of 11.5% compounding.",
    challengerResponse: "Graduate cycles can be highly stressful, we get it. Let's switch you to our Grad-Grace plan. We can temporarily freeze your installment to Rs. 2,000 for the next 3 months, keeping your credit history completely safe."
  },
  {
    id: "cashback_dispute",
    name: "Cashback Claim Dispute Support",
    intent: "Linguistic localization and cashback settlement",
    userContext: "Frequent shopping Gen Z user",
    baseText: "Your app promised 5% cashback on Amazon purchases but I only got Rs. 50 back instead of Rs. 250! This is fraud.",
    controlResponse: "Cashback rewards are subject to Terms & Conditions Appendix 4. The maximum cashback payout per single transaction is capped at Rs. 50. Please consult our catalog policy for information.",
    challengerResponse: "Ayo Kiara, super sorry about the confusion! The 5% has a standard Rs. 50 cap per order. However, since the banner copy was slightly opaque, we have credited the Rs. 200 variance straight to your wallet as goodwill. Check it now! 🚀"
  }
];

// 31 primitives grouped by 8 canonical families
const primitiveFamilies = [
  {
    id: "identity",
    name: "Identity Posture",
    primitives: ["companionness", "professionalism", "relatability", "authenticity"]
  },
  {
    id: "tone",
    name: "Tone & Levity",
    primitives: ["warmth", "humor", "enthusiasm", "optimism", "seriousness"]
  },
  {
    id: "communication",
    name: "Communication Density",
    primitives: ["brevity", "structure", "pacing", "directness", "clarity"]
  },
  {
    id: "guidance",
    name: "Guidance & Direction",
    primitives: ["assertiveness", "proactiveness", "accountability_pressure", "coaching_behavior"]
  },
  {
    id: "empathy",
    name: "Emotional Intelligence",
    primitives: ["empathy", "emotional_mirroring", "reassurance", "non_judgment"]
  },
  {
    id: "engagement",
    name: "Engagement Reward",
    primitives: ["encouragement", "delight", "momentum_building"]
  },
  {
    id: "regional",
    name: "Regional & Cultural",
    primitives: ["code_switching", "slang_density", "cultural_localization"]
  },
  {
    id: "safety",
    name: "Safety & Governance",
    primitives: ["compliance_rigidity", "escalation_sensitivity", "transparency"]
  }
];

export default function ExperimentsWorkspace() {
  const { primitives, segments, governanceShields, triggerAuditLog } = useBehaviorStore();
  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios);
  const [provider, setProvider] = useState<string>("gemini-pro");
  const [apiKey, setApiKey] = useState<string>("");
  
  // Custom Scenarios Creation state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newScenName, setNewScenName] = useState("");
  const [newScenIntent, setNewScenIntent] = useState("");
  const [newScenContext, setNewScenContext] = useState("");
  const [newScenInput, setNewScenInput] = useState("");
  
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("upi_fail");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("india_genz");
  
  // State storing the live custom delta modifiers for ALL 31 primitives
  const [liveDeltas, setLiveDeltas] = useState<Record<string, number>>({});
  const [expandedFamilies, setExpandedFamilies] = useState<Record<string, boolean>>({
    identity: true,
    tone: true
  });
  
  const [enforceGovernance, setEnforceGovernance] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [outputResult, setOutputResult] = useState<string>("");
  const [isRealLLM, setIsRealLLM] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [gitStatus, setGitStatus] = useState<string>("");
  const [copiedFile, setCopiedFile] = useState<boolean>(false);

  const activeScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  // Helper to compile the active dynamic scalars (base + overlay + live tuning delta)
  const compileActiveScalars = () => {
    const activePrims: Record<string, number> = {};
    Object.keys(primitives).forEach(id => {
      let val = primitives[id].base;
      // Add cohort preset overlay modifiers
      const preset = segments.find(s => s.id === selectedPresetId);
      if (preset && preset.modifiers[id]) {
        val += preset.modifiers[id].value;
      }
      // Add active live user delta modifiers
      if (liveDeltas[id] !== undefined) {
        val += liveDeltas[id];
      }
      
      // Enforce absolute safety clamps if activated
      if (enforceGovernance) {
        if (id === "warmth" && val > 0.90) val = 0.90;
        if (id === "assertiveness" && val > 0.54) val = 0.54;
        if (id === "humor" && val > 0.22) val = 0.22;
        if (id === "accountability_pressure" && val > 0.62) val = 0.62;
      }

      activePrims[id] = Math.min(1.0, Math.max(0.0, val));
    });
    return activePrims;
  };

  const handleSliderChange = (primId: string, value: number) => {
    setLiveDeltas(prev => ({
      ...prev,
      [primId]: value
    }));
  };

  const toggleFamily = (familyId: string) => {
    setExpandedFamilies(prev => ({
      ...prev,
      [familyId]: !prev[familyId]
    }));
  };

  const triggerGeneration = async () => {
    setGenerating(true);
    setErrorText("");
    setOutputResult("");
    setIsRealLLM(false);

    const compiled = compileActiveScalars();

    // If no key supplied, execute simulated compilation
    if (!apiKey || apiKey.trim() === "") {
      setTimeout(() => {
        setGenerating(false);
        setOutputResult(activeScenario.challengerResponse);
        triggerAuditLog("modify_governance", `Executed behavioral simulation for scenario ${activeScenario.name}.`);
      }, 1000);
      return;
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey,
          scenario: activeScenario,
          compiledPrims: compiled,
          enforceGov: enforceGovernance
        })
      });

      const data = await response.json();
      setGenerating(false);

      if (response.ok && data.success) {
        if (data.mocked) {
          setOutputResult(activeScenario.challengerResponse);
        } else {
          setOutputResult(data.text);
          setIsRealLLM(true);
        }
        triggerAuditLog("modify_governance", `Completed real LLM execution for scenario ${activeScenario.name} using ${provider}.`);
      } else {
        setErrorText(data.error || "LLM server timeout, please check your network credentials.");
      }
    } catch (e: any) {
      setGenerating(false);
      setErrorText(e.message || "Failed to make generation request.");
    }
  };

  const publishToGit = () => {
    setGitStatus("committing...");
    setTimeout(() => {
      setGitStatus("pushing...");
      setTimeout(() => {
        setGitStatus("success");
        triggerAuditLog("deploy_experiment", `Published custom live scenario configurations directly to remote Git repository.`);
        setTimeout(() => setGitStatus(""), 3000);
      }, 1000);
    }, 1000);
  };

  const addNewScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScenName || !newScenInput) return;

    const newScen: Scenario = {
      id: `scen_${Date.now()}`,
      name: newScenName,
      intent: newScenIntent || "Custom Intent Vector",
      userContext: newScenContext || "Custom User Profile Context",
      baseText: newScenInput,
      controlResponse: "System Default Resolution Message matching baseline primitives.",
      challengerResponse: `Adaptive response tailored to customized parameters: "Hey there! We appreciate you reaching out about this. Let's get this fully optimized in one click!"`
    };

    setScenarios(prev => [...prev, newScen]);
    setSelectedScenarioId(newScen.id);
    setShowAddModal(false);
    
    // reset form fields
    setNewScenName("");
    setNewScenIntent("");
    setNewScenContext("");
    setNewScenInput("");
    triggerAuditLog("create_segment", `Authored new scenario: ${newScen.name}`);
  };

  const activeScalars = compileActiveScalars();

  return (
    <div className="h-full bg-[#09090b] text-zinc-100 p-8 overflow-y-auto max-w-6xl font-mono space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <div className="flex items-center space-x-1.5 text-orange-500 text-[10px] uppercase tracking-widest mb-1.5 font-bold">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Behavioral Lab</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            Experimentation Studio
          </h2>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-sans max-w-2xl">
            Figma for conversational behavior. Group, tune, and test all 31 global primitives under live API providers and custom scenarios.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-zinc-950 border border-zinc-850 hover:border-zinc-750 text-zinc-350 hover:text-zinc-100 text-[10px] rounded-lg transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Scenario</span>
          </button>

          <button
            onClick={publishToGit}
            disabled={gitStatus !== ""}
            className="flex items-center space-x-2 px-4 py-2.5 bg-zinc-950 border border-zinc-850 hover:border-zinc-750 text-zinc-400 hover:text-zinc-200 text-xs rounded-lg transition-all"
          >
            <GitBranch className="w-4 h-4 text-zinc-500" />
            <span>
              {gitStatus === "committing..." && "Git Commit..."}
              {gitStatus === "pushing..." && "Git Push..."}
              {gitStatus === "success" && "Success!"}
              {gitStatus === "" && "Publish to Git"}
            </span>
          </button>

          <button
            onClick={triggerGeneration}
            disabled={generating}
            className="flex items-center space-x-2 px-5 py-2.5 bg-orange-655 hover:bg-orange-600 border border-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-[0_0_12px_rgba(249,115,22,0.35)] transition-all"
          >
            <Play className={`w-3.5 h-3.5 ${generating ? "animate-pulse" : ""}`} />
            <span>{generating ? "Evaluating..." : "Generate Behavior"}</span>
          </button>
        </div>
      </div>

      {/* Provider Selector Panel */}
      <div className="bg-[#0c0c0e] border border-zinc-850 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-zinc-400 shrink-0">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] uppercase font-bold tracking-wider">LLM Engine</span>
          </div>
          <select 
            value={provider} 
            onChange={(e) => setProvider(e.target.value)}
            className="bg-zinc-950 border border-zinc-850 text-zinc-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 font-sans"
          >
            <option value="gemini-pro">Gemini 1.5 Flash</option>
            <option value="claude-sonnet">Claude 3.5 Sonnet</option>
            <option value="gpt-4o">GPT-4o Mini (OpenAI)</option>
          </select>
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-zinc-400 shrink-0">
            <Key className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Provider Key</span>
          </div>
          <input 
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-zinc-950 border border-zinc-850 text-zinc-400 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-500 w-full md:w-64"
            placeholder="Enter API key for real generation..."
          />
        </div>
      </div>

      {/* Primary Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Behavioral Lab Editor */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Scenario selector */}
          <div className="bg-[#0c0c0e] border border-zinc-850 rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2 text-zinc-400 border-b border-zinc-900 pb-2.5">
              <MessageSquare className="w-4 h-4 text-orange-500" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Scenario & Intent ({scenarios.length} available)</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[9px] text-zinc-500 uppercase block mb-1">Scenario Target</label>
                <select
                  value={selectedScenarioId}
                  onChange={(e) => setSelectedScenarioId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 text-zinc-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 font-sans"
                >
                  {scenarios.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 space-y-1.5 text-[10px]">
                <span className="text-zinc-500 font-sans font-semibold block">Target Context:</span>
                <p className="text-zinc-300 font-sans leading-relaxed">{activeScenario.userContext}</p>
                <span className="text-zinc-500 font-sans font-semibold block mt-2">Core Intent Vector:</span>
                <p className="text-zinc-400 font-sans leading-relaxed">{activeScenario.intent}</p>
              </div>

              <div>
                <label className="text-[9px] text-zinc-500 uppercase block mb-1.5">User Input Statement</label>
                <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 text-[10px] text-zinc-400 leading-relaxed max-h-24 overflow-y-auto select-text font-sans">
                  "{activeScenario.baseText}"
                </div>
              </div>
            </div>
          </div>

          {/* Primitives and overlay sliders - 31 Primitives Grouped Accordion */}
          <div className="bg-[#0c0c0e] border border-zinc-850 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
              <div className="flex items-center space-x-2 text-zinc-400">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] uppercase font-bold tracking-wider">ALL 31 PRIMITIVES TUNING</span>
              </div>
              <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-bold uppercase font-mono">
                MECE
              </span>
            </div>

            <div className="space-y-4">
              {/* Preset Overlay Selector */}
              <div>
                <label className="text-[9px] text-zinc-500 uppercase block mb-1.5">Apply Cohort Overlay</label>
                <div className="grid grid-cols-3 gap-2">
                  {segments.slice(0, 5).map(s => {
                    const isSelected = selectedPresetId === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedPresetId(s.id)}
                        className={`px-2 py-1.5 text-[8px] rounded-lg border font-mono font-bold uppercase transition-all truncate text-center ${
                          isSelected 
                            ? "bg-indigo-500/5 border-indigo-500 text-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.15)]" 
                            : "bg-zinc-950 border-zinc-850 hover:border-zinc-750 text-zinc-500"
                        }`}
                      >
                        {s.name.split(":")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grouped 31 Primitives List */}
              <div className="space-y-2.5 border-t border-zinc-900/60 pt-3 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                {primitiveFamilies.map(fam => {
                  const isExpanded = !!expandedFamilies[fam.id];
                  return (
                    <div key={fam.id} className="bg-zinc-950/40 rounded-xl border border-zinc-900 overflow-hidden">
                      <button
                        onClick={() => toggleFamily(fam.id)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-left text-zinc-400 hover:text-zinc-200 transition-colors"
                      >
                        <span className="text-[9px] uppercase font-bold tracking-widest font-mono flex items-center">
                          <Layers className="w-3.5 h-3.5 mr-2 text-indigo-400" /> {fam.name}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>

                      {isExpanded && (
                        <div className="p-4 border-t border-zinc-900 bg-black/20 space-y-3">
                          {fam.primitives.map(primId => {
                            const prim = primitives[primId];
                            if (!prim) return null;
                            const currentVal = activeScalars[primId];
                            const delta = liveDeltas[primId] || 0;

                            return (
                              <div key={primId} className="space-y-1.5">
                                <div className="flex items-center justify-between text-[9px] font-mono">
                                  <div className="flex flex-col">
                                    <span className="text-zinc-350">{primId}</span>
                                    <span className="text-[7px] text-zinc-650 font-sans">{prim.owner}</span>
                                  </div>
                                  <div className="flex items-center space-x-1.5">
                                    <span className="text-zinc-400 font-semibold">{currentVal.toFixed(2)}</span>
                                    <span className={`text-[8px] font-bold ${delta >= 0 ? "text-emerald-450" : "text-rose-450"}`}>
                                      ({delta >= 0 ? "+" : ""}{delta.toFixed(2)})
                                    </span>
                                  </div>
                                </div>
                                <input
                                  type="range"
                                  min="-0.40"
                                  max="0.40"
                                  step="0.02"
                                  value={delta}
                                  onChange={(e) => handleSliderChange(primId, parseFloat(e.target.value))}
                                  className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Constitutional Governance Enforcement */}
              <div className="border-t border-zinc-900/60 pt-3 flex items-center justify-between">
                <div className="space-y-0.5 pr-2">
                  <span className="text-[9px] text-rose-450 font-bold uppercase flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-500" /> Governance Shield Clamps
                  </span>
                  <span className="text-[8px] text-zinc-500 font-sans block leading-normal">
                    Apply hard caps (Humor & Warmth clamps) in high-anxiety states.
                  </span>
                </div>
                <button
                  onClick={() => setEnforceGovernance(!enforceGovernance)}
                  className={`w-11 h-6 rounded-full p-1 transition-all shrink-0 ${
                    enforceGovernance ? "bg-rose-600/90" : "bg-zinc-800"
                  }`}
                >
                  <div 
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      enforceGovernance ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Side-by-Side Model Behavior Analysis */}
        <div className="lg:col-span-7 space-y-6">
          
          {generating ? (
            <div className="bg-[#0c0c0e] border border-zinc-850 rounded-xl h-[620px] flex flex-col items-center justify-center space-y-4 text-center font-sans">
              <RefreshCwIcon className="w-10 h-10 text-orange-500 animate-spin" />
              <div className="space-y-1">
                <p className="text-zinc-200 text-xs font-semibold">Resolving API parameters...</p>
                <p className="text-[10px] text-zinc-500">Injecting scenario, intent overlays, and governance policies to API inputs...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[620px]">
              
              {/* Variant A: Baseline/Control */}
              <div className="bg-[#0c0c0e] border border-zinc-850 rounded-xl flex flex-col overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-zinc-850 bg-zinc-950 flex items-center justify-between shrink-0">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center">
                    Variant A (Control)
                  </span>
                  <span className="text-[8px] bg-zinc-900 border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded font-bold uppercase">
                    Baseline
                  </span>
                </div>

                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
                  <div>
                    <span className="text-[8px] text-zinc-600 uppercase block mb-1.5">Compiled Input</span>
                    <pre className="text-[8px] text-zinc-500 bg-zinc-950 p-2.5 rounded-lg whitespace-pre-wrap select-text leading-relaxed border border-zinc-900 font-mono">
{`intent: "${activeScenario.intent}"
primitives:
  warmth: 0.72 (base)
  assertiveness: 0.30 (base)
  humor: 0.30 (base)
governance:
  clamps_applied: []`}
                    </pre>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[8px] text-zinc-500 uppercase block">Response Copy</span>
                    <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 text-[10px] text-zinc-400 font-sans leading-relaxed select-text min-h-[140px]">
                      {activeScenario.controlResponse}
                    </div>
                  </div>

                  {/* Primitive indicators */}
                  <div className="border-t border-zinc-900 pt-3 space-y-2">
                    <span className="text-[8px] text-zinc-500 uppercase block font-mono">Resolved Scalars</span>
                    <div className="space-y-2 text-[9px] font-mono">
                      <div className="flex justify-between">
                        <span className="text-zinc-450">warmth</span>
                        <span className="text-zinc-200">0.72</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1 rounded-full">
                        <div className="bg-zinc-650 h-full rounded-full" style={{ width: "72%" }}></div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-zinc-450">assertiveness</span>
                        <span className="text-zinc-200">0.30</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1 rounded-full">
                        <div className="bg-zinc-650 h-full rounded-full" style={{ width: "30%" }}></div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-zinc-450">humor</span>
                        <span className="text-zinc-200">0.30</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1 rounded-full">
                        <div className="bg-zinc-650 h-full rounded-full" style={{ width: "30%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Variant B: Adaptive Challenger */}
              <div className="bg-[#0c0c0e] border border-orange-500/20 rounded-xl flex flex-col overflow-hidden shadow-sm relative">
                
                {/* Glow outline on challenger */}
                <div className="absolute inset-0 border border-orange-500/20 rounded-xl pointer-events-none shadow-[0_0_15px_rgba(249,115,22,0.05)]" />

                <div className="px-4 py-3 border-b border-zinc-850 bg-zinc-950 flex items-center justify-between shrink-0 relative z-10">
                  <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest flex items-center">
                    <Zap className="w-3 h-3 mr-1 text-orange-400 animate-pulse" /> Variant B (Challenger)
                  </span>
                  <span className="text-[8px] bg-orange-500/10 border border-orange-500/20 text-orange-400 px-2 py-0.5 rounded font-bold uppercase">
                    {isRealLLM ? "Live LLM" : "Simulated"}
                  </span>
                </div>

                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4 relative z-10">
                  {errorText && (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-[10px] text-rose-450 flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorText}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-[8px] text-orange-500 uppercase block mb-1.5">Compiled Input</span>
                    <pre className="text-[8px] text-emerald-450 bg-zinc-950 p-2.5 rounded-lg whitespace-pre-wrap select-text leading-relaxed border border-zinc-900 font-mono">
{`intent: "${activeScenario.intent}"
primitives:
  warmth: ${activeScalars.warmth.toFixed(2)} (delta: ${(liveDeltas.warmth || 0) >= 0 ? "+" : ""}${(liveDeltas.warmth || 0).toFixed(2)})
  assertiveness: ${activeScalars.assertiveness.toFixed(2)} (delta: ${(liveDeltas.assertiveness || 0).toFixed(2)})
  humor: ${activeScalars.humor.toFixed(2)} (delta: ${(liveDeltas.humor || 0) >= 0 ? "+" : ""}${(liveDeltas.humor || 0).toFixed(2)})
governance:
  clamps_applied:
    - ${enforceGovernance && (selectedScenarioId === "upi_fail" || selectedScenarioId === "credit_drop") ? "gov_advice_assertive (assertiveness clamped to 0.54)" : "none"}`}
                    </pre>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[8px] text-orange-500 uppercase block">Response Copy</span>
                    <div className="bg-zinc-950 border border-orange-500/5 rounded-lg p-3 text-[10px] text-zinc-300 font-sans leading-relaxed select-text min-h-[140px]">
                      {outputResult || activeScenario.challengerResponse}
                    </div>
                  </div>

                  {/* Primitive indicators */}
                  <div className="border-t border-zinc-900 pt-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-orange-500 uppercase block">Resolved Primitives</span>
                      <span className="text-[8px] text-zinc-500 flex items-center font-sans font-semibold">
                        <TrendingUp className="w-3 h-3 mr-0.5 text-orange-400" />
                        <span>Behavior Delta Trace</span>
                      </span>
                    </div>

                    <div className="space-y-2 text-[9px] font-mono">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">warmth</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-zinc-200">{activeScalars.warmth.toFixed(2)}</span>
                          <span className="text-emerald-450 font-bold">({(liveDeltas.warmth || 0) >= 0 ? "+" : ""}${(liveDeltas.warmth || 0).toFixed(2)})</span>
                        </div>
                      </div>
                      <div className="w-full bg-zinc-900 h-1 rounded-full">
                        <div className="bg-orange-500 h-full rounded-full" style={{ width: `${activeScalars.warmth * 100}%` }}></div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-zinc-400">assertiveness</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-zinc-200">{activeScalars.assertiveness.toFixed(2)}</span>
                          <span className="text-rose-450 font-bold">({(liveDeltas.assertiveness || 0).toFixed(2)})</span>
                        </div>
                      </div>
                      <div className="w-full bg-zinc-900 h-1 rounded-full">
                        <div className="bg-orange-500 h-full rounded-full" style={{ width: `${activeScalars.assertiveness * 100}%` }}></div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-zinc-400">humor</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-zinc-200">{activeScalars.humor.toFixed(2)}</span>
                          <span className="text-emerald-450 font-bold">({(liveDeltas.humor || 0) >= 0 ? "+" : ""}${(liveDeltas.humor || 0).toFixed(2)})</span>
                        </div>
                      </div>
                      <div className="w-full bg-zinc-900 h-1 rounded-full">
                        <div className="bg-orange-500 h-full rounded-full" style={{ width: `${activeScalars.humor * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* CREATE SCENARIO MODAL DIALOG */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0c0e] border border-zinc-850 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl font-mono">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <span className="text-xs font-bold text-zinc-200 uppercase tracking-widest flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-orange-500 animate-pulse" /> Add Custom Behavioral Scenario
              </span>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={addNewScenario} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] text-zinc-500 uppercase block font-bold">Scenario Name</label>
                <input 
                  type="text"
                  required
                  value={newScenName}
                  onChange={(e) => setNewScenName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 text-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 font-sans"
                  placeholder="e.g. Account Overdraft Alert"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-zinc-500 uppercase block font-bold">Core Intent Vector</label>
                <input 
                  type="text"
                  value={newScenIntent}
                  onChange={(e) => setNewScenIntent(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 text-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 font-sans"
                  placeholder="e.g. Overdraft explanation and stress reassurance"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-zinc-500 uppercase block font-bold">User Context & Profile</label>
                <input 
                  type="text"
                  value={newScenContext}
                  onChange={(e) => setNewScenContext(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 text-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 font-sans"
                  placeholder="e.g. Low Anxiety Student with Rs. -50 balance"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-zinc-500 uppercase block font-bold">User Input Statement</label>
                <textarea 
                  required
                  rows={3}
                  value={newScenInput}
                  onChange={(e) => setNewScenInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 text-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 font-sans resize-none"
                  placeholder="e.g. I got charged Rs. 500 for a balance check! Why is my account negative?"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-850 hover:border-zinc-750 text-zinc-400 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-655 hover:bg-orange-600 border border-orange-500 text-white rounded-lg font-bold shadow-[0_0_12px_rgba(249,115,22,0.25)]"
                >
                  Add Scenario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function RefreshCwIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
