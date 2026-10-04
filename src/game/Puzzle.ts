/**
 * Puzzle Class
 * Represents a riddle, cipher, or logic challenge for a room.
 * Keeps track of challenge text, correct answers, progressive hints, and solve state.
 */
export class Puzzle {
  static readonly MAX_ATTEMPTS = 3;
  question: string;
  correctAnswer: string;
  hint: string;
  hints: string[];
  isSolved: boolean;
  currentHintIndex: number;
  attempts: number;
  type: 'code' | 'text' | 'combination';
  placeholder: string;
  requiredItemName?: string;
  maxAttempts: number;

  constructor(
    question: string,
    correctAnswer: string,
    hint: string,
    hints: string[] = [],
    type: 'code' | 'text' | 'combination' = 'code',
    placeholder: string = 'ENTER CODE',
    requiredItemName?: string,
    maxAttempts: number = Puzzle.MAX_ATTEMPTS
  ) {
    this.question = question;
    this.correctAnswer = correctAnswer.trim();
    this.hint = hint;
    this.hints = hints.length > 0 ? hints : [hint];
    this.isSolved = false;
    this.currentHintIndex = 0;
    this.attempts = 0;
    this.type = type;
    this.placeholder = placeholder;
    this.requiredItemName = requiredItemName;
    this.maxAttempts = maxAttempts;
  }

  /**
   * Validates the player's submitted answer against the solution.
   * Compares strings case-insensitively and trims whitespace.
   */
  checkAnswer(submittedAnswer: string): boolean {
    this.recordAttempt();
    const cleanSubmitted = submittedAnswer.trim().replace(/\s*,\s*/g, ',').toLowerCase();
    const cleanCorrect = this.correctAnswer.trim().replace(/\s*,\s*/g, ',').toLowerCase();

    if (cleanSubmitted === cleanCorrect) {
      this.isSolved = true;
      return true;
    }
    return false;
  }

  recordAttempt(): void {
    this.attempts++;
  }

  /**
   * Retrieves the next available hint in sequence.
   */
  getNextHint(): string {
    if (this.currentHintIndex < this.hints.length) {
      const hint = this.hints[this.currentHintIndex];
      this.currentHintIndex++;
      return hint;
    }
    return this.hints[this.hints.length - 1] || this.hint;
  }

  /**
   * Resets puzzle state for room restarts.
   */
  reset(): void {
    this.isSolved = false;
    this.attempts = 0;
    this.currentHintIndex = 0;
  }
}
