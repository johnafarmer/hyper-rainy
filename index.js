const CHAR_SIZE = 14;

const ACTIVE_DURATION = 3000; // Longer duration for chill effect
const TYPING_CHECK_INTERVAL = 100;

let globalConfig = {
  opacity: 0.6,
  blur: '0px'
};

exports.decorateTerm = (Term, { React, notify }) => {
  return class extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.onDecorated = this.onDecorated.bind(this);
      this.onCursorMove = this.onCursorMove.bind(this);
      this.state = {
        rainActive: false
      };
      this._raindrops = [];
      this._overlay = null;
      this._canvas = null;
      this._ctx = null;
      this._animationId = null;
      this._lastTime = 0;
      this._activeTimeout = null;
      this._waterChars = '•·∘○◦⋅٠۰♦◊˚°';
    }

    onDecorated(term) {
      if (this.props.onDecorated) {
        this.props.onDecorated(term);
      }
      
      this._termDiv = term ? term.termRef : null;
      
      if (this._termDiv) {
        // Store reference to this instance for middleware access
        const termElement = this._termDiv.querySelector('.term_term');
        if (termElement) {
          termElement.__hyperRainyInstance = this;
        }
        
        // Also store globally as backup
        if (!window.__hyperRainyInstances) {
          window.__hyperRainyInstances = [];
        }
        window.__hyperRainyInstances.push(this);
        
        this._initOverlay();
        this._initCanvas();
        this._initRain();
        this._startAnimation();
        this._startContentMonitoring();
      }
    }

    _initOverlay() {
      this._overlay = document.createElement('div');
      this._overlay.classList.add('hyper-rainy-overlay');
      this._termDiv.insertBefore(this._overlay, this._termDiv.firstChild);
    }
    
    _initCanvas() {
      this._canvas = document.createElement('canvas');
      this._canvas.style.position = 'absolute';
      this._canvas.style.top = '0';
      this._canvas.style.left = '0';
      this._canvas.style.zIndex = '0';
      this._canvas.style.pointerEvents = 'none';
      this._ctx = this._canvas.getContext('2d');
      
      const updateCanvasSize = () => {
        if (this._overlay && this._termDiv) {
          // Make overlay visible temporarily to get measurements
          const wasActive = this._overlay.classList.contains('hyper-rainy-active');
          if (!wasActive) {
            this._overlay.classList.add('hyper-rainy-active');
          }
          
          const rect = this._overlay.getBoundingClientRect();
          
          if (!wasActive) {
            this._overlay.classList.remove('hyper-rainy-active');
          }
          
          if (rect.width > 0 && rect.height > 0) {
            this._canvas.width = rect.width;
            this._canvas.height = rect.height;
            this._initRain();
          } else {
            setTimeout(updateCanvasSize, 100);
          }
        }
      };
      
      // Wait a bit for DOM to settle
      setTimeout(updateCanvasSize, 50);
      window.addEventListener('resize', updateCanvasSize);
      
      this._overlay.appendChild(this._canvas);
    }

    _initRain() {
      if (!this._canvas) return;
      
      const columns = Math.floor(this._canvas.width / (CHAR_SIZE * 3)); // Fewer columns for sparse effect
      this._raindrops = [];
      
      for (let i = 0; i < columns; i++) {
        this._raindrops.push({
          x: Math.random() * this._canvas.width,
          y: Math.random() * -100 * CHAR_SIZE,
          speed: Math.random() * 1.5 + 0.5, // Slower speed
          windSpeed: Math.random() * 1.5 + 0.5, // Diagonal drift
          chars: [],
          brightness: Math.random() * 0.3 + 0.7,
          color: this._getRandomBlue()
        });
      }
    }

    _getRandomBlue() {
      const blues = ['#4A90E2', '#6BB6FF', '#5DADE2', '#3498DB', '#2E86C1'];
      return blues[Math.floor(Math.random() * blues.length)];
    }

    _drawRain(timestamp) {
      if (!this._ctx || !this._canvas) {
        return;
      }
      
      const deltaTime = timestamp - this._lastTime;
      this._lastTime = timestamp;
      
      // Only fade when rain is active
      if (this.state.rainActive) {
        this._ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
      } else {
        // Clear canvas when not active
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
      }
      
      if (!this.state.rainActive) return;
      
      this._ctx.font = `${CHAR_SIZE}px ${this.props.fontFamily || 'monospace'}`;
      
      this._raindrops.forEach(drop => {
        // Update position with diagonal movement
        drop.y += drop.speed * deltaTime * 0.05;
        drop.x += drop.windSpeed * deltaTime * 0.05;
        
        if (drop.y > this._canvas.height + 100 || drop.x > this._canvas.width + 50) {
          drop.x = Math.random() * this._canvas.width - 50;
          drop.y = Math.random() * -100 * CHAR_SIZE;
          drop.chars = [];
          drop.speed = Math.random() * 1.5 + 0.5;
          drop.windSpeed = Math.random() * 1.5 + 0.5;
          drop.brightness = Math.random() * 0.3 + 0.7;
          drop.color = this._getRandomBlue();
        }
        
        if (Math.random() > 0.97) { // Less frequent drops
          const char = this._waterChars[Math.floor(Math.random() * this._waterChars.length)];
          drop.chars.push({
            char,
            y: drop.y,
            x: drop.x,
            opacity: 1
          });
        }
        
        drop.chars = drop.chars.filter(char => {
          char.opacity -= 0.008; // Slower fade
          return char.opacity > 0;
        });
        
        drop.chars.forEach((char, index) => {
          // Convert hex to RGB for the drop color
          const rgb = this._hexToRgb(drop.color);
          const opacity = char.opacity * drop.brightness;
          this._ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
          this._ctx.fillText(char.char, char.x, char.y);
        });
        
        if (drop.chars.length > 0) {
          const lastChar = drop.chars[drop.chars.length - 1];
          this._ctx.shadowBlur = 6;
          this._ctx.shadowColor = drop.color;
          this._ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          this._ctx.fillText(lastChar.char, lastChar.x, lastChar.y);
          this._ctx.shadowBlur = 0;
        }
      });
    }

    _hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : {r: 74, g: 144, b: 226}; // Default blue
    }

    _startAnimation() {
      const animate = (timestamp) => {
        this._drawRain(timestamp);
        this._animationId = requestAnimationFrame(animate);
      };
      this._animationId = requestAnimationFrame(animate);
    }

    onCursorMove(cursorFrame) {
      if (this.props.onCursorMove) {
        this.props.onCursorMove(cursorFrame);
      }
      
      this.updateRainEffect(true);
    }
    
    updateRainEffect(typing) {
      if (typing) {
        if (!this.state.rainActive) {
          this.setState({ rainActive: true });
          if (this._overlay) {
            this._overlay.classList.add('hyper-rainy-active');
          }
          if (this._termDiv) {
            this._termDiv.classList.add('hyper-rainy-terminal-active');
          }
        }
        
        clearTimeout(this._activeTimeout);
        this._activeTimeout = setTimeout(() => {
          this.setState({ rainActive: false });
          if (this._overlay) {
            this._overlay.classList.remove('hyper-rainy-active');
          }
          if (this._termDiv) {
            this._termDiv.classList.remove('hyper-rainy-terminal-active');
          }
        }, ACTIVE_DURATION);
      }
    }

    _startContentMonitoring() {
      let lastContent = '';
      this._contentCheckInterval = setInterval(() => {
        if (this._termDiv) {
          const currentContent = this._termDiv.textContent || '';
          if (currentContent !== lastContent) {
            this.updateRainEffect(true);
            lastContent = currentContent;
          }
        }
      }, TYPING_CHECK_INTERVAL);
    }
    
    componentWillUnmount() {
      if (this._animationId) {
        cancelAnimationFrame(this._animationId);
      }
      if (this._contentCheckInterval) {
        clearInterval(this._contentCheckInterval);
      }
      // Clean up instance reference
      if (this._termDiv) {
        const termElement = this._termDiv.querySelector('.term_term');
        if (termElement && termElement.__hyperRainyInstance === this) {
          delete termElement.__hyperRainyInstance;
        }
      }
      // Clean up global reference
      if (window.__hyperRainyInstances) {
        const index = window.__hyperRainyInstances.indexOf(this);
        if (index > -1) {
          window.__hyperRainyInstances.splice(index, 1);
        }
      }
    }

    render() {
      return [
        React.createElement(Term, Object.assign({}, this.props, {
          onDecorated: this.onDecorated,
          onCursorMove: this.onCursorMove,
          backgroundColor: this.state.rainActive ? 'rgba(0, 0, 0, 0)' : this.props.backgroundColor
        })),
        React.createElement('style', {}, `
          .hyper-rainy-overlay {
            display: none;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: -1;
            pointer-events: none;
          }
          
          .hyper-rainy-terminal-active .term_fit .term_term {
            background: transparent !important;
          }
          
          .hyper-rainy-terminal-active > div > div {
            background: transparent !important;
          }
          
          .hyper-rainy-overlay.hyper-rainy-active {
            display: block;
            opacity: ${globalConfig.opacity};
            filter: blur(${globalConfig.blur});
          }
          
          .hyper-rainy-overlay canvas {
            width: 100%;
            height: 100%;
          }
        `)
      ];
    }
  };
};

