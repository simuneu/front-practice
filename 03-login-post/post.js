const username = document.getElementById('username');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  const submitBrn = document.getElementById('submit');
  const messageList = document.getElementById('messageList');
 
  submitForm=(event)=>{
    event.preventDefault();
  
    const li = document.createElement('li');
    li.classList='list-group-item d-flex justify-content-between align-items-center';
    li.textContent=`${username.value} - ${email.value} : ${message.value}`

    const delBtn= document.createElement('button');
        delBtn.textContent='삭제';
        delBtn.classList='btn btn-primary'
        // delBtn.style.marginLeft = '10px'; 
        delBtn.onclick=()=>{
        li.remove();
    }
    const textSpan = document.createElement('span');
    
    // li.append(delBtn);
    li.appendChild(textSpan); 
    li.appendChild(delBtn);  
    messageList.appendChild(li);
    
    document.getElementById('message').value = '';
  }

  clearForm=(event)=>{
    const messageList =  document.getElementById('messageList');
    messageList.innerHTML='';
  }

   window.addEventListener("DOMContentLoaded", () => {
    const userData = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (userData) {
      document.getElementById("username").value = userData.username;
      document.getElementById("email").value = userData.email;

      //유저 입력창 비활성화
      document.getElementById("username").readOnly = true;
      document.getElementById("email").readOnly = true;
    } else {
      alert("로그인 정보가 없습니다. 로그인 페이지로 이동합니다.");
      window.location.href = "./login.html";
    }
  });