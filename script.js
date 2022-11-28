

// Add the date of the last time we updated the page
function addLastUpdate() {
  const date = new Date(document.lastModified);
  document.getElementById("modified").innerHTML = "Updated last on " + date.toDateString() + " !!";
}

// Default view resolution
const width = 320;
const height = 224;

// Grab the tree image
const img = new Image();             // Create new img element
img.src = 'Pictures/funny_tree.png'; // Set source path

// Grass color
const grass = "rgba(64, 200, 64, 1)";

// Trees array
var trees = [];

// Tree Class
class Tree {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  // Set position!
  setPos(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  // Draw it!
  draw2D(ctx, img, clip) {
    let c = 64;
    // Clip the image so it doesn't go past the border boundary
    //if(clip)
      //c = Math.max(0, Math.min(64, (height-2)-(this.y-32)));
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
  return Math.floor(Math.random() * (max-min))+min;
}

// Generate random trees
function generateTrees(num) {
  for (let i = 0; i < num; i++) {
    trees.push(new Tree(RandomRange(32, width-32), RandomRange(32, height-32), 0));
  }
}

// Random trees demo
function treesRandomDemo() {
  // Generate trees
  generateTrees(10);
  // Now !! Draw a basic demonstration
  drawTreesRandom("canvas1");
  // Draw trees but ALSO draw a window
  drawTreesRandom("canvas2");
  drawScreen("canvas2");
}

// Projection demo
function treesProjectionDemo() {
  // Draw trees but you can set the position
  drawTreePoint("canvas1");
  // Draw trees but you can set the position AND the projection point is shown.
  drawTreePoint("canvas2");
  // Animation !!
  window.requestAnimationFrame(treesProjectionDemo);
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
    ctx.fillStyle = grass;
    ctx.fillRect(0, 0, width, height);

    // Draw all trees
    for(let tree of trees) {
      tree.draw2D(ctx, img, true);
    }

  }
}

// Draw the tree at a specific point
function drawTreePoint(canvasId) {

  // Get x and y
  const x = document.getElementById(canvasId+"-sliderX").value;
  const y = document.getElementById(canvasId+"-sliderY").value;
  
  // My own tree!
  let myTree = new Tree(x, y, 0);
  
  // Get the canvas
  let canvas = document.getElementById(canvasId);

  // Make sure the canvas actually exists!
  if (canvas.getContext) {

    // use getContext to use the canvas for drawing
    var ctx = canvas.getContext("2d");

    // Ironically we have to screen refresh
    ctx.fillStyle = grass;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.fillText("x : " + x + ", y : " + y, 10, 10);

    // Positional
    myTree.setPos(x, y, 0);
    
    // Draw all trees
    myTree.draw2D(ctx, img, true);
  }
}

// Window visual
function drawScreen(canvasId) {
  
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