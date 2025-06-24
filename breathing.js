 const circle = document.getElementById('circle');
const instruction = document.getElementById('instruction');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const timerDisplay = document.getElementById('timer');

let sessionTime = 60; 
let totalTime = sessionTime;
let breathingInterval;
let sessionInterval;

function speak(text) {
  const ttsEnabled = localStorage.getItem('ttsEnabled') === 'true';
  if (!ttsEnabled || !('speechSynthesis' in window) || !text) return;
  
  window.speechSynthesis.cancel(); 
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}

function startBreathing() {
  instruction.textContent = "Inhale...";
  speak("Breathing exercise started. Inhale.");
  circle.style.transform = "scale(1.5)";
  
  breathingInterval = setInterval(() => {
    if (instruction.textContent === "Inhale...") {
      instruction.textContent = "Hold...";
      speak("Hold");
    } else if (instruction.textContent === "Hold...") {
      instruction.textContent = "Exhale...";
      circle.style.transform = "scale(1)";
      speak("Exhale");
    } else {
      instruction.textContent = "Inhale...";
      circle.style.transform = "scale(1.5)";
      speak("Inhale");
    }
  }, 4000);

  sessionInterval = setInterval(() => {
    sessionTime--;
    timerDisplay.textContent = `Time Left: ${sessionTime}s`;
    
    if (sessionTime <= 0) {
      stopBreathing();
      instruction.textContent =  "Session Complete!";
      speak("Session complete");
    }
  }, 1000);
}

function stopBreathing() {
  clearInterval(breathingInterval);
  clearInterval(sessionInterval);
  startBtn.disabled = false;
  stopBtn.style.display = 'none';
  startBtn.style.display = 'inline-block';
  timerDisplay.textContent = "";
  instruction.textContent = "Stopped";
  sessionTime = totalTime;
  speak("Breathing exercise stopped");
}

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  startBtn.style.display = 'none';
  stopBtn.style.display = 'inline-block';
  sessionTime = totalTime;
  timerDisplay.textContent = `Time Left: ${sessionTime}s`;
  startBreathing();
});

stopBtn.addEventListener('click', () => {
  stopBreathing();
});
