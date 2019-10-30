<script>
import PicturePapersCheckingProgress from '@/components/PicturePapersCheckingProgress.vue';
import TestingTag from '@/components/TestingTag.vue';

export default {
  name: 'ProjectSalesOptionsPage',

  components: {
    PicturePapersCheckingProgress,
    TestingTag,
  },

  methods: {
    configure(name) {
      this.$router.push({ name });
    },
  },
};
</script>

<template>
<div>
  <UiPageHeaderFrame>
    <template slot="title">
      Sales options
    </template>
    <template slot="description">
      This is the main page, where you configure sales options for your project.
      Any sales option may be enabled only after successful integration testing in Webhooks section.
    </template>
    <PicturePapersCheckingProgress slot="picture" />
  </UiPageHeaderFrame>

  <UiPanel>
    <section class="section">
      <div>
        <UiHeader
          :hasMargin="true"
          level="3"
        >
          Virtual currency
        </UiHeader>
        <UiText class="text">
          Virtual Currency is an option to sell your in-game currency —
          <b>gold, coins, etc.</b>
        </UiText>
      </div>
      <div class="section-aside">
        <UiButton
          class="button"
          @click="configure('ProjectVirtualCurrency')"
        >
          CONFIGURE
        </UiButton>
      </div>
    </section>
  </UiPanel>

  <UiPanel>
    <section class="section">
      <div>
        <UiHeader
          :hasMargin="true"
          level="3"
        >
          Virtual items
        </UiHeader>
        <UiText class="text">
          This sales option will allow you to sell your Virtual Items, like
          <b>swords, guns, helmets</b> and virtual currency packs.
        </UiText>
      </div>
      <div class="section-aside">
        <UiButton
          class="button"
          @click="configure('ProjectVirtualItems')"
        >
          CONFIGURE
        </UiButton>
      </div>
    </section>
  </UiPanel>

  <UiPanel>
    <section class="section">
      <div>
        <UiHeader
          :hasMargin="true"
          level="3"
        >
          Game keys
          <TestingTag class="tag" v-if="false" />
        </UiHeader>
        <UiText class="text">
          This sales method is intended <b>to sell game keys</b> for specific
          DRM platforms, sending your customers e-mail with a key.
        </UiText>
      </div>
      <div class="section-aside">
        <UiButton
          class="button"
          @click="configure('ProjectKeyProductsList')"
        >
          CONFIGURE
        </UiButton>
      </div>
    </section>
  </UiPanel>
</div>
</template>


<style lang="scss" scoped>
.section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.text {
  max-width: 400px;
}

.section-aside {
  display: flex;
  align-items: center;
}

.tag {
  margin-left: 8px;
}
</style>
