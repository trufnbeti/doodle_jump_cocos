import { GameState } from "./DataStruct";
import GameManager from "./Manager/GameManager";
import UIManager from "./Manager/UIManager";
import Pref from "./Pref";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOverMenu extends cc.Component{
    @property(cc.Node) private bg: cc.Node;

    @property(cc.Label)
    private score: cc.Label;
    @property(cc.Label)
    private highScore: cc.Label;
    @property(cc.EditBox)
    private namePLayer: cc.EditBox;

    protected onEnable(): void {
        this.score.string = `your score: ${GameManager.Ins.Score()}`;
        this.highScore.string = `your high score: ${Pref.getHighScore()}`;
        this.namePLayer.string = Pref.getPlayerName();
    }

    private onBtnPlayagainCLick(): void{
        UIManager.Ins.ReplayGame();
    }

    private onBtnMenuClick(): void{
        GameManager.Ins.state = GameState.Starting;
        UIManager.Ins.onClose(1);
        UIManager.Ins.onOpen(2);
        cc.director.resume();
    }

    private getPlayerName(): void{
        Pref.setPlayerName(this.namePLayer.string);
        console.log(Pref.getPlayerName());
        
    }
}