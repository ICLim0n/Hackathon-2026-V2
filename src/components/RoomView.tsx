import React, { useState } from 'react';
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
} from 'lucide-react';
import { sound } from '../game/audio';

interface RoomViewProps {
  room: Room;
  onCollectItem: (item: Item) => void;
  hasItemInInventory: (itemName: string) => boolean;
}

export const RoomView: React.FC<RoomViewProps> = ({
  room,
  onCollectItem,
  hasItemInInventory,
}) => {
  const [selectedObject, setSelectedObject] = useState<InteractiveObject | null>(null);
  const [activeBookIndex, setActiveBookIndex] = useState<number | null>(null);

  // Handle object selection
  const handleObjectClick = (obj: InteractiveObject) => {
    sound.playClick();
    obj.hasBeenInteracted = true;
    setSelectedObject(obj);
  };

  // Handle item pickup from object inspection
  const handlePickup = (item: Item) => {
    onCollectItem(item);
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
                  SYNDICATE ARCHIVE BOOKCASE
                </span>
                <span className="text-xs text-amber-200/80">
                  6 numbered collector books rest on the mahogany shelf. Click each book to reveal its title and spine letter.
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
          <div className="mt-4 p-3 bg-yellow-950/40 border border-yellow-700/60 rounded-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-yellow-400 shrink-0" />
              <div>
                <span className="text-xs font-mono font-bold text-yellow-300 block">
                  ENGINEER'S HANDWRITTEN NOTEPAD
                </span>
                <span className="text-xs text-yellow-200/80">
                  A ruled legal pad beside the safe dial lists five deduction rules for the 4-digit code.
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                const pad = room.interactiveObjects.find((o) => o.id === 'notepad_table');
                if (pad) handleObjectClick(pad);
              }}
              className="px-3 py-1.5 bg-yellow-700/80 hover:bg-yellow-600 text-yellow-950 font-bold rounded text-xs font-mono whitespace-nowrap transition"
            >
              OPEN NOTEPAD
            </button>
          </div>
        )}

        {room.id === 5 && (
          <div className="mt-4 p-3 bg-rose-950/40 border border-rose-800/60 rounded-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Diamond className="w-8 h-8 text-cyan-300 animate-pulse shrink-0" />
              <div>
                <span className="text-xs font-mono font-bold text-rose-300 block">
                  THE CROWN VAULT: "SOLSTICE DIAMOND"
                </span>
                <span className="text-xs text-rose-200/80">
                  Protected by 4 rotary cylinder tumblers. Align the sequence to claim the heist prize!
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
                      💡 Tip: Convert each 4-bit binary group into its decimal digit (8·4·2·1). For example, 0101 = 4+1 = 5. Enter all 4 digits in order!
                    </p>
                  </div>
                </div>
              )}

              {/* SPECIAL INTERACTION: BOOKSHELF (Room 3) */}
              {selectedObject.interactionType === 'bookshelf' && selectedObject.extraData?.books && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded text-amber-200">
                    <p className="text-xs font-sans">
                      Click each volume on the shelf below. Inspecting a book pulls it forward and reveals its primary cipher letter:
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedObject.extraData.books.map((book: any, idx: number) => {
                      const isPulled = activeBookIndex === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            sound.playClick();
                            setActiveBookIndex(isPulled ? null : idx);
                          }}
                          className={`p-3 rounded-lg border text-left transition-all duration-200 flex flex-col justify-between h-28 ${book.color} ${
                            isPulled
                              ? 'ring-2 ring-amber-400 transform -translate-y-1 shadow-lg'
                              : 'hover:brightness-110 opacity-90'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-amber-300 font-mono">
                              VOL {book.vol}
                            </span>
                            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block line-clamp-1">
                              {book.title}
                            </span>
                            <div className="mt-1 flex items-center justify-between text-[11px]">
                              <span className="text-slate-300">Letter:</span>
                              <span className="px-1.5 py-0.5 rounded bg-black/60 font-bold text-amber-300 text-sm">
                                {book.letter}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-2 bg-slate-950 rounded border border-amber-900/50 text-[11px] text-slate-300">
                    <span className="text-amber-400 font-bold">PASSPHRASE SEQUENCE: </span>
                    Combine the extracted letters from Vol I through Vol VI in numerical order to solve the keypad password!
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
