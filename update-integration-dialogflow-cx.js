//// Copyright 2022 Google LLC
////
//// Licensed under the Apache License, Version 2.0 (the "License");
//// you may not use this file except in compliance with the License.
//// You may obtain a copy of the License at
////
////     https://www.apache.org/licenses/LICENSE-2.0
////
//// Unless required by applicable law or agreed to in writing, software
//// distributed under the License is distributed on an "AS IS" BASIS,
//// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//// See the License for the specific language governing permissions and
//// limitations under the License.

/**
 * This code snippet updates a Dialogflow CX integration.
 * Read more: https://developers.google.com/business-communications/business-messages/guides/how-to/integrate/dialogflow?method=api#dialogflow_cx_2
 *
 * This code is based on the https://github.com/google-business-communications/nodejs-businesscommunications Node.js
 * Business Communications client library.
 */

/**
 * Edit the values below:
 */
 const BRAND_ID = 'EDIT_HERE';
 const AGENT_ID = 'EDIT_HERE';
 const INTEGRATION_ID = 'EDIT_HERE';
 const PATH_TO_SERVICE_ACCOUNT_KEY = './service_account_key.json';

 const businesscommunications = require('businesscommunications');
 const {google} = require('googleapis');
 const uuidv4 = require('uuid').v4;

 // Initialize the Business Communications API
 const bcApi = new businesscommunications.businesscommunications_v1.Businesscommunications({});

 // Set the scope that we need for the Business Communications API
 const scopes = [
   'https://www.googleapis.com/auth/businesscommunications',
 ];

 // Set the private key to the service account file
 const privatekey = require(PATH_TO_SERVICE_ACCOUNT_KEY);

 async function main() {
   const authClient = await initCredentials();
   const integrationName = 'brands/' + BRAND_ID + '/agents/' + AGENT_ID + '/integrations/' + INTEGRATION_ID;

   if (authClient) {
     const integrationObject = {
       dialogflowCxIntegration: {
         autoResponseStatus: 'DISABLED'
       }
     };

     // Setup the parameters for the API call
     const apiParams = {
       auth: authClient,
       parent: integrationName,
       resource: integrationObject,
       updateMask: 'dialogflowCxIntegration.autoResponseStatus',
     };

     bcApi.brands.agents.integrations.patch(apiParams, {}, (err, response) => {
       if (err !== undefined && err !== null) {
         console.dir(err);
       } else {
         // Agent created
         console.log(response.data);
       }
     });
   }
   else {
     console.log('Authentication failure.');
   }
 }

 /**
  * Initializes the Google credentials for calling the
  * Business Messages API.
  */
  async function initCredentials() {
   // Configure a JWT auth client
   const authClient = new google.auth.JWT(
     privatekey.client_email,
     null,
     privatekey.private_key,
     scopes,
   );

   return new Promise(function(resolve, reject) {
     // Authenticate request
     authClient.authorize(function(err, tokens) {
       if (err) {
         reject(false);
       } else {
         resolve(authClient);
       }
     });
   });
 }

 main();
