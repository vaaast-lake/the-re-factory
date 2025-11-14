# 학습 진도 기록

## 메타 정보

- 마지막 업데이트: 2025-10-09
- 총 세션: 5
- 현재 레벨: 중급

---

## 📊 코드 스멜 출제 횟수

### Bloaters (비대해진 코드)
- Long Method: 5
- Large Class: 0
- Primitive Obsession: 2
- Long Parameter List: 0
- Data Clumps: 0

### Object-Orientation Abusers (객체지향 원칙 위반)
- Switch Statements: 5
- Temporary Field: 0
- Refused Bequest: 0
- Alternative Classes with Different Interfaces: 0

### Change Preventers (변경 방해 요소)
- Divergent Change: 0
- Shotgun Surgery: 2
- Parallel Inheritance Hierarchies: 0

### Dispensables (불필요한 요소)
- Comments: 0
- Duplicate Code: 5
- Lazy Class: 0
- Data Class: 0
- Dead Code: 0
- Speculative Generality: 0

### Couplers (과도한 결합)
- Feature Envy: 1
- Inappropriate Intimacy: 0
- Message Chains: 0
- Middle Man: 0

### Other (기타)
- Mysterious Name: 1
- Arrow Anti-pattern: 1
- Copy-Paste Bugs: 1

---

## 🔧 리팩토링 기법 출제 횟수

### Composing Methods (메서드 구성)
- Extract Method: 4
- Inline Method: 0
- Extract Variable: 1
- Inline Temp: 0
- Replace Temp with Query: 0
- Split Temporary Variable: 0
- Remove Assignments to Parameters: 0
- Replace Method with Method Object: 0
- Substitute Algorithm: 0

### Moving Features Between Objects (객체 간 기능 이동)
- Move Method: 1
- Move Field: 0
- Extract Class: 1
- Inline Class: 0
- Hide Delegate: 0
- Remove Middle Man: 0
- Introduce Foreign Method: 0
- Introduce Local Extension: 0

### Organizing Data (데이터 구성)
- Self Encapsulate Field: 0
- Change Value to Reference: 0
- Change Reference to Value: 0
- Replace Array with Object: 0
- Duplicate Observed Data: 0
- Change Unidirectional Association to Bidirectional: 0
- Change Bidirectional Association to Unidirectional: 0
- Replace Magic Number with Symbolic Constant: 1
- Encapsulate Field: 0
- Encapsulate Collection: 0
- Replace Type Code with Class/Subclasses/State-Strategy: 2
- Replace Subclass with Fields: 0

### Simplifying Conditional Expressions (조건식 단순화)
- Decompose Conditional: 0
- Consolidate Conditional Expression: 0
- Consolidate Duplicate Conditional Fragments: 1
- Remove Control Flag: 0
- Replace Nested Conditional with Guard Clauses: 0
- Replace Conditional with Polymorphism: 5
- Introduce Null Object: 0
- Introduce Assertion: 0

### Simplifying Method Calls (메서드 호출 단순화)
- Rename Method: 1
- Add Parameter: 0
- Remove Parameter: 0
- Separate Query from Modifier: 0
- Parameterize Method: 0
- Replace Parameter with Explicit Methods: 0
- Preserve Whole Object: 0
- Replace Parameter with Method Call: 0
- Introduce Parameter Object: 1
- Remove Setting Method: 0
- Hide Method: 0
- Replace Constructor with Factory Method: 1
- Replace Error Code with Exception: 0
- Replace Exception with Test: 0

### Dealing with Generalization (일반화 처리)
- Pull Up Method/Field: 1
- Push Down Method/Field: 0
- Pull Up Constructor Body: 0
- Extract Superclass: 0
- Extract Interface: 0
- Extract Subclass: 0
- Collapse Hierarchy: 0
- Form Template Method: 1
- Replace Inheritance with Delegation: 0
- Replace Delegation with Inheritance: 0

### Other (기타)
- Introduce Type Predicate: 1
- Higher-Order Functions: 1

---

## 🎨 디자인 패턴 출제 횟수

### Creational (생성 패턴)
- Factory Method: 1
- Abstract Factory: 0
- Builder: 0
- Prototype: 0
- Singleton: 0

### Structural (구조 패턴)
- Adapter: 0
- Bridge: 0
- Composite: 0
- Decorator: 0
- Facade: 0
- Flyweight: 0
- Proxy: 0

### Behavioral (행위 패턴)
- Chain of Responsibility: 0
- Command: 0
- Iterator: 0
- Mediator: 0
- Memento: 0
- Observer: 0
- State: 0
- Strategy: 4
- Template Method: 1
- Visitor: 0

### Other (기타)
- Registry: 3
- Dependency Injection: 1
- Lookup Table: 1

---

## 📈 학습 분석

