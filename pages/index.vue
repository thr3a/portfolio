<template>
  <div class="container">
    <Header />
    <profile />
    <works />
    <links />
  </div>
</template>

<script>
import Profile from '~/components/Profile.vue'
import Links from '~/components/Links.vue'
import Works from '~/components/Works.vue'
import Header from '~/components/Header.vue'
export default {
  components: {
    Profile, Links, Works, Header
  }
}
</script>

<style>
.hero {
  height: 100%;
}
.main {
  margin-top: 25px;
}
.container {
  padding-bottom: 100px;
}
</style>
