<template>
  <div class="main-wrapper">
    <PageNavbar
      title="Pay Super"
      :navigationLinks="navigationLinks"
      :logoLink="logoLink"
      :isAuthorised="Boolean(user)"
      :userName="user ? user.email : ''"
    >
      <IconLogo slot="logo" />
    </PageNavbar>
    <div>
      <nuxt/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { PageNavbar } from '@protocol-one/ui-kit';
import IconLogo from '@/components/IconLogo.vue';

export default {
  name: 'LayoutDefault',

  components: { IconLogo, PageNavbar },

  data() {
    return {
      logoLink: {
        router: true,
        url: '/',
      },
    };
  },

  computed: {
    ...mapState(['user']),
    ...mapState('merchant', ['merchant']),

    navigationLinks() {
      let links = [
        {
          label: 'Dashboard',
          url: '/dashboard',
          router: true,
          name: 'dashboard',
        },
        {
          label: 'Merchant',
          url: '/merchant',
          router: true,
          name: 'merchant',
        },
        {
          label: 'Projects',
          url: '/project',
          router: true,
          name: 'project',
        },
      ];

      if (this.merchant && this.merchant.status >= 1) {
        links = [
          ...links,
          {
            label: 'Transactions search',
            url: '/order',
            router: true,
            name: 'order',
          },
          {
            label: 'Revenue',
            url: '/revenue',
            router: true,
            name: 'revenue',
          },
        ];
      }

      return links.map((item) => {
        if (item.name === this.$nuxt.$route.name) {
          return {
            ...item,
            isActive: true,
          };
        }

        return item;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-wrapper {
  margin-left: 80px;
  background: #fff;
}
</style>
