import createBehavior from '../create-behavior'
Component({
  behaviors: [createBehavior],
  methods: {
    add(){
      const { title, required } = this.data;
      function check(){
        if (!title||title.trim()===''){
          return "请输入标题";
        }
        return;
      }
      this._add({ type: 'text', value: {title, required: !!required} }, check());
    }
  }
})