// src/services/OrderService.ts

type OrderResult =
    | { success: true; message: string }
    | { success: false; message: string };

// interface Product {
//     id: string;
//     name: string;
//     productType: ProductType;
//     stock: number;
//     price: number;
//     canOrder: (quantity: number) => boolean;
// }

enum ProductType {
    Regular = 'regular',
    Limited = 'limited',
    Subscription = 'subscription',
}

interface RegularProductDTO {
    productType: ProductType.Regular;
    name: string;
    stock: number;
    price: number;
}

interface LimitedProductDTO extends Omit<RegularProductDTO, 'productType'> {
    productType: ProductType.Limited;
    releaseDate: Date;
}
interface SubscriptionProductDTO
    extends Omit<RegularProductDTO, 'productType'> {
    productType: ProductType.Subscription;
    subscriptionPeriod: number;
}

type ProductDTO =
    | RegularProductDTO
    | LimitedProductDTO
    | SubscriptionProductDTO;

abstract class Product {
    abstract readonly type: ProductType;

    constructor(
        public id: number,
        public name: string,
        public stock: number,
        public price: number
    ) {}

    abstract canOrder(quantity: number): OrderResult;

    abstract afterOrder(): void;

    isEmpty() {
        return this.stock === 0;
    }

    get getStock() {
        return this.stock;
    }

    get getId() {
        return this.id;
    }

    fulfillOrder(quantity: number) {
        this.stock -= quantity;
        return true;
    }

    addStock(quantity: number) {
        this.stock += quantity;
    }
}

class RegularProduct extends Product {
    readonly type = ProductType.Regular;

    constructor(id: number, name: string, stock: number, price: number) {
        super(id, name, stock, price);
    }

    canOrder(quantity: number) {
        if (this.getStock < quantity)
            return {
                success: false,
                message: `재고 부족: ${this.name} (남은 재고: ${this.stock})`,
            };

        return { success: true, message: '' };
    }

    afterOrder() {
        if (this.isEmpty()) console.log(`재고 없음: ${this.name}`);
        else console.log(`${this.name}의 남은 재고: ${this.getStock}개`);
    }
}

class LimitedProduct extends Product {
    readonly type = ProductType.Limited;

    constructor(
        id: number,
        name: string,
        stock: number,
        price: number,
        public releaseDate: Date
    ) {
        super(id, name, stock, price);
        this.releaseDate = releaseDate;
    }

    canOrder(quantity: number) {
        const now = new Date();
        if (this.releaseDate > now)
            return {
                success: false,
                message: `한정판은 ${this.releaseDate.toLocaleDateString()}부터 구매 가능합니다`,
            };
        else if (this.getStock < quantity)
            return {
                success: false,
                message: `재고 부족: ${this.name} (남은 재고: ${this.stock})`,
            };

        return { success: true, message: '' };
    }

    afterOrder() {
        if (this.isEmpty()) console.log(`한정판 품절: ${this.name}`);
        else console.log(`${this.name}의 남은 재고: ${this.getStock}개`);
    }
}

class SubscriptionProduct extends Product {
    readonly type = ProductType.Subscription;

    constructor(
        id: number,
        name: string,
        stock: number,
        price: number,
        public subscriptionPeriod: number
    ) {
        super(id, name, stock, price);
        this.subscriptionPeriod = subscriptionPeriod;
    }

    canOrder(quantity: number) {
        if (quantity > 1)
            return {
                success: false,
                message: '구독 상품은 1개만 구매 가능합니다',
            };
        if (this.subscriptionPeriod < 1)
            return {
                success: false,
                message: '구독 기간이 유효하지 않습니다',
            };

        return { success: true, message: '' };
    }

    fulfillOrder() {
        console.log(`구독이 신청되었습니다.`);
        return true;
    }

    afterOrder() {
        console.log(
            `구독 시작: ${this.name}, 기간: ${this.subscriptionPeriod}개월`
        );
    }
}

class ProductFactory {
    private static nextId = 1;

    static create(
        payload: ProductDTO
    ): RegularProduct | LimitedProduct | SubscriptionProduct {
        const { name, stock, price } = payload;

        switch (payload.productType) {
            case ProductType.Regular:
                return new RegularProduct(this.nextId++, name, stock, price);

            case ProductType.Limited:
                const { releaseDate } = payload;

                return new LimitedProduct(
                    this.nextId++,
                    name,
                    stock,
                    price,
                    releaseDate
                );

            case ProductType.Subscription:
                const { subscriptionPeriod } = payload;
                return new SubscriptionProduct(
                    this.nextId++,
                    name,
                    stock,
                    price,
                    subscriptionPeriod
                );

            default:
                console.log('There is no Product type.');
                break;
        }
    }
}

interface OrderItem {
    productId: number;
    quantity: number;
}

class OrderService {
    private products: Map<
        number,
        RegularProduct | LimitedProduct | SubscriptionProduct
    >;

    constructor() {
        this.products = new Map();
    }

    // 주문 처리
    processOrder(items: OrderItem[]): OrderResult {
        for (const item of items) {
            const product = this.products.get(item.productId);

            if (!product)
                return {
                    success: false,
                    message: `상품을 찾을 수 없습니다: ${item.productId}`,
                };

            const orderCheck = product.canOrder(item.quantity);
            if (orderCheck.success === false) return orderCheck;
        }

        // 재고 차감
        for (const item of items) {
            const product = this.products.get(item.productId);
            if (!product) continue;

            product.fulfillOrder(item.quantity);
            product.afterOrder();
        }

        return { success: true, message: '주문 완료' };
    }

    // 재고 보고서 생성
    generateStockReport(): string {
        let report = '=== 재고 현황 ===\n';

        this.products.forEach((product) => {
            if (product.type === ProductType.Regular) {
                report += `${product.name}: ${product.stock}개 (일반 상품)\n`;
            } else if (product.type === ProductType.Limited) {
                const status = product.stock > 0 ? '판매중' : '품절';
                report += `${product.name}: ${product.stock}개 (한정판, ${status})\n`;
            } else if (product.type === ProductType.Subscription) {
                report += `${product.name}: 구독 상품 (${product.subscriptionPeriod}개월 플랜)\n`;
            }
        });

        return report;
    }

    addProduct(payload: ProductDTO): void {
        const product = ProductFactory.create(payload);
        this.products.set(product.id, product);
    }
}

/**
  🎯 요구사항

  1. 비즈니스: 다음 달에 "대여 상품" 타입이 추가될 예정입니다
  2. 유지보수성: 상품 타입별 재고 관리 로직이 명확하게 분리되어야 합니다
  3. 확장성: 새로운 상품 타입 추가 시 기존 코드 수정을 최소화해야 합니다
  4. 테스트: 각 상품 타입의 재고 검증 로직을 독립적으로 테스트할 수 있어야
  합니다

  ❓ 미션

  1단계: 이 코드에서 발견되는 코드 스멜을 모두 찾아보세요.
  - 어떤 메서드가 어떤 클래스의 데이터를 과도하게 사용하고 있나요?
  - 조건문은 어떤 문제를 만들고 있나요?
  - 새로운 상품 타입을 추가하려면 몇 군데를 수정해야 할까요?

  준비되셨으면 1단계부터 시작해보세요! 발견한 코드 스멜을 말씀해주시면 함께
  분석해보겠습니다.
 */
