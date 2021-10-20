<template>
  <div>
    <div class="blocklyDiv" ref="blocklyDiv"></div>
    <xml ref="blocklyToolbox" style="display:none">
      <slot></slot>
    </xml>
    <button class="a" @click="saveCode">save</button>
    <button class="b" @click="loadCode">load</button>
  </div>
</template>

<script>

import Blockly from 'blockly';
// import * as Ch from 'blockly/msg/zh-hant'
// Blockly.setLocale(Ch)

export default {
  name: 'BlocklyComponent',
  props: ['options'],
  data(){
    return {
      workspace: null
    }
  },
  mounted() {
    var options = this.$props.options || {};
    if (!options.toolbox) {
      options.toolbox = this.$refs["blocklyToolbox"];
    }
    this.workspace = Blockly.inject(this.$refs["blocklyDiv"], options);//重要!!
  },
  methods:{
    saveCode(){
      let xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(this.workspace))
      localStorage.setItem('workspaceXml',xml)
      console.log(this.workspace)
      console.log(Blockly.Xml.workspaceToDom(this.workspace))
      console.log(xml)
    },
    loadCode(){
      // if(localStorage.getItem('workspaceXml')){
      // }
      let xml = localStorage.getItem('workspaceXml')
      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml),this.workspace)
    }       
  }
}
</script>

<style scoped>
.blocklyDiv {
  height: 100%;
  width: 100%;
  text-align: left;
}
.a {
  position: fixed;
  right: 0;
  top: 8%;
  width: 4%;
  height: 4%;
}
.b {
  position: fixed;
  right: 0;
  top: 12%;
  width: 4%;
  height: 4%;
}
</style>
