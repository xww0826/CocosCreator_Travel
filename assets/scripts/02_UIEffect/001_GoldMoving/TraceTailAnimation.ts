import { instantiate, Node, NodePool, Prefab, tween, Vec3 } from "cc";

/** 道具类型 */
enum PropType {

    gold,

    diamond
}

export class TraceTailAnimBuilder {

}

/**
 * 拖影轨迹移动动效
 */
export default class TraceTailAnimation {

    public static Type = PropType;

    private static propMap: Map<PropType, NodePool> = new Map();

    public static async playAnim(propType: PropType, animPrefab: Prefab, parent: Node, animPropNum: number, startWorldPos: Vec3, endWorldPos: Vec3) {
        let nodePool = this.propMap.get(propType);
        if (!nodePool) {
            this.propMap.set(propType, new NodePool());
        }

        let nodes = await this.generateNodes(propType, animPrefab, parent, animPropNum, startWorldPos);
        this.play(nodes, endWorldPos);
    }

    private static async generateNodes(propType: PropType, animPrefab: Prefab, parent: Node, animPropNum: number, startWorldPos: Vec3) {
        return new Promise<Array<Node>>((r) => {
            let nodes = new Array<Node>();
            for (let index = 0; index < animPropNum; index++) {
                let nodePool = this.propMap.get(propType);
                let cacheNode = nodePool.get();
                if (!cacheNode) {
                    cacheNode = instantiate(animPrefab);
                    nodePool.put(cacheNode);
                }
                cacheNode.parent = parent;
                cacheNode.worldPosition = startWorldPos;
                nodes.push(cacheNode);
                r(nodes);
            }
        });
    }

    private static play(nodes: Array<Node>, endWorldPos: Vec3) {
        if (!nodes || nodes.length == 0) return;
        nodes.forEach(node => {
            let duration = this.random(1.2, 1.5);
            tween(node)
                .to(duration, { worldPosition: endWorldPos }, { easing: "elasticInOut" })
                .start();
        });
    }

    private static random(min, max) {
        return (Math.random() * (max - min)) + min;
    }

}