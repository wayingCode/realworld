<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button
              class="btn btn-sm btn-outline-secondary action-btn"
              @click="followAuthor"
              :disabled="following"
              v-if="!user || (user && user.username !== profile.username)"
            >
              <i class="ion-plus-round"></i>
              &nbsp; {{ profile.following ? "Unfollow" : "Follow" }}
              {{ profile.username }}
            </button>
            <nuxt-link
              class="btn btn-sm btn-outline-secondary action-btn"
              v-else
              to="/settings"
            >
              <i class="ion-gear-a"></i>
              &nbsp; Edit Profile Settings
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === '' }"
                  :to="{
                    name: 'profile',
                    params: { username: profile.username },
                  }"
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{ active: tab === 'favorites' }"
                  :to="{
                    name: 'profile',
                    params: { username: profile.username, tab: 'favorites' },
                  }"
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>
          <!-- 文章列表 -->
          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <a href=""><img :src="article.author.image"/></a>
              <div class="info">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: { username: article.author.username },
                  }"
                  class="author"
                  >{{ article.author.username }}</nuxt-link
                >
                <span class="date">{{
                  article.createAt | date("MMM DD")
                }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                @click="onFavorite(article)"
                :class="{ active: article.favorited }"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              :to="{ name: 'article', params: { slug: article.slug } }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser, followUser, unfollowUser } from "@/api/user"
import { getArticles, addFavorite, deleteFavorite } from "@/api/article"
import { mapState } from "vuex"
export default {
  name: "UserProfile",
  middleware: "authenticated",
  async asyncData({ params, query }) {
    let { username, tab } = params
    tab = tab ? tab : ""
    const page = Number.parseInt(query.page || 1)
    const limit = 5

    let articlesParams = {
      limit,
      offset: (page - 1) * limit,
    }
    if (tab === "") {
      articlesParams.author = username
    } else {
      articlesParams.favorited = username
    }

    const ret = await Promise.all([
      getUser(username),
      getArticles(articlesParams),
    ])

    const [profileData, articlesData] = ret

    const { profile } = profileData.data
    const { articles } = articlesData.data
    articles.forEach((article) => {
      article.favoriteDisabled = false
    })

    return {
      profile,
      tab,
      articles,
      following: false,
    }
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async onFavorite(article) {
      article.favoriteDisabled = true
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
        // 添加点赞
      }
      article.favoriteDisabled = false
    },
    async followAuthor() {
      this.following = true
      if (!this.user) {
        const path = this.$route.path
        this.$router.push({
          name: "login",
          query: { ref: encodeURIComponent(path) },
        })
        return
      }
      const { username } = this.profile.username
      const { data } = this.profile.following
        ? await unfollowUser(username)
        : await followUser(username)
      this.profile.following = data.profile.following
      this.following = false
    },
  },
}
</script>

<style></style>
