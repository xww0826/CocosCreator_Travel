import { Component, instantiate, Label, Node, Prefab } from 'cc';

export class GeneratorLoad {

    /** 分帧执行时间 */
    private static duration: number = 8;

    public static async loadItemPerframe(com: Component, count: number, itemPrefab: Prefab, content: Node) {
        content.removeAllChildren();
        this.executePerFrame(com, this.loadItem(count, itemPrefab, content), this.duration);
    }

    /**
     * 分帧执行 Generator 逻辑
     *
     * @param generator 
     * @param duration 每次执行 Generator 的操作时，最长可持续执行时长（假设值为8ms，那么表示1帧（总共16ms）下，分出8ms时间给此逻辑执行）
     */
    private static async executePerFrame(com: Component, generator: Generator, duration: number) {
        let startTime = Date.now();
        // 一直从 Generator 中获取已经拆分好的代码段出来执行
        for (let iter = generator.next(); ; iter = generator.next()) {
            if (iter == null || iter.done) return;

            // 每执行完一段小代码段，都检查一下是否已经超过我们分配的本帧，这些小代码端的最大可执行时间
            if (Date.now() - startTime > duration) {
                // 如果超过了，那么本帧就不在执行，开定时器，让下一帧再执行
                com.scheduleOnce(() => { this.executePerFrame(com, generator, this.duration); });
                return; //此处一定要 return
            }
        }
    };

    private static * loadItem(count: number, itemPrefab: Prefab, content: Node) {
        for (let i = 0; i < count; i++) {
            yield this.instantiateItem(i, itemPrefab, content);
        }
    }

    private static instantiateItem(index: number, itemPrefab: Prefab, content: Node) {
        let itemNode: Node = instantiate(itemPrefab);
        itemNode.parent = content;
        itemNode.getChildByName("Label").getComponent(Label).string = index.toString();
        itemNode.setPosition(0, 0);
    }

}