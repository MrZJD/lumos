import Animal from './Animal'
import { injectable, inject } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../TYPES'

@injectable()
export default class Cat extends Animal {
    type: String = 'Cat'
    food

    constructor ( @inject(TYPES.Food) food: any ) {
        super()

        this.food = food
    }

    toString (): String {
        return this.type
    }
}
