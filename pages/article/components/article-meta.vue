<template>
    <div class="article-meta">
        <nuxt-link
            :to="{
                name: 'profile',
                params: {
                    username: article.author.username,
                },
            }"
        >
            <img :src="article.author.image" />
        </nuxt-link>
        <div class="info">
            <nuxt-link
                :to="{
                    name: 'profile',
                    params: {
                        username: article.author.username,
                    },
                }"
                class="author"
            >
                {{ article.author.username }}
            </nuxt-link>
            <span class="date">{{
                article.createAt | date("MMM DD, YYYY")
            }}</span>
        </div>
        <button
            v-if="!user || (user && user.username !== article.author.username)"
            class="btn btn-sm btn-outline-secondary"
            :class="{
                active: article.author.following,
            }"
            @click="followAuthor"
            :disabled="article.following"
        >
            <i class="ion-plus-round"></i>
            &nbsp; {{ article.author.following ? "Unfollow" : "Follow" }}
            {{ article.author.username }}
            <span class="counter"></span>
        </button>
        &nbsp;&nbsp;
        <button
            v-if="!user || (user && user.username !== article.author.username)"
            class="btn btn-sm btn-outline-primary"
            :class="{
                active: article.favorited,
            }"
            @click="favoritePost"
            :disabled="article.favoriting"
        >
            <i class="ion-heart"></i>
            &nbsp; {{ article.favorited ? "Unfavorite" : "Favorite" }} Article
            <span class="counter">({{ article.favoritesCount }})</span>
        </button>
        <nuxt-link
            v-if="user && user.username === article.author.username"
            class="btn btn-outline-secondary btn-sm"
            :to="{ name: 'editor', params: { slug: article.slug } }"
        >
            <i class="ion-edit"></i>
            &nbsp; Edit Article
        </nuxt-link>
        &nbsp;&nbsp;
        <button
            v-if="user && user.username === article.author.username"
            :disabled="removing"
            class="btn btn-outline-danger btn-sm"
            @click="removeArticle"
        >
            <i class="ion-trash-a"></i>
            &nbsp; Delete Article
        </button>
    </div>
</template>

<script>
import {
    favoriteArticle,
    unfavoriteArticle,
    deleteArticle,
} from "@/api/article"
import { followUser, unfollowUser } from "@/api/user"
import { mapState } from "vuex"
export default {
    name: "ArticleMeta",
    data() {
        return {
            removing: false,
        }
    },
    props: {
        article: {
            type: Object,
            required: true,
        },
    },
    computed: {
        ...mapState(["user"]),
    },
    methods: {
        async favoritePost() {
						if(!this.user) {
							const path = this.$route.path
							this.$router.push({name: 'login', query: {ref: encodeURIComponent(path)}})
							return
						}
            this.$emit("setState", "favoriting", true)
            const { slug } = this.article
            const { data } = this.article.favorited
                ? await unfavoriteArticle(slug)
                : await favoriteArticle(slug)
            const { favoritesCount, favorited } = data.article
            this.$emit("favoritePost", favoritesCount, favorited)
            this.$emit("setState", "favoriting", false)
        },
        async followAuthor() {
						if(!this.user) {
							const path = this.$route.path
							this.$router.push({name: 'login', query: {ref: encodeURIComponent(path)}})
							return
						}
            this.$emit("setState", "following", true)
            const { username } = this.article.author
            const { data } = this.article.author.following
                ? await unfollowUser(username)
                : await followUser(username)
            this.$emit("followPost", data.profile.following)
            this.$emit("setState", "following", false)
        },
        async removeArticle() {
            this.removing = true
            const { data } = await deleteArticle(this.article.slug)
						this.$router.push({name:'home'})
            this.removing = false
        },
    },
}
</script>
<style></style>
