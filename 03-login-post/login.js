const users = [
  {
    id: 1,
    username: "johndoe",
    email: "johndoe@example.com",
    password: "1234",
    age: 28,
    isAdmin: false
  },
  {
    id: 2,
    username: "janedoe",
    email: "janedoe@example.com",
    password: "abcd",
    age: 32,
    isAdmin: true
  },
  {
    id: 3,
    username: "coolkid",
    email: "coolkid99@example.com",
    password: "cool123",
    age: 19,
    isAdmin: false
  },
  {
    id: 4,
    username: "adminmaster",
    email: "admin@example.com",
    password: "adminpass",
    age: 41,
    isAdmin: true
  },
  {
    id: 5,
    username: "guestuser",
    email: "guest@example.com",
    password: "guest",
    age: 25,
    isAdmin: false
  }
];



// localStorage저장
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify(users));
}

// 로그인
document.querySelector(".form").addEventListener("submit", function (e) {
  e.preventDefault();

  const usernameInput = document.getElementById("username").value.trim();
  const passwordInput = document.getElementById("password").value.trim();

  const storedUsers = JSON.parse(localStorage.getItem("users"));

  const foundUser = storedUsers.find(
    (user) => user.username === usernameInput && user.password === passwordInput
  );

  if (foundUser) {
    alert(`로그인 성공! ${foundUser.username}님 환영합니다.`);
      sessionStorage.setItem("loggedInUser", JSON.stringify(foundUser));
      location.href="./post.html"
  } else {
    alert("로그인 실패! 아이디 또는 비밀번호가 틀렸습니다.");
  }
});

