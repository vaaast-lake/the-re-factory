interface Task {
    title: string;
    done: boolean;
    deleted: boolean;
    completedAt: Date;
    deletedAt: Date | null;
    archived: boolean;
    archivedAt: Date;
}

type TaskStatus = 'complete' | 'delete' | 'restore' | 'archive';
type TaskHandler = (task: Task) => void;

const handleComplete = (task: Task): void => {
    task.done = true;
    task.completedAt = new Date();
};

const handleDelete = (task: Task): void => {
    task.deleted = true;
    task.deletedAt = new Date();
};

const handleRestore = (task: Task): void => {
    task.deleted = false;
    task.deletedAt = null;
};

const handleArchive = (task: Task): void => {
    task.archived = true;
    task.archivedAt = new Date();
};

const handler: Record<TaskStatus, TaskHandler> = {
    complete: handleComplete,
    delete: handleDelete,
    restore: handleRestore,
    archive: handleArchive,
};

const printProcess = (task: Task, status: TaskStatus) => {
    console.log(`Todo ${status}: ${task.title}`);
};

function processTodo(task: Task, status: TaskStatus) {
    handler[status](task);
    printProcess(task, status);
    return task;
}

/**
  📊 오늘의 학습 리뷰

  ✅ 발견한 코드 스멜

  - Mysterious Name: t, s 같은 불명확한 변수명
  - Duplicate Code: 반복되는 로그 메시지 패턴
  - Long Method: if-else 체인으로 길어지는 함수
  - Shotgun Surgery: 새 기능 추가 시 여러 곳 수정 필요

  ✅ 적용한 리팩토링 기법

  - Rename Variable: t → task, s → status
  - Extract Function: 각 상태 처리를 독립 함수로 분리
  - Replace Conditional with Polymorphism: if-else → 객체 매핑
  - Extract Function: 로그 출력을 별도 함수로 분리

  ✅ 학습한 개념

  - Strategy Pattern: 동작을 객체로 관리하는 디자인 패턴
  - Type Safety: Record<K, V>로 컴파일 타임 안정성 확보
  - Open/Closed Principle: 확장에는 열려있고 수정에는 닫혀있는 설계
 */