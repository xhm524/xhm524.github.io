
$(document).ready(function()
{
    var boy = BoyWalk()
    ////////
    //小女�? //
    ////////
	var girl = {
        elem: $('.girl'),
        getHeight: function() {
            return this.elem.height()
        },
        //转身动作
        rotate: function() {
            this.elem.addClass('girl-rotate')
        },
        setOffset: function() {
            this.elem.css({
                left: visualWidth / 2,
                top: bridgeY - this.getHeight()
            })
        },
        getOffset: function() {
            return this.elem.offset();
        },
        getWidth: function() {
            return this.elem.width()
        }
    };

    //修正小女孩位�?
    girl.setOffset();

	//音乐配置
    var audioConfig = {
        enable: true, //是否开启音�?
        playURl: 'http://tsmusic24.tc.qq.com/4830437.mp3', //正常播放地址
        cycleURL: 'http://tsmusic24.tc.qq.com/4830437.mp3' //正常循环播放地址
    }

    /////////
    //背景音乐 //
    /////////
    function Hmlt5Audio(url, isloop) {
        var audio = new Audio(url);
        audio.autoPlay = true
        audio.loop = isloop || false;
        audio.play();
        return {
            end: function(callback) {
                audio.addEventListener('ended', function() {
                    callback()
                }, false);
            }
        }
    }
    var snowflakeURl = [
        'images/snowflake/snowflake1.png',
        'images/snowflake/snowflake2.png',
        'images/snowflake/snowflake3.png',
        'images/snowflake/snowflake4.png',
        'images/snowflake/snowflake5.png',
        'images/snowflake/snowflake6.png'
    ]

    ///////
    //飘雪�? //
    ///////
    function snowflake() {
        //雪花容器
        var $flakeContainer = $('#snowflake');

        //随机六张�?
        function getImagesName() {
            return snowflakeURl[[Math.floor(Math.random() * 6)]]
        };
        //创建一个雪花元�?
        function createSnowBox() {
            var url = getImagesName()
            return $('<div class="snowbox" />').css({
                'width': 41,
                'height': 41,
                'position': 'absolute',
                'backgroundSize': 'cover',
                'zIndex': 100000,
                'top': '-41px',
                'backgroundImage': 'url(' + url + ')'
            }).addClass('snowRoll')
        }
        //开始飘�?
        setInterval(function() {
            //运动的轨�?
            var startPositionLeft = Math.random() * visualWidth - 100,
                startOpacity    = 1,
                endPositionTop  = visualHeight - 40,
                endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                duration        = visualHeight * 10 + Math.random() * 5000;

            //随机透明度，不小�?0.5
            var randomStart = Math.random()
            randomStart = randomStart < 0.5 ? startOpacity : randomStart

            //创建一个雪�?
            var $flake = createSnowBox();

            //设计起点位置
            $flake.css({
                left: startPositionLeft,
                opacity : randomStart
            });

            //加入到容�?
            $flakeContainer.append($flake);

            //开始执行动�?
            $flake.transition({
                top: endPositionTop,
                left: endPositionLeft,
                opacity: 0.7
            }, duration, 'ease-out', function() {
                $(this).remove() //结束后删�?
            })
            
        }, 200);
    }

    function startRun() {
		var audio1 = Hmlt5Audio(audioConfig.playURl)
        audio1.end(function() {
            Hmlt5Audio(audioConfig.cycleURL, true)
        })

		//太阳公转
		$("#sun").addClass('rotation')
        //飘云
        $(".cloud:first").addClass('cloud1Anim')
        $(".cloud:last").addClass('cloud2Anim')
        //开始第一次走�?
        boy.walkTo(2000, 0.2)
            .then(function() {
                scrollTo(7000, 1)
            }).then(function() {
                //第二次走�?
                return boy.walkTo(7000, 0.5)
            }).then(function() {
                //暂停走路
                boy.stopWalk()
            })
            .then(function() {
                //开�?
                return openDoor();
            })
            .then(function() {
                //开�?
                lamp.bright()
            })
            .then(function() {
                //进商�?
                return boy.toShop(2000)
            }).then(function(){
                //取花
                return boy.talkFlower()
            }).then(function() {
                //飞鸟
                bird.fly()
            }).then(function() {
                //出商�?
                return boy.outShop(2000)
            }).then(function() {
                //灯暗
                lamp.dark()
            }).then(function() {
				scrollTo(2800, 1.4)
                return boy.walkTo(2800, 0.5)
            }).then(function() {
				boy.pushFlolerWalk()
			}).then(function() {
				boy.walkTo(3200, 0.15)
                scrollTo(3200, 2)
            }).then(function() {
                //第二次走路到桥上left,top
                return boy.walkTo(1500, 0.25, (bridgeY - girl.getHeight()) / visualHeight)
            })
            .then(function() {
                //实际走路的比�?
				boy.setFlolerWalk()
                var proportionX = (girl.getOffset().left - boy.getWidth() + girl.getWidth() / 5) / visualWidth;
                //第三次桥上直走到小女孩面�?
                return boy.walkTo(1500, proportionX)
            }).then(function() {
                //图片还原原地停止状�?
                boy.resetOriginal();
				boy.setFlolerWalk();
            }).then(function() {
                //增加转身动作 
                setTimeout(function() {
                    girl.rotate();
                    boy.rotate(function() {
                        //开始logo动画
                        logo.run()
						snowflake()
                    });
                }, 1000)
            });
    }



    //开�?
	setTimeout(function() {startRun()},1000)

});
var container = $("#content");
var swipe = Swipe(container);
var visualWidth = container.width();
var visualHeight = container.height();
//获取数据
var getValue = function(className) {
	var $elem = $('' + className + '')
		//走路的路线坐�?
	return {
		height: $elem.height(),
		top: $elem.position().top
	}
}
//页面滚动到指定的位置
function scrollTo(time, proportionX) {
   var distX = visualWidth * proportionX
   swipe.scrollTo(distX, time)
}
//桥的Y�?
var bridgeY = function() {
	var data = getValue('.c_background_middle')
	return data.top
}()
////////////////////////////////////////////////////////
//===================动画处理============================ //
////////////////////////////////////////////////////////

