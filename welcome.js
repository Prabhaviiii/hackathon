


  function updateGreetingDateTime() {
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0'); 

  const ampm = hours >= 12 ? 'PM' : 'AM';

  let displayHours = hours % 12;
  if (displayHours === 0) displayHours = 12;

  const formattedTime = `${displayHours}:${minutes} ${ampm}`;

  document.getElementById('time-display').textContent = formattedTime;

  let greeting = '';
  if (hours < 12) {
    greeting = 'Good Morning!';
  } else if (hours < 18) {
    greeting = 'Good Afternoon!';
  } else {
    greeting = 'Good Evening!';
  }

  document.getElementById('greeting-text').textContent = greeting;

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString(undefined, dateOptions);

 
  document.getElementById('date-text').textContent = formattedDate;
}

navigator.permissions?.query({ name: 'microphone' }).then(result => {
  if (result.state === 'denied') {
    alert('Microphone access is blocked. Please allow it from browser settings.');
  }
});

function isToday(dateStr) {
  const today = new Date();
  const reminderDate = new Date(dateStr);
  return (
    today.getFullYear() === reminderDate.getFullYear() &&
    today.getMonth() === reminderDate.getMonth() &&
    today.getDate() === reminderDate.getDate()
  );
}

function loadTodaysReminders() {
  const cardsContainer = document.getElementById('cards-container');
  cardsContainer.innerHTML = ''; 

  const reminders = JSON.parse(localStorage.getItem("schedules")) || [];

  const todaysReminders = reminders.filter(reminder => isToday(reminder.date));

  if (todaysReminders.length === 0) {
    cardsContainer.innerHTML = '<p style="text-align:center; color:#555;">No reminders for today.</p>';
    return;
  }

  todaysReminders.forEach(reminder => {
    const card = document.createElement('div');
    card.className = 'card';

    card.dataset.title = reminder.title;
    card.dataset.time = reminder.time;

    card.innerHTML = `
      <h3>${reminder.title}</h3>
      <p>At ${reminder.time}</p>
    `;

   
    card.addEventListener('click', () => {
      window.location.href = 'reminder.html';
    });

    cardsContainer.appendChild(card);
  });
}

function formatTimeForSpeech(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}


document.addEventListener("DOMContentLoaded", () => {
  updateGreetingDateTime();
  loadTodaysReminders();
  setInterval(updateGreetingDateTime, 60000);
});
