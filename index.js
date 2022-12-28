const containerRender = document.querySelector('.cards')


const guitars = [
  {
    id:1,
    nombre: 'Gibson',
    img: './img/gibson.png',
    precio: 400,
  },

  {
    id:2,
    nombre: 'Fender',
    img: './img/fender.png',
    precio: 500,
  },
  {
    id:3,
    nombre: 'Ibanez',
    img: './img/ibanez.png',
    precio: 500,
  }
]


const createGuitar = guitar => {
  const {nombre, img, precio} = guitar;

  return `
  <div class="guitar_card">
    <div class="image_card_container">
      <img src="${img}" alt="">
    </div>

    <div class="guitar_data_container">
      <div class="guitar_data">
        <h3>${nombre}</h3>
        <span>${precio}</span>
      </div>
      <i class="fa-solid fa-circle-info"></i>
    </div>

    <button>Add to cart</button>

  </div>



  `
}

const renderGuitar = guitar => {
  containerRender.innerHTML = guitar.map(item => createGuitar(item)).join('')
}




const init = () => {

  renderGuitar(guitars)

}

init()

