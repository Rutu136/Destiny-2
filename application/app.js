const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const db = require('./connection')

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('/', (req, res) => {
    db.query('select wid as weapon_id, name as weapon_name, lore, impact, range, stability, handling, reloadspeed, aimassistance, inventorysize, zoom, recoildirection, weaponname as type, ammoname as ammo, damagename as damage,  description as frame from weapons natural join weapontype natural join ammotype natural join damagetype natural join frame LIMIT 10')
    .then(queryResult => {
        res.status(200).send({
            result: queryResult.rows
        })
    })

});

app.get('/weapons', (req, res) => {
    const limit = req.query.limit || 100;
    const id = req.query.id

    if (id) {
        db.query('SELECT * FROM Weapons WHERE wID = $1 LIMIT $2', [id, limit]).then(queryResult => {
            res.status(200).send({
                result: queryResult.rows
            })
        })
    } else {
        db.query('SELECT * FROM Weapons LIMIT $1', [limit]).then(queryResult => {
            res.status(200).send({
                result: queryResult.rows
            })
        })
    }
})

app.get('/weapons/searchDefault', (req, res) => {
    const limit = req.query.limit || 10;
    const tierType = req.query.tierType
    const weaponType = req.query.weaponType


    db.query('select wid as weapon_id, name as weapon_name, lore, impact, range, stability, handling, reloadspeed, aimassistance, inventorysize, zoom, recoildirection, weaponname as type, ammoname as ammo, damagename as damage,  description as frame from weapons natural join weapontype natural join ammotype natural join damagetype natural join frame WHERE ttID = $1 AND tID = $2 LIMIT $3'
        , [tierType, weaponType, limit]).then(queryResult => {
            res.status(200).send({
                result: queryResult.rows
            })
        })

})

app.get('/weapons/searchName', (req, res) => {
    const limit = req.query.limit || 100;
    const weaponName = req.query.weaponName

    if (!weaponName) {
        res.status(400).send({
            message: "Invalid parameter"
        })
    } else {

        db.query('select wid as weapon_id, name as weapon_name, lore, impact, range, stability, handling, reloadspeed, aimassistance, inventorysize, zoom, recoildirection, weaponname as type, ammoname as ammo, damagename as damage,  description as frame from weapons natural join weapontype natural join ammotype natural join damagetype natural join frame WHERE name = $1 LIMIT $2'
            , [weaponName, limit])
            .then(queryResult => {
                const result = queryResult.rows
                if (result.length > 0) {
                    res.status(200).send({
                        result: queryResult.rows
                    })
                } else {
                    const threshold = 5
                    db.query('select wid as weapon_id, name as weapon_name, lore, impact, range, stability, handling, reloadspeed, aimassistance, inventorysize, zoom, recoildirection, weaponname as type, ammoname as ammo, damagename as damage,  description as frame from weapons natural join weapontype natural join ammotype natural join damagetype natural join frame WHERE levenshtein(name, $1) < $2 ORDER BY levenshtein(name, $1) LIMIT $3',
                        [weaponName, threshold, limit]).then(queryResult => {
                            const result = queryResult.rows
                            res.status(200).send({
                                result: queryResult.rows
                            })
                        })
                }
            })
    }

})

app.get('/weapons/searchStats', (req, res) => {
    const limit = req.query.limit || 100;

    const aimassistance = req.query.aimassistance
    const stability = req.query.stability
    const impact = req.query.impact

    db.query('select wid as weapon_id, name as weapon_name, lore, impact, range, stability, handling, reloadspeed, aimassistance, inventorysize, zoom, recoildirection, weaponname as type, ammoname as ammo, damagename as damage,  description as frame from weapons natural join weapontype natural join ammotype natural join damagetype natural join frame where aimassistance > $1 and impact > $2 and stability < $3 LIMIT $4',
        [aimassistance, impact, stability, limit])
        .then(queryResult => {
            const result = queryResult.rows
            res.status(200).send({
                result: queryResult.rows
            })
        })

})

app.get('/damageType', (req, res) => {
    const damageTypeId = req.query.id

    if (!damageTypeId) {
        //Return all
        db.query('SELECT * FROM DamageType').then(queryResult => {
            res.status(200).send({
                result: queryResult.rows
            })
        })
    } else {
        //Return 1
        db.query('SELECT * FROM DamageType WHERE dID = $1', [damageTypeId]).then(queryResult => {
            res.status(200).send({
                result: queryResult.rows
            })
        })
    }
})

app.get('/weaponType', (req, res) => {
    const id = req.query.id

    if (!id) {
        //Return all
        db.query('SELECT * FROM WeaponType').then(queryResult => {
            res.status(200).send({
                result: queryResult.rows
            })
        })
    } else {
        //Return 1
        db.query('SELECT * FROM WeaponType WHERE tID = $1', [id]).then(queryResult => {
            res.status(200).send({
                result: queryResult.rows
            })
        })
    }
})

