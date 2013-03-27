describe("Shopping Cart", function() {

  cart = {};
  var product = {price : 5.00,sku : "monkey",description : "test product"};
  var product2 = {price : 5.00,sku : "chunky",description : "test product"};
  var discountableProduct = {price : 125.00, sku : "expensive", description : "expensive product"};

  beforeEach(function() {
    cart = new Tekpub.Cart();
  });
  
  it("exists",function(){
    expect(cart).toBeDefined();
  });

  describe("Adding things", function(){
    
    beforeEach(function(){
      cart.addItem(product);
    });
    
    afterEach(function(){
      cart.empty();
    });
    
    it("stores a sku", function(){
      expect(cart.find("monkey")).toBeTruthy();
    });

    it("has a count", function(){
      expect(cart.itemCount()).toEqual(1);
    });

    it("stores a description", function(){
      item = cart.find("monkey");
      expect(item.description).toEqual("test product");
    });
    it("stores a quantity and price",function(){
      item = cart.find("monkey");
      expect(item.price).toEqual(5.00);
    });
    it("price in pennies is 1200",function(){
      item = cart.find("monkey");
      expect(item.priceInPennies()).toEqual(500);
    });
    it("increments quantity with duplicate", function() {
      cart.addItem(product);
      item = cart.find("monkey");
      expect(item.quantity()).toEqual(2);
    }); 
    it("empties the cart", function(){
      cart.empty();
      expect(cart.rowCount()).toEqual(0);
      expect(cart.itemCount()).toEqual(0);
    });

  });
  
  describe("Removing things", function(){
    it("removes by sku", function(){
      cart.remove("monkey");
      expect(cart.itemCount()).toEqual(0);
    });
  });

  describe("calculations with 2 rows of 4 items, $5 apiece", function(){
    beforeEach(function() {
      cart.addItem(product);
      cart.addItem(product);
      cart.addItem(product2);
      cart.addItem(product2);

    });

    afterEach(function(){
      cart.empty();
    });

    it("has a row count of 2", function() {
      expect(cart.rowCount()).toEqual(2);  
    });
    it("has an item count of 4", function() {
      expect(cart.itemCount()).toEqual(4);
    });
    it("has a total of $20", function() {
      expect(cart.total()).toEqual(20.00);
    });
  });
  
  describe("storage", function() {
    beforeEach(function() {
      cart.addItem(product);
      cart.addItem(product);
      cart.addItem(product2);
      cart.addItem(product2);

    });
    afterEach(function(){
      cart.empty();
    });
    
    it("stores the cart in localStorage", function() {
      
      expect(localStorage.getItem("tekpubCart")).toBeDefined();
      
    });
  });

  describe("discounts", function(){
    beforeEach(function() {
      //nothing...
    });

    afterEach(function(){
      cart.empty();
    });    

    it("should not apply discount for less than 5 items in cart", function() {
      cart.addItem(discountableProduct);
      cart.addItem(discountableProduct);
      cart.addItem(discountableProduct);
      cart.addItem(discountableProduct);      

      expect(cart.rowCount()).toEqual(1);
      
      var cartItem = cart.items()[0];
      expect(cartItem.quantity()).toEqual(4);
      expect(cartItem.discount()).toEqual(0);
    });

    it("should apply discount for 5 or more items in cart", function() {
      cart.addItem(discountableProduct);
      cart.addItem(discountableProduct);
      cart.addItem(discountableProduct);
      cart.addItem(discountableProduct);
      cart.addItem(discountableProduct);

      expect(cart.rowCount()).toEqual(1);

      var cartItem = cart.items()[0];
      expect(cartItem.quantity()).toEqual(5);
      expect(cartItem.discount()).toEqual(125.00);
    });

  });

});
