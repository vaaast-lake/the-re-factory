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
    constructor(
        public id: number,
        public name: string,
        public productType: ProductType,
        public stock: number,
        public price: number
    ) {}

    abstract canOrder(quantity: number): OrderResult;

    isEmpty() {
        return this.stock === 0;
    }

    get getStock() {
        return this.stock;
    }

    get getId() {
        return this.id;
    }

    deductStock(quantity: number) {
        if (this.getStock < quantity) return false;

        this.stock -= quantity;
        return true;
    }

    addStock(quantity: number) {
        this.stock += quantity;
    }
}

class RegularProduct extends Product {
    constructor(
        id: number,
        name: string,
        productType: ProductType,
        stock: number,
        price: number
    ) {
        super(id, name, productType, stock, price);
    }

    canOrder(quantity: number) {
        if (this.getStock < quantity)
            return {
                success: false,
                message: `재고 부족: ${this.name} (남은 재고: ${this.stock})`,
            };

        return { success: true, message: '' };
    }
}

class LimitedProduct extends Product {
    constructor(
        id: number,
        name: string,
        productType: ProductType,
        stock: number,
        price: number,
        public releaseDate: Date
    ) {
        super(id, name, productType, stock, price);
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
}

class SubscriptionProduct extends Product {
    constructor(
        id: number,
        name: string,
        productType: ProductType,
        stock: number,
        price: number,
        public subscriptionPeriod: number
    ) {
        super(id, name, productType, stock, price);
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
}

class ProductFactory {
    private static nextId = 1;

    static create(payload: ProductDTO) {
        const { name, productType, stock, price } = payload;

        switch (payload.productType) {
            case ProductType.Regular:
                return new RegularProduct(
                    this.nextId++,
                    name,
                    productType,
                    stock,
                    price
                );

            case ProductType.Limited:
                const { releaseDate } = payload;

                return new LimitedProduct(
                    this.nextId++,
                    name,
                    productType,
                    stock,
                    price,
                    releaseDate
                );

            case ProductType.Subscription:
                const { subscriptionPeriod } = payload;
                return new SubscriptionProduct(
                    this.nextId++,
                    name,
                    productType,
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
    productId: string;
    quantity: number;
}

class OrderService {
    private products: Map<string, Product>;

    constructor() {
        this.products = new Map();
    }

    // 주문 처리
    processOrder(items: OrderItem[]): OrderResult {
        for (const item of items) {
            const product = this.products.get(item.productId);

            if (!product) {
                return {
                    success: false,
                    message: `상품을 찾을 수 없습니다: ${item.productId}`,
                };
            }

            // 재고 확인 로직 - 여기가 문제!
            if (product.type === 'regular') {
                if (product.stock < item.quantity) {
                    return {
                        success: false,
                        message: `재고 부족: ${product.name} (남은 재고: ${product.stock})`,
                    };
                }
            } else if (product.type === 'limited') {
                const now = new Date();
                if (product.releaseDate && now < product.releaseDate) {
                    return {
                        success: false,
                        message: `한정판은 ${product.releaseDate.toLocaleDateString()}부터 구매 가능합니다`,
                    };
                }
                if (product.stock < item.quantity) {
                    return {
                        success: false,
                        message: `한정판 재고 부족: ${product.name} (남은 재고: ${product.stock})`,
                    };
                }
            } else if (product.type === 'subscription') {
                if (item.quantity > 1) {
                    return {
                        success: false,
                        message: '구독 상품은 1개만 구매 가능합니다',
                    };
                }
                if (
                    product.subscriptionPeriod &&
                    product.subscriptionPeriod < 1
                ) {
                    return {
                        success: false,
                        message: '구독 기간이 유효하지 않습니다',
                    };
                }
            }
        }

        // 재고 차감
        for (const item of items) {
            const product = this.products.get(item.productId);
            if (!product) continue;

            if (product.type === 'regular') {
                product.stock -= item.quantity;
            } else if (product.type === 'limited') {
                product.stock -= item.quantity;
                if (product.stock === 0) {
                    console.log(`한정판 품절: ${product.name}`);
                }
            } else if (product.type === 'subscription') {
                // 구독 상품은 재고 차감하지 않음
                console.log(
                    `구독 시작: ${product.name}, 기간: ${product.subscriptionPeriod}개월`
                );
            }
        }

        return { success: true, message: '주문 완료' };
    }

    // 재고 보고서 생성
    generateStockReport(): string {
        let report = '=== 재고 현황 ===\n';

        this.products.forEach((product) => {
            if (product.type === 'regular') {
                report += `${product.name}: ${product.stock}개 (일반 상품)\n`;
            } else if (product.type === 'limited') {
                const status = product.stock > 0 ? '판매중' : '품절';
                report += `${product.name}: ${product.stock}개 (한정판, ${status})\n`;
            } else if (product.type === 'subscription') {
                report += `${product.name}: 구독 상품 (${product.subscriptionPeriod}개월 플랜)\n`;
            }
        });

        return report;
    }

    addProduct(product: Product): void {
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
