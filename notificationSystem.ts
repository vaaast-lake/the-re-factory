// 알림 시스템

type UserPreferences = {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
};

interface User {
    id: string;
    email: string;
    phone: string;
    deviceToken: string;
}

const notifications = {
    email: 'email',
    sms: 'sms',
    push: 'push',
} as const;
type Notification = keyof typeof notifications;
type FieldOf<T, K extends keyof T> = T[K];

export class NotificationService {
    // Class Field Initializer)
    private readonly handlerRegistry = {
        email: this.emailHandler.bind(this),
        sms: this.smsHandler.bind(this),
        push: this.pushHandler.bind(this),
    };

    sendNotification(
        userId: string,
        message: string,
        type: string,
        userPreferences: UserPreferences
    ) {
        // 사용자 정보 조회
        const user = this.getUserById(userId);
        if (!user) {
            console.log('User not found');
            return false;
        }

        const handler = this.handlerRegistry[type as Notification];
        if (!handler) {
            console.log('Unknown notification type');
            return false;
        }

        return handler(user, message, userPreferences);
    }

    private getUserById(userId: string) {
        // Mock user data
        return {
            id: userId,
            email: 'user@example.com',
            phone: '+1234567890',
            deviceToken: 'abc123',
        };
    }

    private sendEmail(email: string, message: string): boolean {
        // Simulate 70% success rate
        return Math.random() > 0.3;
    }

    private sendSMS(phone: string, message: string): boolean {
        // Simulate 70% success rate
        return Math.random() > 0.3;
    }

    private sendPush(token: string, message: string): boolean {
        // Simulate 70% success rate
        return Math.random() > 0.3;
    }

    private emailHandler(user: User, message: string, prefs: UserPreferences) {
        return () =>
            this.handleNotification(
                prefs.emailEnabled,
                () => this.sendEmail(user.email, message),
                'email'
            );
    }

    private smsHandler(user: User, message: string, prefs: UserPreferences) {
        return () =>
            this.handleNotification(
                prefs.smsEnabled,
                () => this.sendSMS(user.phone, message),
                'sms',
                () => this.isValidPhoneNumber(user.phone)
            );
    }

    private pushHandler(user: User, message: string, prefs: UserPreferences) {
        return () =>
            this.handleNotification(
                prefs.pushEnabled,
                () => this.sendPush(user.deviceToken, message),
                'push',
                () => this.isValidDevice(user.deviceToken)
            );
    }

    private handleNotification(
        enabled: boolean,
        sendFn: () => boolean, // 전송 함수
        notificationType: Notification,
        additionalValidation?: () => boolean // 추가 검증 (선택)
    ): boolean {
        // 1. 기본 검증
        if (!enabled) {
            console.log(`${notificationType} notifications disabled`);
            return false;
        }

        // 2. 추가 검증 (있으면)
        if (additionalValidation && !additionalValidation()) {
            return false;
        }
        // 3. 전송 시도
        console.log(`Sending ${notificationType}...`);
        let result = sendFn();

        // 4. 실패 시 재시도
        if (!result) {
            result = this.retryNotify(sendFn, 3, notificationType);
        }

        // 5. 결과 로깅
        result
            ? console.log(`${notificationType} sent successfully`)
            : console.log(`${notificationType} sent failed`);

        return result;
    }

    private isValidDevice(deviceToken: FieldOf<User, 'deviceToken'>) {
        if (!deviceToken) {
            console.log('User has no device token');
            return false;
        }
        return true;
    }

    private isValidPhoneNumber(phone: FieldOf<User, 'phone'>) {
        if (!phone) {
            console.log('User has no phone number');
            return false;
        }
        return true;
    }

    private retryNotify(
        fn: () => boolean,
        maxAttempts: number = 3,
        notifyType: Notification
    ): boolean {
        let attempts = 0;
        while (attempts < maxAttempts) {
            attempts++;
            const result = fn();
            if (result) return true;
            console.log(`Retrying ${notifyType} ${attempts} times...`);
        }

        return false;
    }
}

/**
 *  📋 오늘의 시나리오 (🟡 중급)

  당신은 전자상거래 플랫폼의 알림 시스템을 담당하게 되었습니다.

  현재 시스템은 이메일 알림만 지원하는데, 이제 SMS, Push 알림도 추가해야 합니다.
  게다가 사용자 설정에 따라 알림을 선택적으로 보내야 하고,
  알림 전송 실패 시 재시도 로직도 필요합니다.

  선배 개발자가 급하게 작성한 코드가 있는데, 확장하기가 너무 어렵다는 피드백이 들어왔습니다.

  🎯 요구사항

  1. 새로운 알림 타입 추가: 카카오톡, Slack 알림 등 쉽게 추가 가능해야 함
  2. 재시도 로직 개선: 재시도 횟수를 설정 가능하게
  3. 타입 안정성: any 타입 제거, 명확한 인터페이스 정의
  4. 테스트 용이성: 각 알림 채널을 독립적으로 테스트 가능해야 함
  5. 확장성: 알림 전송 전/후 로깅, 분석 등 추가 기능을 쉽게 붙일 수 있어야 함
 */

