import React from 'react';
import { Game } from '../game/Game';
import {
  ShieldAlert,
  Clock,
  RotateCcw,
  Volume2,
  VolumeX,
  Timer,
  TimerOff,
  HelpCircle,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../game/audio';

interface TerminalHeaderProps {
  game: Game;
  onRestartRoom: () => void;
  onRestartGame: () => void;
  onToggleSound: () => void;
  onToggleTimer: () => void;
  isMuted: boolean;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  game,
  onRestartRoom,
  onRestartGame,
  onToggleSound,
  onToggleTimer,
  isMuted,
}) => {
  const currentRoom = game.getCurrentRoom();
  const time = game.timeRemaining;
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeCritical = game.isTimerEnabled && time <= 20;

  return (
    <header className="bg-slate-950 border-b border-cyan-900/50 shadow-lg text-slate-100 p-3 md:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Title & Heist Status */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-cyan-500 font-mono font-semibold">
                INFILTRATION HUD // V.4.2
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-mono rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                ACTIVE BREACH
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-bold font-mono tracking-tight text-slate-100 flex items-center gap-2">
              OPERATION: RED DIAMOND
            </h1>
          </div>
        </div>

        {/* Room Progress Bar (5 stages) */}
        <div className="flex flex-col items-center justify-center flex-1 max-w-md mx-auto w-full px-2">
          <div className="flex items-center justify-between w-full text-[11px] font-mono text-slate-400 mb-1">
            <span>STAGE PROGRESS</span>
            <span className="text-cyan-400 font-bold">
              ROOM {game.currentRoomIndex + 1} OF {game.totalRooms}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 w-full">
            {game.rooms.map((room, idx) => {
              const isPast = idx < game.currentRoomIndex;
              const isCurrent = idx === game.currentRoomIndex;
              const isSolved = room.puzzle.isSolved;

              return (
                <div key={room.id} className="flex flex-col items-center">
                  <div
                    className={`h-2.5 w-full rounded-sm transition-all duration-300 ${
                      isPast || (isCurrent && isSolved)
                        ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                        : isCurrent
                        ? 'bg-cyan-500 animate-pulse shadow-sm shadow-cyan-500/50'
                        : 'bg-slate-800 border border-slate-700'
                    }`}
                  />
                  <span
                    className={`text-[9px] font-mono mt-1 truncate ${
                      isCurrent ? 'text-cyan-300 font-bold' : isPast ? 'text-emerald-400' : 'text-slate-600'
                    }`}
                  >
                    R{idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          {/* Optional five-minute countdown */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded border font-mono font-bold transition-colors ${
              isTimeCritical
                ? 'bg-red-950/80 border-red-600 text-red-400 animate-bounce'
                : 'bg-slate-900 border-cyan-800/80 text-cyan-300'
            }`}
            title={game.isTimerEnabled ? 'Five minutes remaining in this chamber' : 'Optional timer is off'}
            aria-live="polite"
          >
            {game.isTimerEnabled ? (
              <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-red-400 animate-spin' : 'text-cyan-400'}`} />
            ) : (
              <TimerOff className="w-4 h-4 text-slate-400" />
            )}
            <span className="text-sm tracking-wider">
              {game.isTimerEnabled ? formattedTime : 'TIMER OFF'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleTimer}
              className={`flex items-center gap-1.5 rounded border px-2.5 py-1.5 text-xs font-mono transition ${
                game.isTimerEnabled
                  ? 'border-amber-700 bg-amber-950/60 text-amber-300 hover:bg-amber-900/70'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-600 hover:text-cyan-300'
              }`}
              title={game.isTimerEnabled ? 'Turn off the five-minute chamber timer' : 'Turn on the five-minute chamber timer'}
              aria-pressed={game.isTimerEnabled}
            >
              {game.isTimerEnabled ? <TimerOff className="h-4 w-4" /> : <Timer className="h-4 w-4" />}
              <span>{game.isTimerEnabled ? 'TIMER ON' : '5 MIN TIMER'}</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              className="p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-400 transition"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Restart Room */}
            <button
              onClick={onRestartRoom}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-400 text-xs font-mono transition"
              title="Reset current room timer and puzzle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">RESET ROOM</span>
            </button>

            {/* Restart Full Heist */}
            <button
              onClick={onRestartGame}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-red-950/50 hover:bg-red-900/60 border border-red-800/70 text-red-300 text-xs font-mono transition"
              title="Restart entire infiltration from Room 1"
            >
              <span className="hidden sm:inline">ABORT HEIST</span>
              <span className="sm:hidden">RESET</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
