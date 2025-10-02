# 다음 개선 사항 (notificationSystem.ts)

현재까지 완료한 리팩토링이 훌륭합니다!
다음 단계로 3가지 개선 사항이 남아있습니다.

## ✅ 완료된 작업

1. **Template Method 패턴으로 공통 알고리즘 추출**
   - `handleNotification` 메서드로 중복 제거
   - 검증 → 전송 → 재시도 → 로깅 흐름을 한 곳에서 관리

2. **Registry 패턴으로 핸들러 관리**
   - if-else 체인 제거
   - `handlerRegistry` 객체로 핸들러 매핑
   - 새 알림 타입 추가가 쉬워짐

3. **Copy-paste 버그 수정**
   - 변수명 오타, 타입 불일치 등 체계적으로 수정

---

## 🎯 남은 개선 사항 (난이도 순)

### 1. 설정 값 외부화 ⭐ (가장 쉬움, 추천!)

**현재 문제:**
```typescript
// handleNotification 메서드 (129번 줄)
result = this.retryNotify(sendFn, 3, notificationType);  // 3이 하드코딩
```

**목표:**
- 재시도 횟수를 설정으로 관리
- 알림 타입별 다른 설정 가능
- 환경별(개발/운영) 설정 변경 가능

**구현 방향:**
```typescript
interface NotificationConfig {
    maxRetries: number;
    timeout?: number;
}

export class NotificationService {
    constructor(private config: NotificationConfig = { maxRetries: 3 }) {}

    // 사용
    result = this.retryNotify(sendFn, this.config.maxRetries, notificationType);
}
```

**예상 소요 시간:** 10-15분

---

### 2. 로깅 전략 분리 ⭐⭐ (중간)

**현재 문제:**
```typescript
// handleNotification 메서드 내부
console.log(`Sending ${notificationType}...`);
console.log(`${notificationType} sent successfully`);
console.log(`${notificationType} sent failed`);
```

- 로깅이 비즈니스 로직에 섞여있음
- 테스트 시 console.log 출력됨
- 프로덕션에서 파일 로깅, 모니터링 툴 연동 불가

**목표:**
- Logger 인터페이스 정의
- 의존성 주입으로 교체 가능하게
- 테스트용 Logger (아무것도 안 함) vs 프로덕션용 Logger

**구현 방향:**
```typescript
interface Logger {
    info(message: string): void;
    error(message: string): void;
}

class ConsoleLogger implements Logger {
    info(message: string) { console.log(message); }
    error(message: string) { console.error(message); }
}

class SilentLogger implements Logger {
    info(message: string) {}
    error(message: string) {}
}

export class NotificationService {
    constructor(
        private config: NotificationConfig,
        private logger: Logger = new ConsoleLogger()
    ) {}

    // 사용
    this.logger.info(`Sending ${notificationType}...`);
}
```

**학습 포인트:**
- Dependency Injection (의존성 주입)
- Interface Segregation (인터페이스 분리)
- Test Double (테스트 더블) 개념

**예상 소요 시간:** 20-30분

---

### 3. 에러 처리 개선 (Result 타입) ⭐⭐⭐ (고급)

**현재 문제:**
```typescript
return false;  // 왜 실패했는지 알 수 없음
```

- boolean만 반환 → 실패 이유를 알 수 없음
- 에러 메시지가 console.log로만 출력
- 호출하는 쪽에서 적절한 에러 처리 불가

**목표:**
- 성공/실패 + 상세 정보를 함께 반환
- 타입 안전한 에러 처리
- 함수형 에러 처리 패턴 학습

**구현 방향:**
```typescript
type Result<T, E = string> =
    | { success: true; value: T }
    | { success: false; error: E };

// 사용 예시
function sendNotification(...): Result<void, NotificationError> {
    const user = this.getUserById(userId);
    if (!user) {
        return { success: false, error: 'USER_NOT_FOUND' };
    }

    const handler = this.handlerRegistry[type as Notification];
    if (!handler) {
        return { success: false, error: 'UNKNOWN_NOTIFICATION_TYPE' };
    }

    const result = handler(user, message, userPreferences);
    return result
        ? { success: true, value: undefined }
        : { success: false, error: 'NOTIFICATION_SEND_FAILED' };
}

// 호출하는 쪽
const result = service.sendNotification(...);
if (!result.success) {
    console.error(`Failed: ${result.error}`);
} else {
    console.log('Success!');
}
```

**학습 포인트:**
- Discriminated Unions (판별 유니온)
- Result/Either 타입 (함수형 프로그래밍)
- Railway-Oriented Programming

**예상 소요 시간:** 30-40분

---

## 📝 내일 시작 가이드

### 추천 순서

1. **설정 외부화** (10-15분)
   - 가장 쉽고 바로 효과 볼 수 있음
   - Dependency Injection의 기초

2. **로깅 분리** (20-30분)
   - 실무에서 자주 사용하는 패턴
   - 테스트 작성 연습 기회

3. **Result 타입** (30-40분)
   - 고급 개념이지만 현대적인 패턴
   - 시간 있을 때 도전!

### 시작 명령어

멘토에게 이렇게 말하면 됩니다:

```
"안녕! 어제 notificationSystem.ts 리팩토링 이어서 하고싶어.
NEXT_STEPS.md 파일 봤는데, [설정 외부화/로깅 분리/Result 타입]
중에서 [선택한 것]부터 시작하고 싶어."
```

---

## 🎯 학습 목표

각 개선을 통해 배울 내용:

- **설정 외부화**: 하드코딩 제거, 유연성 확보
- **로깅 분리**: Dependency Injection, 관심사 분리
- **Result 타입**: 함수형 에러 처리, 타입 안전성

---

## 💡 추가 참고사항

### 현재 코드 구조
```
notificationSystem.ts (171줄)
├── NotificationService 클래스
│   ├── handlerRegistry (Registry 패턴)
│   ├── sendNotification (라우팅)
│   ├── emailHandler, smsHandler, pushHandler (팩토리)
│   ├── handleNotification (Template Method)
│   └── retryNotify (고차 함수)
└── 타입 정의들
```

### 다음 개선 후 예상 구조
```
notificationSystem.ts
├── 타입 정의 (Result, Logger 등)
├── Logger 구현들 (ConsoleLogger, SilentLogger)
├── NotificationConfig 인터페이스
└── NotificationService 클래스 (설정/로거 주입)
```

화이팅! 🚀
