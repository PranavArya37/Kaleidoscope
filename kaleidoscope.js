// p5.js Kaleidoscope Sketch

// --- Configuration ---
let symmetry = 8; // Number of reflection segments (try changing this!)
let strokeColorChangeSpeed = 0.5; // How fast the hue cycles (0-1, lower is slower)
let enableMirroring = true; // Set to false to disable the mirrored drawing within segments
let enableFadingTrails = true; // Set to false for a solid background
let fadeAlpha = 20; // Background alpha for trails (lower = longer trails, 0-255)
let minStrokeWeight = 1;
let maxStrokeWeight = 10;
let speedToWeightFactor = 25; // Higher means speed affects weight more

// --- Global Variables ---
let angle; // Angle between symmetry segments
let currentHue = 0; // Starting hue for cycling color
let saveButton;

function setup() {
  // Create canvas filling the window
  createCanvas(windowWidth, windowHeight);

  // Set angle mode to RADIANS for rotation calculations
  angleMode(RADIANS);

  // Use HSB color mode (Hue, Saturation, Brightness, Alpha)
  // Max values: 360 for hue, 100 for sat/bri, 100 for alpha
  colorMode(HSB, 360, 100, 100, 100);

  // Set the initial background color
  background(0); // Black

  // Calculate the angle for each symmetry segment
  angle = TWO_PI / symmetry;

  // Create a button to save the canvas image
  saveButton = createButton('Save Canvas');
  saveButton.position(15, 15); // Position it slightly offset
  saveButton.style('padding', '8px 15px'); // Add some padding
  saveButton.style('border-radius', '5px'); // Rounded corners
  saveButton.style('border', 'none');
  saveButton.style('cursor', 'pointer');
  saveButton.mousePressed(saveToFile); // Attach the save function

  print("p5.js Kaleidoscope Initialized.");
  print(`Symmetry: ${symmetry}, Mirroring: ${enableMirroring}, Fading: ${enableFadingTrails}`);
}

function draw() {
  // --- Background Handling ---
  if (enableFadingTrails) {
    // Draw a semi-transparent background to create fading trails
    background(0, 0, 0, fadeAlpha / 100 * 255); // Convert 0-100 alpha to 0-255 for background()
  } else {
    // Optional: Clear background completely if trails are off
    // background(0); // Uncomment this if you want a solid black background always
  }

  // --- Transformations ---
  // Move the origin (0,0) to the center of the canvas
  translate(width / 2, height / 2);

  // --- Mouse Input Calculations ---
  // Check if mouse is inside the canvas to avoid drawing when outside
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {

    // Calculate current and previous mouse positions relative to the center
    let mx = mouseX - width / 2;
    let my = mouseY - height / 2;
    let pmx = pmouseX - width / 2;
    let pmy = pmouseY - height / 2;

    // --- Dynamic Styling ---
    // Calculate mouse speed
    let speed = dist(mouseX, mouseY, pmouseX, pmouseY);
    // Map speed to stroke weight
    let sw = map(speed, 0, speedToWeightFactor, minStrokeWeight, maxStrokeWeight);
    // Constrain stroke weight to min/max values
    strokeWeight(constrain(sw, minStrokeWeight, maxStrokeWeight));

    // Update hue for cycling effect
    currentHue += strokeColorChangeSpeed;
    if (currentHue > 360) {
      currentHue -= 360;
    }

    // Calculate saturation and brightness based on distance from center
    let mouseDist = dist(mx, my, 0, 0);
    let maxDist = max(width / 2, height / 2);
    let saturation = map(mouseDist, 0, maxDist, 60, 100); // More saturated away from center
    let brightness = map(mouseDist, 0, maxDist, 70, 100); // Brighter away from center

    // Set the stroke color using HSB values
    stroke(currentHue, saturation, brightness, 90); // Slightly transparent stroke

    // --- Drawing the Symmetry ---
    // Loop through each symmetry segment
    for (let i = 0; i < symmetry; i++) {
      // Rotate the coordinate system for the current segment
      rotate(angle);

      // Draw the primary line segment based on relative mouse movement
      line(mx, my, pmx, pmy);

      // --- Optional Mirroring ---
      if (enableMirroring) {
        // Apply mirroring within the segment for a classic kaleidoscope effect
        push(); // Save the current transformation state (includes rotation)
        scale(1, -1); // Flip the coordinate system vertically (mirror)
        line(mx, my, pmx, pmy); // Draw the mirrored line segment
        pop(); // Restore the coordinate system (removes scale, keeps rotation)
      }
    }
  }
}

// --- Utility Functions ---

// Function to save the current canvas frame as a PNG file
function saveToFile() {
  saveCanvas('kaleidoscope_pattern', 'png');
  print("Canvas saved as 'kaleidoscope_pattern.png'");
}

// Function to handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Reset background on resize to avoid drawing artifacts
  background(0);
  print("Canvas resized.");
}

// Optional: Add interaction to clear canvas on mouse press
// function mousePressed() {
//   if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
//      background(0); // Clear canvas
//      print("Canvas cleared.");
//   }
// }
