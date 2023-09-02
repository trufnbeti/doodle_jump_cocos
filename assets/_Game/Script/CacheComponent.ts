// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CacheComponent {

    private static linkPlayer: Map<cc.Collider, Player> = new Map<cc.Collider, Player>;

    public static getPlayer(col: cc.Collider): Player{
        if(!this.linkPlayer.has(col)){
            this.linkPlayer.set(col, col.getComponent(Player));
        }
        return this.linkPlayer.get(col);
    }
    
}
