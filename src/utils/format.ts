import Decimal from 'break_eternity.js'
import type DecimalSource from 'break_eternity.js'
import { diff } from '../main'
import { player } from '../saves/index'

function exponentialFormat(num: Decimal, precision: number, mantissa = true): string {
  let e = num.log10().floor()
  let m = num.div(Decimal.pow(10, e))
  if (Number(m.toStringWithDecimalPlaces(precision)) == 10) {
    m = new Decimal(1)
    e = e.add(1)
  }
  const exp = e.gte(1e9)
    ? format(e, 3)
    : e.gte(10000)
      ? commaFormat(e, 0)
      : e.toStringWithDecimalPlaces(0)
  if (mantissa) return m.toStringWithDecimalPlaces(precision) + 'e' + exp
  else return 'e' + exp
}

function commaFormat(num: Decimal, precision: number) {
  if (num === null || num === undefined) return 'NaN'
  if (num.mag < 0.001) return (0).toFixed(precision)
  const init = num.toStringWithDecimalPlaces(precision)
  const portions = init.split('.')
  portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
  if (portions.length == 1) return portions[0]
  return portions[0] + '.' + portions[1]
}

function regularFormat(num: Decimal, precision: number) {
  if (num === null || num === undefined) return 'NaN'
  if (num.mag < 0.0001) return (0).toFixed(precision)
  if (num.mag < 0.1 && precision !== 0) precision = Math.max(precision, 4)
  return num.toStringWithDecimalPlaces(precision)
}

export function format(decimal: DecimalSource, precision = 3): string {
  decimal = new Decimal(decimal)
  if (decimal.sign < 0) return '-' + format(decimal.neg(), precision)
  if (decimal.isNan()) return 'NaN'
  if (decimal.mag == Number.POSITIVE_INFINITY) return 'Infinity'
  if (decimal.gte('eeee1000')) {
    const slog = decimal.slog()
    if (slog.gte(1e6)) return 'F' + format(slog.floor())
    else
      return (
        Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) +
        'F' +
        commaFormat(slog.floor(), 0)
      )
  } else if (decimal.gte('1e1000000')) return exponentialFormat(decimal, 0)
  else if (decimal.gte('1e10000')) return exponentialFormat(decimal, 0)
  else if (decimal.gte(1e9)) return exponentialFormat(decimal, precision)
  else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
  else if (decimal.gte(0.0001)) return regularFormat(decimal, precision)
  else if (decimal.gt(0)) {
    const exponent = decimal.log10().ceil()
    const mantissa = decimal.div(Decimal.pow(10, exponent))
    if (exponent.lte('-eee1000')) return '1/' + format(decimal.recip(), precision)
    if (exponent.lte(-1e9)) return 'e' + format(exponent, precision)
    return format(mantissa, precision) + 'e' + format(exponent, precision)
  } else return (0).toFixed(precision)
}
const DT = Decimal.tetrate(10, 6)

export function formatGain(a: DecimalSource, e: DecimalSource, resourceName: string = '') {
  a = new Decimal(a)
  e = new Decimal(e)
  const FPS = 1000 / diff
  const g = Decimal.add(a, e.div(FPS))

  if (g.neq(a)) {
    if (a.gte(DT)) {
      var oom = new Decimal(g).slog(10).sub(new Decimal(a).slog(10)).mul(FPS)
      if (oom.gte(1e-3)) return format(oom) + '数量级^{数量级}'
    }

    if (a.gte('ee100')) {
      let tower = Math.floor(new Decimal(a).slog(10).toNumber() - 1.3010299956639813)

      var oom = new Decimal(g)
          .iteratedlog(10, tower)
          .sub(new Decimal(a).iteratedlog(10, tower))
          .mul(FPS),
        rated = false

      if (oom.gte(1)) rated = true
      else if (tower > 2) {
        tower--
        oom = new Decimal(g)
          .iteratedlog(10, tower)
          .sub(new Decimal(a).iteratedlog(10, tower))
          .mul(FPS)
        if (oom.gte(1)) rated = true
      }

      if (rated) return format(oom) + '数量级^{' + tower + '}'
    }

    if (a.gte(1e100)) {
      const oom = g.div(a).log10().mul(FPS)
      if (oom.gte(1)) return format(oom) + '数量级'
    }
  }

  return format(e) + resourceName
}

export function formatTime(ex: DecimalSource, acc = 3, type = 's'): string {
  ex = new Decimal(ex)
  if (ex.mag == Infinity) return '5更新时'
  if (ex.gte(31536000)) {
    return (
      format(ex.div(31536000).floor(), 0) +
      '年' +
      (ex.div(31536000).gte(1e9) ? '' : ' ' + formatTime(ex.mod(31536000), acc, '年'))
    )
  }
  if (ex.gte(86400)) {
    var n = ex.div(86400).floor()
    return (
      (n.gt(0) || type == 'd' ? format(ex.div(86400).floor(), 0) + '天' : '') +
      formatTime(ex.mod(86400), acc, '天')
    )
  }
  if (ex.gte(3600)) {
    var n = ex.div(3600).floor()
    return (
      (n.gt(0) || type == 'h' ? format(ex.div(3600).floor(), 0) + '时' : '') +
      formatTime(ex.mod(3600), acc, '时')
    )
  }
  if (ex.gte(60)) {
    var n = ex.div(60).floor()
    return (n.gt(0) || type == 'm' ? format(n, 0) + '分' : '') + formatTime(ex.mod(60), acc, '分')
  }
  return ex.gt(0) || type == 's' ? format(ex, acc) + '秒' : ''
}

export function formatReduction(ex: DecimalSource, acc?: number) {
  return format(Decimal.sub(1, ex).mul(100), acc) + '%'
}

export function formatPercent(ex: DecimalSource, acc?: number) {
  return format(Decimal.mul(ex, 100), acc) + '%'
}

export function formatMult(ex: DecimalSource, acc?: number) {
  return Decimal.gte(ex, 1) ? '×' + format(ex, acc) : '/' + format(Decimal.pow(ex, -1), acc)
}

export function formatPow(ex: DecimalSource, acc?: number) {
  return '^' + format(ex, acc)
}

export function formatWhole(decimal: DecimalSource): string {
  decimal = new Decimal(decimal).floor()
  if (decimal.gte(1e9)) return format(decimal, 3)
  return format(decimal, 0)
}
