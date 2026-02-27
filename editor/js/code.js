
import { LiteGraph } from "../../build/litegraph.core.js";
import { Editor } from "./litegraph-editor.js";

export var gl = null; // webgl_canvas

// remove to prevent access from the console (why should?)
if (typeof(global)=="object") global.LiteGraph = LiteGraph;
if (typeof(window)=="object") window.LiteGraph = LiteGraph;

LiteGraph.info?.("LiteGraph included");

var webgl_canvas = null;
let webglNodesPromise = null;

LiteGraph.node_images_path = "../nodes_data/";

var editor = new Editor("main",{miniwindow:false});
window.graphcanvas = editor.graphcanvas;
window.graph = editor.graph;
updateEditorHiPPICanvas();
window.addEventListener("resize", function() { 
 	editor.graphcanvas.resize();
  	updateEditorHiPPICanvas();
});
//window.addEventListener("keydown", editor.graphcanvas.processKey.bind(editor.graphcanvas) );
window.onbeforeunload = function(){
	var data = JSON.stringify( graph.serialize() );
	localStorage.setItem("litegraphg demo backup", data );
}

function updateEditorHiPPICanvas() {
  	const ratio = window.devicePixelRatio;
  	if(ratio == 1) { 
		return 
	}
  	const rect = editor.canvas.parentNode.getBoundingClientRect();
  	const { width, height } = rect;
  	editor.canvas.width = width * ratio;
  	editor.canvas.height = height * ratio;
  	editor.canvas.style.width = width + "px";
  	editor.canvas.style.height = height + "px";
  	editor.canvas.getContext("2d").scale(ratio, ratio);
  	return editor.canvas;
}

//enable scripting
LiteGraph.allow_scripts = true;

//test
//editor.graphcanvas.viewport = [200,200,400,400];

//create scene selector
var elem = document.createElement("span");
elem.id = "LGEditorTopBarSelector";
elem.className = "selector";
elem.innerHTML = "";
elem.innerHTML += "Demo <select><option>Empty</option></select> <button class='btn' id='save'>Save</button><button class='btn' id='load'>Load</button><button class='btn' id='download'>Download</button> | <button class='btn' id='webgl'>WebGL</button> <button class='btn' id='multiview'>Multiview</button>";
editor.tools.appendChild(elem);
var select = elem.querySelector("select");
select.addEventListener("change", function(e){
	var option = this.options[this.selectedIndex];
	var url = option.dataset["url"];
	
	if(url)
		graph.load( url );
	else if(option.callback)
		option.callback();
	else
		graph.clear();
});

elem.querySelector("#save").addEventListener("click",function(){
	console.log?.("saved");
	localStorage.setItem( "graphdemo_save", JSON.stringify( graph.serialize() ) );
});

elem.querySelector("#load").addEventListener("click",function(){
	var data = localStorage.getItem( "graphdemo_save" );
	if(data)
		graph.configure( JSON.parse( data ) );
	console.log?.("loaded");
});

elem.querySelector("#download").addEventListener("click",function(){
	var data = JSON.stringify( graph.serialize() );
	var file = new Blob( [ data ] );
	var url = URL.createObjectURL( file );
	var element = document.createElement("a");
	element.setAttribute('href', url);
	element.setAttribute('download', "graph.JSON" );
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
	setTimeout( function(){ URL.revokeObjectURL( url ); }, 1000*60 ); //wait one minute to revoke url	
});

elem.querySelector("#webgl").addEventListener("click", enableWebGL );
elem.querySelector("#multiview").addEventListener("click", function(){ editor.addMultiview()  } );


function addDemo( name, url ) {
	var option = document.createElement("option");
	if(url.constructor === String)
		option.dataset["url"] = url;
	else
		option.callback = url;
	option.innerHTML = name;
	select.appendChild( option );
}

function ensureWidgetComponentsDemoNodeType() {
	if (LiteGraph.registered_node_types["features/widget_components_demo"]) {
		return;
	}

	function WidgetComponentsDemoNode() {
		this.addInput("in", "number");
		this.addOutput("out", "number");
		this.properties = {
			value: 0.5,
		};

		var that = this;
		this.addWidget("slider", "Amount", 0.5, function(v) {
			that.properties.value = v;
		}, { min: 0, max: 1, precision: 3 });
		this.addWidget("number", "Step", 0.1, function(v) {
			that.properties.value = Number(v);
		}, { min: 0, max: 1, step: 0.1, precision: 2 });
		this.addWidget("combo", "Mode", "mix", function() {}, { values: ["mix", "add", "mul"] });
		this.addWidget("text", "Label", "custom draw", function() {}, { multiline: false });
		this.addWidget("toggle", "Enabled", true, function(v) {
			that.properties.enabled = v;
		}, { on: "on", off: "off" });
		this.addWidget("button", "Pulse", null, function() {
			that.boxcolor = "#6AA";
			setTimeout(function() { that.boxcolor = "#446"; }, 120);
		}, {});

		var customWidget = this.addWidget("custom", "Preview", null, null, {});
		customWidget.draw = function(ctx, node, widget_width, y, H) {
			var ratio = Number(node.properties.value || 0);
			if (ratio < 0) ratio = 0;
			if (ratio > 1) ratio = 1;
			ctx.save();
			ctx.fillStyle = "#1E293B";
			ctx.fillRect(15, y, widget_width - 30, H);
			ctx.fillStyle = "#22D3EE";
			ctx.fillRect(15, y, (widget_width - 30) * ratio, H);
			ctx.fillStyle = "#E2E8F0";
			ctx.textAlign = "center";
			ctx.fillText("custom " + (ratio * 100).toFixed(0) + "%", widget_width * 0.5, y + H * 0.7);
			ctx.restore();
		};

		this.size = this.computeSize();
		this.serialize_widgets = true;
	}

	WidgetComponentsDemoNode.title = "Widget Components Demo";
	WidgetComponentsDemoNode.prototype.onExecute = function() {
		this.setOutputData(0, Number(this.properties.value || 0));
	};

	LiteGraph.registerNodeType("features/widget_components_demo", WidgetComponentsDemoNode);
}

