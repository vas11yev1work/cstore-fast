import axios  from 'axios'
import { OrderTypes, PaymentConfirmation } from '@/types/order.types'

export class OrderService {
  async getOrder(token: string): Promise<OrderTypes> {
    try {
      const { data } = await axios.get<OrderTypes>(`https://api.4be.site/order/fast-view/${token}`)
      return data
    } catch {
      throw new Error(`Заказ не найден`)
    }
  }
  async payByToken(token: string): Promise<PaymentConfirmation> {
    try {
      const { data } = await axios.post<PaymentConfirmation>(`https://api.4be.site/payments/pay-by-token/${token}`)
      return data
    } catch {
      throw new Error('Произошла ошибка при попытке оплаты')
    }
  }
}