import Animal from './Animal'
import { Inject } from '../Injector/Injector'
import Bone from './Bone'

@Inject(Bone)
class Dog extends Animal {
    type: String = 'Dog'
    food

    constructor (food: any) {
        super()

        this.food = food
    }

    toString (): String {
        return this.type
    }
}

export default Dog