app.get('/tierType', (req, res) => {
    const id = req.query.id

    if (!id) {
        //Return all
        db.query('SELECT * FROM TierType').then(queryResult => {
            res.status(200).send({
                result: queryResult.rows
            })
        })
    } else {
        //Return 1
        db.query('SELECT * FROM TierType WHERE ttID = $1', [id]).then(queryResult => {
            res.status(200).send({
                result: queryResult.rows
            })
        })
    }
})

app.get('/ammoType', (req, res) => {
    const id = req.query.id

    if (!id) {
        //Return all
        db.query('SELECT * FROM AmmoType').then(queryResult => {
            res.status(200).send({
                result: queryResult.rows
            })
        })
    } else {
        //Return 1
        db.query('SELECT * FROM AmmoType WHERE amID = $1', [id]).then(queryResult => {
            res.status(200).send({
                result: queryResult.rows
            })
        })
    }
})

const createQuery = (name, query) => {
    return {
        name,
        query,
    }
}

const premadeQueries = [
    createQuery("Find all void weapons" ,"select wid as weapon_id, name as weapon_name, lore, impact, range, stability, handling, reloadspeed, aimassistance, inventorysize, zoom, recoildirection, weaponname as type, ammoname as ammo, damagename as damage,  description as frame from weapons natural join weapontype natural join ammotype natural join damagetype natural join frame where DamageName = 'Void'"),
    createQuery("Find all submachine guns" ,"select wid as weapon_id, name as weapon_name, lore, impact, range, stability, handling, reloadspeed, aimassistance, inventorysize, zoom, recoildirection, weaponname as type, ammoname as ammo, damagename as damage,  description as frame from weapons natural join weapontype natural join ammotype natural join damagetype natural join frame where WeaponName = 'SubmachineGun'"),
    createQuery("Find all void submachine guns" ,"select wid as weapon_id, name as weapon_name, lore, impact, range, stability, handling, reloadspeed, aimassistance, inventorysize, zoom, recoildirection, weaponname as type, ammoname as ammo, damagename as damage,  description as frame from weapons natural join weapontype natural join ammotype natural join damagetype natural join frame where WeaponName = 'SubmachineGun' and DamageName = 'Void'"),
    createQuery("Find all void submachine guns with a precision frame" ,"select wid as weapon_id, name as weapon_name, lore, impact, range, stability, handling, reloadspeed, aimassistance, inventorysize, zoom, recoildirection, weaponname as type, ammoname as ammo, damagename as damage,  description as frame from weapons natural join weapontype natural join ammotype natural join damagetype natural join frame where WeaponName = 'SubmachineGun' and DamageName = 'Void' and description = 'Precision Frame'"),
    createQuery("Find all weapons that use the adaptive frame" ,"select wid as weapon_id, name as weapon_name, lore, impact, range, stability, handling, reloadspeed, aimassistance, inventorysize, zoom, recoildirection, weaponname as type, ammoname as ammo, damagename as damage,  description as frame from weapons natural join weapontype natural join ammotype natural join damagetype natural join frame where description = 'Adaptive Frame'"),
    createQuery("Find all weapons that use the adaptive frame that are solar" ,"select wid as weapon_id, name as weapon_name, lore, impact, range, stability, handling, reloadspeed, aimassistance, inventorysize, zoom, recoildirection, weaponname as type, ammoname as ammo, damagename as damage,  description as frame from weapons natural join weapontype natural join ammotype natural join damagetype natural join frame where description = 'Adaptive Frame' and damagename = 'Solar'"),
    createQuery("Find all exotic armor with “Helm” in its name" ,"select * from Armor natural join tiertype where tiername = 'Exotic' and name like '%Helm%'"),
    createQuery("Find all weapons that have an aim assist of >90, and are energy hand cannons" ,"select wid as weapon_id, name as weapon_name, lore, impact, range, stability, handling, reloadspeed, aimassistance, inventorysize, zoom, recoildirection, weaponname as type, ammoname as ammo, damagename as damage,  description as frame from weapons natural join weapontype natural join ammotype natural join damagetype natural join frame where weaponname = 'HandCannon' and aimassistance > 90"),
    createQuery("Count the number of each weapon type ordered most to least" ,"select count(*), weaponname from weapontype natural join weapons group by tid order by count(*) desc"),
    createQuery("Count the number of armor pieces by rarity" ,"select count(*),tiername from armor natural join tiertype group by tiername"),
]
app.get('/premadequeries', (req, res) => {

    res.status(200).send({
        result: premadeQueries
    })
})
app.get('/premadequery/run', (req, res) => {
    const limit = req.query.limit || 100;
    
    const queryIndex = req.query.queryIndex;
    const query = premadeQueries[queryIndex].query

    db.query(`${query} LIMIT $1`, [limit]).then(queryResult => {
        res.status(200).send({
            result: queryResult.rows
        })
    })
})

module.exports = app;