import { Camera, Color, Component, find, gfx, Node, RenderTexture, UITransform, Vec3, view } from "cc";
import { JSB } from "cc/env";
import { Base64Utils } from "./Base64Utils";

/**
 * 截图工具
 */
export class CaptureUtils {


    public static captureNode(component: Component, node: Node) {
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
        });
    }



}