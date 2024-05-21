import Toast from 'tdesign-miniprogram/toast';
import { formatTime } from '../../utils/util'
Page({
  data: {
    list: []
  },
  onLoad(options) {
    const id = options?.id
    if (id){
      this.id = id;
      const page = getCurrentPages()[0];
      const data = page.data.list.find(v => v.id === id);
      wx.setNavigationBarTitle({
        title: data.title,
      })
      this.setData({
        list: page.data.data[id].map(v=>({...v, date:formatTime(v.time, 'MM-DD HH:mm')})),
      })
    } else {
      this.handleErr("缺少问卷id");
    }
  },
  detail(e){
    const { idx } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../questionnaire/index?id=${this.id}&valueIdx=${idx}`,
      fail: (err) => {
        this.showToast(err.errMsg);
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
});