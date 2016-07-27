(function (global) {

    var b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;


    function Circle (game, x, y, phaserImage, scale, world, radius, density, damping, owner) {
        Phaser.Sprite.call(this, game, x, y, phaserImage);

        var bodyDef = new b2BodyDef;
        var fixDef = new b2FixtureDef;

        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.x = x / 30;
        bodyDef.position.y = y / 30;

        this.b2Body = world.CreateBody(bodyDef);

        this.owner = owner;

        fixDef.shape = new b2CircleShape(
           radius //radius
        );
        fixDef.restitution = 0.5;
        fixDef.density = density;

        this.b2Body.CreateFixture(fixDef);
        this.b2Body.SetLinearDamping(damping);
        this.b2Body.SetAngularDamping(damping);

        this.anchor.setTo(0.5, 0.5);
        this.scale.set(scale, scale);
        this.inputEnabled = true;

        game.add.existing(this);
    }

    Circle.prototype = Object.create(Phaser.Sprite.prototype);
    Circle.prototype.constructor = Circle;

    Circle.prototype.onClickCircle = function() {
        console.log(a);
        a.bindToCircle(this.image);
    }

    Circle.prototype.update = function () {
        var bodyCenter = this.b2Body.GetWorldCenter();
        this.x = bodyCenter.x * 30;
        this.y = bodyCenter.y * 30;
    }

    global.Circle = Circle;

})(window);

