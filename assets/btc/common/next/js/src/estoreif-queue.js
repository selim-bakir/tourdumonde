var ss = $;

(function ($) {
	
	ss.EstoreIfQueue = {
			
		// Estore API 호출 시 큐에 담을 것인지 바로 호출 할 것인지 판단
		setQueue : function(callbackFunction) {
			// 토큰 값이 있을 경우 로그인 되었다고 판단
			var token = $.cookies.get("iPlanetDirectoryPro", {domain : ".samsung.com"});
			var snsSessionId = $.cookies.get("snsSessionId", {domain : ".samsung.com"});
			
			// 토큰 값이 있고 ESTORE 연계 사이트일 경우에 큐에 쌓아둠
			if (token || snsSessionId)
			{
				if (USE_ESTORE)
				{
					if (this.getIsSignReady())
					{
						this.callFunction(callbackFunction, arguments);
					}
					else
					{
						this.queue.push(arguments);
					}
				}
				else
				{
					this.callFunction(callbackFunction, arguments);
				}
			}
			else
			{
				this.callFunction(callbackFunction, arguments);
			}
		},
		
		// 함수 실행
		callFunction : function(callbackFunction, arguments) {
			if (callbackFunction && typeof(callbackFunction) == "function")
			{
				var params = [];
				for (var i = 1; i < arguments.length; i++)
				{
					params.push(arguments[i]);
				}
				callbackFunction.apply(null, params);
			}
		},
			
		// 로그인 판단 시점 set
		setIsSignReady : function(result) {
			this.isSignReady = result;
			
			if (result == true)
			{
				for(var i = 0; i < this.queue.length; i++)
				{
					if (this.queue[i].length)
						this.callFunction(this.queue[i][0], this.queue[i]);
				}
			}
		},
		
		// 로그인 판단 시점 get
		getIsSignReady : function() {
			return this.isSignReady;
		},
		
		// set properties
		setProperties : function() {
			this.isSignReady = false;
			this.queue = [];
			
		},
		
		// initialize
		init : function() {
			this.setProperties();
		}
		
	};
	
	ss.EstoreIfQueue.init();
	
} (jQuery));

