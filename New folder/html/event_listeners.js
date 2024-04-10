document.addEventListener('DOMContentLoaded', function() {
  //This is called after the browswer has loaded the web page

  //add mouse down listener to our canvas object
document.getElementById('canvas1').addEventListener('mousedown', handleMouseDown);
document.getElementById('canvas1').addEventListener('mousemove', handleMouseMove);
document.getElementById('canvas1').addEventListener('mouseup', handleMouseUp);


  //add key handler for the document as a whole, not separate elements.
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)

  //add button handlers
  //add listener to submit button
  document.getElementById('homeButton').addEventListener('click', handleHomeButton)
  document.getElementById('awayButton').addEventListener('click', handleAwayButton)
  document.getElementById('spectateButton').addEventListener('click', handleSpectateButton)


  const MILLISECONDS = 5
  timer = setInterval(handleTimer, MILLISECONDS) //animation timer
  //clearTimeout(timer); //to stop timer

  let btn = document.getElementById("homeButton")
  btn.disabled = false //enable button
  btn.style.backgroundColor = HOME_PROMPT_COLOUR
  btn = document.getElementById("awayButton")
  btn.disabled = false //enable button
  btn.style.backgroundColor= VISITOR_PROMPT_COLOUR
  btn = document.getElementById("spectateButton")
  btn.disabled = false //enable button
  btn.style.backgroundColor= SPECTATOR_PROMPT_COLOUR



  drawCanvas()
})
