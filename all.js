// api
const url = "https://todoo.5xcamp.us";
const obj = {
  user: {},
};

// DOM
const homepage_all = document.querySelector(".homepage_all");
const email = document.querySelector(".email");
const nickName = document.querySelector(".nickname");
const password = document.querySelector(".password");
const checkPassword = document.querySelector(".checkPassword");
const checkPasswordLabel = document.querySelector(".checkPasswordLabel");
const signUp = document.querySelector(".signUpBtn");
const loginBtn = document.querySelector(".login");

//註冊api
function sign() {
  axios
    .post(`${url}/users`, obj)
    .then((res) => {
      console.log(res);
      alert("註冊成功囉！");
      signUp.setAttribute("href", "../login.html");
      signUp.click();
    })
    .catch((err) => {
      console.log(obj);
    });
}
// 點擊註冊按鈕時...
signUp.addEventListener("click", () => {
  obj.user.email = email.value;
  obj.user.nickname = nickName.value;
  obj.user.password = password.value;

  if (
    email.value === "" ||
    nickName.value === "" ||
    password.value === "" ||
    checkPassword.value === ""
  ) {
    alert("請填寫完整唷！");
  } else if (password.value !== checkPassword.value) {
    alert("密碼有誤喔！");
    return;
  }
  sign();
});

//登入api
function login() {
  axios
    .post(`${url}/users/sign_in`, obj)
    .then((res) => {
      // console.log(res);
      token = res.headers.authorization;
      nickname = res.data.nickname;
      localStorage.setItem("userToken", token);
      localStorage.setItem("userNickname", nickname);
      loginBtn.setAttribute("href", "./todo.html");
      // 用來直接跳轉，不需要再點擊一次
      loginBtn.click();
    })
    .catch((err) => {
      console.log(obj);
    });
}

// 當點擊login按鈕時...
loginBtn.addEventListener("click", () => {
  obj.user.email = email.value;
  obj.user.password = password.value;
  console.log(obj);
  login();
  email.value = "";
  nickName.value = "";
  password.value = "";
});
