document.addEventListener('DOMContentLoaded', () => {
    console.log("chatTing.js");
    let content = document.querySelector('.content');
    const chatTing = document.querySelector('.chatTing');
    // 차이는 한 즐로 말하자면 Promise(미완료 작업) vs 실제 결과값 (Response/문자열) 입니다.
    // fetch() 함수는 Promise를 반환합니다.
    // Promise는 미래의 결과값을 나타내는 객체입니다.
    // Promise는 미래의 결과값을 나타내는 객체입니다.

    // await 키워드는 Promise가 완료될 때까지 대기합니다.
    // 결과를 확인 가능합니다.

    // 왜냐하면 fetch() 함수는 비동기 작업을 수행하기 때문입니다.
    // 비동기 작업은 작업이 완료되기 전에 다음 코드 수행 가능

    chatTing.addEventListener('click', async () => {
        const response = await fetch('./chatTing.html');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        content.innerHTML = await response.text();
        content.style.display = "flex";
        content.style.flexDirection = "row";
        content.style.justifyContent = "center";
        console.log("chattingList {}",localStorage.getItem('ACCESS_TOKEN'));
        fetch(CONFIG.API_CONTENTS_URL + '/contents/chattingList', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('ACCESS_TOKEN')
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("dataList", data);
            })
            .catch(err => {
                console.error('에러:', err);
            });
        const searchList = [{
            title: "내 물음", contents: "이것을 물어봄", image: "image/Gemini_chat.png"
        }, {
            title: "내 물음", contents: "이것을 물어봄", image: "image/Gemini_chat.png"
        }, {
            title: "내 물음", contents: "이것을 물어봄", image: "image/Gemini_chat.png"
        },

        ];
        for (let i = 0; i < searchList.length; i++) {
            const chattingList = document.getElementById('chatting-list');
            const chattingListContainer = document.createElement('div');
            chattingListContainer.classList.add('chatting-list-container');
            chattingList.appendChild(chattingListContainer);
            const img = document.createElement('img');
            img.classList.add('chatting-icon');
            img.src = searchList[i].image;
            chattingListContainer.appendChild(img);
            const chattingListTitle = document.createElement('div');
            chattingListTitle.classList.add('chatting-list-word');
            chattingListContainer.appendChild(chattingListTitle);
            const chattingListTitleText = document.createTextNode(searchList[i].title);
            chattingListTitle.appendChild(chattingListTitleText);
            const chattingListContents = document.createElement('div');
            chattingListContents.classList.add('chatting-list-time');
            chattingListTitle.appendChild(chattingListContents);
            const chattingListContentsTime = document.createElement("i");
            chattingListContentsTime.classList.add('fa', 'fa-clock-o', "chatting-list-time-icon");
            chattingListContents.appendChild(chattingListContentsTime);
            const chattingListContentsTimeText = document.createElement("span");
            chattingListContentsTimeText.classList.add('chatting-list-time-text');
            chattingListContentsTimeText.textContent = "오전 10:00";
            chattingListContents.appendChild(chattingListContentsTimeText);

            console.log(chattingList);

        }


        // 검색 입력창 Enter키 검색 + Tab키 다음 칸 이동
        const searchInput = content.querySelector('#search-chatting-input');
        if (searchInput) {
            // 자동 높이 조절
            /*자동 높이 조절 시킴*/
            searchInput.addEventListener('input', () => {
                searchInput.style.height = 'auto';
                searchInput.style.height = searchInput.scrollHeight + 'px';
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const query = searchInput.value.trim();
                    if (query) {
                        console.log('검색:', query);
                        // TODO: 검색 로직 구현
                    }
                }
            });
        }
    });
// 현재: 30줄짜리 createElement 지옥
// 실무 버전:
    function createChatItem(item) {
        const div = document.createElement('div');
        div.classList.add('chatting-list-container');
        div.innerHTML = `
        <img class="chatting-icon" src="${item.image}" alt="">
        <div class="chatting-list-word">
            ${item.title}
            <div class="chatting-list-time">
                <i class="fa fa-clock-o chatting-list-time-icon"></i>
                <span class="chatting-list-time-text">${item.time || '오전 10:00'}</span>
            </div>
        </div>
    `;
        return div;
    }

});