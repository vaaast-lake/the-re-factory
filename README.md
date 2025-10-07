# 🎓 TypeScript 리팩토링 실습 프로젝트

**실무 시나리오 기반 리팩토링 학습**: 코드 스멜 발견부터

디자인 패턴 적용까지

---

## 📖 목차

- [프로젝트 소개](#-프로젝트-소개)
- [학습 목표](#-학습-목표)
- [프로젝트 철학](#-프로젝트-철학)
- [전체 학습 내용](#-전체-학습-내용)
- [파일별 상세 학습](#-파일별-상세-학습)
- [handler.ts - Todo 관리 시스템](#1-handlerts---todo-관리-시스템)
- [payment.ts - 결제 처리 시스템](#2-paymentts---결제-처리-시스템)
- [userManager.ts - 사용자 관리 시스템](#3-usermanagerts---사용자-관리-시스템)
- [notificationSystem.ts - 알림 시스템](#4-notificationsystemts---알림-시스템)
- [핵심 학습 패턴](#-핵심-학습-패턴)
- [다음 단계](#-다음-단계)

---

## 🎯 프로젝트 소개

이 프로젝트는 **레거시 코드를 리팩토링하는 과정**을 통해 클린 코드 작성 능력과 설계 원칙 이해를 향상시키기 위한 학습 저장소입니다.

### 특징

- 🧑‍💻 **실전 시나리오**: 발생 가능한 상황을 기반으로 한 코드
- 📚 **점진적 학습**: 기초부터 고급까지 단계별 난이도 설정
- 🎨 **패턴 중심**: 디자인 패턴과 리팩토링 기법 적용
- 💡 **원칙 이해**: SOLID, DRY, YAGNI 등 설계 원칙 적용
- 🔍 **코드 스멜 탐지**: 문제 있는 코드를 발견하고 개선하는 훈련

---

## 🎓 학습 목표

### 1. 코드 스멜 식별 능력 향상

- Long Method, Duplicate Code, Switch Statements 등 다양한 코드 스멜 인식
- 코드의 문제점을 빠르게 파악하는 안목 기르기

### 2. 리팩토링 기법 적용

- Extract Method, Replace Conditional with Polymorphism 등의 기법
- 안전한 리팩토링 프로세스 체득

### 3. 디자인 패턴 활용

- Strategy, Template Method, Registry 등 실용적 패턴 학습
- 패턴의 적용 시점과 트레이드오프 이해

### 4. TypeScript 타입 시스템 심화

- Discriminated Union, Type Guard, Control Flow Analysis 등
- 타입 안전성을 활용한 버그 예방

### 5. 설계 원칙 내재화

- SOLID 원칙의 적용
- Composition over Inheritance
- Separation of Concerns

---

## 📊 전체 학습 내용

### 주요 코드 스멜 (발견 및 해결)

| 코드 스멜 | 설명 | 적용 파일 |
|---------|------|----------|
| **Long Method** | 너무 긴 함수, 여러 책임 혼재 | handler, payment, userManager, notificationSystem |
| **Duplicate Code** | 반복되는 로직과 패턴 | handler, payment, userManager, notificationSystem |
| **Switch Statements** | if-else 체인, 조건문 남용 | handler, payment, userManager |
| **Primitive Obsession** | 원시 타입 남용, 타입 안정성 부족 | payment, userManager |
| **Shotgun Surgery** | 하나의 변경이 여러 곳 수정 유발 | handler |
| **Feature Envy** | 다른 객체의 데이터에 과도한 접근 | - |
| **Arrow Anti-pattern** | 깊은 중첩 구조 | notificationSystem |

### 핵심 리팩토링 기법

| 기법 | 설명 | 적용 파일 |
|-----|------|----------|
| **Extract Method** | 긴 함수를 작은 단위로 분리 | handler, payment, userManager, notificationSystem |
| **Extract Function** | 중복 로직을 별도 함수로 추출 | handler, payment, userManager, notificationSystem |
| **Replace Conditional with Polymorphism** | 조건문을 객체/함수로 대체 | handler, payment, userManager, notificationSystem |
| **Rename Variable** | 명확한 이름으로 변경 | handler |
| **Introduce Type Predicate** | 타입 가드 함수 구현 | payment |
| **Extract Type** | 타입 정의로 안정성 확보 | handler, payment, userManager, notificationSystem |
| **Replace Magic String with Constant** | 매직 스트링 제거 | userManager, payment |

### 적용된 디자인 패턴

| 패턴 | 설명 | 적용 파일 |
|-----|------|----------|
| **Strategy Pattern** | 알고리즘을 캡슐화하고 런타임 선택 | handler, payment, userManager, notificationSystem |
| **Registry Pattern** | 객체 매핑을 통한 조건문 제거 | handler, payment, userManager |
| **Template Method Pattern** | 공통 알고리즘 골격 정의 | notificationSystem |
| **Dependency Injection** | 의존성 외부 주입으로 결합도 감소 | notificationSystem |

### TypeScript 고급 기능

| 기능 | 설명 | 적용 파일 |
|-----|------|----------|
| **Discriminated Union** | 타입 안전한 상태 표현 | notificationSystem |
| **Type Predicate (is)** | 런타임 타입 보장 | payment |
| **Control Flow Analysis** | 제어 흐름 기반 타입 좁히기 | notificationSystem |
| **Record<K, V>** | 객체 타입 안정성 확보 | handler, payment, userManager, notificationSystem |
| **Generic Types** | 재사용 가능한 타입 정의 | userManager, notificationSystem |
| **Type Guards** | 타입 좁히기 메커니즘 | notificationSystem |

### SOLID 원칙 적용

| 원칙 | 설명 | 적용 예시 |
|-----|------|----------|
| **Single Responsibility** | 단일 책임 원칙 | 각 함수가 하나의 명확한 책임 |
| **Open/Closed** | 확장에는 열려있고 수정에는 닫혀있음 | Registry 패턴으로 새 기능 추가 용이 |
| **Liskov Substitution** | 하위 타입 대체 가능성 | Logger 인터페이스 구현체들 |
| **Interface Segregation** | 인터페이스 분리 | Logger 인터페이스의 최소 메서드 |
| **Dependency Inversion** | 추상화에 의존 | NotificationService의 Logger 의존 |

---

## 📁 파일별 상세 학습

### 1. handler.ts - Todo 관리 시스템

#### 📋 시나리오

작업 관리 애플리케이션의 Todo 상태 처리 시스템. 완료, 삭제, 복원, 보관 등 다양한 상태 전환을 처리.

#### 🎯 난이도

🟢 **초급** - 기본 리팩토링 기법 학습

#### 🐛 발견한 코드 스멜

- **Mysterious Name**: `t`, `s` 같은 불명확한 변수명
- **Duplicate Code**: 반복되는 로그 메시지 패턴
- **Long Method**: if-else 체인으로 길어지는 함수
- **Shotgun Surgery**: 새 기능 추가 시 여러 곳 수정 필요

#### 🔧 적용한 리팩토링 기법

- **Rename Variable**: `t` → `task`, `s` → `status`
- **Extract Function**: 각 상태 처리를 독립 함수로 분리
- **Replace Conditional with Polymorphism**: if-else → 객체 매핑
- **Extract Function**: 로그 출력을 별도 함수로 분리

#### 🎨 학습한 패턴 및 개념

- **Strategy Pattern**: 동작을 객체로 관리
- **Type Safety**: `Record<K, V>`로 컴파일 타임 안정성 확보
- **Open/Closed Principle**: 확장에는 열려있고 수정에는 닫혀있는

설계

#### 💡 핵심 학습 포인트

```typescript

// Before: if-else 체인

if (status === 'complete') {
  task.done = true;
  task.completedAt = new Date();
} else if (status === 'delete') {
  // ...
}

  

// After: Registry 패턴

const handler: Record<TaskStatus, TaskHandler> = {
  complete: handleComplete,
  delete: handleDelete,
  restore: handleRestore,
  archive: handleArchive,
};

handler[status](task);
```

---

### 2. payment.ts - 결제 처리 시스템

#### 📋 시나리오

전자상거래 플랫폼의 다중 결제 수단 지원. 카드, 계좌이체, 포인트 결제의 검증 및 수수료 계산.

#### 🎯 난이도

🟢 **초급-중급** - 검증 로직 분리 및 타입 안정성

#### 🐛 발견한 코드 스멜

- **Switch Statement**: 결제 타입별 분기 처리가 여러 곳에 산재
- **Duplicate Code**: 각 결제 수단별 검증/처리 로직의 반복 패턴
- **Long Method**: `processPayment`에서 검증, 계산, 로깅을 모두 처리
- **Primitive Obsession**: `method`를 문자열로 관리하여 타입 안정성 부족

#### 🔧 적용한 리팩토링 기법

- **Extract Type**: `PaymentMethod` 타입으로 허용값 명시
- **Extract Function**: 검증/계산/로깅을 독립 함수로 분리
- **Replace Conditional with Polymorphism**: switch → Record 객체 매핑
- **Introduce Type Predicate**: `isValidPaymentMethod`로 타입

가드 구현

- **Consolidate Duplicate Conditional Fragments**: 공통 에러 메시지를 상수로 추출

#### 🎨 학습한 패턴 및 개념

- **Strategy Pattern**: 결제 수단별 알고리즘을 객체로 캡슐화
- **Type Predicate**: TypeScript의 `is` 키워드로 런타임 타입 보장
- **Lookup Table Pattern**: Record를 활용한 분기 로직 단순화
- **Open/Closed Principle**: 새 결제 수단 추가 시 기존 코드 수정 최소화
- **Separation of Concerns**: 검증/계산/출력 책임을 명확히 분리

#### 💡 핵심 학습 포인트

```typescript

// Type Predicate로 타입 가드
function isValidPaymentMethod(method: string): method is PaymentMethod {
  return method === 'card' || method === 'bank' || method === 'points';
}

// 검증과 처리 로직 분리
const validators: Record<PaymentMethod, PaymentValidator> = { ... };
const paymentHandler: Record<PaymentMethod, PaymentHandler> = { ... };
```

---

### 3. userManager.ts - 사용자 관리 시스템

#### 📋 시나리오

사용자 CRUD 작업 처리 시스템. 생성, 수정, 삭제 시 검증과 로깅을 수행.

#### 🎯 난이도

🟡 **중급** - 고급 TypeScript 타입 활용

#### 🐛 발견한 코드 스멜

- **Long Method**: `processUser` 메서드가 검증, 액션 처리, 로깅 등 너무 많은 책임
- **Duplicate Code**: 사용자 정보 로깅 코드가 여러 함수에서 반복
- **Primitive Obsession**: `user: any` 타입, `action: string` 타입 안정성 부족
- **Switch Statements**: if-else 체인으로 새 액션 추가 시 여러 곳 수정 필요

#### 🔧 적용한 리팩토링 기법

- **Extract Method**: 검증/액션/로깅 로직 분리
- **Replace Type Code with Polymorphism**: if-else → `actionHandlers` 객체 매핑
- **Introduce Parameter Object**: `User` 인터페이스 정의로 타입 안정성 확보
- **Replace Magic String with Constant**: `USER_VALID_CHECK_PROPS` 상수 정의

#### 🎨 학습한 패턴 및 개념

- **Strategy Pattern**: `actionHandlers` 객체로 액션별 처리 전략 분리
- **Single Responsibility Principle**: 각 함수가 하나의 명확한 책임
- **Generic Types**: `getObjKeys<T>` 제네릭 함수
- **Type Safety**: `keyof`, `typeof`, `Record` 타입 조합

#### 💡 핵심 학습 포인트

```typescript

// 타입 안전한 객체 키 추출
const getObjKeys = <T>(obj: T) => Object.keys(obj) as (keyof T)[];

  

// 검증 핸들러 매핑
const validationHandlers: Record<UserPropType, ValidHandler> = {
  email: isValidUserEmail,
  name: isValidUserName,
  age: isValidUserAge,
};

  

// 재사용 가능한 로깅 함수
function logUserInfo(user: User, ...options: UserPropType[]): void {
  options.forEach((option) => console.log(`User ${option}: ${user[option]}`));
}
```

---

### 4. notificationSystem.ts - 알림 시스템 ⭐

#### 📋 시나리오

전자상거래 플랫폼의 멀티채널 알림 시스템. 이메일, SMS, Push 알림 전송과 재시도 로직.

#### 🎯 난이도

🟡 **중급** - 복합 패턴 적용 및 고급 타입 시스템

#### 🐛 발견한 코드 스멜

- **Duplicate Code**: 세 가지 알림 타입의 전송/재시도 로직 반복
- **Long Method**: 초기 `sendNotification` 100줄 이상
- **Switch Statements**: if-else 체인으로 알림 타입 분기
- **Arrow Anti-pattern**: 재시도 로직의 중첩된 if문 (최대 3단계)
- **Copy-Paste Bugs**: 변수명 오타, 타입 불일치

#### 🔧 적용한 리팩토링 기법

- **Extract Method**: 핸들러들, `retryNotify`, 검증 함수들 분리
- **Template Method Pattern**: `handleNotification`에 공통 알고리즘 정의
- **Replace Conditional with Strategy**: if-else → `handlerRegistry` 객체 매핑
- **Registry Pattern**: 핸들러를 객체에 등록하여 관리
- **Higher-Order Functions**: `retryNotify`가 함수를 받아 재시도 적용
- **Bottom-up Refactoring**: 하위 함수부터 순차적으로 리팩토링

#### 🎨 학습한 패턴 및 개념

**디자인 패턴:**

- **Strategy Pattern**: 알림 전송 전략을 런타임에 선택
- **Template Method Pattern**: 공통 알고리즘 골격 정의, 차이점만 파라미터로
- **Registry Pattern**: 핸들러를 객체에 등록하여 조회
- **Dependency Injection**: Logger를 외부에서 주입
- **Composition over Inheritance**: Logger를 상속이 아닌 구성으로 사용

**TypeScript 고급 기능:**

- **Discriminated Union**: `NotificationResult<T>` 타입으로 성공/실패 표현
- **Type Guards**: `result.success === false` 패턴으로 타입 좁히기
- **Control Flow Analysis**: if-else에서 TypeScript의 제어 흐름 분석
- **Double Type Narrowing**: 2단계 타입 좁히기 (`success` → `error.code`)
- **Type Predicates**: 타입 가드 함수 패턴

**함수형 프로그래밍:**

- **Railway-Oriented Programming (ROP)**: 성공/실패 경로 분리
- **Discriminated Unions**: 타입 안전한 에러 처리
- **Higher-Order Functions**: 함수를 받고 반환하는 함수

#### 💡 핵심 학습 포인트

**1. Result 타입 (Railway-Oriented Programming)**

```typescript

type NotificationResult<T> =
  | { success: true; value: T }
  | { success: false; error: NotificationError };

  

// 장점: 타입 안전한 에러 처리
if (!result.success) {

  // TypeScript가 자동으로 error 필드 접근 가능하게 함
  console.log(result.error.code);
}
```

**2. Template Method Pattern**

```typescript

private handleNotification(
  enabled: boolean,
  sendFn: () => NotificationResult<void>,
  notificationType: NotificationType,
  additionalValidation?: () => NotificationResult<void>
): NotificationResult<void> {

  // 공통 알고리즘:
  // 1. 검증 → 2. 추가 검증 → 3. 전송 → 4. 재시도 → 5. 로깅
}
```

**3. Dependency Injection**

```typescript

// Logger를 외부에서 주입받아 결합도 낮춤

export class NotificationService {

  constructor(private logger: Logger) {
      this.handleRegistry = {
          email: this.emailHandler.bind(this),
          sms: this.smsHandler.bind(this),
          push: this.pushHandler.bind(this),
      };
  }
}

// 사용: 테스트 시 SilentLogger 주입 가능
new NotificationService(new ConsoleLogger());  // 운영
new NotificationService(new SilentLogger());   // 테스트

```

**4. Control Flow Analysis (제어 흐름 분석)**

```typescript

// TypeScript 2.0+의 강력한 타입 좁히기
if (result.success === true) {
  // result는 { success: true; value: T }
  result.value;
} else {
  // result는 { success: false; error: NotificationError }
  result.error;  // ✅ TypeScript가 자동으로 추론!
  if (result.error.code === 'SEND_FAILED') {
      // 한 번 더 타입 좁히기!
      result.error.attempts;  // ✅ attempts 필드 접근 가능
  }
}
```

#### 🎓 주요 학습 주제

1. **Railway-Oriented Programming**

- 성공/실패가 타입으로 표현됨
- 에러가 발생하면 즉시 반환되어 전파
- vs Try-Catch: ROP는 예측 가능한 비즈니스 실패, Try-Catch는 예기치 않은 예외

2. **Dependency Injection + Strategy Pattern**

- 전략 객체를 외부에서 주입
- 런타임에 전략 교체 가능
- 결합도 낮춤, 테스트 용이성 향상

3. **명시적 의존성 (Explicit Dependencies)**

- 의존성이 코드에 명확히 드러남
- 초기화 순서 제어 가능
- 팀 협업 시 혼란 방지

4. **Bottom-up 리팩토링 전략**

- 하위 함수부터 수정 → 상위로 전파
- 타입 에러를 단계적으로 해결
- 안전한 리팩토링

5. **타입 세분화의 힘**

- 컴파일러가 모든 케이스 체크
- 자동완성 지원
- 오타 방지

---

## 🎨 핵심 학습 패턴

### 1. Strategy Pattern (전략 패턴)

**문제**: 조건문이 많아지면 코드 복잡도 증가, 확장 어려움

**해결**: 알고리즘을 객체로 캡슐화하여 런타임에 선택

```typescript

// Before
if (type === 'email') { /* ... */ }
else if (type === 'sms') { /* ... */ }

// After
const handlers: Record<Type, Handler> = {
  email: handleEmail,
  sms: handleSMS,
};

handlers[type]();
```

**적용 파일**: 전체

**장점**: 확장성 ⬆️, 복잡도 ⬇️, OCP 준수

---

### 2. Template Method Pattern (템플릿 메서드)

**문제**: 비슷한 알고리즘이 반복되지만 세부 단계만 다름
**해결**: 공통 골격을 정의하고 차이점만 파라미터로 받음

```typescript

private handleNotification(
  enabled: boolean,
  sendFn: () => Result,
  type: NotificationType,
  validation?: () => Result
): Result {

  // 공통 알고리즘:
  // 1. 검증 → 2. 추가 검증 → 3. 전송 → 4. 재시도 → 5. 로깅
}

```

**적용 파일**: notificationSystem.ts
**장점**: 중복 제거, 일관성 유지, 유지보수성 향상

---

### 3. Registry Pattern (레지스트리)

**문제**: switch/if-else 체인으로 분기 처리
**해결**: 객체 매핑으로 조건문 제거

```typescript

const registry: Record<Key, Handler> = {
  key1: handler1,
  key2: handler2,
};

registry[key]();
```

**적용 파일**: 전체
**장점**: 가독성 향상, 새 케이스 추가 용이

---

### 4. Dependency Injection (의존성 주입)

**문제**: 클래스가 직접 의존성을 생성하면 결합도 높아짐
**해결**: 외부에서 의존성을 주입받음

```typescript

class Service {
  constructor(private logger: Logger) {}  // DI
}

// 사용
new Service(new ConsoleLogger());  // 운영
new Service(new SilentLogger());   // 테스트
```

**적용 파일**: notificationSystem.ts
**장점**: 테스트 용이, 유연성 향상, 결합도 감소

---

### 5. Railway-Oriented Programming

**문제**: 에러 처리가 중첩되어 가독성 저하
**해결**: 성공/실패를 타입으로 표현하고 early return

```typescript

type Result<T> =
  | { success: true; value: T }
  | { success: false; error: Error };

  

function process(): Result<Data> {
  const result1 = step1();
  if (!result1.success) return result1;

  const result2 = step2(result1.value);
  if (!result2.success) return result2;

  return { success: true, value: result2.value };
}

```

**적용 파일**: notificationSystem.ts
**장점**: 타입 안전, 에러 추적 용이, 가독성 향상
