<template>
  <div class="loader-container">
    <div class="loader loaderX">
      <div>
        <div>
          <div>
            <div>
              <div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TttLoader',
  };
</script>

<style lang="scss" scoped>
  $grey: rgba(255, 255, 255, .5);
  $blue: rgba(255, 255, 255, 1);

  * {
    box-sizing: border-box;
  }

  @mixin loaderDivMixin {
    border-radius: 50%;
    padding: 8px;
    border: 2px solid transparent;
    animation: rotate linear 3.5s infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .loader-container {
    padding-top: 75px;
    position: absolute;
    transform: translateY(-150px);
    width: 100%;

    .loader {
      position: relative;
      margin: 75px auto;
      width: 150px;
      height: 150px;
      display: block;
      overflow: hidden;
      div {
        height: 100%;
        width: 100%;
      }
    }

    .loaderX, .loaderX div {
      @include loaderDivMixin;
      border-top-color: $grey;
      border-left-color: $blue;
      animation-timing-function: cubic-bezier(.55, .38, .21, .88);
      animation-duration: 3s;
    }

    .loader, .loader * {
      will-change: transform;
    }
  }
</style>
