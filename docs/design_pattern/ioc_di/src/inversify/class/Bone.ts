import { injectable } from 'inversify'
import "reflect-metadata"

@injectable()
export default class Bone {
    type: String = 'Bone'

    toString (): String {
        return this.type
    }
}
