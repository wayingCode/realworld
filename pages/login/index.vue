<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? "Sign in" : "Sign up" }}</h1>
          <p class="text-xs-center">
            <nuxt-link v-if="isLogin" to="/register"
              >Need an account?</nuxt-link
            >
            <nuxt-link v-else to="/login">Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset v-if="!isLogin" class="form-group">
              <input
                class="form-control form-control-lg"
                v-model="user.username"
                type="text"
                required
                placeholder="Your Name"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                v-model="user.email"
                required
                type="email"
                placeholder="Email"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                v-model="user.password"
                required
                type="password"
                minlength="8"
                placeholder="Password"
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? "Sign in" : "Sign up" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from "@/api/user"

export default {
  name: "LoginIndex",
  middleware: "notAuthenticated",
  computed: {
    isLogin() {
      return this.$route.name === "login"
    },
  },
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: "",
      },
      redirectURL: "/",
      errors: {},
    }
  },
  methods: {
    async onSubmit() {
      try {
        const { data } = this.isLogin
          ? await login({
              user: this.user,
            })
          : await register({
              user: this.user,
            })
        // 保存用户的登录状态
        this.$store.commit("setUser", data.user)
        // 跳转到首页
        this.$router.push(this.redirectURL)
      } catch (err) {
        this.errors = err.response.data.errors
      }
    },
  },
  mounted() {
    if (this.$route.query.ref) {
      this.redirectURL = decodeURIComponent(this.$route.query.ref)
    }
  },
}
</script>

<style></style>