### 강점 영역
- **Replace Conditional with Polymorphism**: 5회 - 조건문을 다형성으로 전환하는 패턴 숙달
- **Long Method 해결**: 5회 - 긴 메서드 리팩토링에 익숙
- **Duplicate Code 제거**: 5회 - 중복 코드 발견 및 제거 능력
- **Strategy Pattern**: 4회 - 전략 패턴 활용에 자신감
- **Extract Method**: 4회 - 메서드 추출에 익숙함

### 미학습 영역

**우선순위 높음 (실무 필수):**
- **Couplers 카테고리**: Inappropriate Intimacy, Message Chains, Middle Man (Feature Envy는 완료)
- **Moving Features Between Objects**: Move Field, Hide Delegate, Inline Class (Move Method, Extract Class는 완료)
- **Structural 패턴 전체**: Decorator, Adapter, Facade 등 (실무 필수, 완전 미학습)
- **Creational 패턴**: Abstract Factory, Builder (Factory Method는 완료)

**우선순위 중간:**
- Data Clumps (Bloaters)
- Large Class (Bloaters)
- Divergent Change (Change Preventers)
- Extract Variable, Inline Method (Composing Methods)
- Organizing Data 카테고리 대부분

**우선순위 낮음:**
- Generalization 관련 고급 기법들
- Simplifying Method Calls의 세부 기법들
- Behavioral 패턴 중 Observer, Command, State 등

---

## 🎯 다음 학습 추천

### 1순위: Structural 패턴 (완전 미학습, 실무 핵심)
**추천 문제:** Decorator 패턴 적용 문제
- 이유: 실무에서 가장 자주 사용하는 구조 패턴 중 하나
- 시나리오 예: 로깅, 캐싱, 권한 검증 등 기능을 동적으로 추가
- 연계: 기능 확장 시 상속 대신 조합 사용 학습

**대안:** Adapter 패턴
- 이유: 외부 라이브러리 통합 시 필수 패턴
- 시나리오 예: 서드파티 API를 내부 인터페이스에 맞게 래핑
- 연계: Interface 분리 및 의존성 역전 원칙 학습

### 2순위: Couplers 카테고리 계속
**추천 문제:** Message Chains 문제
- 이유: `a.getB().getC().getD()` 형태의 체이닝은 실무에서 자주 발생
- 연계: Hide Delegate 리팩토링 기법 학습 가능
- 난이도: 중급에 적합

**대안:** Inappropriate Intimacy
- 이유: 클래스 간 과도한 결합 문제
- 연계: Move Method, Move Field 심화 학습

### 3순위: Data Clumps + Large Class
**추천 문제:** 거대한 클래스에서 항상 함께 다니는 데이터 분리
- 이유: Data Clumps와 Large Class를 동시에 경험 가능
- 연계: Extract Class 심화, Introduce Parameter Object 복습
- 실무 연관: 도메인 모델 설계 능력 향상

---

## 📝 세션 이력 요약

### Session 1: handler.ts (초급)
- 코드 스멜: Mysterious Name, Duplicate Code, Long Method, Shotgun Surgery
- 리팩토링: Rename Variable, Extract Function, Replace Conditional with Polymorphism
- 패턴: Strategy, Registry

### Session 2: payment.ts (초-중급)
- 코드 스멜: Switch Statements, Duplicate Code, Long Method, Primitive Obsession
- 리팩토링: Extract Type, Extract Function, Replace Conditional with Polymorphism, Introduce Type Predicate
- 패턴: Strategy, Lookup Table

### Session 3: userManager.ts (중급)
- 코드 스멜: Long Method, Duplicate Code, Primitive Obsession, Switch Statements
- 리팩토링: Extract Method, Replace Type Code with Polymorphism, Introduce Parameter Object
- 패턴: Strategy

### Session 4: notificationSystem.ts (중급)
- 코드 스멜: Duplicate Code, Long Method, Switch Statements, Arrow Anti-pattern, Copy-Paste Bugs
- 리팩토링: Extract Method, Template Method, Registry, Higher-Order Functions
- 패턴: Strategy, Template Method, Registry, Dependency Injection

### Session 5: OrderService.ts (중급)
- 코드 스멜: Feature Envy, Switch Statements, Shotgun Surgery, Long Method, Duplicate Code
- 리팩토링: Move Method, Extract Class, Pull Up Method, Replace Constructor with Factory Method, Replace Conditional with Polymorphism
- 패턴: Factory Method, Template Method
- 특이사항:
  - Feature Envy 첫 경험 (Couplers 카테고리 진입)
  - Move Method, Extract Class, Pull Up Method 첫 경험 (Moving Features & Generalization)
  - Factory Method 패턴 첫 경험 (Creational 패턴 진입)
  - OrderService의 조건문 100% 제거 (85줄 → 0줄)
