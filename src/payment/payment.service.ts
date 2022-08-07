import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/createPayment.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>
  ) {}
  async createPayment(createPaymentDto: CreatePaymentDto) {
    const order = await this.orderRepository.findOneOrFail({
      where: {
        id_order: createPaymentDto.id_order
      }
    })
    const hasil = new Payment()
    hasil.nama_bank = createPaymentDto.nama_bank
    hasil.no_rek = createPaymentDto.no_rek
    hasil.gambar_bukti = createPaymentDto.gambar
    hasil.order = order
    await this.paymentRepository.insert(hasil)
    const data = await this.paymentRepository.findOneOrFail({
      where: {
        id_payment: hasil.id_payment
      }
    })
  }
}
