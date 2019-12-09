<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  created() {},
  mounted() {
    this.$nextTick(() => {
      console.log(JSON.parse(window.localStorage.getItem("routerList")));
      JSON.parse(window.localStorage.getItem("routerList")) &&
        this.$store.commit(
          "SET_ROUTER",
          JSON.parse(window.localStorage.getItem("routerList"))
        );
      setTimeout(() => {
        this.$store.dispatch("set_sigval");
      }, 1000);
    });
  },
  methods: {}
};
</script>


<style lang="less">
.views {
  height: calc(~"100vh - 70px");
  overflow: auto !important;
}
</style>
