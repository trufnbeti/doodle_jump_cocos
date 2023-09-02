
import Item from "./Item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Jetpack extends Item {

    @property(cc.Animation) private anim: cc.Animation;

    start () {

    }

    // update (dt) {}
}
