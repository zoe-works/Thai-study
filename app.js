/**
 * Thai Study App Engine
 * JSONベースの動的画面生成エンジン (Enhanced)
 */

class AppEngine {
    constructor(config) {
        this.config = config;
        this.state = {
            currentScreenId: 'home',
            score: 0,
            learned_count: parseInt(localStorage.learned_count || 0),
            current_char: config.data.consonants[0],
            quiz_options: [],
            studyMode: localStorage.studyMode || 'random', // 'random' or 'sequential'
        };

        this.screenContainer = document.getElementById('screen-container');
        this.screenTitle = document.getElementById('screen-title');
        this.scoreDisplay = document.getElementById('score-display');
        this.btnBack = document.getElementById('btn-back');
        this.loadingScreen = document.getElementById('loading');
        this.appContainer = document.getElementById('app');

        this.init();
    }

    init() {
        // Setup Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const screenId = item.getAttribute('data-screen');
                this.navigate(screenId);
                
                // Update nav UI
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });

        this.btnBack.addEventListener('click', () => this.navigate('home'));

        // Load first screen
        setTimeout(() => {
            this.loadingScreen.classList.add('hidden');
            this.appContainer.classList.remove('hidden');
            this.navigate('home');
        }, 500);
    }

    navigate(screenId) {
        const screen = this.config.screens.find(s => s.id === screenId);
        if (!screen) return;

        this.state.currentScreenId = screenId;
        this.screenTitle.textContent = screen.title;
        
        if (screenId === 'home') {
            this.btnBack.classList.add('hidden');
        } else {
            this.btnBack.classList.remove('hidden');
        }

        // Run on_load
        if (screen.on_load) {
            this.executeLogic(screen.on_load);
        }

        this.renderScreen(screen);
    }

    renderScreen(screen) {
        this.screenContainer.innerHTML = '';
        
        screen.components.forEach(comp => {
            const el = this.createComponent(comp);
            if (el) this.screenContainer.appendChild(el);
        });

        this.updateGlobalUI();
        this.screenContainer.scrollTop = 0;
    }

    createComponent(comp) {
        switch (comp.type) {
            case 'text_display':
                const txt = document.createElement('div');
                txt.className = `text-display ${comp.size || 'medium'}`;
                txt.textContent = this.resolveValue(comp.value);
                return txt;

            case 'button':
                const btn = document.createElement('button');
                btn.className = 'btn btn-primary';
                btn.textContent = comp.label;
                btn.onclick = () => this.executeLogic(comp.action);
                return btn;

            case 'button_group':
                const group = document.createElement('div');
                group.className = 'button-group';
                const options = this.state[comp.options] || [];
                
                options.forEach(opt => {
                    const optBtn = document.createElement('button');
                    optBtn.className = 'quiz-option';
                    optBtn.textContent = opt;
                    optBtn.onclick = () => {
                        const correct = this.resolveValue(comp.target);
                        this.executeLogic(comp.validate, { input: opt, correct });
                    };
                    group.appendChild(optBtn);
                });
                return group;

            case 'char_grid':
                const grid = document.createElement('div');
                grid.className = 'char_grid';
                const charData = this.config.data[comp.data] || [];
                
                charData.forEach(char => {
                    const item = document.createElement('div');
                    item.className = 'grid-item';
                    if (this.state.current_char && this.state.current_char.id === char.id) {
                        item.classList.add('active');
                    }
                    item.innerHTML = `
                        <div class="char thai-font">${char.char}</div>
                        <div class="label">${char.name.split(' ')[0]}</div>
                    `;
                    item.onclick = () => {
                        this.state.current_char = char;
                        this.executeLogic(comp.action);
                    };
                    grid.appendChild(item);
                });
                return grid;

            case 'trace_canvas':
                const container = document.createElement('div');
                container.className = 'trace-container';
                
                const canvas = document.createElement('canvas');
                canvas.className = 'trace-canvas';
                const ctx = canvas.getContext('2d');
                
                // Set canvas size based on container
                setTimeout(() => {
                    const rect = container.getBoundingClientRect();
                    canvas.width = rect.width;
                    canvas.height = rect.width; // Square canvas
                    
                    // Draw guide character (light gray)
                    ctx.font = `${rect.width * 0.7}px 'Maitree', 'Angsana New', 'Noto Sans Thai'`;
                    ctx.fillStyle = '#f1f5f9';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(this.resolveValue(comp.target), canvas.width / 2, canvas.height / 2);
                }, 0);

                let drawing = false;
                const startDraw = (e) => {
                    drawing = true;
                    ctx.beginPath();
                    const pos = this.getCanvasPos(canvas, e);
                    ctx.moveTo(pos.x, pos.y);
                };
                const doDraw = (e) => {
                    if (!drawing) return;
                    e.preventDefault();
                    const pos = this.getCanvasPos(canvas, e);
                    ctx.lineTo(pos.x, pos.y);
                    ctx.lineWidth = 10;
                    ctx.lineCap = 'round';
                    ctx.strokeStyle = '#6366f1';
                    ctx.stroke();
                };
                const stopDraw = () => { drawing = false; };

                canvas.addEventListener('mousedown', startDraw);
                canvas.addEventListener('mousemove', doDraw);
                canvas.addEventListener('mouseup', stopDraw);
                canvas.addEventListener('touchstart', startDraw);
                canvas.addEventListener('touchmove', doDraw);
                canvas.addEventListener('touchend', stopDraw);

                const clearBtn = document.createElement('button');
                clearBtn.className = 'btn';
                clearBtn.textContent = '消去';
                clearBtn.onclick = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    // redraw guide
                    ctx.fillStyle = '#f1f5f9';
                    ctx.fillText(this.resolveValue(comp.target), canvas.width / 2, canvas.height / 2);
                };

                container.appendChild(canvas);
                container.appendChild(clearBtn);
                return container;

            case 'mode_toggle':
                const toggleContainer = document.createElement('div');
                toggleContainer.className = 'mode-toggle-container';
                const modes = [
                    { id: 'random', label: 'ランダム' },
                    { id: 'sequential', label: '順番に' }
                ];
                modes.forEach(m => {
                    const mBtn = document.createElement('button');
                    mBtn.className = `toggle-btn ${this.state.studyMode === m.id ? 'active' : ''}`;
                    mBtn.textContent = m.label;
                    mBtn.onclick = () => {
                        this.state.studyMode = m.id;
                        localStorage.studyMode = m.id;
                        this.refreshScreen();
                    };
                    toggleContainer.appendChild(mBtn);
                });
                return toggleContainer;

            default:
                return null;
        }
    }

    resolveValue(path) {
        if (path === 'version') return this.config.version;
        if (!path.includes('.')) return path;
        const parts = path.split('.');
        let val = this.state;
        for (const part of parts) {
            if (val[part] === undefined) return "";
            val = val[part];
        }
        return val;
    }

    executeLogic(logicStr, context = {}) {
        if (!logicStr) return;
        
        // Handle multiple commands
        if (logicStr.includes(';')) {
            logicStr.split(';').forEach(cmd => this.executeLogic(cmd.trim(), context));
            return;
        }

        // Action commands
        const [action, arg] = logicStr.includes(':') ? logicStr.split(':') : [logicStr, ''];

        switch (action) {
            case 'navigate':
                this.navigate(arg);
                break;
            case 'pick_random_char':
                this.pickRandomChar();
                this.refreshScreen();
                break;
            case 'generate_options':
                this.generateOptions();
                break;
            case 'speak':
                this.speak(this.resolveValue(arg));
                break;
            case 'next_char':
                this.nextChar();
                this.refreshScreen();
                break;
            case 'next_question':
                this.nextChar();
                this.generateOptions();
                this.refreshScreen();
                break;
            default:
                // Handle complex validate scripts from config
                if (logicStr.includes('validate')) {
                    const { input, correct } = context;
                    if (input === correct) {
                        this.state.score++;
                        this.state.learned_count++;
                        localStorage.learned_count = this.state.learned_count;
                        this.showToast('✅ 正解！');
                        this.executeLogic('next_question');
                    } else {
                        this.showToast('❌ 不正解...');
                        setTimeout(() => this.executeLogic('next_question'), 1000);
                    }
                    this.updateGlobalUI();
                }
        }
    }

    nextChar() {
        const pool = [...this.config.data.consonants, ...this.config.data.vowels];
        if (this.state.studyMode === 'random') {
            this.state.current_char = pool[Math.floor(Math.random() * pool.length)];
        } else {
            const currentIndex = pool.findIndex(c => c.id === this.state.current_char.id);
            const nextIndex = (currentIndex + 1) % pool.length;
            this.state.current_char = pool[nextIndex];
        }
    }

    pickRandomChar() {
        const pool = [...this.config.data.consonants, ...this.config.data.vowels];
        this.state.current_char = pool[Math.floor(Math.random() * pool.length)];
    }

    generateOptions() {
        if (!this.state.current_char) return;
        const correct = this.state.current_char.sound;
        const pool = [...this.config.data.consonants, ...this.config.data.vowels]
            .map(c => c.sound)
            .filter(s => s !== correct);
        
        const shuffled = [...new Set(pool)].sort(() => 0.5 - Math.random());
        const options = [correct, ...shuffled.slice(0, 3)];
        this.state.quiz_options = options.sort(() => 0.5 - Math.random());
    }

    speak(text) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'th-TH';
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    }

    refreshScreen() {
        const screen = this.config.screens.find(s => s.id === this.state.currentScreenId);
        if (screen) this.renderScreen(screen);
    }

    updateGlobalUI() {
        this.scoreDisplay.textContent = `Score: ${this.state.score}`;
    }

    getCanvasPos(canvas, e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast show';
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 2000);
    }
}

// Start the engine
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AppEngine(CONFIG);
});
