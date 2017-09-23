'use strict'

var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')

var Config = require('./config')
var FB = require('./connectors/facebook')
var Bot = require('./bot')
var fetch = require('node-fetch')

// LETS MAKE A SERVER!
var app = express()
app.set('port', (process.env.PORT) || 5000)
// SPIN UP SERVER
app.listen(app.get('port'), function () {
  console.log('Running on port', app.get('port'))
})
// PARSE THE BODY
app.use(bodyParser.json())


// index page
app.get('/', function (req, res) {
  res.send('hello world i am a chat bot')
})


// for facebook to verify
app.get('/webhooks', function (req, res) {
  if (req.query['hub.verify_token'] === Config.FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong token')
})

// to send messages to facebook
app.post('/webhooks', function (req, res) {

  var entry = FB.getMessageEntry(req.body)
  // IS THE ENTRY A VALID MESSAGE?
  if (entry && entry.message) {

  

   
  
    if (entry.message.attachments) {
      // NOT SMART ENOUGH FOR ATTACHMENTS YET
   
      FB.newMessage(entry.sender.id, "That's interesting!")
    } 
    else {
      // SEND TO BOT FOR PROCESSING
      
var user = getUserProfile (entry.sender.id)
//console.log(user)


      Bot.read(entry.sender.id, entry.message.text, function (sender, reply) {

        FB.newMessage(sender, reply)
      })
    }


  }   if (entry && entry.postback) {  

    

     if (entry.postback.payload =="START_PAYLOAD")         { show_shop_start_en(entry.sender.id) }  

                                    if (entry.postback.payload =="USERENGLISH")         { show_shop_cat_en(entry.sender.id) }  

                                    if (entry.postback.payload =="USERTHAI")            { show_shop_cat_th(entry.sender.id) } 

                                    if (entry.postback.payload =="PLAYLOAD_ORDER_EN")   { show_shop_product_cat_en(entry.sender.id)} 

                                    if (entry.postback.payload =="PRODUCT_CAT_MOBILE-EN") { show_product_slider_mobiles_en(entry.sender.id)} 

                                    if (entry.postback.payload =="PRODUCT_CAT_TABLET-EN") { show_product_slider_tablet_en(entry.sender.id)} 

                                    if (entry.postback.payload =="PRODUCT_CAT_LAPTOP_BAG-EN") { show_product_slider_laptop_en(entry.sender.id)} 

                                    if (entry.postback.payload =="PRODUCT_CAT_GADGETS-EN") { show_product_slider_gadgets_en(entry.sender.id)} 

                                    if (entry.postback.payload =="SHOP_CONFIRMS_EN") { sendBankRequest(entry.sender.id) } 

                                      if (entry.postback.payload =="PLAYLOAD_HELP_EN") { show_help_screen_en(entry.sender.id) } 
                                    

                                    if (entry.postback.payload =="PLAYLOAD_ORDER_TH") {  show_shop_product_cat_th(entry.sender.id)} 

                                    if (entry.postback.payload =="PRODUCT_CAT_MOBILE-TH") { show_product_slider_mobiles_th(entry.sender.id)} 
 
                                    if (entry.postback.payload =="PRODUCT_CAT_TABLET-TH") { show_product_slider_tablet_th(entry.sender.id)} 

                                    if (entry.postback.payload =="PRODUCT_CAT_LAPTOP_BAG-TH") { show_product_slider_laptop_en(entry.sender.id)} 

                                    if (entry.postback.payload =="PRODUCT_CAT_GADGETS-TH") { show_product_slider_gadgets_en(entry.sender.id)} 

                                      if (entry.postback.payload =="SHOP_CONFIRMS_TH") { sendBankRequestth(entry.sender.id) } 
 }
  res.sendStatus(200)
})


function getUserProfile (sender) {
    var user_profile 
fetch('https://graph.facebook.com/v2.6/'+sender+'?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token='+Config.FB_PAGE_TOKEN+'')
    .then(function(res) {
        return res.json();
    }).then(function(json) {
 

 user_profile = json

console.log(user_profile.first_name)
console.log(json.last_name)


  return user_profile
    }); 

}
//start screen 
function show_shop_start_en (sender) {
       let messageData = {
         "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"Welcome to Deelano\'s Digital Fashion Store",
            "image_url":"http://petersapparel.parseapp.com/img/item100-thumb.png",
            "subtitle":"We\'ve got the right hat for everyone.",
            "buttons":[
                  {
                "type":"postback",
                "title":"Start Chatting(en)",
                "payload":"USERENGLISH"
              }   ,
              {
                "type":"postback",
                "title":"Start Chatting (th)",
                "payload":"USERTHAI"
              }              
            ]
          }
        ]
      }
    }}
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:Config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


