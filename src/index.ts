/// <reference path="../index.d.ts" />

// @ts-nocheck
/**
 * 获取绘制线条宽度
 * @returns lineWidth
 */
const getLineWidth = ({ speed, minSpeed, minWidth, maxWidth }) => {
    minSpeed = minSpeed > 10 ? 10 : minSpeed < 1 ? 1 : minSpeed;
    const addWidth = ((maxWidth - minWidth) * speed) / minSpeed;
    const lineWidth = Math.max(maxWidth - addWidth, minWidth);
    return Math.min(lineWidth, maxWidth);
};

/**
 * 获取弧度数据
 * @returns
 */
const getRadianData = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    if (dx === 0) return { val: 0, pos: -1 };
    if (dy === 0) return { val: 0, pos: 1 };
    const val = Math.abs(Math.atan(dy / dx));
    if ((x2 > x1 && y2 < y1) || (x2 < x1 && y2 > y1)) return { val, pos: 1 };
    return { val, pos: -1 };
};

/**
 * 获取弧度节点
 * @returns
 */
const getRadianPoints = (rd, x, y, h) => {
    const { val, pos } = rd;
    if (val === 0) {
        const v1 = [
            { x: x, y: y + h },
            { x: x, y: y - h },
        ];
        const v = [
            { y: y, x: x + h },
            { y: y, x: x - h },
        ];
        return pos === 1 ? v1 : v;
    }
    const dx = Math.sin(val) * h;
    const dy = Math.cos(val) * h;
    return pos === 1
        ? [
            { x: x + dx, y: y + dy },
            { x: x - dx, y: y - dy },
        ]
        : [
            { x: x + dx, y: y - dy },
            { x: x - dx, y: y + dy },
        ];
};


export default class Signee {
    constructor(options: SigneeOptions) {
        if (!options.canvas) return;
        this.canvas = options.canvas;
        this.scale = options.scale || 1;
        this.color = options.color || "#000000";
        this.openSmooth = options.openSmooth || true;
        this.minWidth = (options.minWidth || 3);
        this.maxWidth = (options.maxWidth || 6);
        this.minSpeed = options.minSpeed || 1.5;
        this.requestAnimationFrame = options.requestAnimationFrame;
        this.maxWidthDiffRate = options.maxWidthDiffRate || 20;
        this.maxHistoryLength = options.maxHistoryLength || 20;
        this.points = [];
        this.end = () => (this.points = []);
        this.start = (e) => this.initPoint(e);
        this.context = (() => {
            this.height = options.height;
            this.width = options.width;
            this.canvas.width = this.width * this.scale;
            this.canvas.height = this.height * this.scale;
            const ctx = this.canvas.getContext("2d");
            ctx.lineCap = "round";
            ctx.scale(this.scale, this.scale);
            return ctx;
        })();
    }

    draw(e) {
        this.initPoint(e);
        if (this.points.length < 2) return;
        const point = this.points.slice(-1)[0];
        const prePoint = this.points.slice(-2, -1)[0];
        if (this.requestAnimationFrame) {
            this.requestAnimationFrame(() => this.drawSmoothLine(prePoint, point));
            return;
        }
        this.drawSmoothLine(prePoint, point);
    }

    initPoint(event) {
        const t = Date.now();
        const prePoint = this.points.slice(-1)[0];
        if (prePoint && prePoint.t === t) {
            return;
        }
        const x = event.x;
        const y = event.y;
        if (prePoint && prePoint.x === x && prePoint.y === y) {
            return;
        }
        const point = { x, y, t: event.t || t, color: event.color || this.color };
        if (this.openSmooth && prePoint) {
            const prePoint2 = this.points.slice(-2, -1)[0];
            point.distance = Math.sqrt(
                Math.pow(point.x - prePoint.x, 2) + Math.pow(point.y - prePoint.y, 2)
            );
            point.speed = point.distance / (point.t - prePoint.t || 0.1);
            point.lineWidth = getLineWidth({
                speed: point.speed,
                minSpeed: this.minSpeed,
                minWidth: this.minWidth,
                maxWidth: event.maxWidth || this.maxWidth,
            });
            if (prePoint2 && prePoint2.lineWidth && prePoint.lineWidth) {
                const rate =
                    (point.lineWidth - prePoint.lineWidth) / prePoint.lineWidth;
                let maxRate = this.maxWidthDiffRate / 100;
                maxRate = maxRate > 1 ? 1 : maxRate < 0.01 ? 0.01 : maxRate;
                if (Math.abs(rate) > maxRate) {
                    const per = rate > 0 ? maxRate : -maxRate;
                    point.lineWidth = prePoint.lineWidth * (1 + per);
                }
            }
        }
        this.points.push(point);
        this.points = this.points.slice(-3);
    }

