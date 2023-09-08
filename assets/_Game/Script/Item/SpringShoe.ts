import GameManager from "../Manager/GameManager";
import SimplePool from "../Pool/SimplePool";
import Item from "./Item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SpringShoe extends Item{
    protected onCollisionEnter(other: cc.Collider, self: cc.Collider): void{
        if (other.node.group == 'player'){
            if (GameManager.Ins.player.isFalling()){
                GameManager.Ins.player.getSpringShoes();
                GameManager.Ins.player.jump();
            }            
        }
    }
}