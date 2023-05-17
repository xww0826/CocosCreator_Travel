import { Camera, Color, Component, find, gfx, ImageAsset, Node, RenderTexture, Sprite, SpriteFrame, Texture2D, UITransform, Vec3, view } from "cc";
import { JSB } from "cc/env";
import { Base64Utils } from "./Base64Utils";

/**
 * 截图工具
 */
export class CaptureUtils {


    public static async captureNode(component: Component, node: Node) {
        return new Promise<{ pixels: Uint8Array, width: number, height: number }>(r => {
            // 创建可视区域大小的纹理
            let size = view.getVisibleSize();
            let textureWidth = Math.round(size.width);
            let textureHeight = Math.round(size.height);
            let renderTexture = new RenderTexture();
            renderTexture.reset({ width: textureWidth, height: textureHeight });
            // 将 Node 转到世界坐标
            let uiTransform = node.getComponent(UITransform);
            let worldPos = uiTransform.convertToWorldSpaceAR(Vec3.ZERO);
            // 计算 Node 的实际宽、高
            let width = Math.round(uiTransform.width * node.getScale().x);
            let height = Math.round(uiTransform.height * node.getScale().y);
            // 计算 Node 的左下角世界坐标
            let x = Math.round(worldPos.x - width * uiTransform.anchorX);
            let y = Math.round(worldPos.y - height * uiTransform.anchorY);
            // 创建相机并在下一帧进行渲染
            let camera = find('Canvas/CaptureCamera').getComponent(Camera);
            camera.orthoHeight = Math.round(textureHeight / 2);
            camera.targetTexture = renderTexture;
            // camera.clearColor = new Color(255, 255, 255, 0);
            // camera.clearFlags = gfx.ClearFlagBit.COLOR;
            // camera.clearDepth = 0;
            component.scheduleOnce(() => {
                // 将纹理转为像素点
                let pixels = renderTexture.readPixels(x, y, width, height);
                if (!JSB) {
                    let base64 = Base64Utils.pixels2Base64(pixels, width, height, false);
                    console.log(base64);
                }
                this.flipPixels(pixels, width, height);
                r({ pixels: pixels, width: width, height: height });
            });
        });
    }

    public static captureNode2(component: Component, node: Node, sprite: Sprite) {
        // 将 Node 转到世界坐标
        let uiTransform = node.getComponent(UITransform);
        let worldPos = uiTransform.convertToWorldSpaceAR(Vec3.ZERO);
        // 计算 Node 的实际宽、高
        let width = Math.round(uiTransform.width * node.getScale().x);
        let height = Math.round(uiTransform.height * node.getScale().y);
        // 计算 Node 的左下角世界坐标
        let x = Math.round(worldPos.x - width * uiTransform.anchorX);
        let y = Math.round(worldPos.y - height * uiTransform.anchorY);
        // 创建可视区域大小的纹理
        let renderTexture = new RenderTexture();
        renderTexture.reset({ width: width, height: height });
        // 创建相机并在下一帧进行渲染
        let camera = find('Canvas/CaptureCamera-001').getComponent(Camera);
        // let camera = node.getComponent(Camera);
        if (!camera) {
            camera = node.addComponent(Camera)
        }
        camera.far = 2000;
        camera.projection = Camera.ProjectionType.ORTHO;
        camera.orthoHeight = Math.round(height / 2);
        camera.targetTexture = renderTexture;
        camera.clearColor = new Color(255, 255, 255, 0);
        camera.clearFlags = gfx.ClearFlagBit.COLOR;
        camera.clearDepth = 0;
        component.scheduleOnce(() => {
            // 将纹理转为像素点
            let pixels = renderTexture.readPixels(0, 0, width, height);
            this.showCapture(sprite, pixels, width, height);
            if (!JSB) {
                let base64 = Base64Utils.pixels2Base64(pixels, width, height, false);
                console.log(base64);
            }
        }, 1);
    }

    public static showCapture(sprite: Sprite, pixels: Uint8Array, width: number, height: number) {
        let imageAsset: ImageAsset = new ImageAsset();
        imageAsset.reset({
            _data: pixels,
            width: width,
            height: height,
            format: Texture2D.PixelFormat.RGBA8888,
            _compressed: false
        });
        let texture = new Texture2D();
        texture.reset({ width: width, height: height });
        texture.image = imageAsset;
        let spriteFrame: SpriteFrame = new SpriteFrame();
        spriteFrame.packable = false
        spriteFrame.texture = texture;
        spriteFrame.flipUVY = true;
        sprite.spriteFrame = spriteFrame;
    }

    public static flipPixels(pixels: Uint8Array, width, height) {
        let len = Math.floor(height / 2);
        let rowBytes = width * 4;
        for (let row = 0; row < len; row++) {
            let srow = height - 1 - row;
            let reStart = row * width * 4;
            let reEnd = srow * width * 4;
            // save the piexls data
            for (let i = 0; i < rowBytes; i++) {
                let temp = pixels[reStart + i];
                pixels[reStart + i] = pixels[reEnd + i];
                pixels[reEnd + i] = temp;
            }
        }
    }
}