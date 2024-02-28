<template>
  <!-- <HelloWorld/> -->
  <el-config-provider :locale="locale">
    <router-view/>
  </el-config-provider>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import { computed, ref } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

export default {
  name: 'App',
  // components: {
  //   HelloWorld
  // }
  data() {
    const language = ref('zh-cn')
    const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))
    console.log("locale:");
    console.log(locale);
    return {
      locale: locale
    }
  }
}
</script>

<style>
body {
  padding: 0px;
  margin: 8px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
