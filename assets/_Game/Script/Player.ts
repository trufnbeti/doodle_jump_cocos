import { Boosters, GameState, PoolType } from "./DataStruct";
import Item from "./Item/Item";
import GameManager from "./Manager/GameManager";
import UIManager from "./Manager/UIManager";
import PoolMember from "./Pool/PoolMember";

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

    @property(Boosters) private boosters: Boosters[] = [];
    private boosterMap: Map<PoolType, cc.Node> = new Map<PoolType, cc.Node>;
    private booster: Item;

    @property(cc.RigidBody) private rb: cc.RigidBody;

    @property(cc.Node)  private jetpack: cc.Node;

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

        this.boosters.forEach(booster => {
            this.boosterMap.set(booster.poolType, booster.node);
        })

    }

    public equipBooster(booster: Item): void{
        this.booster.node.setParent(this.boosterMap.get(PoolType.Trampoline))
        this.booster = booster;
        this.booster.node.setWorldPosition(this.boosterMap.get(PoolType.Trampoline).getWorldPosition());
    }

    public onReset(): void{
        this.node.x = 0;
        this.node.y = -550;
        this.rb.linearVelocity = cc.Vec2.ZERO;
        this.isSprings = false;
        this.isTrampoline = false;
        this.jumpTemp = this.jumpForce;
        // this.jetpack.active = false;
        this.direction = 0;
        this.node.active = true;
    }

    onKeyPressed(event: KeyboardEvent): void{
        this.keys[event.keyCode] = true;
        
    }

    onKeyReleased(event: KeyboardEvent): void{
        this.keys[event.keyCode] = false;
    }

    move(dt): void{
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
        // if (GameManager.Ins.state != GameState.Playing){
        //     return;
        // }
        this.rb.type = cc.RigidBodyType.Dynamic;
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
        this.rb.linearVelocity = cc.v2(0, this.jumpTemp);       
    }
    public getSprings(): void{
        this.isSprings = true;
    }
    public getTrampoline(): void{
        this.isTrampoline = true;
    }
    public getSpringShoes(): void{
        this.isSpringShoes = true;
    }
    public isFalling(): boolean{
        return this.rb.linearVelocity.y <= 0;
    }
    protected update(dt: number): void {
        this.move(dt);
    }
    
    protected onCollisionEnter(other: cc.Collider, self: cc.Collider): void{
        if (other.node.group == 'dead zone'){
            this.onDeath();                 
        }
        // console.log("hiohihihihi");
    }

    onDeath(): void{
        console.log("Chet");
        GameManager.Ins.state = GameState.GameOver;
        UIManager.Ins.onOpen(1);
        cc.director.pause();
    }

}
