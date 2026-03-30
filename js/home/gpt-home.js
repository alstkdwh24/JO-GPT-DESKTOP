// 모든 로직을 하나의 DOMContentLoaded 내에 작성하여 스코프 문제를 해결합니다.

document.addEventListener('DOMContentLoaded', () => {
    const initApp = () => {
        // socialJoin- 으로 시작하는 클래스를 가진 모든 버튼 선택
        const socialButtons = document.querySelectorAll('.modelJoinSocial > div[class^="socialJoin-"]');
        console.log("1213444");
        socialButtons.forEach(button => {
            button.addEventListener('click', () => {
                const url = button.getAttribute('data-url');
                if (url) {
                    // window.electronAPI가 정상적으로 로드되었는지 확인 후 실행
                    if (window && window.electronAPI && typeof window.electronAPI.openExternal === 'function') {
                        window.electronAPI.openExternal(url);
                    } else {
                        console.error("Electron API (openExternal)를 사용할 수 없습니다.");
                        // 브라우저 환경을 대비한 폴백 (필요 시)
                        // window.open(url, '_blank');
                    }
                }
            });
        });
    }
    initApp();
    // 1. 사용자 정보 불러오기 함수 정의
    function fetchMyInfo() {
        const token = localStorage.getItem('ACCESS_TOKEN');

        // 토큰이 없으면 서버에 요청하지 않음
        if (!token) {
            console.log("로그인 토큰이 없습니다.");
            return;
        }

        $.ajax({
            method: 'GET',
            url: 'http://localhost:8086/login/myInfo',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                console.log("사용자 정보 로드 성공:", response);
                // UI 업데이트
                if (document.getElementById('userName')) document.getElementById('userName').textContent = response.name;
                if (document.getElementById('userNameDisplay')) document.getElementById('userNameDisplay').textContent = response.name;

                document.getElementById('authButtons').style.display = 'none';
                document.getElementById('userProfile').style.display = 'flex';
            },
            error: function (error) {
                console.error('내 정보 불러오기 실패:', error);
                document.getElementById('authButtons').style.display = 'flex';
                document.getElementById('userProfile').style.display = 'none';
                // 토큰이 유효하지 않은 경우 삭제 (선택 사항)
                // localStorage.removeItem('ACCESS_TOKEN');
            }
        });
    }

    // 2. Electron 인증 성공 리스너 설정
    if (window.electronAPI && window.electronAPI.onAuthSuccess) {
        window.electronAPI.onAuthSuccess((token) => {
            if (token) {
                console.log(">>> [Success] 메인 프로세스로부터 토큰 수신:", token);
                localStorage.setItem('ACCESS_TOKEN', token);

                // 토큰 수신 직후 정보 갱신
                fetchMyInfo();

                alert('로그인이 완료되었습니다.');
                const loginModal = document.querySelector('.modelLogin');
                if (loginModal) {
                    loginModal.style.display = 'none';
                }
            }
        });
    }

    // 3. 페이지 초기 로드 시 기존 로그인 상태 확인
    fetchMyInfo();
});