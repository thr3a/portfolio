<template>
  <div class="header">
    <div class="columns is-multiline is-mobile">
      <div class="column is-6-mobile" v-for="(name, index) in menu" :key="index">
        <h2 class="title has-text-centered">
          <nuxt-link v-scroll-to="'#'+name.toLowerCase()" to="#">{{ name }}</nuxt-link>
        </h2>
      </div>
    </div>
  </div>
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
/* .header {
  top: 0;
  position: sticky;
  margin-bottom: 30px;
} */
</style>
