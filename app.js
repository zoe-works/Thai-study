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

            default:
                return null;
        }
    }

    resolveValue(path) {
        if (!path.includes('.')) return path;
        const parts = path.split('.');
        let val = this.state;
        for (const part of parts) {
            if (val[part] === undefined) return path;
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
            case 'next_question':
                this.pickRandomChar();
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
