const WINDOW_WIDTH = 1024; //画布的宽度
const WINDOW_HEIGHT = 768; //画布的高度
const RADIUS = 8 //圆的半径
const GAP = 1 //每个小圆体之间的距离
const MARGIN_TOP = 60 //每个数字距离画布上方的距离
const MARGIN_LEFT = 30 //第一个数字距离画布左边的距离
const balls = [] //存放生成的小球
const colors = ['lightblue','lightred','lightyellow','orange','lightgreen','pink'] //用于随机生成小球的颜色


window.onload = function(){

    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;


    currentTimeSeconds = getCurrentTimeSeconds()
    // 开始绘制方法,接收一个canvas上下文参数
    
    setInterval(() => {
        render(context);
        update();
    }, 50);
}

const update = () => {
    let nextTime = getCurrentTimeSeconds();

    let nextHours = parseInt(nextTime/3600);
    let nextMinutes = parseInt((nextTime-nextHours*3600)/60);
    let nextSeconds = nextTime % 60;

    let curHours = parseInt(currentTimeSeconds/3600);
    let curMinutes = parseInt((currentTimeSeconds-curHours*3600)/60);
    let curSeconds = currentTimeSeconds % 60

    if(nextSeconds != curSeconds){
        if(parseInt(curHours/10) != parseInt(nextHours/10)){
            addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours/10))
        }
        if(parseInt(curHours%10) != parseInt(nextHours%10)){
            addBalls(MARGIN_LEFT + 15*(RADIUS+GAP), MARGIN_TOP, parseInt(curHours/10))
        }
        if(parseInt(curMinutes/10) != parseInt(nextMinutes/10)){
            addBalls(MARGIN_LEFT + 40*(RADIUS+GAP), MARGIN_TOP, parseInt(curMinutes/10))
        }
        if(parseInt(curMinutes%10) != parseInt(curMinutes%10)){
            addBalls(MARGIN_LEFT + 55*(RADIUS+GAP), MARGIN_TOP, parseInt(curMinutes/10))
        }
        if(parseInt(curSeconds/10) != parseInt(nextSeconds/10)){
            addBalls(MARGIN_LEFT + 80*(RADIUS+GAP), MARGIN_TOP, parseInt(curSeconds/10))
        }
        if(parseInt(curSeconds%10) != parseInt(nextSeconds%10)){
            addBalls(MARGIN_LEFT + 95*(RADIUS+GAP), MARGIN_TOP, parseInt(nextSeconds/10))
        }

        currentTimeSeconds = nextTime;
    }

    updateBalls()
}

const addBalls = (x, y, num) => {
    for(let i = 0; i < digit[num].length; i ++){
        for(let j = 0; j < digit[num][i].length; j ++){
            if(digit[num][i][j] == 1){
                let aBall = {
                    x: x + j*2*(RADIUS+GAP) + (RADIUS+GAP),
                    y: y + i*2*(RADIUS+GAP) + (RADIUS+GAP),
                    g:1.5+Math.random(),
                    vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,
                    vy:-5,
                    color:colors[ Math.floor( Math.random()*colors.length ) ]
                }
                balls.push(aBall)
            }
        }
    }
}

const updateBalls = () => {
    for(let i = 0; i < balls.length; i++){

        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if( balls[i].y >= WINDOW_HEIGHT-RADIUS ){
            balls[i].y = WINDOW_HEIGHT-RADIUS;
            balls[i].vy = - balls[i].vy*0.75;
        }
    }
}

const getCurrentTimeSeconds = () => {
    let cur = new Date();
    let ret = cur.getHours() * 3600 + cur.getMinutes() *60 + cur.getSeconds();
    return ret
}


const render = ctx => {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    let today= new Date();
    let Hours = today.getHours();
    let Minutes = today.getMinutes();
    let Seconds = today.getSeconds();


    // 根据数字绘制圆心体，
    // 参数1、2：圆心坐标
    // 参数3：该参数的十位数
    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(Hours/10), ctx)
    /* 第二个数字开始，左边距离应该是第一个字的距离+第一个数字本身的宽，由于每个数字都是由两个7列10行的数组描绘的，
    那么每一个数字至少要占据1个二维数据，也就是7个正方格：7*2*（RADIUS+GAP）或14*(RADIUS+GAP)，为了数字之间有足够的间隙，可以适当±1
    */
    renderDigit(MARGIN_LEFT + 15*(RADIUS+GAP), MARGIN_TOP,parseInt(Hours%10),ctx)
    renderDigit(MARGIN_LEFT + 30*(RADIUS+GAP), MARGIN_TOP,10,ctx) //冒号的位置，也和上面类似，左边两个数字占的宽度+画布左边距离，10表示二维数组中的第10个数组，也就是冒号
    renderDigit(MARGIN_LEFT + 40*(RADIUS+GAP), MARGIN_TOP,parseInt(Minutes/10),ctx)
    renderDigit(MARGIN_LEFT + 55*(RADIUS+GAP), MARGIN_TOP,parseInt(Minutes%10),ctx)
    renderDigit(MARGIN_LEFT + 70*(RADIUS+GAP), MARGIN_TOP,10,ctx)
    renderDigit(MARGIN_LEFT + 80*(RADIUS+GAP), MARGIN_TOP,parseInt(Seconds/10),ctx)
    renderDigit(MARGIN_LEFT + 95*(RADIUS+GAP), MARGIN_TOP,parseInt(Seconds%10),ctx)

    for(let i = 0; i < balls.length; i ++){
        ctx.fillStyle = balls[i].color;

        ctx.beginPath();
        ctx.arc(balls[i].x, balls[i].y, RADIUS, 0, Math.PI*2, true)
        ctx.closePath();
        ctx.fill()
    }

}

const renderDigit = (x, y, num, ctx) => {
    ctx.fillStyle = "rgb(0,102,153)";

    for(let i = 0; i < digit[num].length; i++){
        for(let j = 0; j < digit[num][i].length; j++){
            if(digit[num][i][j] == 1){
                ctx.beginPath();
                /*把每个小圆体看成在一个正方格里面，圆心就是正方格的中心，圆心到正方格边缘的距离就是（半径+圆边与正方格边的距离），也就是RADIUS+GAP,
                那么由此可知，整个正方格的边长就是2*（RADIUS+GAP），那么第一个小圆体，对应二位数组里就是第0个的位置，所以它的圆心位置，就是RADIUS+GAP；
                由此类推，第二个小圆体就是数组中的第1个，那么只需要在前一个正方体的边长后再加（RADIUS+GAP）就能拿到圆心的x坐标，Y坐标同理，于是可以推导
                出式子为：x = 0 + j * 2 * (RADIUS+GAP) + (RADIUS+GAP)
                         y = 0 + i * 2 * (RADIUS+GAP) + (RADIUS+GAP)
                */
                ctx.arc(x + j*2*(RADIUS+GAP) + (RADIUS+GAP), y + i*2*(RADIUS+GAP) + (RADIUS+GAP), RADIUS, 0, Math.PI*2);
                ctx.closePath();
                ctx.fill()
            }
        }
    }
}