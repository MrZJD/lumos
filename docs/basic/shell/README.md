# Shell Script 学习

## Shell 环境

bash / sh

## 脚本语法

```bash
#!/bin/bash
#!/bin/sh

# 1 -> 指定解释器
# 2 -> 接下来是脚本内容

# 多行注释
:<<'
注释内容...
'

:<<!
注释内容...
!

:<<EOF
注释内容...
EOF
```

### 变量

1. 变量赋值 变量名与等号间不能有空格
2. 英文字母 数字 下划线 (不能以数字开头)
3. 使用变量 $name ${name}

```bash
name="mrzjd"
echo $name
echo ${name}

name="mrzjd2" # 重新赋值 不需要$

cname="constName"
readonly cname # 常量(只读变量)

unset name # 删除变量 删除后不能使用 不能删除常量(只读变量)

# shell变量 -> 可以理解为 shell运行时的全局变量
# 环境变量 -> 所有程序都可以访问
# 局部变量 -> script内定义的变量
```

### 数据类型

```bash
# 字符串
# define '' "" 也可以不用引号 (' ")两者区别同类似语言

# '' 内部的任何字符都会原样输出
# '' 内部可以成对出现 '' -> 功能字符串拼接
# "" 内部可以转义字符
name='horace'

# 拼接字符串
echo 'hello '$name' to world'
echo "hello ${name} to world"
echo "hello "${name}" to world"

# 获取长度
string="abcd"
echo ${#string}

# 提取子字符串
echo ${string:1:3}

# 查找子字符串
string="runoob is a great site"
echo `expr index "$string" io` # 查找 i/o 字符最先出现的位置
```

```bash
# 数组

# 仅支持一维数组 没有限定数组的大小

arr_name=(0 1 2 3 4 5)
arr_name_2=(
    0
    1
    2
    3
    4
)

arr_name_3[0]=0
arr_name_3[1]=1
arr_name_3[5]=1 # 下标范围没有限制 可以不连续

echo ${arr_name_3[5]}
echo ${arr_name_3[@]} # 获取所有元素

echo ${#arr_name_3[@]} # 数组长度
echo ${#arr_name_3[*]}
echo ${#arr_name_3[0]} # 取其中元素的长度
```

### 向脚本传递参数

```
sh script.sh 5 6 7
```

```bash
# $# 参数个数
# $* 以字符串形式展示所有参数
# $$ 脚本运行的进程ID
# $! 后台运行的最后一个进程ID
# $@ 字符串形式每个参数都带引号

# $- 显示shell使用的当前选项
# $? 显示最后命令的退出状态 0 表示没有错误 没有任何值表明有错误

echo "-- \$* 演示 ---"
for i in "$*"; do
    echo $i # "5 6 7"
done

echo "-- \$@ 演示 ---"
for i in "$@"; do
    echo $i # "5" "6" "7"
done
```

### 运算符

```bash
# 原生bash不支持简单的数学运算 通常通过 expr -> 表达式计算工具 完成求值

val=`expr 2 + 2` # expr 运算符之间必须要有空格
echo "两个数之和为: $val"

# `expr $a + $b`
# `expr $a - $b`
# `expr $a \* $b` # 必须加反斜杠
# `expr $a / $b`
# `expr $a % $b`
# [ $a == $b ] # 比较两个数字 空格是必须的
# [ $a != $b ] # 比较两个数字 空格是必须的

# 关系运算符
# [ $a -eq $b ] # 检测两个数是否相等
# [ $a -ne $b ] # 检测两个数是否不相等
# [ $a -gt $b ] # 数 大于
# [ $a -lt $b ] # 数 小于
# [ $a -ge $b ] # 数 大于等于
# [ $a -le $b ] # 数 小于等于

# 布尔运算符
# [ ! false ] # 非 !
# [ $a -lt 20 -o $b -gt 100 ] # 或 |
# [ $a -lt 20 -a $b -gt 100 ] # 与 &

# 逻辑
# [[ $a -lt 20 && $b -gt 100 ]]
# [[ $a -lt 20 || $b -gt 100 ]]

# 字符串运算符
# [ $a = $b ] # 字符串相等
# [ $a != $b ] # 字符串不相等
# [ -z $a ] # 字符串长度是否为0
# [ -n "$a" ] # 字符串长度是否不为0
# [ $a ] # 字符串是否为空

# 文件测试运算符
# [ -b $file ] # 是否是块设备文件
# [ -c $file ] # 是否是字符设备文件
# [ -d $file ] # 是否是目录
# [ -f $file ] # 普通文件(不是设备，不是目录)
# -r # 是否可读
# -w # 是否可写
# -x # 是否可执行
# -s # 是否为空
# -e # 是否存在

# -g # 是否设置SGID位
# -k # 是否设置Sticky Bit位
# -p # 是否是有名管道
# -u # SUID
```

### echo printf test

```bash
# echo 命令

echo -e "OK \n" # -e 开启转义 \c 不转行
echo "it is a test"

echo "it's a test" > myfile # 输出至文件

echo `date` # 显示执行命令的结果

# printf 格式化输出

printf "%-10s %-8s %-4s\n" 姓名 性别 体重kg
printf "%-10s %-8s %-4.2f\n" 郭靖 男 66.1234 
printf "%-10s %-8s %-4.2f\n" 杨过 男 48.6543

# test 检查条件是否成立

test $a -eq $b # 数值..
test $a = $b # 字符串
test -e ./file # 文件
# 可使用 ! -a -o 链接测试条件
```

### 流程控制

```bash
# bash 中流程控制 块代码没有内容 则不能写 分支内容

# 写成一行 -> 行与行之间加分号

################ IF ################

# if condition
# then
#    cmd1
#    ...
# fi

# if condition
# then
#     cmd1
# else
#     cmd2
# fi

# if comdition
# then 
#     cmd1
# elif cond2
# then
#     cmd2
# else
#     cmd3
# fi

################ LOOP ################

# for li in item1 item2 ... itemN
# do
#     cmd1
#     ...
# done

# for((assignment;condition;next));do
#     cmd1;
#     ...
# done;

# while cond
# do
#     cmd
# done

# until condition
# do
#     cmd
# done

# 无限循环
# while:
# do
#     cmd;
# done;

# 无限循环
# for(( ; ; ))

# switch case
# case val in
#     1) echo "1"
#     ;;
#     2) echo "2"
#     ;;
#     *) echo "others"
#     ;;
# esac

int=1
while(( $int<5 )); do
    echo $int;
    let "int++";
done

for((i=1;i<=5;i++)); do
    echo "这是第 $i 次调用";
done;
```

### 函数

```bash
function func () { # 可以带function 也可以 func () {} 不带参数 不带function
    echo "in func"
    return 0 # 可以不写return 将以最后一条命令的结果运行返回
}

func; # 调用 # 使用前必须定义

f2 () {
    echo "所有参数 $1 !"
    echo "所有参数 ${11} !" # 10及以上的数需要 ${n} 获取
    echo "所有参数 $* !"
}

f2 10 99 88;
```

### 输入输出

```bash
cmd > file # 输出到file
cmd < file # 从file输入

cmd >> file # 追加方式输出到file
n > file # n >> file 文件描述符n的文件输出到file STDIN(n=0) STDOUT(1) STDERR(2)

n >& m # 将输出文件m 与 n 合并

# delimiter 之间的内容作为输入传给 command
command << delimiter
    document
delimiter

# /dev/null # 这是一个特殊的文件 写入的内容都会被丢弃 (用于 禁止输出)
```

### 模块? 引用外部脚本

```bash
. filename # 
source filename #
```


