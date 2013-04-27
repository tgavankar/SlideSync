function goFullscreen(id) {
    // fire event to resize PDF canvas
    var element = document.getElementById(id);


    if(document.fullScreen) {
        document.cancelFullScreen();
        return false;
    } else if(document.mozFullScreen) {
        document.mozCancelFullScreen();
        return false;
    } else if(document.webkitIsFullScreen) {
        document.webkitCancelFullScreen();
        return false;
    }


    if(element.RequestFullScreen) {
        element.RequestFullScreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }
}