let video;
let poseNet;
let noseX = 0, noseY = 0;

let mouth;
let center, leftEye, rightEye;
let nose;

var recordingState = 0;
var mic, recorder, soundFile;
var startRecordingAtFrame = 0;

function preload(){

}

function setup() {
	createCanvas(640, 480);
	video = createCapture(VIDEO);
	video.hide();
	poseNet = ml5.poseNet(video, modelReady);
	poseNet.on('pose', gotPoses);

	center = createVector(0,0);
	leftEye = createVector(0,0);
	rightEye = createVector(0,0);
	mouth = createVector(0,0);


	// Sound recording stuff
	mic = new p5.AudioIn();

	//getAudioContext().resume()
	mic.start();
	//recorder = new p5.SoundRecorder();
	//recorder.setInput(mic)
	//soundFile = new p5.SoundFile();
}

function gotPoses(poses) {

	if (poses.length > 0){
		let newX = poses[0].pose.keypoints[0].position.x
		let newY = poses[0].pose.keypoints[0].position.y

		noseX = lerp(noseX, newX, 0.5);
		noseY = lerp(noseY, newY, 0.5);
		nose = createVector(noseX, noseY);

		leftEye = createVector(poses[0].pose.keypoints[1].position.x, poses[0].pose.keypoints[1].position.y)
		rightEye = createVector(poses[0].pose.keypoints[2].position.x, poses[0].pose.keypoints[2].position.y)

	  center = p5.Vector.sub(leftEye, rightEye).mult(0.5);
		center.x = (center.x + rightEye.x);
		center.y = (center.y + rightEye.y);

		mouth = p5.Vector.sub(nose, center).mult(1.5);
		mouth.x = (mouth.x + nose.x);
		mouth.y = (mouth.y + nose.y);

 }
}

function modelReady() {
	console.log("model ready");
}

function draw() {

	image(video, 0, 0);
	filter(THRESHOLD);


  // Print face keypoints from pose estimation
	fill(255, 0, 0);
	ellipse(noseX, noseY, 20);

	fill(0,0,200);
	ellipse(mouth.x, mouth.y, 20);
	fill(0,200,0);
	ellipse(leftEye.x, leftEye.y, 20);
	ellipse(rightEye.x, rightEye.y, 20);


	// Print Sound Waves if being recorded


}

function mousePressed(){

	if (recordingState==0 && mic.enabled) {

		recorder.record(soundFile);
		console.log('Recording now! Click to stop.');
		startRecordingAtFrame = frameCount

		recordingState = 1;
	}
	else if (recordingState == 1) {
		recorder.stop();
	  console.log('Recording Stopped! Click will over-write recording and start recording again.');
		saveSound(soundFile, 'mySound.wav');

		recordingState = 0;
	}
}


function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}
