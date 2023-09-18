const {ccclass, property} = cc._decorator;

@ccclass
export default class GamepadController extends cc.Component{
    private static ins : GamepadController;
    public static get Ins() : GamepadController{
        return GamepadController.ins;
    }
    protected onLoad(): void {
        GamepadController.ins = this;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyReleased, this);

    }

    private keys = {};

    onKeyPressed(event: KeyboardEvent): void{
        this.keys[event.keyCode] = true;
        
    }

    onKeyReleased(event: KeyboardEvent): void{
        this.keys[event.keyCode] = false;
    }

    @property(cc.Boolean) public isOnMobile: boolean = false;
    private canMoveLeft: boolean = false;
    private canMoveRight: boolean = false;
    public get CanMoveLeft(): boolean{
        return this.canMoveLeft;
    }
    public get CanMoveRight(): boolean{
        return this.canMoveRight;
    }
    public set CanMoveLeft(value: boolean){
        this.canMoveLeft = value;
    }
    public set CanMoveRight(value: boolean){
        this.canMoveRight = value;
    }
    protected update(dt: number): void {
        if (this.isOnMobile)    return;

        this.canMoveLeft = this.keys[37];
        this.canMoveRight = this.keys[39];
        

    }
}