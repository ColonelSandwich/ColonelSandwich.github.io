

// Add the date of the last time we updated the page
function addLastUpdate() {
  const date = new Date(document.lastModified);
  document.getElementById("modified").innerHTML = "Updated last on " + date.toDateString() + " !!";
}

// Default view resolution
var width = 320;
var height = 224;

// Trees array
var trees = [];

// Vector3
class Vec3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

// Tree Class
class Tree {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  // Draw it!
  draw2D(ctx, img, clip) {
    let c = 64;
    // Clip the image so it doesn't go past the border boundary
    if(clip)
      c = Math.max(0, Math.min(64, (height-2)-(this.y-32)));
    // Draw the image
    ctx.drawImage(img, 0, 0, 64, c, this.x-32, this.y-32, 64, c);
  }
}

// Camera Class
class Camera {
  constructor(x, y, z, angle) {
    this.position = new Vec3(x, y, z);
    this.angle = angle;
  }
}

// Random range
function RandomRange(min, max) {
  return Math.floor(Math.random() * max) + min;
}

// Generate random trees
function generateTrees(range_x, range_y, num) {
  for (let i = 0; i < num; i++) {
    trees.push(new Tree(RandomRange(0, range_x), RandomRange(0, range_y), 0));
  }
}

// Load it up!!
window.onload = main;

// Main function
function main() {
  // Generate trees
  generateTrees(320, 224, 10);
  // Now !! Draw a basic demonstration
  drawTreesRandom("canvas1");
  // Draw trees but ALSO draw a window
  drawTreesRandom("canvas2");
  drawWindow("canvas2");
}

// Draw the random trees
function drawTreesRandom(canvasId) {
  
  // Get the canvas
  let canvas = document.getElementById(canvasId);

  // Make sure the canvas actually exists!
  if (canvas.getContext) {

    // use getContext to use the canvas for drawing
    var ctx = canvas.getContext("2d");

    // Ironically we have to screen refresh
    ctx.fillStyle = "rgba(64, 200, 64, 1)";
    ctx.fillRect(0, 0, width, height);

    // Grab the tree image
    const img = new Image();   // Create new img element
    img.src = 'Pictures/funny_tree.png'; // Set source path

    // Draw the trees
    img.addEventListener('load', () => {
      // Draw all trees
      for(let tree of trees) {
        tree.draw2D(ctx, img, true);
      }
    }, false);

  }
}

// Window visual
function drawWindow(canvasId) {
  
  // Get the canvas
  let canvas = document.getElementById(canvasId);

  // Window width
  let windowWidth = 160;

  // Make sure the canvas actually exists!
  if (canvas.getContext) {

    // use getContext to use the canvas for drawing
    var ctx = canvas.getContext("2d");

    // Ironically we have to screen refresh
    ctx.fillStyle = "white";
    ctx.fillRect(0, height, width, 480);
    
    // Ironically we have to screen refresh
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    
    // Stroked triangle
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width/2-windowWidth/2, height);
    ctx.moveTo(width/2+windowWidth/2, height);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.stroke();

    // Draw us!
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width/2, 280, 16, 0, Math.PI * 2, false);
    ctx.stroke();

    // Ironically we have to screen refresh
    ctx.strokeStyle = "aqua";
    ctx.lineWidth = 4;
    
    // Stroked triangle
    ctx.beginPath();
    ctx.moveTo(width/2-windowWidth/2, height);
    ctx.lineTo(width/2+windowWidth/2, height);
    ctx.closePath();
    ctx.stroke();

  }
}