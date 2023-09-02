import { GameState } from "../DataStruct";
import Pref from "../Pref";
import GameManager from "./GameManager";
import PhysicManager from "./PhysicManager";

const {ccclass, property} = cc._decorator;
 
@ccclass
export default class UIManager extends cc.Component{

    @property(cc.Node)
    private camera: cc.Node;
    @property(cc.Label)
    private score: cc.Label;

    @property(cc.Button)
    private btnPause: cc.Button;

    private static ins : UIManager;
    public static get Ins() : UIManager
    {
       return UIManager.ins;
    }
 
    protected onLoad(): void {
        UIManager.ins = this;
        this.roots[0] = new cc.Node();
        this.roots[0].setParent(this.parentsUI[0]);

        for (let i = 1; i < this.prefabsUI.length; i++){
            this.roots[i] = new cc.Node();
            this.roots[i].setParent(this.parentsUI[1]);
        }

        this.onOpen(2);
        
    }
    @property([cc.Prefab])
    private prefabsUI : cc.Node[] = [];
    @property(cc.Node)
    private parentsUI: cc.Node[] = [];

    canvas : cc.Node[] = [];

    //list roots node để show layer theo đúng thứ tự mong muốn
    roots : cc.Node[] = [];
    public onOpen(index: number){
        if(this.canvas[index] == null) {
            this.canvas[index] = cc.instantiate(this.prefabsUI[index]);
            this.canvas[index].setParent(this.roots[index]);
        }
        
        this.canvas[index].active = true;
        // if (index != 0)
            this.disableBtnPause();
    }
    public onClose(index: number){
        if(this.canvas[index] != null){
            this.canvas[index].active = false;
            this.enableBtnPause();
        }
    }
    
    public closeAll(): void{
        for(let i = 0; i < this.canvas.length; i++)
            this.onClose(i);
    }
    private onBtnPauseClick(): void{
        this.onOpen(0);
        cc.director.pause();
    }
    
    disableBtnPause(): void{
        this.btnPause.node.active = false;
    }
    enableBtnPause(): void{
        this.btnPause.node.active = true;
    }

    public updateScore(value: number){
        this.score.string = value.toString();
    }

    protected update(dt: number): void {
        this.node.position = this.camera.position;
    }

    public ReplayGame(): void{
        GameManager.Ins.onReset();
        if (cc.director.isPaused()){
            cc.director.resume();
        }
        GameManager.Ins.state = GameState.Playing;
    }
}