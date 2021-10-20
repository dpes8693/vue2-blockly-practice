<template>
  <div id="app">
    <BlocklyComponent
      id="blockly2"
      :options="options"
      ref="foo"
    ></BlocklyComponent>

    <!-- <div class="grid-stack h-full w-full">
      <widget v-for="widget in widgets" :widget="widget" :key="widget.text"/>
    </div> -->
  </div>
</template>

<script>

import BlocklyComponent from "./components/BlocklyComponent.vue";
import "./blocks/stocks";
// import './prompt';

import BlocklyJS from "blockly/javascript";

// import 'gridstack/dist/gridstack.min.css';
// import { GridStack } from 'gridstack';

export default {
  name: "app",
  components: {
    BlocklyComponent,
  },
  data() {
    return {
      code: "",
      options: {
        media: "media/",
        grid: {
          spacing: 25,
          length: 3,
          colour: "#ccc",
          snap: false,
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 2,
          minScale: 0.5,
          scaleSpeed: 1.2,
          pinch: true,
        },
        toolbox: `<xml>
          <category name="Logic" colour="%{BKY_LOGIC_HUE}">
            <block type="controls_if"></block>
            <block type="logic_compare"></block>
            <block type="logic_operation"></block>
            <block type="logic_negate"></block>
            <block type="logic_boolean"></block>
          </category>
          <category name="Loops" colour="%{BKY_LOOPS_HUE}">
            <block type="controls_repeat_ext">
              <value name="TIMES">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>
            </block>
            <block type="controls_whileUntil"></block>
          </category>
          <category name="Math" colour="%{BKY_MATH_HUE}">
            <block type="math_number">
              <field name="NUM">123</field>
            </block>
            <block type="math_arithmetic"></block>
            <block type="math_single"></block>
          </category>
          <category name="Text" colour="%{BKY_TEXTS_HUE}">
            <block type="text"></block>
            <block type="text_length"></block>
            <block type="text_print"></block>
          </category>
          <category name="Variables" custom="VARIABLE" colour="%{BKY_VARIABLES_HUE}">
          </category>
        </xml>`,
      },
    };
  },
  mounted() {
    
  },
  methods: {
    showCode() {
      this.code = BlocklyJS.workspaceToCode(this.$refs["foo"].workspace); //js
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#code {
  position: relative;
  top: 100px;
  left: 82%;
  /* right: 15% */
  /* bottom: 0; */
  /* width: 17%; */
  /* height: 92%; */
  margin: 0;
  /* background-color: beige; */
}

#blockly2 {
  position: fixed;
  left: 0;
  bottom: 0;
  /* width: 80%;
  height: 92%; */
  width: 50%;
  height: 50%;
}
</style>
