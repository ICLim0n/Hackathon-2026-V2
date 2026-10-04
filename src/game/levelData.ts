import { Item } from './Item';
import { Puzzle } from './Puzzle';
import { Room } from './Room';

/**
 * Generates a random integer between min and max inclusive.
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(values: T[]): T[] {
  for (let index = values.length - 1; index > 0; index--) {
    const swapIndex = randomInt(0, index);
    [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
  }
  return values;
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

  const room1 = new Room(
    1,
    'Security Office',
    'You slip past the outer cameras into the guard command station. Monitors hum with static and glowing status boards. The main security door is locked with a 4-digit biometric terminal. Search the office to piece together the lockout digits.',
    [uvFlashlight],
    new Puzzle(
      'GENERATE THE ONE-TIME PASSWORD (OTP) FROM THE FOUR OFFICE OBJECTS',
      room1Code,
      'Search the Sticky Note, Guard ID Badge, Shift Whiteboard, and Rack Terminal. Read one randomized digit from each object in order to assemble the temporary MFA OTP.',
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
  // Four 4-bit binary bands decode to the laser disarm sequence 5927.
  const room2Code = '5927';
  const room2Options = shuffle([room2Code, '5972', '5297', '9527']);

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
          options: room2Options,
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

  // === ROOM 3: THE ANCIENT LIBRARY (Security Protocols) ===
  const room3Password = '2,8';

  const cipherTool = new Item(
    'Security Protocol Field Guide',
    'A concise reference for independently verifying requests, protecting verification codes, and reporting suspicious messages.',
    true,
    'BookOpen',
    'cipher-tool'
  );

  const room3 = new Room(
    3,
    'The Ancient Library',
    'Dusty stone arches frame towering shelves of ten old volumes. Each book describes a response to a social-engineering attempt; inspect them all and select the two protocols that genuinely protect people and accounts.',
    [cipherTool],
    new Puzzle(
      'SELECT THE TWO REAL SOCIAL-ENGINEERING SAFEGUARDS',
      room3Password,
      'Inspect all ten books and choose the two sound protocols. Submit their volume numbers separated by a comma.',
      [
        'A trustworthy identity check uses a known, independent contact channel—not contact details supplied in a suspicious request.',
        'Never share a one-time verification code. Report suspicious messages through your organization’s approved channel.',
        'The two sound protocols are in volumes 2 and 8.',
      ],
      'text',
      'TWO VOLUME NUMBERS (E.G. 2,8)'
    ),
    100,
    'amber',
    [
      {
        id: 'bookshelf_unit',
        name: 'The Ancient Library Shelves',
        description: 'Ten numbered volumes describe security protocols for common social-engineering situations.',
        clue: 'Choose the two volumes that recommend verifying requests independently and reporting suspicious messages without sharing verification codes.',
        iconName: 'Library',
        interactionType: 'bookshelf',
        extraData: {
          books: [
            { vol: '1', title: 'The Urgent Messenger', protocol: 'Act immediately when a message creates pressure; there is no time to verify.', safe: false, color: 'bg-red-950 border-red-800' },
            { vol: '2', title: 'The Trusted Directory', protocol: 'Verify a request using a known, independent phone number or directory entry.', safe: true, color: 'bg-emerald-950 border-emerald-700' },
            { vol: '3', title: 'The Familiar Name', protocol: 'A familiar display name is enough proof that a message is genuine.', safe: false, color: 'bg-blue-950 border-blue-800' },
            { vol: '4', title: 'The Shared Secret', protocol: 'Read a one-time code aloud if a caller says they need it to secure your account.', safe: false, color: 'bg-purple-950 border-purple-800' },
            { vol: '5', title: 'The Unchecked Attachment', protocol: 'Open unexpected attachments quickly so important work is not delayed.', safe: false, color: 'bg-amber-950 border-amber-800' },
            { vol: '6', title: 'The Quiet Exception', protocol: 'Keep unusual requests secret when the requester claims to be a senior executive.', safe: false, color: 'bg-slate-900 border-slate-700' },
            { vol: '7', title: 'The Helpful Password', protocol: 'Share your password with a colleague who offers to fix a login problem.', safe: false, color: 'bg-orange-950 border-orange-800' },
            { vol: '8', title: 'The Reported Message', protocol: 'Never share verification codes; report suspicious messages through the approved channel.', safe: true, color: 'bg-teal-950 border-teal-700' },
            { vol: '9', title: 'The Payment Shortcut', protocol: 'Skip the normal approval process if a payment request sounds urgent.', safe: false, color: 'bg-rose-950 border-rose-800' },
            { vol: '10', title: 'The Convenient Link', protocol: 'Use a link in an unexpected message to sign in and check whether it is legitimate.', safe: false, color: 'bg-indigo-950 border-indigo-800' },
          ],
        },
      },
      {
        id: 'library_desk',
        name: 'Reading Bureau Desk',
        description: 'An antique roll-top desk with a green banker’s lamp.',
        clue: 'A librarian slip reads: "Ten volumes. Select the two protocols that keep account access safe and requests independently verified."',
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
    'TWO VERIFIED SAFEGUARDS SELECTED. ARCHIVE PASSAGE OPEN.'
  );

  // === ROOM 4: THE PADDED CELL (SSH Tunnel) ===
  const blueShell = new Item(
    'Blue Shell',
    'A blue secure-shell token hidden behind a padded wall mat. Use it to establish the SSH tunnel through the simulated firewall.',
    true,
    'Terminal'
  );

  const room4 = new Room(
    4,
    'The Padded Cell',
    'A padded room surrounds a wall of animated flame-shaped firewall tiles. The barrier behaves like a network firewall: only a secure SSH tunnel can pass. A blue shell token is hidden behind one of the touchable padded mats.',
    [blueShell],
    new Puzzle(
      'ESTABLISH THE SECURE SHELL TUNNEL',
      'SSH',
      'Find and collect the Blue Shell behind the padded mat, then enter SSH to tunnel through the simulated firewall.',
      [
        'The flame wall represents a firewall: connections are filtered at the barrier.',
        'Search the padded mats for the blue shell token.',
        'Collect the Blue Shell, then enter SSH to represent opening a secure tunnel.',
      ],
      'text',
      'ENTER SSH',
      blueShell.name
    ),
    90,
    'blue',
    [
      {
        id: 'flame_firewall',
        name: 'Firewall of Flame',
        description: 'A wall of flame-shaped illuminated tiles seals the exit.',
        clue: 'SIMULATED FIREWALL: connections are filtered at the barrier. A secure shell tunnel is required to pass.',
        iconName: 'Flame',
        interactionType: 'inspect',
      },
      {
        id: 'padded_mat',
        name: 'Loose Padded Wall Mat',
        description: 'One padded wall panel shifts slightly when pressed. Something blue is tucked behind it.',
        clue: 'Behind the mat is a Blue Shell token. Collect it to enable the secure-shell tunnel challenge.',
        iconName: 'Shield',
        hiddenItem: blueShell,
        interactionType: 'inspect',
      },
      {
        id: 'tunnel_console',
        name: 'SSH Tunnel Console',
        description: 'A compact terminal mounted beside the firewall.',
        clue: 'Enter SSH after collecting the Blue Shell to open a secure tunnel through the simulated barrier.',
        iconName: 'Terminal',
        interactionType: 'inspect',
      },
    ],
    'SECURE SHELL TUNNEL ESTABLISHED. PADDED CELL EXIT OPEN.'
  );

  // === ROOM 5: THE CENTRAL VAULT SANCTUARY ===
  const room5Code = 'VERIFY,PAUSE,REPORT,CONFIRM';

  const room5 = new Room(
    5,
    'The Central Vault Sanctuary',
    'The central vault is a refrigerated sanctuary of steel and glass. A 100-carat red diamond gleams beneath a display case. Before the final seal opens, complete four awareness drills: recognize impersonation, distraction, phishing, and payment fraud, then choose safe responses.',
    [],
    new Puzzle(
      'COMPLETE ALL FOUR SOCIAL-ENGINEERING AWARENESS DRILLS',
      room5Code,
      'Inspect all four scenario cards. Match each tactic with its safe response and submit the four response words in drill order, separated by commas.',
      [
        'Pause when someone claims authority or tries to rush you; independently verify the request.',
        'Do not open unexpected links or attachments. Report suspicious messages through the approved channel.',
        'In drill order, the safe responses are VERIFY, PAUSE, REPORT, CONFIRM.',
      ],
      'text',
      'VERIFY, PAUSE, REPORT, CONFIRM'
    ),
    90,
    'rose',
    [
      {
        id: 'diamond_pedestal',
        name: '100-Carat Red Diamond',
        description: 'A brilliant red diamond rests behind the vault glass.',
        clue: 'The display case remains sealed until all four awareness drills are complete.',
        iconName: 'Diamond',
        interactionType: 'inspect',
      },
      {
        id: 'impersonation_drill',
        name: 'Drill 1: Impersonation',
        description: 'A caller claims to be a colleague and asks for account access.',
        clue: 'TACTIC: Impersonation. SAFE RESPONSE: Verify identity through a known, independent channel; never disclose credentials or codes.',
        iconName: 'UserRound',
        interactionType: 'inspect',
      },
      {
        id: 'distraction_drill',
        name: 'Drill 2: Distraction',
        description: 'A commotion draws attention away while an unusual request is made.',
        clue: 'TACTIC: Distraction. SAFE RESPONSE: Pause, keep control of sensitive items and accounts, and verify the request before acting.',
        iconName: 'Siren',
        interactionType: 'inspect',
      },
      {
        id: 'phishing_drill',
        name: 'Drill 3: Phishing',
        description: 'An unexpected message urges you to follow a link and sign in.',
        clue: 'TACTIC: Phishing. SAFE RESPONSE: Do not use the message link; navigate using a trusted bookmark and report the message.',
        iconName: 'MailWarning',
        interactionType: 'inspect',
      },
      {
        id: 'payment_fraud_drill',
        name: 'Drill 4: Payment Fraud',
        description: 'A payment change arrives with pressure to bypass normal approval.',
        clue: 'TACTIC: Payment Fraud. SAFE RESPONSE: Stop the transfer and confirm any change using the established approval process and a known contact.',
        iconName: 'BadgeDollarSign',
        interactionType: 'inspect',
      },
    ],
    'ALL FOUR AWARENESS DRILLS PASSED. THE RED DIAMOND IS SECURED!'
  );

  return [room1, room2, room3, room4, room5];
}
