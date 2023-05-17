import { _decorator, Component, EventTouch, Node, Sprite, SpriteFrame, Texture2D, UITransform, v3, Vec3 } from 'cc';
import { CaptureUtils } from '../../Commons/CaptureUtils';
const { ccclass, property } = _decorator;

@ccclass('Touch_Smooth_005_Algorithm_1')
export class Touch_Smooth_005_Algorithm_1 extends Component {

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
    public stainWidth: number;
    public stainHeight: number;
    private radius: number = 50;
    private wipePoints: Map<string, number>;

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
        this.stainWidth = textureData.width;
        this.stainHeight = textureData.height;
        this.stainTextureData = textureData.pixels;
        this.calculatePixels();
    }

    public calculatePixels() {
        this.wipePoints = new Map();
        let total = this.stainWidth * this.stainHeight * 4;
        for (let i = 0; i < this.stainHeight; i++) { // y 轴
            for (let q = 0; q < this.stainWidth; q++) {// x 轴
                let index = (i * this.stainWidth + q) * 4;
                let alpha = this.stainTextureData[index + 3];
                if (alpha > 0) {
                    let key = `${q}_${this.stainHeight - i}`;
                    this.wipePoints.set(key, index + 3);
                }
            }
        }
    }

    onTouchStart(event: EventTouch) {
    }

    onTouchMove(event: EventTouch) {
        let uiPoint = event.getUILocation();
        let worldPos = v3(uiPoint.x + this.stainWidth / 2, uiPoint.y + this.stainHeight / 2, 0);
        let point = this.panel.getComponent(UITransform).convertToNodeSpaceAR(worldPos);

        // 矩形匹配区域
        let roundX = Math.round(point.x);
        let roundY = Math.round(point.y);
        let left = roundX - this.radius;
        let right = roundX + this.radius;
        let top = roundY - this.radius;
        let bottom = roundY + this.radius;

        var hasMatch = false;
        for (var x = left; x < right; x++) {
            for (var y = top; y < bottom; y++) {
                let idx = null;
                let key = `${x}_${y}`;
                let lineLength = Math.sqrt(Math.pow(Math.abs(point.x - x), 2) + Math.pow(Math.abs(point.y - y), 2));
                if (lineLength <= this.radius) {
                    idx = this.wipePoints.get(key);
                }
                if (idx) {
                    hasMatch = true;
                    this.stainTextureData[idx] = 0;
                    this.wipePoints.delete(key);
                }
            }
        }

        if (hasMatch) {
            this.stainTexture.uploadData(this.stainTextureData);
        }
    }

    onTouchEnd(event: EventTouch) {
    }

    update(deltaTime: number) {

    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this, true);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this, true);
    }
}

