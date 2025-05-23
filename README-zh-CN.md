[English Docs →](./README.md)

# Signee

> 一个轻量级、跨平台的 Canvas 签名绘图工具，基于 [smooth-signature](https://github.com/linjc/smooth-signature) 抽离绘图逻辑，适配浏览器、UniApp、小程序等多端环境。

---

## 📦 安装

```bash
npm install signee
```

---

## 🚀 快速上手

```js
import Signee from 'signee'
import useMouseEvent from 'use-mouse-event'

const width = window.innerWidth
const height = window.innerHeight
const canvas = document.getElementById('canvas')
canvas.width = width
canvas.height = height
canvas.style.width = width + 'px'
canvas.style.height = height + 'px'

const instance = new Signee({
  canvas,
  width,
  height,
  scale: window.devicePixelRatio, // 可选
  requestAnimationFrame: cb => window.requestAnimationFrame(cb)
})

let isDrawing = false

useMouseEvent({
  el: canvas,
  onStart: e => {
    isDrawing = true
    instance.start({
      x: e.touches ? e.touches[0].clientX : e.offsetX,
      y: e.touches ? e.touches[0].clientY : e.offsetY,
      t: Date.now()
    })
  },
  onMove: e => {
    if (!isDrawing) return
    instance.draw({
      x: e.touches ? e.touches[0].clientX : e.offsetX,
      y: e.touches ? e.touches[0].clientY : e.offsetY,
      t: Date.now()
    })
  },
  onEnd: () => {
    isDrawing = false
    instance.end()
  }
})
```

---

## ⚙️ 配置项说明

| 参数名                  | 描述                         | 类型                             | 默认值           |
| ----------------------- | ---------------------------- | -------------------------------- | ---------------- |
| `canvas`                | 目标 canvas 元素             | `HTMLCanvasElement`              | 必填             |
| `width`                 | 画布宽度                     | `number`                         | 必填             |
| `height`                | 画布高度                     | `number`                         | 必填             |
| `scale`                 | 缩放比例（通常为 DPR）       | `number`                         | `1`              |
| `color`                 | 绘制颜色                     | `string`                         | `"#000000"`      |
| `openSmooth`            | 是否启用平滑曲线             | `boolean`                        | `true`           |
| `minWidth`              | 最小笔触宽度                 | `number`                         | `3`              |
| `maxWidth`              | 最大笔触宽度                 | `number`                         | `6`              |
| `minSpeed`              | 最低速度阈值                 | `number`                         | `1.5`            |
| `maxWidthDiffRate`      | 最大宽度变化速率             | `number`                         | `20`             |
| `maxHistoryLength`      | 最大历史记录（用于撤销）     | `number`                         | `20`             |
| `requestAnimationFrame` | 自定义 requestAnimationFrame | `(callback: () => void) => void` | 必传（部分平台） |

> ⚠️ 不同平台下需要传入不同的帧函数：
>
> - 浏览器：`window.requestAnimationFrame`
> - UniApp：`uni.requestAnimationFrame`
> - 微信小程序：`wx.requestAnimationFrame`

---

## 🧪 示例 Demo

- [Vue 2 示例](https://codesandbox.io/s/smooth-line-86qj3v?fontsize=14&hidenavigation=1&theme=dark)
- [Vue 3 示例](https://codesandbox.io/s/smooth-lint-vue3-example-o78wry)
- [React 示例](https://codesandbox.io/s/smooth-line-example-react-j5jnor)

---

欢迎提交 Issue 或 PR 参与贡献，也可用于自定义签名场景的进一步封装。
