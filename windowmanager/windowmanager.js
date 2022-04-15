
// http://codepunk.hardwar.org.uk/ajs.htm

function getDefinedCss(s){
    if(!document.styleSheets) return '';
    if(typeof s== 'string') s= RegExp('\\b'+s+'\\b','i'); // IE capitalizes html selectors 

    var A, S, DS= document.styleSheets, n= DS.length, SA= [];
    while(n){
        S= DS[--n];
        A= (S.rules)? S.rules: S.cssRules;
		if(A != null){
		    for(var i= 0, L= A.length; i<L; i++){
		            tem= A[i].selectorText? [A[i].selectorText, A[i].style.cssText]: [A[i]+''];
		            if(s.test(tem[0])) SA[SA.length]= tem;
		    }
		}
    }
    return SA.join('\n\n');
}

function Window(id){
	//this.Name = name;
	this.minimized = "false";
	this.window_id = id;
	this.window_guid = undefined;
	this.oldsize = new Array();
	this.content_url = "";
	this.update_channels = new LinkedList();
	
	this.checkCSSClass = function(css_class,element){
									if( (this.customclass) && getDefinedCss(css_class+"_"+this.customclass) ){											
										element.setAttribute('class',css_class+"_"+this.customclass);																			
									}else{
										element.setAttribute('class',css_class);									
									}
								}
	
	this.element = document.createElement("div"); 
	this.element.setAttribute('id',"windowid-" + id);
	this.element.style.width="200px";
	this.element.style.height="200px";
	
	this.drag_bar_left = document.createElement("div"); 
	this.drag_bar_left.setAttribute('onmousedown',"WindowManager.close(this);");	
	this.drag_bar_left.style.height="23px";
	this.drag_bar_left.style.width="22px";
	
	this.drag_bar = document.createElement("div"); 	
	this.drag_bar.setAttribute('draggable','false');
	this.drag_bar.setAttribute('onmousedown',"WindowManager.dragstart(this);");
	this.drag_bar.innerHTML = "Test " + id;
	this.drag_bar.style.width=this.element.style.width;
	this.drag_bar.style.height="23px";
	
	this.drag_bar_minimize = document.createElement("div"); 	
	this.drag_bar_minimize.setAttribute('onmousedown',"WindowManager.minimize(this);");
	this.drag_bar_minimize.style.height="23px";
	this.drag_bar_minimize.style.width="22px";
	
	this.contents = document.createElement("div"); 
	this.contents.setAttribute('id',"windowid-" + id + "-content");
	this.contents.style.height="100px";
	this.contents.style.width="100px";
	this.contents.setAttribute('onmousedown',"WindowManager.totop(this);");
	
	this.bottom_bar = document.createElement("div"); 	
	this.bottom_bar.setAttribute('onmousedown',"WindowManager.totop(this);");
	this.bottom_bar.style.height="16px";
	this.bottom_bar.style.width="200px";
	
	this.size_button = document.createElement("div"); 		
	this.size_button.setAttribute('onmousedown',"WindowManager.sizestart(this);");
	this.size_button.style.height="16px";
	this.size_button.style.width="16px";
	
	this.bottom_bar.appendChild(this.size_button);
	
	/*this.header_table = document.createElement("table"); 	
	this.header_table.setAttribute('class','window_header_table');	
	this.header_table.setAttribute('rules','none');	
	
	
	var tmp = null;	
	var row = this.header_table.insertRow(0);
	tmp = row.insertCell(0);	
	tmp.appendChild(this.drag_bar_left);
	tmp = row.insertCell(1);
	tmp.appendChild(this.drag_bar);
	tmp = row.insertCell(2);
	tmp.appendChild(this.drag_bar_minimize);*/
	
	//this.element.appendChild(this.header_table);		
	
	this.element.appendChild(this.drag_bar_left);
	this.element.appendChild(this.drag_bar);
	this.element.appendChild(this.drag_bar_minimize);
	this.element.appendChild(this.contents);
	this.element.appendChild(this.bottom_bar);
	
	this.bar_element = document.createElement("span"); 
	this.bar_element.innerHTML = "a";
	this.bar_element.setAttribute('onclick',"WindowManager.BarElementClick(this);");
	this.bar_element.setAttribute('id',"windowid-" + id + "-bar");				
	this.bar_element.setAttribute('title',"windowid-" + id);	// TODO was anderes nehmen
	this.bar_element.tag = "windowid-" + id;
	
	this.xmlContents = false;
	this.xslurl = "";
	
	this.runAfterReload = function(){}
	
	this.customclass = null;
	this.resizeable = true;
	
	this.setGUID = function(guid){
		this.window_guid = guid;
	}
	
	this.registerUpdateChannel = function(channel){
		this.update_channels.add(channel);
	}
	
	this.loadXSL = function(){
		xhttp=new XMLHttpRequest();
		xhttp.open("GET",this.xslurl,false);
		xhttp.send("");
		this.xsl = xhttp.responseXML;
	}
	
	this.setXMLStyleSheet = function(style){
		this.xslurl = style;
		this.loadXSL();		
		this.xmlContents = true;
	}
	
	
	
	this.setContents = function(text){
									this.contents.innerHTML = text;
								}
	this.loadContentsHandler = function(resp){
									//rjal_log("loadContentsHandler");
									if (this.readyState == 4){
										if (this.status == 200){
											//rjal_log(resp.currentTarget.responseText);	
											if(this.sender.xmlContents == false){
												this.sender.contents.innerHTML = this.responseText;
												//this.sender.contents.innerHTML = "<img src=windowmanager/wait.gif>";												
											}else{
												this.sender.loadXSL();	
												xsltProcessor=new XSLTProcessor();
												xsltProcessor.importStylesheet(this.sender.xsl);
												resultDocument = xsltProcessor.transformToFragment(this.responseXML,document);
												if(resultDocument == null){
													this.sender.contents.innerHTML = "Error in XSL processing";
												}else{
													this.sender.contents.innerHTML = "";
													this.sender.contents.appendChild(resultDocument);
												}												
											}
											this.sender.runAfterReload(this.sender);
										}
									}
								}
	this.loadContents = function(url,params){
									var invocation = new XMLHttpRequest();
									this.content_url = url;
									invocation.open('GET', url, true);									
									invocation.onreadystatechange = this.loadContentsHandler;
									invocation.sender = this;
									this.contents.innerHTML = "<img width=100% height=100% src=windowmanager/wait.gif>";
									if(params != null){
										invocation.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
										//invocation.setRequestHeader("Content-length", params.length);
										//invocation.setRequestHeader("Connection", "close");
										invocation.send(params); 
									}else{
										invocation.send(null); 
									}
									
								}
	this.reloadContents = function(){
		this.loadContents(this.content_url);
	}
	
	this.setzIndex = function(zIndex){	this.element.style.zIndex = zIndex;	}	
	this.getzIndex = function(){	return this.element.style.zIndex;	}	
	this.deczIndex = function(){	if(this.element.style.zIndex > 0) this.element.style.zIndex--;	this.savePos();}
	this.getElement = function(){	return this.element;	};	
	this.getBarElement = function(){	return this.bar_element;	};
	
	this.setleft = function(left)	{										
									if(left < 0 ) 
										left = 0; 
									this.element.style.left=left+ "px";	}
	this.settop = function(top)	{	
									if(top < 0) 
										top = 0; 
									this.element.style.top=top+ "px";}
	this.setSize = function(x,y){										
									this.element.style.width=x+ "px"; 
									this.element.style.height=y+ "px";
									this.drag_bar.style.width=(x - 44) + "px"; 
									this.contents.style.width=x+ "px";
									//this.contents.style.height=(y - 16) + "px";
									this.contents.style.height=(y - 40) + "px";
									this.bottom_bar.style.width=x+ "px";									
								}
	this.changeSize = function(dx,dy){
									var tx = parseInt(this.element.style.width.replace(/px/g,""));
									var ty = parseInt(this.element.style.height.replace(/px/g,""));
									tx+=dx;
									ty+=dy;
									this.setSize(tx,ty);
								}
	
									
	this.setActive = function()	{	
									this.checkCSSClass('window_drag_bar_active',this.drag_bar);
									this.checkCSSClass('window_drag_bar_left_active',this.drag_bar_left);
									this.checkCSSClass('window_drag_bar_minimize_active',this.drag_bar_minimize);
								}
	this.setInactive = function(){	
									this.checkCSSClass('window_drag_bar_left_inactive',this.drag_bar_left);
									this.checkCSSClass('window_drag_bar_inactive',this.drag_bar);
									this.checkCSSClass('window_drag_bar_minimize_inactive',this.drag_bar_minimize);
								}
	
	this.setTitle = function(text){	
									this.drag_bar.innerHTML = text;
									this.setBarText("["+text+"] ");
									}
	
	this.setBarText = function(text){				
									this.bar_element.innerHTML = text;
								}
	

	this.show = function(){									
									this.element.style.visibility="visible";
									this.hidden=false;
									this.saveHidden();
									this.checkCSSClass('window_bar_active',this.bar_element);
							}
							
	this.hide = function(){									
									this.element.style.visibility="hidden";
									this.hidden=true;
									this.saveHidden();									
									this.checkCSSClass('window_bar_inactive',this.bar_element);									
							}
	this.showToggle = function(){
									if(this.hidden==true){
										this.show();
									}else{
										this.hide();
									}
								}	
	
	this.minimize = function(){ 
									if(this.minimized == "false"){
										this.minimized = "true";										
										this.saveSize();
										this.element.style.height = "23px";
										
									}else{
										this.minimized = "false";
										this.restoreSize();
									}
									this.saveMinimized();
									//rjal_log("Window Minimize");
								}
	this.setSetting = function(ext,value){
									var ident = "window_"+this.window_id;
									if (this.window_guid)
										ident = "window_"+this.window_guid;
									ident+="_"+ext;
									rjal_storage.setItem(ident,value);
									
								}
	this.getSetting = function(ext){
									var ident = "window_"+this.window_id;
									if (this.window_guid)
										ident = "window_"+this.window_guid;
									ident+="_"+ext;
									return rjal_storage.getItem(ident);
								}
								
	this.saveSize = function() 	{																		
									this.setSetting("x",this.element.style.width);
									this.setSetting("y",this.element.style.height);																		
								}
	this.restoreSize = function() {
									var tmp = this.getSetting("x");
									if(tmp != null){
										var tx = parseInt(tmp.replace(/px/g,""));
										var ty = parseInt(this.getSetting("y").replace(/px/g,""));										
										this.setSize(tx,ty);										
									}else{
										this.setSize(400,400);
									}
								}
	
	this.savePos = 	function(){									
									this.setSetting("top",this.element.style.top);
									this.setSetting("left",this.element.style.left);
									this.setSetting("z",this.element.style.zIndex);
									//rjal_log("savePos z : " + this.element.style.zIndex);
								}
	this.restorePos = function(){
									
									var tmp = this.getSetting("top");
									if(tmp != null){
										var tmp = parseInt(this.getSetting("top").replace(/px/g,""));									
										this.settop(tmp);
										tmp = parseInt(this.getSetting("left").replace(/px/g,""));									
										this.setleft(tmp);
										this.element.style.zIndex = this.getSetting("z");
									}
									//rjal_log("restorePos z : " + this.element.style.zIndex);
								}
	this.saveMinimized = function(){
									this.setSetting("minimized",this.minimized);
								}
	this.restoreMinimized = function(){
									this.minimized = this.getSetting("minimized");
									if(this.minimized == "true") this.minimized = "false";
									else this.minimized ="true";
									this.minimize();									
								}
	
	this.saveHidden = function(){
									this.setSetting("hidden",this.hidden);
	}
	
	this.restoreHidden = function(){
									this.hidden = this.getSetting("hidden");
									if(this.hidden == "true"){
										this.hide();
									}else{
										this.show();
									}
	}
	
	this.restoreWindow = function(){
									this.restorePos();
									this.restoreSize();
									this.restoreMinimized();
									this.restoreHidden();
									this.setInactive();
									this.checkCSSClass('window',this.element);
									this.checkCSSClass('window_contents',this.contents);						
									this.checkCSSClass('window_bottom_bar',this.bottom_bar);
									if(this.resizeable == true)
										this.checkCSSClass('window_size_button',this.size_button);
									else
										this.checkCSSClass('window_bottom_bar',this.bottom_bar);
									
								}
}