//Show Main Categery Screens with menu

function show_shop_cat_en (sender) {
    let messageData = {
         "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"Welcome to English Deelano ",
            "image_url":"http://petersapparel.parseapp.com/img/item100-thumb.png",
            "subtitle":"We\'ve got the right hat for everyone.",
            "buttons":[
                  {
                "type":"postback",
                "title":"Shop",
                "payload":"PLAYLOAD_ORDER_EN"
              }   ,
              {
                "type":"postback",
                "title":"Confirm your Payments",
                "payload":"SHOP_CONFIRMS_EN"
              }  ,
              {
                "type":"postback",
                "title":"Help",
                "payload":"PLAYLOAD_HELP_EN"
              }             
            ]
          }
        ]
      }
    }}
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:Config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


function show_shop_cat_th (sender) {
    let messageData = {
         "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":" Welcome Thai to Deelano\'s Digital Fashion Store ",
            "image_url":"http://petersapparel.parseapp.com/img/item100-thumb.png",
            "subtitle":"We\'ve got the right hat for everyone.",
            "buttons":[
                  {
                "type":"postback",
                "title":"Shop",
                "payload":"PLAYLOAD_ORDER_TH"
              }   ,
              {
                "type":"postback",
                "title":"Confirm Your Payment",
                "payload":"SHOP_CONFIRMS_TH"
              }  ,
              {
                "type":"postback",
                "title":"Help",
                "payload":"PLAYLOAD_HELP_TH"
              }             
            ]
          }
        ]
      }
    }}
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:Config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

//Show Product Category Slider
function show_shop_product_cat_en(sender) {
    let messageData = {
         "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Smartphone Covers English",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                       "type": "postback",
                        "title": "Smartphone Covers ",
                        "payload": "PRODUCT_CAT_MOBILE-EN",
                    }],
                }, {
                    "title": "Tablet Covers",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Tablet Covers",
                        "payload": "PRODUCT_CAT_TABLET-EN",
                    }],
                }, {
                    "title": "Laptop Bags",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Laptop Bags",
                        "payload": "PRODUCT_CAT_LAPTOP_BAG-EN",
                    }],
                }, {
                    "title": "Mobile Accosseries ",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Mobile Accosseries",
                        "payload": "PRODUCT_CAT_GADGETS-EN",
                    }],
                }]
            }
        }}
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:Config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
function show_shop_product_cat_th(sender) {
    let messageData = {
         "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Smartphone Covers Thai",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                       "type": "postback",
                        "title": "Smartphone Covers",
                        "payload": "PRODUCT_CAT_MOBILE-TH",
                    }],
                }, {
                    "title": "Tablet Covers",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Tablet Covers",
                        "payload": "PRODUCT_CAT_TABLET-TH",
                    }],
                }, {
                    "title": "Laptop Bags",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Laptop Bags",
                        "payload": "PRODUCT_CAT_LAPTOP_BAG-TH",
                    }],
                }, {
                    "title": "Mobile Accosseries ",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Mobile Accosseries",
                        "payload": "PRODUCT_CAT_GADGETS-TH",
                    }],
                }]
            }
        }}
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:Config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

