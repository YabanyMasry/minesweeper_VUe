<template>
  <div class="game-container">
    <h2>Minesweeper</h2>
    <p>Time: {{ time }} seconds</p>
    <div class="board" :style="{ gridTemplateColumns: `repeat(${cols}, 40px)` }">
      <Cell
        v-for="(cell, index) in board"
        :key="index"
        :cell="cell"
        :index="index"
        @reveal="handleReveal"
        @flag="handleFlag"
      />
    </div>
    <p v-if="gameOver && !gameWon" class="message">Game Over! Final Score: {{ finalScore }}</p>
    <p v-if="gameWon" class="message">You Win! Final Score: {{ finalScore }}</p>
  </div>
</template>

<script>
import Cell from './GridCell.vue';

export default {
  components: { Cell },
  props: {
    rows: { type: Number, default: 10 },
    cols: { type: Number, default: 10 },
    mines: { type: Number, default: 10 },
  },
  data() {
    return {
      board: [],          // Initialize as an empty board
      gameOver: false,
      gameWon: false,
      finalScore: 0,      // Final calculated score
      time: 0,            // Timer variable
      timer: null,        // Interval ID for the timer
      maxTime: 300,       // Maximum time allowance for custom game
      baseScore: 0,       // Maximum time allowance for custom game
      firstClick: true,   // Flag to check if it's the first click
    };
  },
  created() {
    this.initEmptyBoard(); // Initialize an empty board
    this.calculateMultiplier();
  },
  beforeUnmount() {
    clearInterval(this.timer); // Clear timer on component unmount
  },
  methods: {
    initEmptyBoard() {
      const totalCells = this.rows * this.cols;
      this.board = Array(totalCells).fill().map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      }));
    },
    initBoard(firstClickIndex) {
      const totalCells = this.rows * this.cols;
      const board = Array(totalCells).fill().map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      }));

      // Randomly place mines
      let placedMines = 0;
      const neighbors = this.getNeighbors(firstClickIndex);
      neighbors.push(firstClickIndex); // Include the first clicked cell itself

      while (placedMines < this.mines) {
        const index = Math.floor(Math.random() * totalCells);
        if (!neighbors.includes(index) && !board[index].isMine) {
          board[index].isMine = true;
          placedMines++;
        }
      }

      // Calculate adjacent mine counts
      for (let i = 0; i < totalCells; i++) {
        if (!board[i].isMine) {
          board[i].adjacentMines = this.getNeighbors(i)
            .filter(n => board[n]?.isMine).length;
        }
      }

      this.board = board;
    },
    calculateMultiplier() {
  const area = this.rows * this.cols;
  const mineDensity = this.mines / area;

  console.log(`Mine Density: ${mineDensity}`); // Log mine density

  this.maxTime = area * 2 * Math.log(1 + mineDensity * 5) + 30;  // Adjusted weight for density
  console.log(`MaxTime: ${this.maxTime}`); // Log maxTime

  // Weighting factors
  const areaWeight = 0.5; // Less weight for area
  const densityWeight = 2; // Higher weight for density

  // Scale area and density contributions
  const scaledArea = Math.sqrt(area / 110) * areaWeight; // Scaled area factor
  const scaledDensity = mineDensity * densityWeight; // Scaled density factor

  console.log(`Scaled Area Factor: ${scaledArea}`); // Log scaled area factor
  console.log(`Scaled Density Factor: ${scaledDensity}`); // Log scaled density factor

  // Combine area and density to calculate multiplier as a product
  this.multiplier = scaledArea * scaledDensity * 10;

  console.log(`Multiplier: ${this.multiplier}`); // Log final multiplier

  this.baseScore = this.multiplier * 100;

  console.log(`Base Score: ${this.baseScore}`);
},


    getNeighbors(index) {
      const neighbors = [];
      const row = Math.floor(index / this.cols);
      const col = index % this.cols;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) {
            const r = row + dr;
            const c = col + dc;
            if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
              neighbors.push(r * this.cols + c);
            }
          }
        }
      }
      return neighbors;
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.time++;
      }, 1000); // Increment time every second
    },
    handleReveal(index) {
      let cell = this.board[index];
      if (cell.isRevealed || cell.isFlagged || this.gameOver) return;

      // Start the timer when the first cell is revealed
      if (this.time === 0 && !this.timer) {
        this.startTimer();
      }

      // Initialize the board after the first click to ensure the first click is safe
      if (this.firstClick) {
        this.firstClick = false;
        this.initBoard(index);
        // Re-fetch the cell after initializing the board
        cell = this.board[index];
      }

      cell.isRevealed = true;

      if (cell.isMine) {
        this.gameOver = true;
        clearInterval(this.timer); // Stop the timer if the game is over
        this.calculateFinalScore(); // Calculate the final score on game over
        return;
      }

      if (cell.adjacentMines === 0) {
        const neighbors = this.getNeighbors(index);
        neighbors.forEach(this.handleReveal);
      }

      this.checkWin();
    },
    handleFlag(index) {
      const cell = this.board[index];
      if (!cell.isRevealed) {
        cell.isFlagged = !cell.isFlagged;
      }
      this.checkWin();
    },
    checkWin() {
      const allCellsCorrect = this.board.every(cell =>
        (cell.isMine && cell.isFlagged) || (!cell.isMine && cell.isRevealed)
      );
      if (allCellsCorrect) {
        this.gameWon = true;
        this.gameOver = true;
        clearInterval(this.timer); // Stop the timer on game win
        this.calculateFinalScore(); // Calculate the final score on win
      }
    },
    calculateFinalScore() {
      if (this.gameOver && !this.gameWon) {
        this.finalScore = 0;
      } else {
        const timeBonus = Math.max(0, this.maxTime - this.time); // Ensure no negative scores
        console.log(`Time Bonus: ${timeBonus}`);
        // Log time bonus
        this.finalScore = Math.floor(timeBonus * this.multiplier + this.baseScore);
      }
    },
  },
};
</script>


<style>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #121212;
  color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.board {
  display: grid;
  margin-top: 20px;
  gap: 0;
}

.message {
  margin-top: 20px;
  font-weight: bold;
  font-size: 1.5rem;
}
</style>