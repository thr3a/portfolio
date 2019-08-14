<template>
  <div class="columns" id="works">
    <div class="column is-6">
      <section class="hero is-info is-medium">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">Works</h1>
          </div>
        </div>
      </section>
    </div>
    <div class="column is-6 is-vcentered">
      <div class="main">
        <div class="tile is-ancestor" v-for="(work, index) in works" :key='index'>
          <div class="tile is-parent">
            <div class="tile is-child box">
              <p class="title">
                <a v-bind:href="work.url" target="_blank">{{ work.name}}</a></p>
              <p>{{ work.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      works: [
        {
          name: "年収格付けチェッカー",
          url: "http://salary.turai.work/",
          description: "年収が平均年収と比較して高いか低いかをチェックするツール。e-Statsの賃金構造基本統計調査を使用"
        },
        {
          name: "ニコ動タイムマシン",
          url: "http://niconico.turai.work/",
          description: "10年前の今日にニコニコ動画に投稿された動画を振り返るサイト"
        },
        {
          name: "はてなブログ芝生",
          url: "http://hatena.turai.work/",
          description: "はてなブログの投稿数でGithubのような芝生を作成 緑を増やしていけ"
        },
        {
          name: "スプラトゥーンライブ検索",
          url: "https://spla-lives.now.sh/",
          description: "Youtubeの「スプラトゥーン実況だけ」のライブ動画を検索できるサイト"
        },
        {
          name: "ダミー電話番号生成器",
          url: "https://thr3a.github.io/phone_number_generator/",
          description: "使われてない電話番号帯域からランダムに云々 ネーミングセンスのNASA"
        },
        {
          name: "ua-factory",
          url: "https://ua-factory.firebaseapp.com/",
          description: "PCやスマホのユーザーエージェントをランダム生成しまくるサイト テストに使える（使えるとは言ってない"
        },
        // {
        //   name: "",
        //   url: "",
        //   description: ""
        // },
        // {
        //   name: "",
        //   url: "",
        //   description: ""
        // },
      ]
    }
  }
}
</script>

<style scoped>
</style>
