
const voiceToggle = document.getElementById('voice-toggle');


let ttsEnabled = localStorage.getItem('ttsEnabled') === 'true';


function updateIcon() {
  if (!voiceToggle) return;
  if (ttsEnabled) {
    voiceToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    voiceToggle.classList.add('active'); 
  } else {
    voiceToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    voiceToggle.classList.remove('active');
  }
}


updateIcon();


if (voiceToggle) {
  voiceToggle.addEventListener('click', () => {
    ttsEnabled = !ttsEnabled;
    localStorage.setItem('ttsEnabled', ttsEnabled);
    updateIcon();
  });
}


function speak(text) {
  if (!ttsEnabled || !text || !('speechSynthesis' in window)) return;

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}


document.addEventListener('click', (event) => {
  if (!ttsEnabled) return;

 
  if (event.target.closest('#voice-toggle')) return;

  const speakableElement = event.target.closest('.card, .nav-item');

  if (!speakableElement) return;

  
  let textToSpeak = speakableElement.innerText.trim();


  textToSpeak = textToSpeak.replace(/[\u{1F600}-\u{1F64F}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}]/gu, '');

  if (textToSpeak) {
    speak(textToSpeak);
  }
});











//emergency ko lagi
function triggerEmergency() {
  const id = Date.now(); // Unique timestamp
  localStorage.setItem("emergencyTriggered", id.toString());
   alert("🚨 Emergency triggered! Caregiver will be notified.");
}



