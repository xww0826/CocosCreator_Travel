import { Component, Node, screen, view, _decorator, Sprite } from 'cc';
import { CaptureUtils } from '../../Commons/CaptureUtils';
const { ccclass, property } = _decorator;

@ccclass('Capture_002')
export class Capture_002 extends Component {


    @property(Node)
    captureNode: Node = null;


    @property(Sprite)
    sprite: Sprite = null;

    start() {
        window['view'] = view;
        window['screen1'] = screen;
    }

    capture() {
        // CaptureUtils.captureNode(this, this.captureNode);
        CaptureUtils.captureNode2(this, this.captureNode, this.sprite);
    }

    update(deltaTime: number) {

    }
}

