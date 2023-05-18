
const subbutton = document.querySelector("#submit");
const result = document.querySelector("#result");
const question = document.getElementById("question");
const form = document.querySelector('form')
let requestIsOk = false

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
const synth = window.speechSynthesis;


const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();


const start = document.querySelector('.microSvg')

recognition.lang = 'en-US'
recognition.interimResults = false;
recognition.maxAlternatives = 1;

start.addEventListener('mousedown', handleMdown)
start.addEventListener('mouseup', handleMdown)
let tmp = false
let voiseValue = ''

recognition.onresult = (event) => {
  if (event.results[0].isFinal) {
    voiseValue = event.results[0][0].transcript
    sendPostRequest()
  }
};

function handleMdown(e) {
  if (tmp) {
    start.style.fill = 'white'
    recognition.stop()
  } else {
    recognition.start()
    start.style.fill = 'blue'
  }
  tmp = !tmp
}

function sendPostRequest(e) {

  form.setAttribute('disable', true)
  if (e){
    e.preventDefault()
  }
  
  let value = voiseValue ? voiseValue : question.value

  if (!value || requestIsOk || synth.speaking ) return
  if (value === 'clear') {
    result.innerHTML = ''
    question.value = ''
    voiseValue = ''
    return
  }
  requestIsOk = true
  question.value = ''

  const myQuestionDiv = document.createElement('div')
  const myQuestion = document.createElement('p')
  myQuestionDiv.setAttribute('class', 'my_question')
  result.appendChild(myQuestionDiv)
  myQuestionDiv.appendChild(myQuestion)
  myQuestion.innerHTML = value

  axios.post('/variable', { variable: value })
    .then(() => {
      axios.get('/variable').then(res => {
        let tmp = res.data
        let data = tmp[tmp.length - 1].variable

        let utterance = new SpeechSynthesisUtterance(data);
        synth.speak(utterance);

        const resultEl = document.createElement('div')
        const resultElInner = document.createElement('p')
        resultEl.setAttribute('class', 'result_bot')

        result.appendChild(resultEl)
        resultEl.appendChild(resultElInner)
        resultElInner.innerHTML = data
        subbutton.setAttribute('dispable', false)
        form.setAttribute('disable', false)
        requestIsOk = false
      })
    })
    .catch(error => {
      console.log(error.message);
      subbutton.setAttribute('dispable', false)
      form.setAttribute('disable', false)
      requestIsOk = false
    });

}


form.addEventListener('submit', sendPostRequest)

