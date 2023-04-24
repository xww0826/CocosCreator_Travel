import { _decorator, Component, instantiate, Node, Prefab, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Position_Converter_1')
export class Position_Converter_1 extends Component {

    @property(Prefab)
    public nodeLabel: Prefab;

    @property(Node)
    public group_1_label: Node;

    @property(Node)
    public group_2: Node;

    start() {

    }

    node2NodePosition() {
        let label = instantiate(this.nodeLabel);
        label.position = this.group_1_label.position;
        label.parent = this.group_2;
    }

    update(deltaTime: number) {

    }
}

