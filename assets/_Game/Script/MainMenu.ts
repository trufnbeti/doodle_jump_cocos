import { GameState } from "./DataStruct";
import GameManager from "./Manager/GameManager";
import UIManager from "./Manager/UIManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainMenu extends cc.Component{
    
    private onBtnPlayClick(): void{
        UIManager.Ins.ReplayGame();
        GameManager.Ins.state = GameState.Playing;
        
    }

}