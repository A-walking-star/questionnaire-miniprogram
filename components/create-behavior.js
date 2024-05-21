import Toast from 'tdesign-miniprogram/toast';
const createBehavior = Behavior({
  data: {
    required: true,
  },
  lifetimes: {
    ready(){
      this.setData({
        required: true
      })
    }
  },
  methods: {
    change(e){
      const type = e.currentTarget.dataset.type
      const value = e.currentTarget.dataset.value==null?e.detail.value:e.currentTarget.dataset.value;
      this.data[type] = value
    },
    changeData(e){
      const type = e.currentTarget.dataset.type
      const value = e.currentTarget.dataset.value==null?e.detail.value:e.currentTarget.dataset.value;
      this.setData({[type]: value})
    },
    back(){
      this.triggerEvent("back");
    },
    _add(value, tip){
      if (tip){
        this.showErr(tip);
        return;
      }
      this.triggerEvent("add", value);
    },
    showErr(msg){
      Toast({
        context: this,
        selector: '#t-toast',
        message: msg,
        theme: "error",
        direction: 'column',
      });
    },
  }
})

export default createBehavior