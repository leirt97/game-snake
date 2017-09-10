//参数配置
var config={
	map:{width:800,height:600},
	square:{width:50,height:50},
	getRows:function(){return this.map.height/this.square.height;},
	getCols:function(){return this.map.width/this.square.width;},
	getSum:function(){return this.getRows()*this.getCols();},
	snake:{length:5}
};
//游戏辅助变量
var help={
	squares:[],
	snake:[],
	foods:[],
	foodIndex:-1,
	dir:3,
	handler:null,
	code:-1
};
//辅助函数
function removeEleFromArr(arr,ele){
	for(var i=0;i<arr.length;i++){
		if(arr[i]==ele){
			arr.splice(i,1);
			break;
		}
	}
}
function getHeadNewIndex(h_index){
	var h_new_index=-1;//新蛇头位置编号
	switch(help.dir){
		case 1://向左
			h_new_index=h_index%config.getCols()==0
						?h_index+config.getCols()-1
						:h_index-1;
			break;
		case 2://向上
			h_new_index=h_index<config.getCols()
						?h_index+(config.getRows()-1)*config.getCols()
						:h_index-config.getCols();
			break;
		case 3://向右
			h_new_index=h_index+1;
			h_new_index=h_new_index%config.getCols()==0
						?h_new_index-config.getCols()
						:h_new_index;
			break;
		case 4://向下
			h_new_index=h_index+config.getCols();
			h_new_index=h_new_index>=config.getSum()
						?h_new_index-config.getSum()
						:h_new_index;
			break;
	}
	return h_new_index;
}
function isInBody(h_new_index){
	for(var i=0;i<help.snake.length-1;i++){
		if(help.snake[i]==h_new_index){
			return true;
		}
	}
	return false;
}
function isBack(code){
//	alert(code);
	if(help.dir==3){
		if(code-36==1){
			help.dir=3;
			alert('请不要返回走');
			return;
		}
	}else if(help.dir==1){
		if(code-36==3){
			help.dir=1;
			alert('请不要返回走');
			return;
		}
	}else if(help.dir==2){
		if(code-36==4){
			help.dir=2;
			alert('请不要返回走');
			return;
		}
	}else if(help.dir==4){
		if(code-36==2){
			help.dir=4;
			alert('请不要返回走');
			return;
		}
	}
	help.dir=code-36;
}
//初始化地图
function initMap(){
	id('map').style.width=config.map.width+'px';
	id('map').style.height=config.map.height+'px';
	var sum=config.getSum();
	var span;
	for(var i=0;i<sum;i++){
		span=createE('span');
		span.style.width=config.square.width+'px';
		span.style.height=config.square.height+'px';
		id('map').appendChild(span);
		help.squares.push(span);
		if(i<=4){
			help.snake.push(i);
			span.className='snake';
		} 
		else help.foods.push(i);
	}
}
//随机产生食物
function showFood(){
	var index=Math.floor(Math.random()*help.foods.length);
	help.foodIndex=help.foods[index];
	help.squares[help.foods[index]].className='food';
}
//蛇移动
function snakeMove(){
	//处理蛇头
	var h_index=help.snake[help.snake.length-1];
	var h_new_index=getHeadNewIndex(h_index);
	if(isInBody(h_new_index)){
		clearInterval(help.handler);
		alert('game over');
		if(confirm('once again'))
			window.location.href=window.location.href;//把自己的地址栏赋值给自己(刷新页面)
		else
			window.close();//关闭窗口
		return;
	}
	
	removeEleFromArr(help.foods,h_new_index);//从foods里删掉即将变成蛇头的编号
	help.snake.push(h_new_index);//将即将变成蛇头的编号插入到snake里
	help.squares[h_new_index].className='snake';
	//处理蛇尾
	if(h_new_index!=help.foodIndex){
		help.squares[help.snake[0]].className='';
		help.foods.push(help.snake.shift());
	}else{
		showFood();
	}
	
}
window.onload=function(){
	initMap();
	showFood();
	handler=setInterval(snakeMove,300);
	document.onkeyup=function(e){
		if(e.keyCode>=37&&e.keyCode<=40){
			help.code=e.keyCode;
			isBack(help.code);
		}
		
//		alert(e.keyCode);
	}
}
