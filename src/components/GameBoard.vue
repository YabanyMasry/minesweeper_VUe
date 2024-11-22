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
        board: [],
        gameOver: false,
        gameWon: false,
        finalScore: 0,     // Final calculated score
        time: 0,           // Timer variable
        timer: null,       // Interval ID for the timer
        maxTime: 300,      // Maximum time allowance for custom game
      };
    },
    created() {
      this.initBoard();
      this.setCustomDifficulty();
    },
    beforeUnmount() {
      clearInterval(this.timer); // Clear timer on component unmount
    },
    methods: {
      initBoard() {
        const totalCells = this.rows * this.cols;
        console.log(`Rows: ${this.rows}, Cols: ${this.cols}`); // Log rows and cols
        const board = Array(totalCells).fill().map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        }));
  
        // Randomly place mines
        let placedMines = 0;
        while (placedMines < this.mines) {
          const index = Math.floor(Math.random() * totalCells);
          if (!board[index].isMine) {
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
      setCustomDifficulty() {
        const area = this.rows * this.cols;
        const mineDensity = this.mines / area;
        console.log(`Mine Density: ${mineDensity}`); // Log mine density
  
        this.maxTime = Math.max(300, area * 2); // Base max time for custom games
        this.multiplier = this.calculateCustomMultiplier(area, mineDensity);
      },
      calculateCustomMultiplier(area, mineDensity) {
        // A formula to calculate multiplier based on area and mine density
        const baseMultiplier = 1.0;
        const areaFactor = area / 100;          // Larger grids increase multiplier
        const densityFactor = mineDensity * 5; // Higher density increases multiplier
        const multiplier = baseMultiplier + areaFactor + densityFactor;
        console.log(`Multiplier: ${multiplier}`); // Log multiplier
        return multiplier;
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
        const cell = this.board[index];
        if (cell.isRevealed || cell.isFlagged || this.gameOver) return;
  
        // Start the timer when the first cell is revealed
        if (this.time === 0 && !this.timer) {
          this.startTimer();
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
        const timeBonus = Math.max(0, this.maxTime - this.time); // Ensure no negative scores
        console.log(`Time Bonus: ${timeBonus}`); // Log time bonus
        this.finalScore = Math.floor(timeBonus * this.multiplier);
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