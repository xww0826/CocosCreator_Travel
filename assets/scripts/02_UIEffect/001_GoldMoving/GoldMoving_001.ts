
import { Component, instantiate, Node, NodePool, Prefab, tween, UITransform, Vec3, _decorator } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 演示一种游戏中玩家获得金币后，金币移动动效
 */
@ccclass('GoldMoving_001')
export class GoldMoving_001 extends Component {

    @property({ type: Node, tooltip: "移动到目标" })
    target: Node = null;

    @property(Prefab)
    goldPrefab: Prefab = null;

    @property(Number)
    maxCoin: Number = 5;

    @property(Number)
    minDuration: Number = 0.8;

    @property(Number)
    maxDuration: Number = 2.2;

    private scale: number;

    private goldPool: NodePool = new NodePool();

    start() {
        // for (let index = 0; index < this.maxCoin; index++) {
        //     let gold = instantiate(this.goldPrefab);
        //     gold.parent = this.node;
        //     this.goldPool.put(gold);
        // }

        // this.scale = screen.width / 750;

        // this.node.getComponent(UITransform).convertToWorldSpaceAR(this.target.position);

        // console.log("屏幕宽高" + screen.width, screen.height)
        // console.log("position" + this.target.position);
        // console.log("worldPosition" + this.target.worldPosition);
        // console.log("paent convertToWorldSpaceAR" + this.target.parent.getComponent(UITransform).convertToWorldSpaceAR(this.target.position));
        // console.log("paent parent convertToWorldSpaceAR" + this.target.parent.parent.getComponent(UITransform).convertToWorldSpaceAR(this.target.position));


        // console.log("====target=====>" + this.target.worldPosition)
        // console.log("====target=====>" + this.target.worldPosition.multiply(new Vec3(this.scale, this.scale)))
        // console.log("====position=====>" + this.target.position)
        // console.log("====worldPosition=====>" + this.target.worldPosition)
        // console.log("====target=====>" + this.node.getWorldPosition(this.target.position).toString())


        // console.log("====getVisibleSize=====>" + view.getVisibleSize().toString())
        // console.log("====getVisibleSize=====>" + view.getVisibleSizeInPixel().toString())
        // console.log("====getVisibleSize=====>" + screen.width, screen.height)
        // console.log("====getVisibleSize=====>" + screen.availWidth, screen.availHeight)

    }

    public addGold() {
        for (let index = 0; index < this.maxCoin; index++) {
            // let gold = this.goldPool.get();
            // if (!gold) {
            let gold = instantiate(this.goldPrefab);
            gold.parent = this.node;
            // this.goldPool.put(gold);
            // }

            tween(gold)
                .to(this.random(this.minDuration, this.maxDuration), { worldPosition: this.target.worldPosition })
                .start();
        }

        // let gold = instantiate(this.goldPrefab);
        // gold.parent = this.node;

        // tween(gold)
        //     // .to(3, { position: this.transPos(this.target, this.node) })
        //     .to(3, { worldPosition: this.target.worldPosition })
        //     .start();
    }

    private random(min, max) {
        return Math.floor((Math.random() * (max - min)) + min);
    }


    /**
         * UI节点转换到目标节点下的坐标
         * @param node 节点
         * @param targetNode 目标节点
         * @returns {转换后的坐标的点|Point}
         */
    transPos(node: Node, targetNode: Node): Vec3 {
        //转世界坐标
        var endGlobalPos = this.getWorldPos(node);
        if (!endGlobalPos) return null;
        //再转局部坐标
        var endPos = targetNode.getComponent(UITransform).convertToNodeSpaceAR(endGlobalPos);
        return endPos;
    }

    /**
     * 转换世界坐标
     * @param node
     */
    getWorldPos(node: Node) {
        if (!node.parent) return null;
        let pos = node.parent.getComponent(UITransform).convertToWorldSpaceAR(node.getPosition());
        return pos;
    }

}
