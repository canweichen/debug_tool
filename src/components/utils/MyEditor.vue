<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="props.mode"
    />
    <Editor
      style="height: 300px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="props.mode"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, shallowRef, onMounted, defineModel } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const props = defineProps({ mode: { type: String, default: 'default' } })
// 内容 HTML
const valueHtml = defineModel('valueHtml')
// 模拟 ajax 异步获取内容
onMounted(() => {
  //   setTimeout(() => {
  //     valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
  //   }, 1500)
})
const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  console.log('销毁Editor编辑器')
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
// export default {
//   components: { Editor, Toolbar },
//   setup() {
//     // 编辑器实例，必须用 shallowRef
//     const editorRef = shallowRef()

//     // 内容 HTML
//     const valueHtml = defineModel('valueHtml')

//     // 模拟 ajax 异步获取内容
//     onMounted(() => {
//       //   setTimeout(() => {
//       //     valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
//       //   }, 1500)
//     })

//     const toolbarConfig = {}
//     const editorConfig = { placeholder: '请输入内容...' }

//     // 组件销毁时，也及时销毁编辑器
//     onBeforeUnmount(() => {
//       console.log('销毁Editor编辑器')
//       const editor = editorRef.value
//       if (editor == null) return
//       editor.destroy()
//     })

//     const handleCreated = (editor) => {
//       editorRef.value = editor // 记录 editor 实例，重要！
//     }

//     return {
//       editorRef,
//       valueHtml,
//       mode: 'default', // 或 'simple'
//       toolbarConfig,
//       editorConfig,
//       handleCreated
//     }
//   }
// }
</script>
