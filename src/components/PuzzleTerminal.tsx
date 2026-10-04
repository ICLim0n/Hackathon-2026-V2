import React, { useState, useEffect } from 'react';
import { Room } from '../game/Room';
import {
  Terminal,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Delete,
  CornerDownLeft,
  Lock,
  Unlock,
} from 'lucide-react';
import { sound } from '../game/audio';

interface PuzzleTerminalProps {
  room: Room;
  onSubmit: (answer: string) => void;
  onRequestHint: () => void;
  onProceed: () => void;
  feedbackMessage: string | null;
  isSuccess: boolean | null;
}

export const PuzzleTerminal: React.FC<PuzzleTerminalProps> = ({
  room,
  onSubmit,
  onRequestHint,
  onProceed,
  feedbackMessage,
  isSuccess,
}) => {
  const [inputVal, setInputVal] = useState('');
  const puzzle = room.puzzle;

  // Clear input when room changes
  useEffect(() => {
    setInputVal('');
  }, [room.id]);

  const handleKeypadPress = (val: string) => {
    sound.playClick();
    if (puzzle.isSolved) return;
    setInputVal((prev) => (prev + val).slice(0, 12));
  };

  const handleBackspace = () => {
    sound.playClick();
    if (puzzle.isSolved) return;
    setInputVal((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    sound.playClick();
    if (puzzle.isSolved) return;
    setInputVal('');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || puzzle.isSolved) return;
    onSubmit(inputVal);
  };

  // Keyboard support: Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="bg-slate-950 border border-cyan-800/80 rounded-lg p-4 md:p-5 shadow-xl text-slate-100 font-mono">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-900/60">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm md:text-base font-bold text-cyan-300 uppercase tracking-wider">
            SECURITY ACCESS CONSOLE // R-{room.id}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
              puzzle.isSolved
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
            }`}
          >
            {puzzle.isSolved ? 'OVERRIDE CONFIRMED' : 'INPUT REQUIRED'}
          </span>
        </div>
      </div>

      {/* Challenge Riddle / Prompt */}
      <div className="mb-4 p-3 rounded bg-slate-900 border border-slate-800">
        <span className="text-[10px] text-cyan-500 uppercase tracking-widest block font-bold mb-1">
          CHALLENGE PARAMETER:
        </span>
        <p className="text-sm md:text-base font-semibold text-slate-200">
          {puzzle.question}
        </p>
      </div>

      {/* If Puzzle is Already Solved */}
      {puzzle.isSolved ? (
        <div className="space-y-4">
          <div className="p-4 rounded bg-emerald-950/70 border border-emerald-500/80 text-emerald-200 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-base md:text-lg">
              <CheckCircle2 className="w-6 h-6 animate-pulse" />
              <span>{room.solvedText}</span>
            </div>
            <p className="text-xs text-emerald-300/80 font-sans">
              Access granted. Security locks disengaged. The corridor ahead is clear.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onProceed();
            }}
            className="w-full py-3.5 px-4 rounded bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition transform active:scale-98 cursor-pointer"
          >
            <span>PROCEED TO NEXT CHAMBER</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        /* Puzzle Input Area & Keypad */
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <div className="relative">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value.toUpperCase())}
                  onKeyDown={handleKeyDown}
                  placeholder={puzzle.placeholder}
                  className="w-full bg-slate-900/90 border-2 border-cyan-500/80 focus:border-cyan-400 focus:outline-hidden rounded px-4 py-3 text-center text-xl md:text-2xl font-bold tracking-widest text-cyan-300 placeholder-slate-600 uppercase shadow-inner"
                  autoFocus
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {inputVal && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="p-1 text-slate-500 hover:text-slate-300"
                      title="Clear Input"
                    >
                      <Delete className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Numeric Keypad for convenience on touch or fast entry */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="py-2.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500 text-slate-200 hover:text-cyan-300 text-lg font-bold transition active:bg-cyan-900/50"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="py-2 rounded bg-slate-900 hover:bg-red-950/60 border border-slate-800 text-red-400 text-xs font-bold transition"
              >
                CLR
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="py-2.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500 text-slate-200 hover:text-cyan-300 text-lg font-bold transition active:bg-cyan-900/50"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="py-2 rounded bg-slate-900 hover:bg-amber-950/60 border border-slate-800 text-amber-400 text-xs font-bold flex items-center justify-center transition"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>

            {/* Submit and Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <button
                type="submit"
                className="py-3 px-4 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs md:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md shadow-cyan-950/50 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                TRANSMIT PASSCODE
              </button>

              <button
                type="button"
                onClick={onRequestHint}
                className="py-3 px-4 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 hover:text-amber-200 text-xs md:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>REQUEST HINT ({puzzle.hints.length - puzzle.currentHintIndex} LEFT)</span>
              </button>
            </div>
          </form>

          {/* Feedback & Status Message */}
          {feedbackMessage && (
            <div
              className={`p-3 rounded border text-xs md:text-sm flex items-center gap-2 font-mono ${
                isSuccess
                  ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                  : 'bg-red-950/80 border-red-600 text-red-300 animate-shake'
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{feedbackMessage}</span>
            </div>
          )}

          {/* Hint Display Area */}
          {puzzle.currentHintIndex > 0 && (
            <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded space-y-1">
              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">
                INTELLIGENCE HINT (STAGE {puzzle.currentHintIndex}/{puzzle.hints.length}):
              </span>
              <p className="text-amber-200 text-xs md:text-sm leading-relaxed">
                {puzzle.hints[puzzle.currentHintIndex - 1]}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
