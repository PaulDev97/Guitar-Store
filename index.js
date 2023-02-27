import { guitars } from "./store.js";
const productsGuitars = guitars; 
const containerRender = document.querySelector('.cards')
const btnCategoryContainer = document.querySelector('.filter_btn')
const btnCategory = document.querySelectorAll('.btn_scroll')
console.log(productsGuitars)




/* Crear card del producto */
const createProduct = product => {
  const {brand, img, price, id,type,icon} = product;

  return `
  <div class="guitar_card">
    <div class="image_card_container">
      <img src="${img}" alt="">
    </div>

    <div class="guitar_data_container">
      <div class="guitar_data">
        <h3>${brand}</h3>
        <span>$${price}</span>
      </div>
      
      <div class="instrument_icon">
        <img src="${icon}" alt="">
      </div>
    </div>

    <button class="add_product" 
     data-id='${id}' 
     data-name='${brand}'
      data-precio='${price}' 
      data-tipo="${type}"
      data-image='${img}'
      >Add to cart</button>

  </div>



  `
}



/* -----------------------Logica de filtrar categoria-------------------------------------- */

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



const renderGuitars = (guitar) => {
  if(guitar === 'popular'){
    popularGuitars()
  }
  else{
    const guitarCategory = productsGuitars.filter(item => item.category === guitar)
    containerRender.innerHTML = guitarCategory.map(createProduct).join('')
  }

  
}



const popularGuitars = () => {
  const populares = productsGuitars.filter(item => item.top === 'top' )
  console.log(populares)

  containerRender.innerHTML = populares.map(createProduct).join('')
}




/* ------------------Logica carrito----------- */

const carritoContainer = document.querySelector('.products_cart')

const ledProducts = document.querySelector('.led_products')
const total = document.querySelector('.total')
const subtotal = document.querySelector('.subtotal') 


const total_products = document.querySelector('.products_in_cart')
const storeContainer = document.querySelector('.cards')
const cardsContainer = document.querySelector('.cart_container')

const buyProductBtn = document.querySelector('.buy_button')


const menu = document.querySelector('.menu')
const icon_toggle_menu = document.querySelector('.toggle')

const iconCart = document.querySelector('.icon')
const iconCloseCart = document.querySelector('.back')



let guitarsCarrito = JSON.parse(localStorage.getItem("cart")) || [];

const saveToLocalStorage = (key) => {
  localStorage.setItem("cart", JSON.stringify(key));
};


const cardProduct = product => {

  const {id, precio, cantidad,image,brand,tipo} = product

  return `
  <div class="card_product_cart">

  <div class="img_product_cart">
    <img src="${image}" alt="">
  </div>

  <div class="data_product_cart">

    <div class="type_guitar_cart">
      <h2>${brand}</h2>
      <span>${tipo}</span>
    </div>


    <div class="price_product_container">
      <div class="quantity">
        <button class="restar block"  data-id='${id}'>-</button>
        <span>${cantidad}</span>
        <button class="sumar" data-id='${id}'>+</button>
      </div>
      <span>$${precio}</span>
    </div>

  </div>

  <i class="delete fa-solid fa-square-xmark"  data-id='${id}'></i>


</div>
  `


}


//3- Funcion para mostrar mensaje(si no hay nada en el carrito) o renderizar los productos del local en el carrito
const renderCart = () => {
  if(!guitarsCarrito.length) {
    carritoContainer.innerHTML =  `
    <div class="not_product_container">
          <div>
            <span>No hay productos en el carrito</span>
          </div>
        </div> 
  
    `;
    return
  }
  //Mapeo el carrito del localStorage y le paso como parametro renderProduct para que me pinte lo que le marque(game y price)
  carritoContainer.innerHTML = guitarsCarrito.map(cardProduct).join('') 
  

  
}



//4- Funcion para obtener la suma total de los productos. Curr.cantidad porque podemos tener mas un mismo producto
const getCartTotal = () => {
  return guitarsCarrito.reduce((acc,curr) => acc + Number(curr.precio) * curr.cantidad,0);
}


//5- Funcion para renderizar el precio total de los productos. al span total le hacemos inner y este va a tomar el valor de getCartTotal
const showTotal = () => {
  //toFixed formatea un numero. Es decir le agrega la cantidad de decimales que le querramos pasar
  total.innerHTML = `$${getCartTotal().toFixed(2)}`;
  subtotal.innerHTML = `$${getCartTotal().toFixed(2)}`;

}


//6- Funcion para renderizar la cantidad de productos que hay en el carrito 
const cantidadProductosCarrito = () => {
  total_products.textContent = guitarsCarrito.reduce((acc,curr) => acc+curr.cantidad,0)

  //Numero de productos que se esta por llevar el cliente en el monto final
  ledProducts.innerHTML = guitarsCarrito.reduce((acc,curr) => acc+curr.cantidad,0);
} 






//8- Funcion para agregar un producto al carro.
const addProduct = (e) => {

  //Si lo que esta clickeando el usuario no contiene esta clase,no hagas nada
  if(!e.target.classList.contains('add_product')) return;
  

  //Creamos el objeto usando los datos del createElement(en este caso el boton es el que guarda eso. son los data del boton data-id data-name data-precio )
  const { id, name, precio, tipo, image} = e.target.dataset;


  const product = productData(id,name,precio, tipo, image)
  
  //Una vez creado el objeto hacemos las siguientes preguntas:
  //Tenemos que saber si existe el producto(creamos esa funcion). en el caso de que exista debemos sumarle una unidad
  if(isExistCardProduct(product)){
   addUnitProduct(product) 
  }
  else {
    productCard(product);
  }

  
  //Despues de hacer todo eso checkea el estado del carro
  checkState()
}




