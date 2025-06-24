let translations = {};
let currentLang = 'en';

function updateGreetingDateTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');

  // Get settings from translation
  const is24h = translations.timeFormat === '24h';
  const locale = translations.locale || 'en-US';

  let formattedTime = now.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: !is24h
  });

  const timeDisplay = document.getElementById('time-display');
  if (timeDisplay) timeDisplay.textContent = formattedTime;

  let greeting = '';
  if (hours < 12) greeting = translations.goodMorning || 'Good Morning!';
  else if (hours < 18) greeting = translations.goodAfternoon || 'Good Afternoon!';
  else greeting = translations.goodEvening || 'Good Evening!';

  const greetingText = document.getElementById('greeting-text');
  if (greetingText) greetingText.textContent = greeting;

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString(locale, dateOptions);

  const dateText = document.getElementById('data-text');
  if (dateText) dateText.textContent = formattedDate;
}

function isToday(dateStr) {
  const today = new Date();
  const date = new Date(dateStr);
  return today.toDateString() === date.toDateString();
}

function loadTodaysReminders() {
  const cardsContainer = document.getElementById('cards-container');
  if (!cardsContainer) return;

  cardsContainer.innerHTML = '';

  const reminders = JSON.parse(localStorage.getItem("schedules")) || [];
  const todaysReminders = reminders.filter(reminder => isToday(reminder.date));

  if (todaysReminders.length === 0) {
    cardsContainer.innerHTML = `<p style="text-align:center; color:#555;">
      ${translations.noRemindersToday || 'No reminders for today.'}
    </p>`;
    return;
  }

  todaysReminders.forEach(reminder => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.title = reminder.title;
    card.dataset.time = reminder.time;

    card.innerHTML = `
      <h3>${reminder.title}</h3>
      <p>${translations.at || 'At'} ${reminder.time}</p>
    `;

    card.addEventListener('click', () => {
      let savedReminders = JSON.parse(localStorage.getItem("schedules")) || [];
      const exists = savedReminders.some(r =>
        r.title === reminder.title && r.time === reminder.time && r.date === reminder.date
      );

      if (!exists) {
        savedReminders.push({
          title: reminder.title,
          time: reminder.time,
          date: reminder.date,
          type: "Auto",
          icon: reminder.icon || '🔔'
        });
        localStorage.setItem("schedules", JSON.stringify(savedReminders));
        setTimeout(() => {
          window.location.href = 'remainder.html';
        }, 1500);
      }
    });

    cardsContainer.appendChild(card);
  });
}

async function loadLanguage(lang) {
  try {
    const res = await fetch(`${lang}.json`);
    translations = await res.json();
    currentLang = lang;

    // Translate static text
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const span = el.querySelector('span');
      const icon = el.querySelector('i');

      if (span && translations[key]) {
        span.textContent = translations[key];
      } else if (icon && translations[key]) {
        el.innerHTML = '';
        el.appendChild(icon);
        el.insertAdjacentText('beforeend', ` ${translations[key]}`);
      } else if (translations[key]) {
        el.textContent = translations[key];
      }
    });

    updateGreetingDateTime(); // update dynamic content
    loadTodaysReminders(); // reload reminders in selected language
  } catch (err) {
    console.error('Language load failed:', err);
  }
}

document.getElementById('languageSwitcher')?.addEventListener('change', (e) => {
  loadLanguage(e.target.value);
});

document.addEventListener("DOMContentLoaded", () => {
  loadLanguage(currentLang);
  updateGreetingDateTime();
  loadTodaysReminders();
  setInterval(updateGreetingDateTime, 60000); // update time every minute
});

navigator.permissions?.query({ name: 'microphone' }).then(result => {
  if (result.state === 'denied') {
    alert('Microphone access is blocked. Please allow it from browser settings.');
  }
});
