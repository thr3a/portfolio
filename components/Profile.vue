<template>
  <div class="columns" id="profile">
    <div class="column is-6">
      <section class="hero is-primary is-medium">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">Profile</h1>
          </div>
        </div>
      </section>
    </div>
    <div class="column is-6 is-vcentered">
      <div class="main">
        <table class="table is-fullwidth is-striped is-bordered">
          <tbody>
            <tr>
              <td class="left">名前</td>
              <td class="right">あまねきー</td>
            </tr>
            <tr>
              <td>すみか</td>
              <td>Tokyo</td>
            </tr>
            <tr>
              <td>言語</td>
              <td>RubyとかPythonとか</td>
            </tr>
            <tr>
              <td>エディタ</td>
              <td>サクラエディタ→Geany→Sublime Text→Atom→VS Code</td>
            </tr>
          </tbody>
        </table>
        <p>ブログの進捗</p>
        <div class="is-centered">
          <img src="http://hatena.turai.work/grass?url=http://thr3a.hatenablog.com/" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
tr.left {
  width: 30%;
}
tr.right {
  width: 70%;
}
</style>
