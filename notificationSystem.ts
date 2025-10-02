// 알림 시스템

type UserPreferences = {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
};

const notifications = {
    email: 'email',
    sms: 'sms',
    push: 'push',
} as const;
type Notification = keyof typeof notifications;
interface NotifyPayload {
    message: string;
    enabled: boolean;
}

interface EmailPayload extends NotifyPayload {
    email: string;
}

interface SmsPayload extends NotifyPayload {
    phone: string;
}

interface PushPayload extends NotifyPayload {
    deviceToken: string;
}

export class NotificationService {
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

        // 알림 타입별 처리
        const handlers: Record<Notification, () => boolean> = {
            email: () =>
                this.emailHandler({
                    email: user.email,
                    message,
                    enabled: userPreferences.emailEnabled,
                }),
            sms: () =>
                this.smsHandler({
                    phone: user.phone,
                    message,
                    enabled: userPreferences.smsEnabled,
                }),
            push: () =>
                this.pushHandler({
                    deviceToken: user.deviceToken,
                    message,
                    enabled: userPreferences.pushEnabled,
                }),
        };

        const handler = handlers[type as Notification];
        return handler ? handler() : false;
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

    private emailHandler(payload: EmailPayload): boolean {
        const { email, message, enabled } = payload;

        if (!enabled) {
            console.log('Email notifications disabled');
            return false;
        }

        // 이메일 전송
        console.log(`Sending email to ${email}`);
        let emailResult = this.sendEmail(email, message);

        if (!emailResult) {
            // 재시도 로직
            emailResult = this.retryNotify(
                () => this.sendEmail(email, message),
                3,
                'email'
            );
        }
        emailResult
            ? console.log('Email sent successfully')
            : console.log('Email sent failed');
        return emailResult;
    }

    private smsHandler(payload: SmsPayload): boolean {
        const { enabled, phone, message } = payload;
        if (!enabled) {
            console.log('SMS notifications disabled');
            return false;
        }

        if (!phone) {
            console.log('User has no phone number');
            return false;
        }
        // SMS 전송
        console.log(`Sending SMS to ${phone}`);
        let smsResult = this.sendSMS(phone, message);

        if (!smsResult) {
            // 재시도 로직
            smsResult = this.retryNotify(
                () => this.sendSMS(phone, message),
                3,
                'sms'
            );
        }
        smsResult
            ? console.log('SMS sent successfully')
            : console.log('SMS sent failed');
        return smsResult;
    }

    private pushHandler(payload: PushPayload): boolean {
        const { enabled, deviceToken, message } = payload;
        if (!enabled) {
            console.log('Push notifications disabled');
            return false;
        }

        if (!deviceToken) {
            console.log('User has no device token');
            return false;
        }

        // Push 알림 전송
        console.log(`Sending push to ${deviceToken}`);
        let pushResult = this.sendPush(deviceToken, message);

        if (!pushResult) {
            // 재시도 로직
            pushResult = this.retryNotify(
                () => this.sendPush(deviceToken, message),
                3,
                'push'
            );
        }
        pushResult
            ? console.log('Push sent successfully')
            : console.log('Push sent failed');
        return pushResult;
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
