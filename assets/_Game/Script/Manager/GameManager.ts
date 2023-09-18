import Items, { Monsters, GameState, Platforms, PoolType, PrefKey } from "../DataStruct";
import Monster from "../Monster";
import Item from "../Item/Item";
import Springs from "../Item/Spring";
import Platform from "../Platform";
import Player from "../Player";
import SimplePool from "../Pool/SimplePool";
import Pref from "../Pref";
import Utilities from "../Utilities";
import UIManager from "./UIManager";
import BlackHole from "../BlackHole";
import GamepadController from "./GamepadController";

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
    private clampVertical: cc.Vec2;

    protected onLoad(): void {
        GameManager.ins = this;        
        
        this.screen = new cc.Vec2(
			cc.view.getVisibleSize().width,
			cc.view.getVisibleSize().height
		);
		this.clampHorizon = new cc.Vec2(-0.5, 0.5).mul(this.screen.x);
		this.clampVertical = new cc.Vec2(-0.5, 0.5).mul(this.screen.y);
        this.record.x = this.clampHorizon.y;

        this.lastSpawnY = this.lastPlatformSpawned.node.y;

        if (Pref.HighestPos != 0){
            this.record.active = true;
            this.record.y = Pref.HighestPos;
        }

    }
    @property(Player)   public player: Player;
    @property(Platform) public lastPlatformSpawned: Platform;
    @property(cc.Float) public xSpawnOffset: number = 100;
    @property(cc.Float) public minYSpawnPos: number = 120;
    @property(cc.Float) public maxYSpawnPos: number = 150;
    @property(cc.Float) private startingPlatform: number = 15;
    @property(Platforms)    public platformsPrefab: Platforms[] = [];
    @property(cc.Float) private blackHoleRate: number = 0.1;
    @property(cc.Float) private itemsSpawnRate: number = 0.05;
    @property(Items)    private items: Items[] = [];
    @property(cc.Float) private monstersSpawnRate: number = 0.01;
    @property(Monsters)  private monsters: Monsters[] = [];

    @property(cc.Node) private record: cc.Node;

    private isDoubleBreakablePlatform: boolean = false;
    private isDoubleBlackHole: boolean = false;

    private lastSpawnY: number = 0.1;

    private listPlatform: Platform[] = [];

    public onReset(): void{
        this.state = GameState.Starting;
        this.m_score = 0;
        SimplePool.collectAll();
        UIManager.Ins.closeAll();
        this.player.onReset();
        this.listPlatform.splice(0, this.listPlatform.length);
        
        this.lastPlatformSpawned = SimplePool.spawnT<Platform>(PoolType.Platform, cc.v3(0, -750, 0), 0);
        this.lastPlatformSpawned.Id = 0;
        this.lastPlatformSpawned.node.x = 0;
        this.lastPlatformSpawned.node.y = -750;
        this.lastPlatformSpawned.node.active = true;

        this.lastSpawnY = this.lastPlatformSpawned.node.y;

        UIManager.Ins.updateScore(0);

        this.isDoubleBreakablePlatform = false;
        this.isDoubleBlackHole = false;
             
        this.camera.y = 0;
        if (Pref.HighestPos != 0){
            this.record.active = true;
            this.record.y = Pref.HighestPos;
        }

        GamepadController.Ins.CanMoveLeft = false;
        GamepadController.Ins.CanMoveRight = false;

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
        let spawnPosY: number = this.lastSpawnY + distBetweenPlat;
        let spawnPos: cc.Vec3 = new cc.Vec3(spawnPosX, spawnPosY, 0);
        //===============================
        const randBlackHole: number = Utilities.random(0, 1);
        if (randBlackHole < this.blackHoleRate && this.m_score > 1000){
            if (this.isDoubleBlackHole){
                this.spawnPlatform();
                return;
            }
            this.isDoubleBlackHole = true;
            let blackHole = SimplePool.spawnT<BlackHole>(PoolType.BlackHole, this.node.getWorldPosition().add(spawnPos), 0);
            this.lastSpawnY = blackHole.node.y;
            return;       
        }
        this.isDoubleBlackHole = false;
        //===============================
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

        platformClone.Id = this.lastPlatformSpawned.Id + 1;
        this.lastPlatformSpawned = platformClone;
        this.lastSpawnY = this.lastPlatformSpawned.node.y;
    }
    public addScore(value: number): void {
        if (this.state != GameState.Playing)    return;
        this.m_score += value;
        UIManager.Ins.updateScore(this.m_score);
        Pref.HighScore = this.m_score;
    }

    public spawnItem(spawnNode: cc.Node): Item{
        if (this.items.length == 0 || this.state != GameState.Playing)  return;
        const randItemRate: number = Utilities.random(0, 1);
        let res: Item = null;
        if (randItemRate < this.itemsSpawnRate){
            const randCheck: number = Utilities.random(0, 1);
            let type: number = 0;
            let sumRate: number = 0;
            this.items.forEach(item => {
                sumRate += item.spawnRate;
                
                if (randCheck < sumRate && type == 0){
                    type = item.poolType;
                }
            });
            res = SimplePool.spawnT<Item>(type, cc.Vec3.ZERO, 0);
            res.node.setParent(spawnNode.parent);
            res.node.setWorldPosition(spawnNode.getWorldPosition());
        }
        return res;
    }

    public spawnMonster(spawnNode: cc.Node): Monster{
        if (this.monsters.length == 0 || this.state != GameState.Playing)    return;
        const randMonsterRate: number = Utilities.random(0, 1);
        let res: Monster = null;
        if (randMonsterRate < this.monstersSpawnRate && this.m_score > 1000){
            const randCheck: number = Utilities.random(0, 1);
            let type: number = 0;
            let sumRate: number = 0;
            this.monsters.forEach(monster => {
                sumRate += monster.spawnRate;
                if (randCheck < sumRate && type == 0){
                    type = monster.poolType;
                }
            });
            res = SimplePool.spawnT<Monster>(type, spawnNode.getWorldPosition(), 0);
        }
        return res;
    }

    protected update(dt: number): void {
        if (this.state == GameState.Playing){
            Pref.HighestPos = this.player.node.y;
        }
        if (this.record.y < this.camera.y + this.clampVertical.x){
            this.record.active = false;
        }
    }

}
