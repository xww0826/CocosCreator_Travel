import { _decorator, assetManager, Component, Node, Sprite, SpriteFrame, Texture2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Black_Side_004')
export class Black_Side_004 extends Component {


    private pic: string = "https://xcxgame.qingzhanshi.com/xxsz/diary/userdata/release/app/3173651601/Material/1gup6p38e/pic.png?v=1682325506968";
    private pic2: string = "https://xcxgame.qingzhanshi.com/xxsz/diary/userdata/release/app/3173651601/Material/1gup7lden/pic.png?v=1682326391364";


    @property(Node)
    public remotePic: Node;

    @property(Node)
    public remotePic2: Node;

    start() {

    }

    loadRemotePics() {
        assetManager.loadRemote(this.pic2, { ext: '.png' }, (err, res) => {
            let sprite = this.remotePic2.getComponent(Sprite);
            let sp = new SpriteFrame();
            let tex = new Texture2D();
            /**
             * 解决黑边关键代码
             */
            tex.setFilters(Texture2D.Filter.NEAREST, Texture2D.Filter.NEAREST);
            //@ts-ignore
            tex.image = res;
            sp.texture = tex;
            sprite.spriteFrame = sp;
        });
    }

    update(deltaTime: number) {

    }
}

