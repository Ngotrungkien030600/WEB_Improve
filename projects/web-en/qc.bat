@echo off
title Quinn QC — SkillForge Tester
cd /d "%~dp0"

if "%1"=="" (
  echo.
  echo  === Quinn QC — Kỹ sư Kiểm thử SkillForge ===
  echo.
  echo  Cach dung:
  echo    qc "cau hoi/yeu cau test cua ban"
  echo.
  echo  Vi du:
  echo    qc "hay test trang home cho toi"
  echo    qc "kiem tra feature BMAD agents"
  echo    qc "tim bug trong module English"
  echo.
  pause
  exit /b
)

echo.
echo  === Goi Quinn QC ===
echo.

node -e "
const http = require('http');
const q = process.argv[1];
const data = JSON.stringify({
  agentIds: ['quinn'],
  messages: { quinn: [{ role: 'user', content: q }] }
});
const opts = {
  hostname: 'localhost', port: 8080, path: '/api/bmad/chat', method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
};
const req = http.request(opts, res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      if (parsed.replies && parsed.replies[0]) {
        const r = parsed.replies[0];
        const text = r.text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1');
        console.log('\n' + r.icon + ' ' + r.name + ':');
        console.log('  ' + text.split('\n').join('\n  '));
      } else if (parsed.error) {
        console.log('\n❌ ' + parsed.error);
      }
    } catch(e) { console.log('\n❌ Parse loi:', e.message); }
  });
});
req.on('error', () => { console.log('\n❌ Server chua chay! Hay mo app truoc.'); });
req.write(data);
req.end();
" "%~1"

echo.
pause
