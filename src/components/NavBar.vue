<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a href="http://localhost:4200/" class="navbar-brand">
        <img src="mine.png" alt="Mine" class="mine-icon">
        Minesweeper
      </a>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavbarComponent',
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Doto:wght@850&display=swap');

.navbar-dark {
  background-color: #181818;
  padding: 0.2rem 0.6rem; /* Decreased padding */
}

.navbar-brand {
  color: #e0e0e0;
  font-family: 'Doto', sans-serif;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  text-decoration: none; /* Remove underline from link */
}

.mine-icon {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.container {
  padding: 0 1.2rem;
}
</style>