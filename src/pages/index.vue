<script>
import { mapState } from 'vuex';
import { UiButton } from '@protocol-one/ui-kit';
import IconComputer from '@/components/IconComputer.vue';

export default {
  components: {
    IconComputer, UiButton,
  },

  computed: {
    ...mapState('User', ['isAuthorised']),
  },

  created() {
    if (this.isAuthorised) {
      this.$router.push({ name: 'Dashboard' });
    }
  },

  methods: {
    goAuthoriseOrRegister() {
      this.$router.push({ name: 'Login', query: { redirect: this.$route.query.redirect } });
    },
  },
};
</script>

<template>
  <div class="auth-board">
    <IconComputer />
    <span
      v-html="$t('title')"
      class="title"
    />
    <span
      class="text"
      v-html="$t('text')"
    />
    <UiButton
      class="button"
      :text="$t('buttonText')"
      @click="goAuthoriseOrRegister"
    />
    <!-- <UiButton
      class="button"
      :isTransparent="true"
      :text="$t('buttonLogin')"
      @click="showAuth('login')"
    /> -->

  </div>
</template>

 <style lang="scss" scoped>
.auth-board {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  color: #b1b1b1;
  flex: 1;
}
.title {
  font-weight: bold;
  font-size: 20px;
  margin: 0;
  display: block;
  margin-top: 12px;
}
.text {
  display: block;
  font-size: 14px;
  margin-top: 8px;
  margin-bottom: 16px;
  text-align: center;
}
.button {
  margin-bottom: 8px;
}
</style>

<i18n>
{
  "en": {
    "title": "Unsigned user can’t browse any projects",
    "text": "Please create new account on sign in if you have one",
    "buttonText": "Sign in or Sign up"
  },
  "ru": {
    "title": "Незарегестрированные пользователи не могут просматрить проекты",
    "text": "Создайте новую учетную запись или войдите с имеющейся",
    "buttonText": "Войти или Зарегистрироваться"
  }
}
</i18n>
