<template>
  <div class="container">
    <canvas ref="canvasRef"></canvas>
    <div id="mask" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    particleCount?: number
  }>(),
  {
    particleCount: 100,
  },
)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const image = ref<HTMLImageElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationFrameId = 0

class Particle {
  x: number
  y: number
  velocityX: number
  velocityY: number
  width: number
  height: number

  constructor(width: number, height: number) {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.velocityX = Math.random() * 2 - 1
    this.velocityY = Math.random() * 2 - 1
    this.width = Math.random() * 10 + 10 // 10-20像素随机大小
    this.height = this.width
  }

  update(width: number, height: number) {
    if (this.x < 0 || this.x > width) this.velocityX *= -1
    if (this.y < 0 || this.y > height) this.velocityY *= -1

    this.x += this.velocityX
    this.y += this.velocityY
  }

  draw(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
    ctx.drawImage(img, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
  }
}

let particles: Particle[] = []

const initCanvas = async () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  ctx = canvas.getContext('2d')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const img = new Image()
  img.src = "/baixie-incremental/baixie.png"
  if (import.meta.env.DEV) img.src = "/baixie.png"
  try {
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = () => reject(new Error('图片加载失败'))
    })
    image.value = img
    particles = Array.from(
      { length: props.particleCount },
      () => new Particle(canvas.width, canvas.height),
    )
  } catch (error) {
    console.error(error)
  }
}

const animate = () => {
  if (!ctx || !canvasRef.value || !image.value) return

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  particles.forEach((particle) => {
    particle.update(canvasRef.value!.width, canvasRef.value!.height)
    particle.draw(ctx!, image.value!)
  })

  animationFrameId = requestAnimationFrame(animate)
}

const handleResize = () => {
  initCanvas()
}

onMounted(async () => {
  await initCanvas()
  animate()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animationFrameId)
})
</script>

<style scoped>
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
}

canvas {
  width: 100%;
  height: 100%;
}

#mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
}
</style>
