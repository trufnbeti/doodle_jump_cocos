import { AudioType } from "../DataStruct";
import GameManager from "../Manager/GameManager";
import SoundManager from "../Manager/SoundManager";
import SimplePool from "../Pool/SimplePool";
import Item from "./Item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Trampoline extends Item{
    @property(cc.Animation)
    private anim: cc.Animation;
    protected onCollisionEnter(other: cc.Collider, self: cc.Collider): void{
        if (other.node.group == 'player'){
            if (GameManager.Ins.player.isFalling()){
                SoundManager.Ins.PlayClip(AudioType.Trampoline);
                GameManager.Ins.player.getTrampoline();
                GameManager.Ins.player.jump();
                this.anim.play();
            }            
        }
        
    }
}