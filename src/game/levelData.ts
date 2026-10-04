import { Item } from './Item';
import { Puzzle } from './Puzzle';
import { Room } from './Room';

/**
 * Generates a random integer between min and max inclusive.
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Creates the complete set of 5 rooms for the heist game.
 * Uses procedural clue generation for the Security Office to ensure
 * fresh replayability while keeping puzzles accessible and deterministic per run.
 */
export function createHeistRooms(): Room[] {
  // === ROOM 1: SECURITY OFFICE ===
  // Generate 4 digits that the player must discover by searching objects
  const d1 = randomInt(2, 8);
  const d2 = randomInt(1, 9);
  const d3 = randomInt(0, 7);
  const d4 = randomInt(3, 9);
  const room1Code = `${d1}${d2}${d3}${d4}`;

  // Tools for Room 1
  const uvFlashlight = new Item(
    'UV Blacklight Flashlight',
    'A tactical ultraviolet torch. Reveals invisible fluorescent ink markings left by security staff.',
    true,
    'Flashlight',
    'uv-light',
    { revealedClues: ['KEYPAD_INK', 'NOTE_INK'] }
  );

  const securityKeycard = new Item(
    'Guard ID Badge',
    'A Level-1 security credential left on the coffee table. Displays guard identification numbers.',
    true,
    'KeyRound',
    'scratchpad'
  );

  const room1 = new Room(
    1,
    'Security Office',
    'You slip past the outer cameras into the guard command station. Monitors hum with static and glowing status boards. The main security door is locked with a 4-digit biometric terminal. Search the office to piece together the lockout digits.',
    [uvFlashlight, securityKeycard],
    new Puzzle(
      'ENTER 4-DIGIT SECURITY OFFICE PASSCODE',
      room1Code,
      'Search the 4 objects around the office (Sticky Note, Badge, Whiteboard, and Server). Each contains one digit.',
      [
        'Check the Sticky Note by the monitor for Digit #1.',
        `Clue summary: Digit 1 is ${d1}, Digit 2 is ${d2}. Check the whiteboard and terminal for 3 and 4!`,
        `The complete 4-digit code is: ${room1Code}`,
      ],
      'code',
      '4-DIGIT PIN'
    ),
    120, // 2 minutes
    'emerald',
    [
      {
        id: 'desk_note',
        name: 'Desk Sticky Note',
        description: 'A yellow post-it note stuck to the corner of the primary CRT monitor.',
        clue: `[DIGIT #1]: Written in blue ink: "Sector 1 camera count is ${d1}."`,
        iconName: 'StickyNote',
        interactionType: 'inspect',
      },
      {
        id: 'guard_badge',
        name: 'Guard ID Lanyard',
        description: 'A plastic badge belonging to Sergeant Miller resting beside a lukewarm coffee mug.',
        clue: `[DIGIT #2]: The clearance tier stamped on the badge is clearly Level-${d2}.`,
        iconName: 'ShieldCheck',
        interactionType: 'inspect',
      },
      {
        id: 'whiteboard',
        name: 'Shift Whiteboard',
        description: 'A dry-erase board tracking guard patrols and station rotations.',
        clue: `[DIGIT #3]: In red marker: "Midnight patrol sweeps: ${d3} sweeps scheduled."`,
        iconName: 'FileSpreadsheet',
        interactionType: 'inspect',
      },
      {
        id: 'server_terminal',
        name: 'Rack Terminal',
        description: 'A flickering green-phosphor diagnostic terminal hooked into the local subnet.',
        clue: `[DIGIT #4]: Firewall diagnostic log reports: "Port offset suffix value = [ ${d4} ]."`,
        iconName: 'Server',
        interactionType: 'inspect',
      },
      {
        id: 'locker',
        name: 'Security Locker 104',
        description: 'A metal utility locker with a magnetic latch.',
        clue: 'Inside the locker sits a tactical UV blacklight torch left by the night guard.',
        iconName: 'Archive',
        hiddenItem: uvFlashlight,
        interactionType: 'inspect',
      },
    ],
    'SECURITY GATE UNLOCKED. PROCEEDING TO ART GALLERY CORRIDOR.'
  );

  // === ROOM 2: THE ART GALLERY (Binary Painting) ===
  // Stage 2 requirement: "Stage 2 should be a large painting on a wall with text in binary that, when decrypted, reveals the final digit of the security code."
  // Binary string representing a 4-digit passcode, e.g. 5, 2, 8, 4 -> binary 0101, 0010, 1000, 0100
  // Or ASCII / decimal binary riddle. Let's make it 4 bytes or clean 4 nibbles:
  // e.g. binary bytes:
  // '5' = 00110101 (or nibble 0101 = 5)
  // '9' = 00111001 (or nibble 1001 = 9)
  // '2' = 00110010 (or nibble 0010 = 2)
  // '7' = 00110111 (or nibble 0111 = 7)
  // Clean decimal values: 5, 9, 2, 7 -> code "5927"
  const room2Code = '5927';

  const binaryDatapad = new Item(
    'Binary Translation Guide',
    'A hacker’s reference cheat-sheet detailing 8-bit ASCII and 4-bit binary values for digits 0-9.',
    true,
    'Binary',
    'binary-decoder',
    {
      table: [
        { char: '0', bin: '0000', ascii: '00110000' },
        { char: '1', bin: '0001', ascii: '00110001' },
        { char: '2', bin: '0010', ascii: '00110010' },
        { char: '3', bin: '0011', ascii: '00110011' },
        { char: '4', bin: '0100', ascii: '00110100' },
        { char: '5', bin: '0101', ascii: '00110101' },
        { char: '6', bin: '0110', ascii: '00110110' },
        { char: '7', bin: '0111', ascii: '00110111' },
        { char: '8', bin: '1000', ascii: '00111000' },
        { char: '9', bin: '1001', ascii: '00111001' },
      ],
    }
  );

  const room2 = new Room(
    2,
    'The Private Art Gallery',
    'A lavish marble corridor lined with modern oil paintings. An infrared laser tripwire spans the doorway ahead. Dominating the north wall is a massive abstract painting with four distinct bands of binary glyphs glowing beneath the lacquer.',
    [binaryDatapad],
    new Puzzle(
      'DECRYPT THE BINARY PAINTING CODE',
      room2Code,
      'Inspect the large painting. Convert the four 4-bit binary bands (0101, 1001, 0010, 0111) into numbers.',
      [
        'Binary place values for 4 bits are 8, 4, 2, 1.',
        'First band: 0101 = 4 + 1 = 5. Second band: 1001 = 8 + 1 = 9.',
        'Third band: 0010 = 2. Fourth band: 0111 = 4 + 2 + 1 = 7. The code is 5927.',
      ],
      'code',
      '4-DIGIT PIN'
    ),
    110,
    'purple',
    [
      {
        id: 'large_painting',
        name: 'Abstract Oil Painting: "The Binary Dawn"',
        description: 'An expansive modern masterpiece. Hidden in its gold-leaf brushstrokes are four painted binary sequences.',
        clue: 'Painted along the four color bands:\nBand I (Crimson): 0101\nBand II (Gold): 1001\nBand III (Cobalt): 0010\nBand IV (Silver): 0111\n\nDecode each 4-bit value to discover the security code!',
        iconName: 'Palette',
        interactionType: 'painting',
        extraData: {
          binaryData: [
            { band: 'I. Crimson Horizon', binary: '0101', value: '5' },
            { band: 'II. Golden Zenith', binary: '1001', value: '9' },
            { band: 'III. Cobalt Abyss', binary: '0010', value: '2' },
            { band: 'IV. Silver Meridian', binary: '0111', value: '7' },
          ],
        },
      },
      {
        id: 'gallery_plaque',
        name: 'Brass Museum Plaque',
        description: 'An engraved plaque detailing the painting’s origin and cipher theme.',
        clue: '"The artist was a retired cryptography engineer. He hid his four favorite numbers into binary nibbles: (8·4·2·1)."',
        iconName: 'Info',
        interactionType: 'inspect',
      },
      {
        id: 'laser_emitter',
        name: 'Laser Barrier Console',
        description: 'The laser tripwire emitter humming softly beside the gallery exit door.',
        clue: 'Terminal reads: "LASER EMITTER ONLINE. Enter the 4-digit decrypted sequence from Painting #2 to disengage."',
        iconName: 'Zap',
        interactionType: 'inspect',
      },
      {
        id: 'benches',
        name: 'Velvet Viewing Bench',
        description: 'A plush burgundy bench for museum patrons.',
        clue: 'Tucked beneath the velvet cushion is a Binary Translation Guide.',
        iconName: 'Bookmark',
        hiddenItem: binaryDatapad,
        interactionType: 'inspect',
      },
    ],
    'LASER TRIPWIRES DISABLED. THE CORRIDOR PATH CLEARS.'
  );

  // === ROOM 3: THE EXECUTIVE LIBRARY (Bookshelf Cipher) ===
  // Requirement: "Stage 3 should consist of a bookshelf with clickable books that create a simple cipher puzzle and should decode to a short fictional password. Keep the puzzle understandable."
  // Short fictional password: "PHANTOM" or "CIPHER" or "SHADOW"
  // Let's use "CIPHER" or "PHANTOM". "CIPHER" is 6 letters:
  // C - Chronology of Heists
  // I - Invisible Hands
  // P - Protocols of Deception
  // H - Hidden Vaults
  // E - Escape Velocity
  // R - Rogue Operatives
  // Clicking the books pulls them forward. When clicked, each book displays its title and spine initial!
  // A carved riddle above the shelf: "Pull the books in numerical order of their shelf volume numbers (1 to 6) to read the secret syndicate passphrase."
  const room3Password = 'CIPHER';

  const cipherTool = new Item(
    'Cipher Indexing Guide',
    'A book collector’s bookmark listing spine letter acronym rules and Caesar shift references.',
    true,
    'BookOpen',
    'cipher-tool'
  );

  const room3 = new Room(
    3,
    'The Executive Library',
    'Soaring dark oak shelves stretch to the ceiling, filled with leather-bound tomes. A brass keypad by the secret elevator door asks for an alphabetical passkey. The central bookcase contains a series of numbered collector volumes that can be clicked and inspected.',
    [cipherTool],
    new Puzzle(
      'ENTER THE 6-LETTER BOOKSHELF PASSPHRASE',
      room3Password,
      'Click and inspect the books on the shelf. Read the first letter of each book title in order of Volume I to VI.',
      [
        'Look at Volume I: "Chronology..." (C), Volume II: "Invisible..." (I).',
        'Continue with Volumes III (P), IV (H), V (E), and VI (R).',
        `The fictional password formed by the first letters is "${room3Password}".`,
      ],
      'text',
      '6-LETTER WORD'
    ),
    100,
    'amber',
    [
      {
        id: 'bookshelf_unit',
        name: 'The Mastermind’s Bookshelf',
        description: 'A heavy mahogany bookcase holding rare first-edition syndicate volumes.',
        clue: 'An engraved brass label reads: "The syndicate password is found by reading the first letters of Volumes I through VI in order."',
        iconName: 'Library',
        interactionType: 'bookshelf',
        extraData: {
          books: [
            { vol: 'I', title: 'Chronology of Heists', letter: 'C', color: 'bg-red-900 border-red-700' },
            { vol: 'II', title: 'Invisible Infiltration', letter: 'I', color: 'bg-blue-900 border-blue-700' },
            { vol: 'III', title: 'Protocols of Deception', letter: 'P', color: 'bg-purple-900 border-purple-700' },
            { vol: 'IV', title: 'Hidden Fortresses', letter: 'H', color: 'bg-emerald-900 border-emerald-700' },
            { vol: 'V', title: 'Escape Velocity', letter: 'E', color: 'bg-amber-900 border-amber-700' },
            { vol: 'VI', title: 'Rogue Operatives', letter: 'R', color: 'bg-slate-800 border-slate-600' },
          ],
        },
      },
      {
        id: 'library_desk',
        name: 'Reading Bureau Desk',
        description: 'An antique roll-top desk with a green banker’s lamp.',
        clue: 'A handwritten librarian slip reads: "Password length: 6 uppercase letters. Formed by pulling the numbered volumes in sequence."',
        iconName: 'LampDesk',
        hiddenItem: cipherTool,
        interactionType: 'inspect',
      },
      {
        id: 'secret_elevator',
        name: 'Concealed Elevator Gate',
        description: 'A steel lattice elevator door concealed behind a false bookshelf panel.',
        clue: 'Terminal prompt: "ENTER ALPHABETIC OVERRIDE PASSPHRASE TO SUMMON ELEVATOR TO SAFE ROOM."',
        iconName: 'DoorClosed',
        interactionType: 'inspect',
      },
    ],
    'BOOKSHELF MECHANISM RETRACTS. SECRET ELEVATOR OPEN.'
  );

  // === ROOM 4: THE SAFE ROOM (Notepad Clues) ===
  // Requirement: "Stage 4 should be the last room, the safe room. It should contain a notepad to the side that has a series of clues which help the player identify the final four digit combination."
  // Notepad logic problem:
  // Clue 1: The code has 4 distinct digits ABCD.
  // Clue 2: The first digit (A) is an odd prime between 2 and 5 (A = 3).
  // Clue 3: The second digit (B) is double the first digit (B = 2 * 3 = 6).
  // Clue 4: The third digit (C) is the first digit minus 2 (C = 3 - 2 = 1).
  // Clue 5: The fourth digit (D) is the sum of Digit A and Digit C (D = 3 + 1 = 4).
  // Code = 3614
  const room4Code = '3614';

  const scratchpadTool = new Item(
    'Tactical Deduction Pad & Stylus',
    'A handy digital scratchpad for writing down equation notes and test combinations.',
    true,
    'FileEdit',
    'scratchpad'
  );

  const room4 = new Room(
    4,
    'The Safe Room Antechamber',
    'The elevator delivers you into the reinforced safe room. Tremendous titanium blast doors loom ahead. On a side table sits an illuminated yellow notepad filled with the chief security engineer’s handwritten combination logic clues.',
    [scratchpadTool],
    new Puzzle(
      'ENTER 4-DIGIT COMBINATION FROM NOTEPAD CLUES',
      room4Code,
      'Read the notepad on the side table carefully. Follow each clue step by step to deduce A, B, C, and D.',
      [
        'Clue 2 gives A: An odd prime between 2 and 5 is 3. So A = 3.',
        'Clue 3 gives B: Double of 3 is 6. Clue 4 gives C: 3 - 2 = 1.',
        `Clue 5 gives D: 3 + 1 = 4. The combination is ${room4Code}.`,
      ],
      'combination',
      '4-DIGIT COMBINATION'
    ),
    90,
    'amber',
    [
      {
        id: 'notepad_table',
        name: 'Engineer’s Yellow Notepad',
        description: 'A ruled notepad with neat handwritten pencil notes titled "VAULT LOCK CODE LOGIC".',
        clue: `[HANDWRITTEN SAFE ROOM NOTES]:\n1. Combination is 4 distinct digits: [ A ][ B ][ C ][ D ]\n2. Digit A is an odd prime number between 2 and 5.\n3. Digit B is exactly double Digit A (B = 2 × A).\n4. Digit C is Digit A minus 2 (C = A - 2).\n5. Digit D is the sum of Digit A and Digit C (D = A + C).`,
        iconName: 'FileText',
        interactionType: 'notepad',
        extraData: {
          notes: [
            '• The safe lock combination consists of 4 distinct digits: [ A ][ B ][ C ][ D ]',
            '• Digit A: An odd prime number strictly between 2 and 5 (hint: 3).',
            '• Digit B: Twice the first digit (B = 2 × A).',
            '• Digit C: The first digit minus 2 (C = A - 2).',
            '• Digit D: The sum of Digit A and Digit C (D = A + C).',
          ],
        },
      },
      {
        id: 'safe_dial_console',
        name: 'Reinforced Safe Door Dial',
        description: 'A heavy mechanical and electronic dial bolted to the blast door.',
        clue: 'Enter the 4-digit sequence deduced from the engineer’s notepad into the terminal below.',
        iconName: 'Lock',
        interactionType: 'inspect',
      },
      {
        id: 'side_credenza',
        name: 'Steel Credenza Drawer',
        description: 'A small steel utility drawer under the notepad desk.',
        clue: 'Inside you find a Tactical Deduction Pad & Stylus to help you work out the math.',
        iconName: 'Folder',
        hiddenItem: scratchpadTool,
        interactionType: 'inspect',
      },
    ],
    'PNEUMATIC BLAST BOLTS DISENGAGED. MAIN VAULT DOOR SWINGS OPEN!'
  );

  // === ROOM 5: THE INNER VAULT (Treasure Chamber) ===
  // Room 5 is the final room: The Inner Vault Chamber containing the desired "treasure"
  // Requirement:
  // "There are 5 rooms for the player to get through in order to reach the desired 'treasure'."
  // "victory screen after opening the vault"
  // The final lock securing the Crown Diamond pedestal:
  // Riddle on the vault lock pedestal:
  // "I have no voice, but I can tell you secrets. I have no spine, but I hold thousands of pages.
  // When turned backwards, I seal what is inside. What 4-digit emergency override opens the vault?"
  // Or: "The Syndicate Master Key: Count the corners of the vault vault door:
  // Tumbler 1: Total rooms breached to reach the vault (4)
  // Tumbler 2: Number of digits in each room's passcode (4)
  // Tumbler 3: Number of corners on the diamond's display pedestal (8)
  // Tumbler 4: Number of laser emitters guarding the jewel (8)
  // Code: 4488!
  const room5Code = '4488';

  const stethoscope = new Item(
    'Acoustic Lockpick Stethoscope',
    'A precision acoustic listening device used by master safe crackers to hear mechanical tumbler clicks.',
    true,
    'Headphones',
    'stethoscope'
  );

  const room5 = new Room(
    5,
    'The Central Vault Sanctuary',
    'The heavy blast door hisses open. Steam vents into the refrigerated chamber. At the center of the reinforced steel room, bathed in warm spotlights atop a floating titanium pedestal, rests the legendary 100-carat "Heart of the Syndicate" Diamond. One final rotary tumbler lock seals the diamond showcase.',
    [stethoscope],
    new Puzzle(
      'CRACK THE FINAL VAULT ROTARY TUMBLER',
      room5Code,
      'Inspect the diamond pedestal lock mechanism. Read the four tumbler calibration riddles.',
      [
        'Tumbler 1 is the number of rooms you successfully breached to reach here: 4.',
        'Tumbler 2 is the standard code length used in the security offices: 4.',
        `Tumbler 3 and 4 are the octagonal pedestal facet counts: 8 and 8. Master code is ${room5Code}.`,
      ],
      'code',
      '4-DIGIT MASTER CODE'
    ),
    90,
    'rose',
    [
      {
        id: 'diamond_pedestal',
        name: 'The Crown Diamond Pedestal',
        description: 'A reinforced bulletproof glass dome shielding the radiant 100-carat blue diamond.',
        clue: `[FINAL VAULT ROTARY LOCK SPECS]:\n• Tumbler 1: The count of rooms you bypassed to reach this sanctuary (4)\n• Tumbler 2: The number of digits required in the security checkpoint (4)\n• Tumbler 3: The number of facets on an octagon pedestal (8)\n• Tumbler 4: The number of laser nodes surrounding the diamond case (8)\n\nEnter the 4 tumblers to unlock the showcase!`,
        iconName: 'Diamond',
        interactionType: 'vault-tumbler',
        extraData: {
          tumblers: [
            { label: 'Breached Rooms', val: '4' },
            { label: 'Security Digits', val: '4' },
            { label: 'Pedestal Facets', val: '8' },
            { label: 'Perimeter Lasers', val: '8' },
          ],
        },
      },
      {
        id: 'vault_mechanism',
        name: 'Tumbler Gear Housing',
        description: 'Exposed brass and chrome gears ticking smoothly behind a transparent pane.',
        clue: 'A stethoscope can be used to listen to the lock tumblers as they fall into position.',
        iconName: 'Cog',
        interactionType: 'inspect',
      },
      {
        id: 'equipment_case',
        name: 'Master Safecracker Case',
        description: 'An open pelican case on the floor left by an earlier syndicate scout.',
        clue: 'Inside is an Acoustic Lockpick Stethoscope.',
        iconName: 'Briefcase',
        hiddenItem: stethoscope,
        interactionType: 'inspect',
      },
    ],
    'VAULT CYLINDER UNLOCKED! THE DIAMOND IS YOURS!'
  );

  return [room1, room2, room3, room4, room5];
}
