document.addEventListener('DOMContentLoaded', function () {

  var world, game = new Phaser.Game(640, 480, Phaser.AUTO, "c", { preload: preload, create: create, update: update, render: render });

  var p, b;
  var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
  var canvasPosition;
  var b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Body = Box2D.Dynamics.b2Body,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2World = Box2D.Dynamics.b2World,
      b2AABB = Box2D.Collision.b2AABB;
  var debugDraw;
  var p1, p2;

  function getBodyAtMouse() {
      mousePVec = new b2Vec2(mouseX, mouseY);
      var aabb = new b2AABB();
      aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
      aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);

      // Query the world for overlapping shapes.

      selectedBody = null;
      world.QueryAABB(getBodyCB, aabb);
      console.log(selectedBody);
      return selectedBody;
  }

  function getBodyCB(fixture) {
      if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
          if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
              selectedBody = fixture.GetBody();
              return false;
          }
      }
      return true;
  }


  function preload() {
      game.load.image('ground', 'assets/background.png');

      // ball
      game.load.image('ball', 'assets/ball.png');

      // player
      game.load.image('player-1', 'assets/player-1.png');
      game.load.image('player-2', 'assets/player-2.png');
  }

  function create() {

      world = new b2World(
          new b2Vec2(0, 0)    // 0 gravity
          ,  true             // allow sleep
      );
      game.add.sprite(0, 0, 'ground');

      p1 = new Player(game, world, "Marcel");
      p2 = new Player(game, world, "Bobby");
      p1.init();
      p2.init();

      canvasPosition = getElementPosition(document.querySelector("canvas"));

      document.addEventListener("mousedown", function(e) {
          isMouseDown = true;
          handleMouseMove(e);
          document.addEventListener("mousemove", handleMouseMove, true);
      }, true);

      document.addEventListener("mouseup", function() {
          document.removeEventListener("mousemove", handleMouseMove, true);
          isMouseDown = false;
      }, true);

      function handleMouseMove(e) {
          mouseX = (e.clientX - canvasPosition.x) / 30;
          mouseY = (e.clientY - canvasPosition.y) / 30;
      };


      b = new Circle(game, game.world.centerX, game.world.centerY, 'ball', 0.5, world, 0.5, 0.2, 0.4);

      debugDraw = new b2DebugDraw();
      debugDraw.SetSprite(document.querySelector('#debug').getContext('2d'));
      debugDraw.SetDrawScale(30.0);
      debugDraw.SetFillAlpha(0.5);
      debugDraw.SetLineThickness(1.0);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
      world.SetDebugDraw(debugDraw);
  }

  function update() {

      // var ctxt = game.context;

      if(isMouseDown && (!mouseJoint)) {
         var body = getBodyAtMouse();
         if(body) {
            mouseJoint = true;
         }
      }

      if(mouseJoint) {
         if(isMouseDown) {
         } else {
            if (selectedBody) {
               var bodyCenter = selectedBody.GetWorldCenter();
               selectedBody.ApplyImpulse(new b2Vec2((bodyCenter.x - mouseX) * 2, (bodyCenter.y - mouseY) * 2), bodyCenter)
               mouseX = undefined;
               mouseY = undefined;
               mouseJoint = false;
            }
         }
      }

      world.Step(1 / 60, 10, 10);

      p1.updateTeam();
      p2.updateTeam();
      b.update();

      world.DrawDebugData();
      world.ClearForces();
  }

   //http://js-tut.aardon.de/js-tut/tutorial/position.html
   function getElementPosition(element) {
      var elem=element, tagname="", x=0, y=0;

      while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
         y += elem.offsetTop;
         x += elem.offsetLeft;
         tagname = elem.tagName.toUpperCase();

         if(tagname == "BODY")
            elem=0;

         if(typeof(elem) == "object") {
            if(typeof(elem.offsetParent) == "object")
               elem = elem.offsetParent;
         }
      }

      return {x: x, y: y};
   }

   function render() {
    game.debug.text("x: " + game.input.mousePointer.x + ", y: " + game.input.mousePointer.y || '--', 20, 70, "#00ff00", "40px Courier");
   }

});