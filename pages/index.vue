<template>
  <div>
    <Header />
    <logo />
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
.section {
  padding-top: 0;
}
.container {
  max-width: 1000px;
}
</style>
