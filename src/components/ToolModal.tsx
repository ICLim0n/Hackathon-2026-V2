import React, { useState } from 'react';
import { Item } from '../game/Item';
import {
  X,
  Binary,
  Flashlight,
  FileEdit,
  BookOpen,
  Headphones,
  Check,
  Search,
  Sparkles,
} from 'lucide-react';
import { sound } from '../game/audio';

interface ToolModalProps {
  item: Item | null;
  onClose: () => void;
  currentRoomId: number;
}

export const ToolModal: React.FC<ToolModalProps> = ({ item, onClose, currentRoomId }) => {
  if (!item) return null;

  // State for interactive scratchpad tool
  const [scratchpadText, setScratchpadText] = useState(
    '// TACTICAL SCRATCHPAD\n// Enter notes, math, or test values here:\n\n'
  );

  // State for binary converter tool
  const [binaryInput, setBinaryInput] = useState('0101');
  const [binaryOutput, setBinaryOutput] = useState('5');

  const handleBinaryChange = (val: string) => {
    // Only allow 0 and 1
    const clean = val.replace(/[^01]/g, '').slice(0, 8);
    setBinaryInput(clean);
    if (clean.length > 0) {
      setBinaryOutput(String(parseInt(clean, 2)));
    } else {
      setBinaryOutput('0');
    }
  };

  // State for Caesar cipher shift tool
  const [caesarShift, setCaesarShift] = useState(0);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-cyan-500/60 rounded-lg shadow-2xl max-w-lg w-full overflow-hidden text-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-cyan-900/60">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              {item.toolType === 'uv-light' && <Flashlight className="w-4 h-4" />}
              {item.toolType === 'binary-decoder' && <Binary className="w-4 h-4" />}
              {item.toolType === 'cipher-tool' && <BookOpen className="w-4 h-4" />}
              {item.toolType === 'scratchpad' && <FileEdit className="w-4 h-4" />}
              {item.toolType === 'stethoscope' && <Headphones className="w-4 h-4" />}
              {!item.toolType && <Sparkles className="w-4 h-4" />}
            </span>
            <h3 className="font-mono font-bold text-sm text-cyan-300 uppercase tracking-wide">
              TOOL ASSISTANT: {item.name}
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-white transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 font-mono text-xs">
          <p className="text-slate-300 text-sm leading-relaxed">{item.description}</p>

          {/* UV Light Special Interface */}
          {item.toolType === 'uv-light' && (
            <div className="p-4 rounded bg-purple-950/60 border border-purple-600/60 text-purple-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-purple-300 text-sm">
                <Flashlight className="w-4 h-4 animate-pulse text-purple-400" />
                <span>ULTRAVIOLET ILLUMINATION ACTIVE</span>
              </div>
              <p className="text-purple-300/90 text-xs">
                {currentRoomId === 1
                  ? 'Switching on the 365nm UV torch reveals residue on the Security Office desk! Inspecting the desk note, badge, whiteboard, and server will highlight the four key digits in glowing green ink.'
                  : 'UV inspection torch ready. Illuminates luminescent chemical residue on surfaces.'}
              </p>
              <div className="p-2 rounded bg-black/40 border border-purple-500/40 text-[11px] font-mono text-purple-200">
                [SPECTRAL SENSOR]: 4 distinct fluorescent fingerprints detected on office stations.
              </div>
            </div>
          )}

          {/* Binary Translation Tool Interface */}
          {item.toolType === 'binary-decoder' && (
            <div className="space-y-3 p-4 rounded bg-slate-950 border border-cyan-800">
              <div className="flex items-center justify-between text-cyan-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Binary className="w-4 h-4" /> 4-Bit Binary Decoder
                </span>
                <span className="text-[10px] text-slate-400">NIBBLE (8-4-2-1)</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[10px] text-slate-400 block mb-1">Enter Binary (4 bits):</label>
                  <input
                    type="text"
                    value={binaryInput}
                    onChange={(e) => handleBinaryChange(e.target.value)}
                    className="w-full bg-slate-900 border border-cyan-600 rounded px-3 py-1.5 text-center font-mono text-cyan-300 tracking-widest text-base"
                    placeholder="0101"
                    maxLength={8}
                  />
                </div>
                <div className="text-xl text-slate-500 font-bold pt-4">=</div>
                <div className="flex-1">
                  <label className="text-[10px] text-slate-400 block mb-1">Decimal Value:</label>
                  <div className="bg-slate-900 border border-emerald-500/60 rounded px-3 py-1.5 text-center font-mono text-emerald-400 text-lg font-bold">
                    {binaryOutput}
                  </div>
                </div>
              </div>

              {/* Reference lookup table */}
              <div className="mt-3 pt-3 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1.5">QUICK REFERENCE:</span>
                <div className="grid grid-cols-5 gap-1 text-[11px] text-center">
                  <div className="bg-slate-900 p-1 rounded border border-slate-800">0000 = 0</div>
                  <div className="bg-slate-900 p-1 rounded border border-slate-800">0001 = 1</div>
                  <div className="bg-slate-900 p-1 rounded border border-slate-800">0010 = 2</div>
                  <div className="bg-slate-900 p-1 rounded border border-slate-800">0011 = 3</div>
                  <div className="bg-slate-900 p-1 rounded border border-slate-800">0100 = 4</div>
                  <div className="bg-slate-900 p-1 rounded border border-cyan-900/60 text-cyan-300 font-bold">0101 = 5</div>
                  <div className="bg-slate-900 p-1 rounded border border-slate-800">0110 = 6</div>
                  <div className="bg-slate-900 p-1 rounded border border-cyan-900/60 text-cyan-300 font-bold">0111 = 7</div>
                  <div className="bg-slate-900 p-1 rounded border border-slate-800">1000 = 8</div>
                  <div className="bg-slate-900 p-1 rounded border border-cyan-900/60 text-cyan-300 font-bold">1001 = 9</div>
                </div>
              </div>
            </div>
          )}

          {/* Cipher Wheel Tool */}
          {item.toolType === 'cipher-tool' && (
            <div className="space-y-3 p-4 rounded bg-slate-950 border border-amber-800/80">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> Book Acronym & Cipher Index
                </span>
                <span className="text-[10px] text-amber-400/80">A-Z PROTOCOL</span>
              </div>
              <p className="text-slate-300 text-xs">
                Syndicate library passwords are formed by extracting the first letter of each book title in sequence (acronym cipher):
              </p>
              <div className="bg-slate-900/90 p-2.5 rounded border border-amber-900/50 space-y-1 text-slate-300 text-[11px]">
                <div>• Volume I: <span className="text-amber-400 font-bold">[C]</span>hronology...</div>
                <div>• Volume II: <span className="text-amber-400 font-bold">[I]</span>nvisible...</div>
                <div>• Volume III: <span className="text-amber-400 font-bold">[P]</span>rotocols...</div>
                <div>• Volume IV: <span className="text-amber-400 font-bold">[H]</span>idden...</div>
                <div>• Volume V: <span className="text-amber-400 font-bold">[E]</span>scape...</div>
                <div>• Volume VI: <span className="text-amber-400 font-bold">[R]</span>ogue...</div>
              </div>
            </div>
          )}

          {/* Scratchpad Tool */}
          {item.toolType === 'scratchpad' && (
            <div className="space-y-2 p-3 rounded bg-slate-950 border border-slate-700">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <FileEdit className="w-4 h-4" /> Interactive Note Pad
                </span>
                <span className="text-[10px] text-slate-400">AUTOSAVED</span>
              </div>
              <textarea
                value={scratchpadText}
                onChange={(e) => setScratchpadText(e.target.value)}
                rows={6}
                className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 font-mono text-xs focus:outline-hidden focus:border-cyan-500"
                placeholder="Type your notes or deductions here..."
              />
            </div>
          )}

          {/* Stethoscope Lockpick Tool */}
          {item.toolType === 'stethoscope' && (
            <div className="space-y-3 p-4 rounded bg-slate-950 border border-rose-800/80">
              <div className="flex items-center justify-between text-rose-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Headphones className="w-4 h-4" /> Acoustic Tumbler Audio Sensor
                </span>
                <span className="text-[10px] text-rose-400/80">ROTARY FREQUENCY</span>
              </div>
              <p className="text-slate-300 text-xs">
                Listening to the titanium cylinder tumblers reveals four heavy acoustic resonance frequencies matching:
                <br />
                <span className="text-rose-400 font-bold mt-1 inline-block">
                  [ Click 1: 4 ] • [ Click 2: 4 ] • [ Click 3: 8 ] • [ Click 4: 8 ]
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-950 border-t border-cyan-900/40 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition"
          >
            CLOSE TOOL
          </button>
        </div>
      </div>
    </div>
  );
};
