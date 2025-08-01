# GPT JSON to HTML Converter

ChatGPT '대화 내보내기'로 가져온 zip 파일을 아름다운 HTML로 변환하는 웹 애플리케이션입니다.

## 🔒 서버리스 아키텍처의 장점

이 애플리케이션은 백엔드 서버가 필요 없는 완전한 클라이언트 사이드 솔루션입니다:

- **🔐 개인정보 보호**: 모든 데이터 처리가 사용자의 브라우저에서만 이루어지므로 대화 내용이 외부 서버로 전송되지 않습니다
- **⚡ 즉시 사용 가능**: 서버 설정이나 API 키 없이 웹사이트에 접속하는 즉시 사용할 수 있습니다
- **💰 무료 운영**: 서버 비용이 발생하지 않아 완전 무료로 서비스를 제공할 수 있습니다
- **🌐 오프라인 사용**: 한 번 로드된 후에는 인터넷 연결 없이도 파일 변환이 가능합니다
- **🚀 빠른 처리 속도**: 네트워크 지연 없이 로컬에서 즉시 처리됩니다

## 🌟 주요 기능

- **ChatGPT 대화 변환**: OpenAI에서 내보낸 JSON 파일을 읽어 HTML로 변환
- **드래그 앤 드롭**: 파일을 드래그하여 간편하게 업로드
- **다크 모드 지원**: 라이트/다크 테마 전환 가능
- **다국어 지원**: 한국어/영어 언어 전환
- **코드 하이라이팅**: 대화 내 코드 블록을 구문 강조하여 표시
- **이미지 지원**: 대화에 포함된 이미지 자동 추출 및 표시
- **ZIP 다운로드**: 변환된 HTML과 리소스를 ZIP 파일로 다운로드

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0 이상
- Yarn 4.0 이상

### 설치

```bash
# 저장소 클론
git clone https://github.com/Jar0511/gpt-json-to-html.git
cd gpt-json-to-html

# 의존성 설치
yarn install
```

### 개발 서버 실행

```bash
yarn dev
```

브라우저에서 http://localhost:5173 으로 접속하세요.

### 프로덕션 빌드

```bash
yarn build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

## 📁 프로젝트 구조

```
├── src/
│   ├── components/        # React 컴포넌트
│   ├── contexts/         # React Context (테마, 언어 설정)
│   ├── i18n/            # 다국어 설정
│   ├── services/        # 비즈니스 로직 (파일 처리, HTML 생성)
│   ├── types/           # TypeScript 타입 정의
│   ├── utils/           # 유틸리티 함수
│   └── App.tsx          # 메인 애플리케이션
├── public/              # 정적 리소스
└── template/           # HTML 템플릿 파일
```

## 🛠️ 기술 스택

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Code Highlighting**: Highlight.js
- **Internationalization**: react-i18next
- **Archive**: JSZip
- **Package Manager**: Yarn PnP

## 📝 사용 방법

1. ChatGPT 설정에서 대화 내보내기를 선택하여 JSON 파일을 다운로드합니다.
2. 웹사이트에 접속하여 JSON 파일을 드래그 앤 드롭하거나 파일 선택 버튼을 클릭합니다.
3. 변환이 완료되면 ZIP 파일로 다운로드됩니다.
4. ZIP 파일을 압축 해제하고 `index.html`을 브라우저에서 열어보세요.

## 🎨 변환된 HTML 특징

- 반응형 디자인으로 모바일에서도 잘 보입니다.
- 대화 별로 개별 HTML 파일로 분리됩니다.
- 코드 블록은 구문 강조되어 가독성이 높습니다.
- 다크 모드를 지원합니다.
- 대화에 포함된 이미지가 자동으로 추출됩니다.

## 🤝 기여하기

버그 리포트, 기능 제안, 풀 리퀘스트를 환영합니다!

1. 프로젝트를 Fork 합니다.
2. 새 브랜치를 생성합니다. (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다. (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 Push 합니다. (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🔗 링크

- [라이브 데모 (Vercel)](https://gpt-json-to-html.vercel.app/)
- [이슈 트래커](https://github.com/Jar0511/gpt-json-to-html/issues)
