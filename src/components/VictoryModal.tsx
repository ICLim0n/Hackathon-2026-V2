import React from 'react';
import { Game } from '../game/Game';
import {
  Trophy,
  Diamond,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Clock,
  HelpCircle,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { sound } from '../game/audio';

interface VictoryModalProps {
  game: Game;
  onPlayAgain: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ game, onPlayAgain }) => {
  const totalMinutes = Math.floor(game.totalTimeElapsed / 60);
  const totalSeconds = game.totalTimeElapsed % 60;
  const timeFormatted = `${totalMinutes}m ${totalSeconds}s`;

  // Calculate Operative Rank
  let rank = 'S-TIER MASTER INFILTRATOR';
  let rankColor = 'text-yellow-400 border-yellow-500/80 bg-yellow-950/40';
  if (game.hintsUsed > 3 || game.totalTimeElapsed > 360) {
    rank = 'A-TIER SENIOR OPERATIVE';
    rankColor = 'text-cyan-400 border-cyan-500/80 bg-cyan-950/40';
  } else if (game.hintsUsed > 6) {
    rank = 'B-TIER FIELD SPECIALIST';
    rankColor = 'text-emerald-400 border-emerald-500/80 bg-emerald-950/40';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border-2 border-cyan-500 rounded-xl shadow-2xl max-w-lg w-full p-6 text-slate-100 text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Diamond Trophy Graphic */}
        <div className="relative mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-b from-cyan-500 to-blue-700 p-0.5 shadow-lg shadow-cyan-500/40 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
            <Diamond className="w-10 h-10 text-cyan-300 animate-pulse" />
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest bg-cyan-950 text-cyan-400 border border-cyan-700 inline-block mb-2">
          MISSION ACCOMPLISHED // HEIST COMPLETE
        </span>

        <h2 className="text-2xl md:text-3xl font-bold font-mono text-white mb-2">
          THE VAULT IS CRACKED!
        </h2>

        <p className="text-slate-300 text-sm mb-5 leading-relaxed font-sans">
          You breached all 5 security perimeters, decrypted the binary masterpiece, solved the library cipher, calculated the safe logic, and unlocked the Central Vault Sanctuary. The 100-carat Solstice Diamond is securely in your hands!
        </p>

        {/* Infiltration Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-5 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-left font-mono">
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> ROOMS
            </span>
            <span className="text-base font-bold text-emerald-400">5 / 5</span>
          </div>

          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" /> TOTAL TIME
            </span>
            <span className="text-base font-bold text-cyan-300">{timeFormatted}</span>
          </div>

          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-amber-400" /> HINTS USED
            </span>
            <span className="text-base font-bold text-amber-300">{game.hintsUsed}</span>
          </div>
        </div>

        {/* Assigned Rank Badge */}
        <div className={`p-3 rounded-lg border mb-6 text-center font-mono ${rankColor}`}>
          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-widest mb-0.5">
            OPERATIVE CLEARANCE AWARDED:
          </span>
          <span className="text-sm md:text-base font-bold tracking-wide flex items-center justify-center gap-1.5">
            <Award className="w-4 h-4" />
            {rank}
          </span>
        </div>

        {/* Play Again Button */}
        <button
          onClick={() => {
            sound.playClick();
            onPlayAgain();
          }}
          className="w-full py-3.5 px-6 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/50 transition cursor-pointer transform active:scale-98"
        >
          <RotateCcw className="w-4 h-4" />
          <span>INFILTRATE AGAIN (NEW SEED)</span>
        </button>
      </div>
    </div>
  );
};
