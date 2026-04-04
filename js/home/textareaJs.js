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
        if(event.keyCode === 13) {
            event.preventDefault();
            sendContents();
        }
    })
});

function sendContents() {

    let textarea = document.querySelector('.fake-input');
    let realContent= document.querySelector('.realContent');
 let realBoxFont= document.querySelector('.realBoxFont');
    let gptContents = textarea.value
    console.log(textarea.value);
    let token = localStorage.getItem('ACCESS_TOKEN');

    try {

/*db에 대화내용 저장*/
            $.ajax({
                method: 'POST',
                url: 'http://localhost:8082/contents/myContents',
                headers: { Authorization: 'Bearer ' + token },
                data: JSON.stringify({myChatContents: gptContents}),
                contentType: 'application/json',
                success: function (response) {
                    console.log("반응" + response);
                    textarea.value = "";
                    textarea.style.height = 'auto'; // 높이 초기화 추가
                    textarea.focus(); // 전송 후 다시 포커스
                    realContent.style.alignItems = "flex-end";
                    realBoxFont.textContent="";

                 /*gpt 대화 누적을 위한 */
                    $.ajax({
                        method: 'GET',
                        url: 'http://localhost:8086/gptApi/gptContents',
                        success: function (response) {
                            console.log(response);
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