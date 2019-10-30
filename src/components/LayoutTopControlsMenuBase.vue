<script>
export default {
  name: 'LayoutTopControlsMenuBase',

  props: {
    items: {
      type: Array,
      required: true,
    },
    currentItemIndex: {
      type: Number,
      required: true,
    },
  },
};
</script>

<template>
<div class="layout-top-controls-menu-base">
  <RouterLink
    class="button"
    v-for="(item, index) in items"
    :class="{ '_current': index === currentItemIndex }"
    :key="index"
    :to="item.url"
  >
    {{ item.title }}
  </RouterLink>
</div>
</template>
<style lang="scss" scoped>
.layout-top-controls-menu-base {
  height: 100%;
}

.button {
  font-family: Roboto;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  background-color: transparent;
  cursor: pointer;
  height: 100%;
  padding: 0 20px;
  min-width: 120px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &._current {
    border-bottom: 3px solid #3d7bf5;
  }
}
</style>
