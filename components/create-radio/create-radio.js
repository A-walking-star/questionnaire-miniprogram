import { svg2imgdata } from '../../utils/util'
import createBehavior from '../create-behavior'
Component({
  behaviors: [createBehavior],
  properties: {
    isSingleChoice: {
      type: Boolean,
      value: true,
    }
  },
  data: {
    list: ["",""],
    deleteIcon: svg2imgdata('<svg t="1715939759346" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12067" width="200" height="200"><path d="M504.109851 16.453128c-278.332339 0-503.966321 225.632974-503.966321 503.966321S225.776505 1024.384762 504.109851 1024.384762s503.966321-225.632974 503.966321-503.966321S782.44219 16.453128 504.109851 16.453128zM242.706054 566.655409l0.04734-94.679771 525.432441 0-0.017123 94.679771L242.706054 566.655409z" fill="#d81e06" p-id="12068"></path></svg>'),
    addIcon: svg2imgdata('<svg t="1715940058541" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13947" width="200" height="200"><path d="M510.833431 62.695924c-247.644193 0-448.406636 200.762443-448.406636 448.406636 0 247.65545 200.762443 448.416869 448.406636 448.416869 247.65545 0 448.416869-200.76142 448.416869-448.416869C959.2503 263.458367 758.488881 62.695924 510.833431 62.695924zM779.544429 562.112328 560.358381 562.112328l0 219.186048-102.008278 0L458.350103 562.112328 239.164055 562.112328l0-102.008278 219.186048 0L458.350103 240.918002l102.008278 0 0 219.186048 219.186048 0L779.544429 562.112328z" fill="#0052d9" p-id="13948"></path></svg>')
  },
  lifetimes: {
    created(){
      this.data.list = ["",""]
    },
    ready(){
      this.setData({
        tip: this.data.isSingleChoice
      })
    }
  },
  methods: {
    addOption(){
      const { list } = this.data;
      const len = list.length
      this.setData({
        [`list[${len}]`]: ''
      })
    },
    delOption(e){
      const { idx } = e.currentTarget.dataset;
      const { list } = this.data;
      list.splice(idx, 1);
      this.setData({list})
    },
    inputChange(e){
      const { idx } = e.currentTarget.dataset;
      const { value } = e.detail;
      this.data.list[idx] = value
    },
    add(){
      const { list, title, required, isSingleChoice } = this.data;
      function check(){
        if (!title||title.trim()===''){
          return "请输入标题";
        } else if (!(list instanceof Array) || list.length<2 || list.filter(v => v==null||v=='').length){
          return "至少有两个选项且选项不得有空";
        }
        return;
      }
      this._add({ type: 'radio', value: {list, title, required: !!required, isSingleChoice: !!isSingleChoice} }, check());
    }
  }
})