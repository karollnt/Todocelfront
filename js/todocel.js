;
var todocel = (function () {
  var config = {
    $document: $(document),
    backend: 'http://localhost/TodoCel'
  }

  var init = function () {
    todocel.navLinks.init();
    todocel.cartHandler.init();
    todocel.productos.init();
  };

  return {
    config: config,
    init: init
  };
})();

todocel.utils = (function () {
  var fillMonthSelect = function (id) {
    var str = "";
    for (var i = 1; i <= 12; i++) {
      str += "<option value='"+i+"'>"+i+"</option>";
    }
    $(id).html(str);
  };

  var fillYearSelect = function (id) {
    var fd = new Date();
    var miny = fd.getFullYear();
    var maxy = miny + 30;
    var str = "";
    for (var i = miny; i < maxy; i++) {
      str += "<option value='"+i+"'>"+i+"</option>";
    }
    $(id).html(str);
  };

  return {
    fillMonthSelect: fillMonthSelect,
    fillYearSelect: fillYearSelect
  };
})();

todocel.navLinks = (function () {
  var init = function () {
    todocel.config.$document.on('click','.main-nav a, .js-nav-item',function (ev) {
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
    if (url.indexOf('index') > -1) {
      todocel.cartHandler.init();
    }
    if (url.indexOf('pasarela') > -1) {
      setTimeout(function(){
        mercpagoui.initEvents();
        todocel.utils.fillMonthSelect('.js-expirationMonth');
        todocel.utils.fillYearSelect('.js-expirationYear');
        todocel.payments.init();
      },1000);
    }
  };

  return {
    init: init
  };
})();

todocel.productos = (function () {
  var init = function () {
    todocel.config.$document
    .off('click','.js-show-shop-item')
    .on('click','.js-show-shop-item',abrirDetalleProducto);
  };

  var abrirDetalleProducto = function (ev) {
    ev.preventDefault();
    var element = ev.currentTarget;
    var url = element.href;
    mainView.router.loadPage(url+"?"+(Math.floor((Math.random() * 1000) + 1)));
    verDetalleProducto(element.dataset.id);
  };

  var verDetalleProducto = function (id) {
    var ajx = $.ajax({
      url: todocel.config.backend+'/productos/detallesProducto',
      type: 'post',
      dataType: 'json',
      data: {id: id}
    });
    ajx.done(function (resp) {
      var html = '';
      if (resp.error) {
        html = resp.error;
      }
      else {
        html = renderProductDetails(resp);
      }
      $('.js-product-detail').html(html);
    }).fail(function (err) {
      console.error(err);
    });
  };

  var renderProductDetails = function (product) {
    var html = '';
    if (product) {
      var source = $("#shopProductDetails").html();
      var template = Handlebars.compile(source);
      html = template(product);
    }
    return html;
  };

  var listarProductos = function () {
    var ajx = $.ajax({
      url: todocel.config.backend+'/productos/listarProductos',
      type: 'post',
      dataType: 'json',
      data: {}
    });
    ajx.done(function (data) {
      var html = '';
      if (data.error) {
        html = data.error;
      }
      else {
        var products = data.productos;
        if (products.length) {
          $.each(products,function (index,product) {
            html += '<li style="opacity: 1;">' + renderProduct(product) + '</li>';
          });
        }
        else {
          html = 'no hay productos aun';
        }
      }
      $('.js-shop-items').html(html);
    });
  };

  var renderProduct = function (product) {
    var html = '';
    if (product) {
      var source = $("#shopProductItem").html();
      var template = Handlebars.compile(source);
      html = template(product);
    }
    return html;
  };

  return {
    init: init,
    listarProductos: listarProductos
  };
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
    todocel.config.$document.off('submit','.js-cart-element-form');
    todocel.config.$document.on('submit','.js-cart-element-form',addToCart);
    todocel.config.$document.on('click','.js-cart-remove-item',removeFormCart);
    todocel.config.$document.off('click','.js-addtocart');
    todocel.config.$document.on('click','.js-addtocart',triggerSubmit);
    todocel.config.$document.off('click','.js-enviaPago');
    todocel.config.$document.on('click','.js-enviaPago',updateStock);
  };

  var triggerSubmit = function (ev) {
    var elem = ev.currentTarget;
    var $form = $(elem).parent().find('.js-cart-element-form');
    $form.trigger('submit');
  };

  var addToCart = function (ev) {
    ev.preventDefault();
    var form = ev.currentTarget;
    var dataSize = cartData.items.length;
    var exists = false;
    var item = {
      id: form.querySelector('.js-cart-element-id').value * 1,
      quantity: form.querySelector('.js-cart-element-quantity').value * 1,
      number: dataSize + 1,
      name: form.querySelector('.js-cart-element-name').value,
      price: form.querySelector('.js-cart-element-price').value * 1,
      image: form.querySelector('.js-cart-element-image').value
    };
    for (var i = 0; i < dataSize; i++) {
      if (cartData.items[i].id == item.id && !exists) {
        cartData.items[i].quantity += item.quantity;
        exists = true;
      }
    }
    if (exists) saveCart();
    else addItem(item);
    alert('Producto agregado!');
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
      if (cartData.items[i]) {
        if (cartData.items[i].id == item.id) {
          cartData.items.splice(i,1);
        }
      }
    }
    saveCart();
    renderCart();
  };

  var saveCart = function () {
    var strc = JSON.stringify(cartData);
    storage.setItem('todocelCart',strc);
  };

  var emptyCart = function () {
    cartData = {items: []};
    storage.removeItem('todocelCart');
  };

  var renderCartItem = function (product) {
    var html = '';
    if (product) {
      var source = $("#cartProductItem").html();
      var template = Handlebars.compile(source);
      html = template(product);
    }
    return html;
  };

  var renderCart = function () {
    var html = '', total = 0;
    var dataSize = cartData.items.length;
    for (var i = 0; i < dataSize; i++) {
      cartData.items[i].number = i + 1;
      html += renderCartItem(cartData.items[i]);
      total += cartData.items[i].price * cartData.items[i].quantity;
    }
    $('.js-cart-quantity').html('('+dataSize+' productos)');
    $('.js-cart-items').html(html);
    $('.js-cart-subtotal').html('$'+(Math.round(total*0.84)));
    $('.js-cart-vat').html('$'+(Math.round(total*0.16)));
    $('.js-cart-total').html('$'+total);
    var $linkCheckout = $('.js-go-checkout');
    if (dataSize > 0) {
      $linkCheckout.show();
    }
    else {
      $linkCheckout.hide();
    }
  };

  var verifyCartStock = function () {
    var ajx = $.ajax({
      url: todocel.config.backend+'/productos/verificarStockCart',
      type: 'post',
      dataType: 'json',
      data: {cartData: JSON.stringify(cartData)}
    });
    ajx.done(function (data) {
      if (data.responseCode == 1) {
        todocel.payments.processPayment();
      }
      else {
        alert(data.responseMessage);
      }
    })
    .fail(function (err) {
      console.log(err);
    });
  };

  var updateStock = function () {
    var dataSize = cartData.items.length;
    if (dataSize > 0) {
      var ajx = $.ajax({
        url: todocel.config.backend+'/productos/actualizarStock',
        type: 'post',
        dataType: 'json',
        data: {cartData: JSON.stringify(cartData)}
      });
      ajx.done(function (data) {
        if (data.responseCode == 1) {
          emptyCart();
          mainView.router.loadPage('success.html');
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

  var getTotal = function () {
    var total = 0;
    var dataSize = cartData.items.length;
    for (var i = 0; i < dataSize; i++) {
      total += cartData.items[i].price * cartData.items[i].quantity;
    }
    return total;
  };

  return {
    init: init,
    getTotal: getTotal,
    verifyCartStock: verifyCartStock,
    updateStock: updateStock
  };
})();

todocel.payments = (function () {
  var storage = window.localStorage;
  var cartData = {items: []};
  var init = function () {
    renderPrices();
  };

  var renderPrices = function () {
    var total = todocel.cartHandler.getTotal();
    $('.js-checkout-subtotal').html('$'+(Math.round(total*0.84)));
    $('.js-checkout-vat').html('$'+(Math.round(total*0.16)));
    $('.js-checkout-total').html('$'+total);
    $('.js-checkout-valor').val(total);
  };

  var sendPayment = function () {
    var $data = document.querySelector('.js-enviarPago');
    todocel.cartHandler.verifyCartStock();
  };

  var processPayment = function () {
    Mercadopago.createToken($data,function (st,resp) {
      if(st!=200 && st!=201) {
        alert('No es posible llevar a cabo el proceso');
      }
      else {
        todocel.cartHandler.updateStock();
      }
    });
  };

  return {
    init: init,
    sendPayment: sendPayment,
    processPayment: processPayment
  };
})();

todocel.config.$document.ready(function () {
  todocel.init();
});
