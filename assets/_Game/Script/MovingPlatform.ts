// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "./Manager/GameManager";
import Platform from "./Platform";
import Utilities from "./Utilities";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MovingPlatform extends Platform {
    private moveSpeed: number;
    private canMoveLeft: boolean = false;
    private canMoveRight: boolean = false;

    private screen: cc.Vec2;
    private clampHorizon: cc.Vec2;
    // LIFE-CYCLE CALLBACKS:

    protected onLoad(): void {

        this.moveSpeed = Utilities.random(750, 900);

        this.screen = new cc.Vec2(
			cc.view.getVisibleSize().width,
			cc.view.getVisibleSize().height
		);
		this.clampHorizon = new cc.Vec2(-0.5, 0.5).mul(this.screen.x);

        let randCheck: number = Utilities.randomInt(0, 1);
        if (randCheck <= 0.5){
            this.canMoveLeft = true;
            this.canMoveRight = false;
        }else{
            this.canMoveLeft = false;
            this.canMoveRight = true;
        }
    }

    protected onCollisionEnter(other: cc.Collider, self: cc.Collider): void {
        super.onCollisionEnter(other, self);
        
        // if (other.node.group == 'right corner'){
        //     this.canMoveLeft = true;
        //     this.canMoveRight = false;
        // }
        // if (other.node.group == 'left corner'){
        //     this.canMoveLeft = false;
        //     this.canMoveRight = true;
        // }
    }

    protected update(dt: number): void {
        if (this.node.getBoundingBox().origin.x <= this.clampHorizon.x){
            this.canMoveRight = true;
            this.canMoveLeft = false;
        }
        if (this.node.getBoundingBox().origin.x + this.node.width >= this.clampHorizon.y){
            this.canMoveLeft = true;
            this.canMoveRight = false;
        }
        let direction: number = 0;
        const newPos = this.node.position;
        if (this.canMoveLeft){
            direction = -1;
            newPos.x += this.moveSpeed * dt * direction;
        }
        else if (this.canMoveRight){
            direction = 1;
            newPos.x += this.moveSpeed * dt * direction;
        }
        this.node.position = newPos;
    }
}
