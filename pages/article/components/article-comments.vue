<template>
  <div>
    <form class="card comment-form" @submit.prevent="onSubmit">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          required
          minlength="10"
          :disabled="!user"
          v-model="comment.body"
        ></textarea>
      </div>
      <div class="card-footer">
        <img
          :src="user ? user.image : 'https://static.productionready.io/images/smiley-cyrus.jpg'"
          class="comment-author-img"
        />
        <button
          class="btn btn-sm btn-primary"
          :disabled="!user || posting"
        >
          Post Comment
        </button>
      </div>
    </form>
    <div
      class="card"
      v-for="comment in comments"
      :key="comment.id"
    >
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }"
          class="comment-author"
        >
          <img
            :src="comment.author.image"
            class="comment-author-img"
          />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }"
          class="comment-author"
        >
          {{comment.author.username}}
        </nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date('MM DD, YYYY')}}</span>
        <span class="mod-options" v-if="user && (comment.author.username === user.username)" @click="removeComment(article.slug, comment)">
          <i class="ion-trash-a"></i>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getComments, addComment, deleteComment } from "@/api/article";
export default {
  name: "ArticleComments",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      comments: [],
      comment: {
        body: ''
      },
      posting: false
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async getArticleComments() {
      const { data } = await getComments(this.article.slug);
      this.comments = data.comments;
      this.comments.forEach(comment => {
        if(comment.author.username === this.user.username) {
          comment.removing = false
        }
      })
    },
    async onSubmit() {
      this.posting = true
      const { slug } = this.article
      const { data } = await addComment(slug, {
        comment: this.comment
      })
      this.comment.body = ''
      this.posting = false
      this.getArticleComments()
    },
    async removeComment(slug, comment) {
      if(comment.removing) return
      comment.removing = true
      await deleteComment(slug, comment.id)
      this.comments = this.comments.filter(item => item.id !== comment.id)
    }
  },
  async mounted() {
    // 获取文章评论列表
    this.getArticleComments()
  },
};
</script>
<style scoped>
</style>