<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  v-model="user.image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="user.username"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="user.bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                  v-model="user.email"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  v-model="user.password"
                  required
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentUser, updateUser } from "@/api/user"
import { mapMutations } from "vuex"
export default {
  name: "SettingsIndex",
  middleware: "authenticated",
  async asyncData() {
    const { data } = await getCurrentUser()
    let { user } = data
    return {
      user: {
        image: user.image,
        email: user.email,
        bio: user.bio,
        username: user.username,
        password: "",
      },
      errors: {},
    }
  },
  methods: {
    ...mapMutations(['setUser']),
    async onSubmit() {
      const { data } = await updateUser(this.user)
      this.$router.push({
        name: "profile",
        params: { username: data.user.username },
      })
    },
    logout() {
      this.setUser(null)
      this.$router.push({
        name: 'home'
      })
    },
  },
}
</script>

<style></style>