//9- Creamos esta funcion para crear un objeto para la data del producto. Esto se obtiene del product
const productData = (id,brand,precio,tipo,image) => {
  return {id, brand, precio, tipo, image};
}

//12- Funcion para crear producto en el carrito
const productCard = product => {

  //Devuelve la copia del carro y copia del product que le pasamos. Copia del carro para que persistan los demas
  guitarsCarrito = [...guitarsCarrito,{...product, cantidad:1 }]

}


//11- Funcion para agregar una unidad al producto
const addUnitProduct = unidad => {
  //mapeamos el carrito para verificar si en el carrito esta esa unidad, si existe entonces hacemos copia de lo que haya dentro del carro y a la cantidad le sumamos 1
  guitarsCarrito = guitarsCarrito.map(cardProduct => cardProduct.id === unidad.id ? {...cardProduct, cantidad:cardProduct.cantidad + 1 }: cardProduct)
}



//10- Funcion para checkear si existe el producto en el carro. Esto me trae true o false 
const isExistCardProduct = producto => {
  return guitarsCarrito.find(item => item.id === producto.id)
}



/* ----Logica de botones - + */
const handleQuantity = e => {
  if(e.target.classList.contains('restar')){
    btnRestar(e.target.dataset.id)
  }
  else if (e.target.classList.contains('sumar')){
    btnSumar(e.target.dataset.id)
  }
  checkState()
 

}

const btnRestar = id => {
  const findProduct = guitarsCarrito.find(item => item.id === id)
  const blockBtnMinus = document.querySelector('.block')

  if(findProduct.cantidad === 1){
    if (guitarsCarrito.length) {
      blockBtnMinus.classList.add("disabled_minus");
    } 
    return
  }

   //Si el if no se cumple entonces viene a esta funcion que le va a restar a la cantidad 1. Le pasamos como parametro el exist... encontrado
   restarUnidadProducto(findProduct)
  
}






//15- Funcion para restar 1 unidad
const restarUnidadProducto = existProduct => {
  //mapeo del carrito para obtener el producto igual al que se le pasó a restarUnidadProducto.
  //Si existe entonces hacemos una copia del producto y le decimos que ahora la cantidad de ese producto le restaremos 1 caso contrario solo retorna el producto
  guitarsCarrito = guitarsCarrito.map(product => {
    return product.id === existProduct.id
    ?{...product, cantidad:Number(product.cantidad) - 1}
    :product;
  })
}


//17 Funcion cuando apretemos boton +
const btnSumar = id => {
  const existCardProduct = guitarsCarrito.find(item => item.id === id);

  addUnitProduct(existCardProduct)

}





const deleteItem = e => {
  
  if(!e.target.classList.contains('delete')) return;

  const idFilter = (e.target.dataset.id);
  /* console.log(idFilter) */
  
  guitarsCarrito = guitarsCarrito.filter(item => item.id !== idFilter)

  renderCart(guitarsCarrito)
  saveToLocalStorage(guitarsCarrito)

  
} 







/* Desabilitar boton de compra si no hay productos en el carrito */
const disabledBuyBtn = (btn) => {
  if (!guitarsCarrito.length) {
    btn.classList.add("disabled");
  } else {
    btn.classList.remove("disabled");
  }
};


/* Boton de comprar productos.   */
const buyProducts = () => {
  if(guitarsCarrito.length > 0) {
    guitarsCarrito = []
    renderCart(guitarsCarrito)
    saveToLocalStorage(guitarsCarrito)

    setTimeout(() => {
      carritoContainer.innerHTML = `<div class="products_purchased">
      <span>Compra exitosa</span>
    </div>`
    }, 0);

    setTimeout(() => {
      renderCart()
    }, 3000);

    checkState()
  }
  
}



const checkState = () => {
  
  saveToLocalStorage(guitarsCarrito)

  renderCart(guitarsCarrito)

  showTotal(guitarsCarrito)

  cantidadProductosCarrito(guitarsCarrito)

  disabledBuyBtn(buyProductBtn)

  
  
}





/* ---Mostrar y cerrar carrito */

const showCart = () => {
  cardsContainer.classList.toggle('hide')
}

const closeCart = () => {
  cardsContainer.classList.toggle('hide')
}


/* ---Menu responsive--- */
const showMenu = () => {
  menu.classList.toggle('show_menu')
}












const init = () => {

  
  popularGuitars()
  btnCategoryContainer.addEventListener('click',btnSelected)

  checkState()

  iconCart.addEventListener('click',showCart)
  iconCloseCart.addEventListener('click',closeCart)
  icon_toggle_menu.addEventListener('click',showMenu)
  
  /* saveToLocalStorage(guitarsCarrito)
  renderCart(guitarsCarrito) */
  
  storeContainer.addEventListener('click',addProduct)

  cardsContainer.addEventListener('click', handleQuantity)

  carritoContainer.addEventListener('click',deleteItem)

  

  window.addEventListener('click', disabledBuyBtn(buyProductBtn))

  buyProductBtn.addEventListener('click', buyProducts)
  
}

init()

