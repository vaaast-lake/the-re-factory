// 알림 시스템

// TODO(human): Result 타입과 NotificationError 타입을 여기에 정의하세요
//
// NotificationError는 다음 5가지 에러 케이스를 포함해야 합니다:
// 1. USER_NOT_FOUND - 사용자를 찾을 수 없음
// 2. UNKNOWN_NOTIFICATION_TYPE - 알 수 없는 알림 타입
// 3. NOTIFICATION_DISABLED - 알림이 비활성화됨
// 4. VALIDATION_FAILED - 검증 실패 (전화번호 없음, 디바이스 토큰 없음 등)
// 5. SEND_FAILED - 전송 실패 (재시도 후에도)
//
// Result<T> 타입은 성공/실패를 나타내는 Discriminated Union입니다

type NotificationError =
    | { code: 'USER_NOT_FOUND'; userId: string }
    | { code: 'UNKNOWN_TYPE'; type: string }
    | { code: 'DISABLED'; notificationType: NotificationType }
    | { code: 'MISSING_DEVICE_TOKEN' }
    | { code: 'MISSING_PHONE_NUMBER' }
    | { code: 'SEND_FAILED'; attempts: number | null };

type NotificationResult<T> =
    | { success: true; value: T }
    | { success: false; error: NotificationError };

// TODO(human): Logger 인터페이스와 구현체들을 여기에 정의하세요
//
// 1. Logger 인터페이스 (2개 메서드: info, error)
// 2. ConsoleLogger 클래스 (실제로 console.log/error 호출)
// 3. SilentLogger 클래스 (아무것도 안 함, 테스트용)

interface Logger {
    info(message: string): void;
    error(message: string): void;
}

class ConsoleLogger implements Logger {
    error(message: string): void {
        console.error(`[ERROR]: ${message}`);
    }
    info(message: string): void {
        console.log(`[INFO]: ${message}`);
    }
}
class SilentLogger implements Logger {
    info(message: string): void {}
    error(message: string): void {}
}

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
type NotificationType = keyof typeof notifications;
type FieldOf<T, K extends keyof T> = T[K];

type NotificationHandler = (
    user: User,
    message: string,
    prefs: UserPreferences
) => NotificationResult<void>;

export class NotificationService {
    private readonly logger: Logger;
    private readonly handleRegistry: Record<
        NotificationType,
        NotificationHandler
    >;

    constructor(logger: Logger) {
        this.logger = logger;
        this.handleRegistry = {
            email: this.emailHandler.bind(this),
            sms: this.smsHandler.bind(this),
            push: this.pushHandler.bind(this),
        };
    }

