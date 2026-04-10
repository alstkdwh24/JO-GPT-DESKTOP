document.addEventListener('DOMContentLoaded', () => {

    console.log(CONFIG.CUSTOM_SCHEME);
    /*textarea 내용 전송*/
    let textarea = document.querySelector('.fake-input');
    if (textarea) {
        textarea.focus();
    }
    let searchBtn = document.querySelector('.search-real');
    searchBtn.onclick = (event) => {
        sendContents();
    }
    textarea.addEventListener("keydown", (event) => {
        if (event.key === "enter") {
            event.preventDefault();
            sendContents();
        }
    })
});


function sendContents() {

    let textarea = document.querySelector('.fake-input');
    let realContent = document.querySelector('.realContent');
    let realBoxFont = document.querySelector('.realBoxFont');
    const myGemini = document.querySelector(".my-gemini-talk")
    let gptContents = textarea.value
    console.log(textarea.value);
    let token = localStorage.getItem('ACCESS_TOKEN');
    let realBox = document.querySelector('.realBox');

    if (token != null) {
        textarea.style.height = 'auto'; // 높이 초기화 추가
        myGemini.style.gap = '1rem';
        myGemini.style.height = '80%';
        myGemini.style.width = '44rem';
        myGemini.style.display = 'flex';
        myGemini.style.flexDirection = 'column';
        myGemini.style.justifyContent = 'flex-start';
        realBox.style.display = 'flex';
        realBox.style.alignItems = 'center';
        realBox.style.justifyContent = 'center';
        realBox.style.minHeight = '1rem';
        realBoxFont.style.display = "none";
        realBoxFont.style.height = '0px';
        textarea.focus(); // 전송 후 다시 포커스
        realBoxFont.textContent = "";
        const myContents = textarea.value;
        //말풍선 생성
        MyContents(myContents);
        textarea.value = "";

        sendContentsAjax(myContents);


    } else {
        alert("로그인 후 이용해주세요");

    }
}

//내 대화를 말풍선으로 보여주기 위한
function MyContents(myContents) {
    const myGeminiTalk = document.querySelector('.my-gemini-talk');
    const tpl = document.getElementById('tpl-my-content');
    const clone = tpl.content.cloneNode(true);
    clone.querySelector('#realMyContent').textContent = myContents; // ✅ XSS 안전    console.log("myContent {}", myContents);
    myGeminiTalk.appendChild(clone);

}

//gpt 대화를 말품선으로 보여주기 위한
function GPTContents(gptContents) {
    const gptGeminiTalk = document.querySelector('.my-gemini-talk');
    const tpl = document.getElementById('tpl-gpt-content');
    //template 요소의 content를 복제하여 새로운 노드 생성
    const clone = tpl.content.cloneNode(true)

    //DOMPurity는 xss(크로스 사이트 스크립팅) 공격을 방지하기 위한 HTML 새니타이저 라이브러리입니다. 쉽게 말해 악성 스크립트를 제거해주는 도구 입니다.
    clone.querySelector('#realGeminiContent').innerHTML = DOMPurify.sanitize(marked.parse(gptContents)) // 마크다운은 innerHTML 필요

    gptGeminiTalk.appendChild(clone);
}

/*로딩 보여주기*/
function showLoading() {
    const myGeminiTalk = document.querySelector('.my-gemini-talk');
    const tpl = document.getElementById('tpl-loading');
    const clone = tpl.content.cloneNode(true);
    myGeminiTalk.appendChild(clone);
    document.getElementById('start-loading').scrollIntoView({behavior: 'smooth'});
}

/*로딩 제거*/
function hideLoading() {
    const loading = document.getElementById('start-loading');
    if (loading) {
        loading.remove();
    }
}

/*ajax 연속 코드 가독성 살린 것 내가 쓴 메시지 보내고 gpt응답받는 코드*/
async function sendContentsAjax(myContents) {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (!token) {
        alert("로그인 후 이용해주세요");
        return;
    }

    try {
        await fetch(CONFIG.API_CONTENTS_URL + '/contents/myContents', {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({myChatContents: myContents})
        });

        showLoading();

        const response = await fetch(CONFIG.API_CONTENTS_URL + '/contents/gptContents', {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({myChatContents: myContents})
        });
        const data = await response.json(); // 본문을 JSON으로 파씽을 해야됨
        // 1. 먼저 필요한 데이터를 꺼냄
        const gptText = data.candidates[0].content.parts[0].text;
        console.log(gptText);
        GPTContents(gptText);
        // 3. 채팅방 생성
        await fetch(CONFIG.API_CONTENTS_URL + '/contents/chatRoom', {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({myChatContents: myContents})
        })
        hideLoading();
    } catch (e) {
        hideLoading();
        console.error(e);
    }
}