const server = 'http://localhost:8000'

$('document').ready(() => {
    //Get weapon type
    fetch(`${server}/weaponType`).then(response => response.json())
        .then(data => {
            const result = data.result
            result.map(weaponType => {
                const option = document.createElement('option')
                option.value = weaponType.tid
                option.text = weaponType.weaponname

                $('#weaponType').append(option)
            })
        })

    //Get tier type
    fetch(`${server}/tierType`).then(response => response.json())
        .then(data => {
            const result = data.result
            result.map(tierType => {
                const option = document.createElement('option')
                option.value = tierType.ttid
                option.text = tierType.tiername

                $('#tierType').append(option)
            })
        })

    //Get ammo type
    fetch(`${server}/ammoType`).then(response => response.json())
        .then(data => {
            const result = data.result
            result.map(ammoType => {
                const option = document.createElement('option')
                option.value = ammoType.amid
                option.text = ammoType.ammoname

                $('#ammoType').append(option)
            })
        })

    //Get pre made queries
    fetch(`${server}/premadequeries`).then(response => response.json())
        .then(data => {
            const result = data.result
            result.map(query => {
                const option = document.createElement('option')
                option.value = result.indexOf(query)
                option.text = query.name

                $('#premadequeries').append(option)
            })
        })
    listenSearchDefault()
    listenSearchByName()
    listenSearchByStats()
    listenRunQuery()
})

const getLimit = () => {
    return document.getElementById('searchLimit').value
}

const listenSearchDefault = () => {
    const form = document.getElementById('defaultForm')

    form.addEventListener('submit', (event) => {
        event.preventDefault()


        const weaponType = form.elements['weaponType'].value
        const tierType = form.elements['tierType'].value

        if (!weaponType || !tierType) {
            alert("please select all fields")
            return;
        }
        fetch(`${server}/weapons/searchDefault?weaponType=${weaponType}&tierType=${tierType}&limit=${getLimit()}`)
            .then(response => response.json())
            .then(data => {
                const result = data.result
                display(result)
            })
    })
}

const listenSearchByName = () => {
    const form = document.getElementById('searchNameForm')

    form.addEventListener('submit', (event) => {
        event.preventDefault()


        const weaponName = form.elements['weaponName'].value


        if (!weaponName) {
            alert("please do not leave filed empty")
            return;
        }
        fetch(`${server}/weapons/searchName?weaponName=${weaponName}&limit=${getLimit()}`)
            .then(response => response.json())
            .then(data => {
                const result = data.result
                display(result)
            })

    })
}


const listenSearchByStats = () => {
    const form = document.getElementById('searchStats')

    form.addEventListener('submit', (event) => {
        event.preventDefault()


        const aimassistance = form.elements['aimassistance'].value
        const stability = form.elements['stability'].value
        const impact = form.elements['impact'].value


        fetch(`${server}/weapons/searchStats?aimassistance=${aimassistance}&stability=${stability}&impact=${impact}&limit=${getLimit()}`)
            .then(response => response.json())
            .then(data => {
                const result = data.result
                display(result)
            })

    })
}


const listenRunQuery = () => {
    const form = document.getElementById('premadeForm')

    form.addEventListener('submit', (event) => {
        event.preventDefault()


        const queryIndex = form.elements['premadequeries'].value


        if (!queryIndex) {
            alert("please select the field")
            return;
        }
        fetch(`${server}/premadequery/run?queryIndex=${queryIndex}&limit=${getLimit()}`)
            .then(response => response.json())
            .then(data => {
                const result = data.result
                display(result)
            })

    })
}

const display = (queryResult) => {
    const display = $("#displayWeapon")
    const resultNumber = $('#resultNumber')
    const header = $('#displayHeader')
    header.html('')
    const tbody = $('#displayBody')
    tbody.html('')
    if (!queryResult || queryResult.length == 0) {
        resultNumber.text(0)
    } else {
        resultNumber.text(queryResult.length)

        //Create headline
        const firstObject = queryResult[0]


        for (var name in firstObject) {

            const eTh = document.createElement('th')
            eTh.classList.add('col')
            eTh.innerText = name

            header.append(eTh)
        }
        //Populate data


        queryResult.map(object => {
            const row = document.createElement('tr')
            for (var name in object) {

                const eTh = document.createElement('th')
                eTh.classList.add('col')
                eTh.innerText = object[name]

                row.append(eTh)
            }

            tbody.append(row)
        })
    }
}