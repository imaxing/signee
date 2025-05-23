

interface SigneeOptions {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    scale?: number;
    color?: string;
    openSmooth?: boolean;
    minWidth?: number;
    maxWidth?: number;
    minSpeed?: number;
    maxWidthDiffRate?: number;
    maxHistoryLength?: number;
    /**
     * 不同平台传入不同的方法
     * window.requestAnimationFrame 浏览器
     * uni.requestAnimationFrame 小程序
     * wx.requestAnimationFrame 微信小程序
     */
    requestAnimationFrame: (callback: () => void) => void;
}

