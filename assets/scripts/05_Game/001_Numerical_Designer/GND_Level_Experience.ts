import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * GND : 表示(Game numerical designer)游戏数值设计
 * 
 * 等级与经验设计
 */
@ccclass('GND_Level_Experience')
export class GND_Level_Experience extends Component {

    private time: number = 0;

    // 角色当前等级
    private level: number = 0;

    // 杀怪的时间(秒)
    private killTime = 5;

    start() {

    }

    update(deltaTime: number) {
        if (this.level >= 100) return;
        this.time += deltaTime;
        if (this.time < 0.01) return;
        this.time = 0;

        this.level++;
        let roleExp = this.roleExp(this.level);
        let monsterExp = this.monsterExp(this.level);
        let count = Math.floor(roleExp / monsterExp);
        console.log(`等级 = ${this.level} , 角色升级经验 = ${roleExp} , 杀怪经验 = ${monsterExp} , 要杀几只 = ${count}`);
    }

    // 每一级杀怪所需的时间(秒)
    private killMonsterTime(level: number): number {
        if (level < 5) {
            return 5;
        } else {
            return level;
        }
    }

    // 当前等级升级所需的经验
    private roleExp(level: number) {
        return Math.floor((Math.pow((level - 1), 3) + 60) / this.killMonsterTime(level) * ((level - 1) * 2 + 60))
    }

    // 当前等级的怪物经验
    private monsterExp(level: number) {
        return Math.floor((level - 1) * 2 + 60)
    }
}

