import { PrefKey } from "./DataStruct";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Pref{
    public static setHighScore(value: number): void{
        let currentBestScore: number = cc.sys.localStorage.getItem(PrefKey.BestScore);
        
        if (!currentBestScore){
            currentBestScore = 0;
        }
        
        if (value > currentBestScore || currentBestScore == 0){
            cc.sys.localStorage.setItem(PrefKey.BestScore, value);
        }        
    }
    public static getHighScore(): number{
        const res: number = cc.sys.localStorage.getItem(PrefKey.BestScore);
        return res ? res : 0;
    }

    public static setPlayerName(value: string): void{
        cc.sys.localStorage.setItem(PrefKey.PlayerName, value);
    }

    public static getPlayerName(): string{
        const currentName: string = cc.sys.localStorage.getItem(PrefKey.PlayerName);

        return currentName ? currentName : "";
    }
}