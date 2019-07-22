# paradise-fivem
My FiveM server for creating resources

Currently working on cloning the GTA Online character creation

## Running the server
Before running the server you'll need to:
 - Create a `secrets.cfg` file in the `server-data` directory that contains your license key (`sv_licenseKey KEY`)
 - `yarn install` and `yarn webpack` in the root directory to build the local resources
 - Create a `__resource.lua` file in the `server-data/resources/[local]/character` with `client_script 'index.js'` in it.
 
I realise there are `yarn` and `webpack` resources in FiveM, I want to use these standalone.
