import React from 'react';
import { Game } from '../game/Game';
import { AlertOctagon, RotateCcw, ShieldAlert, ArrowLeft } from 'lucide-react';
import { sound } from '../game/audio';

interface GameOverModalProps {
  game: Game;
  onRetryRoom: () => void;
  onRestartFull: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  game,
  onRetryRoom,
  onRestartFull,
}) => {
  const failedAttempts = game.gameOverReason === 'failed-attempts';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-red-600 rounded-xl shadow-2xl max-w-md w-full p-6 text-slate-100 text-center font-mono">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-900/60 border border-red-500 flex items-center justify-center text-red-400">
          <AlertOctagon className="w-8 h-8 animate-bounce" />
        </div>

        <span className="px-3 py-1 rounded text-xs uppercase font-bold tracking-widest bg-red-950 text-red-400 border border-red-800 inline-block mb-2">
          FACILITY LOCKDOWN TRIGGERED
        </span>

        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          {failedAttempts ? 'TOO MANY INVALID ATTEMPTS' : 'TIME LIMIT EXPIRED'}
        </h2>

        <p className="text-slate-300 text-xs md:text-sm font-sans mb-6 leading-relaxed">
          {failedAttempts
            ? <>Three incorrect answers triggered a security lockdown in </>
            : <>The security guard sweep caught movement on thermal sensors in </>}
          <span className="text-cyan-400 font-bold">{game.getCurrentRoom().name}</span>
          {failedAttempts
            ? '. Restart this chamber to reset your attempts and try again.'
            : '. The blast doors sealed shut.'}
        </p>

        <div className="space-y-2.5">
          <button
            onClick={() => {
              sound.playClick();
              onRetryRoom();
            }}
            className="w-full py-3 px-4 rounded bg-red-600 hover:bg-red-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RETRY CURRENT CHAMBER</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onRestartFull();
            }}
            className="w-full py-2.5 px-4 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RESTART ENTIRE HEIST</span>
          </button>
        </div>
      </div>
    </div>
  );
};
