# Alexa-OrderBurger
This is a simple demo of Alexa and lambda integrations based of node.js SDK, which is a very easy and efficient SDK for labmda based development.
The brief idea of this demo is to demonstrate the session based implementation in Alexa.  There is several prompts - type of burger, size of burger, (in the future, store of future and etc) are asked to collected order info before order is placed.

1. Index.js is the Alexa handlers for implementations.
2. The speechAssets has the detail IntentSchema and Utterances.

To use the code, just replace the application ID with your Alexa Skill ID.  Also, please make sure your lambda has the permissions if you are going to enable DynamoDB for session attributes store. 

