import PoolMember from "../Pool/PoolMember";
import SimplePool from "../Pool/SimplePool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Item extends PoolMember{
    public isEquip: boolean = false;
    // protected onCollisionEnter(other: cc.Collider, self: cc.Collider): void{
    //     if (other.node.group == 'dead zone'){
    //         SimplePool.despawn(this);
    //         console.log("despawn springs");
                    
    //     }
    //     // console.log("hiohihihihi");
    // }
    public onDeath(): void{
        if (!this.isEquip)
            SimplePool.despawn(this);   
        // console.log("xoa item");
    }

    public enableAnim(): void{
        
    }
}