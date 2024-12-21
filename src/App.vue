<template>

<NavbarComponent /> <!-- Add the Navbar component to the template -->
  <div class="app-container">
    <GameBoard :rows="rows" :cols="cols" :mines="mines" />
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import GameBoard from "./components/GameBoard.vue";
import NavbarComponent from "./components/NavBar.vue"; // Import the Navbar component

export default {
  components: { GameBoard, NavbarComponent }, // Add the Navbar component to the components object
  setup() {
    const route = useRoute();
    const rows = ref(parseInt(route.query.rows) || 10);
    const cols = ref(parseInt(route.query.cols) || 10);
    const mines = ref(parseInt(route.query.mines) || 10);
    const userId = ref(getCookie('userId')); // Get the userId from the cookie

    watch(route, (newRoute) => {
      rows.value = parseInt(newRoute.query.rows) || 10;
      cols.value = parseInt(newRoute.query.cols) || 10;
      mines.value = parseInt(newRoute.query.mines) || 10;
    });

    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }

    return { rows, cols, mines, userId };
  },
};
</script>

<style>

html, body {
  background-color: #121212;
  color: #e0e0e0;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

</style>