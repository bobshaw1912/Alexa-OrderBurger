'use strict';

var Alexa = require("alexa-sdk");
var appId = ' '; //'amzn1.echo-sdk-ams.app.your-skill-id';

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = appId;
//  alexa.dynamoDBTableName = 'AlexaOrderBurger'; // I decided not to use dynamoDB. But it could be good for persistence of this data for production ready code.  DDB requires not NULL attributes on persistence due to primary key setup. I just skip this for demo only.
    alexa.registerHandlers(newSessionHandlers, startOrderBurgerHandlers, orderBurgerHanlders);
    alexa.execute();
};

var states = {
    WELCOMEMODE:'_WELCOMEMODE', // launch the welcome information to user
    ORDERMODE:'_ORDERMODE' // Prompt order mode to start the order  
};



var newSessionHandlers = {
   'NewSession' : function() {
       if(Object.keys(this.attributes).length == 0) { // clear out the burger information and make it ready for order
           this.attributes['burgerSize'] = '';
           this.attributes['burgerType'] = '';
       }
       this.handler.state = states.WELCOMEMODE;
       this.emit(':ask', 'Welcome to McDondal\'s Burger Order App! Would you like to order a burger now?', 'Say yes to start order or no to cancel.');
   }  
};

// this is the start order handlers which will be used for promot necessary help message to users
var startOrderBurgerHandlers = Alexa.CreateStateHandler(states.WELCOMEMODE, { 
    'NewSession' : function() {
        this.emit('NewSession');
    },
    'AMAZON.HelpIntent' : function() {
        var message = 'Please tell me type of burger and size you\'d like to order as well. Would you like to oder now?';
        this.emit(':ask', message, message);
    },
    'AMAZON.YesIntent' : function() {
        this.handler.state = states.ORDERMODE;
        this.attributes['burgerSize'] = '';
        this.attributes['burgerType'] = '';
        var message = 'We have Big Mac, Cheeseburger and Hamburger available. Which one do you like?';
        this.emit(':ask', 'Great! ' + message, message);
    },
    'AMAZON.NoIntent' : function() {
        this.emit(':tell', 'Ok, hope we can serve you next time. See you!');
    },
    'SessionEndedRequest' : function() {
        console.log('session ended!');
        this.attributes['endedSessionCount'] += 1;
//        this.emit(':saveState', true);
    },
    'Unhandled' : function() {
        var message = 'Please say yes to continue to order burger, or no to cancel.';
        this.emit(':ask', message, message);
    }
});

var orderBurgerHanlders = Alexa.CreateStateHandler(states.ORDERMODE, {
    'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession'); // Equivalent to the Start Mode NewSession handler
    },
    'OrderBurgerIntent' : function() { //start to order burger now. We need to check out which burger customer choose first. 
        if(this.attributes['burgerType'] != '')  {  // check if we are in a session. If so, we need to place the order soon.
            var burgerSize = this.event.request.intent.slots.burgerSize.value;
            this.attributes['burgerSize'] = burgerSize;

            var burgerType = this.attributes['burgerType'];
            console.log('user has ordered ' + this.attributes['burgerType'] + ' with size ' + burgerSize);
            var message = 'Your order of ' + burgerSize + ' ' + burgerType + ' is on the way. Please check out your mobile APP for latest status!';
            this.emit(':tell', message);
        } else {  // users are not supposed to order a burger size first (sorry, I just don't think it is reasonable)
            var burgerType = this.event.request.intent.slots.burgerType.value;
            console.log('user has ordered '+ burgerType + '. Then user needs to pick a size.');
            this.attributes['burgerType'] = burgerType;
            this.attributes['burgerSize'] = '';

            var message = 'We have 3 sizes of ' + this.attributes['burgerType'] + '. Small, Medium and Large. Which size do you like?';
            this.emit(':ask', message, message);
        }
    },
    'Unhandled' : function() {
        var message = 'Sorry I cannot get you clearly. Goodbye!';
        this.emit(':tell', message);
    } 
});
