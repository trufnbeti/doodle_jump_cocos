import GameManager from "./Manager/GameManager";
import Platform from "./Platform";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BreakablePlatform extends Platform{
    @property(cc.Animation)
    private anim: cc.Animation;
    protected onCollisionEnter(other: cc.Collider, self: cc.Collider): void {
        if (other.node.group == 'player'){
            if(GameManager.Ins.player.isFalling()){
                this.anim.play();
            }
        }
    }
    onCompleteAnim(param: boolean){
        if (param){
            this.node.active = false;
        }
    }
}