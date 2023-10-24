const input = document.querySelector('#input');
const output = document.querySelector('#output');

input.addEventListener('input', update);

function update(event) {
  output.value = input.value;
}