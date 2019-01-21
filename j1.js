var scene, camera, geometry, material, renderer, cube, group, parte1, parte2, parte3;
var i, time = 50;
var controls;
var group;
var mouse = { x: 0, y: 0, z: 0 };
var lista1 = [];
var lista2 = [];
var lista3 = [];
var coord, coord2;
var pinca;
var controller;
var previousFrame;
var hand;
var position1;
var movement;
var finger;
var f;
var tool1, tool2, action;
var part1posx, part1posy, part1posz;
var pontaposx;
var rotation1x, rotation1y, rotation1z;
var rotation2x, rotation2y, rotation2z;
var rotation3x, rotation3y, rotation3z;
var corteparte1 = 0, corteparte2 = 0, corteparte3 = 0;
var pegou = 0;
var p;
var clipe1 = 0;
var clipe2 = 0;
var clipes = 0;
var quantidade = 5;
var sangue1, sangue2, sangue3;
function init(){
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
document.body.appendChild( renderer.domElement );
//1.4741888702208916, y: 0.7572367496754882, z: 0.6223630532363377
//x: 0.5224873937307228, _y: -0.5066923406948488, _z: 0.2846072645031335




camera.position.z = 3;


var AmbientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(AmbientLight);



	var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
	scene.add( light );



  loader = new THREE.JSONLoader();
  loader.load('gallbladder.json', handle_loader);
  function handle_loader(geometry, materials) {
   gallbladder = new THREE.Mesh(geometry, materials);

    scene.add(gallbladder);
  }

	loader2 = new THREE.JSONLoader();
  loader2.load('liver.json', handle_loader2);
  function handle_loader2(geometry2, materials2) {
   liver = new THREE.Mesh(geometry2, materials2);

    scene.add(liver);
  }

	loader3 = new THREE.JSONLoader();
  loader3.load('liga.json', handle_loader3);
  function handle_loader3(geometry3, materials3) {
   liga = new THREE.Mesh(geometry3, materials3);

    scene.add(liga);
  }
	loader4 = new THREE.JSONLoader();
  loader4.load('stomach.json', handle_loader4);
  function handle_loader4(geometry4, materials4) {
   stomach= new THREE.Mesh(geometry4, materials4);

    scene.add(stomach);
  }

	loader5 = new THREE.JSONLoader();
  loader5.load('pancreas.json', handle_loader5);
  function handle_loader5(geometry5, materials5) {
   pancreas= new THREE.Mesh(geometry5, materials5);

    scene.add(pancreas);
  }


	 parte1 = new THREE.Mesh(
		new THREE.CylinderGeometry( 0.08, 0.08, 0.2, 32 ),
		new THREE.MeshBasicMaterial( {color: 0xffff00} ));
	scene.add( parte1 );
	parte1.rotation.z = Math.PI/2 + 0.25;
	parte1.position.x = -1.3;
	parte1.position.y = 1.45;
	parte1.position.z = -0.01;
	parte1.material.color.setRGB( 0.585, 0.800, 0.321 );
	lista1.push(parte1);

	part1posx = parte1.position.x;
	part1posy = parte1.position.y;
	part1posz = parte1.position.z;
	rotation1x = parte1.rotation.x;
	rotation1y = parte1.rotation.y;
  rotation1z = parte1.rotation.z;

	parte2 = new THREE.Mesh(
		new THREE.CylinderGeometry( 0.08, 0.08, 0.48, 32 ),
		new THREE.MeshBasicMaterial( {color: 0xffff00} ));
	scene.add( parte2 );
	parte2.rotation.z = Math.PI/2 + 0.25;
	parte2.position.x = -0.97;
	parte2.position.y = 1.53;
	parte2.position.z = -0.01;
	parte2.material.color.setRGB( 0.585, 0.200, 0.321 );
	lista2.push(parte2);

	part2posx = parte2.position.x;
	part2posy = parte2.position.y;
	part2posz = parte2.position.z;
	rotation2x = parte2.rotation.x;
	rotation2y = parte2.rotation.y;
  rotation2z = parte2.rotation.z;

	parte3 = new THREE.Mesh(
		new THREE.CylinderGeometry( 0.08, 0.08, 0.2, 32 ),
		new THREE.MeshBasicMaterial( {color: 0xffff00} ));
	scene.add( parte3 );
	parte3.rotation.z = Math.PI/2 + 0.25;
	parte3.position.x = -0.65;
	parte3.position.y = 1.62;
	parte3.position.z = -0.01;
	parte3.material.color.setRGB( 0.585, 0.800, 0.321 );
	lista3.push(parte3);

	part3posx = parte3.position.x;
	part3posy = parte3.position.y;
	part3posz = parte3.position.z;
	rotation3x = parte3.rotation.x;
	rotation3y = parte3.rotation.y;
  rotation3z = parte3.rotation.z;

 group = new THREE.Object3D();


controlador = new THREE.Mesh(
	new THREE.CylinderGeometry( 0.05, 0.08, 0.5, 32, 3 ),
	new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe:true} ));
	scene.add(controlador);

lista1.push(controlador);
lista2.push(controlador);
lista3.push(controlador);
controlador.position.set(0, 0, 3);

ponta = new THREE.Mesh(
	new THREE.BoxGeometry( 0.02, 0.02, 0.02),
	new THREE.MeshBasicMaterial( { color: "rgb(	182,	49,	62)" , wireframe:true} ));
scene.add(ponta);
ponta.position.set(0,0.26,3);

scene.add(group);
corpo = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshBasicMaterial( {color: 0xffff00} ));
scene.add( corpo );
corpo.position.z = -1;
corpo.material.color.set("rgb(255,145,145)");


controls = new THREE.TrackballControls( camera );
document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}



function onDocumentMouseMove( event )
{
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
	var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

}


controller = Leap.loop(function(frame) {
	pontaposx = ponta.position.x;
	p = controlador.position;
	controls.update();





	if(frame.valid){

if(frame.pointables.length == 5){
		for(var h = 0; h < frame.hands.length; h++){
    var hand = frame.hands[h];
}

			var extendedFingers = 0;
    for(var f = 0; f < hand.fingers.length; f++){
        var finger = hand.fingers[f];
        if(finger.extended) extendedFingers++;
}
}
			if(extendedFingers == 2 ){
				previousFrame = controller.frame(1);
				movement = hand.translation(previousFrame);
				pitchRadians = hand.pitch();
				yawRadians = hand.yaw();
				position1 = hand.palmPosition;


				controlador.position.x = position1[0]/100;

				if(position1[1] > 60 && position1[1] < 240){
					var b = ((position1[1]-150)/1.8)/10;
					controlador.position.y = b;

				}
				if(position1[2] > -120 && position1[2] < 50){
					var c = ((position1[2]-(-85))/1.8)/10;
					controlador.position.z = c;
				}
				console.log("2 dedos");
				if(pegou == 1){
					parte2.position.copy(controlador.position);
					tool2 = 1;
					document.getElementById('tool').innerHTML = "pinça";
				}

				controlador.rotation.x = pitchRadians;
				controlador.rotation.y = yawRadians;
				ponta.position.copy(controlador.position);
				ponta.rotation.copy(controlador.rotation);
				/*if(pitchRadians > 0.5){
				controlador.rotation.x -= Math.PI * 0.002;
			}else if (pitchRadians < -0.5) {
				controlador.rotation.x = Math.PI * 0.002;
			}*/
				action = 0;
			}else if(extendedFingers == 1 ){
				console.log("1 dedo");
				action = 1;

			}else if(extendedFingers== 3 ){
					tool1=0;
					tool2 = 1;
					document.getElementById('tool').innerHTML = "pinça";
					console.log("3 dedos");
			}else if(extendedFingers == 5 ){
				if(pegou == 1){
					tool1=0;
					tool2 = 1;
					document.getElementById('tool').innerHTML = "pinça";
				}else{
					tool2 = 0;
					tool1 = 1;
					document.getElementById('tool').innerHTML = "tesoura";
					console.log("5 dedos");
				}
			}

	}

	var originPoint =	controlador.position.clone();


	for (var vertexIndex = 0; vertexIndex < controlador.geometry.vertices.length; vertexIndex++)
	{
		var localVertex = controlador.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4(controlador.matrix );
		var directionVector = globalVertex.sub( controlador.position );

		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );








    var colisao = ray.intersectObjects(lista1);
		var colisao1 = ray.intersectObjects(lista2);
		var colisao2 = ray.intersectObjects(lista3);

		if(colisao.length > 0 && colisao[0].distance < directionVector.length()){

		if(action == 1){
			if(tool1 == 1){
				acaotesoura('1');

			}else if(tool2 == 1){
				acaopinca('1');
			}
		}}

		if(colisao1.length > 0 && colisao1[0].distance < directionVector.length()){
		if(action == 1){
			if(tool1 == 1){
				acaotesoura('2');
			}else if(tool2 == 1){
				acaopinca('2');
			}
		}}

		if(colisao2.length > 0 && colisao2[0].distance < directionVector.length()){
		if(action == 1){
			if(tool1 == 1){
			acaotesoura('3');
			}else if(tool2 == 1){
				acaopinca('3');
			}
		}}


  }




	renderer.render(scene, camera);
});

