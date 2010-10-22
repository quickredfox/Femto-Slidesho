W=window
D=document
L=W.location.toString().replace(/(\?|\#).+$/,'')
CSS = {
    menu: 
        position:   'fixed'
        display:    'none'
        right:      0
        bottom:     0
        left:       0
        width:      '100%'
        height:     '15px'
        background: '#303039'
        textAlign:  'center'
    screen:
        position:   'fixed'
        display:    'none'        
        top:        '2%'
        left:       '50%'        
}
kCodes = [49,50,51,52,53,54,55,56,57,48]
menu   = $('<nav>').css(CSS.menu)
screen = $('<div>').css(CSS.screen)
slides = {}

mkSlide = ( u )->
  url = expandURL u
  key = bindKey kCodes.shift() 
  slides[ String(key) ] = { 
    slide: $('<img>').attr( { src: url, style: 'display:none' } ).appendTo screen
    thumb: $('<img>').attr( { src: url, width: 10, height: 10, marginRight: '5px' } ).appendTo menu
    key: String(key) 
  }
  # slides[ key ].thumb.data slides[ key ]
  #  slides[ key ].slide.data slides[ key ]
  return slides[ key ]

expandURL = ( u ) ->
  $('<a>').attr( 'href', u ).get( 0 ).href

# find  recipe in the recipes json
findRecipe = ( recipes ) -> 
  for route, images of recipes
      r = new RegExp expandURL( route )
      return images if r.test( L )
      
# show a slide is it's key is present
showByKey = ( key ) ->
  for k, item of slides
      k = String(k)
      unless k is key then item.slide.hide()
  if slides[key] isnt undefined then slides[key].slide.show()
  if key is '48' then toggle()
  screen.css 'marginLeft' , -1 * ( item.slide.width() / 2 )


# bind a window keyup keycode to a function if we have a mapping for it
bindKey = ( key ) ->
    if bindKey.listening isnt true
      bindKey.listening = true
      $(W).bind 'keyup', (e) -> 
        c = String(e.keyCode||e.which)
        if bindKey.map[c] then showByKey(c) 
    unless bindKey.map[key]
       bindKey.map[String(key)] = true;
    return key
bindKey.map = {'48':true};    

# toggle 
toggle = ()->
  nodes = menu.add(screen)
  if menu.is(':visible') then nodes.hide()
  else nodes.show()
  
# initialize a femtoslidesho
init = ( urls ) ->
  for i, u of urls
      item = mkSlide u
      menu.append   item.thumb
      screen.append item.slide
  $(D.body).append screen, menu
  slides['48'] = {slide:$('<b>'),thumb:$('<b>'),key:48}

# boot-strap
W.femto = ( recipes ) ->
  recipe = findRecipe( recipes )
  init recipe if recipe isnt undefined 

# initialize
$ () -> 
    recipeURL = $('script[src*=femto.js]:first').attr('src').match(/recipe\=([^&]+)/)
    if(recipeURL) 
        recipeURL = decodeURIComponent(recipeURL[1]);
        s = D.createElement 'script'
        s.setAttribute 'src', recipeURL
        D.body.appendChild(s)