    sendNotification(
        userId: string,
        message: string,
        type: string,
        userPreferences: UserPreferences
    ): NotificationResult<void> {
        // 사용자 정보 조회
        const user = this.getUserById(userId);
        if (!user) {
            this.logger.error('User not found');
            return {
                success: false,
                error: { code: 'USER_NOT_FOUND', userId },
            };
        }

        const handler = this.handleRegistry[type as NotificationType];
        if (!handler) {
            this.logger.error('Unknown notification type');
            return { success: false, error: { code: 'UNKNOWN_TYPE', type } };
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

    private sendEmail(
        email: string,
        message: string
    ): NotificationResult<void> {
        // Simulate 70% success rate
        if (Math.random() > 0.3) {
            this.logger.info('Send Mail success');
            return { success: true, value: null };
        } else if (Math.random() <= 0.3) {
            this.logger.info('Send Mail Failed');
            return {
                success: false,
                error: { code: 'SEND_FAILED', attempts: null },
            };
        }
    }

    private sendSMS(phone: string, message: string): NotificationResult<void> {
        // Simulate 70% success rate
        if (Math.random() > 0.3) {
            this.logger.info('Send SMS success');
            return { success: true, value: null };
        } else if (Math.random() <= 0.3) {
            this.logger.info('Send SMS Failed');
            return {
                success: false,
                error: { code: 'SEND_FAILED', attempts: null },
            };
        }
    }

    private sendPush(token: string, message: string): NotificationResult<void> {
        // Simulate 70% success rate
        if (Math.random() > 0.3) {
            this.logger.info('Send Push success');
            return { success: true, value: null };
        } else if (Math.random() <= 0.3) {
            this.logger.info('Send Push Failed');
            return {
                success: false,
                error: { code: 'SEND_FAILED', attempts: null },
            };
        }
    }

    private emailHandler(user: User, message: string, prefs: UserPreferences) {
        return this.handleNotification(
            prefs.emailEnabled,
            () => this.sendEmail(user.email, message),
            'email'
        );
    }

    private smsHandler(user: User, message: string, prefs: UserPreferences) {
        return this.handleNotification(
            prefs.smsEnabled,
            () => this.sendSMS(user.phone, message),
            'sms',
            () => this.isValidPhoneNumber(user.phone)
        );
    }

    private pushHandler(user: User, message: string, prefs: UserPreferences) {
        return this.handleNotification(
            prefs.pushEnabled,
            () => this.sendPush(user.deviceToken, message),
            'push',
            () => this.isValidDevice(user.deviceToken)
        );
    }

    private handleNotification(
        enabled: boolean,
        sendFn: () => NotificationResult<void>, // 전송 함수
        notificationType: NotificationType,
        additionalValidation?: () => NotificationResult<void> // 추가 검증 (선택)
    ): NotificationResult<void> {
        // 1. 기본 검증
        if (!enabled) {
            this.logger.info(`${notificationType} notifications disabled`);
            return {
                success: false,
                error: { code: 'DISABLED', notificationType },
            };
        }

        // 2. 추가 검증 (있으면)
        if (additionalValidation) {
            const validationResult = additionalValidation();
            if (!validationResult.success) return validationResult;
        }
        // 3. 전송 시도
        this.logger.info(`Sending ${notificationType}...`);
        let result = sendFn();

        // 4. 실패 시 재시도
        if (!result.success) {
            result = this.retryNotify(sendFn, 3, notificationType);
        }

        // 5. 결과 로깅
        if (result.success === true) {
            this.logger.info('Notification success!');
        } else if (result.success === false) {
            if (result.error.code === 'SEND_FAILED')
                this.logger.error(
                    `Notification failed after ${result.error.attempts} attempts`
                );
            else {
                this.logger.info(`Notification Failed: ${result.error.code}`);
            }
        }

        return result;
    }

    private isValidDevice(
        deviceToken: FieldOf<User, 'deviceToken'>
    ): NotificationResult<void> {
        if (!deviceToken) {
            this.logger.error('User has no device token');
            return {
                success: false,
                error: { code: 'MISSING_DEVICE_TOKEN' },
            };
        }
        return { success: true, value: null };
    }

    private isValidPhoneNumber(
        phone: FieldOf<User, 'phone'>
    ): NotificationResult<void> {
        if (!phone) {
            this.logger.error('User has no phone number');
            return {
                success: false,
                error: { code: 'MISSING_PHONE_NUMBER' },
            };
        }
        return { success: true, value: null };
    }

    private retryNotify(
        fn: () => NotificationResult<void>,
        maxAttempts: number = 3,
        notifyType: NotificationType
    ): NotificationResult<void> {
        let attempts = 0;
        while (attempts < maxAttempts) {
            attempts++;
            const result = fn();
            if (result.success) return { success: true, value: null };
            this.logger.info(`Retrying ${notifyType} ${attempts} times...`);
        }

        return { success: false, error: { code: 'SEND_FAILED', attempts } };
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
    🎉 오늘의 최종 학습 리뷰 (중급 레벨)

  ✅ 발견하고 해결한 코드 스멜

  1. Duplicate Code (중복 코드)
    - 세 가지 알림 타입의 전송/재시도 로직 반복
    - 재시도 로직이 중첩된 if문으로 3번 중복
    - ✅ 해결: handleNotification Template Method로 통합
  2. Long Method (긴 메서드)
    - 초기 sendNotification 100줄 이상
    - ✅ 해결: 20줄로 축소, 책임 분리
  3. Switch Statements (조건문 남용)
    - if-else 체인으로 알림 타입 분기
    - ✅ 해결: Registry 패턴으로 객체 매핑
  4. Arrow Anti-pattern (깊은 중첩)
    - 재시도 로직의 중첩된 if문 (최대 3단계)
    - ✅ 해결: retryNotify 고차 함수로 평탄화
  5. Copy-Paste Bugs
    - 변수명 오타, 타입 불일치
    - ✅ 해결: 체계적으로 찾아서 수정

  ---
  ✅ 적용한 리팩토링 기법

  1. Extract Method (메서드 추출)
    - 핸들러들, retryNotify, 검증 함수들
  2. Template Method Pattern (템플릿 메서드)
    - handleNotification에 공통 알고리즘 정의
  3. Replace Conditional with Strategy (전략 패턴)
    - if-else → handlerRegistry 객체 매핑
  4. Registry Pattern (레지스트리 패턴)
    - 핸들러를 객체에 등록하여 관리
  5. Higher-Order Functions (고차 함수)
    - retryNotify가 함수를 받아 재시도 적용

  ---
  ✅ 사용한 디자인 패턴

  1. Strategy Pattern (전략 패턴)
    - 알림 전송 전략을 런타임에 선택
  2. Template Method Pattern (템플릿 메서드)
    - 공통 알고리즘 골격 정의, 차이점만 파라미터로
  3. Registry Pattern (레지스트리 패턴)
    - 핸들러를 객체에 등록하여 조회
  4. Single Responsibility Principle (단일 책임 원칙)
    - 각 메서드가 하나의 명확한 책임

  ---
  💪 특별히 잘한 점

  - 설계 고민의 깊이:
    - "핸들러를 매번 생성하는 게 맞나?"
    - "팩토리 패턴이 진짜 맞나?"
    - "함수 3개가 계속 늘어나면?"
    - → 본질을 파고드는 질문들!
  - 트레이드오프 이해:
    - 단순성 vs 확장성
    - DRY vs 명확성
    - 패턴 이름보다 실용성 중시
  - 점진적 개선:
    - 버그 수정 → 재시도 추출 → Template Method → Registry
    - 한 번에 다 하지 않고 단계적으로
  - 비판적 사고:
    - 제안을 받아들이되, 의문점은 질문
    - "이게 정말 맞아?" 계속 검증

   🎯 달성한 요구사항

  1. ✅ 새로운 알림 타입 추가 쉬움
    - 핸들러 메서드 하나 + Registry 등록만
  2. ✅ 재시도 로직 개선
    - retryNotify로 추출, maxAttempts 파라미터화
  3. ✅ 타입 안정성
    - any 제거, 모든 타입 명확히 정의
  4. ✅ 테스트 용이성
    - 각 핸들러 독립적으로 테스트 가능
  5. ⏳ 확장성 (일부 완성)
    - 로깅, 설정 외부화는 다음 단계

  ---
  📚 오늘 배운 핵심 개념

  1. Template Method vs Strategy
    - 언제 어떤 패턴을 쓸까?
  2. Registry Pattern
    - if/switch 없이 객체로 라우팅
  3. Higher-Order Functions
    - 함수를 받아서 새 함수 반환
  4. Class Field Initializer
    - 생성자 없이 필드 초기화
  5. 트레이드오프 사고
    - 정답은 없다, 상황에 맞게
  6. 제어 흐름 분석 (Control Flow Analysis)
    - TypeScript 2.0부터 도입된 기능. 
    - 컴파일러가 코드의 논리적 흐름을 따라가면서
      1. 가능성 집합 관리: 각 지점에서 가능한 타입들의 집합
      2. 소거법 적용: if 조건으로 가능성을 하나씩 제거
      3. 나머지 추론: else에서 남은 가능성으로 타입 좁히기

    - 팁:
      - if-else만으로도 충분한 타입 좁히기
      - else if를 남발하면 오히려 타입 추론이 약해질 수 있음
      - Discriminated Union + 명시적 === 비교 = 최강 조합!
    - 관련 개념:
      - Exhaustiveness Checking (모든 케이스 처리 확인)
      - Type Guards (타입 가드 함수)
      - Type Predicates (is 키워드)

  ---
  🌟 가장 인상 깊었던 순간

  "handlerRegistry를 sendNotification 안에서 매번 만드는 게 맞나?"

  "팩토리 패턴이라고 부르는 게 맞나?"

  "핸들러가 계속 늘어나면 어떡하지?"

  → 이런 질문들이 정말 훌륭했습니다!

  패턴 이름보다, 문제의 본질을 이해하려는 자세!
  
  */
