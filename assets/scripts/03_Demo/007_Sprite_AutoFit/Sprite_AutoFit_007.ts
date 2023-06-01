import { _decorator, Button, Component, Node, Sprite, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Sprite_AutoFit_007')
export class Sprite_AutoFit_007 extends Component {

    @property([SpriteFrame])
    private spriteAssets: SpriteFrame[] = [];

    @property(Sprite)
    private fitXYSprite: Sprite;

    @property(Sprite)
    private fitCenterSprite: Sprite;

    @property(Sprite)
    private cropCenterSprite: Sprite;

    private assetIndex = 0;

    /** 精灵的宽、高 */
    private width: number = 300;
    private height: number = 300;

    /** 目标图片的宽、高，要与 spriteAssets 资源对应 */
    private imgWidth: number[] = [800, 1000, 6000, 235, 514];
    private imgHeight: number[] = [572, 1418, 2000, 332, 105];

    protected start(): void {
        this.refresh();
    }

    changeAsset() {
        this.assetIndex++;
        if (this.assetIndex >= this.spriteAssets.length) {
            this.assetIndex = 0;
        }
        this.refresh();
    }

    fitXY() {
        this.fitXYSprite.spriteFrame = this.spriteAssets[this.assetIndex];
        let ui = this.fitXYSprite.node.getComponent(UITransform);
        ui.setContentSize(this.width, this.height);
    }

    fitCenter() {
        let imgW = this.imgWidth[this.assetIndex];
        let imgH = this.imgHeight[this.assetIndex];
        this.fitCenterSprite.spriteFrame = this.spriteAssets[this.assetIndex];
        let scale = this.width / this.height;
        let imgScale = imgW / imgH;
        if (imgScale > scale) {
            imgW = this.width;
            imgH = this.width / imgScale;
        } else if (imgScale < scale) {
            imgW = this.height * imgScale;
            imgH = this.height;
        } else {
            imgW = this.width;
            imgH = this.height;
        }
        let ui = this.fitCenterSprite.node.getComponent(UITransform);
        ui.setContentSize(imgW, imgH);
    }

    cropCenter() {
        let imgW = this.imgWidth[this.assetIndex];
        let imgH = this.imgHeight[this.assetIndex];
        this.cropCenterSprite.spriteFrame = this.spriteAssets[this.assetIndex];
        let scale = this.width / this.height;
        let imgScale = imgW / imgH;
        if (imgScale > scale) {
            imgW = this.width;
            imgH = this.width / imgScale;
        } else if (imgScale < scale) {
            imgW = this.height * imgScale;
            imgH = this.height;
        } else {
            imgW = this.width;
            imgH = this.height;
        }
        // 重新计算缩放以填充满容器
        let fitScale = 1;
        if (imgW < this.width) {
            fitScale = this.width / imgW;
        }
        if (imgH < this.height) {
            fitScale = this.height / imgH;
        }
        console.log(`img w = ${imgW} , h = ${imgH} , rescale = ${fitScale}`);
        let ui = this.cropCenterSprite.node.getComponent(UITransform);
        ui.setContentSize(imgW * fitScale, imgH * fitScale);
    }

    private refresh() {
        this.fitXY();
        this.fitCenter();
        this.cropCenter();
    }

}

