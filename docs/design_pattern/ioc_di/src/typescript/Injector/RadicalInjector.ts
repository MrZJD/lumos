function RadicalInject(...dependencies){
    var wrappedFunc:any = function (target: any) {
        dependencies = dependencies.map(function (dependency) {
            return new dependency();
        });
        // 使用mockConstructor的原因和上例相同
        function mockConstructor() {
            target.apply(this, dependencies);
        }
        mockConstructor.prototype = target.prototype;
 
        // 为什么需要使用reservedConstructor呢？因为使用RadicalInject对Student方法装饰之后，
        // Student指向的构造函数已经不是一开始我们声明的class Student了，而是这里的返回值，
        // 即reservedConstructor。Student的指向变了并不是一件不能接受的事，但是如果要
        // 保证student instanceof Student如我们所期望的那样工作，这里就应该将
        // reservedConstructor的prototype属性指向原Student的prototype
        function reservedConstructor() {
            return new mockConstructor();
        }
        reservedConstructor.prototype = target.prototype;
        return reservedConstructor;
    }
    return wrappedFunc;
}

export default RadicalInject