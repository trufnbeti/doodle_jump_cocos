import GamepadController from "./Manager/GamepadController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MobileLeftGamepad extends cc.Component {

    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchBegan(event: cc.Event.EventTouch){
        GamepadController.Ins.CanMoveLeft = true;
        GamepadController.Ins.CanMoveRight = false;
        console.log("Left true");
        console.log(GamepadController.Ins.CanMoveLeft);
    }

    private onTouchEnd(event: cc.Event.EventTouch){
        GamepadController.Ins.CanMoveLeft = false;
        GamepadController.Ins.CanMoveRight = false;
        console.log("Left false");
        console.log(GamepadController.Ins.CanMoveLeft);
        
    }
}