//Show Category Slider with Products
function show_product_slider_laptop_en(sender) {
    let messageData = {
         "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Laptop ref En",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://deelano.com/pub/media/catalog/product/cache/2/image/e9c3970ab036de70892d86c6d221abfe/c/o/coffee_5_.jpg",
                    "buttons": [{
                       "type": "postback",
                        "title": "View Details",
                        "payload": "DETAILS_PRODUCT_Gemini-EN",
                    },{
                       "type": "postback",
                        "title": "Order Now",
                        "payload": "PRODUCT_CAT_MOBILE-EN",
                    }],
                }, {
                    "title": 'Traveler - 14" Laptop Bag',
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://deelano.com/pub/media/catalog/product/cache/2/image/560x560/e9c3970ab036de70892d86c6d221abfe/_/4/_4huise_1.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "Tablet Covers",
                        "payload": "PRODUCT_CAT_TABLET-EN",
                    }],
                }, {
                    "title": "Laptop Bags",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Laptop Bags",
                        "payload": "PRODUCT_CAT_LAPTOP_BAG-EN",
                    }],
                }, {
                    "title": "Mobile Accosseries ",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Laptop Bags",
                        "payload": "PRODUCT_CAT_GADGETS-EN",
                    }],
                }]
            }
        }}
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:Config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function show_product_slider_laptop_th(sender) {
    let messageData = {
         "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "laptop ref thai Gemini Genuine - Leather Wallet Case",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://deelano.com/pub/media/catalog/product/cache/2/image/e9c3970ab036de70892d86c6d221abfe/c/o/coffee_5_.jpg",
                    "buttons": [{
                       "type": "postback",
                        "title": "View Details",
                        "payload": "DETAILS_PRODUCT_Gemini-EN",
                    },{
                       "type": "postback",
                        "title": "Order Now",
                        "payload": "PRODUCT_CAT_MOBILE-EN",
                    }],
                }, {
                    "title": 'Traveler - 14" Laptop Bag',
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://deelano.com/pub/media/catalog/product/cache/2/image/560x560/e9c3970ab036de70892d86c6d221abfe/_/4/_4huise_1.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "Tablet Covers",
                        "payload": "PRODUCT_CAT_TABLET-EN",
                    }],
                }, {
                    "title": "Laptop Bags",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Laptop Bags",
                        "payload": "PRODUCT_CAT_LAPTOP_BAG-EN",
                    }],
                }, {
                    "title": "Mobile Accosseries ",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Laptop Bags",
                        "payload": "PRODUCT_CAT_GADGETS-EN",
                    }],
                }]
            }
        }}
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:Config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function show_product_slider_tablet_en(sender) {
    let messageData = {
         "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "tablet ref en Gemini Genuine - Leather Wallet Case",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://deelano.com/pub/media/catalog/product/cache/2/image/e9c3970ab036de70892d86c6d221abfe/c/o/coffee_5_.jpg",
                    "buttons": [{
                       "type": "postback",
                        "title": "View Details",
                        "payload": "DETAILS_PRODUCT_Gemini-EN",
                    },{
                       "type": "postback",
                        "title": "Order Now",
                        "payload": "PRODUCT_CAT_MOBILE-EN",
                    }],
                }, {
                    "title": 'Traveler - 14" Laptop Bag',
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://deelano.com/pub/media/catalog/product/cache/2/image/560x560/e9c3970ab036de70892d86c6d221abfe/_/4/_4huise_1.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "Tablet Covers",
                        "payload": "PRODUCT_CAT_TABLET-EN",
                    }],
                }, {
                    "title": "Laptop Bags",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Laptop Bags",
                        "payload": "PRODUCT_CAT_LAPTOP_BAG-EN",
                    }],
                }, {
                    "title": "Mobile Accosseries ",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Laptop Bags",
                        "payload": "PRODUCT_CAT_GADGETS-EN",
                    }],
                }]
            }
        }}
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:Config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


