import Monster from "./Monster";
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
    private item: Item;
    private monster: Monster;

    public loadItem(): void {
        const ranIdx: number = Utilities.randomInt(0, this.spawnNodeList.length - 1);
        this.item = GameManager.Ins.spawnItem(this.spawnNodeList[ranIdx]);
        if (this.item == null){
            this.monster = GameManager.Ins.spawnMonster(this.spawnNodeList[ranIdx]);
            // if (this.monster != null){
            //     GameManager.Ins.spawnPlatform();
            //     SimplePool.despawn(this);
            // }
        }           
    }

    public onReset(): void {
        this.item = null;
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
    protected onDeath(): void{
        if (this.m_id != 0 && this.item != null){
            this.item.onDeath();
        }  
        SimplePool.despawn(this);
    }
}