var AJAXifyX = new Class({

    Extends: Request.JSON,
	
	/**
	 * Default options - Can be overridden with setOptions
	 * 
	 */
	options: {
        method: 'get',
        link: 'cancel',
        noCache: true
	},
	initialize: function(options)
	{
		this.parent(options);
		
		this.historyKey = '';
		this.history = HistoryManager.register(
		this.historyKey,
			['home'],
			function(values){
				//this.to(parseInt(values[0]));
			}.bind(this),
			function(values){
				return [this.historyKey, '(', values[0], ')'].join('');
			}.bind(this),
			this.historyKey + '\\((\\w+)\\)'
		);

        	this.addEvent('request', this.onRequest.bind(this), true);
        	this.addEvent('complete', this.onComplete.bind(this), true);
	},
	sender: null,
	loading: $empty,
		
	morphAnchor: function (el)
	{
		var href = el.href.split("?");
		
		el.path = href[0];
		el.queryString = href[1];
		
		el.query = this.buildQueryArray(el.queryString);
		
		el.href = '#' + el.queryString;
		el.name = el.queryString;
		
		el.addEvent('click', function (event)
        	{
			AJAXify.sender = this;
			AJAXify.get(this.query);
			
			if ($type(event)) event.stop();
		});
	},
	
	onRequest: function()
	{
		if (this.loading != $empty)
		{
			this.loading.loop();
		}
	},
	
	onComplete: function(json, text)
	{
		if (this.loading != $empty)
			this.loading.interrupt();
	},
	
	buildQueryArray: function (qStr)
	{		
		if (qStr.contains("?"))
			qStr = qStr.split("?")[1];
		else if (qStr.contains("#"))
			qStr = qStr.split("#")[1];
		
		return qStr.parseQueryString();
	}
});
var AJAXify;

window.addEvent('domready', function(){
	AJAXify = new AJAXifyX();
});