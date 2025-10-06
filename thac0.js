// THAC0 Calculator for Bangle.js 2 - v6.3 - Dice Visual Edition
// Swipe to set your roll and THAC0, see what AC you hit!

// THAC0 persistence functions - define BEFORE using!
function loadTHAC0() {
  try {
    var saved = require('Storage').readJSON('thac0.settings');
    return saved && saved.thac0 ? saved.thac0 : 20; // Default to 20 if no save
  } catch (e) {
    return 20; // Default if file doesn't exist or error reading
  }
}

function saveTHAC0(thac0) {
  require('Storage').writeJSON('thac0.settings', {thac0: thac0});
}

// App state - now we can safely call loadTHAC0()
var state = {
  thac0: loadTHAC0(), // Load saved THAC0 or default to 20
  roll: 10,           // Current roll (1-20), default 10
  attackBonus: 0      // Attack bonus (STR, magic, etc)
};

function calculateHitAC(roll) {
  // Formula: AC Hit = THAC0 - (Roll + Bonus)
  return state.thac0 - (roll + state.attackBonus);
}

function drawMain() {
  g.clear();
  g.setFontAlign(0, -1);
  g.setColor(0,0,0); // BLACK text by default
  
  // YOUR THAC0 at top
  g.setFont('Vector', 16);
  g.drawString('YOUR THAC0: ' + state.thac0, g.getWidth()/2, 8);
  
  // ROLL label and number with dice outline
  var centerX = g.getWidth()/2;
  var centerY = g.getHeight()/2 - 10;
  
  // Draw "ROLL" label - moved up for better spacing
  g.setFont('Vector', 14);
  g.setFontAlign(0, -1);
  g.drawString('ROLL', centerX, centerY - 30);
  
  // Draw dice outline around the roll number
  var diceSize = 35;
  g.drawRect(centerX - diceSize/2, centerY - diceSize/2, centerX + diceSize/2, centerY + diceSize/2);
  
  // Draw the roll number inside the dice
  g.setFont('Vector', 20);
  g.setFontAlign(0, 0); // Center horizontally and vertically
  g.drawString(state.roll, centerX, centerY);
  
  // Calculate result
  var hitAC = calculateHitAC(state.roll);
  
  // Show result based on roll type
  g.setFontAlign(0, -1);
  var resultY = centerY + 30; // Position below the dice
  
  // Special case: Natural 1 (automatic miss)
  if (state.roll === 1) {
    g.setFont('Vector', 18);
    g.drawString('AUTO MISS', g.getWidth()/2, resultY);
    g.setFont('Vector', 12);
    g.drawString('Nat 1 always miss', g.getWidth()/2, resultY + 22);
  }
  // Special case: Natural 20 (automatic hit)
  else if (state.roll === 20) {
    g.setFont('Vector', 18);
    g.drawString('AUTO HIT', g.getWidth()/2, resultY);
    g.setFont('Vector', 12);
    g.drawString('Crit up to AC ' + hitAC, g.getWidth()/2, resultY + 22);
  }
  // Normal rolls: show AC hit and armor type
  else {
    g.setFont('Vector', 18);
    g.drawString('YOU HIT AC: ' + hitAC, g.getWidth()/2, resultY);
    
    // Show armor type
    g.setFont('Vector', 12);
    var armorType = '';
    if (hitAC >= 8) {
      armorType = 'Unarmored';
    } else if (hitAC >= 5) {
      armorType = 'Leather';
    } else if (hitAC >= 2) {
      armorType = 'Chain Mail';
    } else if (hitAC >= 0) {
      armorType = 'Full Plate';
    } else {
      armorType = 'Magic Defense';
    }
    g.drawString(armorType, g.getWidth()/2, resultY + 22);
  }
  
  // Show simple gesture instructions at bottom - black text
  g.setFont('Vector', 11);
  g.setColor(0,0,0);
  g.drawString('Swipe to adjust', g.getWidth()/2, g.getHeight() - 12);
}

// Basic stroke direction analysis
Bangle.on('stroke', function(event) {
  if (!event.xy || event.xy.length < 4) return; // Need at least start and end points
  
  // Get first and last coordinates
  var startX = event.xy[0];
  var startY = event.xy[1];
  var endX = event.xy[event.xy.length - 2];
  var endY = event.xy[event.xy.length - 1];
  
  // Calculate movement deltas
  var deltaX = endX - startX;
  var deltaY = endY - startY;
  var threshold = 20; // Minimum movement to count as a gesture
  
  // Determine primary direction
  if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > threshold) {
    // Vertical gesture
    if (deltaY < 0) {
      // Swipe up - decrease roll
      state.roll = Math.max(1, state.roll - 1);
      drawMain();
    } else {
      // Swipe down - increase roll
      state.roll = Math.min(20, state.roll + 1);
      drawMain();
    }
  } else if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
    // Horizontal gesture
    if (deltaX < 0) {
      // Swipe left - decrease THAC0
      state.thac0 = Math.max(10, state.thac0 - 1);
      saveTHAC0(state.thac0); // Save to storage
      drawMain();
    } else {
      // Swipe right - increase THAC0
      state.thac0 = Math.min(20, state.thac0 + 1);
      saveTHAC0(state.thac0); // Save to storage
      drawMain();
    }
  }
});

// Physical button - reset roll to 10 (middle value)
setWatch(function() {
  state.roll = 10;
  drawMain();
}, BTN, {repeat:true, debounce:200});

// Show a quick startup message then start the app
g.clear();
g.setFont('Vector', 14);
g.setFontAlign(0, -1);
g.drawString('THAC0 v6.3', g.getWidth()/2, g.getHeight()/2 - 10);
g.setFont('Vector', 10);
g.drawString('Stroke Gestures', g.getWidth()/2, g.getHeight()/2 + 10);
setTimeout(function() {
  drawMain();
}, 1200);
