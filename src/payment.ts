interface PaymentRequest {
    userId: string;
    amount: number;
    method: string;
    cardNumber?: string;
    accountNumber?: string;
    points?: number;
}

interface Payment {
    total: number;
    fee: number;
}

type PaymentMethod = 'card' | 'bank' | 'points';
type PaymentValidator = (req: PaymentRequest) => void;
type PaymentHandler = (req: PaymentRequest) => Payment;

const validators: Record<PaymentMethod, PaymentValidator> = {
    card: validateCardPayment,
    bank: validateBankPayment,
    points: validatePointsPayment,
};

const paymentHandler: Record<PaymentMethod, PaymentHandler> = {
    card: handleCardPayment,
    bank: handleBankPayment,
    points: handlePointsPayment,
};

const PAYMENT_ERR: Record<string, Error> = {
    CARD_NUM_REQUIRED: Error('Card number required'),
    INVALID_CARD_NUM: Error('Invalid card number'),
    ACCOUNT_NUM_REQUIRED: Error('Account number required'),
    INVALID_ACC_NUM: Error('Invalid account number'),
    POINT_REQUIRED: Error('Points required'),
    INSUFFICIENT_POINT: Error('Insufficient points'),
    UNKNOWN_ERR: Error('Unknown payment method'),
} as const;

function processPayment(req: PaymentRequest) {
    if (!isValidPaymentMethod(req.method)) throw PAYMENT_ERR.UNKNOWN_ERR;

    validatePayment(req);
    const { total, fee } = calculatePayment(req);
    printProcess(req.method, total);
    return { success: true, total, fee };
}

function isValidPaymentMethod(method: string): method is PaymentMethod {
    return method === 'card' || method === 'bank' || method === 'points';
}

function validatePayment(req: PaymentRequest) {
    const validator = validators[req.method];
    validator(req);
}

function validateCardPayment(req: PaymentRequest) {
    if (!req.cardNumber) throw PAYMENT_ERR.CARD_NUM_REQUIRED;
    if (req.cardNumber.length !== 16) throw PAYMENT_ERR.INVALID_CARD_NUM;
}
function validateBankPayment(req: PaymentRequest) {
    if (!req.accountNumber) throw PAYMENT_ERR.ACCOUNT_NUM_REQUIRED;
    if (req.accountNumber.length !== 12) throw PAYMENT_ERR.INVALID_ACC_NUM;
}
function validatePointsPayment(req: PaymentRequest) {
    if (!req.points) throw PAYMENT_ERR.POINT_REQUIRED;
    if (req.points < req.amount) throw PAYMENT_ERR.INSUFFICIENT_POINT;
}

function calculatePayment(req: PaymentRequest) {
    const handler = paymentHandler[req.method];
    return handler(req);
}

function handleCardPayment(req: PaymentRequest) {
    const fee = req.amount * 0.03; // 3% 수수료
    const total = req.amount + fee;
    return { fee, total };
}

function handleBankPayment(req: PaymentRequest) {
    const fee = 500; // 고정 수수료
    const total = req.amount + fee;
    return { fee, total };
}

function handlePointsPayment(req: PaymentRequest) {
    const fee = 0; // 수수료 없음
    const total = req.amount;
    return { fee, total };
}

function printProcess(method: PaymentMethod, total: number) {
    console.log(`Processing ${method} ${method === 'points' ? 'transfer' : 'payment'}: ${total}`);
}

/**
  📊 오늘의 학습 리뷰

  ✅ 발견한 코드 스멜

  - Switch Statement: 결제 타입별 분기 처리가 여러 곳에 산재
  - Duplicate Code: 각 결제 수단별 검증/처리 로직의 반복 패턴
  - Long Method: processPayment에서 검증, 계산, 로깅을 모두 처리
  - Primitive Obsession: method를 문자열로 관리하여 타입 안정성 부족

  ✅ 적용한 리팩토링 기법

  - Extract Type: PaymentMethod 타입으로 허용값 명시
  - Extract Function: 검증/계산/로깅을 독립 함수로 분리
  - Replace Conditional with Polymorphism: switch → Record 객체 매핑
  - Introduce Type Predicate: isValidPaymentMethod로 타입 가드 구현
  - Consolidate Duplicate Conditional Fragments: 공통 에러 메시지를 상수로 추출

  ✅ 학습한 개념

  - Strategy Pattern: 결제 수단별 알고리즘을 객체로 캡슐화
  - Type Predicate: TypeScript의 is 키워드로 런타임 타입 보장
  - Lookup Table Pattern: Record를 활용한 분기 로직 단순화
  - Open/Closed Principle: 새 결제 수단 추가 시 기존 코드 수정 최소화
  - Separation of Concerns: 검증/계산/출력 책임을 명확히 분리
 */
