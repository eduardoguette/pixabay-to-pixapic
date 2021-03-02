const divMenuMobile = document.getElementById('menu-mobile')
const btnHamburger = document.getElementById('btn-menu-ham')
const btnOptions = document.querySelector('#btn-options')
const divOptions = document.querySelector('.options')

const divResultado = document.querySelector('#resultado')
const formulario = document.querySelector('form')

window.onload = () => {
  btnOptions.addEventListener('click', () => {
    divOptions.classList.toggle('hidden')
  })
  btnHamburger.addEventListener('click', () => {
    divMenuMobile.classList.toggle('hidden')
  })
  divOptions.addEventListener('click', optionSelec)

  formulario.addEventListener('submit', validarFormulario)
}

function validarFormulario(e) {
  e.preventDefault()
  const busqueda = document.querySelector('input[type="text"]').value
  const opcionSeleccionada = document.querySelector('#option-select').getAttribute('data-target')

  buscarImagenes(busqueda, opcionSeleccionada)
}

function buscarImagenes(busqueda, opcion) {
  const key = '13360577-1ec6494e0daacc37a199a6648'
  busqueda = busqueda.replace(/ /g, '+')
  const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&image_type=${opcion}`
  fetch(url)
    .then((resp) => resp.json())
    .then((json) => console.log(json))
}

function optionSelec(e) {
  if (e.target.tagName === 'BUTTON') {
    document.querySelector('#option-select').textContent = e.target.textContent
    document.querySelector('#option-select').setAttribute('data-target', e.target.getAttribute('data-target'))
    divOptions.classList.toggle('hidden')
  }
}
