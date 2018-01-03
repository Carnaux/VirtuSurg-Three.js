Ammo().then(function(Ammo) {

  // Detects webgl
        if ( ! Detector.webgl ) {
            Detector.addGetWebGLMessage();
            document.getElementById( 'container' ).innerHTML = "";
        }

        // - Global variables -
        var DISABLE_DEACTIVATION = 4;
        var e;
  // Graphics variables
        var container, stats;
        var camera, controls, scene, renderer;
        var textureLoader;
        var clock = new THREE.Clock();
        var clickRequest = false;
        var mouseCoords = new THREE.Vector2();
        var raycaster = new THREE.Raycaster();
        var ballMaterial = new THREE.MeshPhongMaterial( { color: 0x202020 } );
        var pos = new THREE.Vector3();
        var poss = new THREE.Vector3();
        var quat = new THREE.Quaternion();
        var quat1 = new THREE.Quaternion();
        var mouse = { x: 0, y: 0, z: 0 };
        var cursor;
        var ps;
        var enablecursor;
        var keyboard = [];
        var mov =  new Ammo.btVector3( 0, 0, 0 );
        var time = 0;
        // Physics variables
        var gravityConstant = -9.8;
        var collisionConfiguration;
        var dispatcher;
        var broadphase;
        var solver;
        var physicsWorld;
        var rigidBodies = [];
        var softBodies = [];
        var margin = 0.05;
        var hinge;
        var transformAux1 = new Ammo.btTransform();
        var softBodyHelpers = new Ammo.btSoftBodyHelpers();
        var armMovement = 0;
        //user data
          var movs =  new Ammo.btVector3( 1, 0, 0 );
          var tran = new Ammo.btTransform();
          var gall;
        // - Main code -

        init();
        animate();


        // - Functions -
        function active() {
          e = true;
        }

        function init() {

          initGraphics();

          initPhysics();

          createObjects();

          initInput();

        }



        function initGraphics() {

              document.addEventListener( 'mousemove', onDocumentMouseMove, false );
              container = document.getElementById( 'container' );

              camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 2000 );

              scene = new THREE.Scene();

              camera.position.x = -7;
              camera.position.y = 5;
              camera.position.z =  8;

              controls = new THREE.OrbitControls( camera );
              controls.target.y = 2;

              renderer = new THREE.WebGLRenderer();
              renderer.setClearColor( 0xbfd1e5 );
              renderer.setPixelRatio( window.devicePixelRatio );
              renderer.setSize( window.innerWidth, window.innerHeight );
              renderer.shadowMap.enabled = true;

              textureLoader = new THREE.TextureLoader();

              var ambientLight = new THREE.AmbientLight( 0x404040 );
              scene.add( ambientLight );

              var light = new THREE.DirectionalLight( 0xffffff, 1 );
              light.position.set( -10, 10, 5 );
              light.castShadow = true;
              var d = 20;
              light.shadowCameraLeft = -d;
              light.shadowCameraRight = d;
              light.shadowCameraTop = d;
              light.shadowCameraBottom = -d;

              light.shadowCameraNear = 2;
              light.shadowCameraFar = 50;

              light.shadowMapWidth = 1024;
              light.shadowMapHeight = 1024;

              light.shadowDarkness = 0.65;
              scene.add( light );


              container.innerHTML = "";

              container.appendChild( renderer.domElement );

              stats = new Stats();
              stats.domElement.style.position = 'absolute';
              stats.domElement.style.top = '0px';
              container.appendChild( stats.domElement );

              //

              window.addEventListener( 'resize', onWindowResize, false );

        }

        function initPhysics() {
              // Physics configuratio
              collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
              dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
              broadphase = new Ammo.btDbvtBroadphase();
              solver = new Ammo.btSequentialImpulseConstraintSolver();
              softBodySolver = new Ammo.btDefaultSoftBodySolver();
              physicsWorld = new Ammo.btSoftRigidDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration, softBodySolver);
              physicsWorld.setGravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );
              physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );

           }

        function processGeometry( bufGeometry ) {

            // Obtain a Geometry
            var geometry = new THREE.Geometry().fromBufferGeometry( bufGeometry );

            // Merge the vertices so the triangle soup is converted to indexed triangles
            var vertsDiff = geometry.mergeVertices();

            // Convert again to BufferGeometry, indexed
            var indexedBufferGeom = createIndexedBufferGeometryFromGeometry( geometry );

            // Create index arrays mapping the indexed vertices to bufGeometry vertices
            mapIndices( bufGeometry, indexedBufferGeom );

        }

        function createObjects() {

            // Ground
            pos.set( 0, - 0.5, 0 );
            quat.set( 0, 0, 0, 1 );
            var ground = createParalellepiped( 40, 1, 40, 0, pos, quat, new THREE.MeshPhongMaterial( { color: 0xFFFFFF } ) );
            ground.castShadow = true;
            ground.receiveShadow = true;
            textureLoader.load( "../textures/grid.png", function( texture ) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set( 40, 40 );
            ground.material.map = texture;
            ground.material.needsUpdate = true;
            } );


            // Create soft volumes
            var volumeMass = 15;

            /*var sphereGeometry = new THREE.SphereBufferGeometry( 1.5, 40, 25 );
            sphereGeometry.translate( 5, 5, 0 );
            createSoftVolume( sphereGeometry, volumeMass, 250 );

            var boxGeometry = new THREE.BufferGeometry().fromGeometry( new THREE.BoxGeometry( 1, 1, 5, 4, 4, 20 ) );
            boxGeometry.translate( -2, 5, 0 );
            createSoftVolume( boxGeometry, volumeMass, 120 );

            var aa = new THREE.BufferGeometry().fromGeometry( new THREE.CylinderGeometry( 2, 2, 5, 64, 10 ) );
            aa.translate( 8, 5, 8 );
            createSoftVolume( aa, volumeMass, 250 );*/

            //loading models
            loader = new THREE.JSONLoader();
            loader.load('modelos/gau.json', handle_loader);
            function handle_loader(geometry, materials) {
             mesh1 = new THREE.Mesh(geometry, materials);
             var gallbladder = new THREE.BufferGeometry().fromGeometry(geometry);
             gallbladder.scale(1,1,1);
             gallbladder.translate( -5, 2, -8 );
             var vec = new THREE.Vector3(-5, 2, -8);
             gall = createSoftVolume( gallbladder, 15, 250 );
             //gall.appendLinearJoint(new THREE.Vector3( -5, 2, -8 ));

           }


            // rigidBodies
            pos.set( 3, 1, 0 );
            quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), 30 * Math.PI / 180 );
            var obstacle = createParalellepiped( 10, 1, 4, 0, pos, quat, new THREE.MeshPhongMaterial( { color: 0x606060 } ) );
            obstacle.castShadow = true;
            obstacle.receiveShadow = true;

            poss.set( -0.5, 1, 0 );
            quat1.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 1);

            var c = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1, 1, 1, 1 ), new THREE.MeshPhongMaterial( { color: 0x606060 } ) );
            c.castShadow = true;
            c.receiveShadow = true;
            var s = new Ammo.btBoxShape( new Ammo.btVector3( 1 * 0.5, 1 * 0.5, 1 * 0.5 ) );
            s.setMargin( margin );
            this.caixa = createRigidBody( c, s, 1, poss, quat1 );


            poss.set( -5, 2, -8);
            var b = new THREE.Mesh( new THREE.BoxGeometry( 0.1, 0.1, 0.1, 1, 1, 1 ), new THREE.MeshPhongMaterial( { color: 0x606060 } ) );
            var s = new Ammo.btBoxShape( new Ammo.btVector3( 0.1 * 0.5, 0.1 * 0.5, 0.1 * 0.5 ) );
            s.setMargin( margin );
            this.a = createRigidBody( b, s, 0, poss, quat1 );
            a.setLinearFactor(0,0,0)

        }
        function ancoras(){



          /*
          ls = new(btAlignedAlloc(sizeof(LJoint),16)) LJoint();
          ls.cfm = 1;
          ls.erp = 1;
          ls.position = new Ammo.btVector3( -5, 2, -8 );
          gall.appendLinearJoint(ls,a);*/

/*
          for(i = 0; i < 5; i++){

            gall.appendAnchor(i, a, true, 0);
          }*/

        }

        function createIndexedBufferGeometryFromGeometry( geometry ) {

            var numVertices = geometry.vertices.length;
            var numFaces = geometry.faces.length;

            var bufferGeom = new THREE.BufferGeometry();
            var vertices = new Float32Array( numVertices * 3 );
            var indices = new ( numFaces * 3 > 65535 ? Uint32Array : Uint16Array )( numFaces * 3 );

            for ( var i = 0; i < numVertices; i++ ) {

                var p = geometry.vertices[ i ];

                var i3 = i * 3;

                vertices[ i3 ] = p.x;
                vertices[ i3 + 1 ] = p.y;
                vertices[ i3 + 2 ] = p.z;

            }

            for ( var i = 0; i < numFaces; i++ ) {

                var f = geometry.faces[ i ];

                var i3 = i * 3;

                indices[ i3 ] = f.a;
                indices[ i3 + 1 ] = f.b;
                indices[ i3 + 2 ] = f.c;

            }

            bufferGeom.setIndex( new THREE.BufferAttribute( indices, 1 ) );
            bufferGeom.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

            return bufferGeom;
        }

        function isEqual( x1, y1, z1, x2, y2, z2 ) {
            var delta = 0.000001;
            return Math.abs( x2 - x1 ) < delta &&
                    Math.abs( y2 - y1 ) < delta &&
                    Math.abs( z2 - z1 ) < delta;
        }

        function mapIndices( bufGeometry, indexedBufferGeom ) {

            // Creates ammoVertices, ammoIndices and ammoIndexAssociation in bufGeometry

            var vertices = bufGeometry.attributes.position.array;
            var idxVertices = indexedBufferGeom.attributes.position.array;
            var indices = indexedBufferGeom.index.array;

            var numIdxVertices = idxVertices.length / 3;
            var numVertices = vertices.length / 3;

            bufGeometry.ammoVertices = idxVertices;
            bufGeometry.ammoIndices = indices;
            bufGeometry.ammoIndexAssociation = [];

            for ( var i = 0; i < numIdxVertices; i++ ) {

                var association = [];
                bufGeometry.ammoIndexAssociation.push( association );

                var i3 = i * 3;

                for ( var j = 0; j < numVertices; j++ ) {
                    var j3 = j * 3;
                    if ( isEqual( idxVertices[ i3 ], idxVertices[ i3 + 1 ],  idxVertices[ i3 + 2 ],
                                  vertices[ j3 ], vertices[ j3 + 1 ], vertices[ j3 + 2 ] ) ) {
                        association.push( j3 );
                    }
                }

            }

        }

        function createSoftVolume( bufferGeom, mass, pressure ) {

            processGeometry( bufferGeom );

            var volume = new THREE.Mesh( bufferGeom, new THREE.MeshPhongMaterial( { color: 0xFFFFFF } ) );
            volume.castShadow = true;
            volume.receiveShadow = true;
            volume.frustumCulled = false;
            scene.add( volume );

            textureLoader.load( "../textures/colors.png", function( texture ) {
                volume.material.map = texture;
                volume.material.needsUpdate = true;
            } );

            // Volume physic object

            var volumeSoftBody = softBodyHelpers.CreateFromTriMesh(
                physicsWorld.getWorldInfo(),
                bufferGeom.ammoVertices,
                bufferGeom.ammoIndices,
                bufferGeom.ammoIndices.length / 3,
                true );

            var sbConfig = volumeSoftBody.get_m_cfg();
            sbConfig.set_viterations( 40 );
            sbConfig.set_piterations( 40 );

            // Soft-soft and soft-rigid collisions
            sbConfig.set_collisions( 0x11 );

            // Friction
            sbConfig.set_kDF( 0.1 );
            // Damping
            sbConfig.set_kDP( 0.01 );
            // Pressure
            sbConfig.set_kPR( pressure );
            // Stiffness
            volumeSoftBody.get_m_materials().at( 0 ).set_m_kLST( 0.9 );
            volumeSoftBody.get_m_materials().at( 0 ).set_m_kAST( 0.9 );

            volumeSoftBody.setTotalMass( mass, false )
            Ammo.castObject( volumeSoftBody, Ammo.btCollisionObject ).getCollisionShape().setMargin( margin );
            physicsWorld.addSoftBody( volumeSoftBody, 1, -1 );
            volume.userData.physicsBody = volumeSoftBody;
            // Disable deactivation
            volumeSoftBody.setActivationState( 4 );

            softBodies.push( volume );

        }

        function createParalellepiped( sx, sy, sz, mass, pos, quat, material ) {

                var threeObject = new THREE.Mesh( new THREE.BoxGeometry( sx, sy, sz, 1, 1, 1 ), material );
                var shape = new Ammo.btBoxShape( new Ammo.btVector3( sx * 0.5, sy * 0.5, sz * 0.5 ) );
                shape.setMargin( margin );

                createRigidBody( threeObject, shape, mass, pos, quat );

                return threeObject;

        }

        function createRigidBody( threeObject, physicsShape, mass, pos, quat ) {

                threeObject.position.copy( pos );
                threeObject.quaternion.copy( quat );

          var transform = new Ammo.btTransform();
            transform.setIdentity();
            transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
            transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
          var motionState = new Ammo.btDefaultMotionState( transform );

          var localInertia = new Ammo.btVector3( 0, 0, 0 );
            physicsShape.calculateLocalInertia( mass, localInertia );

            var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia );
            var body = new Ammo.btRigidBody( rbInfo );

          threeObject.userData.physicsBody = body;

          scene.add( threeObject );

          if ( mass > 0 ) {
            rigidBodies.push( threeObject );

            // Disable deactivation
            body.setActivationState( 4 );
          }

          physicsWorld.addRigidBody( body );

                  return body;
        }

        function initInput() {

            window.addEventListener( 'mousedown', function( event ) {

                if ( ! clickRequest ) {

                    mouseCoords.set(
                        ( event.clientX / window.innerWidth ) * 2 - 1,
                        - ( event.clientY / window.innerHeight ) * 2 + 1
                    );

                    clickRequest = true;

                }

            }, false );

        }

        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth, window.innerHeight );

        }

        function onDocumentMouseMove( event ){

            // the following line would stop any other event handler from firing
            // (such as the mouse's TrackballControls)
            // event.preventDefault();

            // update the mouse variable
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            vector.unproject( camera );
            var dir = vector.sub( camera.position ).normalize();
            var distance = - camera.position.z / dir.z;
            this.ps = camera.position.clone().add( dir.multiplyScalar( distance ) );


            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            var mox = movementX *0.05;
            var moy = movementY *0.05;
            caixa.activate(true);
            caixa.setLinearVelocity(new Ammo.btVector3(ps /*mox, moy, 0.0*/) );
          }

        function animate() {

            requestAnimationFrame( animate );





            render();








            stats.update();

        }

        function render() {

          var deltaTime = clock.getDelta();

          updatePhysics( deltaTime );






            controls.update( deltaTime );

            renderer.render( scene, camera );

          }

        function updatePhysics( deltaTime ) {
          softBodies[0].appendAnchor( 0, a.userData.physicsBody, false, 0);


            if(keyboard[87]){//w
              caixa.activate(true);
              caixa.applyCentralImpulse( new Ammo.btVector3( 0.5, 0.0, 0.0) );

            }
            if(keyboard[83]){//s
              caixa.activate(true);
              caixa.applyCentralImpulse( new Ammo.btVector3( -0.5, 0.0, 0.0) );

            }
            if(keyboard[65]){//a
              caixa.activate(true);
              caixa.applyCentralImpulse( new Ammo.btVector3( 0.0, 0.0, -0.5) );

            }
            if(keyboard[68]){//d
              caixa.activate(true);
              caixa.applyCentralImpulse( new Ammo.btVector3( 0.0, 0.0, 0.5) );
            }

            time++;
              // Step world
              physicsWorld.stepSimulation( deltaTime, 10 );

              // Update soft volumes
              for ( var i = 0, il = softBodies.length; i < il; i++ ) {
                  var volume = softBodies[ i ];
                  var geometry = volume.geometry;
                  var softBody = volume.userData.physicsBody;
                  var volumePositions = geometry.attributes.position.array;
                  var volumeNormals = geometry.attributes.normal.array;
                  var association = geometry.ammoIndexAssociation;
                  var numVerts = association.length;
                  var nodes = softBody.get_m_nodes();
                  for ( var j = 0; j < numVerts; j ++ ) {

                      var node = nodes.at( j );
                      var nodePos = node.get_m_x();
                      var x = nodePos.x();
                      var y = nodePos.y();
                      var z = nodePos.z();
                      var nodeNormal = node.get_m_n();
                      var nx = nodeNormal.x();
                      var ny = nodeNormal.y();
                      var nz = nodeNormal.z();

                      var assocVertex = association[ j ];

                      for ( var k = 0, kl = assocVertex.length; k < kl; k++ ) {
                          var indexVertex = assocVertex[ k ];
                          volumePositions[ indexVertex ] = x;
                          volumeNormals[ indexVertex ] = nx;
                          indexVertex++;
                          volumePositions[ indexVertex ] = y;
                          volumeNormals[ indexVertex ] = ny;
                          indexVertex++;
                          volumePositions[ indexVertex ] = z;
                          volumeNormals[ indexVertex ] = nz;
                      }
                  }

                  geometry.attributes.position.needsUpdate = true;
                  geometry.attributes.normal.needsUpdate = true;

              }

              // Update rigid bodies



              for ( var i = 0, il = rigidBodies.length; i < il; i++ ) {

                var objThree = rigidBodies[ i ];
                var objPhys = objThree.userData.physicsBody;
              var ms = objPhys.getMotionState();

              if ( ms ) {
                  ms.getWorldTransform( transformAux1 );
                 var p = transformAux1.getOrigin();
                 var q = transformAux1.getRotation();


               objThree.position.set( p.x(), p.y(), p.z() );
               objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );




                }
              }

        }

        function keyDown() {
          keyboard[event.keyCode] = true;
        }

        function keyUp() {
          keyboard[event.keyCode] = false;
        }


        window.addEventListener('keydown', keyDown);
        window.addEventListener('keyup', keyUp);


  });
