import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';
    if (element.textContent.length > 3) {
      element.textContent = '';
    }
  }
  , 300);
}

function typeText(element, text) {
  let i = 0;

  const typeInterval = setInterval(() => {
    element.textContent += text[i];
    i++;

    if (i >= text.length) {
      clearInterval(typeInterval);
    } else {
      element.innerHTML += text[i];
      i++;
    }
  }
  , 20);
}


function generateUniqueID() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return 'id-' + timestamp + '-' + hexadecimalString;
}

function chatStripe (isAI, value, uniqueID) {
  return (
    `<div class="wrapper ${isAI && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img
            src="${isAI ? bot : user}"
            alt="${isAI ? 'bot' : 'user'}"
          />
        </div>
        <div class="message" id=${uniqueID}>
          ${value}
        </div>
      </div>
    </div>`
  );
}

 const handleSubmit = async (event) => {
  event.preventDefault();

  const data = new FormData(form);

  // User's message

  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  // Bot's response

  const uniqueID = generateUniqueID();

  chatContainer.innerHTML += chatStripe(true, ' ', uniqueID);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueID);

  loader(messageDiv);

  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: data.get('prompt') }),
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const data = await response.json();
    const parseData = data.bot.trim();
    typeText(messageDiv, parseData);
  } else {
    const error = await response.text;
        messageDiv.innerHTML = error.toString();
    alert(error);
  }

}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    handleSubmit(event);
  }
});