var URL = "https://localhost/";
//设计稿为640时设置rem
document.documentElement.style.fontSize = document.documentElement.clientWidth / 6.4 + 'px';
//为document添加公用插件必要的dom节点
$(function(){
	var confirm = '<div class="confirm fs24" id="confirm">' +
			'<div>' +
				'<div id="confirmMsg">消息内容</div>' +
				'<div>' +
					'<p class="lt" id="confirmError">取消</p>' +
					'<p class="lt" id="confirmSuccess">确定</p>' +
				'</div>' +
			'</div>' +
		'</div>';
	var hint = '<div class="hint" id="hints">' +
			'<div id="hint" class="rt" style="display: none;">' +
				'<img src="../icon/warn.png" class="lt"/>' +
				'<p class="lt fs24">测试文本</p>' +
			'</div>' +
		'</div>';
		
	$("body").append(confirm + hint);
})

//手机号
var ISPHONE = /^1(3|4|5|7|8)\d{9}$/;
//身份证
var ISIDCARD = /^(\d{15}$)|(^\d{17}([0-9]|x|X)$)/;
//验证码
var ISCODE = /^[0-9]{6}$/;
//姓名
var ISNAME = /^[\u4E00-\u9FA5\uf900-\ufa2d]{2,10}$/;
//密码
var ISPW = /^[0-9a-zA-Z]{3,12}$/;

//confirm
$.confirm = function(msg,success,error){
	var confirm = $("#confirm");
	if(confirm.is(".show")){
		setTimeout(showConfirm,400)
	}else{
		showConfirm();
	}
	function showConfirm(){
		confirm.fadeIn(200).addClass("active show");
		$("#confirmMsg").html(msg);
		$("#confirmError").unbind("click").click(function(){
			hideConfirm();
			error && error();
		})
		$("#confirmSuccess").unbind("click").click(function(){
			hideConfirm();
			success && success();
		})
	}
	
	function hideConfirm(){
		setTimeout(function(){
			confirm.fadeOut(200).removeClass("show");
		},200)
		confirm.removeClass("active");
	}
}

//hint
$.hint = function(type,msg){
	var dom = $("#hint").clone().attr("id","").show();
	//默认为警告 warn
	if(type == "success"){
		dom.children("img").attr("src","../icon/success.png");
	}else if(type == "error"){
		dom.children("img").attr("src","../icon/error.png");
	}
	dom.children("p").html(msg);
	setTimeout(function(){
		dom.fadeOut(400,function(){
			dom.remove()
		})
	},2000)
	$("#hints").append(dom)
}

