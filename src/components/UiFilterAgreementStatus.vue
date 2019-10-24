<script>
import { map } from 'lodash-es';
import ClickOutside from 'vue-click-outside';
import merchantStatusScheme from '@/schemes/merchantStatusScheme';

export default {
  name: 'UiFilterAgreementStatus',

  directives: {
    ClickOutside,
  },

  props: {
    value: {
      type: String,
      default: 'all',
    },
    countsByStatus: {
      type: Object,
      default: null,
    },
  },

  data() {
    const unsignedStatuses = map(merchantStatusScheme, (item, key) => ({
      ...item,
      code: key,
    })).filter(item => item.value !== 'signed');

    return {
      isDropdownOpened: false,
      statusesList: [
        {
          label: 'All requests',
          value: 'all',
        },
        ...unsignedStatuses,
      ],
    };
  },

  methods: {
    getItemClass(item, value) {
      return [
        item.value ? `_${item.value}` : '',
        item.color ? `_${item.color}` : '',
        value === item.value ? '_current' : '',
      ];
    },
  },
};
</script>

<template>
<div class="filter-agreement-status">
  <div
    class="button"
    :class="{ '_opened': isDropdownOpened }"
    v-click-outside="() => isDropdownOpened = false"
    @click="isDropdownOpened = !isDropdownOpened"
  >
    <IconDropdownMenu />
  </div>
  <UiTip
    class="dropdown"
    innerPosition="right"
    position="bottom"
    width="200px"
    :visible="isDropdownOpened"
    :closeDelay="0"
    :stayOpenedOnHover="false"
  >
    <div class="dropdown-content">
      <div
        class="status"
        v-for="(item, index) in statusesList"
        :key="index"
        :class="getItemClass(item, value)"
        @click="$emit('input', item.value)"
      >
        <component
          class="status-icon"
          v-if="item.icon"
          :is="item.icon"
        />
        {{ item.label }}
        <span
          class="status-count"
          v-if="countsByStatus"
        >
          ({{ countsByStatus[item.value] || 0 }})
        </span>
      </div>
    </div>
  </UiTip>
</div>

</template>

<style lang="scss" scoped>
.filter-agreement-status {
  display: inline-flex;
  position: relative;
}
.button {
  width: 40px;
  height: 40px;
  display: flex;
  border: 1px solid #e3e5e6;
  box-sizing: border-box;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  cursor: pointer;
  transition: all 0.2s ease-out;

  & > svg {
    transition: fill 0.2s ease-out;
  }

  &:hover:not(._opened) {
    background: rgba(61, 123, 245, 0.08);

    & > svg {
      fill: #3d7bf5;
    }
  }

  &._opened {
    background-color: #f1f3f4;
    border-color: #f1f3f4;
  }
}

.dropdown {
  top: calc(100% + 4px);
}

.dropdown-content {
  padding: 10px 0;
}

.status {
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  position: relative;
  padding: 0 16px 0 32px;
  height: 30px;
  display: flex;
  align-items: center;

  &:hover:not(._current) {
    cursor: pointer;
    background: rgba(61, 123, 245, 0.08);
    color: #3d7bf5;
  }

  &::before {
    content: "";
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    left: 16px;
    top: 11px;
  }

  &._current {
    &,
    .status-count {
      color: #c6cacc;
    }
  }

  &._transparent {
    &::before {
      border: 1px solid #919699;
    }
  }
  &._blue {
    &::before {
      background: #3d7bf5;
    }
  }
  &._orange {
    &::before {
      background: #f3aa18;
    }
  }
  &._purple {
    &::before {
      background: #7e57c2;
    }
  }
  &._green {
    &::before {
      background: #2fa84f;
    }
  }
  &._red {
    &::before {
      background: #ea3d2f;
    }
  }
  &._archived {
    border-top: 1px solid #f1f3f4;
    padding-top: 5px;
    height: 35px;
    margin-top: 5px;

    &::before {
      background: transparent;
    }
  }
}

.status-icon {
  position: absolute;
  left: 12px;
  top: 12px;
}
.status-count {
  color: #919699;
  margin-left: 4px;
  font-size: 12px;
}
</style>
