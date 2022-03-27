import { instantiate, Label, Node, Prefab, UITransform } from 'cc';

export class NormalLoad {

    public static loadItem(count: number, itemPrefab: Prefab, content: Node) {
        content.removeAllChildren();
        for (let i = 0; i < count; i++) {
            this.instantiateItem(i, itemPrefab, content);
        }
    }

    private static instantiateItem(index: number, itemPrefab: Prefab, content: Node) {
        let itemNode: Node = instantiate(itemPrefab);
        itemNode.parent = content;
        itemNode.getChildByName("Label").getComponent(Label).string = index.toString();
        itemNode.setPosition(0, 0);
    }

}