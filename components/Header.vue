<template>
  <section class="section">
    <div class="header">
      <div class="columns is-multiline is-mobile">
        <div class="column is-6-mobile" v-for="(name, index) in menu" :key="index">
          <h1 class="subtitle is-3 has-text-centered">
            <nuxt-link v-scroll-to="'#'+name.toLowerCase()" to="#">{{ name }}</nuxt-link>
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
      menu: ['Profile', 'Works', 'Links']
    }
  }
}
</script>

<style scoped>
.header {
  top: 0;
  left: 0;
  position: fixed;
  width:100%;
  z-index: 334;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
