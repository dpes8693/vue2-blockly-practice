<template>
  <div style="height:1000px;">
    <div id="blocklyDiv"></div>
  </div>
</template>

<script>


export default {
  mounted() {

    // this.$loadScript("https://cdnjs.cloudflare.com/ajax/libs/blockly/7.20211209.0-beta.0/blockly.min.js")
    //   .then(() => {
    //     // Script is loaded, do something
    //   })
    //   .catch(() => {
    //     console.log(1);
    //   });        
  },
};
</script>

<style scoped>
html,
body,
#blocklyDiv {
  border: 0;
  height: 100%;
  margin: 0;
  padding: 0;
  width: 100%;
}
</style>
