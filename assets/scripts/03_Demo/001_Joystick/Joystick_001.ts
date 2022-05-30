import { Camera, Component, EventTouch, Input, Node, UITransform, v2, v3, Vec2, Vec3, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Joystick_001')
export class Joystick_001 extends Component {

    @property(Camera)
    camera: Camera = null;

    @property(Node)
    controlNode: Node = null;

    // 控制点最大半径
    @property(Number)
    maxRadius: number = 100;

    // 记录向量
    public vector: Vec2 = v2(0, 0);
    // 记录旋转角度
    public angle: number = 0;

    onLoad() {
        this.node.on(Input.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.touchEnd, this);
    }

    start() {
    }

    /**
     * 注意坐标的转换：touch 拿到的是屏幕坐标，要先转为世界坐标，再转到节点坐标
     */
    private convertToNodePos(event: EventTouch): Vec3 {
        // 获取触摸点的屏幕坐标
        let touchPos = event.getLocation();
        // 将屏幕坐标转为世界坐标
        let worldPos = this.camera.screenToWorld(v3(touchPos.x, touchPos.y, 0));
        // 将世界坐标转为节点的 UI 坐标
        return this.controlNode.parent.getComponent(UITransform).convertToNodeSpaceAR(v3(worldPos.x, worldPos.y, 0));
    }

    private touchStart(event: EventTouch) {
        this.controlNode.setPosition(this.convertToNodePos(event));
        console.log('touchStart');
    }

    private touchMove(event: EventTouch) {
        let pos = this.convertToNodePos(event);
        if (pos.length() < this.maxRadius) {
            this.controlNode.setPosition(pos);
        } else {
            // 将向量归一化
            pos.normalize();
            // 将控制点位置限制在最大半径范围内
            this.controlNode.setPosition(pos.x * this.maxRadius, pos.y * this.maxRadius);
        }
        // 获取控制点的中心位置向量
        this.vector = v2(this.controlNode.position.x, this.controlNode.position.y);
        console.log('touchMove');
    }

    private touchEnd(event: EventTouch) {
        this.controlNode.position = v3(0, 0, 0);
        this.vector = v2(0, 0);
        console.log('touchEnd');
    }

    /**
     * 向量转角度
     */
    private vectorToAngle(vector: Vec2) {
        // 计算出目标角度的弧度
        let radian = Math.atan2(vector.x, vector.y);
        return -this.radianToAngle(radian);
    }

    /**
     * 弧度转角度公式：180 / π * 弧度
     */
    private radianToAngle(radian: number) {
        return 180 / Math.PI * radian;
    }

    /**
     * 角度转弧度公式：π / 180 * 角度 
     */
    private angleToRadian(angle: number) {
        return Math.PI / 180 * angle;
    }

    update(dt: number) {
        if (this.vector.x == 0 && this.vector.y == 0) return;
        // 计算角色的旋转角度
        this.angle = this.vectorToAngle(this.vector);
    }

    onDestroy() {
        this.node.off(Input.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(Input.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(Input.EventType.TOUCH_END, this.touchEnd, this);
        this.node.off(Input.EventType.TOUCH_CANCEL, this.touchEnd, this);
    }
}

