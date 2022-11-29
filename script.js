
// This function was not all created by me!!
// I modified it from https://bootstrap-menu.com/detail-fixed-onscroll.html
// This allows the navbar to stay attached to the top of the screen without using sticky-top, which not all browsers support.
document.addEventListener("DOMContentLoaded", function() {
  window.addEventListener('scroll', function() {
    const elem = document.getElementById("carousel_top");
    const rect = elem.getBoundingClientRect();
    const nav = document.getElementById('navbar_top');
    const nav_rect = nav.getBoundingClientRect();
    if (rect.bottom < 0) {
      nav.classList.add('fixed-top');
      // add padding top to show content behind navbar
      elem.style.padding = "0px 0px " + nav_rect.height + "px";
    } if (rect.bottom - nav_rect.height > 0) {
      document.getElementById('navbar_top').classList.remove('fixed-top');
      // remove padding top from body
      elem.style.padding = "0px 0px 0px";
    }
  });
});
// DOMContentLoaded end

// Add last update
function addLastUpdate() {
  const date = new Date(document.lastModified);
  document.getElementById("modified").innerHTML = "Updated last on " + date.toDateString();
}

// On load, do this
$(window).on('load', addLastUpdate);

// Form helper function that returns an appropriate string if a checkbox element has been checked
function formCheckboxString(checkboxElement){
  return (checkboxElement.checked) ? checkboxElement.value : "Nothing!";
}

// Function that updates elements in the document upon submission of form
function formSubmit() {
  let learn = document.forms["myform"]["learn"];
  let color = document.forms["myform"]["webcolor"].value;
  let review = document.forms["myform"]["enjoy"].value;
  let name = document.forms["myform"]["name"].value;
  let form = document.forms["myform"]["form"].value;

  // Oh! You didn't leave a review...
  if (review == "")
    review = "Nothing, apparently!";

  // Change innerHTML
  if (name != "") {
    document.getElementById("yourName").innerHTML = "Your name is " + name + ". Excellent";
    document.getElementById("yourForm").innerHTML = form;
    document.getElementById("youLearned").innerHTML = "You have learned " + formCheckboxString(learn[0]) + ", " + formCheckboxString(learn[1]) + ", " + formCheckboxString(learn[2]);
    document.getElementById("favoriteColorText").innerHTML = "This website makes you feel: <br>";
    document.getElementById("favoriteColor").style.backgroundColor = color;
    document.getElementById("favoriteColor").style.width = 50;
    document.getElementById("yourThoughts").innerHTML = "Here's what you thought of the site: <br>" + review;
  }
  else {
    alert("ENTER A NAME");
  }
}

// Default view resolution. 320 x 224, same as many arcade games!
const width = 320;
const height = 224;

// Grab the tree image
const img = new Image();             // Create new img element
img.src = 'Pictures/funny_tree.png'; // Our lovely tree :)

// Grass color
const grass = "rgba(64, 200, 64, 1)";

// It's called "initTrees" but really I just use it to initialize everything
var initTrees = false;

// Trees array and sorted trees array
var trees = [];
var sortedTrees = [];

// Tree Class
class Tree {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.world_x = 0;
    this.world_y = 0;
    this.world_z = 0;
  }
  // Set position!
  setPos(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  // Position around camera
  camPosition(cam) {
    // Relative positions
    let rx = this.x - cam.getX();
    let ry = this.y - cam.getY();
    // Angle in radians
    let ra = cam.getAngle() * Math.PI / 180;
    // Move around the camera
    this.world_x = rx * Math.cos(ra) - ry * Math.sin(ra);
    this.world_y = ry * Math.cos(ra) + rx * Math.sin(ra);
    this.world_z = this.z - cam.getZ();
  }

  // Draw it!
  draw2D(ctx, img) {
    // Draw the image
    ctx.drawImage(img, this.x - 32, this.y - 32);
  }

  // Draw it in 3D!
  draw3D(ctx, img, cam, scaled) {
    // Make sure not to draw objects that are behind the camera!
    if (this.world_y <= 0)
      return -1;
    // Scale Factor
    let scale_factor = cam.getViewDist() / this.world_y;
    // Projection point
    let screen_x = width / 2 + scale_factor * this.world_x;
    let screen_y = height / 2 + scale_factor * this.world_z;
    // Default scale
    let scale = 64;
    // Rescale
    if (scaled)
      scale = 64 * scale_factor;
    // Draw it!!
    ctx.drawImage(img, screen_x - scale / 2, screen_y - scale / 2, scale, scale);
  }
}

// Camera Class
class Camera {
  constructor(x, y, z, angle, FOV) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.angle = angle;
    this.FOV = FOV;
    this.viewDist = (width / 2) / (Math.tan((this.FOV / 2) * Math.PI / 180));
  }

  // Set the camera's position
  setPosition(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // Set the camera's angle (yaw)
  setAngle(angle) {
    this.angle = angle;
  }

  // Set the camera's Field of View and recalculate the viewDist
  setFOV(FOV) {
    this.FOV = FOV;
    this.viewDist = (width / 2) / (Math.tan((this.FOV / 2) * Math.PI / 180));
  }
  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  getZ() {
    return this.z;
  }
  getAngle() {
    return this.angle;
  }
  getViewDist() {
    return this.viewDist;
  }
}

// Camera
var myCamera = new Camera(width, -128, -64, 0, 90);
var rotatingDot = new Camera(width, -128, -64, 0, 90);
var rotation = 0;

