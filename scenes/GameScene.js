var gameConf = {
	key: "Game",
	physics: {
        default: 'arcade',
        arcade: { debug: true }
    }
}

//this is our steering agent
var boid;

//we use this to draw lines on the screen
var debug;

var GameScene = new Phaser.Scene(gameConf);

//called before the scene is loaded
GameScene.preload = function() {}

//called as soon as the scene is created
GameScene.create = function() {
	debug = this.add.graphics();
	boid = this.physics.add.image(centerX, centerY, "img_boid");
}

//called every frame, time is the time when the update method was called, and delta is the time in milliseconds since last frame
GameScene.update = function(time, delta) {

	//draw debug lines to our pointer
	var pointer = this.input.activePointer;

	//let's store the coordinates of the pointer in a Vector2
    var target = new Phaser.Math.Vector2(pointer.x, pointer.y);

	//draw a horizontal and a vertical line to identify where the cursor is
	debug.clear().lineStyle(1, 0x00ff00);
    debug.lineBetween(0, target.y, 800, target.y);
    debug.lineBetween(target.x, 0, target.x, 600);

    //change the behavior based on the distance from the target
    if (target.distance(boid.body) > 50)
	    seek(boid.body, target, 50, 0.5);
	else
	    flee(boid.body, target, 150, 1);

}

function seek(pVehicle, pTarget, MAX_SPEED, MAX_STEER){
	//this variable will store information about our desired velocity vector
    var vecDesired = new Phaser.Math.Vector2();

    // 1. vector(desired velocity) = (target position) - (vehicle position) 
    vecDesired = pTarget.subtract(pVehicle.center);
    
    // 2. normalize vector(desired velocity)
    vecDesired.normalize();
    
    // 3. scale vector(desired velocity) to maximum speed
    vecDesired.scale(MAX_SPEED);
    
    // 4. vector(steering force) = vector(desired velocity) - vector(current velocity)
    var vecSteer = vecDesired.subtract(pVehicle.velocity);
    
    // 5. limit the magnitude of vector(steering force) to maximum force
    if (vecSteer.length() > MAX_STEER){
      vecSteer = vecSteer.normalize();
      vecSteer.scale(MAX_STEER);
    }
    
    // 6. vector(new velocity) = vector(current velocity) + vector(steering force)
    pVehicle.velocity.add(vecSteer);
    
    // 7. limit the magnitude of vector(new velocity) to maximum speed
    pVehicle.setMaxSpeed(MAX_SPEED);
    
    // 8. update vehicle rotation according to the angle of the vehicle velocity
    //we use RadToDeg as the angle of the vector is returned in Radians instead of Degrees
    pVehicle.gameObject.angle = Phaser.Math.RadToDeg(pVehicle.velocity.angle());
}

function flee(pVehicle, pTarget, MAX_SPEED, MAX_STEER) {
	var vecDesired;

    vecDesired = pTarget.subtract(pVehicle.center);
    vecDesired.normalize();
    vecDesired.scale(MAX_SPEED);
    var vecSteer = vecDesired.subtract(pVehicle.velocity);
    if (vecSteer.length() > MAX_STEER){
      vecSteer = vecSteer.normalize();
      vecSteer.scale(MAX_STEER);
    }

    //the only difference between seek and flee!
    pVehicle.velocity.subtract(vecSteer);

    pVehicle.setMaxSpeed(MAX_SPEED);
    pVehicle.gameObject.angle = Phaser.Math.RadToDeg(pVehicle.velocity.angle());
}