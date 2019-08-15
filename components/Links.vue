<template>
  <section class="section">
    <div class="container">
      <div class="columns" id="links">
        <div class="column is-6">
          <section class="hero is-danger is-small">
            <div class="hero-body">
              <div class="container">
                <h1 class="title">Links</h1>
              </div>
            </div>
          </section>
        </div>
        <div class="column is-6 is-vcentered">
          <div>
            <table class="table is-fullwidth">
              <tbody>
                <tr v-for="(l, index) in links" :key="index">
                  <td class="left">
                    <p class="has-text-right link-text has-text-dark">
                      <i v-bind:class="l.class"></i>
                    </p>
                  </td>
                  <td class="right">
                    <a class="link-text" v-bind:href="l.url" target="_blank">{{ l.label }}</a>
                  </td>
                </tr>
              </tbody>
            </table>
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
      links: [
        {
          url: 'https://twitter.com/amanekey',
          class: 'fab fa-twitter',
          label: 'Twitter'
        },
        {
          url: 'https://thr3a.hatenablog.com/',
          class: 'fas fa-rss',
          label: 'Blog'
        },
        {
          url: 'https://github.com/thr3a',
          class: 'fab fa-github',
          label: 'Github'
        },
        {
          url: 'https://qiita.com/amanekey',
          class: 'fas fa-book',
          label: 'Qiita'
        }
      ]
    }
  }
}
</script>

<style scoped>
td.left {
  width: 30%;
}
td.right {
  width: 70%;
}
.link-text {
  font-size: 28px;
}
.link-icon {
  color: #fecb81;
}
</style>
