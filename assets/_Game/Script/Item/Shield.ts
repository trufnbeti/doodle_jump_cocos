import { AudioType } from "../DataStruct";
import GameManager from "../Manager/GameManager";
import SoundManager from "../Manager/SoundManager";
import SimplePool from "../Pool/SimplePool";
import Item from "./Item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Shield extends Item{
    protected onCollisionEnter(other: cc.Collider, self: cc.Collider): void{
        if (other.node.group == 'player box'){
            GameManager.Ins.player.getShield();           
        }
        
    }
}