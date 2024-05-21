import cardBehavior from '../card-behavior'
Component({
  behaviors: [cardBehavior],
  lifetimes: {
    ready(){
      const { min, max } = this.data.value;
      const v = Number(max) - Number(min)
      const marks = []
      const len = 5
      for (let i=1; i < len; i++){
        marks.push(Number(min) + v * (i / 5))
      }
      this.setData({marks})
    }
  },
})