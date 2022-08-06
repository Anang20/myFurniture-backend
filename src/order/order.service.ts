import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { cartDetail } from 'src/cart/entities/cart-detail.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Alamat } from 'src/users/entities/alamat.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { resourceLimits } from 'worker_threads';
import { CreateOngkirDto } from './dto/createOngkir.dto';
import { managementOngkir } from './entities/management-ongkir.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(managementOngkir)
        private ongkirRepository : Repository<managementOngkir>,
        @InjectRepository(Order)
        private orderRepository : Repository<Order>,
        @InjectRepository(Alamat)
        private alamatRepository : Repository<Alamat>,
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        @InjectRepository(cartDetail)
        private cartDetailRepository: Repository<cartDetail>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    async createDefaultOngkir(createOngkirDto : CreateOngkirDto){
        const hasil = await this.ongkirRepository.insert(createOngkirDto)
        return this.ongkirRepository.findOneOrFail({
            where: {
                id_harga_kirim : hasil.identifiers[0].id_harga_kirim
            }
        })
    }
    
    async createOrder(id_card_detail: string){
        
    }

    async createOngkirTotal(id_alamat: string){
        const alamat = await this.alamatRepository.findOneOrFail({
            where : {
                id_alamat_user : id_alamat
            }
        })
        const user = await this.userRepository.findOne({
            where: {
                role: 1
            },
            relations: {
                alamat: true
            }
        })
        const alamatAdmin = user.alamat[0]
        const latAdmin = alamatAdmin.latitude
        const longAdmin = alamatAdmin.longtitude
        const latUser = alamat.latitude
        const longUser = alamat.longtitude
        const ongkir = await this.ongkirRepository.findOne({
            where: {
                id_harga_kirim : 1
            }
        })
        const harga_kirim = ongkir.harga_kirim / ongkir.jarak
        const hitungJarak = (lat, long, lat2, long2, ongkir) => {
            var haversine = require("haversine-distance");

            //First point in your haversine calculation
            var point1 = { lat: lat, lng: long }

            //Second point in your haversine calculation
            var point2 = { lat: lat2, lng: long2 }

            var haversine_m = haversine(point1, point2); //Results in meters (default)
            var haversine_km = haversine_m /1000; //Results in kilometers

            return haversine_km * ongkir
        }
       const hasil =  hitungJarak(latAdmin, longAdmin, latUser, longUser, harga_kirim)
       return hasil
    }
}