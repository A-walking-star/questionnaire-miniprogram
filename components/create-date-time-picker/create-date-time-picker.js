import createBehavior from '../create-behavior'
Component({
  behaviors: [createBehavior],
  properties: {

  },
  data: {
    options: [
      { label: "年月", value: "month" },
      { label: "日期", value: "date" },
      { label: "日期与时间", value: "minute" },
    ],
    value: ["minute"],
    text: '日期与时间'
  },
  methods: {
    onPickerChange(e){
      this.setData({text: e.detail.label, value: e.detail.value});
    },
    add(){
      const { title, required, value } = this.data;
      function check(){
        if (!title||title.trim()===''){
          return "请输入标题";
        }
        return;
      }
      this._add({ type: 'dateTimePicker', value: {title, required: !!required, mode: value[0]} }, check());
    }
  }
})