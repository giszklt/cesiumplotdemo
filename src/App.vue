<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style lang="scss" rel="stylesheet/scss">
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  box-sizing: border-box;
  font-family: Helvetica, Arial, sans-serif;
  overflow: hidden;

  * {
    box-sizing: border-box;
  }

}

</style>
