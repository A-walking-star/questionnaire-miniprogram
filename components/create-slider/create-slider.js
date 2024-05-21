import createBehavior from '../create-behavior'
Component({
  behaviors: [createBehavior],
  data: {
    min: 0,
    minText: '不满意',
    max: 100,
    maxText: '满意',
  },
  methods: {
    add(){
      const { title, required, min, minText, max, maxText } = this.data;
      function check(){
        if (!title||title.trim()===''){
          return "请输入标题";
        } else if (Math.floor(min)<-10){
          return "最小数值不得小于-10"
        } else if (Math.ceil(max)>100){
          return "最大数值不得大于100"
        }
        return;
      }
      this._add({ type: 'slider', value: { title, required: !!required, min: Math.floor(min), minText, max: Math.ceil(max), maxText } }, check());
    }
  }
})