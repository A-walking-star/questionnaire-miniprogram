import Toast from 'tdesign-miniprogram/toast';
Page({
  data: {
    list: []
  },
  onLoad(options) {
    const id = options?.id
    if (id){
      const page = getCurrentPages()[0];
      const data = page.data.list.find(v => v.id === id);
      wx.setNavigationBarTitle({
        title: data.title,
      })
      this.id = id;
      const change = {
        list: data.list,
        modify: true
      }
      if (options.valueIdx != null){
        change.modify = false
        change.data = page.data.data[id][options.valueIdx];
      }
      this.setData(change)
    } else {
      this.handleErr("缺少问卷id");
    }
  },
  changeListData(e){
    const { idx } = e.currentTarget.dataset;
    const value = e.detail;
    this.data.list[idx].data = value;
  },
  submit(){
    if (this.loading) return;
    wx.showLoading({title: '提交中'})
    this.loading = true;
    const { list } = this.data;
    const dataList = [];
    for (let i=0; i<list.length; i++){
      const { value: { required }, data } = list[i];
      if (required && (data == null || (typeof data === 'string' && (data.trim() == '')))){
        this.showToast(`第 ${i+1} 个未填写`);
        this.loading = false;
        wx.hideLoading();
        return;
      }
      dataList.push(data)
    }
    const __run = (data=[]) => {
      data.unshift({time: Date.now() , data:dataList})
      wx.setStorage({
        key: `data.${this.id}`,
        data,
        success: () => {
          wx.showModal({
            title: '提交成功',
            showCancel: false,
            confirmText: "返回",
            complete: wx.navigateBack
          })
          this.loading = false;
          wx.hideLoading();
        },
        fail: (err) => {
          this.showToast(`提交失败 ${err.errMsg}`);
          this.loading = false;
          wx.hideLoading();
        }
      })
    }
    wx.getStorage({
      key: `data.${this.id}`,
      success: (res) => {
        __run(res.data);
      },
      fail: (err) => {
        if (err.errMsg.includes("not found")){
          __run();
        } else {
          this.showToast(`提交失败 ${err.errMsg}`);
          this.loading = false;
          wx.hideLoading();
        }
      }
    })
  },
  handleErr(msg="系统异常"){
    this.showToast(msg);
    setTimeout(wx.navigateBack, 2000);
  },
  showToast(msg, status="error"){
    Toast({
      context: this,
      selector: '#t-toast',
      message: msg,
      theme: status,
      direction: 'column',
    });
  },
  onUnload(){
    for (let k in this.data){
      this.data[k] = null
    }
    this.data = null;
  },
})