'use strict'

var Config = require('../config')
var FB = require('../connectors/facebook')
var Wit = require('node-wit').Wit
var request = require('request')
var moment = require('moment')
var fetch = require('node-fetch')
var scraperjs = require('scraperjs')

var roomnames = []


var firstEntityValue = function (entities, entity) {
	var val = entities && entities[entity] &&
		Array.isArray(entities[entity]) &&
		entities[entity].length > 0 &&
		entities[entity][0].value

	if (!val) {
		return null
	}
	return typeof val === 'object' ? val.value : val
}


var actions = {
	say (sessionId, context, message, cb) {
		// Bot testing mode, run cb() and return
		if (require.main === module) {
			cb()
			return
		}

		console.log('WIT WANTS TO TALK TO:', context._fbid_)
		console.log('WIT HAS SOMETHING TO SAY:', message)
		console.log('WIT HAS A CONTEXT:', context)

		if (checkURL(message)) {
			FB.newMessage(context._fbid_, message, true)
		} else {
			FB.newMessage(context._fbid_, message)
		}

		
		cb()
		
	},

	merge(sessionId, context, entities, message, cb) {
		// Reset the weather story
		delete context.forecast

		// Retrive the location entity and store it in the context field
		var loc = firstEntityValue(entities, 'location')
		if (loc) {
			context.loc = loc
		}


			// Reset the weather story
		delete context.greetings

		// Retrive the location entity and store it in the context field
		var greetings = firstEntityValue(entities, 'greetings')
		if (greetings) {
		sendGenericMessage(context._fbid_)
    
	
		}


		// Reset the cutepics story
		delete context.booking

		// Retrieve the category
	
        var booking = firstEntityValue(entities, 'booking')
           var hotel_code = firstEntityValue(entities, 'hotel_code')
              var arrival = firstEntityValue(entities, 'datetime')
               var duration = firstEntityValue(entities, 'duration')
             
		if (booking) {
		context.booking = "booking request started"
 context.hotel_code = hotel_code


       context.arrival = arrival
        context.duration = duration
		}



// Reset the cutepics story
		delete context.confirm_payment
// Reset the cutepics story

		// Retrieve the category
		var confirm_payment = firstEntityValue(entities, 'confirm_payment')
		if (confirm_payment) {
			sendDateRequest(context._fbid_)
			// Reset the cutepics story

		}

    // Reset the cutepics story
    delete context.confirm_payment_time
// Reset the cutepics story

    // Retrieve the category
    var confirm_payment_time = firstEntityValue(entities, 'confirm_payment_time')
    if (confirm_payment_time) {
      sendConfRequest(context._fbid_)
      // Reset the cutepics story

    }

    // Reset the cutepics story
    delete context.smartphone_type
// Reset the cutepics story

    // Retrieve the category
    var smartphone_type = firstEntityValue(entities, 'smartphone_type')
    if (smartphone_type) {
      smartphone_type_en(context._fbid_,smartphone_type)
      // Reset the cutepics story

    }


       delete context.confirm_payment_order
       // Retrieve the category
    var confirm_payment_order = firstEntityValue(entities, 'confirm_payment_order')
    if ( confirm_payment_order) {

      sendConfReciepe(context._fbid_)
      sendConfReciepeCard(context._fbid_)
    }

 

    // Reset the cutepics story
    delete context.friends_name
// Reset the cutepics story

    // Retrieve the category
    var friends_name = firstEntityValue(entities, 'friends_name')
    if (friends_name) {
      createMenu(context._fbid_)
      // Reset the cutepics story

    }


		// Retrieve the sentiment
		var sentiment = firstEntityValue(entities, 'sentiment')
		if (sentiment) {
			context.ack = sentiment === 'positive' ? 'Glad your liked it!' : 'Aww, that sucks.'
		} else {
			delete context.ack
		}

		cb(context)
	},

	error(sessionId, context, error) {
		console.log(error.message)
	},

	// list of functions Wit.ai can execute
	['fetch-weather'](sessionId, context, cb) {
		// Here we can place an API call to a weather service
	if (context.loc) {
		 	getWeather(context.loc)
		 		.then(function (forecast) {
				context.forecast = forecast || 'sunny'
				})
				.catch(function (err) {
					console.log(err)
				})
		 }

		context.forecast = 'Sunny'

		cb(context)
	},

	['fetch-pics'](sessionId, context, cb) {
		var wantedPics = allPics[context.cat || 'default']
		context.pics = wantedPics[Math.floor(Math.random() * wantedPics.length)]

		cb(context)
	},
		['fetch-welcome'](sessionId, context, cb) {


		cb(context)
	},
	

		['fetch-hotel-infos'](sessionId, context, cb) {

if (context.booking) {
console.log(context.arrival)
var arrival_date = moment(context.arrival).format('DD/MM/YYYY')


 var uri2 = "https://secure.minorhotels.com/rooms.aspx?hc="+context.hotel_code+"&checkin="+arrival_date+"&nights="+context.duration+"&rooms=1&adults=2&bc=AN" 
show_hotel_rate(context._fbid_,uri2)
getRoomScrape(context._fbid_,context.hotel_code,context.arrival,context.duration)

 sendbackrooms(context._fbid,roomnames) 
console.log(roomnames)
/*roomnames.forEach(function(value) {
  console.log(value);
});*/

		cb(context)
	}},

		['fetch-confirm-start'](sessionId, context, cb) {


		cb(context)
	},


}

