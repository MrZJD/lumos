module.exports = {
    name: "bearcat ioc",
    beans: [{
        "id": "animal",
        "func": "Cat",
        "props": [{
            "name": "food",
            "ref": "Fish"
        }]
    }, {
        "id": "Bone",
        "func": "Bone"
    }, {
        "id": "Fish",
        "func": "Fish"
    }]
}