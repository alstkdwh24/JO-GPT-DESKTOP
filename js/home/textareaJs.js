document.addEventListener('DOMContentLoaded', () => {

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
        if (event.keyCode === 13) {
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
        /*db에 대화내용 저장*/
        $.ajax({
            method: 'POST',
            url: 'http://localhost:8082/contents/myContents',
            headers: {Authorization: 'Bearer ' + token},
            data: JSON.stringify({myChatContents: gptContents}),
            contentType: 'application/json',
            success: function (response) {
                console.log(response);

                // GPT 요청 전에 로딩 애니메이션 표시
                showLoading();
                /*gpt 대화 누적을 위한 */
                $.ajax({
                    method: 'POST',
                    url: 'http://localhost:8082/contents/gptContents',
                    headers: {Authorization: 'Bearer ' + token},
                    data: JSON.stringify({myChatContents: gptContents}),
                    contentType: 'application/json',
                    dataType: 'json',  // ← 추가! jQuery가 자동으로 JSON.parse 해줌
                    success: function (response) {

                        /*로딩 애니메이션 제거*/
                        hideLoading();
                        // 1. 먼저 필요한 데이터를 꺼냄
                        const gptText = response.candidates[0].content.parts[0].text;
                        console.log(gptText);
                        GPTContents(gptText);
                        /*채팅방 만들기 ajax*/
                        $.ajax({
                            method: 'POST',
                            url: "http://localhost:8082/contents/chatRoom",
                            headers: {
                                'Authorization': 'Bearer ' + token
                            },
                        }).done(function () {
                        })
                    }, error: function (error) {
                        // ★ 에러 시에도 로딩 제거
                        hideLoading();
                        console.error('GPT 응답 에러:', error);
                    }
                })
            },
            error: function (error) {
                console.error('Error fetching myContents:', error);
            }
        })

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
    clone.querySelector('#realGeminiContent').innerHTML = marked.parse(gptContents); // 마크다운은 innerHTML 필요

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
