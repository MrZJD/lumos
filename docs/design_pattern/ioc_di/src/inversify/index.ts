import { container } from './config'
import Animal from './class/Animal'
import { TYPES } from './TYPES'

const animal = container.get<Animal>(TYPES.Animal)
animal.eat()
