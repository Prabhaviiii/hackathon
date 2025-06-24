function updateGreetingDateTime() {
  const now = new Date();

  let hours = now .getHours()
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

