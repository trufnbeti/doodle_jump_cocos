import GameManager from "./Manager/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SpawnChecking extends cc.Component{
    onCollisionEnter(other: cc.Collider, self: cc.Collider): void{
        if (other.node.group == 'platform'){
            GameManager.Ins.spawnPlatform();
        }
    }
          
}