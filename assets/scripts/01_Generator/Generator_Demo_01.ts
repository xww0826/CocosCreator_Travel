
import { Component, Node, Prefab, _decorator } from 'cc';
import { GeneratorLoad } from './GeneratorLoad';
import { NormalLoad } from './NormalLoad';
const { ccclass, property } = _decorator;

/**
 * 正常加载与分帧加载列表优化案例
 */
@ccclass('Generator_Demo_01')
export class Generator_Demo_01 extends Component {

    @property
    itemCount = 500;

    @property(Prefab)
    itemPrefab: Prefab = null;

    @property(Node)
    content: Node = null;

    start() {
        window['content'] = this.content;
    }

    /** 正常加载 */
    public normalLoad() {
        NormalLoad.loadItem(this.itemCount, this.itemPrefab, this.content);
    }

    /** 分帧加载 */
    public generatorLoad() {
        GeneratorLoad.loadItemPerframe(this, this.itemCount, this.itemPrefab, this.content)
    }

}
