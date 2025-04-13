import { saveSerializer } from './serializer'
import { reactive } from 'vue'
import Decimal from 'break_eternity.js'

export interface Player {
  baixie: Decimal
  lastUpdated: number
  buyables: {
    autoclickers: Decimal
    accelerators: Decimal
  }
  tabs: {
    main: number
  }
}

function getInitialPlayerData(): Player {
  return {
    baixie: new Decimal(0),
    lastUpdated: Date.now(),
    buyables: {
      autoclickers: new Decimal(0),
      accelerators: new Decimal(0),
    },
    tabs: {
      main: 1,
    },
  }
}

let player: any

function convertToDecimal(source: any, target: any): any {
  for (let i in source) {
    if (target[i] == undefined) target[i] = source[i]
    if (typeof source[i] == 'object' && !(source[i] instanceof Decimal))
      target[i] = convertToDecimal(source[i], target[i])
    if (source[i] instanceof Decimal) target[i] = new Decimal(target[i])
  }
  return target
}

function load(): void {
  player = getInitialPlayerData()
  if (localStorage.getItem('baixiedi') != undefined) {
    let temp_player: any = saveSerializer.deserialize(localStorage.getItem('baixiedi'))
    player = convertToDecimal(player, temp_player)
  }
  player = reactive(player) as Player
}
load()

function save(): void {
  localStorage.setItem('baixiedi', saveSerializer.serialize(player))
}

function hardReset(): void {
  Object.assign(player, getInitialPlayerData()) as Player
}

setInterval(save)

export { player }

export function requestHardReset() {
  if (
    prompt(
      '你真的想要硬重置吗? 你的一切进度都将被重置, 且不会获得奖励!\
  填写“是”以确认',
    ) == '是'
  )
    hardReset()
}

export function export_file(): void {
  let str = saveSerializer.serialize(player)
  let file = new Blob([str], {
    type: 'text/plain',
  })
  window.URL = window.URL || window.webkitURL
  let a = document.createElement('a')
  a.href = window.URL.createObjectURL(file)
  a.download = 'Baixie Incremental Save - ' + getCurrentBeijingTime() + '.txt'
  a.click()
}

function getCurrentBeijingTime(): string {
  const t = new Date(),
    e = t.getUTCFullYear(),
    r = String(t.getUTCMonth() + 1).padStart(2, '0'),
    a = String(t.getUTCDate()).padStart(2, '0'),
    n = t.getUTCHours(),
    g = t.getUTCMinutes(),
    i = t.getUTCSeconds(),
    S = t.getUTCMilliseconds()
  let o = (n + 8) % 24
  return (
    o < 0 && (t.setUTCDate(t.getUTCDate() + 1), (o += 24)),
    `${e}-${r}-${a} ${o.toString().padStart(2, '0')}:${g.toString().padStart(2, '0')}:${i.toString().padStart(2, '0')}.${S.toString().padStart(3, '0')}`
  )
}

export function import_file(): void {
  let a = document.createElement('input')
  a.setAttribute('type', 'file')
  a.click()
  a.onchange = () => {
    let fr = new FileReader()
    if (a.files == null) return void alert('未选择文件')
    fr.onload = () => {
      let save = fr.result
      let temp_player: any = saveSerializer.deserialize(save)
      Object.assign(player, convertToDecimal(player, temp_player))
    }
    fr.readAsText(a.files[0])
  }
}
