import { _decorator, Component } from 'cc';
import { GND_DuJiePlayerPanel } from './GND_DuJiePlayerPanel';
const { ccclass, property } = _decorator;

/**
 * GND : 表示(Game numerical designer)游戏数值设计
 * 
 * 渡劫模拟器 - 游戏数值伤害计算
 */


/**
 * 玩家属性
 */
export class Player {

    /** 体质 */
    public tiZhi: number = 0;
    /** 修为 */
    public xiuWei: number = 0;
    /** 法术防御 */
    public faShuFangYu: number = 0;
    /** 物理防御 */
    public wuLiFangYu: number = 0;


    /** 法术免伤 */
    public faShuMianShang: number = 0;
    /** 物理免伤 */
    public wuLiMianShang: number = 0;
    /** 金免伤 */
    public jinMianShang: number = 0;
    /** 木免伤 */
    public muMianShang: number = 0;
    /** 水免伤 */
    public shuiMianShang: number = 0;
    /** 火免伤 */
    public huoMianShang: number = 0;
    /** 土免伤 */
    public tuMianShang: number = 0;
    /** 毒免伤 */
    public duMianShang: number = 0;
    /** 雷免伤 */
    public leiMianShang: number = 0;
    /** 最终免伤 */
    public zuiZhongMianShang: number = 0;
}

/** 特殊伤害 */
export enum TeShuShangHaiType {
    /** 无伤害 */
    Zero,
    /** 金 */
    Jin,
    /** 木 */
    Mu,
    /** 水 */
    Shui,
    /** 火 */
    Huo,
    /** 土 */
    Tu,
    /** 雷 */
    Lei,
    /** 毒 */
    Du
}

@ccclass('GND_DuJieMonitor')
export class GND_DuJieMonitor extends Component {

    @property(GND_DuJiePlayerPanel)
    panel: GND_DuJiePlayerPanel = null;

    private player: Player = null;

    start() {
        this.player = new Player();
    }

    /** 计算物理伤害 */
    computeWuShangHai(wuShang: number): number {
        if (wuShang <= 0) return 0;
        // 实际伤害 = 物理伤害 - 修为*45 - 物理防御*125
        let temp = wuShang - this.player.xiuWei * 45 - this.player.wuLiFangYu * 125;
        // 物理最终伤害 = 实际伤害 - 物理免伤
        temp = (temp * 100 - temp * this.player.wuLiMianShang) / 100;
        return temp <= 0 ? 0 : Math.floor(temp);
    }

    /** 计算法术伤害 */
    computeFaShangHai(faShang: number): number {
        if (faShang <= 0) return 0;
        // 实际伤害 = 法术伤害 - 修为*45 - 法术防御*125
        let temp = faShang - this.player.xiuWei * 45 - this.player.faShuFangYu * 125;
        // 法术最终伤害 = 实际伤害 - 法术免伤
        temp = (temp * 100 - temp * this.player.faShuMianShang) / 100;
        return temp <= 0 ? 0 : Math.floor(temp);
    }

    /** 计算特殊属性伤害 */
    computeTeShuShangHai(type: TeShuShangHaiType, teShuShang: number): number {
        if (teShuShang <= 0) return 0;
        // 特殊属性最终伤害 = 特殊属性伤害 - 对应的特殊属性免伤
        let temp = 0;
        switch (type) {
            case TeShuShangHaiType.Zero: return temp;
            case TeShuShangHaiType.Jin:
                temp = (teShuShang * 100 - teShuShang * this.player.jinMianShang) / 100;
                break;
            case TeShuShangHaiType.Mu:
                temp = (teShuShang * 100 - teShuShang * this.player.muMianShang) / 100;
                break;
            case TeShuShangHaiType.Shui:
                temp = (teShuShang * 100 - teShuShang * this.player.shuiMianShang) / 100;
                break;
            case TeShuShangHaiType.Huo:
                temp = (teShuShang * 100 - teShuShang * this.player.huoMianShang) / 100;
                break;
            case TeShuShangHaiType.Tu:
                temp = (teShuShang * 100 - teShuShang * this.player.tuMianShang) / 100;
                break;
            case TeShuShangHaiType.Lei:
                temp = (teShuShang * 100 - teShuShang * this.player.leiMianShang) / 100;
                break;
            case TeShuShangHaiType.Du:
                temp = (teShuShang * 100 - teShuShang * this.player.duMianShang) / 100;
                break;
        }
        return temp <= 0 ? 0 : Math.floor(temp);
    }

    /** 计算玩家最终承受的所有伤害 */
    computeZuiZhongShangHai(wuShang: number, faShang: number, teShuShang: number): number {
        // 最终伤害 = （物理最终伤害 + 法术最终伤害 + 特殊属性最终伤害）- 最终免伤
        let temp = wuShang + faShang + teShuShang;
        temp = (temp * 100 - temp * this.player.zuiZhongMianShang) / 100;
        return temp <= 0 ? 0 : Math.floor(temp);
    }

    computeResult(zuiZhongShangHai: number): boolean {
        return this.player.tiZhi * 50 - zuiZhongShangHai > 0;
    }

    update(dt: number) {
        this.panel.ebTiZhi.string
    }
}

