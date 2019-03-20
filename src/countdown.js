var WINDOW_WIDTH = 1024; //画布的宽度
var WINDOW_HEIGHT = 768; //画布的高度
var RADIUS = 8 //圆的半径
const GAP = 1 //每个小圆体之间的距离
var MARGIN_TOP = 60 //每个数字距离画布上方的距离
var MARGIN_LEFT = 30 //第一个数字距离画布左边的距离
const balls = [] //存放生成的小球
const colors = ['lightblue', 'lightred', 'lightyellow', 'orange', 'lightgreen', 'red', 'purple', 'royalblue', 'royalred'] //用于随机生成小球的颜色


window.onload = function () {

    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // 自适应屏幕设置参数
    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIGHT = document.body.clientHeight;
    MARGIN_LEFT = Math.round(WINDOW_WIDTH/10) //十分之一的屏幕距离取整
    MARGIN_TOP = Math.round(WINDOW_HEIGHT/8)
    RADIUS = Math.round(WINDOW_WIDTH*4/5/108)-GAP

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    // 先用一个变量保存这一秒的时间，用于后面和下一秒做判断
    currentTimeSeconds = getCurrentTimeSeconds()

    setInterval(() => {
        // 开始绘制方法,接收一个canvas上下文参数
        render(context);
        update();
        // console.log(balls.length)
    }, 50);
}

const getCurrentTimeSeconds = () => {
    // 获取当前精确到秒的时间
    let cur = new Date();
    let ret = cur.getHours() * 3600 + cur.getMinutes() * 60 + cur.getSeconds();
    return ret
}

const update = () => {
    // 此时先用变量保存这一秒的总秒数时间，用于和之前的currentTimeSeconds作比较，来判断是否有数字变化
    let nextTime = getCurrentTimeSeconds();

    /* 通过总秒数把时、分、秒转化为对应单位整数 */
    let nextHours = parseInt(nextTime / 3600);
    let nextMinutes = parseInt((nextTime - nextHours * 3600) / 60);
    let nextSeconds = nextTime % 60;


    let curHours = parseInt(currentTimeSeconds / 3600);
    let curMinutes = parseInt((currentTimeSeconds - curHours * 3600) / 60);
    let curSeconds = currentTimeSeconds % 60


    // 只需要判断当前秒和下一秒的毫秒数是否相等就能得知数字是否有变化
    if (nextSeconds != curSeconds) {
        // 分别对时分秒上的各个数字进行当前时间和下一一秒时间的比较，出现变化则把对应数字在canvas上的x，y坐标和数字放进addBalls方法中
        if (parseInt(curHours / 10) != parseInt(nextHours / 10)) {
            // addBalls方法主要用于把绘制球体所需的参数组合成一个对象，每一个对象代表着一个球体，然后把这些对象放进全局的Balls数组中，供绘制时调用
            addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours / 10))
        }
        if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
            addBalls(MARGIN_LEFT + 15 * (RADIUS + GAP), MARGIN_TOP, parseInt(curHours / 10))
        }
        if (parseInt(curMinutes / 10) != parseInt(nextMinutes / 10)) {
            addBalls(MARGIN_LEFT + 40 * (RADIUS + GAP), MARGIN_TOP, parseInt(curMinutes / 10))
        }
        if (parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)) {
            addBalls(MARGIN_LEFT + 55 * (RADIUS + GAP), MARGIN_TOP, parseInt(curMinutes / 10))
        }
        if (parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)) {
            addBalls(MARGIN_LEFT + 80 * (RADIUS + GAP), MARGIN_TOP, parseInt(curSeconds / 10))
        }
        if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
            addBalls(MARGIN_LEFT + 95 * (RADIUS + GAP), MARGIN_TOP, parseInt(nextSeconds / 10))
        }

        currentTimeSeconds = nextTime;
    }

    updateBalls()
}

const addBalls = (x, y, num) => {
    // 球体的参数其实和时钟数字是一样的，也是通过传入的num判断该数字对应二维数组中的哪个数字，然后遍历该数字的数组，找出要绘制的数组点
    for (let i = 0; i < digit[num].length; i++) {
        for (let j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 1) {
                let aBall = {
                    x: x + j * 2 * (RADIUS + GAP) + (RADIUS + GAP),
                    y: y + i * 2 * (RADIUS + GAP) + (RADIUS + GAP),
                    g: 1.5 + Math.random(), //重力加速度，基本上1.2以上的效果比较明显
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4, //vx代表x轴的加速度，负值为左，正值为右，这里是取-1的随机次数幂再乘4，区间相当于是4-到4之间
                    vy: -5,                                                 //vy是y轴加速度，负值为下坠，正值为上浮
                    color: colors[Math.floor(Math.random() * colors.length)]
                }
                // 把当前球体放入balls数组中
                balls.push(aBall)
            }
        }
    }
}

