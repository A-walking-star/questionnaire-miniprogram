import Toast from 'tdesign-miniprogram/toast';
import { svg2imgdata } from '../../utils/util'
Page({
  onLoad(options) {
    if (options?.id){
      const id = options.id
      const page = getCurrentPages()[0];
      const data = page.data.list.find(v => v.id === id);
      this.date = new Date(data.createDate);
      this.setData({
        title: data.title,
        list: data.list,
        addVisiblePopup: false,
        subjectVisiblePopup: false,
      })
    } else {
      this.date = new Date();
      this.setData({
        list: [],
        addVisiblePopup: false,
        subjectVisiblePopup: false,
      })
    }
  },

  onUnload(){
    for (let k in this.data){
      this.data[k] = null
    }
    this.data = null;
  },
  addSubject(e){
    const { value, type } = e.detail;
    const len = this.data.list.length;
    this.setData({
      [`list[${len}]`]: {
        type,
        value
      },
      subjectVisiblePopup: false,
      subjectType: '',
    })
  },
  typeGridTap(e){
    const { idx } = e.currentTarget.dataset
    this.data.typeGrid[idx].task&&this.data.typeGrid[idx].task.call(this, idx);
  },
  save(){
    const { list, title } = this.data;
    if (!title){
      this.showToast("请填写问卷标题");
      return;
    } else if (!list || !list.length){
      this.showToast("请添加至少一个题目");
      return;
    } else if (!this.date){
      this.date = new Date();
    }
    wx.setStorage({
      key: `questionnaire.${this.date.getTime()}`,
      data: {
        title,
        list,
        createDate: this.date,
        date: Date.now(),
      },
      success: () => {
        wx.showModal({
          title: '保存成功',
          cancelText: '继续编辑',
          confirmText: '退出页面',
          confirmColor: '#c55347',
          complete: (res) => {
            if (res.confirm) {
              wx.navigateBack()
            }
          }
        })
      },
      fail: (err) => {
        this.showToast(`保存失败 ${err.errMsg}`);
      }
    })
  },
  del(e){
    const { idx } = e.currentTarget.dataset
    wx.showModal({
      title: `是否删除第 ${idx+1} 个`,
      cancelText: '取消',
      confirmText: "确定",
      confirmColor: '#c55347',
      complete: (res) => {
        if (res.confirm) {
          wx.showLoading();
          const { list } = this.data;
          list.splice(idx, 1);
          this.setData({list: []}, () => {
            wx.hideLoading();
            this.setData({list})
          });
        }
      }
    })
  },
  changeData(e){
    const type = e.currentTarget.dataset.type
    const value = e.currentTarget.dataset.value!=null?e.currentTarget.dataset.value:e.detail.value;
    this.setData({[type]: value});
  },
  change(e){
    const type = e.currentTarget.dataset.type
    const value = e.currentTarget.dataset.value!=null?e.currentTarget.dataset.value:e.detail.value;
    this.data[type] = value
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
  data: {
    list: [],
    typeGrid: [
      {
        name: "单选",
        icon: svg2imgdata('<svg t="1715935108778" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4240" width="200" height="200"><path d="M204.8 512a307.2 307.2 0 1 0 307.2-307.2 307.2 307.2 0 0 0-307.2 307.2z m-64 0A371.2 371.2 0 1 0 512 140.8 371.2 371.2 0 0 0 140.8 512zM76.8 512a435.2 435.2 0 1 1 435.2 435.2A435.2 435.2 0 0 1 76.8 512z" fill="#3363FC" p-id="4241"></path></svg>'),
        subjectType: 'radio',
        task: function(idx){
          this.setData({
            subjectType: this.data.typeGrid[idx].subjectType,
            subjectVisiblePopup: true,
            addVisiblePopup: false,
          })
        },
      },
      {
        name: "多选",
        icon: svg2imgdata('<svg t="1715934775973" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3257" width="200" height="200"><path d="M76.8 128a51.2 51.2 0 0 1 51.2-51.2h768a51.2 51.2 0 0 1 51.2 51.2v768a51.2 51.2 0 0 1-51.2 51.2h-768a51.2 51.2 0 0 1-51.2-51.2z m614.4 238.08l-235.52 235.52-125.44-126.976a25.6 25.6 0 0 0-36.352 36.352l141.312 140.8a30.72 30.72 0 0 0 43.52 0l249.856-249.856a25.6 25.6 0 1 0-36.352-36.352z" fill="#3363FC" p-id="3258"></path></svg>'),
        subjectType: 'checkbox',
        task: function(idx){
          this.setData({
            subjectType: this.data.typeGrid[idx].subjectType,
            subjectVisiblePopup: true,
            addVisiblePopup: false,
          })
        },
      },
      {
        name: "填空",
        icon: svg2imgdata('<svg t="1715935188827" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5248" width="200" height="200"><path d="M128 170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h682.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v682.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H170.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V170.666667z m85.333333 42.666666v597.333334h597.333334V213.333333H213.333333z" fill="#000000" p-id="5249"></path><path d="M554.666667 298.666667v426.666666h-85.333334V298.666667h85.333334z" fill="#0078FF" p-id="5250"></path><path d="M640 362.666667H384v-85.333334h256v85.333334zM640 746.666667H384v-85.333334h256v85.333334z" fill="#0078FF" p-id="5251"></path></svg>'),
        subjectType: 'text',
        task: function(idx){
          this.setData({
            subjectType: this.data.typeGrid[idx].subjectType,
            subjectVisiblePopup: true,
            addVisiblePopup: false,
          })
        },
      },
      {
        name: "滑动条",
        icon: svg2imgdata('<svg t="1715935226439" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6268" width="200" height="200"><path d="M798.72 901.12H225.28c-57.344 0-102.4-45.056-102.4-102.4V225.28c0-57.344 45.056-102.4 102.4-102.4h573.44c57.344 0 102.4 45.056 102.4 102.4v573.44c0 57.344-45.056 102.4-102.4 102.4zM225.28 163.84c-34.816 0-61.44 26.624-61.44 61.44v573.44c0 34.816 26.624 61.44 61.44 61.44h573.44c34.816 0 61.44-26.624 61.44-61.44V225.28c0-34.816-26.624-61.44-61.44-61.44H225.28z" fill="#0078ff" p-id="6269"></path><path d="M784.384 530.432H239.616c-10.24 0-18.432-8.192-18.432-18.432s8.192-18.432 18.432-18.432h542.72c10.24 0 18.432 8.192 18.432 18.432 2.048 10.24-6.144 18.432-16.384 18.432z m0 0" fill="#0078ff" p-id="6270"></path><path d="M512 608.256c0 32.768-26.624 57.344-57.344 57.344h-38.912c-32.768 0-57.344-26.624-57.344-57.344v-194.56c0-32.768 26.624-57.344 57.344-57.344h38.912c32.768 0 57.344 26.624 57.344 57.344v194.56z m0 0" fill="#0078ff" p-id="6271"></path></svg>'),
        subjectType: 'slider',
        task: function(idx){
          this.setData({
            subjectType: this.data.typeGrid[idx].subjectType,
            subjectVisiblePopup: true,
            addVisiblePopup: false,
          })
        },
      },
      {
        name: "打分",
        icon: svg2imgdata('<svg t="1715935357163" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7608" width="200" height="200"><path d="M848.384795 432.193373c-3.698229-11.4334-13.5936-19.751856-25.448602-21.458731l-195.585537-28.426423-87.478354-177.24175c-5.308913-10.769274-16.272615-17.58347-28.272927-17.58347-12.008498 0-22.965038 6.813173-28.272927 17.58347L395.838885 382.308219l-195.610096 28.426423c-11.882632 1.723248-21.750373 10.025331-25.448602 21.458731-3.702322 11.417027-0.610914 23.935132 7.986905 32.310893l141.540643 137.971351-33.406854 194.800661c-2.023076 11.837606 2.820232 23.789823 12.538571 30.853705 9.718339 7.071046 22.576181 8.002254 33.220612 2.38635l174.955684-91.978854 174.943404 91.978854c4.595668 2.420119 9.636474 3.63376 14.661931 3.63376 6.522554 0 13.044084-2.01489 18.530029-6.02011 9.709129-7.063883 14.556531-19.016099 12.541641-30.853705l-33.418111-194.800661L840.414263 464.504266C848.991616 456.128505 852.09121 443.611423 848.384795 432.193373L848.384795 432.193373zM848.384795 432.193373M866.904591 956.217221 156.266531 956.217221c-49.67026 0-90.078575-40.407292-90.078575-90.074482L66.187957 155.50468c0-49.668213 40.409338-90.074482 90.078575-90.074482l710.638059 0c49.66719 0 90.073458 40.407292 90.073458 90.074482l0 710.638059C956.979072 915.808906 916.57178 956.217221 866.904591 956.217221zM156.266531 85.346807c-38.688137 0-70.161966 31.472805-70.161966 70.157873l0 710.638059c0 38.686091 31.473829 70.157873 70.161966 70.157873l710.638059 0c38.685068 0 70.15685-31.471782 70.15685-70.157873L937.06144 155.50468c0-38.685068-31.471782-70.157873-70.15685-70.157873L156.266531 85.346807z" fill="#3363fc" p-id="7609"></path></svg>'),
        subjectType: 'rate',
        task: function(idx){
          this.setData({
            subjectType: this.data.typeGrid[idx].subjectType,
            subjectVisiblePopup: true,
            addVisiblePopup: false,
          })
        },
      },
      {
        name: "日期",
        icon: svg2imgdata('<svg t="1715935414504" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8968" id="mx_n_1715935414505" width="200" height="200"><path d="M894.5 118.25h-123.75V95.75c0-16.875-16.875-33.75-33.75-33.75s-33.75 16.875-33.75 33.75V118.25H326.375V95.75c0-16.875-16.875-33.75-33.75-33.75s-33.75 16.875-33.75 33.75V118.25H129.5C95.75 118.25 62 146.375 62 185.75v703.125c0 39.375 33.75 73.125 67.5 73.125h759.375c39.375 0 67.5-33.75 67.5-67.5V185.75c5.625-39.375-28.125-67.5-61.875-67.5z m0 776.25H129.5v-562.5h759.375v562.5z m0-635.625H129.5V185.75h123.75v5.625c0 16.875 16.875 33.75 33.75 33.75s33.75-16.875 33.75-33.75v-5.625h371.25v5.625c0 16.875 16.875 33.75 33.75 33.75s33.75-16.875 33.75-33.75v-5.625h123.75v73.125z" p-id="8969" fill="#3363fc"></path><path d="M292.625 568.25h67.5c22.5 0 39.375-16.875 39.375-33.75s-16.875-39.375-33.75-39.375H292.625c-16.875 0-33.75 16.875-33.75 39.375s16.875 33.75 33.75 33.75zM478.25 568.25h67.5c22.5 0 33.75-16.875 33.75-33.75s-11.25-39.375-33.75-39.375H478.25c-22.5 0-33.75 16.875-33.75 39.375s11.25 33.75 33.75 33.75zM658.25 568.25h67.5c16.875 0 33.75-16.875 33.75-33.75s-16.875-33.75-33.75-33.75h-67.5c-16.875-5.625-33.75 11.25-33.75 33.75s16.875 33.75 33.75 33.75zM292.625 753.875h67.5c22.5 0 39.375-16.875 39.375-39.375s-16.875-33.75-33.75-33.75H292.625c-16.875 0-33.75 16.875-33.75 33.75s16.875 39.375 33.75 39.375zM478.25 753.875h67.5c16.875 0 33.75-16.875 33.75-33.75S568.25 680.75 545.75 680.75H478.25c-16.875 0-33.75 16.875-33.75 33.75s11.25 39.375 33.75 39.375z" p-id="8970" fill="#3363fc"></path></svg>'),
        subjectType: 'dateTimePicker',
        task: function(idx){
          this.setData({
            subjectType: this.data.typeGrid[idx].subjectType,
            subjectVisiblePopup: true,
            addVisiblePopup: false,
          })
        },
      },
    ],
    addVisiblePopup: false,
    subjectVisiblePopup: false,
  },
})