<template>
  <div
    class="cell"
    :class="{ revealed: cell.isRevealed, mine: cell.isMine, flagged: cell.isFlagged }"
    @click="reveal"
    @contextmenu.prevent="flag"
  >
    <span v-if="cell.isRevealed && cell.adjacentMines > 0">{{ cell.adjacentMines }}</span>
    <span v-if="cell.isRevealed && cell.isMine">💣</span>
    <span v-if="cell.isFlagged">🚩</span>
  </div>
</template>

<script>
export default {
  props: ['cell', 'index'],
  methods: {
    reveal() {
      this.$emit('reveal', this.index);
    },
    flag() {
      this.$emit('flag', this.index);
    },
  },
};
</script>

<style scoped>
.cell {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1e1e1e;
  color: #ffffff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  user-select: none;
}

.cell.revealed {
  background-color: #2e2e2e;
}

.cell.mine {
  background-color: #ff4d4d;
}

.cell.flagged {
  background-color: #ffd700;
}

.cell:hover {
  background-color: #333;
}

.cell span {
  font-size: 1.5rem;
}
</style>