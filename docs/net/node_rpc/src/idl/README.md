## IDL

> Interface description language 接口定义语言/接口描述语言 -> 是一套语言规范用于序列化/反序列化 数据结构 便于跨平台的解析

如 XML / JSON -> 广泛用于http中的数据描述格式

### Protobuf

### Cap'n Proto

### kirito 教程中的自定义IDL

Program: 
    1.  # 注释
    2.  {} 块结构
    3.  service method struct 关键字
    4.  (req, res) 参数列表 req - 请求参数结构 res - 返回值结构
    5.  @ 参数位置描述符
    6.  = 参数类型运算符 参数名在左 参数类型在→

Type:
    1. Boolean: Bool
    2. Integers: Int8, Int16, Int32, Int64
    3. Unsigned Intergers: UInt8, UInt16, UInt32, UInt64
    4. Floating-Point: Float32, Floag64
    5. Blobs: Text, Data
    6. Lists: List<T>

> IDL 解析过程 同语言解析过程一致: code -> 词法分析 -> tokens -> 语法分析 -> ast
