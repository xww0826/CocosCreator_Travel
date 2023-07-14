import { _decorator, Component, EditBox, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GND_DuJiePlayerPanel')
export class GND_DuJiePlayerPanel extends Component {

    @property(EditBox)
    ebTiZhi: EditBox = null;

    @property(EditBox)
    ebXiuWei: EditBox = null;

    @property(EditBox)
    ebWuFang: EditBox = null;

    @property(EditBox)
    ebFaFang: EditBox = null;


    
}

