// Global variables
let timerInterval = null;
let timerDuration = 5 * 60; // 5 minutes in seconds
let currentTime = timerDuration;
let isTimerRunning = false;
let breathingInterval = null;
let isBreathingActive = false;

// Mindfulness quotes
const mindfulnessQuotes = [
    "The present moment is the only time over which we have dominion.",
    "Wherever you are, be there totally.",
    "Peace comes from within. Do not seek it without.",
    "The best way to capture moments is to pay attention.",
    "Mindfulness is about being fully awake in our lives.",
    "Take time to slow down and appreciate the simple things.",
    "Breathe in peace, breathe out stress.",
    "Every moment is a fresh beginning.",
    "Be present in all things and thankful for all things.",
    "The quieter you become, the more you can hear.",
    "Slow down and everything you are chasing will come around and catch you.",
    "In the midst of movement and chaos, keep stillness inside of you.",
    "The art of living is more like wrestling than dancing.",
    "Calm mind brings inner strength and self-confidence.",
    "Take a deep breath and just be in this moment."
];

// DOM elements
const timerMinutes = document.getElementById('timer-minutes');
const timerSeconds = document.getElementById('timer-seconds');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const durationBtns = document.querySelectorAll('.duration-btn');
const breathingCircle = document.getElementById('breathing-circle');
const breathingText = document.getElementById('breathing-text');
const breathingBtn = document.getElementById('breathing-btn');
const quoteText = document.getElementById('quote-text');
const newQuoteBtn = document.getElementById('new-quote-btn');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    updateTimerDisplay();
    displayRandomQuote();
    setupEventListeners();
});

function setupEventListeners() {
    // Timer controls
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    // Duration buttons
    durationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!isTimerRunning) {
                const minutes = parseInt(this.dataset.minutes);
                setTimerDuration(minutes);
                updateActiveDurationButton(this);
            }
        });
    });
    
    // Breathing exercise
    breathingBtn.addEventListener('click', toggleBreathing);
    
    // New quote button
    newQuoteBtn.addEventListener('click', displayRandomQuote);
}

// Timer Functions
function updateTimerDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timerMinutes.textContent = minutes.toString().padStart(2, '0');
    timerSeconds.textContent = seconds.toString().padStart(2, '0');
}

function setTimerDuration(minutes) {
    timerDuration = minutes * 60;
    currentTime = timerDuration;
    updateTimerDisplay();
}

function updateActiveDurationButton(activeBtn) {
    durationBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        timerInterval = setInterval(function() {
            currentTime--;
            updateTimerDisplay();
            
            if (currentTime <= 0) {
                timerComplete();
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    currentTime = timerDuration;
    updateTimerDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

function timerComplete() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    // Show completion message
    alert('Time for a break! Take a moment to stretch, breathe, or step away from your screen.');
    
    // Reset timer
    currentTime = timerDuration;
    updateTimerDisplay();
}

// Breathing Exercise Functions
function toggleBreathing() {
    if (!isBreathingActive) {
        startBreathing();
    } else {
        stopBreathing();
    }
}

function startBreathing() {
    isBreathingActive = true;
    breathingBtn.textContent = 'Stop Breathing';
    
    let isInhaling = true;
    
    function breathingCycle() {
        if (isInhaling) {
            breathingCircle.classList.remove('exhale');
            breathingCircle.classList.add('inhale');
            breathingText.textContent = 'Inhale';
        } else {
            breathingCircle.classList.remove('inhale');
            breathingCircle.classList.add('exhale');
            breathingText.textContent = 'Exhale';
        }
        isInhaling = !isInhaling;
    }
    
    // Start immediately
    breathingCycle();
    
    // Continue every 4 seconds (4 seconds in, 4 seconds out)
    breathingInterval = setInterval(breathingCycle, 4000);
}

function stopBreathing() {
    isBreathingActive = false;
    breathingBtn.textContent = 'Start Breathing';
    clearInterval(breathingInterval);
    
    // Reset breathing circle
    breathingCircle.classList.remove('inhale', 'exhale');
    breathingText.textContent = 'Breathe';
}

// Quote Functions
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * mindfulnessQuotes.length);
    const quote = mindfulnessQuotes[randomIndex];
    
    // Add a nice fade effect
    quoteText.style.opacity = '0';
    
    setTimeout(() => {
        quoteText.textContent = `"${quote}"`;
        quoteText.style.opacity = '1';
    }, 200);
}

// Add smooth transition for quote changes
quoteText.style.transition = 'opacity 0.3s ease';

// Optional: Auto-refresh quote every 30 seconds
setInterval(() => {
    if (!isBreathingActive && !isTimerRunning) {
        displayRandomQuote();
    }
}, 30000);

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Spacebar to start/pause timer
    if (event.code === 'Space' && !event.target.matches('button')) {
        event.preventDefault();
        if (!isTimerRunning) {
            startTimer();
        } else {
            pauseTimer();
        }
    }
    
    // R key to reset timer
    if (event.code === 'KeyR' && !event.target.matches('button')) {
        event.preventDefault();
        resetTimer();
    }
    
    // B key to toggle breathing
    if (event.code === 'KeyB' && !event.target.matches('button')) {
        event.preventDefault();
        toggleBreathing();
    }
    
    // Q key for new quote
    if (event.code === 'KeyQ' && !event.target.matches('button')) {
        event.preventDefault();
        displayRandomQuote();
    }
});

// Add notification support if available
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: '/favicon.ico' // You can add a favicon later
        });
    }
}

// Request notification permission on first interaction
document.addEventListener('click', requestNotificationPermission, { once: true });