import Item from "./Item/Item";
import GameManager from "./Manager/GameManager";
import PoolMember from "./Pool/PoolMember";
import SimplePool from "./Pool/SimplePool";
import Utilities from "./Utilities";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Platform extends PoolMember{

    @property(cc.Node)
    private spawnNodeList: cc.Node[] = [];
    public item: Item;

    public loadItem(): void {
        // if ()
        let ranIdx: number = Utilities.randomInt(0, this.spawnNodeList.length - 1);
        this.item = GameManager.Ins.spawnItem(this.spawnNodeList[ranIdx]);
    }

    private m_id: number = 0;

    public getId(): number{
        return this.m_id;
    }
    public setId(value: number): void{
        this.m_id = value;
    }
    protected onCollisionEnter(other: cc.Collider, self: cc.Collider): void{
        switch(other.node.group){
            case 'player':
                this.onColPlayer();
                break;
            case 'dead zone':
                this.onDeath();
                break;
        }
             
    }
    onColPlayer(): void{
        if (GameManager.Ins.player.isFalling()){
            GameManager.Ins.player.jump();
        }
    }
    onDeath(): void{
        SimplePool.despawn(this);
        if (this.m_id != 0){
            this.item.onDeath();
        }  
    }
}