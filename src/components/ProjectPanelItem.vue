<script>
import { get } from 'lodash-es';
import { format } from 'date-fns';
import { directive as clickaway } from 'vue-clickaway';

export default {
  name: 'ProjectPanelItem',

  directives: {
    clickaway,
  },

  props: {
    project: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      isMenuOpened: false,
    };
  },

  computed: {
    projectCardUrl() {
      return `/projects/${this.project.id}`;
    },
    date() {
      const datetime = new Date(this.project.updated_at.seconds * 1000);
      return format(datetime, 'd MMM yyyy, HH:mm');
    },
    isInactive() {
      return this.project.status === 4;
    },
    image() {
      return get(this.project, 'cover.images.en', '');
    },
  },

  methods: {
    closeMenu() {
      this.isMenuOpened = false;
    },
  },
};
</script>

<template>
<div class="project-panel-item" :class="{ '_no-image': !image }">
  <span
    class="menu-opener-holder"
  >
    <span
      class="menu-opener"
      :class="{'_opened': isMenuOpened}"
      v-clickaway="closeMenu"
      @click="isMenuOpened = !isMenuOpened"
    >
      <IconThreeVerticalDots />
    </span>
    <span class="menu-tip-holder">
      <UiTip
        innerPosition="left"
        position="bottom"
        width="210px"
        :visible="isMenuOpened"
        :closeDelay="0"
        :stayOpenedOnHover="false"
      >
        <UiTooltipMenuItem
          iconComponent="IconPen"
          @click="$navigate(projectCardUrl)"
        >
          Edit
        </UiTooltipMenuItem>
        <UiTooltipMenuItem
          v-if="isInactive"
          iconComponent="IconPlayTriangle"
          @click="$emit('activate', project.id)"
        >
          Activate
        </UiTooltipMenuItem>
        <UiTooltipMenuItem
          v-else
          iconComponent="IconDeactivate"
          type="delete"
          @click="$emit('deactivate', project.id)"
        >
          Deactivate
        </UiTooltipMenuItem>
      </UiTip>
    </span>
  </span>
  <router-link
    class="link"
    :to="projectCardUrl"
  >
    <header class="header">
      <span class="status" v-if="isInactive">
        INACTIVE
      </span>
      <div
        class="picture"
        :style="{backgroundImage: `url(${image})`}"
      >
        <IconNoImage v-if="!image" />
      </div>
    </header>
    <div class="content">
      <UiHeader class="title" level="3">{{project.name.en}}</UiHeader>
      <div class="id">ID {{project.id}}</div>
      <div class="list">
        <div class="list-item">
          0 subscriptions
        </div>
        <div class="list-item">
          {{project.products_count}} virtual items
        </div>
      </div>
      <div class="date">{{date}}</div>
      <IconThinRightArrow class="arrow-right" />
    </div>
  </router-link>
</div>
</template>

<style lang="scss" scoped>
$hover-text-color: #3d7bf5;
$hover-background-color: rgba($hover-text-color, 0.1);
$hover-deactivate-text-color: #ea3d2f;
$hover-deactivate-background-color: rgba($hover-deactivate-text-color, 0.08);

.project-panel-item {
  position: relative;
  background: #ffffff;
  box-shadow: 0px 1px 2px rgba(8, 35, 48, 0.24),
    0px 2px 6px rgba(8, 35, 48, 0.16);
  border-radius: 12px;
}

.menu-opener-holder {
  position: absolute;
  z-index: 5;
  right: 0;
  top: 6px;
}

.menu-opener {
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  fill: #fff;

  & > svg {
    transition: fill 0.2s ease-out;
  }

  &:hover,
  &._opened {
    svg {
      fill: rgba(#fff, 0.5);
    }
  }

  .project-panel-item._no-image & {
    & > svg {
      fill: #78909c;
    }

    &:hover,
    &._opened {
      svg {
        fill: rgba(#78909c, 0.5);
      }
    }
  }
}

.menu-tip-holder {
  position: absolute;
  top: 16px;
  right: 24px;
}

.menu-list {
  border-radius: 4px;
  padding: 12px 0;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
}

.menu-item {
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  cursor: pointer;
  padding: 0 8px;
  height: 32px;
  transition: all 0.2s ease-out;
  display: flex;
  align-items: center;

  &._deactivate {
    color: $hover-deactivate-text-color;

    .menu-icon > svg {
      fill: $hover-deactivate-text-color;
    }
  }

  &:hover {
    &:not(._deactivate) {
      background: $hover-background-color;
      color: $hover-text-color;

      .menu-icon > svg {
        fill: $hover-text-color;
      }
    }

    &._deactivate {
      background: $hover-deactivate-background-color;
    }
  }
}

.menu-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  padding-bottom: 1px;
  margin-right: 4px;
}

.link {
  text-decoration: none;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  &:hover {
    .arrow-right {
      opacity: 1;
    }
  }
}

.header {
  position: relative;
}

.status {
  position: absolute;
  left: 10px;
  top: 11px;
  height: 30px;
  border-radius: 15px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.25);
  letter-spacing: 1.5px;
  color: #ffffff;
  font-size: 10px;
  line-height: 30px;
  font-weight: 500;

  .project-panel-item._no-image & {
    background: rgba(0, 0, 0, 0.06);
    color: #78909c;
  }
}

.title {
  .link:hover & {
    color: $hover-text-color;
  }
}

.picture {
  border-radius: 12px 12px 0px 0px;
  height: 212px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;

  .project-panel-item._no-image & {
    background: #f1f3f4;
  }
}

.content {
  padding: 16px;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
}

.id,
.date {
  color: #919699;
  font-size: 12px;
  line-height: 16px;
}

.list {
  margin: 12px 0 6px;
  min-height: 60px;
}
.list-item {
  padding-left: 21px;
  position: relative;

  &::before {
    display: block;
    left: 8px;
    top: 7px;
    position: absolute;
    background: #3e4345;
    content: "";
    width: 3px;
    height: 3px;
    border-radius: 50%;
    box-shadow: 0 0 0 1px #3e4345;
  }
}

.arrow-right {
  position: absolute;
  right: 6px;
  bottom: 6px;
  opacity: 0;
  transition: opacity 0.2s ease-out;
}
</style>
