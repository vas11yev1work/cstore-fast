import axios  from 'axios'
import { OrderTypes, PaymentConfirmation, Size } from '@/types/api.types'

const Service = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_URL || 'http://localhost:3000'
})

export class ApiService {
  async getOrder(token: string): Promise<OrderTypes> {
    try {
      const { data } = await Service.get<OrderTypes>(`/order/fast-view/${token}`)
      return data
    } catch {
      throw new Error(`Заказ не найден`)
    }
  }
  async payByToken(token: string): Promise<PaymentConfirmation> {
    try {
      const { data } = await Service.post<PaymentConfirmation>(`/payments/pay-by-token/${token}`)
      return data
    } catch {
      throw new Error('Произошла ошибка при попытке оплаты')
    }
  }
  async getSizes(): Promise<Size[]> {
    try {
      const { data } = await Service.get<Size[]>('/item-size')
      return data
    } catch {
      throw new Error('Произошла ошибка при получении размеров')
    }
  }
}