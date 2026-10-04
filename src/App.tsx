/**
 * Heist Breakout: Vault Escape Room
 *
 * Designed for intermediate programmers to easily understand, extend, and modify.
 * Uses clear OOP architecture (Game, Room, Puzzle, Item, Inventory)
 * coupled with a modern, high-contrast security terminal UI.
 */

import React, { useEffect, useState, useMemo } from 'react';
import { Game } from './game/Game';
import { Item } from './game/Item';
import { TerminalHeader } from './components/TerminalHeader';
import { RoomView } from './components/RoomView';
import { InventoryPanel } from './components/InventoryPanel';
import { PuzzleTerminal } from './components/PuzzleTerminal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { sound } from './game/audio';

export default function App() {
  // Instantiate the master Game controller
  const game = useMemo(() => new Game(), []);

  // Reactive state ticker to trigger component updates on Game changes
  const [, setTick] = useState(0);

  // Terminal feedback message (success/failure)
  const [feedback, setFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null);

  // Sound mute state
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // Subscribe to game model events and start the countdown timer
  useEffect(() => {
    const unsubscribe = game.subscribe(() => {
      setTick((t) => t + 1);
    });

    game.startTimer();

    return () => {
      game.stopTimer();
      unsubscribe();
    };
  }, [game]);

  // Current active room
  const currentRoom = game.getCurrentRoom();

  // Handler: Submit passcode/answer
  const handleSubmitAnswer = (answer: string) => {
    const result = game.submitAnswer(answer);
    setFeedback({
      message: result.message,
      isSuccess: result.success,
    });
  };

  // Handler: Request progressive hint
  const handleRequestHint = () => {
    const { hint, remaining } = game.requestHint();
    setFeedback({
      message: `HINT UNLOCKED (${remaining} left): ${hint}`,
      isSuccess: true,
    });
  };

  // Handler: Advance to next room upon solving puzzle
  const handleProceed = () => {
    const advanced = game.advanceToNextRoom();
    if (advanced) {
      setFeedback(null);
    }
  };

  // Handler: Collect discovered tool into inventory
  const handleCollectItem = (item: Item) => {
    game.collectItem(item);
  };

  // Handler: Restart current chamber
  const handleRestartRoom = () => {
    game.restartCurrentRoom();
    setFeedback(null);
  };

  // Handler: Restart entire infiltration heist
  const handleRestartGame = () => {
    game.restartGame();
    setFeedback(null);
  };

  // Handler: Toggle audio
  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Security Terminal Header with HUD & Timer */}
      <TerminalHeader
        game={game}
        onRestartRoom={handleRestartRoom}
        onRestartGame={handleRestartGame}
        onToggleSound={handleToggleSound}
        isMuted={isMuted}
      />

      {/* Main Heist Staging Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Room Narrative, Clickable Objects, and Puzzle Terminal */}
        <section className="lg:col-span-8 space-y-5">
          {/* Room Narrative & Clickable Objects Grid */}
          <RoomView
            room={currentRoom}
            onCollectItem={handleCollectItem}
            hasItemInInventory={(name) => game.inventory.hasItem(name)}
          />

          {/* Electronic Security Input Keypad & Challenge */}
          <PuzzleTerminal
            room={currentRoom}
            onSubmit={handleSubmitAnswer}
            onRequestHint={handleRequestHint}
            onProceed={handleProceed}
            feedbackMessage={feedback?.message || null}
            isSuccess={feedback?.isSuccess ?? null}
          />
        </section>

        {/* Right Column: Operative Inventory Dock & Tool Assistants */}
        <aside className="lg:col-span-4 space-y-4">
          <InventoryPanel
            inventory={game.inventory}
            currentRoomId={currentRoom.id}
          />

          {/* Quick Mission Briefing / Instructions Panel */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-slate-300 font-mono text-xs space-y-2">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
              OPERATIVE FIELD DIRECTIVES:
            </span>
            <ul className="space-y-1.5 text-slate-400 text-[11px] list-disc list-inside">
              <li>Search room objects to gather clues and collectible tools.</li>
              <li>Tools in inventory assist decryption but are completely optional.</li>
              <li>Solve the gate puzzle before the countdown timer expires.</li>
              <li>Crack all 5 security stages to seize the Solstice Diamond!</li>
            </ul>
          </div>
        </aside>
      </main>

      {/* Victory Celebration Modal */}
      {game.isVictory && (
        <VictoryModal game={game} onPlayAgain={handleRestartGame} />
      )}

      {/* Game Over Lockdown Modal (Time Expired) */}
      {game.isGameOver && !game.isVictory && (
        <GameOverModal
          game={game}
          onRetryRoom={handleRestartRoom}
          onRestartFull={handleRestartGame}
        />
      )}
    </div>
  );
}
