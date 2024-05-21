import createBehavior from '../create-behavior'
Component({
  behaviors: [createBehavior],
  properties: {

  },
  data: {
    options: [],
    value: [5],
  },
  lifetimes: {
    ready(){
      const options = []
      for (let i=2; i<11; i++){
        options.push({ label: i, value: i })
      }
      this.setData({options})
    }
  },
  methods: {
    onPickerChange(e){
      this.setData({value: e.detail.value});
    },
    add(){
      const { title, required, value } = this.data;
      function check(){
        if (!title||title.trim()===''){
          return "请输入标题";
        }
        return;
      }
      this._add({ type: 'rate', value: { title, required: !!required, value: value[0] } }, check());
    }
  }
})