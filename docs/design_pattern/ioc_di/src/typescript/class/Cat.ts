import Animal from './Animal'
import { Inject } from '../Injector/Injector'
import Fish from './Fish'

@Inject(Fish)
export default class Cat extends Animal {
    type: String = 'Cat'
    food

    constructor (food) {
        super()

        this.food = food
    }

    toString (): String {
        return this.type
    }
}
