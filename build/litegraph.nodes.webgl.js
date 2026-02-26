var Bt=Object.defineProperty,Ht=(v,e,t)=>e in v?Bt(v,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):v[e]=t,a=(v,e,t)=>Ht(v,typeof e!="symbol"?e+"":e,t);import{LiteGraph as x}from"./litegraph.core.js";import{GL as h,Shader as b}from"../editor/js/libs/litegl.js";import{gl as i}from"../editor/js/code.js";x.LGraphCanvas.link_type_colors.Texture="#987";const Ut=.0174532925,T=class O{constructor(){this.addOutput("tex","Texture"),this.addOutput("name","string"),this.properties={name:"",filter:!0},this.size=[O.image_preview_size,O.image_preview_size]}static getTexturesContainer(){return i.textures}static loadTexture(e,t){t=t||{};var r=e;r.substr(0,7)=="http://"&&x.proxy&&(r=x.proxy+r.substr(7));var s=O.getTexturesContainer(),o=s[e]=h.Texture.fromURL(r,t);return o}static getTexture(e){var t=this.getTexturesContainer();if(!t)throw new Error("Cannot load texture, container of textures not found");var r=t[e];return!r&&e&&e[0]!=":"?this.loadTexture(e):r}static getTargetTexture(e,t,r){if(!e)throw new Error("LGraphTexture.getTargetTexture expects a reference texture");var s=null;switch(r){case O.LOW:s=i.UNSIGNED_BYTE;break;case O.HIGH:s=i.HIGH_PRECISION_FORMAT;break;case O.REUSE:return e;default:s=e?e.type:i.UNSIGNED_BYTE;break}return(!t||t.width!=e.width||t.height!=e.height||t.type!=s||t.format!=e.format)&&(t=new h.Texture(e.width,e.height,{type:s,format:e.format,filter:i.LINEAR})),t}static getTextureType(e,t){var r=t?t.type:i.UNSIGNED_BYTE;switch(e){case O.HIGH:r=i.HIGH_PRECISION_FORMAT;break;case O.LOW:r=i.UNSIGNED_BYTE;break}return r}static getWhiteTexture(){if(this._white_texture)return this._white_texture;var e=this._white_texture=h.Texture.fromMemory(1,1,[255,255,255,255],{format:i.RGBA,wrap:i.REPEAT,filter:i.NEAREST});return e}static getNoiseTexture(){if(this._noise_texture)return this._noise_texture;for(var e=new Uint8Array(512*512*4),t=0;t<512*512*4;++t)e[t]=Math.random()*255;var r=h.Texture.fromMemory(512,512,e,{format:i.RGBA,wrap:i.REPEAT,filter:i.NEAREST});return this._noise_texture=r,r}onDropFile(e,t,r){if(!e)this._drop_texture=null,this.properties.name="";else{var s=null;if(typeof e=="string")s=h.Texture.fromURL(e);else if(t.toLowerCase().indexOf(".dds")!=-1)s=h.Texture.fromDDSInMemory(e);else{var o=new Blob([r]),u=URL.createObjectURL(o);s=h.Texture.fromURL(u)}this._drop_texture=s,this.properties.name=t}}getExtraMenuOptions(){var e=this;if(this._drop_texture)return[{content:"Clear",callback:function(){e._drop_texture=null,e.properties.name=""}}]}onExecute(){var e=null;if(this.isOutputConnected(1)&&(e=this.getInputData(0)),!e&&this._drop_texture&&(e=this._drop_texture),!e&&this.properties.name&&(e=O.getTexture(this.properties.name)),!e){this.setOutputData(0,null),this.setOutputData(1,"");return}this._last_tex=e,this.properties.filter===!1?e.setParameter(i.TEXTURE_MAG_FILTER,i.NEAREST):e.setParameter(i.TEXTURE_MAG_FILTER,i.LINEAR),this.setOutputData(0,e),this.setOutputData(1,e.fullpath||e.filename);for(var t=2;t<this.outputs.length;t++){var r=this.outputs[t];if(r){var s=null;r.name=="width"?s=e.width:r.name=="height"?s=e.height:r.name=="aspect"&&(s=e.width/e.height),this.setOutputData(t,s)}}}onResourceRenamed(e,t){this.properties.name==e&&(this.properties.name=t)}onDrawBackground(e){if(!(this.flags.collapsed||this.size[1]<=20)){if(this._drop_texture&&e.webgl){e.drawImage(this._drop_texture,0,0,this.size[0],this.size[1]);return}if(this._last_preview_tex!=this._last_tex)if(e.webgl)this._canvas=this._last_tex;else{var t=O.generateLowResTexturePreview(this._last_tex);if(!t)return;this._last_preview_tex=this._last_tex,this._canvas=h.cloneCanvas(t)}this._canvas&&(e.save(),e.webgl||(e.translate(0,this.size[1]),e.scale(1,-1)),e.drawImage(this._canvas,0,0,this.size[0],this.size[1]),e.restore())}}static generateLowResTexturePreview(e){if(!e)return null;var t=O.image_preview_size,r=e;if(e.format==i.DEPTH_COMPONENT)return null;(e.width>t||e.height>t)&&(r=this._preview_temp_tex,this._preview_temp_tex||(r=new h.Texture(t,t,{minFilter:i.NEAREST}),this._preview_temp_tex=r),e.copyTo(r),e=r);var s=this._preview_canvas;return s||(s=h.createCanvas(t,t),this._preview_canvas=s),r&&r.toCanvas(s),s}getResources(e){return this.properties.name&&(e[this.properties.name]=h.Texture),e}onGetInputs(){return[["in","Texture"]]}onGetOutputs(){return[["width","number"],["height","number"],["aspect","number"]]}static replaceCode(e,t){return e.replace(/\{\{[a-zA-Z0-9_]*\}\}/g,function(r){return r=r.replace(/[{}]/g,""),t[r]||""})}};a(T,"title","Texture"),a(T,"desc","Texture"),a(T,"widgets_info",{name:{widget:"texture"},filter:{widget:"checkbox"}}),a(T,"loadTextureCallback",null),a(T,"image_preview_size",256),a(T,"UNDEFINED",0),a(T,"PASS_THROUGH",1),a(T,"COPY",2),a(T,"LOW",3),a(T,"HIGH",4),a(T,"REUSE",5),a(T,"DEFAULT",2),a(T,"MODE_VALUES",{undefined:T.UNDEFINED,"pass through":T.PASS_THROUGH,copy:T.COPY,low:T.LOW,high:T.HIGH,reuse:T.REUSE,default:T.DEFAULT});let l=T;x.registerNodeType("texture/texture",l);const Le=class It{constructor(){this.addInput("Texture","Texture"),this.properties={flipY:!1},this.size=[l.image_preview_size,l.image_preview_size]}onDrawBackground(e){if(!this.flags.collapsed&&!(!e.webgl&&!It.allow_preview)){var t=this.getInputData(0);if(t){var r=null;!t.handle&&e.webgl?r=t:r=l.generateLowResTexturePreview(t),e.save(),this.properties.flipY&&(e.translate(0,this.size[1]),e.scale(1,-1)),e.drawImage(r,0,0,this.size[0],this.size[1]),e.restore()}}}};a(Le,"title","Preview"),a(Le,"desc","Show a texture in the graph canvas"),a(Le,"allow_preview",!1);let Mt=Le;x.registerNodeType("texture/preview",Mt);class rt{constructor(){this.addInput("Texture","Texture"),this.addOutput("tex","Texture"),this.addOutput("name","string"),this.properties={name:"",generate_mipmaps:!1}}getPreviewTexture(){return this._texture}onExecute(){var e=this.getInputData(0);if(e){if(this.properties.generate_mipmaps&&(e.bind(0),e.setParameter(i.TEXTURE_MIN_FILTER,i.LINEAR_MIPMAP_LINEAR),i.generateMipmap(e.texture_type),e.unbind(0)),this.properties.name)if(l.storeTexture)l.storeTexture(this.properties.name,e);else{var t=l.getTexturesContainer();t[this.properties.name]=e}this._texture=e,this.setOutputData(0,e),this.setOutputData(1,this.properties.name)}}}a(rt,"title","Save"),a(rt,"desc","Save a texture in the repository"),x.registerNodeType("texture/save",rt);const k=class ge{constructor(){this.addInput("Texture","Texture"),this.addInput("TextureB","Texture"),this.addInput("value","number"),this.addOutput("Texture","Texture"),this.help="<p>pixelcode must be vec3, uvcode must be vec2, is optional</p>        <p><strong>uv:</strong> tex. coords</p><p><strong>color:</strong> texture <strong>colorB:</strong> textureB</p><p><strong>time:</strong> scene time <strong>value:</strong> input value</p><p>For multiline you must type: result = ...</p>",this.properties={value:1,pixelcode:"color + colorB * value",uvcode:"",precision:l.DEFAULT},this.has_error=!1}getExtraMenuOptions(){var e=this,t=e.properties.show?"Hide Texture":"Show Texture";return[{content:t,callback:function(){e.properties.show=!e.properties.show}}]}onPropertyChanged(){this.has_error=!1}onDrawBackground(e){this.flags.collapsed||this.size[1]<=20||!this.properties.show||this._tex&&this._tex.gl==e&&(e.save(),e.drawImage(this._tex,0,0,this.size[0],this.size[1]),e.restore())}onExecute(){var e=this.getInputData(0);if(this.isOutputConnected(0)){if(this.properties.precision===l.PASS_THROUGH){this.setOutputData(0,e);return}var t=this.getInputData(1);if(!(!this.properties.uvcode&&!this.properties.pixelcode)){var r=512,s=512;e?(r=e.width,s=e.height):t&&(r=t.width,s=t.height),t||(t=h.Texture.getWhiteTexture());var o=l.getTextureType(this.properties.precision,e);!e&&!this._tex?this._tex=new h.Texture(r,s,{type:o,format:i.RGBA,filter:i.LINEAR}):this._tex=l.getTargetTexture(e||this._tex,this._tex,this.properties.precision);var u="";this.properties.uvcode&&(u="uv = "+this.properties.uvcode,this.properties.uvcode.indexOf(";")!=-1&&(u=this.properties.uvcode));var n="";this.properties.pixelcode&&(n="result = "+this.properties.pixelcode,this.properties.pixelcode.indexOf(";")!=-1&&(n=this.properties.pixelcode));var c=this._shader;if(!this.has_error&&(!c||this._shader_code!=u+"|"+n)){var d=l.replaceCode(ge.pixel_shader,{UV_CODE:u,PIXEL_CODE:n});try{c=new h.Shader(b.SCREEN_VERTEX_SHADER,d),this.boxcolor="#00FF00"}catch(f){h.Shader.dumpErrorToConsole(f,b.SCREEN_VERTEX_SHADER,d),this.boxcolor="#FF0000",this.has_error=!0;return}this._shader=c,this._shader_code=u+"|"+n}if(this._shader){var _=this.getInputData(2);_!=null?this.properties.value=_:_=parseFloat(this.properties.value);var m=this.graph.getTime();this._tex.drawTo(function(){i.disable(i.DEPTH_TEST),i.disable(i.CULL_FACE),i.disable(i.BLEND),e&&e.bind(0),t&&t.bind(1);var f=Mesh.getScreenQuad();c.uniforms({u_texture:0,u_textureB:1,value:_,texSize:[r,s,1/r,1/s],time:m}).draw(f)}),this.setOutputData(0,this._tex)}}}}static registerPreset(e,t){ge.presets[e]=t}onInspect(e){var t=this;e.addCombo("Presets","",{values:Object.keys(ge.presets),callback:function(r){var s=ge.presets[r];s&&(t.setProperty("pixelcode",s),t.title=r,e.refresh())}})}};a(k,"widgets_info",{uvcode:{widget:"code"},pixelcode:{widget:"code"},precision:{widget:"combo",values:l.MODE_VALUES}}),a(k,"title","Operation"),a(k,"desc","Texture shader operation"),a(k,"presets",{}),a(k,"pixel_shader",`
        precision highp float;
    
        uniform sampler2D u_texture;
        uniform sampler2D u_textureB;
        varying vec2 v_coord;
        uniform vec4 texSize;
        uniform float time;
        uniform float value;
    
        void main() {
            vec2 uv = v_coord;
            {{UV_CODE}};
            vec4 color4 = texture2D(u_texture, uv);
            vec3 color = color4.rgb;
            vec4 color4B = texture2D(u_textureB, uv);
            vec3 colorB = color4B.rgb;
            vec3 result = color;
            float alpha = 1.0;
            {{PIXEL_CODE}};
            gl_FragColor = vec4(result, alpha);
        }
    `);let y=k;y.registerPreset("",""),y.registerPreset("bypass","color"),y.registerPreset("add","color + colorB * value"),y.registerPreset("substract","(color - colorB) * value"),y.registerPreset("mate","mix( color, colorB, color4B.a * value)"),y.registerPreset("invert","vec3(1.0) - color"),y.registerPreset("multiply","color * colorB * value"),y.registerPreset("divide","(color / colorB) / value"),y.registerPreset("difference","abs(color - colorB) * value"),y.registerPreset("max","max(color, colorB) * value"),y.registerPreset("min","min(color, colorB) * value"),y.registerPreset("displace","texture2D(u_texture, uv + (colorB.xy - vec2(0.5)) * value).xyz"),y.registerPreset("grayscale","vec3(color.x + color.y + color.z) * value / 3.0"),y.registerPreset("saturation","mix( vec3(color.x + color.y + color.z) / 3.0, color, value )"),y.registerPreset("normalmap",`
    float z0 = texture2D(u_texture, uv + vec2(-texSize.z, -texSize.w) ).x;
    float z1 = texture2D(u_texture, uv + vec2(0.0, -texSize.w) ).x;
    float z2 = texture2D(u_texture, uv + vec2(texSize.z, -texSize.w) ).x;
    float z3 = texture2D(u_texture, uv + vec2(-texSize.z, 0.0) ).x;
    float z4 = color.x;
    float z5 = texture2D(u_texture, uv + vec2(texSize.z, 0.0) ).x;
    float z6 = texture2D(u_texture, uv + vec2(-texSize.z, texSize.w) ).x;
    float z7 = texture2D(u_texture, uv + vec2(0.0, texSize.w) ).x;
    float z8 = texture2D(u_texture, uv + vec2(texSize.z, texSize.w) ).x;
    vec3 normal = vec3( z2 + 2.0*z4 + z7 - z0 - 2.0*z3 - z5, z5 + 2.0*z6 + z7 -z0 - 2.0*z1 - z2, 1.0 );
    normal.xy *= value;
    result.xyz = normalize(normal) * 0.5 + vec3(0.5);
`),y.registerPreset("threshold","vec3(color.x > colorB.x * value ? 1.0 : 0.0,color.y > colorB.y * value ? 1.0 : 0.0,color.z > colorB.z * value ? 1.0 : 0.0)"),x.registerNodeType("texture/operation",y);const J=class Ot{constructor(){this.addOutput("out","Texture"),this.properties={code:"",u_value:1,u_color:[1,1,1,1],width:512,height:512,precision:l.DEFAULT},this.properties.code=Ot.pixel_shader,this._uniforms={u_value:1,u_color:vec4.create(),in_texture:0,texSize:vec4.create(),time:0}}onPropertyChanged(e,t){if(e=="code"){var r=this.getShader();if(r){var s=r.uniformInfo;if(this.inputs){var o={};for(let d=0;d<this.inputs.length;++d){let _=this.getInputInfo(d);if(_){if(s[_.name]&&!o[_.name]){o[_.name]=!0;continue}this.removeInput(d),d--}}}for(let d in s){let _=r.uniformInfo[d];if(_.loc!==null&&d!="time"){var u="number";if(this._shader.samplers[d])u="texture";else switch(_.size){case 1:u="number";break;case 2:u="vec2";break;case 3:u="vec3";break;case 4:u="vec4";break;case 9:u="mat3";break;case 16:u="mat4";break;default:continue}var n=this.findInputSlot(d);if(n==-1){this.addInput(d,u);continue}var c=this.getInputInfo(n);if(!c)this.addInput(d,u);else{if(c.type==u)continue;this.removeInput(n,u),this.addInput(d,u)}}}}}}getShader(){if(this._shader&&this._shader_code==this.properties.code)return this._shader;if(this._shader_code=this.properties.code,this._shader=new h.Shader(b.SCREEN_VERTEX_SHADER,this.properties.code),this._shader)this.boxcolor="green";else return this.boxcolor="red",null;return this._shader}onExecute(){if(this.isOutputConnected(0)){var e=this.getShader();if(e){var t=0,r=null;if(this.inputs)for(var s=0;s<this.inputs.length;++s){var o=this.getInputInfo(s),u=this.getInputData(s);u!=null&&(u.constructor===h.Texture&&(u.bind(t),r||(r=u),u=t,t++),e.setUniform(o.name,u))}var n=this._uniforms,c=l.getTextureType(this.properties.precision,r),d=this.properties.width|0,_=this.properties.height|0;d==0&&(d=r?r.width:i.canvas.width),_==0&&(_=r?r.height:i.canvas.height),n.texSize[0]=d,n.texSize[1]=_,n.texSize[2]=1/d,n.texSize[3]=1/_,n.time=this.graph.getTime(),n.u_value=this.properties.u_value,n.u_color.set(this.properties.u_color),(!this._tex||this._tex.type!=c||this._tex.width!=d||this._tex.height!=_)&&(this._tex=new h.Texture(d,_,{type:c,format:i.RGBA,filter:i.LINEAR}));var m=this._tex;m.drawTo(function(){e.uniforms(n).draw(h.Mesh.getScreenQuad())}),this.setOutputData(0,this._tex)}}}};a(J,"title","Shader"),a(J,"desc","Texture shader"),a(J,"widgets_info",{code:{type:"code",lang:"glsl"},precision:{widget:"combo",values:l.MODE_VALUES}}),a(J,"pixel_shader",`
        precision highp float;
    
        varying vec2 v_coord;
        uniform float time; // time in seconds
        uniform vec4 texSize; // tex resolution
        uniform float u_value;
        uniform vec4 u_color;
    
        void main() {
            vec2 uv = v_coord;
            vec3 color = vec3(0.0);
            // Your custom code here
            color.xy = uv;
    
            gl_FragColor = vec4(color, 1.0);
        }
    `);let Vt=J;x.registerNodeType("texture/shader",Vt);const ee=class Rt{constructor(){this.addInput("in","Texture"),this.addInput("scale","vec2"),this.addInput("offset","vec2"),this.addOutput("out","Texture"),this.properties={offset:vec2.fromValues(0,0),scale:vec2.fromValues(1,1),precision:l.DEFAULT}}onExecute(){var e=this.getInputData(0);if(!(!this.isOutputConnected(0)||!e)){if(this.properties.precision===l.PASS_THROUGH){this.setOutputData(0,e);return}var t=e.width,r=e.height,s=this.precision===l.LOW?i.UNSIGNED_BYTE:i.HIGH_PRECISION_FORMAT;this.precision===l.DEFAULT&&(s=e.type),(!this._tex||this._tex.width!=t||this._tex.height!=r||this._tex.type!=s)&&(this._tex=new h.Texture(t,r,{type:s,format:i.RGBA,filter:i.LINEAR}));var o=this._shader;o||(o=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,Rt.pixel_shader));var u=this.getInputData(1);u?(this.properties.scale[0]=u[0],this.properties.scale[1]=u[1]):u=this.properties.scale;var n=this.getInputData(2);n?(this.properties.offset[0]=n[0],this.properties.offset[1]=n[1]):n=this.properties.offset,this._tex.drawTo(function(){i.disable(i.DEPTH_TEST),i.disable(i.CULL_FACE),i.disable(i.BLEND),e.bind(0);var c=Mesh.getScreenQuad();o.uniforms({u_texture:0,u_scale:u,u_offset:n}).draw(c)}),this.setOutputData(0,this._tex)}}};a(ee,"widgets_info",{precision:{widget:"combo",values:l.MODE_VALUES}}),a(ee,"title","Scale/Offset"),a(ee,"desc","Applies an scaling and offseting"),a(ee,"pixel_shader",`
        precision highp float;
    
        uniform sampler2D u_texture;
        uniform sampler2D u_textureB;
        varying vec2 v_coord;
        uniform vec2 u_scale;
        uniform vec2 u_offset;
    
        void main() {
            vec2 uv = v_coord;
            uv = uv / u_scale - u_offset;
            gl_FragColor = texture2D(u_texture, uv);
        }
    `);let kt=ee;x.registerNodeType("texture/scaleOffset",kt);const Pe=class Ct{constructor(){a(this,"pixel_shader",`
        precision highp float;
    
        uniform sampler2D u_texture;
        uniform sampler2D u_textureB;
        varying vec2 v_coord;
        uniform float u_factor;
        uniform vec2 u_scale;
        uniform vec2 u_offset;
    
        void main() {
            vec2 uv = v_coord;
            uv += (texture2D(u_textureB, uv).rg - vec2(0.5)) * u_factor * u_scale + u_offset;
            gl_FragColor = texture2D(u_texture, uv);
        }
    `),this.addInput("in","Texture"),this.addInput("warp","Texture"),this.addInput("factor","number"),this.addOutput("out","Texture"),this.properties={factor:.01,scale:[1,1],offset:[0,0],precision:l.DEFAULT},this._uniforms={u_texture:0,u_textureB:1,u_factor:1,u_scale:vec2.create(),u_offset:vec2.create()}}onExecute(){var e=this.getInputData(0);if(this.isOutputConnected(0)){if(this.properties.precision===l.PASS_THROUGH){this.setOutputData(0,e);return}var t=this.getInputData(1),r=512,s=512;e?(r=e.width,s=e.height):t&&(r=t.width,s=t.height),!e&&!this._tex?this._tex=new h.Texture(r,s,{type:this.precision===l.LOW?i.UNSIGNED_BYTE:i.HIGH_PRECISION_FORMAT,format:i.RGBA,filter:i.LINEAR}):this._tex=l.getTargetTexture(e||this._tex,this._tex,this.properties.precision);var o=this._shader;o||(o=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,Ct.pixel_shader));var u=this.getInputData(2);u!=null?this.properties.factor=u:u=parseFloat(this.properties.factor);var n=this._uniforms;n.u_factor=u,n.u_scale.set(this.properties.scale),n.u_offset.set(this.properties.offset),this._tex.drawTo(function(){i.disable(i.DEPTH_TEST),i.disable(i.CULL_FACE),i.disable(i.BLEND),e&&e.bind(0),t&&t.bind(1);var c=Mesh.getScreenQuad();o.uniforms(n).draw(c)}),this.setOutputData(0,this._tex)}}};a(Pe,"widgets_info",{precision:{widget:"combo",values:l.MODE_VALUES}}),a(Pe,"title","Warp"),a(Pe,"desc","Texture warp operation");let Xt=Pe;x.registerNodeType("texture/warp",Xt);const X=class z{constructor(){this.addInput("Texture","Texture"),this.properties={additive:!1,antialiasing:!1,filter:!0,disable_alpha:!1,gamma:1,viewport:[0,0,1,1]},this.size[0]=130}onDrawBackground(e){if(!(this.flags.collapsed||this.size[1]<=40)){var t=this.getInputData(0);t&&e.drawImage(e==i?t:i.canvas,10,30,this.size[0]-20,this.size[1]-40)}}onExecute(){var e=this.getInputData(0);if(e){this.properties.disable_alpha?i.disable(i.BLEND):(i.enable(i.BLEND),this.properties.additive?i.blendFunc(i.SRC_ALPHA,i.ONE):i.blendFunc(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA)),i.disable(i.DEPTH_TEST);var t=this.properties.gamma||1;this.isInputConnected(1)&&(t=this.getInputData(1)),e.setParameter(i.TEXTURE_MAG_FILTER,this.properties.filter?i.LINEAR:i.NEAREST);var r=z._prev_viewport;r.set(i.viewport_data);var s=this.properties.viewport;if(i.viewport(r[0]+r[2]*s[0],r[1]+r[3]*s[1],r[2]*s[2],r[3]*s[3]),this.properties.antialiasing){z._shader||(z._shader=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,z.aa_pixel_shader));var o=Mesh.getScreenQuad();e.bind(0),z._shader.uniforms({u_texture:0,uViewportSize:[e.width,e.height],u_igamma:1/t,inverseVP:[1/e.width,1/e.height]}).draw(o)}else t!=1?(z._gamma_shader||(z._gamma_shader=new h.Shader(b.SCREEN_VERTEX_SHADER,z.gamma_pixel_shader)),e.toViewport(z._gamma_shader,{u_texture:0,u_igamma:1/t})):e.toViewport();i.viewport(r[0],r[1],r[2],r[3])}}onGetInputs(){return[["gamma","number"]]}};a(X,"title","to Viewport"),a(X,"desc","Texture to viewport"),a(X,"_prev_viewport",new Float32Array(4)),a(X,"aa_pixel_shader",`
        precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform vec2 uViewportSize;
        uniform vec2 inverseVP;
        uniform float u_igamma;
        #define FXAA_REDUCE_MIN   (1.0/128.0)
        #define FXAA_REDUCE_MUL   (1.0/8.0)
        #define FXAA_SPAN_MAX     8.0
    
        vec4 applyFXAA(sampler2D tex, vec2 fragCoord) {
            vec4 color = vec4(0.0);
            vec3 rgbNW = texture2D(tex, (fragCoord + vec2(-1.0, -1.0)) * inverseVP).xyz;
            vec3 rgbNE = texture2D(tex, (fragCoord + vec2(1.0, -1.0)) * inverseVP).xyz;
            vec3 rgbSW = texture2D(tex, (fragCoord + vec2(-1.0, 1.0)) * inverseVP).xyz;
            vec3 rgbSE = texture2D(tex, (fragCoord + vec2(1.0, 1.0)) * inverseVP).xyz;
            vec3 rgbM  = texture2D(tex, fragCoord * inverseVP).xyz;
            vec3 luma = vec3(0.299, 0.587, 0.114);
            
            // Rest of the FXAA algorithm
            
            return color;
        }
    
        void main() {
            gl_FragColor = applyFXAA(u_texture, v_coord * uViewportSize);
        }
    `),a(X,"gamma_pixel_shader",`
        precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform float u_igamma;
    
        void main() {
            vec4 color = texture2D(u_texture, v_coord);
            color.xyz = pow(color.xyz, vec3(u_igamma));
            gl_FragColor = color;
        }
    `);let Wt=X;x.registerNodeType("texture/toviewport",Wt);class Fe{constructor(){this.addInput("Texture","Texture"),this.addOutput("","Texture"),this.properties={size:0,generate_mipmaps:!1,precision:l.DEFAULT}}onExecute(){var e=this.getInputData(0);if(!(!e&&!this._temp_texture)&&this.isOutputConnected(0)){if(e){var t=e.width,r=e.height;this.properties.size!=0&&(t=this.properties.size,r=this.properties.size);var s=this._temp_texture,o=e.type;if(this.properties.precision===l.LOW?o=i.UNSIGNED_BYTE:this.properties.precision===l.HIGH&&(o=i.HIGH_PRECISION_FORMAT),!s||s.width!=t||s.height!=r||s.type!=o){var u=i.LINEAR;this.properties.generate_mipmaps&&h.isPowerOfTwo(t)&&h.isPowerOfTwo(r)&&(u=i.LINEAR_MIPMAP_LINEAR),this._temp_texture=new h.Texture(t,r,{type:o,format:i.RGBA,minFilter:u,magFilter:i.LINEAR})}e.copyTo(this._temp_texture),this.properties.generate_mipmaps&&(this._temp_texture.bind(0),i.generateMipmap(this._temp_texture.texture_type),this._temp_texture.unbind(0))}this.setOutputData(0,this._temp_texture)}}}a(Fe,"title","Copy"),a(Fe,"desc","Copy Texture"),a(Fe,"widgets_info",{size:{widget:"combo",values:[0,32,64,128,256,512,1024,2048]},precision:{widget:"combo",values:l.MODE_VALUES}}),x.registerNodeType("texture/copy",Fe);const te=class Qe{constructor(){this.addInput("Texture","Texture"),this.addOutput("","Texture"),this.properties={iterations:1,generate_mipmaps:!1,precision:l.DEFAULT}}onExecute(){var e=this.getInputData(0);if(!(!e&&!this._temp_texture)&&this.isOutputConnected(0)&&!(!e||e.texture_type!==h.TEXTURE_2D)){if(this.properties.iterations<1){this.setOutputData(0,e);return}var t=Qe._shader;t||(Qe._shader=t=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,Qe.pixel_shader));var r=e.width|0,s=e.height|0,o=e.type;this.properties.precision===l.LOW?o=i.UNSIGNED_BYTE:this.properties.precision===l.HIGH&&(o=i.HIGH_PRECISION_FORMAT);var u=this.properties.iterations||1,n=e,c=null,d=[],_={type:o,format:e.format},m=vec2.create(),f={u_offset:m};this._texture&&h.Texture.releaseTemporary(this._texture);for(let g=0;g<u&&(m[0]=1/r,m[1]=1/s,r=r>>1||0,s=s>>1||0,c=h.Texture.getTemporary(r,s,_),d.push(c),n.setParameter(h.TEXTURE_MAG_FILTER,h.NEAREST),n.copyTo(c,t,f),!(r==1&&s==1));++g)n=c;this._texture=d.pop();for(let g=0;g<d.length;++g)h.Texture.releaseTemporary(d[g]);this.properties.generate_mipmaps&&(this._texture.bind(0),i.generateMipmap(this._texture.texture_type),this._texture.unbind(0)),this.setOutputData(0,this._texture)}}};a(te,"title","Downsample"),a(te,"desc","Downsample Texture"),a(te,"widgets_info",{iterations:{type:"number",step:1,precision:0,min:0},precision:{widget:"combo",values:l.MODE_VALUES}}),a(te,"pixel_shader",`
        precision highp float;
        uniform sampler2D u_texture;
        uniform vec2 u_offset;
        varying vec2 v_coord;
    
        void main() {
            vec4 color = texture2D(u_texture, v_coord);
            color += texture2D(u_texture, v_coord + vec2(u_offset.x, 0.0));
            color += texture2D(u_texture, v_coord + vec2(0.0, u_offset.y));
            color += texture2D(u_texture, v_coord + u_offset);
            gl_FragColor = color * 0.25;
        }
    `);let Yt=te;x.registerNodeType("texture/downsample",Yt);class Ge{constructor(){this.addInput("Texture","Texture"),this.addOutput("","Texture"),this.properties={size:[512,512],generate_mipmaps:!1,precision:l.DEFAULT}}onExecute(){var e=this.getInputData(0);if(!(!e&&!this._temp_texture)&&this.isOutputConnected(0)&&!(!e||e.texture_type!==h.TEXTURE_2D)){var t=this.properties.size[0]|0,r=this.properties.size[1]|0;t==0&&(t=e.width),r==0&&(r=e.height);var s=e.type;this.properties.precision===l.LOW?s=i.UNSIGNED_BYTE:this.properties.precision===l.HIGH&&(s=i.HIGH_PRECISION_FORMAT),(!this._texture||this._texture.width!=t||this._texture.height!=r||this._texture.type!=s)&&(this._texture=new h.Texture(t,r,{type:s})),e.copyTo(this._texture),this.properties.generate_mipmaps&&(this._texture.bind(0),i.generateMipmap(this._texture.texture_type),this._texture.unbind(0)),this.setOutputData(0,this._texture)}}}a(Ge,"title","Resize"),a(Ge,"desc","Resize Texture"),a(Ge,"widgets_info",{iterations:{type:"number",step:1,precision:0,min:0},precision:{widget:"combo",values:l.MODE_VALUES}}),x.registerNodeType("texture/resize",Ge);const Be=class Q{constructor(){this.addInput("Texture","Texture"),this.addOutput("tex","Texture"),this.addOutput("avg","vec4"),this.addOutput("lum","number"),this.properties={use_previous_frame:!0,high_quality:!1},this._uniforms={u_texture:0,u_mipmap_offset:0},this._luminance=new Float32Array(4)}onExecute(){this.properties.use_previous_frame||this.updateAverage();var e=this._luminance;this.setOutputData(0,this._temp_texture),this.setOutputData(1,e),this.setOutputData(2,(e[0]+e[1]+e[2])/3)}onPreRenderExecute(){this.updateAverage()}updateAverage(){var e=this.getInputData(0);if(e&&!(!this.isOutputConnected(0)&&!this.isOutputConnected(1)&&!this.isOutputConnected(2))){if(!Q._shader){Q._shader=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,Q.pixel_shader);for(var t=new Float32Array(16),r=0;r<t.length;++r)t[r]=Math.random();Q._shader.uniforms({u_samples_a:t.subarray(0,16),u_samples_b:t.subarray(16,32)})}var s=this._temp_texture,o=i.UNSIGNED_BYTE;e.type!=o&&(o=i.FLOAT),(!s||s.type!=o)&&(this._temp_texture=new h.Texture(1,1,{type:o,format:i.RGBA,filter:i.NEAREST})),this._uniforms.u_mipmap_offset=0,this.properties.high_quality&&((!this._temp_pot2_texture||this._temp_pot2_texture.type!=o)&&(this._temp_pot2_texture=new h.Texture(512,512,{type:o,format:i.RGBA,minFilter:i.LINEAR_MIPMAP_LINEAR,magFilter:i.LINEAR})),e.copyTo(this._temp_pot2_texture),e=this._temp_pot2_texture,e.bind(0),i.generateMipmap(h.TEXTURE_2D),this._uniforms.u_mipmap_offset=9);var u=Q._shader,n=this._uniforms;if(n.u_mipmap_offset=this.properties.mipmap_offset,i.disable(i.DEPTH_TEST),i.disable(i.BLEND),this._temp_texture.drawTo(function(){e.toViewport(u,n)}),this.isOutputConnected(1)||this.isOutputConnected(2)){var c=this._temp_texture.getPixels();if(c){var d=this._luminance;o=this._temp_texture.type,d.set(c),o==i.UNSIGNED_BYTE?vec4.scale(d,d,1/255):o==h.HALF_FLOAT||o==h.HALF_FLOAT_OES}}}}};a(Be,"title","Average"),a(Be,"desc",`Compute a partial average (32 random samples) of a texture and stores it as a 1x1 pixel texture.
 If high_quality is true, then it generates the mipmaps first and reads from the lower one.`),a(Be,"pixel_shader",`
        precision highp float;
        uniform mat4 u_samples_a;
        uniform mat4 u_samples_b;
        uniform sampler2D u_texture;
        uniform float u_mipmap_offset;
        varying vec2 v_coord;
    
        void main() {
            vec4 color = vec4(0.0);
            
            // Random average
            for (int i = 0; i < 4; ++i) {
                for (int j = 0; j < 4; ++j) {
                    color += texture2D(u_texture, vec2(u_samples_a[i][j], u_samples_b[i][j]), u_mipmap_offset);
                    color += texture2D(u_texture, vec2(1.0 - u_samples_a[i][j], 1.0 - u_samples_b[i][j]), u_mipmap_offset);
                }
            }
            
            gl_FragColor = color * 0.03125;
        }
    `);let jt=Be;x.registerNodeType("texture/average",jt);const He=class Te{constructor(){this.addInput("in","Texture"),this.addInput("factor","Number"),this.addOutput("out","Texture"),this.properties={factor:.5},this._uniforms={u_texture:0,u_textureB:1,u_factor:this.properties.factor}}onExecute(){var e=this.getInputData(0);if(!(!e||!this.isOutputConnected(0))){Te._shader||(Te._shader=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,Te.pixel_shader));var t=this._temp_texture;if(!t||t.type!=e.type||t.width!=e.width||t.height!=e.height){var r={type:e.type,format:i.RGBA,filter:i.NEAREST};this._temp_texture=new h.Texture(e.width,e.height,r),this._temp_texture2=new h.Texture(e.width,e.height,r),e.copyTo(this._temp_texture2)}var s=this._temp_texture,o=this._temp_texture2,u=Te._shader,n=this._uniforms;n.u_factor=1-this.getInputOrProperty("factor"),i.disable(i.BLEND),i.disable(i.DEPTH_TEST),s.drawTo(function(){o.bind(1),e.toViewport(u,n)}),this.setOutputData(0,s),this._temp_texture=o,this._temp_texture2=s}}};a(He,"title","Smooth"),a(He,"desc","Smooth texture over time"),a(He,"pixel_shader",`precision highp float;
    precision highp float;
    uniform sampler2D u_texture;
    uniform sampler2D u_textureB;
    uniform float u_factor;
    varying vec2 v_coord;
    
    void main() {
        gl_FragColor = mix( texture2D( u_texture, v_coord ), texture2D( u_textureB, v_coord ), u_factor );
    }
    `);let qt=He;x.registerNodeType("texture/temporal_smooth",qt);const W=class P{constructor(){this.addInput("in","Texture"),this.addOutput("avg","Texture"),this.addOutput("array","Texture"),this.properties={samples:64,frames_interval:1},this._uniforms={u_texture:0,u_textureB:1,u_samples:this.properties.samples,u_isamples:1/this.properties.samples},this.frame=0}getPreviewTexture(){return this._temp_texture2}onExecute(){var e=this.getInputData(0);if(!(!e||!this.isOutputConnected(0))){P._shader||(P._shader_copy=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,P.pixel_shader_copy),P._shader_avg=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,P.pixel_shader_avg));var t=clamp(this.properties.samples,0,64),r=this.frame,s=this.properties.frames_interval;if(s==0||r%s==0){var o=this._temp_texture;if(!o||o.type!=e.type||o.width!=t){var u={type:e.type,format:i.RGBA,filter:i.NEAREST};this._temp_texture=new h.Texture(t,1,u),this._temp_texture2=new h.Texture(t,1,u),this._temp_texture_out=new h.Texture(1,1,u)}var n=this._temp_texture,c=this._temp_texture2,d=P._shader_copy,_=P._shader_avg,m=this._uniforms;m.u_samples=t,m.u_isamples=1/t,i.disable(i.BLEND),i.disable(i.DEPTH_TEST),n.drawTo(function(){c.bind(1),e.toViewport(d,m)}),this._temp_texture_out.drawTo(function(){n.toViewport(_,m)}),this.setOutputData(0,this._temp_texture_out),this._temp_texture=c,this._temp_texture2=n}else this.setOutputData(0,this._temp_texture_out);this.setOutputData(1,this._temp_texture2),this.frame++}}};a(W,"title","Lineal Avg Smooth"),a(W,"desc","Smooth texture linearly over time"),a(W,"@samples",{type:"number",min:1,max:64,step:1,precision:1}),a(W,"pixel_shader_copy",`precision highp float;
    precision highp float;
    uniform sampler2D u_texture;
    uniform sampler2D u_textureB;
    uniform float u_isamples;
    varying vec2 v_coord;
    
    void main() {
        if( v_coord.x <= u_isamples )
            gl_FragColor = texture2D( u_texture, vec2(0.5) );
        else
            gl_FragColor = texture2D( u_textureB, v_coord - vec2(u_isamples,0.0) );
    }
    `),a(W,"pixel_shader_avg",`precision highp float;
    precision highp float;
    uniform sampler2D u_texture;
    uniform int u_samples;
    uniform float u_isamples;
    varying vec2 v_coord;
    
    void main() {
        vec4 color = vec4(0.0);
        for(int i = 0; i < 64; ++i)
        {
            color += texture2D( u_texture, vec2( float(i)*u_isamples,0.0) );
            if(i == (u_samples - 1))
                break;
        }
        gl_FragColor = color * u_isamples;
    }
    `);let Qt=W;x.registerNodeType("texture/linear_avg_smooth",Qt);class it{constructor(){this.addInput("Image","image"),this.addOutput("","Texture"),this.properties={}}onExecute(){var e,t=this.getInputData(0);if(t){var r=t.videoWidth||t.width,s=t.videoHeight||t.height;if(t.gltexture){this.setOutputData(0,t.gltexture);return}var o=this._temp_texture;(!o||o.width!=r||o.height!=s)&&(this._temp_texture=new h.Texture(r,s,{format:i.RGBA,filter:i.LINEAR}));try{this._temp_texture.uploadImage(t)}catch(u){(e=console.error)==null||e.call(console,"image comes from an unsafe location, cannot be uploaded to webgl: "+u);return}this.setOutputData(0,this._temp_texture)}}}a(it,"title","Image to Texture"),a(it,"desc","Uploads an image to the GPU"),x.registerNodeType("texture/imageToTexture",it);const re=class Ee{constructor(){this.addInput("Texture","Texture"),this.addInput("LUT","Texture"),this.addInput("Intensity","number"),this.addOutput("","Texture"),this.properties={enabled:!0,intensity:1,precision:l.DEFAULT,texture:null},Ee._shader||(Ee._shader=new h.Shader(b.SCREEN_VERTEX_SHADER,Ee.pixel_shader))}onExecute(){if(this.isOutputConnected(0)){var e=this.getInputData(0);if(this.properties.precision===l.PASS_THROUGH||this.properties.enabled===!1){this.setOutputData(0,e);return}if(e){var t=this.getInputData(1);if(t||(t=l.getTexture(this.properties.texture)),!t){this.setOutputData(0,e);return}t.bind(0),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.bindTexture(i.TEXTURE_2D,null);var r=this.properties.intensity;this.isInputConnected(2)&&(this.properties.intensity=r=this.getInputData(2)),this._tex=l.getTargetTexture(e,this._tex,this.properties.precision),this._tex.drawTo(function(){t.bind(1),e.toViewport(Ee._shader,{u_texture:0,u_textureB:1,u_amount:r})}),this.setOutputData(0,this._tex)}}}};a(re,"widgets_info",{texture:{widget:"texture"},precision:{widget:"combo",values:l.MODE_VALUES}}),a(re,"title","LUT"),a(re,"desc","Apply LUT to Texture"),a(re,"pixel_shader",`precision highp float;
    precision highp float;
    varying vec2 v_coord;
    uniform sampler2D u_texture;
    uniform sampler2D u_textureB;
    uniform float u_amount;
    
    void main() {
            lowp vec4 textureColor = clamp( texture2D(u_texture, v_coord), vec4(0.0), vec4(1.0) );
            mediump float blueColor = textureColor.b * 63.0;
            mediump vec2 quad1;
            quad1.y = floor(floor(blueColor) / 8.0);
            quad1.x = floor(blueColor) - (quad1.y * 8.0);
            mediump vec2 quad2;
            quad2.y = floor(ceil(blueColor) / 8.0);
            quad2.x = ceil(blueColor) - (quad2.y * 8.0);
            highp vec2 texPos1;
            texPos1.x = (quad1.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.r);
            texPos1.y = 1.0 - ((quad1.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.g));
            highp vec2 texPos2;
            texPos2.x = (quad2.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.r);
            texPos2.y = 1.0 - ((quad2.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.g));
            lowp vec4 newColor1 = texture2D(u_textureB, texPos1);
            lowp vec4 newColor2 = texture2D(u_textureB, texPos2);
            lowp vec4 newColor = mix(newColor1, newColor2, fract(blueColor));
            gl_FragColor = vec4( mix( textureColor.rgb, newColor.rgb, u_amount), textureColor.w);
    }
    `);let $t=re;x.registerNodeType("texture/LUT",$t);const ie=class ye{constructor(){this.addInput("Texture","Texture"),this.addInput("Atlas","Texture"),this.addOutput("","Texture"),this.properties={enabled:!0,num_row_symbols:4,symbol_size:16,brightness:1,colorize:!1,filter:!1,invert:!1,precision:l.DEFAULT,generate_mipmaps:!1,texture:null},ye._shader||(ye._shader=new h.Shader(b.SCREEN_VERTEX_SHADER,ye.pixel_shader)),this._uniforms={u_texture:0,u_textureB:1,u_row_simbols:4,u_simbol_size:16,u_res:vec2.create()}}onExecute(){if(this.isOutputConnected(0)){var e=this.getInputData(0);if(this.properties.precision===l.PASS_THROUGH||this.properties.enabled===!1){this.setOutputData(0,e);return}if(e){var t=this.getInputData(1);if(t||(t=l.getTexture(this.properties.texture)),!t){this.setOutputData(0,e);return}t.bind(0),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,this.properties.filter?i.LINEAR:i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,this.properties.filter?i.LINEAR:i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.bindTexture(i.TEXTURE_2D,null);var r=this._uniforms;r.u_row_simbols=Math.floor(this.properties.num_row_symbols),r.u_symbol_size=this.properties.symbol_size,r.u_brightness=this.properties.brightness,r.u_invert=this.properties.invert?1:0,r.u_colorize=this.properties.colorize?1:0,this._tex=l.getTargetTexture(e,this._tex,this.properties.precision),r.u_res[0]=this._tex.width,r.u_res[1]=this._tex.height,this._tex.bind(0),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),this._tex.drawTo(function(){t.bind(1),e.toViewport(ye._shader,r)}),this.properties.generate_mipmaps&&(this._tex.bind(0),i.generateMipmap(this._tex.texture_type),this._tex.unbind(0)),this.setOutputData(0,this._tex)}}}};a(ie,"widgets_info",{texture:{widget:"texture"},precision:{widget:"combo",values:l.MODE_VALUES}}),a(ie,"title","Encode"),a(ie,"desc","Apply a texture atlas to encode a texture"),a(ie,"pixel_shader",`precision highp float;
    precision highp float;
    varying vec2 v_coord;
    uniform sampler2D u_texture;
    uniform sampler2D u_textureB;
    uniform float u_row_simbols;
    uniform float u_symbol_size;
    uniform float u_brightness;
    uniform float u_invert;
    uniform float u_colorize;
    uniform vec2 u_res;
    
    void main() {
        vec2 total_symbols = u_res / u_symbol_size;
        vec2 uv = floor(v_coord * total_symbols) / total_symbols; //pixelate 
        vec2 local_uv = mod(v_coord * u_res, u_symbol_size) / u_symbol_size;
        lowp vec4 textureColor = texture2D(u_texture, uv );
        float lum = clamp(u_brightness * (textureColor.x + textureColor.y + textureColor.z)/3.0,0.0,1.0);
        if( u_invert == 1.0 ) lum = 1.0 - lum;
        float index = floor( lum * (u_row_simbols * u_row_simbols - 1.0));
        float col = mod( index, u_row_simbols );
        float row = u_row_simbols - floor( index / u_row_simbols ) - 1.0;
        vec2 simbol_uv = ( vec2( col, row ) + local_uv ) / u_row_simbols;
        vec4 color = texture2D( u_textureB, simbol_uv );
        if(u_colorize == 1.0)
            color *= textureColor;
        gl_FragColor = color;
    }
    `);let Zt=ie;x.registerNodeType("texture/encode",Zt);const Ue=class we{constructor(){this.addInput("Texture","Texture"),this.addOutput("R","Texture"),this.addOutput("G","Texture"),this.addOutput("B","Texture"),this.addOutput("A","Texture"),we._shader||(we._shader=new h.Shader(b.SCREEN_VERTEX_SHADER,we.pixel_shader))}onExecute(){var e=this.getInputData(0);if(e){this._channels||(this._channels=Array(4));var t=i.RGB,r=0;for(let n=0;n<4;n++)this.isOutputConnected(n)?((!this._channels[n]||this._channels[n].width!=e.width||this._channels[n].height!=e.height||this._channels[n].type!=e.type||this._channels[n].format!=t)&&(this._channels[n]=new h.Texture(e.width,e.height,{type:e.type,format:t,filter:i.LINEAR})),r++):this._channels[n]=null;if(r){i.disable(i.BLEND),i.disable(i.DEPTH_TEST);var s=Mesh.getScreenQuad(),o=we._shader,u=[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];for(let n=0;n<4;n++)this._channels[n]&&(this._channels[n].drawTo(function(){e.bind(0),o.uniforms({u_texture:0,u_mask:u[n]}).draw(s)}),this.setOutputData(n,this._channels[n]))}}}};a(Ue,"title","Texture to Channels"),a(Ue,"desc","Split texture channels"),a(Ue,"pixel_shader",`precision highp float;
        precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform vec4 u_mask;
        
        void main() {
            gl_FragColor = vec4( vec3( length( texture2D(u_texture, v_coord) * u_mask )), 1.0 );
        }
        `);let Kt=Ue;x.registerNodeType("texture/textureChannels",Kt);const se=class De{constructor(){this.addInput("R","Texture"),this.addInput("G","Texture"),this.addInput("B","Texture"),this.addInput("A","Texture"),this.addOutput("Texture","Texture"),this.properties={precision:l.DEFAULT,R:1,G:1,B:1,A:1},this._color=vec4.create(),this._uniforms={u_textureR:0,u_textureG:1,u_textureB:2,u_textureA:3,u_color:this._color}}onExecute(){var e=l.getWhiteTexture(),t=this.getInputData(0)||e,r=this.getInputData(1)||e,s=this.getInputData(2)||e,o=this.getInputData(3)||e;i.disable(i.BLEND),i.disable(i.DEPTH_TEST);var u=Mesh.getScreenQuad();De._shader||(De._shader=new h.Shader(b.SCREEN_VERTEX_SHADER,De.pixel_shader));var n=De._shader,c=Math.max(t.width,r.width,s.width,o.width),d=Math.max(t.height,r.height,s.height,o.height),_=this.properties.precision==l.HIGH?l.HIGH_PRECISION_FORMAT:i.UNSIGNED_BYTE;(!this._texture||this._texture.width!=c||this._texture.height!=d||this._texture.type!=_)&&(this._texture=new h.Texture(c,d,{type:_,format:i.RGBA,filter:i.LINEAR}));var m=this._color;m[0]=this.properties.R,m[1]=this.properties.G,m[2]=this.properties.B,m[3]=this.properties.A;var f=this._uniforms;this._texture.drawTo(function(){t.bind(0),r.bind(1),s.bind(2),o.bind(3),n.uniforms(f).draw(u)}),this.setOutputData(0,this._texture)}};a(se,"title","Channels to Texture"),a(se,"desc","Split texture channels"),a(se,"widgets_info",{precision:{widget:"combo",values:l.MODE_VALUES}}),a(se,"pixel_shader",`precision highp float;
    precision highp float;
    varying vec2 v_coord;
    uniform sampler2D u_textureR;
    uniform sampler2D u_textureG;
    uniform sampler2D u_textureB;
    uniform sampler2D u_textureA;
    uniform vec4 u_color;
    
    void main() {
        gl_FragColor = u_color * vec4(                 texture2D(u_textureR, v_coord).r,                texture2D(u_textureG, v_coord).r,                texture2D(u_textureB, v_coord).r,                texture2D(u_textureA, v_coord).r);
    }
    `);let Jt=se;x.registerNodeType("texture/channelsTexture",Jt);class Me{constructor(){this.addOutput("Texture","Texture"),this._tex_color=vec4.create(),this.properties={color:vec4.create(),precision:l.DEFAULT}}onDrawBackground(e){var t=this.properties.color;e.fillStyle="rgb("+Math.floor(clamp(t[0],0,1)*255)+","+Math.floor(clamp(t[1],0,1)*255)+","+Math.floor(clamp(t[2],0,1)*255)+")",this.flags.collapsed?this.boxcolor=e.fillStyle:e.fillRect(0,0,this.size[0],this.size[1])}onExecute(){var e=this.properties.precision==l.HIGH?l.HIGH_PRECISION_FORMAT:i.UNSIGNED_BYTE;(!this._tex||this._tex.type!=e)&&(this._tex=new h.Texture(1,1,{format:i.RGBA,type:e,minFilter:i.NEAREST}));var t=this.properties.color;if(this.inputs)for(var r=0;r<this.inputs.length;r++){var s=this.inputs[r],o=this.getInputData(r);if(o!==void 0)switch(s.name){case"RGB":case"RGBA":t.set(o);break;case"R":t[0]=o;break;case"G":t[1]=o;break;case"B":t[2]=o;break;case"A":t[3]=o;break}}vec4.sqrDist(this._tex_color,t)>.001&&(this._tex_color.set(t),this._tex.fill(t)),this.setOutputData(0,this._tex)}onGetInputs(){return[["RGB","vec3"],["RGBA","vec4"],["R","number"],["G","number"],["B","number"],["A","number"]]}}a(Me,"title","Color"),a(Me,"desc","Generates a 1x1 texture with a constant color"),a(Me,"widgets_info",{precision:{widget:"combo",values:l.MODE_VALUES}}),x.registerNodeType("texture/color",Me);const H=class be{constructor(){this.addInput("A","color"),this.addInput("B","color"),this.addOutput("Texture","Texture"),this.properties={angle:0,scale:1,A:[0,0,0],B:[1,1,1],texture_size:32},be._shader||(be._shader=new h.Shader(b.SCREEN_VERTEX_SHADER,be.pixel_shader)),this._uniforms={u_angle:0,u_colorA:vec3.create(),u_colorB:vec3.create()}}onExecute(){i.disable(i.BLEND),i.disable(i.DEPTH_TEST);var e=h.Mesh.getScreenQuad(),t=be._shader,r=this.getInputData(0);r||(r=this.properties.A);var s=this.getInputData(1);s||(s=this.properties.B);for(var o=2;o<this.inputs.length;o++){var u=this.inputs[o],n=this.getInputData(o);n!==void 0&&(this.properties[u.name]=n)}var c=this._uniforms;this._uniforms.u_angle=this.properties.angle*Ut,this._uniforms.u_scale=this.properties.scale,vec3.copy(c.u_colorA,r),vec3.copy(c.u_colorB,s);var d=parseInt(this.properties.texture_size);(!this._tex||this._tex.width!=d)&&(this._tex=new h.Texture(d,d,{format:i.RGB,filter:i.LINEAR})),this._tex.drawTo(function(){t.uniforms(c).draw(e)}),this.setOutputData(0,this._tex)}onGetInputs(){return[["angle","number"],["scale","number"]]}};a(H,"title","Gradient"),a(H,"desc","Generates a gradient"),a(H,"@A",{type:"color"}),a(H,"@B",{type:"color"}),a(H,"@texture_size",{type:"enum",values:[32,64,128,256,512]}),a(H,"pixel_shader",`precision highp float;
        precision highp float;
        varying vec2 v_coord;
        uniform float u_angle;
        uniform float u_scale;
        uniform vec3 u_colorA;
        uniform vec3 u_colorB;
        
        vec2 rotate(vec2 v, float angle)
        {
            vec2 result;
            float _cos = cos(angle);
            float _sin = sin(angle);
            result.x = v.x * _cos - v.y * _sin;
            result.y = v.x * _sin + v.y * _cos;
            return result;
        }
        void main() {
            float f = (rotate(u_scale * (v_coord - vec2(0.5)), u_angle) + vec2(0.5)).x;
            vec3 color = mix(u_colorA,u_colorB,clamp(f,0.0,1.0));
            gl_FragColor = vec4(color,1.0);
        }
        `);let er=H;x.registerNodeType("texture/gradient",er);const oe=class M{constructor(){this.addInput("A","Texture"),this.addInput("B","Texture"),this.addInput("Mixer","Texture"),this.addOutput("Texture","Texture"),this.properties={factor:.5,size_from_biggest:!0,invert:!1,precision:l.DEFAULT},this._uniforms={u_textureA:0,u_textureB:1,u_textureMix:2,u_mix:vec4.create()}}onExecute(){var e=this.getInputData(0);if(this.isOutputConnected(0)){if(this.properties.precision===l.PASS_THROUGH){this.setOutputData(0,e);return}var t=this.getInputData(1);if(!(!e||!t)){var r=this.getInputData(2),s=this.getInputData(3);this._tex=l.getTargetTexture(this.properties.size_from_biggest&&t.width>e.width?t:e,this._tex,this.properties.precision),i.disable(i.BLEND),i.disable(i.DEPTH_TEST);var o=Mesh.getScreenQuad(),u=null,n=this._uniforms;if(r)u=M._shader_tex,u||(u=M._shader_tex=new h.Shader(b.SCREEN_VERTEX_SHADER,M.pixel_shader,{MIX_TEX:""}));else{u=M._shader_factor,u||(u=M._shader_factor=new h.Shader(b.SCREEN_VERTEX_SHADER,M.pixel_shader));var c=s==null?this.properties.factor:s;n.u_mix.set([c,c,c,c])}var d=this.properties.invert;this._tex.drawTo(function(){e.bind(d?1:0),t.bind(d?0:1),r&&r.bind(2),u.uniforms(n).draw(o)}),this.setOutputData(0,this._tex)}}}onGetInputs(){return[["factor","number"]]}};a(oe,"title","Mix"),a(oe,"desc","Generates a texture mixing two textures"),a(oe,"widgets_info",{precision:{widget:"combo",values:l.MODE_VALUES}}),a(oe,"pixel_shader",`precision highp float;
        precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_textureA;
        uniform sampler2D u_textureB;
        #ifdef MIX_TEX
            uniform sampler2D u_textureMix;
        #else
            uniform vec4 u_mix;
        #endif
        
        void main() {
            #ifdef MIX_TEX
                vec4 f = texture2D(u_textureMix, v_coord);
            #else
                vec4 f = u_mix;
            #endif
            gl_FragColor = mix( texture2D(u_textureA, v_coord), texture2D(u_textureB, v_coord), f );
        }
        `);let tr=oe;x.registerNodeType("texture/mix",tr);const ae=class Se{constructor(){this.addInput("Tex.","Texture"),this.addOutput("Edges","Texture"),this.properties={invert:!0,threshold:!1,factor:1,precision:l.DEFAULT},Se._shader||(Se._shader=new h.Shader(b.SCREEN_VERTEX_SHADER,Se.pixel_shader))}onExecute(){if(this.isOutputConnected(0)){var e=this.getInputData(0);if(this.properties.precision===l.PASS_THROUGH){this.setOutputData(0,e);return}if(e){this._tex=l.getTargetTexture(e,this._tex,this.properties.precision),i.disable(i.BLEND),i.disable(i.DEPTH_TEST);var t=Mesh.getScreenQuad(),r=Se._shader,s=this.properties.invert,o=this.properties.factor,u=this.properties.threshold?1:0;this._tex.drawTo(function(){e.bind(0),r.uniforms({u_texture:0,u_isize:[1/e.width,1/e.height],u_factor:o,u_threshold:u,u_invert:s?1:0}).draw(t)}),this.setOutputData(0,this._tex)}}}};a(ae,"title","Edges"),a(ae,"desc","Detects edges"),a(ae,"widgets_info",{precision:{widget:"combo",values:l.MODE_VALUES}}),a(ae,"pixel_shader",`precision highp float;
        precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform vec2 u_isize;
        uniform int u_invert;
        uniform float u_factor;
        uniform float u_threshold;
        
        void main() {
            vec4 center = texture2D(u_texture, v_coord);
            vec4 up = texture2D(u_texture, v_coord + u_isize * vec2(0.0,1.0) );
            vec4 down = texture2D(u_texture, v_coord + u_isize * vec2(0.0,-1.0) );
            vec4 left = texture2D(u_texture, v_coord + u_isize * vec2(1.0,0.0) );
            vec4 right = texture2D(u_texture, v_coord + u_isize * vec2(-1.0,0.0) );
            vec4 diff = abs(center - up) + abs(center - down) + abs(center - left) + abs(center - right);
            diff *= u_factor;
            if(u_invert == 1)
                diff.xyz = vec3(1.0) - diff.xyz;
            if( u_threshold == 0.0 )
                gl_FragColor = vec4( diff.xyz, center.a );
            else
                gl_FragColor = vec4( diff.x > 0.5 ? 1.0 : 0.0, diff.y > 0.5 ? 1.0 : 0.0, diff.z > 0.5 ? 1.0 : 0.0, center.a );
        }
        `);let rr=ae;x.registerNodeType("texture/edges",rr);const Ve=class F{constructor(){this.addInput("Texture","Texture"),this.addInput("Distance","number"),this.addInput("Range","number"),this.addOutput("Texture","Texture"),this.properties={distance:100,range:50,only_depth:!1,high_precision:!1},this._uniforms={u_texture:0,u_distance:100,u_range:50,u_camera_planes:null}}onExecute(){if(this.isOutputConnected(0)){var e=this.getInputData(0);if(e){var t=i.UNSIGNED_BYTE;this.properties.high_precision&&(t=i.half_float_ext?i.HALF_FLOAT_OES:i.FLOAT),(!this._temp_texture||this._temp_texture.type!=t||this._temp_texture.width!=e.width||this._temp_texture.height!=e.height)&&(this._temp_texture=new h.Texture(e.width,e.height,{type:t,format:i.RGBA,filter:i.LINEAR}));var r=this._uniforms,s=this.properties.distance;this.isInputConnected(1)&&(s=this.getInputData(1),this.properties.distance=s);var o=this.properties.range;this.isInputConnected(2)&&(o=this.getInputData(2),this.properties.range=o),r.u_distance=s,r.u_range=o,i.disable(i.BLEND),i.disable(i.DEPTH_TEST);var u=Mesh.getScreenQuad();F._shader||(F._shader=new h.Shader(b.SCREEN_VERTEX_SHADER,F.pixel_shader),F._shader_onlydepth=new h.Shader(b.SCREEN_VERTEX_SHADER,F.pixel_shader,{ONLY_DEPTH:""}));var n=this.properties.only_depth?F._shader_onlydepth:F._shader,c=null;e.near_far_planes?c=e.near_far_planes:window.LS&&LS.Renderer._main_camera?c=LS.Renderer._main_camera._uniforms.u_camera_planes:c=[.1,1e3],r.u_camera_planes=c,this._temp_texture.drawTo(function(){e.bind(0),n.uniforms(r).draw(u)}),this._temp_texture.near_far_planes=c,this.setOutputData(0,this._temp_texture)}}}};a(Ve,"title","Depth Range"),a(Ve,"desc","Generates a texture with a depth range"),a(Ve,"pixel_shader",`precision highp float;
        precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform vec2 u_camera_planes;
        uniform float u_distance;
        uniform float u_range;
        
        float LinearDepth()
        {
            float zNear = u_camera_planes.x;
            float zFar = u_camera_planes.y;
            float depth = texture2D(u_texture, v_coord).x;
            depth = depth * 2.0 - 1.0;
            return zNear * (depth + 1.0) / (zFar + zNear - depth * (zFar - zNear));
        }
        
        void main() {
            float depth = LinearDepth();
            #ifdef ONLY_DEPTH
                gl_FragColor = vec4(depth);
            #else
                float diff = abs(depth * u_camera_planes.y - u_distance);
                float dof = 1.0;
                if(diff <= u_range)
                    dof = diff / u_range;
                gl_FragColor = vec4(dof);
            #endif
        }
    `);let ir=Ve;x.registerNodeType("texture/depth_range",ir);const ue=class Ie{constructor(){this.addInput("Texture","Texture"),this.addOutput("Texture","Texture"),this.properties={precision:l.DEFAULT,invert:!1},this._uniforms={u_texture:0,u_camera_planes:null,u_ires:vec2.create()}}onExecute(){if(this.isOutputConnected(0)){var e=this.getInputData(0);if(!(!e||e.format!=i.DEPTH_COMPONENT&&e.format!=i.DEPTH_STENCIL)){var t=this.properties.precision==l.HIGH?i.HIGH_PRECISION_FORMAT:i.UNSIGNED_BYTE;(!this._temp_texture||this._temp_texture.type!=t||this._temp_texture.width!=e.width||this._temp_texture.height!=e.height)&&(this._temp_texture=new h.Texture(e.width,e.height,{type:t,format:i.RGB,filter:i.LINEAR}));var r=this._uniforms;r.u_invert=this.properties.invert?1:0,i.disable(i.BLEND),i.disable(i.DEPTH_TEST);var s=Mesh.getScreenQuad();Ie._shader||(Ie._shader=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,Ie.pixel_shader));var o=Ie._shader,u=null;e.near_far_planes?u=e.near_far_planes:window.LS&&LS.Renderer._main_camera?u=LS.Renderer._main_camera._uniforms.u_camera_planes:u=[.1,1e3],r.u_camera_planes=u,r.u_ires.set([0,0]),this._temp_texture.drawTo(function(){e.bind(0),o.uniforms(r).draw(s)}),this._temp_texture.near_far_planes=u,this.setOutputData(0,this._temp_texture)}}}};a(ue,"widgets_info",{precision:{widget:"combo",values:l.MODE_VALUES}}),a(ue,"title","Linear Depth"),a(ue,"desc","Creates a color texture with linear depth"),a(ue,"pixel_shader",`precision highp float;
        precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform vec2 u_camera_planes;
        uniform int u_invert;
        uniform vec2 u_ires;
        
        void main() {
            float zNear = u_camera_planes.x;
            float zFar = u_camera_planes.y;
            float depth = texture2D(u_texture, v_coord + u_ires*0.5).x * 2.0 - 1.0;
            float f = zNear * (depth + 1.0) / (zFar + zNear - depth * (zFar - zNear));
            if( u_invert == 1 )
                f = 1.0 - f;
            gl_FragColor = vec4(vec3(f),1.0);
        }
        `);let sr=ue;x.registerNodeType("texture/linear_depth",sr);const ne=class At{constructor(){this.addInput("Texture","Texture"),this.addInput("Iterations","number"),this.addInput("Intensity","number"),this.addOutput("Blurred","Texture"),this.properties={intensity:1,iterations:1,preserve_aspect:!1,scale:[1,1],precision:l.DEFAULT}}onExecute(){var e=this.getInputData(0);if(e&&this.isOutputConnected(0)){var t=this._final_texture;(!t||t.width!=e.width||t.height!=e.height||t.type!=e.type)&&(t=this._final_texture=new h.Texture(e.width,e.height,{type:e.type,format:i.RGBA,filter:i.LINEAR}));var r=this.properties.iterations;if(this.isInputConnected(1)&&(r=this.getInputData(1),this.properties.iterations=r),r=Math.min(Math.floor(r),At.max_iterations),r==0){this.setOutputData(0,e);return}var s=this.properties.intensity;this.isInputConnected(2)&&(s=this.getInputData(2),this.properties.intensity=s);var o=x.camera_aspect;!o&&window.gl!==void 0&&(o=i.canvas.height/i.canvas.width),o||(o=1),o=this.properties.preserve_aspect?o:1;var u=this.properties.scale||[1,1];e.applyBlur(o*u[0],u[1],s,t);for(var n=1;n<r;++n)t.applyBlur(o*u[0]*(n+1),u[1]*(n+1),s);this.setOutputData(0,t)}}};a(ne,"title","Blur"),a(ne,"desc","Blur a texture"),a(ne,"widgets_info",{precision:{widget:"combo",values:l.MODE_VALUES}}),a(ne,"max_iterations",20);let or=ne;x.registerNodeType("texture/blur",or);const ke=class I{constructor(){this.intensity=.5,this.persistence=.6,this.iterations=8,this.threshold=.8,this.scale=1,this.dirt_texture=null,this.dirt_factor=.5,this._textures=[],this._uniforms={u_intensity:1,u_texture:0,u_glow_texture:1,u_threshold:0,u_texel_size:vec2.create()}}applyFX(e,t,r,s){var o=e.width,u=e.height,n={format:e.format,type:e.type,minFilter:h.LINEAR,magFilter:h.LINEAR,wrap:i.CLAMP_TO_EDGE},c=this._uniforms,d=this._textures,_=I._cut_shader;_||(_=I._cut_shader=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,I.cut_pixel_shader)),i.disable(i.DEPTH_TEST),i.disable(i.BLEND),c.u_threshold=this.threshold;var m=d[0]=h.Texture.getTemporary(o,u,n);e.blit(m,_.uniforms(c));var f=m,g=this.iterations;g=clamp(g,1,16)|0;var R=c.u_texel_size,K=this.intensity;c.u_intensity=1,c.u_delta=this.scale,_=I._shader,_||(_=I._shader=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,I.scale_pixel_shader));for(var C=1;C<g&&(o=o>>1,(u|0)>1&&(u=u>>1),!(o<2));C++)m=d[C]=h.Texture.getTemporary(o,u,n),R[0]=1/f.width,R[1]=1/f.height,f.blit(m,_.uniforms(c)),f=m;for(s&&(R[0]=1/f.width,R[1]=1/f.height,c.u_intensity=K,c.u_delta=1,f.blit(s,_.uniforms(c))),i.enable(i.BLEND),i.blendFunc(i.ONE,i.ONE),c.u_intensity=this.persistence,c.u_delta=.5,C-=2;C>=0;C--)m=d[C],d[C]=null,R[0]=1/f.width,R[1]=1/f.height,f.blit(m,_.uniforms(c)),h.Texture.releaseTemporary(f),f=m;if(i.disable(i.BLEND),r&&f.blit(r),t){var Ft=t,Ne=this.dirt_texture,Gt=this.dirt_factor;c.u_intensity=K,_=Ne?I._dirt_final_shader:I._final_shader,_||(Ne?_=I._dirt_final_shader=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,I.final_pixel_shader,{USE_DIRT:""}):_=I._final_shader=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,I.final_pixel_shader)),Ft.drawTo(function(){e.bind(0),f.bind(1),Ne&&(_.setUniform("u_dirt_factor",Gt),_.setUniform("u_dirt_texture",Ne.bind(2))),_.toViewport(c)})}h.Texture.releaseTemporary(f)}};a(ke,"cut_pixel_shader",`precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform float u_threshold;
        void main() {
            gl_FragColor = max( texture2D( u_texture, v_coord ) - vec4( u_threshold ), vec4(0.0) );
        }`),a(ke,"scale_pixel_shader",`precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform vec2 u_texel_size;
        uniform float u_delta;
        uniform float u_intensity;
        
        vec4 sampleBox(vec2 uv) {
            vec4 o = u_texel_size.xyxy * vec2(-u_delta, u_delta).xxyy;
            vec4 s = texture2D( u_texture, uv + o.xy ) + texture2D( u_texture, uv + o.zy) + texture2D( u_texture, uv + o.xw) + texture2D( u_texture, uv + o.zw);
            return s * 0.25;
        }
        void main() {
            gl_FragColor = u_intensity * sampleBox( v_coord );
        }`),a(ke,"final_pixel_shader",`precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform sampler2D u_glow_texture;
        #ifdef USE_DIRT
            uniform sampler2D u_dirt_texture;
        #endif
        uniform vec2 u_texel_size;
        uniform float u_delta;
        uniform float u_intensity;
        uniform float u_dirt_factor;
        
        vec4 sampleBox(vec2 uv) {
            vec4 o = u_texel_size.xyxy * vec2(-u_delta, u_delta).xxyy;
            vec4 s = texture2D( u_glow_texture, uv + o.xy ) + texture2D( u_glow_texture, uv + o.zy) + texture2D( u_glow_texture, uv + o.xw) + texture2D( u_glow_texture, uv + o.zw);
            return s * 0.25;
        }
        void main() {
            vec4 glow = sampleBox( v_coord );
            #ifdef USE_DIRT
                glow = mix( glow, glow * texture2D( u_dirt_texture, v_coord ), u_dirt_factor );
            #endif
            gl_FragColor = texture2D( u_texture, v_coord ) + u_intensity * glow;
        }`);let ar=ke;class Xe{constructor(){this.addInput("in","Texture"),this.addInput("dirt","Texture"),this.addOutput("out","Texture"),this.addOutput("glow","Texture"),this.properties={enabled:!0,intensity:1,persistence:.99,iterations:16,threshold:0,scale:1,dirt_factor:.5,precision:l.DEFAULT},this.fx=new ar}onGetInputs(){return[["enabled","boolean"],["threshold","number"],["intensity","number"],["persistence","number"],["iterations","number"],["dirt_factor","number"]]}onGetOutputs(){return[["average","Texture"]]}onExecute(){var e=this.getInputData(0);if(e&&this.isAnyOutputConnected()){if(this.properties.precision===l.PASS_THROUGH||this.getInputOrProperty("enabled")===!1){this.setOutputData(0,e);return}var t=this.fx;t.threshold=this.getInputOrProperty("threshold"),t.iterations=this.getInputOrProperty("iterations"),t.intensity=this.getInputOrProperty("intensity"),t.persistence=this.getInputOrProperty("persistence"),t.dirt_texture=this.getInputData(1),t.dirt_factor=this.getInputOrProperty("dirt_factor"),t.scale=this.properties.scale;var r=l.getTextureType(this.properties.precision,e),s=null;this.isOutputConnected(2)&&(s=this._average_texture,(!s||s.type!=e.type||s.format!=e.format)&&(s=this._average_texture=new h.Texture(1,1,{type:e.type,format:e.format,filter:i.LINEAR})));var o=null;this.isOutputConnected(1)&&(o=this._glow_texture,(!o||o.width!=e.width||o.height!=e.height||o.type!=r||o.format!=e.format)&&(o=this._glow_texture=new h.Texture(e.width,e.height,{type:r,format:e.format,filter:i.LINEAR})));var u=null;this.isOutputConnected(0)&&(u=this._final_texture,(!u||u.width!=e.width||u.height!=e.height||u.type!=r||u.format!=e.format)&&(u=this._final_texture=new h.Texture(e.width,e.height,{type:r,format:e.format,filter:i.LINEAR}))),t.applyFX(e,u,o,s),this.isOutputConnected(0)&&this.setOutputData(0,u),this.isOutputConnected(1)&&this.setOutputData(1,s),this.isOutputConnected(2)&&this.setOutputData(2,o)}}}a(Xe,"title","Glow"),a(Xe,"desc","Filters a texture giving it a glow effect"),a(Xe,"widgets_info",{iterations:{type:"number",min:0,max:16,step:1,precision:0},threshold:{type:"number",min:0,max:10,step:.01,precision:2},precision:{widget:"combo",values:l.MODE_VALUES}}),x.registerNodeType("texture/glow",Xe);const Y=class ${constructor(){this.addInput("Texture","Texture"),this.addOutput("Filtered","Texture"),this.properties={intensity:1,radius:5}}onExecute(){var e=this.getInputData(0);if(e&&this.isOutputConnected(0)){var t=this._temp_texture;(!t||t.width!=e.width||t.height!=e.height||t.type!=e.type)&&(this._temp_texture=new h.Texture(e.width,e.height,{type:e.type,format:i.RGBA,filter:i.LINEAR}));var r=this.properties.radius;if(r=Math.min(Math.floor(r),$.max_radius),r==0){this.setOutputData(0,e);return}var s=this.properties.intensity,o=x.camera_aspect;!o&&window.gl!==void 0&&(o=i.canvas.height/i.canvas.width),o||(o=1),o=this.properties.preserve_aspect?o:1,$._shaders[r]||($._shaders[r]=new h.Shader(b.SCREEN_VERTEX_SHADER,$.pixel_shader,{RADIUS:r.toFixed(0)}));var u=$._shaders[r],n=h.Mesh.getScreenQuad();e.bind(0),this._temp_texture.drawTo(function(){u.uniforms({u_texture:0,u_intensity:s,u_resolution:[e.width,e.height],u_iResolution:[1/e.width,1/e.height]}).draw(n)}),this.setOutputData(0,this._temp_texture)}}};a(Y,"title","Kuwahara Filter"),a(Y,"desc","Filters a texture giving an artistic oil canvas painting"),a(Y,"max_radius",10),a(Y,"_shaders",[]),a(Y,"pixel_shader",`
    precision highp float;
    varying vec2 v_coord;
    uniform sampler2D u_texture;
    uniform float u_intensity;
    uniform vec2 u_resolution;
    uniform vec2 u_iResolution;
    #ifndef RADIUS
    #define RADIUS 7
    #endif
    void main() {
    
    const int radius = RADIUS;
    vec2 fragCoord = v_coord;
    vec2 src_size = u_iResolution;
    vec2 uv = v_coord;
    float n = float((radius + 1) * (radius + 1));
    int i;
    int j;
    vec3 m0 = vec3(0.0); vec3 m1 = vec3(0.0); vec3 m2 = vec3(0.0); vec3 m3 = vec3(0.0);
    vec3 s0 = vec3(0.0); vec3 s1 = vec3(0.0); vec3 s2 = vec3(0.0); vec3 s3 = vec3(0.0);
    vec3 c;
    
    for (int j = -radius; j <= 0; ++j)  {
        for (int i = -radius; i <= 0; ++i)  {
            c = texture2D(u_texture, uv + vec2(i,j) * src_size).rgb;
            m0 += c;
            s0 += c * c;
        }
    }
    
    for (int j = -radius; j <= 0; ++j)  {
        for (int i = 0; i <= radius; ++i)  {
            c = texture2D(u_texture, uv + vec2(i,j) * src_size).rgb;
            m1 += c;
            s1 += c * c;
        }
    }
    
    for (int j = 0; j <= radius; ++j)  {
        for (int i = 0; i <= radius; ++i)  {
            c = texture2D(u_texture, uv + vec2(i,j) * src_size).rgb;
            m2 += c;
            s2 += c * c;
        }
    }
    
    for (int j = 0; j <= radius; ++j)  {
        for (int i = -radius; i <= 0; ++i)  {
            c = texture2D(u_texture, uv + vec2(i,j) * src_size).rgb;
            m3 += c;
            s3 += c * c;
        }
    }
    
    float min_sigma2 = 1e+2;
    m0 /= n;
    s0 = abs(s0 / n - m0 * m0);
    
    float sigma2 = s0.r + s0.g + s0.b;
    if (sigma2 < min_sigma2) {
        min_sigma2 = sigma2;
        gl_FragColor = vec4(m0, 1.0);
    }
    
    m1 /= n;
    s1 = abs(s1 / n - m1 * m1);
    
    sigma2 = s1.r + s1.g + s1.b;
    if (sigma2 < min_sigma2) {
        min_sigma2 = sigma2;
        gl_FragColor = vec4(m1, 1.0);
    }
    
    m2 /= n;
    s2 = abs(s2 / n - m2 * m2);
    
    sigma2 = s2.r + s2.g + s2.b;
    if (sigma2 < min_sigma2) {
        min_sigma2 = sigma2;
        gl_FragColor = vec4(m2, 1.0);
    }
    
    m3 /= n;
    s3 = abs(s3 / n - m3 * m3);
    
    sigma2 = s3.r + s3.g + s3.b;
    if (sigma2 < min_sigma2) {
        min_sigma2 = sigma2;
        gl_FragColor = vec4(m3, 1.0);
    }
    }
    `);let ur=Y;x.registerNodeType("texture/kuwahara",ur);const j=class Oe{constructor(){this.addInput("Texture","Texture"),this.addOutput("Filtered","Texture"),this.properties={sigma:1.4,k:1.6,p:21.7,epsilon:79,phi:.017}}onExecute(){var e=this.getInputData(0);if(e&&this.isOutputConnected(0)){var t=this._temp_texture;(!t||t.width!=e.width||t.height!=e.height||t.type!=e.type)&&(this._temp_texture=new h.Texture(e.width,e.height,{type:e.type,format:i.RGBA,filter:i.LINEAR})),Oe._xdog_shader||(Oe._xdog_shader=new h.Shader(b.SCREEN_VERTEX_SHADER,Oe.xdog_pixel_shader));var r=Oe._xdog_shader,s=h.Mesh.getScreenQuad(),o=this.properties.sigma,u=this.properties.k,n=this.properties.p,c=this.properties.epsilon,d=this.properties.phi;e.bind(0),this._temp_texture.drawTo(function(){r.uniforms({src:0,sigma:o,k:u,p:n,epsilon:c,phi:d,cvsWidth:e.width,cvsHeight:e.height}).draw(s)}),this.setOutputData(0,this._temp_texture)}}};a(j,"title","XDoG Filter"),a(j,"desc","Filters a texture giving an artistic ink style"),a(j,"max_radius",10),a(j,"_shaders",[]),a(j,"xdog_pixel_shader",`
    precision highp float;
    uniform sampler2D src;

    uniform float cvsHeight;
    uniform float cvsWidth;

    uniform float sigma;
    uniform float k;
    uniform float p;
    uniform float epsilon;
    uniform float phi;
    varying vec2 v_coord;

    float cosh(float val)
    {
    float tmp = exp(val);
    float cosH = (tmp + 1.0 / tmp) / 2.0;
    return cosH;
    }

    float tanh(float val)
    {
    float tmp = exp(val);
    float tanH = (tmp - 1.0 / tmp) / (tmp + 1.0 / tmp);
    return tanH;
    }

    float sinh(float val)
    {
    float tmp = exp(val);
    float sinH = (tmp - 1.0 / tmp) / 2.0;
    return sinH;
    }

    void main(void){
    vec3 destColor = vec3(0.0);
    float tFrag = 1.0 / cvsHeight;
    float sFrag = 1.0 / cvsWidth;
    vec2 Frag = vec2(sFrag,tFrag);
    vec2 uv = gl_FragCoord.st;
    float twoSigmaESquared = 2.0 * sigma * sigma;
    float twoSigmaRSquared = twoSigmaESquared * k * k;
    int halfWidth = int(ceil( 1.0 * sigma * k ));

    const int MAX_NUM_ITERATION = 99999;
    vec2 sum = vec2(0.0);
    vec2 norm = vec2(0.0);

    for(int cnt=0;cnt<MAX_NUM_ITERATION;cnt++){
        if(cnt > (2*halfWidth+1)*(2*halfWidth+1)){break;}
        int i = int(cnt / (2*halfWidth+1)) - halfWidth;
        int j = cnt - halfWidth - int(cnt / (2*halfWidth+1)) * (2*halfWidth+1);

        float d = length(vec2(i,j));
        vec2 kernel = vec2( exp( -d * d / twoSigmaESquared ), 
                            exp( -d * d / twoSigmaRSquared ));

        vec2 L = texture2D(src, (uv + vec2(i,j)) * Frag).xx;

        norm += kernel;
        sum += kernel * L;
    }

    sum /= norm;

    float H = 100.0 * ((1.0 + p) * sum.x - p * sum.y);
    float edge = ( H > epsilon )? 1.0 : 1.0 + tanh( phi * (H - epsilon));
    destColor = vec3(edge);
    gl_FragColor = vec4(destColor, 1.0);
    }`);let nr=j;x.registerNodeType("texture/xDoG",nr);const We=class $e{constructor(){this.addOutput("Webcam","Texture"),this.properties={texture_name:"",facingMode:"user"},this.boxcolor="black",this.version=0}openStream(){if(!navigator.getUserMedia)return;this._waiting_confirmation=!0;var e={audio:!1,video:{facingMode:this.properties.facingMode}};navigator.mediaDevices.getUserMedia(e).then(this.streamReady.bind(this)).catch(r);var t=this;function r(s){var o;$e.is_webcam_open=!1,(o=console.log)==null||o.call(console,"Webcam rejected",s),t._webcam_stream=!1,t.boxcolor="red",t.trigger("stream_error")}}closeStream(){if(this._webcam_stream){var e=this._webcam_stream.getTracks();if(e.length)for(var t=0;t<e.length;++t)e[t].stop();$e.is_webcam_open=!1,this._webcam_stream=null,this._video=null,this.boxcolor="black",this.trigger("stream_closed")}}streamReady(e){this._webcam_stream=e,this.boxcolor="green";var t=this._video;t||(t=document.createElement("video"),t.autoplay=!0,t.srcObject=e,this._video=t,t.onloadedmetadata=function(r){var s;$e.is_webcam_open=!0,(s=console.log)==null||s.call(console,r)}),this.trigger("stream_ready",t)}onPropertyChanged(e,t){e=="facingMode"&&(this.properties.facingMode=t,this.closeStream(),this.openStream())}onRemoved(){if(this._webcam_stream){var e=this._webcam_stream.getTracks();if(e.length)for(var t=0;t<e.length;++t)e[t].stop();this._webcam_stream=null,this._video=null}}onDrawBackground(e){this.flags.collapsed||this.size[1]<=20||this._video&&(e.save(),e.webgl?this._video_texture&&e.drawImage(this._video_texture,0,0,this.size[0],this.size[1]):e.drawImage(this._video,0,0,this.size[0],this.size[1]),e.restore())}onExecute(){if(this._webcam_stream==null&&!this._waiting_confirmation&&this.openStream(),!(!this._video||!this._video.videoWidth)){var e=this._video.videoWidth,t=this._video.videoHeight,r=this._video_texture;if((!r||r.width!=e||r.height!=t)&&(this._video_texture=new h.Texture(e,t,{format:i.RGB,filter:i.LINEAR})),this._video_texture.uploadImage(this._video),this._video_texture.version=++this.version,this.properties.texture_name){var s=l.getTexturesContainer();s[this.properties.texture_name]=this._video_texture}this.setOutputData(0,this._video_texture);for(var o=1;o<this.outputs.length;++o)if(this.outputs[o])switch(this.outputs[o].name){case"width":this.setOutputData(o,this._video.videoWidth);break;case"height":this.setOutputData(o,this._video.videoHeight);break}}}onGetOutputs(){return[["width","number"],["height","number"],["stream_ready",x.EVENT],["stream_closed",x.EVENT],["stream_error",x.EVENT]]}};a(We,"title","Webcam"),a(We,"desc","Webcam texture"),a(We,"is_webcam_open",!1);let hr=We;x.registerNodeType("texture/webcam",hr);const he=class Ze{constructor(){this.addInput("in","Texture"),this.addInput("f","number"),this.addOutput("out","Texture"),this.properties={enabled:!0,factor:1,precision:l.LOW},this._uniforms={u_texture:0,u_factor:1}}onGetInputs(){return[["enabled","boolean"]]}onExecute(){var e=this.getInputData(0);if(e&&this.isOutputConnected(0)){if(this.properties.precision===l.PASS_THROUGH||this.getInputOrProperty("enabled")===!1){this.setOutputData(0,e);return}var t=this._temp_texture;(!t||t.width!=e.width||t.height!=e.height||t.type!=e.type)&&(t=this._temp_texture=new h.Texture(e.width,e.height,{type:e.type,format:i.RGBA,filter:i.LINEAR}));var r=Ze._shader;r||(r=Ze._shader=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,Ze.pixel_shader));var s=this.getInputData(1);s==null&&(s=this.properties.factor);var o=this._uniforms;o.u_factor=s,i.disable(i.DEPTH_TEST),t.drawTo(function(){e.bind(0),r.uniforms(o).draw(h.Mesh.getScreenQuad())}),this.setOutputData(0,t)}}};a(he,"title","Lens FX"),a(he,"desc","distortion and chromatic aberration"),a(he,"widgets_info",{precision:{widget:"combo",values:l.MODE_VALUES}}),a(he,"pixel_shader",`precision highp float;
    varying vec2 v_coord;
    uniform sampler2D u_texture;
    uniform float u_factor;
    vec2 barrelDistortion(vec2 coord, float amt) {
        vec2 cc = coord - 0.5;
        float dist = dot(cc, cc);
        return coord + cc * dist * amt;
    }
    
    float sat( float t )
    {
        return clamp( t, 0.0, 1.0 );
    }
    
    float linterp( float t ) {
        return sat( 1.0 - abs( 2.0*t - 1.0 ) );
    }
    
    float remap( float t, float a, float b ) {
        return sat( (t - a) / (b - a) );
    }
    
    vec4 spectrum_offset( float t ) {
        vec4 ret;
        float lo = step(t,0.5);
        float hi = 1.0-lo;
        float w = linterp( remap( t, 1.0/6.0, 5.0/6.0 ) );
        ret = vec4(lo,1.0,hi, 1.) * vec4(1.0-w, w, 1.0-w, 1.);
    
        return pow( ret, vec4(1.0/2.2) );
    }
    
    const float max_distort = 2.2;
    const int num_iter = 12;
    const float reci_num_iter_f = 1.0 / float(num_iter);
    
    void main()
    {	
        vec2 uv=v_coord;
        vec4 sumcol = vec4(0.0);
        vec4 sumw = vec4(0.0);	
        for ( int i=0; i<num_iter;++i )
        {
            float t = float(i) * reci_num_iter_f;
            vec4 w = spectrum_offset( t );
            sumw += w;
            sumcol += w * texture2D( u_texture, barrelDistortion(uv, .6 * max_distort*t * u_factor ) );
        }
        gl_FragColor = sumcol / sumw;
    }`);let pr=he;x.registerNodeType("texture/lensfx",pr);class Ye{constructor(){this.addInput("in",""),this.properties={precision:l.LOW,width:0,height:0,channels:1},this.addOutput("out","Texture")}onExecute(){if(this.isOutputConnected(0)){var e=this.getInputData(0);if(e){var t=this.properties.channels,r=this.properties.width,s=this.properties.height;(!r||!s)&&(r=Math.floor(e.length/t),s=1);var o=i.RGBA;t==3?o=i.RGB:t==1&&(o=i.LUMINANCE);var u=this._temp_texture,n=l.getTextureType(this.properties.precision);(!u||u.width!=r||u.height!=s||u.type!=n)&&(u=this._temp_texture=new h.Texture(r,s,{type:n,format:o,filter:i.LINEAR})),u.uploadData(e),this.setOutputData(0,u)}}}}a(Ye,"title","Data->Tex"),a(Ye,"desc","Generates or applies a curve to a texture"),a(Ye,"widgets_info",{precision:{widget:"combo",values:l.MODE_VALUES}}),x.registerNodeType("texture/fromdata",Ye);const pe=class G{constructor(){a(this,"pixel_shader",`precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform sampler2D u_curve;
        uniform float u_range;
        
        void main() {
            vec4 color = texture2D( u_texture, v_coord ) * u_range;
            color.x = texture2D( u_curve, vec2( color.x, 0.5 ) ).x;
            color.y = texture2D( u_curve, vec2( color.y, 0.5 ) ).y;
            color.z = texture2D( u_curve, vec2( color.z, 0.5 ) ).z;
            //color.w = texture2D( u_curve, vec2( color.w, 0.5 ) ).w;
            gl_FragColor = color;
        }`),this.addInput("in","Texture"),this.addOutput("out","Texture"),this.properties={precision:l.LOW,split_channels:!1},this._values=new Uint8Array(256*4),this._values.fill(255),this._curve_texture=null,this._uniforms={u_texture:0,u_curve:1,u_range:1},this._must_update=!0,this._points={RGB:[[0,0],[1,1]],R:[[0,0],[1,1]],G:[[0,0],[1,1]],B:[[0,0],[1,1]]},this.curve_editor=null,this.addWidget("toggle","Split Channels",!1,"split_channels"),this.addWidget("combo","Channel","RGB",{values:["RGB","R","G","B"]}),this.curve_offset=68,this.size=[240,160]}onExecute(){if(this.isOutputConnected(0)){var e=this.getInputData(0),t=this._temp_texture;if(!e){(this._must_update||!this._curve_texture)&&this.updateCurve(),this.setOutputData(0,this._curve_texture);return}var r=l.getTextureType(this.properties.precision,e);(!t||t.type!=r||t.width!=e.width||t.height!=e.height||t.format!=e.format)&&(t=this._temp_texture=new h.Texture(e.width,e.height,{type:r,format:e.format,filter:i.LINEAR}));var s=G._shader;s||(s=G._shader=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,G.pixel_shader)),(this._must_update||!this._curve_texture)&&this.updateCurve();var o=this._uniforms,u=this._curve_texture;t.drawTo(function(){i.disable(i.DEPTH_TEST),e.bind(0),u.bind(1),s.uniforms(o).draw(h.Mesh.getScreenQuad())}),this.setOutputData(0,t)}}sampleCurve(e,t){if(t||(t=this._points.RGB),!!t){for(var r=0;r<t.length-1;++r){var s=t[r],o=t[r+1];if(!(o[0]<e)){var u=o[0]-s[0];if(Math.abs(u)<1e-5)return s[1];var n=(e-s[0])/u;return s[1]*(1-n)+o[1]*n}}return 0}}updateCurve(){for(var e=this._values,t=e.length/4,r=this.properties.split_channels,s=0;s<t;++s){if(r)e[s*4]=clamp(this.sampleCurve(s/t,this._points.R)*255,0,255),e[s*4+1]=clamp(this.sampleCurve(s/t,this._points.G)*255,0,255),e[s*4+2]=clamp(this.sampleCurve(s/t,this._points.B)*255,0,255);else{var o=this.sampleCurve(s/t);e[s*4]=e[s*4+1]=e[s*4+2]=clamp(o*255,0,255)}e[s*4+3]=255}this._curve_texture||(this._curve_texture=new h.Texture(256,1,{format:i.RGBA,magFilter:i.LINEAR,wrap:i.CLAMP_TO_EDGE})),this._curve_texture.uploadData(e,null,!0)}onSerialize(e){var t={};for(var r in this._points)t[r]=this._points[r].concat();e.curves=t}onConfigure(e){this._points=e.curves,this.curve_editor&&(curve_editor.points=this._points),this._must_update=!0}onMouseDown(e,t,r){if(this.curve_editor){var s=this.curve_editor.onMouseDown([t[0],t[1]-this.curve_offset],r);return s&&this.captureInput(!0),s}}onMouseMove(e,t,r){if(this.curve_editor)return this.curve_editor.onMouseMove([t[0],t[1]-this.curve_offset],r)}onMouseUp(e,t,r){if(this.curve_editor)return this.curve_editor.onMouseUp([t[0],t[1]-this.curve_offset],r);this.captureInput(!1)}onDrawBackground(e,t){if(!this.flags.collapsed){this.curve_editor||(this.curve_editor=new x.CurveEditor(this._points.R)),e.save(),e.translate(0,this.curve_offset);var r=this.widgets[1].value;this.properties.split_channels?(r=="RGB"&&(this.widgets[1].value=r="R",this.widgets[1].disabled=!1),this.curve_editor.points=this._points.R,this.curve_editor.draw(e,[this.size[0],this.size[1]-this.curve_offset],t,"#111",G.channel_line_colors.R,!0),e.globalCompositeOperation="lighten",this.curve_editor.points=this._points.G,this.curve_editor.draw(e,[this.size[0],this.size[1]-this.curve_offset],t,null,G.channel_line_colors.G,!0),this.curve_editor.points=this._points.B,this.curve_editor.draw(e,[this.size[0],this.size[1]-this.curve_offset],t,null,G.channel_line_colors.B,!0),e.globalCompositeOperation="source-over"):(this.widgets[1].value=r="RGB",this.widgets[1].disabled=!0),this.curve_editor.points=this._points[r],this.curve_editor.draw(e,[this.size[0],this.size[1]-this.curve_offset],t,this.properties.split_channels?null:"#111",G.channel_line_colors[r]),e.restore()}}};a(pe,"title","Curve"),a(pe,"desc","Generates or applies a curve to a texture"),a(pe,"widgets_info",{precision:{widget:"combo",values:l.MODE_VALUES}}),a(pe,"channel_line_colors",{RGB:"#666",R:"#F33",G:"#3F3",B:"#33F"});let cr=pe;x.registerNodeType("texture/curve",cr);const ce=class Ke{constructor(){this.addInput("in","Texture"),this.addInput("exp","number"),this.addOutput("out","Texture"),this.properties={exposition:1,precision:l.LOW},this._uniforms={u_texture:0,u_exposition:1}}onExecute(){var e=this.getInputData(0);if(e&&this.isOutputConnected(0)){var t=this._temp_texture;(!t||t.width!=e.width||t.height!=e.height||t.type!=e.type)&&(t=this._temp_texture=new h.Texture(e.width,e.height,{type:e.type,format:i.RGBA,filter:i.LINEAR}));var r=Ke._shader;r||(r=Ke._shader=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,Ke.pixel_shader));var s=this.properties.exposition,o=this.getInputData(1);o!=null&&(s=this.properties.exposition=o);var u=this._uniforms;u.u_exposition=s,t.drawTo(function(){i.disable(i.DEPTH_TEST),e.bind(0),r.uniforms(u).draw(h.Mesh.getScreenQuad())}),this.setOutputData(0,t)}}};a(ce,"title","Exposition"),a(ce,"desc","Controls texture exposition"),a(ce,"widgets_info",{exposition:{widget:"slider",min:0,max:3},precision:{widget:"combo",values:l.MODE_VALUES}}),a(ce,"pixel_shader",`
        precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform float u_exposition;
    
        void main() {
            vec4 color = texture2D(u_texture, v_coord);
            gl_FragColor = vec4(color.xyz * u_exposition, color.a);
        }
    `);let lr=ce;x.registerNodeType("texture/exposition",lr);const le=class V{constructor(){this.addInput("in","Texture"),this.addInput("avg","number,Texture"),this.addOutput("out","Texture"),this.properties={enabled:!0,scale:1,gamma:1,average_lum:1,lum_white:1,precision:l.LOW},this._uniforms={u_texture:0,u_lumwhite2:1,u_igamma:1,u_scale:1,u_average_lum:1}}onGetInputs(){return[["enabled","boolean"]]}onExecute(){var e=this.getInputData(0);if(e&&this.isOutputConnected(0)){if(this.properties.precision===l.PASS_THROUGH||this.getInputOrProperty("enabled")===!1){this.setOutputData(0,e);return}var t=this._temp_texture;(!t||t.width!=e.width||t.height!=e.height||t.type!=e.type)&&(t=this._temp_texture=new h.Texture(e.width,e.height,{type:e.type,format:i.RGBA,filter:i.LINEAR}));var r=this.getInputData(1);r==null&&(r=this.properties.average_lum);var s=this._uniforms,o=null;r.constructor===Number?(this.properties.average_lum=r,s.u_average_lum=this.properties.average_lum,o=V._shader,o||(o=V._shader=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,V.pixel_shader))):r.constructor===h.Texture&&(s.u_average_texture=r.bind(1),o=V._shader_texture,o||(o=V._shader_texture=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,V.pixel_shader,{AVG_TEXTURE:""}))),s.u_lumwhite2=this.properties.lum_white*this.properties.lum_white,s.u_scale=this.properties.scale,s.u_igamma=1/this.properties.gamma,i.disable(i.DEPTH_TEST),t.drawTo(function(){e.bind(0),o.uniforms(s).draw(h.Mesh.getScreenQuad())}),this.setOutputData(0,this._temp_texture)}}};a(le,"title","Tone Mapping"),a(le,"desc","Applies Tone Mapping to convert from high to low"),a(le,"widgets_info",{precision:{widget:"combo",values:l.MODE_VALUES}}),a(le,"pixel_shader",`precision highp float;
    varying vec2 v_coord;
    uniform sampler2D u_texture;
    uniform float u_scale;
    #ifdef AVG_TEXTURE
        uniform sampler2D u_average_texture;
    #else
        uniform float u_average_lum;
    #endif
    uniform float u_lumwhite2;
    uniform float u_igamma;
    vec3 RGB2xyY (vec3 rgb)
    {
            const mat3 RGB2XYZ = mat3(0.4124, 0.3576, 0.1805,
                                    0.2126, 0.7152, 0.0722,
                                    0.0193, 0.1192, 0.9505);
        vec3 XYZ = RGB2XYZ * rgb;
        
        float f = (XYZ.x + XYZ.y + XYZ.z);
        return vec3(XYZ.x / f,
                    XYZ.y / f,
                    XYZ.y);
    }
    
    void main() {
        vec4 color = texture2D( u_texture, v_coord );
        vec3 rgb = color.xyz;
        float average_lum = 0.0;
        #ifdef AVG_TEXTURE
            vec3 pixel = texture2D(u_average_texture,vec2(0.5)).xyz;
            average_lum = (pixel.x + pixel.y + pixel.z) / 3.0;
        #else
            average_lum = u_average_lum;
        #endif
        //Ld - this part of the code is the same for both versions
        float lum = dot(rgb, vec3(0.2126, 0.7152, 0.0722));
        float L = (u_scale / average_lum) * lum;
        float Ld = (L * (1.0 + L / u_lumwhite2)) / (1.0 + L);
        //first
        //vec3 xyY = RGB2xyY(rgb);
        //xyY.z *= Ld;
        //rgb = xyYtoRGB(xyY);
        //second
        rgb = (rgb / lum) * Ld;
        rgb = max(rgb,vec3(0.001));
        rgb = pow( rgb, vec3( u_igamma ) );
        gl_FragColor = vec4( rgb, color.a );
    }`);let dr=le;x.registerNodeType("texture/tonemapping",dr);const de=class Je{constructor(){this.addOutput("out","Texture"),this.properties={width:512,height:512,seed:0,persistence:.1,octaves:8,scale:1,offset:[0,0],amplitude:1,precision:l.DEFAULT},this._key=0,this._texture=null,this._uniforms={u_persistence:.1,u_seed:0,u_offset:vec2.create(),u_scale:1,u_viewport:vec2.create()}}onGetInputs(){return[["seed","number"],["persistence","number"],["octaves","number"],["scale","number"],["amplitude","number"],["offset","vec2"]]}onExecute(){if(this.isOutputConnected(0)){var e=this.properties.width|0,t=this.properties.height|0;e==0&&(e=i.viewport_data[2]),t==0&&(t=i.viewport_data[3]);var r=l.getTextureType(this.properties.precision),s=this._texture;(!s||s.width!=e||s.height!=t||s.type!=r)&&(s=this._texture=new h.Texture(e,t,{type:r,format:i.RGB,filter:i.LINEAR}));var o=this.getInputOrProperty("persistence"),u=this.getInputOrProperty("octaves"),n=this.getInputOrProperty("offset"),c=this.getInputOrProperty("scale"),d=this.getInputOrProperty("amplitude"),_=this.getInputOrProperty("seed"),m=""+e+t+r+o+u+c+_+n[0]+n[1]+d;if(m==this._key){this.setOutputData(0,s);return}this._key=m;var f=this._uniforms;f.u_persistence=o,f.u_octaves=u,f.u_offset.set(n),f.u_scale=c,f.u_amplitude=d,f.u_seed=_*128,f.u_viewport[0]=e,f.u_viewport[1]=t;var g=Je._shader;g||(g=Je._shader=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,Je.pixel_shader)),i.disable(i.BLEND),i.disable(i.DEPTH_TEST),s.drawTo(function(){g.uniforms(f).draw(h.Mesh.getScreenQuad())}),this.setOutputData(0,s)}}};a(de,"title","Perlin"),a(de,"desc","Generates a perlin noise texture"),a(de,"widgets_info",{precision:{widget:"combo",values:l.MODE_VALUES},width:{type:"number",precision:0,step:1},height:{type:"number",precision:0,step:1},octaves:{type:"number",precision:0,step:1,min:1,max:50}}),a(de,"pixel_shader",`precision highp float;
        varying vec2 v_coord;
        uniform vec2 u_offset;
        uniform float u_scale;
        uniform float u_persistence;
        uniform int u_octaves;
        uniform float u_amplitude;
        uniform vec2 u_viewport;
        uniform float u_seed;
        #define M_PI 3.14159265358979323846
        
        float rand(vec2 c){	return fract(sin(dot(c.xy ,vec2( 12.9898 + u_seed,78.233 + u_seed))) * 43758.5453); }
        
        float noise(vec2 p, float freq ){
            float unit = u_viewport.x/freq;
            vec2 ij = floor(p/unit);
            vec2 xy = mod(p,unit)/unit;
            //xy = 3.*xy*xy-2.*xy*xy*xy;
            xy = .5*(1.-cos(M_PI*xy));
            float a = rand((ij+vec2(0.,0.)));
            float b = rand((ij+vec2(1.,0.)));
            float c = rand((ij+vec2(0.,1.)));
            float d = rand((ij+vec2(1.,1.)));
            float x1 = mix(a, b, xy.x);
            float x2 = mix(c, d, xy.x);
            return mix(x1, x2, xy.y);
        }
        
        float pNoise(vec2 p, int res){
            float persistance = u_persistence;
            float n = 0.;
            float normK = 0.;
            float f = 4.;
            float amp = 1.0;
            int iCount = 0;
            for (int i = 0; i<50; i++){
                n+=amp*noise(p, f);
                f*=2.;
                normK+=amp;
                amp*=persistance;
                if (iCount >= res)
                    break;
                iCount++;
            }
            float nf = n/normK;
            return nf*nf*nf*nf;
        }
        void main() {
            vec2 uv = v_coord * u_scale * u_viewport + u_offset * u_scale;
            vec4 color = vec4( pNoise( uv, u_octaves ) * u_amplitude );
            gl_FragColor = color;
        }`);let _r=de;x.registerNodeType("texture/perlin",_r);const q=class zt{constructor(){this.addInput("v"),this.addOutput("out","Texture"),this.properties={code:zt.default_code,width:512,height:512,clear:!0,precision:l.DEFAULT,use_html_canvas:!1},this._func=null,this._temp_texture=null,this.compileCode()}onPropertyChanged(e,t){e=="code"&&this.compileCode(t)}compileCode(e){var t,r;if(this._func=null,!!x.allow_scripts)try{this._func=new Function("canvas","ctx","time","script","v",e),this.boxcolor="#00FF00"}catch(s){this.boxcolor="#FF0000",(t=console.error)==null||t.call(console,"Error parsing script"),(r=console.error)==null||r.call(console,s)}}onExecute(){var e=this._func;!e||!this.isOutputConnected(0)||this.executeDraw(e)}executeDraw(e){var t,r,s=this.properties.width||i.canvas.width,o=this.properties.height||i.canvas.height,u=this._temp_texture,n=l.getTextureType(this.properties.precision);(!u||u.width!=s||u.height!=o||u.type!=n)&&(u=this._temp_texture=new h.Texture(s,o,{format:i.RGBA,filter:i.LINEAR,type:n}));var c=this.getInputData(0),d=this.properties,_=this,m=this.graph.getTime(),f=i,g=i.canvas;if((this.properties.use_html_canvas||!enableWebGLCanvas)&&(this._canvas?(g=this._canvas,f=this._ctx):(g=this._canvas=h.createCanvas(s.height),f=this._ctx=g.getContext("2d")),g.width=s,g.height=o),f==i)u.drawTo(function(){var R,K;i.start2D(),d.clear&&(i.clearColor(0,0,0,0),i.clear(i.COLOR_BUFFER_BIT));try{e.draw?e.draw.call(_,g,f,m,e,c):e.call(_,g,f,m,e,c),_.boxcolor="#00FF00"}catch(C){_.boxcolor="#FF0000",(R=console.error)==null||R.call(console,"Error executing script"),(K=console.error)==null||K.call(console,C)}i.finish2D()});else{d.clear&&f.clearRect(0,0,g.width,g.height);try{e.draw?e.draw.call(this,g,f,m,e,c):e.call(this,g,f,m,e,c),this.boxcolor="#00FF00"}catch(R){this.boxcolor="#FF0000",(t=console.error)==null||t.call(console,"Error executing script"),(r=console.error)==null||r.call(console,R)}u.uploadImage(g)}this.setOutputData(0,u)}};a(q,"title","Canvas2D"),a(q,"desc","Executes Canvas2D code inside a texture or the viewport."),a(q,"help","Set width and height to 0 to match viewport size."),a(q,"default_code",`//vars: canvas,ctx,time
ctx.fillStyle='red';
ctx.fillRect(0,0,50,50);
`),a(q,"widgets_info",{precision:{widget:"combo",values:l.MODE_VALUES},code:{type:"code"},width:{type:"number",precision:0,step:1},height:{type:"number",precision:0,step:1}});let vr=q;x.registerNodeType("texture/canvas2D",vr);const _e=class et{constructor(){this.addInput("in","Texture"),this.addOutput("out","Texture"),this.properties={key_color:vec3.fromValues(0,1,0),threshold:.8,slope:.2,precision:l.DEFAULT}}onExecute(){if(this.isOutputConnected(0)){var e=this.getInputData(0);if(this.properties.precision===l.PASS_THROUGH){this.setOutputData(0,e);return}if(e){this._tex=l.getTargetTexture(e,this._tex,this.properties.precision),i.disable(i.BLEND),i.disable(i.DEPTH_TEST),this._uniforms||(this._uniforms={u_texture:0,u_key_color:this.properties.key_color,u_threshold:1,u_slope:1});var t=this._uniforms,r=Mesh.getScreenQuad(),s=et._shader;s||(s=et._shader=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,et.pixel_shader)),t.u_key_color=this.properties.key_color,t.u_threshold=this.properties.threshold,t.u_slope=this.properties.slope,this._tex.drawTo(function(){e.bind(0),s.uniforms(t).draw(r)}),this.setOutputData(0,this._tex)}}}};a(_e,"title","Matte"),a(_e,"desc","Extracts background"),a(_e,"widgets_info",{key_color:{widget:"color"},precision:{widget:"combo",values:l.MODE_VALUES}}),a(_e,"pixel_shader",`precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform vec3 u_key_color;
        uniform float u_threshold;
        uniform float u_slope;
        
        void main() {
            vec3 color = texture2D( u_texture, v_coord ).xyz;
            float diff = length( normalize(color) - normalize(u_key_color) );
            float edge = u_threshold * (1.0 - u_slope);
            float alpha = smoothstep( edge, u_threshold, diff);
            gl_FragColor = vec4( color, alpha );
        }`);let xr=_e;x.registerNodeType("texture/matte",xr);class st{constructor(){this.addInput("in","texture"),this.addInput("yaw","number"),this.addOutput("out","texture"),this.properties={yaw:0}}onExecute(){if(this.isOutputConnected(0)){var e=this.getInputData(0);if(!(!e||e.texture_type!=h.TEXTURE_CUBE_MAP)){this._last_tex&&(this._last_tex.height!=e.height||this._last_tex.type!=e.type)&&(this._last_tex=null);var t=this.getInputOrProperty("yaw");this._last_tex=h.Texture.cubemapToTexture2D(e,e.height,this._last_tex,!0,t),this.setOutputData(0,this._last_tex)}}}}a(st,"title","CubemapToTexture2D"),a(st,"desc","Transforms a CUBEMAP texture into a TEXTURE2D in Polar Representation"),x.registerNodeType("texture/cubemapToTexture2D",st);const ve=class Z{constructor(){this.addInput("Texture","Texture"),this.addInput("Aberration","number"),this.addInput("Distortion","number"),this.addInput("Blur","number"),this.addOutput("Texture","Texture"),this.properties={aberration:1,distortion:1,blur:1,precision:l.DEFAULT},Z._shader||(Z._shader=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,Z.pixel_shader),Z._texture=new h.Texture(3,1,{format:i.RGB,wrap:i.CLAMP_TO_EDGE,magFilter:i.LINEAR,minFilter:i.LINEAR,pixel_data:[255,0,0,0,255,0,0,0,255]}))}onExecute(){var e=this.getInputData(0);if(this.properties.precision===l.PASS_THROUGH){this.setOutputData(0,e);return}if(e){this._tex=l.getTargetTexture(e,this._tex,this.properties.precision);var t=this.properties.aberration;this.isInputConnected(1)&&(t=this.getInputData(1),this.properties.aberration=t);var r=this.properties.distortion;this.isInputConnected(2)&&(r=this.getInputData(2),this.properties.distortion=r);var s=this.properties.blur;this.isInputConnected(3)&&(s=this.getInputData(3),this.properties.blur=s),i.disable(i.BLEND),i.disable(i.DEPTH_TEST);var o=Mesh.getScreenQuad(),u=Z._shader;this._tex.drawTo(function(){e.bind(0),u.uniforms({u_texture:0,u_aberration:t,u_distortion:r,u_blur:s}).draw(o)}),this.setOutputData(0,this._tex)}}};a(ve,"title","Lens"),a(ve,"desc","Camera Lens distortion"),a(ve,"widgets_info",{precision:{widget:"combo",values:l.MODE_VALUES}}),a(ve,"pixel_shader",`
        precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform vec2 u_camera_planes;
        uniform float u_aberration;
        uniform float u_distortion;
        uniform float u_blur;
        
        void main() {
            vec2 coord = v_coord;
            float dist = distance(vec2(0.5), coord);
            vec2 dist_coord = coord - vec2(0.5);
            float percent = 1.0 + ((0.5 - dist) / 0.5) * u_distortion;
            dist_coord *= percent;
            coord = dist_coord + vec2(0.5);
            vec4 color = texture2D(u_texture, coord, u_blur * dist);
            color.r = texture2D(u_texture, vec2(0.5) + dist_coord * (1.0 + 0.01 * u_aberration), u_blur * dist).r;
            color.b = texture2D(u_texture, vec2(0.5) + dist_coord * (1.0 - 0.01 * u_aberration), u_blur * dist).b;
            gl_FragColor = color;
        }
    `);let fr=ve;x.registerNodeType("fx/lens",fr);const U=class B{constructor(){this.addInput("Texture","Texture"),this.addInput("Blurred","Texture"),this.addInput("Mask","Texture"),this.addInput("Threshold","number"),this.addOutput("Texture","Texture"),this.properties={shape:"",size:10,alpha:1,threshold:1,high_precision:!1}}onExecute(){var e=this.getInputData(0),t=this.getInputData(1),r=this.getInputData(2);if(!e||!r||!this.properties.shape){this.setOutputData(0,e);return}t||(t=e);var s=l.getTexture(this.properties.shape);if(s){var o=this.properties.threshold;this.isInputConnected(3)&&(o=this.getInputData(3),this.properties.threshold=o);var u=i.UNSIGNED_BYTE;this.properties.high_precision&&(u=i.half_float_ext?i.HALF_FLOAT_OES:i.FLOAT),(!this._temp_texture||this._temp_texture.type!=u||this._temp_texture.width!=e.width||this._temp_texture.height!=e.height)&&(this._temp_texture=new h.Texture(e.width,e.height,{type:u,format:i.RGBA,filter:i.LINEAR}));var n=B._first_shader;n||(n=B._first_shader=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,B._first_pixel_shader));var c=B._second_shader;c||(c=B._second_shader=new h.Shader(B._second_vertex_shader,B._second_pixel_shader));var d=this._points_mesh;(!d||d._width!=e.width||d._height!=e.height||d._spacing!=2)&&(d=this.createPointsMesh(e.width,e.height,2));var _=Mesh.getScreenQuad(),m=this.properties.size,f=this.properties.alpha;i.disable(i.DEPTH_TEST),i.disable(i.BLEND),this._temp_texture.drawTo(function(){e.bind(0),t.bind(1),r.bind(2),n.uniforms({u_texture:0,u_texture_blur:1,u_mask:2,u_texsize:[e.width,e.height]}).draw(_)}),this._temp_texture.drawTo(function(){i.enable(i.BLEND),i.blendFunc(i.ONE,i.ONE),e.bind(0),s.bind(3),c.uniforms({u_texture:0,u_mask:2,u_shape:3,u_alpha:f,u_threshold:o,u_pointSize:m,u_itexsize:[1/e.width,1/e.height]}).draw(d,i.POINTS)}),this.setOutputData(0,this._temp_texture)}}createPointsMesh(e,t,r){for(var s=Math.round(e/r),o=Math.round(t/r),u=new Float32Array(s*o*2),n=-1,c=2/e*r,d=2/t*r,_=0;_<o;++_){for(var m=-1,f=0;f<s;++f){var g=_*s*2+f*2;u[g]=m,u[g+1]=n,m+=c}n+=d}return this._points_mesh=h.Mesh.load({vertices2D:u}),this._points_mesh._width=e,this._points_mesh._height=t,this._points_mesh._spacing=r,this._points_mesh}};a(U,"title","Bokeh"),a(U,"desc","applies an Bokeh effect"),a(U,"widgets_info",{shape:{widget:"texture"}}),a(U,"_first_pixel_shader",`
        precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform sampler2D u_texture_blur;
        uniform sampler2D u_mask;

        void main() {
            vec4 color = texture2D(u_texture, v_coord);
            vec4 blurred_color = texture2D(u_texture_blur, v_coord);
            float mask = texture2D(u_mask, v_coord).x;
            gl_FragColor = mix(color, blurred_color, mask);
        }
    `),a(U,"_second_vertex_shader",`
        precision highp float;
        attribute vec2 a_vertex2D;
        varying vec4 v_color;
        uniform sampler2D u_texture;
        uniform sampler2D u_mask;
        uniform vec2 u_itexsize;
        uniform float u_pointSize;
        uniform float u_threshold;
        
        void main() {
            vec2 coord = a_vertex2D * 0.5 + 0.5;
            v_color = texture2D(u_texture, coord);
            v_color += texture2D(u_texture, coord + vec2(u_itexsize.x, 0.0));
            v_color += texture2D(u_texture, coord + vec2(0.0, u_itexsize.y));
            v_color += texture2D(u_texture, coord + u_itexsize);
            v_color *= 0.25;
            float mask = texture2D(u_mask, coord).x;
            float luminance = length(v_color) * mask;
            // luminance /= (u_pointSize * u_pointSize) * 0.01;
            luminance -= u_threshold;
            if (luminance < 0.0) {
                gl_Position.x = -100.0;
                return;
            }
            gl_PointSize = u_pointSize;
            gl_Position = vec4(a_vertex2D, 0.0, 1.0);
        }
    `),a(U,"_second_pixel_shader",`
        precision highp float;
        varying vec4 v_color;
        uniform sampler2D u_shape;
        uniform float u_alpha;
        
        void main() {
            vec4 color = texture2D(u_shape, gl_PointCoord);
            color *= v_color * u_alpha;
            gl_FragColor = color;
        }
    `);let mr=U;x.registerNodeType("fx/bokeh",mr);const A=class tt{constructor(){this.addInput("Texture","Texture"),this.addInput("value1","number"),this.addInput("value2","number"),this.addOutput("Texture","Texture"),this.properties={fx:"halftone",value1:1,value2:1,precision:l.DEFAULT}}onExecute(){if(this.isOutputConnected(0)){var e=this.getInputData(0);if(this.properties.precision===l.PASS_THROUGH){this.setOutputData(0,e);return}if(e){this._tex=l.getTargetTexture(e,this._tex,this.properties.precision);var t=this.properties.value1;this.isInputConnected(1)&&(t=this.getInputData(1),this.properties.value1=t);var r=this.properties.value2;this.isInputConnected(2)&&(r=this.getInputData(2),this.properties.value2=r);var s=this.properties.fx,o=tt.shaders[s];if(!o){var u=tt["pixel_shader_"+s];if(!u)return;o=tt.shaders[s]=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,u)}i.disable(i.BLEND),i.disable(i.DEPTH_TEST);var n=Mesh.getScreenQuad(),c=LS?LS.Renderer._current_camera:null,d;c?d=[LS.Renderer._current_camera.near,LS.Renderer._current_camera.far]:d=[1,100];var _=null;s=="noise"&&(_=l.getNoiseTexture()),this._tex.drawTo(function(){e.bind(0),s=="noise"&&_.bind(1),o.uniforms({u_texture:0,u_noise:1,u_size:[e.width,e.height],u_rand:[Math.random(),Math.random()],u_value1:t,u_value2:r,u_camera_planes:d}).draw(n)}),this.setOutputData(0,this._tex)}}}};a(A,"title","FX"),a(A,"desc","applies an FX from a list"),a(A,"widgets_info",{fx:{widget:"combo",values:["halftone","pixelate","lowpalette","noise","gamma"]},precision:{widget:"combo",values:l.MODE_VALUES}}),a(A,"shaders",{}),a(A,"pixel_shader_halftone",`
        precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform vec2 u_camera_planes;
        uniform vec2 u_size;
        uniform float u_value1;
        uniform float u_value2;
        
        float pattern() {
            float s = sin(u_value1 * 3.1415), c = cos(u_value1 * 3.1415);
            vec2 tex = v_coord * u_size.xy;
            vec2 point = vec2(
                c * tex.x - s * tex.y ,
                s * tex.x + c * tex.y
            ) * u_value2;
            return (sin(point.x) * sin(point.y)) * 4.0;
        }
        
        void main() {
            vec4 color = texture2D(u_texture, v_coord);
            float average = (color.r + color.g + color.b) / 3.0;
            gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);
        }
    `),a(A,"pixel_shader_pixelate",`
        precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform vec2 u_camera_planes;
        uniform vec2 u_size;
        uniform float u_value1;
        uniform float u_value2;
        
        void main() {
            vec2 coord = vec2(floor(v_coord.x * u_value1) / u_value1, floor(v_coord.y * u_value2) / u_value2);
            vec4 color = texture2D(u_texture, coord);
            gl_FragColor = color;
        }
    `),a(A,"pixel_shader_lowpalette",`
        precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform vec2 u_camera_planes;
        uniform vec2 u_size;
        uniform float u_value1;
        uniform float u_value2;
        
        void main() {
            vec4 color = texture2D(u_texture, v_coord);
            gl_FragColor = floor(color * u_value1) / u_value1;
        }
    `),a(A,"pixel_shader_noise",`
        precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform sampler2D u_noise;
        uniform vec2 u_size;
        uniform float u_value1;
        uniform float u_value2;
        uniform vec2 u_rand;
        
        void main() {
            vec4 color = texture2D(u_texture, v_coord);
            vec3 noise = texture2D(u_noise, v_coord * vec2(u_size.x / 512.0, u_size.y / 512.0) + u_rand).xyz - vec3(0.5);
            gl_FragColor = vec4(color.xyz + noise * u_value1, color.a);
        }
    `),a(A,"pixel_shader_gamma",`
        precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform float u_value1;
        
        void main() {
            vec4 color = texture2D(u_texture, v_coord);
            float gamma = 1.0 / u_value1;
            gl_FragColor = vec4(pow(color.xyz, vec3(gamma)), color.a);
        }
    `);let gr=A;x.registerNodeType("fx/generic",gr);const xe=class Re{constructor(){this.addInput("Tex.","Texture"),this.addInput("intensity","number"),this.addOutput("Texture","Texture"),this.properties={intensity:1,invert:!1,precision:l.DEFAULT},Re._shader||(Re._shader=new h.Shader(h.Shader.SCREEN_VERTEX_SHADER,Re.pixel_shader))}onExecute(){var e=this.getInputData(0);if(this.properties.precision===l.PASS_THROUGH){this.setOutputData(0,e);return}if(e){this._tex=l.getTargetTexture(e,this._tex,this.properties.precision);var t=this.properties.intensity;this.isInputConnected(1)&&(t=this.getInputData(1),this.properties.intensity=t),i.disable(i.BLEND),i.disable(i.DEPTH_TEST);var r=Mesh.getScreenQuad(),s=Re._shader,o=this.properties.invert;this._tex.drawTo(function(){e.bind(0),s.uniforms({u_texture:0,u_intensity:t,u_isize:[1/e.width,1/e.height],u_invert:o?1:0}).draw(r)}),this.setOutputData(0,this._tex)}}};a(xe,"title","Vigneting"),a(xe,"desc","Vigneting"),a(xe,"widgets_info",{precision:{widget:"combo",values:l.MODE_VALUES}}),a(xe,"pixel_shader",`
        precision highp float;
        varying vec2 v_coord;
        uniform sampler2D u_texture;
        uniform float u_intensity;
        uniform int u_invert;
        
        void main() {
            float luminance = 1.0 - length(v_coord - vec2(0.5)) * 1.414;
            vec4 color = texture2D(u_texture, v_coord);
            
            if (u_invert == 1) {
                luminance = 1.0 - luminance;
            }
            
            luminance = mix(1.0, luminance, u_intensity);
            gl_FragColor = vec4(luminance * color.xyz, color.a);
        }
    `);let Tr=xe;x.registerNodeType("fx/vigneting",Tr);var xt="#345",E=x.Shaders={};E.GLSL_types=["float","vec2","vec3","vec4","mat3","mat4","sampler2D","samplerCube"];var je=E.GLSL_types_const=["float","vec2","vec3","vec4"],ft={radians:"T radians(T degrees)",degrees:"T degrees(T radians)",sin:"T sin(T angle)",cos:"T cos(T angle)",tan:"T tan(T angle)",asin:"T asin(T x)",acos:"T acos(T x)",atan:"T atan(T x)",atan2:"T atan(T x,T y)",pow:"T pow(T x,T y)",exp:"T exp(T x)",log:"T log(T x)",exp2:"T exp2(T x)",log2:"T log2(T x)",sqrt:"T sqrt(T x)",inversesqrt:"T inversesqrt(T x)",abs:"T abs(T x)",sign:"T sign(T x)",floor:"T floor(T x)",round:"T round(T x)",ceil:"T ceil(T x)",fract:"T fract(T x)",mod:"T mod(T x,T y)",min:"T min(T x,T y)",max:"T max(T x,T y)",clamp:"T clamp(T x,T minVal = 0.0,T maxVal = 1.0)",mix:"T mix(T x,T y,T a)",step:"T step(T edge, T edge2, T x)",smoothstep:"T smoothstep(T edge, T edge2, T x)",length:"float length(T x)",distance:"float distance(T p0, T p1)",normalize:"T normalize(T x)",dot:"float dot(T x,T y)",cross:"vec3 cross(vec3 x,vec3 y)",reflect:"vec3 reflect(vec3 V,vec3 N)",refract:"vec3 refract(vec3 V,vec3 N, float IOR)"},ot={},at=[];mt(),E.ALL_TYPES="float,vec2,vec3,vec4";function mt(){at.length=0;for(var v in ft){var e=ft[v],t=e.indexOf(" "),r=e.substr(0,t),s=e.indexOf("(",t),o=e.substr(t,s-t).trim(),u=e.substr(s+1,e.length-s-2).split(",");for(var n in u){var c=u[n].split(" ").filter(function(d){return d});u[n]={type:c[0].trim(),name:c[1].trim()},c[2]=="="&&(u[n].value=c[3].trim())}ot[v]={return_type:r,func:o,params:u},at.push(o)}}function w(v,e){e.color=xt,e.filter="shader",e.prototype.clearDestination=function(){this.shader_destination={}},e.prototype.propagateDestination=function(t){if(this.shader_destination[t]=!0,this.inputs)for(var r=0;r<this.inputs.length;++r){var s=this.getInputNode(r);s&&s.propagateDestination(t)}},e.prototype.onPropertyChanged||(e.prototype.onPropertyChanged=function(){this.graph&&this.graph._version++}),x.registerNodeType("shader::"+v,e)}function fe(v,e){return"VAR_"+(e||"TEMP")+"_"+v.id}function S(v,e){if(!v.inputs)return null;var t=v.getInputLink(e);if(!t)return null;var r=v.graph.getNodeById(t.origin_id);return r?r.getOutputVarName?r.getOutputVarName(t.origin_slot):"link_"+r.id+"_"+t.origin_slot:null}function D(v,e){return v.isOutputConnected(e)?"link_"+v.id+"_"+e:null}E.registerShaderNode=w,E.getInputLinkID=S,E.getOutputLinkID=D,E.getShaderNodeVarName=fe,E.parseGLSLDescriptions=mt;function N(v,e,t){var r=5;if(t!=null&&(r=t),!e)if(v.constructor===Number)e="float";else if(v.length)switch(v.length){case 2:e="vec2";break;case 3:e="vec3";break;case 4:e="vec4";break;case 9:e="mat3";break;case 16:e="mat4";break;default:throw new Error("unknown type for glsl value size")}else throw new Error("unknown type for glsl value: "+v.constructor);switch(e){case"float":return v.toFixed(r);case"vec2":return`vec2(${v[0].toFixed(r)},${v[1].toFixed(r)})`;case"color3":case"vec3":return`vec3(${v[0].toFixed(r)},${v[1].toFixed(r)},${v[2].toFixed(r)})`;case"color4":case"vec4":return`vec4(${v[0].toFixed(r)},${v[1].toFixed(r)},${v[2].toFixed(r)},${v[3].toFixed(r)})`;case"mat3":return"mat3(1.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,1.0)";case"mat4":return"mat4(1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0)";default:throw e}}var gt=x.varToTypeGLSL=function(v,e,t){if(e==t)return v;if(v==null)switch(t){case"float":return"0.0";case"vec2":return"vec2(0.0)";case"vec3":return"vec3(0.0)";case"vec4":return"vec4(0.0,0.0,0.0,1.0)";default:return null}if(!t)throw new Error("error: no output type specified");if(t=="float")switch(e){case"vec2":case"vec3":case"vec4":return v+".x";default:return"0.0"}else if(t=="vec2")switch(e){case"float":return"vec2("+v+")";case"vec3":case"vec4":return v+".xy";default:return"vec2(0.0)"}else if(t=="vec3")switch(e){case"float":return"vec3("+v+")";case"vec2":return"vec3("+v+",0.0)";case"vec4":return v+".xyz";default:return"vec3(0.0)"}else if(t=="vec4")switch(e){case"float":return"vec4("+v+")";case"vec2":return"vec4("+v+",0.0,1.0)";case"vec3":return"vec4("+v+",1.0)";default:return"vec4(0.0,0.0,0.0,1.0)"}throw new Error("type cannot be converted")},Tt=x.convertVarToGLSLType=function(v,e,t){if(e==t)return v;if(e=="float")return t+"("+v+")";if(t=="vec2")return"vec2("+v+".xy)";if(t=="vec3"){if(e=="vec2")return"vec3("+v+",0.0)";if(e=="vec4")return"vec4("+v+".xyz)"}if(t=="vec4"){if(e=="vec2")return"vec4("+v+",0.0,0.0)";if(t=="vec3")return"vec4("+v+",1.0)"}return null};class Er{constructor(){this.vs_template="",this.fs_template="",this.buffer_names={uvs:"v_coord"},this.extra={},this._functions={},this._uniforms={},this._codeparts={},this._uniform_value=null}clear(){this._uniforms={},this._functions={},this._codeparts={},this._uniform_value=null,this.extra={}}addUniform(e,t,r){this._uniforms[e]=t,r!=null&&(this._uniform_value||(this._uniform_value={}),this._uniform_value[e]=r)}addFunction(e,t){this._functions[e]=t}addCode(e,t,r){r=r||{"":""};for(var s in r){var o=s?s+"_"+e:e;this._codeparts[o]?this._codeparts[o]+=t+`
`:this._codeparts[o]=t+`
`}}computeCodeBlocks(e,t){this.clear();var r=e.findNodesByType("shader::output/vertex");r=r&&r.length?r[0]:null;var s=e.findNodesByType("shader::output/fragcolor");if(s=s&&s.length?s[0]:null,!s)return null;e.sendEventToAllNodes("clearDestination"),r&&r.propagateDestination("vs"),s&&s.propagateDestination("fs"),e.sendEventToAllNodes("onGetCode",this);var o="";for(let c in this._uniforms)o+="uniform "+this._uniforms[c]+" "+c+`;
`;if(t)for(let c in t)o+="uniform "+t[c]+" "+c+`;
`;var u="";for(let c in this._functions)u+="//"+c+`
`+this._functions[c]+`
`;var n=this._codeparts;return n.uniforms=o,n.functions=u,n}computeShaderCode(e){var t=this.computeCodeBlocks(e),r=h.Shader.replaceCodeUsingContext(this.vs_template,t),s=h.Shader.replaceCodeUsingContext(this.fs_template,t);return{vs_code:r,fs_code:s}}computeShader(e,t){var r,s,o,u,n=this.computeShaderCode(e);if((r=console.log)==null||r.call(console,n.vs_code,n.fs_code),!x.catch_exceptions)return this._shader_error=!0,t?t.updateShader(n.vs_code,n.fs_code):t=new h.Shader(n.vs_code,n.fs_code),this._shader_error=!1,t;try{return t?t.updateShader(n.vs_code,n.fs_code):t=new h.Shader(n.vs_code,n.fs_code),this._shader_error=!1,t}catch(c){return this._shader_error||((s=console.error)==null||s.call(console,c),c.indexOf("Fragment shader")!=-1?(o=console.log)==null||o.call(console,n.fs_code.split(`
`).map(function(d,_){return _+".- "+d}).join(`
`)):(u=console.log)==null||u.call(console,n.vs_code)),this._shader_error=!0,null}}getShader(e){if(this._shader&&this._shader._version==e._version)return this._shader;var t=this.computeShader(e,this._shader);return t?(this._shader=t,t._version=e._version,t):null}fillUniforms(e,t){if(this._uniform_value)for(var r in this._uniform_value){var s=this._uniform_value[r];s!=null&&(s.constructor===Function?e[r]=s.call(this,t):s.constructor===h.Texture||(e[r]=s))}}}const L=class Nt{constructor(){this.subgraph=new x.LGraph,this.subgraph._subgraph_node=this,this.subgraph._is_subgraph=!0,this.subgraph.filter="shader",this.addInput("in","texture"),this.addOutput("out","texture"),this.properties={width:0,height:0,alpha:!1,precision:typeof l!="undefined"?l.DEFAULT:2};var e=this.subgraph.findNodesByType("shader::input/uniform")[0];e.pos=[200,300];var t=x.createNode("shader::texture/sampler2D");t.pos=[400,300],this.subgraph.add(t);var r=x.createNode("shader::output/fragcolor");r.pos=[600,300],this.subgraph.add(r),e.connect(0,t),t.connect(0,r),this.size=[180,60],this.redraw_on_mouse=!0,this._uniforms={},this._shader=null,this._context=new Er,this._context.vs_template=`#define VERTEX
`+h.Shader.SCREEN_VERTEX_SHADER,this._context.fs_template=Nt.template}onSerialize(e){e.subgraph=this.subgraph.serialize()}onConfigure(e){this.subgraph.configure(e.subgraph)}onExecute(){if(this.isOutputConnected(0)){var e=this.getInputData(0);e&&e.constructor!=h.Texture&&(e=null);var t=this.properties.width|0,r=this.properties.height|0;t==0&&(t=e?e.width:i.viewport_data[2]),r==0&&(r=e?e.height:i.viewport_data[3]);var s=l.getTextureType(this.properties.precision,e),o=this._texture;(!o||o.width!=t||o.height!=r||o.type!=s)&&(o=this._texture=new h.Texture(t,r,{type:s,format:this.alpha?i.RGBA:i.RGB,filter:i.LINEAR}));var u=this.getShader(this.subgraph);if(u){var n=this._uniforms;this._context.fillUniforms(n);var c=0;if(this.inputs)for(var d=0;d<this.inputs.length;++d){var _=this.inputs[d],m=this.getInputData(d);_.type=="texture"&&(m||(m=h.Texture.getWhiteTexture()),m=m.bind(c++)),m!=null&&(n["u_"+_.name]=m)}var f=h.Mesh.getScreenQuad();i.disable(i.DEPTH_TEST),i.disable(i.BLEND),o.drawTo(function(){u.uniforms(n),u.draw(f)}),this.setOutputData(0,o)}}}onInputAdded(e){var t=x.createNode("shader::input/uniform");t.setProperty("name",e.name),t.setProperty("type",e.type),this.subgraph.add(t)}onInputRemoved(e,t){for(var r=this.subgraph.findNodesByType("shader::input/uniform"),s=0;s<r.length;++s){var o=r[s];o.properties.name==t.name&&this.subgraph.remove(o)}}computeSize(){var e=this.inputs?this.inputs.length:0,t=this.outputs?this.outputs.length:0;return[200,Math.max(e,t)*x.NODE_SLOT_HEIGHT+x.NODE_TITLE_HEIGHT+10]}getShader(){var e=this._context.getShader(this.subgraph);return e?this.boxcolor=null:this.boxcolor="red",e}onDrawBackground(e,t,r,s){if(!this.flags.collapsed){var o=this.getOutputData(0),u=this.inputs?this.inputs.length*x.NODE_SLOT_HEIGHT:0;o&&e==o.gl&&this.size[1]>u+x.NODE_TITLE_HEIGHT&&e.drawImage(o,10,n,this.size[0]-20,this.size[1]-u-x.NODE_TITLE_HEIGHT);var n=this.size[1]-x.NODE_TITLE_HEIGHT+.5,c=x.isInsideRectangle(s[0],s[1],this.pos[0],this.pos[1]+n,this.size[0],x.NODE_TITLE_HEIGHT);e.fillStyle=c?"#555":"#222",e.beginPath(),this._shape==x.BOX_SHAPE?e.rect(0,n,this.size[0]+1,x.NODE_TITLE_HEIGHT):e.roundRect(0,n,this.size[0]+1,x.NODE_TITLE_HEIGHT,0,8),e.fill(),e.textAlign="center",e.font="24px Arial",e.fillStyle=c?"#DDD":"#999",e.fillText("+",this.size[0]*.5,n+24)}}onMouseDown(e,t,r){var s=this.size[1]-x.NODE_TITLE_HEIGHT+.5;t[1]>s&&r.showSubgraphPropertiesDialog(this)}getExtraMenuOptions(){var e=this,t=[{content:"Print Code",callback:function(){var r,s=e._context.computeShaderCode();(r=console.log)==null||r.call(console,s.vs_code,s.fs_code)}}];return t}};a(L,"template",`
        #define FRAGMENT
        precision highp float;
        varying vec2 v_coord;
        {{varying}}
        {{uniforms}}
        {{functions}}
        {{fs_functions}}
        void main() {
    
            vec2 uv = v_coord;
            vec4 fragcolor = vec4(0.0);
            vec4 fragcolor1 = vec4(0.0);
            {{fs_code}}
            gl_FragColor = fragcolor;
        }
    `),a(L,"widgets_info",{precision:{widget:"combo",values:l.MODE_VALUES}}),a(L,"title","ShaderGraph"),a(L,"desc","Builds a shader using a graph"),a(L,"input_node_type","input/uniform"),a(L,"output_node_type","output/fragcolor"),a(L,"title_color",xt);let yr=L;x.registerNodeType("texture/shaderGraph",yr);class ut{constructor(){this.addOutput("out",""),this.properties={name:"",type:""}}getTitle(){return this.properties.name&&this.flags.collapsed?this.properties.type+" "+this.properties.name:"Uniform"}onPropertyChanged(){this.outputs[0].name=this.properties.type+" "+this.properties.name}onGetCode(e){if(this.shader_destination){var t=this.properties.type;if(!t){if(!e.onGetPropertyInfo)return;var r=e.onGetPropertyInfo(this.property.name);if(!r)return;t=r.type}t=="number"?t="float":t=="texture"&&(t="sampler2D"),E.GLSL_types.indexOf(t)!=-1&&(e.addUniform("u_"+this.properties.name,t),this.setOutputData(0,t))}}getOutputVarName(){return"u_"+this.properties.name}}a(ut,"title","Uniform"),a(ut,"desc","Input data for the shader"),w("input/uniform",ut);class nt{constructor(){this.addOutput("out","vec2"),this.properties={name:"coord",type:"vec2"}}getTitle(){return"att. "+this.properties.name}onGetCode(e){if(this.shader_destination){var t=this.properties.type;!t||E.GLSL_types.indexOf(t)==-1||(t=="number"&&(t="float"),this.properties.name!="coord"&&e.addCode("varying"," varying "+t+" v_"+this.properties.name+";"),this.setOutputData(0,t))}}getOutputVarName(){return"v_"+this.properties.name}}a(nt,"title","Attribute"),a(nt,"desc","Input data from mesh attribute"),w("input/attribute",nt);class ht{constructor(){this.addInput("tex","sampler2D"),this.addInput("uv","vec2"),this.addOutput("rgba","vec4"),this.addOutput("rgb","vec3")}onGetCode(e){if(this.shader_destination){var t=S(this,0),r=fe(this),s="vec4 "+r+` = vec4(0.0);
`;if(t){var o=S(this,1)||e.buffer_names.uvs;s+=r+" = texture2D("+t+","+o+`);
`}var u=D(this,0);u&&(s+="vec4 "+D(this,0)+" = "+r+`;
`);var n=D(this,1);n&&(s+="vec3 "+D(this,1)+" = "+r+`.xyz;
`),e.addCode("code",s,this.shader_destination),this.setOutputData(0,"vec4"),this.setOutputData(1,"vec3")}}}a(ht,"title","Sampler2D"),a(ht,"desc","Reads a pixel from a texture"),w("texture/sampler2D",ht);class Et{constructor(){this.addOutput("","float"),this.properties={type:"float",value:0},this.addWidget("combo","type","float",null,{values:je,property:"type"}),this.updateWidgets()}getTitle(){return this.flags.collapsed?N(this.properties.value,this.properties.type,2):"Const"}onPropertyChanged(e,t){e=="type"&&(this.outputs[0].type!=t&&(this.disconnectOutput(0),this.outputs[0].type=t),this.widgets.length=1,this.updateWidgets()),e=="value"&&(t.length?(this.widgets[1].value=t[1],t.length>2&&(this.widgets[2].value=t[2]),t.length>3&&(this.widgets[3].value=t[3])):this.widgets[1].value=t)}updateWidgets(e){var t,r=this;e=this.properties.value;var s={step:.01};switch(this.properties.type){case"float":this.properties.value=0,this.addWidget("number","v",0,{step:.01,property:"value"});break;case"vec2":this.properties.value=e&&e.length==2?[e[0],e[1]]:[0,0,0],this.addWidget("number","x",this.properties.value[0],function(o){r.properties.value[0]=o},s),this.addWidget("number","y",this.properties.value[1],function(o){r.properties.value[1]=o},s);break;case"vec3":this.properties.value=e&&e.length==3?[e[0],e[1],e[2]]:[0,0,0],this.addWidget("number","x",this.properties.value[0],function(o){r.properties.value[0]=o},s),this.addWidget("number","y",this.properties.value[1],function(o){r.properties.value[1]=o},s),this.addWidget("number","z",this.properties.value[2],function(o){r.properties.value[2]=o},s);break;case"vec4":this.properties.value=e&&e.length==4?[e[0],e[1],e[2],e[3]]:[0,0,0,0],this.addWidget("number","x",this.properties.value[0],function(o){r.properties.value[0]=o},s),this.addWidget("number","y",this.properties.value[1],function(o){r.properties.value[1]=o},s),this.addWidget("number","z",this.properties.value[2],function(o){r.properties.value[2]=o},s),this.addWidget("number","w",this.properties.value[3],function(o){r.properties.value[3]=o},s);break;default:(t=console.error)==null||t.call(console,"unknown type for constant")}}onGetCode(e){if(this.shader_destination){var t=N(this.properties.value,this.properties.type),r=D(this,0);if(r){var s="	"+this.properties.type+" "+r+" = "+t+";";e.addCode("code",s,this.shader_destination),this.setOutputData(0,this.properties.type)}}}}a(Et,"title","const"),w("const/const",Et);const pt=class Ce{constructor(){this.addInput("xy","vec2"),this.addInput("x","float"),this.addInput("y","float"),this.addOutput("xy","vec2"),this.addOutput("x","float"),this.addOutput("y","float"),this.properties={x:0,y:0}}onPropertyChanged(){this.graph&&this.graph._version++}onGetCode(e){if(this.shader_destination){var t=this.properties,r=fe(this),s="	vec2 "+r+" = "+N([t.x,t.y])+`;
`;for(let c=0;c<Ce.varmodes.length;++c){let d=Ce.varmodes[c];var o=S(this,c);o&&(s+="	"+r+"."+d+" = "+o+`;
`)}for(let c=0;c<Ce.varmodes.length;++c){let d=Ce.varmodes[c];var u=D(this,c);if(u){var n=je[d.length-1];s+="	"+n+" "+u+" = "+r+"."+d+`;
`,this.setOutputData(c,n)}}e.addCode("code",s,this.shader_destination)}}};a(pt,"title","vec2"),a(pt,"varmodes",["xy","x","y"]);let wr=pt;w("const/vec2",wr);const ct=class Ae{constructor(){this.addInput("xyz","vec3"),this.addInput("x","float"),this.addInput("y","float"),this.addInput("z","float"),this.addInput("xy","vec2"),this.addInput("xz","vec2"),this.addInput("yz","vec2"),this.addOutput("xyz","vec3"),this.addOutput("x","float"),this.addOutput("y","float"),this.addOutput("z","float"),this.addOutput("xy","vec2"),this.addOutput("xz","vec2"),this.addOutput("yz","vec2"),this.properties={x:0,y:0,z:0}}onPropertyChanged(){this.graph&&this.graph._version++}onGetCode(e){if(this.shader_destination){var t=this.properties,r=fe(this),s="vec3 "+r+" = "+N([t.x,t.y,t.z])+`;
`;for(let u=0;u<Ae.varmodes.length;++u){let n=Ae.varmodes[u],c=S(this,u);c&&(s+="	"+r+"."+n+" = "+c+`;
`)}for(let u=0;u<Ae.varmodes.length;++u){let n=Ae.varmodes[u],c=D(this,u);if(c){var o=je[n.length-1];s+="	"+o+" "+c+" = "+r+"."+n+`;
`,this.setOutputData(u,o)}}e.addCode("code",s,this.shader_destination)}}};a(ct,"title","vec3"),a(ct,"varmodes",["xyz","x","y","z","xy","xz","yz"]);let Dr=ct;w("const/vec3",Dr);const lt=class ze{constructor(){this.addInput("xyzw","vec4"),this.addInput("xyz","vec3"),this.addInput("x","float"),this.addInput("y","float"),this.addInput("z","float"),this.addInput("w","float"),this.addInput("xy","vec2"),this.addInput("yz","vec2"),this.addInput("zw","vec2"),this.addOutput("xyzw","vec4"),this.addOutput("xyz","vec3"),this.addOutput("x","float"),this.addOutput("y","float"),this.addOutput("z","float"),this.addOutput("xy","vec2"),this.addOutput("yz","vec2"),this.addOutput("zw","vec2"),this.properties={x:0,y:0,z:0,w:0}}onPropertyChanged(){this.graph&&this.graph._version++}onGetCode(e){if(this.shader_destination){var t=this.properties,r=fe(this),s="vec4 "+r+" = "+N([t.x,t.y,t.z,t.w])+`;
`;for(let u=0;u<ze.varmodes.length;++u){let n=ze.varmodes[u],c=S(this,u);c&&(s+="	"+r+"."+n+" = "+c+`;
`)}for(let u=0;u<ze.varmodes.length;++u){let n=ze.varmodes[u],c=D(this,u);if(c){var o=je[n.length-1];s+="	"+o+" "+c+" = "+r+"."+n+`;
`,this.setOutputData(u,o)}}e.addCode("code",s,this.shader_destination)}}};a(lt,"title","vec4"),a(lt,"varmodes",["xyzw","xyz","x","y","z","w","xy","yz","zw"]);let br=lt;w("const/vec4",br);class dt{constructor(){this.addInput("color",E.ALL_TYPES),this.block_delete=!0}onGetCode(e){var t=S(this,0);if(t){var r=this.getInputData(0),s=gt(t,r,"vec4");e.addCode("fs_code","fragcolor = "+s+";")}}}a(dt,"title","FragColor"),a(dt,"desc","Pixel final color"),w("output/fragcolor",dt);const _t=class Lt{constructor(){this.addInput("A",E.ALL_TYPES),this.addInput("B",E.ALL_TYPES),this.addOutput("out",""),this.properties={operation:"*"},this.addWidget("combo","op.",this.properties.operation,{property:"operation",values:Lt.operations})}getTitle(){return this.flags.collapsed?"A"+this.properties.operation+"B":"Operation"}onGetCode(e){if(this.shader_destination&&this.isOutputConnected(0)){var t=[];for(let d=0;d<3;++d)t.push({name:S(this,d),type:this.getInputData(d)||"float"});var r=D(this,0);if(r){var s=t[0].type,o=s,u=this.properties.operation,n=[];for(let d=0;d<2;++d){var c=t[d].name;c==null&&(c=p.value!=null?p.value:"(1.0)",t[d].type="float"),t[d].type!=s&&(t[d].type=="float"&&(u=="*"||u=="/")||(c=Tt(c,t[d].type,s))),n.push(c)}e.addCode("code",o+" "+r+" = "+n[0]+u+n[1]+";",this.shader_destination),this.setOutputData(0,o)}}}};a(_t,"title","Operation"),a(_t,"operations",["+","-","*","/"]);let Sr=_t;w("math/operation",Sr);class yt{constructor(){this.addInput("A",E.ALL_TYPES),this.addInput("B",E.ALL_TYPES),this.addOutput("out",""),this.properties={func:"floor"},this._current="floor",this.addWidget("combo","func",this.properties.func,{property:"func",values:at})}onPropertyChanged(e,t){if(this.graph&&this.graph._version++,e=="func"){var r=ot[t];if(!r)return;for(let o=r.params.length;o<this.inputs.length;++o)this.removeInput(o);for(let o=0;o<r.params.length;++o){var s=r.params[o];this.inputs[o]?this.inputs[o].name=s.name+(s.value?" ("+s.value+")":""):this.addInput(s.name,E.ALL_TYPES)}}}getTitle(){return this.flags.collapsed?this.properties.func:"Func"}onGetCode(e){if(this.shader_destination&&this.isOutputConnected(0)){var t=[];for(let _=0;_<3;++_)t.push({name:S(this,_),type:this.getInputData(_)||"float"});var r=D(this,0);if(r){var s=ot[this.properties.func];if(s){var o=t[0].type,u=s.return_type;u=="T"&&(u=o);var n=[];for(let _=0;_<s.params.length;++_){var c=s.params[_],d=t[_].name;d==null&&(d=c.value!=null?c.value:"(1.0)",t[_].type="float"),(c.type=="T"&&t[_].type!=o||c.type!="T"&&t[_].type!=o)&&(d=Tt(d,t[_].type,o)),n.push(d)}e.addFunction("round",`float round(float v){ return floor(v+0.5); }
vec2 round(vec2 v){ return floor(v+vec2(0.5));}
vec3 round(vec3 v){ return floor(v+vec3(0.5));}
vec4 round(vec4 v){ return floor(v+vec4(0.5)); }
`),e.addCode("code",u+" "+r+" = "+s.func+"("+n.join(",")+");",this.shader_destination),this.setOutputData(0,u)}}}}}a(yt,"title","Func"),w("math/func",yt);class wt{constructor(){this.addInput("A",E.ALL_TYPES),this.addInput("B",E.ALL_TYPES),this.addOutput("C","vec4"),this.properties={code:"C = A+B",type:"vec4"},this.addWidget("text","code",this.properties.code,{property:"code"}),this.addWidget("combo","type",this.properties.type,{values:["float","vec2","vec3","vec4"],property:"type"})}onPropertyChanged(e,t){this.graph&&this.graph._version++,e=="type"&&this.outputs[0].type!=t&&(this.disconnectOutput(0),this.outputs[0].type=t)}getTitle(){return this.flags.collapsed?this.properties.code:"Snippet"}onGetCode(e){if(!(!this.shader_destination||!this.isOutputConnected(0))){var t=S(this,0);t||(t="1.0");var r=S(this,1);r||(r="1.0");var s=D(this,0);if(s){var o=this.getInputData(0)||"float",u=this.getInputData(1)||"float",n=this.properties.type;if(o=="T"||u=="T")return null;var c="funcSnippet"+this.id,d=`
`+n+" "+c+"( "+o+" A, "+u+` B) {
`;d+="	"+n+" C = "+n+`(0.0);
`,d+="	"+this.properties.code+`;
`,d+=`	return C;
}
`,e.addCode("functions",d,this.shader_destination),e.addCode("code",n+" "+s+" = "+c+"("+t+","+r+");",this.shader_destination),this.setOutputData(0,n)}}}}a(wt,"title","Snippet"),w("utils/snippet",wt);class Dt{constructor(){this.addOutput("out","float")}onGetCode(e){if(!(!this.shader_destination||!this.isOutputConnected(0))){var t=D(this,0);e.addUniform("u_rand"+this.id,"float",function(){return Math.random()}),e.addCode("code","float "+t+" = u_rand"+this.id+";",this.shader_destination),this.setOutputData(0,"float")}}}a(Dt,"title","Rand"),w("input/rand",Dt);const qe=class vt{constructor(){this.addInput("out",E.ALL_TYPES),this.addInput("scale","float"),this.addOutput("out","float"),this.properties={type:"noise",scale:1},this.addWidget("combo","type",this.properties.type,{property:"type",values:vt.NOISE_TYPES}),this.addWidget("number","scale",this.properties.scale,{property:"scale"})}onGetCode(e){if(!(!this.shader_destination||!this.isOutputConnected(0))){var t=S(this,0),r=D(this,0),s=this.getInputData(0);t||(s="vec2",t=e.buffer_names.uvs),e.addFunction("noise",vt.shader_functions),e.addUniform("u_noise_scale"+this.id,"float",this.properties.scale),s=="float"?e.addCode("code","float "+r+" = snoise( vec2("+t+") * u_noise_scale"+this.id+");",this.shader_destination):s=="vec2"||s=="vec3"?e.addCode("code","float "+r+" = snoise("+t+" * u_noise_scale"+this.id+");",this.shader_destination):s=="vec4"&&e.addCode("code","float "+r+" = snoise("+t+".xyz * u_noise_scale"+this.id+");",this.shader_destination),this.setOutputData(0,"float")}}};a(qe,"NOISE_TYPES",["noise","rand"]),a(qe,"title","noise"),a(qe,"shader_functions",`
        vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod(i, 289.0);
            vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
            vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
            m = m * m ;
            m = m * m ;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
            vec3 g;
            g.x = a0.x  * x0.x + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

            vec3 i  = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);

            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);

            vec3 x1 = x0 - i1 + 1.0 * C.xxx;
            vec3 x2 = x0 - i2 + 2.0 * C.xxx;
            vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

            i = mod(i, 289.0);
            vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));

            float n_ = 1.0 / 7.0;
            vec3 ns = n_ * D.wyz - D.xzx;

            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            
            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            
            vec4 s0 = floor(b0) * 2.0 + 1.0;
            vec4 s1 = floor(b1) * 2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            
            vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
            
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            
            vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;
            
            vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
            m = m * m;
            
            return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
        }

        vec3 hash3(vec2 p) {
            vec3 q = vec3(dot(p, vec2(127.1, 311.7)),
                        dot(p, vec2(269.5, 183.3)),
                        dot(p, vec2(419.2, 371.9)));
            return fract(sin(q) * 43758.5453);
        }

        vec4 hash4(vec3 p) {
            vec4 q = vec4(dot(p, vec3(127.1, 311.7, 257.3)),
                        dot(p, vec3(269.5, 183.3, 335.1)),
                        dot(p, vec3(314.5, 235.1, 467.3)),
                        dot(p, vec3(419.2, 371.9, 114.9)));
            return fract(sin(q) * 43758.5453);
        }

        float iqnoise(in vec2 x, float u, float v) {
            vec2 p = floor(x);
            vec2 f = fract(x);
            
            float k = 1.0 + 63.0 * pow(1.0 - v, 4.0);
            
            float va = 0.0;
            float wt = 0.0;
            for (int j = -2; j <= 2; j++)
                for (int i = -2; i <= 2; i++) {
                    vec2 g = vec2(float(i), float(j));
                    vec3 o = hash3(p + g) * vec3(u, u, 1.0);
                    vec2 r = g - f + o.xy;
                    float d = dot(r, r);
                    float ww = pow(1.0 - smoothstep(0.0, 1.414, sqrt(d)), k);
                    va += o.z * ww;
                    wt += ww;
                }
            
            return va / wt;
        }
    `);let Ir=qe;w("math/noise",Ir);class bt{constructor(){this.addOutput("out","float")}onGetCode(e){if(!(!this.shader_destination||!this.isOutputConnected(0))){var t=D(this,0);e.addUniform("u_time"+this.id,"float",function(){return getTime()*.001}),e.addCode("code","float "+t+" = u_time"+this.id+";",this.shader_destination),this.setOutputData(0,"float")}}}a(bt,"title","Time"),w("input/time",bt);const me=class Pt{constructor(){this.addInput("in","T"),this.addOutput("out","float")}onGetCode(e){if(!(!this.shader_destination||!this.isOutputConnected(0))){var t=S(this,0),r="float",s=D(this,0),o=this.getInputData(0);t=gt(t,o,"float"),e.addFunction("dither8x8",Pt.dither_func),e.addCode("code",r+" "+s+" = dither8x8("+t+");",this.shader_destination),this.setOutputData(0,r)}}};a(me,"title","Dither"),a(me,"dither_values",[.515625,.140625,.640625,.046875,.546875,.171875,.671875,.765625,.265625,.890625,.390625,.796875,.296875,.921875,.421875,.203125,.703125,.078125,.578125,.234375,.734375,.109375,.609375,.953125,.453125,.828125,.328125,.984375,.484375,.859375,.359375,.0625,.5625,.1875,.6875,.03125,.53125,.15625,.65625,.8125,.3125,.9375,.4375,.78125,.28125,.90625,.40625,.25,.75,.125,.625,.21875,.71875,.09375,.59375,1.0001,.5,.875,.375,.96875,.46875,.84375,.34375]),a(me,"dither_func",`
        float dither8x8(float brightness) {
            vec2 position = vec2(0.0);
            #ifdef FRAGMENT
            position = gl_FragCoord.xy;
            #endif
            int x = int(mod(position.x, 8.0));
            int y = int(mod(position.y, 8.0));
            int index = x + y * 8;
            float limit = 0.0;
            if (x < 8) {
                if (index == 0) limit = 0.015625;
                // Add more conditions or code here if needed
                // Example: if (condition) { ... }
            }
            ${me.dither_values.map((v,e)=>`else if (index == ${e+1}) limit = ${v};`).join(`
`)}
            return brightness < limit ? 0.0 : 1.0;
        }
    `);let Or=me;w("math/dither",Or);class St{constructor(){this.addInput("",E.ALL_TYPES),this.addOutput("",""),this.properties={min_value:0,max_value:1,min_value2:0,max_value2:1},this.addWidget("number","min",0,{step:.1,property:"min_value"}),this.addWidget("number","max",1,{step:.1,property:"max_value"}),this.addWidget("number","min2",0,{step:.1,property:"min_value2"}),this.addWidget("number","max2",1,{step:.1,property:"max_value2"})}onPropertyChanged(){this.graph&&this.graph._version++}onConnectionsChange(){var e=this.getInputDataType(0);this.outputs[0].type=e||"T"}onGetCode(e){var t;if(!(!this.shader_destination||!this.isOutputConnected(0))){var r=S(this,0),s=D(this,0);if(!(!r&&!s)){var o=this.getInputDataType(0);if(this.outputs[0].type=o,o=="T"){(t=console.warn)==null||t.call(console,"node type is T and cannot be resolved");return}if(!r){e.addCode("code","	"+o+" "+s+" = "+o+`(0.0);
`);return}var u=N(this.properties.min_value),n=N(this.properties.max_value),c=N(this.properties.min_value2),d=N(this.properties.max_value2);e.addCode("code",`${o} ${s} = ( (${r} - ${u}) / (${n} - ${u}) ) * (${d} - ${c}) + ${c};`,this.shader_destination),this.setOutputData(0,o)}}}}a(St,"title","Remap"),w("math/remap",St);
