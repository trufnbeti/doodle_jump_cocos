
import { AudioType, Sounds } from "../DataStruct";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SoundManager extends cc.Component {

   // singleton
   private static ins : SoundManager;
   public static get Ins() : SoundManager
   {
      return SoundManager.ins;
   }

   protected onLoad(): void {
       SoundManager.ins = this;
   }

   //------------------------------------

    @property(Sounds)   private listTest: Sounds[] = [];
    
    private sounds: Map<AudioType, cc.AudioSource> = new Map<AudioType, cc.AudioSource>;

    protected start(): void {
        for (let i = 0; i < this.listTest.length; i++){
            let node = new cc.Node().addComponent(cc.AudioSource);
            node.clip = this.listTest[i].audio;
            node.volume = 0.5;
            this.sounds.set(this.listTest[i].audioType, node);
        }
        console.log(this.sounds);
        
    }

    public PlayClip(type: AudioType): void {
        this.sounds.get(type).play();
    }

    public PauseAllSound(): void{
        this.sounds.forEach(item => {
            if (item.isPlaying){
                item.pause();
            }
        })
    }
    public ResumeAllSound(): void{
        this.sounds.forEach(item => {
            item.resume();
        })
    }
}
