'use strict'

feather.replace()

// sidebar
$('.menu-link.menu-toggle').on('click', function(e){
    const parentElem = $(this).parent()

    $.each($('.menu-item'), function(key, elem){
        var hasOpen = $(elem).hasClass('open')
        if (hasOpen && elem != parentElem[0]) {
            $(elem).removeClass('open')
        }
    })

    parentElem.toggleClass('open')
})

// expand sidebar
$('.navbar-toggle').on('click', '.nav-item', function(e){
    $('.sidebar-menu').toggleClass('sidebar-menu-expanded')
})

$('.sidebar-menu-toggle').on('click', function(e){
    $('.sidebar-menu').removeClass('sidebar-menu-expanded')
})

$('.sidebar-menu-expand-toggle').on('click', function(){
    $('.sidebar-menu').toggleClass('collapsed')
    $('.main-page').toggleClass('expanded')
    if ($('.sidebar-menu').hasClass('collapsed')) {
        $(this).children().replaceWith(feather.icons['circle'].toSvg())
    } else {
        $(this).children().replaceWith(feather.icons['disc'].toSvg())
    }
})

// set active menu
const url = window.location.href
const origin = window.location.origin
const pathname = url.replace(origin, '')

const menus = $('.sidebar-menu').find('.menu-link').not('.menu-toggle')
$.each(menus, function(key, menu){
    var menuUrl = $(menu).attr('href')

    if (pathname.includes(menuUrl) && menuUrl !== '') {
        var parentMenu = $(menu).parents('.menu-item') 
        parentMenu.addClass('active')

        $.each(parentMenu, function(key, parent){
            var menuLink = $(parent).children().first()
            if (menuLink.hasClass('menu-toggle')) {
                menuLink.parent().addClass('open')
            }
        })
    }
})

// perfect scrollbar
const containerMenu = $('.ps-menu')
$.each(containerMenu, function(key, elem){
    let ps = new PerfectScrollbar(elem, {
        wheelSpeed: 2,
        wheelPropagation: false,
        suppressScrollX: true,
        minScrollbarLength: 200
    })

    ps.update()

    elem.addEventListener('ps-scroll-y', function() {
        $('.sidebar-menu-shadow').css('display', 'block')
    })
    
    elem.addEventListener('ps-y-reach-start', function(){
        $('.sidebar-menu-shadow').css('display', 'none')
    })
})
