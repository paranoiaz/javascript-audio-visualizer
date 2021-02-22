var songAudio;
var inputGetAudio;
var audioFFT;
var audioAMP;
var outerCircleRadius;
var innerCircleRadius;
var statusText = "JavaScript audio visualizer developed by github.com/paranoiaz";

function setup() {
    createCanvas(700, 700);
    angleMode(DEGREES);
    audioFFT = new p5.FFT(0.6, 256);
    audioAMP = new p5.Amplitude(0.6);
    outerCircleRadius = 300;
    innerCircleRadius = outerCircleRadius/2;
    inputGetAudio = document.getElementById("song");
    inputGetAudio.addEventListener("input", loadAudio);
}

function draw() {
    colorMode(RGB);
    background("#23241e");

    noStroke();
    fill(0);
    circle(width / 2, height / 2, outerCircleRadius);

    stroke(255);
    strokeWeight(10);
    circle(width / 2, height / 2, innerCircleRadius);

    translate(width / 2, height / 2);
    var spectrum = audioFFT.analyze();
    colorMode(HSB);

    for (var i = 0; i < spectrum.length; i++) {
        // kept in mind scaling feature with change of outerCircleRadius value
        let fftValue = spectrum[i];
        let ampValue = audioAMP.getLevel();
        let angle = map(i, 0, spectrum.length, 0, 360);

        let radius = map(fftValue, 0, 256, outerCircleRadius/2, outerCircleRadius);
        let startingX = outerCircleRadius/2 * cos(angle);
        let startingY = outerCircleRadius/2 * sin(angle);
        let endingX = radius * cos(angle);
        let endingY = radius * sin(angle);
        
        innerCircleRadius = map(ampValue, 0, 1, outerCircleRadius - 50, outerCircleRadius + 25);
        stroke(i, 255, 255);
        strokeWeight(4);
        line(startingX, startingY, endingX, endingY);
    }
}

async function loadAudio() {
    inputGetAudio.style.visibility = "hidden";
    songAudio = loadSound(inputGetAudio.files[0]);
    document.getElementById("statusText").innerText = statusText + "\nWaiting on audio to get loaded."
    for (var x = 0; x < 5; x++) {
        // takes a moment for the soundfile object to load
        await asyncSleep(1);
        if (songAudio.isLoaded()) {
            songAudio.play();
            document.getElementById("statusText").innerText = statusText + `\nStarted playing ${inputGetAudio.files[0].name}`;
            return;
        }
    }
    console.log("Invalid file type or took too long to load.")
    document.getElementById("statusText").innerText = statusText + "\nInvalid file type or took too long to load."
}

function asyncSleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }