
//pulling id cafe-list from html
const cafeList = document.querySelector('#cafe-list')

//pulling id add-cafe-form from html
const form = document.querySelector('#add-cafe-form')


//create element and render cafe
function renderCafe(doc) {
    //creating html attributes
    let li = document.createElement('li')
    let name = document.createElement('span')
    let city = document.createElement('span')
    //close button
    let cross = document.createElement('div')

    li.setAttribute('data-id', doc.id)
    //setting variables to data from firebase
    name.textContent = doc.data().name
    city.textContent = doc.data().city
    cross.textContent = 'x' //close button

    //list appends the data
    li.appendChild(name)
    li.appendChild(city)
    li.appendChild(cross) //close button

    // ul appends the list
    cafeList.appendChild(li)
    //deleting data
    cross.addEventListener('click', (e) => {

        //stops the event from bubbling up
        e.stopPropagation()
        //gets an id of a document to be deleted
        let id = e.target.parentElement.getAttribute('data-id')
        //deleting document from database
        db.collection('cafes').doc(id).delete()
    })
}


//getting data from Firebase
//.where('city', '==', 'Loveland') paste this before .get to query through database
// db.collection('cafes').orderBy('city').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc)
//     })
// })

//saving data in Firebase
form.addEventListener('submit', (e) => {
    e.preventDefault()
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    })
    form.name.value = '',
        form.city.value = ''
})

//real time listener allows you not to reload page every time you delete or add a new doc
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges()
    changes.forEach(change => {
        if (change.type == 'added') {
            renderCafe(change.doc)
        } else if (change.type == 'removed') {
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']')
            cafeList.removeChild(li)
        }
    })
})