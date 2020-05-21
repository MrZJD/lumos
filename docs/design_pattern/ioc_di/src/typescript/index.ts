import Animal from './class/Animal'
import Dog from './class/Dog'
import Cat from './class/Cat'
// import Bone from './class/Bone'
// import Fish from './class/Fish'
import { Inject, injector } from './Injector/Injector'
import RadicalInject from './Injector/RadicalInjector'

/* without di */
// function run (animal: Animal) {
//     animal.eat()
// }

// run(new Cat(new Bone()))

/* normal inject */
@Inject(Cat)
class App {
    constructor (animal: Animal) {
        animal.eat()
    }
}

var app = injector.resolve(App)
