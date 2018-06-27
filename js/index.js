$(function(){
	$("#hintShow").click(function(){
		$.hint("success","西想看到什么样的消息？ 我发给你哦")
	})
	$(".confirmShow").click(function(){
		$.confirm("你要点取消是吗？",function(){
			$.hint("success","你中奖了  谁让你点确定的")
		},function(){
			$.hint("error","叫你点你就点啊 是不是傻")
			$.confirm("你要点取消是吗？",function(){
				$.hint("warn","不说说了要点取消的吗？ 傻呀")
				$.confirm("你要点取消是吗？",function(){
					$.hint("error","不逗你玩了")
				})
			},function(){
				$.hint("warn","都叫你点确定了 不早点听话")
			})
		})
	})
})
