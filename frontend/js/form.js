const input = document.querySelectorAll('input, textarea');
const submit = document.getElementById('submit');

submit.addEventListener('click', (e) => {
  input.forEach(item => item.value = "");
  e.preventDefault();
  submit.textContent = "Enviado";
  submit.style.backgroundColor = "#006A67";
});

