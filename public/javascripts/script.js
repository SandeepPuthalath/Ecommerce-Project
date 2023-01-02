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