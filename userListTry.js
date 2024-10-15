let Index_URL = "https://user-list.alphacamp.io/api/v1/users/"
let dataPanel = document.querySelector('#data-panel')
let searchForm = document.querySelector('#search-form')
let searchInput = document.querySelector('#search-input')
let addFavoriteBtn = document.querySelector('#add-favorite-btn')
let paginator = document.querySelector('#paginator')
let USER_PER_PAGE = 20

const users = []
let filteredUser = []


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



// Render首頁的users頁面
axios.get(Index_URL)
  .then(function (response) {   // response.data.results 是 aaray(200)
    for (let user of response.data.results) {
      users.push(user)
    }
    renderPaginator(users.length)
    renderUserList(getUserByPage(1))
  })
  .catch(function (error) {
    console.log(error)
  })


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
  const addToFavorite = document.querySelector('#add-favorite-btn')


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
      addToFavorite.dataset.id = `${data.id}`
      // addToFavorite.innerHTML = `<div class="btn btn-primary" data-id="${data.id}">
      // X My Favorite <i class="fa-solid fa-heart" style="color: #ffffff;"></i>
      // </div>`
    })
    .catch(function (error) {
      console.log(error)
    })
}


//搜尋功能挑戰!
searchForm.addEventListener('submit', function (event) {
  //防止網頁預設行為
  event.preventDefault()
  //取得並格式化keyword
  let keyWord = searchInput.value.trim().toLowerCase()
  //用keyword filter出資料吻合的名單

  if (keyWord.length === 0) { //若搜尋空資料,顯示原始名單
    renderPaginator(users.length)
    renderUserList(getUserByPage(1))
  }
  filteredUser = users.filter(function getFilterUser(user) {
    return user.name.trim().toLowerCase().includes(keyWord) ||
      user.surname.trim().toLowerCase().includes(keyWord) ||
      user.gender.trim().toLowerCase().includes(keyWord) ||
      user.region.trim().toLowerCase().includes(keyWord) 
    })
    
  
  if (filteredUser.length === 0) {
    return alert(`沒有用戶符合關鍵字：${keyWord}`)
  }
  console.log(users)
  console.log (filteredUser)
  renderPaginator(filteredUser.length)
  renderUserList(filteredUser)
})


//蒐藏好友功能挑戰!
addFavoriteBtn.addEventListener('click', function (event) {
  addFavoriteUser(Number(event.target.dataset.id))
})

function addFavoriteUser(id) {
  let favoriteList = JSON.parse(localStorage.getItem('favoriteUsers')) || []

  if (favoriteList.some(function (data) { return data && data.id === id })) {
    return alert("此用戶已在我的最愛中囉！")
  }
  if (favoriteList.some(function (data) { return null })) {
    return alert("操作速度太快囉！請稍等一下")
  }
  let favoriteUser = users.find(function (user) {
    return user.id === id
  })

  favoriteList.push(favoriteUser)
  localStorage.setItem('favoriteUsers', JSON.stringify(favoriteList))
  console.log(favoriteList)

}

//分頁器挑戰！
function renderPaginator(data) { //傳入users.length
  let numberOfPage = Math.ceil(data / USER_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function getUserByPage(page) {
  //page1 00~19
  //page2 20~39
  //page3 40~59

  let startIndex = (page - 1) * USER_PER_PAGE
  let endIndex = startIndex + USER_PER_PAGE //稍後用slice不會包含結尾index的值
  let data = filteredUser.length ? filteredUser : users
  return usersByPage = data.slice(startIndex, endIndex)
}

paginator.addEventListener('click', function (event) {
  if (event.target.tagName === 'A') {
    let page = event.target.dataset.page
    renderUserList(getUserByPage(page))
  }
})
