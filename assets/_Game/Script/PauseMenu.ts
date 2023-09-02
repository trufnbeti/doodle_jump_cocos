import UIManager from "./Manager/UIManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PauseMenu extends cc.Component{
    @property(cc.Button)
    private btnResume: cc.Button;
    private onBtnResumeClick(): void{
        UIManager.Ins.onClose(0);
        if (cc.director.isPaused()){
            cc.director.resume();
        }
    }
    private onBtnReplayClick(): void{
        UIManager.Ins.ReplayGame();
    }
}