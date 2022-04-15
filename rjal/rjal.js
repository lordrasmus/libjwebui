var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};

function LinkedList() {
    this._length = 0;
    this._head = null;
	
	this.add =  function (data){

        //create a new node, place data in
        var node = {
                data: data,
                next: null
            },

            //used to traverse the structure
            current;

        //special case: no items in the list yet
        if (this._head === null){
            this._head = node;
        } else {
            current = this._head;

            while(current.next){
                current = current.next;
            }

            current.next = node;
        }

        //don't forget to update the count
        this._length++;

    },

    this.item = function(index){

        //check for out-of-bounds values
        if (index > -1 && index < this._length){
            var current = this._head,
                i = 0;

            while(i++ < index){
                current = current.next;
            }

            return current.data;
        } else {
            return null;
        }
    },
	
	this.remove = function(index){

        //check for out-of-bounds values
        if (index > -1 && index < this._length){

            var current = this._head,
                previous,
                i = 0;

            //special case: removing first item
            if (index === 0){
                this._head = current.next;
            } else {

                //find the right location
                while(i++ < index){
                    previous = current;
                    current = current.next;
                }

                //skip over the item to remove
                previous.next = current.next;
            }

            //decrement the length
            this._length--;

            //return the value
            return current.data;            

        } else {
            return null;
        }

    }

};

function rjal_setCookie(name, value) {
	var exp = new Date(); //set new date object
	exp.setTime(exp.getTime() + (1000 * 60 * 60 * 24 * 30)); //set it 30 days ahead
	document.cookie = name + "=" + escape(value) + "; path=/; expires=" + exp.toGMTString();
}

function rjal_getCookie(name) {
	var dc = document.cookie;
	var cname = name + "=";

	if (dc.length > 0) {	
		begin = dc.indexOf(cname);
		if (begin != -1) {
			begin += cname.length;		
			end = dc.indexOf(";", begin); 
			if (end == -1) end = dc.length;			
			var val = unescape(dc.substring(begin, end));			
			return val;
		}
	} 
	return null;
}

function rjal_log(text){
	if(BrowserDetect.browser == "Firefox"){	
		if(console){
			console.log(text); 
			return true; 
		}
	}
	if(BrowserDetect.browser == "Safari"){	console.log(text); return true; }
	if(BrowserDetect.browser == "Explorer"){	console.log(text); return true; }
	if(BrowserDetect.browser == "Opera")  { window.opera.postError(text); return true; }	
	if(BrowserDetect.browser == "Chrome")  { console.log(text); return true; }	
	alert(text);
	
}

function rjal_getMousePosition(ereignis){
	var ret = new Array();
	if(BrowserDetect.browser == "Explorer"){
		ret["x"] = window.event.clientX;
		ret["y"] = window.event.clientY;
		return ret;
	}
	ret["x"] = ereignis.pageX;
	ret["y"] = ereignis.pageY;
	return ret;
}

function rjal_json_encode(obj){
	return JSON.stringify(obj);		
}

function rjal_json_decode(text){
	return JSON.parse(text);		
}

var rjal_int_Storage;
var rjal_int_Storage_write=false;

function rjal_saveStorage(){
	//rjal_log("rjal_saveStorage");
	if(rjal_int_Storage_write == true){		
		rjal_int_Storage.saveStorage(rjal_int_Storage);
		rjal_int_Storage_write=false;
	}
}

function rjal_initStorage(){
	var ret = new rjal_localStorage();
	ret.loadStorage();	 
	rjal_int_Storage = ret;
	//rjal_saveStorage();
	window.setInterval(rjal_saveStorage, 500); 
	return ret;
}

function rjal_writeLocalStorage(key,value){
	if(BrowserDetect.browser == "Firefox"){		localStorage.setItem(key,value); return; }
	if(BrowserDetect.browser == "Safari"){	 	localStorage.setItem(key,value); return; }	
	if(BrowserDetect.browser == "Opera")  { 	rjal_setCookie(key,value);  return; }	
	if(BrowserDetect.browser == "Chrome")  { 													
												if(localStorage)
													localStorage.setItem(key,value); 
												else
													rjal_setCookie(key,value);  
												return;												
											}
	
	rjal_log("rjal_writeLocalStorage " + BrowserDetect.browser + " missing");	 
}

function rjal_readLocalStorage(key){
	if(BrowserDetect.browser == "Firefox"){		return localStorage.getItem(key); }
	if(BrowserDetect.browser == "Safari"){	 	return localStorage.getItem(key);  }	
	if(BrowserDetect.browser == "Opera")  { 	return  rjal_getCookie(key); }	
	if(BrowserDetect.browser == "Chrome"){	 																							
												if(localStorage)
													return localStorage.getItem(key); 
												else
													return  rjal_getCookie(key);  												
										}
	
	rjal_log("rjal_readLocalStorage " + BrowserDetect.browser + " missing");	
	
	return null;
}

function rjal_localStorage(){
	this.store = { "dummy":"empty" };
	//this.store_values = new Array();
	this.write = false;
	this.setItem = function(key,value){
		//rjal_log("Save " + key + ":" + value);
		if(localStorage){
			localStorage.setItem(key,value); 
			return;							
		}		
		
		this.store[key] = value;
		//var text = rjal_json_encode(this.store);		
		//rjal_log(this.store.length + ":" + text);
		this.write = true;
		rjal_int_Storage_write=true;		
		//localStorage.setItem(key,value);
	}
	this.getItem = function(key){
		if(localStorage){
			return localStorage.getItem(key); 			
		}	
		//return localStorage.getItem(key);
		var tmp = this.store[key];
		return tmp;
	}
	this.saveStorage = function(obj){
		if(obj.write == true){
			//rjal_log("rjal_localStorage writing");
			var text = rjal_json_encode(obj.store);			
			rjal_writeLocalStorage("rjal_locStore",text);			
			obj.write = false;
		}
	}
	this.loadStorage = function(){
		var text = rjal_readLocalStorage("rjal_locStore");
		if(text != null)
			this.store = rjal_json_decode(text);
	}
}


function rjal_init(){
	BrowserDetect.init();
	rjal_log(BrowserDetect.browser + " " + BrowserDetect.version + " on " + BrowserDetect.OS);
}

 rjal_init();

//localStorage.clear();
//var t = { ab: "tt", cd: "ee"};//new Array();
//t[0] = "a:b";
//t['b'] = "c";
//t.length = 1;
//var text = rjal_json_encode(t);

//rjal_log("JSON : " + text);
//rjal_log(t.toString());



