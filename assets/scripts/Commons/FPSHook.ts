import { Color, Component, _decorator, find } from "cc";
import { JSB } from "cc/env";

const { ccclass, property } = _decorator;

@ccclass("FPSHook")
export class FPSHook extends Component {

    protected onLoad(): void {
        if (JSB) return;
        this.scheduleOnce(() => {
            let previewFPS = find("PROFILER-NODE");
            if (previewFPS && previewFPS.childrenCount > 0) {
                previewFPS.children.forEach(child => {
                    child.color = Color.RED;
                })
            }
        });
    }
}