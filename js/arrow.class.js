(function (global) {

    var b2Vec2 = Box2D.Common.Math.b2Vec2


    function Arrow (game, phaserImage) {
        this.game = game;

        this.arrow = game.add.sprite(0, 0, "arrow-indactor");
        this.arrow.anchor.x = 0;
        this.arrow.anchor.y = 0.5;
        this.arrow.visible = false;
    }

    Arrow.prototype.moveArrow = function (x, y) {
        this.arrow.position.x = x;
        this.arrow.position.y = y;
    }

    Arrow.prototype.bindToCircle = function (circle) {
        this.isDisplayed = true;
        console.log("X: " + circle.image.position.x, "Y: "+  circle.image.position.y);
        this.moveArrow(circle.image.position.x, circle.image.position.y);
        console.log(circle);
        this.circle = circle;
    }

    function angle(cx, cy, ex, ey) {
        var dy = ey - cy;
        var dx = ex - cx;
        var theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        return theta;
    }

    function distanceBetween(x1, y1, x2, y2) {

        var dx = x1 - x2;
        var dy = y1 - y2;

        return Math.sqrt(dx * dx + dy * dy);

    }

    Arrow.prototype.getAngle = function () {
        if (this.circle !== undefined) {
            return this.arrow.angle
        }
        return 0;
    }

    Arrow.prototype.hide = function () {
        this.isDisplayed = false;
    }

    Arrow.prototype.getForce = function () {
        if (this.circle !== undefined) {
            return distanceBetween(this.game.input.x, this.game.input.y, this.arrow.position.x,this.arrow.position.y);
        }
        return 0;
    }

    Arrow.prototype.getVector = function (c) {
        return new b2Vec2((c.body.GetWorldCenter().x - (this.game.input.x / 30)) * 2, (c.body.GetWorldCenter().y - (this.game.input.y / 30)) * 2)
    }

    Arrow.prototype.update = function () {
        var dB = distanceBetween(this.game.input.x, this.game.input.y, this.arrow.position.x,this.arrow.position.y);
        if (this.isDisplayed == true) {
            this.arrow.visible = true;
        } else {
            this.arrow.visible = false;
        }
        if (this.circle !== undefined) {
        this.circle.image.bringToTop();
            this.arrow.angle = angle(this.game.input.x - this.circle.image.position.x, this.game.input.y - this.circle.image.position.y, 0,0);
            if (dB > 33) {
                this.arrow.scale.setTo(dB/35, 1);
                if ((dB/35) > 1.5) {
                    this.arrow.scale.setTo(1.5, 1);
                }
            }  else {
                this.arrow.scale.setTo(1, 1);
            }
        }
    }

    global.Arrow = Arrow;

})(window);

