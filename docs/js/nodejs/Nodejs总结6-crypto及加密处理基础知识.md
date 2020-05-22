## 密码学基础知识

### 常见加密算法

#### 1. 对称加密

> 加密解密使用相同的密钥

优点: 速度快；使用长密钥时不易破解；
缺点：安全性差；

常用算法：DES、3DES、Blowfish、IDEA、RC4、RC5、RC6和AES

#### 2. 非对称加密

> 使用公钥和私钥进行加密
> 当用户A需要向B传输加密信息时，需要先获取B的公钥进行加密，然后B获取密文后使用私钥进行解密。

优点：安全性好
缺点：速度慢；

常用算法：RSA、ECC(移动设备用)、Diffie-Hellman、El Gamal、DSA(数字签名用)

#### 3. Hash算法

> 单向算法，对信息生成一段特定长度的唯一hash值。无法解密。常用在不可还原的密码存储、信息完整性校验等

常用算法：MD2、MD4、MD5、HAVAL、SHA


## crypto 模块

### crypto.Certificate

> 一种证书签名请求机制, Certificate 类用于处理 SPKAC 数据。

```
const cert = new crypto.Certificate();

// spkac数据包含一个公钥和一个challenge
// certificate.exportChallenge(spkac); //challenge buffer
// certificate.exportPublicKey(spkac); //公钥 buffer
// certificate.verifySpkac(spkac); //验证数据是否有效
```

### Cipher类的实例用于加密数据

> cipher 为可读可写流

```
crypto.createCipher(algorithm, password[, options]); 
crypto.createCipheriv(algorithm, key, iv[, options]); //创建cipher实例

cipher.setAutoPadding([autoPadding]); //使用块加密时，来适配输入适应响应块的大小
cipher.update(data[, inputEncoding][, outputEncoding]); //用data更新密码
cipher.final([outputEncoding]); //返回未加密的内容 'latin1', 'base64', 'hex', default-buffer
```

### Decipher类的实例用于解密数据

> decipher 为可读可写流

```
crypto.createDecipher(algorithm, password[, options]);
crypto.createDecipheriv(algorithm, key, iv[, options]); //创建decipher实例

// 拥有的方法与Cipher一样
```

### Hash类是用于创建数据哈希值的工具类

> hash 可读可写流

```
crypto.createHash(algorithm[, options]); //创建hash实例

hash.update(data[, inputEncoding]); //更新数据
hash.digest([encoding]); //输出
```

### Sign类/Verify类 - 生成签名/验证签名的实用工具

```
crypto.createSign(algorithm[, options]); //方法用于创建Sign实例
crypto.createVerify(algorithm[, options]); //创建Verify实例

sign.update(data[, inputEncoding]);
sign.sign(privateKey[, outputFormat]);

verify.update(data[, inputEncoding]);
verify.verify(pemKey, signature[, signatureFormat]);
```

### 全局方法

```
crypto.randomBytes(size[, callback]); //生成加密强伪随机数据. size参数是指示要生成的字节数的数字。

crypto.privateDecrypt(privateKey, buffer); //私钥解密
crypto.privateEncrypt(privateKey, buffer); //私钥加密

crypto.publicDecrypt(key, buffer);
crypto.publicEncrypt(key, buffer);

crypto.getCiphers()/.getCurves()/.getHashes(); //获取相应支持的算法
```

### 说明

密码学，以及网络安全加密这一块的内容比较独立而且专业性很强。这些概念我们只需要了解到对应的算法所具备的优缺点，以及在何种场景下应用即可。

## 应用实战

* 用户登录后通过token实现记住密码

## 参考链接

[nodejs - crypto](http://nodejs.cn/api/crypto.html)
[CSDN-关于nodejs中密码加密的处理](http://blog.csdn.net/kuangshp128/article/details/75162973)
[关于nodejs中密码加密的进一步优化](https://github.com/kuangshp/node-password)
[Token技术的功能及实现](http://blog.csdn.net/qq_37644380/article/details/74502821)
