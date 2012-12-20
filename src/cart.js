var Tekpub = Tekpub || {};
Tekpub.CartItem = function(options){
  
  var cartItem = {};
  var qty = (options.quantity || 1);
  cartItem.price = options.price || 0.00;
  cartItem.quantity = qty;
  cartItem.sku = options.sku || "";
  cartItem.description = options.description || "";
  cartItem.discount = options.discount || 0;
  cartItem.priceInPennies = function(){
    return cartItem.price * 100;
  };

  cartItem.lineTotal = function() {
    return (cartItem.price - cartItem.discount) * cartItem.quantity;
  };

  return cartItem;
}

Tekpub.Cart = function(){
  var self = this;
  var stored = JSON.parse(localStorage.getItem("tekpubCart")) || [];
  self.items = ko.observableArray(stored);

  self.calculateDiscount = function(){
    ko.utils.arrayForEach(self.items(),function(item){
      //you can monkey with this all you like, 
      //but I'm not dumb enough to let you :). If you do,
      //I'll keep the money you pay, and make you tell me
      //why there's a discrepancy :)

      //simple rule : 20% discount if you buy 5 or more
      if(item.quantity >= 5){
        item.discount = (item.price * item.quantity) * .2;
      }else{
        item.discount = 0;
      }

    });
  };

  self.addClicked = function(data,ev) {
    var item =$(ev.currentTarget).data();
    self.addItem(item);
  };

  self.addItem = function(item){
    var existing = self.find(item.sku);
    var items = self.items();

    if(existing){
      existing.quantity = parseInt(existing.quantity);
      existing.quantity+= (item.quantity || 1);
      self.items(self.items());
      //refresh hack
      self.refreshItems();
    }else{
      existing = Tekpub.CartItem({
        price : item.price,
        sku : item.sku, 
        description : item.description,
        quantity : item.quantity || 1
      });
      self.items.push(existing); 
    }
    return existing;
  };
  
  self.refreshItems = function(){

    var old = self.items.removeAll();
    self.items(old);

  };

  self.rowCount = function() {
    return self.items().length;
  };

  self.remove = function(sku) {
    self.items.remove(function(item) {
      return item.sku == sku;
    });
  };
  
  self.toMoney = function(amount){
    var fixed = amount.toFixed(2);
    return "$" + fixed;
  };

  self.removeClicked = function(item) {
    self.remove(item.sku);
  };

  self.itemCount = function() {
    var itemCount = 0;
    ko.utils.arrayForEach(self.items(),function(item){
      itemCount += item.quantity;
    });
    return itemCount;
  };

  self.total = function() {
    var sum = 0;
    ko.utils.arrayForEach(self.items(),function(item){
      sum += (item.price * item.quantity) - item.discount;
    });
    return sum;
  };

  self.empty = function(){
    self.items([]);
  };

  self.contains = function(sku) {
    return self.items.indexOf({sku : sku});
  };

  self.find = function(sku){
    return ko.utils.arrayFirst(self.items(),function(item){
      return item.sku === sku;
    });
  };

  self.items.subscribe(function(items){
    self.calculateDiscount();
    localStorage.setItem("tekpubCart",JSON.stringify(items));
  });

  self.hasItems = ko.computed(function(){
    return self.rowCount() > 0;
  });

  self.quantityChanged = function(item,ev) {
    var qty = parseInt(item.quantity)
    if(qty == 0){
      self.items.remove(item);
    }
    if(!self.isNumber(item.quantity)){
      item.quantity = 1;
    }
    self.refreshItems();
  };

  self.isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
};

$(function(){
  
  Tekpub.Cart = new Tekpub.Cart();
  ko.applyBindings(Tekpub.Cart);

  $("#checkout").on("click",function(){
    $("#checkoutForm").submit();
  });

});
