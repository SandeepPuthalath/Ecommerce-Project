function zoomIn() {
    var main_image = document.getElementById('main_image');
    var curr_width = main_image.clientWidth;
    console.log(curr_width);
    main_image.style.width = (curr_width + 100) + 'px';

}

function zoomOut() {
    var main_image = document.getElementById('main_image');
    var curr_width = main_image.clientWidth;
    main_image.style.width = (curr_width - 100) + 'px';

}

// ajax function for adding product ot cart
function addToCart(prodId) {
    $.ajax({
        url: '/user/add-to-cart/' + prodId,
        method: 'get',
        success: (response) => {
            swal("Successfull !", "Prodcut added to cart !", "success").then((response) =>{
                location.href = '/user/user-cart'
            })
        }
    })
}

//ajax function for increasing product quantity
function changeQuantity(cartId, prodId, userId, count) {
    let quantity = parseInt(document.getElementById(prodId).innerHTML);
    count = parseInt(count);
    $.ajax({
        url: '/change-product-quantity',
        data: {
            user : userId,
            cart: cartId,
            product: prodId,
            count: count,
            quantity: quantity
        },
        method: 'post',
        success: (response) => {
            if (response.removeProduct) {
                // location.reload()
                let productId = 'row' + prodId
                document.getElementById(productId).style.display = 'none';
                swal("Successfull !", "Prodcut removed from cart !", "success");
            }
            else {
                document.getElementById(prodId).innerHTML = quantity + count;
                document.getElementById('totalAmount').innerHTML = "Rs. "+response.totalAmount;
                document.getElementById('subTotalAmount').innerHTML ="Rs. " + response.totalAmount;
            }
        }
    })
}

function removeCartProduct(cartId, prodId) {
    $.ajax({
        url: "/remove-cart-product",
        data: {
            cart: cartId,
            product: prodId
        },
        method: 'post',
        success: (response) => {
            let productId = 'row' + prodId
            document.getElementById(productId).style.display = 'none';
            swal("Successfull !", "Prodcut removed from cart !", "success");
            // location.reload()

        }
    })
}


$('#checkout-form').submit((e) =>{
    e.preventDefault();
    $.ajax({
        url : '/place-order',
        method : 'post',
        data :$('#checkout-form').serialize(),
        success :(response) =>{
            swal("Successfull !", "Order Placed Successfully !", "success").then((response) =>{
                location.href  = '/'
            })
        }
    })
})

function cancelOrder(orderId){
    $.ajax({
        url : '/user/order-cancel',
        data :{
            orderId : orderId
        },
        method :'post',
        success : (response) =>{
            swal("Successfull !", "Order Has Been Cancelled !", "success").then((response) =>{
               document.getElementById(orderId).style.display = "none";

            })
        }

    })
}