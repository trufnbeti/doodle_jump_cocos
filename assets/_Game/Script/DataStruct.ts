// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

export enum GameState {
    Starting = 0,
    Playing = 1,
    GameOver = 2,
}

export enum PoolType {
    None = 0,
    Platform = 1,
    MovingPlatform = 2,
    BreakablePlatform = 3,
    Springs = 4,
    Trampoline = 5,
    Jetpack = 6,
    Propeller = 7,
}

export enum AudioType{
    None,
    Jump,
    Springs,
    Trampoline,
    Propeller,
    Jetpack,
}

export enum PrefKey{
    BestScore = "BestScore",
    PlayerName = "PlayerName",
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class Items{
    @property(cc.Prefab)
    public item: cc.Prefab;
    @property(cc.Float)
    public spawnRate: number = 0.1;
    @property({ type: cc.Enum(PoolType) })
    public poolType: PoolType = PoolType.None;
}

@ccclass
export class Platforms{
    @property(cc.Prefab)
    public platform: cc.Prefab;
    @property(cc.Float)
    public spawnRate: number = 0.1;
    @property({ type: cc.Enum(PoolType) })
    public poolType: PoolType = PoolType.None;

}

@ccclass
export class Boosters{
    @property(cc.Node) public node: cc.Node;
    @property({ type: cc.Enum(PoolType) })
    public poolType: PoolType = PoolType.None;
}

@ccclass
export class Sounds{
    @property({ type: cc.Enum(AudioType) }) public audioType: AudioType = AudioType.None;
    @property(cc.AudioClip) public audio: cc.AudioClip;
}
