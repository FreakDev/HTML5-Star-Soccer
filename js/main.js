var SoccerGame = SoccerGame || {};

SoccerGame.game = new Phaser.Game(640, 480, Phaser.AUTO, "canvas");

SoccerGame.game.state.add('Boot', SoccerGame.Boot);
SoccerGame.game.state.add('Preload', SoccerGame.Preload);
SoccerGame.game.state.add('Menu', SoccerGame.Menu);
SoccerGame.game.state.add('Game', SoccerGame.Game);

SoccerGame.game.state.start('Boot');