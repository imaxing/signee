[中文文档](https://github.com/imaxing/signee/blob/main/README-zh-CN.md)

# Signee

> A lightweight, cross-platform signature and drawing canvas tool, adapted from [smooth-signature](https://github.com/linjc/smooth-signature) for use in browser, UniApp, and WeChat Mini Program environments.

---

## 📦 Installation

```bash
npm install signee
```

---

## 🚀 Quick Start

```js
import Signee from 'signee'
import useMouseEvent from 'use-mouse-event'

// Setup canvas
const width = window.innerWidth
const height = window.innerHeight
const canvas = document.getElementById('canvas')
canvas.width = width
canvas.height = height
canvas.style.width = width + 'px'
canvas.style.height = height + 'px'

// Create instance
const instance = new Signee({
  canvas,
  width,
  height,
  scale: window.devicePixelRatio, // optional
  requestAnimationFrame: cb => window.requestAnimationFrame(cb) // optional
})

let isDrawing = false

// Bind events
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

## ⚙️ Options

| Name                    | Description                        | Type                             | Default                        |
| ----------------------- | ---------------------------------- | -------------------------------- | ------------------------------ |
| `canvas`                | Target canvas element              | `HTMLCanvasElement`              | **Required**                   |
| `width`                 | Canvas width                       | `number`                         | **Required**                   |
| `height`                | Canvas height                      | `number`                         | **Required**                   |
| `scale`                 | Device pixel ratio                 | `number`                         | `1`                            |
| `color`                 | Stroke color                       | `string`                         | `"#000000"`                    |
| `openSmooth`            | Enable smoothing                   | `boolean`                        | `true`                         |
| `minWidth`              | Minimum stroke width               | `number`                         | `3`                            |
| `maxWidth`              | Maximum stroke width               | `number`                         | `6`                            |
| `minSpeed`              | Minimum stroke speed               | `number`                         | `1.5`                          |
| `maxWidthDiffRate`      | Maximum stroke width change rate   | `number`                         | `20`                           |
| `maxHistoryLength`      | Max number of undo history steps   | `number`                         | `20`                           |
| `requestAnimationFrame` | Custom requestAnimationFrame impl. | `(callback: () => void) => void` | **Required in some platforms** |

> ⚠️ `requestAnimationFrame` is platform-dependent:
>
> - **Web (Browser)**: `window.requestAnimationFrame`
> - **UniApp**: `uni.requestAnimationFrame`
> - **WeChat Mini Program**: `wx.requestAnimationFrame`

---

## 🧪 Demos

- [Codesandbox](https://codesandbox.io/p/sandbox/56t9pd)

- [Online Demo](https://signee.vercel.app)

For more use cases and integrations, feel free to open an issue or contribute to the project!
