const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // 외부 브라우저로 링크 열기
    openExternal: (url) => shell.openExternal(url),

    // 기존 함수들
    sendMessage: (message) => ipcRenderer.send('message', message),
    onUpdate: (callback) => ipcRenderer.on('update', (event, ...args) => callback(...args)),

    // 인증 성공 리스너 (필요 시)
    onAuthSuccess: (callback) => ipcRenderer.on('auth-success', (event, token) => callback(token)),

    // [추가] 세션 삭제를 위한 API 등록
    clearSession: () => ipcRenderer.send('clear-session'),

    // ==========================================
    // [추가해야 할 부분] 자동 로그인 관련 API
    // ==========================================
    saveToken: (token) => ipcRenderer.invoke('save-token', token),
    getToken: () => ipcRenderer.invoke('get-token'),
    onSessionCleared: (callback) => ipcRenderer.on('session-cleared', (event, value) => callback(value))
});