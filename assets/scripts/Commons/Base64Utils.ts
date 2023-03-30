
/**
 * Base64 工具类
 */
export class Base64Utils {

    /**
     * 图像转 base64
     * @param pixels 图像原像素数据
     * @param width 图像宽
     * @param height 图像高
     * @param isJPG 是否 jpg 格式
     * @returns base64 编码
     */
    public static pixels2Base64(pixels: Uint8Array, width: number, height: number, isJPG: boolean = true) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        let imageData = ctx.createImageData(width, height);
        this.fillPixels(pixels, width, height, imageData.data);
        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL(isJPG ? "image/jpeg" : "image/png");
    }

    /**
     * 填充像素点
     * @param pixels 图像原像素数据
     * @param width 图像宽
     * @param height 图像高
     * @param data 目标数据
     */
    private static fillPixels(pixels: Uint8Array, width: number, height: number, data: Uint8ClampedArray) {
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let start = srow * width * 4;
            let reStart = row * width * 4;
            for (let i = 0; i < rowBytes; i++) {
                data[reStart + i] = pixels[start + i];
            }
        }
    }
}