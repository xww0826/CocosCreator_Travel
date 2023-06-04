import { _decorator, Component, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Progress_Bar_009')
export class Progress_Bar_009 extends Component {

    @property(ProgressBar)
    public progressBar_1: ProgressBar;
    @property(ProgressBar)
    public progressBar_2: ProgressBar;

    private time: number = 0;

    private progress: number = 0;

    start() {

    }

    update(deltaTime: number) {
        if (this.progress >= 1) return;
        this.time += deltaTime;
        if (this.time < 0.1) return;
        this.time = 0;
        this.progress += 0.05;
        this.setProgress();
    }

    private setProgress() {
        this, this.progressBar_1.progress = this.progress;
        this, this.progressBar_2.progress = this.progress;
    }
}

