import { createHeistRooms } from './levelData';
import { Inventory } from './Inventory';
import { Item } from './Item';
import { Room } from './Room';
import { sound } from './audio';

export type GameListener = () => void;

/**
 * Game Class
 * Master controller for the Heist Escape Room game.
 * Manages game state, active room progression, inventory, timer,
 * puzzle verification, scoring, and event notifications.
 */
export class Game {
  rooms: Room[];
  currentRoomIndex: number;
  inventory: Inventory;
  timeRemaining: number;
  isGameOver: boolean;
  isVictory: boolean;
  isPaused: boolean;
  hintsUsed: number;
  totalTimeElapsed: number;
  private listeners: GameListener[] = [];
  private timerIntervalId: any = null;

  constructor() {
    this.rooms = createHeistRooms();
    this.currentRoomIndex = 0;
    this.inventory = new Inventory();
    this.timeRemaining = this.rooms[0]?.timeLimit || 90;
    this.isGameOver = false;
    this.isVictory = false;
    this.isPaused = false;
    this.hintsUsed = 0;
    this.totalTimeElapsed = 0;

    // Auto-collect any starting inventory items defined in the first room or default kit
    this.initRoomItems();
  }

  /**
   * Initializes room items or collectible discovery
   */
  private initRoomItems() {
    const room = this.getCurrentRoom();
    if (!room) return;
    // Keep items in room until collected
  }

  /**
   * Subscribes a listener to game state updates
   */
  subscribe(listener: GameListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  /**
   * Returns the currently active Room object.
   */
  getCurrentRoom(): Room {
    return this.rooms[this.currentRoomIndex];
  }

  /**
   * Total number of rooms in the heist.
   */
  get totalRooms(): number {
    return this.rooms.length;
  }

  /**
   * Starts or resumes the room countdown timer.
   */
  startTimer() {
    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
    }

    this.timerIntervalId = setInterval(() => {
      if (this.isPaused || this.isGameOver || this.isVictory) return;

      this.totalTimeElapsed++;
      if (this.timeRemaining > 0) {
        this.timeRemaining--;

        // Warning sound when 10 seconds or less remain
        if (this.timeRemaining <= 10 && this.timeRemaining > 0) {
          sound.playWarningBeep();
        }

        if (this.timeRemaining === 0) {
          this.triggerGameOver('SECURITY PROTOCOL LOCKDOWN: TIME EXPIRED');
        }
      }
      this.notify();
    }, 1000);
  }

  /**
   * Stops the countdown timer.
   */
  stopTimer() {
    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
      this.timerIntervalId = null;
    }
  }

  /**
   * Pauses / unpauses the timer.
   */
  togglePause(): boolean {
    this.isPaused = !this.isPaused;
    this.notify();
    return this.isPaused;
  }

  /**
   * Submits a player's proposed answer for the current room's puzzle.
   */
  submitAnswer(input: string): {
    success: boolean;
    message: string;
    isRoomComplete: boolean;
    isGameVictory: boolean;
  } {
    if (this.isGameOver || this.isVictory) {
      return { success: false, message: 'Game has already ended.', isRoomComplete: false, isGameVictory: false };
    }

    const currentRoom = this.getCurrentRoom();
    if (
      currentRoom.puzzle.requiredItemName &&
      !this.inventory.hasItem(currentRoom.puzzle.requiredItemName)
    ) {
      sound.playError();
      return {
        success: false,
        message: `ACCESS DENIED. FIND THE ${currentRoom.puzzle.requiredItemName.toUpperCase()} FIRST.`,
        isRoomComplete: false,
        isGameVictory: false,
      };
    }

    const isCorrect = currentRoom.puzzle.checkAnswer(input);

    if (isCorrect) {
      // Check if this was the final room (Vault Sanctuary)
      if (this.currentRoomIndex >= this.rooms.length - 1) {
        this.isVictory = true;
        this.stopTimer();
        sound.playVaultUnlock();
        setTimeout(() => sound.playVictory(), 400);
        this.notify();
        return {
          success: true,
          message: currentRoom.solvedText,
          isRoomComplete: true,
          isGameVictory: true,
        };
      } else {
        sound.playSuccess();
        this.notify();
        return {
          success: true,
          message: currentRoom.solvedText,
          isRoomComplete: true,
          isGameVictory: false,
        };
      }
    } else {
      sound.playError();
      this.notify();
      return {
        success: false,
        message: 'ACCESS DENIED. INVALID CREDENTIALS.',
        isRoomComplete: false,
        isGameVictory: false,
      };
    }
  }

  /**
   * Advances to the next room if the current puzzle has been solved.
   */
  advanceToNextRoom(): boolean {
    const currentRoom = this.getCurrentRoom();
    if (!currentRoom.puzzle.isSolved) return false;

    if (this.currentRoomIndex < this.rooms.length - 1) {
      this.currentRoomIndex++;
      const nextRoom = this.getCurrentRoom();
      this.timeRemaining = nextRoom.timeLimit;
      sound.playClick();
      this.notify();
      return true;
    }
    return false;
  }

  /**
   * Requests a hint for the current puzzle.
   */
  requestHint(): { hint: string; remaining: number } {
    const currentRoom = this.getCurrentRoom();
    this.hintsUsed++;
    sound.playClick();
    const hint = currentRoom.puzzle.getNextHint();
    const remaining = currentRoom.puzzle.hints.length - currentRoom.puzzle.currentHintIndex;
    this.notify();
    return { hint, remaining };
  }

  /**
   * Collects an item into the player's inventory.
   */
  collectItem(item: Item): boolean {
    const added = this.inventory.addItem(item);
    if (added) {
      sound.playPickup();
      this.notify();
      return true;
    }
    return false;
  }

  /**
   * Restarts the current room (resets puzzle and timer for this room).
   */
  restartCurrentRoom(): void {
    const currentRoom = this.getCurrentRoom();
    currentRoom.reset();
    this.timeRemaining = currentRoom.timeLimit;
    this.isGameOver = false;
    sound.playClick();
    this.notify();
  }

  /**
   * Restarts the entire heist game from Room 1.
   */
  restartGame(): void {
    this.stopTimer();
    this.rooms = createHeistRooms();
    this.currentRoomIndex = 0;
    this.inventory.clear();
    this.timeRemaining = this.rooms[0].timeLimit;
    this.isGameOver = false;
    this.isVictory = false;
    this.isPaused = false;
    this.hintsUsed = 0;
    this.totalTimeElapsed = 0;
    this.startTimer();
    sound.playClick();
    this.notify();
  }

  /**
   * Triggers game over lockdown when timer expires.
   */
  private triggerGameOver(reason: string): void {
    this.isGameOver = true;
    this.stopTimer();
    sound.playError();
    this.notify();
  }

  /**
   * Cleanup timer on unmount
   */
  destroy(): void {
    this.stopTimer();
    this.listeners = [];
  }
}
