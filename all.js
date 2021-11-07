let data = [
  {
    "id": 0,
    "name": "肥宅心碎賞櫻3日",
    "imgUrl": "https://images.unsplash.com/photo-1522383225653-ed111181a951?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1655&q=80",
    "area": "高雄",
    "description": "賞櫻花最佳去處。肥宅不得不去的超讚景點！",
    "group": 87,
    "price": 1400,
    "rate": 10
  },
  {
    "id": 1,
    "name": "貓空纜車雙程票",
    "imgUrl": "https://images.unsplash.com/photo-1501393152198-34b240415948?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
    "area": "台北",
    "description": "乘坐以透明強化玻璃為地板的「貓纜之眼」水晶車廂，享受騰雲駕霧遨遊天際之感",
    "group": 99,
    "price": 240,
    "rate": 2
  },
  {
    "id": 2,
    "name": "台中谷關溫泉會1日",
    "imgUrl": "https://images.unsplash.com/photo-1535530992830-e25d07cfa780?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
    "area": "台中",
    "description": "全館客房均提供谷關無色無味之優質碳酸原湯，並取用八仙山之山冷泉供蒞臨貴賓沐浴及飲水使用。",
    "group": 20,
    "price": 1765,
    "rate": 7
  }
];

let cities = ['台北', '台中', '高雄']

const spotCitySelect = document.querySelector('.form__spotCitySelect')
const searchCitySelect = document.querySelector('.citySearch__select')
const addBtn = document.querySelector('.form__addBtn')
const spotList = document.querySelector('.spotList')

const searchCity = document.querySelector('.citySearch__select')
const ticketCount = document.querySelector('.citySearch__ticketCount')

// ----- form 景點地區 -----
function add_spotCity(data) {
  let option = `
  <option
    value="請選擇請點地區"
    selected
    disabled
    hidden
  >請選擇景點地區</option>
  `
  data.forEach(item => {
    option += `
    <option value="${item}">${item}</option>
    `
  })
  spotCitySelect.innerHTML = option
}
add_spotCity(cities)

// ----- search 地區搜尋 -----
function search_spotCity(data) {
  let option = `
  <option
    value="地區搜尋"
    selected
    disabled
    hidden
  >地區搜尋</option>
  <option value="全部">全部</option>
  `
  data.forEach(item => {
    option += `
    <option value="${item}">${item}</option>
    `
  })
  searchCitySelect.innerHTML = option
}
search_spotCity(cities)

// ----- 初始化 render -----
render(data)
ticketCountHandler(data)

// ----- render 畫面 -----
function render(data) {
  let tickets = ''
  data.forEach(item => {
    tickets += `
    <li class="spotList__item">
      <div class="ticket__head">
        <a
          class="ticket__spotImg"
          href="javascript:;"
        >
          <img
            src="${item['imgUrl']}"
            class="ticket__spotImg"
            alt=""
          >
        </a>
        <div class="ticket__city">${item['area']}</div>
        <div class="ticket__score">${item['rate']}</div>
      </div>
      <div class="ticket__body">
        <h3 class="ticket__title">${item['name']}</h3>
        <p class="ticket__introText">${item['description']}</p>
        <div class="ticket__info">
          <div class="ticket__count">
            <img
              src="img/exclamation-circle-solid.svg"
              class="ticket__noteIcon"
              alt=""
            >
            <div class="ticket__countText">剩下最後 ${item['group']} 組</div>
          </div>
          <div class="ticket__price">
            <span class="ticket__unit">TWD</span>
            <div class="ticket__amount">$${parseInt(item['price']).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </li>
    `
  })
  spotList.innerHTML = tickets
}

// ----- 新增套票 -----
function addTicket(e) {
  const imgUrl = document.querySelector('.form__input--img')
  let addObj = {}
  let checkInputStatus = checkInput()
  let checkRateRangeStatus = checkRateRange()
  let checkImgStatus
  checkImgExists(imgUrl)
    .then(() => {
      checkImgStatus = true
      if (checkInputStatus && checkRateRangeStatus && checkImgStatus) {
        addTicketObj(addObj)
        search_spotCity(cities)
        ticketCountHandler(data)
        render(data)
      }
    })
    .catch(() => {
      // e.preventDefault()
      alert('圖片網址無效')
      imgUrl.value = ''
      imgUrl.focus()
      checkImgStatus = false
      return
    })
}

// ----- 套票物件新增到 data -----
function addTicketObj(addObj) {
  const userInputs = document.querySelectorAll('[data-prop]')
  userInputs.forEach(input => {
    addObj[input.dataset.prop] = input.value
  })
  console.log(addObj)
  data.push(addObj)
}

// ----- 檢查 套票星級 是否在 1~10 分 -----
function checkRateRange() {
  const ticketRate = document.querySelector('.form__input--rate')
  if (ticketRate.value > 10 || ticketRate.value < 1) {
    alert('「套票星級」為1 ~ 10分')
    ticketRate.focus()
    return false
  } else {
    return true
  }
}

// ----- 檢查 input 是否有空值 -----
function checkInput() {
  const userInputs = document.querySelectorAll('[data-prop]')
  let emptyInput = [...userInputs].find(item => item.value === '')
  if (emptyInput) {
    alert(`${emptyInput.dataset.name}未填`)
    emptyInput.focus()
    return false
  } else {
    return true
  }
}

// ----- 檢查 圖片連結 是否正常 -----
function checkImgExists(imgUrl) {
  return new Promise((resolve, reject) => {
    let ImgObj = new Image()
    ImgObj.src = imgUrl.value
    ImgObj.onload = res => {
      resolve(res)
    }
    ImgObj.onerror = err => {
      reject(err)
    }
  })
}

// ----- 地區搜尋 -----
function searchCitySelectHandler(e) {
  const filterData = data.filter(item => item['area'] === e.target.value)
  if (e.target.value === '全部') {
    ticketCountHandler(data)
    render(data)
  }
  else {
    ticketCountHandler(filterData)
    render(filterData)
  }
}

// ----- 顯示幾筆資料 -----
function ticketCountHandler(data) {
  ticketCount.textContent = `本次搜尋共 ${data.length} 筆資料`
}

// ----- 監聽 -----
addBtn.addEventListener('click', addTicket, false)
searchCity.addEventListener('change', searchCitySelectHandler, false)
