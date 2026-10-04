import { Item } from './Item';

/**
 * Inventory Class
 * Manages the player's collected items and tools.
 * Provides helper lookup methods and state management.
 */
export class Inventory {
  private items: Item[];

  constructor(initialItems: Item[] = []) {
    this.items = [...initialItems];
  }

  /**
   * Adds an item to the inventory.
   */
  addItem(item: Item): boolean {
    if (!this.hasItem(item.name)) {
      item.isCollected = true;
      this.items.push(item);
      return true;
    }
    return false;
  }

  /**
   * Checks if an item by name is present in inventory.
   */
  hasItem(name: string): boolean {
    return this.items.some(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
  }

  /**
   * Retrieves an item by name.
   */
  getItem(name: string): Item | undefined {
    return this.items.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
  }

  /**
   * Returns a copy of all current inventory items.
   */
  getItems(): Item[] {
    return [...this.items];
  }

  /**
   * Removes an item by name.
   */
  removeItem(name: string): boolean {
    const index = this.items.findIndex(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Clears inventory for game resets.
   */
  clear(): void {
    this.items = [];
  }
}
