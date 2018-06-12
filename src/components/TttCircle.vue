<template>
  <div class="container">
    <svg 
      :viewBox="viewBox" 
      :width="`${size + 2 * strokeWidth}px`"   
      :height="`${size + 2 * strokeWidth}px`"   
      xml:space="preserve" 
      class="svg" 
      xmlns="http://www.w3.org/2000/svg">
      <circle 
        :class="{'path': displayed, 'unpath': !displayed}" 
        :cx="size / 2 + strokeWidth" 
        :cy="size / 2 + strokeWidth" 
        :r="size / 2" 
        :stroke="color" 
        :stroke-dasharray="pathLength"
        :stroke-dashoffset="pathLength"
        :stroke-width="strokeWidth" 
        fill="none" 
        stroke-linecap="round" />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'TttCircle',

  props: {
    color: {
      type: String,
      default: '#b3e2ef',
    },
    size: {
      type: Number,
      default: 20,
    },
    strokeWidth: {
      type: Number,
      default: 2,
    },
    displayed: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    viewBox() {
      return `0 0 ${this.size + 2 * this.strokeWidth} ${this.size + 2 * this.strokeWidth}`;
    },

    pathLength() {
      return 2 * Math.PI * this.size;
    },
  },
};
</script>

<style lang="scss" scoped>
@import './../assets/styles/ttt-styles.scss';

.container {
  display: flex;
  justify-content: center;

  .svg {
    margin: 0;

    circle {
      display: none;

      &.path {
        animation: dash 200ms linear forwards;
        display: inline;
      }

      &.unpath {
        animation: undash 200ms linear forwards;
        display: inline;
      }

      @keyframes dash {
        100% {
          stroke-dashoffset: 0;
        }
      }

      @keyframes undash {
        0% {
          stroke-dashoffset: 0;
        }
      }
    }
  }
}
</style>
