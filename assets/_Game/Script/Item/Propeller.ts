import GameManager from "../Manager/GameManager";
import Utilities from "../Utilities";
import Item from "./Item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Propeller extends Item {
    @property(cc.Float) private fallSpeed: number= 0.1;
    private canFalling: boolean = false;

    protected onCollisionEnter(other: cc.Collider, self: cc.Collider): void{
        // super.onCollisionEnter(other, self);
        if (other.node.group == 'player box'){
            GameManager.Ins.player.equipBooster(this);
        }
        
    }

    public drop(): void{
               
    }

    update (dt: number) {
        if (this.canFalling){
            this.node.y -= this.fallSpeed * dt;
        }
    }
}
