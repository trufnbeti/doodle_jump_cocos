import { GameState } from "./DataStruct";
import GameManager from "./Manager/GameManager";
import UIManager from "./Manager/UIManager";
import Pref from "./Pref";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOverMenu extends cc.Component{

    @property(cc.Label)
    private score: cc.Label;
    @property(cc.Label)
    private highScore: cc.Label;
    @property(cc.EditBox)
    private namePLayer: cc.EditBox;

    private refreshData(): void{
        this.score.string = `${GameManager.Ins.Score()}`;
        this.highScore.string = `${Pref.HighScore}`;
        this.namePLayer.string = Pref.PlayerName;
    }

    protected onEnable(): void {
        this.refreshData();
    }

    protected update(): void {
        this.refreshData();
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
        Pref.PlayerName = this.namePLayer.textLabel.string;
    }
}