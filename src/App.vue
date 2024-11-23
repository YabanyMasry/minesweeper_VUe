<template>
  <GameBoard :rows="10" :cols="5" :mines="2" />
</template>

<script>
import GameBoard from "./components/GameBoard.vue";

export default {
  components: { GameBoard },
};
</script>
