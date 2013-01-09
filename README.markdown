# A Browser-based Shopping Cart, Powered by KnockoutJS

Knockout Cart contains most of the shopping cart logic you'll need to power a simple store. [We use it at Tekpub](http://tekpub.com/gifts/new) to power our gift shopping experience - in fact that's where this is from.

It stores the cart information in localStorage on your user's browser - so the cart experience is persisted from session to session (providing the same browser is used). In addition, there's a very simple discount apparatus that you can tweak as needed.

## Security

The first question that should be on your mind is "what about people monkeying with prices and discounts in localStorage" - and that's a very good concern.

The simple answer is that this will post the cart information to your server in nested arrays - YOU will have to verify that the information is correct and valid before you post it off to the card processor.

You should be doing this anyway :).

## Tweaks

This is a single file to play with as you need. I've included a templates page as well so you can pop the cart in wherever you like and work on it as you will. I'm sure there are some optimizations that can be made to make Knockout... less "Knockout-y" - but I find that if it works, it works.

The template is just what we used and isn't supposed to be something you drop in and use. It's just here as an example to show how we've done the bindings.

Also: **the styling is done by Twitter Bootstrap** so if it looks weird, that's why.

It works for us and we've had no complaints, so far.

## Install

The cart needs KnockoutJS (2.x or greater) and jQuery. Make sure you have those, then pop cart.js into your scripts directory, reference it, and you're off and running.

You can open a console to play with the cart if you like - it's namespaced under Tekpub.Cart.

## Usage
The cart works based on bindings, as well as data attributes set on the HTML markup. **You do not need to use it this way** but if you want Fun Out of The Box you can.

Here's an example:

```html
<button data-bind='click:addClicked' data-description='Tekpub Yearly Subscription' data-price='149.0' data-sku='yearly'>Give</button>
```
The button's click event is bound to the Knockout Cart's click event handler. It will pull off the `data-*` attributes as needed.

## Tests

The Jasmine tests are under the "spec" directory. Just double click the file to run. I'll be adding more of them over time.

## Help and Issues

As always - if there's something you think could be done better, we're all ears. If you can provide a pull request - that's even better!
