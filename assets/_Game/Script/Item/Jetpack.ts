import GameManager from "../Manager/GameManager";
import Utilities from "../Utilities";
import Item from "./Item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Jetpack extends Item {

    @property(cc.Animation) private anim: cc.Animation;
    @property(cc.Float) private fallSpeed: number= 0.1;
    private canFalling: boolean = false;

    protected onCollisionEnter(other: cc.Collider, self: cc.Collider): void{
        // super.onCollisionEnter(other, self);
        if (other.node.group == 'player booster'){
            GameManager.Ins.player.equipBooster(this);
        }
        
    }

    public drop(): void{
               
    }

    public enableAnim(): void{
        this.anim.play();
    }

    update (dt: number) {
        if (this.canFalling){
            this.node.y -= this.fallSpeed * dt;
        }
    }
}
