// adding banner


$('#add-banner').submit((e) =>{
    e.preventDefault();
    e.stopImmediatePropagation();

    let formData = new FormData(document.getElementById('add-banner'))
    

    swal("Are you sure you want to do this?", {
        buttons: ["Oh noez!", true],
      }).then(value =>{
        if(value){
            $.ajax({
                url : '/admin/add-banner',
                method : 'post',
                data :formData,
                success : (response) =>{
                  swal("Good job!", "You clicked the button!", "success").then(() =>{
                    location.reload();
                  })
                },
                caches : false,
                contentType: false,
                processData: false
            })
        }
      })
      

})