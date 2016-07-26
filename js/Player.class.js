(function (global) {
    "use strict";
    var playerCount = 0;
    var circlePositions = [
        {
            name: "Default",
            positions: [
                {x: 85, y: 230},
                {x: 175, y: 95},
                {x: 175, y: 350},
                {x: 255, y: 160},
                {x: 255, y: 300}
            ]
        }
    ];

    function Player(game, world, name) {
        this.game = game;
        this.world = world;
        this.name = name;
        this.circles = [];

        playerCount += 1;
        this.number = playerCount;
    }

    Player.prototype.init = function () {
        this.prepareTeam();
        console.log("On init le joueur " + this.name);
    };

    Player.prototype.prepareTeam = function () {
        var i;
        var circle;
        var positions = circlePositions[0].positions;
        var x, y;
        for (i = 0; i < 5; i += 1) {
            x = this.number % 2 === 0 ? positions[i].x : this.game.width - positions[i].x;
            y = positions[i].y;
            circle = new Circle(this.game, x, y, 'player-' + this.number, 0.15, this.world, 0.75, 0.8, 0.6);
            this.circles.push(circle);
        }
    };

    Player.prototype.updateTeam = function () {
        this.circles.forEach(function (circle) {
            circle.update();
        });
    };

    Player.prototype.setName = function (name) {
        this.name = name;
    };
    global.Player = Player;

})(window);

