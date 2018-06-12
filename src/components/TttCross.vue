<template>
  <div class="container">
    <svg 
      :viewBox="viewBox" 
      :width="`${size + 2 * strokeWidth}px`"
      :height="`${size + 2 * strokeWidth}px`"   
      xml:space="preserve" 
      class="svg" 
      xmlns="http://www.w3.org/2000/svg">
      <path 
        :class="{'path': displayed, 'unpath': !displayed}" 
        :stroke="color"
        :stroke-width="strokeWidth" 
        :stroke-dasharray="pathLength"
        :stroke-dashoffset="pathLength"
        :d="pathPolygon"
        fill="none" 
        stroke-linecap="round" />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'TttCross',

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
      return `0 0 ${this.size} ${this.size}`;
    },

    pathPolygon() {
      return `M${this.strokeWidth + 1} ${this.strokeWidth + 1} ${this.size - (this.strokeWidth + 1)} ${this.size - (this.strokeWidth + 1)} M${this.size - (this.strokeWidth + 1)} ${this.strokeWidth + 1} ${this.strokeWidth + 1} ${this.size - (this.strokeWidth + 1)}`;
    },

    pathLength() {
      return Math.ceil(Math.sqrt(2) * this.size);
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

    path {
      display: none;
      
      &.path {
        display: inline;
        animation: dash 200ms linear forwards;
      }
      
      &.unpath {
        display: inline;
        animation: undash 200ms linear forwards;
      }
    }
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
</style>
