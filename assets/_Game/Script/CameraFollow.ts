import GameManager from "./Manager/GameManager";
import Utilities from "./Utilities";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraFollow extends cc.Component{
    @property(cc.Node)
    private player: cc.Node;
    protected update(dt: number): void {
        let targetPos = this.player.getPosition();
        targetPos.x = 0;
        let currentPos = this.node.getPosition();
        if (targetPos.y <= currentPos.y) return;
        currentPos.lerp(targetPos, 0.1, currentPos);
        // currentPos = targetPos;
        this.node.setPosition(currentPos);
        let randScore: number = Math.round(Utilities.randomInt(1, 2));
        GameManager.Ins.addScore(randScore);
    }
}