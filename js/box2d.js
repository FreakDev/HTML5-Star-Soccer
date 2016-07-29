      
      function init() {
         var   b2Vec2 = Box2D.Common.Math.b2Vec2
            ,  b2AABB = Box2D.Collision.b2AABB
         	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
         	,	b2Body = Box2D.Dynamics.b2Body
         	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
         	,	b2Fixture = Box2D.Dynamics.b2Fixture
         	,	b2World = Box2D.Dynamics.b2World
         	,	b2MassData = Box2D.Collision.Shapes.b2MassData
         	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
         	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
         	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
            ,  b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
            ,  bodies = []
            ;
         
         var world = new b2World(
               new b2Vec2(0, 0)    // 0 gravity
            ,  true                 //allow sleep
         );
         
         var fixDef = new b2FixtureDef;
         fixDef.density = 1;
         fixDef.friction = 0.5;
         fixDef.restitution = 0.3;
         
         var bodyDef = new b2BodyDef;
         
         //create ground
         bodyDef.type = b2Body.b2_staticBody;
         fixDef.shape = new b2PolygonShape;
         fixDef.shape.SetAsBox(20, 2);
         bodyDef.position.Set(10, 400 / 30 + 1.8);
         world.CreateBody(bodyDef).CreateFixture(fixDef);
         bodyDef.position.Set(10, -1.8);
         world.CreateBody(bodyDef).CreateFixture(fixDef);
         fixDef.shape.SetAsBox(2, 14);
         bodyDef.position.Set(-1.8, 13);
         world.CreateBody(bodyDef).CreateFixture(fixDef);
         bodyDef.position.Set(21.8, 13);
         world.CreateBody(bodyDef).CreateFixture(fixDef);
         
         
         //create some objects
         var lastbody, radius, density, damping;
         bodyDef.type = b2Body.b2_dynamicBody;
         for(var i = 0; i < 11; ++i) {
            bodyDef.position.x = Math.random() * 10;
            bodyDef.position.y = Math.random() * 10;
            bodies.push(world.CreateBody(bodyDef));
            lastbody = bodies[bodies.length - 1];

            if (i < 10) {
               radius = 0.6;
               damping = 0.6;
               density = 0.8;
            } else {
               radius = 0.4;
               damping = 0.5;
               density = 0.2;
            }

            fixDef.shape = new b2CircleShape(
               radius //radius
            );
            fixDef.restitution = 0.5;
            fixDef.density = density;

            lastbody.CreateFixture(fixDef);
            lastbody.SetLinearDamping(damping);
            lastbody.SetAngularDamping(damping);

         }
         
         //setup debug draw
         var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
			debugDraw.SetDrawScale(30.0);
			debugDraw.SetFillAlpha(0.5);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			world.SetDebugDraw(debugDraw);
         
         window.setInterval(update, 1000 / 60);
         
         //mouse
         
         var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
         var canvasPosition = getElementPosition(document.getElementById("canvas"));
         
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
         
         function getBodyAtMouse() {
            mousePVec = new b2Vec2(mouseX, mouseY);
            var aabb = new b2AABB();
            aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
            aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);
            
            // Query the world for overlapping shapes.

            selectedBody = null;
            world.QueryAABB(getBodyCB, aabb);
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
         
         //update
         
         var lastSelectedBody;

         function update() {
         
            if(isMouseDown && (!mouseJoint)) {
               console.log("getBodyAtMouse");
               var body = getBodyAtMouse();
               if(body) {
                  // var md = new b2MouseJointDef();
                  // md.bodyA = world.GetGroundBody();
                  // md.bodyB = body;
                  // md.target.Set(mouseX, mouseY);
                  // md.collideConnected = true;
                  // md.maxForce = 300.0 * body.GetMass();
                  mouseJoint = true;
                  // mouseJoint = world.CreateJoint(md);
               }
            }
            
            if(mouseJoint) {
               if(isMouseDown) {
                  // mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
               } else {
                  if (selectedBody) {
                     var bodyCenter = selectedBody.GetWorldCenter();
                     selectedBody.ApplyImpulse(new b2Vec2((bodyCenter.x - mouseX) * 2, (bodyCenter.y - mouseY) * 2), bodyCenter)
                     mouseX = undefined;
                     mouseY = undefined;
                     // world.DestroyJoint(mouseJoint);
                     mouseJoint = false;                     
                  }
               }
            }
         
            // check if anybody is awake
            var hasAwake = false;
            bodies.forEach(function (body) {

               if (body.IsAwake()) {
                  hasAwake = true;
               }
            //    if (bodyV.x != 0 || bodyV.y != 0) {
            //       targetX = Math.abs(bodyV.x) < 0.1 ? 0 : bodyV.x * 0.995;
            //       targetY = Math.abs(bodyV.y) < 0.1 ? 0 : bodyV.y * 0.995;
            //       console.log("decrease velocity",bodyV, {x:targetX, y:targetY});
            //       body.SetLinearVelocity({x:targetX, y:targetY});
            //    }
            });
            console.log(hasAwake ? "wait for it" : "play");

            world.Step(1 / 60, 10, 10);
            world.DrawDebugData();
            world.ClearForces();
         };
         
         //helpers
         
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


      };
   
