'
<template>
  <div class="game-container">
    <h2>Minesweeper</h2>
    <p>Time: {{ time }} seconds</p>
    <div
      class="board"
      :style="{ gridTemplateColumns: `repeat(${cols}, 40px)` }"
    >
      <Cell
        v-for="(cell, index) in board"
        :key="index"
        :cell="cell"
        :index="index"
        @reveal="handleReveal"
        @flag="handleFlag"
      />
    </div>
    <p v-if="gameOver && !gameWon" class="message">
      Game Over! Final Score: {{ finalScore }}
    </p>
    <p v-if="gameWon" class="message">You Win! Final Score: {{ finalScore }}</p>
  </div>
</template>
<script>
import Cell from "./GridCell.vue";
import Cookies from "js-cookie";

export default {
  components: { Cell },
  props: {
    rows: { type: Number, default: 10 },
    cols: { type: Number, default: 10 },
    mines: { type: Number, default: 10 },
  },
  data() {
    return {
      board: [],
      gameOver: false,
      gameWon: false,
      finalScore: 0,
      time: 0,
      timer: null,
      maxTime: 300,
      baseScore: 0,
      firstClick: true,
    };
  },
  created() {
    this.initEmptyBoard();
    this.calculateMultiplier();
    this.loadFinalScore(); // Load score from cookies on creation
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    initEmptyBoard() {
      const totalCells = this.rows * this.cols;
      this.board = Array(totalCells)
        .fill()
        .map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        }));
    },
    initBoard(firstClickIndex) {
      const totalCells = this.rows * this.cols;
      const board = Array(totalCells)
        .fill()
        .map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        }));

      let placedMines = 0;
      const neighbors = this.getNeighbors(firstClickIndex);
      neighbors.push(firstClickIndex);

      while (placedMines < this.mines) {
        const index = Math.floor(Math.random() * totalCells);
        if (!neighbors.includes(index) && !board[index].isMine) {
          board[index].isMine = true;
          placedMines++;
        }
      }

      for (let i = 0; i < totalCells; i++) {
        if (!board[i].isMine) {
          board[i].adjacentMines = this.getNeighbors(i).filter(
            (n) => board[n]?.isMine
          ).length;
        }
      }

      this.board = board;
    },
    calculateMultiplier() {
      const area = this.rows * this.cols;
      const mineDensity = this.mines / area;

      console.log(`Mine Density: ${mineDensity}`); // Log mine density

      this.maxTime = area * 2 * Math.log(1 + mineDensity * 5) + 30; // Adjusted weight for density
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
      }, 1000);
    },
    handleReveal(index) {
      let cell = this.board[index];
      if (cell.isRevealed || cell.isFlagged || this.gameOver) return;

      if (this.time === 0 && !this.timer) {
        this.startTimer();
      }

      if (this.firstClick) {
        this.firstClick = false;
        this.initBoard(index);
        cell = this.board[index];
      }

      cell.isRevealed = true;

      if (cell.isMine) {
        this.gameOver = true;
        clearInterval(this.timer);
        this.calculateFinalScore();
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
      const allCellsCorrect = this.board.every(
        (cell) =>
          (cell.isMine && cell.isFlagged) || (!cell.isMine && cell.isRevealed)
      );
      if (allCellsCorrect) {
        this.gameWon = true;
        this.gameOver = true;
        clearInterval(this.timer);
        this.calculateFinalScore();
      }
    },
    calculateFinalScore() {
      if (this.gameOver && !this.gameWon) {
        this.finalScore = 0;
      } else {
        const timeBonus = Math.max(0, this.maxTime - this.time);
        this.finalScore = Math.floor(
          timeBonus * this.multiplier + this.baseScore
        );
        console.log(`Time Bonus: ${timeBonus}`);
      }
      this.saveFinalScore(); // Save score to cookies after calculation
    },
    saveFinalScore() {
      Cookies.set("minesweeper_score", this.finalScore, { expires: 7 });
    },
    loadFinalScore() {
      const savedScore = Cookies.get("minesweeper_score");
      if (savedScore) {
        this.finalScore = parseInt(savedScore, 10);
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
