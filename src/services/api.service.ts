import axios  from 'axios'
import { OrderTypes, PaymentConfirmation, Size } from '@/types/api.types'

export class ApiService {
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
  async getSizes(): Promise<Size[]> {
    try {
      const { data } = await axios.get<Size[]>('https://api.4be.site/item-size')
      return data
    } catch {
      throw new Error('Произошла ошибка при получении цветов')
    }
  }
}