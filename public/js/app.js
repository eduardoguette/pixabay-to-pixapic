const divMenuMobile = document.getElementById('menu-mobile')
const btnHamburger = document.getElementById('btn-menu-ham')
const btnOptions = document.querySelector('#btn-options')
const divOptions = document.querySelector('.options')
const spinner = document.querySelector('.spinner')
const divResultado = document.querySelector('#resultado')
const formulario = document.querySelector('form')
const btnCloseImg = document.querySelector('.close')

const btnPreview = document.querySelector('#close-img-preview')

let newPage = false
let results = {}
let pagina = 1

window.onload = () => {
  btnOptions.addEventListener('click', () => {
    divOptions.classList.toggle('hidden')
  })
  btnHamburger.addEventListener('click', () => {
    divMenuMobile.classList.toggle('hidden')
  })
  divOptions.addEventListener('click', optionSelec)
  formulario.addEventListener('submit', validarFormulario)

  // ampliar img
  divResultado.addEventListener('click', (e) => {
    const divPreview = document.querySelector('.img-preview')
    const imgPreview = document.querySelector('#preview')
    if (e.target.tagName === 'BUTTON') {
      const imageFullScreen = e.target.parentElement.getAttribute('data-full-screen')
      imgPreview.setAttribute('src', imageFullScreen)
      divPreview.classList.remove('hidden')

      divPreview.classList.add('flex')
      divPreview.classList.add('opening')
    }
  })

  // cerrar imagen preview
  btnPreview.addEventListener('click', () => {
    const divPreview = document.querySelector('.img-preview')
    divPreview.classList.remove('opening')
    divPreview.classList.add('closing')
    setTimeout(() => {
      divPreview.classList.remove('closing')
      divPreview.classList.remove('flex')
      divPreview.classList.add('hidden')
    }, 500)
  })

  document.querySelector('.img-preview').addEventListener('click', (e) => {
 

    const divPreview = document.querySelector('.img-preview')
    divPreview.classList.remove('opening')
    divPreview.classList.add('closing')
    setTimeout(() => {
      divPreview.classList.remove('closing')
      divPreview.classList.add('hidden')
    }, 500)
  })

  // cerrar imagen
  btnCloseImg.addEventListener('click', () => {
    document.querySelector('.img-preview ').classList.add('closing')
  })

  // scroll
  const observer = new IntersectionObserver((entries) => {
    if (newPage) {
      pagina++
      spinner.classList.remove('hidden')
      spinner.classList.add('flex')
      setTimeout(() => {
        spinner.classList.remove('flex')
        spinner.classList.add('hidden')
        buscarImagenes()
      }, 2000)
    }
  })
  observer.observe(document.querySelector('.observer'))
}

// window.addEventListener('resize', () => {
//   while (divResultado.firstChild) {
//     divResultado.removeChild(divResultado.firstChild)
//   }
//   calcularColumns()
// })

window.addEventListener('scroll', () => {
  // let alturas = []
  // document.querySelectorAll('.resultado > div').forEach((elem) => {
  //   alturas = [...alturas, elem.offsetHeight]
  // })
  // let alturaFinal = Math.max(...alturas)
  // // console.log(Math.max(...alturas))
  // document.querySelector('.observer').style.top = alturaFinal + 'px'
})

function validarFormulario(e) {
  e.preventDefault()
  newPage = true
  document.querySelector('.observer').innerHTML = `<p class=" border-gray-400 rounded-sm mx-auto w-40"></p>`
  pagina = 1
  while (divResultado.firstChild) {
    divResultado.removeChild(divResultado.firstChild)
  }
  buscarImagenes()
}

function buscarImagenes() {
  let busqueda = document.querySelector('input[type="text"]').value
  const opcion = document.querySelector('#option-select').getAttribute('data-target')
  const key = '13360577-1ec6494e0daacc37a199a6648'
  busqueda = busqueda.replace(/ /g, '+')
  const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&image_type=${opcion}&per_page=100&page=${pagina}`
  fetch(url)
    .then((resp) => resp.json())
    .then((json) => {
      results = { ...json.hits }
      calcularColumns()
      // console.log(json.hits.length)
      newPage = true
      if (json.hits.length < 1) {
        newPage = false
        noMorePagination()
      }
    })
    .catch((err) => {
      noMorePagination()
      newPage = false
      console.log(err)
    })
}

function optionSelec(e) {
  if (e.target.tagName === 'BUTTON') {
    document.querySelector('#option-select').textContent = e.target.textContent
    document.querySelector('#option-select').setAttribute('data-target', e.target.getAttribute('data-target'))
    divOptions.classList.toggle('hidden')
  }
}

function calcularColumns() {
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
    const { webformatURL, favorites, largeImageURL, previewURL, previewHeight, previewWidth, webformatWidth, webformatHeight, tags } = results[i]
    const selector = '.grid-masonry-' + cont
    let contenedor = document.querySelector(selector)
    cont++
    if (cont >= columns) cont = 0

    contenedor.innerHTML += `
    <div class="my-4 contenedor-img relative overflow-hidden" data-full-screen="${largeImageURL}">
        <button class="focus:outline-none ampliar p-1 rounded absolute top-2 right-2 text-white">
          
        </button>
        <img loading="lazy" class="bg-gray-200 rounded-md object-cover" src="${webformatURL}" width="${widthImg}" height="${webformatHeight}"  alt="${tags}">
        <div class="info-pic flex items-center justify-between px-1 py-2 w-full rounded-md ">
          <div class="like flex items-center text-white space-x-1">
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span class="font-medium text-xs">${favorites}</span>
          </div>
        </div>
    </div>
    
    `
  }
}

function noMorePagination() {
  document.querySelector('.observer').innerHTML = `
  <p class="text-2xl font-bold text-center py-2">No hay mas resultados :( </p>
  <small class="font-medium text-center w-full py-2">Intenta con otra busqueda</small>
  
  `
}
