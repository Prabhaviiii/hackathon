if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission().then(permission => {
    if (permission !== "granted") {
      alert("Please allow notifications for reminders to work.");
    }
  });
}


function speak(text) {
  const ttsEnabled = localStorage.getItem('ttsEnabled') === 'true';
  if (!ttsEnabled || !('speechSynthesis' in window) || !text) return;
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-US";
  msg.rate = 1;
  window.speechSynthesis.speak(msg);
}

function isToday(dateStr) {
  const today = new Date();
  const date = new Date(dateStr);
  return today.toDateString() === date.toDateString();
}


window.onload = function () {
  const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
  schedules.forEach(schedule => {
    addReminderToDOM(schedule.title, schedule.time, schedule.date);
  });


  setInterval(checkForReminders, 1000);
};


function addReminder() {
  const text = document.getElementById("reminderText").value.trim();
  const time = document.getElementById("reminderTime").value;
  const date = document.getElementById("reminderDate").value;

  if (!text || !time || !date) {
    alert("Please enter reminder, time, and date!");
    return;
  }
  addReminderToDOM(text, time, date);

  let schedules = JSON.parse(localStorage.getItem('schedules')) || [];
  schedules.push({ title: text, time, date, notified: false });
  localStorage.setItem('schedules', JSON.stringify(schedules));

  speak(`Reminder added: ${text} at ${time} on ${new Date(date).toDateString()}`);

  document.getElementById("reminderText").value = "";
  document.getElementById("reminderTime").value = "";
  document.getElementById("reminderDate").value = "";
}

function addReminderToDOM(text, time, date) {
  const reminderList = document.getElementById("reminderList");
  const reminder = document.createElement("div");
  reminder.className = "reminder";
  reminder.innerHTML = `
    <div>
      <strong>${text}</strong><br />
      <small>${time} | ${new Date(date).toDateString()}</small>
    </div>
    <button class="done-btn">Done</button>
  `;

  reminder.querySelector('.done-btn').addEventListener('click', () => {
    reminderList.removeChild(reminder);
    removeFromLocalStorage(text, time, date);
    speak(`Reminder completed: ${text}`);
  });

  reminderList.appendChild(reminder);
}

function removeFromLocalStorage(title, time, date) {
  let schedules = JSON.parse(localStorage.getItem('schedules')) || [];
  schedules = schedules.filter(s => !(s.title === title && s.time === time && s.date === date));
  localStorage.setItem('schedules', JSON.stringify(schedules));
}

function checkForReminders() {
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0]; // yyyy-mm-dd
  const currentTime = now.toTimeString().slice(0, 5);   // HH:mm

  let schedules = JSON.parse(localStorage.getItem('schedules')) || [];

  schedules.forEach(reminder => {
    if (
      reminder.date === currentDate &&
      reminder.time === currentTime &&
      !reminder.notified
    ) {
    
      if (Notification.permission === "granted") {
        new Notification("⏰ Reminder", { body: reminder.title });
      }

    
      speak(`Reminder: ${reminder.title} at ${reminder.time}`);

      reminder.notified = true;
    }
  });

  localStorage.setItem('schedules', JSON.stringify(schedules));
}
