;
var todocel = (function () {
  var config = {
    $document: $(document),
    backend: 'http://localhost/TodoCel'
  }

  var init = function () {
    todocel.navLinks.init();
    todocel.cartHandler.init();
  };

  return {
    config: config,
    init: init
  }
})();

todocel.navLinks = (function () {
  var init = function () {
    todocel.config.$document.on('click','.main-nav a',function (ev) {
      var element = ev.currentTarget;
      ev.preventDefault();
      loadPage(element);
    });
  };

  var loadPage = function (element) {
    var url = element.href;
    mainView.router.loadPage(url+"?"+(Math.floor((Math.random() * 1000) + 1)));
    if (url.indexOf('shop') > -1) {
      todocel.productos.listarProductos();
    }
  };

  return {
    init: init
  }
})();

todocel.productos = (function () {
  var listarProductos = function () {
    var ajx = $.ajax({
      url: todocel.config.backend+'/productos/listarProductos',
      type: 'post',
      data: {}
    });
    ajx.done(function (data) {
      var products = data.productos;
      var html = '';
      $.each(products,function (index,product) {
        html += renderProduct(product);
      });
      $('.js-shop-items').html(html);
    });
  };

  var renderProduct = function (product) {
    var html = '';
    if (product) {
      var source = $("#shopProductItem").html();
      template = Handlebars.compile(source);
      html = '<li>'+ template(product) +'</li>';
    }
    return html;
  };

  return {
    listarProductos: listarProductos
  }
})();

todocel.cartHandler = (function () {
  var storage = window.localStorage;
  var cartData = {items: []};

  var init = function () {
    var data = storage.getItem('todocelCart');
    if (data) {
      cartData = JSON.parse(data);
      renderCart();
    }
    todocel.config.$document.on('submit','.js-cart-element-form',addToCart);
    todocel.config.$document.on('click','.js-cart-remove-item',removeFormCart);
  };

  var addToCart = function (ev) {
    ev.preventDefault();
    var form = ev.currentTarget;
    var item = {
      id: form.querySelector('.js-cart-element-id').value,
      quantity: form.querySelector('.js-cart-element-quantity').value,
      number: cartData.items.length,
      name: form.querySelector('.js-cart-element-name').value,
      price: form.querySelector('.js-cart-element-price').value
    };
    addItem(item);
  };

  var addItem = function (item) {
    cartData.items.push(item);
    saveCart();
  };

  var removeFormCart = function (ev) {
    var item;
    ev.preventDefault();
    var elem = ev.currentTarget;
    var dataSize = cartData.items.length;
    for (var i = 0; i < dataSize; i++) {
      if (cartData.items[i].id == elem.dataset.id) {
        item = cartData.items[i];
      }
    }
    if(item) removeItem(item);
  };

  var removeItem = function (item) {
    var dataSize = cartData.items.length;
    for (var i = 0; i < dataSize; i++) {
      if (cartData.items[i].id == item.id) {
        cartData.items.splice(i,1);
      }
    }
    saveCart();
  };

  var saveCart = function () {
    var strc = JSON.stringify(cartData);
    storage.setItem('todocelCart',strc);
  };

  var emptyCart = function () {
    cartData = {items: []};
    storage.removeItem('todocelCart');
  };

  var renderCartItem = function (item) {
    var html = '';
    if (product) {
      var source = $("#cartProductItem").html();
      template = Handlebars.compile(source);
      html = template(product);
    }
    return html;
  };

  var renderCart = function () {
    var html = '', total = 0;
    var dataSize = cartData.items.length;
    for (var i = 0; i < dataSize; i++) {
      html += renderCartItem(cartData.items[i]);
      total += cartData.items[i].price;
    }
    $('.js-cart-items').html(html);
    $('.js-cart-subtotal').html('$'+(Math.round(total*0.84)));
    $('.js-cart-vat').html('$'+(Math.round(total*0.16)));
    $('.js-cart-total').html('$'+total);
  };

  var updateStock = function () {
    var dataSize = cartData.items.length;
    if (dataSize > 0) {
      var ajx = $.ajax({
        url: todocel.config.backend+'/productos/actualizarStock',
        type: 'post',
        data: {cartData: cartData}
      });
      ajx.done(function (data) {
        if (data.responseCode == 1) {
          emptyCart();
          window.location.href= 'success.html';
        }
        else {
          alert(data.responseMessage);
        }
      })
      .fail(function (err) {
        console.log(err);
      });
    }
  };

  return {
    init: init
  }
})();

todocel.init();
