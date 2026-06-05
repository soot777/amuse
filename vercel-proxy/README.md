# Blog AI - Vercel 프록시 서버

## 배포 방법

### 1. GitHub에 올리기
1. github.com → 새 저장소 만들기 (이름: blog-ai-proxy)
2. 이 폴더 안의 파일 2개 업로드:
   - api/claude.js
   - vercel.json

### 2. Vercel에 연결
1. vercel.com 로그인
2. "Add New Project" → GitHub 저장소 선택 (blog-ai-proxy)
3. "Deploy" 클릭

### 3. 환경변수 설정 (API 키)
1. Vercel 대시보드 → 내 프로젝트 → Settings
2. Environment Variables → Add
3. Name: ANTHROPIC_API_KEY
4. Value: sk-ant-api03-... (본인 API 키)
5. Save → Redeploy

### 4. 프록시 주소 확인
배포 완료되면 이런 주소가 생성됩니다:
https://blog-ai-proxy.vercel.app/api/claude

### 5. HTML 파일 수정
카페24에 올린 HTML 파일들에서 API 주소를 위 주소로 변경:
fetch('./claude-proxy.php') 
→ fetch('https://blog-ai-proxy.vercel.app/api/claude')
