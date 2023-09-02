
import GameManager from "../Manager/GameManager";
import Item from "./Item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Jetpack extends Item {

    @property(cc.Animation) private anim: cc.Animation;

    protected onCollisionEnter(other: cc.Collider, self: cc.Collider): void{
        // super.onCollisionEnter(other, self);
        if (other.node.group == 'player booster'){
            console.log("get jetpack");
            GameManager.Ins.player.equipBooster(this);
        }
        
    }

    public enableAnim(): void{
        this.anim.play();
    }

    // update (dt) {}
}
