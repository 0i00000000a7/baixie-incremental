<script setup lang="ts">
import { player, requestHardReset, export_file, import_file } from './saves/index'
import { format, formatWhole, formatGain } from '~format'
import { Buyables } from './buyables'
import { getBaixieGeneration, device } from './main'
import BaixieParticles from './components/BaixieParticles.vue'
import BaixieButton from './components/BaixieButton.vue'

function baixie(): void {
  player.baixie = player.baixie.add(1)
}

function convertToB16(n: number): string {
  let codes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
  let x = n % 16
  return codes[(n - x) / 16] + codes[x]
}

function getUndulatingColor(period = Math.sqrt(760)): string {
  let t = new Date().getTime()
  let a = Math.sin((t / 1e3 / period) * 2 * Math.PI + 0)
  let b = Math.sin((t / 1e3 / period) * 2 * Math.PI + 2)
  let c = Math.sin((t / 1e3 / period) * 2 * Math.PI + 4)
  let d = convertToB16(Math.floor(a * 128) + 128)
  let e = convertToB16(Math.floor(b * 128) + 128)
  let f = convertToB16(Math.floor(c * 128) + 128)
  return '#' + d + e + f
}
</script>

<template>
  <div class="main-body">
    <div id="tabs-computer" v-if="device == 'computer'">
      <button class="tab-computer" :disabled="player.tabs.main == 1" @click="player.tabs.main = 1">
        <img src="/baixie.png" width="40" class="disabled" />
      </button>
      <button class="tab-computer" :disabled="player.tabs.main == 2" @click="player.tabs.main = 2">
        选项
      </button>
    </div>
    <div id="tabs-mobile" v-else>
      <button class="tab-mobile" :disabled="player.tabs.main == 1" @click="player.tabs.main = 1">
        <img src="/baixie.png" width="30" :class="{ disabled: player.tabs.main == 1 }" />
      </button>
      <button class="tab-mobile" :disabled="player.tabs.main == 2" @click="player.tabs.main = 2">
        <svg width="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            fill="white"
            d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
          />
        </svg>
      </button>
    </div>
    <BaixieParticles :particle-count="300" />
    <div id="main-content" :device>
      你有<b style="font-size: 36px">{{ formatWhole(player.baixie) }}</b
      >拜谢<br />
      <span v-if="getBaixieGeneration().neq(0)"
        >你正在每秒获取{{ formatGain(player.baixie, getBaixieGeneration(), '拜谢') }}</span
      ><br />
      <span v-if="player.baixie.eq(10000)" :style="{ color: getUndulatingColor() }"
        >恭喜通关! 您已达到本版本结局</span
      >
      <div class="horizontal_line" />
      <div v-if="player.tabs.main == 1">
        <br />
        <button @click="baixie">
          <img src="/baixie.png" /><br />
          <span style="font-size: 18px">拜谢一次</span>
        </button>
        <br /><br />
        <div>
          <div class="buyables-header">
            <div class="icon">
              <img src="/baixie.png" />
              <span class="decoration arrow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path
                    fill="white"
                    d="M0 55.2L0 426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320l118.1 0c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"
                  />
                </svg>
              </span>
            </div>
            自动拜谢机({{ formatWhole(player.buyables.autoclickers) }})<br />
            效果: +{{ format(Buyables.autoclickers.effect()) }} 拜谢/秒
          </div>
          <BaixieButton
            @click="Buyables.autoclickers.buy()"
            :disabled="!Buyables.autoclickers.canAfford()"
            >价格：{{ formatWhole(Buyables.autoclickers.cost().ceil()) }} 拜谢</BaixieButton
          >
        </div>
        <div>
          <div class="buyables-header">
            <div class="icon">
              <img src="/baixie.png" />
              <span class="decoration boost">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    fill="white"
                    d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"
                  />
                </svg>
              </span>
            </div>
            拜谢加速器({{ formatWhole(player.buyables.accelerators) }})<br />
            效果: 拜谢生成速度×{{ format(Buyables.accelerators.effect()) }}
          </div>
          <BaixieButton
            @click="Buyables.accelerators.buy()"
            :disabled="!Buyables.accelerators.canAfford()"
            >价格：{{ formatWhole(Buyables.accelerators.cost().ceil()) }} 拜谢</BaixieButton
          >
        </div>
      </div>
      <div v-else>
        <BaixieButton @click="requestHardReset">硬重置</BaixieButton>
        <BaixieButton @click="export_file">导出存档</BaixieButton>
        <BaixieButton @click="import_file">导入存档</BaixieButton>
        <div class="horizontal_line" />
        拜谢增量 - v0.0<br />
        作者：<sup>010000000a7</sup>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#main-content {
  text-align: center;
  &[device='computer'] {
    margin-right: 300px;
  }
}

.icon {
  border: 1px solid #777;
  display: inline-block;
}

.icon > img {
  width: 50px;
  display: inline-block;
}

.buyables-header {
  display: inline-flex;
  justify-content: start;
  align-items: center;
  text-align: left;
  min-width: 300px;
}

.decoration {
  display: inline-block;
  position: relative;

  &.arrow {
    width: 15px;
    right: 3px;
    bottom: 24px;
    animation: waving 2s ease-in-out infinite;
    transform-origin: bottom center;
  }

  &.boost {
    width: 20px;
    right: 3px;
    bottom: 24px;
    transform-origin: bottom center;
  }
}

@keyframes waving {
  0%,
  100% {
    transform: rotate(0deg) translateY(0);
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  50% {
    transform: rotate(15deg) translateY(-2px);
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
}

#tabs-computer {
  position: fixed;
  width: 300px;
  height: 100%;
  right: 0px;
  top: 0px;
  display: block;
  overflow: auto;
  background: rgba(0, 0, 0, 0.25);
  border: 2px solid #777;
}

.main-body {
  min-height: 100%;
}

.tab-computer {
  display: block;
  height: 50px;
  width: 300px;
  border: 2px solid #777;
  text-align: right;
  align-items: center;
  font-size: 30px;

  &:disabled {
    border: 2px solid #333;
  }
}

.disabled {
  filter: brightness(0.5);
}

#tabs-mobile {
  position: fixed;
  width: 100%;
  height: 50px;
  bottom: 0px;
  display: flex;
  overflow: auto;
  background: rgba(0, 0, 0, 0.25);
  border: 2px solid #777;
}

.tab-mobile {
  min-height: 50px;
  max-height: 50px;
  border: 2px solid #777;
  padding: 10px 10px;
  font-size: 30px;
  min-width: 50px;

  &:disabled {
    border: 2px solid #333;
  }
}
</style>
