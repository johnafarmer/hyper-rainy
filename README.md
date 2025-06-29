# hyper-rainy 🌧️💙

> Chill lofi rain for your Hyper terminal - because sometimes you need zen, not the matrix

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌊 What is this?

`hyper-rainy` brings a peaceful, lofi rain effect to your Hyper terminal! Inspired by [hyper-rain](https://github.com/johnafarmer/hyper-rain), this plugin transforms the intense matrix vibes into something more zen - think rain on a window during a cozy coding session.

The effect features blue water drops that drift diagonally down and to the right, creating a calming atmosphere while you work. It activates when you type and gently fades away when you pause.

## ✨ Features

- **Chill blue rain** - Soft water drops in various shades of blue
- **Diagonal drift** - Rain falls naturally at an angle, like wind-blown rain on glass
- **Type-activated** - Starts when you type, fades after 3 seconds of inactivity
- **Water symbols** - Uses dots, circles, and water-themed Unicode characters
- **Subtle glow** - Soft blue glow effects without the intensity
- **Fully customizable** - Adjust colors, speed, opacity, and more

## 📦 Installation

1. Clone this repository and copy the hyper-rainy folder to your `/Users/yourusername/.hyper_plugins/local` folder. (**Tip**: Press cmd + shift + . to show the hidden .hyper_plugins folder in finder)
2. Add `hyper-rainy` to the local plugins array in your `~/.hyper.js` config file:

```javascript
module.exports = {
  // ... other config
  localPlugins: ['hyper-rainy']
}
```

### Why Local Only? 🌧️

Following the hyper-rain tradition - sometimes the best plugins are the ones you install yourself 💙

## ⚙️ Configuration

You can customize the rain effect by adding a `hyperRainy` section to your `~/.hyper.js` config:

```javascript
module.exports = {
  config: {
    // ... other config
    hyperRainy: {
      opacity: 0.6,      // Rain overlay opacity (0.0 - 1.0, default: 0.6)
      blur: '0px',       // Terminal blur during effect (default: '0px')
      symbols: ['•', '·', '∘', '○', '◦', '⋅', '٠', '۰', '♦', '◊'],
      colors: ['#4A90E2', '#6BB6FF', '#5DADE2', '#3498DB', '#2E86C1'],
      minSpeed: 2,       // Minimum fall speed
      maxSpeed: 5,       // Maximum fall speed
      windSpeed: 1,      // Horizontal drift speed
      fontSize: 14,      // Size of rain drops
      glowAmount: 4      // Glow intensity
    }
  }
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `opacity` | number | `0.6` | Controls the transparency of the rain effect overlay |
| `blur` | string | `'0px'` | Applies a blur filter to the terminal content during the effect |
| `symbols` | array | Water symbols | Array of characters to use as rain drops |
| `colors` | array | Blue shades | Array of hex colors for the rain |
| `minSpeed` | number | `2` | Minimum vertical falling speed |
| `maxSpeed` | number | `5` | Maximum vertical falling speed |
| `windSpeed` | number | `1` | Horizontal drift speed (creates the diagonal effect) |
| `fontSize` | number | `14` | Size of the rain drop characters |
| `glowAmount` | number | `4` | Intensity of the glow effect |

## 🎨 Visual Style

Unlike the intense matrix rain, hyper-rainy creates a peaceful atmosphere with:
- Soft blue colors ranging from sky blue to deep ocean
- Water-themed Unicode characters that look like actual rain drops
- Diagonal movement that mimics rain on a window
- Gentle glow effects for that lofi aesthetic
- Sparse drops for a less overwhelming effect

## 🤝 Contributing

Want to make the rain even more chill? Feel free to:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/more-zen`)
3. Commit your changes (`git commit -m 'Add even more chill vibes'`)
4. Push to the branch (`git push origin feature/more-zen`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [hyper-cat](https://github.com/Aaronius/hyper-cat) - for showing us terminals can be fun
- The Hyper terminal team - for making customization so easy

---

<p align="center">Made with 💙 by John & Claude during a rainy day</p>