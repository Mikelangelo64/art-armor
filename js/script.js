$(document).ready(function(){

    const isMobile = {
        Android: function(){
            return navigator.userAgent.match(/Android/i)
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i)
        },
        iOS: function(){
            return navigator.userAgent.match(/iPhone|iPad|iPod/i)
        },
        Opera: function(){
            return navigator.userAgent.match(/Opera mini/i)
        },
        Windows: function(){
            return navigator.userAgent.match(/IEMobile/i)
        },
        any: function(){
            return(
                isMobile.Android() ||
                isMobile.BlackBerry() ||
                isMobile.iOS() ||
                isMobile.Opera() ||
                isMobile.Windows()
            )
        }
    }

    if(isMobile.any()){
        $('body').addClass('_touch')

    }else{
        $('body').addClass('_pc')
    }

    //scroll
    let sections = Array.from(document.querySelectorAll('section'))
    let index = 0
    let currentSection = sections[index]
    function slide() {
        h = document.documentElement.clientHeight
        $('section').css('height', h)
    }

    $(window).resize(slide)
    $(document).ready(slide)
    let currentScroll = window.scrollY
    let lastScroll = currentScroll
    let ticking = true

    function listener(evt){
        lastScroll = currentScroll
        currentScroll = window.scrollY 
        console.log(currentScroll, lastScroll, ticking);

        if(ticking) {
            if(lastScroll - currentScroll < 0) {
                console.log('down');
                index = Math.min(index + 1, sections.length - 1)
            }
            if(lastScroll - currentScroll > 0) {
                console.log('up');
                index = Math.max(index - 1, 0)
            }
            console.log(index);

            if (index === 0) {
                makeWhite('.header')
                makeWhite('.button-svg')
                makeWhite('.footer')
            } else {
                makeBlack('.header')
                makeBlack('.button-svg')
                makeBlack('.footer')
            }
            //console.log(currentScroll);
            // setTimeout(() => {
            //     //ticking = true
            //     // document.addEventListener('scroll', listener)
            // }, 500);
        }
        
        document.removeEventListener('scroll', listener)
        $('html, body').animate({
            scrollTop: $(sections[index]).offset().top
        }, 300, "linear", () => {
            currentScroll = window.scrollY
            ticking = true
            document.addEventListener('scroll', listener)
        })
    }
    if(!isMobile.any()){
        document.addEventListener('scroll', listener)
    }

    //menu open
    $('.menu-burger').click(function(e){
        e.preventDefault()
        $(this).toggleClass('_active')
        $('.menu').toggleClass('_active')
        $('body').toggleClass('_lock')
    })

    //make white/black header/footer
    function makeWhite(section) {
        $(section).removeClass('_black')
        $(section).addClass('_white')
    }
    function makeBlack(section) {
        $(section).removeClass('_white')
        $(section).addClass('_black')
    }

    makeWhite('.header')
    makeWhite('.button-svg')
    if(isMobile.any()) {
        sections.forEach((section, index) => {
            callback = (entries, observer) => {
                if (entries[0].isIntersecting) {
                    //console.log(index, entries);
                    if (index === 0) {
                        makeWhite('.header')
                        makeWhite('.button-svg')
                        makeWhite('.footer')
                    } else {
                        makeBlack('.header')
                        makeBlack('.button-svg')
                        makeBlack('.footer')
                    }
                }
            }
            let observerHead = new IntersectionObserver(callback, {threshold: 0.5})
            //let observerFoot = new IntersectionObserver(callback, {threshold: 0.2})
            observerHead.observe(section)
            //observerFoot.observe(section)
        })
    }

    //popup open/close
    $('.popup .popup__close').click(function(e){
        e.preventDefault()
        $('body').removeClass('_lock')

        $('.popup').each(function(index, element){
            $(element).removeClass('_open');
        })
    })

    $('.popup-open').click(function(e){
        e.preventDefault()
        const popup = $(this).attr('data-popup')
        $(popup).addClass('_open')
        $('body').addClass('_lock')
    })

    //date counter year
    $('.minus').click(function () {
        var $input = $(this).parent().find('input');
        var count = parseInt($input.val()) - 1;
        count = count < 2022 ? 2022 : count;
        $input.val(count);
        $input.change();
        return false;
    });

    $('.plus').click(function () {
        var $input = $(this).parent().find('input');
        var count = parseInt($input.val()) + 1;
        count = count > 2025 ? 2025 : count;
        $input.val(count);
        return false;
    });

    //date-list appear
    $('.date-list').fadeOut(300)
    if(isMobile.any()) {
        $('.date__title').click(function(e){
            $(this).parent().children('.date-list').fadeToggle(300)
        })
        // $('body').not($('.date__title')).click(function(e){
        //     console.log(1);
        //     // $('.date-list').each(function(index, element){
        //     //     $(element).fadeOut(300)
        //     // })
        // })
    } else {
        $('.date').hover(function(e){
            $(this).children('.date-list').fadeToggle(300)
        })
    }

    //scroll to date

    function makeHorizontalScroll(section) {
        $(`${section} .date-list__months__item`).click(function(e){
            e.preventDefault()
            $(`${section} .date-list`).fadeOut(300)
            //select year and month for sorting
            const year = $(this).parent().parent().parent().children('.date-list__year').children('.year').val()
            const month = $(this).attr('data-month')
    
            //get all elements of timeline list
            const yearsArr = Array.from(document.querySelectorAll(`${section} .horizontal-list-timeline .horizontal-list-timeline__item`))
    
            //get elements with current year
            let sortYears = []
            yearsArr.forEach(item => {
                if( $(item).attr('data-year') == year ){
                    sortYears.push(item)
                }
            })
    
            if(sortYears.length === 0) {
                return false
            }
    
            //select element with current month
            let choosenItem = sortYears[0]
    
            sortYears.forEach(item => {
                if($(choosenItem).attr('data-month') == month) {
                    return
                }
                if($(item).attr('data-month') == month) {
                    choosenItem = item
                    return
                }
                if($(item).attr('data-month') < month && $(item).attr('data-month') > $(choosenItem).attr('data-month')) {
                    choosenItem = item
                    return
                }
            })
    
            if($(choosenItem).hasClass('_current')) {
                return false
            }
    
            $(`${section} .horizontal-list-timeline__item`).each(function(index, element){
                $(element).removeClass('_current')
            })
            $(choosenItem).addClass('_current')
            
            $(`${section} .horizontal-list__wrapper`).animate({
                scrollLeft: $(choosenItem).offset().left - +$(`${section} .horizontal-list`).css('marginLeft').slice(0, -2)
            }, 300, "linear")
        })
    }
    
    makeHorizontalScroll('.timeline')
    makeHorizontalScroll('.digest')

    //swipers
    let swiperWorks = new Swiper(".swiper.works-swiper", {
        navigation: {
            nextEl: ".works__btns__container .swiper-button-next",
            prevEl: ".works__btns__container .swiper-button-prev",
        },
        slidesPerView: 1,
        spaceBetween: 18,
    })
})