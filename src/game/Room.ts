import { Item } from './Item';
import { Puzzle } from './Puzzle';

export interface InteractiveObject {
  id: string;
  name: string;
  description: string;
  clue?: string;
  revealedText?: string;
  iconName?: string;
  requiresItem?: string; // item required to fully inspect/reveal, or item that enhances it
  hiddenItem?: Item; // item found upon interacting
  interactionType?: 'inspect' | 'bookshelf' | 'painting' | 'notepad' | 'vault-tumbler' | 'keypad' | 'firewall-trap' | 'awareness-drill';
  extraData?: Record<string, any>;
  hasBeenInteracted?: boolean;
}

/**
 * Room Class
 * Represents a single stage/chamber in the heist.
 * Contains name, narrative description, collectible/assistive items,
 * interactive objects for searching clues, and the gate puzzle.
 */
export class Room {
  id: number;
  name: string;
  description: string;
  items: Item[]; // items present or available in this room
  puzzle: Puzzle;
  timeLimit: number; // in seconds
  themeColor: string; // for UI badge/styling accent
  interactiveObjects: InteractiveObject[];
  solvedText: string;
  resetCount: number;

  constructor(
    id: number,
    name: string,
    description: string,
    items: Item[],
    puzzle: Puzzle,
    timeLimit: number = 90,
    themeColor: string = 'cyan',
    interactiveObjects: InteractiveObject[] = [],
    solvedText: string = 'SECURITY LOCK OVERRIDDEN. ACCESS GRANTED.'
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.items = items;
    this.puzzle = puzzle;
    this.timeLimit = timeLimit;
    this.themeColor = themeColor;
    this.interactiveObjects = interactiveObjects;
    this.solvedText = solvedText;
    this.resetCount = 0;
  }

  /**
   * Resets room state (puzzle and interactive objects) on stage restart.
   */
  reset(): void {
    this.resetCount++;
    this.puzzle.reset();
    for (const obj of this.interactiveObjects) {
      obj.hasBeenInteracted = false;
      if (obj.hiddenItem) {
        obj.hiddenItem.isCollected = false;
      }
    }
  }

  /**
   * Checks if all required conditions to advance from this room are met.
   */
  canProceed(): boolean {
    return this.puzzle.isSolved;
  }
}