function show_product_slider_tablet_th(sender) {
    let messageData = {
         "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "tablet ref th Gemini Genuine - Leather Wallet Case",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://deelano.com/pub/media/catalog/product/cache/2/image/e9c3970ab036de70892d86c6d221abfe/c/o/coffee_5_.jpg",
                    "buttons": [{
                       "type": "postback",
                        "title": "View Details",
                        "payload": "DETAILS_PRODUCT_Gemini-EN",
                    },{
                       "type": "postback",
                        "title": "Order Now",
                        "payload": "PRODUCT_CAT_MOBILE-EN",
                    }],
                }, {
                    "title": 'Traveler - 14" Laptop Bag',
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://deelano.com/pub/media/catalog/product/cache/2/image/560x560/e9c3970ab036de70892d86c6d221abfe/_/4/_4huise_1.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "Tablet Covers",
                        "payload": "PRODUCT_CAT_TABLET-EN",
                    }],
                }, {
                    "title": "Laptop Bags",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Laptop Bags",
                        "payload": "PRODUCT_CAT_LAPTOP_BAG-EN",
                    }],
                }, {
                    "title": "Mobile Accosseries ",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Laptop Bags",
                        "payload": "PRODUCT_CAT_GADGETS-EN",
                    }],
                }]
            }
        }}
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:Config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


function show_product_slider_mobiles_en(sender) {
    let messageData = {
         "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Gemini Genuine - Leather Wallet Case",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://deelano.com/pub/media/catalog/product/cache/2/image/e9c3970ab036de70892d86c6d221abfe/c/o/coffee_5_.jpg",
                    "buttons": [{
                       "type": "postback",
                        "title": "View Details",
                        "payload": "DETAILS_PRODUCT_Gemini-EN",
                    },{
                       "type": "postback",
                        "title": "Order Now",
                        "payload": "PRODUCT_CAT_MOBILE-EN",
                    }],
                }, {
                    "title": 'Traveler - 14" Laptop Bag',
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://deelano.com/pub/media/catalog/product/cache/2/image/560x560/e9c3970ab036de70892d86c6d221abfe/_/4/_4huise_1.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "Tablet Covers",
                        "payload": "PRODUCT_CAT_TABLET-EN",
                    }],
                }, {
                    "title": "Laptop Bags",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Laptop Bags",
                        "payload": "PRODUCT_CAT_LAPTOP_BAG-EN",
                    }],
                }, {
                    "title": "Mobile Accosseries ",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Laptop Bags",
                        "payload": "PRODUCT_CAT_GADGETS-EN",
                    }],
                }]
            }
        }}
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:Config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function show_product_slider_mobiles_th(sender) {
    let messageData = {
         "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "THAI Gemini Genuine - Leather Wallet Case ",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://deelano.com/pub/media/catalog/product/cache/2/image/e9c3970ab036de70892d86c6d221abfe/c/o/coffee_5_.jpg",
                    "buttons": [{
                       "type": "postback",
                        "title": "View Details",
                        "payload": "DETAILS_PRODUCT_Gemini-EN",
                    },{
                       "type": "postback",
                        "title": "Order Now",
                        "payload": "PRODUCT_CAT_MOBILE-EN",
                    }],
                }, {
                    "title": 'Traveler - 14" Laptop Bag',
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://deelano.com/pub/media/catalog/product/cache/2/image/560x560/e9c3970ab036de70892d86c6d221abfe/_/4/_4huise_1.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "Tablet Covers",
                        "payload": "PRODUCT_CAT_TABLET-EN",
                    }],
                }, {
                    "title": "Laptop Bags",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Laptop Bags",
                        "payload": "PRODUCT_CAT_LAPTOP_BAG-EN",
                    }],
                }, {
                    "title": "Mobile Accosseries ",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Laptop Bags",
                        "payload": "PRODUCT_CAT_GADGETS-EN",
                    }],
                }]
            }
        }}
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:Config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}



