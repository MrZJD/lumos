// 基于injector cache实现依赖注入

const App = require('./class/App')
const Food = require('./class/Bone')
const Animal = require('./class/Dog')

const app = new App()

const food = new Food()
const animal = new Animal()

app.main = function (animal) {
    animal.init()
    animal.eat()
}

app.inject({
    'food': food,
    'animal': animal
})
app.resolve([
    [animal.init, animal, animal, 'init'],
    [app.main, app, app, 'main']
])
app.run()
