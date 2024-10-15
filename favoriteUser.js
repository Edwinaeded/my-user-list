let Index_URL = "https://user-list.alphacamp.io/api/v1/users/"
let dataPanel = document.querySelector('#data-panel')
let searchForm = document.querySelector('#search-form')
let searchInput = document.querySelector('#search-input')
const removeFavoriteBtn = document.querySelector('#remove-favorite-btn')
let showModal = document.querySelector('#show-user-modal')


const users = JSON.parse(localStorage.getItem('favoriteUsers')) || []
// age avatar birthday  email gender id name surname region updated_at created_at


// 設定字型

// 1. 創建一個 style 標籤
let style = document.createElement('style');
//style.type = 'text/css';

// 2. 添加 CSS 內容
let css = `
  .html,body{
    font-family: "Nunito", serif;
    font-optical-sizing: auto;
    font-weight: <weight>;
    font-style: normal;
  }
`;

// 3. 將樣式文本加入 style 標籤
style.appendChild(document.createTextNode(css));

// 4. 將 style 標籤添加到 head 中
document.head.appendChild(style);


//render畫面的功能
renderUserList(users)
function renderUserList(data) {
  let rawHTML = ''
  data.forEach(function (item) {
    if (item.gender === 'male') {
      rawHTML += `<div class="card col-sm-3">
        <img src=${item.avatar} class="card-img-top" alt="user-poster">
        <div class="card-body">
          <h5 class="user-name">${item.name + item.surname}</h5>
          <p class="user-gender"><i class="fa-solid fa-person fa-lg" style="color: #30b8f2;margin-right:5px;"></i>${item.gender}</p>
          <p class="user-region"> Region : ${item.region}</p>
          <a href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#show-user-modal" data-id=${item.id} id="show-user-button" >About me<i class="fa-solid fa-user-astronaut" style="margin-left:5px"></i></a>
        </div>
      </div>`
    } else {
      rawHTML += `<div class="card col-sm-3">
        <img src=${item.avatar} class="card-img-top" alt="user-poster">
        <div class="card-body">
          <h5 class="user-name">${item.name + item.surname}</h5>
          <p class="user-gender"><i class="fa-solid fa-person-dress fa-lg" style="color: #f14b8d;margin-right:5px;"></i>${item.gender}</p>
          <p class="user-region"> Region : ${item.region}</p>
          <a href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#show-user-modal" data-id=${item.id} id="show-user-button" >About me<i class="fa-solid fa-user-astronaut" style="margin-left:5px" ></i></a>
        </div>
      </div>`
    }

  })
  dataPanel.innerHTML = rawHTML
}



// Modal製作
dataPanel.addEventListener('click', function onButtonClick(event) {
  //console.log(event.target.dataset)
  if (event.target.matches("#show-user-button")) {
    showUserModal(Number(event.target.dataset.id))
  }
})

function showUserModal(id) {
  const modalTitle = document.querySelector('.modal-title')
  const modalImage = document.querySelector('#modal-image')
  const modalGenderRegion = document.querySelector('#modal-gender-region')
  const modalBirthdayAge = document.querySelector('#modal-birthday-age')
  const modalEmail = document.querySelector('#modal-email')
  const modalUpdatedDate = document.querySelector('#modal-updatedDate')
  


  axios.get(Index_URL + id)
    .then(function (response) {
      let data = response.data
      modalTitle.innerText = `${data.name + data.surname}`
      modalImage.innerHTML = `<img src=${data.avatar}></img>`
      if (data.gender === 'male') {
        modalGenderRegion.innerHTML = `Gender : ${data.gender} <i class="fa-solid fa-person fa-lg" style="color: #30b8f2;margin-right:5px;"></i>   | Region : ${data.region}`
      } else {
        modalGenderRegion.innerHTML = `Gender : ${data.gender} <i class="fa-solid fa-person-dress fa-lg" style="color: #f14b8d;margin-right:5px;"></i>   | Region : ${data.region}`
      }
      modalBirthdayAge.innerText = `Birthday : ${data.birthday} | Age : ${data.age}`
      modalEmail.innerHTML = `Email : ${data.email}<a class="email-link" href="mailto:${data.email}" target="_blank"><i class="fa-solid fa-envelope fa-sm" style="color: #19191a; margin-left:10px;"></i></a>`
      modalUpdatedDate.innerText = `Updated date : ${data.updated_at}`
      removeFavoriteBtn.dataset.id = `${data.id}`

    })
    .catch(function (error) {
      console.log(error)
    })
}

// remove 我的最愛功能
removeFavoriteBtn.addEventListener('click', function (event) {
  removeFavoriteUser(Number(event.target.dataset.id))
})

function removeFavoriteUser(id) {
  let userIndex = users.findIndex(function(user){
    return user.id === id 
  })
  users.splice( userIndex , 1 )
  localStorage.setItem('favoriteUsers', JSON.stringify(users))
  renderUserList(users)
}
