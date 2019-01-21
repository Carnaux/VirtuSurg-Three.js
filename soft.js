Ammo().then(function(Ammo) {


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
            var quat = new THREE.Quaternion();

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

			// - Main code -

            init();
            animate();


            // - Functions -

      function init() {

				initGraphics();

				initPhysics();

				createObjects();



            }

      function initGraphics(){
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.BasicShadowMap;
        document.body.appendChild( renderer.domElement );

        var AmbientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(AmbientLight);
      }



			function initPhysics() {

				// Physics configuration

				collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
				dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
				broadphase = new Ammo.btDbvtBroadphase();
				solver = new Ammo.btSequentialImpulseConstraintSolver();
				softBodySolver = new Ammo.btDefaultSoftBodySolver();
				physicsWorld = new Ammo.btSoftRigidDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration, softBodySolver);
				physicsWorld.setGravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );
				physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );

            }

            function createObjects() {



                // Create soft volumes
                var volumeMass = 15;

                var sphereGeometry = new THREE.SphereBufferGeometry( 1.5, 40, 25 );
                sphereGeometry.translate( 5, 5, 0 );
                createSoftVolume( sphereGeometry, volumeMass, 250 );

                var boxGeometry = new THREE.BufferGeometry().fromGeometry( new THREE.BoxGeometry( 1, 1, 5, 4, 4, 20 ) );
                boxGeometry.translate( -2, 5, 0 );
                createSoftVolume( boxGeometry, volumeMass, 120 );

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



            function animate(){


            	var deltaTime = clock.getDelta();

            	updatePhysics( deltaTime );

            	processClick();

                controls.update( deltaTime );

                renderer.render( scene, camera );
}


            function updatePhysics( deltaTime ) {

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

		});
