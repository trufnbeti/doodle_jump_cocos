// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

export enum GameState {
  Starting,
  Playing,
  GameOver,
}

export enum PoolType {
  None,
  Platform,
  MovingPlatform,
  BreakablePlatform,
  Spring,
  Trampoline,
  Jetpack,
  Propeller,
  SpringShoes,
  Monster_1,
  Monster_2,
  Monster_3,
}

export enum AudioType {
  None,
  Jump,
  Spring,
  Trampoline,
  Propeller,
  Jetpack,
  SpringShoes,
  JumpOnMonster,
  MonsterHit,
  Falling,
}

export enum PrefKey {
  BestScore = "BestScore",
  PlayerName = "PlayerName",
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class Items {
  @property(cc.Prefab)
  public item: cc.Prefab;
  @property(cc.Float)
  public spawnRate: number = 0.1;
  @property({ type: cc.Enum(PoolType) })
  public poolType: PoolType = PoolType.None;
}

@ccclass
export class Monsters {
  @property(cc.Prefab) public monster: cc.Prefab;
  @property(cc.Float) public spawnRate: number = 0.1;
  @property({ type: cc.Enum(PoolType) })
  public poolType: PoolType = PoolType.None;
}

@ccclass
export class Platforms {
  @property(cc.Prefab)
  public platform: cc.Prefab;
  @property(cc.Float)
  public spawnRate: number = 0.1;
  @property({ type: cc.Enum(PoolType) })
  public poolType: PoolType = PoolType.None;
}

@ccclass
export class Boosters {
  @property(cc.Node) public node: cc.Node;
  @property({ type: cc.Enum(PoolType) })
  public poolType: PoolType = PoolType.None;
}

@ccclass
export class Sounds {
    @property(cc.AudioClip) public audio: cc.AudioClip;
    @property({ type: cc.Enum(AudioType) }) public audioType: AudioType = AudioType.None;
}