// Random range
function RandomRange(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Generate random trees
function generateTrees(minX, minY, maxX, maxY, num) {
  for (let i = 0; i < num; i++) {
    trees.push(new Tree(RandomRange(minX, maxX), RandomRange(minY, maxY), 0));
  }
}

// Random trees demo
function treesRandomDemo() {
  // Generate trees
  if (initTrees == false) {
    generateTrees(32, 32, width - 32, height - 32, 10);
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

// 3D Projection demo
function trees3DProjectionDemo() {
  // Generate trees
  if (initTrees == false) {
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        trees.push(new Tree(x * 128 + 64, y * 128 + 64, 0));
      }
    }
    initTrees = true;
  }
  // Draw trees but they're THREE DEE
  // They're not scaled or sorted, whoops!
  drawGroundSky("canvas1", grass, "aqua");
  drawTrees3D("canvas1", myCamera, false, false);
  // Draw trees but they're THREE DEE
  // They're scaled, but not sorted. We'll get there!
  drawGroundSky("canvas2", grass, "aqua");
  drawTrees3D("canvas2", myCamera, true, false);
  // Draw trees but they're THREE DEE
  // They're scaled and SORTED. I'm just that damn good!
  drawGroundSky("canvas3", grass, "aqua");
  drawTrees3D("canvas3", myCamera, true, true);
  // Camera rotate!
  let a = rotation * Math.PI / 180;
  rotatingDot.setPosition(width + Math.cos(a) * 400, width + Math.sin(a) * 400, -32);
  rotatingDot.setAngle(270 - rotation);
  rotation++;
  // Draw trees but they're THREE DEE
  // Now they rotate !!
  drawGroundSky("canvas4", grass, "aqua");
  drawTrees3D("canvas4", rotatingDot, true, true);
  // Draw trees but they're THREE DEE
  // Now they rotate, but they don't scale !!
  drawGroundSky("canvas5", grass, "aqua");
  drawTrees3D("canvas5", rotatingDot, false, true);
  // Animation !!
  window.requestAnimationFrame(trees3DProjectionDemo);
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

// Ironically we have to screen refresh, despite sprites being made to avoid that...
function drawGroundSky(canvasId, groundColor, skyColor) {

  // Get the canvas
  let canvas = document.getElementById(canvasId);

  // Make sure the canvas actually exists!
  if (canvas.getContext) {

    // use getContext to use the canvas for drawing
    var ctx = canvas.getContext("2d");

    // Fill!
    ctx.fillStyle = skyColor;
    ctx.fillRect(0, 0, width, height / 2);

    // Fill!
    ctx.fillStyle = groundColor;
    ctx.fillRect(0, height / 2, width, height);
  }
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
    for (let tree of trees) {
      tree.draw2D(ctx, img, true);
    }

  }
}

// Draw the tree at a specific point
function drawTrees3D(canvasId, cam, scaled, sorted) {

  // Get the canvas
  let canvas = document.getElementById(canvasId);

  // Make sure the canvas actually exists!
  if (canvas.getContext) {

    // use getContext to use the canvas for drawing
    var ctx = canvas.getContext("2d");

    // Move trees
    for (let tree of trees) {
      tree.camPosition(cam);
    }

    // Draw sorted
    if (sorted) {
      // Copy array
      sortedTrees = [...trees];

      // Sort
      sortedTrees.sort((a, b) => b.world_y - a.world_y);

      // Draw trees
      for (let tree of sortedTrees) {
        tree.draw3D(ctx, img, cam, scaled);
      }
    }
    // Draw unsorted
    else {
      // Draw trees
      for (let tree of trees) {
        tree.draw3D(ctx, img, cam, scaled);
      }
    }
  }
}

// Draw the tree at a specific point
function drawTreePoint(canvasId) {

  // Get x and y
  const x = document.getElementById(canvasId + "-sliderX").value;
  const y = document.getElementById(canvasId + "-sliderY").value;

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
  let x = width / 2;
  let y = 280;

  // If we can use trig!
  if (trig) {
    // FOV
    var FOV = document.getElementById(canvasId + "-sliderFOV").value;
    // dy
    let dy = (windowWidth / 2) / (Math.tan((FOV / 2) * Math.PI / 180));
    // Y pos
    y = height + dy;
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
    if (trig) {
      // Value
      ctx.fillStyle = "white";
      ctx.font = "14px Arial";
      ctx.fillText("FOV : " + FOV, 10, 26);
      // dy
      ctx.strokeStyle = "red";
      ctx.moveTo(x, y);
      ctx.lineTo(width / 2, height);
      ctx.closePath();
      ctx.stroke();
      // FOV line
      ctx.strokeStyle = "lightgray";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(width / 2 - windowWidth / 2, height);
      ctx.moveTo(x, y);
      ctx.lineTo(width / 2 + windowWidth / 2, height);
      ctx.closePath();
      ctx.stroke();
    }

    // Draw the line representing the projection plane or window
    ctx.strokeStyle = "aqua";

    // Stroked triangle
    ctx.beginPath();
    ctx.moveTo(width / 2 - windowWidth / 2, height);
    ctx.lineTo(width / 2 + windowWidth / 2, height);
    ctx.closePath();
    ctx.stroke();

    // Line stuffs
    ctx.strokeStyle = "black";

    // Draw a line
    if (drawLine) {
      // Get x and y
      var line_x = document.getElementById(canvasId + "-sliderX").value;
      var line_y = document.getElementById(canvasId + "-sliderY").value;
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
    ctx.lineTo(width / 2 - windowWidth / 2, height);
    ctx.moveTo(width / 2 + windowWidth / 2, height);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.stroke();

    // Projection point
    if (drawProjection) {
      let scale_ratio = (y - height) / (y - line_y);
      let dx = scale_ratio * (line_x - x);
      let point = width / 2 + dx;
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