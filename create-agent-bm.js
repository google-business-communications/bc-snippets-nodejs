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
 * This code snippet creates a Business Messages agent.
 * Read more: https://developers.google.com/business-communications/business-messages/guides/how-to/agents?method=api#create_the_agent
 *
 * This code is based on the https://github.com/google-business-communications/nodejs-businesscommunications Node.js
 * Business Communications client library.
 */

/**
 * Edit the values below:
 */
const BRAND_ID = 'EDIT_HERE';
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
  const brandName = 'brands/' + BRAND_ID;

  if (authClient) {
    const agentObject = {
      displayName: 'My first agent',
      businessMessagesAgent: {
        customAgentId: uuidv4(), // Optional
        logoUrl: 'https://developers.google.com/identity/images/g-logo.png',
        entryPointConfigs: [
          {
            allowedEntryPoint: 'NON_LOCAL',
          }
        ],
        nonLocalConfig: { // Configuration options for launching on non-local entry points
          // List of phone numbers for call deflection, values must be globally unique
          callDeflectionPhoneNumbers: [
            { number: '+10000000000' },
            { number: '+10000000001' },
          ],
          // Contact information for the agent that displays with the messaging button
          contactOption: {
            options: [
              'EMAIL',
              'PHONE'
            ],
            url: 'https://www.your-company-website.com',
          },
          // Domains enabled for messaging within Search, values must be globally unique
          enabledDomains: [ 'your-company-website.com' ],
          // Agent's phone number. Overrides the `phone` field
          // for conversations started from non-local entry points
          phoneNumber: { number: '+10000000000' },
          // List of CLDR region codes for countries where the agent is allowed to launch `NON_LOCAL` entry points
          regionCodes: [ 'US', 'CA' ]
        },
        // Must match a conversational setting locale
        defaultLocale: 'en',
        conversationalSettings: {
          en: {
            privacyPolicy: { url: 'https://www.your-company-website.com/privacy' },
            welcomeMessage: { text: 'This is a sample welcome message' },
            conversationStarters: [
              {
                suggestion: {
                  reply: {
                    text: 'Option 1',
                    postbackData: 'postback_option_1',
                  },
                },
              },
            ],
          },
        },
        primaryAgentInteraction: {
          interactionType: 'HUMAN',
          humanRepresentative: {
            humanMessagingAvailability: {
              hours: [
                {
                  startTime: {
                    hours: 8,
                    minutes: 30
                  },
                  startDay: 'MONDAY',
                  endDay: 'SATURDAY',
                  endTime: {
                    hours: 20,
                    minutes: 0
                  },
                  timeZone: 'America/Los_Angeles',
                },
              ],
            },
          },
        },
      },
    };

    // Setup the parameters for the API call
    const apiParams = {
      auth: authClient,
      parent: brandName,
      resource: agentObject
    };

    bcApi.brands.agents.create(apiParams, {}, (err, response) => {
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
