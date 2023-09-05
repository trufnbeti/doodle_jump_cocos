import Items, { GameState, Platforms, PoolType, PrefKey } from "../DataStruct";
import Item from "../Item/Item";
import Springs from "../Item/Springs";
import Platform from "../Platform";
import Player from "../Player";
import SimplePool from "../Pool/SimplePool";
import Pref from "../Pref";
import Utilities from "../Utilities";
import UIManager from "./UIManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    private static ins : GameManager;
    public static get Ins() : GameManager{
        return GameManager.ins;
    }

    @property({ type: cc.Enum(GameState) }) public state: GameState = GameState.Playing;

    @property(cc.Node) private camera: cc.Node;

    private m_score: number = 0;
    public Score(): number{
        return this.m_score;
    }
    private screen: cc.Vec2;
    private clampHorizon: cc.Vec2; // = new cc.Vec2(-0.5, 0.5).mul(this.screen.x);

    protected onLoad(): void {
        GameManager.ins = this;        
        
        this.screen = new cc.Vec2(
			cc.view.getVisibleSize().width,
			cc.view.getVisibleSize().height
		);
		this.clampHorizon = new cc.Vec2(-0.5, 0.5).mul(this.screen.x);

    
    }
    @property(Player)   public player: Player;
    @property(Platform) public lastPlatformSpawned: Platform;
    @property(cc.Float) public xSpawnOffset: number = 100;
    @property(cc.Float) public minYSpawnPos: number = 120;
    @property(cc.Float) public maxYSpawnPos: number = 150;
    @property(cc.Float) private startingPlatform: number = 15;
    @property(Platforms)    public platformsPrefab: Platforms[] = [];
    @property(cc.Float) private itemsSpawnRate: number = 0.05;
    @property(Items)    private items: Items[] = []; 

    private isDoubleBreakablePlatform: boolean = false;

    private listPlatform: Platform[] = [];

    public onReset(): void{
        this.state = GameState.Starting;
        this.m_score = 0;
        SimplePool.collectAll();
        UIManager.Ins.closeAll();
        this.player.onReset();
        this.listPlatform.splice(0, this.listPlatform.length);
        
        this.lastPlatformSpawned = SimplePool.spawnT<Platform>(PoolType.Platform, cc.v3(0, -750, 0), 0);
        this.lastPlatformSpawned.setId(0);
        this.lastPlatformSpawned.node.x = 0;
        this.lastPlatformSpawned.node.y = -750;
        this.lastPlatformSpawned.node.active = true;
        UIManager.Ins.updateScore(0);
             
        this.camera.y = 0;

        this.ivkPlatform();
    }

    public ivkPlatform(): void{
        this.scheduleOnce(this.platformInit, 0.5);
    }
    
    platformInit(): void{
        for (let i = 0; i < this.startingPlatform; i++){
            this.spawnPlatform();
        }
    }

    public spawnPlatform(): void{
        let spawnPosX: number = Utilities.random(this.clampHorizon.x + this.xSpawnOffset, this.clampHorizon.y - this.xSpawnOffset);
        let distBetweenPlat: number = Utilities.random(this.minYSpawnPos, this.maxYSpawnPos);
        let spawnPosY: number = this.lastPlatformSpawned.node.y + distBetweenPlat;
        let spawnPos: cc.Vec3 = new cc.Vec3(spawnPosX, spawnPosY, 0);
        let rand: number = Utilities.random(0, 1);
        let type: number = 0;


        let sumRate: number = 0;
        this.platformsPrefab.forEach(item => {
            sumRate += item.spawnRate;
            
            if (rand < sumRate && type == 0){
                type = item.poolType;
            }
        });

        if (this.isDoubleBreakablePlatform && type == PoolType.BreakablePlatform){
            console.log("huy tao cai moi vi co 3 platform breakable");
            
            this.spawnPlatform();
            return;
        }

        this.isDoubleBreakablePlatform = false;
        
        if (type == PoolType.BreakablePlatform && this.lastPlatformSpawned.poolType == type){
            this.isDoubleBreakablePlatform = true;
        }

        let platformClone = SimplePool.spawnT<Platform>(type, this.node.getWorldPosition().add(spawnPos), 0);
        if (type <= 2){
            platformClone.loadItem();
        }

        platformClone.setId(this.lastPlatformSpawned.getId() + 1);
        this.lastPlatformSpawned = platformClone;
    }
    public addScore(value: number): void {
        if (this.state != GameState.Playing)    return;
        this.m_score += value;
        UIManager.Ins.updateScore(this.m_score);
        Pref.setHighScore(this.m_score);
    }

    public spawnItem(node: cc.Node): Item{
        if (this.items.length == 0 || this.state != GameState.Playing)  return;
        const randIdx: number = Utilities.randomInt(0, this.items.length - 1);
        const itemRand: Items = this.items[randIdx];        
        
        const rate = this.itemsSpawnRate * this.items[randIdx].spawnRate * this.items.length;
        
        let randCheck: number = Utilities.random(0, 1);
        
        let item = SimplePool.spawnT<Item>(itemRand.poolType, cc.Vec3.ZERO, 0);
        item.node.setParent(node.parent);
        item.node.setWorldPosition(node.getWorldPosition());
        item.node.active = (randCheck < rate);

        return item;
    }

}
