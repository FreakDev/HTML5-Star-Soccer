(function (global) {

    var b2BodyDef = Box2D.Dynamics.b2BodyDef
    ,   b2Body = Box2D.Dynamics.b2Body
    ,   b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    ,   b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    ;


    function Circle (game, x, y, phaserImage, scale, world, radius, density, damping) {
        
        var bodyDef = new b2BodyDef;
        var fixDef = new b2FixtureDef;

        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.x = x / 30;
        bodyDef.position.y = y / 30;

        this.body = world.CreateBody(bodyDef);

        fixDef.shape = new b2CircleShape(
           radius //radius
        );
        fixDef.restitution = 0.5;
        fixDef.density = density;

        this.body.CreateFixture(fixDef);
        this.body.SetLinearDamping(damping);
        this.body.SetAngularDamping(damping);

        this.image = game.add.sprite(x, y, phaserImage);
        this.image.anchor.setTo(0.5, 0.5);
        this.image.scale.set(scale, scale);

    }

    Circle.prototype.update = function () {
        var bodyCenter = this.body.GetWorldCenter();
        this.image.x = bodyCenter.x * 30;
        this.image.y = bodyCenter.y * 30;
    }

    global.Circle = Circle;

})(window);

