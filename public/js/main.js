if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('../../serviceworker.js')
    .then((registrado) => console.log('Se instalo correctamente...', registrado))
    .catch((error) => console.log(error));
} else {
  console.log('No lo soporta');
}
