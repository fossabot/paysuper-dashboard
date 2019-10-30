<script>
import { format, isValid } from 'date-fns';
import { truncate, get } from 'lodash-es';
import merchantStatusScheme from '@/schemes/merchantStatusScheme';
import merchantStatusNotificationsScheme from '@/schemes/merchantStatusNotificationsScheme';
import PictureAThingBetweenTrees from '@/components/PictureAThingBetweenTrees.vue';

export default {
  name: 'UserNotifications',
  components: {
    PictureAThingBetweenTrees,
  },
  props: {
    items: {
      default: () => [],
      type: Array,
    },
  },
  data() {
    return {
      openedItem: null,
      noMessageText: '¯\\_(ツ)_/¯',
    };
  },
  methods: {
    formatDate(item) {
      if (!item.created_at) {
        return '';
      }
      const datetime = new Date(item.created_at.seconds * 1000);
      return isValid(datetime) ? format(datetime, 'dd.MM.yyyy') : '';
    },
    getShortText(item) {
      const hasStatusText = this.checkIfHasStatusText(item);
      const text = hasStatusText ? this.getStatusChangeText(item) : item.message;
      return truncate(text, { length: 100, separator: /,? +/ }) || this.noMessageText;
    },
    checkIfHasStatusText(item) {
      return item.statuses && item.statuses.to;
    },
    getStatusChangeText(item) {
      const statusFrom = get(item, 'statuses.from');
      const statusTo = get(item, 'statuses.to');

      const statusFromText = get(merchantStatusScheme, `[${statusFrom}].label`, 'Unknown');
      const statusToText = get(merchantStatusScheme, `[${statusTo}].label`, 'Unknown');

      const fallbackText = `Status change (${statusFromText} -> ${statusToText})`;
      return merchantStatusNotificationsScheme[statusTo] || fallbackText;
    },
    openItem(item) {
      this.openedItem = item;
      this.$emit('markAsReaded', item.id);
    },
  },
};
</script>

<template>
<div class="user-notifications">
  <header class="header">
    <span
      v-if="!openedItem"
      class="title"
    >
      Notifications
    </span>
    <span
      v-else
      class="title"
    >
      <span class="icon _inline"></span>
      {{ openedItem.is_system ? 'Pay Super' : 'Administrator' }}
    </span>
    <span
      v-if="openedItem"
      class="back-link"
      @click="openedItem = null"
    >
      <IconParagraphPointer />
    </span>
    <span
      v-else
      class="close-button"
      @click="$emit('close')"
    >
      <IconClose />
    </span>
  </header>
  <template v-if="items.length">
    <!-- 2 UiScrollbarBox-es to sustain scroll position on switching to full message -->
    <UiScrollbarBox
      v-show="!openedItem"
      class="content"
    >
      <div
        v-for="item in items"
        :key="item.id"
        :class="{ _readed: item.is_read }"
        class="item"
        @click="openItem(item)"
      >
        <span class="icon"></span>
        <div class="notification">
          <div class="notification-header">
            <div class="subtitle">
              {{ item.is_system ? 'Pay Super' : 'Administrator' }}
            </div>
            <div class="date">{{ formatDate(item) }}</div>
          </div>
          <p class="text">{{ getShortText(item) }}</p>
        </div>
      </div>
    </UiScrollbarBox>
    <UiScrollbarBox
      v-if="openedItem"
      class="content"
    >
      <div class="notification">
        <div
          class="text-block"
          v-if="checkIfHasStatusText(openedItem)"
        >
          <div class="subtitle">License agreement</div>
          <p class="text">{{ getStatusChangeText(openedItem) }}</p>
        </div>
        <div
          class="text-block"
          v-if="openedItem.message"
        >
          <div class="subtitle">Administrator's comment</div>
          <p class="text">{{ openedItem.message }}</p>
        </div>
        <p
          class="text"
          v-if="!checkIfHasStatusText(openedItem) && !openedItem.message"
        >Something gone wrong {{ noMessageText }}</p>
      </div>
    </UiScrollbarBox>
  </template>
  <div
    v-else
    class="no-notifications"
  >
    <PictureAThingBetweenTrees />
    <p>You don’t have any notification yet</p>
  </div>
</div>
</template>

<style lang="scss" scoped>
.user-notifications {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0 16px 16px 16px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  font-size: 18px;
  line-height: 28px;
  color: #000000;
}
.title {
  display: flex;
  align-items: center;
}
.icon {
  display: block;
  width: 40px;
  height: 40px;
  margin-right: 10px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f1f3f4;
  flex-shrink: 0;
  transition: background-color 0.2s ease-out;

  &._inline {
    width: 24px;
    height: 24px;
  }

  .item:hover & {
    background-color: rgba(61, 123, 245, 0.08);
  }
}

.back-link,
.close-button {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 12px;
  width: 32px;
  height: 32px;
  box-sizing: content-box;
  cursor: pointer;
}

.close-button {
  right: 12px;

  & > svg {
    width: 12px;
    height: 12px;
    display: block;
    stroke-width: 2px;
    stroke: #c4c4c4;
    transition: stroke 0.2s ease-out;
  }

  &:hover {
    & > svg {
      stroke: #3d7bf5;
    }
  }
}

.back-link {
  left: 12px;

  & > svg {
    transition: fill 0.2s ease-out;
    transform: rotate(180deg);
    margin-right: 12px;
    height: 14px;
    width: 7px;
    fill: #c6cacc;
  }

  &:hover {
    & > svg {
      fill: #3d7bf5;
    }
  }
}

.content {
  max-height: 300px;
  margin-right: -16px;
  padding-right: 20px;
}
.item {
  cursor: pointer;
  display: flex;

  & + & {
    padding-top: 16px;
    margin-top: 16px;
    border-top: 1px solid #f1f3f4;
  }
}
.notification {
  line-height: 20px;
  font-size: 14px;
  flex-grow: 1;
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.subtitle {
  font-weight: 500;
  color: #000;
  letter-spacing: 0.1px;
  transition: color 0.2s ease-out;
  margin-bottom: 4px;

  .item._readed & {
    color: #919699;
  }

  .item:hover & {
    color: #3d7bf5;
  }
}
.date {
  font-size: 12px;
  color: #c6cacc;
  letter-spacing: 0.4px;
}
.text {
  color: #5e6366;
  letter-spacing: 0.25px;
  transition: color 0.2s ease-out;

  .item._readed & {
    color: #919699;
  }

  .item:hover & {
    color: #3d7bf5;
  }
}

.text-block {
  & + & {
    margin-top: 16px;
  }
}

.no-notifications {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px 0 14px;

  p {
    font-size: 14px;
    line-height: 20px;
    color: #919699;
    margin-top: 10px;
  }
}
</style>
