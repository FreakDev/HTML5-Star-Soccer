var SoccerGame = SoccerGame || {};

SoccerGame.Boot = function() {};

SoccerGame.Boot.prototype = {
    create: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.scale.setScreenSize(true);

        this.state.start('Preload');
    }
}