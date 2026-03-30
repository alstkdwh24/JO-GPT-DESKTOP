const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // 외부 브라우저로 링크 열기
    openExternal: (url) => shell.openExternal(url),

    // 기존 함수들
    sendMessage: (message) => ipcRenderer.send('message', message),
    onUpdate: (callback) => ipcRenderer.on('update', (event, ...args) => callback(...args)),

    // 인증 성공 리스너 (필요 시)
    onAuthSuccess: (callback) => ipcRenderer.on('auth-success', (event, token) => callback(token))
});