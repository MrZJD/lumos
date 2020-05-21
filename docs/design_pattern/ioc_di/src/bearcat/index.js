// 利用bearcat ioc

const bearcat = require('bearcat')

bearcat.createApp([
    require.resolve('./class/config.js')
])

bearcat.start(function () {
    let animal = bearcat.getBean('animal')
    animal.eat()
})

// const Dog = require('./class/Dog')
// const Bone = require('./class/Bone')

// let dog = new Dog(new Bone())
// dog.eat()
