<template>
  <div class="splash">
    <div class="field">
      <label class="title">Choose strategies</label>
    </div>
    <div class="field">
      <ttt-cross displayed />
      <span>is</span>
      <select v-model="strategy.X">
        <option value="human">Human</option>
        <option value="random">Machine - Random</option>
        <option value="easy">Machine - Easy</option>
        <option value="smart">Machine - Smart</option>
        <option value="neural">Machine - Neural</option>
        <option value="neural-go">Machine - Neural Go</option>
      </select>
    </div>
    <div class="field">
      <ttt-circle displayed />
      <span>is</span>
      <select v-model="strategy.O">
        <option value="human">Human</option>
        <option value="random">Machine - Random</option>
        <option value="easy">Machine - Easy</option>
        <option value="smart">Machine - Smart</option>
        <option value="neural">Machine - Neural</option>
      </select>
    </div>
    <button @click="go">Go!</button>
  </div>
</template>

<script>
import TttCircle from './TttCircle';
import TttCross from './TttCross';

export default {
  name: 'TttTicTacToeSplash',

  components: {
    TttCircle,
    TttCross,
  },

  data: () => ({
    strategy: {
      X: 'human',
      O: 'human',
    },
  }),

  methods: {
    go() {
      this.$emit('go-play', { 
        X: this.strategy.X,
        O: this.strategy.O,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import './../assets/styles/ttt-styles.scss';

.splash {
  animation: appear 100ms linear forwards;
  align-items: stretch;
  display: flex;
  flex-direction: column;
  margin: 0 auto $padding;
  padding-top: #{$padding / 2};
  width: 200px;
}

@keyframes appear {
  0% {
    opacity: 0;
    // transform: scale(0.1);
  }
  100% {
    opacity: 1;
    // transform: scale(1);
  }
}

.title {
  color: $text-color;
}

.field {
  align-items: stretch;
  color: $text-color;
  display: flex;
  justify-content: center;
  margin-bottom: $padding;

  span {
    margin: #{$padding / 4} #{$padding / 2}
  }
}
</style>