/**
   * 🎉 오늘의 학습 리뷰 (중급)

  ✅ 발견한 코드 스멜

  1. Duplicate Code (중복 코드)
    - 세 가지 알림 타입의 전송/재시도 로직이 반복됨
    - 재시도 로직이 중첩된 if문으로 3번 반복
  2. Long Method (긴 메서드)
    - 초기 sendNotification이 100줄 이상
    - 사용자 조회, 검증, 전송, 재시도를 모두 처리
  3. Switch Statements (조건문 남용)
    - if-else 체인으로 알림 타입 분기
    - 새 타입 추가 시 여러 곳 수정 필요 (Shotgun Surgery)
  4. Arrow Anti-pattern (깊은 중첩)
    - 재시도 로직의 중첩된 if문 (최대 3단계)
  5. Copy-Paste Bugs (복사-붙여넣기 버그)
    - 변수명을 잘못 수정한 버그 발견

  ---
  ✅ 적용한 리팩토링 기법

  1. Extract Method (메서드 추출)
    - emailHandler, smsHandler, pushHandler: 각 타입별 처리 로직 분리
    - retryNotify: 재시도 로직을 고차 함수로 추출
  2. Replace Conditional with Strategy (조건문을 전략으로 대체)
    - if-else 체인 → handlers 객체 매핑
    - 런타임에 핸들러 선택
  3. Introduce Parameter Object (매개변수 객체 도입)
    - EmailPayload, SmsPayload, PushPayload 인터페이스로 데이터 구조화
  4. Replace Nested Conditional with Guard Clauses (중첩 조건문을 보호 구문으로)
    - 검증 실패 시 early return으로 중첩 제거
  5. Compose Method (메서드 조합)
    - 각 메서드가 한 가지 추상화 레벨에서 작동

  ---
  ✅ 사용한 디자인 패턴

  1. Strategy Pattern (전략 패턴)
    - 핸들러 객체로 알림 전송 전략 분리
    - 새 알림 타입 추가가 쉬움
  2. Template Method (템플릿 메서드의 아이디어)
    - 각 핸들러가 동일한 흐름: 검증 → 전송 → 재시도 → 로깅
  3. Higher-Order Functions (고차 함수)
    - retryNotify가 함수를 받아서 재시도 로직 적용
  4. Single Responsibility Principle (단일 책임 원칙)
    - 각 메서드가 명확히 하나의 책임만 가짐

  ---
  💪 잘한 점

  - 문제 인식: 중복 코드와 깊은 중첩을 빠르게 발견
  - 단계적 개선: 버그 수정 → 재시도 로직 추출 → Strategy 패턴 적용
  - 설계 고민: 함수를 클래스 내부/외부 어디에 둘지 트레이드오프 고려
  - 타입 안전성: TypeScript의 고급 기능 활용 (제네릭, keyof, Record)
  - 실용적 선택: 여러 옵션 중 가장 간단하고 명확한 방법 선택
  - 버그 수정 능력: Copy-paste 버그들을 체계적으로 찾아서 수정

  ---
  🎯 개선 포인트 (프로덕션 레벨로 가려면)

  현재 코드에 아직 개선할 수 있는 부분들:

  1. Template Method 패턴 완성 (O)
    - 세 핸들러가 여전히 비슷한 구조를 반복
    - 공통 로직을 base 메서드로 추출 가능
  2. 에러 처리 개선
    - console.log 대신 구조화된 에러 반환
    - Result 타입이나 Custom Error 클래스 사용
  3. 로깅 전략 분리
    - 로깅 로직이 핸들러에 하드코딩됨
    - Observer 패턴이나 Logger 주입으로 분리 가능
  4. 설정 외부화
    - 재시도 횟수(3)가 하드코딩됨
    - Configuration 객체로 관리

  ---
  📚 더 공부하면 좋을 것

  1. Template Method Pattern: 공통 알고리즘 골격 정의
  2. Decorator Pattern: 로깅, 재시도 등을 데코레이터로 감싸기
  3. Dependency Injection: 테스트를 위한 의존성 주입
  4. Result/Either Type: 함수형 에러 처리
  5. Builder Pattern: 복잡한 Payload 객체 생성
   */