    drawSmoothLine(prePoint, point) {
        const dx = point.x - prePoint.x;
        const dy = point.y - prePoint.y;
        if (Math.abs(dx) + Math.abs(dy) <= this.scale) {
            point.lastX1 = point.lastX2 = prePoint.x + dx * 0.5;
            point.lastY1 = point.lastY2 = prePoint.y + dy * 0.5;
        } else {
            point.lastX1 = prePoint.x + dx * 0.3;
            point.lastY1 = prePoint.y + dy * 0.3;
            point.lastX2 = prePoint.x + dx * 0.7;
            point.lastY2 = prePoint.y + dy * 0.7;
        }
        point.perLineWidth = (prePoint.lineWidth + point.lineWidth) / 2;
        if (typeof prePoint.lastX1 === "number") {
            this.drawPointCurveLine({
                x1: prePoint.lastX2,
                y1: prePoint.lastY2,
                x2: prePoint.x,
                y2: prePoint.y,
                x3: point.lastX1,
                y3: point.lastY1,
                lineWidth: point.perLineWidth,
                color: point.color,
            });
            if (prePoint.isFirstPoint) return;
            if (
                prePoint.lastX1 === prePoint.lastX2 &&
                prePoint.lastY1 === prePoint.lastY2
            )
                return;
            const data = getRadianData(
                prePoint.lastX1,
                prePoint.lastY1,
                prePoint.lastX2,
                prePoint.lastY2
            );
            const points1 = getRadianPoints(
                data,
                prePoint.lastX1,
                prePoint.lastY1,
                prePoint.perLineWidth / 2
            );
            const points2 = getRadianPoints(
                data,
                prePoint.lastX2,
                prePoint.lastY2,
                point.perLineWidth / 2
            );
            this.drawTrapezoid({
                point1: points1[0],
                point2: points2[0],
                point3: points2[1],
                point4: points1[1],
                fillStyle: point.color,
            });
        } else {
            point.isFirstPoint = true;
        }
    }

    drawPointCurveLine({ x1, y1, x2, y2, x3, y3, lineWidth, color }) {
        this.context.lineWidth = Number(lineWidth.toFixed(1));
        this.context.beginPath();
        this.context.moveTo(Number(x1.toFixed(1)), Number(y1.toFixed(1)));
        this.context.quadraticCurveTo(
            Number(x2.toFixed(1)),
            Number(y2.toFixed(1)),
            Number(x3.toFixed(1)),
            Number(y3.toFixed(1))
        );
        this.context.strokeStyle = color;
        this.context.stroke();
    }

    // 绘制梯形
    drawTrapezoid({ point1, point2, point3, point4, fillStyle, strokeStyle }) {
        this.context.beginPath();
        this.context.moveTo(
            Number(point1.x.toFixed(1)),
            Number(point1.y.toFixed(1))
        );
        this.context.lineTo(
            Number(point2.x.toFixed(1)),
            Number(point2.y.toFixed(1))
        );
        this.context.lineTo(
            Number(point3.x.toFixed(1)),
            Number(point3.y.toFixed(1))
        );
        this.context.lineTo(
            Number(point4.x.toFixed(1)),
            Number(point4.y.toFixed(1))
        );
        this.context.closePath();
        if (fillStyle) {
            this.context.fillStyle = fillStyle;
            this.context.fill();
        }

        if (strokeStyle) {
            this.context.strokeStyle = strokeStyle;
            this.context.stroke();
        }
    }
}