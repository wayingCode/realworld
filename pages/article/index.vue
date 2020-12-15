<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>
        <article-meta @favoritePost="favoritePost" @setState="setState" @followPost="followPost" :article="article" />
      </div>
    </div>
    <div class="container page">
      <div class="row article-content">
        <div
          class="col-md-12"
          v-html="article.body"
        ></div>
      </div>
      <hr />
      <div class="article-actions">
        <article-meta @favoritePost="favoritePost" @setState="setState" @followPost="followPost" :article="article" />
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <article-comments :article="article"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticle } from "@/api/article";
import MarkdownIt from "markdown-it";
import ArticleMeta from "./components/article-meta";
import ArticleComments from './components/article-comments'
export default {
  name: "ArticleIndex",
  async asyncData({ params }) {
    const { data } = await getArticle(params.slug);
    const { article } = data;
    const md = new MarkdownIt();
    article.body = md.render(article.body);
    article.following = false
    article.favoriting = false
    return {
      article,
    };
  },
  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description
        }
      ]
    }
  },
  methods: {
    favoritePost(favoritesCount, favorited) {
      this.article.favoritesCount = favoritesCount
      this.article.favorited = favorited
    },
    followPost(following) {
      this.article.author.following = following
    },
    setState(key, value) {
      this.article[key] = value
    }
  },
  components: {
    ArticleMeta,
    ArticleComments
  },
};
</script>

<style>
</style>