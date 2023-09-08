import { GameState } from "./DataStruct";
import GameManager from "./Manager/GameManager";
import Utilities from "./Utilities";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FollowCamera extends cc.Component{
    @property(cc.Node) private camera: cc.Node;
    protected update(dt: number): void {
        if (GameManager.Ins.state == GameState.GameOver) return;
        this.node.position = this.camera.position;
    }
}