const updateBalls = () => {
    /*这里是球体运动的关键，每次调用该函数其实就是绘制新球体，然后该球体的x，y轴根据对象参数进行递增，优于canvas设置了50毫秒渲染一次，
    那么快速渲染每次不同坐标的球体，看起来就形成了球在运动的感觉  */
    for (let i = 0; i < balls.length; i++) {

        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        // 此处是边缘碰撞检测，当球体的y坐标达到canvas底部时，稍微增加一点y轴的垂直加速度，形成一个类似上弹的感觉
        if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
            balls[i].y = WINDOW_HEIGHT - RADIUS;
            balls[i].vy = - balls[i].vy * 0.75;
        }
    }

    /* 回收球体逻辑：
        balls[i].x + RADIUS > 0  用于判断球体是否在画布内；
        balls[i].x - RADIUS < WINDOW_WIDTH  用于判断球体是否在画布内；
        当一个球体的位置满足以上两个条件时，证明是在画布内，那么我们就用一个起始值为0的cnt变量作为下标，来指代整个balls数组从0开始的球体，
        一旦发现当前遍历的球体是在画布内的，那就把它赋值到cnt的位置上，同时cnt往后移一位，如此一来，那些在画布中你的球体永远位于balls数组的
        前半部分（以cnt的位置为分界），那么只需判断，当整个balls数据大于cnt时，我们就把最后一个球移除掉，也就是balls.pop()。
        整体思路是：把已经在画布外的球体放在cnt为界的后半部分数组中，用pop方法不断移除，来达到一个回收球体节约性能的目的
    */
    let cnt = 0;
    for(let i = 0; i < balls.length; i ++){
        if(balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH){
            balls[cnt++] = balls[i]
        }
    }
    
    while(balls.length > cnt){
        balls.pop()
    }
}



const render = ctx => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let today = new Date();
    let Hours = today.getHours();
    let Minutes = today.getMinutes();
    let Seconds = today.getSeconds();


    // 根据数字绘制圆心体，
    // 参数1、2：圆心坐标
    // 参数3：该参数的十位数
    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(Hours / 10), ctx)
    /* 第二个数字开始，左边距离应该是第一个字的距离+第一个数字本身的宽，由于每个数字都是由两个7列10行的数组描绘的，
    那么每一个数字至少要占据1个二维数据，也就是7个正方格：7*2*（RADIUS+GAP）或14*(RADIUS+GAP)，为了数字之间有足够的间隙，可以适当±1
    */
    renderDigit(MARGIN_LEFT + 15 * (RADIUS + GAP), MARGIN_TOP, parseInt(Hours % 10), ctx)
    renderDigit(MARGIN_LEFT + 30 * (RADIUS + GAP), MARGIN_TOP, 10, ctx) //冒号的位置，也和上面类似，左边两个数字占的宽度+画布左边距离，10表示二维数组中的第10个数组，也就是冒号
    renderDigit(MARGIN_LEFT + 40 * (RADIUS + GAP), MARGIN_TOP, parseInt(Minutes / 10), ctx)
    renderDigit(MARGIN_LEFT + 55 * (RADIUS + GAP), MARGIN_TOP, parseInt(Minutes % 10), ctx)
    renderDigit(MARGIN_LEFT + 70 * (RADIUS + GAP), MARGIN_TOP, 10, ctx)
    renderDigit(MARGIN_LEFT + 80 * (RADIUS + GAP), MARGIN_TOP, parseInt(Seconds / 10), ctx)
    renderDigit(MARGIN_LEFT + 95 * (RADIUS + GAP), MARGIN_TOP, parseInt(Seconds % 10), ctx)


    // 此处不必判断是否触发数字变化才绘制球体，因为canvas每次绘制数字都清空了画布，那么只要balls里面有球体对象进入时，下面才会进行有效绘制
    for (let i = 0; i < balls.length; i++) {
        ctx.fillStyle = balls[i].color;

        ctx.beginPath();
        ctx.arc(balls[i].x, balls[i].y, RADIUS, 0, Math.PI * 2, true)
        ctx.closePath();
        ctx.fill()
    }

}

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