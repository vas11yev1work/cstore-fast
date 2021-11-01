export interface OrderTypes {
  readonly id: number
  readonly items: OrderItemAttributes[]
  readonly address: AddressInfoAttributes
  readonly status: OrderStatus
  readonly paymentMethod: PaymentMethod
  readonly deliveryMethod: DeliveryMethod
  readonly trackCode: string
  readonly history: OrderStatusHistoryEntry[] | null
  readonly paymentInformation: PaymentInformation | null
  readonly paid: string
  readonly openedAt: string
  readonly total: string
}

export interface AddressInfoAttributes {
  id: number
  user?: any
  country: string
  city: string
  address1: string
  address2?: string
  email?: string
  phone?: string
  zip?: string
}

export interface PaymentAmount {
  value: string
  currency: string
}

export interface RefundInfo {
  id: string;
  payment_id: string;
  status: PaymentStatus;
  amount: PaymentAmount;
}

export interface PaymentInformation {
  id: string;
  status: PaymentStatus;
  amount: PaymentAmount;
  lastUpdatedAt: Date;
  confirmation: PaymentConfirmation;
  refunds: RefundInfo[];
  cancellation_details: CancellationDetails;
  previous: ArchivedPayment[];
}

export interface PaymentConfirmation {
  type: ConfirmationType
  confirmation_url?: string
  confirmation_data?: string
  confirmation_token?: string

}

export interface CancellationDetails {
  party: string
  reason: string
}

export interface ArchivedPayment {
  id: string
  status: PaymentStatus
  amount: PaymentAmount
  cancellation_details: CancellationDetails
}


export interface OrderStatusHistoryEntry {
  date: Date
  status: OrderStatus
  action: OrderAction
  metadata: any
  comment: string
}

export interface OrderItemAttributes {
  readonly amount: number
  readonly sizeId: number
  readonly catalogItem: CatalogItemArchivedAttributes
}

export interface CatalogItemArchivedAttributes {
  readonly id: number
  readonly name: string
  readonly description: string
  readonly price: string
  readonly discount: number
  readonly photos: string[]
  readonly sex: Sex
  readonly metadata: any
  readonly itemCategories: ItemCategory[]
  readonly itemColors: ItemColor[]
}

export interface ItemCategory {
  id: number
  name: string
  picture: string
}

export interface ItemColor {
  id: number
  color: string
  name: string
}

export enum OrderAction {
  NONE = 'none',
  ADD_ITEMS = 'add_items',
  REMOVE_ITEMS = 'remove_items',
  CHANGE_INFO = 'change_info',
  PAYMENT_CREATED = 'payment_created',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAIL = 'payment_fail',
}

export enum OrderStatus {
  CREATED = 'created',
  WAITING_FOR_PAYMENT = 'waiting_for_payment',
  PROCESSING = 'processing',
  WAITING_FOR_SHIPPING = 'waiting_for_shipping',
  SHIPPING = 'shipping',
  WAITING_FOR_PICKUP = 'waiting_for_pickup',
  FINISHED = 'finished',
  CANCELED = 'canceled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  WAITING_FOR_CAPTURE = 'waiting_for_capture',
  SUCCEEDED = 'succeeded',
  CANCELED = 'canceled',
}

export enum PaymentMethod {
  NONE = 'none',
  YOOMONEY = 'yoomoney',
  PAY_ON_DELIVERY = 'pay_on_delivery',
}

export enum DeliveryMethod {
  RUSSIAN_POST = 'RussianPost',
}

export enum Sex {
  MALE = 'male',
  FEMALE = 'female',
  UNISEX = 'unisex'
}

export enum ConfirmationType {
  REDIRECT = 'redirect',
  EMBEDDED = 'embedded'
}

export interface Size {
  id: number
  size: number
  sizeName: string
}
