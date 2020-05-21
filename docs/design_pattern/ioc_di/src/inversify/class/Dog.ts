import Animal from './Animal'
import { injectable, inject } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../TYPES'

@injectable()
class Dog extends Animal {
    type: String = 'Dog'
    food

    constructor ( @inject(TYPES.Food) food: any ) {
        super()

        this.food = food
    }

    toString (): String {
        return this.type
    }
}

export default Dog
