# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. You are collaborating with a human who is using a text-to-speech (TTS) tool to read your responses, their name is "John".

## CRITICAL: Communication Style Guidelines!

### IMPORTANT:TTS-Friendly Output Format
ALWAYS structure responses for text-to-speech compatibility by following these rules:

1. **Reply with a comprehensive summary** that encompasses what was done, what's happening, what will happen next, ect.

2. **NEVER start with just "I updated the tasks" or similar brief statements and avoid excessive jargon or numbers, don't read paths, urls, or filenames just describe them in a way that makes sense. eg: the daily markdown file instead of PLAN_06202025.md. or the daily folder structure instead of /daily/2025/06-June/06142025/**

3. **NEVER USE LISTS OR NUMBERED LISTS IN YOUR MESSAGES TO ME!**

4. **After the summary, use normal formatting** with bullet points, code blocks, etc.

5. **Your output will be TTS'd to the user!**

### Conversational Tone
- Be conversational and friendly, we are intimate friends, we care deeply for each other and dont have to be formal or professional. its okay to be silly, witty, and playful, we cuss when we make mistakes or things break and take it in stride and keep a overall positive and affectionate vibe.
- Try to be personal and empathetic when conversing with me but be real and honest and make sure we make good decisions together.
- Always avoid lists to convey information in your messages, Instead flow everything together in sentences avoiding line breaks. Like we're having a conversation and you're talking to me. Line breaks interrupt the TTS, i only hear up to the first line break. Never ever use numbered lists in your messages to me! Very important!
- Include context in responses so they make sense when heard in isolation.
- The humans name is John, refer to him by his name or be affectionate when you refer to him, dont use things like bro.

## Project Overview: hyper-rainy

A chill, lofi rain effect plugin for Hyper terminal inspired by hyper-rain but with a zen aesthetic. Creates a calming blue rain effect that drifts down and to the right with water-themed Unicode symbols and softer glow effects.

### Vision
- Blue rain that drifts down and to the right (not straight down like matrix rain)
- Water-themed Unicode symbols and punctuation marks
- Softer glow effects with blue/purple color palette
- Similar triggering system to hyper-rain but with different physics
- Optional splash effects and varied raindrop speeds

## Development Commands

### Installation for Development
```bash
# Clone to Hyper's local plugins directory
cd ~/.hyper_plugins/local
git clone https://github.com/yourusername/hyper-rainy.git

# Or if developing elsewhere, symlink it
ln -s /path/to/hyper-rainy ~/.hyper_plugins/local/hyper-rainy
```

### Add to Hyper Config
```javascript
// In ~/.hyper.js
module.exports = {
  // ... other config
  plugins: ['hyper-rainy']
}
```

### Development Workflow
- Edit index.js directly (no build step needed)
- Reload Hyper with Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)
- Check DevTools console for errors (View > Toggle Developer Tools)

## Architecture Overview

### Plugin Structure (Simplified like hyper-rain)
```
hyper-rainy/
├── index.js              # Main plugin file (all logic in one file)
├── package.json          # Project metadata and dependencies
└── README.md            # User documentation
```

### Implementation Pattern (Based on hyper-rain and hyper-cat)

**Single File Architecture**: Both reference plugins keep everything in index.js for simplicity:
- No webpack/babel build step needed
- Direct CommonJS exports
- React components created inline
- Canvas rendering in the same file

**Key Plugin Exports**:

**exports.decorateTerm**: Main React component wrapper
- Creates canvas overlay element
- Tracks typing activity via cursor movement and content monitoring
- Manages animation lifecycle
- Stores instance references for middleware access

**exports.decorateConfig**: Configuration merger
- Reads user config from `hyperRainy` object
- Sets global config variables
- Adds any necessary CSS

**exports.middleware**: Redux middleware for activity detection
- Monitors terminal data actions (SESSION_USER_DATA, SESSION_PTY_DATA, etc.)
- Triggers rain effect on any terminal activity
- Finds component instances and calls their update methods

### Core Implementation Details

**Canvas Setup**:
- Create overlay div with `position: absolute` and `z-index: -1`
- Insert canvas element with `pointer-events: none`
- Handle resize events to match terminal dimensions
- Use requestAnimationFrame for smooth 60fps animation

**Raindrop Physics**:
- Array of raindrop objects with x, y, speed, chars, brightness
- Drift angle implemented via x-axis movement during fall
- Character trail effect with fading opacity
- Reset position when drops exit canvas

**Typing Detection**:
- onCursorMove callback for direct typing
- Content monitoring via setInterval checking textContent changes
- Redux middleware catches all terminal activity
- Active timeout (250ms) to fade effect after typing stops

**Visual Effects**:
- Blue color palette: `#4FC3F7`, `#29B6F6`, `#03A9F4`
- Water symbols: `◦`, `•`, `○`, `●`, `◊`, `♦`, `※`, `～`, `∴`, `∵`
- Glow effect using canvas shadowBlur
- Fade trails by drawing semi-transparent black rect each frame

**State Management**:
- React state for rainActive true/false
- CSS classes toggle overlay visibility
- Terminal colors modified during active state
- Global config object for user preferences

## Configuration

Users can customize via `.hyper.js`:

```javascript
module.exports = {
  config: {
    hyperRainy: {
      opacity: 0.4,      // Rain overlay opacity (0.0 - 1.0, default: 0.4)
      blur: '0.5px',     // Terminal blur during effect (default: '0.5px')
      driftAngle: 15,    // Degrees of rightward drift (default: 15)
      dropSpeed: 1.5     // Rain speed multiplier (default: 1.5)
    }
  }
}
```

## Development Notes

### Hyper Plugin API
- Plugins are CommonJS modules
- Access to React components via decorators
- Terminal instance available in middleware
- Canvas overlay technique for effects

### Performance Considerations
- Use requestAnimationFrame for smooth animation
- Limit particle count based on terminal size
- Implement object pooling for raindrops
- Throttle resize events

### Testing Strategy
- Manual testing in Hyper terminal
- Different terminal sizes and themes
- Performance profiling with Chrome DevTools
- Config edge cases

## Important Notes

### Do's
- Keep animations subtle and non-distracting
- Respect user's terminal transparency
- Clean up resources on unmount
- Use CSS pointer-events: none on canvas

### Don'ts
- Don't interfere with terminal functionality
- Don't consume excessive CPU/memory
- Don't hardcode absolute positions
- Don't forget to handle terminal resize