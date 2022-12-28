import { guitars } from "./store.js";
const productsGuitars = guitars; 
const containerRender = document.querySelector('.cards')
const btnCategoryContainer = document.querySelector('.filter_btn')
const btnCategory = document.querySelectorAll('.btn_scroll')
console.log(productsGuitars)

/* const guitars = [
  {
    id:1,
    category:'electric',
    top:'top',
    brand: 'Gibson',
    img: './img/gibson.png',
    price: 400,
  },

  {
    id:2,
    category:'acustic',
    top:'top',
    guitar:'acustica',
    brand: 'Fender',
    img: './img/fender.png',
    price: 500,
  },
  {
    id:3,
    top:'top',
    category:'classic',
    guitar:'clasica',
    brand: 'Ibanez',
    img: './img/ibanez.png',
    price: 500,
  },
 
] */


const createGuitar = guitar => {
  const {brand, img, price} = guitar;

  return `
  <div class="guitar_card">
    <div class="image_card_container">
      <img src="${img}" alt="">
    </div>

    <div class="guitar_data_container">
      <div class="guitar_data">
        <h3>${brand}</h3>
        <span>${price}</span>
      </div>
      <i class="fa-solid fa-circle-info"></i>
    </div>

    <button>Add to cart</button>

  </div>



  `
}



/* ----------------------------------------------------------------------------------------- */
/* -----------------------Logica de filtrar categoria-------------------------------------- */
/* ----------------------------------------------------------------------------------------- */

/* Evento si clickea x boton y pasarle el elemento a la funcion getDataSetBtn para obtener la categoria y asi darle el background black a ese boton */
 const btnSelected = (e) => {

  if(!e.target.classList.contains('btn_scroll')) return;
  
  getDataSetBtn(e)
  renderGuitars(e.target.dataset.category)
}



const getDataSetBtn = (e) => {

  const dataSetBtn = e.target.dataset.category;

  btnColorSelected(dataSetBtn)

  
}


const btnColorSelected = selected => {

  const getCategoryBtn = [...btnCategory];

  //Recorro cada boton y le saco el active a los que son diferente al seleccionado
  //si es la categoria que no tengo seleccionada le saco el active
  //Si es la que seleccione entonces le agrego la clase
  getCategoryBtn.forEach((item) => {
    if(item.dataset.category !== selected){
      item.classList.remove('active');
      return
    }

    item.classList.add('active')
  })
}
/* ----------------------------------------------- */

const renderGuitars = (guitar) => {
  if(guitar === 'popular'){
    popularGuitars()
  }
  else{
    const guitarCategory = productsGuitars.filter(item => item.category === guitar)
    containerRender.innerHTML = guitarCategory.map(createGuitar).join('')
  }

  
}



const popularGuitars = () => {
  const populares = productsGuitars.filter(item => item.top === 'top' )
  console.log(populares)

  containerRender.innerHTML = populares.map(createGuitar).join('')
}



const init = () => {

  
  popularGuitars()
  btnCategoryContainer.addEventListener('click',btnSelected)

  

}

init()