/////////
//右边飞鸟 //
/////////
var bird = {
	elem: $(".bird"),
	fly: function() {
		this.elem.addClass('birdFly')
		this.elem.transition({
			right: container.width()
		}, 15000, 'linear');
	}
}
//动画结束事件
var animationEnd = (function() {
   var explorer = navigator.userAgent;
   if (~explorer.indexOf('WebKit')) {
	   return 'webkitAnimationEnd'
   }
   return 'animationend'
})();


///////////
//灯动�? //
///////////
var lamp = {
	elem: $('.b_background'),
	bright: function() {
		this.elem.addClass('lamp-bright')
	},
	dark: function() {
		this.elem.removeClass('lamp-bright')
	}
}
///////////
//loge动画 //
///////////
var logo = {
	elem: $('.logo'),
	run: function() {
		this.elem.addClass('logolightSpeedIn')
			.on(animationEnd, function() {
				$(this).addClass('logoshake').off();
			})
	}
}

function doorAction(left, right, time) {
	var $door = $('.door');
	var doorLeft = $('.door-left');
	var doorRight = $('.door-right')
	var defer = $.Deferred();
	var count = 2;
	//等待开门完�?
	var complete = function() {
		if (count == 1) {
			defer.resolve();
			return;
		}
		count--
	}
	doorLeft.transition({
		'left': left
	}, time, complete)
	doorRight.transition({
		'left': right
	}, time, complete)
	return defer
}

//开�?
function openDoor() {
	return doorAction('-50%', '100%', 2000)
}

//关门
function shutDoor() {
	return doorAction('0%', '50%', 2000)
}

var instanceX;

/**
 * 小孩走路
 * @param {[type]} container [description]
 */
