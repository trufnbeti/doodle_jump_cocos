import GameManager from "./Manager/GameManager";
import PoolMember from "./Pool/PoolMember";
import SimplePool from "./Pool/SimplePool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BlackHole extends PoolMember{
    protected onCollisionEnter(other: cc.Collider, self: cc.Collider): void{
        if (other.node.group == 'player box'){
            GameManager.Ins.player.suckInBlackHole(this);
        }
        if (other.node.group == 'dead zone'){
            SimplePool.despawn(this);
        }
        
    }
}