function zoomIn() {
  const main_image = document.getElementById("main_image");
  const curr_width = main_image.clientWidth;
  console.log(curr_width);
  main_image.style.width = curr_width + 100 + "px";
}

function zoomOut() {
  const main_image = document.getElementById("main_image");
  const curr_width = main_image.clientWidth;
  main_image.style.width = curr_width - 100 + "px";
}

//paypalPayment initializer function
function paypalPayment(total) {
  paypal_sdk
    .Buttons({
      createOrder: async function () {
        return fetch('/create_order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            total: total,
            items: [
              {
                id: 1,
              },
            ],
          }),
        })
          .then((res) => {
            if (res.ok) return res.json();
            return res.json().then((json) => Promise.reject(json));
          })
          .then(({ id }) => {
            return id;
          })
          .catch((e) => {
            console.error(e.error);
          });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(() => {
          console.log(data);
          $.ajax({
            url: '/paypal_success',
            method: 'get',
            success: (response) => {
              if (response.status) {
                location.replace('/');
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                  footer: '<a href="/">Goto home page</a>',
                });
              }
            },
          });
        });
      },
    })
    .render('#paypal');
}

function razorpayPayment(orderInfo) {
  const options = {
    key: "rzp_test_dT2hX9gH8hyKFB", // Enter the Key ID generated from the Dashboard
    amount: orderInfo.order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "Acme Corp", //your business name
    description: "Test Transaction",
    image: "https://example.com/your_logo",
    order_id: `${orderInfo.order.id}`, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      swal(response.razorpay_payment_id).then(() => {
        swal(response.razorpay_order_id).then(() => {
          swal(response.razorpay_order_id);
        });
      });

      verifyPayment(response, orderInfo.order, orderInfo.orderDetails);
    },
    prefill: {
      name: `${orderInfo.orderDetails.address.name}`, //your customer's name
      email: "gaurav.kumar@example.com",
      contact: `${orderInfo.orderDetails.address.phone_number}`,
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
}

function verifyPayment(payment, order, orderDetails) {
  console.log(order)
  $.ajax({
    url: "/verify-payment",
    data: {
      payment,
      order,
    },
    method: "post",
    success: (response) => {
      if (response.status) {
        swal({
          title: "Good job!",
          text: "Payment successfull!",
          icon: "success",
          button: "Ok!",
        }).then(() => {
          location.href = '/api/user/settings/' + orderDetails._id
        })

      } else {
        swal({
          title: "sorry!",
          text: "Payment failed",
          icon: "error",
          button: "Ok!",
        }).then(() => {
          location.href = '/api/cart'
        })

      }
    },
  });
}

// ajax function for adding product ot cart
function addToCart(prodId) {
  const iconQtycount = document.getElementById('cartCount')
  $.ajax({
    url: "/api/user/cart/add-to-cart/" + prodId,
    method: "put",
  }).done(res => {
    if (res.error) {
      swal(`Failed! ${res.message}!`, {
        icon: "error",
      });
    } else {
      iconQtycount.innerHTML = parseInt(iconQtycount.innerHTML) + 1;
      swal("Successfull !", "Prodcut added to cart !", "success");
    }
  }).fail(err => {
    location.href = "/login";

  })
}

//ajax function for increasing product quantity
function changeQuantity(cartId, prodId, userId, count) {
  const quantity = parseInt(document.getElementById(prodId).innerHTML);
  const iconQtycount = parseInt(document.getElementById('cartCount').innerHTML)

  count = parseInt(count);

  $.ajax({
    url: "/api/user/cart/change-product-quantity",
    data: {
      user: userId,
      cart: cartId,
      product: prodId,
      count: count,
      quantity: quantity,
    },
    method: "patch",
    success: (response) => {
      if (response.response.removeProduct) {
        let productId = "row" + prodId;
        document.getElementById(productId).style.display = "none";
        swal("Successfull !", "Prodcut removed from cart !", "success");
        location.reload();
      } else if (response.response.isOutOfStock) {
        swal("Sorry !", "Product is out of stock!", "error");
      } else {
        document.getElementById(prodId).innerHTML = quantity + count;
        document.getElementById('cartCount').innerHTML = iconQtycount + count;
        document.getElementById('subtotal-' + prodId).innerHTML = parseInt(document.getElementById('product-price-' + prodId).innerHTML) * (quantity + count)
        document.getElementById("totalAmount").innerHTML = "Rs. " + response.cart.totalAmount
        document.getElementById("subTotalAmount").innerHTML = "Rs. " + response.total;
        document.getElementById('discountAmount').innerHTML = response.cart.discount
      }
    },
  });
}

function removeCartProduct(cartId, prodId) {
  swal("Are you sure you want to do this?", {
    buttons: ["No", "Yes"],
  }).then(() => {
    $.ajax({
      url: "/api/user/cart/remove-cart-product",
      data: {
        cart: cartId,
        product: prodId,
      },
      method: "delete",
      success: (response) => {
        let productId = "row" + prodId;
        swal("Successfull !", "Prodcut removed from cart !", "success").then(
          () => {
            document.getElementById(productId).style.display = "none";
            location.reload();
          }
        );
      },
    });
  });
}

// placing order
$("#checkout-form").submit((e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  swal("Are you sure you want to do this?", {
    buttons: ["No", "Yes"],
  }).then((res) => {
    if (res) {
      $.ajax({
        url: "/place-order",
        method: "post",
        data: $("#checkout-form").serialize(),
        success: (response) => {
          switch (response.success) {
            case "cod":
              swal(
                "Successfull !",
                "Order Placed Successfully !",
                "success"
              ).then(() => {
                location.href = `${response.redirect_urls}`;
              });
            case "paypal":
              paypalPayment(response.value);

            case "razorpay":
              razorpayPayment(response);
          }
        },
      });
    }
  })
});


// adding address

$("#add-address").submit((e) => {
  e.preventDefault();
  e.stopImmediatePropagation();

  $.ajax({
    url: "/add-address",
    type: "POST",
    data: $("#add-address").serialize(),
    success: (response) => {
      swal("Successfull !", "Address has been added!", "success").then(
        (response) => {

          location.reload();
        }
      );
    },
  });
});

// adding to wish list function

function addToWishlist(prodId, userId) {
  if (prodId && userId) {
    console.log(userId, prodId)
    $.ajax({
      url: "/addToWishlist",
      method: "post",
      data: {
        userId: userId,
        prodId: prodId,
      },
      success: (res) => {
        swal("Successfull !", "product add to wishlist!", "success").then(
          () => {
            location.href = "/user-wishlist";
          }
        );
      },
    });
  } else {
    location.href = "/login";
  }
}

// removing address from the address cartmodel

function removeAddress(addressId) {
  swal({
    title: "Are you sure?",
    text: "your want to delete the address !",
    icon: "info",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      $.ajax({
        url: "/remove-address/" + addressId,
        method: "DELETE",
        success: (response) => {
          swal("your address has been deleted ", {
            icon: "success",
          }).then(() => {
            document.getElementById(addressId).style.display = "none";
          });
        },
      });
    } else {
      swal("your address is not deleted!");
    }
  });
}

function addFromWishlist(prodId) {
  $.ajax({
    url: "/addFromWishlist/" + prodId,
    method: "put",
    success: (response) => {
      swal("Successfull !", "product add to wishlist!", "success").then(() => {
        location.reload();
      });
    },
  });
}
