

// Add the date of the last time we updated the page
function addLastUpdate() {
  const date = new Date(document.lastModified);
  document.getElementById("modified").innerHTML = "Updated last on " + date.toDateString() + " !!";
}

function draw() {
  const ctx = document.getElementById('canvas').getContext('2d');
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
  };
  img.src = 'backdrop.png';
}


// Draw the random trees
function drawTreesRandom() {

  // Get the canvas
  var canvas = document.getElementById("default");

  // Make sure the canvas actually exists!
  if (canvas.getContext) {

    // use getContext to use the canvas for drawing
    var ctx = canvas.getContext("2d");

    // Ironically we have to screen refresh
    // ctx.fillStyle = "green";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grab the tree image
    const img = new Image();   // Create new img element
    img.src = 'Pictures/funny_tree.png'; // Set source path

    // Draw the trees
    ctx.drawImage(tree, 64, 64);

  }
}