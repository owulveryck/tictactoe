<template>
  <div class="container">
    <ttt-tic-tac-toe-splash
      v-if="!playing"
      @go-play="strategiesSelected" />
    <ttt-tic-tac-toe-game 
      v-if="playing"
      :strategies="strategies"
      @game-finished="gameFinished" />
  </div>
</template>

<script>
import TttTicTacToeSplash from './TttTicTacToeSplash';
import TttTicTacToeGame from './TttTicTacToeGame';

export default {
  name: 'TttTicTacToe',

  components: {
    TttTicTacToeSplash,
    TttTicTacToeGame,
  },

  data: () => ({
    strategies: {
      X: 'human',
      O: 'human',
    },
    playing: false,
  }),

  methods: {
    strategiesSelected({ X, O }) {
      this.strategies.X = X;
      this.strategies.O = O;
      this.playing = true;
    },
    gameFinished() {
      this.playing = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import './../assets/styles/ttt-styles.scss';

.container {
  background-color: $primary-color;
  height: 100vh;
  transform: scale(3);
  transform-origin: top;
  width: 100vh;
}
</style>
