class Stopwatch {
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.running = false;
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.startTime = Date.now() - this.elapsedTime;
        this.timerInterval = setInterval(() => this.update(), 10);
    }

    pause() {
        if (!this.running) return;
        this.running = false;
        clearInterval(this.timerInterval);
        this.elapsedTime = Date.now() - this.startTime;
    }

    reset() {
        this.running = false;
        clearInterval(this.timerInterval);
        this.elapsedTime = 0;
        this.startTime = 0;
        this.displayElement.textContent = Stopwatch.formatTime(0);
    }

    update() {
        this.elapsedTime = Date.now() - this.startTime;
        this.displayElement.textContent = Stopwatch.formatTime(this.elapsedTime);
    }

    getCurrentTime() {
        return this.running ? Date.now() - this.startTime : this.elapsedTime;
    }

    static formatTime(ms) {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = ms % 1000;

        return (
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0') + '.' +
            String(milliseconds).padStart(3, '0')
        );
    }
}

class Competitor {
    constructor(name, timeMs) {
        this.id = Date.now() + Math.random();
        this.name = name;
        this.timeMs = timeMs;
    }

    getFormattedTime() {
        return Stopwatch.formatTime(this.timeMs);
    }
}

class Competition {
    constructor() {
        this.competitors = [];
    }

    addCompetitor(competitor) {
        this.competitors.push(competitor);
        this.sortByTime();
    }

    removeCompetitor(id) {
        this.competitors = this.competitors.filter(c => c.id !== id);
    }

    sortByTime() {
        this.competitors.sort((a, b) => a.timeMs - b.timeMs);
    }

    getFirstTime() {
        return this.competitors.length > 0 ? this.competitors[0].timeMs : 0;
    }

    getDiffWithFirst(competitor) {
        const first = this.getFirstTime();
        return competitor.timeMs - first;
    }

    getDiffWithPrevious(index) {
        if (index <= 0) return 0;
        return this.competitors[index].timeMs - this.competitors[index - 1].timeMs;
    }

    clear() {
        this.competitors = [];
    }

    getCount() {
        return this.competitors.length;
    }
}

class App {
    constructor() {
        this.timerDisplay = document.getElementById('timerDisplay');
        this.btnStart = document.getElementById('btnStart');
        this.btnPause = document.getElementById('btnPause');
        this.btnReset = document.getElementById('btnReset');
        this.btnCapture = document.getElementById('btnCapture');
        this.btnClearAll = document.getElementById('btnClearAll');
        this.competitorName = document.getElementById('competitorName');
        this.resultsSection = document.getElementById('resultsSection');
        this.resultsBody = document.getElementById('resultsBody');

        this.stopwatch = new Stopwatch(this.timerDisplay);
        this.competition = new Competition();

        this.bindEvents();
    }

    bindEvents() {
        this.btnStart.addEventListener('click', () => this.handleStart());
        this.btnPause.addEventListener('click', () => this.handlePause());
        this.btnReset.addEventListener('click', () => this.handleReset());
        this.btnCapture.addEventListener('click', () => this.handleCapture());
        this.btnClearAll.addEventListener('click', () => this.handleClearAll());

        this.competitorName.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.btnCapture.disabled) {
                this.handleCapture();
            }
        });
    }

    handleStart() {
        this.stopwatch.start();
        this.btnStart.disabled = true;
        this.btnPause.disabled = false;
        this.btnReset.disabled = false;
        this.btnCapture.disabled = false;
    }

    handlePause() {
        this.stopwatch.pause();
        this.btnStart.disabled = false;
        this.btnPause.disabled = true;
    }

    handleReset() {
        this.stopwatch.reset();
        this.btnStart.disabled = false;
        this.btnPause.disabled = true;
        this.btnReset.disabled = true;
        this.btnCapture.disabled = true;
    }

    handleCapture() {
        const name = this.competitorName.value.trim();
        if (!name) {
            this.competitorName.focus();
            this.competitorName.style.borderColor = '#ef4444';
            setTimeout(() => { this.competitorName.style.borderColor = ''; }, 1500);
            return;
        }

        const currentTime = this.stopwatch.getCurrentTime();
        const competitor = new Competitor(name, currentTime);
        this.competition.addCompetitor(competitor);
        this.competitorName.value = '';
        this.competitorName.focus();
        this.renderResults();
    }

    handleClearAll() {
        this.competition.clear();
        this.renderResults();
    }

    renderResults() {
        const competitors = this.competition.competitors;

        if (competitors.length === 0) {
            this.resultsSection.style.display = 'none';
            return;
        }

        this.resultsSection.style.display = '';
        this.resultsBody.innerHTML = '';

        competitors.forEach((comp, index) => {
            const tr = document.createElement('tr');

            const diffFirst = this.competition.getDiffWithFirst(comp);
            const diffPrev = this.competition.getDiffWithPrevious(index);

            const posClass = index < 3 ? `pos-${index + 1}` : '';
            const posLabel = index === 0 ? '1°' : `${index + 1}°`;

            tr.innerHTML = `
                <td class="pos-cell ${posClass}">${posLabel}</td>
                <td class="name-cell">${this.escapeHtml(comp.name)}</td>
                <td class="time-cell">${comp.getFormattedTime()}</td>
                <td class="diff-cell ${index === 0 ? 'is-first' : ''}">
                    ${index === 0 ? '—' : '+' + Stopwatch.formatTime(diffFirst)}
                </td>
                <td class="diff-cell">
                    ${index === 0 ? '—' : '+' + Stopwatch.formatTime(diffPrev)}
                </td>
                <td>
                    <button class="btn-delete" data-id="${comp.id}" title="Eliminar">✕</button>
                </td>
            `;

            const deleteBtn = tr.querySelector('.btn-delete');
            deleteBtn.addEventListener('click', () => {
                this.competition.removeCompetitor(comp.id);
                this.renderResults();
            });

            this.resultsBody.appendChild(tr);
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});