//sessionStorage
$.session = function(key, str) {
	if(str) {
		if(typeof(str) != "string") {
			str = JSON.stringify(str);
		};
		sessionStorage.setItem(key, str);
		return true;
	} else {
		var str = sessionStorage.getItem(key);
		if(str) {
			try {
				return JSON.parse(str);
			} catch(err) {
				return str;
			}
		};
	}
};
//localStorage 
$.local = function(key, str) {
	if(str) {
		if(typeof(str) != "string") {
			str = JSON.stringify(str);
		}
		localStorage.setItem(key, str);
		return false
	} else {
		var str = localStorage.getItem(key);
		if(str) {
			try {
				return JSON.parse(str)
			} catch(err) {
				return str;
			}
		}
	}
};
//链接参数
$.href = function(url) {
	var obj = {};
	var a = url.split("?")[1];
	if(a) {
		var b = a.split("&");
		for(var i = 0, len = b.length; i < len; i++) {
			var p = b[i].split("=");
			obj[p[0]] = p[1];
		}
	}
	return obj
};
//数组去重
$.removerepet = function(ar) {
	var ret = [];
	for(var i = 0, j = ar.length; i < j; i++) {
		if(ret.indexOf(ar[i]) === -1) {
			ret.push(ar[i]);
		}
	}
	return ret;
};
//展示获取图片
$.imgshow = function(input, fn) {
	/*
	 	input:input dom节点
	 	fn : 回调函数 返回参数有file和base64 函数中将图片压缩至640px 同时处理了图片因拍摄设备不同 显示方向bug的问题
	 * */
	if(typeof(FileReader) === 'undefined') {
		$.hint("warn", "抱歉，你的浏览器不支持 FileReader，请更换浏览器再进行操作！");
		input.setAttribute('disabled', 'disabled');
	} else {
		input.addEventListener('change', function() {
			var data = [];
			var datalength = input.files.length;

			var reader = new FileReader();
			getData(0);

			function canvasDataURL(path, Orientation, callback) {
				var img = new Image();
				img.src = path;
				img.onload = function() {
					var that = this;
					// 默认按比例压缩
					var w = that.width,
						h = that.height,
						scale = w / h;
					w = 640;
					h = w / scale;
					//生成canvas
					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext('2d');

					var srcOrientation = 1;
					if(Orientation) {
						srcOrientation = Orientation;
					}
					// set proper canvas dimensions before transform & export 
					if([5, 6, 7, 8].indexOf(srcOrientation) > -1) {
						canvas.width = h;
						canvas.height = w;
					} else {
						canvas.width = w;
						canvas.height = h;
					}
					// transform context before drawing image
					switch(srcOrientation) {
						case 2:
							ctx.transform(-1, 0, 0, 1, w, 0);
							break;
						case 3:
							ctx.transform(-1, 0, 0, -1, w, h);
							break;
						case 4:
							ctx.transform(1, 0, 0, -1, 0, h);
							break;
						case 5:
							ctx.transform(0, 1, 1, 0, 0, 0);
							break;
						case 6:
							ctx.transform(0, 1, -1, 0, h, 0);
							break;
						case 7:
							ctx.transform(0, -1, -1, 0, h, w);
							break;
						case 8:
							ctx.transform(0, -1, 1, 0, 0, w);
							break;
						default:
							ctx.transform(1, 0, 0, 1, 0, 0);
					}
					ctx.drawImage(that, 0, 0, w, h);
					var base64 = canvas.toDataURL('image/jpeg');
					// 回调函数返回base64的值
					callback(base64);
				}
			}

			function photoCompress(file, num, Orientation) {
				var ready = new FileReader();
				/*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
				ready.readAsDataURL(file);
				ready.onload = function() {
					canvasDataURL(this.result, Orientation, function(urlData) {
						var arr = urlData.split(','),
							mime = arr[0].match(/:(.*?);/)[1],
							bstr = atob(arr[1]),
							n = bstr.length,
							u8arr = new Uint8Array(n);
						while(n--) {
							u8arr[n] = bstr.charCodeAt(n);
						}
						var fileBlob = new Blob([u8arr], {
							type: mime
						});
						data.push({
							file: file,
							result: urlData
						})
						ifReturn(num)
					})
				}
			}

			function getData(num) {
				reader.readAsArrayBuffer(input.files[num]);
				reader.onload = function(e) {
					var view = new DataView(this.result);
					if(view.getUint16(0, false) != 0xFFD8)
						return photoCompress(input.files[num], num, -2);
					var length = view.byteLength,
						offset = 2;
					while(offset < length) {
						var marker = view.getUint16(offset, false);
						offset += 2;
						if(marker == 0xFFE1) {
							if(view.getUint32(offset += 2, false) != 0x45786966){
								return photoCompress(input.files[num], num, -1);
							}
							var little = view.getUint16(offset += 6, false) == 0x4949;
							offset += view.getUint32(offset + 4, little);
							var tags = view.getUint16(offset, little);
							offset += 2;
							for(var i = 0; i < tags; i++){
								if(view.getUint16(offset + (i * 12), little) == 0x0112){
									return photoCompress(input.files[num], num, view.getUint16(offset + (i * 12) + 8, little));
								}
							}
						} else if((marker & 0xFF00) != 0xFF00){
							break;
						}else{
							offset += view.getUint16(offset, false);
						}
					}
					return photoCompress(input.files[num], num, -1);
				}
			}

			function ifReturn(num) {
				if(num < datalength - 1) {
					num++;
					getData(num);
				} else {
					fn(data)
				}
			}
		}, false)
	}
};

//ajax封装
$.query = Query = function(parameter) {
	/*
	 	url:地址, //必传
	 	data:交互数据
	 	success:fn 成功回调 //必传
	 	error:fn 失败回调
	 	isfile: 为true时 上传为formData 
	 * */
	if(!parameter.data) {
		parameter.data = {}
	}
	var option = {
		url: URL + parameter.url,
		type: 'POST',
		data: parameter.data,
		success: function(jsonData) {
			if(typeof(jsonData) != "object") {
				jsonData = JSON.parse(jsonData);
			}
			if(jsonData.status) {
				parameter.success(jsonData);
			} else {
				if(parameter.error) {
					parameter.error(jsonData);
				} else {
					$.hint("warn", jsonData.msg)
				}
			}
		},
		error: function(err) {
			console.log(JSON.stringify(err));
			$.hint("warn","网络连接中断 请刷新重新加载！");
		}
	};
	if(parameter.isfile) {
		option.contentType = false;
		option.processData = false;
	}
	$.ajax(option);
};