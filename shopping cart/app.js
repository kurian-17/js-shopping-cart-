
// const contentful = require('contentful')

const client = contentful.createClient({

  space: '8reb765ezlqa',
  environment: 'master',
  accessToken: 'ihwZidawspj0m_jueB5jANhSj4EmIKMT6bYFc0yZRSM'

})


const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCart = document.querySelector(".clear-cart");
const cartItems = document.querySelector(".cart-items");
const cartDOM = document.querySelector(".cart");
const productDOM = document.querySelector(".products-center");
const cartOverlay = document.querySelector(".cart-overlay");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content")

let cart = [];
let buttonsDOM = []

class Product {

  async getProducts() {

    try {

      let contentful = await client.getEntries({
        content_type: 'product'
      })
      // console.log(contentful);

      let result = await fetch("products.json");
      let data = await result.json();

      // let products = contentful.items





      let products = data.items;

      products = products.map((item) => {

        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;

        return { title, price, id, image };
        
      });
      return products;
    } catch (error) {
      console.log(error);
    }

  }
}

class UI {

  displayProducts(products) {
    let result = "";

    products.forEach((items) => {
      result += `
          <article class="product">
                <div class="img-container">
                    <img src=${items.image} alt="" class="product-img">
                    <button class="bag-btn" data-id=${items.id}>
                        <i class="fas fa-shopping-cart"></i>
                        Add to cart
                    </button>
                </div>
                <h3>${items.title}</h3>
                <h4>$${items.price}</h4>
          </article>
    `;
    });

    productDOM.innerHTML = result;
  }

  getBagButtons() {

    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons

    buttons.forEach((btn) => {

      let id = btn.dataset.id;
      let inCart = cart.find( item => item.id === id );

      if (inCart) {

        btn.innerText = "In Cart";
        btn.disabled = true;

      }

      btn.addEventListener("click", (event) => {

        event.target.innerText = "In Cart";
        event.target.disabled = true;

        let cartItem = { ...Storage.getProducts( id ), amount: 1}

        cart = [...cart, cartItem ]
        
        Storage.saveCart( cart )
        
        this.setCartValues( cart )
        
        this.showCart()
        
        this.addCartItem( cart )
      });
    });
  }

  setCartValues(cart) {

    let tempTotal = 0
    let totalItems = 0

    cart.map((item)=> {

      tempTotal += item.price * item.amount
      totalItems += item.amount

    })

    cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
    cartItems.innerText = totalItems
    
  }

  addCartItem(item) {

    let div = document.createElement('div')
    div.classList.add('cart-item')
    console.log(item.image);
    div.innerHTML += `
        <img src=${item.image} alt=" image">
        <div>
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount" data-id="">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>
    `
    cartContent.appendChild( div )

  }

  showCart() {

    cartOverlay.classList.add("transparentBcg")
    cartDOM.classList.add("showCart")

  }
  hideCart() {

    cartOverlay.classList.remove("transparentBcg")
    cartDOM.classList.remove("showCart")

  }

  setupApp() {

    cart = Storage.getCart()
    this.setCartValues( cart )
    this.populateCart( cart )

    cartBtn.addEventListener( "click" , () => this.showCart())

    closeCartBtn.addEventListener( "click", () => this.hideCart())

  }

  populateCart( cart ) {

    cart.forEach( item  => this.addCartItem(item))

  }

  cartLogic() {

    clearCart.addEventListener('click', () => this.ClearCart())

    cartContent.addEventListener('click', (event) => {

      if(event.target.classList.contains('remove-item')){

        let removeItem = event.target
        let id = removeItem.dataset.id
        cartContent.removeChild(removeItem.parentElement.parentElement)

        this.removeItem(id)

      }
      else if(event.target.classList.contains('fa-chevron-up')){

        let addAmount = event.target
        let id = addAmount.dataset.id
        let tempItem = cart.find(item => item.id === id )
        tempItem.amount = tempItem.amount + 1
        Storage.saveCart( cart )
        this.setCartValues( cart )
        addAmount.nextElementSibling.innerText = tempItem.amount
        
        console.log(addAmount);        
      }
      else if( event.target.classList.contains('fa-chevron-down')){

        let subAmount = event.target
        let id = subAmount.dataset.id
        let tempItem = cart.find( item => item.id === id)

        if (tempItem.amount > 0){

            tempItem.amount = tempItem.amount - 1
            this.setCartValues( cart)
            Storage.saveCart(cart)
            subAmount.previousElementSibling.innerText = tempItem.amount

        } else {
            cartContent.removeChild(subAmount.parentElement.parentElement)
            this.removeItem(id)
            this.hideCart()
        }
      }
        
    })
    cartOverlay.addEventListener( 'click', (event) => {

      if(event.target.classList.contains('cart-overlay')){
        
        this.hideCart()
      }

    })
  }

  ClearCart() {

    let cartItem = cart.map( item => item.id )
    cartItem.forEach( id => this.removeItem(id))

    while( cartContent.children.length > 0){
      cartContent.removeChild(cartContent.children[0])
    }
    this.hideCart()
  }

  removeItem(id) {

    cart = cart.filter(item => item.id !== id)
    this.setCartValues(cart)
    Storage.saveCart(cart)
    let button = this.getSingleButton(id)
    button.disabled = false
    button.innerHTML =  `<i class="fas fa-shopping-cart"></i>Add to Cart`

  }

  getSingleButton(id) {

   return buttonsDOM.find( button => button.dataset.id === id)

  }

 
}


class Storage {

  static saveProducts(product) {
    localStorage.setItem("Products", JSON.stringify(product));
  }

  static getProducts(id) {
    let item = JSON.parse( localStorage.getItem('Products'))
    return item.find( product => product.id === id)
  }
  
  static saveCart( cart ){
    localStorage.setItem("cart" , JSON.stringify( cart ))
  }

  static getCart() {

    return localStorage.getItem("cart")? JSON.parse(localStorage.getItem("cart")) : []
    
  }
}

document.addEventListener("DOMContentLoaded", () => {

  const product = new Product();
  
  const ui = new UI();

  ui.setupApp()
  
  product.getProducts().then((products) => {
    
    ui.displayProducts(products);
    Storage.saveProducts(products);
    
  }).then(() => {
    
    ui.getBagButtons()
    ui.cartLogic()
    
})
})
