var Tekpub = Tekpub || {};

Tekpub.CartItem = function(options){
  
  var cartItem = {};
  var qty = (options.quantity || 1);
  cartItem.price = ko.observable(options.price || 0.00);
  cartItem.quantity = ko.observable(qty);
  cartItem.sku = ko.observable(options.sku || "");
  cartItem.description = ko.observable(options.description || "");
  cartItem.discount = ko.observable(options.discount || 0);

  cartItem.displaySubtotal = ko.computed(function() { 
    return Tekpub.Utils.toMoney(cartItem.price() * cartItem.quantity());
  });

  cartItem.displayDiscount = ko.computed(function() { 
    return Tekpub.Utils.toMoney(cartItem.discount());
  });

  cartItem.displayTotal = ko.computed(function() { 
    return Tekpub.Utils.toMoney(cartItem.price() * cartItem.quantity() - cartItem.discount());
  });

  cartItem.quantity.subscribe(function(newQuantity){
    if(cartItem.quantity() >= 5){
        cartItem.discount((cartItem.price() * cartItem.quantity()) * .2);
    }else{
        cartItem.discount(0);
    }
  });

  cartItem.incrementQuantity = function() { 
    cartItem.quantity(cartItem.quantity() + 1);
  };
  cartItem.priceInPennies = function(){
    return cartItem.price() * 100;
  };

  cartItem.lineTotal = function() {
    return (cartItem.price() - cartItem.discount()) * cartItem.quantity();
  };

  return cartItem;
}

Tekpub.Utils = (function() { 
    var self = this;

    self.toMoney = function(amount){
      var fixed = amount.toFixed(2);
      return "$" + fixed;
    };
    self.storedToCartItems = function(items) { 
      var parsedItems = [];

      ko.utils.arrayForEach(items, function(item) { 
        parsedItems.push(new Tekpub.CartItem(item));
      });

      return parsedItems;
    };

    return self;
})();

Tekpub.Cart = function(){
  var self = this;
  var stored = JSON.parse(localStorage.getItem("tekpubCart")) || [];

  self.items = ko.observableArray(Tekpub.Utils.storedToCartItems(stored));

  self.addClicked = function(data,ev) {
    var item =$(ev.currentTarget).data();
    self.addItem(item);
  };

  self.addItem = function(item){
    var existing = self.find(item.sku);
    var items = self.items();

    if(existing){
      existing.incrementQuantity();
    }else{
      existing = new Tekpub.CartItem({
        price : item.price,
        sku : item.sku, 
        description : item.description,
        quantity : item.quantity || 1
      });
      self.items.push(existing); 
    }
    return existing;
  };
  
  self.rowCount = function() {
    return self.items().length;
  };

  self.remove = function(sku) {
    self.items.remove(function(item) {
      return item.sku() == sku;
    });
  };
  
  self.removeClicked = function(item) {
    self.remove(item.sku());
  };

  self.itemCount = function() {
    var itemCount = 0;
    ko.utils.arrayForEach(self.items(),function(item){
      itemCount += item.quantity();
    });
    return itemCount;
  };

  self.total = function() {
    var sum = 0;
    ko.utils.arrayForEach(self.items(), function(item){
      sum += (item.price() * item.quantity() - item.discount());
    });
    return sum;
  };

  self.displayTotal = ko.computed(function() { 
    return Tekpub.Utils.toMoney(self.total());
  });

  self.empty = function(){
    self.items([]);
  };

  self.contains = function(sku) {
    return self.items.indexOf({sku : sku});
  };

  self.find = function(sku){
    return ko.utils.arrayFirst(self.items(),function(item){
      return item.sku() === sku;
    });
  };

  self.items.subscribe(function(items){
    localStorage.setItem("tekpubCart",ko.toJSON(items));
  });

  self.hasItems = ko.computed(function(){
    return self.rowCount() > 0;
  });

  self.quantityChanged = function(item,ev) {
    var qty = parseInt(item.quantity())
    if(qty == 0){
      self.items.remove(item);
    }
    if(!self.isNumber(item.quantity())){
      item.quantity = 1;
    }
  };

  self.isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

};

$(function(){
  
  Tekpub.Cart = new Tekpub.Cart();
  ko.applyBindings(Tekpub.Cart);

  $("#checkout").on("click",function(){
    $("#checkoutForm").submit();
  });

});
