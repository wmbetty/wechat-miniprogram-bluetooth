// components/dialog/dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dialogShow:{
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    confirmDialog () {
      var myEventDetail = {} // detail对象，提供给事件监听函数
       var myEventOption = {} // 触发事件的选项
       this.triggerEvent('confirmDialog', myEventDetail, myEventOption)
    },
    cancelDialog (e) {
      var myEventDetail = {} // detail对象，提供给事件监听函数
       var myEventOption = {} // 触发事件的选项
       this.triggerEvent('cancelDialog', myEventDetail, myEventOption)
    }
  }
})
