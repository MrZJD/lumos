import { injectable } from 'inversify'
import "reflect-metadata"

@injectable()
export default class Fish {
    type: String = 'Fish'

    toString (): String {
        return this.type
    }
}
