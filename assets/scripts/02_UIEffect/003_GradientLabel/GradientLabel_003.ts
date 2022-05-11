import { Component, Material, _decorator } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('GradientLabel_003')
export default class GradientLabel_003 extends Component {

    @property(Number)
    public divider: number;

    @property(Material)
    public material: Material = null;

}