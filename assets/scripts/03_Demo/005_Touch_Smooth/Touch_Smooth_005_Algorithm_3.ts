import { _decorator, Component, EventTouch, Node, Sprite, SpriteFrame, Texture2D, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { CaptureUtils } from '../../Commons/CaptureUtils';
const { ccclass, property } = _decorator;


@ccclass('Touch_Smooth_005_Algorithm_3')
export class Touch_Smooth_005_Algorithm_3 extends Component {

    @property(Sprite)
    public originSprite: Sprite;

    @property(Sprite)
    public stainSprite: Sprite;

    @property(Texture2D)
    public originTexture: Texture2D;

    @property(Texture2D)
    public stainTexture: Texture2D;

    @property(Node)
    public panel: Node;

    private stainTextureData: Uint8Array;
    public width: number;
    public height: number;
    private radius: number = 50;
    private wipePoints: Map<string, number>;

    /**上一次绘制的直线的终点 */
    private previousLineEndPos: Vec2;
    private previousLineEndPosT: Vec2;
    private previousLineEndPosB: Vec2;
    /**上一次绘制的直线的端点样式 */
    private previousLineCircleEnd: boolean;
    /**上一次绘制的直线的宽度 */
    private previousLineWidth: number;

    onEnable() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this, true);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this, true);
    }

    async start() {
        // 原图
        let originFrame = new SpriteFrame();
        originFrame.texture = this.originTexture;
        this.originSprite.spriteFrame = originFrame;

        // 遮罩图
        let stainFrame = new SpriteFrame();
        stainFrame.texture = this.stainTexture;
        this.stainSprite.spriteFrame = stainFrame;

        let textureData = await CaptureUtils.captureNode(this, this.stainSprite.node);
        this.width = textureData.width;
        this.height = textureData.height;
        this.stainTextureData = textureData.pixels;
        this.initLineData();
        this.calculatePixels();
    }

    private initLineData() {
        this.previousLineEndPos = new Vec2();
        this.previousLineEndPosT = new Vec2();
        this.previousLineEndPosB = new Vec2();
        this.previousLineCircleEnd = true;
        this.previousLineWidth = 20;
    }

    public calculatePixels() {
        this.wipePoints = new Map();
        let total = this.width * this.height * 4;
        for (let i = 0; i < this.height; i++) { // y 轴
            for (let q = 0; q < this.width; q++) {// x 轴
                let index = (i * this.width + q) * 4;
                let alpha = this.stainTextureData[index + 3];
                if (alpha > 0) {
                    let key = `${q}_${this.height - i}`;
                    this.wipePoints.set(key, index + 3);
                }
            }
        }
    }

    onTouchStart(event: EventTouch) {
        let uiPoint = event.getUILocation();
        this.moveTo(uiPoint.x, uiPoint.y);
    }

    onTouchMove(event: EventTouch) {
        let uiPoint = event.getUILocation();
        this.lineTo(uiPoint.x, uiPoint.y);
        this.stainTexture.uploadData(this.stainTextureData);
    }

    onTouchEnd(event: EventTouch) {
    }

    update(deltaTime: number) {

    }

    moveTo(x: number, y: number) {
        x = Math.round(x);
        y = Math.round(y);
        this.previousLineEndPos.set(x, y);
        this.previousLineEndPosT.set(x, y);
        this.previousLineEndPosB.set(x, y);
    }

    public lineTo(x: number, y: number) {
        x = Math.round(x);
        y = Math.round(y);
        if (this.previousLineEndPos.x == x && this.previousLineEndPos.y == y) return;
        let width = this.previousLineWidth;
        let circleEnd = this.previousLineCircleEnd;
        let x1 = this.previousLineEndPos.x;
        let y1 = this.previousLineEndPos.y;
        let x2 = x;
        let y2 = y;
        if (x1 > x2) {
            x1 = x2;
            y1 = y2;
            x2 = this.previousLineEndPos.x;
            y2 = this.previousLineEndPos.y;
        }
        let offsetX = 0;
        let offsetY = 0;
        let rateK = 1;
        if (x1 == x2) {
            offsetX = Math.round(width * 0.5);
        } else if (y1 == y2) {
            offsetY = Math.round(width * 0.5);
        } else {
            let k = (y2 - y1) / (x2 - x1);
            rateK = Math.sqrt(k * k + 1);
            offsetY = width * 0.5 / rateK;
            offsetX = Math.round(offsetY * k);
            offsetY = Math.round(offsetY);
        }
        if (!circleEnd) {
            if (this.previousLineEndPos.x != this.previousLineEndPosT.x
                || this.previousLineEndPos.y != this.previousLineEndPosT.y) {
                let p1 = new Vec2(this.previousLineEndPos.x - offsetX, this.previousLineEndPos.y + offsetY);
                let p2 = new Vec2(this.previousLineEndPos.x + offsetX, this.previousLineEndPos.y - offsetY);
                this._drawTriangle([p1, p2, this.previousLineEndPosT]);
                this._drawTriangle([p1, p2, this.previousLineEndPosB]);
            }
        } else {
            this._drawCircle(x1, y1, width * 0.5);
            this._drawCircle(x2, y2, width * 0.5);
        }
        this._drawLine(new Vec2(x1, y1), new Vec2(x2, y2), width, offsetX, offsetY, rateK);

        this.previousLineEndPos.set(x, y);
        this.previousLineEndPosT.set(x - offsetX, y + offsetY);
        this.previousLineEndPosB.set(x + offsetX, y - offsetY);
    }

    private _drawCircle(x: number, y: number, radius: number) {
        radius = Math.round(radius);
        if (radius == 0) return;
        //三角形的斜边的平方
        let dis = radius * radius;
        // let minX = this._minX(x - radius);
        // let maxX = this._maxX(x + radius);
        // for (let i = minX; i <= maxX; ++i) {
        //     let r = x - i;
        //     r = Math.round(Math.sqrt(dis - r * r));
        //     let minY = this._minY(y - r);
        //     let maxY = this._maxY(y + r);
        //     for (let j = minY; j <= maxY; ++j) {
        //         this._drawPixel(i, j);
        //     }
        // }
        let minY = this.clampY(y - radius);
        let maxY = this.clampY(y + radius);
        for (let j = minY; j <= maxY; ++j) {
            let r = j - y;
            r = Math.round(Math.sqrt(dis - r * r));
            let minX = this.clampX(x - r);
            let maxX = this.clampX(x + r);
            this._drawRowPixel(minX, maxX, j);
        }
    }

    /**
     * 绘制直线，不包含线段端点样式
     * @param p1        线段起点坐标
     * @param p2        线段终点坐标
     * @param width     线段宽度
     * @param color     线段颜色
     */
    private _drawLine(p1: Vec2, p2: Vec2, width: number, offsetX: number, offsetY: number, slopeRate: number) {
        if (p1.y == p2.y) {
            //水平直线
            let x = p1.x < p2.x ? p1.x : p2.x;
            this._drawRect(new Vec2(x, Math.round(p1.y - width * 0.5)), Math.abs(p1.x - p2.x), width);
        } else if (p1.x == p2.x) {
            //垂直直线
            let y = p1.y < p2.y ? p1.y : p2.y;
            this._drawRect(new Vec2(Math.round(p1.x - width * 0.5), y), width, Math.abs(p1.y - p2.y));
        } else {
            //倾斜直线
            let inverseK = (p1.x - p2.x) / (p1.y - p2.y);
            let p1t = new Vec2(p1.x - offsetX, p1.y + offsetY);
            let p1b = new Vec2(p1.x + offsetX, p1.y - offsetY);
            let p2t = new Vec2(p2.x - offsetX, p2.y + offsetY);
            let p2b = new Vec2(p2.x + offsetX, p2.y - offsetY);
            let p1c = new Vec2();
            let p2c = new Vec2();
            let height = Math.round(width * slopeRate);
            if (p2.y > p1.y) {
                if (p1b.x < p2t.x) {
                    p1c.x = p1b.x;
                    p1c.y = p1b.y + height;
                    p2c.x = p2t.x;
                    p2c.y = p2t.y - height;
                    this._drawVerticalTriangle(p1c, p1b, p1t);
                    this._drawParallelogram(p1b, p2c, height);
                    this._drawVerticalTriangle(p2t, p2c, p2b);
                } else {
                    p1c.x = p1b.x;
                    p1c.y = Math.round(p2t.y - (p1c.x - p2t.x) * inverseK);
                    p2c.x = p2t.x;
                    p2c.y = Math.round(p1b.y + (p1b.x - p2c.x) * inverseK);
                    this._drawVerticalTriangle(p2t, p2c, p1t);
                    this._drawParallelogram(p2c, p1b, p2t.y - p2c.y);
                    this._drawVerticalTriangle(p1c, p1b, p2b);
                }
            } else {
                if (p1t.x < p2b.x) {
                    p1c.x = p1t.x;
                    p1c.y = p1t.y - height;
                    p2c.x = p2b.x;
                    p2c.y = p2b.y + height;
                    this._drawVerticalTriangle(p1t, p1c, p1b);
                    this._drawParallelogram(p1c, p2b, height);
                    this._drawVerticalTriangle(p2c, p2b, p2t);
                } else {
                    p1c.x = p1t.x;
                    p1c.y = Math.round(p2b.y - (p1c.x - p2b.x) * inverseK);
                    p2c.x = p2b.x;
                    p2c.y = Math.round(p1t.y + (p1t.x - p2c.x) * inverseK);
                    this._drawVerticalTriangle(p2c, p2b, p1b);
                    this._drawParallelogram(p2b, p1c, p1t.y - p1c.y);
                    this._drawVerticalTriangle(p1t, p1c, p2t);
                }
            }

        }
    }

    /**
     * 绘制矩形
     * @param p         矩形左下顶点的坐标
     * @param w         矩形宽度
     * @param h         矩形高度
     * @param color     矩形填充的颜色
     */
    private _drawRect(p: Vec2, w: number, h: number) {
        let minX = this.clampX(p.x);
        let maxX = this.clampX(p.x + w);
        let minY = this.clampY(p.y);
        let maxY = this.clampY(p.y + h);
        // for (let x = minX; x <= maxX; ++x) {
        //     for (let y = minY; y <= maxY; ++y) {
        //         this._drawPixel(x, y);
        //     }
        // }
        for (let y = minY; y <= maxY; ++y) {
            this._drawRowPixel(minX, maxX, y);
        }
    }

    /**
     * 连续绘制一列中的像素点
     * @param startY    起点Y坐标
     * @param endY      终点Y坐标
     * @param x         X坐标
     */
    private _drawColPixel(startY: number, endY: number, x: number) {
        let index = (startY * this.width + x) * 4;
        for (let y = startY; y <= endY; ++y) {

            // console.log("=========x = " + x + " y = " + y);
            let key = `${x}_${y}`;
            let idx = this.wipePoints.get(key);
            if (idx) {
                this.stainTextureData[idx] = 0;
                this.wipePoints.delete(key);
            }
            index += this.width * 4;
        }
    }

    /**
     * 连续绘制一行中的像素点
     * @param startX    起点X坐标
     * @param endX      终点X坐标
     * @param y         Y坐标
     */
    private _drawRowPixel(startX: number, endX: number, y: number) {
        let index = (y * this.width + startX) * 4;
        for (let x = startX; x <= endX; ++x) {
            // console.log("=========x = " + x + " y = " + y);

            let key = `${x}_${y}`;
            let idx = this.wipePoints.get(key);
            if (idx) {
                this.stainTextureData[idx] = 0;
                this.wipePoints.delete(key);
            }
            index += 4;
        }

    }

    /**
     * 绘制一条边与Y轴平行的三角形
     * @param p1    三角形垂直边的 上 顶点坐标
     * @param p2    三角形垂直边的 下 顶点坐标
     * @param p3    三角形 左侧或右侧 顶点坐标
     * @param color 要绘制的颜色
     */
    private _drawVerticalTriangle(p1: Vec2, p2: Vec2, p3: Vec2) {
        if (p3.x == p1.x) return;
        let k1 = (p3.y - p1.y) / (p3.x - p1.x);
        let k2 = (p3.y - p2.y) / (p3.x - p2.x);
        let maxX = p3.x, minX = p1.x;
        if (maxX < minX) {
            maxX = p1.x;
            minX = p3.x;
        }
        minX = this._minX(minX);
        maxX = this._maxX(maxX);
        for (let x = minX; x <= maxX; ++x) {
            let maxY = this.clampY(Math.round(p1.y + (x - p1.x) * k1));
            let minY = this.clampY(Math.round(p2.y + (x - p2.x) * k2));
            this._drawColPixel(minY, maxY, x);
            // for (let y = minY; y <= maxY; ++y) {
            //     this._drawPixel(x, y);
            // }
        }
    }

    /**
     * 绘制任意三角形
     * @param p1    顶点坐标
     * @param p2 
     * @param p3 
     * @param color 填充颜色
     */
    private _drawTriangle(pList: Vec2[]) {
        pList.sort((a, b) => {
            return a.x - b.x;
        });
        let p1 = pList[0];
        let p2 = pList[1];
        let p3 = pList[2];
        if (p1.x == p2.x) {
            if (p1.x == p3.x) return;
            if (p1.y < p2.y) {
                p1 = pList[1];
                p2 = pList[0];
            }
            this._drawVerticalTriangle(p1, p2, p3);
            return;
        }
        let k = (p3.y - p1.y) / (p3.x - p1.x);
        let p4 = new Vec2(p2.x, Math.round(p1.y + (p2.x - p1.x) * k));
        if (p4.y == p2.y) return;
        if (p4.y < p2.y) {
            this._drawVerticalTriangle(p2, p4, p1);
            this._drawVerticalTriangle(p2, p4, p3);
        } else {
            this._drawVerticalTriangle(p4, p2, p1);
            this._drawVerticalTriangle(p4, p2, p3);
        }
    }

    /**
     * 绘制平行四边形，平行四边形的左右两边与Y轴平行
     * @param p1        左下顶点坐标
     * @param p2        右下顶点坐标
     * @param height    垂直边高度
     * @param color     颜色
     */
    private _drawParallelogram(p1: Vec2, p2: Vec2, height: number) {
        if (p1.x == p2.x) return;
        let k = (p2.y - p1.y) / (p2.x - p1.x);
        let minX = this._minX(p1.x);
        let maxX = this._maxX(p2.x);
        for (let x = minX; x <= maxX; ++x) {
            let minY = p1.y + Math.round((x - p1.x) * k);
            let maxY = minY + height;
            minY = this._minY(minY);
            maxY = this._maxY(maxY);
            this._drawColPixel(minY, maxY, x);
            // for (let y = minY; y <= maxY; ++y) {
            //     this._drawPixel(x, y);
            // }
        }
    }

    private _minX(x: number): number {
        return x >= 0 ? x : 0;
    }
    private _maxX(x: number): number {
        return x < this.width ? x : this.width - 1;
    }
    private _minY(y: number): number {
        return y >= 0 ? y : 0;
    }
    private _maxY(y: number): number {
        return y < this.height ? y : this.height - 1;
    }
    private clampX(x: number): number {
        if (x < 0) return 0;
        if (x >= this.width) return this.width - 1;
        return x;
    }
    private clampY(y: number): number {
        if (y < 0) return 0;
        if (y >= this.height) return this.height - 1;
        return y;
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this, true);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this, true);
    }
}

