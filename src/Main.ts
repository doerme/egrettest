//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;

    private times:number;

    private webSocket:egret.WebSocket;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("heroes");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "heroes") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield:egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void {
        console.log( "createGameScene", RES.getRes("hero-01") );
        var bg:egret.Shape = new egret.Shape();
        bg.graphics.beginFill( 0x336699 );
        bg.graphics.drawRect( 0, 0, this.stage.stageWidth, this.stage.stageHeight ); 
        bg.graphics.endFill();
        super.addChild( bg );
        var batman:egret.Bitmap = new egret.Bitmap( RES.getRes("hero-01") );
        batman.x = 10;
        batman.y = 20;
        this.addChild( batman );
        var superman:egret.Bitmap = new egret.Bitmap( RES.getRes("hero-02") );
        superman.x = 220;
        superman.y = 20;
        this.addChild( superman );
        console.log( "display indexes:", this.getChildIndex( bg ), this.getChildIndex( batman ),  this.getChildIndex( superman ) );
        this.setChildIndex( batman, this.getChildIndex( superman ) );
        console.log( "display indexes:", this.getChildIndex( bg ), this.getChildIndex( batman ),  this.getChildIndex( superman ) );
        
        superman.anchorOffsetX = 30;
        superman.anchorOffsetY = 40;
        superman.x += 30;
        superman.y += 40;


        this.times = -1;
        var self = this;
        this.stage.addEventListener( egret.TouchEvent.TOUCH_TAP, function(){ 
            switch ( ++ self.times % 3 ) { 
                case 0: 
                    egret.Tween.get( batman ).to( { x:superman.x }, 300, egret.Ease.circIn );
                    egret.Tween.get( superman ).to( { x:batman.x }, 300, egret.Ease.circIn );
                break; 
                case 1: 
                    egret.Tween.get( batman ).to( { alpha:.3 }, 300, egret.Ease.circIn ).to( { alpha:1 }, 300, egret.Ease.circIn );
                    var sound:egret.Sound = RES.getRes( "coin_music_wav" ); 
                    var channel:egret.SoundChannel = sound.play(0,1);
                break; 
                case 2: 
                    egret.Tween.get( superman ).to( { scaleX:.4, scaleY:.4 }, 500, egret.Ease.circIn ).to( { scaleX:1, scaleY:1 }, 500, egret.Ease.circIn );
                break; 
            } 
        }, this );


        var urlreq:egret.URLRequest = new egret.URLRequest( "http://httpbin.org/user-agent" );
        var urlloader:egret.URLLoader = new egret.URLLoader(); 
        urlloader.addEventListener( egret.Event.COMPLETE, function( evt:egret.Event ):void{
            console.log(evt.target.data);
        }, this );
        urlloader.load( urlreq );

        this.webSocket = new egret.WebSocket();
        this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        this.webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        this.webSocket.connect("echo.websocket.org", 80);
    }

    private touchHandler( evt:egret.TouchEvent ):void{
        var tx:egret.TextField = evt.currentTarget;
        tx.textColor = 0x00ff00; 
    }

    private onSocketOpen():void {    
        var cmd = "Hello Egret WebSocket";    
        console.log("The connection is successful, send data: " + cmd);    
        this.webSocket.writeUTF(cmd); 
    }

    private onReceiveMessage(e:egret.Event):void {    
        var msg = this.webSocket.readUTF();    
        console.log("Receive data: test " + msg); 
    }

    



}


