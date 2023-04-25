const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCart = document.querySelector(".clear-cart");
const cartItems = document.querySelector(".cart-items");
const cartDom = document.querySelector(".cart");
const productDOM = document.querySelector(".products-center");
const cartOverlay = document.querySelector(".cart-overlay");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content")

let cart = [];
let buttonsDOM = []

class Product {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
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
                        add to bag
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
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;

        let cartItem = { ...Storage.getProducts( id ), amount: 1}
        console.log(cartItem);

        cart = [...cart, cartItem ]

        Storage.saveCart( cart )

        this.setCartValues( cart )

        this.showCart()

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

  addCartItem( item ) {
    const div = document.createElement('div')
    div.classList.add('cart-item')

    div.innerHTML = `
    <img src=${item} alt="">
    <div>
        <h4>${item.title}</h4>
        <h5>$${item.price}</h5>
        <span class="remove-item" data-id=${item.id}>remove</span>
    </div>
    <div>
        <i class="fas fa-chevron-up" data-id=${item.id}></i>
        <p class="item-amount"data-id=${item.amount}></p>
        <i class="fas fa-chevron-down" data-id=${item.id}></i>
    </div>
    `
    cartContent.appendChild(div)
  }

  showCart() {

    cartOverlay.classList.add("transparentBcg")
    cartDom.classList.add("showCart")

  }
  hideCart() {

    cartOverlay.classList.remove("transparentBcg")
    cartDom.classList.remove("showCart")

  }

  setupApp() {

    cart = Storage.getCart()
    this.setCartValues( cart )
    this.populateCart( cart )

    cartBtn.addEventListener( "click" , () => this.showCart())

    closeCartBtn.addEventListener( "click", () => this.hideCart())

  }

  cartLogic() {

    clearCart.addEventListener('click', () => this.ClearCart())

  }

  ClearCart() {

    let cartItem = cart.map( item => item.id )
    cartItem.forEach( id => this.removeItem(id))

  }

  removeItem() {

  }


  populateCart( cart ) {

    cart.forEach(( item ) => this.addCartItem( item ))

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
  const ui = new UI();

  const product = new Product();

  ui.setupApp()

  product.getProducts().then((products) => {

    ui.displayProducts(products);
    Storage.saveProducts(products);

  }).then(() => {

    ui.getBagButtons()
    ui.addCartItem()
    
});
});
