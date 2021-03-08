const divMenuMobile = document.getElementById('menu-mobile')
const btnHamburger = document.getElementById('btn-menu-ham')
const btnOptions = document.querySelector('#btn-options')
const divOptions = document.querySelector('.options')

const divResultado = document.querySelector('#resultado')
const formulario = document.querySelector('form')

const body = document.body
let results = {}
let pagina = 1;

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

window.addEventListener('resize', () => {
  calcularColumns()
})

window.addEventListener('scroll', () => {
  if (document.querySelector('.observer')) document.querySelector('.observer').remove()
  const elementos = document.querySelectorAll('.resultado > div')
  let alturas = []

  document.querySelectorAll('.resultado > div').forEach((elem) => {
    alturas = [...alturas, elem.offsetHeight]
  })
  const div = document.createElement('div')
  div.classList.add('observer', 'h-24', 'w-full', 'border-red-600', 'absolute', 'm-0')
  let alturaFinal = Math.max(...alturas)
  // console.log(Math.max(...alturas))
  div.style.top = alturaFinal + 'px'
  div.style.margin = 0
  divResultado.appendChild(div)

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting){
      // pintarImagenes()
      pagina++
    } 
  })
  observer.observe(document.querySelector('.observer'))
})

function validarFormulario(e) {
  e.preventDefault()
  const busqueda = document.querySelector('input[type="text"]').value
  const opcionSeleccionada = document.querySelector('#option-select').getAttribute('data-target')
  buscarImagenes(busqueda, opcionSeleccionada)
}

function buscarImagenes(busqueda, opcion) {
  const key = '13360577-1ec6494e0daacc37a199a6648'
  busqueda = busqueda.replace(/ /g, '+')
  const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&image_type=${opcion}&per_page=100&page=${pagina}`
  fetch(url)
    .then((resp) => resp.json())
    .then((json) => {
      results = { ...json.hits }
      calcularColumns()
    })
    .catch((err) => console.log(err))
  
}

function optionSelec(e) {
  if (e.target.tagName === 'BUTTON') {
    document.querySelector('#option-select').textContent = e.target.textContent
    document.querySelector('#option-select').setAttribute('data-target', e.target.getAttribute('data-target'))
    divOptions.classList.toggle('hidden')
  }
}

function calcularColumns() {
  while (divResultado.firstChild) {
    divResultado.removeChild(divResultado.firstChild)
  }
  let cantidadColumn
  // 360  640  768px  1024px  1280px  1536px
  const widthUser = window.innerWidth
  if (widthUser < 460) {
    cantidadColumn = 1
    pintarImagenes(cantidadColumn, 350)
  } else if (widthUser > 460 && widthUser <= 640) {
    cantidadColumn = 2
    pintarImagenes(cantidadColumn, 230)
  } else if (widthUser > 640 && widthUser <= 768) {
    cantidadColumn = 3
    pintarImagenes(cantidadColumn, 230)
  } else if (widthUser > 768 && widthUser <= 1024) {
    cantidadColumn = 4
    pintarImagenes(cantidadColumn, 230)
  } else if (widthUser > 1024 && widthUser <= 1280) {
    cantidadColumn = 5
    pintarImagenes(cantidadColumn, 230)
  } else if (widthUser > 1280 && widthUser <= 1536) {
    cantidadColumn = 6
    pintarImagenes(cantidadColumn, 230)
  } else if (widthUser > 1536) {
    cantidadColumn = 6
    pintarImagenes(cantidadColumn, 250)
  }
}

function pintarImagenes(columns, widthImg) {
  if (document.querySelectorAll('.resultado > div').length <= 0) {
    for (let i = 0; i < columns; i++) {
      const div = document.createElement('div')
      div.className = 'grid-masonry-' + i
      // div.classList.add('border', 'border-red-200')
      divResultado.appendChild(div)
    }
  }
  if (!widthImg) {
    widthImg = document.querySelector('.resultado img').width
    columns = document.querySelectorAll('.resultado > div').length
  }
  let cont = 0


  for (let i in results) {
    const { webformatURL, largeImageURL, previewURL, previewHeight, previewWidth, webformatWidth, webformatHeight, tags } = results[i]
    const selector = '.grid-masonry-' + cont
    let contenedor = document.querySelector(selector)
    cont++
    if (cont >= columns) cont = 0
    const img = document.createElement('img')
    img.src = largeImageURL
    img.alt = tags
    img.loading = 'lazy'
    img.className = 'bg-gray-200 rounded-md object-cover my-5'
    img.width = widthImg
    img.height = webformatHeight
    contenedor.appendChild(img)
  }
}
