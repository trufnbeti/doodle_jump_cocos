import GameManager from "../Manager/GameManager";
import SimplePool from "../Pool/SimplePool";
import Item from "./Item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Trampoline extends Item{
    @property(cc.Animation)
    private anim: cc.Animation;
    protected onCollisionEnter(other: cc.Collider, self: cc.Collider): void{
        this.onCollisionStay(other, self);
        
    }
    protected onCollisionStay(other: cc.Collider, self: cc.Collider): void{
        // super.onCollisionEnter(other, self);
        if (other.node.group == 'player'){
            GameManager.Ins.player.equipBooster(this)
            if (GameManager.Ins.player.isFalling()){
                GameManager.Ins.player.getTrampoline();
                GameManager.Ins.player.jump();
                this.anim.play();
            }            
        }
    }
}