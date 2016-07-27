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
      b2AABB = Box2D.Collision.b2AABB;
  var debugDraw;
  var p1, p2;

  // function getBodyAtMouse() {
  //     mousePVec = new b2Vec2(mouseX, mouseY);
  //     var aabb = new b2AABB();
  //     aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
  //     aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);

  //     // Query the world for overlapping shapes.

  //     selectedBody = null;
  //     world.QueryAABB(getBodyCB, aabb);
  //     console.log(selectedBody);
  //     return selectedBody;
  // }

  // function getBodyCB(fixture) {
  //   console.log(fixture);
  //     if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
  //         if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
  //             selectedBody = fixture.GetBody();
  //             return false;
  //         }
  //     }
  //     return true;
  // }

  // function getClickedCircle() {
    // console.log(mouseX/30, mouseY/30);
      // mousePVec = new b2Vec2(mouseX / 30, mouseY / 30);
      // var aabb = new b2AABB();
      // aabb.lowerBound.Set(mouseX /30 - 0.001, mouseY /30 - 0.001);
      // aabb.upperBound.Set(mouseX /30 + 0.001, mouseY /30 + 0.001);

      // // Query the world for overlapping shapes.
      // selectedBody = null;

      // function findCircleFromBody(fixture) {
      //     if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
      //         if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
      //             selectedBody = fixture.GetBody();
      //             return false;
      //         }
      //     }
      //     return true;
      // }
      // world.QueryAABB(findCircleFromBody, aabb);
      // selectedCircle = selectedBody !== null ? selectedBody.parent : null;
      // console.log(selectedCircle);
      // return selectedCircle;
  // }

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
          ,  true             // allow sleep
      );
      game.add.sprite(0, 0, 'ground');

      p1 = new Player(game, world, "Marcel");
      p2 = new Player(game, world, "Bobby");

      a = new Arrow(game, 'arrow-indactor');
      p = new Circle(game, game.world.centerX - 50, game.world.centerY - 50, 'player-1', 0.15, world, 0.6, 0.8, 0.6);
      // CLICK
      // canvasPosition = getElementPosition(document.querySelector("canvas"));

      game.input.onDown.add(a.bindToCircle.bind(a, p1.circles[1]))
      game.input.onUp.add(fire.bind(this, p1.circles[1]))

      document.addEventListener("mouseup", function() {
          document.removeEventListener("mousemove", handleMouseMove, true);
          isMouseDown = false;
      }, true);

      // function handleMouseMove(e) {
      //     mouseX = (e.clientX - canvasPosition.x) / 30;
      //     mouseY = (e.clientY - canvasPosition.y) / 30;
      // };
      // CLICK END

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
      });

      game.input.onUp.add(function (e) {
        isMouseDown = false;
        game.input.deleteMoveCallback(handleMouseMove);
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

    getBodyAtMouse()

    // c.applyForce(angle, force)
    var bodyCenter = selectedBody.GetWorldCenter();
    selectedBody.ApplyImpulse(a.getVector(c), bodyCenter)


    a.hide();

  }

  function update() {
      // var ctxt = game.context;

      if(isMouseDown && (!mouseJoint)) {
         if(selectedCircle) {
            mouseJoint = true;
         }
      }

         if(isMouseDown) {
               mouseY = undefined;

      }
         }
            }
               mouseJoint = false;
               mouseX = undefined;
               selectedBody.ApplyImpulse(new b2Vec2((bodyCenter.x - mouseX / 30) * 2, (bodyCenter.y - mouseY / 30) * 2), bodyCenter)
            if (selectedBody) {
         } else {
               var bodyCenter = selectedBody.GetWorldCenter();
      if(mouseJoint) {
      world.Step(1 / 60, 10, 10);

      b.update();
      a.update();
      p.update();
      world.DrawDebugData();
      world.ClearForces();
  }

   //http://js-tut.aardon.de/js-tut/tutorial/position.html
   // function getElementPosition(element) {
   //    var elem=element, tagname="", x=0, y=0;

   //    while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
   //       y += elem.offsetTop;
   //       x += elem.offsetLeft;
   //       tagname = elem.tagName.toUpperCase();

   //       if(tagname == "BODY")
   //          elem=0;

   //       if(typeof(elem) == "object") {
   //          if(typeof(elem.offsetParent) == "object")
   //             elem = elem.offsetParent;
   //       }
   //    }

   //    return {x: x, y: y};
   // }

   function render() {
    // game.debug.text("x: " + game.input.mousePointer.x + ", y: " + game.input.mousePointer.y || '--', 20, 70, "#00ff00", "40px Courier");
   }

});