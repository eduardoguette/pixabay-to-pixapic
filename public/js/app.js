const divMenuMobile = document.getElementById('menu-mobile')
const btnHamburger = document.getElementById('btn-menu-ham')
const btnOptions = document.querySelector('#btn-options')
const divOptions = document.querySelector('.options')
const spinner = document.querySelector('.spinner')
const divResultado = document.querySelector('#resultado')
const formulario = document.querySelector('form')
const btnCloseImg = document.querySelector('.close')
const pResultados = document.querySelector('.cantidad-resultados')
const btnPreview = document.querySelector('#close-img-preview')
const divPopular = document.querySelector('.popular_searches')

let newPage = false
let results = []
let pagina = 1
buscarImagenes()
window.onload = () => {
  btnOptions.addEventListener('click', () => {
    divOptions.classList.toggle('hidden')
  })
  btnHamburger.addEventListener('click', () => {
    divMenuMobile.classList.toggle('hidden')
  })
  divOptions.addEventListener('click', optionSelec)
  formulario.addEventListener('submit', validarFormulario)
  divPopular.addEventListener('click', popularSelected)
  // ampliar img
  divResultado.addEventListener('click', (e) => {
    const divPreview = document.querySelector('.img-preview')
    const imgPreview = document.querySelector('#preview')
    const userImgPreview = document.querySelector('#user-img-preview')
    const userNamePreview = document.querySelector('#name-user-preview')
    const linkDownload = document.querySelector('#link-preview-img')
    if (e.target.tagName === 'IMG') {
      const imageFullScreen = e.target.parentElement.getAttribute('data-fullscreen')
      console.log(e.target.parentElement)
      const userImage = e.target.parentElement.querySelector('.user-container img').getAttribute('src')
      const nameUser = e.target.parentElement.querySelector('.user-container p').textContent.trim()

      userNamePreview.textContent = nameUser
      linkDownload.setAttribute('href', imageFullScreen+'?attachment')
      userImgPreview.setAttribute('src', userImage)
      userImgPreview.setAttribute('alt', nameUser)
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
    if(e.target.tagName==="IMG"){
      e.target.classList.toggle('zoom-in')
    }else{
      const divPreview = document.querySelector('.img-preview')
      document.querySelector('#preview').classList.remove('zoom-in')
      divPreview.classList.remove('opening')
      divPreview.classList.add('closing')
      setTimeout(() => {
        divPreview.classList.remove('closing')
        divPreview.classList.add('hidden')
      }, 200)
    }
  })

  // cerrar imagen
  btnCloseImg.addEventListener('click', () => {
    document.querySelector('.img-preview ').classList.add('closing')
  })

  // scroll
  const observer = new IntersectionObserver((entries) => {
    if (newPage) {
      pagina++
      buscarImagenes()
    }
  })
  observer.observe(document.querySelector('.observer'))
  // buscarImagenes()
}

function popularSelected(e) {
  e.preventDefault(e)
  if (e.target.tagName === 'A') {
    results = []
    pagina = 1
    document.querySelector('.msg').innerHTML = ``
    while (divResultado.firstChild) {
      divResultado.removeChild(divResultado.firstChild)
    }
    const busqueda = e.target.textContent.replace(',', '')
    document.querySelector('input[type="text"]').value = busqueda
    buscarImagenes()
  }
}

// window.addEventListener('resize', () => {
//   while (divResultado.firstChild) {
//     divResultado.removeChild(divResultado.firstChild)
//   }
//   calcularColumns()
// })

window.addEventListener('scroll', () => {
  let alturas = []
  document.querySelectorAll('.resultado > div').forEach((elem) => {
    alturas = [...alturas, elem.offsetHeight]
  })
  let alturaFinal = Math.max(...alturas)
  //  console.log(alturas)
  // console.log(Math.max(...alturas))
  document.querySelector('.observer').style.top = alturaFinal - 2300 + 'px'
})

function validarFormulario(e) {
  e.preventDefault()
  results = []
  newPage = true
  document.querySelector('.msg').innerHTML = ``
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
      results = [...results, json.hits]
      calcularColumns(json.hits)
       // console.log(json.hits.length)
      newPage = true
      console.log(json.totalHits, results.flat(999).length)
      if (results.flat(999).length >= json.totalHits) {
        newPage = false
        noMorePagination()
      }
    })
    .catch((err) => {
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

function calcularColumns(data) {
  let cantidadColumn
  // 360  640  768px  1024px  1280px  1536px
  const widthUser = window.innerWidth
  if (widthUser < 460) {
    cantidadColumn = 1
    pintarImagenes(data, cantidadColumn, 350)
  } else if (widthUser > 460 && widthUser <= 640) {
    cantidadColumn = 1
    pintarImagenes(data, cantidadColumn, 550)
  } else if (widthUser > 640 && widthUser <= 768) {
    cantidadColumn = 2
    pintarImagenes(data, cantidadColumn, 400)
  } else if (widthUser > 768 && widthUser <= 1024) {
    cantidadColumn = 3
    pintarImagenes(data, cantidadColumn, 430)
  } else if (widthUser > 1024 && widthUser <= 1280) {
    cantidadColumn = 3
    pintarImagenes(data, cantidadColumn, 430)
  } else if (widthUser > 1280 && widthUser <= 1536) {
    cantidadColumn = 3
    pintarImagenes(data, cantidadColumn, 430)
  } else if (widthUser > 1536) {
    cantidadColumn = 3
    pintarImagenes(data, cantidadColumn, 450)
  }
}

function pintarImagenes(data, columns, widthImg) {
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
  data.forEach((image) => {
    const { webformatURL, userImageURL, user, favorites, largeImageURL, previewURL, previewHeight, previewWidth, webformatWidth, webformatHeight, tags } = image
    const selector = '.grid-masonry-' + cont
    let contenedor = document.querySelector(selector)
    cont++
    if (cont >= columns) cont = 0
    const divContenedor = document.createElement('div')
    divContenedor.className = 'my-6 contenedor-img relative overflow-hidden '
    divContenedor.dataset.fullscreen = largeImageURL

    const id = Date.now()
    const img = document.createElement('img')
    img.className = 'bg-gray-200 object-cover loading'
    img.id = id
    img.loading = 'lazy'
    img.src = webformatURL
    img.height = webformatHeight
    img.width = widthImg
    img.onload = () => {
      let selector = id
      setTimeout(() =>{
        img.classList.remove('loading') 
        img.classList.add('loaded')
      }, 500)
    }

    divContenedor.appendChild(img)
    contenedor.appendChild(divContenedor)
    const btnDownload = document.createElement('a')
    btnDownload.setAttribute('rel', "nofollow")
    btnDownload.setAttribute('target', "_blank")
    btnDownload.href = largeImageURL+"?attachment"
    btnDownload.className = "btn-download absolute z-50 bottom-3 right-3"
    btnDownload.textContent = ""
    
    const divProfile = document.createElement('div')
    divProfile.className = "user-container opacity-0 flex absolute bottom-0 py-3 px-3 w-full bg-gradient-to-t from-black to-transparent z-40 space-x-2 items-center"
    divProfile.innerHTML = `
    <img src="${userImageURL}" class="object-contain rounded-full" height="30" width="30" alt="image-${user}">
    <p class="text-white font-medium text-sm">${user}</p>
    `
    const divLike = document.createElement('div')
    divLike.className = "opacity-0 container-link  absolute z-40 top-2 rounded bg-gray-200 p-2 right-3 flex space-x-2 items-center justify-end"
    divLike.innerHTML = `
    <p class=" font-medium text-xs">${favorites}</p>
    <svg class="w-4 h-4" fill="rgb(50, 50, 50)" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>
    `

    divContenedor.appendChild(btnDownload)
    divContenedor.appendChild(divProfile)
    divContenedor.appendChild(divLike)
    

  })
  console.log(results)
}
 
function noMorePagination() {
  document.querySelector('.msg').innerHTML = `
  <p class="text-2xl font-bold text-center py-2">No hay mas resultados :( </p>
  <small class="font-medium text-center w-full py-2">Intenta con otra busqueda</small>
  
  `
}


// bgHero()
function bgHero(){
  const imgHero = document.querySelector('.img-hero')
  fetch('https://pixabay.com/api/?key=13360577-1ec6494e0daacc37a199a6648&q=paisaje%C2%A0&image_type=all&per_page=100&page=1')
  .then(resp => resp.json())
  .then(img => imgHero.setAttribute('src', img.hits[Math.ceil(Math.random()*100)].largeImageURL))
  .catch(err => {
    console.log(err)
    imgHero.setAttribute('src', "https://pixabay.com/get/gbd8c58c28db3bd388acab98174aafa9a7021917d6ccb8dcfc66e7613ecc9caa69bb61cbbb5dd0f0f3fef91c32933f530728e1b2e2072894b44680164af464efd_1280.jpg")
  })
}