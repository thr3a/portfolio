<template>
  <section class="section">
    <div class="container">
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
            <div class="tile is-ancestor" v-for="(work, index) in works" :key="index">
              <div class="tile is-parent">
                <div class="tile is-child box">
                  <p class="title">
                    <a v-bind:href="work.url" target="_blank">{{ work.name}}</a>
                  </p>
                  <p>{{ work.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data: function() {
    return {
      works: [
        {
          name: '生涯費用シミュレーター',
          url: 'https://cost.turai.work/',
          description:
            '毎月/毎年の費用を入力すると生涯いくら掛かるのか算出するツール。保険金のためにつくったけどNHK受信料ハンパないな'
        },
        {
          name: '年収格付けチェッカー',
          url: 'https://salary.turai.work/',
          description:
            '年収が平均年収と比較して高いか低いかをチェックするツール。e-Statsの賃金構造基本統計調査を使用'
        },
        {
          name: "Twitter検索ヘルパー",
          url: "https://twisearch-helper.firebaseapp.com",
          description: "画像付ツイートのみやバズってるツイートのみにフィルタリングしてTwitter検索できるサイトこれもBulma"
        },
        {
          name: 'ニコ動タイムマシン',
          url: 'https://niconico.turai.work/',
          description:
            '10年前の今日にニコニコ動画に投稿された動画を振り返るサイト'
        },
        {
          name: 'はてなブログ芝生',
          url: 'https://hatena.turai.work/',
          description:
            'はてなブログの投稿数でGithubのような芝生を作成 緑を増やしていけ'
        },
        {
          name: 'スプラトゥーンライブ検索',
          url: 'https://spla-lives.now.sh/',
          description:
            'Youtubeの「スプラトゥーン実況だけ」のライブ動画を検索できるサイト'
        },
        {
          name: 'ダミー電話番号生成器',
          url: 'https://thr3a.github.io/phone_number_generator/',
          description:
            '使われてない電話番号帯域からランダムに云々 ネーミングセンスのNASA'
        },
        {
          name: 'ua-factory',
          url: 'https://ua-factory.firebaseapp.com/',
          description:
            'PCやスマホのユーザーエージェントをランダム生成しまくるサイト テストに使える（使えるとは言ってない'
        }
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
