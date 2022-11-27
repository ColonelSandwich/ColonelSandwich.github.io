
// Add the date of the last time we updated the page
function addLastUpdate() {
  const date = new Date(document.lastModified);
  document.getElementById("modified").innerHTML = "Updated last on " + date.toDateString() + " !!";
}