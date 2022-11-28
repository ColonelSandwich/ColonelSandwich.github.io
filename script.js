

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

// Initialize trees
var initTrees = false;

// Random trees demo
function treesRandomDemo() {
  // Generate trees
  if(initTrees == false){
    generateTrees(10);
    initTrees = true;
  }
  // Now !! Draw a basic demonstration
  drawTreesRandom("canvas1");
  // Draw trees but ALSO draw a window
  drawTreesRandom("canvas2");
  drawScreen("canvas2", false, false, false);
  // Animation !!
  window.requestAnimationFrame(treesRandomDemo);
}

// Projection demo
function treesProjectionDemo() {
  // Get the canvas
  var canvas = document.getElementById("canvas1");
  // Draw trees but you can set the position
  screenRefresh("canvas1", grass);
  drawScreen("canvas1", true, false, false);
  drawTreePoint("canvas1");
  // Draw trees but you can set the position AND the projection point is shown.
  screenRefresh("canvas2", grass);
  drawScreen("canvas2", true, true, false);
  drawTreePoint("canvas2");
  // Draw trees but you can set the position AND the projection point is shown, along with an FOV slider
  screenRefresh("canvas3", grass);
  drawScreen("canvas3", true, true, true);
  drawTreePoint("canvas3");
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

// Ironically we have to screen refresh, despite sprites being made to avoid that...
function screenRefresh(canvasId, color) {
  
  // Get the canvas
  let canvas = document.getElementById(canvasId);

  // Make sure the canvas actually exists!
  if (canvas.getContext) {
    
    // use getContext to use the canvas for drawing
    var ctx = canvas.getContext("2d");

    // Fill!
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
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

    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText("x : " + x + ", y : " + y, 10, 10);

    // Positional
    myTree.setPos(x, y, 0);
    
    // Draw all trees
    myTree.draw2D(ctx, img, true);
  }
}

// Window visual
function drawScreen(canvasId, drawLine, drawProjection, trig) {
  
  // Get the canvas
  let canvas = document.getElementById(canvasId);

  // Window width
  let windowWidth = 160;

  // Our position
  let x = width/2;
  let y = 280;

  // If we can use trig!
  if(trig){
    // FOV
    var FOV = document.getElementById(canvasId+"-sliderFOV").value;
    // dy
    let dy = (windowWidth/2)/(Math.tan((FOV/2) * Math.PI/180));
    // Y pos
    y = height+dy;
  }

  // Make sure the canvas actually exists!
  if (canvas.getContext) {

    // use getContext to use the canvas for drawing
    var ctx = canvas.getContext("2d");

    // Ironically we have to screen refresh
    ctx.fillStyle = "white";
    ctx.fillRect(0, height, width, 480);

    // Line Width
    ctx.lineWidth = 4;
    
    // Draw FOV
    if(trig){
      // Value
      ctx.fillStyle = "white";
      ctx.font = "14px Arial";
      ctx.fillText("FOV : " + FOV, 10, 26);
      // dy
      ctx.strokeStyle = "red";
      ctx.moveTo(x, y);
      ctx.lineTo(width/2, height);
      ctx.closePath();
      ctx.stroke();
      // FOV line
      ctx.strokeStyle = "lightgray";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(width/2-windowWidth/2, height);
      ctx.moveTo(x, y);
      ctx.lineTo(width/2+windowWidth/2, height);
      ctx.closePath();
      ctx.stroke();
    }
    
    // Draw the line representing the projection plane or window
    ctx.strokeStyle = "aqua";

    // Stroked triangle
    ctx.beginPath();
    ctx.moveTo(width/2-windowWidth/2, height);
    ctx.lineTo(width/2+windowWidth/2, height);
    ctx.closePath();
    ctx.stroke();

    // Line stuffs
    ctx.strokeStyle = "black";
    
    // Draw a line
    if(drawLine){
      // Get x and y
      var line_x = document.getElementById(canvasId+"-sliderX").value;
      var line_y = document.getElementById(canvasId+"-sliderY").value;
      // Draw line
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(line_x, line_y);
      ctx.closePath();
      ctx.stroke();
    }
    
    // Edges of screen where the window isn't present
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width/2-windowWidth/2, height);
    ctx.moveTo(width/2+windowWidth/2, height);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.stroke();

    // Projection point
    if(drawProjection){
      let scale_ratio = (y-height)/(y-line_y);
      let dx = scale_ratio * (line_x-x);
      let point = width/2 + dx;
      // Draw point!
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(point, height, 4, 0, Math.PI * 2, false);
      ctx.fill();
    }

    // Draw us!
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2, false);
    ctx.stroke();

    // Inside line
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2, false);
    ctx.fill();

  }
}