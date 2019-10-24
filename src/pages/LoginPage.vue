<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'LoginPage',

  computed: {
    ...mapState(['config']),
    ...mapGetters('User', ['authIframeSrc']),
  },

  created() {
    this.listenToMessages();
  },

  methods: {
    ...mapActions('User', ['initState', 'setAccessToken']),
    listenToMessages() {
      window.addEventListener('message', async (event) => {
        if (!event.data || event.data.source !== 'PAYSUPER_MANAGEMENT_SERVER') {
          return;
        }

        if (event.data.access_token && event.data.success) {
          this.setAccessToken(event.data.access_token);
          await this.initState();
          this.redirectOnSuccessfulAuth();
        }

        if (event.data.error === 'user-already-logged') {
          this.redirectOnSuccessfulAuth();
        }
      });
    },

    redirectOnSuccessfulAuth() {
      if (this.$route.query.redirect) {
        this.$router.push({ path: this.$route.query.redirect });
      } else {
        this.$router.push({ path: '/dashboard' });
      }
    },
  },
};
</script>

<template>
  <div class="login-page">
    <iframe class="iframe" width="360" height="500" :src="authIframeSrc" frameborder="0"></iframe>
  </div>
</template>


<style lang="scss" scoped>
.login-page {
  display: flex;
  justify-content: center;
}

.iframe {
  margin-top: 20px;
}
</style>
