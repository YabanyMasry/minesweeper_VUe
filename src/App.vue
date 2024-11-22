<template>
  <GameBoard :rows="20" :cols="20" :mines="60" />
</template>

<script>
import GameBoard from './components/GameBoard.vue';

export default {
  components: { GameBoard },
};
</script>
