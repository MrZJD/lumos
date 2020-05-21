import { Container } from 'inversify'
import { TYPES } from './TYPES'

import Dog from './class/Dog'
import Cat from './class/Cat'
import Bone from './class/Bone'
import Fish from './class/Fish'

const container = new Container()
container.bind(TYPES.Animal).to(Cat)
container.bind(TYPES.Food).to(Bone)

export { container }