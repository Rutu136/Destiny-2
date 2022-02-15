# Submisison
## Database
### Requirement
- postgresSQL (if you want to run database in )
- postgresql client or pgAdmin
### Conenct to online database 
I would prefer this option since it will be easier for you and us.
More detail on `docs/HowToConnect.md`
If you would like to see the database configurations, please refer to `docs/HowToConfigurePostgresqlServer.md`

### Run database on your computer
1. Set up postgresql (please refer to internet for the instruction)
2. Open psql
2.1. Create a new database named `destiny` in postgresql
2.2. Run command `pg_restore --dbname=destiny --verbose pathToDatabase.sql`
 replace `pathToDatabase.sql` to the actual file path of file `./database.sql`

### Populate database file (Optional)
- You can check the folder populateDatabase for how we populated database.
- File `populateDatabase/populate.sql` contains the information we run to populate database.
- Requirement: nodejs, npm, python

### Database (Optional)
`database` folder contain all schema-related files of our database. Feel free to check it.

## Interacting application
### Requirements (Must have installed in the machine)
- nodejs
- npm

### Run
1. Open command line (Mac) or nodejs commandline (window)
2. Navigate to the folder `./application`
3. Run `npm install`
4. Run `npm run start:dev`
5. Open `http://localhost:8000/`

### Detail
- we have some interacting queries for users to interact with.
- beside, due to the time limit, we make some pre-made query which user can choose to run with. 

### Resource
https://nodejs.org/en/download/

## Report
Please find the report in `/docs` folder. 

## Developer
- Rutu Barvaliya
- Kein Mai
- Christopher Eu

# DatabaseProject_Destiny2
A database project intended to fulfill course requirements for COMP 3380 for the University of Manitoba. Utilizes the Bungie API and Destiny 2 database information.

This project will:
  Create a database with DB2 that contains most records of "Weapons" from Destiny 2. It will allow users a front-end access point from which they can make a list of arbitrarily created queries, and they will be able to request the contents of any table within the database.
  
I do not own any of the data taken from the Bungie API, nor do any of the contributors to this project own any of the data taken from the Bungie API.


For my fellow contributors, here are a bunch of links that may help you, once we get around to coding!

Very Basic "Getting Started" Read this first.
http://destinydevs.github.io/BungieNetPlatform/docs/Getting-Started
(The rest of these are not presented in a read-this-next order.)

Github Link, Official Bungie Stuff.
https://github.com/Bungie-net/api/wiki

More official Bungie stufff but on a fuck-you-large single page.
https://bungie-net.github.io/index.html

An unofficial page created and maintained by community members, may be more feasible to start reading.
https://github.com/vpzed/Destiny2-API-Info/wiki

A database that does a lot of what we're trying to do, that is community created for the purpose of helping developers (That's us now!) Understand what's going on. Worth a look.
https://data.destinysets.com/


<Constantly in update>
