<style scoped lang="scss">
.marked_baixie {
  background: url('/baixie.png') center/contain no-repeat;
  width: 28px;
  height: 28px;
  display: inline-block;
  position: relative;
  overflow: auto;
  pointer-events: none;
  right: 12px;
  bottom: 8px;
}
</style>

<template>
  <div style="display: inline-block">
    <button v-bind="$attrs" @click.stop>
      <slot></slot>
    </button>
    <span class="marked_baixie" :style="{ filter: $attrs.disabled ? 'brightness(0.5)' : '' }" />
  </div>
</template>
