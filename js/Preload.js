var SoccerGame = SoccerGame || {};

SoccerGame.Preload = function () {};

SoccerGame.Preload.prototype = {
    preload: function () {
      this.load.image('ground', 'assets/background.png');

      // ball
      this.load.image('ball', 'assets/ball.png');

      // player
      this.load.image('player-1', 'assets/player-1.png');
      this.load.image('player-2', 'assets/player-2.png');

      // arrow
      this.load.image('arrow-indactor', 'assets/arrow.png');
    },
    create: function () {
        this.state.start('Game');
    }
}
