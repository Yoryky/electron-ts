<template>
  <div>
    <div
        ref="editor"
        class="editor"
        contenteditable="true"
        v-html="editorText"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur">
    </div>
  </div>

</template>

<script>
export default {
  props: {
    value: {type: String, default: ''}
  },
  data() {
    return {
      editorText: this.value,
      isChange: true,
    }
  },
  watch: {
    value() {
      console.log(`value changed value ==> ${this.value}`)
      if (this.isChange) {
        this.editorText = this.value
      }
    },
    "$store.state.chatContent": function (newValue) {
        console.log(`chatContent change newValue ==> ${newValue}`)
        this.editorText = newValue
    },

  },
  methods: {
    handleInput() {
      this.$emit('input', this.$el.innerHTML)
    },
    // 清空编辑器
    handleClear() {
      this.$refs.editor.innerHTML = ''
      this.$refs.editor.focus()
    },

    // 获取焦点
    handleFocus() {
      this.isChange = false
      this.$emit('focusFn')
    },
    // 失去焦点
    handleBlur() {
      this.isChange = true
      this.$emit('blurFn')
    },


    /**
     * 光标处插入内容
     * @param html 需要插入的内容
     */
    insertHtmlAtCaret(html) {
      let sel, range;
      if (!this.$refs.editor.childNodes.length) {
        this.$refs.editor.focus()
      }
      if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();

        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();
          const el = document.createElement("div");
          el.appendChild(html)
          const frag = document.createDocumentFragment()
          let node, lastNode;
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
          }
          range.insertNode(frag);
          if (lastNode) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
          this.$store.commit('setChatContent','hello')
        }
      } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
      }

      this.handleInput()
    }
  }
}
</script>

<style>
.editor {
  width: 100%;
  height: 100px;
  border: 1px solid black;
  text-align: start;
  padding: 5px;
  overflow-y: auto;
}
</style>
