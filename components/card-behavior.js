import { svg2imgdata } from '../utils/util'
const cardBehavior = Behavior({
  properties: {
    value: Object,
    val: {
      value: null,
      observer(val){
        if (val != null){
          this.setData({
            mode: 2,
            optionValue: val
          })
        }
      }
    },
    modify: {
      value: true,
      observer(val){
        if (!val){
          this.setData({
            mode: 2,
          })
        }
      }
    },
    mode: {
      type: Number,
      value: 1,
    },
    idx: Number,
  },
  data: {
    delIcon: svg2imgdata('<svg t="1716020538945" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2775" width="200" height="200"><path d="M517.12 944.64c-236.11392 0-427.52-191.40608-427.52-427.52 0-236.11392 191.40608-427.52 427.52-427.52 236.11392 0 427.52 191.40608 427.52 427.52C944.64 753.23392 753.23392 944.64 517.12 944.64zM517.12 143.04256c-206.59712 0-374.08256 167.48544-374.08256 374.08256S310.52288 891.20256 517.12 891.20256c206.60224 0 374.08256-167.48544 374.08256-374.08256S723.72224 143.04256 517.12 143.04256zM555.06432 517.26848l113.2032 113.2032c10.42432 10.42944 10.42432 27.3664 0 37.79584-10.43456 10.42944-27.35104 10.42944-37.79584 0l-113.2032-113.20832-113.99168 113.9712c-10.51648 10.5216-27.5712 10.5216-38.07744 0-10.51648-10.5216-10.51648-27.5712 0-38.07744l113.98144-113.98144L365.97248 403.75296c-10.43456-10.42944-10.43456-27.35104 0-37.78048 10.43456-10.43968 27.34592-10.43968 37.79072 0l113.21344 113.20832 114.82112-114.82112c10.51648-10.5216 27.5712-10.5216 38.08256 0 10.51648 10.51136 10.51648 27.5712 0 38.08256L555.06432 517.26848z" fill="#DD403E" p-id="2776"></path></svg>'),
  },
  methods: {
    onChange(e){
      const { value } = e.detail;
      if(value != this.data.optionValue)this.setData({optionValue: value})
      this.triggerEvent("change", value);
    },
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
    del(){
      this.triggerEvent("del");
    },
  }
})

export default cardBehavior