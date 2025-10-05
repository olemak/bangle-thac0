# THAC0 Calculator for Bangle.js 2

A professional D&D 2nd Edition THAC0 calculator for your Bangle.js smartwatch. Never do mental math during combat again!

![THAC0 Calculator Screenshot](screenshot.png)

## Features

🎲 **Instant Attack Resolution**
- Tap your d20 roll to instantly see what Armor Class you hit
- No more mental math during tense combat moments
- Works with any THAC0 from 10-20 (covers most gameplay scenarios)

⚔️ **Smart D&D Rules Integration** 
- **Natural 1**: Shows "AUTO MISS" (always fails regardless of AC)
- **Natural 20**: Shows "AUTO HIT" + critical hit threshold info
- **Normal rolls**: Displays exact AC hit with armor type context

🛡️ **Tactical Armor Guidance**
- **Unarmored** (AC 8+): Peasants, wizards, unarmored rogues
- **Leather** (AC 5-7): Light armor, padded, studded leather  
- **Chain Mail** (AC 2-4): Medium armor, scale mail, splint
- **Full Plate** (AC 0-1): Heavy armor with/without shield
- **Magic Defense** (AC -1+): Enchanted gear, dragons, magical creatures

## Installation

### Method 1: Bangle.js App Loader (Recommended)
*Coming soon - app will be submitted to the official Bangle.js app store*

### Method 2: Manual Installation
1. Visit the [Bangle.js Web IDE](https://banglejs.com/ide/)
2. Connect your Bangle.js 2 
3. Copy the contents of `thac0.js`
4. Paste into the IDE and upload (Ctrl+Enter / Cmd+Enter)

## Usage

### First Time Setup
1. **THAC0 displays as 20** (universal starting value for all 1st level AD&D characters)
2. **Press the physical button** to decrease your THAC0 to match your character sheet
3. Ready to roll!

### During Combat
1. **Roll your d20**
2. **Tap that number** on the watch screen
3. **Read the result**: "YOU HIT AC: X" + armor type
4. **Profit!** No more holding up the game with math

### Special Cases
- **Tap 1**: "AUTO MISS - Nat 1 always miss"
- **Tap 20**: "AUTO HIT - Crit up to AC X" (shows crit threshold)

## Technical Details

- **Compatible with**: Bangle.js 2 only (uses touchscreen)
- **Memory usage**: Minimal - just the core calculator
- **Battery impact**: Negligible - static display with touch events
- **File size**: ~8KB

## Development

### Project Structure
```
thac0-app/
├── thac0.js          # Main application file
├── thac0-clean.js    # Development backup (can be removed)
├── README.md         # This file
└── .git/            # Git repository
```

### Version History
- **v4.0**: Pixel-perfect polish, professional UX
- **v3.x**: Smart intro messages, armor categories  
- **v2.x**: Touch interface, special roll handling
- **v1.x**: Basic THAC0 calculation

## Contributing

Feel free to submit issues and feature requests! This project is open source and welcomes contributions.

### Possible Future Features
- Attack bonus support (STR, magic weapons)
- Multiple character profiles
- Damage calculation
- Initiative tracker integration

## License

MIT License - Feel free to use, modify, and share!

## Credits

Created for D&D 2nd Edition enthusiasts who want to spend more time role-playing and less time calculating THAC0.

*"Roll for initiative... on your wrist!"* ⚔️

---

**Bangle.js** is a trademark of Espruino Ltd.  
**D&D** and **Advanced Dungeons & Dragons** are trademarks of Wizards of the Coast.