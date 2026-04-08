
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

    textarea.style.height = 'auto'; // 높이 초기화 추가
    myGemini.style.gap = '1rem';
    myGemini.style.height = '100%';
    myGemini.style.width = '44rem';
    myGemini.style.display = 'flex';
    myGemini.style.flexDirection = 'column';
    myGemini.style.justifyContent = 'flex-start';

    realContent.style.alignItems = "center";
    textarea.focus(); // 전송 후 다시 포커스
    realBoxFont.textContent = "";
    const myContents = textarea.value;
    //말풍선 생성
    MyContents(myContents);
    textarea.value = "";
    try {

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

    } catch (error) {

    }
}

//내 대화를 말풍선으로 보여주기 위한
function MyContents(myContents) {
    const myGeminiTalk = document.querySelector('.my-gemini-talk');
    const div = document.createElement('div');
    div.classList.add('myContents');
    console.log("myContent {}", myContents);

    div.innerHTML = "<div id='myContent-myContent'><div id='realMyContent'>" + myContents + "</div></div>"

    return myGeminiTalk.appendChild(div);
}

//gpt 대화를 말품선으로 보여주기 위한
function GPTContents(gptContents) {
    const gptGeminiTalk = document.querySelector('.my-gemini-talk');
    const div = document.createElement('div');
    div.classList.add('gptContents');
    console.log("myContent {}", gptContents);
    const htmlContent = marked.parse(gptContents);

    div.innerHTML = "<div id='geminiContent-geminiContent'> <div id='realGeminiContent'>" + htmlContent + "</div></div>"
    return gptGeminiTalk.appendChild(div);
}

function showLoading() {
    const myGeminiTalk = document.querySelector('.my-gemini-talk');
    const div = document.createElement('div');

    div.classList.add('loading');
    div.id = 'start-loading';
    div.innerHTML = `
        <div id='geminiContent-geminiContent'>
            <div class='loading-dots'>
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    myGeminiTalk.appendChild(div);
    // 자동 스크롤
    div.scrollIntoView({behavior: 'smooth'});
}

function hideLoading() {
    const loading=document.getElementById('start-loading');
    if (loading) {
        loading.remove();
    }
}