function show_product_slider_gadgets_en(sender) {
    let messageData = {
         "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Gemini Genuine - Leather Wallet Case THAI",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://deelano.com/pub/media/catalog/product/cache/2/image/e9c3970ab036de70892d86c6d221abfe/c/o/coffee_5_.jpg",
                    "buttons": [{
                       "type": "postback",
                        "title": "View Details",
                        "payload": "DETAILS_PRODUCT_Gemini-EN",
                    },{
                       "type": "postback",
                        "title": "Order Now",
                        "payload": "PRODUCT_CAT_MOBILE-EN",
                    }],
                }, {
                    "title": 'Traveler - 14" Laptop Bag',
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://deelano.com/pub/media/catalog/product/cache/2/image/560x560/e9c3970ab036de70892d86c6d221abfe/_/4/_4huise_1.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "Tablet Covers",
                        "payload": "PRODUCT_CAT_TABLET-EN",
                    }],
                }, {
                    "title": "Laptop Bags",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Laptop Bags",
                        "payload": "PRODUCT_CAT_LAPTOP_BAG-EN",
                    }],
                }, {
                    "title": "Mobile Accosseries ",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Laptop Bags",
                        "payload": "PRODUCT_CAT_GADGETS-EN",
                    }],
                }]
            }
        }}
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:Config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}




function shop_confirm_pay_en (sender) {
   let messageData = {
         "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"Welcome to Deelano\'s Digital Fashion Store",
            "image_url":"http://petersapparel.parseapp.com/img/item100-thumb.png",
            "subtitle":"We\'ve got the right hat for everyone .",
            "buttons":[
                  {
                "type":"postback",
                "title":"Shop",
                "payload":"PLAYLOAD_ORDER_EN"
              },
              {
                "type":"postback",
                "title":"Confirm your Payment",
                "payload":"SHOP_CONFIRM-EN"
              }  ,
              {
                "type":"postback",
                "title":"Help",
                "payload":"PLAYLOAD_Help_EN"
              }             
            ]
          }
        ]
      }
    }}
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:Config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(){
//call back
})
}

function sendBankRequest(sender) {
    let messageData = {
    "text":"Please chose the banks below or send us a picture of the payment reciepe here:",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Bangkok Bank",
        "payload":"BKK_BANK_EN2"
      },
      {
        "content_type":"text",
        "title":"SCB",
        "payload":"BKK_BANK_EN"
      }
    ]

  }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:Config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

//show help msg
function show_help_screen_en(sender) {
    let messageData = {
    "text":"How can we Help You ?",
    "quick_replies":[

      {
        "content_type":"text",
        "title":"Payment Options",
        "payload":"TODAY_PAY_DATE"
      },
      {
        "content_type":"text",
        "title":"Delivery",
        "payload":"PAYLOAD_DELIVERY_EN"
      },
      {
        "content_type":"text",
        "title":"Reward Points",
        "payload":"PAYLOAD_DELIVERY_EN"
      },
      {
        "content_type":"text",
        "title":"Return & Refund",
        "payload":"PAYLOAD_DELIVERY_EN"
      },
      {
        "content_type":"text",
        "title":"Product suggestions",
        "payload":"PAYLOAD_DELIVERY_EN"
      }


    ]

  }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:Config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


function show_help_screen_th(sender) {
    let messageData = {
    "text":"How can we Help You",
    "quick_replies":[

      {
        "content_type":"text",
        "title":"Payment Options",
        "payload":"TODAY_PAY_DATE"
      },
      {
        "content_type":"text",
        "title":"Delivery",
        "payload":"PAYLOAD_DELIVERY_EN"
      },
      {
        "content_type":"text",
        "title":"Reward Points",
        "payload":"PAYLOAD_DELIVERY_EN"
      },
      {
        "content_type":"text",
        "title":"Return & Refund",
        "payload":"PAYLOAD_DELIVERY_EN"
      },
      {
        "content_type":"text",
        "title":"Product suggestions",
        "payload":"PAYLOAD_DELIVERY_EN"
      }


    ]

  }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:Config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


function sendDateRequest(sender) {
    let messageData = {
    "text":"Pick a Date",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Bangkok Bank",
        "payload":"BKK_BANK_EN"
      },
      {
        "content_type":"text",
        "title":"SCB",
        "payload":"SCB_BANK"
      }
    ]

  }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:Config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}



function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:Config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}