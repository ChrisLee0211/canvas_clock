# canvas_clock
canvas生成的时钟动画

利用canvas2d制作而成的时钟动画效果

## 效果预览：
![IMAGE](https://github.com/ChrisLee0211/canvas_clock/blob/master/src/example01.gif)

## 实现原理：
（备注：感谢liubobo大神的引导，学习了利用二维数组[0,1]的方法去生成对应的球体数字）
- 创建了一个专门存放用于映射数字的数组js文件，详情看./src/digit.js文件，主要是利用0、1来表示一个数字的结构，比如数字'2'，如下：
```JavaScript
[
            [0,1,1,1,1,1,0],
            [1,1,0,0,0,1,1],
            [0,0,0,0,0,1,1],
            [0,0,0,0,1,1,0],
            [0,0,0,1,1,0,0],
            [0,0,1,1,0,0,0],
            [0,1,1,0,0,0,0],
            [1,1,0,0,0,0,0],
            [1,1,0,0,0,1,1],
            [1,1,1,1,1,1,1]
        ]
```
把数组中所有的'1'连起来，就可以看到这是一个'2'字了，其他的数字也是利用类似的二维数组完成的，再把各个数组放在一个大数组中，那么他们的索引+1就等于对应的数字。
- 主要的逻辑在countdown.js文件中，大体分为两个部分，**时间逻辑** 和 **图形绘制**;

- 图形绘制：主要难点在于遍历了数组中得知'1'的数量后应该如何以此为圆心画出一个圆，以下指示部分逻辑，其他的逻辑在js文件中都有详细注释
```JavaScript
const renderDigit = (x, y, num, ctx) => {
    ctx.fillStyle = "rgb(0,102,153)";

    for (let i = 0; i < digit[num].length; i++) {
        for (let j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 1) {
                ctx.beginPath();
                /*把每个小圆体看成在一个正方格里面，圆心就是正方格的中心，圆心到正方格边缘的距离就是（半径+圆边与正方格边的距离），也就是RADIUS+GAP,
                那么由此可知，整个正方格的边长就是2*（RADIUS+GAP），那么第一个小圆体，对应二位数组里就是第0个的位置，所以它的圆心位置，就是RADIUS+GAP；
                由此类推，第二个小圆体就是数组中的第1个，那么只需要在前一个正方体的边长后再加（RADIUS+GAP）就能拿到圆心的x坐标，Y坐标同理，于是可以推导
                出式子为：x = 0 + j * 2 * (RADIUS+GAP) + (RADIUS+GAP)
                         y = 0 + i * 2 * (RADIUS+GAP) + (RADIUS+GAP)
                */
                ctx.arc(x + j * 2 * (RADIUS + GAP) + (RADIUS + GAP), y + i * 2 * (RADIUS + GAP) + (RADIUS + GAP), RADIUS, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill()
            }
        }
    }
}

```

- 时间逻辑：时间的判断主要用于对比这一秒和下一秒是否有变化，有则触发更新canvas内容，使其看起来像动画一样运动。并且，时间逻辑是开放性的，既可以作为时钟使用，也可以作为倒计时使用。