function BoyWalk() {

	var container = $("#content");
	//页面可视区域
	var visualWidth = container.width()
	var visualHeight = container.height()

		//路的Y�?
	var pathY = function() {
		var data = getValue('.a_background_middle')
		return data.top + data.height / 2
	}()
	var $boy = $("#boy");
	var boyHeight = $boy.height();
	//修正小男孩的正确位置
	$boy.css({
		top: pathY - boyHeight + 25
	})


	var boyWidth = $boy.width();
	var boyHeight = $boy.height();

	//设置下高�?    
	$boy.css({
		top: pathY - boyHeight + 25
	})

	//暂停走路
	function pauseWalk() {
		$boy.addClass('pauseWalk')
	}

	//恢复走路
	function restoreWalk() {
		$boy.removeClass('pauseWalk')
	}

	//css3的动作变�?
	function slowWalk() {
		$boy.addClass('slowWalk')
	}

	//用transition做运�?
	function stratRun(options, runTime) {
		var dfdPlay = $.Deferred();
		//恢复走路
		restoreWalk();
		//运动的属�?
		$boy.transition(
			options,
			runTime,
			'linear',
			function() {
				dfdPlay.resolve(); //动画完成
			});
		return dfdPlay;
	}

	//开始走�?
	function walkRun(time, dist, disY) {
		time = time || 3000;
		//脚动�?
		slowWalk();
		//开始走�?
		var d1 = stratRun({
			'left': dist + 'px',
			'top': disY ? disY : undefined
		}, time);
		return d1;
	}

	//取花
	function talkFlower() {
		//增加延时等待效果
		var defer = $.Deferred();
		setTimeout(function() {
			//取花
			$boy.addClass('slowFlolerWalk')
			defer.resolve()
		}, 1000)
		return defer
	}
	//走进商店
	function walkToShop(runTime) {
		var defer = $.Deferred();
		var doorObj = $('.door')
		//门的坐标
		var offsetDoor = doorObj.offset();
		var doorOffsetLeft = offsetDoor.left;
		//小孩当前的坐�?
		var offsetBoy     = $boy.offset();
		var boyOffetLeft = offsetBoy.left;

		//当前需要移动的坐标
		instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffetLeft + $boy.width() / 2);

		//开始走�?
		var walkPlay = stratRun({
			transform: 'translateX(' + instanceX + 'px),scale(0.3,0.3)',
			opacity: 0.1
		}, 2000);
		//走路完毕
		walkPlay.done(function() {
			$boy.css({
				opacity: 0
			})
			defer.resolve();
		})
		return defer;
	}

	//走出�?
	function walkOutShop(runTime) {
		var defer = $.Deferred();
		restoreWalk();
		//开始走�?
		var walkPlay = stratRun({
			transform: 'translateX(' + instanceX + 'px),scale(1,1)',
			opacity: 1
		}, runTime)
		//走路完毕
		walkPlay.done(function() {
		defer.resolve();
		})
		return defer;   
	}


	//计算移动距离
	function calculateDist(direction, proportion) {
		return (direction == "x" ?
			visualWidth : visualHeight) * proportion;
	}

	return {
		//开始走�?
		walkTo: function(time, proportionX, proportionY) {
			var distX = calculateDist('x', proportionX)
			var distY = calculateDist('y', proportionY)
			return walkRun(time, distX, distY);
		},
		//走进商店
		toShop: function() {
			return walkToShop.apply(null, arguments);
		},
		//走出商店
		outShop: function() {
			return walkOutShop.apply(null, arguments);
		},
		//停止走路
		stopWalk: function() {
			pauseWalk();
		},
		setColoer: function(value) {
			$boy.css('background-color', value)
		},
		//取花
		talkFlower: function() {
			return talkFlower()
		},
		//获取男孩的宽�?
		getWidth: function() {
			return $boy.width();
		},
		//复位初始状�?
		resetOriginal: function() {
			this.stopWalk();
			//恢复图片
			$boy.removeClass('slowWalk slowFlolerWalk').addClass('boyOriginal')
		},
		setFlolerWalk:function(){
			 $boy.addClass('slowFlolerWalk')
		},
		pushFlolerWalk:function(){
			 $boy.removeClass('slowFlolerWalk')
		},
		//转身动作
		rotate: function(callback) {
			   restoreWalk()
			   $boy.addClass('boy-rotate')
				   //监听转身完毕
			   if (callback) {
				   $boy.on(animationEnd, function() {
					   callback()
					   $(this).off();
				   })
			   }
		   },
	}
}