function loadWidgetComponentsTestDemo() {
	ensureWidgetComponentsDemoNodeType();
	graph.clear();

	var node_widgets = LiteGraph.createNode("features/widgets");
	node_widgets.pos = [60, 250];
	graph.add(node_widgets);

	var node_custom_widgets = LiteGraph.createNode("features/widget_components_demo");
	node_custom_widgets.pos = [350, 250];
	graph.add(node_custom_widgets);

	var node_shape = LiteGraph.createNode("features/shape");
	node_shape.pos = [660, 230];
	graph.add(node_shape);

	var node_slots = LiteGraph.createNode("features/slots");
	node_slots.pos = [900, 250];
	graph.add(node_slots);

	var node_const_a = LiteGraph.createNode("basic/const");
	node_const_a.pos = [60, 50];
	node_const_a.setValue(4.5);
	graph.add(node_const_a);

	var node_const_b = LiteGraph.createNode("basic/const");
	node_const_b.pos = [60, 130];
	node_const_b.setValue(10);
	graph.add(node_const_b);

	var node_math = LiteGraph.createNode("math/operation");
	node_math.pos = [300, 85];
	graph.add(node_math);

	var node_watch = LiteGraph.createNode("basic/watch");
	node_watch.pos = [560, 85];
	graph.add(node_watch);

	var node_button = LiteGraph.createNode("widget/button");
	node_button.pos = [650, 70];
	node_button.properties.text = "Trigger";
	graph.add(node_button);

	var node_console = LiteGraph.createNode("basic/console");
	node_console.pos = [880, 70];
	graph.add(node_console);

	node_const_a.connect(0, node_math, 0);
	node_const_b.connect(0, node_math, 1);
	node_math.connect(0, node_watch, 0);

	node_math.connect(0, node_custom_widgets, 0);
	node_custom_widgets.connect(0, node_shape, 0);
	node_shape.connect(0, node_slots, 0);

	node_button.connect(0, node_console, 0);

	graphcanvas.ds.offset = [40, 40];
	graphcanvas.setDirty(true, true);
}

//some examples
addDemo("Features", "examples/features.json");
addDemo("Benchmark", "examples/benchmark.json");
addDemo("Subgraph", "examples/subgraph.json");
addDemo("Audio", "examples/audio.json");
addDemo("Audio Delay", "examples/audio_delay.json");
addDemo("Audio Reverb", "examples/audio_reverb.json");
addDemo("MIDI Generation", "examples/midi_generation.json");
addDemo("Copy Paste", "examples/copypaste.json");
addDemo("Widget Components Test", loadWidgetComponentsTestDemo);
addDemo("autobackup", function(){
	var data = localStorage.getItem("litegraphg demo backup");
	if(!data)
		return;
	var graph_data = JSON.parse(data);
	graph.configure( graph_data );
});

//allows to use the WebGL nodes like textures
function enableWebGL() {
	if( webgl_canvas ) {
		webgl_canvas.style.display = (webgl_canvas.style.display == "none" ? "block" : "none");
		return;
	}

	const libs = [
		"./libs/gl-matrix-min.js",
		"./libs/litegl.js",
	];

	Promise.all(
		libs.map(async (scriptPath) => {
			await import(scriptPath);
			console.log?.(`${scriptPath} loaded successfully`);
		}),
	).then(on_ready)
		.catch((error) => {
			console.error?.(`Error loading webgl libs: ${error}`);
		});

	const on_ready = () => {
		console.log?.(this.src);
		if(!window.GL) {
			LiteGraph.warn?.("GL doesn't exist");
			return;
		}
		webgl_canvas = document.createElement("canvas");
		webgl_canvas.width = 400;
		webgl_canvas.height = 300;
		webgl_canvas.style.position = "absolute";
		webgl_canvas.style.top = "0px";
		webgl_canvas.style.right = "0px";
		webgl_canvas.style.border = "1px solid #AAA";

		webgl_canvas.addEventListener("click", function() {
			var rect = webgl_canvas.parentNode.getBoundingClientRect();
			if( webgl_canvas.width != rect.width ) {
				webgl_canvas.width = rect.width;
				webgl_canvas.height = rect.height;
			}
			else {
				webgl_canvas.width = 400;
				webgl_canvas.height = 300;
			}
		});

		var parent = document.querySelector(".editor-area");
		parent.appendChild( webgl_canvas );
		gl = GL.create({ canvas: webgl_canvas });
		if(!gl) {
			LiteGraph.warn?.("gl doesn't exist");
			return;
		}

		webglNodesPromise ??= import("../../build/litegraph.nodes.webgl.js")
			.then(() => {
				console.log?.("webgl nodes loaded successfully");
			})
			.catch((error) => {
				console.error?.(`Error loading webgl nodes: ${error}`);
				throw error;
			});

		webglNodesPromise.then(() => {
			editor.graph.onBeforeStep = () => {
				gl.clearColor(0,0,0,0);
				gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
				gl.viewport(0,0,gl.canvas.width, gl.canvas.height );
			}

			console.log?.("webgl ready");
		});
	}
}

// Tests
// CopyPasteWithConnectionToUnselectedOutputTest();
// demo();
