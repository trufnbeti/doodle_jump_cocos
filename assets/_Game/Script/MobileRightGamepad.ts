import GamepadController from "./Manager/GamepadController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MobileRightGamepad extends cc.Component {

    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchBegan(event: cc.Event.EventTouch){
        GamepadController.Ins.CanMoveRight = true;
        GamepadController.Ins.CanMoveLeft = false;
        console.log("Right true");
        console.log(GamepadController.Ins.CanMoveRight);
    }

    private onTouchEnd(event: cc.Event.EventTouch){
        GamepadController.Ins.CanMoveRight = false;
        GamepadController.Ins.CanMoveLeft = false;
        console.log("Right false");
        console.log(GamepadController.Ins.CanMoveRight);
    }
}
