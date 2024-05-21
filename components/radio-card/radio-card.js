import cardBehavior from '../card-behavior'
Component({
  behaviors: [cardBehavior],
  lifetimes: {
    ready(){
      const { value: { list }, val } = this.data;
      this.setData({ 'value.list': val!=null?list.map((v,idx)=>({value: idx, label: v, checked: (typeof val === 'number'?val===idx:val.includes(idx))})):list.map((v,idx)=>({value: idx, label: v})) })
    }
  },
})