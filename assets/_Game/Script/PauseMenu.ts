import SoundManager from "./Manager/SoundManager";
import UIManager from "./Manager/UIManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PauseMenu extends cc.Component{
    @property(cc.Button)
    private btnResume: cc.Button;
    private onBtnResumeClick(): void{
        UIManager.Ins.onClose(0);
        if (cc.director.isPaused()){
            SoundManager.Ins.ResumeAllSound();
            cc.director.resume();
        }
    }
    private onBtnReplayClick(): void{
        UIManager.Ins.ReplayGame();
    }
}