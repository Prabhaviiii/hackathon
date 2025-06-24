const moodOptions = document.querySelectorAll('.mood-option');
  let selectedMood = null;
  
  // Mood selection
  moodOptions.forEach(option => {
    option.addEventListener('click', () => {
      moodOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      selectedMood = option.dataset.mood;
    });
  });
  
  const intensityInput = document.getElementById('intensity');
  const intensityValue = document.getElementById('intensity-value');
  const moodHistory = document.getElementById('moodHistory');
  
  // Update intensity % text
  intensityInput.addEventListener('input', () => {
    intensityValue.textContent = `${intensityInput.value}%`;
  });
  
  // Mood-based messages
  const moodMessages = {
    Happy: "Yay! Keep smiling and sharing that light. 💛",
    Okay: "You're doing fine. Better vibes are on the way! 🌈",
    Neutral: "Feeling neutral? Try something fun today. 🌸",
    Sad: "It’s okay to be down. Be gentle with yourself. 💕",
    Angry: "Deep breaths. You’re stronger than the anger. 🔥"
  };
  
  // Voice helper: Only speak if toggle is enabled
  function speak(text) {
    const ttsEnabled = localStorage.getItem('ttsEnabled') === 'true';
    if (!ttsEnabled || !text || !('speechSynthesis' in window)) return;
  
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  }
  
  // Log mood and save
  function logMood() {
    if (!selectedMood) {
      showModal("Oops!", "Please select a mood first.");
      speak("Please select a mood first.");
      return;
    }
  
    const intensity = intensityInput.value;
    const now = new Date();
    const dateStr = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const message = moodMessages[selectedMood];
  
    const entry = {
      date: dateStr,
      mood: selectedMood,
      intensity,
      time: timeStr,
      message
    };
  
    let logs = JSON.parse(localStorage.getItem('moodLogs')) || [];
    logs.unshift(entry);
    localStorage.setItem('moodLogs', JSON.stringify(logs));
   

    
const weekday = now.toLocaleDateString(undefined, { weekday: 'long' });
localStorage.setItem(`mood-${weekday}`, JSON.stringify({
  mood: selectedMood,
  intensity: intensity,
  time: timeStr
}));

  
    renderMoodLogs();
  
    // Speak message if allowed
    speak(`${message}. Mood Intensity: ${intensity}%`);
  
    showModal(`You are feeling ${selectedMood}`, message + ` Mood Intensity: ${intensity}%`);
  }
  
  // Show mood history
  function renderMoodLogs() {
    const logs = JSON.parse(localStorage.getItem('moodLogs')) || [];
    if (logs.length === 0) {
      moodHistory.textContent = "No mood logged yet.";
      return;
    }
  
    moodHistory.innerHTML = "";
    const grouped = {};
  
    logs.forEach(log => {
      if (!grouped[log.date]) {
        grouped[log.date] = [];
      }
      grouped[log.date].push(log);
    });
  
    for (let date in grouped) {
      const dateHeader = document.createElement("h4");
      dateHeader.textContent = `📅 ${date}`;
      moodHistory.appendChild(dateHeader);
  
      grouped[date].forEach(entry => {
        const p = document.createElement("p");
        p.textContent = `- ${entry.mood} (${entry.intensity}%) at ${entry.time}: ${entry.message}`;
        moodHistory.appendChild(p);
      });
    }
  }
  
  // Clear logs
  function clearMoodLogs() {
    localStorage.removeItem("moodLogs");
    renderMoodLogs();
  }
  
  // Modal logic
  function showModal(title, message) {
    document.getElementById('moodTitle').textContent = title;
    document.getElementById('moodMessage').textContent = message;
    document.getElementById('moodModal').style.display = "block";
  }
  
  document.querySelector(".close-btn").addEventListener("click", () => {
    document.getElementById('moodModal').style.display = "none";
  });
  
  window.addEventListener("click", (event) => {
    if (event.target === document.getElementById('moodModal')) {
      document.getElementById('moodModal').style.display = "none";
    }
  });
  
  window.onload = renderMoodLogs;