exports.decorateConfig = (config) => {
  const rainConfig = config.hyperRainy || {};
  globalConfig.opacity = rainConfig.opacity || 0.6;
  globalConfig.blur = rainConfig.blur || '0px';
  
  return Object.assign({}, config, {
    css: `
      ${config.css || ''}
    `
  });
};

// Redux middleware to catch ALL terminal activity
exports.middleware = (store) => (next) => (action) => {
  // Trigger on any terminal data changes
  if (action.type === 'SESSION_USER_DATA' || 
      action.type === 'SESSION_PTY_DATA' || 
      action.type === 'SESSION_ADD_DATA' ||
      action.type === 'SESSION_SET_ACTIVE' ||
      action.type === 'TERM_WRITE') {
    
    // Try multiple methods to find rain instances
    const instances = [];
    
    // Method 1: Look for stored instances on term elements
    const terms = document.querySelectorAll('.term_term');
    terms.forEach(term => {
      if (term.__hyperRainyInstance) {
        instances.push(term.__hyperRainyInstance);
      }
    });
    
    // Method 2: Look for instances stored globally
    if (window.__hyperRainyInstances) {
      instances.push(...window.__hyperRainyInstances);
    }
    
    // Trigger rain on all found instances
    instances.forEach(instance => {
      if (instance && instance.updateRainEffect) {
        instance.updateRainEffect(true);
      }
    });
  }
  
  return next(action);
};