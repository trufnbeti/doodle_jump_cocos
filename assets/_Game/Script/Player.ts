import { AudioType, Boosters, GameState, PoolType } from "./DataStruct";
import Item from "./Item/Item";
import Jetpack from "./Item/Jetpack";
import GameManager from "./Manager/GameManager";
import SoundManager from "./Manager/SoundManager";
import UIManager from "./Manager/UIManager";
import PoolMember from "./Pool/PoolMember";
import SimplePool from "./Pool/SimplePool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends PoolMember {

    @property(cc.Float) private jumpForce: number = 0.1;
    private jumpTemp: number;
    @property(cc.Float) private moveSpeed: number = 100000;
    private keys = {};
    
    private direction: number = 0;

    private isSprings: boolean = false;
    private isTrampoline: boolean = false;
    private isSpringShoes: boolean = false;
    private isJumpOnMonster: boolean = false;
    private isShield: boolean = false;
    @property(cc.BoxCollider) private boxCol: cc.BoxCollider;

    @property(cc.Node) private jetpack: cc.Node;
    @property(cc.Node) private propeller: cc.Node;
    @property(cc.Node) private springShoes: cc.Node;
    @property(cc.Node) private stars: cc.Node;
    @property(cc.Node) private shield: cc.Node;
    private typeBoost: PoolType;
    private isEquipBooster: boolean = false;
    private isBoosting: boolean = false;


    @property(cc.RigidBody) private rb: cc.RigidBody;
    @property(cc.Animation) private anim: cc.Animation;
    
    //giới hạn khu vực điều khiển
	private screen: cc.Vec2;
	private clampHorizon: cc.Vec2; // = new cc.Vec2(-0.5, 0.5).mul(this.screen.x);


    protected onLoad(): void {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyReleased, this);

        this.screen = new cc.Vec2(
			cc.view.getVisibleSize().width,
			cc.view.getVisibleSize().height
		);
		this.clampHorizon = new cc.Vec2(-0.5, 0.5).mul(this.screen.x);

    }

    public equipBooster(booster: Item): void{
        if (this.isEquipBooster || this.isSpringShoes) return;
        this.typeBoost = booster.poolType;
        SimplePool.despawn(booster);
        this.isEquipBooster = true;
        switch (this.typeBoost){
            case PoolType.Jetpack:
                this.jetpack.active = true;
                SoundManager.Ins.PlayClip(AudioType.Jetpack);
                break;
            case PoolType.Propeller:
                this.propeller.active = true;               
                SoundManager.Ins.PlayClip(AudioType.Propeller);
                break;
        }
        this.boosting();
    }

    public onReset(): void{
        this.node.x = 0;
        this.node.y = -550;
        this.rb.linearVelocity = cc.Vec2.ZERO;

        this.isEquipBooster = false;
        this.isBoosting = false;
        this.isSpringShoes = false;
        this.isSprings = false;
        this.isTrampoline = false;
        this.isShield = false;

        this.jumpTemp = this.jumpForce;

        this.jetpack.active = false;
        this.propeller.active = false;
        this.springShoes.active = false;
        this.stars.active = false;
        this.shield.active = false;

        this.direction = 0;
        this.rb.gravityScale = 8;
        this.anim.stop();
        this.boxCol.enabled = true;
        this.node.active = true;
    }

    onKeyPressed(event: KeyboardEvent): void{
        this.keys[event.keyCode] = true;
        
    }

    onKeyReleased(event: KeyboardEvent): void{
        this.keys[event.keyCode] = false;
    }

    move(dt: number): void{
        if (GameManager.Ins.state != GameState.Playing) return;
        const newPos = this.node.position;
        this.direction = 0;
        if (this.keys[37]){
            this.direction = -1;
            newPos.x += this.moveSpeed * dt * this.direction;
            this.node.scaleX = -1;
            if (newPos.x <= this.clampHorizon.x){
                newPos.x = this.clampHorizon.y;
            }
        }
        if (this.keys[39]){
            this.direction = 1;
            newPos.x += this.moveSpeed * dt * this.direction;
            this.node.scaleX = 1;
            if (newPos.x >= this.clampHorizon.y){
                newPos.x = this.clampHorizon.x;
            }
        }
        this.node.position = newPos;
    }
    public jump(): void{
        if (this.isEquipBooster)    return;
        this.jumpTemp = this.jumpForce;
        if (this.isSprings){
            this.jumpTemp *= 2;
            this.isSprings = false;
        }
        if (this.isTrampoline){
            this.jumpTemp *= 2;
            this.node.angle = 0;
            this.node.anchorY = 0.5;
            
            cc.tween(this.node)
                .to(1, { angle: -this.node.scaleX * 360 }, { easing: "linear" })
                .start();
                
            this.isTrampoline = false;
            this.node.anchorY = 0;
        }
        if (this.isJumpOnMonster){
            this.jumpTemp *= 1.5;
            this.isJumpOnMonster = false;
        }
        if (this.isSpringShoes){
            this.jumpTemp *= 2;
        }
        if (GameManager.Ins.state == GameState.Playing){
            if (this.isSpringShoes){
                SoundManager.Ins.PlayClip(AudioType.SpringShoes);
                this.anim.play('SpringShoes');
            }else{
                SoundManager.Ins.PlayClip(AudioType.Jump);
                this.anim.play();
            }
        }
        this.rb.linearVelocity = cc.v2(0, this.jumpTemp);       
    }
    public getSprings(): void{
        if (this.isSpringShoes) return;
        this.isSprings = true;
    }
    public getTrampoline(): void{
        if (this.isSpringShoes) return;
        this.isTrampoline = true;
    }
    public getSpringShoes(): void{
        if (this.isSpringShoes) return;
        this.isSpringShoes = true;
        this.springShoes.active = true;
        this.scheduleOnce(() => {
            this.isSpringShoes = false;
            this.springShoes.active = false;
        }, 10);
    }

    public getShield(): void{
        if (this.isBoosting) return;
        this.shield.active = true;
        this.isShield = true;
        this.scheduleOnce(() => {
            this.shield.active = false;
            this.isShield = false;
        }, 10);
    }

    public jumpOnMonster(): void{
        this.isJumpOnMonster = true;
    }
    public isFalling(): boolean{
        return this.rb.linearVelocity.y <= 0;
    }

    private dropBooster(): void{
        this.isEquipBooster = false;
        this.isBoosting = false;
        this.rb.gravityScale = 8;
        switch (this.typeBoost){
            case PoolType.Jetpack:
                this.jetpack.active = false;
                break;
            case PoolType.Propeller:
                this.propeller.active = false;
                break;
        }
    }
    private boosting(): void{
        this.rb.gravityScale = 0;
        this.rb.linearVelocity = cc.v2(0, this.jumpForce * 1.5);
        this.isBoosting = true;
        this.anim.play('PlayerBoosting');
        this.scheduleOnce(this.dropBooster, 3);
    }
    protected update(dt: number): void {
        this.move(dt);
    }
    
    protected onCollisionEnter(other: cc.Collider, self: cc.Collider): void{
        if (other.node.group == 'dead zone'){
            this.onDeath();                 
        }
    }

    public onHit(): void{
        if (GameManager.Ins.state != GameState.Playing || this.isBoosting || this.isShield) return;
        this.rb.linearVelocity = cc.v2(0, 0);
        this.boxCol.enabled = false;
        this.stars.active = true;
        SoundManager.Ins.PlayClip(AudioType.MonsterHit);
        this.scheduleOnce(() => {
            this.onDeath();
        }, 0.5);
    }

    public onDeath(): void{
        GameManager.Ins.state = GameState.GameOver;
        SoundManager.Ins.PlayClip(AudioType.Falling);
        console.log("cHET");
        
        // this.scheduleOnce(() => {
        //     // UIManager.Ins.onOpen(1);
        //     cc.director.pause();
        // }, 1)
    }

}
