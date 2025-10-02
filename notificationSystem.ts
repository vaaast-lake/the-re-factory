// 알림 시스템
export class NotificationService {
    sendNotification(
        userId: string,
        message: string,
        type: string,
        userPreferences: any
    ) {
        // 사용자 정보 조회
        const user = this.getUserById(userId);
        if (!user) {
            console.log('User not found');
            return false;
        }

        // 알림 타입별 처리
        if (type === 'email') {
            if (!userPreferences.emailEnabled) {
                console.log('Email notifications disabled');
                return false;
            }

            // 이메일 전송
            console.log(`Sending email to ${user.email}`);
            const emailSent = this.sendEmail(user.email, message);

            if (!emailSent) {
                // 재시도 로직
                console.log('Retrying email...');
                const retry1 = this.sendEmail(user.email, message);
                if (!retry1) {
                    console.log('Retrying email again...');
                    const retry2 = this.sendEmail(user.email, message);
                    if (!retry2) {
                        console.log('Email failed after 3 attempts');
                        return false;
                    }
                }
            }

            console.log('Email sent successfully');
            return true;
        } else if (type === 'sms') {
            if (!userPreferences.smsEnabled) {
                console.log('SMS notifications disabled');
                return false;
            }

            if (!user.phone) {
                console.log('User has no phone number');
                return false;
            }

            // SMS 전송
            console.log(`Sending SMS to ${user.phone}`);
            const smsSent = this.sendSMS(user.phone, message);

            if (!smsSent) {
                // 재시도 로직
                console.log('Retrying SMS...');
                const retry1 = this.sendSMS(user.phone, message);
                if (!retry1) {
                    console.log('Retrying SMS again...');
                    const retry2 = this.sendSMS(user.phone, message);
                    if (!retry2) {
                        console.log('SMS failed after 3 attempts');
                        return false;
                    }
                }
            }

            console.log('SMS sent successfully');
            return true;
        } else if (type === 'push') {
            if (!userPreferences.pushEnabled) {
                console.log('Push notifications disabled');
                return false;
            }

            if (!user.deviceToken) {
                console.log('User has no device token');
                return false;
            }

            // Push 알림 전송
            console.log(`Sending push to ${user.deviceToken}`);
            const pushSent = this.sendPush(user.deviceToken, message);

            if (!pushSent) {
                // 재시도 로직
                console.log('Retrying push...');
                const retry1 = this.sendPush(user.deviceToken, message);
                if (!retry1) {
                    console.log('Retrying push again...');
                    const retry2 = this.sendPush(user.deviceToken, message);
                    if (!retry2) {
                        console.log('Push failed after 3 attempts');
                        return false;
                    }
                }
            }

            console.log('Push sent successfully');
            return true;
        } else {
            console.log('Unknown notification type');
            return false;
        }
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
}

const NotificationType = {
    email: 'email',
    sms: 'sms',
    push: 'push',
} as const;

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
