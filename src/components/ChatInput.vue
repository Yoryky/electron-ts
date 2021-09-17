<template>
  <div>
    <p ref="pClick" @click="onInsertEmoji">set caret position</p>
    <p ref="pClick" @click="onInsertEmoji2">set caret position2</p>
    <p ref="pClick" @click="getCaretPosition">get caret position</p>
    <div
        ref="editor"
        class="editor"
        contenteditable="true"
        v-html="editorText"
        @keydown="onKeyDown($event)"
        @paste="handlePaste($event)"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur">
    </div>
  </div>

</template>

<script>
export default {
  name: 'ChatInput',
  data() {
    return {
      editorText: '',
      isChange: true,
      inputValue: '',
      node: Object,
    }
  },
  watch: {
    inputValue() {
      if (this.isChange) {
        console.log(`value changed value ==>  ${this.inputValue}`)
        this.editorText = this.inputValue
      }
    }
  },
  mounted() {
    this.$nextTick(()=>{
      document.onclick=function (event){
        if(event.target && event.target.id == 'yjingspan') {
          event.target.style.borderColor = 'red'
        }
      }
    })
  },
  methods: {
    handlePaste(e) {
      console.log(`handlePaste e = >${e}`)
    },
    getCaretPosition() {
      let caretOffset = 0;
      const element = this.$refs.editor
      const doc = element.ownerDocument || element.document;
      const win = doc.defaultView || doc.parentWindow;
      let sel;
      if (typeof win.getSelection != "undefined") {//谷歌、火狐
        sel = win.getSelection();
        if (sel.rangeCount > 0) {//选中的区域
          const range = win.getSelection().getRangeAt(0);
          const preCaretRange = range.cloneRange();//克隆一个选中区域
          preCaretRange.selectNodeContents(element);//设置选中区域的节点内容为当前节点
          preCaretRange.setEnd(range.endContainer, range.endOffset);  //重置选中区域的结束位置
          caretOffset = preCaretRange.toString().length;
        }
      } else if ((sel = doc.selection) && sel.type != "Control") {//IE
        const textRange = sel.createRange();
        const preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
      }
      console.log(`getCaretPosition position ==>  ${caretOffset}`)
    },
    onInsertEmoji2() {
      console.log(`yoryky onInsertEmoji`)
      let range, selection;
      const pos = 0
      const element = this.$refs.editor
      element.focus()
      if (document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
      {
        range = document.createRange();//创建一个选中区域
        range.selectNodeContents(element);//选中节点的内容
        if (element.innerHTML.length > 0) {
          range.setStartAfter(this.node); //设置光标起始为指定位置
        }
        range.collapse(true);       //设置选中区域为一个点
        selection = window.getSelection();//获取当前选中区域
        selection.removeAllRanges();//移出所有的选中范围
        selection.addRange(range);//添加新建的范围
      }
      // this.insertHtmlAtCaret('<span contenteditable="false" id="yjingspan">hello</span>')
      // const yjingspan = document.getElementById('yjingspan')
      // if (yjingspan) {
      //   yjingspan.focus()
      // }
    },
    onInsertEmoji() {
      console.log(`yoryky onInsertEmoji`)
      let range, selection;
      const pos = 4
      const element = this.$refs.editor
      if (document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
      {
        range = document.createRange();//创建一个选中区域
        range.selectNodeContents(element);//选中节点的内容
        if (element.innerHTML.length > 0) {
          range.setStart(element.childNodes[0], pos); //设置光标起始为指定位置
        }
        range.collapse(true);       //设置选中区域为一个点
        selection = window.getSelection();//获取当前选中区域
        selection.removeAllRanges();//移出所有的选中范围
        selection.addRange(range);//添加新建的范围
      }
      this.insertHtmlAtCaret('<div contenteditable="false" class="yjingspan" id="yjingspan" style="display: inline-flex;border: 1px solid gray;width: 200px;user-select: all;"><img src="../assets/logo.png" style="width: 50px;height: 50px;user-select: none"><div style="height: 50px;width: 150px"><span style="user-select: none">hello</span><span style="user-select: none">12kb</span></div></div>')
      // const yjingspan = document.getElementById('yjingspan')
      // if (yjingspan) {
      //   yjingspan.focus()
      // }
      ///this.$refs.editor.cursorPosition = 5;
    },
    handleInput() {
      this.$emit('input', this.$refs.editor.innerHTML)
      this.inputValue = this.$refs.editor.innerHTML
    },
    // 清空编辑器
    handleClear() {
      this.$refs.editor.innerHTML = ''
      this.$refs.editor.focus()
    },
    onKeyDown(e) {
      if (e.key == '@') {
        this.$refs.editor.blur()
      }
      this.getCaretPosition()

    },
    // 获取焦点
    handleFocus() {
      console.log(`yoryky handleFocus`)
      this.isChange = false
      this.$emit('focusFn')
    },
    // 失去焦点
    handleBlur() {
      console.log(`yoryky handleBlur`)
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
          el.innerHTML = html
          const frag = document.createDocumentFragment();
          let node;
          let lastNode;
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
            this.node = lastNode
          }
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
  height: 500px;
  text-align: left;
  padding: 5px;
  border: 1px solid black;
}

.yjingspan :hover {
  border-color: red;
}
</style>
