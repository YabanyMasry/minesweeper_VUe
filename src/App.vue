<template>
  <GameBoard :rows="5" :cols="5" :mines="2" />
</template>

<script>
import GameBoard from "./components/GameBoard.vue";

export default {
  components: { GameBoard },
};
</script>
