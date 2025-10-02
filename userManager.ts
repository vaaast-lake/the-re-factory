// 사용자 관리 시스템

interface User {
    email: string;
    name: string;
    age: number;
}

type ActionType = 'create' | 'update' | 'delete';

export class UserManager {
    processUser(user: User, action: ActionType) {
        if (!isValidUser(user)) return false;
        handleUser(action, user);
    }
}

type ValidHandler = (user: User) => boolean;
const USER_VALID_CHECK_PROPS = {
    email: 'email',
    name: 'name',
    age: 'age',
} as const;
type UserPropType =
    (typeof USER_VALID_CHECK_PROPS)[keyof typeof USER_VALID_CHECK_PROPS];

const validationHandlers: Record<UserPropType, ValidHandler> = {
    email: isValidUserEmail,
    name: isValidUserName,
    age: isValidUserAge,
};

const getObjKeys = <T>(obj: T) => Object.keys(obj) as (keyof T)[];

function isValidUser(user: User): boolean {
    const userKeys = getObjKeys(USER_VALID_CHECK_PROPS);
    return userKeys.every((props) => validationHandlers[props](user));
}

function isValidUserEmail(user: User): boolean {
    if (!user.email || user.email === '') {
        console.log('Error: Email is required');
        return false;
    }
    return true;
}
function isValidUserName(user: User): boolean {
    if (!user.name || user.name === '') {
        console.log('Error: Name is required');
        return false;
    }
    return true;
}
function isValidUserAge(user: User): boolean {
    if (!user.age || user.age < 0 || user.age > 150) {
        console.log('Error: Invalid age');
        return false;
    }
    return true;
}

type UserHandler = (user: User) => boolean;
const actionHandlers: Record<ActionType, UserHandler> = {
    create: createUser,
    update: updateUser,
    delete: deleteUser,
};

function handleUser(action: ActionType, user: User): void {
    const actionHandler = actionHandlers[action];
    actionHandler(user);
}

function createUser(user: User): boolean {
    console.log('Creating user...');
    logUserInfo(user, 'name', 'age', 'email');
    // DB 저장 로직
    console.log('User created successfully!');
    return true;
}

function updateUser(user: User): boolean {
    console.log('Updating user...');
    logUserInfo(user, 'name', 'age', 'email');
    // DB 업데이트 로직
    console.log('User updated successfully!');
    return true;
}

function deleteUser(user: User): boolean {
    console.log('Deleting user...');
    logUserInfo(user, 'email');
    // DB 삭제 로직
    console.log('User deleted successfully!');
    return true;
}

function logUserInfo(user: User, ...options: UserPropType[]): void {
    options.forEach((option) => console.log(`User ${option}: ${user[option]}`));
}

/**
 *  🎉 오늘의 학습 리뷰

  ✅ 발견한 코드 스멜

  1. Long Method (긴 메서드)
    - 초기 processUser 메서드가 검증, 액션 처리, 로깅 등 너무 많은 책임을 가짐
  2. Duplicate Code (중복 코드)
    - 사용자 정보 로깅 코드가 createUser, updateUser에서 반복됨
  3. Primitive Obsession (원시 타입 집착)
    - user: any 타입으로 타입 안정성 부족
    - action: string으로 오타 가능성 존재
  4. Switch Statements (조건문 남용)
    - if-else 체인으로 새 액션 추가 시 여러 곳 수정 필요

  ✅ 적용한 리팩토링 기법

  1. Extract Method (메서드 추출)
    - isValidUser(): 검증 로직 분리
    - isValidUserEmail/Name/Age(): 각 필드별 검증 분리
    - logUserInfo(): 중복 로깅 로직 추출
    - handleUser(): 액션 처리 로직 분리
  2. Replace Type Code with Polymorphism (다형성으로 타입 코드 대체)
    - if-else 체인 → actionHandlers 객체 매핑 (Strategy 패턴의 기본 아이디어)
  3. Introduce Parameter Object (매개변수 객체 도입)
    - User 인터페이스 정의로 타입 안정성 확보
    - ActionType 유니온 타입으로 허용 값 제한
  4. Replace Magic String with Constant (매직 스트링을 상수로 대체)
    - USER_VALID_CHECK_PROPS 상수로 검증 필드 명시

  ✅ 사용한 디자인 패턴

  1. Strategy Pattern (전략 패턴의 기본 아이디어)
    - actionHandlers 객체로 액션별 처리 전략 분리
    - 새로운 액션 추가 시 객체에 항목만 추가하면 됨
  2. Single Responsibility Principle (단일 책임 원칙)
    - 각 함수가 하나의 명확한 책임만 가짐
    - 검증, 액션 처리, 로깅이 각각 분리됨

  ---
  💪 잘한 점

  - 타입 안정성: User 인터페이스와 ActionType으로 컴파일 타임 안전성 확보
  - 확장성: 새로운 액션이나 검증 규칙 추가가 매우 쉬워짐
  - 가독성: 각 함수가 작고 명확한 이름으로 의도를 표현
  - 재사용성: getObjKeys, logUserInfo 같은 유틸리티 함수 작성
  - 고급 TypeScript 활용: 제네릭, keyof, typeof, Record 타입 적절히 사용
  - 방어적 프로그래밍: USER_VALID_CHECK_PROPS를 신뢰할 수 있는 단일 소스로 사용

  ---
  🎯 개선 포인트

  실제 프로덕션 환경에서 고려할 점들:

  1. 에러 처리 개선
    - 현재는 console.log로만 에러 표시
    - 실무에서는 에러를 반환하거나 throw하는 것이 좋음
  2. 검증 메시지 개선
    - 각 검증 함수의 에러 메시지를 더 구체적으로
    - 예: "Email is required" → "User email is required and must be a valid email format"
  3. Return 값 일관성
    - processUser가 false만 반환하고 성공 시 undefined 반환
    - 명시적으로 return true 추가 고려

  ---
  📚 더 공부하면 좋을 것

  1. Strategy Pattern: 오늘 사용한 패턴의 정식 구현 방법
  2. Chain of Responsibility Pattern: 검증을 체인으로 연결하는 방법
  3. Builder Pattern: 복잡한 객체 생성 시 유용
  4. Result Type: 에러 처리를 더 안전하게 하는 함수형 패턴
 */
