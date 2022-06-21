const allProducts = document.querySelectorAll("li.grid__item");

let formData = {
 'items': []
};

allProducts.forEach( product => {
  let productOptions = product.querySelectorAll("input[type='radio']");
  let productButton = product.querySelector("button");
  let productPrice = product.querySelector("span.product_price");
  productOptions.forEach( function( option ){
    option.addEventListener('click', function(){
      let id = this.getAttribute('data-id');
      let price = this.getAttribute('data-price');
      let image = this.getAttribute('data-img');
      let productImage = product.querySelector("img");
      productImage.src = image;
      productButton.setAttribute("data-id", id);
      productButton.removeAttribute("disabled");
      productPrice.innerHTML = price;
    });
  });

  let responseJson;

  productButton.addEventListener('click', function(){
    let formData = {
    'items': [{
      'id': this.getAttribute('data-id'),
      'quantity': 1
      }],
      sections: "cart-icon-bubble"
    };

    fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      alert("Item has been added to cart");
      updateProductsCart();
      openSideCart();
      return response.json();
    })
    .then(data => renderCartItems(data))
    .catch((error) => {
      console.error('Error:', error);
    });
  })
});

function renderCartItems( data ){
  
}

let sideCartOverlay = document.querySelector('.sidecart-overlay');
let sideCartContent = document.querySelector('.sidecart-content');
let buttonCloseSideCart = document.querySelector("#closeSideCart");
buttonCloseSideCart.addEventListener("click", closeSideCart );

function openSideCart(){
    sideCartOverlay.classList.add('active');
    sideCartContent.classList.add('active');
}

function closeSideCart(){
    sideCartOverlay.classList.remove('active');
    sideCartContent.classList.remove('active');
}

let sideCartProducts = document.querySelector("#sideCartProducts");
let quantitySelects = sideCartProducts.querySelectorAll(".change-quantity");
let buttonEmptyCart = document.querySelector('#emptyCart');

quantitySelects.forEach( quantitySelect => {
    quantitySelect.addEventListener("change", updateCart );
});

function updateCart( evt ){
    let id = this.getAttribute("data-id");
    let quantity = evt.target.value;    

    let formData = {
        'id': id,
        'quantity': quantity
    }

    fetch(window.Shopify.routes.root + 'cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      alert("Item has been update to cart");
      updateProductsCart();
      return response.json();
    })
    .then( data => console.log(data) )
    .catch((error) => {
      console.error('Error:', error);
    });
}

function updateProductsCart() {
    const request = new XMLHttpRequest();
    let cartProducts = {};
    request.addEventListener('load', function(){
        cartProducts = JSON.parse((this.responseText));
       console.log( cartProducts );
       sideCartProducts.innerHTML = cartProducts['cart-items'];
       quantitySelects = sideCartProducts.querySelectorAll(".change-quantity");
       quantitySelects.forEach( quantitySelect => {
        quantitySelect.addEventListener("change", updateCart );
       });
       console.log( quantitySelects);
    });
    request.open('GET', '/?sections=cart-items', true);
    request.send();
}

buttonEmptyCart.addEventListener("click", emptyCart );

function emptyCart(){
    fetch(window.Shopify.routes.root + 'cart/clear.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      alert("The cart is empty");
      updateProductsCart();
    })
    .then( data => console.log(data) )
    .catch((error) => {
      console.error('Error:', error);
    });
}