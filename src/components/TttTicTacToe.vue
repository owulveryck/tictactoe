<template>
  <div class="container">
    <transition name="fade">
      <ttt-loader v-if="loading" />
    </transition>
    <ttt-tic-tac-toe-splash
      v-show="!playing && !loading"
      @go-play="strategiesSelected" />
    <ttt-tic-tac-toe-game 
      v-if="playing"
      :strategies="strategies"
      @game-finished="gameFinished" />
  </div>
</template>

<script>
import initNeuralGo from './../lib/neural-go/neural-go';
import TttLoader from './TttLoader';
import TttTicTacToeSplash from './TttTicTacToeSplash';
import TttTicTacToeGame from './TttTicTacToeGame';

export default {
  name: 'TttTicTacToe',

  components: {
    TttLoader,
    TttTicTacToeSplash,
    TttTicTacToeGame,
  },

  data: () => ({
    strategies: {
      X: 'human',
      O: 'human',
    },
    loading: true,
    playing: false,
  }),

  async created() {
    await initNeuralGo();
    this.loading = false;
  },

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
  padding-top: 3vh;
}

.fade-enter-active, .fade-leave-active {
  transition: transform 200ms ease-out, opacity 200ms ease-out;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  // transform: scale(0.2);
}
</style>
