import { AudioType } from "./DataStruct";
import GameManager from "./Manager/GameManager";
import SoundManager from "./Manager/SoundManager";
import PoolMember from "./Pool/PoolMember";
import SimplePool from "./Pool/SimplePool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Monster extends PoolMember{
    private isDeath: boolean = false;
    private fallSpeed: number = 800;
    @property(cc.Animation) private anim: cc.Animation;
    public onReset(): void {
        this.isDeath = false;
    }
    protected onEnable(): void {
        if (this.anim){
            this.anim.play();
        }
    }
    protected onCollisionEnter(other: cc.Collider, self: cc.Collider): void{
        if (other.node.group == 'player'){
            if (GameManager.Ins.player.isFalling()){
                // GameManager.Ins.player.jumpOnMonster();
                SoundManager.Ins.PlayClip(AudioType.JumpOnMonster);
                GameManager.Ins.player.jump();
                this.isDeath = true;
                if (this.anim){
                    this.anim.stop();
                }
                return;
            }
        }
        if (other.node.group == 'player box'){
            if (!GameManager.Ins.player.isFalling()){
                GameManager.Ins.player.onHit();
            }
        }
        if ((other.node.group == 'dead zone')){
            SimplePool.despawn(this);
        }
    }

    protected update(dt: number): void {
        if (this.isDeath){
            this.node.y -= dt * this.fallSpeed;
        }
    }
    
}