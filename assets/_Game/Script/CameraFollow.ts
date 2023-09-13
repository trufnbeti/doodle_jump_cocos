import { GameState } from "./DataStruct";
import GameManager from "./Manager/GameManager";
import Utilities from "./Utilities";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraFollow extends cc.Component{
    @property(cc.Node) private player: cc.Node;
    @property(cc.Node) private gameOver: cc.Node;
    protected update(dt: number): void {
        let targetPos = this.player.getPosition();
        targetPos.x = 0;
        let currentPos = this.node.getPosition();
        if (targetPos.y <= currentPos.y && GameManager.Ins.state != GameState.GameOver) return;
        if (this.node.getWorldPosition().y <= this.gameOver.getWorldPosition().y){
            this.node.setWorldPosition(this.gameOver.getWorldPosition());
            // cc.director.pause();
            return;
        }
        // if (this.player.getWorldPosition().y + this.player.height <= this.gameOver.getBoundingBoxToWorld().y){
        //     cc.director.pause();
            
        //     return;
        // }

        currentPos.lerp(targetPos, 0.1, currentPos);
        this.node.setPosition(currentPos);
        let randScore: number = Math.round(Utilities.randomInt(1, 2));
        GameManager.Ins.addScore(randScore);
    }
}