function createMenu(sender) {
    let messageData = {

    "attachment":{
      "type":"image",
      "payload":{
        "url":"http://i.imgur.com/O7ZTj.jpg"
      }
    }

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



/*function getRoomScrape(hotel_code,arrival,duration) {
var uri_parse = "https://secure.minorhotels.com/?bc=AN&hc="+hotel_code+"&checkin="+arrival+"&nights="+duration+"&adults=2&rooms=1" 


noodle.query({
  url:      uri_parse,
  selector: '#Calendar_Wrap .list .item h3 ',
  extract:  'href'
})
.then(function (results) {
  console.log(results);
});

}
*/


function getRoomScrape(sender,hotel_code,arrival,duration) {
  
var uri_parse = "https://secure.minorhotels.com/?bc=AN&hc="+hotel_code+"&checkin="+arrival+"&nights="+duration+"&adults=2&rooms=1" 


console.log(uri_parse)
scraperjs.StaticScraper.create(uri_parse)

 .scrape(function($) {
      return $("#Calendar_Wrap .list .item h3 ").map(function() {
            return $(this).text();
        }).get();
    })
    .then(function(news) {
        roomnames= news

   sendbackrooms(sender, roomnames)
    })

 
}

jQuery(document).ready(function($) {
/*global $:false */
/*global window: false */

(function(){
  "use strict";
        $('.dexter-single-post').removeClass('container');
});};

function sendbackrooms(sender,roomnames) {

  console.log("Please select your room:"+roomnames+"")
  console.log(roomnames.length)
    console.log(roomnames[0])
      console.log(roomnames[1])
        console.log(roomnames[2])
          console.log(roomnames[3])
            console.log(roomnames[4])
            console.log(roomnames[5])
            console.log(roomnames[6])
            console.log(roomnames[7])
  if(roomnames.length==13){
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


function sendConfReciepe(sender) {
    let messageData = {
 "text":"Thanks for your transaction confirmation.  Your order will be shipped as soon as we confirmed the payment.  ",

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



function show_hotel_rate(sender,url) {


    let messageData = {

         "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": ""+url+"",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://deelano.com/pub/media/catalog/product/cache/2/image/e9c3970ab036de70892d86c6d221abfe/c/o/coffee_5_.jpg",
                    "buttons": [{
                      "type":"web_url",
            "url":""+url+"",
            "title":"Show Rates"
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




function sendConfReciepeCard(sender) {
    let messageData = {
 
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"receipt",
        "recipient_name":""+sender+"",
        "order_number":"12345678902",
        "currency":"THB",
        "payment_method":"Bank Wire (Pending)",        
        "order_url":"http://petersapparel.parseapp.com/order?order_id=123456",
        "timestamp":"1428444852", 
        "elements":[
          {
            "title":"Classic White T-Shirt",
            "subtitle":"100% Soft and Luxurious Cotton",
            "quantity":2,
            "price":50,
            "currency":"THB",
            "image_url":"http://petersapparel.parseapp.com/img/whiteshirt.png"
          },
          {
            "title":"Classic Gray T-Shirt",
            "subtitle":"100% Soft and Luxurious Cotton",
            "quantity":1,
            "price":25,
            "currency":"THB",
            "image_url":"http://petersapparel.parseapp.com/img/grayshirt.png"
          }
        ],
        "address":{
          "street_1":"1 Hacker Way",
          "street_2":"",
          "city":"Menlo Park",
          "postal_code":"94025",
          "state":"CA",
          "country":"US"
        },
        "summary":{
          "subtotal":75.00,
          "shipping_cost":4.95,
          "total_tax":6.19,
          "total_cost":56.14
        },
        "adjustments":[
          {
            "name":"New Customer Discount",
            "amount":20
          },
          {
            "name":"$10 Off Coupon",
            "amount":10
          }
        ]
      }
    }
  

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
function sendConfRequest(sender) {
    let messageData = {
 "text":" Please Enter Order Id  and transaction time. E.g. #451234 3:31pm  "

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
 "text":"When did u made the transactions?",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"-Today-",
        "payload":"TODAY_PAY_DATE"
      },
      {
        "content_type":"text",
        "title":"-yesterday-",
        "payload":"YEST_PAY_DATE"
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





function sendGenericMessage(sender) {

    let messageData = {
         "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"Welcome to Deelano\'s Digital Fashion Store "+sender+". Please select your language below",
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


// SETUP THE WIT.AI SERVICE
var getWit = function () {
	console.log('GRABBING WIT')
	return new Wit(Config.WIT_TOKEN, actions)
}

module.exports = {
	getWit: getWit,
}

// BOT TESTING MODE
if (require.main === module) {
	console.log('Bot testing mode!')
	var client = getWit()
	client.interactive()
}

// GET WEATHER FROM API
var getWeather = function (location) {
	return new Promise(function (resolve, reject) {
		var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'+ location +'%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
		request(url, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		    	var jsonData = JSON.parse(body)
		    	var forecast = jsonData.query.results.channel.item.forecast[0].text
		      console.log('WEATHER API SAYS....', jsonData.query.results.channel.item.forecast[0].text)
		      return forecast
		    }
			})
	})
}

// CHECK IF URL IS AN IMAGE FILE
var checkURL = function (url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

// LIST OF ALL PICS
var allPics = {
  corgis: [
    'http://i.imgur.com/uYyICl0.jpeg',
    'http://i.imgur.com/useIJl6.jpeg',
    'http://i.imgur.com/LD242xr.jpeg',
    'http://i.imgur.com/Q7vn2vS.jpeg',
    'http://i.imgur.com/ZTmF9jm.jpeg',
    'http://i.imgur.com/jJlWH6x.jpeg',
		'http://i.imgur.com/ZYUakqg.jpeg',
		'http://i.imgur.com/RxoU9o9.jpeg',
  ],
  racoons: [
    'http://i.imgur.com/zCC3npm.jpeg',
    'http://i.imgur.com/OvxavBY.jpeg',
    'http://i.imgur.com/Z6oAGRu.jpeg',
		'http://i.imgur.com/uAlg8Hl.jpeg',
		'http://i.imgur.com/q0O0xYm.jpeg',
		'http://i.imgur.com/BrhxR5a.jpeg',
		'http://i.imgur.com/05hlAWU.jpeg',
		'http://i.imgur.com/HAeMnSq.jpeg',
  ],
  default: [
    'http://blog.uprinting.com/wp-content/uploads/2011/09/Cute-Baby-Pictures-29.jpg',
  ],
};
