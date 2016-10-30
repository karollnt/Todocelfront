var todocel = ()(function () {
  function listarProductos() {
    var ajx = $.ajax({
      url: '',
      method: 'post',
      data: {}
    });
    ajx.done(function (data) {
      var productos = data.productos;
      var html = '';
      $.each(productos,function (index,producto) {
        html += renderProduct();
      });
      $('.js-shop-items').html(html);
    });
  }

  function renderProduct(product) {
    var html = '';
    if (product) {
      html = '<li>'
        +'<div class="shop_thumb"><a href="shop-item.html"><img src="images/shop_thumb1.jpg" alt="" title="" /></a></div>'
        +'<div class="shop_item_details">'
          +'<h4><a href="shop-item.html">'+product.nombre+'</a></h4>'
          +'<div class="shop_item_price">'+product.precio+'</div>'
          +'<div class="item_qnty_shop">'
            +'<form id="myform" method="POST" action="#">'
              +'<input type="hidden" name="id" value="'+product.id+'" />'
              +'<input type="text" name="quantity'+product.id+'" value="1" class="qntyshop" />'
            +'</form>'
          +'</div>'
          +'<a href="#" data-panel="left" id="addtocart" class="open-panel">Agregar al carrito</a>'
          +'<a href="#" data-popup=".popup-social" class="open-popup shopfav"><img src="images/icons/yellow/love.png" alt="" title="" /></a>'
        +'</div>'
      +'</li>';
    }
    return html;
  }

  return {
    listarProductos: listarProductos
  }
});

todocel.listarProductos();
