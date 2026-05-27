"use client";

import { useBehaviorStore, Primitive } from "@/store/useBehaviorStore";
import { Sliders, AlertCircle, Info, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { useMemo, useState } from "react";
import { FAMILY_METADATA, FORBIDDEN_MEANINGS } from "@/constants/primitiveMetadata";

export default function DefaultsWorkspace() {
  const { 
    primitives, 
    updatePrimitiveBase,
    createPrimitive,
    deletePrimitive,
    updatePrimitive
  } = useBehaviorStore();
  
  const [expandedPrims, setExpandedPrims] = useState<Set<string>>(new Set());

  // Modal / Creation States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPrimId, setNewPrimId] = useState("");
  const [newPrimFamily, setNewPrimFamily] = useState("identity");
  const [newPrimBase, setNewPrimBase] = useState(0.50);
  const [newPrimPrinciple, setNewPrimPrinciple] = useState("");
  const [newPrimDefinition, setNewPrimDefinition] = useState("");
  const [newPrimMinInterpretation, setNewPrimMinInterpretation] = useState("Low intensity");
  const [newPrimMidInterpretation, setNewPrimMidInterpretation] = useState("Moderate expression");
  const [newPrimMaxInterpretation, setNewPrimMaxInterpretation] = useState("Max intensity");
  const [newPrimOwner, setNewPrimOwner] = useState("Product Team");

  // Inline Editing States
  const [editingPrimId, setEditingPrimId] = useState<string | null>(null);
  const [editPrinciple, setEditPrinciple] = useState("");
  const [editDefinition, setEditDefinition] = useState("");
  const [editOwner, setEditOwner] = useState("");
  const [editMinInterpretation, setEditMinInterpretation] = useState("");
  const [editMidInterpretation, setEditMidInterpretation] = useState("");
  const [editMaxInterpretation, setEditMaxInterpretation] = useState("");

  const toggleExpand = (primId: string) => {
    const next = new Set(expandedPrims);
    if (next.has(primId)) {
      next.delete(primId);
    } else {
      next.add(primId);
    }
    setExpandedPrims(next);
  };

  const startEditing = (prim: Primitive) => {
    setEditingPrimId(prim.id);
    setEditPrinciple(prim.principle);
    setEditDefinition(prim.definition);
    setEditOwner(prim.owner);
    setEditMinInterpretation(prim.semanticInterpretation.min);
    setEditMidInterpretation(prim.semanticInterpretation.mid);
    setEditMaxInterpretation(prim.semanticInterpretation.max);
    
    // Ensure card is expanded when editing
    const next = new Set(expandedPrims);
    next.add(prim.id);
    setExpandedPrims(next);
  };

  const cancelEditing = () => {
    setEditingPrimId(null);
  };

  const saveEditing = (primId: string) => {
    updatePrimitive(primId, {
      principle: editPrinciple,
      definition: editDefinition,
      owner: editOwner,
      semanticInterpretation: {
        min: editMinInterpretation,
        mid: editMidInterpretation,
        max: editMaxInterpretation
      }
    });
    setEditingPrimId(null);
  };

  const handleCreatePrimitive = () => {
    if (!newPrimId.trim()) return;
    const formattedId = newPrimId.toLowerCase().replace(/[^a-z0-9_]+/g, "_");
    
    const newPrim: Primitive = {
      id: formattedId,
      name: formattedId,
      category: newPrimFamily as Primitive["category"],
      path: `global_foundation.${newPrimFamily}.${formattedId}`,
      base: newPrimBase,
      definition: newPrimDefinition.trim() || "No definition specified.",
      principle: newPrimPrinciple.trim() || "Dynamic Posture Parameter",
      owner: newPrimOwner.trim() || "Product Team",
      range: { min: 0.0, max: 1.0 },
      semanticInterpretation: {
        min: newPrimMinInterpretation.trim(),
        mid: newPrimMidInterpretation.trim(),
        max: newPrimMaxInterpretation.trim()
      }
    };

    createPrimitive(newPrim);
    
    // Reset state & close
    setNewPrimId("");
    setNewPrimPrinciple("");
    setNewPrimDefinition("");
    setNewPrimMinInterpretation("Low intensity");
    setNewPrimMidInterpretation("Moderate expression");
    setNewPrimMaxInterpretation("Max intensity");
    setShowCreateModal(false);
  };

  const groupedPrimitives = useMemo(() => {
    const groups: Record<string, Primitive[]> = {};
    
    Object.values(primitives).forEach((prim) => {
      const family = prim.path.split(".")[1] || "general";
      if (!groups[family]) {
        groups[family] = [];
      }
      groups[family].push(prim);
    });

    return groups;
  }, [primitives]);

  return (
    <div className="h-full text-zinc-100 p-8 overflow-y-auto max-w-4xl font-mono custom-scrollbar bg-transparent relative z-10">
      
      {/* Header Info Panel */}
      <div className="flex justify-between items-start mb-8 border-b border-zinc-800/60 pb-6">
        <div>
          <div className="flex items-center space-x-1.5 text-zinc-400 text-[10px] uppercase tracking-widest mb-1.5 font-bold">
            <Sliders className="w-3.5 h-3.5" />
            <span>Behavioral Core Tuning</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            Global Default Tuning & Semantic Catalog
          </h2>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-sans max-w-2xl">
            Author and adjust the foundational default state of the platform. Primitives are grouped by family, with editable principles and definitions. Product teams have full authority to create, edit, or remove primitives.
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="text-[10px] bg-indigo-650 hover:bg-indigo-600 border border-indigo-500/25 text-white px-3.5 py-1.8 rounded-lg font-bold uppercase flex items-center shadow-[0_0_12px_rgba(99,102,241,0.25)] transition-all shrink-0 ml-4 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 mr-1 shrink-0" /> New Primitive
        </button>
      </div>

      {/* Families List */}
      <div className="space-y-10">
        {Object.entries(groupedPrimitives).map(([familyKey, prims]) => {
          const meta = FAMILY_METADATA[familyKey] || { label: `${familyKey.replace(/_/g, " ")} Family`, description: "Custom behavioral family layer." };

          return (
            <div key={familyKey} className="space-y-4">
              
              {/* Family Header */}
              <div className="border-b border-zinc-800/80 pb-2">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  {meta.label}
                </h3>
                {meta.description && (
                  <p className="text-[10px] text-zinc-500 font-sans mt-0.5 leading-relaxed">
                    {meta.description}
                  </p>
                )}
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prims.map((prim) => {
                  const isExpanded = expandedPrims.has(prim.id);
                  const isEditing = editingPrimId === prim.id;
                  const forbidden = FORBIDDEN_MEANINGS[prim.id] || [];

                  return (
                    <div 
                      key={prim.id} 
                      className={`glass rounded-[22px] p-5 flex flex-col justify-between transition-all duration-150 relative ${
                        isExpanded ? "ring-1 ring-indigo-500/30 shadow-lg" : ""
                      }`}
                    >
                      <div>
                        {/* Title Bar */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => toggleExpand(prim.id)}
                              className="flex items-center space-x-1 hover:text-indigo-300 transition-colors text-left"
                            >
                              <span className="text-xs font-bold text-zinc-200">{prim.id}</span>
                              <Info className="w-3.5 h-3.5 text-zinc-650 shrink-0" />
                            </button>
                          </div>

                          {/* Control Action Buttons */}
                          <div className="flex items-center space-x-2 shrink-0">
                            {isEditing ? (
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => saveEditing(prim.id)}
                                  className="p-1 hover:text-emerald-400 text-zinc-500 transition-all"
                                  title="Save Changes"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="p-1 hover:text-rose-400 text-zinc-500 transition-all"
                                  title="Cancel"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => startEditing(prim)}
                                  className="p-1 hover:text-indigo-400 text-zinc-600 transition-all"
                                  title="Edit Primitive Details"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deletePrimitive(prim.id)}
                                  className="p-1 hover:text-rose-400 text-zinc-600 transition-all"
                                  title="Delete Primitive"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}

                            <div className="bg-black/40 border border-zinc-800/80 px-1.8 py-0.4 rounded flex items-center shrink-0">
                              <span className="text-[8px] text-zinc-500 mr-1.5 uppercase font-bold">Base</span>
                              <input 
                                type="number" 
                                step="0.01"
                                min="0"
                                max="1"
                                value={prim.base}
                                onChange={(e) => updatePrimitiveBase(prim.id, parseFloat(e.target.value) || 0)}
                                className="bg-transparent border-none outline-none text-zinc-200 font-mono text-[10px] w-10 text-right focus:ring-0 p-0"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Inline Explanation or Form inputs */}
                        {isEditing ? (
                          <div className="space-y-2 mt-2 mb-3">
                            <div>
                              <span className="text-[7px] text-zinc-600 font-bold uppercase block mb-0.5">Principle Contract</span>
                              <input 
                                type="text"
                                value={editPrinciple}
                                onChange={(e) => setEditPrinciple(e.target.value)}
                                className="w-full bg-zinc-950/60 border border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-200 focus:border-indigo-500 outline-none"
                              />
                            </div>
                            <div>
                              <span className="text-[7px] text-zinc-600 font-bold uppercase block mb-0.5">Definition</span>
                              <textarea
                                rows={2}
                                value={editDefinition}
                                onChange={(e) => setEditDefinition(e.target.value)}
                                className="w-full bg-zinc-950/60 border border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-200 resize-none focus:border-indigo-500 outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              <div>
                                <span className="text-[7px] text-zinc-600 font-bold uppercase block mb-0.5">0.0 Interpretation</span>
                                <input 
                                  type="text"
                                  value={editMinInterpretation}
                                  onChange={(e) => setEditMinInterpretation(e.target.value)}
                                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded px-1.5 py-0.8 text-[9px] text-zinc-200 outline-none"
                                />
                              </div>
                              <div>
                                <span className="text-[7px] text-zinc-600 font-bold uppercase block mb-0.5">0.5 Interpretation</span>
                                <input 
                                  type="text"
                                  value={editMidInterpretation}
                                  onChange={(e) => setEditMidInterpretation(e.target.value)}
                                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded px-1.5 py-0.8 text-[9px] text-zinc-200 outline-none"
                                />
                              </div>
                              <div>
                                <span className="text-[7px] text-zinc-600 font-bold uppercase block mb-0.5">1.0 Interpretation</span>
                                <input 
                                  type="text"
                                  value={editMaxInterpretation}
                                  onChange={(e) => setEditMaxInterpretation(e.target.value)}
                                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded px-1.5 py-0.8 text-[9px] text-zinc-200 outline-none"
                                />
                              </div>
                            </div>
                            <div>
                              <span className="text-[7px] text-zinc-600 font-bold uppercase block mb-0.5">Owner</span>
                              <input 
                                type="text"
                                value={editOwner}
                                onChange={(e) => setEditOwner(e.target.value)}
                                className="w-full bg-zinc-950/60 border border-zinc-800 rounded px-2 py-0.8 text-[10px] text-zinc-200 outline-none"
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="text-[9.5px] text-zinc-400 font-sans leading-relaxed mb-3">
                            {prim.definition}
                          </p>
                        )}

                        {/* Expanded Semantic Details Drawer */}
                        {isExpanded && !isEditing && (
                          <div className="bg-zinc-950/70 border border-zinc-850/80 rounded-xl p-3.5 mb-4 space-y-2.5 text-[9px] text-zinc-400 font-mono animate-in slide-in-from-top-1 duration-100">
                            <div>
                              <span className="text-zinc-650 uppercase font-bold text-[7.5px] block tracking-wider">Principle Contract</span>
                              <span className="text-zinc-300 font-sans text-[10px]">{prim.principle}</span>
                            </div>
                            <div className="flex justify-between items-center text-[8px] text-zinc-500 pt-0.5">
                              <span>Owner: {prim.owner}</span>
                              <span className="flex items-center text-indigo-400/80"><Sliders className="w-2.5 h-2.5 mr-0.5" /> Bounded Registry</span>
                            </div>
                            {forbidden.length > 0 && (
                              <div className="border-t border-zinc-900 pt-2">
                                <span className="text-rose-500/80 uppercase font-bold text-[7.5px] tracking-wider flex items-center mb-1">
                                  <AlertCircle className="w-2.5 h-2.5 mr-0.5 shrink-0" /> Forbidden Meanings
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {forbidden.map((f) => (
                                    <span key={f} className="bg-rose-500/5 text-rose-400 border border-rose-500/10 px-1.5 rounded text-[7px] font-sans">
                                      {f}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Scale Slider */}
                      <div className="relative pt-1 pb-2">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={prim.base}
                          onChange={(e) => updatePrimitiveBase(prim.id, parseFloat(e.target.value))}
                          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                        />
                        <div className="flex justify-between w-full text-[8.5px] font-mono text-zinc-500 mt-1.8 px-0.5">
                          <span className="whitespace-nowrap truncate shrink-0 max-w-[125px]" title={prim.semanticInterpretation.min}>
                            0.0: {prim.semanticInterpretation.min}
                          </span>
                          <span className="whitespace-nowrap truncate shrink-0 max-w-[125px] text-right" title={prim.semanticInterpretation.max}>
                            1.0: {prim.semanticInterpretation.max}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

      {/* Create Primitive Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-elevated rounded-[32px] max-w-lg w-full p-6 space-y-4 shadow-2xl font-mono border border-white/8">
            <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
              <Sliders className="w-5 h-5 text-indigo-400 shrink-0" />
              <h3 className="text-sm font-bold text-zinc-100 font-sans">Create Behavioral Primitive</h3>
            </div>

            <div className="space-y-3 text-xs max-h-[450px] overflow-y-auto custom-scrollbar pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[8.5px] text-zinc-550 uppercase font-bold tracking-wider block mb-1">
                    Primitive ID (Internal Key)
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. active_listening"
                    value={newPrimId}
                    onChange={(e) => setNewPrimId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-800 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[8.5px] text-zinc-550 uppercase font-bold tracking-wider block mb-1">
                    Behavioral Family
                  </label>
                  <select
                    value={newPrimFamily}
                    onChange={(e) => setNewPrimFamily(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none"
                  >
                    <option value="identity">Identity Family</option>
                    <option value="tone">Tone Family</option>
                    <option value="communication">Communication Family</option>
                    <option value="guidance">Guidance Family</option>
                    <option value="emotional_intelligence">Emotional Intelligence Family</option>
                    <option value="engagement">Engagement Family</option>
                    <option value="regional_cultural">Regional & Cultural Family</option>
                    <option value="safety_governance">Safety & Governance Family</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[8.5px] text-zinc-550 uppercase font-bold tracking-wider block mb-1">
                  Principle Contract (Core Behavioral Law)
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Empathetic reflection and turn validating"
                  value={newPrimPrinciple}
                  onChange={(e) => setNewPrimPrinciple(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-850 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[8.5px] text-zinc-550 uppercase font-bold tracking-wider block mb-1">
                  Definition Explanation
                </label>
                <textarea 
                  rows={2}
                  placeholder="Explain exactly what this primitive captures and what it adapts..."
                  value={newPrimDefinition}
                  onChange={(e) => setNewPrimDefinition(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-850 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="border-t border-zinc-900 pt-3">
                <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-wider block mb-2">Semantic Range Interpretations</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[7.5px] text-zinc-500 uppercase block mb-1">0.0 interpretation</label>
                    <input 
                      type="text" 
                      value={newPrimMinInterpretation}
                      onChange={(e) => setNewPrimMinInterpretation(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-[10px] text-zinc-200"
                    />
                  </div>
                  <div>
                    <label className="text-[7.5px] text-zinc-500 uppercase block mb-1">0.5 interpretation</label>
                    <input 
                      type="text" 
                      value={newPrimMidInterpretation}
                      onChange={(e) => setNewPrimMidInterpretation(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-[10px] text-zinc-200"
                    />
                  </div>
                  <div>
                    <label className="text-[7.5px] text-zinc-500 uppercase block mb-1">1.0 interpretation</label>
                    <input 
                      type="text" 
                      value={newPrimMaxInterpretation}
                      onChange={(e) => setNewPrimMaxInterpretation(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-[10px] text-zinc-200"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-zinc-900 pt-3">
                <div>
                  <label className="text-[8.5px] text-zinc-550 uppercase font-bold tracking-wider block mb-1">
                    Initial Base Value ({newPrimBase.toFixed(2)})
                  </label>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={newPrimBase}
                    onChange={(e) => setNewPrimBase(parseFloat(e.target.value))}
                    className="w-full accent-primary bg-zinc-800 h-1 rounded"
                  />
                </div>

                <div>
                  <label className="text-[8.5px] text-zinc-550 uppercase font-bold tracking-wider block mb-1">
                    Metadata Owner Group
                  </label>
                  <input 
                    type="text" 
                    value={newPrimOwner}
                    onChange={(e) => setNewPrimOwner(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-800">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 rounded-lg text-[10px] text-zinc-400 font-bold uppercase transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreatePrimitive}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[10px] text-white font-bold uppercase shadow-[0_0_12px_rgba(99,102,241,0.4)] transition-all"
              >
                Create Primitive
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
