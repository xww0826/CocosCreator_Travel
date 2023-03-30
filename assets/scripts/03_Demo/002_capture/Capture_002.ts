import { Component, Node, screen, view, _decorator } from 'cc';
import { CaptureUtils } from '../../Commons/CaptureUtils';
const { ccclass, property } = _decorator;

@ccclass('Capture_002')
export class Capture_002 extends Component {


    @property(Node)
    captureNode: Node = null;

    start() {
        window['view'] = view;
        window['screen1'] = screen;
    }

    capture() {
        CaptureUtils.captureNode(this, this.captureNode);
    }

    update(deltaTime: number) {

    }
}

