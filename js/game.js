document.addEventListener('DOMContentLoaded', function () {

  var world, game = new Phaser.Game(640, 480, Phaser.AUTO, "c", { preload: preload, create: create, update: update, render: render });

  var p, b, a;
  var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
  var selectedCircle;
  var canvasPosition;
  var b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Body = Box2D.Dynamics.b2Body,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2World = Box2D.Dynamics.b2World,
      b2AABB = Box2D.Collision.b2AABB,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

  var debugDraw;
  var p1, p2;


  function preload() {
      game.load.image('ground', 'assets/background.png');

      // ball
      game.load.image('ball', 'assets/ball.png');

      // player
      game.load.image('player-1', 'assets/player-1.png');
      game.load.image('player-2', 'assets/player-2.png');

      // arrow
      game.load.image('arrow-indactor', 'assets/arrow.png');
  }

  function create() {

      world = new b2World(
          new b2Vec2(0, 0)    // 0 gravity
          ,  true // allow sleep
      );
       var fixDef = new b2FixtureDef;
       fixDef.density = 1.0;
       fixDef.friction = 0.5;
       fixDef.restitution = 0.2;

       var bodyDef = new b2BodyDef;

       //create ground
       bodyDef.type = b2Body.b2_staticBody;
       fixDef.shape = new b2PolygonShape;

       fixDef.shape.SetAsBox(20, 2);
       // HAUT
       bodyDef.position.Set(10, -1.8);
       world.CreateBody(bodyDef).CreateFixture(fixDef);
       // BAS
       bodyDef.position.Set(10, 456 / 30 + 1.8);
       world.CreateBody(bodyDef).CreateFixture(fixDef);

       fixDef.shape.SetAsBox(2, 14);
       // GAUCHE
       bodyDef.position.Set(-1.2, 13);
       world.CreateBody(bodyDef).CreateFixture(fixDef);
       // DROITE
       bodyDef.position.Set(22.5, 13);
       world.CreateBody(bodyDef).CreateFixture(fixDef);


      game.add.sprite(0, 0, 'ground');

      p1 = new Player(game, world, "Marcel");
      p2 = new Player(game, world, "Bobby");

      a = new Arrow(game, 'arrow-indactor');
      b = new Circle(game, game.world.centerX, game.world.centerY, 'ball', 0.5, world, 0.5, 0.2, 0.4);

      function handleMouseMove(e) {
          mouseX = e.x;
          mouseY = e.y;
      };
      game.input.onDown.add(function (e) {
        handleMouseMove(e);
        isMouseDown = true;

        // On recup l'objet cliqué
        selectedCircle = e.targetObject.sprite;
        selectedBody = selectedCircle.b2Body;

        game.input.addMoveCallback(handleMouseMove);

        a.bindToCircle(selectedCircle);
      });

      game.input.onUp.add(function (e) {
        isMouseDown = false;
        game.input.deleteMoveCallback(handleMouseMove);
        fire(selectedCircle);
      });

      debugDraw = new b2DebugDraw();
      debugDraw.SetSprite(document.querySelector('#debug').getContext('2d'));
      debugDraw.SetDrawScale(30.0);
      debugDraw.SetFillAlpha(0.5);
      debugDraw.SetLineThickness(1.0);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
      world.SetDebugDraw(debugDraw);
  }

  function fire(c) {

    // c.applyForce(angle, force)
    var bodyCenter = selectedBody.GetWorldCenter();
    selectedBody.ApplyImpulse(a.getVector(c), bodyCenter)

    a.hide();
  }

  function update() {
      world.Step(1 / 60, 10, 10);

      b.update();
      a.update();
      world.DrawDebugData();
      world.ClearForces();
  }

   function render() {
    // game.debug.text("x: " + game.input.mousePointer.x + ", y: " + game.input.mousePointer.y || '--', 20, 70, "#00ff00", "40px Courier");
   }

});