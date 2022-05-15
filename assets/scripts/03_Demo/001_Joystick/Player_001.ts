import { Component, Node, _decorator } from 'cc';
import { Joystick_001 } from './Joystick_001';
const { ccclass, property } = _decorator;

@ccclass('Player_001')
export class Player_001 extends Component {

    @property(Joystick_001)
    joystick: Joystick_001 = null;

    @property(Node)
    player: Node = null;

    @property(Number)
    speed: number = 3;

    start() {

    }

    update(dt: number) {
        let vector = this.joystick.vector.normalize();
        let x = this.player.position.x + vector.x * this.speed;
        let y = this.player.position.y + vector.y * this.speed;
        this.player.setPosition(x, y);
        this.player.angle = this.joystick.angle;
    }
}

