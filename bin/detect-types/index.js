/* global require process __dirname */
const fs = require('node:fs');
const {StreamWriter, NopWriter, Emitter} = require('maketypes/lib/index');


//////////////////////////////////////////////////////////////////////////////
// The value of these fields can be changed, depending on what Access Token //
// is used at runtime.                                                      //
const org = 'sentry';                                                       //
const project= 'javascript';                                                //
const userId = '1812658';                                                   //
//////////////////////////////////////////////////////////////////////////////


// Map of type-name to URL examplar
const urls = {
  RawOrganization: `https://sentry.io/api/0/organizations/${org}/`,
  RawProject: `https://sentry.io/api/0/projects/${org}/${project}/`,
  RawGroup: `https://sentry.io/api/0/organizations/${org}/issues/`,
  RawMember: `https://sentry.io/api/0/projects/${org}/${project}/members/`,
  RawUser: `https://sentry.io/api/0/organizations/${org}/users/${userId}/`,
};

main().then(console.log).catch(console.error);

async function main() {
  const prompt = require("prompt-sync")({ sigint: true });
  const accessToken = prompt("Enter your access token: ");

  for (const [name, url] of Object.entries(urls)) {
    console.group(`Fetching ${url}...`);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('Reading json');
    const data = await response.json();

    const interfaceFilename = `${__dirname}/../../src/lib/sentryApi/raw/${name.toLowerCase()}.d.ts`;
    const interfaceWriter = new StreamWriter(fs.createWriteStream(interfaceFilename));
    interfaceWriter.write(`/* eslint-disable @typescript-eslint/no-empty-object-type */

/**
 * THIS IS A GENERATED FILE
 *
 * Run \`pnpm generate:api-types\` from the root of the repo to recreate it.
 *
 * Some generated types have been manually modified to simplify things & let them
 * be valid typescript.
 */

`)
    console.log('Writing interface file');
    const proxyWriter = new NopWriter();
    const e = new Emitter(interfaceWriter, proxyWriter);
    e.emit(data, name);

    console.log('Done')
    console.groupEnd();
  }
  return 'Finished';
}
