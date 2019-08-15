<template>
  <section class="section">
    <div class="container">
      <Header />
      <logo />
      <profile />
      <works />
      <links />
    </div>
  </section>
</template>

<script>
import Profile from '~/components/Profile.vue'
import Links from '~/components/Links.vue'
import Works from '~/components/Works.vue'
import Header from '~/components/Header.vue'
import Logo from '~/components/Logo.vue'
export default {
  components: {
    Profile,
    Links,
    Works,
    Header,
    Logo
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