/*Window.prototype = {  
	
	    setActive: function (data){}
}*/



function onmousemove(ereignis)	{   WindowManager.onmousemove(ereignis);		}
function onmouseup()			{   WindowManager.onmouseup();		}
	
function WindowManagerObject(){	
	this.next_window_id = 1;
	this.dragpos = new Array();	
	this.mouspos = new Array();
	this.windows = new LinkedList();
	this.dragobjekt = null;	
	this.sizeobjekt = null;
	this.sizewindow = null;
	
	this.triggerUpdateChannel = function(channel){
		for(var i=0;i<this.windows._length;i++){
			var obj = this.windows.item(i);
			for(var i2=0;i2<obj.update_channels._length;i2++){			
				if ( obj.update_channels.item(i2) === channel ){
					obj.reloadContents();
				}
			}
		}		
	}
	
	//if(localStorage.windows == null) localStorage.windows = new Array();
	
	this.getWindowObject = function(window_id){
		var ret = null;		
		for(var i=0;i<this.windows._length;i++){
			var obj = this.windows.item(i);
			var id = "windowid-" + obj.window_id;		
			if( id == window_id){
				ret = obj;
				break;
			}
		}
		return ret;
	}
	
	this.setWindowTop = function(window){
		for(var i=0;i<this.windows._length;i++){
			var obj = this.windows.item(i);
			var id = "windowid-" + obj.window_id;
			obj.deczIndex();			
			if( id == window.id)
				dragclass = obj;
		}
		window.setzIndex(50);
		window.savePos();
		/*if(window != null){
			window.setActive();
		}*/
	};
	
	this.dragstart = function(object) {
		//rjal_log("Drag Start");  
		//object.style.background= "#BBBBBB"; 
		//var dragclass = null;
		this.dragobjekt = object.parentNode;  
		var window = this.getWindowObject(this.dragobjekt.id);		
		this.setWindowTop(window);
		/*for(var i=0;i<this.windows._length;i++){
			var obj = this.windows.item(i);
			var id = "windowid-" + obj.window_id;
			obj.deczIndex();			
			if( id == this.dragobjekt.id)
				dragclass = obj;
		}*/
		if(window != null){
			window.setActive();
		}
		var tmp = this.dragobjekt;
		
		
		this.dragpos["x"] = this.mouspos["x"] - this.dragobjekt.offsetLeft;
		this.dragpos["y"] = this.mouspos["y"] - this.dragobjekt.offsetTop;
	};
	
	this.drag = function(ereignis) {	
		//rjal_log("Drag Move");
		this.mouspos = rjal_getMousePosition(ereignis);	
		if(this.dragobjekt != null) {
			//rjal_log("Drag Move");
			var new_left = (this.mouspos["x"] - this.dragpos["x"]);
			if(new_left > 0)
				this.dragobjekt.style.left = new_left + "px";
				
			var new_top = (this.mouspos["y"] - this.dragpos["y"]);
			if(new_top > 0)
				this.dragobjekt.style.top = new_top + "px"
		}	
	};
	
	this.dragstop = function() {		
		//rjal_log("Drag Stop");
		if(	this.dragobjekt != null ){			
			var window = this.getWindowObject(this.dragobjekt.id);						
			if(window != null){
				window.setInactive();
				window.savePos();
			}
		}
		this.dragobjekt=null;				
	};
	
	this.size = function(ereignis) {	
		this.mouspos = rjal_getMousePosition(ereignis);	
		if(this.sizeobjekt != null) {
			//rjal_log("Size Move");
			var x = (this.mouspos["x"] - this.dragpos["x"]);
			var y = (this.mouspos["y"] - this.dragpos["y"]);
			
			//var window = this.getWindowObject(this.sizeobjekt.id);
			//rjal_log( x+ ":" + y);
			//rjal_log("X: "+this.mouspos["x"]+" , Y: "+this.mouspos["y"]);
			if( (this.sizewindow.resizeable == true) && ( this.mouspos["x"] < 2000 ) && ( this.mouspos["y"] < 2000) ){
				this.dragpos["x"] = this.mouspos["x"];
				this.dragpos["y"] = this.mouspos["y"];
				this.sizewindow.changeSize(x,y);
			}
			//this.sizewindow.setSize(x,y);
		}	
	};

	this.sizestart = function(object){
		//rjal_log("Size Start");		
		this.sizeobjekt = object.parentNode.parentNode;
		if(this.sizeobjekt != null){
			var tx = parseInt(this.sizeobjekt.style.width.replace(/px/g,""));
			var ty = parseInt(this.sizeobjekt.style.height.replace(/px/g,""));
			this.dragpos["x"] = this.mouspos["x"];
			this.dragpos["y"] = this.mouspos["y"];
			this.sizewindow = this.getWindowObject(this.sizeobjekt.id);
			this.setWindowTop(this.sizewindow);
		}		
		
	};
	
	this.sizestop = function(){
		//rjal_log("Size Stop");
		this.sizeobjekt = null;
		if(this.sizewindow != null){
			this.sizewindow.saveSize();
			this.sizewindow = null;
		}
	};
	
	this.minimize = function(object){
		//rjal_log("Minimze");
		var window = this.getWindowObject(object.parentNode.id);
		window.minimize();
		this.setWindowTop(window);

	};
	
	this.close = function(object){
		var window = this.getWindowObject(object.parentNode.id);
		window.hide();
		//rjal_log("Close");
	};
	
	this.BarElementClick = function(object){
		var window = this.getWindowObject(object.tag);
		window.showToggle();
	}
	
	this.totop = function(object){
		var window = this.getWindowObject(object.parentNode.id);
		this.setWindowTop(window);
	}
	
	this.onmouseup = function(){
		//rjal_log("Mouse Up");
		this.dragstop();
		this.sizestop();
	};
	
	this.onmousemove = function(ereignis){
		//rjal_log("Mouse Move");
		this.drag(ereignis);
		this.size(ereignis);
	}
	
	this.createWindow = function(id){
		var window_container = document.getElementById("window_container");		
		var windowsbar_container = document.getElementById("windowbar_container");
		var w;
		if(id){
			w = new Window(id);	
		}else{
			w = new Window(this.next_window_id++);	
		}
		window_container.appendChild(w.getElement());		
		if(windowsbar_container)
			windowsbar_container.appendChild(w.getBarElement());
		else
			rjal_log("Keinen windorbar container gefunden");
		
		//w.restoreWindow();			
		w.zIndex=last_zindex++;
		last_window+=100;		
		this.windows.add(w);
		return w;
	};
	
	this.draginit = function() {		
		//rjal_log("Drag Init");
		document.onmousemove = onmousemove;
		document.onmouseup = onmouseup;
	};
	
	this.draginit();
	
}

//localStorage.clear();

var WindowManager = new WindowManagerObject();
var rjal_storage = rjal_initStorage();

var last_window = 0;
var last_zindex=0;


/*for(var i in window){
	if(i == "sessionStorage")
		rjal_log(i);
}*/
//if(localStorage.test == null) localStorage.test = new Array();
//localStorage.test["1"] = 2;


   /* var file = Components.classes["@mozilla.org/file/directory_service;1"]  
                         .getService(Components.interfaces.nsIProperties)  
                         .get("ProfD", Components.interfaces.nsIFile);  
    file.append("my_db_file_name.sqlite");  
      
    var storageService = Components.classes["@mozilla.org/storage/service;1"]  
                            .getService(Components.interfaces.mozIStorageService);  
    var mDBConn = storageService.openDatabase(file); // Will also create the file if it does not exist  
	*/
   
//var database = openDatabase("Database Name", "Database Version");


