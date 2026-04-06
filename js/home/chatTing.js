document.addEventListener('DOMContentLoaded', () => {
    console.log("chatTing.js");
    let content = document.querySelector('.content');
    const sideBarImgTwo = document.querySelector('.sideBarImgTwo');
    // 차이는 한 즐로 말하자면 Promise(미완료 작업) vs 실제 결과값 (Response/문자열) 입니다.
    // fetch() 함수는 Promise를 반환합니다.
    // Promise는 미래의 결과값을 나타내는 객체입니다.
    // Promise는 미래의 결과값을 나타내는 객체입니다.

    // await 키워드는 Promise가 완료될 때까지 대기합니다.
    // 결과를 확인 가능합니다.

    // 왜냐하면 fetch() 함수는 비동기 작업을 수행하기 때문입니다.
    // 비동기 작업은 작업이 완료되기 전에 다음 코드 수행 가능

    sideBarImgTwo.addEventListener('click', async () => {
        const response = await fetch('./chatTing.html');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const html = await response.text();

        content.innerHTML = html;
        content.style.display = "flex";
        content.style.flexDirection = "row";
        content.style.justifyContent = "center";
    });


});