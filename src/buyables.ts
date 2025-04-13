import { player } from './saves/index'
import Decimal from 'break_eternity.js'

export const Buyables = {
  autoclickers: {
    cost() {
      return Decimal.pow(1.5, player.buyables.autoclickers).mul(10)
    },
    effect() {
      return player.buyables.autoclickers
    },
    buy() {
      if (!this.canAfford()) return
      const cost = this.cost()
      player.buyables.autoclickers = player.buyables.autoclickers.add(1)
      player.baixie = player.baixie.sub(cost)
    },
    canAfford() {
      return player.baixie.gte(this.cost())
    },
  },
  accelerators: {
    cost() {
      return Decimal.pow(1.5, player.buyables.accelerators.pow(1.1)).mul(100)
    },
    effect() {
      return Decimal.pow(1.5, player.buyables.accelerators)
    },
    buy() {
      if (!this.canAfford()) return
      const cost = this.cost()
      player.buyables.accelerators = player.buyables.accelerators.add(1)
      player.baixie = player.baixie.sub(cost)
    },
    canAfford() {
      return player.baixie.gte(this.cost())
    },
  },
}
