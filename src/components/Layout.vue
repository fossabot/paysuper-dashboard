<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import { includes, findIndex, get } from 'lodash-es';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import getMerchantMainNavItems from '@/helpers/getMerchantMainNavItems';
import getAdminMainNavItems from '@/helpers/getAdminMainNavItems';
import LayoutMainNavDefault from '@/components/LayoutMainNavDefault.vue';
import LayoutHeader from '@/components/LayoutHeader.vue';
import LayoutSpecialNavProgress from '@/components/LayoutSpecialNavProgress.vue';
import LayoutSpecialNavBackLink from '@/components/LayoutSpecialNavBackLink.vue';
import LayoutTopControlsDatepicker from '@/components/LayoutTopControlsDatepicker.vue';

export default {
  name: 'Layout',
  components: {
    LayoutMainNavDefault,
    LayoutHeader,
    LayoutSpecialNavProgress,
    LayoutSpecialNavBackLink,
    LayoutTopControlsDatepicker,
    Loading,
  },
  data() {
    return {
      projectName: 'CD Projects',
    };
  },
  computed: {
    ...mapState(['isLoading']),
    ...mapState('User', ['role']),
    ...mapState('User/Merchant', ['merchant']),
    currentNavigationItem() {
      return findIndex(this.mainNavItems, item => includes(item.routeNames, this.$route.name));
    },

    mainNavItems() {
      if (this.role === 'admin') {
        return getAdminMainNavItems();
      }
      return getMerchantMainNavItems({
        hasMerchant: this.merchant ? !!this.merchant.id : false,
      });
    },
  },
  mounted() {
    this.$appEventsOn('updateContentScroll', () => {
      this.$nextTick(() => {
        this.$refs.contentScrollbox.update();
      });
    });
  },
  methods: {
    get,
    isComponent(component) {
      const type = typeof component;
      if (type === 'function') {
        return true;
      }
      if (type === 'object') {
        return component instanceof Vue;
      }
      return false;
    },
    getBackLink(backLink) {
      return backLink({
        store: this.$store,
        route: this.$route,
      });
    },
  },
};
</script>

<template>
<div class="template-layout">
  <LayoutHeader
    class="header"
    :projectName="projectName"
  />

  <div class="sub-header">
    <div class="special-nav">
      <LayoutSpecialNavBackLink
        v-if="get($route, 'meta.specialNav.backLink')"
        :link="getBackLink($route.meta.specialNav.backLink)"
      />
      <LayoutSpecialNavProgress
        v-if="!get($route, 'meta.specialNav')"
      />
    </div>
    <div
      v-if="isComponent(get($route, 'meta.topControls'))"
      class="top-controls"
    >
      <component :is="$route.meta.topControls" />
    </div>
  </div>

  <main class="main">
    <aside class="aside">
      <UiScrollbarBox class="scrollbox">
        <component
          v-if="isComponent(get($route, 'meta.mainNav'))"
          :is="$route.meta.mainNav"
        />
        <LayoutMainNavDefault
          v-else
          :currentItem="currentNavigationItem"
          :items="mainNavItems"
        />
      </UiScrollbarBox>
    </aside>

    <section class="content">
      <UiScrollbarBox
        class="scrollbox"
        ref="contentScrollbox"
        @ps-y-reach-end="$appEvents.$emit('contentScrollReachEnd')"
        @ps-scroll-y="$appEvents.$emit('contentScroll')"
      >
        <div class="scrollbox-inner">
          <slot />
        </div>
      </UiScrollbarBox>
    </section>
  </main>
  <Loading
    :active="isLoading"
    :is-full-page="true"
    :opacity="0.2"
  ></Loading>
</div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Quicksand:400,500|Roboto:400,500&display=swap");
.layout-body {
  margin: 0;

  * {
    box-sizing: border-box;
  }
}
.layout-body,
.layout-html {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.x-hellosign-embedded {
  z-index: 100;
}

.template-layout {
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #5e6366;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  a {
    display: inline-block;
    text-decoration: none;
    color: #78909c;
    transition: color 0.2s ease-out;

    &:hover {
      text-decoration: none;
      color: #3d7bf5;
    }
  }
  input {
    font-family: "Roboto", sans-serif;
    font-size: 14px;
    line-height: 20px;
    color: #000;
  }
  p {
    margin: 0;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  label {
    margin: 0;
  }
}
</style>

<style lang="scss" scoped>
$content-side-padding: 6vw;

.template-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.header {
  flex-shrink: 0;

  @media print {
    display: none;
  }
}
.sub-header {
  width: 100%;
  height: 56px;
  position: relative;
  z-index: 15;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
  background: #fff;
  border-bottom: 1px solid #f1f3f4;

  @media print {
    display: none;
  }
}
.top-controls,
.special-nav {
  align-items: center;
  display: flex;

  & > * {
    flex-grow: 1;
  }
}
.top-controls {
  padding-left: $content-side-padding;
  height: 100%;
}
.special-nav {
  height: 100%;
}

.special-nav,
.aside {
  position: relative;
  min-width: 260px;
  max-width: 320px;
  flex-basis: 20%;

  @media print {
    display: none;
  }
}
.main {
  display: flex;
  justify-content: space-between;
  height: 100px; // ie11 fix to force recalculate
  max-height: 100%;
  flex-grow: 1;
  min-height: 0;
}

.content,
.top-controls {
  position: relative;
  flex-basis: 80%;
  flex-grow: 1;
}

.content {
  &::after {
    position: absolute;
    left: 0;
    top: 0;
    height: 28px;
    width: calc(100% - 15px);
    content: "";
    background-image: linear-gradient(
      180deg,
      rgba(#fff, 1) 0%,
      rgba(#fff, 0.95) 20%,
      rgba(#fff, 0.85) 40%,
      rgba(#fff, 0.65) 60%,
      rgba(#fff, 0) 100%
    );
    pointer-events: none;
  }
}
.scrollbox {
  height: 100%;
  width: 100%;
}
.scrollbox-inner {
  margin: 37px $content-side-padding;
  max-width: 920px;
}
</style>
