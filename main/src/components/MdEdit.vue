<template>
  <div id="md-edit" :class="theme">
    <v-md-editor
      v-model="content"
      height="100vh"
      right-toolbar="preview sync-scroll fullscreen"
      @copy-code-success="handleCopyCodeSuccess"
    />
  </div>
</template>

<script>
// 将markdown转换为html
// import VueMarkdownEditor, { xss } from '@kangc/v-md-editor'
// const html = xss.process(
//   VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(`\`\`\`js
// import Vue from 'vue';
// import VueMarkdownEditor from '@kangc/v-md-editor';
// import '@kangc/v-md-editor/lib/style/base-editor.css';
// import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';

// VueMarkdownEditor.use(vuepressTheme);

// Vue.use(VueMarkdownEditor);
// \`\`\`
// ![20210322121108.png](https://i.loli.net/2021/03/22/W8gym3zlOIpYCab.png)
// `)
// )
// console.log(html)
import { useStore } from 'vuex'
import { ref, inject, computed } from 'vue'
export default {
  setup() {
    const store = useStore()
    const theme = computed(() => {
      return store.getters['header/getTheme']
    })
    // 数据区--------------------------------------------------------------
    const content = inject('content') // 父亲的富文本内容（html形式）,父数据改变子组件相应发生改变，这边不需要考虑双向绑定
    const handleCopyCodeSuccess = (code) => {
      alert('复制成功')
    }
    return {
      content,
      handleCopyCodeSuccess,
      theme
    }
  }
}
</script>
<style scoped lang="scss">
#md-edit.dark {
  ::v-deep(.v-md-editor__toolbar) {
    background-color: #090c10;
    border-bottom: none;
  }
  ::v-deep(.v-md-editor__main) {
    opacity: 0.9;
    background-color: #090c10;
  }
  ::v-deep(.vuepress-markdown-body) {
    opacity: 0.9;
    background-color: #090c10;
    color: #c9d1d9;
  }
  ::v-deep(textarea) {
    opacity: 0.9;
    background-color: #090c10;
    color: #c9d1d9;
  }
  ::v-deep(.v-md-editor--fullscreen) {
    position: fixed;
    top: 50px;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
  }
}

// ------------------------------------------------------------------
#md-edit.light {
  ::v-deep(.v-md-editor__toolbar) {
    background-color: #768fba;
    border-bottom: none;
  }
  ::v-deep(.v-md-editor__main) {
    opacity: 0.9;
    background-color: #e1e7f0;
  }
  ::v-deep(.vuepress-markdown-body) {
    opacity: 0.9;
    background-color: #e1e7f0;
    color: black;
  }
  ::v-deep(textarea) {
    opacity: 0.9;
    background-color: #e1e7f0;
    color: black;
  }
  ::v-deep(.v-md-editor--fullscreen) {
    position: fixed;
    top: 50px;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
  }
}
</style>
