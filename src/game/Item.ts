/**
 * Item Class
 * Represents an item or tool in the escape room heist.
 * Items can be found in rooms, collected into the player's inventory,
 * and inspected or activated to assist in puzzle solving.
 */
export class Item {
  name: string;
  description: string;
  canBeCollected: boolean;
  isCollected: boolean;
  iconName: string;
  toolType?: 'uv-light' | 'binary-decoder' | 'cipher-tool' | 'scratchpad' | 'stethoscope' | 'ssh-guide';
  toolData?: Record<string, any>;

  constructor(
    name: string,
    description: string,
    canBeCollected: boolean = true,
    iconName: string = 'Box',
    toolType?: 'uv-light' | 'binary-decoder' | 'cipher-tool' | 'scratchpad' | 'stethoscope' | 'ssh-guide',
    toolData?: Record<string, any>
  ) {
    this.name = name;
    this.description = description;
    this.canBeCollected = canBeCollected;
    this.isCollected = false;
    this.iconName = iconName;
    this.toolType = toolType;
    this.toolData = toolData;
  }

  /**
   * Collects the item if collectible.
   */
  collect(): boolean {
    if (this.canBeCollected && !this.isCollected) {
      this.isCollected = true;
      return true;
    }
    return false;
  }
}
