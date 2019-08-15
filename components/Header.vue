<template>
  <section class="section">
    <div class="header-container" id="index">
      <div class="columns is-multiline is-mobile" id="header">
        <div class="column is-6-mobile" v-for="(name, index) in menu" :key="index">
          <h1 class="subtitle is-4 has-text-centered">
          <div v-if="index == 0">
            <nuxt-link
              v-scroll-to="{ el: `#${name.toLowerCase()}`}"
              to="#"
            >{{ name }}</nuxt-link>
          </div>
          <div v-else>
            <nuxt-link
              v-scroll-to="{ el: `#${name.toLowerCase()}`, offset: -headerHeight}"
              to="#"
            >{{ name }}</nuxt-link>
          </div>
          </h1>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data: function() {
    return {
      menu: ['Index', 'Profile', 'Works', 'Links'],
      headerHeight: 0
    }
  },
  mounted: function() {
    // ヘッダーの高さを取得してスクロール時のoffsetに入れることで、コンテンツが隠れないように
    this.headerHeight = document.getElementById('header').offsetHeight
  }
}
</script>

<style scoped>
.header-container {
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  z-index: 334;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
