$(document).ready(function(){
    $('.menu-burger').click(function(e){
        e.preventDefault()
        $(this).toggleClass('_active')
        $('.menu').toggleClass('_active')
        $('body').toggleClass('_lock')
    })
    
    $('.inner-video__content__wrapper').click(function(e) {
        $(this).children('.inner-video__bg').css('display', 'none')
        $(this).children('.inner-video__play').css('display', 'none')
    })
})