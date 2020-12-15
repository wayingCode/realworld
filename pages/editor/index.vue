<template>
    <div class="editor-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-10 offset-md-1 col-xs-12">
                    <form @submit.prevent="onSubmit">
                        <fieldset>
                            <fieldset class="form-group">
                                <input
                                    type="text"
                                    class="form-control form-control-lg"
                                    v-model="article.title"
                                    placeholder="Article Title"
                                    :disabled="posting"
                                    required
                                />
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="article.description"
                                    placeholder="What's this article about?"
                                    :disabled="posting"
                                    required
                                />
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea
                                    class="form-control"
                                    rows="8"
                                    v-model="article.body"
                                    placeholder="Write your article (in markdown)"
                                    :disabled="posting"
                                    required
                                ></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="tags"
                                    placeholder="Enter tags"
                                    :disabled="posting"
                                />
                                <div class="tag-list"></div>
                            </fieldset>
                            <button
                                class="btn btn-lg pull-xs-right btn-primary"
                                :disabled="posting"
                            >
                                Publish Article
                            </button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { createArticle, updateArticle, getArticle } from "@/api/article"
export default {
    name: "EditorIndex",
    middleware: "authenticated",
    async asyncData({ params }) {
        let article = {
            title: "",
            description: "",
            body: "",
            tagList: [],
        }
        let tags = ""
        const { slug } = params
        if (slug) {
            const { data } = await getArticle(slug)
            article = data.article
            tags = article.tagList.join(" ")
        }
        return {
            slug,
            article,
            tags,
            posting: false,
        }
    },
    watch: {
        tags(v) {
            this.article.tagList = v.trim().split(/\s+/)
        },
    },
    methods: {
        async onSubmit() {
            this.posting = true
            const { data } = this.slug
                ? await updateArticle(this.slug, this.article)
                : await createArticle(this.article)
            const { slug } = data.article
            this.$router.push({ name: "article", params: { slug } })
        },
    },
}
</script>

<style></style>
