<template>
  <div class="header">
    <div class="tile is-ancestor">
      <div class="tile is-parent is-3" v-for="(name, index) in menu" :key="index">
        <div class="tile is-child box notification has-background-white has-text-grey-darker">
          <h2 class="title has-text-centered">
            <nuxt-link v-scroll-to="'#'+name.toLowerCase()" to="#">{{ name }}</nuxt-link>
          </h2>
        </div>
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
.header {
  top: 0;
  position: sticky;
}
</style>
