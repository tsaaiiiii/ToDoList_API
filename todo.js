//API url
let nickname = "";
let token = "";
token = localStorage.getItem("userToken");
nickname = localStorage.getItem("userNickname");
const apiEndpoint = "https://todoo.5xcamp.us/todos";
const url = "https://todoo.5xcamp.us";

const headers = {
  Authorization: token,
  accept: "application/json",
};

const config = {
  headers: {
    Authorization: token,
  },
};

//DOM
const list = document.querySelector(".list");
const btn = document.querySelector(".btn");
const todoAdd = document.querySelector(".todoAdd");
const all = document.querySelector(".all");
const finished = document.querySelector(".finished");
const pending = document.querySelector(".pending");
const logoutBtn = document.querySelector(".logout");
const backgroundImg = document.querySelector(".backgroundImage");
const remaining = document.querySelector(".remaining");
const alert_add = document.querySelector(".alert_add");

// 取得資料
let data = [];
function getApi() {
  axios.get(apiEndpoint, { headers }).then((response) => {
    data = response.data.todos;
    render();
  });
}
//  網頁初始化
function render() {
  let str = "";
  let total = 0;
  if (data.length === 0) {
    backgroundImg.style.display = "block";
    alert_add.style.display = "block";
    remaining.style.display = "none";
  } else {
    backgroundImg.style.display = "none";
    alert_add.style.display = "none";
    remaining.style.display = "block";
  }

  data.filter((item, index) => {
    if (item.completed_at) {
      str += `<li><p>●</p><h3>${item.content}</h3><input type="checkbox" class="check "data-number="${index}" data-status = "${item.completed_at}" data-id = "${item.id}" value="✔" checked /><input type="button" class="delete" data-num ="${index}" value="✘" data-id = "${item.id}"/></li>`;
    } else {
      total += 1;
      str += `<li><p>●</p><h3>${item.content}</h3><input type="checkbox" class="check "data-number="${index}" data-status = "${item.completed_at}" data-id = "${item.id}" value="✔" /><input type="button" class="delete" data-num ="${index}" value="✘" data-id = "${item.id}"/></li>`;
    }
  });
  remaining.innerHTML = `<h3>remaining unfinished tasks: ${total}</h3>`;
  list.innerHTML = str;
}
getApi();

//新增待辦事項
btn.addEventListener("click", () => {
  if (todoAdd.value == "") {
    alert("write somthing");
    return;
  }
  //抓取todoadd.value
  let obj = {};
  obj.content = todoAdd.value;

  // axios 新增
  axios
    .post(apiEndpoint, obj, { headers })
    .then((response) => {
      console.log(response);
      // 如果成功就會執行這個function
      getApi();
    })
    .catch((error) => {
      console.log(error);
    });

  todoAdd.value = "";
});

// 刪除資料
list.addEventListener("click", (e) => {
  if (e.target.getAttribute("class") === "delete") {
    //抓取data-id 要抓取每一筆id資料
    const getId = e.target.getAttribute("data-id");

    // axios 刪除
    axios
      .delete(`${apiEndpoint}/${getId}`, config)
      .then((response) => {
        console.log(response);
        getApi();
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

function patch() {
  // 監聽勾選框的點擊事件
  list.addEventListener("click", (e) => {
    const getId = e.target.getAttribute("data-id");
    if (e.target.getAttribute("type") === "checkbox") {
      axios
        .patch(`${apiEndpoint}/${getId}/toggle`, {}, config)
        .then((res) => {
          const completedAt = res.data.completed_at;
          const index = e.target.getAttribute("data-number");
          data[index].completed_at = completedAt;

          const uncompletedItems = data.filter((item) => !item.completed_at);
          console.log(uncompletedItems);
          remaining.innerHTML = `<h3>remaining unfinished tasks: ${uncompletedItems.length}</h3>`;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}
patch();

//all
all.addEventListener("click", (e) => {
  const getId = e.target.getAttribute("data-id");
  let status = e.target.getAttribute("data-status");
  let allStr = "";
  let checked;
  data.forEach((item, index) => {
    if (item.completed_at !== null) {
      checked = "checked";
    } else {
      checked = "";
    }
    if (status !== null) {
      allStr += `<li><p>●</p><h3>${item.content}</h3><input type="checkbox" class="check" data-number="${index}" data-status="${item.completed_at}" value="✔" data-id="${item.id}" ${checked} /><input type="button" class="delete" data-num="${index}" value="✘" data-id="${item.id}"/></li>`;
    } else {
      allStr += `<li><p>●</p><h3>${item.content}</h3><input type="checkbox" class="check" data-number="${index}" data-status="${item.completed_at}" value="✔" data-id="${item.id}" ${checked} /><input type="button" class="delete" data-num="${index}" value="✘" data-id="${item.id}" /></li>`;
    }
  });

  list.innerHTML = allStr;
});

//Finished
finished.addEventListener("click", (e) => {
  const getId = e.target.getAttribute("data-id");
  let done = "";
  data.forEach((item, index) => {
    if (item.completed_at !== null) {
      done += `<li><p>●</p><h3>${item.content}</h3><input type="button" class="delete" data-status = "${item.completed_at}" data-num ="${index}" value="✘" data-id = "${item.id}"/></li>`;
    } else {
      console.log(data);
    }
  });
  list.innerHTML = done;
});

//pending
pending.addEventListener("click", (e) => {
  const getId = e.target.getAttribute("data-id");
  let undone = "";
  data.forEach((item, index) => {
    if (item.completed_at === null) {
      undone += `<li><p>●</p><h3>${item.content}</h3><input type="button" class="delete" data-num ="${index}" value="✘" data-id = "${item.id}"/></li>`;
    }
  });
  list.innerHTML = undone;
});

// logoutBtn
logoutBtn.addEventListener("click", () => {
  axios
    .delete(`${url}/users/sign_out`, config)
    .then((res) => {
      console.log(res);
      alert("Logout successful！");
      localStorage.removeItem("userToken");
      localStorage.removeItem("userNickname");
      logoutBtn.setAttribute("href", "./login.html");
      logoutBtn.click();
    })
    .catch((err) => {
      console.log(err);
      alert("Logout failed！");
    });
});
