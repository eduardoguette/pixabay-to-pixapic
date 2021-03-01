const divMenuMobile = document.getElementById('menu-mobile')
const btnHamburger = document.getElementById('btn-menu-ham')

btnHamburger.addEventListener('click', () => {
  divMenuMobile.classList.toggle('hidden')
})
