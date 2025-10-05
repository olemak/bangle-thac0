// THAC0 Calculator for Bangle.js 2 - v4.0
// Tap your die roll to see what AC you hit!

// App state
var state = {
  thac0: 20,          // Your THAC0 from character sheet (default: 1st level)
  selectedRoll: 0,    // Which roll number is highlighted (0 = none)
  attackBonus: 0,     // Attack bonus (STR, magic, etc)
  showMessage1: true  // Alternates between intro messages
};

var messageTimer;

function calculateHitAC(roll) {
  // Formula: AC Hit = THAC0 - (Roll + Bonus)
  return state.thac0 - (roll + state.attackBonus);
}

function drawMain() {
  g.clear();
  g.setFontAlign(0, -1);
  g.setColor(0,0,0); // BLACK text by default
  
  // YOUR THAC0 at top - black text, more space
  g.setFont('Vector', 16);
  g.drawString('YOUR THAC0: ' + state.thac0, g.getWidth()/2, 5);
  
  // Draw clickable roll numbers - all black normally
  g.setFont('Vector', 14);
  var startY = 35;  // More space after title
  
  for (var roll = 1; roll <= 20; roll++) {
    var row = Math.floor((roll - 1) / 5);
    var col = (roll - 1) % 5;
    
    // Center the grid better - 5 columns of 30px each = 150px total
    var gridWidth = 5 * 30;
    var gridStartX = (g.getWidth() - gridWidth) / 2;
    var x = gridStartX + 15 + col * 30;  // Center each column
    var y = startY + row * 22;
    
    // Invert selected roll: black background, white text
    if (roll === state.selectedRoll) {
      g.setColor(0,0,0); // Black background
      g.fillRect(x-12, y-2, x+12, y+16);
      g.setColor(1,1,1); // White text on black background
    } else {
      g.setColor(0,0,0); // Black text normally
    }
    
    // Draw the number - perfectly center it in the rectangle
    g.setFontAlign(0, 0); // Center horizontally and vertically
    g.drawString(roll, x, y + 9); // Perfect vertical center in the rectangle
  }
  
  // Show result if a roll is selected - black text
  g.setColor(0,0,0);
  if (state.selectedRoll > 0) {
    g.setFontAlign(0, -1);
    
    // Special case: Natural 1 (automatic miss)
    if (state.selectedRoll === 1) {
      g.setFont('Vector', 18);
      g.drawString('AUTO MISS', g.getWidth()/2, startY + 95);
      g.setFont('Vector', 12);
      g.drawString('Nat 1 always miss', g.getWidth()/2, startY + 115);
    }
    // Special case: Natural 20 (automatic hit)
    else if (state.selectedRoll === 20) {
      g.setFont('Vector', 18);
      g.drawString('AUTO HIT', g.getWidth()/2, startY + 95);
      var critThresholdAC = calculateHitAC(20);
      g.setFont('Vector', 12);
      g.drawString('Crit up to AC ' + critThresholdAC, g.getWidth()/2, startY + 115);
    }
    // Normal rolls: show AC hit and armor type
    else {
      var hitAC = calculateHitAC(state.selectedRoll);
      g.setFont('Vector', 18);
      g.drawString('YOU HIT AC: ' + hitAC, g.getWidth()/2, startY + 95);
      
      // Show armor type
      g.setFont('Vector', 12);
      if (hitAC >= 8) {
        g.drawString('Unarmored', g.getWidth()/2, startY + 115);
      } else if (hitAC >= 5) {
        g.drawString('Leather', g.getWidth()/2, startY + 115);
      } else if (hitAC >= 2) {
        g.drawString('Chain Mail', g.getWidth()/2, startY + 115);
      } else if (hitAC >= 0) {
        g.drawString('Full Plate', g.getWidth()/2, startY + 115);
      } else {
        g.drawString('Magic Defense', g.getWidth()/2, startY + 115);
      }
    }
  } else {
    // Alternating intro messages - positioned below the grid
    g.setFont('Vector', 12);
    g.setFontAlign(0, -1);
    if (state.showMessage1) {
      g.drawString('TAP YOUR ROLL', g.getWidth()/2, startY + 100);
    } else {
      g.drawString('BTN: Change THAC0', g.getWidth()/2, startY + 100);
    }
  }
}

// Touch handler - detect which roll number was tapped
Bangle.on('touch', function(button, xy) {
  if (xy) {
    var x = xy.x;
    var y = xy.y;
    var startY = 35;  // Updated to match new grid position
    
    // Check if touch is in the roll number grid area
    if (y >= startY && y <= startY + 88) {
      for (var roll = 1; roll <= 20; roll++) {
        var row = Math.floor((roll - 1) / 5);
        var col = (roll - 1) % 5;
        
        // Match the new centered grid coordinates
        var gridWidth = 5 * 30;
        var gridStartX = (g.getWidth() - gridWidth) / 2;
        var rollX = gridStartX + 15 + col * 30;
        var rollY = startY + row * 22;
        
        // Check if tap is near this roll number (within 12 pixels)
        if (Math.abs(x - rollX) <= 12 && Math.abs(y - rollY) <= 11) {
          state.selectedRoll = roll;
          // Stop the intro message timer once user starts using the app
          if (messageTimer) {
            clearInterval(messageTimer);
            messageTimer = null;
          }
          drawMain();
          return;
        }
      }
    }
  }
});

// Physical button - adjust THAC0
setWatch(function() {
  state.thac0--;
  if (state.thac0 < 10) state.thac0 = 20; // Wrap around
  drawMain();
}, BTN, {repeat:true, debounce:200});

// Initialize display and start alternating intro messages
function startIntroMessages() {
  drawMain();
  
  // Only show alternating messages if no roll is selected yet
  if (state.selectedRoll === 0) {
    messageTimer = setInterval(function() {
      if (state.selectedRoll === 0) { // Check again in case user tapped during interval
        state.showMessage1 = !state.showMessage1;
        drawMain();
      } else {
        // Stop timer if user has selected a roll
        clearInterval(messageTimer);
        messageTimer = null;
      }
    }, 3000); // Switch every 3 seconds
  }
}

// Show a quick startup message then start the app
g.clear();
g.setFont('Vector', 12);
g.setFontAlign(0, -1);
g.drawString('THAC0 Loading', g.getWidth()/2, g.getHeight()/2);
setTimeout(function() {
  startIntroMessages();
}, 1000);
