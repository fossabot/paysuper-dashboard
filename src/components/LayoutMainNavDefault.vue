<script>
export default {
  name: 'LayoutMainNavDefault',
  props: {
    currentItem: {
      default: 0,
      type: Number,
    },
    items: {
      required: true,
      type: Array,
    },
  },
};
</script>

<template>
<div class="layout-main-nav-default">
  <RouterLink
    v-for="(item, index) in items"
    :key="index"
    :class="['item', { '_not-available': !item.isAvailable, '_current': currentItem === index }]"
    :to="item.link"
  >
    <div class="icon">
      <component :is="item.icon" />
    </div>
    <div class="text">
      <div class="title">{{ item.title }}</div>
      <div class="additional">
        {{
          item.isAvailable
            ? item.additional : (item.unavailableReason || 'Need license agreement')
        }}
      </div>
    </div>
  </RouterLink>
</div>
</template>

<style lang="scss" scoped>
.layout-main-nav-default {
  display: flex;
  flex-direction: column;
  padding-top: 9px;
}
.item {
  display: flex;
  align-content: center;
  align-items: center;
  padding: 8px 12px;
  transition: background-color 0.2s ease-out;

  & ~ & {
    margin-top: 8px;
  }

  &:hover,
  &._current:hover {
    background-color: #e6efff;
  }

  &._current {
    background-color: #f7f9fa;
  }
  &._not-available {
    pointer-events: none;
    opacity: 0.25;
  }
}
.icon {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 12px;

  & > svg {
    transition: fill 0.2s ease-out;
  }

  .item:hover & > svg {
    fill: #3d7bf5;
  }
}
.title {
  font-family: Quicksand;
  color: #000;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.44px;
  transition: color 0.2s ease-out;

  .item:hover & {
    color: #3d7bf5;
  }
}
.additional {
  color: #5e6366;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
  transition: color 0.2s ease-out;

  .item:hover & {
    color: #3d7bf5;
  }
}
</style>
