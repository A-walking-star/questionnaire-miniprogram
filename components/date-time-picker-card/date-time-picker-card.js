import cardBehavior from '../card-behavior'
Component({
  behaviors: [cardBehavior],
  data: {
    date: Date.now(),
  },
  lifetimes: {
    ready(){
      this.setData({date: Date.now()})
    }
  }
})