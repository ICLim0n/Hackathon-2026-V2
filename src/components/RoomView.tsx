import React, { useEffect, useState } from 'react';
import { Room, InteractiveObject } from '../game/Room';
import { Item } from '../game/Item';
import {
  Search,
  Eye,
  CheckCircle,
  AlertCircle,
  X,
  PlusCircle,
  Binary,
  Palette,
  BookOpen,
  FileText,
  Lock,
  Diamond,
  FolderSearch,
  HelpCircle,
  Layers,
  Sparkles,
  Flame,
} from 'lucide-react';
import { sound } from '../game/audio';

interface RoomViewProps {
  room: Room;
  onCollectItem: (item: Item) => void;
  hasItemInInventory: (itemName: string) => boolean;
  onSubmitAnswer: (answer: string) => void;
}

export const RoomView: React.FC<RoomViewProps> = ({
  room,
  onCollectItem,
  hasItemInInventory,
  onSubmitAnswer,
}) => {
  const [selectedObject, setSelectedObject] = useState<InteractiveObject | null>(null);
  const [activeBookIndex, setActiveBookIndex] = useState<number | null>(null);
  const [selectedBookNumbers, setSelectedBookNumbers] = useState<string[]>([]);
  const [drillAnswers, setDrillAnswers] = useState<Record<string, string>>({});
  const [drillFeedback, setDrillFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  useEffect(() => {
    setSelectedBookNumbers([]);
    setActiveBookIndex(null);
    setDrillAnswers({});
    setDrillFeedback(null);
  }, [room.id, room.puzzle.isSolved, room.resetCount]);

  // Handle object selection
  const handleObjectClick = (obj: InteractiveObject) => {
    sound.playClick();
    obj.hasBeenInteracted = true;
    setDrillFeedback(null);
    setSelectedObject(obj);
  };

  // Handle item pickup from object inspection
  const handlePickup = (item: Item) => {
    onCollectItem(item);
  };

  const sceneButton = (id: string, title: string, detail: string, className = '') => {
    const object = room.interactiveObjects.find((candidate) => candidate.id === id);
    if (!object) return null;

    return (
      <button
        key={id}
        onClick={() => handleObjectClick(object)}
        className={`rounded border border-white/20 bg-slate-950/85 px-3 py-2 text-left text-white shadow-lg transition hover:border-cyan-300 hover:bg-slate-900 ${className}`}
        aria-label={`Inspect ${title}`}
      >
        <span className="flex items-center justify-between gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-300">
          {title}
          {id === 'flame_firewall' && <Flame className="h-4 w-4 text-orange-400" aria-hidden="true" />}
          {id === 'diamond_pedestal' && <Diamond className="h-5 w-5 text-red-400" aria-hidden="true" />}
        </span>
        <span className="block text-xs text-slate-300">{detail}</span>
      </button>
    );
  };

  return (
    <div className="space-y-4">
      {/* Room Banner / Narrative Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 md:p-5 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-36 h-36 bg-cyan-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-widest bg-cyan-950 text-cyan-400 border border-cyan-800">
              CHAMBER #{room.id}
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-slate-100">
              {room.name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 ${
                room.puzzle.isSolved
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                  : 'bg-amber-950/80 text-amber-300 border border-amber-800'
              }`}
            >
              {room.puzzle.isSolved ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  STATUS: UNLOCKED
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  STATUS: SECURED
                </>
              )}
            </span>
          </div>
        </div>

        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-4xl font-sans">
          {room.description}
        </p>

        {/* Visual Scene Specific Mini-Hero Banner */}
        {room.id === 2 && (
          <div className="mt-4 p-3 bg-purple-950/40 border border-purple-800/60 rounded-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Palette className="w-8 h-8 text-purple-400 shrink-0" />
              <div>
                <span className="text-xs font-mono font-bold text-purple-300 block">
                  FEATURED WORK: "THE BINARY DAWN"
                </span>
                <span className="text-xs text-purple-200/80">
                  Four 4-bit binary bands are painted directly onto the canvas. Inspect the painting below.
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                const painting = room.interactiveObjects.find((o) => o.id === 'large_painting');
                if (painting) handleObjectClick(painting);
              }}
              className="px-3 py-1.5 bg-purple-800/80 hover:bg-purple-700 text-purple-100 rounded text-xs font-mono font-bold whitespace-nowrap transition"
            >
              INSPECT PAINTING
            </button>
          </div>
        )}

        {room.id === 3 && (
          <div className="mt-4 p-3 bg-amber-950/40 border border-amber-800/60 rounded-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-mono font-bold text-amber-300 block">
                  ANCIENT LIBRARY: SECURITY PROTOCOLS
                </span>
                <span className="text-xs text-amber-200/80">
                  Ten books contain advice about social-engineering attempts. Inspect each one, then choose the two sound safeguards.
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                const shelf = room.interactiveObjects.find((o) => o.id === 'bookshelf_unit');
                if (shelf) handleObjectClick(shelf);
              }}
              className="px-3 py-1.5 bg-amber-800/80 hover:bg-amber-700 text-amber-100 rounded text-xs font-mono font-bold whitespace-nowrap transition"
            >
              VIEW SHELF
            </button>
          </div>
        )}

        {room.id === 4 && (
          <div className="mt-4 p-3 bg-blue-950/40 border border-blue-700/60 rounded-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Lock className="w-8 h-8 text-blue-400 shrink-0" />
              <div>
                <span className="text-xs font-mono font-bold text-blue-300 block">
                  PADDED CELL // SSH CODE REQUIRED
                </span>
                <span className="text-xs text-blue-200/80">
                  Search beneath the padded mats and inspect your collected clues. The Blue Shell Tool Assistant contains the secure tunnel reference.
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                const mat = room.interactiveObjects.find((o) => o.id === 'padded_mat');
                if (mat) handleObjectClick(mat);
              }}
              className="px-3 py-1.5 bg-blue-700/80 hover:bg-blue-600 text-white font-bold rounded text-xs font-mono whitespace-nowrap transition"
            >
              SEARCH MAT
            </button>
          </div>
        )}

        {room.id === 5 && (
          <div className="mt-4 p-3 bg-rose-950/40 border border-rose-800/60 rounded-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Diamond className="w-8 h-8 text-cyan-300 animate-pulse shrink-0" />
              <div>
                <span className="text-xs font-mono font-bold text-rose-300 block">
                  THE RED DIAMOND // FOUR AWARENESS DRILLS
                </span>
                <span className="text-xs text-rose-200/80">
                  Complete four safety drills to open the showcase and claim the red diamond.
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                const pedestal = room.interactiveObjects.find((o) => o.id === 'diamond_pedestal');
                if (pedestal) handleObjectClick(pedestal);
              }}
              className="px-3 py-1.5 bg-rose-800/80 hover:bg-rose-700 text-rose-100 rounded text-xs font-mono font-bold whitespace-nowrap transition"
            >
              INSPECT PEDESTAL
            </button>
          </div>
        )}
      </div>

      <section
        aria-label={`${room.name} illustrated scene`}
        className={`relative isolate overflow-hidden rounded-lg border shadow-inner ${
          room.id === 2
            ? 'border-purple-800 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950'
            : room.id === 3
              ? 'border-amber-900 bg-gradient-to-br from-stone-950 via-amber-950 to-slate-950'
              : room.id === 4
                ? 'border-blue-800 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900'
                : room.id === 5
                  ? 'border-rose-900 bg-gradient-to-br from-rose-950 via-slate-950 to-red-950'
                  : 'border-emerald-900 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900'
        }`}
      >
        <div className="absolute inset-0 opacity-30" aria-hidden="true">
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        </div>
        <div className="relative p-4 md:p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300">Scene // Chamber {room.id}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">Touch objects to inspect</span>
          </div>

          {room.id === 1 && (
            <div className="grid min-h-44 grid-cols-2 gap-2 sm:grid-cols-5">
              {sceneButton('desk_note', 'Desk note', 'OTP digit 01', 'bg-yellow-950/90')}
              {sceneButton('guard_badge', 'Guard badge', 'OTP digit 02', 'bg-slate-900/90')}
              {sceneButton('whiteboard', 'Shift board', 'OTP digit 03', 'bg-slate-800/90')}
              {sceneButton('server_terminal', 'Server rack', 'OTP digit 04', 'bg-emerald-950/90')}
              {sceneButton('locker', 'Locker 104', 'Optional UV torch', 'bg-slate-900/90')}
              <div className="col-span-2 flex items-center justify-center rounded border border-emerald-900/70 bg-black/40 font-mono text-xs text-emerald-300 sm:col-span-5">
                SECURITY OFFICE // OTP: _ _ _ _ // MFA GATE LOCKED
              </div>
            </div>
          )}

          {room.id === 2 && (
            <div className="relative flex min-h-48 items-center justify-center overflow-hidden rounded border border-purple-300/20 bg-slate-950/60 p-5">
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-evenly opacity-80" aria-hidden="true">
                {[
                  ['CRIMSON', '0101', 'from-rose-500/30'],
                  ['GOLD', '1001', 'from-amber-400/30'],
                  ['COBALT', '0010', 'from-blue-500/30'],
                  ['SILVER', '0111', 'from-slate-200/25'],
                ].map(([label, bits, color]) => (
                  <div key={label} className={`flex h-32 w-[19%] flex-col items-center justify-center rounded bg-gradient-to-b ${color} to-transparent font-mono`}>
                    <span className="text-[9px] tracking-widest text-white/70">{label}</span>
                    <span className="mt-2 text-xs font-bold tracking-[0.2em] text-white">{bits}</span>
                  </div>
                ))}
              </div>
              <div className="laser-sweep absolute left-0 right-0 top-1/2 z-10 h-0.5 bg-red-400 shadow-[0_0_12px_4px_rgba(248,113,113,0.8)]" aria-hidden="true" />
              {sceneButton('large_painting', 'The Binary Dawn', 'Inspect the four bands', 'relative z-20 border-purple-300/50 bg-purple-950/90 text-center')}
            </div>
          )}

          {room.id === 3 && (
            <div className="min-h-48 rounded border border-amber-900/70 bg-stone-950/70 p-3">
              <div className="space-y-3 rounded bg-amber-950/40 p-3">
                {[0, 1, 2].map((shelf) => (
                  <div key={shelf} className="flex h-9 items-end gap-1 border-b-4 border-amber-800 px-2">
                    {Array.from({ length: shelf === 1 ? 4 : 3 }, (_, index) => (
                      <span
                        key={index}
                        className={`${
                          ['h-6', 'h-7', 'h-8'][((index + shelf) % 3)]
                        } flex-1 rounded-t border border-amber-200/20 ${
                          ['bg-emerald-900', 'bg-red-950', 'bg-indigo-950', 'bg-amber-800'][index]
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-center">
                {sceneButton('bookshelf_unit', 'Ten-volume archive', 'Open books and choose two safeguards', 'border-amber-500/50 bg-amber-950/90')}
              </div>
            </div>
          )}

          {room.id === 4 && (
            <div className="relative grid min-h-48 grid-cols-2 gap-3 overflow-hidden rounded border border-blue-700/50 bg-slate-950/70 p-4 sm:grid-cols-3">
              <div className="absolute inset-0 grid grid-cols-6 gap-1 p-2 opacity-40" aria-hidden="true">
                {Array.from({ length: 18 }, (_, index) => (
                  <span key={index} className="rounded border border-slate-500/50 bg-slate-500/10 shadow-inner" />
                ))}
              </div>
              <div className="fire-flicker relative z-10 col-span-2 flex items-center justify-center rounded border border-orange-500/40 bg-gradient-to-r from-red-950 via-orange-800/50 to-red-950 px-2 text-center font-mono text-sm font-black uppercase tracking-widest text-orange-200 sm:col-span-1">
                {sceneButton('flame_firewall', 'Firewall of flame', 'Barrier filtering access')}
              </div>
              <div className="relative z-10 col-span-2 flex flex-wrap items-center justify-center gap-2 sm:col-span-2">
                {sceneButton('padded_mat', 'Padded wall mat', 'Search beneath the mat', 'border-blue-300/50 bg-blue-950/90')}
                {sceneButton('padded_mat_key', 'Padded wall mat', 'A loose corner hides an object', 'border-amber-700/50 bg-amber-950/90')}
                {sceneButton('padded_mat_book', 'Padded wall mat', 'A scorched seam hides an object', 'border-orange-700/50 bg-orange-950/90')}
                {sceneButton('tunnel_console', 'Firewall console', 'Submit the SSH code', 'bg-slate-900/90')}
              </div>
            </div>
          )}

          {room.id === 5 && (
            <div className="grid min-h-52 grid-cols-2 gap-2 rounded border border-rose-900/70 bg-black/40 p-3 sm:grid-cols-5">
              {sceneButton('impersonation_drill', 'A // Impersonation', 'Choose a safe response', 'border-rose-400/30')}
              {sceneButton('distraction_drill', 'B // Distraction', 'Choose a safe response', 'border-rose-400/30')}
              {sceneButton('phishing_drill', 'C // Phishing', 'Choose a safe response', 'border-rose-400/30')}
              {sceneButton('payment_fraud_drill', 'D // Payment fraud', 'Choose a safe response', 'border-rose-400/30')}
              {sceneButton('diamond_pedestal', '100-carat red diamond', 'Behind vault glass', 'col-span-2 border-red-400/50 bg-red-950/80 sm:col-span-1')}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Clickable Objects Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span className="flex items-center gap-1.5 uppercase font-bold text-slate-300">
            <FolderSearch className="w-4 h-4 text-cyan-400" />
            SEARCHABLE OBJECTS & TERMINALS ({room.interactiveObjects.length})
          </span>
          <span className="text-[11px] text-cyan-400">CLICK ANY OBJECT TO INVESTIGATE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {room.interactiveObjects.map((obj) => {
            const hasHiddenItem = obj.hiddenItem && !hasItemInInventory(obj.hiddenItem.name);

            return (
              <button
                key={obj.id}
                onClick={() => handleObjectClick(obj)}
                className={`text-left p-3.5 rounded-lg border transition-all duration-200 relative group flex flex-col justify-between ${
                  obj.hasBeenInteracted
                    ? 'bg-slate-900/90 border-slate-700/80 hover:border-cyan-500'
                    : 'bg-slate-950 border-cyan-900/60 hover:border-cyan-400 hover:bg-slate-900 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-slate-200 group-hover:text-cyan-300 transition">
                      {obj.name}
                    </span>
                    <span className="p-1.5 rounded bg-slate-900 border border-slate-800 group-hover:border-cyan-500/60 text-cyan-400 shrink-0">
                      <Search className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {obj.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span
                    className={
                      obj.hasBeenInteracted ? 'text-emerald-400 font-semibold' : 'text-amber-400/90'
                    }
                  >
                    {obj.hasBeenInteracted ? '✓ EXAMINED' : '• UNSEARCHED'}
                  </span>

                  {hasHiddenItem && (
                    <span className="text-cyan-300 font-bold bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" /> ITEM INSIDE
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Object Inspection Modal / Interactive Popup */}
      {selectedObject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-cyan-500/70 rounded-lg shadow-2xl max-w-xl w-full overflow-hidden text-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-cyan-900">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <h3 className="font-mono font-bold text-sm text-cyan-300 uppercase tracking-wide">
                  INVESTIGATING: {selectedObject.name}
                </h3>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedObject(null);
                }}
                className="text-slate-400 hover:text-white transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4 font-mono text-xs">
              <p className="text-slate-300 text-sm leading-relaxed">{selectedObject.description}</p>

              {selectedObject.interactionType === 'awareness-drill' && selectedObject.extraData?.choices && (
                <div className="space-y-3 rounded border border-rose-800/70 bg-slate-950 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-rose-300">
                      Mini problem {selectedObject.name.replace('Drill ', '')}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-300">
                      {drillAnswers[selectedObject.id] ? 'ANSWER SAVED' : 'CHOOSE ONE'}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-white">{selectedObject.extraData.question}</p>
                  <div className="space-y-2">
                    {selectedObject.extraData.choices.map((choice: { label: string; answer: string; text: string }) => {
                      const isSelected = drillAnswers[selectedObject.id] === choice.answer;
                      return (
                        <button
                          key={choice.label}
                          onClick={() => {
                            sound.playClick();
                            if (choice.answer !== selectedObject.extraData?.correctAnswer) {
                              onSubmitAnswer(choice.answer);
                              setDrillFeedback({
                                message: 'Not quite. Review the scenario and choose a safer response.',
                                isCorrect: false,
                              });
                              return;
                            }

                            const nextAnswers = { ...drillAnswers, [selectedObject.id]: choice.answer };
                            setDrillAnswers(nextAnswers);
                            setDrillFeedback({
                              message: `Correct. ${Object.keys(nextAnswers).length} of 4 drills complete.`,
                              isCorrect: true,
                            });

                            const drillOrder = [
                              'impersonation_drill',
                              'distraction_drill',
                              'phishing_drill',
                              'payment_fraud_drill',
                            ];
                            if (drillOrder.every((drillId) => nextAnswers[drillId])) {
                              onSubmitAnswer(drillOrder.map((drillId) => nextAnswers[drillId]).join(','));
                              setSelectedObject(null);
                            }
                          }}
                          className={`flex w-full items-start gap-3 rounded border p-3 text-left transition ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-950/70 text-emerald-100'
                              : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-rose-400 hover:bg-slate-800'
                          }`}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-current font-bold">{choice.label}</span>
                          <span className="text-xs leading-relaxed">{choice.text}</span>
                          {isSelected && <CheckCircle className="ml-auto h-4 w-4 shrink-0 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>
                  {drillFeedback && (
                    <p
                      role="status"
                      className={`rounded border p-2 text-xs ${
                        drillFeedback.isCorrect
                          ? 'border-emerald-800 bg-emerald-950/60 text-emerald-300'
                          : 'border-amber-800 bg-amber-950/60 text-amber-200'
                      }`}
                    >
                      {drillFeedback.message}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400">
                    Complete drills A–D in any order. All four correct responses are required to open the diamond case.
                  </p>
                </div>
              )}

              {/* SPECIAL INTERACTION: PAINTING (Room 2) */}
              {selectedObject.interactionType === 'painting' && selectedObject.extraData?.binaryData && (
                <div className="space-y-3">
                  <div className="p-4 rounded bg-slate-950 border border-purple-700/60">
                    <div className="flex items-center justify-between mb-3 text-purple-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Palette className="w-4 h-4" /> CANVAS COLOR BANDS & BINARY GLYPHS
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">4-BIT NIBBLES</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedObject.extraData.binaryData.map((band: any, i: number) => (
                        <div
                          key={i}
                          className="p-2.5 rounded bg-slate-900 border border-purple-900/60 flex items-center justify-between"
                        >
                          <div>
                            <span className="text-[11px] text-slate-400 block font-sans">
                              {band.band}
                            </span>
                            <span className="text-base text-cyan-300 font-bold tracking-widest font-mono">
                              {band.binary}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-500 block">VALUE</span>
                            <span className="text-xs text-purple-300 font-bold">
                              Digit #{i + 1}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-purple-300/80 mt-3 pt-2 border-t border-purple-900/40">
                      Convert each band using place values 8·4·2·1. The four digits, read left to right, form the laser disarm sequence.
                    </p>
                  </div>
                  {selectedObject.extraData.options && (
                    <div className="rounded border border-purple-800/70 bg-slate-950 p-3">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-purple-300">
                        Select the decoded code // options shuffled each run
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedObject.extraData.options.map((option: string) => (
                          <button
                            key={option}
                            onClick={() => {
                              onSubmitAnswer(option);
                              setSelectedObject(null);
                            }}
                            className="rounded border border-purple-700/70 bg-purple-950/70 py-2 font-mono text-sm font-bold tracking-[0.25em] text-white transition hover:border-cyan-300 hover:bg-purple-900"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SPECIAL INTERACTION: BOOKSHELF (Room 3) */}
              {selectedObject.interactionType === 'bookshelf' && selectedObject.extraData?.books && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded text-amber-200">
                    <p className="text-xs font-sans">
                      Read the protocol in all ten books. Select exactly two sound safeguards; choosing the second submits both volume numbers.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedObject.extraData.books.map((book: any, idx: number) => {
                      const bookNumber = String(book.vol);
                      const isSelected = selectedBookNumbers.includes(bookNumber);
                      const isPulled = activeBookIndex === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            sound.playClick();
                            setActiveBookIndex(idx);
                            const nextSelection = isSelected
                              ? selectedBookNumbers.filter((number) => number !== bookNumber)
                              : selectedBookNumbers.length < 2
                                ? [...selectedBookNumbers, bookNumber]
                                : [selectedBookNumbers[1], bookNumber];
                            setSelectedBookNumbers(nextSelection);
                            if (nextSelection.length === 2) {
                              onSubmitAnswer(
                                nextSelection
                                  .sort((first, second) => Number(first) - Number(second))
                                  .join(',')
                              );
                              setSelectedBookNumbers([]);
                              setActiveBookIndex(null);
                              setSelectedObject(null);
                            }
                          }}
                          className={`p-3 rounded-lg border text-left transition-all duration-200 flex flex-col justify-between min-h-36 ${book.color} ${
                            isPulled || isSelected
                              ? 'ring-2 ring-amber-400 transform -translate-y-1 shadow-lg'
                              : 'hover:brightness-110 opacity-90'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-amber-300 font-mono">
                              VOL {book.vol}{isSelected ? ' // SELECTED' : ''}
                            </span>
                            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block line-clamp-1">
                              {book.title}
                            </span>
                            <p className="mt-2 text-[10px] leading-relaxed text-slate-200">{book.protocol}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-2 bg-slate-950 rounded border border-amber-900/50 text-[11px] text-slate-300">
                    <span className="text-amber-400 font-bold">SELECTED VOLUMES ({selectedBookNumbers.length}/2): </span>
                    Choose the two advice books that recommend independent identity verification and reporting suspicious messages without sharing verification codes.
                  </div>
                </div>
              )}

              {/* SPECIAL INTERACTION: NOTEPAD (Room 4) */}
              {selectedObject.interactionType === 'notepad' && selectedObject.extraData?.notes && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-md p-4 text-slate-900 shadow-inner font-mono">
                  <div className="border-b-2 border-red-300 pb-2 mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold tracking-widest text-red-700 uppercase">
                      CHIEF ENGINEER'S SAFE COMBINATION LOG
                    </span>
                    <span className="text-[10px] text-slate-500">CONFIDENTIAL</span>
                  </div>
                  <div className="space-y-2 text-xs font-sans text-slate-800 leading-relaxed">
                    {selectedObject.extraData.notes.map((note: string, nIdx: number) => (
                      <p key={nIdx} className="border-b border-yellow-200/80 pb-1">
                        {note}
                      </p>
                    ))}
                  </div>
                  <div className="mt-3 pt-2 border-t border-yellow-300 text-[11px] text-slate-600 italic">
                    Deduce each digit (A, B, C, D) using the math equations above to crack the safe door dial!
                  </div>
                </div>
              )}

              {/* Standard Clue Text Display */}
              {selectedObject.clue && (
                <div className="p-3.5 rounded bg-slate-950 border border-cyan-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 block tracking-wider">
                    DISCOVERED INTEL / CLUE:
                  </span>
                  <p className="text-slate-100 text-xs md:text-sm whitespace-pre-line leading-relaxed font-mono">
                    {selectedObject.clue}
                  </p>
                </div>
              )}

              {/* Collectible item prompt if object hides one */}
              {selectedObject.hiddenItem && (
                <div className="p-3 rounded bg-emerald-950/60 border border-emerald-700 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                      TOOL DISCOVERED IN AREA
                    </span>
                    <span className="text-xs font-bold text-slate-100">
                      {selectedObject.hiddenItem.name}
                    </span>
                  </div>
                  {hasItemInInventory(selectedObject.hiddenItem.name) ? (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> IN INVENTORY
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePickup(selectedObject.hiddenItem!)}
                      className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition"
                    >
                      <PlusCircle className="w-4 h-4" /> TAKE ITEM
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 bg-slate-950 border-t border-cyan-900 flex justify-end">
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedObject(null);
                }}
                className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold transition"
              >
                CLOSE INSPECTION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
