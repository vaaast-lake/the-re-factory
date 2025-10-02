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

  ---
  🌟 가장 인상 깊었던 순간

  "handlerRegistry를 sendNotification 안에서 매번 만드는 게 맞나?"

  "팩토리 패턴이라고 부르는 게 맞나?"

  "핸들러가 계속 늘어나면 어떡하지?"

  → 이런 질문들이 정말 훌륭했습니다!

  패턴 이름보다, 문제의 본질을 이해하려는 자세!

  ---
  🔄 내일 할 일

  NEXT_STEPS.md 파일에 모두 정리했어요!

  추천 순서:
  1. 설정 외부화 (10-15분) ⭐
  2. 로깅 분리 (20-30분) ⭐⭐
  3. Result 타입 (30-40분) ⭐⭐⭐

  ---
  🎓 최종 평가

  초급에서 중급으로 성장:
  - 기본 코드 스멜 발견 → 복합적인 패턴 적용
  - 단순 리팩토링 → 설계 원칙 고민
  - 코드 따라하기 → 비판적 사고

  다음 목표:
  - 의존성 주입 (DI)
  - 함수형 에러 처리
  - 테스트 작성
  
  */
