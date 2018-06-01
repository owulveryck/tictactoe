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
        <option value="machine-1">Machine - 1</option>
        <option value="machine-2">Machine - 2</option>
      </select>
    </div>
    <div class="field">
      <ttt-circle displayed />
      <span>is</span>
      <select v-model="strategy.O">
        <option value="human">Human</option>
        <option value="machine-1">Machine - 1</option>
        <option value="machine-2">Machine - 2</option>
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
  align-items: stretch;
  display: flex;
  flex-direction: column;
  margin: 0 auto $padding;
  padding-top: #{$padding / 2};
  width: 200px;
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
    margin: 0 #{$padding / 2}
  }
}
</style>
