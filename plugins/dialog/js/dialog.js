;(function(){
	/*
	 * 弹窗 
	 *   ① 按钮 “名称-方法” 定制
	 * 	
	 * */
	//1、声明对象
	function Dialog(options){
		//参数复制 —— 校验及保护
		if(options.constructor !== Object){
			options = {};
		}
		//默认参数
		this.defaults = {
			title: "弹窗标题",
			content: "弹窗内容",
			left: null, //定位
			top: null,
			btn_title: null,
			btn_fn: null
			/*
			btn_titile: {
				'confirm': '确定',
				'cancel': '取消'
			},
			btn_fn: {
				'confirm': this.cancel,
				'cancel': this.cancel
			}
			*/
		};
		
		$.extend(this.defaults, options);
		console.log(this.defaults);
		this.init();
	}
	//2、声明原型
	Dialog.prototype = {
		constructor: Dialog,
		
		init: function(){
			//创建并在body中添加弹窗+蒙层
			this.diaDiv = this.createHTML();
			this.mask = this.createMask();
			
			//居中定位
			this.position();
			//关闭
			//this.closed();
			//绑定按钮事件
			this.bind();
			//窗体滚动、缩放时重定位
			this.resize();
		},
		//创建和绑定弹窗
		createHTML: function(){ 
			var diaDiv = $("<div></div>");
			diaDiv.attr("id", "plu_tipBox");
			diaDiv.attr("class", "plu_tipBox");
			var diaHTML = "";
			if(!!this.defaults.title){
				diaHTML += "<h3 class='plu_dialog_title'>" + this.defaults.title + "</h3>";
			}
			diaHTML += "<section class='plu_content clearfix'>"
					    + this.defaults.content
					    + "</section>";
			if(!!this.defaults.btn_title){
				diaHTML += "<div class='plu_btnGroup'>";
				for(var item in this.defaults.btn_title){
					var iTitle = this.defaults.btn_title[item];
					diaHTML += "<a href='javascript:;' class='plu_btn " + item + "'>" + iTitle + "</a> ";
				}
				diaHTML += "</div>";
			}
			diaDiv.html(diaHTML);
			$("body").append(diaDiv);
			
			return diaDiv;
		},
		//创建遮罩层
		createMask: function(){
			var mask = $("<div></div>");
			mask.addClass("plu_mask");
			$("body").append(mask);
			return mask;
		},
		//若无值，则居中
		position: function(){
			var isLeft = this.defaults.left!=null && !isNaN(Number(this.defaults.left));
			var isTop = this.defaults.top!=null && !isNaN(Number(this.defaults.top));
			var top = ($(window).height() - $(this.diaDiv).outerHeight())/2;
			var left = ($(window).width() - $(this.diaDiv).outerWidth())/2;
			
			if(isLeft && isTop){
				$(this.diaDiv).css({
					top: this.defaults.top + "px",
					left: this.defaults.left = "px"
				});
			}else if(isLeft){
				$(this.diaDiv).css({
					top: top + "px",
					left: this.defaults.left = "px"
				});
			}else if(isTop){
				$(this.diaDiv).css({
					top: this.defaults.top + "px",
					left: left = "px"
				});
			}else{
				$(this.diaDiv).css({
					top: top + "px",
					left: left = "px"
				});
			}
		},
		bind: function(){
			var _this = this;
			var titles = this.defaults.btn_title;
			var fns = this.defaults.btn_fn;
			for(var item in titles){
				$(".plu_btnGroup ."+item).bind("click", function(){
					if(!!fns[item]()){
						$(_this.diaDiv).remove();
						$(_this.mask).remove();
					}
				});
			}
		},
		resize: function(){
			var _this = this;
			$(window).bind("resize", function(){
				_this.center();
			});
		},
		center: function(){
			$(this.diaDiv).css({
				//console.log("滚动条到顶部的垂直高度: "+$(document).scrollTop());  
	            //console.log("页面的文档高度 ："+$(document).height());  
	            //console.log('浏览器的高度：'+$(window).height()); 
	            //此处的this是实例,无法和window下的diaDiv对应
                left: ($(document).width() - $(this.diaDiv).outerWidth()) / 2 + "px",
                top: $(document).scrollTop() + ($(window).height() - $(this.diaDiv).outerHeight()) / 2 + "px",
			});
		},
		cancel: function(){
			$(this.diaDiv).remove();
			$(this.mask).remove();
		},
		close: function(){
			var _this = this;
			$("#plu_tipBox .close").bind("click", function(){
				$(_this.diaDiv).remove();
				$(_this.mask).remove();
			});
		}
	};
	//3、挂载
	//依托ajax，挂载静态方法 —— 原理：全局变量（对象）
	$.dialog = function(options){
		/*
		 *  new 调用函数做的事情：
		 *    1. 在函数的内部创建一个隐藏对象   this = { } ;
		 *    2. 函数中this指向隐藏的对象
		 *    3. 执行函数，把属性通过this添加在隐藏的对象上  this.name = XX ;
		 *    4.返回这个对象  return this ;
		 *    
		 *    new用来创建对象/实例的函数，构造函数
		 * */
		new Dialog(options);
	}
})();