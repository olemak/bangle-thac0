// THAC0 Calculator for Bangle.js 2
// Input your THAC0 and die roll, see what AC you hit!

// App state
var state = {
  thac0: 18,        // Your THAC0 from character sheet
  diceRoll: 12,     // The number you rolled
  attackBonus: 0,   // Attack bonus (STR, magic, etc)
  setting: 0        // 0=THAC0, 1=Roll, 2=Bonus
};

var settingNames = ['THAC0', 'Roll', 'Bonus'];

function calculateHitAC() {
  // Formula: AC Hit = THAC0 - (Roll + Bonus)
  return state.thac0 - (state.diceRoll + state.attackBonus);
}

function drawMain() {
  g.clear();
  g.setFont('Vector', 14);
  g.setFontAlign(0, -1);
  
  // Title
  g.drawString('THAC0 Helper', g.getWidth()/2, 10);
  
  // Current values with highlighting for selected setting
  g.setFont('Vector', 12);
  
  // THAC0
  if (state.setting === 0) g.setColor(1,1,1); // Highlight
  else g.setColor(0.7,0.7,0.7);
  g.drawString('THAC0: ' + state.thac0, g.getWidth()/2, 35);
  
  // Roll
  if (state.setting === 1) g.setColor(1,1,1); // Highlight  
  else g.setColor(0.7,0.7,0.7);
  g.drawString('Roll: ' + state.diceRoll, g.getWidth()/2, 55);
  
  // Bonus
  if (state.setting === 2) g.setColor(1,1,1); // Highlight
  else g.setColor(0.7,0.7,0.7);
  var bonusStr = state.attackBonus >= 0 ? '+' + state.attackBonus : '' + state.attackBonus;
  g.drawString('Bonus: ' + bonusStr, g.getWidth()/2, 75);
  
  // Reset color and show result
  g.setColor(1,1,1);
  g.drawString('─────────────', g.getWidth()/2, 90);
  
  // Calculate and show what AC we hit
  var hitAC = calculateHitAC();
  g.setFont('Vector', 16);
  g.drawString('Hits AC: ' + hitAC, g.getWidth()/2, 110);
  
  // Show some context
  g.setFont('Vector', 10);
  if (hitAC <= -5) {
    g.drawString('(Heavily Armored)', g.getWidth()/2, 135);
  } else if (hitAC <= 0) {
    g.drawString('(Well Armored)', g.getWidth()/2, 135);
  } else if (hitAC <= 5) {
    g.drawString('(Lightly Armored)', g.getWidth()/2, 135);
  } else {
    g.drawString('(Unarmored)', g.getWidth()/2, 135);
  }
  
  // Instructions
  g.setFont('Vector', 8);
  g.drawString('Tap top: Change setting', g.getWidth()/2, 150);
  g.drawString('Tap middle: +' + settingNames[state.setting], g.getWidth()/2, 162);
  g.drawString('Tap bottom: -' + settingNames[state.setting], g.getWidth()/2, 174);
}

function adjustValue(direction) {
  switch(state.setting) {
    case 0: // THAC0
      state.thac0 = Math.max(1, Math.min(20, state.thac0 + direction));
      break;
    case 1: // Roll
      state.diceRoll = Math.max(1, Math.min(20, state.diceRoll + direction));
      break;
    case 2: // Bonus
      state.attackBonus = Math.max(-10, Math.min(20, state.attackBonus + direction));
      break;
  }
  drawMain();
}

// Touch handlers for Bangle.js 2
Bangle.on('touch', function(button, xy) {
  if (xy) {
    var x = xy.x;
    var y = xy.y;
    var screenWidth = g.getWidth();
    var screenHeight = g.getHeight();
    
    // Top third: cycle through settings
    if (y < screenHeight / 3) {
      state.setting = (state.setting + 1) % 3;
      drawMain();
    }
    // Middle third: increase value
    else if (y < (screenHeight * 2) / 3) {
      adjustValue(1);
    }
    // Bottom third: decrease value
    else {
      adjustValue(-1);
    }
  }
});

// Physical button - cycle through settings
setWatch(function() {
  state.setting = (state.setting + 1) % 3;
  drawMain();
}, BTN, {repeat:true, debounce:200});

// Initialize display
g.clear();
drawMain();

// Show a quick startup message
g.setFont('Vector', 10);
g.setFontAlign(0, -1);
g.drawString('Ready for battle!', g.getWidth()/2, g.getHeight()/2 + 20);
setTimeout(function() {
  drawMain();
}, 800);