function acaotesoura(n){
	if(n == 1){
		if(corteparte1 == 0){
		corteparte1 = 1;
		setInterval(sangramento, 900);
	}	else if (corteparte1 == 1) {
		corteparte1 = 2;
		}
	} else if(n == 2){
		if(corteparte2 == 0){
		corteparte2 = 1;
		//setInterval(sangramento, 900);
	}	else if (corteparte2 == 1) {
		corteparte2 = 2;
		console.log("segundo corte na parte2");
		}
	} else if(n == 3){
		if(corteparte3 == 0){
		corteparte3 = 1;
		//setInterval(sangramento, 900);
	}	else if (corteparte3 == 1) {
		corteparte3 = 2;
		console.log("segundo corte na parte3");
		}
	}

}
function acaopinca(m){
	if(m == 1){

		clip = new THREE.Mesh( new THREE.CylinderGeometry( 0.085, 0.085, 0.05, 32 ),
		new THREE.MeshBasicMaterial( { color: "rgb(		116,	113,	113)" } ));
		clip.translateX(part1posx);
		clip.translateY(part1posy);
		clip.translateZ(part1posz);
		clip.rotateX(rotation1x);
		clip.rotateY(rotation1y);
		clip.rotateZ(rotation1z);
		scene.add(clip);
		clipe1++;
	} else if(m == 2){
		if(corteparte2 == 2){
			if(tool2 == 1){
				pegou = 1;
				console.log("pegou");
				if(clipe1 == 0){
					setInterval(sangramentolateral, 900);
				}
			}
		}else{
		clip2 = new THREE.Mesh( new THREE.CylinderGeometry( 0.085, 0.085, 0.05, 32 ),
		new THREE.MeshBasicMaterial( { color: "rgb(	116,	113,	113)" } ));
		clip2.translateX(part2posx);
		clip2.translateY(part2posy);
		clip2.translateZ(part2posz);
		clip2.rotateX(rotation2x);
		clip2.rotateY(rotation2y);
		clip2.rotateZ(rotation2z);
		scene.add(clip2);

	}
	} else if(m == 3){
		clip3 = new THREE.Mesh( new THREE.CylinderGeometry( 0.085, 0.085, 0.05, 32 ),
		new THREE.MeshBasicMaterial( { color: "rgb( 116,	113,	113)" } ));
		clip3.translateX(part3posx);
		clip3.translateY(part3posy);
		clip3.translateZ(part3posz);
		clip3.rotateX(rotation2x);
		clip3.rotateY(rotation2y);
		clip3.rotateZ(rotation2z);
		scene.add(clip3);
		clipe2++;

	}
}

function sangramento(){


		sangue = new THREE.Mesh(
		new THREE.BoxGeometry( 0.02, 0.02, 0.02),
		new THREE.MeshBasicMaterial( { color: "rgb(	138,7,7)" } ));

		var r = Math.floor((Math.random() * 10) + 1);
		if(r <= 5){
		}else {
			sangue.material.color.setRGB( 0.585, 0.800, 0.321 );
		}
		scene.add(sangue);
		sangue.position.copy(parte1.position);

	var times = setInterval(caindo, 3);

}

function caindo(){
		sangue.position.z = sangue.position.z - 0.001;
 		if(sangue.position.z <= corpo.position.z){
 			scene.remove(sangue);
}
}

function sangramentolateral() {

		sanguelateral = new THREE.Mesh(
		new THREE.BoxGeometry( 0.02, 0.02, 0.02),
		new THREE.MeshBasicMaterial( { color: "rgb(	138,7,7)" } ));

		var r = Math.floor((Math.random() * 10) + 1);
		if(r <= 5){
		}else {
			sanguelateral.material.color.setRGB( 0.585, 0.800, 0.321 );
		}
		scene.add(sanguelateral);
		sanguelateral.position.copy(parte1.position);
		sanguelateral.rotation.copy(parte1.rotation);
	var timesa = setInterval(caindolateral, 3);
}
function caindolateral(){
	sanguelateral.position.x = sanguelateral.position.x + 0.001;

}
window.onload = init;
