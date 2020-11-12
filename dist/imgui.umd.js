(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ImGui = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    		path: basedir,
    		exports: {},
    		require: function (path, base) {
    			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    		}
    	}, fn(module, module.exports), module.exports;
    }

    function getAugmentedNamespace(n) {
    	if (n.__esModule) return n;
    	var a = Object.defineProperty({}, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    // resolves . and .. elements in a path array with directory names there
    // must be no slashes, empty elements, or device names (c:\) in the array
    // (so also no leading and trailing slashes - it does not distinguish
    // relative and absolute paths)
    function normalizeArray(parts, allowAboveRoot) {
      // if the path tries to go above the root, `up` ends up > 0
      var up = 0;
      for (var i = parts.length - 1; i >= 0; i--) {
        var last = parts[i];
        if (last === '.') {
          parts.splice(i, 1);
        } else if (last === '..') {
          parts.splice(i, 1);
          up++;
        } else if (up) {
          parts.splice(i, 1);
          up--;
        }
      }

      // if the path is allowed to go above the root, restore leading ..s
      if (allowAboveRoot) {
        for (; up--; up) {
          parts.unshift('..');
        }
      }

      return parts;
    }

    // Split a filename into [root, dir, basename, ext], unix version
    // 'root' is just a slash, or nothing.
    var splitPathRe =
        /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    var splitPath = function(filename) {
      return splitPathRe.exec(filename).slice(1);
    };

    // path.resolve([from ...], to)
    // posix version
    function resolve() {
      var resolvedPath = '',
          resolvedAbsolute = false;

      for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path = (i >= 0) ? arguments[i] : '/';

        // Skip empty and invalid entries
        if (typeof path !== 'string') {
          throw new TypeError('Arguments to path.resolve must be strings');
        } else if (!path) {
          continue;
        }

        resolvedPath = path + '/' + resolvedPath;
        resolvedAbsolute = path.charAt(0) === '/';
      }

      // At this point the path should be resolved to a full absolute path, but
      // handle relative paths to be safe (might happen when process.cwd() fails)

      // Normalize the path
      resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
        return !!p;
      }), !resolvedAbsolute).join('/');

      return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
    }
    // path.normalize(path)
    // posix version
    function normalize(path) {
      var isPathAbsolute = isAbsolute(path),
          trailingSlash = substr(path, -1) === '/';

      // Normalize the path
      path = normalizeArray(filter(path.split('/'), function(p) {
        return !!p;
      }), !isPathAbsolute).join('/');

      if (!path && !isPathAbsolute) {
        path = '.';
      }
      if (path && trailingSlash) {
        path += '/';
      }

      return (isPathAbsolute ? '/' : '') + path;
    }
    // posix version
    function isAbsolute(path) {
      return path.charAt(0) === '/';
    }

    // posix version
    function join() {
      var paths = Array.prototype.slice.call(arguments, 0);
      return normalize(filter(paths, function(p, index) {
        if (typeof p !== 'string') {
          throw new TypeError('Arguments to path.join must be strings');
        }
        return p;
      }).join('/'));
    }


    // path.relative(from, to)
    // posix version
    function relative(from, to) {
      from = resolve(from).substr(1);
      to = resolve(to).substr(1);

      function trim(arr) {
        var start = 0;
        for (; start < arr.length; start++) {
          if (arr[start] !== '') break;
        }

        var end = arr.length - 1;
        for (; end >= 0; end--) {
          if (arr[end] !== '') break;
        }

        if (start > end) return [];
        return arr.slice(start, end - start + 1);
      }

      var fromParts = trim(from.split('/'));
      var toParts = trim(to.split('/'));

      var length = Math.min(fromParts.length, toParts.length);
      var samePartsLength = length;
      for (var i = 0; i < length; i++) {
        if (fromParts[i] !== toParts[i]) {
          samePartsLength = i;
          break;
        }
      }

      var outputParts = [];
      for (var i = samePartsLength; i < fromParts.length; i++) {
        outputParts.push('..');
      }

      outputParts = outputParts.concat(toParts.slice(samePartsLength));

      return outputParts.join('/');
    }

    var sep = '/';
    var delimiter = ':';

    function dirname(path) {
      var result = splitPath(path),
          root = result[0],
          dir = result[1];

      if (!root && !dir) {
        // No dirname whatsoever
        return '.';
      }

      if (dir) {
        // It has a dirname, strip trailing slash
        dir = dir.substr(0, dir.length - 1);
      }

      return root + dir;
    }

    function basename(path, ext) {
      var f = splitPath(path)[2];
      // TODO: make this comparison case-insensitive on windows?
      if (ext && f.substr(-1 * ext.length) === ext) {
        f = f.substr(0, f.length - ext.length);
      }
      return f;
    }


    function extname(path) {
      return splitPath(path)[3];
    }
    var path = {
      extname: extname,
      basename: basename,
      dirname: dirname,
      sep: sep,
      delimiter: delimiter,
      relative: relative,
      join: join,
      isAbsolute: isAbsolute,
      normalize: normalize,
      resolve: resolve
    };
    function filter (xs, f) {
        if (xs.filter) return xs.filter(f);
        var res = [];
        for (var i = 0; i < xs.length; i++) {
            if (f(xs[i], i, xs)) res.push(xs[i]);
        }
        return res;
    }

    // String.prototype.substr - negative index don't work in IE8
    var substr = 'ab'.substr(-1) === 'b' ?
        function (str, start, len) { return str.substr(start, len) } :
        function (str, start, len) {
            if (start < 0) start = str.length + start;
            return str.substr(start, len);
        }
    ;

    var path$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        resolve: resolve,
        normalize: normalize,
        isAbsolute: isAbsolute,
        join: join,
        relative: relative,
        sep: sep,
        delimiter: delimiter,
        dirname: dirname,
        basename: basename,
        extname: extname,
        'default': path
    });

    var empty = {};

    var empty$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': empty
    });

    var require$$0 = /*@__PURE__*/getAugmentedNamespace(path$1);

    var require$$1 = /*@__PURE__*/getAugmentedNamespace(empty$1);

    var bindImgui = createCommonjsModule(function (module, exports) {
    var Module = (function() {
      var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
      if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
      return (
    function(Module) {
      Module = Module || {};

    var Module=typeof Module!=="undefined"?Module:{};var readyPromiseResolve,readyPromiseReject;Module["ready"]=new Promise(function(resolve,reject){readyPromiseResolve=resolve;readyPromiseReject=reject;});var moduleOverrides={};var key;for(key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key];}}var arguments_=[];var thisProgram="./this.program";var quit_=function(status,toThrow){throw toThrow};var ENVIRONMENT_IS_WEB=false;var ENVIRONMENT_IS_WORKER=false;var ENVIRONMENT_IS_NODE=false;var ENVIRONMENT_IS_SHELL=false;ENVIRONMENT_IS_WEB=typeof window==="object";ENVIRONMENT_IS_WORKER=typeof importScripts==="function";ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof process.versions==="object"&&typeof process.versions.node==="string";ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readBinary;var nodeFS;var nodePath;if(ENVIRONMENT_IS_NODE){if(ENVIRONMENT_IS_WORKER){scriptDirectory=require$$0.dirname(scriptDirectory)+"/";}else {scriptDirectory=__dirname+"/";}read_=function shell_read(filename,binary){var ret=tryParseAsDataURI(filename);if(ret){return binary?ret:ret.toString()}if(!nodeFS)nodeFS=require$$1;if(!nodePath)nodePath=require$$0;filename=nodePath["normalize"](filename);return nodeFS["readFileSync"](filename,binary?null:"utf8")};readBinary=function readBinary(filename){var ret=read_(filename,true);if(!ret.buffer){ret=new Uint8Array(ret);}assert(ret.buffer);return ret};if(process["argv"].length>1){thisProgram=process["argv"][1].replace(/\\/g,"/");}arguments_=process["argv"].slice(2);process["on"]("uncaughtException",function(ex){if(!(ex instanceof ExitStatus)){throw ex}});process["on"]("unhandledRejection",abort);quit_=function(status){process["exit"](status);};Module["inspect"]=function(){return "[Emscripten Module object]"};}else if(ENVIRONMENT_IS_SHELL){if(typeof read!="undefined"){read_=function shell_read(f){var data=tryParseAsDataURI(f);if(data){return intArrayToString(data)}return read(f)};}readBinary=function readBinary(f){var data;data=tryParseAsDataURI(f);if(data){return data}if(typeof readbuffer==="function"){return new Uint8Array(readbuffer(f))}data=read(f,"binary");assert(typeof data==="object");return data};if(typeof scriptArgs!="undefined"){arguments_=scriptArgs;}else if(typeof arguments!="undefined"){arguments_=arguments;}if(typeof quit==="function"){quit_=function(status){quit(status);};}if(typeof print!=="undefined"){if(typeof console==="undefined")console={};console.log=print;console.warn=console.error=typeof printErr!=="undefined"?printErr:print;}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href;}else if(typeof document!=="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src;}if(_scriptDir){scriptDirectory=_scriptDir;}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.lastIndexOf("/")+1);}else {scriptDirectory="";}{read_=function shell_read(url){try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText}catch(err){var data=tryParseAsDataURI(url);if(data){return intArrayToString(data)}throw err}};if(ENVIRONMENT_IS_WORKER){readBinary=function readBinary(url){try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}catch(err){var data=tryParseAsDataURI(url);if(data){return data}throw err}};}}}else;var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);for(key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key];}}moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var noExitRuntime;if(Module["noExitRuntime"])noExitRuntime=Module["noExitRuntime"];if(typeof WebAssembly!=="object"){abort("no native wasm support detected");}var wasmMemory;var ABORT=false;function assert(condition,text){if(!condition){abort("Assertion failed: "+text);}}var UTF8Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(heap,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heap[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heap.subarray&&UTF8Decoder){return UTF8Decoder.decode(heap.subarray(idx,endPtr))}else {var str="";while(idx<endPtr){var u0=heap[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heap[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heap[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2;}else {u0=(u0&7)<<18|u1<<12|u2<<6|heap[idx++]&63;}if(u0<65536){str+=String.fromCharCode(u0);}else {var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023);}}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}function stringToUTF8Array(str,heap,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023;}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u;}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63;}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63;}else {if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63;}}heap[outIdx]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}function lengthBytesUTF8(str){var len=0;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;if(u<=127)++len;else if(u<=2047)len+=2;else if(u<=65535)len+=3;else len+=4;}return len}var UTF16Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf-16le"):undefined;function UTF16ToString(ptr,maxBytesToRead){var endPtr=ptr;var idx=endPtr>>1;var maxIdx=idx+maxBytesToRead/2;while(!(idx>=maxIdx)&&HEAPU16[idx])++idx;endPtr=idx<<1;if(endPtr-ptr>32&&UTF16Decoder){return UTF16Decoder.decode(HEAPU8.subarray(ptr,endPtr))}else {var i=0;var str="";while(1){var codeUnit=HEAP16[ptr+i*2>>1];if(codeUnit==0||i==maxBytesToRead/2)return str;++i;str+=String.fromCharCode(codeUnit);}}}function stringToUTF16(str,outPtr,maxBytesToWrite){if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647;}if(maxBytesToWrite<2)return 0;maxBytesToWrite-=2;var startPtr=outPtr;var numCharsToWrite=maxBytesToWrite<str.length*2?maxBytesToWrite/2:str.length;for(var i=0;i<numCharsToWrite;++i){var codeUnit=str.charCodeAt(i);HEAP16[outPtr>>1]=codeUnit;outPtr+=2;}HEAP16[outPtr>>1]=0;return outPtr-startPtr}function lengthBytesUTF16(str){return str.length*2}function UTF32ToString(ptr,maxBytesToRead){var i=0;var str="";while(!(i>=maxBytesToRead/4)){var utf32=HEAP32[ptr+i*4>>2];if(utf32==0)break;++i;if(utf32>=65536){var ch=utf32-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023);}else {str+=String.fromCharCode(utf32);}}return str}function stringToUTF32(str,outPtr,maxBytesToWrite){if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647;}if(maxBytesToWrite<4)return 0;var startPtr=outPtr;var endPtr=startPtr+maxBytesToWrite-4;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343){var trailSurrogate=str.charCodeAt(++i);codeUnit=65536+((codeUnit&1023)<<10)|trailSurrogate&1023;}HEAP32[outPtr>>2]=codeUnit;outPtr+=4;if(outPtr+4>endPtr)break}HEAP32[outPtr>>2]=0;return outPtr-startPtr}function lengthBytesUTF32(str){var len=0;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343)++i;len+=4;}return len}var WASM_PAGE_SIZE=65536;var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferAndViews(buf){buffer=buf;Module["HEAP8"]=HEAP8=new Int8Array(buf);Module["HEAP16"]=HEAP16=new Int16Array(buf);Module["HEAP32"]=HEAP32=new Int32Array(buf);Module["HEAPU8"]=HEAPU8=new Uint8Array(buf);Module["HEAPU16"]=HEAPU16=new Uint16Array(buf);Module["HEAPU32"]=HEAPU32=new Uint32Array(buf);Module["HEAPF32"]=HEAPF32=new Float32Array(buf);Module["HEAPF64"]=HEAPF64=new Float64Array(buf);}var INITIAL_INITIAL_MEMORY=Module["INITIAL_MEMORY"]||16777216;if(Module["wasmMemory"]){wasmMemory=Module["wasmMemory"];}else {wasmMemory=new WebAssembly.Memory({"initial":INITIAL_INITIAL_MEMORY/WASM_PAGE_SIZE,"maximum":INITIAL_INITIAL_MEMORY/WASM_PAGE_SIZE});}if(wasmMemory){buffer=wasmMemory.buffer;}INITIAL_INITIAL_MEMORY=buffer.byteLength;updateGlobalBufferAndViews(buffer);var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATMAIN__=[];var __ATPOSTRUN__=[];function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift());}}callRuntimeCallbacks(__ATPRERUN__);}function initRuntime(){callRuntimeCallbacks(__ATINIT__);}function preMain(){callRuntimeCallbacks(__ATMAIN__);}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift());}}callRuntimeCallbacks(__ATPOSTRUN__);}function addOnPreRun(cb){__ATPRERUN__.unshift(cb);}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb);}var runDependencies=0;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies);}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies);}if(runDependencies==0){if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback();}}}Module["preloadedImages"]={};Module["preloadedAudios"]={};function abort(what){if(Module["onAbort"]){Module["onAbort"](what);}what+="";err(what);ABORT=true;what="abort("+what+"). Build with -s ASSERTIONS=1 for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}function hasPrefix(str,prefix){return String.prototype.startsWith?str.startsWith(prefix):str.indexOf(prefix)===0}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return hasPrefix(filename,dataURIPrefix)}var fileURIPrefix="file://";function isFileURI(filename){return hasPrefix(filename,fileURIPrefix)}var wasmBinaryFile="data:application/octet-stream;base64,AGFzbQEAAAABpgulAWACf38AYAF/AGACf38Bf2ABfwF/YAAAYAN/f38Bf2ADf39/AGAEf39/fwF/YAR/f39/AGAAAX9gBn9/f39/fwF/YAd/f39/f39/AX9gBX9/f39/AX9gBX9/f39/AGAGf39/f39/AGACf38BfWAHf39/f39/fwBgCH9/f39/f39/AX9gAAF9YAF/AX1gAn99AGABfQBgBn9/f39/fQBgA39/fQBgBX9/f399AGAEf39/fQBgBX9/fX9/AGABfQF9YAV/f399fwBgBn19fX9/fwBgCn9/f39/f39/f38AYAd/f39/f399AGAFf35+fn4AYAl/f39/f39/f38Bf2ADf399AX9gA39+fwF+YAJ/fQF9YAJ9fQF9YAh/f39/f39/fwBgCX9/f39/f39/fwBgC39/f39/f39/f39/AGAJf39/f39/f31/AGAGf39/f31/AGAEf399fwBgBH9/fX0AYAN/fX8AYAR/fX9/AGAIf39/fX9/f30Bf2AIf39/f39/fX8AYAd/f39/fX99AGAGf39/fX9/AGAFf39/fX0AYAZ/f31/f38AYAZ/f31/f30AYAZ/f319fX8AYAh/f319fX9/fwBgA31/fwBgAn19AGAHf39/f39/fQF/YAZ/f31/f38Bf2AGf399fX99AX9gB39/fX19f30Bf2AGf398fH9/AX9gA399fQF/YAN/f38BfWACfHwBfGAHf39/f319fwBgCH9/fX9/f31/AGAEf35+fwBgA399fQBgAn99AX9gAn5+AX5gA319fQF9YAF/AXxgB39/f319f38AYAp/f39/f39/f39/AX9gCH9/f39/f399AX9gCX9/f39/f31/fwF/YAl/f39+fn99f38Bf2AEf39/fQF/YAZ/f399f38Bf2AFf399f38Bf2AEf399fQF/YAZ/fX9/f30Bf2AEf31/fQF/YAZ/fX5+f30Bf2AFf319fX0Bf2AGf3x/f39/AX9gAn5/AX9gAXwBf2ACf38BfmADfn5+AX5gAXwBfWAAAXxgAnx/AXxgDH9/f39/f39/f39/fwBgDX9/f39/f39/f39/f38AYAp/f39/f39/f31/AGAIf39/f39/f30AYAl/f39/f399fX8AYAd/f39/f31/AGAIf39/f399f30AYAh/f39/f319fwBgCH9/f399fX9/AGAHf39/fX9/fwBgCX9/f31/f399fwBgB39/f31/f30AYAd/f399f31/AGAHf39/fX19fwBgB39/f319fX0AYAN/f34AYAp/f31/f39/f31/AGAJf399f39/f31/AGAIf399fX9/f38AYAp/f319fX19fX1/AGALf399fX19fX19fX0AYAx/f319fX19fX19fX8AYAN/f3wAYAJ/fgBgA39+fgBgB399fX1/f38AYAd/fX19fX19AGALf319fX19fX19fX8AYAJ/fABgCn9/f39/f399f38Bf2AJf39/f31/f399AX9gBX9/f31/AX9gCH9/f31/f39/AX9gB39/f319f30Bf2AJf39/fX1/fX9/AX9gCX9/f319fX9/fQF/YAd/f398fH9/AX9gCX9/f3x8f31/fwF/YAR/f31/AX9gBX9/fX99AX9gBn9/fX1/fwF/YAh/f319fX9/fwF/YAR/fX9/AX9gBX99f399AX9gBn99fX1/fQF/YAZ/fXx8f30Bf2ADfn9/AX9gAn5+AX9gA35+fgF/YAR+fn5+AX9gAn1/AX9gAn19AX9gBH19fX0Bf2ABfwF+YAJ/fgF+YAR/f399AX1gBX9/f319AX1gBH99fX0BfWACfn4BfWAEfn5+fQF9YAV+fn59fQF9YAJ9fwF9YAR9fX19AX1gBX19fX19AX1gBXx8fH19AX1gA39/fwF8YAJ/fAF8YAJ+fgF8YAN8fH0BfGADfHx8AXwCiAIrAWEBYgAeAWEBYwAOAWEBZAAmAWEBZQACAWEBZgCgAQFhAWcAYAFhAWgABgFhAWkADQFhAWoAAgFhAWsACAFhAWwABgFhAW0ADgFhAW4AAgFhAW8AAQFhAXAABgFhAXEAAQFhAXIABwFhAXMABQFhAXQAAwFhAXUABgFhAXYAAAFhAXcAdQFhAXgAAgFhAXkAAwFhAXoADAFhAUEAAQFhAUIABQFhAUMAAwFhAUQABAFhAUUABwFhAUYABQFhAUcABQFhAUgAAAFhAUkADQFhAUoAAAFhAUsACQFhAUwAAwFhAU0ABwFhAU4AAQFhAU8ABgFhAVAAAwFhAVEACQFhAWECAYACgAIDoRT7Ez8BAwADBlYlABMDAQlGBgEDAgUDBQMlFwAGAwMBAwIBGwMbAQAFAwNWAwUCAwACACACBwJIGDkCAwYJAwMCDwMlAwAqAQQD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EgAgABDeAgRAIAAoAgAPCyAACx0AIAAgASoCACACKgIAkiABKgIEIAIqAgSSECoaCyAAIAAgBDgCDCAAIAM4AgggACACOAIEIAAgATgCACAACwwAIAAgASAAIAFgGwsLACABIAAQNBCVFAs3AQF8An1D//9/fyAAEPQFIgFEAAAA4P//70dmDQAaQ///f/8gAUQAAADg///vx2UNABogAbYLCwsAIABCADcCACAACx0BAX8gABDeAgRAIAAoAgAhASAAEN0FGiABEE0LCxgBAX9BkLYDKAIAKAKsMyIAQQE6AHwgAAtaAQJ/IwBBEGsiAiQAIAJBkLYDKAIAIgNBmCpqIABBBHRqIgApArQBNwMIIAIgACkCrAE3AwAgAiACKgIMIAMqApgqIAGUlDgCDCACELYDIQAgAkEQaiQAIAALHQAgACABKgIAIAIqAgCTIAEqAgQgAioCBJMQKhoLEgAgAEHU5AI2AgAgAEEEahA1CxYAIAAoAhAQUAR/QQAFIABBBGoQLgsLFAAgACABENwNIABBvOMCNgIAIAALGAAgACABKQIANwIAIAAgAikCADcCCCAACyYBAX8jAEEQayIBJAAgASAANgIMIAFBDGoQLCEAIAFBEGokACAAC4IEAQN/IAJBgARPBEAgACABIAIQGhogAA8LIAAgAmohAwJAIAAgAXNBA3FFBEACQCACQQFIBEAgACECDAELIABBA3FFBEAgACECDAELIAAhAgNAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANPDQEgAkEDcQ0ACwsCQCADQXxxIgRBwABJDQAgAiAEQUBqIgVLDQADQCACIAEoAgA2AgAgAiABKAIENgIEIAIgASgCCDYCCCACIAEoAgw2AgwgAiABKAIQNgIQIAIgASgCFDYCFCACIAEoAhg2AhggAiABKAIcNgIcIAIgASgCIDYCICACIAEoAiQ2AiQgAiABKAIoNgIoIAIgASgCLDYCLCACIAEoAjA2AjAgAiABKAI0NgI0IAIgASgCODYCOCACIAEoAjw2AjwgAUFAayEBIAJBQGsiAiAFTQ0ACwsgAiAETw0BA0AgAiABKAIANgIAIAFBBGohASACQQRqIgIgBEkNAAsMAQsgA0EESQRAIAAhAgwBCyADQXxqIgQgAEkEQCAAIQIMAQsgACECA0AgAiABLQAAOgAA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BFANABogASAEIAApA3hCf4V8IgQgASAAKAIEIgJrrFkNABogAiAEp2oLNgJoIAAoAgQhAiABBEAgACAAKQN4IAEgAmtBAWqsfDcDeAsgAkF/aiIALQAAIANHBEAgACADOgAACyADCxkAIAAgASACECoaIABBCGogAyAEECoaIAALBwAgAEEIagvjAQEDf0GQtgMoAgAiBCgCrDMhAwJAIAFFDQAgAyADKAK8AiADKAK0AnI2ArwCIAEgBCgCuDVHBEAgBC0AmDZFDQELIAQoArQ1IgUoAoQGIAMoAoQGRw0AIAMgBUcEQCAFKAIIIAMoAghyQYCAgARxRQ0BCyADIAIgACACGyABEO0QCyADIAE2AogCIAMgACkCADcCkAIgAyAAQQhqIgIpAgA3ApgCIANBADYCjAIgBEEANgLoNAJAIAAgARDiBSIBDQAgACACQQEQlQNFDQAgAyADKAKMAkEBcjYCjAILIAFBAXMLGQAgASAAQcQDahBwKAIAEPIBIgAQngIgAAslACAAQ///f39D//9/fxAqGiAAQQhqQ///f/9D//9//xAqGiAACw0AIABB2ABqIAEQoAILCwAgACABNgIAIAALIgEBfyMAQRBrIgIkACACIAE2AgwgACABEOsCIAJBEGokAAuoCwIFfwl+IwBB4ABrIgUkACACQiCGIAFCIIiEIREgBEIvhiADQhGIhCENIARC////////P4MiDkIPhiADQjGIhCEPIAIgBIVCgICAgICAgICAf4MhCiACQv///////z+DIgtCIIghECAOQhGIIRIgBEIwiKdB//8BcSEHAkACfyACQjCIp0H//wFxIglBf2pB/f8BTQRAQQAgB0F/akH+/wFJDQEaCyABUCACQv///////////wCDIgxCgICAgICAwP//AFQgDEKAgICAgIDA//8AURtFBEAgAkKAgICAgIAghCEKDAILIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRG0UEQCAEQoCAgICAgCCEIQogAyEBDAILIAEgDEKAgICAgIDA//8AhYRQBEAgAiADhFAEQEKAgICAgIDg//8AIQpCACEBDAMLIApCgICAgICAwP//AIQhCkIAIQEMAgsgAyACQoCAgICAgMD//wCFhFAEQCABIAyEIQJCACEBIAJQBEBCgICAgICA4P//ACEKDAMLIApCgICAgICAwP//AIQhCgwCCyABIAyEUARAQgAhAQwCCyACIAOEUARAQgAhAQwCCyAMQv///////z9YBEAgBUHQAGogASALIAEgCyALUCIGG3kgBkEGdK18pyIGQXFqEJcBIAUpA1giC0IghiAFKQNQIgFCIIiEIREgC0IgiCEQQRAgBmshBgsgBiACQv///////z9WDQAaIAVBQGsgAyAOIAMgDiAOUCIIG3kgCEEGdK18pyIIQXFqEJcBIAUpA0giAkIPhiAFKQNAIgNCMYiEIQ8gAkIvhiADQhGIhCENIAJCEYghEiAGIAhrQRBqCyEGIA9C/////w+DIgIgC0L/////D4MiBH4iDiANQv////8PgyILIBBCgIAEhCIMfnwiDSAOVK0gDSASQv////8Hg0KAgICACIQiDiARQv////8PgyIRfnwiDyANVK18IA8gCyARfiIQIANCD4ZCgID+/w+DIgMgBH58Ig0gEFStIA0gAiABQv////8PgyIBfnwiECANVK18fCINIA9UrXwgDCAOfnwgBCAOfiISIAIgDH58Ig8gElStQiCGIA9CIIiEfCANIA9CIIZ8Ig8gDVStfCAPIAQgC34iDSADIAx+fCIEIAIgEX58IgIgASAOfnwiDEIgiCAMIAJUrSAEIA1UrSACIARUrXx8QiCGhHwiAiAPVK18IAIgECABIAt+IgQgAyARfnwiDkIgiCAOIARUrUIghoR8IgQgEFStIAQgDEIghnwiDCAEVK18fCIEIAJUrXwiAkKAgICAgIDAAIMiC0IwiKciCCAHIAlqIAZqakGBgH9qIgZB//8BTgRAIApCgICAgICAwP//AIQhCkIAIQEMAQsgAkIBhiAEQj+IhCACIAtQIgcbIQsgDkIghiICIAEgA358IgEgAlStIAx8IgMgCEEBc60iDIYgAUIBiCAIQT5yrYiEIQIgBEIBhiADQj+IhCAEIAcbIQQgASAMhiEBAn4gBkEATARAQQEgBmsiB0GAAU8EQEIAIQEMAwsgBUEwaiABIAIgBkH/AGoiBhCXASAFQSBqIAQgCyAGEJcBIAVBEGogASACIAcQhAMgBSAEIAsgBxCEAyAFKQMwIAUpAziEQgBSrSAFKQMgIAUpAxCEhCEBIAUpAyggBSkDGIQhAiAFKQMAIQQgBSkDCAwB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EN0BIAFBCGpDAAAAABB8IAVBAEEAEFQaAkACQAJAAkACQAJAIAQoAtAzIgcgAygCJEcEQCAEKALUMyAHRiAHQQBHcSECIAMtACgNAyAELQCANCEFIAJFDQEgBUEARyEGDAQLIAMtACgNBCAELQCANA0BDAQLIAVFDQMLIAAgBCgC/DM2AogCQQEhBgwCCyACRQ0BCyAAIAc2AogCIAAgASkDGDcCmAIgACABKQMQNwKQAiAAQYwCaiIFKAIAIQIgBC0A4DMEQCAAIAJBFHI2AowCIAZFDQMgAkEEciECDAILIAAgAkEQcjYCjAIgBkUNAgwBCyAAIAEpAxA3ApACIAAgASkDGDcCmAIgAEGMAmoiBSAAKAKMAiICQRByNgIAIAZFDQELIAQoAtAzIAQoAvwzRg0AIAUgAkEwcjYCAAsgCBCBASABQSBqJAAL2AkCBH8EfiMAQfAAayIFJAAgBEL///////////8AgyEKAkACQCABQn98IgtCf1EgAkL///////////8AgyIJIAsgAVStfEJ/fCILQv///////7///wBWIAtC////////v///AFEbRQRAIANCf3wiC0J/UiAKIAsgA1StfEJ/fCILQv///////7///wBUIAtC////////v///AFEbDQELIAFQIAlCgICAgICAwP//AFQgCUKAgICAgIDA//8AURtFBEAgAkKAgICAgIAghCEEIAEhAwwCCyADUCAKQoCAgICAgMD//wBUIApCgICAgICAwP//AFEbRQRAIARCgICAgICAIIQhBAwCCyABIAlCgICAgICAwP//AIWEUARAQoCAgICAgOD//wAgAiABIAOFIAIgBIVCgICAgICAgICAf4WEUCIGGyEEQgAgASAGGyEDDAILIAMgCkKAgICAgIDA//8AhYRQDQEgASAJhFAEQCADIAqEQgBSDQIgASADgyEDIAIgBIMhBAwCCyADIAqEUEUNACABIQMgAiEEDAELIAMgASADIAFWIAogCVYgCSAKURsiBxshCiAEIAIgBxsiC0L///////8/gyEJIAIgBCAHGyICQjCIp0H//wFxIQggC0IwiKdB//8BcSIGRQRAIAVB4ABqIAogCSAKIAkgCVAiBht5IAZBBnStfKciBkFxahCXASAFKQNoIQkgBSkDYCEKQRAgBmshBgsgASADIAcbIQMgAkL/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AQsgAkEBcSEJQQAhBANAIABBCiABIABrEMsCIgggASAIGyEIIAlFBEAgBioCACELIANBOGogACAIQQBDAACAvxBfIAYgCyADKgI4EDE4AgALIAhBAWoiACABSUEAIARBAWoiBCAFSBsNAAsgBLIhDSADKgJMCyELIAMgDCANlCALkjgCTAsgACABSQRAIANBMGogA0HIAGogA0EoakP//39/IAwQKhAvIANBOGogA0HIAGogA0EwahA8IQQDQCAEQQAQ4gVFBEAgAEEKIAEgAGsQywIhBSAGKgIAIQsgA0EwaiAAIAUgASAFGyIFQQBDAACAvxBfIAYgCyADKgIwEDE4AgAgAyADKQNIIgo3AyAgAyAKNwMQIANBEGogACAFQQAQqQEgBCAMIAQqAgSSOAIEIAQgDCAEKgIMkjgCDCADIAwgAyoCTJI4AkwgBUEBaiIAIAFJDQELC0MAAAAAIQsgAyAMIAAgAUkEfSACQQFxIQVBACECA0AgAEEKIAEgAGsQywIiBCABIAQbIQQgBUUEQCAGKgIAIQsgA0EwaiAAIARBAEMAAIC/EF8gBiALIAMqAjAQMTgCAAsgAkEBaiECIARBAWoiACABSQ0ACyACsgUgCwuUIAMqAkySOAJMCyADQThqIANByABqIAcQOCAGIAMqAjw4AgQgA0EwaiAHIAYQLyADQThqIAcgA0EwahA8IQAgBkMAAAAAEHwgAEEAQQAQVBoMAQsgA0HQAGogACABQQACfSAMQwAAAABgQQFzRQRAIARByAFqIAwQ7g8hCwsgCwsQXyADQcgAaiAHIANB0ABqEC8gA0E4aiAHIANByABqEDwhAiADQdAAakMAAAAAEHwgAkEAQQAQVEUNACADIAIpAwAiCjcDCCADIAo3AxggA0EIaiAAIAEgCxD4CAsgA0HgAGokAAsMACABIAAgACABSBsLEwBBkLYDKAIAKAKsMxDVChDUAQv8AQIFfwF9IwBBEGsiAyQAQZC2AygCACECEDYiAEGcA2oiASABKAIAQQFqEKwHIAEQiQUiASAAKQLIATcCACABIAApAuABNwIIIAEgACgCtAM2AhAgASAAKAK4AzYCFCABIAApAugBNwIYIAEgACoC+AE4AiAgASACKALUMzYCJCACLQCANCEEIAFBAToAKSABIAQ6ACggACAAKQLIATcC4AEgACAA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QT9xIAJBBnRBwB9xIARBD3FBDHRycjYCAEEDDwsgA0H4AXFB8AFGBEAgAEH9/wM2AgAgAgRAQQEhAyACIAFrQQRIDQILQQQhAyABLQAAIgRB9AFLDQECQAJAAkACQCAEQZB+ag4FAAICAgECCyABLQABIgJB8ABqQf8BcUEvTQ0CDAQLIAEtAAEiAkGPAU0NAQwDCyABLQABIQILIAJBwAFxQYABRw0BIAEtAAIiBUHAAXFBgAFHDQEgAS0AAyIBQcABcUGAAUcNASAFQQZ0QcAfcSACQQx0QYDgD3EgBEEHcUESdHJyIgJBgPD/AHFBgLADRg0BIAAgAUE/cSACcjYCAEEEDwtBACEDIABBADYCAAsgAwsRAEEAIABBCGogACgCEBBQGwspACAAIAE2AhAgAEGE8wI2AgAgARBQRQRAIAAgACgCACgCABEBAAsgAAspACAAIAE2AgggAEGg8gI2AgAgARBQRQRAIAAgACgCACgCABEBAAsgAAspACAAIAE2AgggAEG88QI2AgAgARBQRQRAIAAgACgCACgCABEBAAsgAAspACAAIAE2AgggAEHY8AI2AgAgARBQRQRAIAAgACgCACgCABEBAAsgAAspACAAIAE2AgggAEHw7wI2AgAgARBQRQRAIAAgACgCACgCABEBAAsgAAspACAAIAE2AgggAEGI7wI2AgAgARBQRQRAIAAgACgCACgCABEBAAsgAAspACAAIAE2AgggAEGg7gI2AgAgARBQRQRAIAAgACgCACgCABEBAAsgAAspACAAIAE2AgggAEHg7QI2AgAgARBQRQRAIAAgACgCACgCABEBAAsgAAspACAAIAE2AgggAEHY3gI2AgAgARBQRQRAIAAgACgCACgCCBEBAAsgAAsyAQF/IwBBEGsiAyQAIAAoAgAgA0EIaiABEFsiACgCACACKAIAEAogABArIANBEGokAAuRAQEEfwJAQZC2AygCACICKAK8MyIDRSABIANGcg0AIAItAMAzDQBBAA8LAkAgAigCrDMiAyACKAKwM0cNACACKALQMyIFRSABIAVGckUEQCACLQDdM0UNAQsgACAAQQhqQQEQlQNFDQAgAi0AlzYNACADQQAQ4AVFDQAgAy0A7AJBBHENACABEOUFQQEhBAsgBAtGAQF/IwBBEGsiAiQAIAJBCGogACABELQBIAAgAikDCDcCACACQQhqIABBCGogAUEIahDFBCAAIAIpAwg3AgggAkEQaiQACyIAIAAgASoCACAAKgIAkjgCACAAIAEqAgQgACoCBJI4AgQLDwAgASAAKAIAaiACOAIACw0AIAEgACgCAGoqAgALWQECfyMAQRBrIgIkAAJAQZC2AygCACIDLQCgWkUNACACIAE2AgwgAygCqFoiAQRAIAEgACACKAIMEMsHGgwBCyADQazaAGogACACKAIMEKcGCyACQRBqJAALFwAgACAALwE0EKcCIAAgASACIAMQ8wILJgEBf0GQtgMoAgAoAqwzIgAtAH9FBEBBBUEGIAAoAtwCGxDMCQsL6AUCCH8DfSMAQeAAayICJAACQBA2IgUtAH8NAEGQtgMoAgAhAyAFIAAQVSEEIAJB2ABqIABBAEEBQwAAgL8QXxDTASELIAIgBSkCyAE3A1AgAkEoaiACQdAAaiACQThqIAsgCxAqEC8gAkFAayACQdAAaiACQShqEDwhCCACQThqIAJB0ABqIAJBIGogCyACKgJYIgxDAAAAAF5BAXMEfSAKBSAMIANB6CpqKgIAkguSIAIqAlwgA0HUKmoiCSoCACIKIAqSkhAqEC8gAkEoaiACQdAAaiACQThqEDwiBiAJKgIAEJwBIAYgBEEAEFRFDQAgAkE4aiAIEN0EIAICfyACKgI4IgqLQwAAAE9dBEAgCqgMAQtBgICAgHgLskMAAAA/kjgCOCACAn8gAioCPCIKi0MAAABPXQRAIAqoDAELQYCAgIB4C7JDAAAAP5I4AjwgBiAEIAJBH2ogAkEeakEAEIoBIgcEQCAEELMBCyAGIARBARCSASAFKAL8BCACQThqIAtDAACAv5JDAAAAP5QiCkEJQQhBByACLQAfIgQbIgkgBBsgCSACLQAeG0MAAIA/EDdBEBCmAiABBEAgBSgC/AQgAkE4aiAKQwAAgD8CfyALQwAAwECVIguLQwAAAE9dBEAgC6gMAQtBgICAgHgLshAxk0ESQwAAgD8QN0EQEKYCCyADQdwqaioCAEMAAAAAXkEBc0UEQCAFKAL8BCEEIAJBIGogAkE4aiACQRBqQwAAgD9DAACAPxAqEC8gBCACQSBqIApBBkMAAIA/EDdBECADKgLcKhDIAiAFKAL8BCACQThqIApBBUMAAIA/EDdBECADKgLcKhDIAgsgAy0AoFoEQCAGQf7sAUGC7QEgARtBABDOAQsgAioCWEMAAAAAXkEBcw0AIAIgAkEIaiAIKgIIIANB6CpqKgIAkiAIKgIEIAMqAtQqkhAqKQIANwMAIAIgAEEAQQEQqQELIAJB4ABqJAAgBwslAQF/QZC2AygCACIBQew0aiAAOAIAIAEgASgC6DRBAXI2Aug0C0YBA38gASgCBCECIAFBAhDDASIDBEAgASADIAEQogEiBGwQowIgASABIAQQwwFBf2oQowILIAAgASACIAEoAgQgAmsQ7QILzAECAX8BfSMAQRBrIgYkACAGIAE4AgggBiAAOAIMIAYgAjgCBAJ/IAEgAl1BAXNFBEAgBkEIaiAGQQRqELUDQwAAgL8hByAGKgIIIQELIAEgAF5BAXNFCwRAQ6uqqr4gB5MhByAGQQxqIAZBCGoQtQMgBioCCCEBIAYqAgwhAAsgAyAHIAEgBioCBCICkyAAIAEgAiABIAJdG5MiAUMAAMBAlEMI5TwekpWSizgCACAEIAEgAEMI5TwekpU4AgAgBSAAOAIAIAZBEGokAAtMACAEQQNIIANBgICACElyRQRAIAAgASACQwAAAL+SQwAAAAAgBLIiAkMAAIC/kkPbD8lAlCAClSAEQX9qEPEBIAAgA0EBIAUQ4AELCxIAQZC2AygCAEEAOgCxNhDXAws3ACAAIAEgAiADEMoHIQIgAARAIAAgAiABQX9qIgMgAiABSBsgAyACQX9HGyICakEAOgAACyACCwsAIAAgASACEJMECyUAIAAgASoCACABKgIEECoaIABBCGogASoCCCABKgIMECoaIAALVQECf0GMtgMoAgAiASAAQQNqQXxxIgJqIQACQCACQQFOQQAgACABTRsNACAAPwBBEHRLBEAgABAbRQ0BC0GMtgMgADYCACABDwtBwMMEQTA2AgBBfwvbAQIBfwJ+QQEhBAJAIABCAFIgAUL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgAkIAUiADQv///////////wCDIgZCgICAgICAwP//AFYgBkKAgICAgIDA//8AURsNACAAIAKEIAUgBoSEUARAQQAPCyABIAODQgBZBEBBfyEEIAAgAlQgASADUyABIANRGw0BIAAgAoUgASADhYRCAFIPC0F/IQQgACACViAB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IAAgATYCDCACIAFB7NkCEEMgAyACEN8BEMIFIAIQKyACIAMQmgEgAygCABB5IAJBCGogAhCdDSIBIAAoAgwQmAIgARArIAJBEGokACAACz4BAn8jAEEQayIBJAAgACgCDCECIAFBCGogABCaASAAKAIAEHkgAigCACABQQhqEOsMIAAQwQUgAUEQaiQAC2IBAn8jAEEQayICJAAgABCZAiEDIAAgATYCDCACIAFB7NkCEEMgAyACEN8BEMIFIAIQKyACIAMQmgEgAygCABB5IAJBCGogAhCeDSIBIAAoAgwQmAIgARArIAJBEGokACAACz4BAn8jAEEQayIBJAAgACgCDCECIAFBCGogABCaASAAKAIAEHkgAigCACABQQhqEO4MIAAQwQUgAUEQaiQAC2IBAn8jAEEQayICJAAgABCZAiEDIAAgATYCDCACIAFB7NkCEEMgAyACEN8BEMIFIAIQKyACIAMQmgEgAygCABB5IAJBCGogAhCfDSIBIAAoAgwQmAIgARArIAJBEGokACAACz4BAn8jAEEQayIBJAAgACgCDCECIAFBCGogABCxASAAKAIAEHkgAigCACABQQhqEIANIAAQ9QcgAUEQaiQAC2IBAn8jAEEQayICJAAgABCZAiEDIAAgATYCDCACIAFB7NkCEEMgAyACEN8BEPYHIAIQKyACIAMQsQEgAygCABB5IAJBCGogAhChDSIBIAAoAgwQmAIgARArIAJBEGokACAACz4BAn8jAEEQayIBJAAgACgCDCECIAFBCGogABCxASAAKAIAEHkgAigCACABQQhqEIQNIAAQ9QcgAUEQaiQAC2IBAn8jAEEQayICJAAgABCZAiEDIAAgATYCDCACIAFB7NkCEEMgAyACEN8BEPYHIAIQKyACIAMQsQEgAygCABB5IAJBCGogAhCiDSIBIAAoAgwQmAIgARArIAJBEGokACAACz4BAn8jAEEQayIBJAAgACgCDCECIAFBCGogABCbASAAKAIAEHkgAigCACABQQhqEJQNIAAQ1AUgAUEQaiQAC2IBAn8jAEEQayICJAAgABCZAiEDIAAgATYCDCACIAFB7NkCEEMgAyACEN8BENUFIAIQKyACIAMQmwEgAygCABB5IAJBCGogAhCyBCIBIAAoAgwQmAIgARArIAJBEGokACAACz4BAn8jAEEQayIB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/////////wCDIgVCgICAgICAwP9DfCAFQoCAgICAgMCAvH98VARAIAFCBIYgAEI8iIQhBCAAQv//////////D4MiAEKBgICAgICAgAhaBEAgBEKBgICAgICAgMAAfCEEDAILIARCgICAgICAgIBAfSEEIABCgICAgICAgIAIhUIAUg0BIARCAYMgBHwhBAwBCyAAUCAFQoCAgICAgMD//wBUIAVCgICAgICAwP//AFEbRQRAIAFCBIYgAEI8iIRC/////////wODQoCAgICAgID8/wCEIQQMAQtCgICAgICAgPj/ACEEIAVC////////v//DAFYNAEIAIQQgBUIwiKciA0GR9wBJDQAgAkEQaiAAIAFC////////P4NCgICAgICAwACEIgQgA0H/iH9qEJcBIAIgACAEQYH4ACADaxCEAyACKQMIQgSGIAIpAwAiAEI8iIQhBCACKQMQIAIpAxiEQgBSrSAAQv//////////D4OEIgBCgYCAgICAgIAIWgRAIARCAXwhBAwBCyAAQoCAgICAgICACIVCAFINACAEQgGDIAR8IQQLIAJBIGokACAEIAFCgICAgICAgICAf4OEvwtBAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRCmASAAIAUpAwA3AwAgACAFKQMINwMIIAVBEGokAAu5AQEGfyMAQfABayIGJAAgBiAANgIAQQEhBwJAIANBAkgNAEEAIAFrIQkgACEFA0AgACAFIAlqIgUgBCADQX5qIgpBAnRqKAIAayIIIAIRAgBBAE4EQCAAIAUgAhECAEF/Sg0CCyAGIAdBAnRqIAggBSAIIAUgAhECAEF/SiIAGyIFNgIAIAdBAWohByADQX9qIAogABsiA0ECSA0BIAYoAgAhAAwACwALIAEgBiAHEMIHIAZB8AFqJAALrhECD38BfiMAQdAAayIHJAAgByABNgJMIAdBN2ohFSAHQThqIRNBACEBAkADQAJAIBBBAEgNACABQf////8HIBBrSgRAQcDDBEE9NgIAQX8hEAwBCyABIBBqIRALIAcoAkwiDCEBAkACQAJAIAwtAAAiCARAA0ACQAJAIAhB/wFxIghFBEAgASEIDAELIAhBJUcNASABIQgDQCABLQABQSVHDQEgByABQQJqIgo2AkwgCEEBaiEIIAEtAAIhCyAKIQEg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FCEFCyAFIAAgARA+GiACIAIoAhQgAWo2AhQgASADaiEECyAECz4BAn9BkLYDKAIAIgFB+DJqIQIgASgC+DIhAQNAIAFBAUgEQEF/DwsgAiABQX9qIgEQSCgCACAARw0ACyABC5UGAgR/A34jAEGAAWsiBSQAAkACQAJAIAMgBEIAQgAQzgJFDQAgAyAEEJkLIQcgAkIwiKciCEH//wFxIgZB//8BRg0AIAcNAQsgBUEQaiABIAIgAyAEEFogBSAFKQMQIgEgBSkDGCICIAEgAhC/ByAFKQMIIQIgBSkDACEEDAELIAEgAkL///////8/gyAGrUIwhoQiCiADIARC////////P4MgBEIwiKdB//8BcSIHrUIwhoQiCRDOAkEATARAIAEgCiADIAkQzgIEQCABIQQMAgsgBUHwAGogASACQgBCABBaIAUpA3ghAiAFKQNwIQQMAQsgBgR+IAEFIAVB4ABqIAEgCkIAQoCAgICAgMC7wAAQWiAFKQNoIgpCMIinQYh/aiEGIAUpA2ALIQQgB0UEQCAFQdAAaiADIAlCAEKAgICAgIDAu8AAEFogBSkDWCIJQjCIp0GIf2ohByAFKQNQIQMLIAlC////////P4NCgICAgICAwACEIQkgCkL///////8/g0KAgICAgIDAAIQhCiAGIAdKBEADQAJ+IAogCX0gBCADVK19IgtCAFkEQCALIAQgA30iBIRQBEAgBUEgaiABIAJCAEIAEFogBSkDKCECIAUpAyAhBAwFCyALQgGGIARCP4iEDAELIApCAYYgBEI/iIQLIQogBEIBhiEEIAZBf2oiBiAHSg0ACyAHIQYLAkAgCiAJfSAEIANUrX0iCUIAUwRAIAohCQwBCyAJIAQgA30iBIRCAFINACAFQTBqIAEgAkIAQgAQWiAFKQM4IQIgBSkDMCEEDAELIAlC////////P1gEQANAIARCP4ghASAGQX9qIQYgBEIBhiEEIAEgCUIBhoQiCUKAgICAgIDAAFQNAAsLIAhBgIACcSEHIAZBAEwEQCAFQUBrIAQgCUL///////8/gyAGQfgAaiAHcq1CMIaEQgBCgICAgICAwMM/EFogBSkDSCECIAUpA0AhBAwBCyAJQv///////z+DIAYgB3KtQjCGhCECCyAAIAQ3AwAgACACNwMIIAVBgAFqJAALxAMBBn8CQCAB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IANBAnRB0M4EaiECAkACQEGkzAQoAgAiBEEBIAN0IgdxRQRAQaTMBCAEIAdyNgIAIAIgADYCACAAIAI2AhgMAQsgAUEAQRkgA0EBdmsgA0EfRht0IQMgAigCACECA0AgAiIEKAIEQXhxIAFGDQIgA0EddiECIANBAXQhAyAEIAJBBHFqIgdBEGooAgAiAg0ACyAHIAA2AhAgACAENgIYCyAAIAA2AgwgACAANgIIDwsgBCgCCCIBIAA2AgwgBCAANgIIIABBADYCGCAAIAQ2AgwgACABNgIICwuEAQECfyAARQRAIAEQ+QEPCyABQUBPBEBBwMMEQTA2AgBBAA8LIABBeGpBECABQQtqQXhxIAFBC0kbEJsLIgIEQCACQQhqDwsgARD5ASICRQRAQQAPCyACIABBfEF4IABBfGooAgAiA0EDcRsgA0F4cWoiAyABIAMgAUkbED4aIAAQTSACC0oAAkAgAUUNACABQeyuAxDHASIBRQ0AIAEoAgggACgCCEF/c3ENACAAKAIMIAEoAgxBABBzRQ0AIAAoAhAgASgCEEEAEHMPC0EAC1IBAX8gACgCBCEEIAAoAgAiACABAn9BACACRQ0AGiAEQQh1IgEgBEEBcUUNABogAigCACABaigCAAsgAmogA0ECIARBAnEbIAAoAgAoAhwRCAALIwAgAEEANgIMIAAgATYCBCAAIAE2AgAgACABQQFqNgIIIAALGwEBf0EKIQEgABDeAgR/IAAQ3QVBf2oFIAELC3gBA38jAEEQayIDJABBbyACTwRAAkAgAkEKTQRAIAAgAhC1BCAAIQQMAQsgACACEKwFQQFqIgUQpwUiBBCrBSAAIAUQqgUgACACEI8ECyAEIAEgAhCOBCADQQA6AA8gAiAEaiADQQ9qELQEIANBEGokAA8LEK0FAAuIEQIFfwx+IwBBwAFrIgUkACAEQv///////z+DIRIgAkL///////8/gyELIAIgBIVCgICAgICAgICAf4MhESAEQjCIp0H//wFxIQcCQAJAAkAgAkIwiKdB//8BcSIJQX9qQf3/AU0EQCAHQX9qQf7/AUkNAQsgAVAgAkL///////////8AgyIMQoCAgICAgMD//wBUIAxCgICAgICAwP//AFEbRQRAIAJCgICAgICAIIQhEQwCCyADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURtFBEAgBEKAgICAgIAghCERIAMhAQwCCyABIAxCgICAgICAwP//AIWEUARAIAMgAkKAgICAgIDA//8AhYRQBEBCACEBQoCAgICAgOD//wAhEQwDCyARQoCAgICAgMD//wCEIRFCACEBDAILIAMgAkKAgICAgIDA//8AhYRQBEBCACEBDAILIAEgDIRQDQIgAiADhFAEQCARQoCAgICAgMD//wCEIRFCACEBDAILIAxC////////P1gEQCAFQbABaiABIAsgASALIAtQIgYbeSAGQQZ0rXynIgZBcWoQlwFBECAGayEGIAUpA7gBIQsgBSkDsAEhAQsgAkL///////8/Vg0AIAVBoAFqIAMgEiADIBIgElAiCBt5IAhBBnStfKciCEFxahCXASAGIAhqQXBqIQYgBSkDqAEhEiAFKQOgASEDCyAFQZABaiASQoCAgICAgMAAhCIUQg+GIANCMYiEIgJChMn5zr/mvIL1ACACfSIEENUBIAVBgAFqQgAgBSkDmAF9IAQQ1QEgBUHwAGogBSkDiAFCAYYgBSkDgAFCP4iEIgQgAhDVASAFQeAAaiAEQgAgBSkDeH0Q1QEgBUHQAGogBSkDaEIBhiAFKQNgQj+IhCIEIAIQ1QEgBUFAayAEQgAgBSkDWH0Q1QEgBUEwaiAFKQNIQgGGIAUpA0BCP4iEIgQgAhDVASAFQSBqIARCACAFKQM4fRDVASAFQRBqIAUpAyhCAYYgBSkDIEI/iIQiBCACENUBIAUgBEIAIAUpAxh9ENUBIAYgCSAHa2ohBgJ+QgAgBSkDCEIBhiAFKQMAQj+IhEJ/fCIMQv////8PgyIEIAJCIIgiCn4iDSAMQiCIIgwgAkL/////D4MiEH58IgJCIIggAiANVK1CIIaEIAogDH58IAJCIIYiCiAEIBB+fCICIApUrXwgAiAEIANCEYhC/////w+DIg1+IhAgDCADQg+GQoCA/v8PgyIOfnwiCkIghiIPIAQgDn58IA9UrSAMIA1+IAogEFStQiCGIApCIIiEfHx8IgogAlStfCAKQgBSrXx9IgJC/////w+DIg0gBH4iECAMIA1+Ig4gBCACQiCIIg9+fCICQiCGfCINIBBUrSAMIA9+IAIgDlStQiCGIAJCIIiEfHwgDUIAIAp9IgJCIIgiCiAEfiIQIAJC/////w+DIg4gDH58IgJCIIYiDyAEIA5+fCAPVK0gCiAMfiACIBBUrUIghiACQiCIhHx8fCICIA1UrXwgAkJ+fCIQIAJUrXxCf3wiCkL/////D4MiAiALQgKGIAFCPoiEQv////8PgyIEfiINIAFCHohC/////w+DIgwgCkIgiCIKfnwiDiANVK0gDiAQQiCIIg0gC0IeiEL//+//D4NCgIAQhCILfnwiDyAOVK18IAogC358IAIgC34iEyAEIAp+fCIOIBNUrUIghiAOQiCIhHwgDyAOQiCGfCIOIA9UrXwgDiAMIA1+IhMgEEL/////D4MiECAEfnwiDyATVK0gDyACIAFCAoZC/P///w+DIhN+fCIVIA9UrXx8Ig8gDlStfCAPIAogE34iCiALIBB+fCILIAQgDX58IgQgAiAMfnwiAkIgiCACIARUrSALIApUrSAEIAtUrXx8QiCGhHwiCyAPVK18IAsgFSANIBN+IgQgDCAQfnwiDEIgiCAMIARUrUIghoR8IgQgFVStIAQgAkIghnwgBFStfHwiBCALVK18IgJC/////////wBYBEAgAUIxhiAEQv////8PgyIBIANC/////w+DIgx+IgtCAFKtfUIAIAt9IhAgBEIgiCILIAx+Ig4gASADQiCIIgp+fCINQiCGIg9UrX0gAkL/////D4MgDH4gASASQv////8Pg358IAogC358IA0gDlStQiCGIA1CIIiEfCAEIBRCIIh+IAMgAkIgiH58IAIgCn58IAsgEn58QiCGfH0hEiAGQX9qIQYgECAPfQwBCyAEQiGIIQogAUIwhiACQj+GIARCAYiEIgRC/////w+DIgEgA0L/////D4MiDH4iC0IAUq19QgAgC30iDSABIANCIIgiC34iECAKIAJCH4aEIg5C/////w+DIg8gDH58IgpCIIYiE1StfSAEIBRCIIh+IAMgAkIhiH58IAJCAYgiAiALfnwgDiASfnxCIIYgCyAPfiACQv////8PgyAMfnwgASASQv////8Pg358IAogEFStQiCGIApCIIiEfHx9IRIgDSATfQshASAGQYCAAU4EQCARQoCAgICAgMD//wCEIRFCACEBDAELIAZB//8AaiEHIAZBgYB/TARAAkAgBw0AIAQgAUIBhiADViASQgGGIAFCP4iEIgEgFFYgASAUURutfCIBIARUrSACQv///////z+DfCICQoCAgICAgMAAg1ANACACIBGEIREMAgtCACEBDAELIAQgAUIBhiADWiASQgGGIAFCP4iEIgEgFFogASAUURutfCIBIARUrSACQv///////z+DIAetQjCGhHwgEYQhEQsgACABNwMAIAAgETcDCCAFQcABaiQADwsgAEIANwMAIABCgICAgICA4P//ACARIAIgA4RQGzcDCCAFQcABaiQAC8cBAgF/An5BfyEDAkAgAEIAUiABQv///////////wCDIgRCgICAgICAwP//AFYgBEKAgICAgIDA//8AURsNAEEAIAJC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAAgBCAFhIRQBEBBAA8LIAEgAoNCAFkEQCAAQgBUIAEgAlMgASACURsNASAAIAEgAoWEQgBSDwsgAEIAViABIAJVIAEgAlEbDQAgACABIAKFhEIAUiEDCyADCy4CAX8BfCMAQRBrIgEkACABIAAQvgsgASkDACABKQMIEK4FIQIgAUEQaiQAIAILpAEBBX8jAEGAAmsiBCQAAkAgAkECSA0AIAEgAkECdGoiByAENgIAIABFDQAgBCEDA0AgAyABKAIAIABBgAIgAEGAAkkbIgUQPhpBACEDA0AgASADQQJ0aiIGKAIAIAEgA0EBaiIDQQJ0aigCACAFED4aIAYgBigCACAFajYCACACIANHDQALIAAgBWsiAEUNASAHKAIAIQMMAAsACyAEQYACaiQACyYBAX8gACgCAEF/amgiAUUEQCAAKAIEaCIAQSBqQQAgABsPCyABC3wBAn8gACAALQBKIgFBf2ogAXI6AEogACgCFCAAKAIcSwRAIABBAEEAIAAoAiQRBQAaCyAAQQA2AhwgAEIANwMQIAAoAgAiAUEEcQRAIAAgAUEgcjYCAEF/DwsgACAAKAIsIAAoAjBqIgI2AgggACACNgIEIAFBG3RBH3ULQwACQCAARQ0AAkACQAJAAkAgAUECag4GAAECAgQDBAsgACACPAAADwsgACACPQEADwsgACACPgIADwsgACACNwMACwv4AwIDfwF+AkACQAJAAn8gACgCBCICIAAoAmhJBEAgACACQQFqNgIEIAItAAAMAQsgABBRCyIDQVVqDgMBAAEACyADQVBqIQEMAQsgA0EtRiEEAkAgAUUCfyAAKAIEIgIgACgCaEkEQCAAIAJBAWo2AgQgAi0AAAwBCyAAEFELIgJBUGoiAUEKSXINACAAKAJoRQ0AIAAgACgCBEF/ajYCBAsgAiEDCwJAIAFBCkkEQEEAIQEDQCADIAFBCmxqIQECfyAAKAIEIgIgACgCaEkEQCAAIAJBAWo2AgQgAi0AAAwBCyAAEFELIgNBUGoiAkEJTUEAIAFBUGoiAUHMmbPmAEgbDQALIAGsIQUCQCACQQpPDQADQCADrSAFQgp+fEJQfCEFAn8gACgCBCIBIAAoAmhJBEAgACABQQFqNgIEIAEtAAAMAQsgABBRCyIDQVBqIgJBCUsNASAFQq6PhdfHwuujAVMNAAsLIAJBCkkEQANAAn8gACgCBCIBIAAoAmhJBEAgACABQQFqNgIEIAEtAAAMAQsgABBRC0FQakEKSQ0ACwsgACgCaARAIAAgACgCBEF/ajYCBAtCACAFfSAFIAQbIQUMAQtCgICAgICAgICAfyEFIAAoAmhFDQAgACAAKAIEQX9qNgIEQoCAgICAgICAgH8PCyAFC+8HAgV/An4jAEEwayIFJAACQCACQQJNBEAgAkECdCICQYymA2ooAgAhByACQYCmA2ooAgAhCANAAn8gASgCBCICIAEoAmhJBEAgASACQQFqNgIEIAItAAAMAQsgARBRCyICEIYDDQALQQEhBgJAAkAgAkFVag4DAAEAAQtBf0EBIAJBLUYbIQYgASgCBCICIAEoAmhJBEAgASACQQFqNgIEIAItAAAhAgwBCyABEFEhAgsCQAJAA0AgBEG4pQNqLAAAIAJBIHJGBEACQCAEQQZLDQAgASgCBCICIAEoAmhJBEAgASACQQFqNgIEIAItAAAhAgwBCyABEFEhAgsgBEEBaiIEQQhHDQEMAgsLIARBA0cEQCAEQQhGDQEgA0UgBEEESXINAiAEQQhGDQELIAEoAmgiAgRAIAEgASgCBEF/ajYCBAsgA0UgBEEESXINAANAIAIEQCABIAEoAgRBf2o2AgQLIARBf2oiBEEDSw0ACwsgBSAGskMAAIB/lBC1CyAFKQMIIQkgBSkDACEKDAILAkACQAJAIAQNAEEAIQQDQCAEQcGlA2osAAAgAkEgckcNAQJAIARBAUsNACABKAIEIgIgASgCaEkEQCABIAJBAWo2AgQgAi0AACECDAELIAEQUSECCyAEQQFqIgRBA0cNAAsMAQsCQAJAIAQOBAABAQIBCwJAIAJBMEcNAAJ/IAEoAgQiBCABKAJoSQRAIAEgBEEBajYCBCAELQAADAELIAEQUQtBX3FB2ABGBEAgBUEQaiABIAggByAGIAMQ0AsgBSkDGCEJIAUpAxAhCgwGCyABKAJoRQ0AIAEgASgCBEF/ajYCBAsgBUEgaiABIAIgCCAHIAYgAxDOCyAFKQMoIQkgBSkDICEKDAQLIAEoAmgEQCABIAEoAgRBf2o2AgQLDAELAkACfyABKAIEIgIgASgCaEkEQCABIAJBAWo2AgQgAi0AAAwBCyABEFELQShGBEBBASEEDAELQoCAgICAgOD//wAhCSABKAJoRQ0DIAEgASgCBEF/ajYCBAwDCwNAAn8gASgCBCICIAEoAmhJBEAgASACQQFqNgIEIAItAAAMAQsgARBRCyICQVBqQQpJIAJBv39qQRpJciACQd8ARnJFQQAgAkGff2pBGk8bRQRAIARBAWohBAwBCwtCgICAgICA4P//ACEJIAJBKUYNAiABKAJoIgIEQCABIAEoAgRBf2o2AgQLIAMEQCAERQ0DA0AgBEF/aiEEIAIEQCABIAEoAgRBf2o2AgQLIAQNAAsMAwsLQcDDBEEcNgIAIAFCABDWAQtCACEJCyAAIAo3AwAgACAJNwMIIAVBMGokAAu/AgEBfyMAQdAAayIEJAACQCADQYCAAU4EQCAEQSBqIAEgAkIAQoCAgICAgID//wAQWiAEKQMoIQIgBCkDICEBIANB//8BSARAIANBgYB/aiEDDAILIARBEGogASACQgBCgICAgICAgP//ABBaIANB/f8CIANB/f8CSBtBgoB+aiEDIAQpAxghAiAEKQMQIQEMAQsgA0GBgH9KDQAgBEFAayABIAJCAEKAgICAgIDAABBaIAQpA0ghAiAEKQNAIQEgA0GDgH5KBEAgA0H+/wBqIQMMAQsgBEEwaiABIAJCAEKAgICAgIDAABBaIANBhoB9IANBhoB9ShtB/P8BaiEDIAQpAzghAiAEKQMwIQELIAQgASACQgAgA0H//wBqrUIwhhBaIAAgBCkDCDcDCCAAIAQpAwA3AwAgBEHQAGokAAs1ACAAIAE3AwAgACACQv///////z+DIARCMIinQYCAAnEgAkIwiKdB//8BcXKtQjCGhDcDCAu6AQECfyMAQaABayIEJAAgBEEIakGopANBkAEQPhoCQAJAIAFBf2pB/////wdPBEAgAQ0BQQEhASAEQZ8BaiEACyAEIAA2AjQgBCAANgIcIARBfiAAayIFIAEgASAFSxsiATYCOCAEIAAgAWoiADYCJCAEIAA2AhggBEEIaiACIAMQywchACABRQ0BIAQoAhwiASABIAQoAhhGa0EAOgAADAELQcDDBEE9NgIAQX8hAAsgBEGgAWokACAACxEAIAAgASACQf0GQf4GEM4HC7sCAAJAIAFBFEsNAAJAAkACQAJAAkACQAJAAkACQAJAIAFBd2oOCgABAgMEBQYHCAkKCyACIAIoAgAiAUEEajYCACAAIAEoAgA2AgAPCyACIAIoAgAiAUEEajYCACAAIAE0AgA3AwAPCyACIAIoAgAiAUEEajYCACAAIAE1AgA3AwAPCyACIAIoAgBBB2pBeHEiAUEIajYCACAAIAEpAwA3AwAPCyACIAIoAgAiAUEEajYCACAAIAEyAQA3AwAPCyACIAIoAgAiAUEEajYCACAAIAEzAQA3AwAPCyACIAIoAgAiAUEEajYCACAAIAEwAAA3AwAPCyACIAIoAgAiAUEEajYCACAAIAExAAA3AwAPCyACIAIoAgBBB2pBeHEiAUEIajYCACAAIAErAwA5AwAPCyAAIAIgAxEAAAsLRAEDfyAAKAIALAAAEK8CBEADQCAAKAIAIgIsAAAhAyAAIAJBAWo2AgAgAyABQQpsakFQaiEBIAIsAAEQrwINAAsLIAEL+wIBA38jAEHQAWsiBSQAIAUgAjYCzAFBACECIAVBoAFqQQBBKBBPGiAFIAUoAswBNgLIAQJAQQAgASAFQcgBaiAFQdAAaiAFQaABaiADIAQQsQVBAEgEQEF/IQEMAQsgACgCTEEATgRAQQEhAgsgACgCACEGIAAsAEpBAEwEQCAAIAZBX3E2AgALIAZBIHEhBwJ/IAAoAjAEQCAAIAEgBUHIAWogBUHQAGogBUGgAWogAyAEELEFDAELIABB0AA2AjAgACAFQdAAajYCECAAIAU2AhwgACAFNgIUIAAoAiwhBiAAIAU2AiwgACABIAVByAFqIAVB0ABqIAVBoAFqIAMgBBCxBSIBIAZFDQAaIABBAEEAIAAoAiQRBQAaIABBADYCMCAAIAY2AiwgAEEANgIcIABBADYCECAAKAIUIQMgAEEANgIUIAFBfyADGwshASAAIAAoAgAiACAHcjYCAEF/IAEgAEEgcRshASACRQ0ACyAFQdABaiQAIAELfwIBfwF+IAC9IgNCNIinQf8PcSICQf8PRwR8IAJFBEAgASAARAAAAAAAAAAAYQR/QQAFIABEAAAAAAAA8EOiIAEQzwchACABKAIAQUBqCzYCACAADwsgASACQYJ4ajYCACADQv////////+HgH+DQoCAgICAgIDwP4S/BSAACwsSACAARQRAQQAPCyAAIAEQ1gsLYAICfwF+IAAoAighAUEBIQIgAEIAIAAtAABBgAFxBH9BAkEBIAAoAhQgACgCHEsbBSACCyABESMAIgNCAFkEfiAAKAIUIAAoAhxrrCADIAAoAgggACgCBGusfXwFIAMLCyAAAn8gACgCTEF/TARAIAAgARDTBwwBCyAAIAEQ0wcLC38BAX4gAUEBRgRAQgAgACgCCCAAKAIEa6x9IQILAkAgACgCFCAAKAIcSwRAIABBAEEAIAAoAiQRBQAaIAAoAhRFDQELIABBADYCHCAAQgA3AxAgACACIAEgACgCKBEjAEIAUw0AIABCADcCBCAAIAAoAgBBb3E2AgBBAA8LQX8LTwECf0GQtgMoAgAiAiAANgKMNiACKAK0NSEBAkAgAA0AIAIgARCKBCIBNgK0NSABKAKMBiIARQ0AIABBACABQZQGahC+BA8LIAFBARCJBAuCAgIDfwF8IwBBEGsiAyQAAkAgALwiBEH/////B3EiAkHan6TuBE0EQCABIAC7IgUgBUSDyMltMF/kP6JEAAAAAAAAOEOgRAAAAAAAADjDoCIFRAAAAFD7Ifm/oqAgBURjYhphtBBRvqKgOQMAIAWZRAAAAAAAAOBBYwRAIAWqIQIMAgtBgICAgHghAgwBCyACQYCAgPwHTwRAIAEgACAAk7s5AwBBACECDAELIAMgAiACQRd2Qep+aiICQRd0a767OQMIIANBCGogAyACENsLIQIgAysDACEFIARBf0wEQCABIAWaOQMAQQAgAmshAgwBCyABIAU5AwALIANBEGokACACCxMAIAAoAgggACgCAEEkbGpBXGoL7wICA38DfSAAvCICQf////8HcSIBQYCAgOQESQRAAkACfyABQf////YDTQRA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AEG8CGohAiAAQZQIaiEBA0AgARA0QQhqIgEgAkcNAAsgAEGAKmoQRBpBACECIABBAEGQKhBPIQEgA0EIakMAAIC/QwAAgL8QKhogBCADKQMINwMAIAFCmrPm9IOAgODAADcDICABQYoINgIcIAFBgAg2AhggAUKJkaLkg4CA0MAANwMQIAFBLGpB/wFB1AAQTxogAUEANgKYASABQYCAgPwDNgKQASABQgA3A4gBIAFCgICA9NOZs6Y9NwOAASABQQA6AJQBIANBCGpDAACAP0MAAIA/ECoaIAUgAykDCDcCACABQgA3AqwBIAFBADoAqAEgAUGAgIQINgKkASABQgA3ArQBIAFBADYCvAEgAUEANgLQASABQQE2AswBIAFBADYCyAEgAUECNgLEASABQQM2AsABIANBCGpD//9//0P//3//ECoaIAYgAykDCDcDACADQQhqQ///f/9D//9//xAqGiAHIAMpAwg3AgAgAUGAgICGBDYCKEEAIQADQCABIABBAnRqIgRBgICA/Hs2AuwHIARBgAhqQYCAgPx7NgIAIABBAWoiAEEFRw0ACwNAIAEgAkECdGoiAEHQCGpBgICA/Hs2AgAgAEHQGGpBgICA/Hs2AgAgAkEBaiICQYAERw0AC0EAIQIDQCABIAJBAnRqQdAoakGAgID8ezYCACACQQFqIgJBFkcNAAsgA0EQaiQAC/MPAgZ/A30jAEEwayIEJAACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkADQCACQYCACHEhBQNAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCACQYCAfGoODgMEDAsVFhESDRABAgYIAAsCQCACQYCAdGoODgUKDAsXGBMUDRAAAAcJAAtBACACIAJB//8DShsiAkEBSA0gIAQgAjsBGCACQQpGBEAgAS0AEA0hCwJAIAEtAAxFDQAgASgCBCABKAIIRw0AIAEoAgAiAiAAKAIETg0AIAAhAyABQRhqIAJBAUEBEPYFIgUEQCAFIAMgAhDoATsBAAsgACABKAIAQQEQ4gMgACABKAIAIARBGGpBARCnA0UNISABQQA6AA8gASABKAIAQQFqNgIADCELIAAgARCmAyAAIAEoAgAgBEEYakEBEKcDRQ0gIAEgASgCAEEBEJIGIAFBADoADyABIAEoAgBBAWo2AgAMIAsgACABEJUJIAFBADoADwwfCyAAIAEQlAkgAUEAOgAPDB4LAkAgASgCBCABKAIIRwRAIAEQpQMMAQsgASgCACIAQQFIDQAgASAAQX9qNgIACyABQQA6AA8MHQsCQCABKAIEIAEoAghHBEAgACABEMwEDAELIAEgASgCAEEBajYCAAsgACABEH4gAUEAOgAPDBwLIAAgARB+IAEQ6QEgASgCCCIAQQFOBEAgASAAQX9qIgA2AggLIAFBADoADyABIAA2AgAMGwsgASgCBCABKAIIRwRAIAEQpQMMGwsgASAAIAEoAgAQkQY2AgAgACABEH4MGgsgASgCBCABKAIIRgRAIAEQ6QELIAEgACABKAIAEJEGIgI2AgggASACNgIAIAAgARB+DBkLIAEoAgQgASgCCEcEQCAAIAEQzAQMGQsgASAAIAEoAgAQkAY2AgAgACABEH4MGAsgASgCBCABKAIIRgRAIAEQ6QELIAEgACABKAIAEJAGIgI2AgggASACNgIAIAAgARB+DBcLIAEQ6QEgASABKAIIQQFqNgIIIAAgARB+IAFBADoADyABIAEoAgg2AgAMFgsgAS0AECIHBEAgBUGBgARyIQIMBAsCQCAFBEAgARDpAQwBCyABKAIEIAEoAghGDQAgACABEMwECyAAIAEQfiAEQRhqIAAgASgCACABLQAQEI4GIAQoAigiA0UNFQJ9IAEtAA8EQCABKgIUDAELIAQqAhgLIQkgASAEKAIkIANqIgY2AgAgBCAAIAYQigICQCAEKAIUIghBAUgNAEEAIQMgBCoCACEKA0AgACAGIAMQ4QMiC0MAAIC/Ww0BIAogC5IiCiAJXg0BIAEgASgCAEEBajYCACADQQFqIgMgCEcNAAsLIAAgARB+IAEgCTgCFCABQQE6AA8gBQRAIAEgASgCADYCCAsgBw0CDBULIAEtABAiBwRAIAVBgIAEciECDAMLAkAgBQRAIAEQ6QEMAQsgASgCBCABKAIIRg0AIAEQpQMLIAAgARB+IARBGGogACABKAIAIAEtABAQjgYgBCgCLCIGIAQoAiRGDRQCfSABLQAPBEAgASoCFAwBCyAEKgIYCyEJIAEgBjYCACAEIAAgBhCKAgJAIAQoAhQiCEEBSA0AQQAhAyAEKgIAIQoDQCAAIAYgAxDhAyILQwAAgL9bDQEgCiALkiIKIAleDQEgASABKAIAQQFqNgIAIANBAWoiAyAIRw0ACwsgACABEH4gASAJOAIUIAFBAToADyAFBEAgASABKAIANgIICyAHDQEMFAsLCwJAIAEoAgQgASgCCEcEQCAAIAEQpgMMAQsgASgCACICIAAoAgRODQAgACABIAJBARDgAwsgAUEAOgAPDBELAkAgASgCBCABKAIIRwRAIAAgARCmAwwBCyAAIAEQfiABKAIAIgJBAUgNACAAIAEgAkF/akEBEOADIAEgASgCAEF/ajYCAAsgAUEAOgAPDBALIAFBADYCCCABQQA6AA8gAUIANwIADA8LIAEgACgCBDYCACABQQA6AA8gAUIANwIEDA4LIAEQ6QEgAUEAOgAPIAFBADYCACABQQA2AggMDQsgARDpASAAKAIEIQAgAUEAOgAPIAEgADYCACABIAA2AggMDAsgACABEH4gARClAyABLQAQDQMgASgCACIDQQBMDQoDQCAAIANBf2oQ6AFBCkYNCyABIAEoAgAiAkF/aiIDNgIAIAJBAUoNAAsMCgsgACgCBCECIAAgARB+IAEQpQMgAS0AEA0DIAEoAgAiAyACTg0IA0AgACADEOgBQQpGDQkgASABKAIAQQFqIgM2AgAgAyACSA0ACwwICyAAIAEQfiABEOkBIAEtABANAyABKAIAIgJBAEwNBgNAIAAgAkF/ahDoASECIAEoAgAhAyACQQpGBEAgAyECDAgLIAEgA0F/aiICNgIAIANBAUoNAAsMBgsgACgCBCECIAAgARB+IAEQ6QEgAS0AEA0DIAEoAgAiAyACTg0EA0AgACADEOgBIQUgASgCACEDIAVBCkYNBSABIANBAWoiAzYCACADIAJIDQALDAQLIAFBADYCAAwGCyABIAI2AgAMBAtBACECIAFBADYCAAwCCyABIAI2AgAgAiEDCyABQQA6AA8gASADNgIIDAMLIAFBADoADyABIAI2AggMAgsgAUEAOgAPDAELIAFBADoADwsgBEEwaiQAC10BAX8jAEEQayIGJAAgBiADOQMAIAYgAjkDCCAAQQkgASAGQQhqQQAgAkQAAAAAAAAAAGQbIAZBACADRAAAAAAAAAAAZBsgBCAFQYCACHIQ4wMhACAGQRBqJAAgAAtZAQF/IwBBEGsiBSQAIAUgAzYCCCAFIAI2AgwgAEEEIAEgBUEM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ACABQoCAgICAgICAgH+EIABVG0UEQEL///////////8AIAAgAX0iAiABQv///////////wB8IABTGyACIAFCAFMbDwtCgICAgICAgICAfwtZAQF+IAFCf1dBAEKAgICAgICAgIB/IAF9IABVG0UEQEL///////////8AIAAgAXwiAkL///////////8AIAF9IABTGyACIAFCAFUbDwtCgICAgICAgICAfwtFAQF/IAFBAU5BACABQYCAgIB4ciAAShtFBEBB/////wcgACABayICIAFB/////wdqIABIGyACIAFBAEgbDwtBgICAgHgLRQEBfyABQX9MQQBBgICAgHggAWsgAEobRQRAQf////8HIAAgAWoiAkH/////ByABayAASBsgAiABQQBKGw8LQYCAgIB4CyIBAX9BfyAAIAFqIgIgAUH//wNzIABJGyACIAEbQf//A3ELTgEBfwJAAkAgAUEBTgRAQYCAAiECIAFBgIB+aiAATA0BDAILIAFBf0oNAEH//wEhAiABQf//AWogAEgNAQsgACABayECCyACQRB0QRB1C0wBAX8CQAJAIAFBf0wEQEGAgAIhAkGAgH4gAWsgAEwNAQwCCyABRQ0AQf//ASECQf//ASABayAASA0BCyAAIAFqIQILIAJBEHRBEHULIAEBf0F/IAAgAWoiAiABQf8BcyAASRsgAiABG0H/AXELSgEBfwJAAkAgAUEBTgRAQYABIQIgAUGAf2ogAEwNAQwCCyABQX9KDQBB/wAhAiABQf8AaiAASA0BCyAAIAFrIQILIAJBGHRBGHULSAEBfwJAAkAgAUF/TARAQYABIQJBgH8gAWsgAEwNAQwCCyABRQ0AQf8AIQJB/wAgAWsgAEgNAQsgACABaiECCyACQRh0QRh1CxkAIAIEQCACIAAgAUECdGooAgA2AgALQQELBQAQugELPgIBfwF9An8gASoCBCAAKgIEkyIDi0MAAABPXQRAIAOoDAELQYCAgIB4CyICBH8gAgUgASgCACAAKAIAawsL6QECA38DfQJAIAFBAkgiAw0AIAAgAUEIQQwQ0gIgAyACQwAAAABeQQFzcg0AQQEhAwNAIAAqAgQhBwJ9AkAgAyABSARAA0AgByAAIANBA3RqKgIEIgZcDQIgA0EBaiIDIAFHDQALIAEhAwsgB0MAAIC/kgwBCyAHIAaT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ACACBEAgAiAAKAIEIAFqQQJqEGk2AgALIAMEQCADIAAoAgQgAWpBBGoQaTYCAAsgBARAIAQgACgCBCABakEGahBpNgIAC0EBIQYgBUUNACAFIAAoAgQgAWpBCGoQaTYCAAsgBgvGCAEIfyMAQYABayIDJAAgACACNgIIIAAgATYCBCADQfAAakEAQQAQjQIgACADKAJ4NgI8IAAgAykDcDcCNCABIAJB4vcAEO4BIQcgACABIAJB5/cAEO4BIgQ2AhAgACABIAJB7PcAEO4BIgY2AhQgACABIAJB8fcAEO4BIgg2AhggACABIAJB9vcAEO4BIgk2AhwgACABIAJB+/cAEO4BIgo2AiAgACABIAJBgPgAEO4BNgIkIAAgASACQYX4ABDuATYCKAJAIAdFIAZFciAJRSAKRXJyDQACQCAIBEAgBA0BDAILIANBAjYCXCADQQA2AlggA0EANgJUIANBADYCUCABIAJBivgAEO4BIgRFDQEgA0FAa0EAQQAQjQIgACADKAJINgJsIAAgAykDQDcCZCADQUBrQQBBABCNAiAAIAMoAkg2AnggACADKQNANwJwIANBQGsgASAEakGAgICAAhCNAiAAQTRqIgRBCGogAygCSDYCACAAIAMpA0A3AjQgAyAEKAIINgJ4IAMgACkCNDcDcCADQfAAakECEKMCIANB8ABqIANB8ABqEKIBEIwCIANBQGsgA0HwAGoQxgIgA0EwaiADQfAAahDGAiADIAMoAjg2AiggAyADKQMwNwMgIANB4ABqIANBIGpBABDwAyADQUBrIANB8ABqEMYCIANBQGsgA0HwAGoQxgIgACADKAJINgJUIAAgAykDQDcCTCADQeAAakERQQEgA0HYAGoQ7gIgA0HgAGpBhgJBASADQdwAahDuAiADQeAAakGkAkEBIANB1ABqEO4CIANB4ABqQaUCQQEgA0HQAGoQ7gIgAyADKAJ4NgIYIAMgAygCaDYCCCADIAMpA3A3AxAgAyADKQNgNwMAIANBQGsgA0EQaiADELkGIAAgAygCSDYCYCAAIAMpA0A3AlggAygCXEECRw0BIAMoAlgiBkUNASADKAJUIggEQCADKAJQIgRFDQIgA0HwAGogCBCMAiADQUBrIANB8ABqEMYCIAAgAygCSDYCbCAAIAMpA0A3AmQgA0FAayADQfAAaiAEIAMoAnggBGsQ7QIgACADKAJINgJ4IAAgAykDQDcCcAsgA0HwAGogBhCMAiADQUBrIANB8ABqEMYCIAAgAygCSDYCSCAAIAMpA0A3AkALIAACf0H//wMgASACQY/4ABDuASICRQ0AGiABIAJqQQRqEGULNgIMIAEgB2pBAmoQZSEGIABBADYCLCAGRQ0AIAdBBGohCEEAIQIDQAJAIAACfwJAAkAgASAIIAJBA3RqaiIEEGUOBAEDAwADCyAEQQJqEGUiCUEKR0EAIAlBAUcbDQIgBEEEahDEASAHagwBCyAEQQRqEMQBIAdqCyIFNgIsCyACQQFqIgIgBkcNAAsgBUUEQEEAIQUMAQsgACABIAAoAhRqQTJqEGU2AjBBASEFCyADQYABaiQAIAULgQEBAn8gABDsCQRAQX9BACABGw8LQX8hAgJAIAAtAABB9ABHDQAgAC0AAUH0AEcNACAALQACQeMARw0AIAAtAANB5gBHDQAgAEEEahDEASIDQYCACEdBACADQYCABEcbDQAgAEEIahDEASABTA0AIAAgAUECdGpBDGoQxAEhAgsgAgtIAQJ/IAAoAgQgAUgEQCABQcQBbBBLIQIgACgCCCIDBEAgAiADIAAoAgBBxAFsED4aIAAoAggQRgsgACABNgIEIAAgAjYCCAsL9wECBH8CfSMAQRBrIgIkACAAEPgJIAAoAkBBAU4EQCAAQUBrIQQDQAJAIAQgAxBhIgEoAhhFDQAgASgCAEGAgARLDQAgACABIAJBCGoQNCACEDQQkgogASgCGCABLwEAIAEqAhAiBSABKgIUIgYgBSABLwEEs5IgBiABLwEGs5IgAioCCCACKgIMIAIqAgAgAioCBCABKgIMEL0GCyADQQFqIgMgBCgCAEgNAAsLQQAhASAAKAI0QQBKBEAgAEE0aiEAA0AgACABEEgoAgAtAFQEQCAAIAEQSCgCABDrBAsgAUEBaiIBIAAoAgBIDQALCyACQRBqJAALpgEBAn0gBiAEKgIAIAAgA0EcbGoiACoCCJI4AgAgBiAFKgIAIAAqAgySOAIEIAYgBCoCACAAKgIUkjgCECAGIAUqAgAgACoCGJI4AhQgBkMAAIA/IAGylSIHIAAvAQCzlDgCCCAGQwAAgD8gArKVIgggAC8BArOUOAIMIAYgByAALwEEs5Q4AhggBiAIIAAvAQazlDgCHCAEIAAqAhAgBCoCAJI4AgALSQEBfSACLQA8RQRAIAEQ7AQgAioCECEFIAEgAjYCPCABIAU4AhAgASAEOAJMIAEgAzgCSCABIAA2AjgLIAEgAS8BQEEBajsBQAtQACABBEAgASAAKAIEIAAoAhxqQQRqEGk2AgALIAIEQCACIAAoAgQgACgCHGpBBmoQaTYCAAsgAwRAIAMgACgCBCAAKAIcakEIahBpNgIACwtjACAFQQFOBEAgASACaiADIAZsaiEDA0BBACEBIARBAEoEQANAIAEgA2oiAiAAIAItAABqLQAAOgAAIAFBAWoiASAERw0ACwsgAyAGaiEDIAVBAUohASAFQX9qIQUgAQ0ACwsLTgICfwF9A0AgACACagJ/IAKzIAGUIgRDAACAT10gBEMAAAAAYHEEQCAEqQwBC0EACyIDQf8BIANB/wFJGzoAACACQQFqIgJBgAJHDQALC9YFAgp/BX0jAEEgayIHJAAgACgCICELIAAoAhwhDAJ9IAIqAgAiDkMAAAAAXkEBc0UEQCABIA4Q7wQMAQsgASAOjBDABgshDiAAIAItABQiBDYCHCAAIAItABUiBTYCICAEELwGIQ8gBRC8BiEQIAIoAgwiBkEBTgRAQwAAgD8gBLOVIRFDAACAPyAFs5UhEgNAAkAgAyAJQQR0aiIEKAIMRQ0AIAQvAQQiCEUNACAELwEGIgpFDQAgAigCECENIAECfyACKAIIIgVFBEAgAigCBCAJagwBCyAFIAlBAnRqKAIACxDwBCEFIAQgAC8BFCIGIAQvAQhqOwEIIAQgBiAELwEKajsBCiAEIAggBms7AQQgBCAKIAZrOwEGIAEgBSAHQRxqIAdBGGoQ/AkgASAFIA4gACgCHLOUIA4gACgCILOUIAdBFGogB0EQaiAHQQxqIAdBCGoQ7QQgASAAKAIkIAQvAQhqIAAoAhAiBiAELwEKbGogBC8BBCAAKAIcIghrQQFqIAQvAQYgACgCICIKa0EBaiAGIA4gCLOUIA4gCrOUIAUQ+wkgACgCHCIFQQJPBEAgACgCJCAELwEIaiAAKAIQIgYgBC8BCmxqIAQvAQQgBC8BBiAGIAUQ+gkLIAAoAiAiBUECTwRAIAAoAiQgBC8BCGogACgCECIGIAQvAQpsaiAELwEEIAQvAQYgBiAFEPkJCyANIAlBHGxqIgUgBC8BCCIGOwEAIAUgBC8BCiIIOwECIAUgBiAELwEEIgpqOwEEIAUgCCAELwEGIgZqOwEGIAUgDiAHKAIcspQ4AhAgBSAPIBEgBygCFCIIspSSOAIIIAcoAhAhBCAFIA8gESAIIApqspSSOAIUIAUgECASIASylJI4AgwgBSAQIBIgBCAGarKUkjgCGCACKAIMIQYLIAlBAWoiCSAGSA0ACwsgACALNgIgIAAgDDYCHCAHQSBqJAALMgAgAEF/aiIAQQF1IAByIgBBAnUgAHIiAEEEdSAAciIAQQh1IAByIgBBEHUgAHJBAWoLvQIBBX8jAEEQayIGJAAgBhBEIgMgACgCQBD4BCADKAIIQQAgAxDBBhBPGiAAQUBrIQQgACgCQEEASgRAA0AgBCACEGEvAQQhBSADIAIQ0AEgBTsBBCAEIAIQYS8BBiEFIAMgAhDQASAFOwEGIAJBAWoiAiAEKAIASA0ACwtBACECIAEgA0EAENABIAMoAgAQvwYgAygCAEEBTgRAA0AgAyACENABKAIMBEAgAyACENABLwEIIQEgBCACEGEgATsBCCADIAIQ0AEvAQohASAEIAIQYSABOwEKIAMgAhDQAS8BBCAEIAIQYS8BBEYEQCADIAIQ0AEaIAQgAhBhGgsgACAAKAIgIAMgAhDQAS8BCiADIAIQ0AEvAQZqELkBNgIgCyACQQFqIgIgAygCAEgNAAsLIAMQRRogBkEQaiQAC4wBAQN/AkBBMBBLIgNBACABIAJrIgVBA3QQSyIEG0UEQCADBEAgAxBGCyAERQ0BIAQQRg8LIABBgIACNgIMIAAgATYCCCAAQQA2AgAgACAENgIoIAAgAzYCBCAAIAI2AhQgAEIBNwIgIAAgATYCECAAQoCAgIAQNwIYIAMgBUGAgAIgAmsgBCAFEIAKCwuHAQEGfyMAQRBrIgMkACAAKAIIIgQgACgCCCAAKAIAQQJ0aiIFSQRAIAQhAgNAIAIoAgAiBgRAIAIgBGtBA3QhB0EAIQADQCAGIAB2QQFxBEAgAyAAIAdqNgIMIAEgA0EMahB2CyAAQQFqIgBBIEcNAAsLIAJBBGoiAiAFSQ0ACwsgA0EQaiQACzYAIAAoAlhBf0wEQCAAAn8gAC0ABEECcUUEQCAAQdkBQRsQxQYMAQsgAEECQQIQxQYLNgJYCwuVAgICfwF+IwBBIGsiBiQAAkAgAUEHSw0AIAAtAARBAnENACAGQRhqIAFBGGwiAUGQL2ogBkEQaiAAQUBrIAAoAlgQYSIHLwEIsyAHLwEKsxAqEC8gBiABQZgvaikDACIINwMQIAMgCDcCACACIAFBoC9qKQMANwIAIAZBCGogBkEYaiAAQSRqIgAQlgIgBCAGKQMINwIAIAYgBkEYaiAGQRBqEC8gBkEIaiAGIAAQlgIgBCAGKQMINwIIIAYgBioCGEMAANpCkjgCGCAGQQhqIAZBGGogABCWAiAFIAYpAwg3AgAgBiAGQRhqIAZBEGoQLyAGQQhqIAYgABCWAiAFIAYpAwg3AghBASEHCyAGQSBqJAAgBwt5AQF/IwBBEGsiBCQAIAEQxAYgBEEIaiAAKgIkIAEvAQizlCAAKgIoIAEvAQqzlBAqGiACIAQpAwg3AgAgBEEIaiAAKgIkIAEvAQQgAS8BCGqylCAAKgIoIAEvAQYgAS8BCmqylBAqGiADIAQpAwg3AgAgBEEQaiQAC1gBAn8jAEEQayIBJAAgAEEQahA0IQIgAEL/////DzcCACAAQv////8PNwIIIAFBCGpDAAAAAEMAAAAAECoaIAIgASkDCDcCACAAQQA2AhggAUEQaiQAIAAL9AMBAX8gAC0AACIBQSBPBEAgAUEYdEEYdUF/TARAQdjCBCgCACAALQABQX9zaiABQYF/ahDsAiAAQQJqDwsgAUHAAE8EQEHYwgQoAgAgAC0AASABQQh0cmtB//8AaiAALQACQQFqEOwCIABBA2oPCyAAQQFqIAFBYWoQ4gQgAC0AACAAakFiag8LIAFBGE8EQEHYwgQoAgAgAC0AAiABQRB0ciAALQABQQh0cmtB///fAGogAC0AA0EBahDsAiAAQQRqDwsgAUEQTwRAQdjCBCgCACAALQACIAFBEHRyIAAtAAFBCHRya0H//z9qIAAtAAQgAC0AA0EIdHJBAWoQ7AIgAEEFag8LIAFBCE8EQCAAQQJqIAAtAAEgAUEIdHJBgXBqEOIEIAAtAAEgAC0AAEEIdHIgAGpBg3BqDwsCQAJAAkACQCABQXxqDgQCAwEAAwsgAEEDaiAALQACIAAtAAFBCHRyQQFqEOIEIAAtAAIgAC0AAUEIdHIgAGpBBGoPC0HYwgQoAgAgAC0AAyAALQABQRB0ciAALQACQQh0ckF/c2ogAC0ABEEBahDsAiAAQQVqDwtB2MIEKAIAIAAtAAMgAC0AAUEQdHIgAC0AAkEIdHJBf3NqIAAtAAUgAC0ABEEIdHJBAWoQ7AIgAEEGaiEACyAAC7IBAQF/AkAgASgAACICQRh0IAJBCHRBgID8B3FyIAJBCHZBgP4DcSACQRh2cnJBgIDwvQVHDQAgASgABCICQRh0IAJBCHRBgID8B3FyIAJBCHZBgP4DcSACQRh2cnINACABEMYGIQJBzMIEIAE2AgBB1MIEIAA2AgBB2MIEIAA2AgBB0MIEIAAgAmoiAjYCACABQRBqIQADQCAAIAAQlAoiAEYNAUHYwgQoAgAgAk0NAAsLC2MBA38jAEGAAWsiBSQAIAEQxgYiBhBLIgcgARCVCgJAIAMEQCAFQQhqIANB9AAQPhoMAQsgBUEIahDvAhoLIAVBAToAECAAIAcgBiACIAVBCGogBBDHBiEAIAVBgAFqJAAgAAt2AQJ/QZCPASEBQZCPAS0AACICBEADQCAAIAJBGHRBGHUQtAMgASwAARC0AyABLAACELQDIAEsAAMQtAMgASwABBC0A0HVAGxqQdUAbGpB1QBsakHVAGxqNgAAIABBBGohACABLQAFIQIgAUEFaiEBIAINAAsLC0oBAX8gACgCACICIAAoAgRGBEAgACAAIAJBAWoQXRDIBiAAKAIAIQILIAAoAgggAkH0AGxqIAFB9AAQPhogACAAKAIAQQFqNgIAC70BAQN/IwBBEGsiBCQAIABBNGohAgJAIAEtADxFBEBB2AAQSyIDEMkGIAQgAzYCDCACIARBDGoQdgwBCyACEGIaCyAAQcwAaiICIAEQmAogAigCCCACKAIAQfQAbGpBjH9qIgIoAnBFBEAgAiAAQTRqEHAoAgA2AnALIAItAAhFBEAgAigCBBBLIQMgAkEBOgAIIAIgAzYCACADIAEoAgAgAigCBBA+GgsgABD1AyACKAJwIQAgBEEQaiQAIAAL3wEBBn8jAEEQayIFJAACQCAAKAIYIgYNACAFQQA2AgwgACAFQQxqQQBBAEEAEMwGIAUoAgwiB0UEQCAAKAIYIQYMAQsgACAAKAIcIAAoAiBsQQJ0EEsiBjYCGCAAKAIgIAAoAhxsIghBAUgNACAGIQkDQCAJIActAABBGHRB////B3I2AgAgCUEEaiEJIAdBAWohByAIQQFKIQogCEF/aiEIIAoNAAsLIAEgBjYCACACBEAgAiAAKAIcNgIACyADBEAgAyAAKAIgNgIACyAEBEAgBEEENgIACyAFQRBqJAALLwEBf0GQjwEQa0EEakEFbUECdBBLIgQQlwogACAEIAEgAiADEJYKIQAgBBBGIAALBwAgABDKBgunAQEDfyMAQRBrIgEkACAAQSRqEDQhAiAAQSxqEDQhAyAAQTRqEEQaIABBQGsQRBogAEHMAGoQRBogAEIANwIUIABCgICAgBA3AgwgAEIANwIEIABBADoAACAAQgA3AhwgAUEIakMAAAAAQwAAAAAQKhogAiABKQMINwIAIAFBCGpDAAAAAEMAAAAAECoaIAMgASkDCDcCACAAQX82AlggAUEQaiQAIAALgAICBX8CfSMAQRBrIgckACAHQQhqIAQgAxA4IAdBCGoQ9wEhDCABIAJIBEAgACgCICIAIAJBFGxqIQJDAACAPyAMlSENIAZB/wFxIQQgBUH/AXEhCCAGQRB2Qf8BcSEJIAVBEHZB/wFxIQogBkEIdkH/AXEhBiAFQQh2Qf8BcSELIAAgAUEUbGohBQNAIAcgBSADEDggBSAIIAQgDSAHKgIAIAcqAgiUIAcqAgQgByoCDJSSlEMAAAAAQwAAgD8QXiIMEPACIAsgBiAMEPACQQh0ciAKIAkgDBDwAkEQdHIgBS0AE0EYdHI2AhAgBUEUaiIFIAJJDQALCyAHQRBqJAALsgECBX8CfSMAQRBrIgMkACAAKAIIIgJBAU4EQANAIAAoAgQgBEECdGooAgAiBigCAEEBTgRAQQAhBQNAIAMgBiAFEJACIgIqAgQgASoCACIHlCACKgIIIAEqAgQiCJQgByACKgIMlCAIIAIqAhCUEDAaIAIgAykDCDcCDCACIAMpAwA3AgQgBUEBaiIFIAYoAgBIDQALIAAoAgghAgsgBEEBaiIEIAJIDQALCyADQRBqJAAL5wEBCX8jAEEQayIHJAAgBxBEIQIgAEIANwIMIAAoAghBAU4EQANAIAAoAgQgBEECdGooAgAiBUEMaiIBEGJFBEAgAiABKAIAEPsDIAEoAgBBAU4EQCAFQRhqIQlBACEDA0AgCSABIAMQjgIvAQAQ/AMhBiACIAMQ/AMiCCAGKAIQNgIQIAggBikCCDcCCCAIIAYpAgA3AgAgA0EBaiIDIAEoAgBIDQALCyAFQRhqIAIQpgcgAUEAEL0BIAAgACgCECAFKAIYajYCEAsgBEEBaiIEIAAoAghIDQALCyACEEUaIAdBEGokAAs2ACABIAFBKGogACgCACABIAAoAghrQShtQX9zakEobBCuASAAIAAoAgBBf2o2AgAgACgCCBoLQwEBfwJAIABBBGogAUEEakEQENACDQAgACgCFCABKAIURw0AIAAoAhggASgCGEcNACAAKAIgDQAgASgCIEUhAgsgAgvYBAELfyAAKAIEQQJOBEAgACABQQAQ0QYCQCABKAIARQ0AIAEQ+AEoAgANACABEIEBCwJAIAAoAgRBAUgNAAJ/IABBCGoiAkEAEIUBKAIAQQFIBEBBAAwBCyACQQAQhQEQ+AEiBSgCACAFKAIcagshBiAAKAIEQQJIDQAgAEEIaiEKQQEhCANAAkAgCiAIEIUBIgIoAgBBAUgNACACEPgBKAIADQAgAhCBAQsCQAJ/IAVFIAIoAgAiA0EBSHJFBEAgBSACQQAQkAIQogoEQCACQQAQkAIhAyAFIAUoAgAgAygCAGo2AgAgAkEAEJACKAIAIQMgAiACKAIIEKEKIAMgBmohBgsgAigCACEDCyADQQBMCwRAIAIoAgwhCQwBCyACEPgBIQUgAigCDCEJIAIoAgAiA0EBSA0AIAIoAgghC0EAIQIDQCALIAJBKGxqIgwgBjYCHCAMKAIAIAZqIQYgAkEBaiICIANHDQALCyAEIAlqIQQgAyAHaiEHIAhBAWoiCCAAKAIESA0ACwsgASABKAIAIAdqELoDIAFBDGogASgCDCAEahC9ASABKAIUIAEoAgxBAXRqIARBAXRrIQMgACgCBEECTgRAIAEoAgggASgCAEEobGpBACAHa0EobGohBCAAQQhqIQdBASECA0AgByACEIUBIgUoAgAiBgRAIAQgBSgCCCAGQShsIgQQPiAEaiEECyAFKAIMIgYEQCADIAUoAhQgBkEBdCIDED4gA2ohAwsgAkEBaiICIAAoAgRIDQALCyABIAM2AjwgARD4AyAAQQE2AgQLC50CAQd/IwBBMGsiBCQAIABBCGohAyAAKAIIIgYgAkgEQCADIAIQ0gYLIAAgAjYCBCADQQAQhQEiAEIANwIAIABCADcCECAAQgA3AgggAkECTgRAIAFBzABqIQcgAUFAayEIIARBCGpBBHIhBUEBIQADQCADIAAQhQEhAQJAIAAgBk4EQCABQgA3AgAgAUIANwIQIAFCADcCCCABEEQaIAFBDGoQRBoMAQsgAUEAELoDIAMgABCFAUEMakEAEL0BCyADIAAQhQEoAgBFBEAgBEEIahDcBiEBIAUgCBCAAyIJKQIANwIAIAUgCSkCCDcCCCAEIAcQcCgCADYCHCADIAAQhQEgARDbBgsgAEEBaiIAIAJHDQALCyAEQTBqJAALvgEBAX8gBkGAgIAITwRAIAdDAAAAAF9FQQAgCEEPcRtFBEAgACABIAIgAyAEIAUgBhCPAg8LAkAgAEHMAGoiCRBiRQRAIAkQcCgCACABRg0BCyAAIAEQkQIgACgCGCEBIAAgAiADIAcgCBC4AyAAIAYQ9AEgACABIAAoAhggAiADIAQgBRDTBiAAEPQCDwsgACgCGCEBIAAgAiADIAcgCBC4AyAAIAYQ9AEgACABIAAoAhggAiADIAQgBRDTBgsLeQEBfyAKQYCAgAhPBEACQCAAQcwAaiILEGJFBEAgCxBwKAIAIAFGDQELIAAgARCRAiAAQQZBBBCsASAAIAIgAyAEIAUgBiAHIAggCSAKEPUEIAAQ9AIPCyAAQQZBBBCsASAAIAIgAyAEIAUgBiAHIAggCSAKEPUECwuWCwIMfw59IwBBEGsiDyQAIAdFBEAgBhBrIAZqIQcLIAMgACoCMAJ/IAMqAgAiFotDAAAAT10EQCAWqAwBC0GAgICAeAuykiIZOAIAIAMgACoCNAJ/IAMqAgQiF4tDAAAAT10EQCAXqAwBC0GAgICAeAuykiIXOAIEAkAgFyAFKgIMXg0AIAAqAhAiFiACIBaVIh6UISACQCAHIAZNIAhDAAAAAF5yDQAgFyAgkiICIAUqAgRdQQFzDQADQCACIRcgBkEKIAcgBmsQywIiBkEBaiAHIAYbIgYgB08NASAgIBeSIgIgBSoCBF0NAAsLAkAgByAGa0GRzgBIIAhDAAAAAF5yRQRAIAYhDCAGIAdPDQEgFyAFKgIMXUEBcw0BIBchAgNAIAxBCiAHIAxrEMsCIgxBAWogByAMGyIMIAdPDQIgICACkiICIAUqAgxdDQALDAELIAchDAsgBiAMRg0AIAEoAgwhEiABIAwgBmsiB0EGbCITIAdBAnQQrAEgAUEMaiEUIAEoAjQhDiABKAI8IQ0gASgCOCEKAkAgDCAGTQ0AIBkhGwNAIBshFiAXIQIgESELIAYhBwJ/A0ACQAJAIAhDAAAAAF5BAXNFBEAgC0UEQCAAIB4gByAMIAggFiAZk5MQ8gQiC0EBaiALIAcgC0YbIQsLIAcgC08NASAWIRsgAiEXIAshESAHIQYLIA8gBiwAACIHNgIMIAdBAEgNASAGQQFqDAMLICAgApIhAgNAIAciECAMTw0FIBBBAWohByAQLAAAIhUQ6gINAAtBACELIBkhFiAHIBAgFUEKRhsiByAMSQ0BDAQLCyAPQQxqIAYgDBCwAiELIA8oAgwiB0UNAiAGIAtqCyEGAkACQCAHQR9LDQACQCAHQXZqDgQAAQECAQsgICAXkiIXIAUqAgxeDQMgGSEbDAELAkAgACAHQf//A3EQ8QIiC0UEQEMAAAAAIQIMAQsgHiALKgIElCECIAdBCUYgB0EgRnINACAbIB4gCyoCCJSSIhYgBSoCCCIZX0EBcw0AIBsgHiALKgIQlJIiGCAFKgIAIhpgQQFzDQAgFyAeIAsqAhSUkiEfIBcgHiALKgIMlJIhIyALKgIkISEgCyoCICEiIAsqAhwhHCALKgIYIR0CQCAJRQRAIBYhGiAYIRkgIyEWIB8hGAwBCwJAIBYgGl1BAXMEQCAWIRoMAQsgHUMAAIA/IBggGpMgGCAWk5WTICIgHZOUkiEdCwJAICMgBSoCBCIWXUEBcwRAICMhFgwBCyAcICEgHJNDAACAPyAfIBaTIB8gI5OVk5SSIRwLAkAgGCAZXkEBcwRAIBghGQwBCyAdIBkgGpMgGCAak5UgIiAdk5SSISILAkAgHyAFKgIMIhheQQFzBEAgHyEYDAELIBwgISAckyAYIBaTIB8gFpOVlJIhIQsgFiAYYA0BCyANIA47AQYgDSAOOwEAIA0gDkEDajsBCiANIA5BAmoiBzsBCCANIAc7AQQgDSAOQQFqOwECIAogBDYCECAKIBY4AgQgCiAaOAIAIAogBDYCJCAKIBY4AhggCiAZOAIUIAogHDgCDCAKIB04AgggCiAENgI4IAogGDgCLCAKIBk4AiggCiAcOAIgIAogIjgCHCAKIAQ2AkwgCkFAayAYOAIAIAogGjgCPCAKICE4AjQgCiAiOAIwIAogITgCSCAKIB04AkQgDUEMaiENIA5BBGohDiAKQdAAaiEKCyAbIAKSIRsLIAYgDE8NASADKgIAIRkMAAsACyABQRhqIAogASgCIGtBFG0Q+wMgFCANIAEoAhRrQQF1EL0BIAEoAgwhACABIAEoAgBBf2oQkAIiAyADKAIAIAAgEiATamtqNgIAIAEgDTYCPCABIAo2AjggASAONgI0CyAPQRBqJAALKwAgBUGAgIAITwRAIAAgARBXIAAgAiADIAQgBxDXBiAAIAVBACAGEOABCwssACAFQYCAgAhPBEAgACABEFcgACACEFcgACADEFcgACAEEFcgACAFEPQBCwswACAFQYCAgAhPBEAgACABEFcgACACEFcgACADEFcgACAEEFcgACAFQQEgBhDgAQsLVQEBfyAAKAIAIgIgACgCBEYEQCAAIAAgAkEBahBdEN0GIAAoAgAhAgsgACgCCCACQQR0aiICIAEpAgA3AgAgAiABKQIINwIIIAAgACgCAEEBajYCAAtzAQN/IABBCGohAiAAKAIIQQFOBEADQCAAKAIAIAFGBEAgAiABEIUBIgNCADcCACADQgA3AhAgA0IANwIICyACIAEQhQEQSSACIAEQhQFBDGoQSSABQQFqIgEgAigCAEgNAAsLIABCgICAgBA3AgAgAhBJCzUBAX9BAiEBAkAgAEGAEEkNAEEAIQEgAEGAeHEiAEGAuANGDQBBBEEDIABBgLADRhsPCyABC88BAgR/AX0jAEEQayICJAAgABA0GiAAQYgBaiEEIABBKGohASAAQRRqEJICIQMDQCABEDRBCGoiASAERw0ACyAAQgA3AgxBACEBIABBADYCCCACQwAAAMZDAAAAxkMAAABGQwAAAEYQMBogAyACKQMINwIIIAMgAikDADcCACAAQQA2AiQDQCACIAGyIgUgBZJD2w9JQJRDAABAQZUiBRCJAyAFEIgDECoaIAAgAUEDdGogAikDADcCKCABQQFqIgFBDEcNAAsgAkEQaiQAIAALuREBBX8jAEEQayIBJAAgAEUEQBCNAyEACyABQwAAAABDAAAAAEMAAAAAQwAAgD8QMBogACABKQMINwK0ASAAIAEpAwA3AqwBIAFDmpkZP0OamRk/Q5qZGT9DAACAPxAwGiAAIAEpAwg3AsQBIAAgASkDADcCvAEgAUPXo3A/Q9ejcD9D16NwP0MAAIA/EDAaIAAgASkDCDcC1AEgACABKQMANwLMASABQwAAAABDAAAA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AqQCIAEgADYCoAIgASAJuzkDqAJB0BsgAUGgAmoQWSACKgLYMyEJIAIoAtAzIQAgAigC/DMhAyACKAL4MyEEIAEgAi0A3TM2ApACIAEgBEECdEGQG2ooAgA2ApQCIAEgAzYChAIgASAANgKAAiABIAm7OQOIAkGGHCABQYACahBZIAEgAigC9DMiAAR/IAAoAgAFQZ0aCzYC8AFBxxwgAUHwAWoQWSABIAIoArgzIgAEfyAAKAIABUGdGgs2AuABQdwcIAFB4AFqEFkgASACKAK0NSIABH8gACgCAAVBnRoLNgLQAUHvHCABQdABahBZIAIoArg1IQAgASACKAKMNjYCxAEgASAANgLAAUH/HCABQcABahBZIAEgAigC3DVBAnRBkBtqKAIANgKwAUGbHSABQbABahBZIAItANkGIQAgASACLQDaBjYCpAEgASAANgKgAUGuHSABQaABahBZIAIoArw1IQAgASACKALINTYClAEgASAANgKQAUHMHSABQZABahBZIAItAJY2IQAgASACLQCXNjYChAEgASAANgKAAUH2HSABQYABahBZIAEgAigC9DUiAAR/IAAoAgAFQZ0aCzYCcEGoHiABQfAAahBZIAJBsDpqKAIAIQAgAi0AmDohAyABIAJBrDpqKAIANgJsIAEgAkG8Omo2AmggASAANgJkIAEgAzYCYEHBHiABQeAAahBZELcBC0H6HhDKBARAQYAfQZy2AxCtAxpBmR9BnbYDEK0DGkMAAAAAQwAAgL8QYBD5AkMAAEBBlBDFAiABQaggKAIANgKIBCABQaAgKQMANwOABCABQZggKQMANwP4AyABQZAgKQMANwPwA0GdtgNBrCBBiLMDQQ0gAUHwA2pBB0F/EKkGQZ22Ay0AAHIiADoAAAJAIABFDQAgAigCtDUiAEUNACABIAAoAgA2AlBBuSAgAUHQAGoQlQFDAAAAABDBA0EAIQAgAUFAayEDA0AgAUGQBGogAigCtDUgABDrBiABKgKYBCEJIAEqApQEIQogASoCkAQhCyABKgKcBCEMIAFBkARqEHghDSABQZAEahCvASEOIAEgCbs5AyAgASAMuzkDKCABIA27OQMwIAEgDrs5AzggAyABQfADaiAAQQJ0aigCADYCACABIAu7OQMQIAEgCrs5AxhBvyAgAUEQahBZIABBAWoiAEEHRw0AC0MAAAAAEIgFC0HxIEGMswMQrQMaELcBC0GctgMtAABBnbYDLQAAckUNACAFKAIAQQFIDQAgAUH4A2ohBEEAIQADQAJAIAUgABBIKAIAIgItAHtFDQAQ0wUhA0GdtgMtAAAEQCABQfADaiACQYizAygCABDrBiADIAFB8ANqIARB/4GAfEMAAAAAQQ9DAACAPxCWAQtBnLYDLQAARQ0AIAItAAtBAXENACABIAIuAYgBNgIAIAFB8ANqQSBBpiEgARBcGiABQZAEaiACQQxqIgIgAUHoA2oQ+QIiCSAJECoQLyADIAIgAUGQBGpByMmRe0MAAAAAQQ8QbSADIAJBfyABQfADahDUBgsgAEEBaiIAIAUoAgBIDQALCxDUASABQaAEaiQAC0UBAX8gACgCACICIAAoAgRGBH8gACAAIAJBAWoQXRDpAiAAKAIABSACCyAAKAIIaiABLQAAOgAAIAAgACgCAEEBajYCAAtYAQJ/IABBABDyASECQZC2AygCACIAKAKIWkEBTgR/IABBiNoAaiEAA0AgAiAAIAEQhQEoAgRGBEAgACABEIUBDwsgAUEBaiIBIAAoAgBIDQALQQAFIAELC10CA38BfiMAQRBrIgEkACAAQQhqEDQhAiAAQRBqEDQhAyAAQgA3AgAgAUEIakMAAAAAQwAAAAAQKhogAyABKQMIIgQ3AgAgAiAENwIAIABBADoAGCABQRBqJAAgAAvYAQEFfyMAQRBrIgAkAEGQtgMoAgAhAUHSFxC8AUHdFyAAQQhqQwAAAABDAAAAABAqEK8DIQJDAAAAAEMAAIC/EGBB6BcgAEEIakMAAAAAQwAAAAAQKhCvAyEDQwAAAABDAACAvxBgQfQXIABBCGpDAAAAAEMAAAAAECoQrwMhBEMAAAAAQwAAgL8QYEEAEIwHQwAAoEIQxQJBhRggAUHI2gBqQQBBCUEAEJgGGhD6AhByIAIEQEF/EPEGCyADBEBBf0EAEPAGCyAEBEBBfxDvBgsgAEEQaiQAC8EDAQF/IwBBEGsiAiQAIAIgAEEEaiABEEEgAkEIaiACEH8gACACKQMINwIEIAAgACoCDCABlBBMOAIMIAIgAEEUaiABEEEgAkEIaiACEH8gACACKQMINwIUIAAgACoCKCABlBBMOAIoIAAgACoCMCABlBBMOAIwIAIgAEE4aiABEEEgAkEIaiACEH8gACACKQMINwI4IAAgACoCQCABlBBMOAJAIAIgAEHIAGogARBBIAJBCGogAhB/IAAgAikDCDcCSCACIABB0ABqIAEQQSACQQhqIAIQfyAAIAIpAwg3AlAgAiAAQdgAaiABEEEgAkEIaiACEH8gACACKQMINwJYIAAgACoCYCABlBBMOAJgIAAgACoCZCABlBBMOAJkIAAgACoCaCABlBBMOAJoIAAgACoCbCABlBBMOAJsIAAgACoCcCABlBBMOAJwIAAgACoCdCABlBBMOAJ0IAAgACoCeCABlBBMOAJ4IAIgAEGQAWogARBBIAJBCGogAhB/IAAgAikDCDcCkAEgAiAAQZgBaiABEEEgAkEIaiACEH8gACACKQMINwKYASAAIAAqAqABIAGUEEw4AqABIAJBEGokAAtBAQF/IAJBAXMhAgJAEDYoAsADIgMEQCAAIAMoAhBGBEAgAygCBCACRg0CCxClBwsgAEEBRg0AIAEgACACEMUKCwvIBAIFfwF9IwBBIGsiBCQAQZC2AygCACEGEDYiAyAAIAEQxgoQywoiACABNgIQIABBADYCDCAAIAI2AgQgAyAANgLAAyAAIAMqArQDIAZB4CpqKgIAkyIIOAIUIAAgAyoCiAQgAyoCDJMgCEMAAIA/khAxOAIYIAAgAyoCzAE4AiQgACADKgLgATgCKCAAIAMpApAENwIsIAAgAykCmAQ3AjQgACADKgLMASIIOAIcIAAgCDgCICADQQA2ArwDIAMCfyADKgIMIAMqArQDkkMAAAAAkiIIi0MAAABPXQRAIAioDAELQYCAgIB4C7I4AsgBIABBPGohBiAAKAI8IgJFIAFBAWoiBSACRnJFBEAgBkEAEPcGIAYoAgAhAgsgACACRToACAJAIAJFBEAgBiAFEIIFQQAhAiABQQBIDQEgAbIhCANAIARBDGoQVhogBEEANgIIIARCADcCACAEIQUgBCACsiAIlTgCACAGIAUQgQUgASACRyEFIAJBAWohAiAFDQALCyABQQFIDQAgA0GQBGohB0EAIQIDQCAGIAIQYSEFIAQgAyoCDEMAAAA/kiACEPMBkhBMQ///f/8gAyoCDEMAAAA/kiACQQFqIgIQ8wGSQwAAgL+SEExD//9/fxBSGiAFIAQpAwg3AhQgBSAEKQMANwIMIAVBDGogBxC9AiABIAJHDQALCyAAKAIQIgBBAUoEQCADKAL8BCAAQQFqEPYGIAMoAvwEQQEQ9gJBABD5BgtBfxCEBUNmZiY/lBDEAyAEQSBqJAALLwEBfxA2IQJBx+aIiQEgAUHH5oiJAWogABsQ0gEgAiAAQaAXIAAbEFUhABByIAALNwAgAEIANwIAIABCgICAgBA3AgwgAEIANwIUIABBADsBCCAAQgA3AhwgAEIANwIkIABBPGoQSQtIAQJ/IAAoAgQgAUgEQCABQcgAbBBLIQIgACgCCCIDBEAgAiADIAAoAgBByABsED4aIAAoAggQRgsgACABNgIEIAAgAjYCCAsLSgEBfyAAKAIAIgIgACgCBEYEQCAAIAAgAkEBahBdEMgKIAAoAgAhAgsgACgCCCACQcgAbGogAUHIABA+GiAAIAAoAgBBAWo2AgALxgECAn8BfiABBEAgAUEANgIACwJAIABBkxgQhQUiAEUNAAJAAkAgAEECENIHDQACfwJ+IAAiAigCTEF/TARAIAIQ0QcMAQsgAhDRBwsiBEKAgICACFkEQEHAwwRBPTYCAEF/DAELIASnCyICQX9GDQAgAEEAENIHRQ0BCyAAENMCQQAPCyACEEsiA0UEQCAAENMCDAELIAMgAiAAENkLIAJHBEAgABDTAiADEEYMAQsgABDTAiABBEAgASACNgIACyADDwtBAAujAQECfyMAQdAAayIDJAAgAEHoBGohAgJAIAAoAugEQQFOBEBBACEAA0AgASACIAAQwQQoAgBGBEAgAiAAEMEEIQAMAwsgAEEBaiIAIAIoAgBIDQALCyACAn8gA0EIaiIAQSxqEFYaIABBPGoQRBogABDHCiAACxDJCiAAEMYIIAIoAgggAigCAEHIAGxqQbh/aiIAIAE2AgALIANB0ABqJAAgAAsuAQF/EGQhAgJ/IABBf0wEQCACKALAAygCDCEACyAAQQFqCyAAEPMBIAGSEI4FC14CAn8BfSAAQTxqIgMCfyABQX9MBEAgACgCDCEBCyABQQFqCxBhIQQCfyACBEAgBCoCBCEFIAMgARBhQQRqDAELIAQqAgAhBSADIAEQYQshASAAIAUgASoCAJMQgwULGAEBfxBkKALAAyIARQRAQQEPCyAAKAIQCxgBAX8QZCgCwAMiAEUEQEEADwsgACgCDAv/AgIFfwF9IwBBEGsiAiQAAkAQNiIALQB/DQAgACgCwAMiAUUNACABKAIQQQFGBEAgAAJ/IAAqAgwgACoCtAOSIAAqArwDkiIFi0MAAABPXQRAIAWoDAELQYCAgIB4C7I4AsgBDAELQZC2AygCACEEEMYBEJMCIAEgASoCICAAKgLMARAxOAIgIAEgASgCDEEBaiIDNgIMAkAgAyABKAIQSARAIAAgAxDzASAAKgK0A5MgBEHgKmoqAgCSOAK8AyAAKAL8BCABKAIMQQFqEPYCIAEqAhwhBQwBCyAAQQA2ArwDIAAoAvwEQQEQ9gIgAUEANgIMIAEgASoCICIFOAIcCyAAIAU4AswBIAACfyAAKgIMIAAqArQDkiAAKgK8A5IiBYtDAAAAT10EQCAFqAwBC0GAgICAeAuyOALIASACQQhqQwAAAABDAAAAABAqGiAAIAIpAwg3AugBIABBADYC+AEgASgCDBD5BkF/EIQFQ2ZmJj+UEMQDCyACQRBqJAALOABBkLYDKAIAKAKsMyAAQeUWIAAbEFUhAAJAIAEQ/gJFDQBBBBCMBQ0AIAAQ+AILIABBwQIQvgMLRABBkLYDKAIAKAKsMyAAQdYWIAAbEFUhAAJAIAEQ/gJFDQBBCBCMBUUNACACRQRAEJ0HDQELIAAQ+AILIABBwQIQvgMLUgECf0GQtgMoAgAoAqwzIgMtAH8EfyACBQJ/IAAEQCADIAAQVQwBCyADKAKIAgshAgJAIAEQ/gJFDQBBCBCEAkUNACACEPgCCyACQcECEL4DCwusAQEDfyMAQRBrIgMkAAJAQZC2AygCACIFKAKsMyAAEFUQwANFBEAgBUGQNGoQlAIMAQsgBS0AkDRBAXFFBEAgA0EIaiAFQRBqQwAAAD8QQSADQQhqQQggA0MAAAA/QwAAAD8QKhCrAgsgACABIAJBoIKA4AByEP8BBEBBASEEIAFFDQEgAS0AAA0BELoBIAUoAqg1QQEQigNBACEEDAELELoBCyADQRBqJAAgBAvUAQIEfwF9IwBBEGsiASQAAkBBkLYDKAIAIgIoArQ1IABHDQAQ/wNFDQAgAigCuDYNACACKAKMNg0AIAEgACkCnAY3AwggASAAKQKUBjcDAAJAIAIoArw2IgMEQCADIQQMAQsMAQsgA0ECRgR/IAEgACoCICAAKgIoIAAqAjgiBSAFkpIQMSAAKgJUkyIFOAIMIAEgBTgCBEECIAQgARD7BiACKAK8NgUgAwtBA0cNACABIAAqAlSMIgU4AgwgASAFOAIEQQMgBCABEPsGCyABQRBqJAALLQAgAEEUahA0GiAAQRxqEDQaIABBADYCCCAAQgA3AgAgAEL/////DzcCDCAACzgBA39BkLYDKAIAIgEoApw1IAEoAqg1IgNKBH8gAUGcNWogAxB0KAIAIAEoAqwzIAAQVUYFIAILC0sBA38jAEEgayIBJAAgAUEIakGQtgMoAgAoAqwzIgJByAFqIgMgABAvIAJBkARqIAFBEGogAyABQQhqEDwQ3wIhACABQSBqJAAgAAs7AQJ/QZC2AygCACIBIAEoAqwzIgI2AsQ3IAIoAuQCIQIgAUH/////BzYC1DcgASAAIAJqQQFqNgLQNwsUAQF/EDYiAUEANgJsIAEgADgCZAsUAQF/EDYiAUEANgJoIAEgADgCYAsQAEGQtgMoAgAoAqwzKgJYCxAAQZC2AygCACgCrDMqAlQLEABBkLYDKAIAKAKsMyoCUAssAQF/EDYiASABKgIMIAEqAlCTIACSIgA4AsgBIAEgASoC4AEgABAxOALgAQtaAQJ/IwBBEGsiASQAIAEQNiICQQxqIAJB0ABqEDggAUEIaiABIAAQLyACIAEpAwg3AsgBIAFBCGogAkHgAWogAkHIAWoQtAEgAiABKQMINwLgASABQRBqJAALGAEBfxBkIgAqAsgBIAAqAgyTIAAqAlCSC50BAQR/IAAhAQNAIAEtAAAiAkEJRiACQSBGcgRAIAFBAWohAQwBBSABIQMCQCACRQ0AIAEhAgNAIAItAAEhBCACQQFqIgMhAiAEDQALIAMgAU0NAANAIANBf2oiAi0AACIEQSBHQQAgBEEJRxsNASACIgMgAUsNAAsLIAMgAWshAyAAIAFHBEAgACABIAMQrgELIAAgA2pBADoAAAsLCzcBAn8jAEEQayIBJAAgAUEIahBkIgJByAFqIAJBDGoQOCAAIAFBCGogAkHQAGoQLyABQRBqJAALLwECf0GQtgMoAgAhARA2IgIgADgC9AQgASACEP4BIgA4AsgxIAFB3DFqIAA4AgALLAIBfwF9QZC2AygCACIAQeQqaioCACAAKgLIMSAAQdQqaioCACIBIAGSkpILCgAQZEGgBGoQeAsaAQF/QZC2AygCACIAIAAoApA0QSByNgKQNAs1AQF/QZC2AygCACICQcA0aiAAOgAAIAJBnDRqIAFBASABGzYCACACIAIoApA0QQhyNgKQNAsIABBkLQCAAQsHABBkLQB9CxAAQZC2AygCACgCrDMqAhgLEABBkLYDKAIAKAKsMyoCFAuSAQEBf0GQtgMoAgAhASAAQQRxBEAgASgCtDVBAEcPCwJAAkACQAJAAkAgAEEDcUF/ag4DAgEAAwsgASgCtDUiAEUNAyAAKAL8BSABKAKsMygC/AVGDwsgASgCtDUgASgCrDMoAvwFRg8LIAEoArQ1IgBFDQEgACABKAKsMxDEBQ8LIAEoArQ1IAEoAqwzRg8LQQALRgECfyAAKAIEIAFIBEAgAUEMbBBLIQIgACgCCCIDBEAgAiADIAAoAgBBDGwQPhogACgCCBBGCyAAIAE2AgQgACACNgIICwt9AQR/IwBBMGsiAiQAQZC2AygCACEEIAJBGGoQmAciAyAANgIAIAMgBCAAQQR0aiIAQcQraiIFKQIANwIEIAMgAEHMK2oiACkCADcCDCAEQfg0aiADEJcHIAJBCGogARDaBiAAIAIpAxA3AgAgBSACKQMINwIAIAJBMGokAAsJAEECIAAQ+wILYQIBfwF9QZC2AygCACICKgLgASACKgLsM5NDAACAQJIgAigCrDMqAgyTIAFBf2oQ8wEgAkH8KmoqAgCSEDEhAyAALQAEQQRxBH0gAyABQQFqEPMBIAIqAvwqkxBABSADCwtGAQJ/IAAoAgQgAUgEQCABQSxsEEshAiAAKAIIIgMEQCACIAMgACgCAEEsbBA+GiAAKAIIEEYLIAAgATYCBCAAIAI2AggLC9AGAgd/A30jAEFAaiIBJAAgACoCPCEIQZC2AygCACEEAkAgACoCQCIJQwAAAABeQQFzDQAgAC0ACEGAAXENACAAKAL8BCECIAFBMGogAEEMaiIDIABBFGoQLyACIAMgAUEwakEFQwAAgD8QNyAIQQ8gCRCWAQsgACwAgwEiAkF/RwRAAkBBkLcDLQAAQQFxDQBBkLcDEPsBRQ0AQaC2A0MAAAAAQwAAgD8QKhpBqLYDQwAAAABDAAAAABAqGkGwtgNDAACAP0MAAAAAECoaQbi2A0Hkl9uEBDYCAEG8tgNDAACAv0MAAAAAECoaQcS2A0MAAIA/QwAAAAAQKhpBzLYDQwAAgD9DAACAPxAqGkHUtgNBADYCAEHYtgNDAAAAAEMAAIC/ECoaQeC2A0MAAIA/QwAAgD8QKhpB6LYDQwAAAABDAACAPxAqGkHwtgNB25+k/gM2AgBB9LYDQwAAgD9DAAAAABAqGkH8tgNDAAAAAEMAAIA/ECoaQYS3A0MAAAAAQwAAAAAQKhpBjLcDQdufpIIENgIAQZC3AxD6AQsgAUEwaiAAIAIgCEMAAAAAEJMHIAAoAvwEIQMgAUEYaiABQTBqIAFBOGoiBSACQRxsIgJBqLYDahD1ASABQSBqIAFBGGogAUEQakMAAAA/QwAAAD8QKhAvIAFBCGogAkGgtgNqIgYgCBBBIAFBKGogAUEgaiABQQhqEC8gAyABQShqIAggAkG4tgNqIgMqAgAiCkPbD0m/kiAKQQoQ8QEgACgC/AQhByABQRhqIAFBMGogBSACQbC2A2oQ9QEgAUEgaiABQRhqIAFBEGpDAAAAP0MAAAA/ECoQLyABQQhqIAYgCBBBIAFBKGogAUEgaiABQQhqEC8gByABQShqIAggAyoCACIIIAhD2w9JP5JBChDxASAAKAL8BEEdQwAAgD8QN0EAQwAAAEAgCRAxEOABCwJAIARB3CpqKgIAQwAAAABeQQFzDQAgAC0ACEEBcQ0AIAAqAhAhCCAAEIACIQogACgC/AQgAUEwaiAJIAAqAgySIAggCpJDAACAv5IiCBAqIAFBKGogACoCDCAAKgIUkiAJkyAIECpBBUMAAIA/EDcgBCoC3CoQ0QELIAFBQGskAAtHAQF/AkACfyABBEAgASgCAAwBCyAAEGtBAWoLIAIQa0EBaiIDTw0AIAAQRiADEEshACABRQ0AIAEgAzYCAAsgACACIAMQPgscACAAQQRqEDQaIABBDGoQNBogAEEUahA0GiAAC0MBAX8jAEEgayICJAAgAkEYaiABELAHIAJBEGogASACQRhqEK8HIAIgAikDEDcDCCAAIAEgAkEIahCCAyACQSBqJAALBQAQxgMLDgAQZC0AjAJBBHFBAnYLHgECf0GQtgMoAgAiASgCuDUEfyABLQCWNkUFIAALCxAAQZC2AygCACgC0DNBAEcLFgEBfyAAQQAQxwMEf0EAEIQCBSABCws4AQF/QZC2AygCACEAAn9BABCeB0UNABpBASAALQCBNA0AGkEAIAAoAtAzDQAaIAAtAN8zQQBHCws8AQJ/An9BAEGQtgMoAgAiACgC0DMiAUUNABogACgCrDMoAogCIAFGBEBBASAAKAL8MyABRw0BGgtBAAsLDwBBkLYDKAIAIAA2ArReCw8AQZC2AygCACAANgK4XgsPAEGQtgMoAgAgADYClDoLDQBBkLYDKAIAKAKUOgsdAQF/QZC2AygCACIBIABBA3RqIAEpA+ABNwKEBwuSAQECf0GQtgMoAgAhAyACQwAAAABdQQFzRQRAIAMqAjAhAgsCQCABIANqIgQtAOgBRQRAIAQtAOIHRQ0BCyADIAFBAnRqQcQIaioCACACIAKUYEEBcw0AIANB4AFqIgQQgwFFDQAgAyABQQN0akGEB2oiARCDAUUNACAAIAQgARA4DwsgAEMAAAAAQwAAAAAQKhoLOgECf0GQtgMoAgAiASgCqDUiAkEBTgRAIAAgAUGcNWogAkF/ahB0KQIcNwIADwsgACABKQPgATcCAAsQAEGQtgMoAgAgAGotAN0HCz4BA39BASEBQZC2AygCACICLQDoAQR/IAEFA0AgACIBQQFqIgBBBUcEQCAAIAJqLQDoAUUNAQsLIAFBBEkLCz8BAX8Cf0EAIABBAEgNABpBAEGQtgMoAgAiASAAQQJ0akHYGGoqAgBDAAAAAGBBAXMNABogACABai0A/AFFCwsSAEGQtgMoAgAgAEECdGooAjQL4QEBBn8jAEEQayIEJAAQ1AMhAiABQQE6AAACf0EAIAAoAgAiBUEBSA0AGiAAKAIICyEDIAFCADcCDCABIAU2AgggASADNgIEIARBCGpDAAAAAEMAAAAAECoaIAEgBCkDCDcCFCABIAIpAwg3AhwgASACKQKcATcCJCAAKAIAIgVBAU4EQCABKAIMIQIgASgCECEDIAAoAgghBkEAIQADQCACIAYgAEECdGooAgAiBygCDGohAiADIAcoAhhqIQMgAEEBaiIAIAVHDQALIAEgAjYCDCABIAM2AhALIARBEGokAAvjAwMIfwF+AX0jAEEgayIDJABBkLYDKAIAIgAoAuQyIgEgACgC4DJHBEAQqAcgACgC4DIhAQsgACABNgLoMiAAQQA2AugGIABCADcD4AYgAEGIOGoiBSIBQQAQvwEgAUEMakEAEL8BIABBvDhqEGJFBEAgBSAAQaQ4ahCWBQsgAwJ/IAAoAvQ1IgIEQEEAIQEgAi0ACUEgcUUEQCACKAL8BSEBCyADIAE2AhggACgC/DUMAQtBACEBIANBADYCGEEACyIHNgIcIAAoAuwyBEAgAEHsMmohBkEAIQIDQAJAIAYgAhBIKAIAIgQQlQVFIAQgB0ZyIAEgBEZyDQAgBCgCCEGAgIAIcQ0AIAQQoQcLIAJBAWoiAiAGKAIARw0ACwtBASECQQEhBANAAkAgAUUNACABEJUFRQ0AIAEQoQcLIAJBAXEEQCADQRhqIARBAnRqKAIAIQFBACECQQIhBAwBCwsgBRCQCyAALQCsAQRAIAMgACkD4AEiCDcDECAAQbgraioCACEJIAAoApQ6IQEgAyAINwMIIABBnDlqIANBCGogCSABEO8JCyAAQbQ5ahBiRQRAIAUgAEGcOWoQlgULIAUgAEHcN2oQiQsgACAAQeg3aikCAEIgiTcD4AYgA0EgaiQAC1YBA38CQCAAKAIAIgIoAggiA0GAgIAgcSABKAIAIgEoAggiBEGAgIAgcWsiAA0AIANBgICAEHEgBEGAgIAQcWsiAA0AIAIuAYYBIAEuAYYBayEACyAAC7EBAgF/An0jAEEgayIFJAAgBUEYaiABIAIgBBChBSAFQRBqIAIgAyAEEKEFIAVBCGogAyABIAQQoQUgBSAEIAVBGGoQOCAFEPcBIQYgBSAEIAVBEGoQOCAFEPcBIQcgBSAEIAVBCGoQOAJAIAYgBiAHIAUQ9wEQQBBAIgZbBEAgACAFKQMYNwIADAELIAYgB1sEQCAAIAUpAxA3AgAMAQsgACAFKQMINwIACyAFQSBqJAALPAECf0GoJCEBIAAoAggiAkGAgIAgcQR/IAEFAkAgAkGACHFFDQAgACgCAEGwJBD9AQ0AQb4kDwtBziQLC5sBAgF/BX0jAEEgayIHJAAgB0EYaiABIAAQOCAHQRBqIAIgABA4IAdBCGogAyAAEDggBSAHKgIUIgggByoCCCIKlCAHKgIQIgkgByoCDCILlJMgByoCGCIMIAiUIAkgByoCHCIIlJMiCZU4AgAgBiAMIAuUIAggCpSTIAmVIgg4AgAgBEMAAIA/IAUqAgCTIAiTOAIAIAdBIGokAAvFAgEHfyMAQRBrIgAkAEGQtgMoAgAiASoCgDZDmpkZPl1FBEAgASgC/DVFBEAgAUGUJBCtAjYC/DULIABBCGogAUEQaiICKgIAQ83MTD6UIAEqAhRDzcxMPpQQKiAAQ///f39D//9/fxAqQQAQyAMgAEEIaiACQwAAAD8QQSAAQQhqQQEgAEMAAAA/QwAAAD8QKhCrAiAAQQhqIAFBnCpqQwAAAEAQQUEBIABBCGoQqgJBlCRBAEHHpjAQ/wEaIAEoAvgyIgJBAU4EQCABQfgyaiEFA0AgBSACQX9qIgYQSCgCACIDEKMHBEAgAygCACIEQQAQiQEgBEYEfyADEI0LBSAECyABKAL0NSADRkEAIABBCGpDAAAAAEMAAAAAECoQoAEaCyACQQFKIQMgBiECIAMNAAsLENQBQQEQqQILIABBEGokAAtBAQJ/IAAgACgCACICIAAoAgxqEL8BIABBDGoiARBiRQRAIAAgAhBIIAFBABBIIAAoAgxBAnQQPhogAUEAEL8BCwuMBwIHfwR9IwBB4ABrIgQkAEGQtgMoAgAhBSAAQoGAgIAgNwKwAiAAIAAoAuwCIgZBEHI2AuwCIAAoAggiCEEgcSEHIAVB0CpqKgIAIQsgBSoCyDEhDiAEQdgAahA0IQkgBEHQAGoQNCEKIAshDCADBEAgBEE4aiABKgIIIAsgDpIiDJMgBSoC0CqTIAEqAgQQKhogBCAEKQM4NwNYCwJAIAcNACAFQbwqaigCACIHQQFGBH8gBEE4aiABKgIIIA4gDJIiDJMgBSoC0CqTIAEqAgQQKhogBCAEKQM4NwNQIAUoArwqBSAHC0UEQCAEQThqIAsgASoCAJIgBSoC0CqTIAEqAgQQKhogBCAEKQM4NwNQIAsgDpIhCwsgAEHeIRBVIAoQ1AlFDQAgAEEBOgB+CwJAIANFDQAgAEHoIRBVIAkQ3wRFDQAgA0EAOgAACyAAIAY2AuwCIABCgICAgBA3ArACQwAAAAAhDiAIQYCAwABxIgMEQCAEQThqQe8hQQBBAEMAAIC/EF8gBCoCOCEOCyAEQThqIAJBAEEBQwAAgL8QXyAEQcgAaiAEQThqIARBKGogDkMAAAAAECoQLyALIAUqAtAqIg1eQQFzRQRAIAsgBUHoKmoqAgCSIQsLIAwgDV5BAXNFBEAgDCAFQegqaioCAJIhDAsgBUG0KmoiBioCACINQwAAAABeQQFzIA1DAACAP11BAXNyRQRAIAtDAACAPyANQwAAAL+SiyINIA2SkxBKIAsgDBAxIAEQeCALkyAMkyAEKgJIkxBAlCINEDEhCyAMIA0QMSEMCyAEQThqIAsgASoCAJIgASoCBCABKgIIIAyTIAEqAgwQUiIAIABBCGoiASACQQAgBEHIAGogBiAEQShqIAAqAgAgACoCBCAAKgIIIAVB6CpqKgIAkiAAKgIMEFIiAhC2ASADBEAgACoCACELIAAQeCEMIARBIGogBEEYaiAEKgJIIg0gCyALIAwgDZMgBSoCtCqUkhAxkiAAKgIEECogBEEQakMAAABAIA6TQwAAAAAQKhAvIARBEGogBEEgaiAEQRhqQwAAAAACfyAFKgLIMUMAAIC+lCILi0MAAABPXQRAIAuoDAELQYCAgIB4C7IQKiIAEC8gBEEIaiABIAAQLyAEQRBqIARBCGpB7yFBAEEAIARDAAAAACAFQbgqaioCABAqIAIQtgELIARB4ABqJAALywgDBn8CfgN9IwBB4ABrIgYkACAAKgJAIQ4gACoCPCEPQZC2AygCACEHAkAgAC0AfQRAIAdB3CpqIgAqAgAhBSAAIA44AgAgAgR/QQxBCyAHLQCWNhsFQQwLQwAAgD8QNyEAIAYgASkCACIMNwNYIAYgASkCCCINNwNQIAYgDDcDECAGIA03AwggBkEQaiAGQQhqIABBASAPELUBIAcgBTgC3CoMAQsCQCAAKAIIIglBgAFxBEAgCUEBcSEIDAELIAlBgICAMHEEf0EEBUEDQQIgCUGAgIAIcRsLQwAAgD8QNyEIAkAgBy0AkDRBwABxRQ0AIAdB3DRqKgIAIhBDAACAP1sNACAIQf///wdxAn8gEBBKQwAAf0OUQwAAAD+SIhCLQwAAAE9dBEAgEKgMAQtBgICAgHgLQRh0ciEICyAAKAL8BCEKIAZBOGogAEEMaiILIAZBKGpDAAAAACAAEIACECoQLyAGQcgAaiALIABBFGoQLyAKIAZBOGogBkHIAGogCCAPQQ9BDCAJQQFxIggbEG0LIAhFBEBBC0EKIAIbQwAAgD8QNyECIAAoAvwEIAEgAUEIaiACIA9BAxBtCwJAIAlBgAhxRQ0AIAZBOGogABCPBSAGQShqIAAQrAIgBkE4aiAGQShqEL0CIAAoAvwEIQEgBkEoaiAGQThqIAZByABqIA5DAAAAABAqEC8gBkEgaiAGQUBrIAZBGGogDkMAAAAAECoQOCABIAZBKGogBkEgakENQwAAgD8QNyAPQwAAAAAgCBtBAxBtIAdB3CpqKgIAQwAAAABeQQFzDQAgBioCRCAAKgIQIAAqAhiSXUEBcw0AIAAoAvwEIQEgBkEoaiAGQThqEMUDIAZByABqIAZBOGoQkgcgASAGQShqIAZByABqQQVDAACAPxA3IAcqAtwqENEBCyAALQB4BEBBABCvBgsgAC0AeQRAQQEQrwYLIAlBAnEgA0EBSHJFBEAgDyAOkiEQIABBFGohCSAAQQxqIQhBACEBA0AgBkEoaiAIIAkQLyAGQThqIAggBkEoaiABQRhsIgJB0BBqEPUBIAJB2BBqIQcgACgC/AQhCgJAIAFBAXEiCwRAIAZBIGogDiAFECoaDAELIAZBIGogBSAOECoaCyAGQcgAaiAHIAZBIGoQlgIgBkEoaiAGQThqIAZByABqEC8gCiAGQShqEFcgACgC/AQhCgJAIAsEQCAGQSBqIAUgDhAqGgwBCyAGQSBqIA4gBRAqGgsgBkHIAGogByAGQSBqEJYCIAZBKGogBkE4aiAGQcgAahAvIAogBkEoahBXIAAoAvwEIAZBKGogBioCOCAQIAcqAgCUkiAGKgI8IBAgAkHcEGoqAgCUkhAqIA8gAkHgEGooAgAgAkHkEGooAgAQqwEgACgC/AQgBCABQQJ0aigCABD0ASABQQFqIgEgA0cNAAsLIAAQ8woLIAZB4ABqJAALlg0DEX8BfgN9IwBBgAFrIgUkAAJAIAAtAAhBwgBxBEAMAQsgACgCkAFBAEoNACAAKAKUAUEASg0AIAAtAHtFDQBBkLYDKAIAIgYtAK8BIQwgBioCyDEiF0PNzKw/lCAXQ83MTD6UIAAqAjxDAACAP5KSEDEhFyAFQfgAakP//39/Q///f38QKiELIAVB8ABqQ///f39D//9/fxAqIQ4gAEKBgICAIDcCsAJB1iEQvAECfwJ/IBeLQwAAAE9dBEAgF6gMAQtBgICAgHgLskMAAEA/lCIXi0MAAABPXQRAIBeoDAELQYCAgIB4C7IhFwJAIANBAUgEQAwBC0MAAIBAQwAAAAAgDBshGCAGQewzaiEQIAZB4AFqIREgAEEUaiESIABBDGohDyAXjCEZIAVB5ABqIRMgBUHYAGpBBHIhFCAFQeAAaiEVA0AgBUHYAGogDyASEC8gBUHoAGogDyAFQdgAaiAHQRhsIghB0BBqIgoQ9QEgBUHIAGogCEHYEGoiCCAYEEEgBUHQAGogBUHoAGogBUHIAGoQOCAFQThqIAggFxBBIAVBQGsgBUHoAGogBUE4ahAvIAVB2ABqIAVB0ABqIAVBQGsQPCENIAUqAlggBSoCYF5BAXNFBEAgBUHYAGogFRC1AwsgBSoCXCAFKgJkXkEBc0UEQCAUIBMQtQMLIA0gACAHEJgDIAVBN2ogBUE2akGgwAAQigEaIAUtADYiDSAFLQA3cgRAIAZBBUEGIAdBAXEbNgKUOgsCQAJAIA0EQAJAIAcNACAGLQDdB0UNACAFIAEpAgAiFjcDECAFIBY3AyggBUHQAGogACAFQRBqEIIDIAUgBSkDUDcDcBBvQQEhCSAFLQA3IQggBS0ANiEKDAILIAVByABqIBEgEBA4IAVBOGogCCAYEEEgBUEgaiAIIBkQQSAFQUBrIAVBOGogBUEgaiAKEPUBIAVB0ABqIAVByABqIAVBQGsQLyAAIAVB0ABqIAogCyAOEJQHCyAFLQA2IQogBS0ANyEIIAdFDQAgCCAKckH/AXFFDQELIAQgB0ECdGpBIEEfQR4gCEH/AXEbIAobQwAAgD8QNzYCAAsgB0EBaiIHIANHDQALCyAMBEAgDEECdCEBQQAhBwNAIAVB2ABqIAAgByAXQwAAgEAQkwcgBUHYAGogACAHQQRqEJgDIAVBQGsgBUE4akEgEIoBGgJAAkACQCAFLQBABEAgBioCyDNDCtcjPV4NAQsgBS0AOEUNAiAGQQRBAyAHQQFxGzYClDoMAQsgBS0AOCEDIAZBBEEDIAdBAXEbNgKUOiADRQ0BCyACIAc2AgAgBSAAKQIMNwNoIAVB0ABqEDQhAwJAAkACQAJAAkAgBw4EAAECAwQLIAVByABqQwAAAABDAAAAABAqGiAFIAUpA0g3A1AgBSAGKgLkASAGKgLwM5NDAACAQJI4AmwMAwsgBUHIAGpDAACAP0MAAAAAECoaIAUgBSkDSDcDUCAFIAYqAuABIAYqAuwzk0MAAIBAkjgCaAwCCyAFQcgAakMAAAAAQwAAgD8QKhogBSAFKQNINwNQIAUgBioC5AEgBioC8DOTQwAAgECSOAJsDAELIAVByABqQwAAAABDAAAAABAqGiAFIAUpA0g3A1AgBSAGKgLgASAGKgLsM5NDAACAQJI4AmgLIAAgBUHoAGogAyALIA4QlAcLIAdBAWoiByABRw0ACwsQcgJAIAYoAvQ1IgFFDQAgASgC/AUgAEcNACAFQdgAahA0IQECfQJAAkAgBigC3DUiCEEDRgR/IAYtAPkBRQ0BIAVB6ABqQQFBAEMAAAAAQwAAAAAQjAEgBSAFKQNoNwNYIAYoAtw1BSAIC0EERg0BCyAFKgJYDAELIAVB6ABqQQJBAEMAAAAAQwAAAAAQjAEgBSAFKQNoIhY3A1ggFqe+C0MAAAAAWwRAIAEqAgRDAAAAAFsNAQsgASAGKgIYQwAAFkSUIAYqAqQBIAYqAqgBEECUEEwQkAUgBkEBOgCXNiAGQQA6AIg2IARBIEMAAIA/EDc2AgAgBUEYaiAAQRxqIAEQLyAFIAUpAxg3AwggBUHoAGogACAFQQhqEIIDIAUgBSkDaDcDcAsgBSoCcEP//39/XARAIAAgBSkDcDcCHCAAEIwDCyALKgIAQ///f39cBEAgBUHYAGogCxB/IAAgBSkDWDcCDCAAEIwDCyAAQoCAgIAQNwKwAiAAIAApAhw3AhQLIAVBgAFqJAAgCQu5AQEBfyMAQUBqIgMkAAJAAkBBkLYDKAIALQCwAUUNACAALQAIQQFxDQAgA0E4aiAAKgIUIAAQgAIQKhoMAQsgAyAAKQIUNwM4CyADQShqIAFBCGogAhA4IANBEGogAEEMaiADQThqEC8gA0EIaiABIAIQLyADQRhqIANBEGogA0EIahC0ASADQSBqIANBGGogA0E4ahA4IANBMGogA0EoaiADQSBqEMUEIAAgAykDMDcCDCADQUBrJAALowEAIAAgAjYC+AUgACAANgKEBiAAIAA2AoAGIAAgADYC/AUgAUGAgIAIcUUgAkUgAUGAgIAQcXJyRQRAIAAgAigC/AU2AvwFCyABQYCAgMAAcSABQYCAgChxRSACRXJyRQRAIAAgAigCgAY2AoAGCyAALQAKQYABcQRAIAItAApBgAFxBEADQCACKAL4BSICLQAKQYABcQ0ACwsgACACNgKEBgsL6QMCBH8CfiMAQRBrIgMkAEGQtgMoAgAhBUG0BhBLIgQgBSAAEKMTIAMgBDYCDCAEIAI2AgggBUGcM2ogBCgCBCAEEO0DIANDAABwQkMAAHBCECoaIAQgAykDADcCDAJAIAJBgAJxDQAgBCgCBBCbBSIARQ0AIAVBlNoAaiAAEKoHIQQgAygCDCIGIAQ2AvgEIAZBBEEAEKAFIAMgAEEIahB/IAMoAgwiBCADKQMANwIMIAQgAC0AGDoAfSAAQRBqIgAQ9wFDrMUnN15BAXMNACADIAAQfyABIAMpAwA3AgALIAMgARB/IAMoAgwiACADKQMAIgc3AhQgACAHNwIcIAAgACkCDCIINwLgASAAIAg3AtgBAkAgAkHAAHEEQCAAQQA6AJgBIABCgoCAgCA3ApABDAELIAenvkMAAAAAX0EBc0UEQCAAQQI2ApABCyAHQiCIp75DAAAAAF9BAXNFBEAgAEECNgKUAQsgACAAKAKQAUEATAR/IAAoApQBQQBKBUEBCzoAmAELIAVB+DJqIANBDGoQdiAFQewyaiEAAkAgAkGAwABxBEAgA0EMaiEBIAAoAgBFBEAgACABEHYMAgsgACAAKAIIIAEQuAoMAQsgACADQQxqEHYLIAMoAgwhACADQRBqJAAgAAsiAQF+IAEgAq0gA61CIIaEIAQgABEjACIFQiCIpxAZIAWnC1kBAX8gACAALQBKIgFBf2ogAXI6AEogACgCACIBQQhxBEAgACABQSByNgIAQX8PCyAAQgA3AgQgACAAKAIsIgE2AhwgACABNgIUIAAgASAAKAIwajYCEEEAC0QCAX8BfiABQv///////z+DIQMCfyABQjCIp0H//wFxIgJB//8BRwRAQQQgAg0BGkECQQMgACADhFAbDwsgACADhFALC+sCAQt/IwBBEGshASAAQgA3AgAgAEIANwIgIABCADcCGCAAQgA3AhAgAEIANwIIQfjPBCgCAEUEQEGE0ARCfzcCAEH8zwRCgKCAgICABDcCAEH4zwQgAUEMakFwcUHYqtWqBXM2AgBBjNAEQQA2AgBB3M8EQQA2AgALQbjMBCgCACIJBEBB4M8EIQJBASEHQazMBCgCACIKQShqIgMhBANAIAIoAgAiBUF4IAVrQQdxQQAgBUEIakEHcRtqIQEgBSACKAIEaiELA0ACQCABIAlGIAEgC09yDQAgASgCBCIGQQdGDQAgBkF4cSIIQQAgBkEDcUEBRiIGGyAEaiEEIAMgCGohAyAGIAdqIQcgASAIaiIBIAVPDQELCyACKAIIIgINAAsgACAHNgIEIAAgAzYCACAAQdDPBCgCACIBIANrNgIQQdTPBCgCACECIAAgCjYCJCAAIAQ2AiAgACABIARrNgIcIAAgAjYCFAsLrgcBCX8gACgCBCIHQQNxIQIgACAHQXhxIgZqIQRBsMwEKAIAIQUCQCACRQRAQQAhAiABQYACSQ0BIAYgAUEEak8EQCAAIQIgBiABa0GA0AQoAgBBAXRNDQILQQAPCwJAIAYgAU8EQCAGIAFrIgJBEEkNASAAIAdBAXEgAXJBAnI2AgQgACABaiIBIAJBA3I2AgQgBCAEKAIEQQFyNgIEIAEgAhC4BwwBC0EAIQIgBEG4zAQoAgBGBEBBrMwEKAIAIAZqIgUgAU0NAiAAIAdBAXEgAXJBAnI2AgQgACABaiICIAUgAWsiAUEBcjYCBEGszAQgATYCAEG4zAQgAjYCAAwBCyAEQbTMBCgCAEYEQEGozAQoAgAgBmoiBSABSQ0CAkAgBSABayICQRBPBEAgACAHQQFxIAFyQQJyNgIEIAAgAWoiASACQQFyNgIEIAAgBWoiBSACNgIAIAUgBSgCBEF+cTYCBAwBCyAAIAdBAXEgBXJBAnI2AgQgACAFaiIBIAEoAgRBAXI2AgRBACECQQAhAQtBtMwEIAE2AgBBqMwEIAI2AgAMAQsgBCgCBCIDQQJxDQEgA0F4cSAGaiIJIAFJDQEgCSABayEKAkAgA0H/AU0EQCAEKAIIIgYgA0EDdiIFQQN0QcjMBGpHGiAGIAQoAgwiCEYEQEGgzARBoMwEKAIAQX4gBXdxNgIADAILIAYgCDYCDCAIIAY2AggMAQsgBCgCGCEIAkAgBCAEKAIMIgNHBEAgBSAEKAIIIgJNBEAgAigCDBoLIAIgAzYCDCADIAI2AggMAQsCQCAEQRRqIgIoAgAiBg0AIARBEGoiAigCACIGDQBBACEDDAELA0AgAiEFIAYiA0EUaiICKAIAIgYNACADQRBqIQIgAygCECIGDQALIAVBADYCAAsgCEUNAAJAIAQgBCgCHCIFQQJ0QdDOBGoiAigCAEYEQCACIAM2AgAgAw0BQaTMBEGkzAQoAgBBfiAFd3E2AgAMAgsgCEEQQRQgCCgCECAERhtqIAM2AgAgA0UNAQsgAyAINgIYIAQoAhAiAgRAIAMgAjYCECACIAM2AhgLIAQoAhQiAkUNACADIAI2AhQgAiADNgIYCyAKQQ9NBEAgACAHQQFxIAlyQQJyNgIEIAAgCWoiASABKAIEQQFyNgIEDAELIAAgB0EBcSABckECcjYCBCAAIAFqIgIgCkEDcjYCBCAAIAlqIgEgASgCBEEBcjYCBCACIAoQuAcLIAAhAgsgAgsbACAAIAEoAgggBRBzBEAgASACIAMgBBCkBQsLOAAgACABKAIIIAUQcwRAIAEgAiADIAQQpAUPCyAAKAIIIgAgASACIAMgBCAFIAAoAgAoAhQRDgALlgIBBn8gACABKAIIIAUQcwRAIAEgAiADIAQQpAUPCyABLQA1IQcgACgCDCEGIAFBADoANSABLQA0IQggAUEAOgA0IABBEGoiCSABIAIgAyAEIAUQogUgByABLQA1IgpyIQcgCCABLQA0IgtyIQgCQCAGQQJIDQAgCSAGQQN0aiEJIABBGGohBgNAIAEtADYNAQJAIAsEQCABKAIYQQFGDQMgAC0ACEECcQ0BDAMLIApFDQAgAC0ACEEBcUUNAgsgAUEAOwE0IAYgASACIAMgBCAFEKIFIAEtADUiCiAHciEHIAEtADQiCyAIciEIIAZBCGoiBiAJSQ0ACwsgASAHQf8BcUEARzoANSABIAhB/wFxQQBHOgA0C5IBACAAIAEoAgggBBBzBEAgASACIAMQowUPCwJAIAAgASgCACAEEHNFDQACQCACIAEoAhBHBEAgASgCFCACRw0BCyADQQFHDQEgAUEBNgIgDwsgASACNgIUIAEgAzYCICABIAEoAihBAWo2AigCQCABKAIkQQFHDQAgASgCGEECRw0AIAFBAToANgsgAUEENgIsCwvzAQAgACABKAIIIAQQcwRAIAEgAiADEKMFDwsCQCAAIAEoAgAgBBBzBEACQCACIAEoAhBHBEAgASgCFCACRw0BCyADQQFHDQIgAUEBNgIgDwsgASADNgIgAkAgASgCLEEERg0AIAFBADsBNCAAKAIIIgAgASACIAJBASAEIAAoAgAoAhQRDgAgAS0ANQRAIAFBAzYCLCABLQA0RQ0BDAMLIAFBBDYCLAsgASACNgIUIAEgASgCKEEBajYCKCABKAIkQQFHDQEgASgCGEECRw0BIAFBAToANg8LIAAoAggiACABIAIgAyAEIAAoAgAoAhgRDQALC6UEAQR/IAAgASgCCCAEEHMEQCABIAIgAxCjBQ8LAkAgACABKAIAIAQQcwRAAkAgAiABKAIQRwRAIAEoAhQgAkcNAQsgA0EBRw0CIAFBATYCIA8LIAEgAzYCICABKAIsQQRHBEAgAEEQaiIFIAAoAgxBA3RqIQggAQJ/AkADQAJAIAUgCE8NACABQQA7ATQgBSABIAIgAkEBIAQQogUgAS0ANg0AAkAgAS0ANUUNACABLQA0BEBBASEDIAEoAhhBAUYNBEEBIQdBASEGIAAtAAhBAnENAQwEC0EBIQcgBiEDIAAtAAhBAXFFDQMLIAVBCGohBQwBCwsgBiEDQQQgB0UNARoLQQMLNgIsIANBAXENAgsgASACNgIUIAEgASgCKEEBajYCKCABKAIkQQFHDQEgASgCGEECRw0BIAFBAToANg8LIAAoAgwhBiAAQRBqIgUgASACIAMgBBCLBCAGQQJIDQAgBSAGQQN0aiEGIABBGGohBQJAIAAoAggiAEECcUUEQCABKAIkQQFHDQELA0AgAS0ANg0CIAUgASACIAMgBBCLBCAFQQhqIgUgBkkNAAsMAQsgAEEBcUUEQANAIAEtADYNAiABKAIkQQFGDQIgBSABIAIgAyAEEIsEIAVBCGoiBSAGSQ0ADAILAAsDQCABLQA2DQEgASgCJEEBRgRAIAEoAhhBAUYNAgsgBSABIAIgAyAEEIsEIAVBCGoiBSAGSQ0ACwsLmwEBAn8CQANAIAFFBEBBAA8LIAFB/K0DEMcBIgFFDQEgASgCCCAAKAIIQX9zcQ0BIAAoAgwgASgCDEEAEHMEQEEBDwsgAC0ACEEBcUUNASAAKAIMIgNFDQEgA0H8rQMQxwEiAwRAIAEoAgwhASADIQAMAQsLIAAoAgwiAEUNACAAQeyuAxDHASIARQ0AIAAgASgCDBC6ByECCyACC+cDAQR/IwBBQGoiBSQAAkAgAUHsrwNBABBzBEAgAkEANgIAQQEhAwwBCyAAIAEQpAsEQEEBIQMgAigCACIARQ0BIAIgACgCADYCAAwBCwJAIAFFDQAgAUH8rQMQxwEiAUUNASACKAIAIgQEQCACIAQoAgA2AgALIAEoAggiBCAAKAIIIgZBf3NxQQdxIARBf3MgBnFB4ABxcg0BQQEhAyAAKAIMIAEoAgxBABBzDQEgACgCDEHMrwNBABBzBEAgASgCDCIARQ0CIABBsK4DEMcBRSEDDAILIAAoAgwiBEUNAEEAIQMgBEH8rQMQxwEiBARAIAAtAAhBAXFFDQIgBCABKAIMEKILIQMMAgsgACgCDCIERQ0BIARB7K4DEMcBIgQEQCAALQAIQQFxRQ0CIAQgASgCDBC6ByEDDAILIAAoAgwiAEUNASAAQZytAxDHASIERQ0BIAEoAgwiAEUNASAAQZytAxDHASIARQ0BIAVBCGpBBHJBAEE0EE8aIAVBATYCOCAFQX82AhQgBSAENgIQIAUgADYCCCAAIAVBCGogAigCAEEBIAAoAgAoAhwRCAAgAigCAEUgBSgCICIAQQFHckUEQCACIAUoAhg2AgALIABBAUYhAwwBC0EAIQMLIAVBQGskACADCz8AAkAgACABIAAtAAhBGHEEf0EBBUEAIQAgAUUNASABQcytAxDHASIBRQ0BIAEtAAhBGHFBAEcLEHMhAAsgAAtvAQJ/IAAgASgCCEEAEHMEQCABIAIgAxClBQ8LIAAoAgwhBCAAQRBqIgUgASACIAMQuwcCQCAEQQJIDQAgBSAEQQN0aiEEIABBGGohAANAIAAgASACIAMQuwcgAS0ANg0BIABBCGoiACAESQ0ACwsLMgAgACABKAIIQQAQcwRAIAEgAiADEKUFDwsgACgCCCIAIAEgAiADIAAoAgAoAhwRCAALGQAgACABKAIIQQAQcwRAIAEgAiADEKUFCwuhAQEBfyMAQUBqIgMkAAJ/QQEgACABQQAQcw0AGkEAIAFFDQAaQQAgAUGcrQMQxwEiAUUNABogA0EIakEEckEAQTQQTxogA0EBNgI4IANBfzYCFCADIAA2AhAgAyABNgIIIAEgA0EIaiACKAIAQQEgASgCACgCHBEIACADKAIgIgBBAUYEQCACIAMoAhg2AgALIABBAUYLIQAgA0FAayQAIAALCgAgACABQQAQcwsMACAAEKYFGiAAEE0LCQAgABCmBRBNCywBAX8CfyAAKAIAQXRqIgAiASABKAIIQX9qIgE2AgggAUF/TAsEQCAAEE0LCwYAQY6rAwsyAQF/IwBBEGsiASQAIAFBCGogACgCBBBYKAIAQQE6AAAgACgCCEEBOgAAIAFBEGokAAsuAQF/AkAgACgCCCIALQAAIgFBAUcEfyABQQJxDQEgAEECOgAAQQEFQQALDwsACzMBAn8jAEEQayIBJAAgAUEIaiAAKAIEEFgoAgAtAABFBEAgABCvCyECCyABQRBqJAAgAgvbAQEDfyMAQRBrIgckAEFvIgggAUF/c2ogAk8EQCAAEC4hCQJ/IAhBAXZBcGogAUsEQCAHIAFBAXQ2AgggByABIAJqNgIMIAdBDGogB0EIahCOAygCABCsBQwBCyAIQX9qC0EBaiIIEKcFIQIgBQRAIAIgBiAFEI4ECyADIARrIgMiBgRAIAIgBWogBCAJaiAGEI4ECyABQQpHBEAgCRBNCyAAIAIQqwUgACAIEKoFIAAgAyAFaiIAEI8EIAdBADoAByAAIAJqIAdBB2oQtAQgB0EQaiQADwsQrQUAC4YBAQR/IwBBEGsiBCQAAkAgABC9ByIDIAJPBEAgABAuIgUhBiACIgMEQCAGIAEgAxCuAQsgBEEAOgAPIAIgBWogBEEPahC0BAJAIAAQ3gIEQCAAIAIQjwQMAQsgACACELUECwwBCyAAIAMgAiADayAAEJEDIgAgACACIAEQsQsLIARBEGokAAs4AQJ/IAEQayICQQ1qEL4BIgNBADYCCCADIAI2AgQgAyACNgIAIAAgA0EMaiABIAJBAWoQPjYCAAu2AwIDfwF+IwBBIGsiAyQAAkAgAUL///////////8AgyIFQoCAgICAgMC/QHwgBUKAgICAgIDAwL9/fFQEQCABQhmIpyECIABQIAFC////D4MiBUKAgIAIVCAFQoCAgAhRG0UEQCACQYGAgIAEaiECDAILIAJBgICAgARqIQIgACAFQoCAgAiFhEIAUg0BIAJBAXEgAmohAgwBCyAAUCAFQoCAgICAgMD//wBUIAVCgICAgICAwP//AFEbRQRAIAFCGYinQf///wFxQYCAgP4HciECDAELQYCAgPwHIQIgBUL///////+/v8AAVg0AQQAhAiAFQjCIpyIEQZH+AEkNACADQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiBSAEQf+Bf2oQlwEgAyAAIAVBgf8AIARrEIQDIAMpAwgiAEIZiKchAiADKQMAIAMpAxAgAykDGIRCAFKthCIFUCAAQv///w+DIgBCgICACFQgAEKAgIAIURtFBEAgAkEBaiECDAELIAUgAEKAgIAIhYRCAFINACACQQFxIAJqIQILIANBIGokACACIAFCIIinQYCAgIB4cXK+C8cBAgN/An4jAEEQayIDJAACfiABvCIEQf////8HcSICQYCAgHxqQf////cHTQRAIAKtQhmGQoCAgICAgIDAP3wMAQsgAkGAgID8B08EQCAErUIZhkKA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QRBrIgAkACAAIAE2AgwgARDZCSAAQRBqJAAgAUEQaiQACyIBAX8jAEEQayIBJAAgASAAEC42AgAgARDaCSABQRBqJAALNQEBfyMAQSBrIgIkACACQRBqIAAQ5QEgAiABEC42AgAgAkEQakGE5QIgAhCwBiACQSBqJAALJQEBfyMAQRBrIgEkACABIAAQLjYCAEGE5QIgARBZIAFBEGokAAuDAQEDfyMAQSBrIgEkACABQQhqIAAQ0wMgAUEIaiABQRhqQeriAhCTASICEOYBIQMgAhArIAFBCGoQKwJAIAMEQCAAEIQBIQBBkLYDKAIAKAKsMyAAEJgDIQAMAQsgAUEIaiAAEJEBIAFBCGoQLhD+BiEAIAFBCGoQNQsgAUEgaiQAIAALbgEDfyMAQSBrIgEkACABQQhqIAAQ0wMgAUEIaiABQRhqQeriAhCTASICEOYBIQMgAhArIAFBCGoQKwJAIAMEQCAAEIQBENIBDAELIAFBCGogABCRASABQQhqEC4QvAEgAUEIahA1CyABQSBqJAALLAEBfyMAQRBrIgEkACABIAAoAhAQkQEgAEEEaiABENoCIAEQNSABQRBqJAALIgEBfyMAQRBrIgEkACAAQgA3AgAgAEEANgIIIAFBEGokAAsvACAAQdTkAjYCACAAQQRqENsNIAAgATYCECABEFBFBEAgACAAKAIAKAIAEQEACwssAQF/IwBBIGsiAyQAIAAgA0EIaiABEDsiABA6IAIQxAogABA5IANBIGokAAslAQF/IwBBEGsiASQAIAFBCGogABAyIAFBCGoQggQgAUEQaiQACzEBAX8jAEEQayICJAAgAkEIahCDByAAIAJBCGogAiABEFsiABB9IAAQKyACQRBqJAALPQECfyMAQRBrIgIkACACQQhqEGQiA0HYAWogA0EMahA4IAAgAkEIaiACIAEQWyIAEH0gABArIAJBEGokAAslAQF/IwBBEGsiASQAIAFBCGogABAyIAFBCGoQ4AogAUEQaiQACzEBAX8jAEEQayICJAAgAkEIahDjCiAAIAJBCGogAiABEFsiABB9IAAQKyACQRBqJAALJQEBfyMAQRBrIgEkACABQQhqIAAQMiABQQhqEKwGIAFBEGokAAskAQF/IwBBEGsiASQAIAEgABDlASABEO8BIQAgAUEQaiQAIAALMQEBfyMAQRBrIgIkACACQQhqEIQHIAAgAkEIaiACIAEQWyIAEH0gABArIAJBEGokAAsvAQF/IwBBEGsiASQAIAFBkLYDKAIAKALEMTYCDCAAIAFBDGoQjwMaIAFBEGokAAs0AQF/IwBBEGsiAiQAIAJBkLYDKAIAIAFBBHRqQcQrajYCDCAAIAJBDGoQnwggAkEQaiQAC1gBA38jAEEQayICJAAgAiABENMDIAIgAkEIakHq4gIQkwEiAxDmASEEIAMQKyACECsCQCAEBEAgACABEDMQhQQMAQsgAiABEDIgACACEKoCCyACQRBqJAALaQEDfyMAQSBrIgIkACACQQhqIAEQ0wMgAkEIaiACQRhqQeriAhCTASIDEOYBIQQgAxArIAJBCGoQKwJAIAQEQCAAIAEQ2wMQ7woMAQsgAkEIaiABEOUBIAAgAkEIahD2AQsgAkEgaiQACyoBAX8jAEEQayIBJAAgAUH14QI2AgBBtNQCIAEQywMgABB7IAFBEGokAAsmAQF/IwBBEGsiACQAIABB8eACNgIAQbTUAiAAEMsDIABBEGokAAs9AQF/IwBBEGsiAyQAIAAQLiEAIANBCGogARAyIANBCGohASAAEK0CIgAEQCAAIAEgAhCfBQsgA0EQaiQAC9QBAQR/IwBBEGsiAiQAAkBBkLYDKAIAIgAoArgzBEAgACgC0DMQngICQCAALQDoAUUNACAAKAK4MygC/AUhASAAQeABaiIDEIMBRQ0AIAJBCGogAyAAQewzahA4AkAgASoCDCACKgIIWwRAIAEqAhAgAioCDFsNAQsgARCMAyABIAJBCGpBARDZAgsgACgCuDMQbgwCCxBvIABBADYCuDMMAQsgACgC9DMiAUUNACABKAJIIgEgACgC0DNHDQAgARCeAiAALQDoAQ0AEG8LIAJBEGokAAs9AQF/IwBBEGsiAyQAIAAQLiEAIANBCGogARAyIANBCGohASAAEK0CIgAEQCAAIAEgAhDZAgsgA0EQaiQACzIBAX8jAEEQayICJAAgAkEIaiAAEDJBkLYDKAIAKAKsMyACQQhqIAEQnwUgAkEQaiQACykBAX8jAEEQayICJAAgAkEIaiAAEDIQZCACQQhqIAEQ2QIgAkEQaiQAC0EBAX8jAEEQayIBJAAgAUEIaiAAEDJBkLYDKAIAIgAgACgCkDRBBHI2ApA0IABBuDRqIAEpAgg3AwAgAUEQaiQACyoBAX8jAEEQayICJAAgAEGkxAIgAkEIaiABEHcQAzYCACACQRBqJAAgAAtFAQF/IwBBEGsiASQAIAEgADYCDCABQQhqQeDCBCgCAEHMAGogASABQQxqEPINIgAQ3AIgAUEIahArIAAQKyABQRBqJAALBwAgABDzDQtnAQF/IwBBEGsiAyQAAkAgAhBQRQRAQeDCBCgCAEHMAGogAhBsIANBCGogABAyIAMgARAyIANBCGogA0GvBhDIAwwBCyADQQhqIAAQMiADIAEQMiADQQhqIANBABDIAwsgA0EQaiQACycBAX8jAEEQayICJAAgAkEIaiAAEDIgAkEIaiABEJkEIAJBEGokAAsvAQF/IwBBEGsiAyQAIANBCGogABAyIAMgAhAyIANBCGogASADEKsCIANBEGokAAuUAQEDfwJAQZC2AygCAEHsMmoiAhBwKAIAIgEgAEYNACABKAL8BSAARg0AIAIoAgAiAUECSA0AIAFBfmohAQNAIAAgAiABEEgoAgBGBEAgAiABEEggAiABQQFqEEggAigCACABQX9zakECdBCuASACIAIoAgBBf2oQSCAANgIADwsgAUEASiEDIAFBf2ohASADDQALCwszAQF/IwBBEGsiAiQAIAIQZCkCFDcCCCAAIAJBCGogAiABEFsiABB9IAAQKyACQRBqJAALPAEBfyMAQRBrIgIkACACQZC2AygCACgCrDMpAgw3AgggACACQQhqIAIgARBbIgAQfSAAECsgAkEQaiQACykBAX8jAEEQayIBJAAgARA2KAL8BDYCDCAAIAFBDGoQzgUgAUEQaiQACzEBAX8jAEEQayICJAAgAkEIahCFByAAIAJBCGogAiABEFsiABB9IAAQKyACQRBqJAALPQECfyMAQRBrIgIkACACQQhqEGQiA0GgBGogA0EMahA4IAAgAkEIaiACIAEQWyIAEH0gABArIAJBEGokAAsxAQF/IwBBEGsiAiQAIAJBCGoQhgQgACACQQhqIAIgARBbIgAQfSAAECsgAkEQaiQACzEBAX8jAEEQayICJAAgAkEIahCLBSAAIAJBCGogAiABEFsiABB9IAAQKyACQRBqJAALpgEBA38jAEEgayIEJAAgBEEQaiAAENMDIARBEGogBEEIakHA3wIQkwEiBRDmASEGIAUQKyAEQRBqECsCQCAGBEAgBEEQaiAAEJEBIARBEGoQLiEAIARBCGogARAyIAAQNiAAEFUgBEEIaiACIAMQmwchACAEQRBqEDUMAQsgABDbAyEAIARBEGogARAyIAAgBEEQaiACIAMQmgchAAsgBEEgaiQAIAALhwEBA38CQEGQtgMoAgBB+DJqIgIQcCgCACAARg0AIAIoAgAiAUECSA0AIAFBfmohAQNAIAAgAiABEEgoAgBGBEAgAiABEEggAiABQQFqEEggAigCACABQX9zakECdBCuASACIAIoAgBBf2oQSCAANgIADwsgAUEASiEDIAFBf2ohASADDQALCwsyAQF/IwBBEGsiAyQAIAAQLiADIAEQugIiABA/IAIQ/wEhASAAEIECGiADQRBqJAAgAQtEAgJ/AXwjAEEQayIBJAAgACgCAEHM3QIoAgAgAUEEahAEIQMgASABKAIEEFghACADEIMCIQIgABCeASABQRBqJAAgAgsoAQF/IwBBEGsiASQAIAEgABC6AiIAED8QvgogABCBAhogAUEQaiQACyoBAX8jAEEQayICJAAgAiAANgIMIAJBDGogAS0AABDcASACQRBqJAAgAAspAQF/IwBBEGsiAiQAIABB+K8DIAJBCGogARCFDhADNgIAIAJBEGokAAsJACAAEIECEE0LJgEBfyMAQRBrIgEkACABIAAQugIiABA/GiAAEIECGiABQRBqJAALKAEBfyMAQRBrIgIkACAAQbDSAiACQQhqIAEQdxADNgIAIAJBEGokAAs5AQJ/IwBBEGsiASQAIAFBkLYDKAIAIgJB3DdqQQAgAi0A3DcbNgIMIAAgAUEMahCJDiABQRBqJAALKAEBfyMAQRBrIgIkACAAQZzdAiACQQhqIAEQdxADNgIAIAJBEGokAAsmAQF/IwBBEGsiASQAIAEQjQM2AgwgACABQQxqEIsOIAFBEGokAAsoAQF/IwBBEGsiAiQAIABBuNsCIAJBCGogARB3EAM2AgAgAkEQaiQACyYBAX8jAEEQayIBJAAgARDUAzYCDCAAIAFBDGoQjQ4gAUEQaiQACzYBAX8jAEEQayIDJAAgAyAANgIMIANBDGogARB6ENwBIANBDGogAhCUAxDcASADQRBqJAAgAAs6AQF/IwBBIGsiBCQAIARBCGogAiADEI8OIQIgACABKAIAQQJBhN4CIAJBrAYRBwAQWBogBEEgaiQACzUBAX8jAEEQayIDJAAgAyACENgFIQIgACABKAIAQQFBgN4CIAJBrAYRBwAQWBogA0EQaiQAC2sBAn8jAEEgayIAJABB4MIEKAIAIgFBQGsiAhBQRQRAIABBCGogAiABQcgAahCRDiAAQRBqIABBCGoQkQEgAUE0aiAAQRBqENoCIABBEGoQNSAAQQhqECsLIAFBNGoQLiEBIABBIGokACABC04BAn8jAEEQayIAJABB4MIEKAIAIgJBNGoiAyABENIFIAJBxABqIgEQUEUEQCAAQQhqIAEgAkHIAGogAxCQDiAAQQhqECsLIABBEGokAAuXAwECf0HI9gAQSxDFDyEBQZC2AygCAEUEQCABEJsCCyABEL0PIAAgATYCACAAQQRqQfzdAhCQARogAEEQakH83QIQkAEaIABBHGoQeyAAQSBqEHsgAEEkahB7IABBKGoQeyAAQSxqEHsgAEEwahB7IABBNGpB/N0CEJABGiAAQUBrEHsgAEHEAGoQeyAAQcgAahB7IABBzABqEI0BIABB0ABqEI0BIABB1ABqEI0BIABB2ABqEI0BIABB3ABqEI0BIABB4ABqEI0BIABB5ABqEI0BIABBADYCaCAAQewAakH83QIQkAEaIABB+ABqEI0BIABB/ABqEI0BIABBgAFqEI0BIABBADYChAEgAEGIAWpB/N0CEJABGiAAQZQBahCNASAAQZgBahCNASAAQQA2ApwBIABBoAFqQfzdAhCQARogAEGsAWoQjQEgAEGwAWoQjQEgAEG0AWoQjQFBkLYDKAIAIQIgACgCABCbAhDUAyIBQQA2AsgBIAFBrQY2AsQBIAFBrgY2AsABIAFCADcDGCACEJsCIAALNwEBfyAAKAIEIgNBAXUgAWohASAAKAIAIQAgASACIANBAXEEfyABKAIAIABqKAIABSAACxEUAAs9AQF/IwBBEGsiBCQAIAAoAgAhACAEQQhqIAMQLSABIAIgBEEIaiAAEQUAIQAgBEEIahArIARBEGokACAAC0YBAX8jAEEQayIDJAAgAUEvTQRAIAMgAhDlASAAIAFBBHRqIgAgAykDCDcCtAEgACADKQMANwKsAQsgA0EQaiQAIAFBMEkLKAEBfyMAQRBrIgIkACAAQcTBAiACQQhqIAEQdxADNgIAIAJBEGokAAtBAQF/IwBBEGsiAyQAAkAgAkEvTQRAIAMgASACQQR0akGsAWo2AgwgACADQQxqEJgODAELIAAQjQELIANBEGokAAsoAQF/IwBBEGsiAiQAIAIgAUGYAWo2AgwgACACQQxqEHUgAkEQaiQACygBAX8jAEEQayICJAAgAiABQZABajYCDCAAIAJBDGoQdSACQRBqJAALKAEBfyMAQRBrIgIkACACIAFBiAFqNgIMIAAgAkEMahB1IAJBEGokAAsoAQF/IwBBEGsiAiQAIAIgAUGAAWo2AgwgACACQQxqEHUgAkEQaiQACygBAX8jAEEQayICJAAgAiABQdgAajYCDCAAIAJBDGoQdSACQRBqJAALKAEBfyMAQRBrIgIkACACIAFB0ABqNgIMIAAgAkEMahB1IAJBEGokAAsoAQF/IwBBEGsiAiQAIAIgAUHIAGo2AgwgACACQQxqEHUgAkEQaiQACycBAX8jAEEQayICJAAgAiABQThqNgIMIAAgAkEMahB1IAJBEGokAAslAQF9QwAAgL8hAiABQRVNBH0gACABQQJ0akHQKGoqAgAFIAILCyYBAX1DAACAvyECIAFB/wNNBH0gACABQQJ0akHQCGoqAgAFIAILC0ABAX8jAEEQayIDJAACQCACQQRNBEAgAyABIAJBA3RqQfwGajYCDCAAIANBDGoQdQwBCyAAEI0BCyADQRBqJAALKAEBfyMAQRBrIgIkACACIAFB7AZqNgIMIAAgAkEMahB1IAJBEGokAAsuAQF/IwBBEGsiAyQAIAAoAgAhACADIAIQQiABIAMgABEAACADEDUgA0EQaiQACxAAIAEgAiADIAAoAgARIgALMAIBfwF9IwBBEGsiAyQAIAMgASACIAAoAgARDwA4AgwgAyoCDCEEIANBEGokACAECw4AIAEgAiAAKAIAEQIACygBAX8jAEEQayICJAAgAiABQdgBajYCDCAAIAJBDGoQdSACQRBqJAALKAEBfyMAQRBrIgIkACACIAFBnAFqNgIMIAAgAkEMahB1IAJBEGokAAs7AQF/IwBBEGsiAiQAIAIgASgCmAEiATYCDAJAIAFFBEAgABB7DAELIAAgAkEMahCPAxoLIAJBEGokAAsoAQF/IwBBEGsiAiQAIABBsNkCIAJBCGogARB3EAM2AgAgAkEQaiQACzoBAX8jAEEQayICJAAg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AGoQ4AIgAEGU2gBqEEUaIABBiNoAahBFGiAAQfzZAGoQ4AIgAEHU2QBqEEUaIABB0NgAahDxBBogAEHcO2oQswogAEHIO2oQRRogAEG8O2oQRRogAEGcO2oiARCyCiABQQxqEOACIAEQRRogAEGIO2oQRRogAEGcOWoQwAQaIABBpDhqEMAEGiAAQYg4aiICQRhqIQEDQCABQXRqEEUiASACRw0ACyAAQdw3ahDjBhogAEGoNWoQRRogAEGcNWoQRRogAEGQNWoQRRogAEGENWoQRRogAEH4NGoQRRogAEGcM2oQ4AIgAEGQM2oQRRogAEGEM2oQRRogAEH4MmoQRRogAEHsMmoQRRogAEEIahDiBhogAAsoAQF/IAAgASgCADYCACABKAIAIQMgACABNgIIIAAgAiADajYCBCAACz8BAX8jAEEQayIBJAAgABBTGiABQX82AgwgAUH/////BzYCCCABQQxqIAFBCGoQrQQoAgAhACABQRBqJAAgAAsmACAAKAIAGiAAKAIAIAAQ2wJqGiAAKAIAGiAAKAIAIAAQmwFqGgtVAQF/IAAQlQggABBTIAAoAgAgACgCBCABQQRqIgIQrgQgACACEMoBIABBBGogAUEIahDKASAAEFMgARDLARDKASABIAEoAgQ2AgAgACAAEJsBEMgOC10BAn8jAEEQayICJAAgAiAAQQhqIAEQyg4iASgCACABKAIERwRAA0AgACgCEBogASgCABCRCCABIAEoAgBBAWoiAzYCACADIAEoAgRHDQALCyABEK8EIAJBEGokAAt3AQJ/IwBBEGsiBCQAIARBADYCDCAAQQxqIARBDGogAxCwBCABBEAgACgCEBpBfyABIgNJBEBBz70CEN0CAAsgAxC+ASEFCyAAIAU2AgAgACACIAVqIgI2AgggACACNgIEIAAQywEgASAFajYCACAEQRBqJAAgAAtbAQJ/IwBBEGsiAiQAIAIgATYCDCAAEMsOIgMgAU8EQCAAENsCIgAgA0EBdkkEQCACIABBAXQ2AgggAkEIaiACQQxqEI4DKAIAIQMLIAJBEGokACADDwsQjQQAC3QBA38jAEEQayIDJAACfyADIgIgADYCACACIAAoAgQiBDYCBCACIAEgBGo2AgggAiIBKAIEIAEoAghHCwRAA0AgABBTGiABKAIEEJEIIAEgASgCBEEB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QawGEQcAEFgaIARBIGokAAtvAQN/IwBBIGsiAiQAIAJBCGoiAUIANwIAIAFCADcCECABQgA3AgggAUG7EDYCAEG7EEEAEPIBIQMgAUEENgIQIAFBBTYCDCABQQY2AgggASADNgIEIABBiNoAaiABEPUOIABBAToAACACQSBqJAALKgEBfyMAQRBrIgIkACAAQdTGAiACQQhqIAEQdxADNgIAIAJBEGokACAAC5QBAQN/IwBBIGsiAiQAIAJBADYCHCACIAAoAggiAzYCGCAAEP0DIANHBEADQCACQRBqIAEgAkEIaiACQRhqEL4PIgMgAiACQRxqEJ4IIgQQvA8gAkEQahArIAQQKyADECsgAiACKAIcIAIoAhgiAygCAGo2AhwgAiADQShqIgM2AhggABD9AyADRw0ACwsgAkEgaiQACygBAX8jAEEQayICJAAgAiABKAIUNgIMIAAgAkEMahBnGiACQRBqJAALKAEBfyMAQRBrIgIkACACIAFBBGo2AgwgACACQQxqEJ8IIAJBEGokAAs5AQF/IAAoAgQiBEEBdSABaiEBIAAoAgAhACABIAIgAyAEQQFxBH8gASgCACAAaigCAAUgAAsRFwALNQEBfyMAQRBrIgMkACADIAE2AgwgAyACOAIIIANBDGogA0EIaiAAEQIAIQAgA0EQaiQAIAALKQEBfyMAQRBrIgIkACACIAE2AgwgAkEMaiAAEQMAIQAgAkEQaiQAIAAL8gkCB38BfiMAQRBrIgEkACAAQQhqEJYJIABBmCpqEOMIGiAAQdAxahCuCiECIABB7DJqEEQaIABB+DJqEEQaIABBhDNqEEQaIABBkDNqEEQaIABBnDNqEJsDIABB7DNqEDQhBiAAQZA0ahC3DyAAQeg0ahCSAhogAEH4NGoQRBogAEGENWoQRBogAEGQNWoQRBogAEGcNWoQRBogAEGoNWoQRBogAEHgNWoQViEFIABBoDZqEFYaIABByDZqENsFIABB8DZqENsFIABBmDdqENsFIABB3DdqEKUPIABBiDhqIgNBGGohBANAIAMQREEMaiIDIARHDQALIABBpDhqIAIQ7gUaIABBnDlqIAIQ7gUaIABBqDpqEKIHIABB4DpqEFYaIABBiDtqEEQaIABBnDtqIgIQRBogAkEMahCbAyACQQA2AhggAEG8O2oQRBogAEHIO2oQRBogAEHUO2oQNCECIABB3DtqEJwPIABB0NgAahDJBiAAQbDZAGoQkgIaIABB1NkAahBEGiAAQeTZAGoQNCEDIABB7NkAahA0IQQgAEH82QBqEJsDIABBiNoAahBEGiAAQZTaAGoQRBogAEGs2gBqEJsDIABBADoAAiAAQQA7AQAgAEEANgLMMSAAQgA3AsQxIABBAToAA0HcABBLEJ0KIQcgAEF/NgLoMiAAQgA3A9gyIABCADcC5DMgAEKAgICAcDcD4DIgAEIANwOoMyAAQgA3AsQzIAAgBzYClAEgAEGwM2pCADcDACAAQbgzakIANwMAIABBwDNqQQA6AAAgAEHMM2pCADcCACAAQdQzakIANwIAIABB2TNqQgA3AAAgAUMAAIC/QwAAgL8QKhogBiABKQMANwIAIABBADYCjDQgAEIANwKENCAAQgA3AvQzIABB+jNqQgA3AQAgAEG0NWpBAEEsEE8aIAEQVhogBSABKQMINwIIIAUgASkDADcCACAAQgA3A/A1IABCgICAgPD/////ADcCjDYgAEH4NWpCADcDACAAQYA2akIANwMAIABBiDZqQQA6AAAgAEIANwK0NiAAQQA7AbA2IABBADYCnDYgAEEBOgCWNiAAQQA7AZQ2IABBfzYCxDYgAEEANgCXNiAAQn83Arw2IABCADcDwDcgAEL/////9/////8ANwPINyAAQv/////3/////wA3A9A3IABBADYCoDggAEEAOgCZOiAAQQA2ApQ6IABByDlqQbYhNgIAIABB0DhqQakhNgIAIABBADoA2DcgAEF/NgKkOiAAQoCAgIBwNwKcOiAAQQA6AJg6IABCADcD8DogAEH4OmpCADcDACAAQYA7akKAgICAcDcDACAAQgA3ApQ7IABBADYCuDsgAUMAAAAAQwAAAAAQKhogAiABKQMANwIAIABBADYC4FkgAEIANwLMWSAAQoCAgICg4fWRPDcCxFkgAEEAOgDAWSAAQoCAgICAgIDICjcDqFkgAUP//39/Q///f38QKhogBCABKQMAIgg3AgAgAyAINwIAIABBAjYCyFogAEEAOgC8WiAAQf////sHNgK4WiAAQgA3AqRaIABBADoAoFogAEEANgL4WSAAQQA6APRZIABCgICAgCA3A8BaIABBzNoAakEAQegDEE8aIABBfzYCvF4gAEJ/NwK0XiAAQcDeAGpBAEGBGBBPGiABQRBqJAAgAAsnAQF/IwBBEGsiAiQAIAIgAUEUajYCDCAAIAJBDGoQdSACQRBqJAALJwEBfyMAQRBrIgIkACACIAFBDGo2AgwgACACQQxqEHUgAkEQaiQACycBAX8jAEEQayICJAAgAiABQQRqNgIMIAAgAkEMahB1IAJBEGokAAswAQF/IwBBEGsiBCQAIAAoAgAhACAEIAMQQiABIAIgBCAAEQYAIAQQNSAEQRBqJAALNwECfyMAQRBrIgIkACAAKAIUIQMgAiABEJEBIAMgAhAuIAAoAhxBf2oQkgQgAhA1IAJBEGokAAsqAQF/IwBBEGsiAiQAIAIgADYCDCACQQxqIAEQlAMQ3AEgAkEQaiQAIAALKgEBfyMAQRBrIgIkACAAIAIgASgCFBCQASIAENUDGiAAEDUgAkEQaiQAC5cBAQF/IwBBMGsiBiQAIAAoAgAhACAGQSBqIAEQLSAGQRhqIAIQLSAGQRBqIAMQLSAGQQhqIAQQLSAGIAUQLSAGQShqIAZBIGogBkEYaiAGQRBqIAZBCGogBiAAEQ4AIAZBKGoQeiEAIAZBKGoQKyAGECsgBkEIahArIAZBEGoQKyAGQRhqECsgBkEgahArIAZBMGokACAAC0UBAX8jAEEQayIDJAAgACgCACEAIANBCGogARAtIAMgAhAtIANBCGogAyAAEQIAIQAgAxArIANBCGoQKyADQRBqJAAgAAthAQF/IwBBIGsiAyQAIAAoAgAhACADQRBqIAEQLSADQQhqIAIQLSADQRhqIANBEGogA0EIaiAAEQYAIANBGGoQeiEAIANBGGoQKyADQQhqECsgA0EQahArIANBIGokACAAC20BAX8jAEEgayIEJAAgACgCACEAIARBEGogARAtIARBCGogAhAtIAQgAxAtIARBGGogBEEQaiAEQQhqIAQgABEIACAEQRhqEHohACAEQRhqECsgBBArIARBCGoQKyAEQRBqECsgBEEgaiQAIAALNwEBfyMAQRBrIgIkACACIAA2AgwgAigCDCABKgIAOAIAIAIgAigCDEEIajYCDCACQRBqJAAgAAurAgECf0GQtgMoAgAhAiAAKAIAEJsCENQDIgFBADYCyAEgAUIANwPAASABQgA3AxggAhCbAiAAKAIAEOsOIABBADYCACAAQbQBahArIABBsAFqECsgAEGsAWoQKyAAQaABahA1IABBmAFqECsgAEGUAWoQKyAAQYgBahA1IABBgAFqECsgAEH8AGoQKyAAQfgAahArIABB7ABqEDUgAEHkAGoQKyAAQeAAahArIABB3ABqECsgAEHYAGoQKyAAQdQAahArIABB0ABqECsgAEHMAGoQKyAAQcgAahArIABBxABqECsgAEFAaxArIABBNGoQNSAAQTBqECsgAEEsahArIABBKGoQKyAAQSRqECsgAEEgahArIABBHGoQKyAAQRBqEDUgAEEEahA1IAALWAEBfyMAQSBrIgQkACAEQRhqIAEQLSAEQRBqIAIQLSAEQQhqIAMQLSAEQRhqIARBEGogBEEIaiAAEQYAIARBCGoQKyAEQRBqECsgBEEYahArIARBIGokAAtAAQF/IwBBEGsiBCQAIAQgAxAtIARBCGogASACIAQgABErACAEQQhqEHohACAEQQhqECsgBBArIARBEGokACAAC0ABAX8jAEEQayIEJAAgBEEIaiABEC0gBCACEC0gBEEIaiAEIAMgABEFACEAIAQQKyAEQQhqECsgBEEQaiQAIAALCwAgASACIAARRgALLQEBfyMAQRBrIgQkACAEIAEgAiADIAARPwA2AgwgBCgCDCEAIARBEGokACAACwsAIAEgAiAAEQIAC14BAX8jAEEgayIHJAAgB0EYaiAEEC0gB0EQaiAFEC0gB0EIaiAGEC0gASACIAMgB0EYaiAHQRBqIAdBCGogABEdACAHQQhqECsgB0EQahArIAdBGGoQKyAHQSBqJAALPgEBfyMAQRBrIgMkACADIAIQLSADQQhqIAEgAyAAEQYAIANBCGoQeiEAIANBCGoQKyADECsgA0EQaiQAIAALDQAgASACIAMgABEFAAs+AQF/IwBBEGsiBSQAIAVBCGogAxAtIAUgBBAtIAEgAiAFQQhqIAUgABEuACAFECsgBUEIahArIAVBEGokAAtVAQF/IwBBIGsiBSQAIAVBCGogARBCIAUgBBAtIAVBGGogBUEIaiACIAMgBSAAERwAIAVBGGoQeiEAIAVBGGoQKyAFECsgBUEIahA1IAVBIGokACAACyoBAX8jAEEQayICJAAgAiABIAARAAAgAhCUAyEAIAIQNSACQRBqJAAgAAspAgF/AXwjAEEQayIBJAAgASAAEV0A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aiAGEC0gCkEQaiAHEC0gCkEIaiAIEC0gCiAJEC0gCkEwaiAKQShqIApBIGogBCAFIApBGGogCkEQaiAKQQhqIAogABEnACAKECsgCkEIahArIApBEGoQKyAKQRhqECsgCkEgahArIApBKGoQKyAKQTBqEDUgCkFAayQAC5QBAQF/IwBBMGsiCCQAIAhBKGogARAtIAhBIGogAhAtIAhBGGogAxAtIAhBEGogBBAtIAhBCGogBhAtIAggBxAtIAhBKGogCEEgaiAIQRhqIAhBEGogBSAIQQhqIAggABELACEAIAgQKyAIQQhqECsgCEEQahArIAhBGGoQKyAIQSBqECsgCEEoahArIAhBMGokACAAC44BAQF/IwBBMGsiByQAIAdBKGogARAtIAdBIGogAhAtIAdBGGogAxAtIAdBEGogBBAtIAdBCGogBRAtIAcgBhAtIAdBKGogB0EgaiAHQRhqIAdBEGogB0EIaiAHIAARDgAgBxArIAdBCGoQKyAHQRBqECsgB0EYahArIAdBIGoQKyAHQShqECsgB0EwaiQACykBAX8jAEEQayICJAAgAiABEEIgAiAAEQMAIQAgAhA1IAJBEGokACAAC0cBAX8jAEEgayIDJAAgA0EQaiABEEIgA0EIaiACEC0gA0EQaiADQQhqIAARAgAhACADQQhqECsgA0EQahA1IANBIGokACAACzoBAX8jAEEgayIDJAAgA0EQaiABEEIgAyACEEIgA0EQaiADIAARAAAgAxA1IANBEGoQNSADQSBqJAALQwEBfyMAQSBrIgMkACADQRhqIAEQLSADQQhqIAIQQiADQRhqIANBCGogABEAACADQQhqEDUgA0EYahArIANBIGokAAsLACABIAIgABEUAAsrAgF/AX0jAEEQayICJAAgAiABIAAREwA4AgwgAioCDCEDIAJBEGokACADCycBAX8jAEEQayIBJAAgASAAEQkANgIMIAEoAgwhACABQRBqJAAgAAsyAQF/IwBBEGsiBCQAIARBCGogAhAtIAEgBEEIaiADIAARBgAgBEEIahArIARBEGokAAs8AQF/IwBBEGsiAiQAIAJBCGogARAtIAIgAkEIaiAAEQMANgIMIAIoAgwhACACQQhqECsgAkEQaiQAIAALPgEBfyMAQRBrIgMkACADQQhqIAIQLSADIAEgA0EIaiAAEQIANgIMIAMoAgwhACADQQhqECsgA0EQaiQAIAALMAEBfyMAQRBrIgMkACADQQhqIAIQLSABIANBCGogABEAACADQQhqECsgA0EQaiQACwsAIAEgAiAAETkACykBAX8jAEEQayIEJAAgBCABEEIgBCACIAMgABEGACAEEDUgBEEQaiQAC0UBAX8jAEEgayIEJAAgBEEQaiABEEIgBEEIaiACEC0gBEEQaiAEQQhqIAMgABEGACAEQQhqECsgBEEQahA1IARBIGokAAsLACABIAIgABEAAAtkAQF/IwBBIGsiBSQAIAVBGGogARAtIAVBEGogAhAtIAVBCGogAxAtIAUgBBAtIAVBGGogBUEQaiAFQQhqIAUgABEIACAFECsgBUEIahArIAVBEGoQKyAFQRhqECsgBUEgaiQACzABAX8jAEEQayIDJAAgA0EIaiABEC0gA0EIaiACIAARAAAgA0EIahArIANBEGokAAs8AQF/IwBBEGsiBCQAIARBCGogARAtIAQgAxAtIARBCGogAiAEIAARBgAgBBArIARBCGoQKyAEQRBqJAALCQAgASAAERUACykCAX8BfSMAQRBrIgEkACABIAAREgA4AgwgASoCDCECIAFBEGokACACCzwBAX8jAEEQayICJAAgAiABEC0gAkEIaiACIAARAAAgAkEIahB6IQAgAkEIahArIAIQKyACQRBqJAAgAAtCAQF/IwBBEGsiBSQAIAVBCGogARAtIAUgAhAtIAVBCGogBSADIAQgABEHACEAIAUQKyAFQQhqECsgBUEQaiQAIAALKAEBfyMAQRBrIgEkACABIAARAQAgARCUAyEAIAEQNSABQRBqJAAgAAslAQF/IwBBEGsiAiQAIAIgARBCIAIgABEBACACEDUgAkEQaiQACy4BAX8jAEEQayICJAAgAkEIaiABEC0gAkEIaiAAEQEAIAJBCGoQKyACQRBqJAALBwAgABEEAAs1AQF/IwBBEGsiCCQAIAggARBCIAggAiADIAQgBSAGIAcgABELACEAIAgQNSAIQRBqJAAgAAsJACAAEOAHEEYLKgEBfyMAQRBrIgAkAEGbvQJBAkHw/gJBmMMCQaoGQccFEAEgAEEQaiQACwkAIAAgARD2CwsqAQF/IwBBEGsiACQAQYW9AkEEQeD+AkHAwwJBqQZBxgUQASAAQRBqJAAL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chNXAAWCSr+VFHq44q4rsXs4G7YMm47Skg2+1eW379x8Id/bC9TS04ZC4tTx+LPdaG6D2h/NFr6BWya59uF3sG93R7cY5loIiHBqD//KOwZmXAsBEf+eZY9prmL40/9rYUXPbBZ44gqg7tIN11SDBE7CswM5YSZnp/cWYNBNR2lJ23duPkpq0a7cWtbZZgvfQPA72DdTrrypxZ673n/Pskfp/7UwHPK9vYrCusowk7NTpqO0JAU20LqTBtfNKVfeVL9n2SMuemazuEphxAIbaF2UK28qN74LtKGODMMb3wVaje8CLQAjTU9WRQAxLjcxAERlYnVnIyNEZWZhdWx0AFdpbmRvdwAuLi4AQdIQCxOAPwAAgD8AAIC/AACAvwAAAAADAEHuEAsPgD8AAIA/AACAvwMAAAAGAEGKEQvnBYA/AACAPwYAAAAJAAAAAACAPwAAAAAAAIC/AACAPwkAAAAMAAAAVGV4dABUZXh0RGlzYWJsZWQAV2luZG93QmcAQ2hpbGRCZwBQb3B1cEJnAEJvcmRlcgBCb3JkZXJTaGFkb3cARnJhbWVCZwBGcmFtZUJnSG92ZXJlZABGcmFtZUJnQWN0aXZlAFRpdGxlQmcAVGl0bGVCZ0FjdGl2ZQBUaXRsZUJnQ29sbGFwc2VkAE1lbnVCYXJCZwBTY3JvbGxiYXJCZwBTY3JvbGxiYXJHcmFiAFNjcm9sbGJhckdyYWJIb3ZlcmVkAFNjcm9sbGJhckdyYWJBY3RpdmUAQ2hlY2tNYXJrAFNsaWRlckdyYWIAU2xpZGVyR3JhYkFjdGl2ZQBCdXR0b24AQnV0dG9uSG92ZXJlZABCdXR0b25BY3RpdmUASGVhZGVyAEhlYWRlckhvdmVyZWQASGVhZGVyQWN0aXZlAFNlcGFyYXRvcgBTZXBhcmF0b3JIb3ZlcmVkAFNlcGFyYXRvckFjdGl2ZQBSZXNpemVHcmlwAFJlc2l6ZUdyaXBIb3ZlcmVkAFJlc2l6ZUdyaXBBY3RpdmUAVGFiAFRhYkhvdmVyZWQAVGFiQWN0aXZlAFRhYlVuZm9jdXNlZABUYWJVbmZvY3VzZWRBY3RpdmUAUGxvdExpbmVzAFBsb3RMaW5lc0hvdmVyZWQAUGxvdEhpc3RvZ3JhbQBQbG90SGlzdG9ncmFtSG92ZXJlZABUZXh0U2VsZWN0ZWRCZwBEcmFnRHJvcFRhcmdldABOYXZIaWdobGlnaHQATmF2V2luZG93aW5nSGlnaGxpZ2h0AE5hdldpbmRvd2luZ0RpbUJnAE1vZGFsV2luZG93RGltQmcAVW5rbm93bgAjI1Rvb2x0aXBfJTAyZAAjI01lbnVfJTAyZAAjI1BvcHVwXyUwOHgAd2luZG93X2NvbnRleHQAdm9pZF9jb250ZXh0AEGAFwuEBAMAAAABAAAAAAAAAAIAAAABAAAAAwAAAAIAAAAAAAAAY29sdW1ucwAjU291cmNlRXh0ZXJuAAolKnMlLipzACUqcyUuKnMAICUuKnMACgBhYgBMb2dCdXR0b25zAExvZyBUbyBUVFkATG9nIFRvIEZpbGUATG9nIFRvIENsaXBib2FyZABEZWZhdWx0IERlcHRoAHJiAHd0AERlYXIgSW1HdWkgTWV0cmljcwBEZWFyIEltR3VpICVzAEFwcGxpY2F0aW9uIGF2ZXJhZ2UgJS4zZiBtcy9mcmFtZSAoJS4xZiBGUFMpACVkIHZlcnRpY2VzLCAlZCBpbmRpY2VzICglZCB0cmlhbmdsZXMpACVkIGFjdGl2ZSB3aW5kb3dzICglZCB2aXNpYmxlKQAlZCBhY3RpdmUgYWxsb2NhdGlvbnMAV2luZG93cwBEcmF3TGlzdABBY3RpdmUgRHJhd0xpc3RzICglZCkAUG9wdXBzAFBvcHVwcyAoJWQpAFBvcHVwSUQ6ICUwOHgsIFdpbmRvdzogJyVzJyVzJXMATlVMTAAgQ2hpbGRXaW5kb3cAIENoaWxkTWVudQBUYWJCYXJzAFRhYiBCYXJzICglZCkASW50ZXJuYWwgc3RhdGUATm9uZQBNb3VzZQBOYXYATmF2S2V5Ym9hcmQATmF2R2FtZXBhZABBkBsL4AZfDQAAZA0AAGoNAABuDQAAeg0AAEhvdmVyZWRXaW5kb3c6ICclcycASG92ZXJlZFJvb3RXaW5kb3c6ICclcycASG92ZXJlZElkOiAweCUwOFgvMHglMDhYICglLjJmIHNlYyksIEFsbG93T3ZlcmxhcDogJWQAQWN0aXZlSWQ6IDB4JTA4WC8weCUwOFggKCUuMmYgc2VjKSwgQWxsb3dPdmVybGFwOiAlZCwgU291cmNlOiAlcwBBY3RpdmVJZFdpbmRvdzogJyVzJwBNb3Zp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AAEAAgACAAEABAABAAEAAQABAAUACgABAAIAEwACAAEAAgABAAIAAQACAAEAAgABAAUAAQAGAAMAAgABAAIAAgABAAEAAQAEAAgABQABAAEABAABAAEAAwABAAIAAQAFAAEAAgABAAEAAQAKAAEAAQAFAAIABAAGAAEABAACAAIAAgAMAAIAAQABAAYAAQABAAEABAABAAEABAAGAAUAAQAEAAIAAgAEAAoABwABAAEABAACAAQAAgABAAQAAwAGAAoADAAFAAcAAgAOAAIACQABAAEABgAHAAoABAAHAA0AAQAFAAQACAAEAAEAAQACABwABQAGAAEAAQAFAAIABQAUAAIAAgAJAAgACwACAAkAEQABAAgABgAIABsABAAGAAkAFAALABsABgBEAAIAAgABAAEAAQACAAEAAgACAAcABgALAAMAAwABAAEAAwABAAIAAQABAAEAAQABAAMAAQABAAgAAwAEAAEABQAHAAIAAQAEAAQACAAEAAIAAQACAAEAAQAEAAUABgADAAYAAgAMAAMAAQADAAkAAgAEAAMABAABAAUAAwADAAEAAwAHAAEABQABAAEAAQABAAIAAwAEAAUAAgADAAIABgABAAEAAgABAAcAAQAHAAMABAAFAA8AAgACAAEABQADABYAEwACAAEAAQABAAEAAgAFAAEAAQABAAYAAQABAAwACAACAAkAEgAWAAQAAQABAAUAAQAQAAEAAgAHAAoADwABAAEABgACAAQAAQACAAQAAQAGAAEAAQADAAIABAABAAYABAAFAAEAAgABAAEAAgABAAoAAwABAAMAAgABAAkAAwACAAUABwACABMABAADAAYAAQABAAEAAQABAAQAAwACAAEAAQABAAIABQADAAEAAQABAAIAAgABAAEAAgABAAEAAgABAAMAAQABAAEAAwAHAAEABAABAAEAAgABAAEAAgABAAIABAAEAAMACAABAAEAAQACAAEAAwAFAAEAAwABAAMABAAGAAIAAgAOAAQABgAGAAsACQABAA8AAwABABwABQACAAUABQADAAEAAwAEAAUABAAGAA4AAwACAAMABQAVAAIABwAUAAoAAQACABMAAgAEABwAHAACAAMAAgABAA4ABAABABoAHAAqAAwAKAADADQATwAFAA4AEQADAAIAAgALAAMABAAGAAMAAQAIAAIAFwAEAAUACAAKAAQAAgAHAAMABQABAAEABgADAAEAAgACAAIABQAcAAEAAQAHAAcAFAAFAAMAHQADABEAGgABAAgABAAbAAMABgALABcABQADAAQABgANABgAEAAGAAUACgAZACMABwADAAIAAwADAA4AAwAGAAIABgABAAQAAgADAAgAAgABAAEAAwADAAMABAABAAEADQACAAIABAAFAAIAAQAOAA4AAQACAAIAAQAEAAUAAgADAAEADgADAAwAAwARAAIAEAAFAAEAAgABAAgACQADABMABAACAAIABAARABkAFQAUABwASwABAAoAHQBnAAQAAQACAAEAAQAEAAIABAABAAIAAwAYAAIAAgACAAEAAQACAAEAAwAIAAEAAQABAAIAAQABAAMAAQABAAEABgABAAUAAwABAAEAAQADAAQAAQABAAUAAgABAAUABgANAAkAEAABAAEAAQABAAMAAgADAAIABAAFAAIABQACAAIAAwAHAA0ABwACAAIAAQABAAEAAQACAAMAAwACAAEABgAEAAkAAgABAA4AAgAOAAIAAQASAAMABAAOAAQACwApAA8AFwAPABcAsAABAAMABAABAAEAAQABAAUAAwABAAIAAwAHAAMAAQABAAIAAQACAAQABAAGAAIABAABAAkABwABAAoABQAIABAAHQABAAEAAgACAAMAAQADAAUAAgAEAAUABAABAAEAAgACAAMAAwAHAAEABgAKAAEAEQABACwABAAGAAIAAQABAAYABQAEAAIACgABAAYACQACAAgAAQAYAAEAAgANAAcACAAIAAIAAQAEAAEAAwABAAMAAwAFAAIABQAKAAkABAAJAAwAAgABAAYAAQAKAAEAAQAHAAcABAAKAAgAAwABAA0ABAADAAEABgABAAMABQACAAEAAgARABAABQACABAABgABAAQAAgABAAMAAwAGAAgABQALAAsAAQADAAMAAgAEAAYACgAJAAUABwAEAAcABAAHAAEAAQAEAAIAAQADAAYACAAHAAEABgALAAUABQADABgACQAEAAIABwANAAUAAQAIAFIAEAA9AAEAAQABAAQAAgACABAACgADAAgAAQABAAYABAACAAEAAwABAAEAAQAEAAMACAAEAAIAAgABAAEAAQABAAEABgADAAUAAQABAAQABgAJAAIAAQABAAEAAgABAAcAAgABAAYAAQAFAAQABAADAAEACAABAAMAAwABAAMAAgACAAIAAgADAAEABgABAAIAAQACAAEAAwAHAAEACAACAAEAAgABAAUAAgAFAAMABQAKAAEAAgABAAEAAwACAAUACwADAAkAAwAFAAEAAQAFAAkAAQACAAEABQAHAAkACQAIAAEAAwADAAMABgAIAAIAAwACAAEAAQAgAAYAAQACAA8ACQADAAcADQABAAMACgANAAIADgABAA0ACgACAAEAAwAKAAQADwACAA8ADwAKAAEAAwAJAAYACQAgABkAGgAvAAcAAwACAAMAAQAGAAMABAADAAIACAAFAAQAAQAJAAQAAgACABMACgAGAAIAAwAIAAEAAgACAAQAAgABAAkABAAEAAQABgAEAAgACQACAAMAAQABAAEAAQADAAUABQABAAMACAAEAAYAAgABAAQADAABAAUAAwAHAA0AAgAFAAgAAQAGAAEAAgAFAA4ABgABAAUAAgAEAAgADwAFAAEAFwAGAD4AAgAKAAEAAQAIAAEAAgACAAoABAACAAIACQACAAEAAQADAAIAAwABAAUAAwADAAIAAQADAAgAAQABAAEACwADAAEAAQAEAAMABwABAA4AAQACAAMADAAFAAIABQABAAYABwAFAAcADgALAAEAAwABAAgACQAMAAIAAQALAAgABAAEAAIABgAKAAkADQABAAEAAwABAAUAAQADAAIABAAEAAEAEgACAAMADgALAAQAHQAEAAIABwABAAMADQAJAAIAAgAFAAMABQAUAAcAEAAIAAUASAAiAAYABAAWAAwADAAcAC0AJAAJAAcAJwAJAL8AAQABAAEABAALAAgABAAJAAIAAwAWAAEAAQABAAEABAARAAEABwAHAAEACwAfAAoAAgAEAAgAAgADAAIAAQAEAAIAEAAEACAAAgADABMADQAEAAkAAQAFAAIADgAIAAEAAQADAAYAEwAGAAUAAQAQAAYAAgAKAAgABQABAAIAAwABAAUABQABAAsABgAGAAEAAwADAAIABgADAAgAAQABAAQACgAHAAUABwAHAAUACAAJAAIAAQADAAQAAQABAAMAAQADAAMAAgAGABAAAQAEAAYAAwABAAoABgABAAMADwACAAkAAgAKABkADQAJABAABgACAAIACgALAAQAAwAJAAEAAgAGAAYABQAEAB4AKAABAAoABwAMAA4AIQAGAAMABgAHAAMAAQADAAEACwAOAAQACQAFAAwACwAxABIAMwAfAIwAHwACAAIAAQAFAAEACAABAAoAAQAEAAQAAwAYAAEACgABAAMABgAGABAAAwAEAAUAAgABAAQAAgA5AAoABgAWAAIAFgADAAcAFgAGAAoACwAkABIAEAAhACQAAgAFAAUAAQABAAEABAAKAAEABAANAAIABwAFAAIACQADAAQAAQAHACsAAwAHAAMACQAOAAcACQABAAsAAQABAAMABwAEABIADQABAA4AAQADAAYACgBJAAIAAgAeAAYAAQALABIAEwANABYAAwAuACoAJQBZAAcAAwAQACIAAgACAAMACQABAAcAAQABAAEAAgACAAQACgAHAAMACgADAAkABQAcAAkAAgAGAA0ABwADAAEAAwAKAAIABwACAAsAAwAGABUANgBVAAIAAQAEAAIAAgABACcAAwAVAAIAAgAFAAEAAQABAAQAAQABAAMABAAPAAEAAwACAAQABAACAAMACAACABQAAQAIAAcADQAEAAEAGgAGAAIACQAiAAQAFQA0AAoABAAEAAEABQAMAAIACwABAAcAAgAeAAwALAACAB4AAQABAAMABgAQAAkAEQAnAFIAAgACABgABwABAAcAAwAQAAkADgAsAAIAAQACAAEAAgADAAUAAgAEAAEABgAHAAUAAwACAAYAAQALAAUACwACAAEAEgATAAgAAQADABgAHQACAAEAAwAFAAIAAgABAA0ABgAFAAEALgALAAMABQABAAEABQAIAAIACgAGAAwABgADAAcACwACAAQAEAANAAIABQABAAEAAgACAAUAAgAcAAUAAgAXAAoACAAEAAQAFgAnAF8AJgAIAA4ACQAFAAEADQAFAAQAAwANAAwACwABAAkAAQAbACUAAgAFAAQABAA/ANMAXwACAAIAAgABAAMABQACAAEAAQACAAIAAQABAAEAAwACAAQAAQACAAEAAQAFAAIAAgABAAEAAgADAAEAAwABAAEAAQADAAEABAACAAEAAwAGAAEAAQADAAcADwAFAAMAAgAFAAMACQALAAQAAgAWAAEABgADAAgABwABAAQAHAAEABAAAwADABkABAAEABsAGwABAAQAAQACAAIABwABAAMABQACABwACAACAA4AAQAIAAYAEAAZAAMAAwADAA4AAwADAAEAAQACAAEABAAGAAMACAAEAAEAAQABAAIAAwAGAAoABgACAAMAEgADAAIABQAFAAQAAwABAAUAAgAFAAQAFwAHAAYADAAGAAQAEQALAAkABQABAAEACgAFAAwAAQABAAsAGgAhAAcAAwAGAAEAEQAHAAEABQAMAAEACwACAAQAAQAIAA4AEQAXAAEAAgABAAcACAAQAAsACQAGAAUAAgAGAAQAEAACAAgADgABAAsACAAJAAEAAQABAAkAGQAEAAsAEwAHAAIADwACAAwACAA0AAcABQATAAIAEAAEACQACAABABAACAAYABoABAAGAAIACQAFAAQAJAADABwADAAZAA8AJQAbABEADAA7ACYABQAgAH8AAQACAAkAEQAOAAQAAQACAAEAAQAIAAsAMgAEAA4AAgATABAABAARAAUABAAFABoADAAtAAIAFwAtAGgAHgAMAAgAAwAKAAIAAgADAAMAAQAEABQABwACAAkABgAPAAIAFAABAAMAEAAEAAsADwAGAIYAAgAFADsAAQACAAIAAgABAAkAEQADABoAiQAKANMAOwABAAIABAABAAQAAQABAAEAAgAGAAIAAwABAAEAAgADAAIAAwABAAMABAAEAAIAAwADAAEABAADAAEABwACAAIAAwABAAIAAQADAAMAAwACAAIAAwACAAEAAwAOAAYAAQADAAIACQAGAA8AGwAJACIAkQABAAEAAgABAAEAAQABAAIAAQABAAEAAQACAAIAAgADAAEAAgABAAEAAQACAAMABQAIAAMABQACAAQAAQADAAIAAgACAAwABAABAAEAAQAKAAQABQABABQABAAQAAEADwAJAAUADAACAAkAAgAFAAQAAgAaABMABwABABoABAAeAAwADwAqAAEABgAIAKwAAQABAAQAAgABAAEACwACAAIABAACAAEAAgABAAoACAABAAIAAQAEAAUAAQACAAUAAQAIAAQAAQADAAQAAgABAAYAAgABAAMABAABAAIAAQABAAEAAQAMAAUABwACAAQAAwABAAEAAQADAAMABgABAAIAAgADAAMAAwACAAEAAgAMAA4ACwAGAAYABAAMAAIACAABAAcACgABACMABwAEAA0ADwAEAAMAFwAVABwANAAFABoABQAGAAEABwAKAAIABwA1AAMAAgABAAEAAQACAKMAFAIBAAoACwABAAMAAwAEAAgAAgAIAAYAAgACABcAFgAEAAIAAgAEAAIAAQADAAEAAwADAAUACQAIAAIAAQACAAgAAQAKAAIADAAVABQADwBpAAIAAwABAAEAAwACAAMAAQABAAIABQABAAQADwALABMAAQABAAEAAQAFAAQABQABAAEAAgAFAAMABQAMAAEAAgAFAAEACwABAAEADwAJAAEABAAFAAMAGgAIAAIAAQADAAEAAQAPABMAAgAMAAEAAgAFAAIABwACABMAAgAUAAYAGgAHAAUAAgACAAcAIgAVAA0ARgACAIAAAQABAAIAAQABAAIAAQABAAMAAgACAAIADwABAAQAAQADAAQAKgAKAAYAAQAxAFUACAABAAIAAQABAAQABAACAAMABgABAAUABwAEAAMA0wAEAAEAAgABAAIABQABAAIABAACAAIABgAFAAYACgADAAQAMABkAAYAAgAQACgBBQAbAIMBAgACAAMABwAQAAgABQAmAA8AJwAVAAkACgADAAcAOwANABsAFQAvAAUAFQAGAEGw2AALFCAA/wAAIG8gADD/MPAx/zEA/+//AEHS2AALsR4BAAIABAABAAEAAQABAAIAAQAGAAIAAgABAAgABQAHAAsAAQACAAoACgAIAAIABAAUAAIACwAIAAIAAQACAAEABgACAAEABwAFAAMABwABAAEADQAHAAkAAQAEAAYAAQACAAEACgABAAEACQACAAIABAAFAAYADgABAAEACQADABIABQAEAAIAAgAKAAcAAQABAAEAAwACAAQAAwAXAAIACgAMAAIADgACAAQADQABAAYACgADAAEABwANAAYABAANAAUAAgADABEAAgACAAUABwAGAAQAAQAHAA4AEAAGAA0ACQAPAAEAAQAHABAABAAHAAEAEwAJAAIABwAPAAIABgAFAA0AGQAEAA4ADQALABkAAQABAAEAAgABAAIAAgADAAoACwADAAMAAQABAAQABAACAAEABAAJAAEABAADAAUABQACAAcADAALAA8ABwAQAAQABQAQAAIAAQABAAYAAwADAAEAAQACAAcABgAGAAcAAQAEAAcABgABAAEAAgABAAwAAwADAAkABQAIAAEACwABAAIAAwASABQABAABAAMABgABAAcAAwAFAAUABwACAAIADAADAAEABAACAAMAAgADAAsACAAHAAQAEQABAAkAGQABAAEABAACAAIABAABAAIABwABAAEAAQADAAEAAgAGABAAAQACAAEAAQADAAwAFAACAAUAFAAIAAcABgACAAEAAQABAAEABgACAAEAAgAKAAEAAQAGAAEAAwABAAIAAQAEAAEADAAEAAEAAwABAAEAAQABAAEACgAEAAcABQANAAEADwABAAEAHgALAAkAAQAPACYADgABACAAEQAUAAEACQAfAAIAFQAJAAQAMQAWAAIAAQANAAEACwAtACMAKwA3AAwAEwBTAAEAAwACAAMADQACAAEABwADABIAAwANAAgAAQAIABIABQADAAcAGQAYAAkAGAAoAAMAEQAYAAIAAQAGAAIAAwAQAA8ABgAHAAMADAABAAkABwADAAMAAwAPABUABQAQAAQABQAMAAsACwADAAYAAwACAB8AAwACAAEAAQAXAAYABgABAAQAAgAGAAUAAgABAAEAAwADABYAAgAGAAIAAwARAAMAAgAEAAUAAQAJAAUAAQABAAYADwAMAAMAEQACAA4AAgAIAAEAFwAQAAQAAgAXAAgADwAXABQADAAZABMALwALABUAQQAuAAQAAwABAAUABgABAAIABQAaAAIAAQABAAMACwABAAEAAQACAAEAAgADAAEAAQAKAAIAAwABAAEAAQADAAYAAwACAAIABgAGAAkAAgACAAIABgACAAUACgACAAQAAQACAAEAAgACAAMAAQABAAMAAQACAAkAFwAJAAIAAQABAAEAAQAFAAMAAgABAAoACQAGAAEACgACAB8AGQADAAcABQAoAAEADwAGABEABwAbALQAAQADAAIAAgABAAEAAQAGAAMACgAHAAEAAwAGABEACAAGAAIAAgABAAMABQAFAAgAEAAOAA8AAQABAAQAAQACAAEAAQABAAMAAgAHAAUABgACAAUACgABAAQAAgAJAAEAAQALAAYAAQAsAAEAAwAHAAkABQABAAMAAQABAAoABwABAAoABAACAAcAFQAPAAcAAgAFAAEACAADAAQAAQADAAEABgABAAQAAgABAAQACgAIAAEABAAFAAEABQAKAAIABwABAAoAAQABAAMABAALAAoAHQAEAAcAAwAFAAIAAwAhAAUAAgATAAMAAQAEAAIABgAfAAsAAQADAAMAAwABAAgACgAJAAwACwAMAAgAAwAOAAgABgALAAEABAApAAMAAQACAAcADQABAAUABgACAAYADAAMABYABQAJAAQACAAJAAkAIgAGABgAAQABABQACQAJAAMABAABAAcAAgACAAIABgACABwABQADAAYAAQAEAAYABwAEAAIAAQAEAAIADQAGAAQABAADAAEACAAIAAMAAgABAAUAAQACAAIAAwABAAsACwAHAAMABgAKAAgABgAQABAAFgAHAAwABgAVAAUABAAGAAYAAwAGAAEAAwACAAEAAgAIAB0AAQAKAAEABgANAAYABgATAB8AAQANAAQABAAWABEAGgAhAAoABAAPAAwAGQAGAEMACgACAAMAAQAGAAoAAgAGAAIACQABAAkABAAEAAEAAgAQAAIABQAJAAIAAwAIAAEACAADAAkABAAIAAYABAAIAAsAAwACAAEAAQADABoAAQAHAAUAAQALAAEABQADAAUAAgANAAYAJwAFAAEABQACAAsABgAKAAUAAQAPAAUAAwAGABMAFQAWAAIABAABAAYAAQAIAAEABAAIAAIABAACAAIACQACAAEAAQABAAQAAwAGAAMADAAHAAEADgACAAQACgACAA0AAQARAAcAAwACAAEAAwACAA0ABwAOAAwAAwABAB0AAgAIAAkADwAOAAkADgABAAMAAQAGAAUACQALAAMAJgArABQABwAHAAgABQAPAAwAEwAPAFEACAAHAAEABQBJAA0AJQAcAAgACAABAA8AEgAUAKUAHAABAAYACwAIAAQADgAHAA8AAQADAAMABgAEAAEABwAOAAEAAQALAB4AAQAFAAEABAAOAAEABAACAAcANAACAAYAHQADAAEACQABABUAAwAFAAEAGgADAAsADgALAAEAEQAFAAEAAgABAAMAAgAIAAEAAgAJAAwAAQABAAIAAwAIAAMAGAAMAAcABwAFABEAAwADAAMAAQAXAAoABAAEAAYAAwABABAAEQAWAAMACgAVABAAEAAGAAQACgACAAEAAQACAAgACAAGAAUAAwADAAMAJwAZAA8AAQABABAABgAHABkADwAGAAYADAABABYADQABAAQACQAFAAwAAgAJAAEADAAcAAgAAwAFAAoAFgA8AAEAAgAoAAQAPQA/AAQAAQANAAwAAQAEAB8ADAABAA4AWQAFABAABgAdAA4AAgAFADEAEgASAAUAHQAhAC8AAQARAAEAEwAMAAIACQAHACcADAADAAcADAAnAAMAAQAuAAQADAADAAgACQAFAB8ADwASAAMAAgACAEIAEwANABEABQADAC4AfAANADkAIgACAAUABAAFAAgAAQABAAEABAADAAEAEQAFAAMABQADAAEACAAFAAYAAwAbAAMAGgAHAAwABwACABEAAwAHABIATgAQAAQAJAABAAIAAQAGAAIAAQAnABEABwAEAA0ABAAEAAQAAQAKAAQAAgAEAAYAAwAKAAEAEwABABoAAgAEACEAAgBJAC8ABwADAAgAAgAEAA8AEgABAB0AAgApAA4AAQAVABAAKQAHACcAGQANACwAAgACAAoAAQANAAcAAQAHAAMABQAUAAQACAACADEAAQAKAAYAAQAGAAcACgAHAAsAEAADAAwAFAAEAAoAAwABAAIACwACABwACQACAAQABwACAA8AAQAbAAEAHAARAAQABQAKAAcAAwAYAAoACwAGABoAAwACAAcAAgACADEAEAAKABAADwAEAAUAGwA9AB4ADgAmABYAAgAHAAUAAQADAAwAFwAYABEAEQADAAMAAgAEAAEABgACAAcABQABAAEABQABAAEACQAEAAEAAwAGAAEACAACAAgABAAOAAMABQALAAQAAQADACAAAQATAAQAAQANAAsABQACAAEACAAGAAgAAQAGAAUADQADABcACwAFAAMAEAADAAkACgABABgAAwDGADQABAACAAIABQAOAAUABAAWAAUAFAAEAAsABgApAAEABQACAAIACwAFAAIAHAAjAAgAFgADABIAAwAKAAcABQADAAQAAQAFAAMACAAJAAMABgACABAAFgAEAAUABQADAAMAEgAXAAIABgAXAAUAGwAIAAEAIQACAAwAKwAQAAUAAgADAAYAAQAUAAQAAgAJAAcAAQALAAIACgADAA4AHwAJAAMAGQASABQAAgAFAAUAGgAOAAEACwARAAwAKAATAAkABgAfAFMAAgAHAAkAEwBOAAwADgAVAEwADABxAE8AIgAEAAEAAQA9ABIAVQAKAAIAAgANAB8ACwAyAAYAIQCfALMABgAGAAcABAAEAAIABAACAAUACAAHABQAIAAWAAEAAwAKAAYABwAcAAUACgAJAAIATQATAA0AAgAFAAEABAAEAAcABAANAAMACQAfABEAAwAaAAIABgAGAAUABAABAAcACwADAAQAAgABAAYAAgAUAAQAAQAJAAIABgADAAcAAQABAAEAFAACAAMAAQAGAAIAAwAGAAIABAAIAAEABQANAAgABAALABcAAQAKAAYAAgABAAMAFQACAAIABAAYAB8ABAAKAAoAAgAFAMAADwAEABAABwAJADMAAQACAAEAAQAFAAEAAQACAAEAAwAFAAMAAQADAAQAAQADAAEAAwADAAkACAABAAIAAgACAAQABAASAAwAXAACAAoABAADAA4ABQAZABAAKgAEAA4ABAACABUABQB+AB4AHwACAAEABQANAAMAFgAFAAYABgAUAAwAAQAOAAwAVwADABMAAQAIAAIACQAJAAMAAwAXAAIAAwAHAAYAAwABAAIAAwAJAAEAAwABAAYAAwACAAEAAwALAAMAAQAGAAoAAwACAAMAAQACAAEABQABAAEACwADAAYABAABAAcAAgABAAIABQAFACIABAAOABIABAATAAcABQAIAAIABgBPAAEABQACAA4ACAACAAkAAgABACQAHAAQAAQAAQABAAEAAgAMAAYAKgAnABAAFwAHAA8ADwADAAIADAAHABUAQAAGAAkAHAAIAAwAAwADACkAOwAYADMANwA5ACYBCQAJAAIABgACAA8AAQACAA0AJgBaAAkACQAJAAMACwAHAAEAAQABAAUABgADAAIAAQACAAIAAwAIAAEABAAEAAEABQAHAAEABAADABQABAAJAAEAAQABAAUABQARAAEABQACAAYAAgAEAAEABAAFAAcAAwASAAsACwAgAAcABQAEAAcACwB/AAgABAADAAMAAQAKAAEAAQAGABUADgABABAAAQAHAAEAAwAGAAkAQQAzAAQAAwANAAMACgABAAEADAAJABUAbgADABMAGAABAAEACgA+AAQAAQAdACoATgAcABQAEgBSAAYAAwAPAAYAVAA6AP0ADwCbAAgBDwAVAAkADgAHADoAKAAnAEGQ9wALgwEgAP8AADD/MPAx/zEA/+//IAD/AAAELwXgLf8tQKafpgAAIAD/ABAgXiAADn8OAAAgAP8AAgEDARABEQEoASkBaAFpAaABoQGvAbABoB75HgAAY21hcABsb2NhAGhlYWQAZ2x5ZgBoaGVhAGhtdHgAa2VybgBHUE9TAENGRiAAbWF4cABBoPgAC+QWLi4tICAgICAgICAgLVhYWFhYWFgtICAgIFggICAgLSAgICAgICAgICAgWCAgICAgICAgICAgLVhYWFhYWFggICAgICAgICAgLSAgICAgICAgICBYWFhYWFhYLSAgICAgWFggICAgICAgICAgLi4tICAgICAgICAgLVguLi4uLlgtICAgWC5YICAgLSAgICAgICAgICBYLlggICAgICAgICAgLVguLi4uLlggICAgICAgICAgLSAgICAgICAgICBYLi4uLi5YLSAgICBYLi5YICAgICAgICAgLS0tICAgICAgICAgLVhYWC5YWFgtICBYLi4uWCAgLSAgICAgICAgIFguLi5YICAgICAgICAgLVguLi4uWCAgICAgICAgICAgLSAgICAgICAgICAgWC4uLi5YLSAgICBYLi5YICAgICAgICAgWCAgICAgICAgICAgLSAgWC5YICAtIFguLi4uLlggLSAgICAgICAgWC4uLi4uWCAgICAgICAgLVguLi5YICAgICAgICAgICAgLSAgICAgICAgICAgIFguLi5YLSAgICBYLi5YICAgICAgICAgWFggICAgICAgICAgLSAgWC5YICAtWC4uLi4uLi5YLSAgICAgICBYLi4uLi4uLlggICAgICAgLVguLlguWCAgICAgICAgICAgLSAgICAgICAgICAgWC5YLi5YLSAgICBYLi5YICAgICAgICAgWC5YICAgICAgICAgLSAgWC5YICAtWFhYWC5YWFhYLSAgICAgICBYWFhYLlhYWFggICAgICAgLVguWCBYLlggICAgICAgICAgLSAgICAgICAgICBYLlggWC5YLSAgICBYLi5YWFggICAgICAgWC4uWCAgICAgICAgLSAgWC5YICAtICAgWC5YICAgLSAgICAgICAgICBYLlggICAgICAgICAgLVhYICAgWC5YICAgICAgICAgLSAgICAgICAgIFguWCAgIFhYLSAgICBYLi5YLi5YWFggICAgWC4uLlggICAgICAgLSAgWC5YICAtICAgWC5YICAgLSAgICBYWCAgICBYLlggICAgWFggICAgLSAgICAgIFguWCAgICAgICAgLSAgICAgICAgWC5YICAgICAgLSAgICBYLi5YLi5YLi5YWCAgWC4uLi5YICAgICAgLSAgWC5YICAtICAgWC5YICAgLSAgIFguWCAgICBYLlggICAgWC5YICAgLSAgICAgICBYLlggICAgICAgLSAgICAgICBYLlggICAgICAgLSAgICBYLi5YLi5YLi5YLlggWC4uLi4uWCAgICAgLSAgWC5YICAtICAgWC5YICAgLSAgWC4uWCAgICBYLlggICAgWC4uWCAgLSAgICAgICAgWC5YICAgICAgLSAgICAgIFguWCAgICAgICAgLVhYWCBYLi5YLi5YLi5YLi5YWC4uLi4uLlggICAgLSAgWC5YICAtICAgWC5YICAgLSBYLi4uWFhYWFhYLlhYWFhYWC4uLlggLSAgICAgICAgIFguWCAgIFhYLVhYICAgWC5YICAgICAgICAgLVguLlhYLi4uLi4uLi5YLi5YWC4uLi4uLi5YICAgLSAgWC5YICAtICAgWC5YICAgLVguLi4uLi4uLi4uLi4uLi4uLi4uLi5YLSAgICAgICAgICBYLlggWC5YLVguWCBYLlggICAgICAgICAgLVguLi5YLi4uLi4uLi4uLi5YWC4uLi4uLi4uWCAgLSAgWC5YICAtICAgWC5YICAgLSBYLi4uWFhYWFhYLlhYWFhYWC4uLlggLSAgICAgICAgICAgWC5YLi5YLVguLlguWCAgICAgICAgICAgLSBYLi4uLi4uLi4uLi4uLi5YWC4uLi4uLi4uLlggLVhYWC5YWFgtICAgWC5YICAgLSAgWC4uWCAgICBYLlggICAgWC4uWCAgLSAgICAgICAgICAgIFguLi5YLVguLi5YICAgICAgICAgICAgLSAgWC4uLi4uLi4uLi4uLi5YWC4uLi4uLi4uLi5YLVguLi4uLlgtICAgWC5YICAgLSAgIFguWCAgICBYLlggICAgWC5YICAgLSAgICAgICAgICAgWC4uLi5YLVguLi4uWCAgICAgICAgICAgLSAgWC4uLi4uLi4uLi4uLi5YWC4uLi4uLlhYWFhYLVhYWFhYWFgtICAgWC5YICAgLSAgICBYWCAgICBYLlggICAgWFggICAgLSAgICAgICAgICBYLi4uLi5YLVguLi4uLlggICAgICAgICAgLSAgIFguLi4uLi4uLi4uLi5YWC4uLlguLlggICAgLS0tLS0tLS0tICAgWC5YICAgLSAgICAgICAgICBYLlggICAgICAgICAgLSAgICAgICAgICBYWFhYWFhYLVhYWFhYWFggICAgICAgICAgLSAgIFguLi4uLi4uLi4uLlggWC4uWCBYLi5YICAgLSAgICAgICAtWFhYWC5YWFhYLSAgICAgICBYWFhYLlhYWFggICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAgICBYLi4uLi4uLi4uLlggWC5YICBYLi5YICAgLSAgICAgICAtWC4uLi4uLi5YLSAgICAgICBYLi4uLi4uLlggICAgICAgLSAgICBYWCAgICAgICAgICAgWFggICAgLSAgICAgICAgICAgLSAgICBYLi4uLi4uLi4uLlggWFggICAgWC4uWCAgLSAgICAgICAtIFguLi4uLlggLSAgICAgICAgWC4uLi4uWCAgICAgICAgLSAgIFguWCAgICAgICAgICAgWC5YICAgLSAgICAgICAgICAgLSAgICAgWC4uLi4uLi4uWCAgICAgICAgWC4uWCAgICAgICAgICAtICBYLi4uWCAgLSAgICAgICAgIFguLi5YICAgICAgICAgLSAgWC4uWCAgICAgICAgICAgWC4uWCAgLSAgICAgICAgICAgLSAgICAgWC4uLi4uLi4uWCAgICAgICAgIFhYICAgICAgICAgICAtICAgWC5YICAgLSAgICAgICAgICBYLlggICAgICAgICAgLSBYLi4uWFhYWFhYWFhYWFhYWC4uLlggLSAgICAgICAgICAgLSAgICAgWFhYWFhYWFhYWCAgLS0tLS0tLS0tLS0tICAgICAgICAtICAgIFggICAgLSAgICAgICAgICAgWCAgICAgICAgICAgLVguLi4uLi4uLi4uLi4uLi4uLi4uLi5YLSAgICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tICAgICAgICAgICAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBYLi4uWFhYWFhYWFhYWFhYWC4uLlggLSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAgWC4uWCAgICAgICAgICAgWC4uWCAgLSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAgIFguWCAgICAgICAgICAgWC5YICAgLSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAgICBYWCAgICAgICAgICAgWFggICAgLSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgAEGQjwEL1LEBN10pIyMjIyMjI2hWMHFzJy8jIyNbKSwjIy9sOiQjUTY+IyM1W240Mj5jLVRIYC0+PiMvZT4xMU5OVj1CdigqOi5GP3V1IyhnUlUubzBYR0hgJHZoTEcxaHh0OT9XYCMsNUxzQ3AjLWk+LnIkPCQ2cEQ+TGInOzlDcmM2dGdYbUtWZVUyY0Q0RW8zUi8yKj5dYihNQzskalBmWS47aF5gSVdNOTxMaDJUbFMrZi1zJG82UTxCV0hgWWlVLnhmTHEkTjskMGlSL0dYOlUoamNXMnAvVypxPy1xbW5VQ0k7akhTQWlGV00uUiprVUBDPUdIP2E5d3A4ZiRlLi00XlFnMSlRLUdMKGxmKHIvN0dyUmd3ViVNUz1DI2A4TkQ+UW8jdCdYIyh2I1k5dzAjMUQkQ0lmO1cnI3BXVVBYT3V4WHVVKEg5TSgxPHEtVUUzMSNeLVYnOElSVW83UWYuL0w+PUtlJCQnNUYlKV0wXiMwWEBVLmE8cjpRTHRGc0xjTDYjI2xPaikjLlk1PC1SJktnTHdxSmZMZ04mO1E/Z0leI0RZMnVMaUBeck1sOXQ9Y1dxNiMjd2VnPiRGQmpWUVRTRGdFS25JUzdFTTk+Wlk5dzAjTDs+PiNNeCY0TXZ0Ly9MW01rQSNXQGxLLk4nWzAjN1JMXyYjdytGJUh0RzlNI1hMYE4mLixHTTRQZzstPG5MRU5odng+LVZzTS5NMHJKZkxIMmVUTWAqb0pNSFJDYE5rZmltTTJKLFctalhTOilyMHdLI0BGZ2UkVT5gdydON0cjJCNmQiMkRV4kIzo5OmhrK2VPZS0tNngpRjcqRSU/NzYlXkdNSGVQVy1aNWwnJkdpRiMkOTU2OnJTP2RBI2ZpSzopWXIrYCYjMGpAJ0RiRyYjXiRQRy5MbCtETmE8WENNS0VWKk4pTE4vTipiPSVRNnBpYS1YZzhJJDxNUiYsVmRKZSQ8KDdHO0NrbCcmaEY7OyQ8Xz1YKGIuUlMlJSkjIyNNUEJ1dUUxVjp2JmNYJiMybSMoJmNWXWBrOU9oTE1ibiVzJEcyLEIkQmZEM1gqc3A1I2wsJFIjXXhfWDF4S1glYjVVKltyNWlNZlVvOVVgTjk5aEcpdG0rL1VzOXBHKVhQdWA8MHMtKVdUdChnQ1J4SWcoJTZzZmg9a3RNS24zaik8NjxiNVNrXy8wKF5dQWFOIyhwL0w+JlZaPjFpJWgxUzl1NW9AWWFhVyRlK2I8VFdGbi9aOk9oKEN4MiRsTkVvTl5lKSNDRllAQEk7Qk9RKnNSd1p0WnhSY1U3dVc2Q1hvdzBpKD8kUVtjak9kW1A0ZCldPlJPUE9weFRPN1N0d2kxOjppQjFxKUNfPWRWMjZKOzIsXTdvcCRddVFyQF9WNyRxXiVsUXd0dUhZXT1EWCxuM0wjMFBIRE80Zjk+ZENATz5IQnVLUHBQKkUsTitiM0wjbHBSL01yVEVILklBUWsuYT5EWy5lO21jLnhdSXAuUEheJy9hcVVPLyQxV3hMb1cwW2lMQTxRVDs1SEtEK0BxUSdOUSgzX1BMaEU0OFIucUFQU3dRMC9XSz9aLFt4Py1KO2pRVFdBMFhAS0ooX1k4Ti06L003NDovLVpwS3JVc3M/ZCNkWnFdREFia1UqSnFrTCtud1hAQDQ3YDU+dz00aCg5LmBHQ1JVeEhQZVJgNU1qb2woZFVXeFphKD5TVHJQa3JKaVd4YDVVN0YjLmcqanJvaEdnYGNnOmxTVHZFWS9FVl83SDRROVtaJWNudjtKUVlaNXEubDdaZWFzOkhPSVpPQj9HPE5hbGQkcXNdQF1MPEo3YlIqPmd2Ols3TUkyaykuJzIoJDVGTlAmRVEoLClVXVddK2ZoMTgudnNhaTAwKTtEM0A0a3U1UD9EUDhhSnQrO3FVTV09K2InOEA7bVZpQkt4MERFWy1hdUdsODpQSiZEaitNNk9DXU9eKCgjI11gMGkpZHJUOy03WGA9LUgzW2lnVW5QRy1OWmxvLiNrQGgjPU9yayRtPmE+JC0/VG0kVVYoPyNQNllZIycvIyMjeGU3cS43M3JJMypwUC8kMT5zOSlXLEpyTTdTTl0nLzRDI3YkVWAwI1YuWzA+eFFzSCRmRW1QTWdZMnU3S2goRyVzaUlmTFNvUytNSzJlVE0kPTUsTThwYEEuO19SJSN1W0sjJHg0QUc4LmtLL0hTQj09LSdJZS9RVHRHPy0uKl5OLTRCL1pNXzNZbFFDNyhwN3EpJl0oYDZfYykkLypKTChMLV4oXSR3SU1gZFB0T2RHQSxVMzp3Mk0tMDxxLV1MXz9eKTF2dycuLE1Sc3FWci5MO2FOJiMvRWdKKVBCY1stZj4rV29tWDJ1N2xxTTJpRXVtTVRjc0Y/LWFUPVotOTdVRW5YZ2xFbjFLLWJuRU9gZ3VGdChjJT07QW1fUXNAakxvb0kmTlg7XTAjajQjRjE0O2dsOC1HUXBnd2hycTgnPWxfZi1iNDknVU9xa0x1Ny0jI29EWTJMKHRlK01jaCZnTFl0SixNRXRKZkxoJ3gnTT0kQ1MtWlolUF04Ylo+I1M/WVkjJVEmcSczXkZ3Jj9EKVVETnJvY00zQTc2Ly9vTD8jaDdnbDg1W3FXL05ET2slMTZpajsrOjFhJ2lOSWRiLW91OC5QKncsdjUjRUkkVFdTPlBvdC1SKkgnLVNFcEE6ZylmK08kJSVga0EjRz04Uk1tRzEmT2A+dG84YkNdVCYkLG4uTG9PPjI5c3AzZHQtNTJVJVZNI3E3J0RIcGcrI1o5JUhbSzxMJWEyRS1ncldWTTNAMj0tazIydExdNCQjIzZXZSc4VUpDS0VbZF89JXdJOyc2WC1Hc0xYNGpeU2dKJCMjUip3LHZQM3dLI2lpVyYjKmheRCZSP2pwNysvdSYjKEFQIyNYVThjJGZTWVctSjk1Xy1EcFtnOXdjTyYjTS1oMU9jSmxjLSp2cHcweFVYJiNPUUZLTlhAUUknSW9QcDduYixRVS8vTVEmWkRrS1ApWDxXU1ZMKDY4dVZsJiNjJ1swIyhzMVgmeG0kWSVCNypLOmVEQTMyM2o5OThHWGJBI3B3TXMtamdEJDlRSVNCLUFfKGFONHhvRk1eQEM1OEQwK1ErcTNuMCMzVTFJbkRqRjY4Mi1Tak1YSkspKGgkaHh1YV9LXXVsOTIlJ0JPVSYjQlJSaC1zbGc4S0RscjolTDcxS2E6LkE7JVlVTGpEUG1MPExZczhpI1h3Sk9ZYUtQS2MxaDonOUtlLGcpYiksNzg9STM5Qjt4aVkkYmdHdy0mLlppOUluWER1WWElRypmMkJxN21uOV4jcDF2diUjKFdpLTsvWjVobzsjMjo7JWQmI3g5djY4QzVnP250WDBYKXBUYDslcEIzcTdtZ0dOKTMlKFA4blRkNUw3R2VBLUdMQCslSjN1MjooWWY+ZXRgZTspZiNLbTgmK0RDJEk0Nj4jS3JdXXUtWz05OXR0czEucWIjcTcyZzFXSk84MXErZU4nMDMnZU0+JjFYeFktY2FFbk9qJTJuOCkpLD9JTFI1Xi5JYm48LVgtTXE3W2E4MkxxOkYmI2NlK1M5d3NDSyp4YDU2OUU4ZXcnSGVdaDpzSVsyTE0kW2d1a2EzWlJkNjp0JUlHOjskJVlpSjpOcT0/ZUF3Oy86bm5EcTAoQ1ljTXBHKXFMTjQkIyMmSjxqJFVwSzxRNGExXU11cFdeLXNqXyQlW0hLJSdGIyMjI1FSWko6OlkzRUdsNCdAJUZraUFPZyNwWyMjT2BndWtUZkJIYWdMPExIdyVxJk9WMCMjRj02LzpjaEltMEBlQ1A4WF06a0ZJJWhsOGhnT0BSY0JoUy1AUWIkJSttPWhQRExnKiVLOGxuKHdjZjMvJ0RXLSQubFI/bltuQ0gtZVhPT05USmxoOi5SWUYlMydwNnNxOlVJTUE5NDUmXkhGUzg3QCRFUDJpRzwtbENPJCVjYHVLR0QzckMkeDBCTDhhRm4tLWBrZSUjSE1QJ3ZoMS9SJk9fSjkndW0sLjx0eFtAJXdzSmsmYlVUMmAwdU12N2dnI3FwL2lqLkw1NidobDsuczVDVXJ4ak9NNy0jIy5sK0F1J0EmTzotVDcyTF1QYCY9O2N0cCdYU2NYKnJVLj4tWFR0LCVPVlU0KVMxK1ItI2RnMC9Obj9LdTFeMGYkQipQOlJvd3dtLWAwUEtqWURETSczXWQzOVZaSEVsNCwuaiddUGstTS5oXiY6MEZBQ20kbWFxLSZzZ3cwdDcvNiheeHRrJUx1SDg4RmotZWttPkdBI18+NTY4eDYoT0ZSbC1JWnBgJmIsX1AnJE08Sm5xNzlWc0pXL21XUypQVWlxNzY7XS9OTV8+aExieGZjJG1qYCxPOyYlVzJtYFpoOi8pVWV0dzphSiVdSzloOlRjRl11Xy1TajksVkszTS4qJyYwRFtDYV1KOWdwOCxrQVddJSg/QSVSJGY8LT5adHMnXmtuPS1eQGM0JS1wWTZxSSVKJTFJR3hmTFU5Q1A4Y2JQbFh2KTtDPWIpLDwybU92UDh1cCxVVmYzODM5YWNBV0FXLVc/I2FvL14jJUtZbzhmUlVMTmQyLj4lbV1VSzpuJXIkJ3N3XUo7NXBBb09fIzJtTzNuLCc9SDUoZXRIZypgK1JMZ3Y+PTRVOGd1RCRJJUQ6Vz4tcjVWKiVqKlc6S3Zlai5McCQ8TS1TR1onOitRX2srdXZPU0xpRW8oPGFEL0s8Q0NjYCdMeD4nPzsrK08nPigpakxSLV51NjhQSG04WkZXZStlajhoOjlyNkwqMC8vYyZpSCZSOHBSYkEjS2ptJXVwVjFnOmFfI1VyN0Z1QSModFJoIy5ZNUsrQD8zPC04bTAkUEVuO0o6cmg2P0k2dUc8LWB3TVUnaXJjcDBMYUVfT3RsTWImMSM2VC4jRkRLdSMxTHcldSUrR00rWCdlP1lMZmpNW1ZPME1idUZwNzs+USYjV0lvKTBARiVxN2MjNFhBWE4tVSZWQjxIRkYqcUwoJC9WLDsoa1haZWpXT2A8WzU/P2V3WSgqOT0ld0RjOyx1PCc5dDNXLShIMXRoMytHXXVjUV1rTHM3ZGYoJC8qSkxdQCp0N0J1X0czXzdtcDc8aWFRak9ALmtMZzt4M0IwbHFwN0hmLF5aZTctIyNAL2M1OE1vKDM7a25wMCUpQTc/LVcrZUknbzgpYjxuS253J0hvOEM9WT5wcUI+MGllJmpoWls/aUxSQEBfQXZBLWlRQyg9a3NSWlJWcDdgLj0rTnBCQyVyaCYzXVI6OFhEbUU1XlY4Tyh4PDxhRy8xTiQjRlgkMFY1WTZ4J2FFckkzSSQ3eCVFYHY8LUJZLCklLT9Qc2YqbD8lQzMubU0oPS9NMDpKeEcnPzdXaEglbydhPC04MGcwTkJ4b08oR0g8ZE1dbi4rJXFAakg/Zi5Vc0oyR2dzJjQ8LWU0NyZLbCtmLy85QGBiKz8uVGVOXyZCOFNzP3Y7XlRyaztmI1l2SmtsJnckXT4tK2s/Jyg8Uzo2OHRxKldvRGZadSc7bU0/OFhbbWE4VyUqYC09O0QuKG5jNy87KWc6VDE9XkokJkJSVigtbFRtTkI2eHFCW0AwKm8uZXJNKjxTV0ZddTI9c3QtKig2dj5eXShILmFSRVpTaSwjMTpbSVhhWkZPbTwtdWkjcVVxMiQjI1JpO3U3NU9LIyhSdGFXLUstRmBTK2NGXXVOYC1LTVElclAvWHJpLkxSY0IjIz1ZTDNCZ00vM01EP0BmJjEnQlctKUp1PEwyNWdsOHVoVm0xaEwkIyMqOCMjIydBMy9Ma0tXKyhecldYPzVXXzhnKWEobSZLOFA+I2JtbVdDTWtrJiNUUmBDLDVkPmcpRjt0LDQ6QF9sOEcvNWg0dlVkJSYlOTUwOlZYRCdRZFdvWS1GJEJ0VXdtZmUkWXFMJzgoUFdYKFA/XkBQbzMkIyNgTVNzP0RXQlovUz4rNCU+ZlgsVld2L3cnS0RgTFA1SWJIO3JUVj5uM2NFSzhVI2JYXWwtL1YrXmxqMzt2bE1iJls1WVE4I3Bla1g5SlAzWFVDNzJMLCw/K05pJmNvN0Fwbk8qNU5LLCgoVy1pOiQsa3AnVURBTyhHMFNxN01WakpzYkl1KSdaLCpbPmJyNWZYXjpGUEFXci1tMktnTDxMVU4wOThrVEYmI2x2bzU4PS92akRvOy47KUthKmhMUiMvaz1yS2J4dVZgPlFfbk42Jzh1VEcmIzFUNWcpdUx2Ojg3M1VwVExnSCsjRmdwSCdfbzE3ODBQaDhLbXhRSjgjSDcyTDRANzY4QFRtJlFoNENCLzVPdm1BJixRJlFiVW9pJGFfJTNNMDFIKTR4N0leJktRVmd0Rm5WKztbUGM+W200ay8vLF0xPyNgVllbSnIqMyYmc2xSZkxpVlpKOl0/PUszU3c9WyQ9dVJCPzN4azQ4QGFlZzxaJzwkIzRIKTYsPmUwalQ2J04jKHElLk89PzJTXXUqKG08LVY4SicoMSlHXVs2OGhXJDUncVtHQyY1amBURT9tJ2VzRkdOUk0paixmZlo/LXF4ODstPmc0dCo6Q0lQL1tRYXA3LzknIygxc2FvN3ctLnFOVWRrSil0Q0YmI0JeO3hHdm4ycjlGRVBGRkZjTEAuaUZOa1R2ZSRtJSNRdlFTOFVAKTJaKzNLOkFLTTVpc1o4OCtkS1EpVzY+SiVDTDxLRT5gLmQqKEJgLW44RDlvSzxVcF1jJFgkKCwpTThadDcvW3Jka3FUZ2wtMGN1R012Jz8+LVhWMXFbJy01aydjQVo2OWU7RF8/JFpQUCZzXis3XSkkKiQjQFFZaTksNVAmIzlyKyQlQ0U9Njg+SzhyMD1kU0MlJShAcDcubTdqaWxRMDInMC1WV0FnPGEvJyczdS49NEwkWSk2ay9LOl9bMz0manZMPEwwQy8yJ3Y6XjstRElCVyxCNEU2ODprWjslPzgoUThCSD1rTzY1Qlc/eFNHJiNAdVUsRFMqLD8uKyhvKCMxdkNTOCNDSEY+VGxHVydiKVRxN1ZUOXFeKl4kJC46Jk5AQCQmKVdIdFBtKjVfck8wJmUlSyYjLTMwaihFNCMnWmIuby8oVHBtJD5LJ2ZAW1B2RmwsaGZJTlROVTZ1JzBwYW83JVhVcDldNS4+JWhgOF89VllieHVlbC5OVFNzSmZMYWNGdTNCJ2xRU3UvbTYtT3FlbThUK29FLS0kMGEva111ajlFd3NHPiV2ZVIqaHZeQkZwUWo6SycjU0osc0ItJyNdKGouTGc5MnJUdy0qbiVALzszOXJySkYsbCNxViVPcnRCZUM2Lyw7cUIzZWJOV1s/LEhxajJMLjFOUCZHalVSPTFEOFFhUzNVcCZAKjl3UD8rbG83Yj9AJSdrNGBwMFokMjIlSzMraUNaaj9YSk40Tm0mK1lGXXVALVckVSVWRVEvLCw+PiMpRDxoI2ApaDA6PFE2OTA5dWErJlZVJW4yOmNHM0ZKLSVAQmotRGdMcmBIdyZIQUtqS2pzZUs8L3hLVCopQixOOVgzXWtyYzEydCdwZ1RWKEx2LXRMW3hnXyU9TV9xN2FeeD83VWJkPiMlOGNZI1laPz0sYFdkeHUvYWUmI3c2KVI4OXRJIzZAcycoNkJmN2EmP1M9XlpJX2tTJmFpYCY9dEU3MkxfRCw7XlIpN1skczxFaCNjJilxLk1YSSUjdjlST2E1RlpPJXNGN3E3TndiJiNwdFVKOmFxSmUkU2w2OCUuRCMjI0VDPjw/LWFGJiNSTlF2Pm84bEtOJTUvJCh2ZGZxNytlYkEjdTFwXW92VUtXJlklcV0nPiQxQC1beGZuJDdaVHA3bU0sRyxLbzdhJkd1JUdbUk14SnNbME1NJXdjaS5MRkRLKSg8Y2BROE4pakVJRiorP1AyYThnJSkkcV1vMmFIOEMmPFNpYkMvcSwoZTp2Oy1iIzZbJE50RFo4NEplMktOdkIjJFA1P3RRM250KDBkPWouTFFmLi9MbDMzKyg7cTNMLXc9OGRYJCNXRiZ1SUpALWJmST4lOl9pMkI1Q3NSOCY5WiYjPW1QRW5tMGZgPCZjKVFMNXVKIyV1JWxKaitELXI7Qm9GJiM0RG9TOTdoNWcpRSNvOiZTNHdlREYsOV5Ib2VgaCpMK19hKk5yTFctMXBHXyYyVWRCODZlJUIvOj0+KU40eGVXLip3ZnQtOyQnNTgtRVNxcjxiP1VJKF8lQFtQNDY+I1VgJzZBUV1tJjYvYFo+I1M/WVkjVmM7cjdVMiYzMjZkPXcmSCMjIyM/VFpgKjQ/Ji5NSz9MUDhWeGc+JFtRWGMlUUp2OTIuKERiKkIpZ2IqQk05ZE0qaEpNQW8qYyYjYjB2PVBqZXJdJGdHJkpYRGYtPidTdHZVNzUwNWw5JEFGdmdZUkleJjxeYjY4P2ojcTlRWDRTTSdSTyMmc0wxSU0uckpmTFVBajIyMV1kIyNEVz1tODN1NTsnYll4LCpTbDBoTChXOzskZG9CJk8vVFE6KFpeeEJkTGpMPExuaTsnJ1guYCQjOCsxR0Q6ayRZVVdzYm44b2doNnJ4WjJaOV0lbmQrPlYjKjhVXzcyTGgrMlE4Q2owaTo2aHAmJEMvOnAoSEs+VDhZW2dIUTRgNCknJEFiKE5vZiVWJzhoTCYjPE5FZHRnKG4nPVMxQShRMS9JJjQoWyVkTWAsSXUnMTpfaEw+U2ZEMDcmNkQ8ZnA4ZEhNNy9nK3RsUE45SipyS2FQY3QmPyd1QkNlbV5qbiU5X0spPCxDNUszcz01ZyZHbUpiKltTWXE3SztUUkxHQ3NNLSQkO1MlOllAcjdBSzBwcHJwTDxMcmgscTdlLyVLV0s6NTBJXittJ3ZpYDM/JVpwKzwtZCskTC1TdjpALm8xOW4kczAmMzk7a247UyVCU3EqJDNXb0pTQ0x3ZVZbYVonTVFJak88NztYLVg7JitkTUx2dSNeVXNHRUM5V0VjW1god0k3IzIuKEYwalYqZVpmPC1RdjNKLWMrSjVBbHJCIyRwKEg2OEx2RUEncTNuMCNtLFtgKjhGdClGY1lnRXVkXUNXZm02OCwoYUxBJEBFRlRnTFhvQnEvVVBscDc6ZFsvO3JfaXg9OlRGYFM1SC1iPExJJkhZKEs9aCMpXUxrJEsxNGxWZm06eCRIPDNeUWw8TWAkT2hhcEJua3VwJ0QjTCRQYl9gTipnXTJlO1gvRHRnLGJzaiZLIzJbLTppWXInX3dnSClOVUlSOGExbiNTP1llaidoOF41OFViWmQrXkZLRCpUQDs2QTdhUUNbSzhkLSh2NkdJJHg6VDwmJ0dwNVVmPkBNLipKOjskLXJ2MjknTV04cU12LXRMcCwnODg2aWFDPUhiKllKb0tKLChqJUs9SGBLLnY5SGdncUJJaVp1J1F2QlQuIz0pMHVrcnVWJi4pMz0oXjFgbypQajQ8LTxhTigoXjcoJyNaMHdLIzVHWEA3dV1bYCpTXjQzOTMzQTRybF1bYCpPNENnTEVsXXYkMVEzQWVGMzdkYlhrLC4pdmojeCdkYDtxZ2JRUiVGVywyKD9MTz1zJVNjNjglTlAnIyNBb3RsOHg9QkUjajFVRChbMyRNKF1VSTJMWDNScEtOQDsvI2YnZi8mX210JkYpWGRGPDl0NClRYS4qa1RMd1EnKFRUQjkueEgnPiNNSitnTHE5LSMjQEh1WlBOMF11Omg3LlQuLkc6OyQvVXNqKFQ3YFE4dFQ3MkxuWWw8LXF4ODstSFY3US0mWGR4JTFhLGhDPTB1K0hsc1Y+bnVJUUwtNTxOPylOQlMpUU4qX0ksPyYpMidJTSVMM0kpWCgoZS9kbDImOCc8TTpeI00qUStbVC5YcmkuTFlTM3YlZkZgNjhoO2ItWFsvRW4nQ1IucTdFKXAnL2tsZTJITSx1O14lT0tDLU4rTGwlRjlDRjxOZideI3QyTCw7MjdXOjBPQDYjI1U2Vzc6JHJKZkxXSGokIyl3b3FCZWZJWi5QSzxiKnQ3ZWQ7cCpfbTs0RXhLI2hAJl0+Xz5Aa1hRdE1hY2ZELm0tVkFiODtJUmVNMyR3ZjAnJ2hyYSpzbzU2OCdJcCZ2UnM4NDknTVJZU3AlOnQ6aDVxU2d3cEVyJEI+USw7cyhDIyQpYHN2UXVGJCMjLUQsIyMsZzY4QDJbVDsuWFNkTjlRZSlycHQuX0stIzV3RilzUCcjI3AjQzBjJS1HYiVoZCs8LWonQWkqeCYmSE1rVF1DJ09TbCMjNVJHW0pYYUhOO2QndUEjeC5fVTsuYFBVQChaM2R0NHIxNTJAOnYsJ1IuU2ondyMwPC07a1BJKUZmSiYjQVlKJiMvLyk+LWs9bT0qWG5LJD49KTcyTF0wSSU+Lkc2OTBhOiQjIzwsKTs/OzcyIz94OStkO15WJzk7allAOyliciNxXllRcHg6WCNUZSRaXic9LT1iR2hMZjpENiZiTndaOS1aRCNuXjlIaExNcjVHOyddZCY2J3dZbVRGbUw8TEQpRl4lW3RDJzg7KzlFI0MkZyUjNVk+cTl3ST5QKDltSVs+a0MtZWtMQy9SJkNIK3MnQjtLLU02JEVCJWlzMDA6K0E0Wzd4a3MuTHJOazAmRSl3SUxZRkAyTCcwTmIkK3B2PCgyLjc2OC9GclkmaCReM2kmQCtHJUpUJzwtLHZgMztfKUk5TV5BRV1DTj9DbDJBWmcrJTRpVHBUMzxuLSYlSCViPEZEajJNPGhIPSZFaDwyTGVuJGIqYVRYPS04UXhOKWsxMUlNMWNeaiU5czxMPE5GU28pQj8rPC0oR3hzRixeLUVoQCQ0ZFhoTiQrI3J4SzgnamUnRDdrYGU7KTJwWXdQQSdfcDkmQF4xOG1sMV5bQGc0dCpbSk9hKls9UXA3KHFKX29PTF4oJzdmQiZIcS06c2Ysc05qOHhxXj4kVTRPXUdLeCdtOSliQHA3WXN2SzN3XllSLUNkUSo6SXI8KCR1JikjKCY/TDlSZzNIKTRmaUVwXmlJOU84S25UaixdSD9EKnI3J007UHdaOUswRV5rJi1jcEk7LnAvNl92d29GTVY8LT4jJVhpLkx4Vm5yVSg0JjgvUCs6aExTS2okI1UlXTQ5dCdJOnJnTWknRkxAYTowWS11QVszOScsKHZibWEqaFUlPC1TUkZgVHQ6NTQyUl9WViRwQFtwOERWW0EsPzE4MzlGV2RGPFRkZEY8OUFoLTYmOXRXb0RsaF0mMVNwR01xPlRpMU8qSCYjKEFMOFtfUCUuTT52Xi0pKXFPVCpGNUNxMGBZZSUrJEI2aTo3QDBJWDxOK1QrME1sTUJQUSpWaj5Tc0Q8VTRKSFk4a0QyKTJmVS9NIyRlLilUNCxfPThoTGltWyYpOz9Va0snLXg/Jyg6c2lJZkw8JHBGTWBpPD8lVyhtR0RITSU+aVdQLCMjUGAlL0w8ZVhpOkBaOUMuN289QChwWGRBTy9OTFE4bFBsK0hQT1FhOHdEOD1eR2xQYThUS0kxQ2poc0NUU0xKTScvV2w+LVMocXclc2YvQCUjQjY7L1U3S111WmJpXk9jXjJuPGJoUG1Va013PiV0PCknbUVWRScnbmBXbkpyYSReVEt2WDVCPjtfYVNFSycsKGh3YTA6aTRHPy5CY2kuKFhbP2IqKCQsPS1uPC5RJWAoWD0/K0BBbSpKczAmPTNiaDhLXW1MPExvTnMnNiwnODVgMD90LydfVTU5QF1kZEY8I0xkRjxlV2RGPE91Ti80NXJZPC1MQCYjK2ZtPjY5PUxiLE9jWlYvKTtUVG04Vkk7PyVPdEo8KGI0bXE3TTY6dT9LUmRGPGdSQDJMPUZOVS08YlsoOWMvTUwzbTtaWyRvRjNnKUdBV3FwQVJjPTxST3U3Y0w1bDstW0FdJS8rZnNkO2wjU2FmVC9mKlddMD1PJyQoVGI8WykqQGU3NzVSLTpZb2IlZyo+bCo6eFA/WWIuNSkld19JPzd1azVKQytGUyhtI2knay4nYTBpKTk8N2InZnMnNTlocSQqNVVodiMjcGleOCtoSUVCRmBudm9gOydsMC5eUzE8LXdVSzIvQ29oNThLS2hMak09U08qcmZPYCtxQ2BXLU9uLj1BSjU2Pj5pMkAyTEg2QTomNXFgPzlJM0BAJzA0JnAyL0xWYSpULTQ8LWkzO005VXZaZCtONz5iKmVJd2c6Q0MpYzw+bk8mIzxJR2U7X18udGhqWmw8JXcoV2syeG1wNFFASSNJOSxERl11Ny1QPS4tXzpZSl1hU0BWPzYqQygpZE9wNzpXTCxiJjNSZy8uY21NOSZyXj4kKD4uWi1JJkooUTBIZDVRJTdDby1iYC1jPE4oNnJAaXArQXVySzxtODZRSXRoKiN2Oy1PQnFpK0w3d0RFLUlyOEtbJ20rRERTTHdLJi8uPy1WJVVfJTM6cUtOdSRfYipCLWtwN05hRCdRZFdRUEtZcVtAPlApaEk7Kl9GXXVgUmJbLmo4X1EvPCY+dXUrVnNIJHNNOVRBJT8pKHZtSjgwKSxQN0U+KXRqRCUyTD0tdCNmS1slYHY9UTg8RmZOa2dnXm9JYmFoKiM4L1F0JEYmOksqLShOLycrMXZNQix1KCktYS5WVVUqI1tlJWdBQU8oUz5XbEEyKTtTYT5nWG04WUJgMWRASyNuXTc2LWEkVSxtRjxmWF1pZHFkKTwzLF1KN0ptVzRgNl11a3M9NC03MkwoakVrKzpiSjBNXnEtOERtX1o/MG9sUDFDOVNhJkhbZCZjJG9vUVVqXUV4ZCozWk1ALVdHVzIlcycsQi1fTSU+JVVsOiMvJ3hvRk05UVgtJC5RTic+WyUkWiR1RjZwQTZLaTJPNTo4dyp2UDE8LTFgW0csKS1tIz4wYFAmI2ViIy4zaSlydEI2MShvJyQ/WDNCPC9SOTA7ZVpdJU5jcTstVGxdI0Y+MlFmdF5hZV81dEtMOU1VZTliKnNMRVE5NUMmYD1HP0BNaj13aConM0U+PS08KUd0Kkl3KSdRRzpgQEl3T2Y3Jl0xaSdTMDFCK0V2L05hYyM5Uzs9O1lRcGdfNlVgKmtWWTM5eEssWy82QWo3OicxQm0tXzFFWWZhMStvJm80aHA3S05fUShPbElvQFMlO2pWZG4wJzE8VmM1Mj11YDNeby1uMSdnNHY1OEhqJjZfdDckIyM/TSljPCRiZ1FfJ1NZKCgteGtBI1koLHAnSDlySVZZLWIsJyViQ1BGNy5KPFVwXiwoZFUxVlkqNSNXa1RVPmgxOXcsV1FoTEkpM1MjZiQyKGViLGpyKmI7M1Z3XSo3TkglJGM0VnMsZUQ5PlhXOD9OXW8rKCpwZ0MlLzcyTFYtdTxIcCwzQGVeOVVCMUorYWs5LVROL21oS1BnK0FKWWQkTWx2QUZfakNLKi5PLV4oNjNhZE1ULT5XJWlld1M4VzZtMnJ0Q3BvJ1JTMVI4ND1AcGFUS3QpPj0lJjFbKSp2cCd1K3gsVnJ3TjsmXWt1TzlKRGJnPXBPJEoqLmpWZTt1J20wZHI5bCw8KndNSypPZT1nOGxWX0tFQkZrTydvVV1ePVstNzkyI29rLClpXWxSOHFRMm9BOHdjUkNaXjd3L05qaDs/LnN0WD9RMT5TMXE0Qm4kKUsxPC1yR2RPJyRXci5MYy5DRykkLypKTDR0TlIvLFNWTzMsYVV3J0RKTjopU3M7d0duOUEzMmlqdyVGTCtaMEZuLlU5O3JlU3EpYm1JMzJVPT01QUx1RyYjVmYxMzk4L3BWbzEqYy0oYVkxNjhvPGBKc1Niay0sMU47JD4wOk9VYXMoMzo4Wjk3MkxTZkY4ZWI9Yy07PlNQdzcuNmhuM21gOV5Ya24oci5xU1swO1QlJlFjPStTVFJ4WCdxMUJOazMmKmV1MjsmOHEkJng+USNRN15UZis2PChkJVpWbWoyYkRpJS4zTDJuKzRXJyRQaURERylnLHIlKz8sJEA/dW91NXRTZTJhTl9BUVUqPGhgZS1HSTcpP09LMkEuZDdfYyk/d1E1QVNAREwzciM3ZlNrZ2w2LSsrRDonQSx1cTdTdmxCJHBjcEgncTNuMCNfJWRZI3hDcHItbDxGME5SQC0jI0ZFVjZOVEY2IyMkbDg0TjF3P0FPPidJQU9VUlEjI1ZeRnYtWEZiR003RmwoTjwzRGhMR0YlcS4xckMkIzpUX18mUGk2OCUweGlfJltxRkooNzdqXyZKV29GLlY3MzUmVCxbUio6eEZSKks1Pj4jYGJXLT80TmVfJjZOZV8mNk5lXyZuYGtyLSNHSmNNNlg7dU02WDt1TSguYS4uXjJUa0wlb1IoIzt1LlQlZkFyJTR0SjgmPjwxPUdIWl8rbTkvI0gxRl5SI1NDIypOPUJBOShEP3ZbVWlGWT4+XjhwLEtLRi5XXUwyOXVMa0xsdS8rNFQ8WG9JQiZoeD1UMVBjRGFCJjtISCstQUZyPyhtOUhaVilGS1M4SkN3O1NEPTZbXi9EWlVMYEVVRGZdR0dsRyY+dyQpRi4vXm4zK3JsbytEQjs1c0lZR05rK2kxdC02OUpnLS0wcGFvN1NtI0spcGRIVyY7THVETkhASD4jL1gtVEkoO1A+IyxHYz4jMFN1PiM0YDE/IzhsQz8jPHhVPyNALmk/I0Q6JUAjSEY3QCNMUklAI1BfW0AjVGtuQCNYdypBI10tPUEjYTlPQSNkPEYmIyo7RyMjLkdZIyMyU2wjIzZgKCQjOmw6JCM+eEwkI0IuYCQjRjpyJCNKRi4lI05SQCUjUl9SJSNWa2UlI1p3dyUjXy00JiMzXlJoJVNmbHItaydNUy5vPy41L3NXZWwvd3BFTTAlMycvMSlLXmYxLWQ+RzIxJnYoMzU+VmAzOVY3QTQ9b254NEExT1k1RUkwOzZJYmdyNk0kSFM3UTwpNThDNXcsO1dvQSojWyVUKiNgMWcqI2Q9IysjaEk1KyNsVUcrI3BiWSsjdG5sKyN4JCksIyYxOywjKj1NLCMuSWAsIzJVciwjNmIuLSM7d1tII2lRdEEjbV4wQiNxakJCI3V2VEIjIy1oQiMnOSRDIytFNkMjL1FIQyMzXlpDIzdqbUMjO3YpRCM/LDxEI0M4TkQjR0RhRCNLUHNEI09dL0UjZzFBNSNLQSoxI2dDMTcjTUdkOyM4KDAyI0wtZDMjcldNNCNIZ2ExIyw8dzAjVC5qPCNPIycyI0NZTjEjcWFeOiNfNG0zI29ALz0jZUc4PSN0OEo1I2ArNzgjNHVJLSNtM0IyI1NCWzgjUTBAOCNpWyo5I2lPbjgjMU5tOyNec045I3FoPDkjOj14LSNQO0syIyQlWDkjYkMrLiNSZzs8I21OPS4jTVRGLiNSWk8uIzI/KTQjWSMoLyNbKTEvI2I7TC8jZEFVLyMwU3Y7I2xZJDAjbmAtMCNzZjYwIyhGMjQjd3JIMCMlL2UwI1RtRDwjJUpTTUZvdmU6Q1RCRVhJOjxlaDJnKUIsM2gyXkczaTsjZDNqRD4pNGtNWUQ0bFZ1YDRtYDomNW5pVUE1QChBNUJBMV1QQkI6eGxCQ0M9MkNETFhNQ0VVdGlDZiYwZzIndE4/UEdUNENQR1Q0Q1BHVDRDUEdUNENQR1Q0Q1BHVDRDUEdUNENQR1Q0Q1BHVDRDUEdUNENQR1Q0Q1BHVDRDUEdUNENQLXFla0NgLjlrRWdeK0Yka3dWaUZKVEImNUtUQiY1S1RCJjVLVEImNUtUQiY1S1RCJjVLVEImNUtUQiY1S1RCJjVLVEImNUtUQiY1S1RCJjVLVEImNUtUQiY1S1RCJjVvLF48LTI4WkknTz87eHBPPzt4cE8/O3hwTz87eHBPPzt4cE8/O3hwTz87eHBPPzt4cE8/O3hwTz87eHBPPzt4cE8/O3hwTz87eHBPPzt4cDs3cS0jbExZSTp4dkQ9IwAjU0NST0xMWAAjU0NST0xMWQAjaW1hZ2UAW3hdAFsgXQAoeCkAKCApACUuMGYlJQAgfAAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQAjI0NvbWJvXyUwMmQAKlVua25vd24gaXRlbSoAAAAAAQAAAEh3AABIdwAAAQAAACV7AAAlewAAAgAAAEh3AABIdwAAAgAAACV7AAAlewAABAAAAEh3AABIdwAABAAAACV7AAAlewAACAAAACh7AAAoewAACAAAAC17AAAtewAABAAAAEt3AABLdwAACAAAAEt3AABOdwAAJWQAJWYAJWxmAAAjI21pbgAjI21heAAlLjBmIGRlZwAtACsAJTA4WABNOjAuMDAwAE06MDAwAACQdwAAlHcAAJh3AACcdwAAIyNYACMjWQAjI1oAIyNXANB3AADQdwAA0HcAANB3AADUdwAA2ncAAOB3AADmdwAA7HcAAPJ3AAD4dwAA5ncAACUzZABSOiUzZABHOiUzZABCOiUzZABBOiUzZABIOiUzZABTOiUzZABWOiUzZAAAADB4AAAweAAAMHgAADB4AAA2eAAAPngAAEZ4AABOeAAAVngAAF54AABmeAAATngAACUwLjNmAFI6JTAuM2YARzolMC4zZgBCOiUwLjNmAEE6JTAuM2YASDolMC4zZgBTOiUwLjNmAFY6JTAuM2YAY29udGV4dAAjJTAyWCUwMlglMDJYJTAyWAAjJTAyWCUwMlglMDJYACMjVGV4dAAlMDJYJTAyWCUwMlglMDJYACUwMlglMDJYJTAyWAAjI0NvbG9yQnV0dG9uAHBpY2tlcgAjI3BpY2tlcgBfQ09MM0YAX0NPTDRGAGhzdgBzdgBodWUAYWxwaGEAQ3VycmVudAAjI2N1cnJlbnQAT3JpZ2luYWwAIyNvcmlnaW5hbAAjI3JnYgAjI2hzdgAjI2hleAD/AAD///8A/wD/AP8A////AAD///8A////AAD/Q29sb3IAIyNwcmV2aWV3ACMlMDJYJTAyWCUwMlgKUjogJWQsIEc6ICVkLCBCOiAlZAooJS4zZiwgJS4zZiwgJS4zZikAIyUwMlglMDJYJTAyWCUwMlgKUjolZCwgRzolZCwgQjolZCwgQTolZAooJS4zZiwgJS4zZiwgJS4zZiwgJS4zZikASDogJS4zZiwgUzogJS4zZiwgVjogJS4zZgBIOiAlLjNmLCBTOiAlLjNmLCBWOiAlLjNmLCBBOiAlLjNmAFJHQgBIU1YASGV4ADAuLjI1NQAwLjAwLi4xLjAwAENvcHkgYXMuLgBDb3B5ACglLjNmZiwgJS4zZmYsICUuM2ZmLCAlLjNmZikAKCVkLCVkLCVkLCVkKQAweCUwMlglMDJYJTAyWAAweCUwMlglMDJYJTAyWCUwMlgAIyNzZWxlY3RhYmxlACMjZHVtbXlwaWNrZXIAQWxwaGEgQmFyACMjAD4AI1RyZWVQdXNoACVkOiAlOC40ZwolZDogJTguNGcAJWQ6ICU4LjRnACVzOiAlcwB0cnVlAGZhbHNlACVzOiAlZAAlJXM6ICVzACVzOiAlLjNmACMjTWFpbk1lbnVCYXIAIyNtZW51YmFyACUuKnMAKgAldQAlbGxkACVsbHUAIyN2ACMjPAAjIz4AAAAAAIA/zczMPQrXIzxvEoM6F7fROKzFJze9N4Y1lb/WM3fMKzJfcIkwYXJlbmEAb3JkYmxrcwBzbWJsa3MAaGJsa3MAaGJsa2hkAHVzbWJsa3MAZnNtYmxrcwB1b3JkYmxrcwBmb3JkYmxrcwBrZWVwY29zdABtYWxsaW5mbwBXcmFwSW1HdWlDb250ZXh0AHgAeQBJbVZlYzIAU2V0AENvcHkARXF1YWxzAHoAdwBJbVZlYzQASW1HdWlJbnB1dFRleHRDYWxsYmFja0RhdGEARXZlbnRGbGFnAEZsYWdzAEV2ZW50Q2hhcgBFdmVudEtleQBCdWYAQnVmVGV4dExlbgBCdWZTaXplAEJ1ZkRpcnR5AEN1cnNvclBvcwBTZWxlY3Rpb25TdGFydABTZWxlY3Rpb25FbmQARGVsZXRlQ2hhcnMASW5zZXJ0Q2hhcnMASGFzU2VsZWN0aW9uAEltR3VpU2l6ZUNhbGxiYWNrRGF0YQBQb3MAQ3VycmVudFNpemUARGVzaXJlZFNpemUASW1HdWlMaXN0Q2xpcHBlcgBTdGFydFBvc1kASXRlbXNIZWlnaHQASXRlbXNDb3VudABTdGVwTm8ARGlzcGxheVN0YXJ0AERpc3BsYXlFbmQAU3RlcABCZWdpbgBFbmQASW1EcmF3Q21kAEVsZW1Db3VudABDbGlwUmVjdABUZXh0dXJlSWQAVnR4T2Zmc2V0AElkeE9mZnNldABJbURyYXdMaXN0AEl0ZXJhdGVEcmF3Q21kcwBJZHhCdWZmZXIAVnR4QnVmZmVyAFB1c2hDbGlwUmVjdABQdXNoQ2xpcFJlY3RGdWxsU2NyZWVuAFBvcENsaXBSZWN0AFB1c2hUZXh0dXJlSUQAUG9wVGV4dHVyZUlEAEdldENsaXBSZWN0TWluAEdldENsaXBSZWN0TWF4AEFkZExpbmUAQWRkUmVjdABBZGRSZWN0RmlsbGVkAEFkZFJlY3RGaWxsZWRNdWx0aUNvbG9yAEFkZFF1YWQAQWRkUXVhZEZpbGxlZABBZGRUcmlhbmdsZQBBZGRUcmlhbmdsZUZpbGxlZABBZGRDaXJjbGUAQWRkQ2lyY2xlRmlsbGVkAEFkZFRleHRfQQBBZGRUZXh0X0IAQWRkSW1hZ2UAQWRkSW1hZ2VRdWFkAEFkZEltYWdlUm91bmRlZABBZGRQb2x5bGluZQBBZGRDb252ZXhQb2x5RmlsbGVkAEFkZEJlemllckN1cnZlAFBhdGhDbGVhcgBQYXRoTGluZVRvAFBhdGhMaW5lVG9NZXJnZUR1cGxpY2F0ZQBQYXRoRmlsbENvbnZleABQYXRoU3Ryb2tlAFBhdGhBcmNUbwBQYXRoQXJjVG9GYXN0AFBhdGhCZXppZXJDdXJ2ZVRvAFBhdGhSZWN0AENoYW5uZWxzU3BsaXQAQ2hhbm5lbHNNZXJnZQBDaGFubmVsc1NldEN1cnJlbnQAQWRkQ2FsbGJhY2sAQWRkRHJhd0NtZABDbGVhcgBDbGVhckZyZWVNZW1vcnkAUHJpbVJlc2VydmUAUHJpbVJlY3QAUHJpbVJlY3RVVgBQcmltUXVhZFVWAFByaW1Xcml0ZVZ0eABQcmltV3JpdGVJZHgAUHJpbVZ0eABVcGRhdGVDbGlwUmVjdABVcGRhdGVUZXh0dXJlSUQASW1EcmF3RGF0YQBJdGVyYXRlRHJhd0xpc3RzAFZhbGlkAENtZExpc3RzQ291bnQAVG90YWxJZHhDb3VudABUb3RhbFZ0eENvdW50AERpc3BsYXlQb3MARGlzcGxheVNpemUARnJhbWVidWZmZXJTY2FsZQBEZUluZGV4QWxsQnVmZmVycwBTY2FsZUNsaXBSZWN0cwBJbUZvbnRHbHlwaABDb2RlcG9pbnQAQWR2YW5jZVgAWDAAWTAAWDEAWTEAVTAAVjAAVTEAVjEASW1Gb250Q29uZmlnAEZvbnREYXRhAEZvbnREYXRhT3duZWRCeUF0bGFzAEZvbnRObwBTaXplUGl4ZWxzAE92ZXJzYW1wbGVIAE92ZXJzYW1wbGVWAFBpeGVsU25hcEgAR2x5cGhFeHRyYVNwYWNpbmcAR2x5cGhPZmZzZXQAR2x5cGhSYW5nZXMAR2x5cGhNaW5BZHZhbmNlWABHbHlwaE1heEFkdmFuY2VYAE1lcmdlTW9kZQBSYXN0ZXJpemVyRmxhZ3MAUmFzdGVyaXplck11bHRpcGx5AE5hbWUARHN0Rm9udABJbUZvbnQARm9udFNpemUAU2NhbGUARGlzcGxheU9mZnNldABJdGVyYXRlR2x5cGhzAEZhbGxiYWNrR2x5cGgARmFsbGJhY2tBZHZhbmNlWABGYWxsYmFja0NoYXIAQ29uZmlnRGF0YUNvdW50AEl0ZXJhdGVDb25maWdEYXRhAEFzY2VudABEZXNjZW50AE1ldHJpY3NUb3RhbFN1cmZhY2UAQ2xlYXJPdXRwdXREYXRhAEJ1aWxkTG9va3VwVGFibGUARmluZEdseXBoAEZpbmRHbHlwaE5vRmFsbGJhY2sAU2V0RmFsbGJhY2tDaGFyAEdldENoYXJBZHZhbmNlAElzTG9hZGVkAEdldERlYnVnTmFtZQBDYWxjVGV4dFNpemVBAENhbGNXb3JkV3JhcFBvc2l0aW9uQQBSZW5kZXJDaGFyAGJ1ZmZlcgBieXRlT2Zmc2V0AGJ5dGVMZW5ndGgAVE9ETzogRm9udERhdGEgJXp1ICV6dQoASW1Gb250QXRsYXMAQWRkRm9udERlZmF1bHQAQWRkRm9udEZyb21NZW1vcnlUVEYAQ2xlYXJUZXhEYXRhAENsZWFySW5wdXREYXRhAENsZWFyRm9udHMAQnVpbGQASXNCdWlsdABHZXRUZXhEYXRhQXNBbHBoYTgAR2V0VGV4RGF0YUFzUkdCQTMyAEdldEdseXBoUmFuZ2VzRGVmYXVsdABHZXRHbHlwaFJhbmdlc0tvcmVhbgBHZXRHbHlwaFJhbmdlc0phcGFuZXNlAEdldEdseXBoUmFuZ2VzQ2hpbmVzZUZ1bGwAR2V0R2x5cGhSYW5nZXNDaGluZXNlU2ltcGxpZmllZENvbW1vbgBHZXRHbHlwaFJhbmdlc0N5cmlsbGljAEdldEdseXBoUmFuZ2VzVGhhaQBHZXRHbHlwaFJhbmdlc1ZpZXRuYW1lc2UATG9ja2VkAFRleElEAFRleERlc2lyZWRXaWR0aABUZXhHbHlwaFBhZGRpbmcAVGV4V2lkdGgAVGV4SGVpZ2h0AFRleFV2U2NhbGUAVGV4VXZXaGl0ZVBpeGVsAEl0ZXJhdGVGb250cwBJbUd1aUlPAENvbmZpZ0ZsYWdzAEJhY2tlbmRGbGFncwBEZWx0YVRpbWUASW5pU2F2aW5nUmF0ZQBJbmlGaWxlbmFtZQBMb2dGaWxlbmFtZQBNb3VzZURvdWJsZUNsaWNrVGltZQBNb3VzZURvdWJsZUNsaWNrTWF4RGlzdABNb3VzZURyYWdUaHJlc2hvbGQAX2dldEF0X0tleU1hcABfc2V0QXRfS2V5TWFwAEtleVJlcGVhdERlbGF5AEtleVJlcGVhdFJhdGUAVXNlckRhdGEARm9udHMARm9udEdsb2JhbFNjYWxlAEZvbnRBbGxvd1VzZXJTY2FsaW5nAEZvbnREZWZhdWx0AERpc3BsYXlGcmFtZWJ1ZmZlclNjYWxlAE1vdXNlRHJhd0N1cnNvcgBDb25maWdNYWNPU1hCZWhhdmlvcnMAQ29uZmlnSW5wdXRUZXh0Q3Vyc29yQmxpbmsAQ29uZmlnV2luZG93c1Jlc2l6ZUZyb21FZGdlcwBDb25maWdXaW5kb3dzTW92ZUZyb21UaXRsZUJhck9ubHkAQmFja2VuZFBsYXRmb3JtTmFtZQBCYWNrZW5kUmVuZGVyZXJOYW1lAEJhY2tlbmRQbGF0Zm9ybVVzZXJEYXRhAEJhY2tlbmRSZW5kZXJlclVzZXJEYXRhAEJhY2tlbmRMYW5ndWFnZVVzZXJEYXRhAEdldENsaXBib2FyZFRleHRGbgBTZXRDbGlwYm9hcmRUZXh0Rm4AQ2xpcGJvYXJkVXNlckRhdGEATW91c2VQb3MAX2dldEF0X01vdXNlRG93bgBfc2V0QXRfTW91c2VEb3duAE1vdXNlV2hlZWwAS2V5Q3RybABLZXlTaGlmdABLZXlBbHQAS2V5U3VwZXIAX2dldEF0X0tleXNEb3duAF9zZXRBdF9LZXlzRG93bgBfZ2V0QXRfTmF2SW5wdXRzAF9zZXRBdF9OYXZJbnB1dHMAQWRkSW5wdXRDaGFyYWN0ZXIAQWRkSW5wdXRDaGFyYWN0ZXJzVVRGOABDbGVhcklucHV0Q2hhcmFjdGVycwBXYW50Q2FwdHVyZU1vdXNlAFdhbnRDYXB0dXJlS2V5Ym9hcmQAV2FudFRleHRJbnB1dABXYW50U2V0TW91c2VQb3MAV2FudFNhdmVJbmlTZXR0aW5ncwBOYXZBY3RpdmUATmF2VmlzaWJsZQBGcmFtZXJhdGUATWV0cmljc1JlbmRlclZlcnRpY2VzAE1ldHJpY3NSZW5kZXJJbmRpY2VzAE1ldHJpY3NSZW5kZXJXaW5kb3dzAE1ldHJpY3NBY3RpdmVXaW5kb3dzAE1ldHJpY3NBY3RpdmVBbGxvY2F0aW9ucwBNb3VzZURlbHRhAF9nZXRBdF9Nb3VzZUNsaWNrZWRQb3MAX2dldEF0X01vdXNlRG93bkR1cmF0aW9uAF9nZXRBdF9LZXlzRG93bkR1cmF0aW9uAF9nZXRBdF9OYXZJbnB1dHNEb3duRHVyYXRpb24ASW1HdWlTdHlsZQBBbHBoYQBXaW5kb3dQYWRkaW5nAFdpbmRvd1JvdW5kaW5nAFdpbmRvd0JvcmRlclNpemUAV2luZG93TWluU2l6ZQBXaW5kb3dUaXRsZUFsaWduAFdpbmRvd01lbnVCdXR0b25Qb3NpdGlvbgBDaGlsZFJvdW5kaW5nAENoaWxkQm9yZGVyU2l6ZQBQb3B1cFJvdW5kaW5nAFBvcHVwQm9yZGVyU2l6ZQBGcmFtZVBhZGRpbmcARnJhbWVSb3VuZGluZwBGcmFtZUJvcmRlclNpemUASXRlbVNwYWNpbmcASXRlbUlubmVyU3BhY2luZwBUb3VjaEV4dHJhUGFkZGluZwBJbmRlbnRTcGFjaW5nAENvbHVtbnNNaW5TcGFjaW5nAFNjcm9sbGJhclNpemUAU2Nyb2xsYmFyUm91bmRpbmcAR3JhYk1pblNpemUAR3JhYlJvdW5kaW5nAFRhYlJvdW5kaW5nAFRhYkJvcmRlclNpemUAQnV0dG9uVGV4dEFsaWduAFNlbGVjdGFibGVUZXh0QWxpZ24ARGlzcGxheVdpbmRvd1BhZGRpbmcARGlzcGxheVNhZmVBcmVhUGFkZGluZwBNb3VzZUN1cnNvclNjYWxlAEFudGlBbGlhc2VkTGluZXMAQW50aUFsaWFzZWRGaWxsAEN1cnZlVGVzc2VsbGF0aW9uVG9sAF9nZXRBdF9Db2xvcnMAX3NldEF0X0NvbG9ycwBTY2FsZUFsbFNpemVzAElNR1VJX1ZFUlNJT04AMS43MQBJTUdVSV9DSEVDS1ZFUlNJT04ASW1HdWlJT1NpemUASW1HdWlTdHlsZVNpemUASW1WZWMyU2l6ZQBJbVZlYzRTaXplAEltRHJhd1ZlcnRTaXplAEltRHJhd0lkeFNpemUASW1EcmF3VmVydFBvc09mZnNldABJbURyYXdWZXJ0VVZPZmZzZXQASW1EcmF3VmVydENvbE9mZnNldABDcmVhdGVDb250ZXh0AERlc3Ryb3lDb250ZXh0AEdldEN1cnJlbnRDb250ZXh0AFNldEN1cnJlbnRDb250ZXh0AERlYnVnQ2hlY2tWZXJzaW9uQW5kRGF0YUxheW91dABHZXRJTwBHZXRTdHlsZQBHZXREcmF3RGF0YQBOZXdGcmFtZQBSZW5kZXIARW5kRnJhbWUAU2hvd0RlbW9XaW5kb3cAU2hvd0Fib3V0V2luZG93AFNob3dNZXRyaWNzV2luZG93AFNob3dTdHlsZUVkaXRvcgBTaG93U3R5bGVTZWxlY3RvcgBTaG93Rm9udFNlbGVjdG9yAFNob3dVc2VyR3VpZGUAR2V0VmVyc2lvbgBTdHlsZUNvbG9yc0RhcmsAU3R5bGVDb2xvcnNDbGFzc2ljAFN0eWxlQ29sb3JzTGlnaHQAQmVnaW5DaGlsZABFbmRDaGlsZABHZXRDb250ZW50UmVnaW9uTWF4AEdldENvbnRlbnRSZWdpb25BdmFpbABHZXRXaW5kb3dDb250ZW50UmVnaW9uTWluAEdldFdpbmRvd0NvbnRlbnRSZWdpb25NYXgAR2V0V2luZG93Q29udGVudFJlZ2lvbldpZHRoAEdldFdpbmRvd0RyYXdMaXN0AEdldFdpbmRvd1BvcwBHZXRXaW5kb3dTaXplAEdldFdpbmRvd1dpZHRoAEdldFdpbmRvd0hlaWdodABJc1dpbmRvd0NvbGxhcHNlZABJc1dpbmRvd0FwcGVhcmluZwBTZXRXaW5kb3dGb250U2NhbGUAU2V0TmV4dFdpbmRvd1BvcwBTZXROZXh0V2luZG93U2l6ZQBTZXROZXh0V2luZG93U2l6ZUNvbnN0cmFpbnRzAFNldE5leHRXaW5kb3dDb250ZW50U2l6ZQBTZXROZXh0V2luZG93Q29sbGFwc2VkAFNldE5leHRXaW5kb3dGb2N1cwBTZXROZXh0V2luZG93QmdBbHBoYQBTZXRXaW5kb3dQb3MAU2V0V2luZG93U2l6ZQBTZXRXaW5kb3dDb2xsYXBzZWQAU2V0V2luZG93Rm9jdXMAU2V0V2luZG93TmFtZVBvcwBTZXRXaW5kb3dOYW1lU2l6ZQBTZXRXaW5kb3dOYW1lQ29sbGFwc2VkAFNldFdpbmRvd05hbWVGb2N1cwBHZXRTY3JvbGxYAEdldFNjcm9sbFkAR2V0U2Nyb2xsTWF4WABHZXRTY3JvbGxNYXhZAFNldFNjcm9sbFgAU2V0U2Nyb2xsWQBTZXRTY3JvbGxIZXJlWQBTZXRTY3JvbGxGcm9tUG9zWQBTZXRTdGF0ZVN0b3JhZ2UAR2V0U3RhdGVTdG9yYWdlAFB1c2hGb250AFBvcEZvbnQAUHVzaFN0eWxlQ29sb3IAUG9wU3R5bGVDb2xvcgBQdXNoU3R5bGVWYXIAUG9wU3R5bGVWYXIAR2V0U3R5bGVDb2xvclZlYzQAR2V0Rm9udABHZXRGb250U2l6ZQBHZXRGb250VGV4VXZXaGl0ZVBpeGVsAEdldENvbG9yVTMyX0EAR2V0Q29sb3JVMzJfQgBHZXRDb2xvclUzMl9DAFB1c2hJdGVtV2lkdGgAUG9wSXRlbVdpZHRoAFNldE5leHRJdGVtV2lkdGgAQ2FsY0l0ZW1XaWR0aABQdXNoVGV4dFdyYXBQb3MAUG9wVGV4dFdyYXBQb3MAUHVzaEFsbG93S2V5Ym9hcmRGb2N1cwBQb3BBbGxvd0tleWJvYXJkRm9jdXMAUHVzaEJ1dHRvblJlcGVhdABQb3BCdXR0b25SZXBlYXQAU2VwYXJhdG9yAFNhbWVMaW5lAE5ld0xpbmUAU3BhY2luZwBEdW1teQBJbmRlbnQAVW5pbmRlbnQAQmVnaW5Hcm91cABFbmRHcm91cABHZXRDdXJzb3JQb3MAR2V0Q3Vyc29yUG9zWABHZXRDdXJzb3JQb3NZAFNldEN1cnNvclBvcwBTZXRDdXJzb3JQb3NYAFNldEN1cnNvclBvc1kAR2V0Q3Vyc29yU3RhcnRQb3MAR2V0Q3Vyc29yU2NyZWVuUG9zAFNldEN1cnNvclNjcmVlblBvcwBBbGlnblRleHRUb0ZyYW1lUGFkZGluZwBHZXRUZXh0TGluZUhlaWdodABHZXRUZXh0TGluZUhlaWdodFdpdGhTcGFjaW5nAEdldEZyYW1lSGVpZ2h0AEdldEZyYW1lSGVpZ2h0V2l0aFNwYWNpbmcAQ29sdW1ucwBOZXh0Q29sdW1uAEdldENvbHVtbkluZGV4AEdldENvbHVtbldpZHRoAFNldENvbHVtbldpZHRoAEdldENvbHVtbk9mZnNldABTZXRDb2x1bW5PZmZzZXQAR2V0Q29sdW1uc0NvdW50AFB1c2hJRABQb3BJRABHZXRJRABUZXh0VW5mb3JtYXR0ZWQAVGV4dABUZXh0VgBUZXh0Q29sb3JlZABUZXh0Q29sb3JlZFYAVGV4dERpc2FibGVkAFRleHREaXNhYmxlZFYAVGV4dFdyYXBwZWQAVGV4dFdyYXBwZWRWAExhYmVsVGV4dABMYWJlbFRleHRWAEJ1bGxldFRleHQAQnVsbGV0VGV4dFYAQnVsbGV0AEJ1dHRvbgBTbWFsbEJ1dHRvbgBBcnJvd0J1dHRvbgBJbnZpc2libGVCdXR0b24ASW1hZ2UASW1hZ2VCdXR0b24AQ2hlY2tib3gAQ2hlY2tib3hGbGFncwBSYWRpb0J1dHRvbl9BAFJhZGlvQnV0dG9uX0IAUGxvdExpbmVzAFBsb3RIaXN0b2dyYW0AUHJvZ3Jlc3NCYXIAQmVnaW5Db21ibwBFbmRDb21ibwBDb21ibwBEcmFnRmxvYXQARHJhZ0Zsb2F0MgBEcmFnRmxvYXQzAERyYWdGbG9hdDQARHJhZ0Zsb2F0UmFuZ2UyAERyYWdJbnQARHJhZ0ludDIARHJhZ0ludDMARHJhZ0ludDQARHJhZ0ludFJhbmdlMgBEcmFnU2NhbGFyAElucHV0VGV4dABJbnB1dFRleHRXaXRoSGludABJbnB1dFRleHRNdWx0aWxpbmUASW5wdXRGbG9hdABJbnB1dEZsb2F0MgBJbnB1dEZsb2F0MwBJbnB1dEZsb2F0NABJbnB1dEludABJbnB1dEludDIASW5wdXRJbnQzAElucHV0SW50NABJbnB1dERvdWJsZQBJbnB1dFNjYWxhcgBTbGlkZXJGbG9hdABTbGlkZXJGbG9hdDIAU2xpZGVyRmxvYXQzAFNsaWRlckZsb2F0NABTbGlkZXJBbmdsZQBTbGlkZXJJbnQAU2xpZGVySW50MgBTbGlkZXJJbnQzAFNsaWRlckludDQAU2xpZGVyU2NhbGFyAFZTbGlkZXJGbG9hdABWU2xpZGVySW50AFZTbGlkZXJTY2FsYXIAQ29sb3JFZGl0MwBDb2xvckVkaXQ0AENvbG9yUGlja2VyMwBDb2xvclBpY2tlcjQAQ29sb3JCdXR0b24AU2V0Q29sb3JFZGl0T3B0aW9ucwBUcmVlTm9kZV9BAFRyZWVOb2RlX0IAVHJlZU5vZGVfQwBUcmVlTm9kZUV4X0EAVHJlZU5vZGVFeF9CAFRyZWVOb2RlRXhfQwBUcmVlUHVzaF9BAFRyZWVQdXNoX0IAVHJlZVBvcABUcmVlQWR2YW5jZVRvTGFiZWxQb3MAR2V0VHJlZU5vZGVUb0xhYmVsU3BhY2luZwBDb2xsYXBzaW5nSGVhZGVyX0EAQ29sbGFwc2luZ0hlYWRlcl9CAFNldE5leHRJdGVtT3BlbgBTZWxlY3RhYmxlX0EAU2VsZWN0YWJsZV9CAExpc3RCb3hfQQBMaXN0Qm94X0IATGlzdEJveEhlYWRlcl9BAExpc3RCb3hIZWFkZXJfQgBMaXN0Qm94Rm9vdGVyAFZhbHVlX0EAVmFsdWVfQgBWYWx1ZV9DAFZhbHVlX0QAU2V0VG9vbHRpcABCZWdpblRvb2x0aXAARW5kVG9vbHRpcABCZWdpbk1haW5NZW51QmFyAEVuZE1haW5NZW51QmFyAEJlZ2luTWVudUJhcgBFbmRNZW51QmFyAEJlZ2luTWVudQBFbmRNZW51AE1lbnVJdGVtX0EATWVudUl0ZW1fQgBPcGVuUG9wdXAAT3BlblBvcHVwT25JdGVtQ2xpY2sAQmVnaW5Qb3B1cABCZWdpblBvcHVwTW9kYWwAQmVnaW5Qb3B1cENvbnRleHRJdGVtAEJlZ2luUG9wdXBDb250ZXh0V2luZG93AEJlZ2luUG9wdXBDb250ZXh0Vm9pZABFbmRQb3B1cABJc1BvcHVwT3BlbgBDbG9zZUN1cnJlbnRQb3B1cABCZWdpblRhYkJhcgBFbmRUYWJCYXIAQmVnaW5UYWJJdGVtAEVuZFRhYkl0ZW0AU2V0VGFiSXRlbUNsb3NlZABMb2dUb1RUWQBMb2dUb0ZpbGUATG9nVG9DbGlwYm9hcmQATG9nRmluaXNoAExvZ0J1dHRvbnMATG9nVGV4dABCZWdpbkRyYWdEcm9wU291cmNlAFNldERyYWdEcm9wUGF5bG9hZABFbmREcmFnRHJvcFNvdXJjZQBCZWdpbkRyYWdEcm9wVGFyZ2V0AEFjY2VwdERyYWdEcm9wUGF5bG9hZABFbmREcmFnRHJvcFRhcmdldABHZXREcmFnRHJvcFBheWxvYWQAU2V0SXRlbURlZmF1bHRGb2N1cwBTZXRLZXlib2FyZEZvY3VzSGVyZQBJc0l0ZW1Ib3ZlcmVkAElzSXRlbUFjdGl2ZQBJc0l0ZW1FZGl0ZWQASXNJdGVtRm9jdXNlZABJc0l0ZW1DbGlja2VkAElzSXRlbVZpc2libGUASXNJdGVtQWN0aXZhdGVkAElzSXRlbURlYWN0aXZhdGVkAElzSXRlbURlYWN0aXZhdGVkQWZ0ZXJFZGl0AElzQW55SXRlbUhvdmVyZWQASXNBbnlJdGVtQWN0aXZlAElzQW55SXRlbUZvY3VzZWQAR2V0SXRlbVJlY3RNaW4AR2V0SXRlbVJlY3RNYXgAR2V0SXRlbVJlY3RTaXplAFNldEl0ZW1BbGxvd092ZXJsYXAASXNXaW5kb3dGb2N1c2VkAElzV2luZG93SG92ZXJlZABJc1JlY3RWaXNpYmxlX0EASXNSZWN0VmlzaWJsZV9CAEdldFRpbWUAR2V0RnJhbWVDb3VudABHZXRCYWNrZ3JvdW5kRHJhd0xpc3QAR2V0Rm9yZWdyb3VuZERyYXdMaXN0AEdldERyYXdMaXN0U2hhcmVkRGF0YQBHZXRTdHlsZUNvbG9yTmFtZQBDYWxjVGV4dFNpemUAQ2FsY0xpc3RDbGlwcGluZwBCZWdpbkNoaWxkRnJhbWUARW5kQ2hpbGRGcmFtZQBDb2xvckNvbnZlcnRVMzJUb0Zsb2F0NABDb2xvckNvbnZlcnRGbG9hdDRUb1UzMgBDb2xvckNvbnZlcnRSR0J0b0hTVgBDb2xvckNvbnZlcnRIU1Z0b1JHQgBHZXRLZXlJbmRleABJc0tleURvd24ASXNLZXlQcmVzc2VkAElzS2V5UmVsZWFzZWQAR2V0S2V5UHJlc3NlZEFtb3VudABJc01vdXNlRG93bgBJc0FueU1vdXNlRG93bgBJc01vdXNlQ2xpY2tlZABJc01vdXNlRG91YmxlQ2xpY2tlZABJc01vdXNlUmVsZWFzZWQASXNNb3VzZURyYWdnaW5nAElzTW91c2VIb3ZlcmluZ1JlY3QASXNNb3VzZVBvc1ZhbGlkAEdldE1vdXNlUG9zAEdldE1vdXNlUG9zT25PcGVuaW5nQ3VycmVudFBvcHVwAEdldE1vdXNlRHJhZ0RlbHRhAFJlc2V0TW91c2VEcmFnRGVsdGEAR2V0TW91c2VDdXJzb3IAU2V0TW91c2VDdXJzb3IAQ2FwdHVyZUtleWJvYXJkRnJvbUFwcABDYXB0dXJlTW91c2VGcm9tQXBwAEdldENsaXBib2FyZFRleHQAU2V0Q2xpcGJvYXJkVGV4dABMb2FkSW5pU2V0dGluZ3NGcm9tTWVtb3J5AFNhdmVJbmlTZXR0aW5nc1RvTWVtb3J5AFNldEFsbG9jYXRvckZ1bmN0aW9ucwBNZW1BbGxvYwBNZW1G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eWJlX251bGxfdmFsdWVJNkltVmVjMkUAAIzYAAD8vgBBsP4CCyLEngAAQNgAAHDYAADEngAAaWlpZmkAAADEngAAxJ4AANjXAEHg/gIL0ArM1wAAxJ4AAMSeAADEngAAxJ4AAGTYAAB2b2lkAGJvb2wAY2hhcgBzaWduZWQgY2hhcgB1bnNpZ25lZCBjaGFyAHNob3J0AHVuc2lnbmVkIHNob3J0AGludAB1bnNpZ25lZCBpbnQAbG9uZwB1bnNpZ25lZCBsb25nAGZsb2F0AGRvdWJsZQBzdGQ6OnN0cmluZwBzdGQ6OmJhc2ljX3N0cmluZzx1bnNpZ25lZCBjaGFyPgBzdGQ6OndzdHJpbmcAc3RkOjp1MTZzdHJpbmcAc3RkOjp1MzJzdHJpbmcAZW1zY3JpcHRlbjo6dmFsAGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGNoYXI+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHNpZ25lZCBjaGFyPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBjaGFyPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxzaG9ydD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgc2hvcnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgaW50PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxsb25nPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBsb25nPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQ4X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQ4X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludDE2X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQxNl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQzMl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50MzJfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8ZmxvYXQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGRvdWJsZT4ATlN0M19f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AAwAQeWhAwsBDgBB8aEDCxUNAAAABA0AAAAACQ4AAAAAAA4AAA4AQZ+iAwsBEABBq6IDCx4PAAAAAA8AAAAACRAAAAAAABAAABAAABIAAAASEhIAQeKiAwsOEgAAABISEgAAAAAAAAkAQZOjAwsBCwBBn6MDCxUKAAAAAAoAAAAACQsAAAAAAAsAAAsAQc2jAwsBDABB2aMDC0sMAAAAAAwAAAAACQwAAAAAAAwAAAwAADAxMjM0NTY3ODlBQkNERUYtMFgrMFggMFgtMHgrMHggMHgAaW5mAElORgBuYW4ATkFOAC4AQcykAwsCfwMAQfOkAwsF//////8AQbilAwsMaW5maW5pdHkAbmFuAEHQpQMLrg3RdJ4AV529KoBwUg///z4nCgAAAGQAAADoAwAAECcAAKCGAQBAQg8AgJaYAADh9QUYAAAANQAAAHEAAABr////zvv//5K///8AAAAAAAAAAP////////////////////////////////////////////////////////////////8AAQIDBAUGBwgJ/////////woLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIj////////CgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAECBAcDBgUAAAAAAAAAAgAAwAMAAMAEAADABQAAwAYAAMAHAADACAAAwAkAAMAKAADACwAAwAwAAMANAADADgAAwA8AAMAQAADAEQAAwBIAAMATAADAFAAAwBUAAMAWAADAFwAAwBgAAMAZAADAGgAAwBsAAMAcAADAHQAAwB4AAMAfAADAAAAAswEAAMMCAADDAwAAwwQAAMMFAADDBgAAwwcAAMMIAADDCQAAwwoAAMMLAADDDAAAww0AANMOAADDDwAAwwAADLsBAAzDAgAMwwMADMMEAAzTcndhAGJhc2ljX3N0cmluZwBhbGxvY2F0b3I8VD46OmFsbG9jYXRlKHNpemVfdCBuKSAnbicgZXhjZWVkcyBtYXhpbXVtIHN1cHBvcnRlZCBzaXplAHZlY3RvcgBfX2N4YV9ndWFyZF9hY3F1aXJlIGRldGVjdGVkIHJlY3Vyc2l2ZSBpbml0aWFsaXphdGlvbgBzdGQ6OmV4Y2VwdGlvbgAAAAAAAAAAxNUAAIQDAACFAwAAhgMAAFN0OWV4Y2VwdGlvbgAAAACM2AAAtNUAAAAAAADw1QAAKwMAAIcDAACIAwAAU3QxMWxvZ2ljX2Vycm9yALTYAADg1QAAxNUAAAAAAAAk1gAAKwMAAIkDAACIAwAAU3QxMmxlbmd0aF9lcnJvcgAAAAC02AAAENYAAPDVAABTdDl0eXBlX2luZm8AAAAAjNgAADDWAABOMTBfX2N4eGFiaXYxMTZfX3NoaW1fdHlwZV9pbmZvRQAAAAC02AAASNYAAEDWAABOMTBfX2N4eGFiaXYxMTdfX2NsYXNzX3R5cGVfaW5mb0UAAAC02AAAeNYAAGzWAABOMTBfX2N4eGFiaXYxMTdfX3BiYXNlX3R5cGVfaW5mb0UAAAC02AAAqNYAAGzWAABOMTBfX2N4eGFiaXYxMTlfX3BvaW50ZXJfdHlwZV9pbmZvRQC02AAA2NYAAMzWAABOMTBfX2N4eGFiaXYxMjBfX2Z1bmN0aW9uX3R5cGVfaW5mb0UAAAAAtNgAAAjXAABs1gAATjEwX19jeHhhYml2MTI5X19wb2ludGVyX3RvX21lbWJlcl90eXBlX2luZm9FAAAAtNgAADzXAADM1gAAAAAAALzXAACKAwAAiwMAAIwDAACNAwAAjgMAAE4xMF9fY3h4YWJpdjEyM19fZnVuZGFtZW50YWxfdHlwZV9pbmZvRQC02AAAlNcAAGzWAAB2AAAAgNcAAMjXAABQdgAAbNkAANTXAAAAAAAAzNcAAERuAACA1wAA6NcAAGIAAACA1wAA9NcAAGMAAACA1wAAANgAAGgAAACA1wAADNgAAGEAAACA1wAAGNgAAHMAAACA1wAAJNgAAHQAAACA1wAAMNgAAGkAAACA1wAAPNgAAGoAAACA1wAASNgAAGwAAACA1wAAVNgAAG0AAACA1wAAYNgAAGYAAACA1wAAbNgAAGQAAACA1wAAeNgAAAAAAACc1gAAigMAAI8DAACMAwAAjQMAAJADAACRAwAAkgMAAJMDAAAAAAAA/NgAAIoDAACUAwAAjAMAAI0DAACQAwAAlQMAAJYDAACXAwAATjEwX19jeHhhYml2MTIwX19zaV9jbGFzc190eXBlX2luZm9FAAAAALTYAADU2AAAnNYAAAAAAABY2QAAigMAAJgDAACMAwAAjQMAAJADAACZAwAAmgMAAJsDAABOMTBfX2N4eGFiaXYxMjFfX3ZtaV9jbGFzc190eXBlX2luZm9FAAAAtNgAADDZAACc1gAAAAAAAPzWAACKAwAAnAMAAIwDAACNAwAAnQMAQYCzAwsRCAAAAAkAAAAEAAAAAQAAAAUAQZyzAwsCegMAQbSzAwsOewMAAHwDAADYIQEAAAQAQcyzAwsBAQBB27MDCwUK/////wBBoLQDCwKQ2QBB1bUDCwImAQBBjLYDCwMgKFE=";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile);}function getBinary(){try{if(wasmBinary){return new Uint8Array(wasmBinary)}var binary=tryParseAsDataURI(wasmBinaryFile);if(binary){return binary}if(readBinary){return readBinary(wasmBinaryFile)}else {throw "both async and sync fetching of the wasm failed"}}catch(err){abort(err);}}function getBinaryPromise(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)&&typeof fetch==="function"&&!isFileURI(wasmBinaryFile)){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw "failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary()})}return Promise.resolve().then(getBinary)}function createWasm(){var info={"a":asmLibraryArg};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmTable=Module["asm"]["R"];removeRunDependency();}addRunDependency();function receiveInstantiatedSource(output){receiveInstance(output["instance"]);}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){return WebAssembly.instantiate(binary,info)}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason);})}function instantiateAsync(){if(!wasmBinary&&typeof WebAssembly.instantiateStreaming==="function"&&!isDataURI(wasmBinaryFile)&&!isFileURI(wasmBinaryFile)&&typeof fetch==="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,info);return result.then(receiveInstantiatedSource,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(receiveInstantiatedSource)})})}else {return instantiateArrayBuffer(receiveInstantiatedSource)}}if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}instantiateAsync().catch(readyPromiseReject);return {}}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback(Module);continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){wasmTable.get(func)();}else {wasmTable.get(func)(callback.arg);}}else {func(callback.arg===undefined?null:callback.arg);}}}function dynCallLegacy(sig,ptr,args){if(args&&args.length){return Module["dynCall_"+sig].apply(null,[ptr].concat(args))}return Module["dynCall_"+sig].call(null,ptr)}function dynCall(sig,ptr,args){if(sig.indexOf("j")!=-1){return dynCallLegacy(sig,ptr,args)}return wasmTable.get(ptr).apply(null,args)}var ExceptionInfoAttrs={DESTRUCTOR_OFFSET:0,REFCOUNT_OFFSET:4,TYPE_OFFSET:8,CAUGHT_OFFSET:12,RETHROWN_OFFSET:13,SIZE:16};function ___cxa_allocate_exception(size){return _malloc(size+ExceptionInfoAttrs.SIZE)+ExceptionInfoAttrs.SIZE}function ExceptionInfo(excPtr){this.excPtr=excPtr;this.ptr=excPtr-ExceptionInfoAttrs.SIZE;this.set_type=function(type){HEAP32[this.ptr+ExceptionInfoAttrs.TYPE_OFFSET>>2]=type;};this.get_type=function(){return HEAP32[this.ptr+ExceptionInfoAttrs.TYPE_OFFSET>>2]};this.set_destructor=function(destructor){HEAP32[this.ptr+ExceptionInfoAttrs.DESTRUCTOR_OFFSET>>2]=destructor;};this.get_destructor=function(){return HEAP32[this.ptr+ExceptionInfoAttrs.DESTRUCTOR_OFFSET>>2]};this.set_refcount=function(refcount){HEAP32[this.ptr+ExceptionInfoAttrs.REFCOUNT_OFFSET>>2]=refcount;};this.set_caught=function(caught){caught=caught?1:0;HEAP8[this.ptr+ExceptionInfoAttrs.CAUGHT_OFFSET>>0]=caught;};this.get_caught=function(){return HEAP8[this.ptr+ExceptionInfoAttrs.CAUGHT_OFFSET>>0]!=0};this.set_rethrown=function(rethrown){rethrown=rethrown?1:0;HEAP8[this.ptr+ExceptionInfoAttrs.RETHROWN_OFFSET>>0]=rethrown;};this.get_rethrown=function(){return HEAP8[this.ptr+ExceptionInfoAttrs.RETHROWN_OFFSET>>0]!=0};this.init=function(type,destructor){this.set_type(type);this.set_destructor(destructor);this.set_refcount(0);this.set_caught(false);this.set_rethrown(false);};this.add_ref=function(){var value=HEAP32[this.ptr+ExceptionInfoAttrs.REFCOUNT_OFFSET>>2];HEAP32[this.ptr+ExceptionInfoAttrs.REFCOUNT_OFFSET>>2]=value+1;};this.release_ref=function(){var prev=HEAP32[this.ptr+ExceptionInfoAttrs.REFCOUNT_OFFSET>>2];HEAP32[this.ptr+ExceptionInfoAttrs.REFCOUNT_OFFSET>>2]=prev-1;return prev===1};}function ___cxa_throw(ptr,type,destructor){var info=new ExceptionInfo(ptr);info.init(type,destructor);throw ptr}var SYSCALLS={mappings:{},buffers:[null,[],[]],printChar:function(stream,curr){var buffer=SYSCALLS.buffers[stream];if(curr===0||curr===10){(stream===1?out:err)(UTF8ArrayToString(buffer,0));buffer.length=0;}else {buffer.push(curr);}},varargs:undefined,get:function(){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret},getStr:function(ptr){var ret=UTF8ToString(ptr);return ret},get64:function(low,high){return low}};function ___sys_fcntl64(fd,cmd,varargs){SYSCALLS.varargs=varargs;return 0}function ___sys_ioctl(fd,op,varargs){SYSCALLS.varargs=varargs;return 0}function ___sys_open(path,flags,varargs){SYSCALLS.varargs=varargs;}function getShiftFromSize(size){switch(size){case 1:return 0;case 2:return 1;case 4:return 2;case 8:return 3;default:throw new TypeError("Unknown type size: "+size)}}function embind_init_charCodes(){var codes=new Array(256);for(var i=0;i<256;++i){codes[i]=String.fromCharCode(i);}embind_charCodes=codes;}var embind_charCodes=undefined;function readLatin1String(ptr){var ret="";var c=ptr;while(HEAPU8[c]){ret+=embind_charCodes[HEAPU8[c++]];}return ret}var awaitingDependencies={};var registeredTypes={};var typeDependencies={};var char_0=48;var char_9=57;function makeLegalFunctionName(name){if(undefined===name){return "_unknown"}name=name.replace(/[^a-zA-Z0-9_]/g,"$");var f=name.charCodeAt(0);if(f>=char_0&&f<=char_9){return "_"+name}else {return name}}function createNamedFunction(name,body){name=makeLegalFunctionName(name);return new Function("body","return function "+name+"() {\n"+'    "use strict";'+"    return body.apply(this, arguments);\n"+"};\n")(body)}function extendError(baseErrorType,errorName){var errorClass=createNamedFunction(errorName,function(message){this.name=errorName;this.message=message;var stack=new Error(message).stack;if(stack!==undefined){this.stack=this.toString()+"\n"+stack.replace(/^Error(:[^\n]*)?\n/,"");}});errorClass.prototype=Object.create(baseErrorType.prototype);errorClass.prototype.constructor=errorClass;errorClass.prototype.toString=function(){if(this.message===undefined){return this.name}else {return this.name+": "+this.message}};return errorClass}var BindingError=undefined;function throwBindingError(message){throw new BindingError(message)}var InternalError=undefined;function throwInternalError(message){throw new InternalError(message)}function whenDependentTypesAreResolved(myTypes,dependentTypes,getTypeConverters){myTypes.forEach(function(type){typeDependencies[type]=dependentTypes;});function onComplete(typeConverters){var myTypeConverters=getTypeConverters(typeConverters);if(myTypeConverters.length!==myTypes.length){throwInternalError("Mismatched type converter count");}for(var i=0;i<myTypes.length;++i){registerType(myTypes[i],myTypeConverters[i]);}}var typeConverters=new Array(dependentTypes.length);var unregisteredTypes=[];var registered=0;dependentTypes.forEach(function(dt,i){if(registeredTypes.hasOwnProperty(dt)){typeConverters[i]=registeredTypes[dt];}else {unregisteredTypes.push(dt);if(!awaitingDependencies.hasOwnProperty(dt)){awaitingDependencies[dt]=[];}awaitingDependencies[dt].push(function(){typeConverters[i]=registeredTypes[dt];++registered;if(registered===unregisteredTypes.length){onComplete(typeConverters);}});}});if(0===unregisteredTypes.length){onComplete(typeConverters);}}function registerType(rawType,registeredInstance,options){options=options||{};if(!("argPackAdvance"in registeredInstance)){throw new TypeError("registerType registeredInstance requires argPackAdvance")}var name=registeredInstance.name;if(!rawType){throwBindingError('type "'+name+'" must have a positive integer typeid pointer');}if(registeredTypes.hasOwnProperty(rawType)){if(options.ignoreDuplicateRegistrations){return}else {throwBindingError("Cannot register type '"+name+"' twice");}}registeredTypes[rawType]=registeredInstance;delete typeDependencies[rawType];if(awaitingDependencies.hasOwnProperty(rawType)){var callbacks=awaitingDependencies[rawType];delete awaitingDependencies[rawType];callbacks.forEach(function(cb){cb();});}}function __embind_register_bool(rawType,name,size,trueValue,falseValue){var shift=getShiftFromSize(size);name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(wt){return !!wt},"toWireType":function(destructors,o){return o?trueValue:falseValue},"argPackAdvance":8,"readValueFromPointer":function(pointer){var heap;if(size===1){heap=HEAP8;}else if(size===2){heap=HEAP16;}else if(size===4){heap=HEAP32;}else {throw new TypeError("Unknown boolean type size: "+name)}return this["fromWireType"](heap[pointer>>shift])},destructorFunction:null});}function ClassHandle_isAliasOf(other){if(!(this instanceof ClassHandle)){return false}if(!(other instanceof ClassHandle)){return false}var leftClass=this.$$.ptrType.registeredClass;var left=this.$$.ptr;var rightClass=other.$$.ptrType.registeredClass;var right=other.$$.ptr;while(leftClass.baseClass){left=leftClass.upcast(left);leftClass=leftClass.baseClass;}while(rightClass.baseClass){right=rightClass.upcast(right);rightClass=rightClass.baseClass;}return leftClass===rightClass&&left===right}function shallowCopyInternalPointer(o){return {count:o.count,deleteScheduled:o.deleteScheduled,preservePointerOnDelete:o.preservePointerOnDelete,ptr:o.ptr,ptrType:o.ptrType,smartPtr:o.smartPtr,smartPtrType:o.smartPtrType}}function throwInstanceAlreadyDeleted(obj){function getInstanceTypeName(handle){return handle.$$.ptrType.registeredClass.name}throwBindingError(getInstanceTypeName(obj)+" instance already deleted");}var finalizationGroup=false;function detachFinalizer(handle){}function runDestructor($$){if($$.smartPtr){$$.smartPtrType.rawDestructor($$.smartPtr);}else {$$.ptrType.registeredClass.rawDestructor($$.ptr);}}function releaseClassHandle($$){$$.count.value-=1;var toDelete=0===$$.count.value;if(toDelete){runDestructor($$);}}function attachFinalizer(handle){if("undefined"===typeof FinalizationGroup){attachFinalizer=function(handle){return handle};return handle}finalizationGroup=new FinalizationGroup(function(iter){for(var result=iter.next();!result.done;result=iter.next()){var $$=result.value;if(!$$.ptr){console.warn("object already deleted: "+$$.ptr);}else {releaseClassHandle($$);}}});attachFinalizer=function(handle){finalizationGroup.register(handle,handle.$$,handle.$$);return handle};detachFinalizer=function(handle){finalizationGroup.unregister(handle.$$);};return attachFinalizer(handle)}function ClassHandle_clone(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this);}if(this.$$.preservePointerOnDelete){this.$$.count.value+=1;return this}else {var clone=attachFinalizer(Object.create(Object.getPrototypeOf(this),{$$:{value:shallowCopyInternalPointer(this.$$)}}));clone.$$.count.value+=1;clone.$$.deleteScheduled=false;return clone}}function ClassHandle_delete(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this);}if(this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete){throwBindingError("Object already scheduled for deletion");}detachFinalizer(this);releaseClassHandle(this.$$);if(!this.$$.preservePointerOnDelete){this.$$.smartPtr=undefined;this.$$.ptr=undefined;}}function ClassHandle_isDeleted(){return !this.$$.ptr}var delayFunction=undefined;var deletionQueue=[];function flushPendingDeletes(){while(deletionQueue.length){var obj=deletionQueue.pop();obj.$$.deleteScheduled=false;obj["delete"]();}}function ClassHandle_deleteLater(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this);}if(this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete){throwBindingError("Object already scheduled for deletion");}deletionQueue.push(this);if(deletionQueue.length===1&&delayFunction){delayFunction(flushPendingDeletes);}this.$$.deleteScheduled=true;return this}function init_ClassHandle(){ClassHandle.prototype["isAliasOf"]=ClassHandle_isAliasOf;ClassHandle.prototype["clone"]=ClassHandle_clone;ClassHandle.prototype["delete"]=ClassHandle_delete;ClassHandle.prototype["isDeleted"]=ClassHandle_isDeleted;ClassHandle.prototype["deleteLater"]=ClassHandle_deleteLater;}function ClassHandle(){}var registeredPointers={};function ensureOverloadTable(proto,methodName,humanName){if(undefined===proto[methodName].overloadTable){var prevFunc=proto[methodName];proto[methodName]=function(){if(!proto[methodName].overloadTable.hasOwnProperty(arguments.length)){throwBindingError("Function '"+humanName+"' called with an invalid number of arguments ("+arguments.length+") - expects one of ("+proto[methodName].overloadTable+")!");}return proto[methodName].overloadTable[arguments.length].apply(this,arguments)};proto[methodName].overloadTable=[];proto[methodName].overloadTable[prevFunc.argCount]=prevFunc;}}function exposePublicSymbol(name,value,numArguments){if(Module.hasOwnProperty(name)){if(undefined===numArguments||undefined!==Module[name].overloadTable&&undefined!==Module[name].overloadTable[numArguments]){throwBindingError("Cannot register public name '"+name+"' twice");}ensureOverloadTable(Module,name,name);if(Module.hasOwnProperty(numArguments)){throwBindingError("Cannot register multiple overloads of a function with the same number of arguments ("+numArguments+")!");}Module[name].overloadTable[numArguments]=value;}else {Module[name]=value;if(undefined!==numArguments){Module[name].numArguments=numArguments;}}}function RegisteredClass(name,constructor,instancePrototype,rawDestructor,baseClass,getActualType,upcast,downcast){this.name=name;this.constructor=constructor;this.instancePrototype=instancePrototype;this.rawDestructor=rawDestructor;this.baseClass=baseClass;this.getActualType=getActualType;this.upcast=upcast;this.downcast=downcast;this.pureVirtualFunctions=[];}function upcastPointer(ptr,ptrClass,desiredClass){while(ptrClass!==desiredClass){if(!ptrClass.upcast){throwBindingError("Expected null or instance of "+desiredClass.name+", got an instance of "+ptrClass.name);}ptr=ptrClass.upcast(ptr);ptrClass=ptrClass.baseClass;}return ptr}function constNoSmartPtrRawPointerToWireType(destructors,handle){if(handle===null){if(this.isReference){throwBindingError("null is not a valid "+this.name);}return 0}if(!handle.$$){throwBindingError('Cannot pass "'+_embind_repr(handle)+'" as a '+this.name);}if(!handle.$$.ptr){throwBindingError("Cannot pass deleted object as a pointer of type "+this.name);}var handleClass=handle.$$.ptrType.registeredClass;var ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);return ptr}function genericPointerToWireType(destructors,handle){var ptr;if(handle===null){if(this.isReference){throwBindingError("null is not a valid "+this.name);}if(this.isSmartPointer){ptr=this.rawConstructor();if(destructors!==null){destructors.push(this.rawDestructor,ptr);}return ptr}else {return 0}}if(!handle.$$){throwBindingError('Cannot pass "'+_embind_repr(handle)+'" as a '+this.name);}if(!handle.$$.ptr){throwBindingError("Cannot pass deleted object as a pointer of type "+this.name);}if(!this.isConst&&handle.$$.ptrType.isConst){throwBindingError("Cannot convert argument of type "+(handle.$$.smartPtrType?handle.$$.smartPtrType.name:handle.$$.ptrType.name)+" to parameter type "+this.name);}var handleClass=handle.$$.ptrType.registeredClass;ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);if(this.isSmartPointer){if(undefined===handle.$$.smartPtr){throwBindingError("Passing raw pointer to smart pointer is illegal");}switch(this.sharingPolicy){case 0:if(handle.$$.smartPtrType===this){ptr=handle.$$.smartPtr;}else {throwBindingError("Cannot convert argument of type "+(handle.$$.smartPtrType?handle.$$.smartPtrType.name:handle.$$.ptrType.name)+" to parameter type "+this.name);}break;case 1:ptr=handle.$$.smartPtr;break;case 2:if(handle.$$.smartPtrType===this){ptr=handle.$$.smartPtr;}else {var clonedHandle=handle["clone"]();ptr=this.rawShare(ptr,__emval_register(function(){clonedHandle["delete"]();}));if(destructors!==null){destructors.push(this.rawDestructor,ptr);}}break;default:throwBindingError("Unsupporting sharing policy");}}return ptr}function nonConstNoSmartPtrRawPointerToWireType(destructors,handle){if(handle===null){if(this.isReference){throwBindingError("null is not a valid "+this.name);}return 0}if(!handle.$$){throwBindingError('Cannot pass "'+_embind_repr(handle)+'" as a '+this.name);}if(!handle.$$.ptr){throwBindingError("Cannot pass deleted object as a pointer of type "+this.name);}if(handle.$$.ptrType.isConst){throwBindingError("Cannot convert argument of type "+handle.$$.ptrType.name+" to parameter type "+this.name);}var handleClass=handle.$$.ptrType.registeredClass;var ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);return ptr}function simpleReadValueFromPointer(pointer){return this["fromWireType"](HEAPU32[pointer>>2])}function RegisteredPointer_getPointee(ptr){if(this.rawGetPointee){ptr=this.rawGetPointee(ptr);}return ptr}function RegisteredPointer_destructor(ptr){if(this.rawDestructor){this.rawDestructor(ptr);}}function RegisteredPointer_deleteObject(handle){if(handle!==null){handle["delete"]();}}function downcastPointer(ptr,ptrClass,desiredClass){if(ptrClass===desiredClass){return ptr}if(undefined===desiredClass.baseClass){return null}var rv=downcastPointer(ptr,ptrClass,desiredClass.baseClass);if(rv===null){return null}return desiredClass.downcast(rv)}function getInheritedInstanceCount(){return Object.keys(registeredInstances).length}function getLiveInheritedInstances(){var rv=[];for(var k in registeredInstances){if(registeredInstances.hasOwnProperty(k)){rv.push(registeredInstances[k]);}}return rv}function setDelayFunction(fn){delayFunction=fn;if(deletionQueue.length&&delayFunction){delayFunction(flushPendingDeletes);}}function init_embind(){Module["getInheritedInstanceCount"]=getInheritedInstanceCount;Module["getLiveInheritedInstances"]=getLiveInheritedInstances;Module["flushPendingDeletes"]=flushPendingDeletes;Module["setDelayFunction"]=setDelayFunction;}var registeredInstances={};function getBasestPointer(class_,ptr){if(ptr===undefined){throwBindingError("ptr should not be undefined");}while(class_.baseClass){ptr=class_.upcast(ptr);class_=class_.baseClass;}return ptr}function getInheritedInstance(class_,ptr){ptr=getBasestPointer(class_,ptr);return registeredInstances[ptr]}function makeClassHandle(prototype,record){if(!record.ptrType||!record.ptr){throwInternalError("makeClassHandle requires ptr and ptrType");}var hasSmartPtrType=!!record.smartPtrType;var hasSmartPtr=!!record.smartPtr;if(hasSmartPtrType!==hasSmartPtr){throwInternalError("Both smartPtrType and smartPtr must be specified");}record.count={value:1};return attachFinalizer(Object.create(prototype,{$$:{value:record}}))}function RegisteredPointer_fromWireType(ptr){var rawPointer=this.getPointee(ptr);if(!rawPointer){this.destructor(ptr);return null}var registeredInstance=getInheritedInstance(this.registeredClass,rawPointer);if(undefined!==registeredInstance){if(0===registeredInstance.$$.count.value){registeredInstance.$$.ptr=rawPointer;registeredInstance.$$.smartPtr=ptr;return registeredInstance["clone"]()}else {var rv=registeredInstance["clone"]();this.destructor(ptr);return rv}}function makeDefaultHandle(){if(this.isSmartPointer){return makeClassHandle(this.registeredClass.instancePrototype,{ptrType:this.pointeeType,ptr:rawPointer,smartPtrType:this,smartPtr:ptr})}else {return makeClassHandle(this.registeredClass.instancePrototype,{ptrType:this,ptr:ptr})}}var actualType=this.registeredClass.getActualType(rawPointer);var registeredPointerRecord=registeredPointers[actualType];if(!registeredPointerRecord){return makeDefaultHandle.call(this)}var toType;if(this.isConst){toType=registeredPointerRecord.constPointerType;}else {toType=registeredPointerRecord.pointerType;}var dp=downcastPointer(rawPointer,this.registeredClass,toType.registeredClass);if(dp===null){return makeDefaultHandle.call(this)}if(this.isSmartPointer){return makeClassHandle(toType.registeredClass.instancePrototype,{ptrType:toType,ptr:dp,smartPtrType:this,smartPtr:ptr})}else {return makeClassHandle(toType.registeredClass.instancePrototype,{ptrType:toType,ptr:dp})}}function init_RegisteredPointer(){RegisteredPointer.prototype.getPointee=RegisteredPointer_getPointee;RegisteredPointer.prototype.destructor=RegisteredPointer_destructor;RegisteredPointer.prototype["argPackAdvance"]=8;RegisteredPointer.prototype["readValueFromPointer"]=simpleReadValueFromPointer;RegisteredPointer.prototype["deleteObject"]=RegisteredPointer_deleteObject;RegisteredPointer.prototype["fromWireType"]=RegisteredPointer_fromWireType;}function RegisteredPointer(name,registeredClass,isReference,isConst,isSmartPointer,pointeeType,sharingPolicy,rawGetPointee,rawConstructor,rawShare,rawDestructor){this.name=name;this.registeredClass=registeredClass;this.isReference=isReference;this.isConst=isConst;this.isSmartPointer=isSmartPointer;this.pointeeType=pointeeType;this.sharingPolicy=sharingPolicy;this.rawGetPointee=rawGetPointee;this.rawConstructor=rawConstructor;this.rawShare=rawShare;this.rawDestructor=rawDestructor;if(!isSmartPointer&&registeredClass.baseClass===undefined){if(isConst){this["toWireType"]=constNoSmartPtrRawPointerToWireType;this.destructorFunction=null;}else {this["toWireType"]=nonConstNoSmartPtrRawPointerToWireType;this.destructorFunction=null;}}else {this["toWireType"]=genericPointerToWireType;}}function replacePublicSymbol(name,value,numArguments){if(!Module.hasOwnProperty(name)){throwInternalError("Replacing nonexistant public symbol");}if(undefined!==Module[name].overloadTable&&undefined!==numArguments){Module[name].overloadTable[numArguments]=value;}else {Module[name]=value;Module[name].argCount=numArguments;}}function getDynCaller(sig,ptr){assert(sig.indexOf("j")>=0,"getDynCaller should only be called with i64 sigs");var argCache=[];return function(){argCache.length=arguments.length;for(var i=0;i<arguments.length;i++){argCache[i]=arguments[i];}return dynCall(sig,ptr,argCache)}}function embind__requireFunction(signature,rawFunction){signature=readLatin1String(signature);function makeDynCaller(){if(signature.indexOf("j")!=-1){return getDynCaller(signature,rawFunction)}return wasmTable.get(rawFunction)}var fp=makeDynCaller();if(typeof fp!=="function"){throwBindingError("unknown function pointer with signature "+signature+": "+rawFunction);}return fp}var UnboundTypeError=undefined;function getTypeName(type){var ptr=___getTypeName(type);var rv=readLatin1String(ptr);_free(ptr);return rv}function throwUnboundTypeError(message,types){var unboundTypes=[];var seen={};function visit(type){if(seen[type]){return}if(registeredTypes[type]){return}if(typeDependencies[type]){typeDependencies[type].forEach(visit);return}unboundTypes.push(type);seen[type]=true;}types.forEach(visit);throw new UnboundTypeError(message+": "+unboundTypes.map(getTypeName).join([", "]))}function __embind_register_class(rawType,rawPointerType,rawConstPointerType,baseClassRawType,getActualTypeSignature,getActualType,upcastSignature,upcast,downcastSignature,downcast,name,destructorSignature,rawDestructor){name=readLatin1String(name);getActualType=embind__requireFunction(getActualTypeSignature,getActualType);if(upcast){upcast=embind__requireFunction(upcastSignature,upcast);}if(downcast){downcast=embind__requireFunction(downcastSignature,downcast);}rawDestructor=embind__requireFunction(destructorSignature,rawDestructor);var legalFunctionName=makeLegalFunctionName(name);exposePublicSymbol(legalFunctionName,function(){throwUnboundTypeError("Cannot construct "+name+" due to unbound types",[baseClassRawType]);});whenDependentTypesAreResolved([rawType,rawPointerType,rawConstPointerType],baseClassRawType?[baseClassRawType]:[],function(base){base=base[0];var baseClass;var basePrototype;if(baseClassRawType){baseClass=base.registeredClass;basePrototype=baseClass.instancePrototype;}else {basePrototype=ClassHandle.prototype;}var constructor=createNamedFunction(legalFunctionName,function(){if(Object.getPrototypeOf(this)!==instancePrototype){throw new BindingError("Use 'new' to construct "+name)}if(undefined===registeredClass.constructor_body){throw new BindingError(name+" has no accessible constructor")}var body=registeredClass.constructor_body[arguments.length];if(undefined===body){throw new BindingError("Tried to invoke ctor of "+name+" with invalid number of parameters ("+arguments.length+") - expected ("+Object.keys(registeredClass.constructor_body).toString()+") parameters instead!")}return body.apply(this,arguments)});var instancePrototype=Object.create(basePrototype,{constructor:{value:constructor}});constructor.prototype=instancePrototype;var registeredClass=new RegisteredClass(name,constructor,instancePrototype,rawDestructor,baseClass,getActualType,upcast,downcast);var referenceConverter=new RegisteredPointer(name,registeredClass,true,false,false);var pointerConverter=new RegisteredPointer(name+"*",registeredClass,false,false,false);var constPointerConverter=new RegisteredPointer(name+" const*",registeredClass,false,true,false);registeredPointers[rawType]={pointerType:pointerConverter,constPointerType:constPointerConverter};replacePublicSymbol(legalFunctionName,constructor);return [referenceConverter,pointerConverter,constPointerConverter]});}function heap32VectorToArray(count,firstElement){var array=[];for(var i=0;i<count;i++){array.push(HEAP32[(firstElement>>2)+i]);}return array}function runDestructors(destructors){while(destructors.length){var ptr=destructors.pop();var del=destructors.pop();del(ptr);}}function __embind_register_class_constructor(rawClassType,argCount,rawArgTypesAddr,invokerSignature,invoker,rawConstructor){assert(argCount>0);var rawArgTypes=heap32VectorToArray(argCount,rawArgTypesAddr);invoker=embind__requireFunction(invokerSignature,invoker);var args=[rawConstructor];var destructors=[];whenDependentTypesAreResolved([],[rawClassType],function(classType){classType=classType[0];var humanName="constructor "+classType.name;if(undefined===classType.registeredClass.constructor_body){classType.registeredClass.constructor_body=[];}if(undefined!==classType.registeredClass.constructor_body[argCount-1]){throw new BindingError("Cannot register multiple constructors with identical number of parameters ("+(argCount-1)+") for class '"+classType.name+"'! Overload resolution is currently only performed using the parameter count, not actual type info!")}classType.registeredClass.constructor_body[argCount-1]=function unboundTypeHandler(){throwUnboundTypeError("Cannot construct "+classType.name+" due to unbound types",rawArgTypes);};whenDependentTypesAreResolved([],rawArgTypes,function(argTypes){classType.registeredClass.constructor_body[argCount-1]=function constructor_body(){if(arguments.length!==argCount-1){throwBindingError(humanName+" called with "+arguments.length+" arguments, expected "+(argCount-1));}destructors.length=0;args.length=argCount;for(var i=1;i<argCount;++i){args[i]=argTypes[i]["toWireType"](destructors,arguments[i-1]);}var ptr=invoker.apply(null,args);runDestructors(destructors);return argTypes[0]["fromWireType"](ptr)};return []});return []});}function new_(constructor,argumentList){if(!(constructor instanceof Function)){throw new TypeError("new_ called with constructor type "+typeof constructor+" which is not a function")}var dummy=createNamedFunction(constructor.name||"unknownFunctionName",function(){});dummy.prototype=constructor.prototype;var obj=new dummy;var r=constructor.apply(obj,argumentList);return r instanceof Object?r:obj}function craftInvokerFunction(humanName,argTypes,classType,cppInvokerFunc,cppTargetFunc){var argCount=argTypes.length;if(argCount<2){throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");}var isClassMethodFunc=argTypes[1]!==null&&classType!==null;var needsDestructorStack=false;for(var i=1;i<argTypes.length;++i){if(argTypes[i]!==null&&argTypes[i].destructorFunction===undefined){needsDestructorStack=true;break}}var returns=argTypes[0].name!=="void";var argsList="";var argsListWired="";for(var i=0;i<argCount-2;++i){argsList+=(i!==0?", ":"")+"arg"+i;argsListWired+=(i!==0?", ":"")+"arg"+i+"Wired";}var invokerFnBody="return function "+makeLegalFunctionName(humanName)+"("+argsList+") {\n"+"if (arguments.length !== "+(argCount-2)+") {\n"+"throwBindingError('function "+humanName+" called with ' + arguments.length + ' arguments, expected "+(argCount-2)+" args!');\n"+"}\n";if(needsDestructorStack){invokerFnBody+="var destructors = [];\n";}var dtorStack=needsDestructorStack?"destructors":"null";var args1=["throwBindingError","invoker","fn","runDestructors","retType","classParam"];var args2=[throwBindingError,cppInvokerFunc,cppTargetFunc,runDestructors,argTypes[0],argTypes[1]];if(isClassMethodFunc){invokerFnBody+="var thisWired = classParam.toWireType("+dtorStack+", this);\n";}for(var i=0;i<argCount-2;++i){invokerFnBody+="var arg"+i+"Wired = argType"+i+".toWireType("+dtorStack+", arg"+i+"); // "+argTypes[i+2].name+"\n";args1.push("argType"+i);args2.push(argTypes[i+2]);}if(isClassMethodFunc){argsListWired="thisWired"+(argsListWired.length>0?", ":"")+argsListWired;}invokerFnBody+=(returns?"var rv = ":"")+"invoker(fn"+(argsListWired.length>0?", ":"")+argsListWired+");\n";if(needsDestructorStack){invokerFnBody+="runDestructors(destructors);\n";}else {for(var i=isClassMethodFunc?1:2;i<argTypes.length;++i){var paramName=i===1?"thisWired":"arg"+(i-2)+"Wired";if(argTypes[i].destructorFunction!==null){invokerFnBody+=paramName+"_dtor("+paramName+"); // "+argTypes[i].name+"\n";args1.push(paramName+"_dtor");args2.push(argTypes[i].destructorFunction);}}}if(returns){invokerFnBody+="var ret = retType.fromWireType(rv);\n"+"return ret;\n";}invokerFnBody+="}\n";args1.push(invokerFnBody);var invokerFunction=new_(Function,args1).apply(null,args2);return invokerFunction}function __embind_register_class_function(rawClassType,methodName,argCount,rawArgTypesAddr,invokerSignature,rawInvoker,context,isPureVirtual){var rawArgTypes=heap32VectorToArray(argCount,rawArgTypesAddr);methodName=readLatin1String(methodName);rawInvoker=embind__requireFunction(invokerSignature,rawInvoker);whenDependentTypesAreResolved([],[rawClassType],function(classType){classType=classType[0];var humanName=classType.name+"."+methodName;if(isPureVirtual){classType.registeredClass.pureVirtualFunctions.push(methodName);}function unboundTypesHandler(){throwUnboundTypeError("Cannot call "+humanName+" due to unbound types",rawArgTypes);}var proto=classType.registeredClass.instancePrototype;var method=proto[methodName];if(undefined===method||undefined===method.overloadTable&&method.className!==classType.name&&method.argCount===argCount-2){unboundTypesHandler.argCount=argCount-2;unboundTypesHandler.className=classType.name;proto[methodName]=unboundTypesHandler;}else {ensureOverloadTable(proto,methodName,humanName);proto[methodName].overloadTable[argCount-2]=unboundTypesHandler;}whenDependentTypesAreResolved([],rawArgTypes,function(argTypes){var memberFunction=craftInvokerFunction(humanName,argTypes,classType,rawInvoker,context);if(undefined===proto[methodName].overloadTable){memberFunction.argCount=argCount-2;proto[methodName]=memberFunction;}else {proto[methodName].overloadTable[argCount-2]=memberFunction;}return []});return []});}function validateThis(this_,classType,humanName){if(!(this_ instanceof Object)){throwBindingError(humanName+' with invalid "this": '+this_);}if(!(this_ instanceof classType.registeredClass.constructor)){throwBindingError(humanName+' incompatible with "this" of type '+this_.constructor.name);}if(!this_.$$.ptr){throwBindingError("cannot call emscripten binding method "+humanName+" on deleted object");}return upcastPointer(this_.$$.ptr,this_.$$.ptrType.registeredClass,classType.registeredClass)}function __embind_register_class_property(classType,fieldName,getterReturnType,getterSignature,getter,getterContext,setterArgumentType,setterSignature,setter,setterContext){fieldName=readLatin1String(fieldName);getter=embind__requireFunction(getterSignature,getter);whenDependentTypesAreResolved([],[classType],function(classType){classType=classType[0];var humanName=classType.name+"."+fieldName;var desc={get:function(){throwUnboundTypeError("Cannot access "+humanName+" due to unbound types",[getterReturnType,setterArgumentType]);},enumerable:true,configurable:true};if(setter){desc.set=function(){throwUnboundTypeError("Cannot access "+humanName+" due to unbound types",[getterReturnType,setterArgumentType]);};}else {desc.set=function(v){throwBindingError(humanName+" is a read-only property");};}Object.defineProperty(classType.registeredClass.instancePrototype,fieldName,desc);whenDependentTypesAreResolved([],setter?[getterReturnType,setterArgumentType]:[getterReturnType],function(types){var getterReturnType=types[0];var desc={get:function(){var ptr=validateThis(this,classType,humanName+" getter");return getterReturnType["fromWireType"](getter(getterContext,ptr))},enumerable:true};if(setter){setter=embind__requireFunction(setterSignature,setter);var setterArgumentType=types[1];desc.set=function(v){var ptr=validateThis(this,classType,humanName+" setter");var destructors=[];setter(setterContext,ptr,setterArgumentType["toWireType"](destructors,v));runDestructors(destructors);};}Object.defineProperty(classType.registeredClass.instancePrototype,fieldName,desc);return []});return []});}function __embind_register_constant(name,type,value){name=readLatin1String(name);whenDependentTypesAreResolved([],[type],function(type){type=type[0];Module[name]=type["fromWireType"](value);return []});}var emval_free_list=[];var emval_handle_array=[{},{value:undefined},{value:null},{value:true},{value:false}];function __emval_decref(handle){if(handle>4&&0===--emval_handle_array[handle].refcount){emval_handle_array[handle]=undefined;emval_free_list.push(handle);}}function count_emval_handles(){var count=0;for(var i=5;i<emval_handle_array.length;++i){if(emval_handle_array[i]!==undefined){++count;}}return count}function get_first_emval(){for(var i=5;i<emval_handle_array.length;++i){if(emval_handle_array[i]!==undefined){return emval_handle_array[i]}}return null}function init_emval(){Module["count_emval_handles"]=count_emval_handles;Module["get_first_emval"]=get_first_emval;}function __emval_register(value){switch(value){case undefined:{return 1}case null:{return 2}case true:{return 3}case false:{return 4}default:{var handle=emval_free_list.length?emval_free_list.pop():emval_handle_array.length;emval_handle_array[handle]={refcount:1,value:value};return handle}}}function __embind_register_emval(rawType,name){name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(handle){var rv=emval_handle_array[handle].value;__emval_decref(handle);return rv},"toWireType":function(destructors,value){return __emval_register(value)},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:null});}function _embind_repr(v){if(v===null){return "null"}var t=typeof v;if(t==="object"||t==="array"||t==="function"){return v.toString()}else {return ""+v}}function floatReadValueFromPointer(name,shift){switch(shift){case 2:return function(pointer){return this["fromWireType"](HEAPF32[pointer>>2])};case 3:return function(pointer){return this["fromWireType"](HEAPF64[pointer>>3])};default:throw new TypeError("Unknown float type: "+name)}}function __embind_register_float(rawType,name,size){var shift=getShiftFromSize(size);name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(value){return value},"toWireType":function(destructors,value){if(typeof value!=="number"&&typeof value!=="boolean"){throw new TypeError('Cannot convert "'+_embind_repr(value)+'" to '+this.name)}return value},"argPackAdvance":8,"readValueFromPointer":floatReadValueFromPointer(name,shift),destructorFunction:null});}function __embind_register_function(name,argCount,rawArgTypesAddr,signature,rawInvoker,fn){var argTypes=heap32VectorToArray(argCount,rawArgTypesAddr);name=readLatin1String(name);rawInvoker=embind__requireFunction(signature,rawInvoker);exposePublicSymbol(name,function(){throwUnboundTypeError("Cannot call "+name+" due to unbound types",argTypes);},argCount-1);whenDependentTypesAreResolved([],argTypes,function(argTypes){var invokerArgsArray=[argTypes[0],null].concat(argTypes.slice(1));replacePublicSymbol(name,craftInvokerFunction(name,invokerArgsArray,null,rawInvoker,fn),argCount-1);return []});}function integerReadValueFromPointer(name,shift,signed){switch(shift){case 0:return signed?function readS8FromPointer(pointer){return HEAP8[pointer]}:function readU8FromPointer(pointer){return HEAPU8[pointer]};case 1:return signed?function readS16FromPointer(pointer){return HEAP16[pointer>>1]}:function readU16FromPointer(pointer){return HEAPU16[pointer>>1]};case 2:return signed?function readS32FromPointer(pointer){return HEAP32[pointer>>2]}:function readU32FromPointer(pointer){return HEAPU32[pointer>>2]};default:throw new TypeError("Unknown integer type: "+name)}}function __embind_register_integer(primitiveType,name,size,minRange,maxRange){name=readLatin1String(name);if(maxRange===-1){maxRange=4294967295;}var shift=getShiftFromSize(size);var fromWireType=function(value){return value};if(minRange===0){var bitshift=32-8*size;fromWireType=function(value){return value<<bitshift>>>bitshift};}var isUnsignedType=name.indexOf("unsigned")!=-1;registerType(primitiveType,{name:name,"fromWireType":fromWireType,"toWireType":function(destructors,value){if(typeof value!=="number"&&typeof value!=="boolean"){throw new TypeError('Cannot convert "'+_embind_repr(value)+'" to '+this.name)}if(value<minRange||value>maxRange){throw new TypeError('Passing a number "'+_embind_repr(value)+'" from JS side to C/C++ side to an argument of type "'+name+'", which is outside the valid range ['+minRange+", "+maxRange+"]!")}return isUnsignedType?value>>>0:value|0},"argPackAdvance":8,"readValueFromPointer":integerReadValueFromPointer(name,shift,minRange!==0),destructorFunction:null});}function __embind_register_memory_view(rawType,dataTypeIndex,name){var typeMapping=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array];var TA=typeMapping[dataTypeIndex];function decodeMemoryView(handle){handle=handle>>2;var heap=HEAPU32;var size=heap[handle];var data=heap[handle+1];return new TA(buffer,data,size)}name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":decodeMemoryView,"argPackAdvance":8,"readValueFromPointer":decodeMemoryView},{ignoreDuplicateRegistrations:true});}function __embind_register_std_string(rawType,name){name=readLatin1String(name);var stdStringIsUTF8=name==="std::string";registerType(rawType,{name:name,"fromWireType":function(value){var length=HEAPU32[value>>2];var str;if(stdStringIsUTF8){var decodeStartPtr=value+4;for(var i=0;i<=length;++i){var currentBytePtr=value+4+i;if(i==length||HEAPU8[currentBytePtr]==0){var maxRead=currentBytePtr-decodeStartPtr;var stringSegment=UTF8ToString(decodeStartPtr,maxRead);if(str===undefined){str=stringSegment;}else {str+=String.fromCharCode(0);str+=stringSegment;}decodeStartPtr=currentBytePtr+1;}}}else {var a=new Array(length);for(var i=0;i<length;++i){a[i]=String.fromCharCode(HEAPU8[value+4+i]);}str=a.join("");}_free(value);return str},"toWireType":function(destructors,value){if(value instanceof ArrayBuffer){value=new Uint8Array(value);}var getLength;var valueIsOfTypeString=typeof value==="string";if(!(valueIsOfTypeString||value instanceof Uint8Array||value instanceof Uint8ClampedArray||value instanceof Int8Array)){throwBindingError("Cannot pass non-string to std::string");}if(stdStringIsUTF8&&valueIsOfTypeString){getLength=function(){return lengthBytesUTF8(value)};}else {getLength=function(){return value.length};}var length=getLength();var ptr=_malloc(4+length+1);HEAPU32[ptr>>2]=length;if(stdStringIsUTF8&&valueIsOfTypeString){stringToUTF8(value,ptr+4,length+1);}else {if(valueIsOfTypeString){for(var i=0;i<length;++i){var charCode=value.charCodeAt(i);if(charCode>255){_free(ptr);throwBindingError("String has UTF-16 code units that do not fit in 8 bits");}HEAPU8[ptr+4+i]=charCode;}}else {for(var i=0;i<length;++i){HEAPU8[ptr+4+i]=value[i];}}}if(destructors!==null){destructors.push(_free,ptr);}return ptr},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:function(ptr){_free(ptr);}});}function __embind_register_std_wstring(rawType,charSize,name){name=readLatin1String(name);var decodeString,encodeString,getHeap,lengthBytesUTF,shift;if(charSize===2){decodeString=UTF16ToString;encodeString=stringToUTF16;lengthBytesUTF=lengthBytesUTF16;getHeap=function(){return HEAPU16};shift=1;}else if(charSize===4){decodeString=UTF32ToString;encodeString=stringToUTF32;lengthBytesUTF=lengthBytesUTF32;getHeap=function(){return HEAPU32};shift=2;}registerType(rawType,{name:name,"fromWireType":function(value){var length=HEAPU32[value>>2];var HEAP=getHeap();var str;var decodeStartPtr=value+4;for(var i=0;i<=length;++i){var currentBytePtr=value+4+i*charSize;if(i==length||HEAP[currentBytePtr>>shift]==0){var maxReadBytes=currentBytePtr-decodeStartPtr;var stringSegment=decodeString(decodeStartPtr,maxReadBytes);if(str===undefined){str=stringSegment;}else {str+=String.fromCharCode(0);str+=stringSegment;}decodeStartPtr=currentBytePtr+charSize;}}_free(value);return str},"toWireType":function(destructors,value){if(!(typeof value==="string")){throwBindingError("Cannot pass non-string to C++ string type "+name);}var length=lengthBytesUTF(value);var ptr=_malloc(4+length+charSize);HEAPU32[ptr>>2]=length>>shift;encodeString(value,ptr+4,length+charSize);if(destructors!==null){destructors.push(_free,ptr);}return ptr},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:function(ptr){_free(ptr);}});}function __embind_register_void(rawType,name){name=readLatin1String(name);registerType(rawType,{isVoid:true,name:name,"argPackAdvance":0,"fromWireType":function(){return undefined},"toWireType":function(destructors,o){return undefined}});}function requireHandle(handle){if(!handle){throwBindingError("Cannot use deleted val. handle = "+handle);}return emval_handle_array[handle].value}function requireRegisteredType(rawType,humanName){var impl=registeredTypes[rawType];if(undefined===impl){throwBindingError(humanName+" has unknown type "+getTypeName(rawType));}return impl}function __emval_as(handle,returnType,destructorsRef){handle=requireHandle(handle);returnType=requireRegisteredType(returnType,"emval::as");var destructors=[];var rd=__emval_register(destructors);HEAP32[destructorsRef>>2]=rd;return returnType["toWireType"](destructors,handle)}function __emval_lookupTypes(argCount,argTypes){var a=new Array(argCount);for(var i=0;i<argCount;++i){a[i]=requireRegisteredType(HEAP32[(argTypes>>2)+i],"parameter "+i);}return a}function __emval_call(handle,argCount,argTypes,argv){handle=requireHandle(handle);var types=__emval_lookupTypes(argCount,argTypes);var args=new Array(argCount);for(var i=0;i<argCount;++i){var type=types[i];args[i]=type["readValueFromPointer"](argv);argv+=type["argPackAdvance"];}var rv=handle.apply(undefined,args);return __emval_register(rv)}var emval_symbols={};function getStringOrSymbol(address){var symbol=emval_symbols[address];if(symbol===undefined){return readLatin1String(address)}else {return symbol}}var emval_methodCallers=[];function __emval_call_void_method(caller,handle,methodName,args){caller=emval_methodCallers[caller];handle=requireHandle(handle);methodName=getStringOrSymbol(methodName);caller(handle,methodName,null,args);}function __emval_addMethodCaller(caller){var id=emval_methodCallers.length;emval_methodCallers.push(caller);return id}function __emval_get_method_caller(argCount,argTypes){var types=__emval_lookupTypes(argCount,argTypes);var retType=types[0];var signatureName=retType.name+"_$"+types.slice(1).map(function(t){return t.name}).join("_")+"$";var params=["retType"];var args=[retType];var argsList="";for(var i=0;i<argCount-1;++i){argsList+=(i!==0?", ":"")+"arg"+i;params.push("argType"+i);args.push(types[1+i]);}var functionName=makeLegalFunctionName("methodCaller_"+signatureName);var functionBody="return function "+functionName+"(handle, name, destructors, args) {\n";var offset=0;for(var i=0;i<argCount-1;++i){functionBody+="    var arg"+i+" = argType"+i+".readValueFromPointer(args"+(offset?"+"+offset:"")+");\n";offset+=types[i+1]["argPackAdvance"];}functionBody+="    var rv = handle[name]("+argsList+");\n";for(var i=0;i<argCount-1;++i){if(types[i+1]["deleteObject"]){functionBody+="    argType"+i+".deleteObject(arg"+i+");\n";}}if(!retType.isVoid){functionBody+="    return retType.toWireType(destructors, rv);\n";}functionBody+="};\n";params.push(functionBody);var invokerFunction=new_(Function,params).apply(null,args);return __emval_addMethodCaller(invokerFunction)}function __emval_get_property(handle,key){handle=requireHandle(handle);key=requireHandle(key);return __emval_register(handle[key])}function __emval_incref(handle){if(handle>4){emval_handle_array[handle].refcount+=1;}}function __emval_new_array(){return __emval_register([])}function __emval_new_cstring(v){return __emval_register(getStringOrSymbol(v))}function __emval_new_object(){return __emval_register({})}function __emval_run_destructors(handle){var destructors=emval_handle_array[handle].value;runDestructors(destructors);__emval_decref(handle);}function __emval_set_property(handle,key,value){handle=requireHandle(handle);key=requireHandle(key);value=requireHandle(value);handle[key]=value;}function __emval_strictly_equals(first,second){first=requireHandle(first);second=requireHandle(second);return first===second}function __emval_take_value(type,argv){type=requireRegisteredType(type,"_emval_take_value");var v=type["readValueFromPointer"](argv);return __emval_register(v)}function __emval_typeof(handle){handle=requireHandle(handle);return __emval_register(typeof handle)}function _abort(){abort();}function _emscripten_memcpy_big(dest,src,num){HEAPU8.copyWithin(dest,src,src+num);}function abortOnCannotGrowMemory(requestedSize){abort("OOM");}function _emscripten_resize_heap(requestedSize){abortOnCannotGrowMemory();}function _fd_close(fd){return 0}function _fd_read(fd,iov,iovcnt,pnum){var stream=SYSCALLS.getStreamFromFD(fd);var num=SYSCALLS.doReadv(stream,iov,iovcnt);HEAP32[pnum>>2]=num;return 0}function _fd_seek(fd,offset_low,offset_high,whence,newOffset){}function _fd_write(fd,iov,iovcnt,pnum){var num=0;for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];for(var j=0;j<len;j++){SYSCALLS.printChar(fd,HEAPU8[ptr+j]);}num+=len;}HEAP32[pnum>>2]=num;return 0}function _setTempRet0($i){}embind_init_charCodes();BindingError=Module["BindingError"]=extendError(Error,"BindingError");InternalError=Module["InternalError"]=extendError(Error,"InternalError");init_ClassHandle();init_RegisteredPointer();init_embind();UnboundTypeError=Module["UnboundTypeError"]=extendError(Error,"UnboundTypeError");init_emval();function intArrayToString(array){var ret=[];for(var i=0;i<array.length;i++){var chr=array[i];if(chr>255){chr&=255;}ret.push(String.fromCharCode(chr));}return ret.join("")}var decodeBase64=typeof atob==="function"?atob:function(input){var keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var output="";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{enc1=keyStr.indexOf(input.charAt(i++));enc2=keyStr.indexOf(input.charAt(i++));enc3=keyStr.indexOf(input.charAt(i++));enc4=keyStr.indexOf(input.charAt(i++));chr1=enc1<<2|enc2>>4;chr2=(enc2&15)<<4|enc3>>2;chr3=(enc3&3)<<6|enc4;output=output+String.fromCharCode(chr1);if(enc3!==64){output=output+String.fromCharCode(chr2);}if(enc4!==64){output=output+String.fromCharCode(chr3);}}while(i<input.length);return output};function intArrayFromBase64(s){if(typeof ENVIRONMENT_IS_NODE==="boolean"&&ENVIRONMENT_IS_NODE){var buf;try{buf=Buffer.from(s,"base64");}catch(_){buf=new Buffer(s,"base64");}return new Uint8Array(buf["buffer"],buf["byteOffset"],buf["byteLength"])}try{var decoded=decodeBase64(s);var bytes=new Uint8Array(decoded.length);for(var i=0;i<decoded.length;++i){bytes[i]=decoded.charCodeAt(i);}return bytes}catch(_){throw new Error("Converting base64 string to bytes failed.")}}function tryParseAsDataURI(filename){if(!isDataURI(filename)){return}return intArrayFromBase64(filename.slice(dataURIPrefix.length))}__ATINIT__.push({func:function(){___wasm_call_ctors();}});var asmLibraryArg={"P":___cxa_allocate_exception,"O":___cxa_throw,"s":___sys_fcntl64,"F":___sys_ioctl,"G":___sys_open,"I":__embind_register_bool,"g":__embind_register_class,"m":__embind_register_class_constructor,"d":__embind_register_class_function,"b":__embind_register_class_property,"w":__embind_register_constant,"H":__embind_register_emval,"u":__embind_register_float,"c":__embind_register_function,"i":__embind_register_integer,"h":__embind_register_memory_view,"v":__embind_register_std_string,"p":__embind_register_std_wstring,"J":__embind_register_void,"f":__emval_as,"M":__emval_call,"k":__emval_call_void_method,"o":__emval_decref,"j":__emval_get_method_caller,"n":__emval_get_property,"q":__emval_incref,"K":__emval_new_array,"y":__emval_new_cstring,"Q":__emval_new_object,"N":__emval_run_destructors,"l":__emval_set_property,"x":__emval_strictly_equals,"e":__emval_take_value,"L":__emval_typeof,"D":_abort,"B":_emscripten_memcpy_big,"C":_emscripten_resize_heap,"t":_fd_close,"E":_fd_read,"z":_fd_seek,"r":_fd_write,"a":wasmMemory,"A":_setTempRet0};var asm=createWasm();var ___wasm_call_ctors=Module["___wasm_call_ctors"]=function(){return (___wasm_call_ctors=Module["___wasm_call_ctors"]=Module["asm"]["S"]).apply(null,arguments)};var _malloc=Module["_malloc"]=function(){return (_malloc=Module["_malloc"]=Module["asm"]["T"]).apply(null,arguments)};var _free=Module["_free"]=function(){return (_free=Module["_free"]=Module["asm"]["U"]).apply(null,arguments)};var ___getTypeName=Module["___getTypeName"]=function(){return (___getTypeName=Module["___getTypeName"]=Module["asm"]["V"]).apply(null,arguments)};var ___embind_register_native_and_builtin_types=Module["___embind_register_native_and_builtin_types"]=function(){return (___embind_register_native_and_builtin_types=Module["___embind_register_native_and_builtin_types"]=Module["asm"]["W"]).apply(null,arguments)};var dynCall_jiji=Module["dynCall_jiji"]=function(){return (dynCall_jiji=Module["dynCall_jiji"]=Module["asm"]["X"]).apply(null,arguments)};var calledRun;function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status;}dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller;};function run(args){if(runDependencies>0){return}preRun();if(runDependencies>0)return;function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();preMain();readyPromiseResolve(Module);if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun();}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("");},1);doRun();},1);}else {doRun();}}Module["run"]=run;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()();}}noExitRuntime=true;run();


      return Module.ready
    }
    );
    })();
    module.exports = Module;
    });

    var bindImgui$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.assign(/*#__PURE__*/Object.create(null), bindImgui, {
        'default': bindImgui
    }));

    function imgui (value) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                bindImgui(value).then((value) => {
                    exports.bind = value;
                    resolve();
                });
            });
        });
    }
    function import_Scalar(sca) {
        if (Array.isArray(sca)) {
            return [sca[0]];
        }
        if (typeof sca === "function") {
            return [sca()];
        }
        return [sca.x];
    }
    function export_Scalar(tuple, sca) {
        if (Array.isArray(sca)) {
            sca[0] = tuple[0];
            return;
        }
        if (typeof sca === "function") {
            sca(tuple[0]);
            return;
        }
        sca.x = tuple[0];
    }
    function import_Vector2(vec) {
        if (Array.isArray(vec)) {
            return [vec[0], vec[1]];
        }
        return [vec.x, vec.y];
    }
    function export_Vector2(tuple, vec) {
        if (Array.isArray(vec)) {
            vec[0] = tuple[0];
            vec[1] = tuple[1];
            return;
        }
        vec.x = tuple[0];
        vec.y = tuple[1];
    }
    function import_Vector3(vec) {
        if (Array.isArray(vec)) {
            return [vec[0], vec[1], vec[2]];
        }
        return [vec.x, vec.y, vec.z];
    }
    function export_Vector3(tuple, vec) {
        if (Array.isArray(vec)) {
            vec[0] = tuple[0];
            vec[1] = tuple[1];
            vec[2] = tuple[2];
            return;
        }
        vec.x = tuple[0];
        vec.y = tuple[1];
        vec.z = tuple[2];
    }
    function import_Vector4(vec) {
        if (Array.isArray(vec)) {
            return [vec[0], vec[1], vec[2], vec[3] || 0];
        }
        return [vec.x, vec.y, vec.z, vec.w];
    }
    function export_Vector4(tuple, vec) {
        if (Array.isArray(vec)) {
            vec[0] = tuple[0];
            vec[1] = tuple[1];
            vec[2] = tuple[2];
            vec[3] = tuple[3];
            return;
        }
        vec.x = tuple[0];
        vec.y = tuple[1];
        vec.z = tuple[2];
        vec.w = tuple[3];
    }
    function import_Color3(col) {
        if (Array.isArray(col)) {
            return [col[0], col[1], col[2]];
        }
        if ("r" in col) {
            return [col.r, col.g, col.b];
        }
        return [col.x, col.y, col.z];
    }
    function export_Color3(tuple, col) {
        if (Array.isArray(col)) {
            col[0] = tuple[0];
            col[1] = tuple[1];
            col[2] = tuple[2];
            return;
        }
        if ("r" in col) {
            col.r = tuple[0];
            col.g = tuple[1];
            col.b = tuple[2];
            return;
        }
        col.x = tuple[0];
        col.y = tuple[1];
        col.z = tuple[2];
    }
    function import_Color4(col) {
        if (Array.isArray(col)) {
            return [col[0], col[1], col[2], col[3]];
        }
        if ("r" in col) {
            return [col.r, col.g, col.b, col.a];
        }
        return [col.x, col.y, col.z, col.w];
    }
    function export_Color4(tuple, col) {
        if (Array.isArray(col)) {
            col[0] = tuple[0];
            col[1] = tuple[1];
            col[2] = tuple[2];
            return;
        }
        if ("r" in col) {
            col.r = tuple[0];
            col.g = tuple[1];
            col.b = tuple[2];
            return;
        }
        col.x = tuple[0];
        col.y = tuple[1];
        col.z = tuple[2];
    }
    const IMGUI_VERSION = "1.71"; // bind.IMGUI_VERSION;
    const IMGUI_VERSION_NUM = 17100; // bind.IMGUI_VERSION_NUM;
    // #define IMGUI_CHECKVERSION()        ImGui::DebugCheckVersionAndDataLayout(IMGUI_VERSION, sizeof(ImGuiIO), sizeof(ImGuiStyle), sizeof(ImVec2), sizeof(ImVec4), sizeof(ImDrawVert))
    function IMGUI_CHECKVERSION() { return DebugCheckVersionAndDataLayout(IMGUI_VERSION, exports.bind.ImGuiIOSize, exports.bind.ImGuiStyleSize, exports.bind.ImVec2Size, exports.bind.ImVec4Size, exports.bind.ImDrawVertSize, exports.bind.ImDrawIdxSize); }
    function IM_ASSERT(_EXPR) { if (!_EXPR) {
        throw new Error();
    } }
    function IM_ARRAYSIZE(_ARR) {
        if (_ARR instanceof ImStringBuffer) {
            return _ARR.size;
        }
        else {
            return _ARR.length;
        }
    }
    class ImStringBuffer {
        constructor(size, buffer = "") {
            this.size = size;
            this.buffer = buffer;
        }
    }
    (function (ImGuiWindowFlags) {
        ImGuiWindowFlags[ImGuiWindowFlags["None"] = 0] = "None";
        ImGuiWindowFlags[ImGuiWindowFlags["NoTitleBar"] = 1] = "NoTitleBar";
        ImGuiWindowFlags[ImGuiWindowFlags["NoResize"] = 2] = "NoResize";
        ImGuiWindowFlags[ImGuiWindowFlags["NoMove"] = 4] = "NoMove";
        ImGuiWindowFlags[ImGuiWindowFlags["NoScrollbar"] = 8] = "NoScrollbar";
        ImGuiWindowFlags[ImGuiWindowFlags["NoScrollWithMouse"] = 16] = "NoScrollWithMouse";
        ImGuiWindowFlags[ImGuiWindowFlags["NoCollapse"] = 32] = "NoCollapse";
        ImGuiWindowFlags[ImGuiWindowFlags["AlwaysAutoResize"] = 64] = "AlwaysAutoResize";
        ImGuiWindowFlags[ImGuiWindowFlags["NoBackground"] = 128] = "NoBackground";
        ImGuiWindowFlags[ImGuiWindowFlags["NoSavedSettings"] = 256] = "NoSavedSettings";
        ImGuiWindowFlags[ImGuiWindowFlags["NoMouseInputs"] = 512] = "NoMouseInputs";
        ImGuiWindowFlags[ImGuiWindowFlags["MenuBar"] = 1024] = "MenuBar";
        ImGuiWindowFlags[ImGuiWindowFlags["HorizontalScrollbar"] = 2048] = "HorizontalScrollbar";
        ImGuiWindowFlags[ImGuiWindowFlags["NoFocusOnAppearing"] = 4096] = "NoFocusOnAppearing";
        ImGuiWindowFlags[ImGuiWindowFlags["NoBringToFrontOnFocus"] = 8192] = "NoBringToFrontOnFocus";
        ImGuiWindowFlags[ImGuiWindowFlags["AlwaysVerticalScrollbar"] = 16384] = "AlwaysVerticalScrollbar";
        ImGuiWindowFlags[ImGuiWindowFlags["AlwaysHorizontalScrollbar"] = 32768] = "AlwaysHorizontalScrollbar";
        ImGuiWindowFlags[ImGuiWindowFlags["AlwaysUseWindowPadding"] = 65536] = "AlwaysUseWindowPadding";
        ImGuiWindowFlags[ImGuiWindowFlags["NoNavInputs"] = 262144] = "NoNavInputs";
        ImGuiWindowFlags[ImGuiWindowFlags["NoNavFocus"] = 524288] = "NoNavFocus";
        ImGuiWindowFlags[ImGuiWindowFlags["UnsavedDocument"] = 1048576] = "UnsavedDocument";
        ImGuiWindowFlags[ImGuiWindowFlags["NoNav"] = 786432] = "NoNav";
        ImGuiWindowFlags[ImGuiWindowFlags["NoDecoration"] = 43] = "NoDecoration";
        ImGuiWindowFlags[ImGuiWindowFlags["NoInputs"] = 786944] = "NoInputs";
        // [Internal]
        ImGuiWindowFlags[ImGuiWindowFlags["NavFlattened"] = 8388608] = "NavFlattened";
        ImGuiWindowFlags[ImGuiWindowFlags["ChildWindow"] = 16777216] = "ChildWindow";
        ImGuiWindowFlags[ImGuiWindowFlags["Tooltip"] = 33554432] = "Tooltip";
        ImGuiWindowFlags[ImGuiWindowFlags["Popup"] = 67108864] = "Popup";
        ImGuiWindowFlags[ImGuiWindowFlags["Modal"] = 134217728] = "Modal";
        ImGuiWindowFlags[ImGuiWindowFlags["ChildMenu"] = 268435456] = "ChildMenu";
    })(exports.WindowFlags || (exports.WindowFlags = {}));
    (function (ImGuiInputTextFlags) {
        ImGuiInputTextFlags[ImGuiInputTextFlags["None"] = 0] = "None";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CharsDecimal"] = 1] = "CharsDecimal";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CharsHexadecimal"] = 2] = "CharsHexadecimal";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CharsUppercase"] = 4] = "CharsUppercase";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CharsNoBlank"] = 8] = "CharsNoBlank";
        ImGuiInputTextFlags[ImGuiInputTextFlags["AutoSelectAll"] = 16] = "AutoSelectAll";
        ImGuiInputTextFlags[ImGuiInputTextFlags["EnterReturnsTrue"] = 32] = "EnterReturnsTrue";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CallbackCompletion"] = 64] = "CallbackCompletion";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CallbackHistory"] = 128] = "CallbackHistory";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CallbackAlways"] = 256] = "CallbackAlways";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CallbackCharFilter"] = 512] = "CallbackCharFilter";
        ImGuiInputTextFlags[ImGuiInputTextFlags["AllowTabInput"] = 1024] = "AllowTabInput";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CtrlEnterForNewLine"] = 2048] = "CtrlEnterForNewLine";
        ImGuiInputTextFlags[ImGuiInputTextFlags["NoHorizontalScroll"] = 4096] = "NoHorizontalScroll";
        ImGuiInputTextFlags[ImGuiInputTextFlags["AlwaysInsertMode"] = 8192] = "AlwaysInsertMode";
        ImGuiInputTextFlags[ImGuiInputTextFlags["ReadOnly"] = 16384] = "ReadOnly";
        ImGuiInputTextFlags[ImGuiInputTextFlags["Password"] = 32768] = "Password";
        ImGuiInputTextFlags[ImGuiInputTextFlags["NoUndoRedo"] = 65536] = "NoUndoRedo";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CharsScientific"] = 131072] = "CharsScientific";
        ImGuiInputTextFlags[ImGuiInputTextFlags["CallbackResize"] = 262144] = "CallbackResize";
        // [Internal]
        ImGuiInputTextFlags[ImGuiInputTextFlags["Multiline"] = 1048576] = "Multiline";
        ImGuiInputTextFlags[ImGuiInputTextFlags["NoMarkEdited"] = 2097152] = "NoMarkEdited";
    })(exports.InputTextFlags || (exports.InputTextFlags = {}));
    (function (ImGuiTreeNodeFlags) {
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["None"] = 0] = "None";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["Selected"] = 1] = "Selected";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["Framed"] = 2] = "Framed";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["AllowItemOverlap"] = 4] = "AllowItemOverlap";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["NoTreePushOnOpen"] = 8] = "NoTreePushOnOpen";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["NoAutoOpenOnLog"] = 16] = "NoAutoOpenOnLog";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["DefaultOpen"] = 32] = "DefaultOpen";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["OpenOnDoubleClick"] = 64] = "OpenOnDoubleClick";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["OpenOnArrow"] = 128] = "OpenOnArrow";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["Leaf"] = 256] = "Leaf";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["Bullet"] = 512] = "Bullet";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["FramePadding"] = 1024] = "FramePadding";
        //SpanAllAvailWidth  = 1 << 11,  // FIXME: TODO: Extend hit box horizontally even if not framed
        //NoScrollOnOpen     = 1 << 12,  // FIXME: TODO: Disable automatic scroll on TreePop() if node got just open and contents is not visible
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["NavLeftJumpsBackHere"] = 8192] = "NavLeftJumpsBackHere";
        ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["CollapsingHeader"] = 26] = "CollapsingHeader";
    })(exports.TreeNodeFlags || (exports.TreeNodeFlags = {}));
    (function (ImGuiSelectableFlags) {
        ImGuiSelectableFlags[ImGuiSelectableFlags["None"] = 0] = "None";
        ImGuiSelectableFlags[ImGuiSelectableFlags["DontClosePopups"] = 1] = "DontClosePopups";
        ImGuiSelectableFlags[ImGuiSelectableFlags["SpanAllColumns"] = 2] = "SpanAllColumns";
        ImGuiSelectableFlags[ImGuiSelectableFlags["AllowDoubleClick"] = 4] = "AllowDoubleClick";
        ImGuiSelectableFlags[ImGuiSelectableFlags["Disabled"] = 8] = "Disabled"; // Cannot be selected, display greyed out text
    })(exports.SelectableFlags || (exports.SelectableFlags = {}));
    (function (ImGuiComboFlags) {
        ImGuiComboFlags[ImGuiComboFlags["None"] = 0] = "None";
        ImGuiComboFlags[ImGuiComboFlags["PopupAlignLeft"] = 1] = "PopupAlignLeft";
        ImGuiComboFlags[ImGuiComboFlags["HeightSmall"] = 2] = "HeightSmall";
        ImGuiComboFlags[ImGuiComboFlags["HeightRegular"] = 4] = "HeightRegular";
        ImGuiComboFlags[ImGuiComboFlags["HeightLarge"] = 8] = "HeightLarge";
        ImGuiComboFlags[ImGuiComboFlags["HeightLargest"] = 16] = "HeightLargest";
        ImGuiComboFlags[ImGuiComboFlags["NoArrowButton"] = 32] = "NoArrowButton";
        ImGuiComboFlags[ImGuiComboFlags["NoPreview"] = 64] = "NoPreview";
        ImGuiComboFlags[ImGuiComboFlags["HeightMask_"] = 30] = "HeightMask_";
    })(exports.ImGuiComboFlags || (exports.ImGuiComboFlags = {}));
    (function (ImGuiTabBarFlags) {
        ImGuiTabBarFlags[ImGuiTabBarFlags["None"] = 0] = "None";
        ImGuiTabBarFlags[ImGuiTabBarFlags["Reorderable"] = 1] = "Reorderable";
        ImGuiTabBarFlags[ImGuiTabBarFlags["AutoSelectNewTabs"] = 2] = "AutoSelectNewTabs";
        ImGuiTabBarFlags[ImGuiTabBarFlags["TabListPopupButton"] = 4] = "TabListPopupButton";
        ImGuiTabBarFlags[ImGuiTabBarFlags["NoCloseWithMiddleMouseButton"] = 8] = "NoCloseWithMiddleMouseButton";
        ImGuiTabBarFlags[ImGuiTabBarFlags["NoTabListScrollingButtons"] = 16] = "NoTabListScrollingButtons";
        ImGuiTabBarFlags[ImGuiTabBarFlags["NoTooltip"] = 32] = "NoTooltip";
        ImGuiTabBarFlags[ImGuiTabBarFlags["FittingPolicyResizeDown"] = 64] = "FittingPolicyResizeDown";
        ImGuiTabBarFlags[ImGuiTabBarFlags["FittingPolicyScroll"] = 128] = "FittingPolicyScroll";
        ImGuiTabBarFlags[ImGuiTabBarFlags["FittingPolicyMask_"] = 192] = "FittingPolicyMask_";
        ImGuiTabBarFlags[ImGuiTabBarFlags["FittingPolicyDefault_"] = 64] = "FittingPolicyDefault_";
    })(exports.TabBarFlags || (exports.TabBarFlags = {}));
    (function (ImGuiTabItemFlags) {
        ImGuiTabItemFlags[ImGuiTabItemFlags["ImGuiTabItemFlags_None"] = 0] = "ImGuiTabItemFlags_None";
        ImGuiTabItemFlags[ImGuiTabItemFlags["ImGuiTabItemFlags_UnsavedDocument"] = 1] = "ImGuiTabItemFlags_UnsavedDocument";
        ImGuiTabItemFlags[ImGuiTabItemFlags["ImGuiTabItemFlags_SetSelected"] = 2] = "ImGuiTabItemFlags_SetSelected";
        ImGuiTabItemFlags[ImGuiTabItemFlags["ImGuiTabItemFlags_NoCloseWithMiddleMouseButton"] = 4] = "ImGuiTabItemFlags_NoCloseWithMiddleMouseButton";
        ImGuiTabItemFlags[ImGuiTabItemFlags["ImGuiTabItemFlags_NoPushId"] = 8] = "ImGuiTabItemFlags_NoPushId"; // Don't call PushID(tab->ID)/PopID() on BeginTabItem()/EndTabItem()
    })(exports.TabItemFlags || (exports.TabItemFlags = {}));
    (function (ImGuiFocusedFlags) {
        ImGuiFocusedFlags[ImGuiFocusedFlags["None"] = 0] = "None";
        ImGuiFocusedFlags[ImGuiFocusedFlags["ChildWindows"] = 1] = "ChildWindows";
        ImGuiFocusedFlags[ImGuiFocusedFlags["RootWindow"] = 2] = "RootWindow";
        ImGuiFocusedFlags[ImGuiFocusedFlags["AnyWindow"] = 4] = "AnyWindow";
        ImGuiFocusedFlags[ImGuiFocusedFlags["RootAndChildWindows"] = 3] = "RootAndChildWindows";
    })(exports.ImGuiFocusedFlags || (exports.ImGuiFocusedFlags = {}));
    (function (ImGuiHoveredFlags) {
        ImGuiHoveredFlags[ImGuiHoveredFlags["None"] = 0] = "None";
        ImGuiHoveredFlags[ImGuiHoveredFlags["ChildWindows"] = 1] = "ChildWindows";
        ImGuiHoveredFlags[ImGuiHoveredFlags["RootWindow"] = 2] = "RootWindow";
        ImGuiHoveredFlags[ImGuiHoveredFlags["AnyWindow"] = 4] = "AnyWindow";
        ImGuiHoveredFlags[ImGuiHoveredFlags["AllowWhenBlockedByPopup"] = 8] = "AllowWhenBlockedByPopup";
        //AllowWhenBlockedByModal     = 1 << 4,   // Return true even if a modal popup window is normally blocking access to this item/window. FIXME-TODO: Unavailable yet.
        ImGuiHoveredFlags[ImGuiHoveredFlags["AllowWhenBlockedByActiveItem"] = 32] = "AllowWhenBlockedByActiveItem";
        ImGuiHoveredFlags[ImGuiHoveredFlags["AllowWhenOverlapped"] = 64] = "AllowWhenOverlapped";
        ImGuiHoveredFlags[ImGuiHoveredFlags["AllowWhenDisabled"] = 128] = "AllowWhenDisabled";
        ImGuiHoveredFlags[ImGuiHoveredFlags["RectOnly"] = 104] = "RectOnly";
        ImGuiHoveredFlags[ImGuiHoveredFlags["RootAndChildWindows"] = 3] = "RootAndChildWindows";
    })(exports.ImGuiHoveredFlags || (exports.ImGuiHoveredFlags = {}));
    (function (ImGuiDragDropFlags) {
        // BeginDragDropSource() flags
        ImGuiDragDropFlags[ImGuiDragDropFlags["None"] = 0] = "None";
        ImGuiDragDropFlags[ImGuiDragDropFlags["SourceNoPreviewTooltip"] = 1] = "SourceNoPreviewTooltip";
        ImGuiDragDropFlags[ImGuiDragDropFlags["SourceNoDisableHover"] = 2] = "SourceNoDisableHover";
        ImGuiDragDropFlags[ImGuiDragDropFlags["SourceNoHoldToOpenOthers"] = 4] = "SourceNoHoldToOpenOthers";
        ImGuiDragDropFlags[ImGuiDragDropFlags["SourceAllowNullID"] = 8] = "SourceAllowNullID";
        ImGuiDragDropFlags[ImGuiDragDropFlags["SourceExtern"] = 16] = "SourceExtern";
        ImGuiDragDropFlags[ImGuiDragDropFlags["SourceAutoExpirePayload"] = 32] = "SourceAutoExpirePayload";
        // AcceptDragDropPayload() flags
        ImGuiDragDropFlags[ImGuiDragDropFlags["AcceptBeforeDelivery"] = 1024] = "AcceptBeforeDelivery";
        ImGuiDragDropFlags[ImGuiDragDropFlags["AcceptNoDrawDefaultRect"] = 2048] = "AcceptNoDrawDefaultRect";
        ImGuiDragDropFlags[ImGuiDragDropFlags["AcceptNoPreviewTooltip"] = 4096] = "AcceptNoPreviewTooltip";
        ImGuiDragDropFlags[ImGuiDragDropFlags["AcceptPeekOnly"] = 3072] = "AcceptPeekOnly";
    })(exports.ImGuiDragDropFlags || (exports.ImGuiDragDropFlags = {}));
    // Standard Drag and Drop payload types. You can define you own payload types using 12-characters long strings. Types starting with '_' are defined by Dear ImGui.
    const IMGUI_PAYLOAD_TYPE_COLOR_3F = "_COL3F"; // float[3]     // Standard type for colors, without alpha. User code may use this type.
    const IMGUI_PAYLOAD_TYPE_COLOR_4F = "_COL4F"; // float[4]     // Standard type for colors. User code may use this type.
    (function (ImGuiDataType) {
        ImGuiDataType[ImGuiDataType["S8"] = 0] = "S8";
        ImGuiDataType[ImGuiDataType["U8"] = 1] = "U8";
        ImGuiDataType[ImGuiDataType["S16"] = 2] = "S16";
        ImGuiDataType[ImGuiDataType["U16"] = 3] = "U16";
        ImGuiDataType[ImGuiDataType["S32"] = 4] = "S32";
        ImGuiDataType[ImGuiDataType["U32"] = 5] = "U32";
        ImGuiDataType[ImGuiDataType["S64"] = 6] = "S64";
        ImGuiDataType[ImGuiDataType["U64"] = 7] = "U64";
        ImGuiDataType[ImGuiDataType["Float"] = 8] = "Float";
        ImGuiDataType[ImGuiDataType["Double"] = 9] = "Double";
        ImGuiDataType[ImGuiDataType["COUNT"] = 10] = "COUNT";
    })(exports.ImGuiDataType || (exports.ImGuiDataType = {}));
    (function (ImGuiDir) {
        ImGuiDir[ImGuiDir["None"] = -1] = "None";
        ImGuiDir[ImGuiDir["Left"] = 0] = "Left";
        ImGuiDir[ImGuiDir["Right"] = 1] = "Right";
        ImGuiDir[ImGuiDir["Up"] = 2] = "Up";
        ImGuiDir[ImGuiDir["Down"] = 3] = "Down";
        ImGuiDir[ImGuiDir["COUNT"] = 4] = "COUNT";
    })(exports.ImGuiDir || (exports.ImGuiDir = {}));
    (function (ImGuiKey) {
        ImGuiKey[ImGuiKey["Tab"] = 0] = "Tab";
        ImGuiKey[ImGuiKey["LeftArrow"] = 1] = "LeftArrow";
        ImGuiKey[ImGuiKey["RightArrow"] = 2] = "RightArrow";
        ImGuiKey[ImGuiKey["UpArrow"] = 3] = "UpArrow";
        ImGuiKey[ImGuiKey["DownArrow"] = 4] = "DownArrow";
        ImGuiKey[ImGuiKey["PageUp"] = 5] = "PageUp";
        ImGuiKey[ImGuiKey["PageDown"] = 6] = "PageDown";
        ImGuiKey[ImGuiKey["Home"] = 7] = "Home";
        ImGuiKey[ImGuiKey["End"] = 8] = "End";
        ImGuiKey[ImGuiKey["Insert"] = 9] = "Insert";
        ImGuiKey[ImGuiKey["Delete"] = 10] = "Delete";
        ImGuiKey[ImGuiKey["Backspace"] = 11] = "Backspace";
        ImGuiKey[ImGuiKey["Space"] = 12] = "Space";
        ImGuiKey[ImGuiKey["Enter"] = 13] = "Enter";
        ImGuiKey[ImGuiKey["Escape"] = 14] = "Escape";
        ImGuiKey[ImGuiKey["A"] = 15] = "A";
        ImGuiKey[ImGuiKey["C"] = 16] = "C";
        ImGuiKey[ImGuiKey["V"] = 17] = "V";
        ImGuiKey[ImGuiKey["X"] = 18] = "X";
        ImGuiKey[ImGuiKey["Y"] = 19] = "Y";
        ImGuiKey[ImGuiKey["Z"] = 20] = "Z";
        ImGuiKey[ImGuiKey["COUNT"] = 21] = "COUNT";
    })(exports.Key || (exports.Key = {}));
    (function (ImGuiNavInput) {
        // Gamepad Mapping
        ImGuiNavInput[ImGuiNavInput["Activate"] = 0] = "Activate";
        ImGuiNavInput[ImGuiNavInput["Cancel"] = 1] = "Cancel";
        ImGuiNavInput[ImGuiNavInput["Input"] = 2] = "Input";
        ImGuiNavInput[ImGuiNavInput["Menu"] = 3] = "Menu";
        ImGuiNavInput[ImGuiNavInput["DpadLeft"] = 4] = "DpadLeft";
        ImGuiNavInput[ImGuiNavInput["DpadRight"] = 5] = "DpadRight";
        ImGuiNavInput[ImGuiNavInput["DpadUp"] = 6] = "DpadUp";
        ImGuiNavInput[ImGuiNavInput["DpadDown"] = 7] = "DpadDown";
        ImGuiNavInput[ImGuiNavInput["LStickLeft"] = 8] = "LStickLeft";
        ImGuiNavInput[ImGuiNavInput["LStickRight"] = 9] = "LStickRight";
        ImGuiNavInput[ImGuiNavInput["LStickUp"] = 10] = "LStickUp";
        ImGuiNavInput[ImGuiNavInput["LStickDown"] = 11] = "LStickDown";
        ImGuiNavInput[ImGuiNavInput["FocusPrev"] = 12] = "FocusPrev";
        ImGuiNavInput[ImGuiNavInput["FocusNext"] = 13] = "FocusNext";
        ImGuiNavInput[ImGuiNavInput["TweakSlow"] = 14] = "TweakSlow";
        ImGuiNavInput[ImGuiNavInput["TweakFast"] = 15] = "TweakFast";
        // [Internal] Don't use directly! This is used internally to differentiate keyboard from gamepad inputs for behaviors that require to differentiate them.
        // Keyboard behavior that have no corresponding gamepad mapping (e.g. CTRL+TAB) may be directly reading from io.KeyDown[] instead of io.NavInputs[].
        ImGuiNavInput[ImGuiNavInput["KeyMenu_"] = 16] = "KeyMenu_";
        ImGuiNavInput[ImGuiNavInput["KeyTab_"] = 17] = "KeyTab_";
        ImGuiNavInput[ImGuiNavInput["KeyLeft_"] = 18] = "KeyLeft_";
        ImGuiNavInput[ImGuiNavInput["KeyRight_"] = 19] = "KeyRight_";
        ImGuiNavInput[ImGuiNavInput["KeyUp_"] = 20] = "KeyUp_";
        ImGuiNavInput[ImGuiNavInput["KeyDown_"] = 21] = "KeyDown_";
        ImGuiNavInput[ImGuiNavInput["COUNT"] = 22] = "COUNT";
        ImGuiNavInput[ImGuiNavInput["InternalStart_"] = 16] = "InternalStart_";
    })(exports.NavInput || (exports.NavInput = {}));
    (function (ImGuiConfigFlags) {
        ImGuiConfigFlags[ImGuiConfigFlags["None"] = 0] = "None";
        ImGuiConfigFlags[ImGuiConfigFlags["NavEnableKeyboard"] = 1] = "NavEnableKeyboard";
        ImGuiConfigFlags[ImGuiConfigFlags["NavEnableGamepad"] = 2] = "NavEnableGamepad";
        ImGuiConfigFlags[ImGuiConfigFlags["NavEnableSetMousePos"] = 4] = "NavEnableSetMousePos";
        ImGuiConfigFlags[ImGuiConfigFlags["NavNoCaptureKeyboard"] = 8] = "NavNoCaptureKeyboard";
        ImGuiConfigFlags[ImGuiConfigFlags["NoMouse"] = 16] = "NoMouse";
        ImGuiConfigFlags[ImGuiConfigFlags["NoMouseCursorChange"] = 32] = "NoMouseCursorChange";
        ImGuiConfigFlags[ImGuiConfigFlags["IsSRGB"] = 1048576] = "IsSRGB";
        ImGuiConfigFlags[ImGuiConfigFlags["IsTouchScreen"] = 2097152] = "IsTouchScreen"; // Application is using a touch screen instead of a mouse.
    })(exports.ImGuiConfigFlags || (exports.ImGuiConfigFlags = {}));
    (function (ImGuiCol) {
        ImGuiCol[ImGuiCol["Text"] = 0] = "Text";
        ImGuiCol[ImGuiCol["TextDisabled"] = 1] = "TextDisabled";
        ImGuiCol[ImGuiCol["WindowBg"] = 2] = "WindowBg";
        ImGuiCol[ImGuiCol["ChildBg"] = 3] = "ChildBg";
        ImGuiCol[ImGuiCol["PopupBg"] = 4] = "PopupBg";
        ImGuiCol[ImGuiCol["Border"] = 5] = "Border";
        ImGuiCol[ImGuiCol["BorderShadow"] = 6] = "BorderShadow";
        ImGuiCol[ImGuiCol["FrameBg"] = 7] = "FrameBg";
        ImGuiCol[ImGuiCol["FrameBgHovered"] = 8] = "FrameBgHovered";
        ImGuiCol[ImGuiCol["FrameBgActive"] = 9] = "FrameBgActive";
        ImGuiCol[ImGuiCol["TitleBg"] = 10] = "TitleBg";
        ImGuiCol[ImGuiCol["TitleBgActive"] = 11] = "TitleBgActive";
        ImGuiCol[ImGuiCol["TitleBgCollapsed"] = 12] = "TitleBgCollapsed";
        ImGuiCol[ImGuiCol["MenuBarBg"] = 13] = "MenuBarBg";
        ImGuiCol[ImGuiCol["ScrollbarBg"] = 14] = "ScrollbarBg";
        ImGuiCol[ImGuiCol["ScrollbarGrab"] = 15] = "ScrollbarGrab";
        ImGuiCol[ImGuiCol["ScrollbarGrabHovered"] = 16] = "ScrollbarGrabHovered";
        ImGuiCol[ImGuiCol["ScrollbarGrabActive"] = 17] = "ScrollbarGrabActive";
        ImGuiCol[ImGuiCol["CheckMark"] = 18] = "CheckMark";
        ImGuiCol[ImGuiCol["SliderGrab"] = 19] = "SliderGrab";
        ImGuiCol[ImGuiCol["SliderGrabActive"] = 20] = "SliderGrabActive";
        ImGuiCol[ImGuiCol["Button"] = 21] = "Button";
        ImGuiCol[ImGuiCol["ButtonHovered"] = 22] = "ButtonHovered";
        ImGuiCol[ImGuiCol["ButtonActive"] = 23] = "ButtonActive";
        ImGuiCol[ImGuiCol["Header"] = 24] = "Header";
        ImGuiCol[ImGuiCol["HeaderHovered"] = 25] = "HeaderHovered";
        ImGuiCol[ImGuiCol["HeaderActive"] = 26] = "HeaderActive";
        ImGuiCol[ImGuiCol["Separator"] = 27] = "Separator";
        ImGuiCol[ImGuiCol["SeparatorHovered"] = 28] = "SeparatorHovered";
        ImGuiCol[ImGuiCol["SeparatorActive"] = 29] = "SeparatorActive";
        ImGuiCol[ImGuiCol["ResizeGrip"] = 30] = "ResizeGrip";
        ImGuiCol[ImGuiCol["ResizeGripHovered"] = 31] = "ResizeGripHovered";
        ImGuiCol[ImGuiCol["ResizeGripActive"] = 32] = "ResizeGripActive";
        ImGuiCol[ImGuiCol["Tab"] = 33] = "Tab";
        ImGuiCol[ImGuiCol["TabHovered"] = 34] = "TabHovered";
        ImGuiCol[ImGuiCol["TabActive"] = 35] = "TabActive";
        ImGuiCol[ImGuiCol["TabUnfocused"] = 36] = "TabUnfocused";
        ImGuiCol[ImGuiCol["TabUnfocusedActive"] = 37] = "TabUnfocusedActive";
        ImGuiCol[ImGuiCol["PlotLines"] = 38] = "PlotLines";
        ImGuiCol[ImGuiCol["PlotLinesHovered"] = 39] = "PlotLinesHovered";
        ImGuiCol[ImGuiCol["PlotHistogram"] = 40] = "PlotHistogram";
        ImGuiCol[ImGuiCol["PlotHistogramHovered"] = 41] = "PlotHistogramHovered";
        ImGuiCol[ImGuiCol["TextSelectedBg"] = 42] = "TextSelectedBg";
        ImGuiCol[ImGuiCol["DragDropTarget"] = 43] = "DragDropTarget";
        ImGuiCol[ImGuiCol["NavHighlight"] = 44] = "NavHighlight";
        ImGuiCol[ImGuiCol["NavWindowingHighlight"] = 45] = "NavWindowingHighlight";
        ImGuiCol[ImGuiCol["NavWindowingDimBg"] = 46] = "NavWindowingDimBg";
        ImGuiCol[ImGuiCol["ModalWindowDimBg"] = 47] = "ModalWindowDimBg";
        ImGuiCol[ImGuiCol["COUNT"] = 48] = "COUNT";
    })(exports.ImGuiCol || (exports.ImGuiCol = {}));
    (function (ImGuiStyleVar) {
        // Enum name ......................// Member in ImGuiStyle structure (see ImGuiStyle for descriptions)
        ImGuiStyleVar[ImGuiStyleVar["Alpha"] = 0] = "Alpha";
        ImGuiStyleVar[ImGuiStyleVar["WindowPadding"] = 1] = "WindowPadding";
        ImGuiStyleVar[ImGuiStyleVar["WindowRounding"] = 2] = "WindowRounding";
        ImGuiStyleVar[ImGuiStyleVar["WindowBorderSize"] = 3] = "WindowBorderSize";
        ImGuiStyleVar[ImGuiStyleVar["WindowMinSize"] = 4] = "WindowMinSize";
        ImGuiStyleVar[ImGuiStyleVar["WindowTitleAlign"] = 5] = "WindowTitleAlign";
        // WindowMenuButtonPosition, // ImGuiDir WindowMenuButtonPosition
        ImGuiStyleVar[ImGuiStyleVar["ChildRounding"] = 6] = "ChildRounding";
        ImGuiStyleVar[ImGuiStyleVar["ChildBorderSize"] = 7] = "ChildBorderSize";
        ImGuiStyleVar[ImGuiStyleVar["PopupRounding"] = 8] = "PopupRounding";
        ImGuiStyleVar[ImGuiStyleVar["PopupBorderSize"] = 9] = "PopupBorderSize";
        ImGuiStyleVar[ImGuiStyleVar["FramePadding"] = 10] = "FramePadding";
        ImGuiStyleVar[ImGuiStyleVar["FrameRounding"] = 11] = "FrameRounding";
        ImGuiStyleVar[ImGuiStyleVar["FrameBorderSize"] = 12] = "FrameBorderSize";
        ImGuiStyleVar[ImGuiStyleVar["ItemSpacing"] = 13] = "ItemSpacing";
        ImGuiStyleVar[ImGuiStyleVar["ItemInnerSpacing"] = 14] = "ItemInnerSpacing";
        ImGuiStyleVar[ImGuiStyleVar["IndentSpacing"] = 15] = "IndentSpacing";
        ImGuiStyleVar[ImGuiStyleVar["ScrollbarSize"] = 16] = "ScrollbarSize";
        ImGuiStyleVar[ImGuiStyleVar["ScrollbarRounding"] = 17] = "ScrollbarRounding";
        ImGuiStyleVar[ImGuiStyleVar["GrabMinSize"] = 18] = "GrabMinSize";
        ImGuiStyleVar[ImGuiStyleVar["GrabRounding"] = 19] = "GrabRounding";
        ImGuiStyleVar[ImGuiStyleVar["TabRounding"] = 20] = "TabRounding";
        ImGuiStyleVar[ImGuiStyleVar["ButtonTextAlign"] = 21] = "ButtonTextAlign";
        ImGuiStyleVar[ImGuiStyleVar["SelectableTextAlign"] = 22] = "SelectableTextAlign";
        ImGuiStyleVar[ImGuiStyleVar["Count_"] = 23] = "Count_";
        ImGuiStyleVar[ImGuiStyleVar["COUNT"] = 23] = "COUNT";
    })(exports.StyleVar || (exports.StyleVar = {}));
    (function (ImGuiBackendFlags) {
        ImGuiBackendFlags[ImGuiBackendFlags["None"] = 0] = "None";
        ImGuiBackendFlags[ImGuiBackendFlags["HasGamepad"] = 1] = "HasGamepad";
        ImGuiBackendFlags[ImGuiBackendFlags["HasMouseCursors"] = 2] = "HasMouseCursors";
        ImGuiBackendFlags[ImGuiBackendFlags["HasSetMousePos"] = 4] = "HasSetMousePos";
        ImGuiBackendFlags[ImGuiBackendFlags["RendererHasVtxOffset"] = 8] = "RendererHasVtxOffset";
    })(exports.ImGuiBackendFlags || (exports.ImGuiBackendFlags = {}));
    (function (ImGuiColorEditFlags) {
        ImGuiColorEditFlags[ImGuiColorEditFlags["None"] = 0] = "None";
        ImGuiColorEditFlags[ImGuiColorEditFlags["NoAlpha"] = 2] = "NoAlpha";
        ImGuiColorEditFlags[ImGuiColorEditFlags["NoPicker"] = 4] = "NoPicker";
        ImGuiColorEditFlags[ImGuiColorEditFlags["NoOptions"] = 8] = "NoOptions";
        ImGuiColorEditFlags[ImGuiColorEditFlags["NoSmallPreview"] = 16] = "NoSmallPreview";
        ImGuiColorEditFlags[ImGuiColorEditFlags["NoInputs"] = 32] = "NoInputs";
        ImGuiColorEditFlags[ImGuiColorEditFlags["NoTooltip"] = 64] = "NoTooltip";
        ImGuiColorEditFlags[ImGuiColorEditFlags["NoLabel"] = 128] = "NoLabel";
        ImGuiColorEditFlags[ImGuiColorEditFlags["NoSidePreview"] = 256] = "NoSidePreview";
        ImGuiColorEditFlags[ImGuiColorEditFlags["NoDragDrop"] = 512] = "NoDragDrop";
        // User Options (right-click on widget to change some of them). You can set application defaults using SetColorEditOptions(). The idea is that you probably don't want to override them in most of your calls, let the user choose and/or call SetColorEditOptions() during startup.
        ImGuiColorEditFlags[ImGuiColorEditFlags["AlphaBar"] = 65536] = "AlphaBar";
        ImGuiColorEditFlags[ImGuiColorEditFlags["AlphaPreview"] = 131072] = "AlphaPreview";
        ImGuiColorEditFlags[ImGuiColorEditFlags["AlphaPreviewHalf"] = 262144] = "AlphaPreviewHalf";
        ImGuiColorEditFlags[ImGuiColorEditFlags["HDR"] = 524288] = "HDR";
        ImGuiColorEditFlags[ImGuiColorEditFlags["DisplayRGB"] = 1048576] = "DisplayRGB";
        ImGuiColorEditFlags[ImGuiColorEditFlags["DisplayHSV"] = 2097152] = "DisplayHSV";
        ImGuiColorEditFlags[ImGuiColorEditFlags["DisplayHex"] = 4194304] = "DisplayHex";
        ImGuiColorEditFlags[ImGuiColorEditFlags["Uint8"] = 8388608] = "Uint8";
        ImGuiColorEditFlags[ImGuiColorEditFlags["Float"] = 16777216] = "Float";
        ImGuiColorEditFlags[ImGuiColorEditFlags["PickerHueBar"] = 33554432] = "PickerHueBar";
        ImGuiColorEditFlags[ImGuiColorEditFlags["PickerHueWheel"] = 67108864] = "PickerHueWheel";
        ImGuiColorEditFlags[ImGuiColorEditFlags["InputRGB"] = 134217728] = "InputRGB";
        ImGuiColorEditFlags[ImGuiColorEditFlags["InputHSV"] = 268435456] = "InputHSV";
        // Defaults Options. You can set application defaults using SetColorEditOptions(). The intent is that you probably don't want to
        // override them in most of your calls. Let the user choose via the option menu and/or call SetColorEditOptions() once during startup.
        ImGuiColorEditFlags[ImGuiColorEditFlags["_OptionsDefault"] = 177209344] = "_OptionsDefault";
        // [Internal] Masks
        ImGuiColorEditFlags[ImGuiColorEditFlags["_DisplayMask"] = 7340032] = "_DisplayMask";
        ImGuiColorEditFlags[ImGuiColorEditFlags["_DataTypeMask"] = 25165824] = "_DataTypeMask";
        ImGuiColorEditFlags[ImGuiColorEditFlags["_PickerMask"] = 100663296] = "_PickerMask";
        ImGuiColorEditFlags[ImGuiColorEditFlags["_InputMask"] = 402653184] = "_InputMask";
    })(exports.ImGuiColorEditFlags || (exports.ImGuiColorEditFlags = {}));
    (function (ImGuiMouseCursor) {
        ImGuiMouseCursor[ImGuiMouseCursor["None"] = -1] = "None";
        ImGuiMouseCursor[ImGuiMouseCursor["Arrow"] = 0] = "Arrow";
        ImGuiMouseCursor[ImGuiMouseCursor["TextInput"] = 1] = "TextInput";
        ImGuiMouseCursor[ImGuiMouseCursor["ResizeAll"] = 2] = "ResizeAll";
        ImGuiMouseCursor[ImGuiMouseCursor["ResizeNS"] = 3] = "ResizeNS";
        ImGuiMouseCursor[ImGuiMouseCursor["ResizeEW"] = 4] = "ResizeEW";
        ImGuiMouseCursor[ImGuiMouseCursor["ResizeNESW"] = 5] = "ResizeNESW";
        ImGuiMouseCursor[ImGuiMouseCursor["ResizeNWSE"] = 6] = "ResizeNWSE";
        ImGuiMouseCursor[ImGuiMouseCursor["Hand"] = 7] = "Hand";
        ImGuiMouseCursor[ImGuiMouseCursor["Count_"] = 8] = "Count_";
        ImGuiMouseCursor[ImGuiMouseCursor["COUNT"] = 8] = "COUNT";
    })(exports.MouseCursor || (exports.MouseCursor = {}));
    (function (ImGuiCond) {
        ImGuiCond[ImGuiCond["Always"] = 1] = "Always";
        ImGuiCond[ImGuiCond["Once"] = 2] = "Once";
        ImGuiCond[ImGuiCond["FirstUseEver"] = 4] = "FirstUseEver";
        ImGuiCond[ImGuiCond["Appearing"] = 8] = "Appearing";
    })(exports.ImGuiCond || (exports.ImGuiCond = {}));
    (function (ImDrawCornerFlags) {
        ImDrawCornerFlags[ImDrawCornerFlags["TopLeft"] = 1] = "TopLeft";
        ImDrawCornerFlags[ImDrawCornerFlags["TopRight"] = 2] = "TopRight";
        ImDrawCornerFlags[ImDrawCornerFlags["BotLeft"] = 4] = "BotLeft";
        ImDrawCornerFlags[ImDrawCornerFlags["BotRight"] = 8] = "BotRight";
        ImDrawCornerFlags[ImDrawCornerFlags["Top"] = 3] = "Top";
        ImDrawCornerFlags[ImDrawCornerFlags["Bot"] = 12] = "Bot";
        ImDrawCornerFlags[ImDrawCornerFlags["Left"] = 5] = "Left";
        ImDrawCornerFlags[ImDrawCornerFlags["Right"] = 10] = "Right";
        ImDrawCornerFlags[ImDrawCornerFlags["All"] = 15] = "All";
    })(exports.wCornerFlags || (exports.wCornerFlags = {}));
    (function (ImDrawListFlags) {
        ImDrawListFlags[ImDrawListFlags["None"] = 0] = "None";
        ImDrawListFlags[ImDrawListFlags["AntiAliasedLines"] = 1] = "AntiAliasedLines";
        ImDrawListFlags[ImDrawListFlags["AntiAliasedFill"] = 2] = "AntiAliasedFill";
    })(exports.wListFlags || (exports.wListFlags = {}));
    class ImVec2 {
        constructor(x = 0.0, y = 0.0) {
            this.x = x;
            this.y = y;
        }
        Set(x, y) {
            this.x = x;
            this.y = y;
            return this;
        }
        Copy(other) {
            this.x = other.x;
            this.y = other.y;
            return this;
        }
        Equals(other) {
            if (this.x !== other.x) {
                return false;
            }
            if (this.y !== other.y) {
                return false;
            }
            return true;
        }
    }
    ImVec2.ZERO = new ImVec2(0.0, 0.0);
    ImVec2.UNIT = new ImVec2(1.0, 1.0);
    ImVec2.UNIT_X = new ImVec2(1.0, 0.0);
    ImVec2.UNIT_Y = new ImVec2(0.0, 1.0);
    class ImVec4 {
        constructor(x = 0.0, y = 0.0, z = 0.0, w = 1.0) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        Set(x, y, z, w) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
            return this;
        }
        Copy(other) {
            this.x = other.x;
            this.y = other.y;
            this.z = other.z;
            this.w = other.w;
            return this;
        }
        Equals(other) {
            if (this.x !== other.x) {
                return false;
            }
            if (this.y !== other.y) {
                return false;
            }
            if (this.z !== other.z) {
                return false;
            }
            if (this.w !== other.w) {
                return false;
            }
            return true;
        }
    }
    ImVec4.ZERO = new ImVec4(0.0, 0.0, 0.0, 0.0);
    ImVec4.UNIT = new ImVec4(1.0, 1.0, 1.0, 1.0);
    ImVec4.UNIT_X = new ImVec4(1.0, 0.0, 0.0, 0.0);
    ImVec4.UNIT_Y = new ImVec4(0.0, 1.0, 0.0, 0.0);
    ImVec4.UNIT_Z = new ImVec4(0.0, 0.0, 1.0, 0.0);
    ImVec4.UNIT_W = new ImVec4(0.0, 0.0, 0.0, 1.0);
    ImVec4.BLACK = new ImVec4(0.0, 0.0, 0.0, 1.0);
    ImVec4.WHITE = new ImVec4(1.0, 1.0, 1.0, 1.0);
    //-----------------------------------------------------------------------------
    // Helpers
    //-----------------------------------------------------------------------------
    // Lightweight std::vector<> like class to avoid dragging dependencies (also: windows implementation of STL with debug enabled is absurdly slow, so let's bypass it so our code runs fast in debug).
    // Our implementation does NOT call C++ constructors/destructors. This is intentional and we do not require it. Do not use this class as a straight std::vector replacement in your code!
    class ImVector extends Array {
        constructor() {
            super(...arguments);
            this.Data = this;
            // public:
            // int                         Size;
            // int                         Capacity;
            // T*                          Data;
            // typedef T                   value_type;
            // typedef value_type*         iterator;
            // typedef const value_type*   const_iterator;
            // inline ImVector()           { Size = Capacity = 0; Data = NULL; }
            // inline ~ImVector()          { if (Data) ImGui::MemFree(Data); }
            // inline bool                 empty() const                   { return Size == 0; }
            // inline int                  size() const                    { return Size; }
            // inline int                  capacity() const                { return Capacity; }
            // inline value_type&          operator[](int i)               { IM_ASSERT(i < Size); return Data[i]; }
            // inline const value_type&    operator[](int i) const         { IM_ASSERT(i < Size); return Data[i]; }
            // inline void                 clear()                         { if (Data) { Size = Capacity = 0; ImGui::MemFree(Data); Data = NULL; } }
            // inline iterator             begin()                         { return Data; }
            // inline const_iterator       begin() const                   { return Data; }
            // inline iterator             end()                           { return Data + Size; }
            // inline const_iterator       end() const                     { return Data + Size; }
            // inline value_type&          front()                         { IM_ASSERT(Size > 0); return Data[0]; }
            // inline const value_type&    front() const                   { IM_ASSERT(Size > 0); return Data[0]; }
            // inline value_type&          back()                          { IM_ASSERT(Size > 0); return Data[Size - 1]; }
            // inline const value_type&    back() const                    { IM_ASSERT(Size > 0); return Data[Size - 1]; }
            // inline void                 swap(ImVector<T>& rhs)          { int rhs_size = rhs.Size; rhs.Size = Size; Size = rhs_size; int rhs_cap = rhs.Capacity; rhs.Capacity = Capacity; Capacity = rhs_cap; value_type* rhs_data = rhs.Data; rhs.Data = Data; Data = rhs_data; }
            // inline int                  _grow_capacity(int size) const  { int new_capacity = Capacity ? (Capacity + Capacity/2) : 8; return new_capacity > size ? new_capacity : size; }
            // inline void                 resize(int new_size)            { if (new_size > Capacity) reserve(_grow_capacity(new_size)); Size = new_size; }
            // inline void                 resize(int new_size, const T& v){ if (new_size > Capacity) reserve(_grow_capacity(new_size)); if (new_size > Size) for (int n = Size; n < new_size; n++) Data[n] = v; Size = new_size; }
            // inline void                 reserve(int new_capacity)
            // {
            //     if (new_capacity <= Capacity)
            //         return;
            //     T* new_data = (value_type*)ImGui::MemAlloc((size_t)new_capacity * sizeof(T));
            //     if (Data)
            //         memcpy(new_data, Data, (size_t)Size * sizeof(T));
            //     ImGui::MemFree(Data);
            //     Data = new_data;
            //     Capacity = new_capacity;
            // }
            // inline void                 push_back(const value_type& v)  { if (Size == Capacity) reserve(_grow_capacity(Size + 1)); Data[Size++] = v; }
            // inline void                 pop_back()                      { IM_ASSERT(Size > 0); Size--; }
            // inline void                 push_front(const value_type& v) { if (Size == 0) push_back(v); else insert(Data, v); }
            // inline iterator             erase(const_iterator it)                        { IM_ASSERT(it >= Data && it < Data+Size); const ptrdiff_t off = it - Data; memmove(Data + off, Data + off + 1, ((size_t)Size - (size_t)off - 1) * sizeof(value_type)); Size--; return Data + off; }
            // inline iterator             erase(const_iterator it, const_iterator it_last){ IM_ASSERT(it >= Data && it < Data+Size && it_last > it && it_last <= Data+Size); const ptrdiff_t count = it_last - it; const ptrdiff_t off = it - Data; memmove(Data + off, Data + off + count, ((size_t)Size - (size_t)off - count) * sizeof(value_type)); Size -= (int)count; return Data + off; }
            // inline iterator             erase_unsorted(const_iterator it)               { IM_ASSERT(it >= Data && it < Data+Size);  const ptrdiff_t off = it - Data; if (it < Data+Size-1) memcpy(Data + off, Data + Size - 1, sizeof(value_type)); Size--; return Data + off; }
            // inline iterator             insert(const_iterator it, const value_type& v)  { IM_ASSERT(it >= Data && it <= Data+Size); const ptrdiff_t off = it - Data; if (Size == Capacity) reserve(_grow_capacity(Size + 1)); if (off < (int)Size) memmove(Data + off + 1, Data + off, ((size_t)Size - (size_t)off) * sizeof(value_type)); Data[off] = v; Size++; return Data + off; }
            // inline bool                 contains(const value_type& v) const             { const T* data = Data;  const T* data_end = Data + Size; while (data < data_end) if (*data++ == v) return true; return false; }
        }
        get Size() { return this.length; }
        empty() { return this.length === 0; }
        clear() { this.length = 0; }
        pop_back() { return this.pop(); }
        push_back(value) { this.push(value); }
    }
    // Helper: Parse and apply text filters. In format "aaaaa[,bbbb][,ccccc]"
    class ImGuiTextFilter {
        // IMGUI_API           ImGuiTextFilter(const char* default_filter = "");
        constructor(default_filter = "") {
            // [Internal]
            // struct TextRange
            // {
            //     const char* b;
            //     const char* e;
            //     TextRange() { b = e = NULL; }
            //     TextRange(const char* _b, const char* _e) { b = _b; e = _e; }
            //     const char* begin() const { return b; }
            //     const char* end() const { return e; }
            //     bool empty() const { return b == e; }
            //     char front() const { return *b; }
            //     static bool is_blank(char c) { return c == ' ' || c == '\t'; }
            //     void trim_blanks() { while (b < e && is_blank(*b)) b++; while (e > b && is_blank(*(e-1))) e--; }
            //     IMGUI_API void split(char separator, ImVector<TextRange>& out);
            // };
            // char                InputBuf[256];
            this.InputBuf = new ImStringBuffer(256);
            // ImVector<TextRange> Filters;
            // int                 CountGrep;
            this.CountGrep = 0;
            if (default_filter) {
                // ImStrncpy(InputBuf, default_filter, IM_ARRAYSIZE(InputBuf));
                this.InputBuf.buffer = default_filter;
                this.Build();
            }
            else {
                // InputBuf[0] = 0;
                this.InputBuf.buffer = "";
                this.CountGrep = 0;
            }
        }
        // IMGUI_API bool      Draw(const char* label = "Filter (inc,-exc)", float width = 0.0f);    // Helper calling InputText+Build
        Draw(label = "Filter (inc,-exc)", width = 0.0) {
            if (width !== 0.0)
                exports.bind.PushItemWidth(width);
            const value_changed = InputText(label, this.InputBuf, IM_ARRAYSIZE(this.InputBuf));
            if (width !== 0.0)
                exports.bind.PopItemWidth();
            if (value_changed)
                this.Build();
            return value_changed;
        }
        // IMGUI_API bool      PassFilter(const char* text, const char* text_end = NULL) const;
        PassFilter(text, text_end = null) {
            // if (Filters.empty())
            //     return true;
            // if (text == NULL)
            //     text = "";
            // for (int i = 0; i != Filters.Size; i++)
            // {
            //     const TextRange& f = Filters[i];
            //     if (f.empty())
            //         continue;
            //     if (f.front() == '-')
            //     {
            //         // Subtract
            //         if (ImStristr(text, text_end, f.begin()+1, f.end()) != NULL)
            //             return false;
            //     }
            //     else
            //     {
            //         // Grep
            //         if (ImStristr(text, text_end, f.begin(), f.end()) != NULL)
            //             return true;
            //     }
            // }
            // Implicit * grep
            if (this.CountGrep === 0)
                return true;
            return false;
        }
        // IMGUI_API void      Build();
        Build() {
            // Filters.resize(0);
            // TextRange input_range(InputBuf, InputBuf+strlen(InputBuf));
            // input_range.split(',', Filters);
            this.CountGrep = 0;
            // for (int i = 0; i != Filters.Size; i++)
            // {
            //     Filters[i].trim_blanks();
            //     if (Filters[i].empty())
            //         continue;
            //     if (Filters[i].front() != '-')
            //         CountGrep += 1;
            // }
        }
        // void                Clear() { InputBuf[0] = 0; Build(); }
        Clear() { this.InputBuf.buffer = ""; this.Build(); }
        // bool                IsActive() const { return !Filters.empty(); }
        IsActive() { return false; }
    }
    // Helper: Text buffer for logging/accumulating text
    class ImGuiTextBuffer {
        constructor() {
            // ImVector<char>      Buf;
            this.Buf = "";
            // ImGuiTextBuffer()   { Buf.push_back(0); }
            // inline char         operator[](int i) { return Buf.Data[i]; }
            // const char*         begin() const { return &Buf.front(); }
            // const char*         end() const { return &Buf.back(); }      // Buf is zero-terminated, so end() will point on the zero-terminator
            // int                 size() const { return Buf.Size - 1; }
            // bool                empty() { return Buf.Size <= 1; }
            // void                clear() { Buf.clear(); Buf.push_back(0); }
            // void                reserve(int capacity) { Buf.reserve(capacity); }
            // const char*         c_str() const { return Buf.Data; }
            // IMGUI_API void      appendf(const char* fmt, ...) IM_FMTARGS(2);
            // IMGUI_API void      appendfv(const char* fmt, va_list args) IM_FMTLIST(2);
        }
        begin() { return this.Buf; }
        size() { return this.Buf.length; }
        clear() { this.Buf = ""; }
        append(text) { this.Buf += text; }
    }
    // Helper: Simple Key->value storage
    // Typically you don't have to worry about this since a storage is held within each Window.
    // We use it to e.g. store collapse state for a tree (Int 0/1), store color edit options.
    // This is optimized for efficient reading (dichotomy into a contiguous buffer), rare writing (typically tied to user interactions)
    // You can use it as custom user storage for temporary values. Declare your own storage if, for example:
    // - You want to manipulate the open/close state of a particular sub-tree in your interface (tree node uses Int 0/1 to store their state).
    // - You want to store custom debug data easily without adding or editing structures in your code (probably not efficient, but convenient)
    // Types are NOT stored, so it is up to you to make sure your Key don't collide with different types.
    class ImGuiStorage {
    }
    // Helpers macros to generate 32-bits encoded colors
    const IM_COL32_R_SHIFT =  0;
    const IM_COL32_G_SHIFT = 8;
    const IM_COL32_B_SHIFT =  16;
    const IM_COL32_A_SHIFT = 24;
    const IM_COL32_A_MASK = 0xFF000000;
    function IM_COL32(R, G, B, A = 255) {
        return ((A << IM_COL32_A_SHIFT) | (B << IM_COL32_B_SHIFT) | (G << IM_COL32_G_SHIFT) | (R << IM_COL32_R_SHIFT)) >>> 0;
    }
    const IM_COL32_WHITE = IM_COL32(255, 255, 255, 255); // Opaque white = 0xFFFFFFFF
    const IM_COL32_BLACK = IM_COL32(0, 0, 0, 255); // Opaque black
    const IM_COL32_BLACK_TRANS = IM_COL32(0, 0, 0, 0); // Transparent black = 0x00000000
    // ImColor() helper to implicity converts colors to either ImU32 (packed 4x1 byte) or ImVec4 (4x1 float)
    // Prefer using IM_COL32() macros if you want a guaranteed compile-time ImU32 for usage with ImDrawList API.
    // **Avoid storing ImColor! Store either u32 of ImVec4. This is not a full-featured color class. MAY OBSOLETE.
    // **None of the ImGui API are using ImColor directly but you can use it as a convenience to pass colors in either ImU32 or ImVec4 formats. Explicitly cast to ImU32 or ImVec4 if needed.
    class ImColor {
        constructor(r = 0.0, g = 0.0, b = 0.0, a = 1.0) {
            // ImVec4              Value;
            this.Value = new ImVec4();
            if (typeof (r) === "number") {
                if (r > 255 && g === 0.0 && b === 0.0 && a === 1.0) {
                    this.Value.x = Math.max(0.0, Math.min(1.0, ((r >> IM_COL32_R_SHIFT) & 0xFF) / 255));
                    this.Value.y = Math.max(0.0, Math.min(1.0, ((r >> IM_COL32_G_SHIFT) & 0xFF) / 255));
                    this.Value.z = Math.max(0.0, Math.min(1.0, ((r >> IM_COL32_B_SHIFT) & 0xFF) / 255));
                    this.Value.w = Math.max(0.0, Math.min(1.0, ((r >> IM_COL32_A_SHIFT) & 0xFF) / 255));
                }
                else if (r <= 1.0 && g <= 1.0 && b <= 1.0 && a <= 1.0) {
                    this.Value.x = Math.max(0.0, r);
                    this.Value.y = Math.max(0.0, g);
                    this.Value.z = Math.max(0.0, b);
                    this.Value.w = Math.max(0.0, a);
                }
                else {
                    this.Value.x = Math.max(0.0, Math.min(1.0, r / 255));
                    this.Value.y = Math.max(0.0, Math.min(1.0, g / 255));
                    this.Value.z = Math.max(0.0, Math.min(1.0, b / 255));
                    if (a <= 1.0) {
                        this.Value.w = Math.max(0.0, a);
                    }
                    else {
                        this.Value.w = Math.max(0.0, Math.min(1.0, a / 255));
                    }
                }
            }
            else {
                this.Value.Copy(r);
            }
        }
        // inline operator ImU32() const                                   { return ImGui::ColorConvertFloat4ToU32(Value); }
        toImU32() { return ColorConvertFloat4ToU32(this.Value); }
        // inline operator ImVec4() const                                  { return Value; }
        toImVec4() { return this.Value; }
        // FIXME-OBSOLETE: May need to obsolete/cleanup those helpers.
        // inline void    SetHSV(float h, float s, float v, float a = 1.0f){ ImGui::ColorConvertHSVtoRGB(h, s, v, Value.x, Value.y, Value.z); Value.w = a; }
        SetHSV(h, s, v, a = 1.0) {
            const ref_r = [this.Value.x];
            const ref_g = [this.Value.y];
            const ref_b = [this.Value.z];
            ColorConvertHSVtoRGB(h, s, v, ref_r, ref_g, ref_b);
            this.Value.x = ref_r[0];
            this.Value.y = ref_g[0];
            this.Value.z = ref_b[0];
            this.Value.w = a;
        }
        // static ImColor HSV(float h, float s, float v, float a = 1.0f)   { float r,g,b; ImGui::ColorConvertHSVtoRGB(h, s, v, r, g, b); return ImColor(r,g,b,a); }
        static HSV(h, s, v, a = 1.0) {
            const color = new ImColor();
            color.SetHSV(h, s, v, a);
            return color;
        }
    }
    const ImGuiInputTextDefaultSize = 128;
    // Shared state of InputText(), passed to callback when a ImGuiInputTextFlags_Callback* flag is used and the corresponding callback is triggered.
    class ImGuiInputTextCallbackData {
        constructor(native, UserData) {
            this.native = native;
            this.UserData = UserData;
        }
        // ImGuiInputTextFlags EventFlag;      // One of ImGuiInputTextFlags_Callback* // Read-only
        get EventFlag() { return this.native.EventFlag; }
        // ImGuiInputTextFlags Flags;          // What user passed to InputText()      // Read-only
        get Flags() { return this.native.Flags; }
        // void*               UserData;       // What user passed to InputText()      // Read-only
        // public get UserData(): any { return this.native.UserData; }
        // CharFilter event:
        // ImWchar             EventChar;      // Character input                      // Read-write (replace character or set to zero)
        get EventChar() { return this.native.EventChar; }
        set EventChar(value) { this.native.EventChar = value; }
        // Completion,History,Always events:
        // If you modify the buffer contents make sure you update 'BufTextLen' and set 'BufDirty' to true.
        // ImGuiKey            EventKey;       // Key pressed (Up/Down/TAB)            // Read-only
        get EventKey() { return this.native.EventKey; }
        // char*               Buf;            // Current text buffer                  // Read-write (pointed data only, can't replace the actual pointer)
        get Buf() { return this.native.Buf; }
        set Buf(value) { this.native.Buf = value; }
        // int                 BufTextLen;     // Current text length in bytes         // Read-write
        get BufTextLen() { return this.native.BufTextLen; }
        set BufTextLen(value) { this.native.BufTextLen = value; }
        // int                 BufSize;        // Maximum text length in bytes         // Read-only
        get BufSize() { return this.native.BufSize; }
        // bool                BufDirty;       // Set if you modify Buf/BufTextLen!!   // Write
        set BufDirty(value) { this.native.BufDirty = value; }
        // int                 CursorPos;      //                                      // Read-write
        get CursorPos() { return this.native.CursorPos; }
        set CursorPos(value) { this.native.CursorPos = value; }
        // int                 SelectionStart; //                                      // Read-write (== to SelectionEnd when no selection)
        get SelectionStart() { return this.native.SelectionStart; }
        set SelectionStart(value) { this.native.SelectionStart = value; }
        // int                 SelectionEnd;   //                                      // Read-write
        get SelectionEnd() { return this.native.SelectionEnd; }
        set SelectionEnd(value) { this.native.SelectionEnd = value; }
        // NB: Helper functions for text manipulation. Calling those function loses selection.
        // IMGUI_API void    DeleteChars(int pos, int bytes_count);
        DeleteChars(pos, bytes_count) { return this.native.DeleteChars(pos, bytes_count); }
        // IMGUI_API void    InsertChars(int pos, const char* text, const char* text_end = NULL);
        InsertChars(pos, text, text_end = null) { return this.native.InsertChars(pos, text_end !== null ? text.substring(0, text_end) : text); }
        // bool              HasSelection() const { return SelectionStart != SelectionEnd; }
        HasSelection() { return this.native.HasSelection(); }
    }
    // Resizing callback data to apply custom constraint. As enabled by SetNextWindowSizeConstraints(). Callback is called during the next Begin().
    // NB: For basic min/max size constraint on each axis you don't need to use the callback! The SetNextWindowSizeConstraints() parameters are enough.
    class ImGuiSizeCallbackData {
        constructor(native, UserData) {
            this.native = native;
            this.UserData = UserData;
        }
        get Pos() { return this.native.Pos; }
        get CurrentSize() { return this.native.CurrentSize; }
        get DesiredSize() { return this.native.DesiredSize; }
    }
    class ImGuiListClipper {
        // items_count:  Use -1 to ignore (you can call Begin later). Use INT_MAX if you don't know how many items you have (in which case the cursor won't be advanced in the final step).
        // items_height: Use -1.0f to be calculated automatically on first step. Otherwise pass in the distance between your items, typically GetTextLineHeightWithSpacing() or GetFrameHeightWithSpacing().
        // If you don't specify an items_height, you NEED to call Step(). If you specify items_height you may call the old Begin()/End() api directly, but prefer calling Step().
        // ImGuiListClipper(int items_count = -1, float items_height = -1.0f)  { Begin(items_count, items_height); } // NB: Begin() initialize every fields (as we allow user to call Begin/End multiple times on a same instance if they want).
        constructor(items_count = -1, items_height = -1.0) {
            this._native = null;
            this.items_count = -1;
            this.items_height = -1.0;
            this.items_count = items_count;
            this.items_height = items_height;
        }
        get native() {
            return this._native || (this._native = new exports.bind.ImGuiListClipper(this.items_count, this.items_height));
        }
        get StartPosY() { return this.native.StartPosY; }
        get ItemsHeight() { return this.native.ItemsHeight; }
        get ItemsCount() { return this.native.ItemsCount; }
        get StepNo() { return this.native.StepNo; }
        get DisplayStart() { return this.native.DisplayStart; }
        get DisplayEnd() { return this.native.DisplayEnd; }
        // ~ImGuiListClipper()                                                 { IM_ASSERT(ItemsCount == -1); }      // Assert if user forgot to call End() or Step() until false.
        delete() {
            if (this._native !== null) {
                this._native.delete();
                this._native = null;
            }
        }
        // IMGUI_API bool Step();                                              // Call until it returns false. The DisplayStart/DisplayEnd fields will be set and you can process/draw those items.
        Step() {
            const busy = this.native.Step();
            if (!busy) {
                this.delete();
            }
            return busy;
        }
        // IMGUI_API void Begin(int items_count, float items_height = -1.0f);  // Automatically called by constructor if you passed 'items_count' or by Step() in Step 1.
        Begin(items_count, items_height = -1.0) {
            this.items_count = items_count;
            this.items_height = items_height;
            this.native.Begin(items_count, items_height);
        }
        // IMGUI_API void End();                                               // Automatically called on the last call of Step() that returns false.
        End() {
            this.native.End();
            this.delete();
        }
    }
    // Special Draw callback value to request renderer back-end to reset the graphics/render state.
    // The renderer back-end needs to handle this special value, otherwise it will crash trying to call a function at this address.
    // This is useful for example if you submitted callbacks which you know have altered the render state and you want it to be restored.
    // It is not done by default because they are many perfectly useful way of altering render state for imgui contents (e.g. changing shader/blending settings before an Image call).
    const ImDrawCallback_ResetRenderState = -1;
    // Typically, 1 command = 1 GPU draw call (unless command is a callback)
    // Pre 1.71 back-ends will typically ignore the VtxOffset/IdxOffset fields. When 'io.BackendFlags & ImGuiBackendFlags_RendererHasVtxOffset'
    // is enabled, those fields allow us to render meshes larger than 64K vertices while keeping 16-bits indices.
    class ImDrawCmd {
        constructor(native) {
            this.native = native;
            // ImDrawCallback  UserCallback;           // If != NULL, call the function instead of rendering the vertices. clip_rect and texture_id will be set normally.
            this.UserCallback = null; // TODO
            // void*           UserCallbackData;       // The draw callback code can access this.
            this.UserCallbackData = null; // TODO
        }
        // unsigned int    ElemCount;              // Number of indices (multiple of 3) to be rendered as triangles. Vertices are stored in the callee ImDrawList's vtx_buffer[] array, indices in idx_buffer[].
        get ElemCount() { return this.native.ElemCount; }
        // ImVec4          ClipRect;               // Clipping rectangle (x1, y1, x2, y2)
        get ClipRect() { return this.native.ClipRect; }
        // ImTextureID     TextureId;              // User-provided texture ID. Set by user in ImfontAtlas::SetTexID() for fonts or passed to Image*() functions. Ignore if never using images or multiple fonts atlas.
        get TextureId() {
            return ImGuiContext.getTexture(this.native.TextureId);
        }
        // unsigned int    VtxOffset;              // Start offset in vertex buffer. Pre-1.71 or without ImGuiBackendFlags_RendererHasVtxOffset: always 0. With ImGuiBackendFlags_RendererHasVtxOffset: may be >0 to support meshes larger than 64K vertices with 16-bits indices.
        get VtxOffset() { return this.native.VtxOffset; }
        // unsigned int    IdxOffset;              // Start offset in index buffer. Always equal to sum of ElemCount drawn so far.
        get IdxOffset() { return this.native.IdxOffset; }
    }
    // Vertex index 
    // (to allow large meshes with 16-bits indices: set 'io.BackendFlags |= ImGuiBackendFlags_RendererHasVtxOffset' and handle ImDrawCmd::VtxOffset in the renderer back-end)
    // (to use 32-bits indices: override with '#define ImDrawIdx unsigned int' in imconfig.h)
    // #ifndef ImDrawIdx
    // typedef unsigned short ImDrawIdx;
    // #endif
    const ImDrawIdxSize = 2; // bind.ImDrawIdxSize;
    // Vertex layout
    // #ifndef IMGUI_OVERRIDE_DRAWVERT_STRUCT_LAYOUT
    const ImDrawVertSize = 20; // bind.ImDrawVertSize;
    const ImDrawVertPosOffset = 0; // bind.ImDrawVertPosOffset;
    const ImDrawVertUVOffset = 8; // bind.ImDrawVertUVOffset;
    const ImDrawVertColOffset = 16; // bind.ImDrawVertColOffset;
    class ImDrawVert {
        constructor(buffer, byteOffset = 0) {
            this.pos = new Float32Array(buffer, byteOffset + exports.bind.ImDrawVertPosOffset, 2);
            this.uv = new Float32Array(buffer, byteOffset + exports.bind.ImDrawVertUVOffset, 2);
            this.col = new Uint32Array(buffer, byteOffset + exports.bind.ImDrawVertColOffset, 1);
        }
    }
    // #else
    // You can override the vertex format layout by defining IMGUI_OVERRIDE_DRAWVERT_STRUCT_LAYOUT in imconfig.h
    // The code expect ImVec2 pos (8 bytes), ImVec2 uv (8 bytes), ImU32 col (4 bytes), but you can re-order them or add other fields as needed to simplify integration in your engine.
    // The type has to be described within the macro (you can either declare the struct or use a typedef)
    // NOTE: IMGUI DOESN'T CLEAR THE STRUCTURE AND DOESN'T CALL A CONSTRUCTOR SO ANY CUSTOM FIELD WILL BE UNINITIALIZED. IF YOU ADD EXTRA FIELDS (SUCH AS A 'Z' COORDINATES) YOU WILL NEED TO CLEAR THEM DURING RENDER OR TO IGNORE THEM.
    // IMGUI_OVERRIDE_DRAWVERT_STRUCT_LAYOUT;
    // #endif
    // Draw channels are used by the Columns API to "split" the render list into different channels while building, so items of each column can be batched together.
    // You can also use them to simulate drawing layers and submit primitives in a different order than how they will be rendered.
    class ImDrawChannel {
    }
    class ImDrawListSharedData {
        constructor(native) {
            this.native = native;
        }
    }
    // Draw command list
    // This is the low-level list of polygons that ImGui functions are filling. At the end of the frame, all command lists are passed to your ImGuiIO::RenderDrawListFn function for rendering.
    // Each ImGui window contains its own ImDrawList. You can use ImGui::GetWindowDrawList() to access the current window draw list and draw custom primitives.
    // You can interleave normal ImGui:: calls and adding primitives to the current draw list.
    // All positions are generally in pixel coordinates (top-left at (0,0), bottom-right at io.DisplaySize), however you are totally free to apply whatever transformation matrix to want to the data (if you apply such transformation you'll want to apply it to ClipRect as well)
    // Important: Primitives are always added to the list and not culled (culling is done at higher-level by ImGui:: functions), if you use this API a lot consider coarse culling your drawn objects.
    class ImDrawList {
        constructor(native) {
            this.native = native;
        }
        IterateDrawCmds(callback) {
            this.native.IterateDrawCmds((draw_cmd, ElemStart) => {
                callback(new ImDrawCmd(draw_cmd), ElemStart);
            });
        }
        // This is what you have to render
        // ImVector<ImDrawCmd>     CmdBuffer;          // Draw commands. Typically 1 command = 1 GPU draw call, unless the command is a callback.
        // ImVector<ImDrawIdx>     IdxBuffer;          // Index buffer. Each command consume ImDrawCmd::ElemCount of those
        get IdxBuffer() { return this.native.IdxBuffer; }
        // ImVector<ImDrawVert>    VtxBuffer;          // Vertex buffer.
        get VtxBuffer() { return this.native.VtxBuffer; }
        // ImDrawListFlags         Flags;              // Flags, you may poke into these to adjust anti-aliasing settings per-primitive.
        get Flags() { return this.native.Flags; }
        set Flags(value) { this.native.Flags = value; }
        // [Internal, used while building lists]
        // const ImDrawListSharedData* _Data;          // Pointer to shared draw data (you can use ImGui::GetDrawListSharedData() to get the one from current ImGui context)
        // const char*             _OwnerName;         // Pointer to owner window's name for debugging
        // unsigned int            _VtxCurrentIdx;     // [Internal] == VtxBuffer.Size
        // ImDrawVert*             _VtxWritePtr;       // [Internal] point within VtxBuffer.Data after each add command (to avoid using the ImVector<> operators too much)
        // ImDrawIdx*              _IdxWritePtr;       // [Internal] point within IdxBuffer.Data after each add command (to avoid using the ImVector<> operators too much)
        // ImVector<ImVec4>        _ClipRectStack;     // [Internal]
        // ImVector<ImTextureID>   _TextureIdStack;    // [Internal]
        // ImVector<ImVec2>        _Path;              // [Internal] current path building
        // int                     _ChannelsCurrent;   // [Internal] current channel number (0)
        // int                     _ChannelsCount;     // [Internal] number of active channels (1+)
        // ImVector<ImDrawChannel> _Channels;          // [Internal] draw channels for columns API (not resized down so _ChannelsCount may be smaller than _Channels.Size)
        // ImDrawList(const ImDrawListSharedData* shared_data) { _Data = shared_data; _OwnerName = NULL; Clear(); }
        // ~ImDrawList() { ClearFreeMemory(); }
        // IMGUI_API void  PushClipRect(ImVec2 clip_rect_min, ImVec2 clip_rect_max, bool intersect_with_current_clip_rect = false);  // Render-level scissoring. This is passed down to your render function but not used for CPU-side coarse clipping. Prefer using higher-level ImGui::PushClipRect() to affect logic (hit-testing and widget culling)
        PushClipRect(clip_rect_min, clip_rect_max, intersect_with_current_clip_rect = false) {
            this.native.PushClipRect(clip_rect_min, clip_rect_max, intersect_with_current_clip_rect);
        }
        // IMGUI_API void  PushClipRectFullScreen();
        PushClipRectFullScreen() { this.native.PushClipRectFullScreen(); }
        // IMGUI_API void  PopClipRect();
        PopClipRect() { this.native.PopClipRect(); }
        // IMGUI_API void  PushTextureID(ImTextureID texture_id);
        PushTextureID(texture_id) {
            this.native.PushTextureID(ImGuiContext.setTexture(texture_id));
        }
        // IMGUI_API void  PopTextureID();
        PopTextureID() { this.native.PopTextureID(); }
        // inline ImVec2   GetClipRectMin() const { const ImVec4& cr = _ClipRectStack.back(); return ImVec2(cr.x, cr.y); }
        GetClipRectMin(out = new ImVec2()) {
            return this.native.GetClipRectMin(out);
        }
        // inline ImVec2   GetClipRectMax() const { const ImVec4& cr = _ClipRectStack.back(); return ImVec2(cr.z, cr.w); }
        GetClipRectMax(out = new ImVec2()) {
            return this.native.GetClipRectMax(out);
        }
        // Primitives
        // IMGUI_API void  AddLine(const ImVec2& a, const ImVec2& b, ImU32 col, float thickness = 1.0f);
        AddLine(a, b, col, thickness = 1.0) {
            this.native.AddLine(a, b, col, thickness);
        }
        // IMGUI_API void  AddRect(const ImVec2& a, const ImVec2& b, ImU32 col, float rounding = 0.0f, int rounding_corners_flags = ImDrawCornerFlags_All, float thickness = 1.0f);   // a: upper-left, b: lower-right, rounding_corners_flags: 4-bits corresponding to which corner to round
        AddRect(a, b, col, rounding = 0.0, rounding_corners_flags = exports.wCornerFlags.All, thickness = 1.0) {
            this.native.AddRect(a, b, col, rounding, rounding_corners_flags, thickness);
        }
        // IMGUI_API void  AddRectFilled(const ImVec2& a, const ImVec2& b, ImU32 col, float rounding = 0.0f, int rounding_corners_flags = ImDrawCornerFlags_All);                     // a: upper-left, b: lower-right
        AddRectFilled(a, b, col, rounding = 0.0, rounding_corners_flags = exports.wCornerFlags.All) {
            this.native.AddRectFilled(a, b, col, rounding, rounding_corners_flags);
        }
        // IMGUI_API void  AddRectFilledMultiColor(const ImVec2& a, const ImVec2& b, ImU32 col_upr_left, ImU32 col_upr_right, ImU32 col_bot_right, ImU32 col_bot_left);
        AddRectFilledMultiColor(a, b, col_upr_left, col_upr_right, col_bot_right, col_bot_left) {
            this.native.AddRectFilledMultiColor(a, b, col_upr_left, col_upr_right, col_bot_right, col_bot_left);
        }
        // IMGUI_API void  AddQuad(const ImVec2& a, const ImVec2& b, const ImVec2& c, const ImVec2& d, ImU32 col, float thickness = 1.0f);
        AddQuad(a, b, c, d, col, thickness = 1.0) {
            this.native.AddQuad(a, b, c, d, col, thickness);
        }
        // IMGUI_API void  AddQuadFilled(const ImVec2& a, const ImVec2& b, const ImVec2& c, const ImVec2& d, ImU32 col);
        AddQuadFilled(a, b, c, d, col) {
            this.native.AddQuadFilled(a, b, c, d, col);
        }
        // IMGUI_API void  AddTriangle(const ImVec2& a, const ImVec2& b, const ImVec2& c, ImU32 col, float thickness = 1.0f);
        AddTriangle(a, b, c, col, thickness = 1.0) {
            this.native.AddTriangle(a, b, c, col, thickness);
        }
        // IMGUI_API void  AddTriangleFilled(const ImVec2& a, const ImVec2& b, const ImVec2& c, ImU32 col);
        AddTriangleFilled(a, b, c, col) {
            this.native.AddTriangleFilled(a, b, c, col);
        }
        // IMGUI_API void  AddCircle(const ImVec2& centre, float radius, ImU32 col, int num_segments = 12, float thickness = 1.0f);
        AddCircle(centre, radius, col, num_segments = 12, thickness = 1.0) {
            this.native.AddCircle(centre, radius, col, num_segments, thickness);
        }
        // IMGUI_API void  AddCircleFilled(const ImVec2& centre, float radius, ImU32 col, int num_segments = 12);
        AddCircleFilled(centre, radius, col, num_segments = 12) {
            this.native.AddCircleFilled(centre, radius, col, num_segments);
        }
        AddText(...args) {
            if (args[0] instanceof ImFont) {
                const font = args[0];
                const font_size = args[1];
                const pos = args[2];
                const col = args[3];
                const text_begin = args[4];
                const text_end = args[5] || null;
                const wrap_width = args[6] = 0.0;
                const cpu_fine_clip_rect = args[7] || null;
                this.native.AddText_B(font.native, font_size, pos, col, text_end !== null ? text_begin.substring(0, text_end) : text_begin, wrap_width, cpu_fine_clip_rect);
            }
            else {
                const pos = args[0];
                const col = args[1];
                const text_begin = args[2];
                const text_end = args[3] || null;
                this.native.AddText_A(pos, col, text_end !== null ? text_begin.substring(0, text_end) : text_begin);
            }
        }
        // IMGUI_API void  AddImage(ImTextureID user_texture_id, const ImVec2& a, const ImVec2& b, const ImVec2& uv_a = ImVec2(0,0), const ImVec2& uv_b = ImVec2(1,1), ImU32 col = 0xFFFFFFFF);
        AddImage(user_texture_id, a, b, uv_a = ImVec2.ZERO, uv_b = ImVec2.UNIT, col = 0xFFFFFFFF) {
            this.native.AddImage(ImGuiContext.setTexture(user_texture_id), a, b, uv_a, uv_b, col);
        }
        // IMGUI_API void  AddImageQuad(ImTextureID user_texture_id, const ImVec2& a, const ImVec2& b, const ImVec2& c, const ImVec2& d, const ImVec2& uv_a = ImVec2(0,0), const ImVec2& uv_b = ImVec2(1,0), const ImVec2& uv_c = ImVec2(1,1), const ImVec2& uv_d = ImVec2(0,1), ImU32 col = 0xFFFFFFFF);
        AddImageQuad(user_texture_id, a, b, c, d, uv_a = ImVec2.ZERO, uv_b = ImVec2.UNIT_X, uv_c = ImVec2.UNIT, uv_d = ImVec2.UNIT_Y, col = 0xFFFFFFFF) {
            this.native.AddImageQuad(ImGuiContext.setTexture(user_texture_id), a, b, c, d, uv_a, uv_b, uv_c, uv_d, col);
        }
        // IMGUI_API void  AddImageRounded(ImTextureID user_texture_id, const ImVec2& a, const ImVec2& b, const ImVec2& uv_a, const ImVec2& uv_b, ImU32 col, float rounding, int rounding_corners = ImDrawCornerFlags_All);
        AddImageRounded(user_texture_id, a, b, uv_a, uv_b, col, rounding, rounding_corners = exports.wCornerFlags.All) {
            this.native.AddImageRounded(ImGuiContext.setTexture(user_texture_id), a, b, uv_a, uv_b, col, rounding, rounding_corners);
        }
        // IMGUI_API void  AddPolyline(const ImVec2* points, const int num_points, ImU32 col, bool closed, float thickness);
        AddPolyline(points, num_points, col, closed, thickness) {
            this.native.AddPolyline(points, num_points, col, closed, thickness);
        }
        // IMGUI_API void  AddConvexPolyFilled(const ImVec2* points, const int num_points, ImU32 col);
        AddConvexPolyFilled(points, num_points, col) {
            this.native.AddConvexPolyFilled(points, num_points, col);
        }
        // IMGUI_API void  AddBezierCurve(const ImVec2& pos0, const ImVec2& cp0, const ImVec2& cp1, const ImVec2& pos1, ImU32 col, float thickness, int num_segments = 0);
        AddBezierCurve(pos0, cp0, cp1, pos1, col, thickness = 1.0, num_segments = 0) {
            this.native.AddBezierCurve(pos0, cp0, cp1, pos1, col, thickness, num_segments);
        }
        // Stateful path API, add points then finish with PathFill() or PathStroke()
        // inline    void  PathClear()                                                 { _Path.resize(0); }
        PathClear() { this.native.PathClear(); }
        // inline    void  PathLineTo(const ImVec2& pos)                               { _Path.push_back(pos); }
        PathLineTo(pos) { this.native.PathLineTo(pos); }
        // inline    void  PathLineToMergeDuplicate(const ImVec2& pos)                 { if (_Path.Size == 0 || memcmp(&_Path[_Path.Size-1], &pos, 8) != 0) _Path.push_back(pos); }
        PathLineToMergeDuplicate(pos) { this.native.PathLineToMergeDuplicate(pos); }
        // inline    void  PathFillConvex(ImU32 col)                                   { AddConvexPolyFilled(_Path.Data, _Path.Size, col); PathClear(); }
        PathFillConvex(col) { this.native.PathFillConvex(col); }
        // inline    void  PathStroke(ImU32 col, bool closed, float thickness = 1.0f)  { AddPolyline(_Path.Data, _Path.Size, col, closed, thickness); PathClear(); }
        PathStroke(col, closed, thickness = 1.0) { this.native.PathStroke(col, closed, thickness); }
        // IMGUI_API void  PathArcTo(const ImVec2& centre, float radius, float a_min, float a_max, int num_segments = 10);
        PathArcTo(centre, radius, a_min, a_max, num_segments = 10) { this.native.PathArcTo(centre, radius, a_min, a_max, num_segments); }
        // IMGUI_API void  PathArcToFast(const ImVec2& centre, float radius, int a_min_of_12, int a_max_of_12);                                // Use precomputed angles for a 12 steps circle
        PathArcToFast(centre, radius, a_min_of_12, a_max_of_12) { this.native.PathArcToFast(centre, radius, a_min_of_12, a_max_of_12); }
        // IMGUI_API void  PathBezierCurveTo(const ImVec2& p1, const ImVec2& p2, const ImVec2& p3, int num_segments = 0);
        PathBezierCurveTo(p1, p2, p3, num_segments = 0) { this.native.PathBezierCurveTo(p1, p2, p3, num_segments); }
        // IMGUI_API void  PathRect(const ImVec2& rect_min, const ImVec2& rect_max, float rounding = 0.0f, int rounding_corners_flags = ImDrawCornerFlags_All);
        PathRect(rect_min, rect_max, rounding = 0.0, rounding_corners_flags = exports.wCornerFlags.All) { this.native.PathRect(rect_min, rect_max, rounding, rounding_corners_flags); }
        // Channels
        // - Use to simulate layers. By switching channels to can render out-of-order (e.g. submit foreground primitives before background primitives)
        // - Use to minimize draw calls (e.g. if going back-and-forth between multiple non-overlapping clipping rectangles, prefer to append into separate channels then merge at the end)
        // IMGUI_API void  ChannelsSplit(int channels_count);
        ChannelsSplit(channels_count) { this.native.ChannelsSplit(channels_count); }
        // IMGUI_API void  ChannelsMerge();
        ChannelsMerge() { this.native.ChannelsMerge(); }
        // IMGUI_API void  ChannelsSetCurrent(int channel_index);
        ChannelsSetCurrent(channel_index) { this.native.ChannelsSetCurrent(channel_index); }
        // Advanced
        // IMGUI_API void  AddCallback(ImDrawCallback callback, void* callback_data);  // Your rendering function must check for 'UserCallback' in ImDrawCmd and call the function instead of rendering triangles.
        AddCallback(callback, callback_data) {
            const _callback = (parent_list, draw_cmd) => {
                callback(new ImDrawList(parent_list), new ImDrawCmd(draw_cmd));
            };
            this.native.AddCallback(_callback, callback_data);
        }
        // IMGUI_API void  AddDrawCmd();                                               // This is useful if you need to forcefully create a new draw call (to allow for dependent rendering / blending). Otherwise primitives are merged into the same draw-call as much as possible
        AddDrawCmd() { this.native.AddDrawCmd(); }
        // Internal helpers
        // NB: all primitives needs to be reserved via PrimReserve() beforehand!
        // IMGUI_API void  Clear();
        Clear() { this.native.Clear(); }
        // IMGUI_API void  ClearFreeMemory();
        ClearFreeMemory() { this.native.ClearFreeMemory(); }
        // IMGUI_API void  PrimReserve(int idx_count, int vtx_count);
        PrimReserve(idx_count, vtx_count) { this.native.PrimReserve(idx_count, vtx_count); }
        // IMGUI_API void  PrimRect(const ImVec2& a, const ImVec2& b, ImU32 col);      // Axis aligned rectangle (composed of two triangles)
        PrimRect(a, b, col) { this.native.PrimRect(a, b, col); }
        // IMGUI_API void  PrimRectUV(const ImVec2& a, const ImVec2& b, const ImVec2& uv_a, const ImVec2& uv_b, ImU32 col);
        PrimRectUV(a, b, uv_a, uv_b, col) { this.native.PrimRectUV(a, b, uv_a, uv_b, col); }
        // IMGUI_API void  PrimQuadUV(const ImVec2& a, const ImVec2& b, const ImVec2& c, const ImVec2& d, const ImVec2& uv_a, const ImVec2& uv_b, const ImVec2& uv_c, const ImVec2& uv_d, ImU32 col);
        PrimQuadUV(a, b, c, d, uv_a, uv_b, uv_c, uv_d, col) { this.native.PrimQuadUV(a, b, c, d, uv_a, uv_b, uv_c, uv_d, col); }
        // inline    void  PrimWriteVtx(const ImVec2& pos, const ImVec2& uv, ImU32 col){ _VtxWritePtr->pos = pos; _VtxWritePtr->uv = uv; _VtxWritePtr->col = col; _VtxWritePtr++; _VtxCurrentIdx++; }
        PrimWriteVtx(pos, uv, col) { this.native.PrimWriteVtx(pos, uv, col); }
        // inline    void  PrimWriteIdx(ImDrawIdx idx)                                 { *_IdxWritePtr = idx; _IdxWritePtr++; }
        PrimWriteIdx(idx) { this.native.PrimWriteIdx(idx); }
        // inline    void  PrimVtx(const ImVec2& pos, const ImVec2& uv, ImU32 col)     { PrimWriteIdx((ImDrawIdx)_VtxCurrentIdx); PrimWriteVtx(pos, uv, col); }
        PrimVtx(pos, uv, col) { this.native.PrimVtx(pos, uv, col); }
        // IMGUI_API void  UpdateClipRect();
        UpdateClipRect() { this.native.UpdateClipRect(); }
        // IMGUI_API void  UpdateTextureID();
        UpdateTextureID() { this.native.UpdateTextureID(); }
    }
    // All draw data to render an ImGui frame
    class ImDrawData {
        constructor(native) {
            this.native = native;
        }
        IterateDrawLists(callback) {
            this.native.IterateDrawLists((draw_list) => {
                callback(new ImDrawList(draw_list));
            });
        }
        // bool            Valid;                  // Only valid after Render() is called and before the next NewFrame() is called.
        get Valid() { return this.native.Valid; }
        // ImDrawList**    CmdLists;
        // int             CmdListsCount;
        get CmdListsCount() { return this.native.CmdListsCount; }
        // int             TotalIdxCount;          // For convenience, sum of all cmd_lists idx_buffer.Size
        get TotalIdxCount() { return this.native.TotalIdxCount; }
        // int             TotalVtxCount;          // For convenience, sum of all cmd_lists vtx_buffer.Size
        get TotalVtxCount() { return this.native.TotalVtxCount; }
        // ImVec2          DisplayPos;             // Upper-left position of the viewport to render (== upper-left of the orthogonal projection matrix to use)
        get DisplayPos() { return this.native.DisplayPos; }
        // ImVec2          DisplaySize;            // Size of the viewport to render (== io.DisplaySize for the main viewport) (DisplayPos + DisplaySize == lower-right of the orthogonal projection matrix to use)
        get DisplaySize() { return this.native.DisplaySize; }
        // ImVec2          FramebufferScale;       // Amount of pixels for each unit of DisplaySize. Based on io.DisplayFramebufferScale. Generally (1,1) on normal display, (2,2) on OSX with Retina display.
        get FramebufferScale() { return this.native.FramebufferScale; }
        // Functions
        // ImDrawData() { Valid = false; CmdLists = NULL; CmdListsCount = TotalVtxCount = TotalIdxCount = 0; }
        // IMGUI_API void DeIndexAllBuffers();               // For backward compatibility or convenience: convert all buffers from indexed to de-indexed, in case you cannot render indexed. Note: this is slow and most likely a waste of resources. Always prefer indexed rendering!
        DeIndexAllBuffers() { this.native.DeIndexAllBuffers(); }
        // IMGUI_API void ScaleClipRects(const ImVec2& fb_scale);  // Helper to scale the ClipRect field of each ImDrawCmd. Use if your final output buffer is at a different scale than ImGui expects, or if there is a difference between your window resolution and framebuffer resolution.
        ScaleClipRects(fb_scale) {
            this.native.ScaleClipRects(fb_scale);
        }
    }
    class script_ImFontConfig {
        constructor() {
            // void*           FontData;                   //          // TTF/OTF data
            // int             FontDataSize;               //          // TTF/OTF data size
            this.FontData = null;
            // bool            FontDataOwnedByAtlas;       // true     // TTF/OTF data ownership taken by the container ImFontAtlas (will delete memory itself).
            this.FontDataOwnedByAtlas = true;
            // int             FontNo;                     // 0        // Index of font within TTF/OTF file
            this.FontNo = 0;
            // float           SizePixels;                 //          // Size in pixels for rasterizer.
            this.SizePixels = 0;
            // int             OversampleH, OversampleV;   // 3, 1     // Rasterize at higher quality for sub-pixel positioning. We don't use sub-pixel positions on the Y axis.
            this.OversampleH = 3;
            this.OversampleV = 1;
            // bool            PixelSnapH;                 // false    // Align every glyph to pixel boundary. Useful e.g. if you are merging a non-pixel aligned font with the default font. If enabled, you can set OversampleH/V to 1.
            this.PixelSnapH = false;
            // ImVec2          GlyphExtraSpacing;          // 0, 0     // Extra spacing (in pixels) between glyphs. Only X axis is supported for now.
            this.GlyphExtraSpacing = new ImVec2(0, 0);
            // ImVec2          GlyphOffset;                // 0, 0     // Offset all glyphs from this font input.
            this.GlyphOffset = new ImVec2(0, 0);
            // const ImWchar*  GlyphRanges;                // NULL     // Pointer to a user-provided list of Unicode range (2 value per range, values are inclusive, zero-terminated list). THE ARRAY DATA NEEDS TO PERSIST AS LONG AS THE FONT IS ALIVE.
            this.GlyphRanges = null;
            // float           GlyphMinAdvanceX;           // 0        // Minimum AdvanceX for glyphs, set Min to align font icons, set both Min/Max to enforce mono-space font
            this.GlyphMinAdvanceX = 0;
            // float           GlyphMaxAdvanceX;           // FLT_MAX  // Maximum AdvanceX for glyphs
            this.GlyphMaxAdvanceX = Number.MAX_VALUE;
            // bool            MergeMode;                  // false    // Merge into previous ImFont, so you can combine multiple inputs font into one ImFont (e.g. ASCII font + icons + Japanese glyphs). You may want to use GlyphOffset.y when merge font of different heights.
            this.MergeMode = false;
            // unsigned int    RasterizerFlags;            // 0x00     // Settings for custom font rasterizer (e.g. ImGuiFreeType). Leave as zero if you aren't using one.
            this.RasterizerFlags = 0;
            // float           RasterizerMultiply;         // 1.0f     // Brighten (>1.0f) or darken (<1.0f) font output. Brightening small fonts may be a good workaround to make them more readable.
            this.RasterizerMultiply = 1.0;
            // [Internal]
            // char            Name[32];                               // Name (strictly to ease debugging)
            this.Name = "";
            // ImFont*         DstFont;
            this.DstFont = null;
            // IMGUI_API ImFontConfig();
        }
    }
    class ImFontConfig {
        constructor(internal = new script_ImFontConfig()) {
            this.internal = internal;
        }
        // void*           FontData;                   //          // TTF/OTF data
        // int             FontDataSize;               //          // TTF/OTF data size
        get FontData() { return this.internal.FontData; }
        // bool            FontDataOwnedByAtlas;       // true     // TTF/OTF data ownership taken by the container ImFontAtlas (will delete memory itself).
        get FontDataOwnedByAtlas() { return this.internal.FontDataOwnedByAtlas; }
        // int             FontNo;                     // 0        // Index of font within TTF/OTF file
        get FontNo() { return this.internal.FontNo; }
        // float           SizePixels;                 //          // Size in pixels for rasterizer.
        get SizePixels() { return this.internal.SizePixels; }
        // int             OversampleH, OversampleV;   // 3, 1     // Rasterize at higher quality for sub-pixel positioning. We don't use sub-pixel positions on the Y axis.
        get OversampleH() { return this.internal.OversampleH; }
        get OversampleV() { return this.internal.OversampleV; }
        // bool            PixelSnapH;                 // false    // Align every glyph to pixel boundary. Useful e.g. if you are merging a non-pixel aligned font with the default font. If enabled, you can set OversampleH/V to 1.
        get PixelSnapH() { return this.internal.PixelSnapH; }
        // ImVec2          GlyphExtraSpacing;          // 0, 0     // Extra spacing (in pixels) between glyphs. Only X axis is supported for now.
        get GlyphExtraSpacing() { return this.internal.GlyphExtraSpacing; }
        // ImVec2          GlyphOffset;                // 0, 0     // Offset all glyphs from this font input.
        get GlyphOffset() { return this.internal.GlyphOffset; }
        // const ImWchar*  GlyphRanges;                // NULL     // Pointer to a user-provided list of Unicode range (2 value per range, values are inclusive, zero-terminated list). THE ARRAY DATA NEEDS TO PERSIST AS LONG AS THE FONT IS ALIVE.
        get GlyphRanges() { return this.internal.GlyphRanges; }
        // float           GlyphMinAdvanceX;           // 0        // Minimum AdvanceX for glyphs, set Min to align font icons, set both Min/Max to enforce mono-space font
        get GlyphMinAdvanceX() { return this.internal.GlyphMinAdvanceX; }
        // float           GlyphMaxAdvanceX;           // FLT_MAX  // Maximum AdvanceX for glyphs
        get GlyphMaxAdvanceX() { return this.internal.GlyphMaxAdvanceX; }
        // bool            MergeMode;                  // false    // Merge into previous ImFont, so you can combine multiple inputs font into one ImFont (e.g. ASCII font + icons + Japanese glyphs). You may want to use GlyphOffset.y when merge font of different heights.
        get MergeMode() { return this.internal.MergeMode; }
        // unsigned int    RasterizerFlags;            // 0x00     // Settings for custom font rasterizer (e.g. ImGuiFreeType). Leave as zero if you aren't using one.
        get RasterizerFlags() { return this.internal.RasterizerFlags; }
        // float           RasterizerMultiply;         // 1.0f     // Brighten (>1.0f) or darken (<1.0f) font output. Brightening small fonts may be a good workaround to make them more readable.
        get RasterizerMultiply() { return this.internal.RasterizerMultiply; }
        // [Internal]
        // char            Name[32];                               // Name (strictly to ease debugging)
        get Name() { return this.internal.Name; }
        set Name(value) { this.internal.Name = value; }
        // ImFont*         DstFont;
        get DstFont() {
            const font = this.internal.DstFont;
            return font && new ImFont(font);
        }
    }
    // struct ImFontGlyph
    class script_ImFontGlyph {
        constructor() {
            // ImWchar         Codepoint;          // 0x0000..0xFFFF
            this.Codepoint = 0;
            // float           AdvanceX;           // Distance to next character (= data from font + ImFontConfig::GlyphExtraSpacing.x baked in)
            this.AdvanceX = 0.0;
            // float           X0, Y0, X1, Y1;     // Glyph corners
            this.X0 = 0.0;
            this.Y0 = 0.0;
            this.X1 = 1.0;
            this.Y1 = 1.0;
            // float           U0, V0, U1, V1;     // Texture coordinates
            this.U0 = 0.0;
            this.V0 = 0.0;
            this.U1 = 1.0;
            this.V1 = 1.0;
        }
    }
    class ImFontGlyph {
        constructor(internal = new script_ImFontGlyph()) {
            this.internal = internal;
        }
        // ImWchar         Codepoint;          // 0x0000..0xFFFF
        get Codepoint() { return this.internal.Codepoint; }
        // float           AdvanceX;           // Distance to next character (= data from font + ImFontConfig::GlyphExtraSpacing.x baked in)
        get AdvanceX() { return this.internal.AdvanceX; }
        ;
        // float           X0, Y0, X1, Y1;     // Glyph corners
        get X0() { return this.internal.X0; }
        ;
        get Y0() { return this.internal.Y0; }
        ;
        get X1() { return this.internal.X1; }
        ;
        get Y1() { return this.internal.Y1; }
        ;
        // float           U0, V0, U1, V1;     // Texture coordinates
        get U0() { return this.internal.U0; }
        ;
        get V0() { return this.internal.V0; }
        ;
        get U1() { return this.internal.U1; }
        ;
        get V1() { return this.internal.V1; }
        ;
    }
    (function (ImFontAtlasFlags) {
        ImFontAtlasFlags[ImFontAtlasFlags["None"] = 0] = "None";
        ImFontAtlasFlags[ImFontAtlasFlags["NoPowerOfTwoHeight"] = 1] = "NoPowerOfTwoHeight";
        ImFontAtlasFlags[ImFontAtlasFlags["NoMouseCursors"] = 2] = "NoMouseCursors";
    })(exports.ImFontAtlasFlags || (exports.ImFontAtlasFlags = {}));
    // Load and rasterize multiple TTF/OTF fonts into a same texture.
    // Sharing a texture for multiple fonts allows us to reduce the number of draw calls during rendering.
    // We also add custom graphic data into the texture that serves for ImGui.
    //  1. (Optional) Call AddFont*** functions. If you don't call any, the default font will be loaded for you.
    //  2. Call GetTexDataAsAlpha8() or GetTexDataAsRGBA32() to build and retrieve pixels data.
    //  3. Upload the pixels data into a texture within your graphics system.
    //  4. Call SetTexID(my_tex_id); and pass the pointer/identifier to your texture. This value will be passed back to you during rendering to identify the texture.
    // IMPORTANT: If you pass a 'glyph_ranges' array to AddFont*** functions, you need to make sure that your array persist up until the ImFont is build (when calling GetTextData*** or Build()). We only copy the pointer, not the data.
    class ImFontAtlas {
        constructor(native) {
            this.native = native;
        }
        // IMGUI_API ImFontAtlas();
        // IMGUI_API ~ImFontAtlas();
        // IMGUI_API ImFont*           AddFont(const ImFontConfig* font_cfg);
        // IMGUI_API ImFont*           AddFontDefault(const ImFontConfig* font_cfg = NULL);
        AddFontDefault(font_cfg = null) {
            return new ImFont(this.native.AddFontDefault(font_cfg));
        }
        // IMGUI_API ImFont*           AddFontFromFileTTF(const char* filename, float size_pixels, const ImFontConfig* font_cfg = NULL, const ImWchar* glyph_ranges = NULL);
        // IMGUI_API ImFont*           AddFontFromMemoryTTF(void* font_data, int font_size, float size_pixels, const ImFontConfig* font_cfg = NULL, const ImWchar* glyph_ranges = NULL); // Note: Transfer ownership of 'ttf_data' to ImFontAtlas! Will be deleted after Build(). Set font_cfg->FontDataOwnedByAtlas to false to keep ownership.
        AddFontFromMemoryTTF(data, size_pixels, font_cfg = null, glyph_ranges = null) {
            return new ImFont(this.native.AddFontFromMemoryTTF(new Uint8Array(data), size_pixels, font_cfg && font_cfg.internal, glyph_ranges));
        }
        // IMGUI_API ImFont*           AddFontFromMemoryCompressedTTF(const void* compressed_font_data, int compressed_font_size, float size_pixels, const ImFontConfig* font_cfg = NULL, const ImWchar* glyph_ranges = NULL); // 'compressed_font_data' still owned by caller. Compress with binary_to_compressed_c.cpp.
        // IMGUI_API ImFont*           AddFontFromMemoryCompressedBase85TTF(const char* compressed_font_data_base85, float size_pixels, const ImFontConfig* font_cfg = NULL, const ImWchar* glyph_ranges = NULL);              // 'compressed_font_data_base85' still owned by caller. Compress with binary_to_compressed_c.cpp with -base85 parameter.
        // IMGUI_API void              ClearTexData();             // Clear the CPU-side texture data. Saves RAM once the texture has been copied to graphics memory.
        ClearTexData() { this.native.ClearTexData(); }
        // IMGUI_API void              ClearInputData();           // Clear the input TTF data (inc sizes, glyph ranges)
        ClearInputData() { this.native.ClearInputData(); }
        // IMGUI_API void              ClearFonts();               // Clear the ImGui-side font data (glyphs storage, UV coordinates)
        ClearFonts() { this.native.ClearFonts(); }
        // IMGUI_API void              Clear();                    // Clear all
        Clear() { this.native.Clear(); }
        // Build atlas, retrieve pixel data.
        // User is in charge of copying the pixels into graphics memory (e.g. create a texture with your engine). Then store your texture handle with SetTexID().
        // RGBA32 format is provided for convenience and compatibility, but note that unless you use CustomRect to draw color data, the RGB pixels emitted from Fonts will all be white (~75% of waste).
        // Pitch = Width * BytesPerPixels
        // IMGUI_API bool              Build();                    // Build pixels data. This is called automatically for you by the GetTexData*** functions.
        Build() { return this.native.Build(); }
        // IMGUI_API bool              IsBuilt()                   { return Fonts.Size > 0 && (TexPixelsAlpha8 != NULL || TexPixelsRGBA32 != NULL); }
        IsBuilt() { return this.native.IsBuilt(); }
        // IMGUI_API void              GetTexDataAsAlpha8(unsigned char** out_pixels, int* out_width, int* out_height, int* out_bytes_per_pixel = NULL);  // 1 byte per-pixel
        GetTexDataAsAlpha8() {
            return this.native.GetTexDataAsAlpha8();
        }
        // IMGUI_API void              GetTexDataAsRGBA32(unsigned char** out_pixels, int* out_width, int* out_height, int* out_bytes_per_pixel = NULL);  // 4 bytes-per-pixel
        GetTexDataAsRGBA32() {
            return this.native.GetTexDataAsRGBA32();
        }
        // void                        SetTexID(ImTextureID id)    { TexID = id; }
        SetTexID(id) { this.TexID = id; }
        //-------------------------------------------
        // Glyph Ranges
        //-------------------------------------------
        // Helpers to retrieve list of common Unicode ranges (2 value per range, values are inclusive, zero-terminated list)
        // NB: Make sure that your string are UTF-8 and NOT in your local code page. In C++11, you can create UTF-8 string literal using the u8"Hello world" syntax. See FAQ for details.
        // IMGUI_API const ImWchar*    GetGlyphRangesDefault();    // Basic Latin, Extended Latin
        GetGlyphRangesDefault() { return this.native.GetGlyphRangesDefault(); }
        // IMGUI_API const ImWchar*    GetGlyphRangesKorean();     // Default + Korean characters
        GetGlyphRangesKorean() { return this.native.GetGlyphRangesKorean(); }
        // IMGUI_API const ImWchar*    GetGlyphRangesJapanese();   // Default + Hiragana, Katakana, Half-Width, Selection of 1946 Ideographs
        GetGlyphRangesJapanese() { return this.native.GetGlyphRangesJapanese(); }
        // IMGUI_API const ImWchar*    GetGlyphRangesChineseFull();            // Default + Half-Width + Japanese Hiragana/Katakana + full set of about 21000 CJK Unified Ideographs
        GetGlyphRangesChineseFull() { return this.native.GetGlyphRangesChineseFull(); }
        // IMGUI_API const ImWchar*    GetGlyphRangesChineseSimplifiedCommon();// Default + Half-Width + Japanese Hiragana/Katakana + set of 2500 CJK Unified Ideographs for common simplified Chinese
        GetGlyphRangesChineseSimplifiedCommon() { return this.native.GetGlyphRangesChineseSimplifiedCommon(); }
        // IMGUI_API const ImWchar*    GetGlyphRangesCyrillic();   // Default + about 400 Cyrillic characters
        GetGlyphRangesCyrillic() { return this.native.GetGlyphRangesCyrillic(); }
        // IMGUI_API const ImWchar*    GetGlyphRangesThai();       // Default + Thai characters
        GetGlyphRangesThai() { return this.native.GetGlyphRangesThai(); }
        // IMGUI_API const ImWchar*    GetGlyphRangesVietnamese();       // Default + Vietnamese characters
        GetGlyphRangesVietnamese() { return this.native.GetGlyphRangesVietnamese(); }
        // Helpers to build glyph ranges from text data. Feed your application strings/characters to it then call BuildRanges().
        // struct GlyphRangesBuilder
        // {
        //     ImVector<unsigned char> UsedChars;  // Store 1-bit per Unicode code point (0=unused, 1=used)
        //     GlyphRangesBuilder()                { UsedChars.resize(0x10000 / 8); memset(UsedChars.Data, 0, 0x10000 / 8); }
        //     bool           GetBit(int n) const  { return (UsedChars[n >> 3] & (1 << (n & 7))) != 0; }
        //     void           SetBit(int n)        { UsedChars[n >> 3] |= 1 << (n & 7); }  // Set bit 'c' in the array
        //     void           AddChar(ImWchar c)   { SetBit(c); }                          // Add character
        //     IMGUI_API void AddText(const char* text, const char* text_end = NULL);      // Add string (each character of the UTF-8 string are added)
        //     IMGUI_API void AddRanges(const ImWchar* ranges);                            // Add ranges, e.g. builder.AddRanges(ImFontAtlas::GetGlyphRangesDefault) to force add all of ASCII/Latin+Ext
        //     IMGUI_API void BuildRanges(ImVector<ImWchar>* out_ranges);                  // Output new ranges
        // };
        //-------------------------------------------
        // Custom Rectangles/Glyphs API
        //-------------------------------------------
        // You can request arbitrary rectangles to be packed into the atlas, for your own purposes. After calling Build(), you can query the rectangle position and render your pixels.
        // You can also request your rectangles to be mapped as font glyph (given a font + Unicode point), so you can render e.g. custom colorful icons and use them as regular glyphs.
        // struct CustomRect
        // {
        //     unsigned int    ID;             // Input    // User ID. Use <0x10000 to map into a font glyph, >=0x10000 for other/internal/custom texture data.
        //     unsigned short  Width, Height;  // Input    // Desired rectangle dimension
        //     unsigned short  X, Y;           // Output   // Packed position in Atlas
        //     float           GlyphAdvanceX;  // Input    // For custom font glyphs only (ID<0x10000): glyph xadvance
        //     ImVec2          GlyphOffset;    // Input    // For custom font glyphs only (ID<0x10000): glyph display offset
        //     ImFont*         Font;           // Input    // For custom font glyphs only (ID<0x10000): target font
        //     CustomRect()            { ID = 0xFFFFFFFF; Width = Height = 0; X = Y = 0xFFFF; GlyphAdvanceX = 0.0f; GlyphOffset = ImVec2(0,0); Font = NULL; }
        //     bool IsPacked() const   { return X != 0xFFFF; }
        // };
        // IMGUI_API int       AddCustomRectRegular(unsigned int id, int width, int height);                                                                   // Id needs to be >= 0x10000. Id >= 0x80000000 are reserved for ImGui and ImDrawList
        // IMGUI_API int       AddCustomRectFontGlyph(ImFont* font, ImWchar id, int width, int height, float advance_x, const ImVec2& offset = ImVec2(0,0));   // Id needs to be < 0x10000 to register a rectangle to map into a specific font.
        // IMGUI_API void      CalcCustomRectUV(const CustomRect* rect, ImVec2* out_uv_min, ImVec2* out_uv_max);
        // const CustomRect*   GetCustomRectByIndex(int index) const { if (index < 0) return NULL; return &CustomRects[index]; }
        //-------------------------------------------
        // Members
        //-------------------------------------------
        // bool                        Locked;             // Marked as Locked by ImGui::NewFrame() so attempt to modify the atlas will assert.
        get Locked() { return this.native.Locked; }
        set Locked(value) { this.native.Locked = value; }
        // ImFontAtlasFlags            Flags;              // Build flags (see ImFontAtlasFlags_)
        get Flags() { return this.native.Flags; }
        set Flags(value) { this.native.Flags = value; }
        // ImTextureID                 TexID;              // User data to refer to the texture once it has been uploaded to user's graphic systems. It is passed back to you during rendering via the ImDrawCmd structure.
        get TexID() {
            return ImGuiContext.getTexture(this.native.TexID);
        }
        set TexID(value) {
            this.native.TexID = ImGuiContext.setTexture(value);
        }
        // int                         TexDesiredWidth;    // Texture width desired by user before Build(). Must be a power-of-two. If have many glyphs your graphics API have texture size restrictions you may want to increase texture width to decrease height.
        get TexDesiredWidth() { return this.native.TexDesiredWidth; }
        set TexDesiredWidth(value) { this.native.TexDesiredWidth = value; }
        // int                         TexGlyphPadding;    // Padding between glyphs within texture in pixels. Defaults to 1.
        get TexGlyphPadding() { return this.native.TexGlyphPadding; }
        set TexGlyphPadding(value) { this.native.TexGlyphPadding = value; }
        // [Internal]
        // NB: Access texture data via GetTexData*() calls! Which will setup a default font for you.
        // unsigned char*              TexPixelsAlpha8;    // 1 component per pixel, each component is unsigned 8-bit. Total size = TexWidth * TexHeight
        // unsigned int*               TexPixelsRGBA32;    // 4 component per pixel, each component is unsigned 8-bit. Total size = TexWidth * TexHeight * 4
        // int                         TexWidth;           // Texture width calculated during Build().
        get TexWidth() { return this.native.TexWidth; }
        // int                         TexHeight;          // Texture height calculated during Build().
        get TexHeight() { return this.native.TexHeight; }
        // ImVec2                      TexUvScale;         // = (1.0f/TexWidth, 1.0f/TexHeight)
        get TexUvScale() { return this.native.TexUvScale; }
        // ImVec2                      TexUvWhitePixel;    // Texture coordinates to a white pixel
        get TexUvWhitePixel() { return this.native.TexUvWhitePixel; }
        // ImVector<ImFont*>           Fonts;              // Hold all the fonts returned by AddFont*. Fonts[0] is the default font upon calling ImGui::NewFrame(), use ImGui::PushFont()/PopFont() to change the current font.
        get Fonts() {
            const fonts = new ImVector();
            this.native.IterateFonts((font) => {
                fonts.push(new ImFont(font));
            });
            return fonts;
        }
    }
    // Font runtime data and rendering
    // ImFontAtlas automatically loads a default embedded font for you when you call GetTexDataAsAlpha8() or GetTexDataAsRGBA32().
    class ImFont {
        constructor(native) {
            this.native = native;
        }
        // Members: Hot ~62/78 bytes
        // float                       FontSize;           // <user set>   // Height of characters, set during loading (don't change after loading)
        get FontSize() { return this.native.FontSize; }
        // float                       Scale;              // = 1.f        // Base font scale, multiplied by the per-window font scale which you can adjust with SetFontScale()
        get Scale() { return this.native.Scale; }
        set Scale(value) { this.native.Scale = value; }
        // ImVec2                      DisplayOffset;      // = (0.f,1.f)  // Offset font rendering by xx pixels
        get DisplayOffset() { return this.native.DisplayOffset; }
        // ImVector<ImFontGlyph>       Glyphs;             //              // All glyphs.
        get Glyphs() {
            const glyphs = new ImVector();
            this.native.IterateGlyphs((glyph) => {
                glyphs.push(new ImFontGlyph(glyph)); // TODO: wrap native
            });
            return glyphs;
        }
        // ImVector<float>             IndexAdvanceX;      //              // Sparse. Glyphs->AdvanceX in a directly indexable way (more cache-friendly, for CalcTextSize functions which are often bottleneck in large UI).
        // get IndexAdvanceX(): any { return this.native.IndexAdvanceX; }
        // ImVector<unsigned short>    IndexLookup;        //              // Sparse. Index glyphs by Unicode code-point.
        // get IndexLookup(): any { return this.native.IndexLookup; }
        // const ImFontGlyph*          FallbackGlyph;      // == FindGlyph(FontFallbackChar)
        get FallbackGlyph() {
            const glyph = this.native.FallbackGlyph;
            return glyph && new ImFontGlyph(glyph);
        }
        set FallbackGlyph(value) {
            this.native.FallbackGlyph = value && value.internal;
        }
        // float                       FallbackAdvanceX;   // == FallbackGlyph->AdvanceX
        get FallbackAdvanceX() { return this.native.FallbackAdvanceX; }
        // ImWchar                     FallbackChar;       // = '?'        // Replacement glyph if one isn't found. Only set via SetFallbackChar()
        get FallbackChar() { return this.native.FallbackChar; }
        // Members: Cold ~18/26 bytes
        // short                       ConfigDataCount;    // ~ 1          // Number of ImFontConfig involved in creating this font. Bigger than 1 when merging multiple font sources into one ImFont.
        get ConfigDataCount() { return this.ConfigData.length; }
        // ImFontConfig*               ConfigData;         //              // Pointer within ContainerAtlas->ConfigData
        get ConfigData() {
            const cfg_data = [];
            this.native.IterateConfigData((cfg) => {
                cfg_data.push(new ImFontConfig(cfg));
            });
            return cfg_data;
        }
        // ImFontAtlas*                ContainerAtlas;     //              // What we has been loaded into
        get ContainerAtlas() { return null; }
        // float                       Ascent, Descent;    //              // Ascent: distance from top to bottom of e.g. 'A' [0..FontSize]
        get Ascent() { return this.native.Ascent; }
        get Descent() { return this.native.Descent; }
        // int                         MetricsTotalSurface;//              // Total surface in pixels to get an idea of the font rasterization/texture cost (not exact, we approximate the cost of padding between glyphs)
        get MetricsTotalSurface() { return this.native.MetricsTotalSurface; }
        // Methods
        // IMGUI_API ImFont();
        // IMGUI_API ~ImFont();
        // IMGUI_API void              ClearOutputData();
        ClearOutputData() { return this.native.ClearOutputData(); }
        // IMGUI_API void              BuildLookupTable();
        BuildLookupTable() { return this.native.BuildLookupTable(); }
        // IMGUI_API const ImFontGlyph*FindGlyph(ImWchar c) const;
        FindGlyph(c) {
            const glyph = this.native.FindGlyph(c);
            return glyph && new ImFontGlyph(glyph);
        }
        // IMGUI_API const ImFontGlyph*FindGlyphNoFallback(ImWchar c) const;
        FindGlyphNoFallback(c) {
            const glyph = this.native.FindGlyphNoFallback(c);
            return glyph && new ImFontGlyph(glyph);
        }
        // IMGUI_API void              SetFallbackChar(ImWchar c);
        SetFallbackChar(c) { return this.native.SetFallbackChar(c); }
        // float                       GetCharAdvance(ImWchar c) const     { return ((int)c < IndexAdvanceX.Size) ? IndexAdvanceX[(int)c] : FallbackAdvanceX; }
        GetCharAdvance(c) { return this.native.GetCharAdvance(c); }
        // bool                        IsLoaded() const                    { return ContainerAtlas != NULL; }
        IsLoaded() { return this.native.IsLoaded(); }
        // const char*                 GetDebugName() const                { return ConfigData ? ConfigData->Name : "<unknown>"; }
        GetDebugName() { return this.native.GetDebugName(); }
        // 'max_width' stops rendering after a certain width (could be turned into a 2d size). FLT_MAX to disable.
        // 'wrap_width' enable automatic word-wrapping across multiple lines to fit into given width. 0.0f to disable.
        // IMGUI_API ImVec2            CalcTextSizeA(float size, float max_width, float wrap_width, const char* text_begin, const char* text_end = NULL, const char** remaining = NULL) const; // utf8
        CalcTextSizeA(size, max_width, wrap_width, text_begin, text_end = null, remaining = null) {
            return this.native.CalcTextSizeA(size, max_width, wrap_width, text_end !== null ? text_begin.substring(0, text_end) : text_begin, remaining, new ImVec2());
        }
        // IMGUI_API const char*       CalcWordWrapPositionA(float scale, const char* text, const char* text_end, float wrap_width) const;
        CalcWordWrapPositionA(scale, text, text_end = null, wrap_width) {
            return this.native.CalcWordWrapPositionA(scale, text_end !== null ? text.substring(0, text_end) : text, wrap_width);
        }
        // IMGUI_API void              RenderChar(ImDrawList* draw_list, float size, ImVec2 pos, ImU32 col, unsigned short c) const;
        RenderChar(draw_list, size, pos, col, c) {
            this.native.RenderChar(draw_list.native, size, pos, col, c);
        }
        // IMGUI_API void              RenderText(ImDrawList* draw_list, float size, ImVec2 pos, ImU32 col, const ImVec4& clip_rect, const char* text_begin, const char* text_end, float wrap_width = 0.0f, bool cpu_fine_clip = false) const;
        RenderText(draw_list, size, pos, col, clip_rect, text_begin, text_end = null, wrap_width = 0.0, cpu_fine_clip = false) { }
    }
    // a script version of BindImGui.ImGuiStyle with matching interface
    class script_ImGuiStyle {
        constructor() {
            this.Alpha = 1.0;
            this.WindowPadding = new ImVec2(8, 8);
            this.WindowRounding = 7.0;
            this.WindowBorderSize = 0.0;
            this.WindowMinSize = new ImVec2(32, 32);
            this.WindowTitleAlign = new ImVec2(0.0, 0.5);
            this.WindowMenuButtonPosition = exports.ImGuiDir.Left;
            this.ChildRounding = 0.0;
            this.ChildBorderSize = 1.0;
            this.PopupRounding = 0.0;
            this.PopupBorderSize = 1.0;
            this.FramePadding = new ImVec2(4, 3);
            this.FrameRounding = 0.0;
            this.FrameBorderSize = 0.0;
            this.ItemSpacing = new ImVec2(8, 4);
            this.ItemInnerSpacing = new ImVec2(4, 4);
            this.TouchExtraPadding = new ImVec2(0, 0);
            this.IndentSpacing = 21.0;
            this.ColumnsMinSpacing = 6.0;
            this.ScrollbarSize = 16.0;
            this.ScrollbarRounding = 9.0;
            this.GrabMinSize = 10.0;
            this.GrabRounding = 0.0;
            this.TabRounding = 0.0;
            this.TabBorderSize = 0.0;
            this.ButtonTextAlign = new ImVec2(0.5, 0.5);
            this.SelectableTextAlign = new ImVec2(0.0, 0.0);
            this.DisplayWindowPadding = new ImVec2(22, 22);
            this.DisplaySafeAreaPadding = new ImVec2(4, 4);
            this.MouseCursorScale = 1;
            this.AntiAliasedLines = true;
            this.AntiAliasedFill = true;
            this.CurveTessellationTol = 1.25;
            this.Colors = [];
            for (let i = 0; i < exports.ImGuiCol.COUNT; ++i) {
                this.Colors[i] = new ImVec4();
            }
            const _this = new ImGuiStyle(this);
            const native = new exports.bind.ImGuiStyle();
            const _that = new ImGuiStyle(native);
            _that.Copy(_this);
            exports.bind.StyleColorsClassic(native);
            _this.Copy(_that);
            native.delete();
        }
        _getAt_Colors(index) { return this.Colors[index]; }
        _setAt_Colors(index, color) { this.Colors[index].Copy(color); return true; }
        ScaleAllSizes(scale_factor) {
            const _this = new ImGuiStyle(this);
            const native = new exports.bind.ImGuiStyle();
            const _that = new ImGuiStyle(native);
            _that.Copy(_this);
            native.ScaleAllSizes(scale_factor);
            _this.Copy(_that);
            native.delete();
        }
    }
    class ImGuiStyle {
        constructor(internal = new script_ImGuiStyle()) {
            this.internal = internal;
            this.Colors = new Proxy([], {
                get: (target, key) => {
                    if (key === "length") {
                        return exports.ImGuiCol.COUNT;
                    }
                    return this.internal._getAt_Colors(Number(key));
                },
                set: (target, key, value) => {
                    return this.internal._setAt_Colors(Number(key), value);
                },
            });
        }
        get Alpha() { return this.internal.Alpha; }
        set Alpha(value) { this.internal.Alpha = value; }
        get WindowPadding() { return this.internal.WindowPadding; }
        get WindowRounding() { return this.internal.WindowRounding; }
        set WindowRounding(value) { this.internal.WindowRounding = value; }
        get WindowBorderSize() { return this.internal.WindowBorderSize; }
        set WindowBorderSize(value) { this.internal.WindowBorderSize = value; }
        get WindowMinSize() { return this.internal.WindowMinSize; }
        get WindowTitleAlign() { return this.internal.WindowTitleAlign; }
        get WindowMenuButtonPosition() { return this.internal.WindowMenuButtonPosition; }
        set WindowMenuButtonPosition(value) { this.internal.WindowMenuButtonPosition = value; }
        get ChildRounding() { return this.internal.ChildRounding; }
        set ChildRounding(value) { this.internal.ChildRounding = value; }
        get ChildBorderSize() { return this.internal.ChildBorderSize; }
        set ChildBorderSize(value) { this.internal.ChildBorderSize = value; }
        get PopupRounding() { return this.internal.PopupRounding; }
        set PopupRounding(value) { this.internal.PopupRounding = value; }
        get PopupBorderSize() { return this.internal.PopupBorderSize; }
        set PopupBorderSize(value) { this.internal.PopupBorderSize = value; }
        get FramePadding() { return this.internal.FramePadding; }
        get FrameRounding() { return this.internal.FrameRounding; }
        set FrameRounding(value) { this.internal.FrameRounding = value; }
        get FrameBorderSize() { return this.internal.FrameBorderSize; }
        set FrameBorderSize(value) { this.internal.FrameBorderSize = value; }
        get ItemSpacing() { return this.internal.ItemSpacing; }
        get ItemInnerSpacing() { return this.internal.ItemInnerSpacing; }
        get TouchExtraPadding() { return this.internal.TouchExtraPadding; }
        get IndentSpacing() { return this.internal.IndentSpacing; }
        set IndentSpacing(value) { this.internal.IndentSpacing = value; }
        get ColumnsMinSpacing() { return this.internal.ColumnsMinSpacing; }
        set ColumnsMinSpacing(value) { this.internal.ColumnsMinSpacing = value; }
        get ScrollbarSize() { return this.internal.ScrollbarSize; }
        set ScrollbarSize(value) { this.internal.ScrollbarSize = value; }
        get ScrollbarRounding() { return this.internal.ScrollbarRounding; }
        set ScrollbarRounding(value) { this.internal.ScrollbarRounding = value; }
        get GrabMinSize() { return this.internal.GrabMinSize; }
        set GrabMinSize(value) { this.internal.GrabMinSize = value; }
        get GrabRounding() { return this.internal.GrabRounding; }
        set GrabRounding(value) { this.internal.GrabRounding = value; }
        get TabRounding() { return this.internal.TabRounding; }
        set TabRounding(value) { this.internal.TabRounding = value; }
        get TabBorderSize() { return this.internal.TabBorderSize; }
        set TabBorderSize(value) { this.internal.TabBorderSize = value; }
        get ButtonTextAlign() { return this.internal.ButtonTextAlign; }
        get SelectableTextAlign() { return this.internal.SelectableTextAlign; }
        get DisplayWindowPadding() { return this.internal.DisplayWindowPadding; }
        get DisplaySafeAreaPadding() { return this.internal.DisplaySafeAreaPadding; }
        get MouseCursorScale() { return this.internal.MouseCursorScale; }
        set MouseCursorScale(value) { this.internal.MouseCursorScale = value; }
        get AntiAliasedLines() { return this.internal.AntiAliasedLines; }
        set AntiAliasedLines(value) { this.internal.AntiAliasedLines = value; }
        get AntiAliasedFill() { return this.internal.AntiAliasedFill; }
        set AntiAliasedFill(value) { this.internal.AntiAliasedFill = value; }
        get CurveTessellationTol() { return this.internal.CurveTessellationTol; }
        set CurveTessellationTol(value) { this.internal.CurveTessellationTol = value; }
        Copy(other) {
            this.Alpha = other.Alpha;
            this.WindowPadding.Copy(other.WindowPadding);
            this.WindowRounding = other.WindowRounding;
            this.WindowBorderSize = other.WindowBorderSize;
            this.WindowMinSize.Copy(other.WindowMinSize);
            this.WindowTitleAlign.Copy(other.WindowTitleAlign);
            this.WindowMenuButtonPosition = other.WindowMenuButtonPosition;
            this.ChildRounding = other.ChildRounding;
            this.ChildBorderSize = other.ChildBorderSize;
            this.PopupRounding = other.PopupRounding;
            this.PopupBorderSize = other.PopupBorderSize;
            this.FramePadding.Copy(other.FramePadding);
            this.FrameRounding = other.FrameRounding;
            this.FrameBorderSize = other.FrameBorderSize;
            this.ItemSpacing.Copy(other.ItemSpacing);
            this.ItemInnerSpacing.Copy(other.ItemInnerSpacing);
            this.TouchExtraPadding.Copy(other.TouchExtraPadding);
            this.IndentSpacing = other.IndentSpacing;
            this.ColumnsMinSpacing = other.ColumnsMinSpacing;
            this.ScrollbarSize = other.ScrollbarSize;
            this.ScrollbarRounding = other.ScrollbarRounding;
            this.GrabMinSize = other.GrabMinSize;
            this.GrabRounding = other.GrabRounding;
            this.TabRounding = other.TabRounding;
            this.TabBorderSize = other.TabBorderSize;
            this.ButtonTextAlign.Copy(other.ButtonTextAlign);
            this.DisplayWindowPadding.Copy(other.DisplayWindowPadding);
            this.DisplaySafeAreaPadding.Copy(other.DisplaySafeAreaPadding);
            this.MouseCursorScale = other.MouseCursorScale;
            this.AntiAliasedLines = other.AntiAliasedLines;
            this.AntiAliasedFill = other.AntiAliasedFill;
            this.CurveTessellationTol = other.CurveTessellationTol;
            for (let i = 0; i < exports.ImGuiCol.COUNT; ++i) {
                this.Colors[i].Copy(other.Colors[i]);
            }
            return this;
        }
        ScaleAllSizes(scale_factor) { this.internal.ScaleAllSizes(scale_factor); }
    }
    // This is where your app communicate with Dear ImGui. Access via ImGui::GetIO().
    // Read 'Programmer guide' section in .cpp file for general usage.
    class ImGuiIO {
        constructor(native) {
            this.native = native;
            // int           KeyMap[ImGuiKey_COUNT];   // <unset>              // Map of indices into the KeysDown[512] entries array
            this.KeyMap = new Proxy([], {
                get: (target, key) => {
                    if (key === "length") {
                        return exports.Key.COUNT;
                    }
                    return this.native._getAt_KeyMap(Number(key));
                },
                set: (target, key, value) => {
                    return this.native._setAt_KeyMap(Number(key), value);
                },
            });
            // bool        MouseDown[5];               // Mouse buttons: left, right, middle + extras. ImGui itself mostly only uses left button (BeginPopupContext** are using right button). Others buttons allows us to track if the mouse is being used by your application + available to user as a convenience via IsMouse** API.
            this.MouseDown = new Proxy([], {
                get: (target, key) => {
                    if (key === "length") {
                        return 5;
                    }
                    return this.native._getAt_MouseDown(Number(key));
                },
                set: (target, key, value) => {
                    return this.native._setAt_MouseDown(Number(key), value);
                },
            });
            // bool        KeysDown[512];              // Keyboard keys that are pressed (in whatever storage order you naturally have access to keyboard data)
            this.KeysDown = new Proxy([], {
                get: (target, key) => {
                    if (key === "length") {
                        return 512;
                    }
                    return this.native._getAt_KeysDown(Number(key));
                },
                set: (target, key, value) => {
                    return this.native._setAt_KeysDown(Number(key), value);
                },
            });
            // float       NavInputs[ImGuiNavInput_COUNT]; // Gamepad inputs (keyboard keys will be auto-mapped and be written here by ImGui::NewFrame)
            this.NavInputs = new Proxy([], {
                get: (target, key) => {
                    if (key === "length") {
                        return exports.NavInput.COUNT;
                    }
                    return this.native._getAt_NavInputs(Number(key));
                },
                set: (target, key, value) => {
                    return this.native._setAt_NavInputs(Number(key), value);
                },
            });
            //------------------------------------------------------------------
            // [Internal] ImGui will maintain those fields. Forward compatibility not guaranteed!
            //------------------------------------------------------------------
            // ImVec2      MousePosPrev;               // Previous mouse position temporary storage (nb: not for public use, set to MousePos in NewFrame())
            // ImVec2      MouseClickedPos[5];         // Position at time of clicking
            this.MouseClickedPos = new Proxy([], {
                get: (target, key) => {
                    if (key === "length") {
                        return 5;
                    }
                    return this.native._getAt_MouseClickedPos(Number(key));
                },
            });
            // float       MouseClickedTime[5];        // Time of last click (used to figure out double-click)
            // bool        MouseClicked[5];            // Mouse button went from !Down to Down
            // bool        MouseDoubleClicked[5];      // Has mouse button been double-clicked?
            // bool        MouseReleased[5];           // Mouse button went from Down to !Down
            // bool        MouseDownOwned[5];          // Track if button was clicked inside a window. We don't request mouse capture from the application if click started outside ImGui bounds.
            // float       MouseDownDuration[5];       // Duration the mouse button has been down (0.0f == just clicked)
            this.MouseDownDuration = new Proxy([], {
                get: (target, key) => {
                    if (key === "length") {
                        return 5;
                    }
                    return this.native._getAt_MouseDownDuration(Number(key));
                },
            });
            // float       MouseDownDurationPrev[5];   // Previous time the mouse button has been down
            // ImVec2      MouseDragMaxDistanceAbs[5]; // Maximum distance, absolute, on each axis, of how much mouse has traveled from the clicking point
            // float       MouseDragMaxDistanceSqr[5]; // Squared maximum distance of how much mouse has traveled from the clicking point
            // float       KeysDownDuration[512];      // Duration the keyboard key has been down (0.0f == just pressed)
            this.KeysDownDuration = new Proxy([], {
                get: (target, key) => {
                    if (key === "length") {
                        return 512;
                    }
                    return this.native._getAt_KeysDownDuration(Number(key));
                },
            });
            // float       KeysDownDurationPrev[512];  // Previous duration the key has been down
            // float       NavInputsDownDuration[ImGuiNavInput_COUNT];
            this.NavInputsDownDuration = new Proxy([], {
                get: (target, key) => {
                    if (key === "length") {
                        return exports.NavInput.COUNT;
                    }
                    return this.native._getAt_NavInputsDownDuration(Number(key));
                },
            });
        }
        //------------------------------------------------------------------
        // Settings (fill once)                 // Default value:
        //------------------------------------------------------------------
        // ImGuiConfigFlags   ConfigFlags;         // = 0                  // See ImGuiConfigFlags_ enum. Set by user/application. Gamepad/keyboard navigation options, etc.
        get ConfigFlags() { return this.native.ConfigFlags; }
        set ConfigFlags(value) { this.native.ConfigFlags = value; }
        // ImGuiBackendFlags  BackendFlags;        // = 0                  // Set ImGuiBackendFlags_ enum. Set by imgui_impl_xxx files or custom back-end to communicate features supported by the back-end.
        get BackendFlags() { return this.native.BackendFlags; }
        set BackendFlags(value) { this.native.BackendFlags = value; }
        // ImVec2        DisplaySize;              // <unset>              // Display size, in pixels. For clamping windows positions.
        get DisplaySize() { return this.native.DisplaySize; }
        // float         DeltaTime;                // = 1.0f/60.0f         // Time elapsed since last frame, in seconds.
        get DeltaTime() { return this.native.DeltaTime; }
        set DeltaTime(value) { this.native.DeltaTime = value; }
        // float         IniSavingRate;            // = 5.0f               // Maximum time between saving positions/sizes to .ini file, in seconds.
        get IniSavingRate() { return this.native.IniSavingRate; }
        set IniSavingRate(value) { this.native.IniSavingRate = value; }
        // const char*   IniFilename;              // = "imgui.ini"        // Path to .ini file. NULL to disable .ini saving.
        get IniFilename() { return this.native.IniFilename; }
        set IniFilename(value) { this.native.IniFilename = value; }
        // const char*   LogFilename;              // = "imgui_log.txt"    // Path to .log file (default parameter to ImGui::LogToFile when no file is specified).
        get LogFilename() { return this.native.LogFilename; }
        set LogFilename(value) { this.native.LogFilename = value; }
        // float         MouseDoubleClickTime;     // = 0.30f              // Time for a double-click, in seconds.
        get MouseDoubleClickTime() { return this.native.MouseDoubleClickTime; }
        set MouseDoubleClickTime(value) { this.native.MouseDoubleClickTime = value; }
        // float         MouseDoubleClickMaxDist;  // = 6.0f               // Distance threshold to stay in to validate a double-click, in pixels.
        get MouseDoubleClickMaxDist() { return this.native.MouseDoubleClickMaxDist; }
        set MouseDoubleClickMaxDist(value) { this.native.MouseDoubleClickMaxDist = value; }
        // float         MouseDragThreshold;       // = 6.0f               // Distance threshold before considering we are dragging
        get MouseDragThreshold() { return this.native.MouseDragThreshold; }
        set MouseDragThreshold(value) { this.native.MouseDragThreshold = value; }
        // float         KeyRepeatDelay;           // = 0.250f             // When holding a key/button, time before it starts repeating, in seconds (for buttons in Repeat mode, etc.).
        get KeyRepeatDelay() { return this.native.KeyRepeatDelay; }
        set KeyRepeatDelay(value) { this.native.KeyRepeatDelay = value; }
        // float         KeyRepeatRate;            // = 0.050f             // When holding a key/button, rate at which it repeats, in seconds.
        get KeyRepeatRate() { return this.native.KeyRepeatRate; }
        set KeyRepeatRate(value) { this.native.KeyRepeatRate = value; }
        // void*         UserData;                 // = NULL               // Store your own data for retrieval by callbacks.
        get UserData() { return this.native.UserData; }
        set UserData(value) { this.native.UserData = value; }
        // ImFontAtlas*  Fonts;                    // <auto>               // Load and assemble one or more fonts into a single tightly packed texture. Output to Fonts array.
        get Fonts() { return new ImFontAtlas(this.native.Fonts); }
        // float         FontGlobalScale;          // = 1.0f               // Global scale all fonts
        get FontGlobalScale() { return this.native.FontGlobalScale; }
        set FontGlobalScale(value) { this.native.FontGlobalScale = value; }
        // bool          FontAllowUserScaling;     // = false              // Allow user scaling text of individual window with CTRL+Wheel.
        get FontAllowUserScaling() { return this.native.FontAllowUserScaling; }
        set FontAllowUserScaling(value) { this.native.FontAllowUserScaling = value; }
        // ImFont*       FontDefault;              // = NULL               // Font to use on NewFrame(). Use NULL to uses Fonts->Fonts[0].
        get FontDefault() {
            const font = this.native.FontDefault;
            return (font === null) ? null : new ImFont(font);
        }
        set FontDefault(value) {
            this.native.FontDefault = value && value.native;
        }
        // ImVec2        DisplayFramebufferScale;  // = (1.0f,1.0f)        // For retina display or other situations where window coordinates are different from framebuffer coordinates. User storage only, presently not used by ImGui.
        get DisplayFramebufferScale() { return this.native.DisplayFramebufferScale; }
        // Miscellaneous configuration options
        // bool          OptMacOSXBehaviors;       // = defined(__APPLE__) // OS X style: Text editing cursor movement using Alt instead of Ctrl, Shortcuts using Cmd/Super instead of Ctrl, Line/Text Start and End using Cmd+Arrows instead of Home/End, Double click selects by word instead of selecting whole text, Multi-selection in lists uses Cmd/Super instead of Ctrl
        get ConfigMacOSXBehaviors() { return this.native.ConfigMacOSXBehaviors; }
        set ConfigMacOSXBehaviors(value) { this.native.ConfigMacOSXBehaviors = value; }
        // bool          ConfigInputTextCursorBlink;   // = true               // Enable blinking cursor, for users who consider it annoying.
        get ConfigInputTextCursorBlink() { return this.native.ConfigInputTextCursorBlink; }
        set ConfigInputTextCursorBlink(value) { this.native.ConfigInputTextCursorBlink = value; }
        // bool          ConfigWindowsResizeFromEdges; // = false          // [BETA] Enable resizing of windows from their edges and from the lower-left corner. This requires (io.BackendFlags & ImGuiBackendFlags_HasMouseCursors) because it needs mouse cursor feedback. (This used to be the ImGuiWindowFlags_ResizeFromAnySide flag)
        get ConfigWindowsResizeFromEdges() { return this.native.ConfigWindowsResizeFromEdges; }
        set ConfigWindowsResizeFromEdges(value) { this.native.ConfigWindowsResizeFromEdges = value; }
        // bool        ConfigWindowsMoveFromTitleBarOnly;// = false        // [BETA] Set to true to only allow moving windows when clicked+dragged from the title bar. Windows without a title bar are not affected.
        get ConfigWindowsMoveFromTitleBarOnly() { return this.native.ConfigWindowsMoveFromTitleBarOnly; }
        set ConfigWindowsMoveFromTitleBarOnly(value) { this.native.ConfigWindowsMoveFromTitleBarOnly = value; }
        //------------------------------------------------------------------
        // Settings (User Functions)
        //------------------------------------------------------------------
        // Optional: Platform/Renderer back-end name (informational only! will be displayed in About Window) + User data for back-end/wrappers to store their own stuff.
        // const char* BackendPlatformName;            // = NULL
        get BackendPlatformName() { return this.native.BackendPlatformName; }
        set BackendPlatformName(value) { this.native.BackendPlatformName = value; }
        // const char* BackendRendererName;            // = NULL
        get BackendRendererName() { return this.native.BackendRendererName; }
        set BackendRendererName(value) { this.native.BackendRendererName = value; }
        // void*       BackendPlatformUserData;        // = NULL
        get BackendPlatformUserData() { return this.native.BackendPlatformUserData; }
        set BackendPlatformUserData(value) { this.native.BackendPlatformUserData = value; }
        // void*       BackendRendererUserData;        // = NULL
        get BackendRendererUserData() { return this.native.BackendRendererUserData; }
        set BackendRendererUserData(value) { this.native.BackendRendererUserData = value; }
        // void*       BackendLanguageUserData;        // = NULL
        get BackendLanguageUserData() { return this.native.BackendLanguageUserData; }
        set BackendLanguageUserData(value) { this.native.BackendLanguageUserData = value; }
        // Optional: access OS clipboard
        // (default to use native Win32 clipboard on Windows, otherwise uses a private clipboard. Override to access OS clipboard on other architectures)
        // const char* (*GetClipboardTextFn)(void* user_data);
        get GetClipboardTextFn() { return this.native.GetClipboardTextFn; }
        set GetClipboardTextFn(value) { this.native.GetClipboardTextFn = value; }
        // void        (*SetClipboardTextFn)(void* user_data, const char* text);
        get SetClipboardTextFn() { return this.native.SetClipboardTextFn; }
        set SetClipboardTextFn(value) { this.native.SetClipboardTextFn = value; }
        // void*       ClipboardUserData;
        get ClipboardUserData() { return this.native.ClipboardUserData; }
        set ClipboardUserData(value) { this.native.ClipboardUserData = value; }
        // Optional: override memory allocations. MemFreeFn() may be called with a NULL pointer.
        // (default to posix malloc/free)
        // void*       (*MemAllocFn)(size_t sz);
        // void        (*MemFreeFn)(void* ptr);
        // Optional: notify OS Input Method Editor of the screen position of your cursor for text input position (e.g. when using Japanese/Chinese IME in Windows)
        // (default to use native imm32 api on Windows)
        // void        (*ImeSetInputScreenPosFn)(int x, int y);
        // void*       ImeWindowHandle;            // (Windows) Set this to your HWND to get automatic IME cursor positioning.
        //------------------------------------------------------------------
        // Input - Fill before calling NewFrame()
        //------------------------------------------------------------------
        // ImVec2      MousePos;                   // Mouse position, in pixels. Set to ImVec2(-FLT_MAX,-FLT_MAX) if mouse is unavailable (on another screen, etc.)
        get MousePos() { return this.native.MousePos; }
        // float       MouseWheel;                 // Mouse wheel: 1 unit scrolls about 5 lines text.
        get MouseWheel() { return this.native.MouseWheel; }
        set MouseWheel(value) { this.native.MouseWheel = value; }
        // float       MouseWheelH;                    // Mouse wheel (Horizontal). Most users don't have a mouse with an horizontal wheel, may not be filled by all back-ends.
        get MouseWheelH() { return this.native.MouseWheelH; }
        set MouseWheelH(value) { this.native.MouseWheelH = value; }
        // bool        MouseDrawCursor;            // Request ImGui to draw a mouse cursor for you (if you are on a platform without a mouse cursor).
        get MouseDrawCursor() { return this.native.MouseDrawCursor; }
        set MouseDrawCursor(value) { this.native.MouseDrawCursor = value; }
        // bool        KeyCtrl;                    // Keyboard modifier pressed: Control
        get KeyCtrl() { return this.native.KeyCtrl; }
        set KeyCtrl(value) { this.native.KeyCtrl = value; }
        // bool        KeyShift;                   // Keyboard modifier pressed: Shift
        get KeyShift() { return this.native.KeyShift; }
        set KeyShift(value) { this.native.KeyShift = value; }
        // bool        KeyAlt;                     // Keyboard modifier pressed: Alt
        get KeyAlt() { return this.native.KeyAlt; }
        set KeyAlt(value) { this.native.KeyAlt = value; }
        // bool        KeySuper;                   // Keyboard modifier pressed: Cmd/Super/Windows
        get KeySuper() { return this.native.KeySuper; }
        set KeySuper(value) { this.native.KeySuper = value; }
        // Functions
        // IMGUI_API void AddInputCharacter(ImWchar c);                        // Add new character into InputCharacters[]
        AddInputCharacter(c) { this.native.AddInputCharacter(c); }
        // IMGUI_API void AddInputCharactersUTF8(const char* utf8_chars);      // Add new characters into InputCharacters[] from an UTF-8 string
        AddInputCharactersUTF8(utf8_chars) { this.native.AddInputCharactersUTF8(utf8_chars); }
        // inline void    ClearInputCharacters() { InputCharacters[0] = 0; }   // Clear the text input buffer manually
        ClearInputCharacters() { this.native.ClearInputCharacters(); }
        //------------------------------------------------------------------
        // Output - Retrieve after calling NewFrame()
        //------------------------------------------------------------------
        // bool        WantCaptureMouse;           // When io.WantCaptureMouse is true, do not dispatch mouse input data to your main application. This is set by ImGui when it wants to use your mouse (e.g. unclicked mouse is hovering a window, or a widget is active).
        get WantCaptureMouse() { return this.native.WantCaptureMouse; }
        set WantCaptureMouse(value) { this.native.WantCaptureMouse = value; }
        // bool        WantCaptureKeyboard;        // When io.WantCaptureKeyboard is true, do not dispatch keyboard input data to your main application. This is set by ImGui when it wants to use your keyboard inputs.
        get WantCaptureKeyboard() { return this.native.WantCaptureKeyboard; }
        set WantCaptureKeyboard(value) { this.native.WantCaptureKeyboard = value; }
        // bool        WantTextInput;              // Mobile/console: when io.WantTextInput is true, you may display an on-screen keyboard. This is set by ImGui when it wants textual keyboard input to happen (e.g. when a InputText widget is active).
        get WantTextInput() { return this.native.WantTextInput; }
        set WantTextInput(value) { this.native.WantTextInput = value; }
        // bool        WantSetMousePos;              // [BETA-NAV] MousePos has been altered, back-end should reposition mouse on next frame. Set only when 'NavMovesMouse=true'.
        get WantSetMousePos() { return this.native.WantSetMousePos; }
        set WantSetMousePos(value) { this.native.WantSetMousePos = value; }
        // bool        WantSaveIniSettings;        // When manual .ini load/save is active (io.IniFilename == NULL), this will be set to notify your application that you can call SaveIniSettingsToMemory() and save yourself. IMPORTANT: You need to clear io.WantSaveIniSettings yourself.
        get WantSaveIniSettings() { return this.native.WantSaveIniSettings; }
        set WantSaveIniSettings(value) { this.native.WantSaveIniSettings = value; }
        // bool        NavActive;                  // Directional navigation is currently allowed (will handle ImGuiKey_NavXXX events) = a window is focused and it doesn't use the ImGuiWindowFlags_NoNavInputs flag.
        get NavActive() { return this.native.NavActive; }
        set NavActive(value) { this.native.NavActive = value; }
        // bool        NavVisible;                 // Directional navigation is visible and allowed (will handle ImGuiKey_NavXXX events).
        get NavVisible() { return this.native.NavVisible; }
        set NavVisible(value) { this.native.NavVisible = value; }
        // float       Framerate;                  // Application framerate estimation, in frame per second. Solely for convenience. Rolling average estimation based on IO.DeltaTime over 120 frames
        get Framerate() { return this.native.Framerate; }
        // int         MetricsRenderVertices;      // Vertices output during last call to Render()
        get MetricsRenderVertices() { return this.native.MetricsRenderVertices; }
        // int         MetricsRenderIndices;       // Indices output during last call to Render() = number of triangles * 3
        get MetricsRenderIndices() { return this.native.MetricsRenderIndices; }
        // int         MetricsRenderWindows;       // Number of visible windows
        get MetricsRenderWindows() { return this.native.MetricsRenderWindows; }
        // int         MetricsActiveWindows;       // Number of visible root windows (exclude child windows)
        get MetricsActiveWindows() { return this.native.MetricsActiveWindows; }
        // int         MetricsActiveAllocations;   // Number of active allocations, updated by MemAlloc/MemFree based on current context. May be off if you have multiple imgui contexts.
        get MetricsActiveAllocations() { return this.native.MetricsActiveAllocations; }
        // ImVec2      MouseDelta;                 // Mouse delta. Note that this is zero if either current or previous position are invalid (-FLT_MAX,-FLT_MAX), so a disappearing/reappearing mouse won't have a huge delta.
        get MouseDelta() { return this.native.MouseDelta; }
    }
    // Context creation and access, if you want to use multiple context, share context between modules (e.g. DLL).
    // All contexts share a same ImFontAtlas by default. If you want different font atlas, you can new() them and overwrite the GetIO().Fonts variable of an ImGui context.
    // All those functions are not reliant on the current context.
    class ImGuiContext {
        constructor(native) {
            this.native = native;
            this.textures = [];
        }
        static getTexture(index) {
            if (ImGuiContext.current_ctx === null) {
                throw new Error();
            }
            return ImGuiContext.current_ctx._getTexture(index);
        }
        static setTexture(texture) {
            if (ImGuiContext.current_ctx === null) {
                throw new Error();
            }
            return ImGuiContext.current_ctx._setTexture(texture);
        }
        _getTexture(index) {
            return this.textures[index] || null;
        }
        _setTexture(texture) {
            let index = this.textures.indexOf(texture);
            if (index === -1) {
                for (let i = 0; i < this.textures.length; ++i) {
                    if (this.textures[i] === null) {
                        this.textures[i] = texture;
                        return i;
                    }
                }
                index = this.textures.length;
                this.textures.push(texture);
            }
            return index;
        }
    }
    ImGuiContext.current_ctx = null;
    // IMGUI_API ImGuiContext* CreateContext(ImFontAtlas* shared_font_atlas = NULL);
    function CreateContext(shared_font_atlas = null) {
        const ctx = new ImGuiContext(exports.bind.CreateContext());
        if (ImGuiContext.current_ctx === null) {
            ImGuiContext.current_ctx = ctx;
        }
        return ctx;
    }
    // IMGUI_API void          DestroyContext(ImGuiContext* ctx = NULL);   // NULL = Destroy current context
    function DestroyContext(ctx = null) {
        if (ctx === null) {
            ctx = ImGuiContext.current_ctx;
            ImGuiContext.current_ctx = null;
        }
        exports.bind.DestroyContext((ctx === null) ? null : ctx.native);
    }
    // IMGUI_API ImGuiContext* GetCurrentContext();
    function GetCurrentContext() {
        // const ctx_native: BindImGui.ImGuiContext | null = bind.GetCurrentContext();
        return ImGuiContext.current_ctx;
    }
    // IMGUI_API void          SetCurrentContext(ImGuiContext* ctx);
    function SetCurrentContext(ctx) {
        exports.bind.SetCurrentContext((ctx === null) ? null : ctx.native);
        ImGuiContext.current_ctx = ctx;
    }
    // IMGUI_API bool          DebugCheckVersionAndDataLayout(const char* version_str, size_t sz_io, size_t sz_style, size_t sz_vec2, size_t sz_vec4, size_t sz_drawvert);
    function DebugCheckVersionAndDataLayout(version_str, sz_io, sz_style, sz_vec2, sz_vec4, sz_draw_vert, sz_draw_idx) {
        return exports.bind.DebugCheckVersionAndDataLayout(version_str, sz_io, sz_style, sz_vec2, sz_vec4, sz_draw_vert, sz_draw_idx);
    }
    // Main
    // IMGUI_API ImGuiIO&      GetIO();
    function GetIO() { return new ImGuiIO(exports.bind.GetIO()); }
    // IMGUI_API ImGuiStyle&   GetStyle();
    function GetStyle() { return new ImGuiStyle(exports.bind.GetStyle()); }
    // IMGUI_API void          NewFrame();                                 // start a new ImGui frame, you can submit any command from this point until Render()/EndFrame().
    function NewFrame() { exports.bind.NewFrame(); }
    // IMGUI_API void          EndFrame();                                 // ends the ImGui frame. automatically called by Render(), so most likely don't need to ever call that yourself directly. If you don't need to render you may call EndFrame() but you'll have wasted CPU already. If you don't need to render, better to not create any imgui windows instead!
    function EndFrame() { exports.bind.EndFrame(); }
    // IMGUI_API void          Render();                                   // ends the ImGui frame, finalize the draw data, then call your io.RenderDrawListsFn() function if set.
    function Render() { exports.bind.Render(); }
    // IMGUI_API ImDrawData*   GetDrawData();                              // same value as passed to your io.RenderDrawListsFn() function. valid after Render() and until the next call to NewFrame()
    function GetDrawData() {
        const draw_data = exports.bind.GetDrawData();
        return (draw_data === null) ? null : new ImDrawData(draw_data);
    }
    // Demo, Debug, Informations
    // IMGUI_API void          ShowDemoWindow(bool* p_open = NULL);        // create demo/test window (previously called ShowTestWindow). demonstrate most ImGui features. call this to learn about the library! try to make it always available in your application!
    function ShowDemoWindow(p_open = null) { exports.bind.ShowDemoWindow(p_open); }
    // IMGUI_API void          ShowAboutWindow(bool* p_open = NULL);       // create about window. display Dear ImGui version, credits and build/system information.
    function ShowAboutWindow(p_open = null) {
        if (p_open === null) {
            exports.bind.ShowAboutWindow(null);
        }
        else if (Array.isArray(p_open)) {
            exports.bind.ShowAboutWindow(p_open);
        }
        else {
            const ref_open = [p_open()];
            exports.bind.ShowAboutWindow(ref_open);
            p_open(ref_open[0]);
        }
    }
    // IMGUI_API void          ShowMetricsWindow(bool* p_open = NULL);     // create metrics window. display ImGui internals: draw commands (with individual draw calls and vertices), window list, basic internal state, etc.
    function ShowMetricsWindow(p_open = null) {
        if (p_open === null) {
            exports.bind.ShowMetricsWindow(null);
        }
        else if (Array.isArray(p_open)) {
            exports.bind.ShowMetricsWindow(p_open);
        }
        else {
            const ref_open = [p_open()];
            exports.bind.ShowMetricsWindow(ref_open);
            p_open(ref_open[0]);
        }
    }
    // IMGUI_API void          ShowStyleEditor(ImGuiStyle* ref = NULL);    // add style editor block (not a window). you can pass in a reference ImGuiStyle structure to compare to, revert to and save to (else it uses the default style)
    function ShowStyleEditor(ref = null) {
        if (ref === null) {
            exports.bind.ShowStyleEditor(null);
        }
        else if (ref.internal instanceof exports.bind.ImGuiStyle) {
            exports.bind.ShowStyleEditor(ref.internal);
        }
        else {
            const native = new exports.bind.ImGuiStyle();
            const wrap = new ImGuiStyle(native);
            wrap.Copy(ref);
            exports.bind.ShowStyleEditor(native);
            ref.Copy(wrap);
            native.delete();
        }
    }
    // IMGUI_API bool          ShowStyleSelector(const char* label);
    function ShowStyleSelector(label) { return exports.bind.ShowStyleSelector(label); }
    // IMGUI_API void          ShowFontSelector(const char* label);
    function ShowFontSelector(label) { exports.bind.ShowFontSelector(label); }
    // IMGUI_API void          ShowUserGuide();                            // add basic help/info block (not a window): how to manipulate ImGui as a end-user (mouse/keyboard controls).
    function ShowUserGuide() { exports.bind.ShowUserGuide(); }
    // IMGUI_API const char*   GetVersion();
    function GetVersion() { return exports.bind.GetVersion(); }
    // Styles
    // IMGUI_API void          StyleColorsClassic(ImGuiStyle* dst = NULL);
    function StyleColorsClassic(dst = null) {
        if (dst === null) {
            exports.bind.StyleColorsClassic(null);
        }
        else if (dst.internal instanceof exports.bind.ImGuiStyle) {
            exports.bind.StyleColorsClassic(dst.internal);
        }
        else {
            const native = new exports.bind.ImGuiStyle();
            const wrap = new ImGuiStyle(native);
            wrap.Copy(dst);
            exports.bind.StyleColorsClassic(native);
            dst.Copy(wrap);
            native.delete();
        }
    }
    // IMGUI_API void          StyleColorsDark(ImGuiStyle* dst = NULL);
    function StyleColorsDark(dst = null) {
        if (dst === null) {
            exports.bind.StyleColorsDark(null);
        }
        else if (dst.internal instanceof exports.bind.ImGuiStyle) {
            exports.bind.StyleColorsDark(dst.internal);
        }
        else {
            const native = new exports.bind.ImGuiStyle();
            const wrap = new ImGuiStyle(native);
            wrap.Copy(dst);
            exports.bind.StyleColorsDark(native);
            dst.Copy(wrap);
            native.delete();
        }
    }
    // IMGUI_API void          StyleColorsLight(ImGuiStyle* dst = NULL);
    function StyleColorsLight(dst = null) {
        if (dst === null) {
            exports.bind.StyleColorsLight(null);
        }
        else if (dst.internal instanceof exports.bind.ImGuiStyle) {
            exports.bind.StyleColorsLight(dst.internal);
        }
        else {
            const native = new exports.bind.ImGuiStyle();
            const wrap = new ImGuiStyle(native);
            wrap.Copy(dst);
            exports.bind.StyleColorsLight(native);
            dst.Copy(wrap);
            native.delete();
        }
    }
    // Window
    // IMGUI_API bool          Begin(const char* name, bool* p_open = NULL, ImGuiWindowFlags flags = 0);                                                   // push window to the stack and start appending to it. see .cpp for details. return false when window is collapsed, so you can early out in your code. 'bool* p_open' creates a widget on the upper-right to close the window (which sets your bool to false).
    function Begin(name, open = null, flags = 0) {
        if (open === null) {
            return exports.bind.Begin(name, null, flags);
        }
        else if (Array.isArray(open)) {
            return exports.bind.Begin(name, open, flags);
        }
        else {
            const ref_open = [open()];
            const opened = exports.bind.Begin(name, ref_open, flags);
            open(ref_open[0]);
            return opened;
        }
    }
    // IMGUI_API void          End();                                                                                                                      // finish appending to current window, pop it off the window stack.
    function End() { exports.bind.End(); }
    // IMGUI_API bool          BeginChild(const char* str_id, const ImVec2& size = ImVec2(0,0), bool border = false, ImGuiWindowFlags extra_flags = 0);    // begin a scrolling region. size==0.0f: use remaining window size, size<0.0f: use remaining window size minus abs(size). size>0.0f: fixed size. each axis can use a different mode, e.g. ImVec2(0,400).
    // IMGUI_API bool          BeginChild(ImGuiID id, const ImVec2& size = ImVec2(0,0), bool border = false, ImGuiWindowFlags extra_flags = 0);            // "
    function BeginChild(id, size = ImVec2.ZERO, border = false, extra_flags = 0) {
        return exports.bind.BeginChild(id, size, border, extra_flags);
    }
    // IMGUI_API void          EndChild();
    function EndChild() { exports.bind.EndChild(); }
    // IMGUI_API ImVec2        GetContentRegionMax();                                              // current content boundaries (typically window boundaries including scrolling, or current column boundaries), in windows coordinates
    function GetContentRegionMax(out = new ImVec2()) {
        return exports.bind.GetContentRegionMax(out);
    }
    // IMGUI_API ImVec2        GetContentRegionAvail();                                            // == GetContentRegionMax() - GetCursorPos()
    function GetContentRegionAvail(out = new ImVec2()) {
        return exports.bind.GetContentRegionAvail(out);
    }
    // IMGUI_API ImVec2        GetWindowContentRegionMin();                                        // content boundaries min (roughly (0,0)-Scroll), in window coordinates
    function GetWindowContentRegionMin(out = new ImVec2()) {
        return exports.bind.GetWindowContentRegionMin(out);
    }
    // IMGUI_API ImVec2        GetWindowContentRegionMax();                                        // content boundaries max (roughly (0,0)+Size-Scroll) where Size can be override with SetNextWindowContentSize(), in window coordinates
    function GetWindowContentRegionMax(out = new ImVec2()) {
        return exports.bind.GetWindowContentRegionMax(out);
    }
    // IMGUI_API float         GetWindowContentRegionWidth();                                      //
    function GetWindowContentRegionWidth() { return exports.bind.GetWindowContentRegionWidth(); }
    // IMGUI_API ImDrawList*   GetWindowDrawList();                                                // get rendering command-list if you want to append your own draw primitives
    function GetWindowDrawList() {
        return new ImDrawList(exports.bind.GetWindowDrawList());
    }
    // IMGUI_API ImVec2        GetWindowPos();                                                     // get current window position in screen space (useful if you want to do your own drawing via the DrawList api)
    function GetWindowPos(out = new ImVec2()) {
        return exports.bind.GetWindowPos(out);
    }
    // IMGUI_API ImVec2        GetWindowSize();                                                    // get current window size
    function GetWindowSize(out = new ImVec2()) {
        return exports.bind.GetWindowSize(out);
    }
    // IMGUI_API float         GetWindowWidth();
    function GetWindowWidth() { return exports.bind.GetWindowWidth(); }
    // IMGUI_API float         GetWindowHeight();
    function GetWindowHeight() { return exports.bind.GetWindowHeight(); }
    // IMGUI_API bool          IsWindowCollapsed();
    function IsWindowCollapsed() { return exports.bind.IsWindowCollapsed(); }
    // IMGUI_API bool          IsWindowAppearing();
    function IsWindowAppearing() { return exports.bind.IsWindowAppearing(); }
    // IMGUI_API void          SetWindowFontScale(float scale);                                    // per-window font scale. Adjust IO.FontGlobalScale if you want to scale all windows
    function SetWindowFontScale(scale) { exports.bind.SetWindowFontScale(scale); }
    // IMGUI_API void          SetNextWindowPos(const ImVec2& pos, ImGuiCond cond = 0, const ImVec2& pivot = ImVec2(0,0)); // set next window position. call before Begin(). use pivot=(0.5f,0.5f) to center on given point, etc.
    function SetNextWindowPos(pos, cond = 0, pivot = ImVec2.ZERO) {
        exports.bind.SetNextWindowPos(pos, cond, pivot);
    }
    // IMGUI_API void          SetNextWindowSize(const ImVec2& size, ImGuiCond cond = 0);          // set next window size. set axis to 0.0f to force an auto-fit on this axis. call before Begin()
    function SetNextWindowSize(pos, cond = 0) {
        exports.bind.SetNextWindowSize(pos, cond);
    }
    // IMGUI_API void          SetNextWindowSizeConstraints(const ImVec2& size_min, const ImVec2& size_max, ImGuiSizeConstraintCallback custom_callback = NULL, void* custom_callback_data = NULL); // set next window size limits. use -1,-1 on either X/Y axis to preserve the current size. Use callback to apply non-trivial programmatic constraints.
    function SetNextWindowSizeConstraints(size_min, size_max, custom_callback = null, custom_callback_data = null) {
        if (custom_callback) {
            exports.bind.SetNextWindowSizeConstraints(size_min, size_max, (data) => {
                custom_callback(new ImGuiSizeCallbackData(data, custom_callback_data));
            }, null);
        }
        else {
            exports.bind.SetNextWindowSizeConstraints(size_min, size_max, null, null);
        }
    }
    // IMGUI_API void          SetNextWindowContentSize(const ImVec2& size);                       // set next window content size (~ enforce the range of scrollbars). not including window decorations (title bar, menu bar, etc.). set an axis to 0.0f to leave it automatic. call before Begin()
    function SetNextWindowContentSize(size) {
        exports.bind.SetNextWindowContentSize(size);
    }
    // IMGUI_API void          SetNextWindowCollapsed(bool collapsed, ImGuiCond cond = 0);         // set next window collapsed state. call before Begin()
    function SetNextWindowCollapsed(collapsed, cond = 0) {
        exports.bind.SetNextWindowCollapsed(collapsed, cond);
    }
    // IMGUI_API void          SetNextWindowFocus();                                               // set next window to be focused / front-most. call before Begin()
    function SetNextWindowFocus() { exports.bind.SetNextWindowFocus(); }
    // IMGUI_API void          SetNextWindowBgAlpha(float alpha);                                  // set next window background color alpha. helper to easily modify ImGuiCol_WindowBg/ChildBg/PopupBg.
    function SetNextWindowBgAlpha(alpha) { exports.bind.SetNextWindowBgAlpha(alpha); }
    // IMGUI_API void          SetWindowPos(const ImVec2& pos, ImGuiCond cond = 0);                // (not recommended) set current window position - call within Begin()/End(). prefer using SetNextWindowPos(), as this may incur tearing and side-effects.
    // IMGUI_API void          SetWindowSize(const ImVec2& size, ImGuiCond cond = 0);              // (not recommended) set current window size - call within Begin()/End(). set to ImVec2(0,0) to force an auto-fit. prefer using SetNextWindowSize(), as this may incur tearing and minor side-effects.
    // IMGUI_API void          SetWindowCollapsed(bool collapsed, ImGuiCond cond = 0);             // (not recommended) set current window collapsed state. prefer using SetNextWindowCollapsed().
    // IMGUI_API void          SetWindowFocus();                                                   // (not recommended) set current window to be focused / front-most. prefer using SetNextWindowFocus().
    // IMGUI_API void          SetWindowPos(const char* name, const ImVec2& pos, ImGuiCond cond = 0);      // set named window position.
    // IMGUI_API void          SetWindowSize(const char* name, const ImVec2& size, ImGuiCond cond = 0);    // set named window size. set axis to 0.0f to force an auto-fit on this axis.
    // IMGUI_API void          SetWindowCollapsed(const char* name, bool collapsed, ImGuiCond cond = 0);   // set named window collapsed state
    // IMGUI_API void          SetWindowFocus(const char* name);                                           // set named window to be focused / front-most. use NULL to remove focus.
    function SetWindowPos(name_or_pos, pos_or_cond = 0, cond = 0) {
        if (typeof (name_or_pos) === "string") {
            exports.bind.SetWindowNamePos(name_or_pos, pos_or_cond, cond);
            return;
        }
        else {
            exports.bind.SetWindowPos(name_or_pos, pos_or_cond);
        }
    }
    function SetWindowSize(name_or_size, size_or_cond = 0, cond = 0) {
        if (typeof (name_or_size) === "string") {
            exports.bind.SetWindowNamePos(name_or_size, size_or_cond, cond);
        }
        else {
            exports.bind.SetWindowSize(name_or_size, size_or_cond);
        }
    }
    function SetWindowCollapsed(name_or_collapsed, collapsed_or_cond = 0, cond = 0) {
        if (typeof (name_or_collapsed) === "string") {
            exports.bind.SetWindowNameCollapsed(name_or_collapsed, collapsed_or_cond, cond);
        }
        else {
            exports.bind.SetWindowCollapsed(name_or_collapsed, collapsed_or_cond);
        }
    }
    function SetWindowFocus(name) {
        if (typeof (name) === "string") {
            exports.bind.SetWindowNameFocus(name);
        }
        else {
            exports.bind.SetWindowFocus();
        }
    }
    // IMGUI_API float         GetScrollX();                                                       // get scrolling amount [0..GetScrollMaxX()]
    function GetScrollX() { return exports.bind.GetScrollX(); }
    // IMGUI_API float         GetScrollY();                                                       // get scrolling amount [0..GetScrollMaxY()]
    function GetScrollY() { return exports.bind.GetScrollY(); }
    // IMGUI_API float         GetScrollMaxX();                                                    // get maximum scrolling amount ~~ ContentSize.X - WindowSize.X
    function GetScrollMaxX() { return exports.bind.GetScrollMaxX(); }
    // IMGUI_API float         GetScrollMaxY();                                                    // get maximum scrolling amount ~~ ContentSize.Y - WindowSize.Y
    function GetScrollMaxY() { return exports.bind.GetScrollMaxY(); }
    // IMGUI_API void          SetScrollX(float scroll_x);                                         // set scrolling amount [0..GetScrollMaxX()]
    function SetScrollX(scroll_x) { exports.bind.SetScrollX(scroll_x); }
    // IMGUI_API void          SetScrollY(float scroll_y);                                         // set scrolling amount [0..GetScrollMaxY()]
    function SetScrollY(scroll_y) { exports.bind.SetScrollY(scroll_y); }
    // IMGUI_API void          SetScrollHereY(float center_y_ratio = 0.5f);                         // adjust scrolling amount to make current cursor position visible. center_y_ratio=0.0: top, 0.5: center, 1.0: bottom. When using to make a "default/current item" visible, consider using SetItemDefaultFocus() instead.
    function SetScrollHereY(center_y_ratio = 0.5) {
        exports.bind.SetScrollHereY(center_y_ratio);
    }
    // IMGUI_API void          SetScrollFromPosY(float pos_y, float center_y_ratio = 0.5f);        // adjust scrolling amount to make given position valid. use GetCursorPos() or GetCursorStartPos()+offset to get valid positions.
    function SetScrollFromPosY(pos_y, center_y_ratio = 0.5) {
        exports.bind.SetScrollFromPosY(pos_y, center_y_ratio);
    }
    // IMGUI_API void          SetStateStorage(ImGuiStorage* tree);                                // replace tree state storage with our own (if you want to manipulate it yourself, typically clear subsection of it)
    // IMGUI_API ImGuiStorage* GetStateStorage();
    // Parameters stacks (shared)
    // IMGUI_API void          PushFont(ImFont* font);                                             // use NULL as a shortcut to push default font
    function PushFont(font) { exports.bind.PushFont(font ? font.native : null); }
    // IMGUI_API void          PopFont();
    function PopFont() { exports.bind.PopFont(); }
    // IMGUI_API void          PushStyleColor(ImGuiCol idx, ImU32 col);
    // IMGUI_API void          PushStyleColor(ImGuiCol idx, const ImVec4& col);
    function PushStyleColor(idx, col) {
        if (col instanceof ImColor) {
            exports.bind.PushStyleColor(idx, col.Value);
        }
        else {
            exports.bind.PushStyleColor(idx, col);
        }
    }
    // IMGUI_API void          PopStyleColor(int count = 1);
    function PopStyleColor(count = 1) {
        exports.bind.PopStyleColor(count);
    }
    // IMGUI_API void          PushStyleVar(ImGuiStyleVar idx, float val);
    // IMGUI_API void          PushStyleVar(ImGuiStyleVar idx, const ImVec2& val);
    function PushStyleVar(idx, val) {
        exports.bind.PushStyleVar(idx, val);
    }
    // IMGUI_API void          PopStyleVar(int count = 1);
    function PopStyleVar(count = 1) {
        exports.bind.PopStyleVar(count);
    }
    // IMGUI_API const ImVec4& GetStyleColorVec4(ImGuiCol idx);                                    // retrieve style color as stored in ImGuiStyle structure. use to feed back into PushStyleColor(), otherwhise use GetColorU32() to get style color + style alpha.
    function GetStyleColorVec4(idx) {
        return exports.bind.GetStyleColorVec4(idx);
    }
    // IMGUI_API ImFont*       GetFont();                                                          // get current font
    function GetFont() {
        return new ImFont(exports.bind.GetFont());
    }
    // IMGUI_API float         GetFontSize();                                                      // get current font size (= height in pixels) of current font with current scale applied
    function GetFontSize() { return exports.bind.GetFontSize(); }
    // IMGUI_API ImVec2        GetFontTexUvWhitePixel();                                           // get UV coordinate for a while pixel, useful to draw custom shapes via the ImDrawList API
    function GetFontTexUvWhitePixel(out = new ImVec2()) {
        return exports.bind.GetFontTexUvWhitePixel(out);
    }
    function GetColorU32(...args) {
        if (args.length === 1) {
            if (typeof (args[0]) === "number") {
                // TODO: ImGuiCol or ImU32
                const idx = args[0];
                return exports.bind.GetColorU32_A(idx, 1.0);
            }
            else {
                const col = args[0];
                return exports.bind.GetColorU32_B(col);
            }
        }
        else {
            const idx = args[0];
            const alpha_mul = args[1];
            return exports.bind.GetColorU32_A(idx, alpha_mul);
        }
    }
    // Parameters stacks (current window)
    // IMGUI_API void          PushItemWidth(float item_width);                                    // width of items for the common item+label case, pixels. 0.0f = default to ~2/3 of windows width, >0.0f: width in pixels, <0.0f align xx pixels to the right of window (so -1.0f always align width to the right side)
    function PushItemWidth(item_width) { exports.bind.PushItemWidth(item_width); }
    // IMGUI_API void          PopItemWidth();
    function PopItemWidth() { exports.bind.PopItemWidth(); }
    // IMGUI_API float         CalcItemWidth();                                                    // width of item given pushed settings and current cursor position
    function SetNextItemWidth(item_width) { exports.bind.SetNextItemWidth(item_width); } // set width of the _next_ common large "item+label" widget. >0.0f: width in pixels, <0.0f align xx pixels to the right of window (so -1.0f always align width to the right side)
    function CalcItemWidth() { return exports.bind.CalcItemWidth(); }
    // IMGUI_API void          PushTextWrapPos(float wrap_pos_x = 0.0f);                           // word-wrapping for Text*() commands. < 0.0f: no wrapping; 0.0f: wrap to end of window (or column); > 0.0f: wrap at 'wrap_pos_x' position in window local space
    function PushTextWrapPos(wrap_pos_x = 0.0) {
        exports.bind.PushTextWrapPos(wrap_pos_x);
    }
    // IMGUI_API void          PopTextWrapPos();
    function PopTextWrapPos() { exports.bind.PopTextWrapPos(); }
    // IMGUI_API void          PushAllowKeyboardFocus(bool allow_keyboard_focus);                  // allow focusing using TAB/Shift-TAB, enabled by default but you can disable it for certain widgets
    function PushAllowKeyboardFocus(allow_keyboard_focus) { exports.bind.PushAllowKeyboardFocus(allow_keyboard_focus); }
    // IMGUI_API void          PopAllowKeyboardFocus();
    function PopAllowKeyboardFocus() { exports.bind.PopAllowKeyboardFocus(); }
    // IMGUI_API void          PushButtonRepeat(bool repeat);                                      // in 'repeat' mode, Button*() functions return repeated true in a typematic manner (using io.KeyRepeatDelay/io.KeyRepeatRate setting). Note that you can call IsItemActive() after any Button() to tell if the button is held in the current frame.
    function PushButtonRepeat(repeat) { exports.bind.PushButtonRepeat(repeat); }
    // IMGUI_API void          PopButtonRepeat();
    function PopButtonRepeat() { exports.bind.PopButtonRepeat(); }
    // Cursor / Layout
    // IMGUI_API void          Separator();                                                        // separator, generally horizontal. inside a menu bar or in horizontal layout mode, this becomes a vertical separator.
    function Separator() { exports.bind.Separator(); }
    // IMGUI_API void          SameLine(float pos_x = 0.0f, float spacing_w = -1.0f);              // call between widgets or groups to layout them horizontally
    function SameLine(pos_x = 0.0, spacing_w = -1.0) {
        exports.bind.SameLine(pos_x, spacing_w);
    }
    // IMGUI_API void          NewLine();                                                          // undo a SameLine()
    function NewLine() { exports.bind.NewLine(); }
    // IMGUI_API void          Spacing();                                                          // add vertical spacing
    function Spacing() { exports.bind.Spacing(); }
    // IMGUI_API void          Dummy(const ImVec2& size);                                          // add a dummy item of given size
    function Dummy(size) { exports.bind.Dummy(size); }
    // IMGUI_API void          Indent(float indent_w = 0.0f);                                      // move content position toward the right, by style.IndentSpacing or indent_w if != 0
    function Indent(indent_w = 0.0) { exports.bind.Indent(indent_w); }
    // IMGUI_API void          Unindent(float indent_w = 0.0f);                                    // move content position back to the left, by style.IndentSpacing or indent_w if != 0
    function Unindent(indent_w = 0.0) { exports.bind.Unindent(indent_w); }
    // IMGUI_API void          BeginGroup();                                                       // lock horizontal starting position + capture group bounding box into one "item" (so you can use IsItemHovered() or layout primitives such as SameLine() on whole group, etc.)
    function BeginGroup() { exports.bind.BeginGroup(); }
    // IMGUI_API void          EndGroup();
    function EndGroup() { exports.bind.EndGroup(); }
    // IMGUI_API ImVec2        GetCursorPos();                                                     // cursor position is relative to window position
    function GetCursorPos(out = new ImVec2()) { return exports.bind.GetCursorPos(out); }
    // IMGUI_API float         GetCursorPosX();                                                    // "
    function GetCursorPosX() { return exports.bind.GetCursorPosX(); }
    // IMGUI_API float         GetCursorPosY();                                                    // "
    function GetCursorPosY() { return exports.bind.GetCursorPosY(); }
    // IMGUI_API void          SetCursorPos(const ImVec2& local_pos);                              // "
    function SetCursorPos(local_pos) { exports.bind.SetCursorPos(local_pos); }
    // IMGUI_API void          SetCursorPosX(float x);                                             // "
    function SetCursorPosX(x) { exports.bind.SetCursorPosX(x); }
    // IMGUI_API void          SetCursorPosY(float y);                                             // "
    function SetCursorPosY(y) { exports.bind.SetCursorPosY(y); }
    // IMGUI_API ImVec2        GetCursorStartPos();                                                // initial cursor position
    function GetCursorStartPos(out = new ImVec2()) { return exports.bind.GetCursorStartPos(out); }
    // IMGUI_API ImVec2        GetCursorScreenPos();                                               // cursor position in absolute screen coordinates [0..io.DisplaySize] (useful to work with ImDrawList API)
    function GetCursorScreenPos(out = new ImVec2()) { return exports.bind.GetCursorScreenPos(out); }
    // IMGUI_API void          SetCursorScreenPos(const ImVec2& pos);                              // cursor position in absolute screen coordinates [0..io.DisplaySize]
    function SetCursorScreenPos(pos) { exports.bind.SetCursorScreenPos(pos); }
    // IMGUI_API void          AlignTextToFramePadding();                                          // vertically align/lower upcoming text to FramePadding.y so that it will aligns to upcoming widgets (call if you have text on a line before regular widgets)
    function AlignTextToFramePadding() { exports.bind.AlignTextToFramePadding(); }
    // IMGUI_API float         GetTextLineHeight();                                                // ~ FontSize
    function GetTextLineHeight() { return exports.bind.GetTextLineHeight(); }
    // IMGUI_API float         GetTextLineHeightWithSpacing();                                     // ~ FontSize + style.ItemSpacing.y (distance in pixels between 2 consecutive lines of text)
    function GetTextLineHeightWithSpacing() { return exports.bind.GetTextLineHeightWithSpacing(); }
    // IMGUI_API float         GetFrameHeight();                                                   // ~ FontSize + style.FramePadding.y * 2
    function GetFrameHeight() { return exports.bind.GetFrameHeight(); }
    // IMGUI_API float         GetFrameHeightWithSpacing();                                        // ~ FontSize + style.FramePadding.y * 2 + style.ItemSpacing.y (distance in pixels between 2 consecutive lines of framed widgets)
    function GetFrameHeightWithSpacing() { return exports.bind.GetFrameHeightWithSpacing(); }
    // Columns
    // You can also use SameLine(pos_x) for simplified columns. The columns API is still work-in-progress and rather lacking.
    // IMGUI_API void          Columns(int count = 1, const char* id = NULL, bool border = true);
    function Columns(count = 1, id = null, border = true) {
        id = id || "";
        exports.bind.Columns(count, id, border);
    }
    // IMGUI_API void          NextColumn();                                                       // next column, defaults to current row or next row if the current row is finished
    function NextColumn() { exports.bind.NextColumn(); }
    // IMGUI_API int           GetColumnIndex();                                                   // get current column index
    function GetColumnIndex() { return exports.bind.GetColumnIndex(); }
    // IMGUI_API float         GetColumnWidth(int column_index = -1);                              // get column width (in pixels). pass -1 to use current column
    function GetColumnWidth(column_index = -1) {
        return exports.bind.GetColumnWidth(column_index);
    }
    // IMGUI_API void          SetColumnWidth(int column_index, float width);                      // set column width (in pixels). pass -1 to use current column
    function SetColumnWidth(column_index, width) { exports.bind.SetColumnWidth(column_index, width); }
    // IMGUI_API float         GetColumnOffset(int column_index = -1);                             // get position of column line (in pixels, from the left side of the contents region). pass -1 to use current column, otherwise 0..GetColumnsCount() inclusive. column 0 is typically 0.0f
    function GetColumnOffset(column_index = -1) {
        return exports.bind.GetColumnOffset(column_index);
    }
    // IMGUI_API void          SetColumnOffset(int column_index, float offset_x);                  // set position of column line (in pixels, from the left side of the contents region). pass -1 to use current column
    function SetColumnOffset(column_index, offset_x) { exports.bind.SetColumnOffset(column_index, offset_x); }
    // IMGUI_API int           GetColumnsCount();
    function GetColumnsCount() { return exports.bind.GetColumnsCount(); }
    // ID scopes
    // If you are creating widgets in a loop you most likely want to push a unique identifier (e.g. object pointer, loop index) so ImGui can differentiate them.
    // You can also use the "##foobar" syntax within widget label to distinguish them from each others. Read "A primer on the use of labels/IDs" in the FAQ for more details.
    // IMGUI_API void          PushID(const char* str_id);                                         // push identifier into the ID stack. IDs are hash of the entire stack!
    // IMGUI_API void          PushID(const char* str_id_begin, const char* str_id_end);
    // IMGUI_API void          PushID(const void* ptr_id);
    // IMGUI_API void          PushID(int int_id);
    function PushID(id) { exports.bind.PushID(id); }
    // IMGUI_API void          PopID();
    function PopID() { exports.bind.PopID(); }
    // IMGUI_API ImGuiID       GetID(const char* str_id);                                          // calculate unique ID (hash of whole ID stack + given parameter). e.g. if you want to query into ImGuiStorage yourself
    // IMGUI_API ImGuiID       GetID(const char* str_id_begin, const char* str_id_end);
    // IMGUI_API ImGuiID       GetID(const void* ptr_id);
    function GetID(id) { return exports.bind.GetID(id); }
    // Widgets: Text
    // IMGUI_API void          TextUnformatted(const char* text, const char* text_end = NULL);               // raw text without formatting. Roughly equivalent to Text("%s", text) but: A) doesn't require null terminated string if 'text_end' is specified, B) it's faster, no memory copy is done, no buffer size limits, recommended for long chunks of text.
    function TextUnformatted(text, text_end = null) { exports.bind.TextUnformatted(text_end !== null ? text.substring(0, text_end) : text); }
    // IMGUI_API void          Text(const char* fmt, ...)                                     IM_FMTARGS(1); // simple formatted text
    // IMGUI_API void          TextV(const char* fmt, va_list args)                           IM_FMTLIST(1);
    function Text(fmt /*, ...args: any[]*/) { exports.bind.Text(fmt /*, ...args*/); }
    // IMGUI_API void          TextColored(const ImVec4& col, const char* fmt, ...)           IM_FMTARGS(2); // shortcut for PushStyleColor(ImGuiCol_Text, col); Text(fmt, ...); PopStyleColor();
    // IMGUI_API void          TextColoredV(const ImVec4& col, const char* fmt, va_list args) IM_FMTLIST(2);
    function TextColored(col, fmt /*, ...args: any[]*/) {
        exports.bind.TextColored((col instanceof ImColor) ? col.Value : col, fmt /*, ...args*/);
    }
    // IMGUI_API void          TextDisabled(const char* fmt, ...)                             IM_FMTARGS(1); // shortcut for PushStyleColor(ImGuiCol_Text, style.Colors[ImGuiCol_TextDisabled]); Text(fmt, ...); PopStyleColor();
    // IMGUI_API void          TextDisabledV(const char* fmt, va_list args)                   IM_FMTLIST(1);
    function TextDisabled(fmt /*, ...args: any[]*/) { exports.bind.TextDisabled(fmt /*, ...args*/); }
    // IMGUI_API void          TextWrapped(const char* fmt, ...)                              IM_FMTARGS(1); // shortcut for PushTextWrapPos(0.0f); Text(fmt, ...); PopTextWrapPos();. Note that this won't work on an auto-resizing window if there's no other widgets to extend the window width, yoy may need to set a size using SetNextWindowSize().
    // IMGUI_API void          TextWrappedV(const char* fmt, va_list args)                    IM_FMTLIST(1);
    function TextWrapped(fmt /*, ...args: any[]*/) { exports.bind.TextWrapped(fmt /*, ...args*/); }
    // IMGUI_API void          LabelText(const char* label, const char* fmt, ...)             IM_FMTARGS(2); // display text+label aligned the same way as value+label widgets
    // IMGUI_API void          LabelTextV(const char* label, const char* fmt, va_list args)   IM_FMTLIST(2);
    function LabelText(label, fmt /*, ...args: any[]*/) { exports.bind.LabelText(label, fmt /*, ...args*/); }
    // IMGUI_API void          BulletText(const char* fmt, ...)                               IM_FMTARGS(1); // shortcut for Bullet()+Text()
    // IMGUI_API void          BulletTextV(const char* fmt, va_list args)                     IM_FMTLIST(1);
    function BulletText(fmt /*, ...args: any[]*/) { exports.bind.BulletText(fmt /*, ...args*/); }
    // IMGUI_API void          Bullet();                                                                     // draw a small circle and keep the cursor on the same line. advance cursor x position by GetTreeNodeToLabelSpacing(), same distance that TreeNode() uses
    function Bullet() { exports.bind.Bullet(); }
    // Widgets: Main
    // IMGUI_API bool          Button(const char* label, const ImVec2& size = ImVec2(0,0));            // button
    function Button(label, size = ImVec2.ZERO) {
        return exports.bind.Button(label, size);
    }
    // IMGUI_API bool          SmallButton(const char* label);                                         // button with FramePadding=(0,0) to easily embed within text
    function SmallButton(label) { return exports.bind.SmallButton(label); }
    // IMGUI_API bool          ArrowButton(const char* str_id, ImGuiDir dir);                  // square button with an arrow shape
    function ArrowButton(str_id, dir) { return exports.bind.ArrowButton(str_id, dir); }
    // IMGUI_API bool          InvisibleButton(const char* str_id, const ImVec2& size);                // button behavior without the visuals, useful to build custom behaviors using the public api (along with IsItemActive, IsItemHovered, etc.)
    function InvisibleButton(str_id, size) {
        return exports.bind.InvisibleButton(str_id, size);
    }
    // IMGUI_API void          Image(ImTextureID user_texture_id, const ImVec2& size, const ImVec2& uv0 = ImVec2(0,0), const ImVec2& uv1 = ImVec2(1,1), const ImVec4& tint_col = ImVec4(1,1,1,1), const ImVec4& border_col = ImVec4(0,0,0,0));
    function Image(user_texture_id, size, uv0 = ImVec2.ZERO, uv1 = ImVec2.UNIT, tint_col = ImVec4.WHITE, border_col = ImVec4.ZERO) {
        exports.bind.Image(ImGuiContext.setTexture(user_texture_id), size, uv0, uv1, tint_col, border_col);
    }
    // IMGUI_API bool          ImageButton(ImTextureID user_texture_id, const ImVec2& size, const ImVec2& uv0 = ImVec2(0,0),  const ImVec2& uv1 = ImVec2(1,1), int frame_padding = -1, const ImVec4& bg_col = ImVec4(0,0,0,0), const ImVec4& tint_col = ImVec4(1,1,1,1));    // <0 frame_padding uses default frame padding settings. 0 for no padding
    function ImageButton(user_texture_id, size, uv0 = ImVec2.ZERO, uv1 = ImVec2.UNIT, frame_padding = -1, bg_col = ImVec4.ZERO, tint_col = ImVec4.WHITE) {
        return exports.bind.ImageButton(ImGuiContext.setTexture(user_texture_id), size, uv0, uv1, frame_padding, bg_col, tint_col);
    }
    // IMGUI_API bool          Checkbox(const char* label, bool* v);
    function Checkbox(label, v) {
        if (Array.isArray(v)) {
            return exports.bind.Checkbox(label, v);
        }
        else {
            const ref_v = [v()];
            const ret = exports.bind.Checkbox(label, ref_v);
            v(ref_v[0]);
            return ret;
        }
    }
    // IMGUI_API bool          CheckboxFlags(const char* label, unsigned int* flags, unsigned int flags_value);
    function CheckboxFlags(label, flags, flags_value) {
        if (Array.isArray(flags)) {
            return exports.bind.CheckboxFlags(label, flags, flags_value);
        }
        else {
            const ref_flags = [flags()];
            const ret = exports.bind.CheckboxFlags(label, ref_flags, flags_value);
            flags(ref_flags[0]);
            return ret;
        }
    }
    function RadioButton(label, ...args) {
        if (typeof (args[0]) === "boolean") {
            const active = args[0];
            return exports.bind.RadioButton_A(label, active);
        }
        else {
            const v = args[0];
            const v_button = args[1];
            const _v = Array.isArray(v) ? v : [v()];
            const ret = exports.bind.RadioButton_B(label, _v, v_button);
            if (!Array.isArray(v)) {
                v(_v[0]);
            }
            return ret;
        }
    }
    function PlotLines(label, ...args) {
        if (Array.isArray(args[0])) {
            const values = args[0];
            const values_getter = (data, idx) => values[idx * stride];
            const values_count = typeof (args[1]) === "number" ? args[1] : values.length;
            const values_offset = typeof (args[2]) === "number" ? args[2] : 0;
            const overlay_text = typeof (args[3]) === "string" ? args[3] : null;
            const scale_min = typeof (args[4]) === "number" ? args[4] : Number.MAX_VALUE;
            const scale_max = typeof (args[5]) === "number" ? args[5] : Number.MAX_VALUE;
            const graph_size = args[6] || ImVec2.ZERO;
            const stride = typeof (args[7]) === "number" ? args[7] : 1;
            exports.bind.PlotLines(label, values_getter, null, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size);
        }
        else {
            const values_getter = args[0];
            const data = args[1];
            const values_count = args[2];
            const values_offset = typeof (args[3]) === "number" ? args[3] : 0;
            const overlay_text = typeof (args[4]) === "string" ? args[4] : null;
            const scale_min = typeof (args[5]) === "number" ? args[5] : Number.MAX_VALUE;
            const scale_max = typeof (args[6]) === "number" ? args[6] : Number.MAX_VALUE;
            const graph_size = args[7] || ImVec2.ZERO;
            exports.bind.PlotLines(label, values_getter, data, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size);
        }
    }
    function PlotHistogram(label, ...args) {
        if (Array.isArray(args[0])) {
            const values = args[0];
            const values_getter = (data, idx) => values[idx * stride];
            const values_count = typeof (args[1]) === "number" ? args[1] : values.length;
            const values_offset = typeof (args[2]) === "number" ? args[2] : 0;
            const overlay_text = typeof (args[3]) === "string" ? args[3] : null;
            const scale_min = typeof (args[4]) === "number" ? args[4] : Number.MAX_VALUE;
            const scale_max = typeof (args[5]) === "number" ? args[5] : Number.MAX_VALUE;
            const graph_size = args[6] || ImVec2.ZERO;
            const stride = typeof (args[7]) === "number" ? args[7] : 1;
            exports.bind.PlotHistogram(label, values_getter, null, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size);
        }
        else {
            const values_getter = args[0];
            const data = args[1];
            const values_count = args[2];
            const values_offset = typeof (args[3]) === "number" ? args[3] : 0;
            const overlay_text = typeof (args[4]) === "string" ? args[4] : null;
            const scale_min = typeof (args[5]) === "number" ? args[5] : Number.MAX_VALUE;
            const scale_max = typeof (args[6]) === "number" ? args[6] : Number.MAX_VALUE;
            const graph_size = args[7] || ImVec2.ZERO;
            exports.bind.PlotHistogram(label, values_getter, data, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size);
        }
    }
    // IMGUI_API void          ProgressBar(float fraction, const ImVec2& size_arg = ImVec2(-1,0), const char* overlay = NULL);
    function ProgressBar(fraction, size_arg = new ImVec2(-1, 0), overlay = null) {
        exports.bind.ProgressBar(fraction, size_arg, overlay);
    }
    // Widgets: Combo Box
    // The new BeginCombo()/EndCombo() api allows you to manage your contents and selection state however you want it.
    // The old Combo() api are helpers over BeginCombo()/EndCombo() which are kept available for convenience purpose.
    // IMGUI_API bool          BeginCombo(const char* label, const char* preview_value, ImGuiComboFlags flags = 0);
    function BeginCombo(label, preview_value = null, flags = 0) {
        return exports.bind.BeginCombo(label, preview_value, flags);
    }
    // IMGUI_API void          EndCombo();
    function EndCombo() { exports.bind.EndCombo(); }
    function Combo(label, current_item, ...args) {
        let ret = false;
        const _current_item = Array.isArray(current_item) ? current_item : [current_item()];
        if (Array.isArray(args[0])) {
            const items = args[0];
            const items_count = typeof (args[1]) === "number" ? args[1] : items.length;
            const popup_max_height_in_items = typeof (args[2]) === "number" ? args[2] : -1;
            const items_getter = (data, idx, out_text) => { out_text[0] = items[idx]; return true; };
            ret = exports.bind.Combo(label, _current_item, items_getter, null, items_count, popup_max_height_in_items);
        }
        else if (typeof (args[0]) === "string") {
            const items_separated_by_zeros = args[0];
            const popup_max_height_in_items = typeof (args[1]) === "number" ? args[1] : -1;
            const items = items_separated_by_zeros.replace(/^\0+|\0+$/g, "").split("\0");
            const items_count = items.length;
            const items_getter = (data, idx, out_text) => { out_text[0] = items[idx]; return true; };
            ret = exports.bind.Combo(label, _current_item, items_getter, null, items_count, popup_max_height_in_items);
        }
        else {
            const items_getter = args[0];
            const data = args[1];
            const items_count = args[2];
            const popup_max_height_in_items = typeof (args[3]) === "number" ? args[3] : -1;
            ret = exports.bind.Combo(label, _current_item, items_getter, data, items_count, popup_max_height_in_items);
        }
        if (!Array.isArray(current_item)) {
            current_item(_current_item[0]);
        }
        return ret;
    }
    // Widgets: Drags (tip: ctrl+click on a drag box to input with keyboard. manually input values aren't clamped, can go off-bounds)
    // For all the Float2/Float3/Float4/Int2/Int3/Int4 versions of every functions, note that a 'float v[X]' function argument is the same as 'float* v', the array syntax is just a way to document the number of elements that are expected to be accessible. You can pass address of your first element out of a contiguous set, e.g. &myvector.x
    // IMGUI_API bool          DragFloat(const char* label, float* v, float v_speed = 1.0f, float v_min = 0.0f, float v_max = 0.0f, const char* display_format = "%.3f", float power = 1.0f);     // If v_min >= v_max we have no bound
    function DragFloat(label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, display_format = "%.3f", power = 1.0) {
        const _v = import_Scalar(v);
        const ret = exports.bind.DragFloat(label, _v, v_speed, v_min, v_max, display_format, power);
        export_Scalar(_v, v);
        return ret;
    }
    // IMGUI_API bool          DragFloat2(const char* label, float v[2], float v_speed = 1.0f, float v_min = 0.0f, float v_max = 0.0f, const char* display_format = "%.3f", float power = 1.0f);
    function DragFloat2(label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, display_format = "%.3f", power = 1.0) {
        const _v = import_Vector2(v);
        const ret = exports.bind.DragFloat2(label, _v, v_speed, v_min, v_max, display_format, power);
        export_Vector2(_v, v);
        return ret;
    }
    // IMGUI_API bool          DragFloat3(const char* label, float v[3], float v_speed = 1.0f, float v_min = 0.0f, float v_max = 0.0f, const char* display_format = "%.3f", float power = 1.0f);
    function DragFloat3(label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, display_format = "%.3f", power = 1.0) {
        const _v = import_Vector3(v);
        const ret = exports.bind.DragFloat3(label, _v, v_speed, v_min, v_max, display_format, power);
        export_Vector3(_v, v);
        return ret;
    }
    // IMGUI_API bool          DragFloat4(const char* label, float v[4], float v_speed = 1.0f, float v_min = 0.0f, float v_max = 0.0f, const char* display_format = "%.3f", float power = 1.0f);
    function DragFloat4(label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, display_format = "%.3f", power = 1.0) {
        const _v = import_Vector4(v);
        const ret = exports.bind.DragFloat4(label, _v, v_speed, v_min, v_max, display_format, power);
        export_Vector4(_v, v);
        return ret;
    }
    // IMGUI_API bool          DragFloatRange2(const char* label, float* v_current_min, float* v_current_max, float v_speed = 1.0f, float v_min = 0.0f, float v_max = 0.0f, const char* display_format = "%.3f", const char* display_format_max = NULL, float power = 1.0f);
    function DragFloatRange2(label, v_current_min, v_current_max, v_speed = 1.0, v_min = 0.0, v_max = 0.0, display_format = "%.3f", display_format_max = null, power = 1.0) {
        const _v_current_min = import_Scalar(v_current_min);
        const _v_current_max = import_Scalar(v_current_max);
        const ret = exports.bind.DragFloatRange2(label, _v_current_min, _v_current_max, v_speed, v_min, v_max, display_format, display_format_max, power);
        export_Scalar(_v_current_min, v_current_min);
        export_Scalar(_v_current_max, v_current_max);
        return ret;
    }
    // IMGUI_API bool          DragInt(const char* label, int* v, float v_speed = 1.0f, int v_min = 0, int v_max = 0, const char* display_format = "%d");                                       // If v_min >= v_max we have no bound
    function DragInt(label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d") {
        const _v = import_Scalar(v);
        const ret = exports.bind.DragInt(label, _v, v_speed, v_min, v_max, format);
        export_Scalar(_v, v);
        return ret;
    }
    // IMGUI_API bool          DragInt2(const char* label, int v[2], float v_speed = 1.0f, int v_min = 0, int v_max = 0, const char* format = "%d");
    function DragInt2(label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d") {
        const _v = import_Vector2(v);
        const ret = exports.bind.DragInt2(label, _v, v_speed, v_min, v_max, format);
        export_Vector2(_v, v);
        return ret;
    }
    // IMGUI_API bool          DragInt3(const char* label, int v[3], float v_speed = 1.0f, int v_min = 0, int v_max = 0, const char* format = "%d");
    function DragInt3(label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d") {
        const _v = import_Vector3(v);
        const ret = exports.bind.DragInt3(label, _v, v_speed, v_min, v_max, format);
        export_Vector3(_v, v);
        return ret;
    }
    // IMGUI_API bool          DragInt4(const char* label, int v[4], float v_speed = 1.0f, int v_min = 0, int v_max = 0, const char* format = "%d");
    function DragInt4(label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d") {
        const _v = import_Vector4(v);
        const ret = exports.bind.DragInt4(label, _v, v_speed, v_min, v_max, format);
        export_Vector4(_v, v);
        return ret;
    }
    // IMGUI_API bool          DragIntRange2(const char* label, int* v_current_min, int* v_current_max, float v_speed = 1.0f, int v_min = 0, int v_max = 0, const char* display_format = "%.0f", const char* display_format_max = NULL);
    function DragIntRange2(label, v_current_min, v_current_max, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d", format_max = null) {
        const _v_current_min = import_Scalar(v_current_min);
        const _v_current_max = import_Scalar(v_current_max);
        const ret = exports.bind.DragIntRange2(label, _v_current_min, _v_current_max, v_speed, v_min, v_max, format, format_max);
        export_Scalar(_v_current_min, v_current_min);
        export_Scalar(_v_current_max, v_current_max);
        return ret;
    }
    // IMGUI_API bool          DragScalar(const char* label, ImGuiDataType data_type, void* v, float v_speed, const void* v_min = NULL, const void* v_max = NULL, const char* format = NULL, float power = 1.0f);
    // IMGUI_API bool          DragScalarN(const char* label, ImGuiDataType data_type, void* v, int components, float v_speed, const void* v_min = NULL, const void* v_max = NULL, const char* format = NULL, float power = 1.0f);
    function DragScalar(label, v, v_speed, v_min = null, v_max = null, format = null, power = 1.0) {
        if (v instanceof Int8Array) {
            return exports.bind.DragScalar(label, exports.ImGuiDataType.S8, v, v_speed, v_min, v_max, format, power);
        }
        if (v instanceof Uint8Array) {
            return exports.bind.DragScalar(label, exports.ImGuiDataType.U8, v, v_speed, v_min, v_max, format, power);
        }
        if (v instanceof Int16Array) {
            return exports.bind.DragScalar(label, exports.ImGuiDataType.S16, v, v_speed, v_min, v_max, format, power);
        }
        if (v instanceof Uint16Array) {
            return exports.bind.DragScalar(label, exports.ImGuiDataType.U16, v, v_speed, v_min, v_max, format, power);
        }
        if (v instanceof Int32Array) {
            return exports.bind.DragScalar(label, exports.ImGuiDataType.S32, v, v_speed, v_min, v_max, format, power);
        }
        if (v instanceof Uint32Array) {
            return exports.bind.DragScalar(label, exports.ImGuiDataType.U32, v, v_speed, v_min, v_max, format, power);
        }
        // if (v instanceof Int64Array) { return bind.DragScalar(label, ImGuiDataType.S64, v, v_speed, v_min, v_max, format, power); }
        // if (v instanceof Uint64Array) { return bind.DragScalar(label, ImGuiDataType.U64, v, v_speed, v_min, v_max, format, power); }
        if (v instanceof Float32Array) {
            return exports.bind.DragScalar(label, exports.ImGuiDataType.Float, v, v_speed, v_min, v_max, format, power);
        }
        if (v instanceof Float64Array) {
            return exports.bind.DragScalar(label, exports.ImGuiDataType.Double, v, v_speed, v_min, v_max, format, power);
        }
        throw new Error();
    }
    // Widgets: Input with Keyboard
    // IMGUI_API bool          InputText(const char* label, char* buf, size_t buf_size, ImGuiInputTextFlags flags = 0, ImGuiInputTextCallback callback = NULL, void* user_data = NULL);
    function InputText(label, buf, buf_size = buf instanceof ImStringBuffer ? buf.size : ImGuiInputTextDefaultSize, flags = 0, callback = null, user_data = null) {
        const _callback = callback && ((data) => callback(new ImGuiInputTextCallbackData(data, user_data))) || null;
        if (Array.isArray(buf)) {
            return exports.bind.InputText(label, buf, buf_size, flags, _callback, null);
        }
        else if (buf instanceof ImStringBuffer) {
            const ref_buf = [buf.buffer];
            const _buf_size = Math.min(buf_size, buf.size);
            const ret = exports.bind.InputText(label, ref_buf, _buf_size, flags, _callback, null);
            buf.buffer = ref_buf[0];
            return ret;
        }
        else {
            const ref_buf = [buf()];
            const ret = exports.bind.InputText(label, ref_buf, buf_size, flags, _callback, null);
            buf(ref_buf[0]);
            return ret;
        }
    }
    // IMGUI_API bool          InputTextWithHint(const char* label, const char* hint, char* buf, size_t buf_size, ImGuiInputTextFlags flags = 0, ImGuiInputTextCallback callback = NULL, void* user_data = NULL);
    function InputTextWithHint(label, hint, buf, buf_size = buf instanceof ImStringBuffer ? buf.size : ImGuiInputTextDefaultSize, flags = 0, callback = null, user_data = null) {
        const _callback = callback && ((data) => callback(new ImGuiInputTextCallbackData(data, user_data))) || null;
        if (Array.isArray(buf)) {
            return exports.bind.InputTextWithHint(label, hint, buf, buf_size, flags, _callback, null);
        }
        else if (buf instanceof ImStringBuffer) {
            const ref_buf = [buf.buffer];
            const _buf_size = Math.min(buf_size, buf.size);
            const ret = exports.bind.InputTextWithHint(label, hint, ref_buf, _buf_size, flags, _callback, null);
            buf.buffer = ref_buf[0];
            return ret;
        }
        else {
            const ref_buf = [buf()];
            const ret = exports.bind.InputTextWithHint(label, hint, ref_buf, buf_size, flags, _callback, null);
            buf(ref_buf[0]);
            return ret;
        }
    }
    // IMGUI_API bool          InputTextMultiline(const char* label, char* buf, size_t buf_size, const ImVec2& size = ImVec2(0,0), ImGuiInputTextFlags flags = 0, ImGuiInputTextCallback callback = NULL, void* user_data = NULL);
    function InputTextMultiline(label, buf, buf_size = buf instanceof ImStringBuffer ? buf.size : ImGuiInputTextDefaultSize, size = ImVec2.ZERO, flags = 0, callback = null, user_data = null) {
        const _callback = callback && ((data) => callback(new ImGuiInputTextCallbackData(data, user_data))) || null;
        if (Array.isArray(buf)) {
            return exports.bind.InputTextMultiline(label, buf, buf_size, size, flags, _callback, null);
        }
        else if (buf instanceof ImStringBuffer) {
            const ref_buf = [buf.buffer];
            const _buf_size = Math.min(buf_size, buf.size);
            const ret = exports.bind.InputTextMultiline(label, ref_buf, _buf_size, size, flags, _callback, null);
            buf.buffer = ref_buf[0];
            return ret;
        }
        else {
            const ref_buf = [buf()];
            const ret = exports.bind.InputTextMultiline(label, ref_buf, buf_size, size, flags, _callback, null);
            buf(ref_buf[0]);
            return ret;
        }
    }
    // IMGUI_API bool          InputFloat(const char* label, float* v, float step = 0.0f, float step_fast = 0.0f, const char* format = "%.3f", ImGuiInputTextFlags extra_flags = 0);
    function InputFloat(label, v, step = 0.0, step_fast = 0.0, format = "%.3f", extra_flags = 0) {
        const _v = import_Scalar(v);
        const ret = exports.bind.InputFloat(label, _v, step, step_fast, format, extra_flags);
        export_Scalar(_v, v);
        return ret;
    }
    // IMGUI_API bool          InputFloat2(const char* label, float v[2], const char* format = "%.3f", ImGuiInputTextFlags extra_flags = 0);
    function InputFloat2(label, v, format = "%.3f", extra_flags = 0) {
        const _v = import_Vector2(v);
        const ret = exports.bind.InputFloat2(label, _v, format, extra_flags);
        export_Vector2(_v, v);
        return ret;
    }
    // IMGUI_API bool          InputFloat3(const char* label, float v[3], const char* format = "%.3f", ImGuiInputTextFlags extra_flags = 0);
    function InputFloat3(label, v, format = "%.3f", extra_flags = 0) {
        const _v = import_Vector3(v);
        const ret = exports.bind.InputFloat3(label, _v, format, extra_flags);
        export_Vector3(_v, v);
        return ret;
    }
    // IMGUI_API bool          InputFloat4(const char* label, float v[4], const char* format = "%.3f", ImGuiInputTextFlags extra_flags = 0);
    function InputFloat4(label, v, format = "%.3f", extra_flags = 0) {
        const _v = import_Vector4(v);
        const ret = exports.bind.InputFloat4(label, _v, format, extra_flags);
        export_Vector4(_v, v);
        return ret;
    }
    // IMGUI_API bool          InputInt(const char* label, int* v, int step = 1, int step_fast = 100, ImGuiInputTextFlags extra_flags = 0);
    function InputInt(label, v, step = 1, step_fast = 100, extra_flags = 0) {
        const _v = import_Scalar(v);
        const ret = exports.bind.InputInt(label, _v, step, step_fast, extra_flags);
        export_Scalar(_v, v);
        return ret;
    }
    // IMGUI_API bool          InputInt2(const char* label, int v[2], ImGuiInputTextFlags extra_flags = 0);
    function InputInt2(label, v, extra_flags = 0) {
        const _v = import_Vector2(v);
        const ret = exports.bind.InputInt2(label, _v, extra_flags);
        export_Vector2(_v, v);
        return ret;
    }
    // IMGUI_API bool          InputInt3(const char* label, int v[3], ImGuiInputTextFlags extra_flags = 0);
    function InputInt3(label, v, extra_flags = 0) {
        const _v = import_Vector3(v);
        const ret = exports.bind.InputInt3(label, _v, extra_flags);
        export_Vector3(_v, v);
        return ret;
    }
    // IMGUI_API bool          InputInt4(const char* label, int v[4], ImGuiInputTextFlags extra_flags = 0);
    function InputInt4(label, v, extra_flags = 0) {
        const _v = import_Vector4(v);
        const ret = exports.bind.InputInt4(label, _v, extra_flags);
        export_Vector4(_v, v);
        return ret;
    }
    // IMGUI_API bool          InputDouble(const char* label, float* v, float step = 0.0f, float step_fast = 0.0f, const char* format = "%.6f", ImGuiInputTextFlags extra_flags = 0);
    function InputDouble(label, v, step = 0.0, step_fast = 0.0, format = "%.6f", extra_flags = 0) {
        const _v = import_Scalar(v);
        const ret = exports.bind.InputDouble(label, _v, step, step_fast, format, extra_flags);
        export_Scalar(_v, v);
        return ret;
    }
    // IMGUI_API bool          InputScalar(const char* label, ImGuiDataType data_type, void* v, const void* step = NULL, const void* step_fast = NULL, const char* format = NULL, ImGuiInputTextFlags extra_flags = 0);
    // IMGUI_API bool          InputScalarN(const char* label, ImGuiDataType data_type, void* v, int components, const void* step = NULL, const void* step_fast = NULL, const char* format = NULL, ImGuiInputTextFlags extra_flags = 0);
    function InputScalar(label, v, step = null, step_fast = null, format = null, extra_flags = 0) {
        if (v instanceof Int8Array) {
            return exports.bind.InputScalar(label, exports.ImGuiDataType.S8, v, step, step_fast, format, extra_flags);
        }
        if (v instanceof Uint8Array) {
            return exports.bind.InputScalar(label, exports.ImGuiDataType.U8, v, step, step_fast, format, extra_flags);
        }
        if (v instanceof Int16Array) {
            return exports.bind.InputScalar(label, exports.ImGuiDataType.S16, v, step, step_fast, format, extra_flags);
        }
        if (v instanceof Uint16Array) {
            return exports.bind.InputScalar(label, exports.ImGuiDataType.U16, v, step, step_fast, format, extra_flags);
        }
        if (v instanceof Int32Array) {
            return exports.bind.InputScalar(label, exports.ImGuiDataType.S32, v, step, step_fast, format, extra_flags);
        }
        if (v instanceof Uint32Array) {
            return exports.bind.InputScalar(label, exports.ImGuiDataType.U32, v, step, step_fast, format, extra_flags);
        }
        // if (v instanceof Int64Array) { return bind.InputScalar(label, ImGuiDataType.S64, v, step, step_fast, format, extra_flags); }
        // if (v instanceof Uint64Array) { return bind.InputScalar(label, ImGuiDataType.U64, v, step, step_fast, format, extra_flags); }
        if (v instanceof Float32Array) {
            return exports.bind.InputScalar(label, exports.ImGuiDataType.Float, v, step, step_fast, format, extra_flags);
        }
        if (v instanceof Float64Array) {
            return exports.bind.InputScalar(label, exports.ImGuiDataType.Double, v, step, step_fast, format, extra_flags);
        }
        throw new Error();
    }
    // Widgets: Sliders (tip: ctrl+click on a slider to input with keyboard. manually input values aren't clamped, can go off-bounds)
    // IMGUI_API bool          SliderFloat(const char* label, float* v, float v_min, float v_max, const char* format = "%.3f", float power = 1.0f);     // adjust format to decorate the value with a prefix or a suffix for in-slider labels or unit display. Use power!=1.0 for logarithmic sliders
    function SliderFloat(label, v, v_min, v_max, format = "%.3f", power = 1.0) {
        const _v = import_Scalar(v);
        const ret = exports.bind.SliderFloat(label, _v, v_min, v_max, format, power);
        export_Scalar(_v, v);
        return ret;
    }
    // IMGUI_API bool          SliderFloat2(const char* label, float v[2], float v_min, float v_max, const char* format = "%.3f", float power = 1.0f);
    function SliderFloat2(label, v, v_min, v_max, format = "%.3f", power = 1.0) {
        const _v = import_Vector2(v);
        const ret = exports.bind.SliderFloat2(label, _v, v_min, v_max, format, power);
        export_Vector2(_v, v);
        return ret;
    }
    // IMGUI_API bool          SliderFloat3(const char* label, float v[3], float v_min, float v_max, const char* format = "%.3f", float power = 1.0f);
    function SliderFloat3(label, v, v_min, v_max, format = "%.3f", power = 1.0) {
        const _v = import_Vector3(v);
        const ret = exports.bind.SliderFloat3(label, _v, v_min, v_max, format, power);
        export_Vector3(_v, v);
        return ret;
    }
    // IMGUI_API bool          SliderFloat4(const char* label, float v[4], float v_min, float v_max, const char* format = "%.3f", float power = 1.0f);
    function SliderFloat4(label, v, v_min, v_max, format = "%.3f", power = 1.0) {
        const _v = import_Vector4(v);
        const ret = exports.bind.SliderFloat4(label, _v, v_min, v_max, format, power);
        export_Vector4(_v, v);
        return ret;
    }
    // IMGUI_API bool          SliderAngle(const char* label, float* v_rad, float v_degrees_min = -360.0f, float v_degrees_max = +360.0f);
    function SliderAngle(label, v_rad, v_degrees_min = -360.0, v_degrees_max = +360.0) {
        const _v_rad = import_Scalar(v_rad);
        const ret = exports.bind.SliderAngle(label, _v_rad, v_degrees_min, v_degrees_max);
        export_Scalar(_v_rad, v_rad);
        return ret;
    }
    function SliderAngle3(label, v_rad, v_degrees_min = -360.0, v_degrees_max = +360.0) {
        const _v_rad = import_Vector3(v_rad);
        _v_rad[0] = Math.floor(_v_rad[0] * 180 / Math.PI);
        _v_rad[1] = Math.floor(_v_rad[1] * 180 / Math.PI);
        _v_rad[2] = Math.floor(_v_rad[2] * 180 / Math.PI);
        const ret = exports.bind.SliderInt3(label, _v_rad, v_degrees_min, v_degrees_max, "%d deg");
        _v_rad[0] = _v_rad[0] * Math.PI / 180;
        _v_rad[1] = _v_rad[1] * Math.PI / 180;
        _v_rad[2] = _v_rad[2] * Math.PI / 180;
        export_Vector3(_v_rad, v_rad);
        return ret;
    }
    // IMGUI_API bool          SliderInt(const char* label, int* v, int v_min, int v_max, const char* format = "%d");
    function SliderInt(label, v, v_min, v_max, format = "%d") {
        const _v = import_Scalar(v);
        const ret = exports.bind.SliderInt(label, _v, v_min, v_max, format);
        export_Scalar(_v, v);
        return ret;
    }
    // IMGUI_API bool          SliderInt2(const char* label, int v[2], int v_min, int v_max, const char* format = "%d");
    function SliderInt2(label, v, v_min, v_max, format = "%d") {
        const _v = import_Vector2(v);
        const ret = exports.bind.SliderInt2(label, _v, v_min, v_max, format);
        export_Vector2(_v, v);
        return ret;
    }
    // IMGUI_API bool          SliderInt3(const char* label, int v[3], int v_min, int v_max, const char* format = "%d");
    function SliderInt3(label, v, v_min, v_max, format = "%d") {
        const _v = import_Vector3(v);
        const ret = exports.bind.SliderInt3(label, _v, v_min, v_max, format);
        export_Vector3(_v, v);
        return ret;
    }
    // IMGUI_API bool          SliderInt4(const char* label, int v[4], int v_min, int v_max, const char* format = "%d");
    function SliderInt4(label, v, v_min, v_max, format = "%d") {
        const _v = import_Vector4(v);
        const ret = exports.bind.SliderInt4(label, _v, v_min, v_max, format);
        export_Vector4(_v, v);
        return ret;
    }
    // IMGUI_API bool          SliderScalar(const char* label, ImGuiDataType data_type, void* v, const void* v_min, const void* v_max, const char* format = NULL, float power = 1.0f);
    // IMGUI_API bool          SliderScalarN(const char* label, ImGuiDataType data_type, void* v, int components, const void* v_min, const void* v_max, const char* format = NULL, float power = 1.0f);
    function SliderScalar(label, v, v_min, v_max, format = null, power = 1.0) {
        if (v instanceof Int8Array) {
            return exports.bind.SliderScalar(label, exports.ImGuiDataType.S8, v, v_min, v_max, format, power);
        }
        if (v instanceof Uint8Array) {
            return exports.bind.SliderScalar(label, exports.ImGuiDataType.U8, v, v_min, v_max, format, power);
        }
        if (v instanceof Int16Array) {
            return exports.bind.SliderScalar(label, exports.ImGuiDataType.S16, v, v_min, v_max, format, power);
        }
        if (v instanceof Uint16Array) {
            return exports.bind.SliderScalar(label, exports.ImGuiDataType.U16, v, v_min, v_max, format, power);
        }
        if (v instanceof Int32Array) {
            return exports.bind.SliderScalar(label, exports.ImGuiDataType.S32, v, v_min, v_max, format, power);
        }
        if (v instanceof Uint32Array) {
            return exports.bind.SliderScalar(label, exports.ImGuiDataType.U32, v, v_min, v_max, format, power);
        }
        // if (v instanceof Int64Array) { return bind.SliderScalar(label, ImGuiDataType.S64, v, v_min, v_max, format, power); }
        // if (v instanceof Uint64Array) { return bind.SliderScalar(label, ImGuiDataType.U64, v, v_min, v_max, format, power); }
        if (v instanceof Float32Array) {
            return exports.bind.SliderScalar(label, exports.ImGuiDataType.Float, v, v_min, v_max, format, power);
        }
        if (v instanceof Float64Array) {
            return exports.bind.SliderScalar(label, exports.ImGuiDataType.Double, v, v_min, v_max, format, power);
        }
        throw new Error();
    }
    // IMGUI_API bool          VSliderFloat(const char* label, const ImVec2& size, float* v, float v_min, float v_max, const char* format = "%.3f", float power = 1.0f);
    function VSliderFloat(label, size, v, v_min, v_max, format = "%.3f", power = 1.0) {
        const _v = import_Scalar(v);
        const ret = exports.bind.VSliderFloat(label, size, _v, v_min, v_max, format, power);
        export_Scalar(_v, v);
        return ret;
    }
    // IMGUI_API bool          VSliderInt(const char* label, const ImVec2& size, int* v, int v_min, int v_max, const char* format = "%d");
    function VSliderInt(label, size, v, v_min, v_max, format = "%d") {
        const _v = import_Scalar(v);
        const ret = exports.bind.VSliderInt(label, size, _v, v_min, v_max, format);
        export_Scalar(_v, v);
        return ret;
    }
    // IMGUI_API bool          VSliderScalar(const char* label, const ImVec2& size, ImGuiDataType data_type, void* v, const void* v_min, const void* v_max, const char* format = NULL, float power = 1.0f);
    function VSliderScalar(label, size, data_type, v, v_min, v_max, format = null, power = 1.0) {
        if (v instanceof Int8Array) {
            return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.S8, v, v_min, v_max, format, power);
        }
        if (v instanceof Uint8Array) {
            return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.U8, v, v_min, v_max, format, power);
        }
        if (v instanceof Int16Array) {
            return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.S16, v, v_min, v_max, format, power);
        }
        if (v instanceof Uint16Array) {
            return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.U16, v, v_min, v_max, format, power);
        }
        if (v instanceof Int32Array) {
            return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.S32, v, v_min, v_max, format, power);
        }
        if (v instanceof Uint32Array) {
            return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.U32, v, v_min, v_max, format, power);
        }
        // if (v instanceof Int64Array) { return bind.VSliderScalar(label, size, ImGuiDataType.S64, v, v_min, v_max, format, power); }
        // if (v instanceof Uint64Array) { return bind.VSliderScalar(label, size, ImGuiDataType.U64, v, v_min, v_max, format, power); }
        if (v instanceof Float32Array) {
            return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.Float, v, v_min, v_max, format, power);
        }
        if (v instanceof Float64Array) {
            return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.Double, v, v_min, v_max, format, power);
        }
        throw new Error();
    }
    // Widgets: Color Editor/Picker (tip: the ColorEdit* functions have a little colored preview square that can be left-clicked to open a picker, and right-clicked to open an option menu.)
    // Note that a 'float v[X]' function argument is the same as 'float* v', the array syntax is just a way to document the number of elements that are expected to be accessible. You can the pass the address of a first float element out of a contiguous structure, e.g. &myvector.x
    // IMGUI_API bool          ColorEdit3(const char* label, float col[3], ImGuiColorEditFlags flags = 0);
    function ColorEdit3(label, col, flags = 0) {
        const _col = import_Color3(col);
        const ret = exports.bind.ColorEdit3(label, _col, flags);
        export_Color3(_col, col);
        return ret;
    }
    // IMGUI_API bool          ColorEdit4(const char* label, float col[4], ImGuiColorEditFlags flags = 0);
    function ColorEdit4(label, col, flags = 0) {
        const _col = import_Color4(col);
        const ret = exports.bind.ColorEdit4(label, _col, flags);
        export_Color4(_col, col);
        return ret;
    }
    // IMGUI_API bool          ColorPicker3(const char* label, float col[3], ImGuiColorEditFlags flags = 0);
    function ColorPicker3(label, col, flags = 0) {
        const _col = import_Color3(col);
        const ret = exports.bind.ColorPicker3(label, _col, flags);
        export_Color3(_col, col);
        return ret;
    }
    // IMGUI_API bool          ColorPicker4(const char* label, float col[4], ImGuiColorEditFlags flags = 0, const float* ref_col = NULL);
    function ColorPicker4(label, col, flags = 0, ref_col = null) {
        const _col = import_Color4(col);
        const _ref_col = ref_col ? import_Color4(ref_col) : null;
        const ret = exports.bind.ColorPicker4(label, _col, flags, _ref_col);
        export_Color4(_col, col);
        if (_ref_col && ref_col) {
            export_Color4(_ref_col, ref_col);
        }
        return ret;
    }
    // IMGUI_API bool          ColorButton(const char* desc_id, const ImVec4& col, ImGuiColorEditFlags flags = 0, ImVec2 size = ImVec2(0,0));  // display a colored square/button, hover for details, return true when pressed.
    function ColorButton(desc_id, col, flags = 0, size = ImVec2.ZERO) {
        return exports.bind.ColorButton(desc_id, col, flags, size);
    }
    // IMGUI_API void          SetColorEditOptions(ImGuiColorEditFlags flags);                         // initialize current options (generally on application startup) if you want to select a default format, picker type, etc. User will be able to change many settings, unless you pass the _NoOptions flag to your calls.
    function SetColorEditOptions(flags) {
        exports.bind.SetColorEditOptions(flags);
    }
    function TreeNode(...args) {
        if (typeof (args[0]) === "string") {
            if (args.length === 1) {
                const label = args[0];
                return exports.bind.TreeNode_A(label);
            }
            else {
                const str_id = args[0];
                const fmt = args[1];
                return exports.bind.TreeNode_B(str_id, fmt);
            }
        }
        else {
            const ptr_id = args[0];
            const fmt = args[1];
            return exports.bind.TreeNode_C(ptr_id, fmt);
        }
    }
    function TreeNodeEx(...args) {
        if (typeof (args[0]) === "string") {
            if (args.length < 3) {
                const label = args[0];
                const flags = args[1] || 0;
                return exports.bind.TreeNodeEx_A(label, flags);
            }
            else {
                const str_id = args[0];
                const flags = args[1];
                const fmt = args[2];
                return exports.bind.TreeNodeEx_B(str_id, flags, fmt);
            }
        }
        else {
            const ptr_id = args[0];
            const flags = args[1];
            const fmt = args[2];
            return exports.bind.TreeNodeEx_C(ptr_id, flags, fmt);
        }
    }
    function TreePush(...args) {
        if (typeof (args[0]) === "string") {
            const str_id = args[0];
            exports.bind.TreePush_A(str_id);
        }
        else {
            const ptr_id = args[0];
            exports.bind.TreePush_B(ptr_id);
        }
    }
    // IMGUI_API void          TreePop();                                                              // ~ Unindent()+PopId()
    function TreePop() { exports.bind.TreePop(); }
    // IMGUI_API void          TreeAdvanceToLabelPos();                                                // advance cursor x position by GetTreeNodeToLabelSpacing()
    function TreeAdvanceToLabelPos() { exports.bind.TreeAdvanceToLabelPos(); }
    // IMGUI_API float         GetTreeNodeToLabelSpacing();                                            // horizontal distance preceding label when using TreeNode*() or Bullet() == (g.FontSize + style.FramePadding.x*2) for a regular unframed TreeNode
    function GetTreeNodeToLabelSpacing() { return exports.bind.GetTreeNodeToLabelSpacing(); }
    function CollapsingHeader(label, ...args) {
        if (args.length === 0) {
            return exports.bind.CollapsingHeader_A(label, 0);
        }
        else {
            if (typeof (args[0]) === "number") {
                const flags = args[0];
                return exports.bind.CollapsingHeader_A(label, flags);
            }
            else {
                const p_open = args[0];
                const flags = args[1] || 0;
                const ref_open = Array.isArray(p_open) ? p_open : [p_open()];
                const ret = exports.bind.CollapsingHeader_B(label, ref_open, flags);
                if (!Array.isArray(p_open)) {
                    p_open(ref_open[0]);
                }
                return ret;
            }
        }
    }
    // IMGUI_API void          SetNextItemOpen(bool is_open, ImGuiCond cond = 0);                  // set next TreeNode/CollapsingHeader open state.
    function SetNextItemOpen(is_open, cond = 0) {
        exports.bind.SetNextItemOpen(is_open, cond);
    }
    function Selectable(label, ...args) {
        if (args.length === 0) {
            return exports.bind.Selectable_A(label, false, 0, ImVec2.ZERO);
        }
        else {
            if (typeof (args[0]) === "boolean") {
                const selected = args[0];
                const flags = args[1] || 0;
                const size = args[2] || ImVec2.ZERO;
                return exports.bind.Selectable_A(label, selected, flags, size);
            }
            else {
                const p_selected = args[0];
                const flags = args[1] || 0;
                const size = args[2] || ImVec2.ZERO;
                const ref_selected = Array.isArray(p_selected) ? p_selected : [p_selected()];
                const ret = exports.bind.Selectable_B(label, ref_selected, flags, size);
                if (!Array.isArray(p_selected)) {
                    p_selected(ref_selected[0]);
                }
                return ret;
            }
        }
    }
    function ListBox(label, current_item, ...args) {
        let ret = false;
        const _current_item = Array.isArray(current_item) ? current_item : [current_item()];
        if (Array.isArray(args[0])) {
            const items = args[0];
            const items_count = typeof (args[1]) === "number" ? args[1] : items.length;
            const height_in_items = typeof (args[2]) === "number" ? args[2] : -1;
            ret = exports.bind.ListBox_A(label, _current_item, items, items_count, height_in_items);
        }
        else {
            const items_getter = args[0];
            const data = args[1];
            const items_count = args[2];
            const height_in_items = typeof (args[3]) === "number" ? args[3] : -1;
            ret = exports.bind.ListBox_B(label, _current_item, items_getter, data, items_count, height_in_items);
        }
        if (!Array.isArray(current_item)) {
            current_item(_current_item[0]);
        }
        return ret;
    }
    function ListBoxHeader(label, ...args) {
        if (typeof (args[0]) === "object") {
            const size = args[0];
            return exports.bind.ListBoxHeader_A(label, size);
        }
        else {
            const items_count = args[0];
            const height_in_items = typeof (args[1]) === "number" ? args[1] : -1;
            return exports.bind.ListBoxHeader_B(label, items_count, height_in_items);
        }
    }
    // IMGUI_API void          ListBoxFooter();                                                        // terminate the scrolling region
    function ListBoxFooter() {
        exports.bind.ListBoxFooter();
    }
    function Value(prefix, ...args) {
        if (typeof (args[0]) === "boolean") {
            exports.bind.Value_A(prefix, args[0]);
        }
        else if (typeof (args[0]) === "number") {
            if (Number.isInteger(args[0])) {
                exports.bind.Value_B(prefix, args[0]);
            }
            else {
                exports.bind.Value_D(prefix, args[0], typeof (args[1]) === "string" ? args[1] : null);
            }
        }
        else {
            exports.bind.Text(prefix + String(args[0]));
        }
    }
    // Tooltips
    // IMGUI_API void          BeginTooltip();                                                     // begin/append a tooltip window. to create full-featured tooltip (with any kind of contents).
    function BeginTooltip() { exports.bind.BeginTooltip(); }
    // IMGUI_API void          EndTooltip();
    function EndTooltip() { exports.bind.EndTooltip(); }
    // IMGUI_API void          SetTooltip(const char* fmt, ...) IM_FMTARGS(1);                     // set text tooltip under mouse-cursor, typically use with ImGui::IsItemHovered(). overidde any previous call to SetTooltip().
    // IMGUI_API void          SetTooltipV(const char* fmt, va_list args) IM_FMTLIST(1);
    function SetTooltip(fmt) {
        exports.bind.SetTooltip(fmt);
    }
    // Menus
    // IMGUI_API bool          BeginMainMenuBar();                                                 // create and append to a full screen menu-bar. only call EndMainMenuBar() if this returns true!
    function BeginMainMenuBar() { return exports.bind.BeginMainMenuBar(); }
    // IMGUI_API void          EndMainMenuBar();
    function EndMainMenuBar() { exports.bind.EndMainMenuBar(); }
    // IMGUI_API bool          BeginMenuBar();                                                     // append to menu-bar of current window (requires ImGuiWindowFlags_MenuBar flag set on parent window). only call EndMenuBar() if this returns true!
    function BeginMenuBar() { return exports.bind.BeginMenuBar(); }
    // IMGUI_API void          EndMenuBar();
    function EndMenuBar() { exports.bind.EndMenuBar(); }
    // IMGUI_API bool          BeginMenu(const char* label, bool enabled = true);                  // create a sub-menu entry. only call EndMenu() if this returns true!
    function BeginMenu(label, enabled = true) { return exports.bind.BeginMenu(label, enabled); }
    // IMGUI_API void          EndMenu();
    function EndMenu() { exports.bind.EndMenu(); }
    function MenuItem(label, ...args) {
        if (args.length === 0) {
            return exports.bind.MenuItem_A(label, null, false, true);
        }
        else if (args.length === 1) {
            const shortcut = args[0];
            return exports.bind.MenuItem_A(label, shortcut, false, true);
        }
        else {
            const shortcut = args[0];
            if (typeof (args[1]) === "boolean") {
                const selected = args[1];
                const enabled = typeof (args[2]) === "boolean" ? args[2] : true;
                return exports.bind.MenuItem_A(label, shortcut, selected, enabled);
            }
            else {
                const p_selected = args[1];
                const enabled = typeof (args[2]) === "boolean" ? args[2] : true;
                const ref_selected = Array.isArray(p_selected) ? p_selected : [p_selected()];
                const ret = exports.bind.MenuItem_B(label, shortcut, ref_selected, enabled);
                if (!Array.isArray(p_selected)) {
                    p_selected(ref_selected[0]);
                }
                return ret;
            }
        }
    }
    // Popups
    // IMGUI_API void          OpenPopup(const char* str_id);                                      // call to mark popup as open (don't call every frame!). popups are closed when user click outside, or if CloseCurrentPopup() is called within a BeginPopup()/EndPopup() block. By default, Selectable()/MenuItem() are calling CloseCurrentPopup(). Popup identifiers are relative to the current ID-stack (so OpenPopup and BeginPopup needs to be at the same level).
    function OpenPopup(str_id) { exports.bind.OpenPopup(str_id); }
    // IMGUI_API bool          OpenPopupOnItemClick(const char* str_id = NULL, int mouse_button = 1);                                  // helper to open popup when clicked on last item. return true when just opened.
    function OpenPopupOnItemClick(str_id = null, mouse_button = 1) {
        return exports.bind.OpenPopupOnItemClick(str_id, mouse_button);
    }
    // IMGUI_API bool          BeginPopup(const char* str_id);                                     // return true if the popup is open, and you can start outputting to it. only call EndPopup() if BeginPopup() returned true!
    function BeginPopup(str_id) { return exports.bind.BeginPopup(str_id); }
    // IMGUI_API bool          BeginPopupModal(const char* name, bool* p_open = NULL, ImGuiWindowFlags extra_flags = 0);               // modal dialog (block interactions behind the modal window, can't close the modal window by clicking outside)
    function BeginPopupModal(str_id = "", p_open = null, extra_flags = 0) {
        if (Array.isArray(p_open)) {
            return exports.bind.BeginPopupModal(str_id, p_open, extra_flags);
        }
        else if (typeof (p_open) === "function") {
            const _p_open = [p_open()];
            const ret = exports.bind.BeginPopupModal(str_id, _p_open, extra_flags);
            p_open(_p_open[0]);
            return ret;
        }
        else {
            return exports.bind.BeginPopupModal(str_id, null, extra_flags);
        }
    }
    // IMGUI_API bool          BeginPopupContextItem(const char* str_id = NULL, int mouse_button = 1);                                 // helper to open and begin popup when clicked on last item. if you can pass a NULL str_id only if the previous item had an id. If you want to use that on a non-interactive item such as Text() you need to pass in an explicit ID here. read comments in .cpp!
    function BeginPopupContextItem(str_id = null, mouse_button = 1) {
        return exports.bind.BeginPopupContextItem(str_id, mouse_button);
    }
    // IMGUI_API bool          BeginPopupContextWindow(const char* str_id = NULL, int mouse_button = 1, bool also_over_items = true);  // helper to open and begin popup when clicked on current window.
    function BeginPopupContextWindow(str_id = null, mouse_button = 1, also_over_items = true) {
        return exports.bind.BeginPopupContextWindow(str_id, mouse_button, also_over_items);
    }
    // IMGUI_API bool          BeginPopupContextVoid(const char* str_id = NULL, int mouse_button = 1);                                 // helper to open and begin popup when clicked in void (where there are no imgui windows).
    function BeginPopupContextVoid(str_id = null, mouse_button = 1) {
        return exports.bind.BeginPopupContextVoid(str_id, mouse_button);
    }
    // IMGUI_API void          EndPopup();
    function EndPopup() { exports.bind.EndPopup(); }
    // IMGUI_API bool          IsPopupOpen(const char* str_id);                                    // return true if the popup is open
    function IsPopupOpen(str_id) { return exports.bind.IsPopupOpen(str_id); }
    // IMGUI_API void          CloseCurrentPopup();                                                // close the popup we have begin-ed into. clicking on a MenuItem or Selectable automatically close the current popup.
    function CloseCurrentPopup() { exports.bind.CloseCurrentPopup(); }
    // Tab Bars, Tabs
    // [BETA API] API may evolve!
    // IMGUI_API bool          BeginTabBar(const char* str_id, ImGuiTabBarFlags flags = 0);        // create and append into a TabBar
    function BeginTabBar(str_id, flags = 0) { return exports.bind.BeginTabBar(str_id, flags); }
    // IMGUI_API void          EndTabBar();                                                        // only call EndTabBar() if BeginTabBar() returns true!
    function EndTabBar() { exports.bind.EndTabBar(); }
    // IMGUI_API bool          BeginTabItem(const char* label, bool* p_open = NULL, ImGuiTabItemFlags flags = 0);// create a Tab. Returns true if the Tab is selected.
    function BeginTabItem(label, p_open = null, flags = 0) {
        // return bind.BeginTabItem(label, p_open, flags);
        if (p_open === null) {
            return exports.bind.BeginTabItem(label, null, flags);
        }
        else if (Array.isArray(p_open)) {
            return exports.bind.BeginTabItem(label, p_open, flags);
        }
        else {
            const ref_open = [p_open()];
            const ret = exports.bind.BeginTabItem(label, ref_open, flags);
            p_open(ref_open[0]);
            return ret;
        }
    }
    // IMGUI_API void          EndTabItem();                                                       // only call EndTabItem() if BeginTabItem() returns true!
    function EndTabItem() { exports.bind.EndTabItem(); }
    // IMGUI_API void          SetTabItemClosed(const char* tab_or_docked_window_label);           // notify TabBar or Docking system of a closed tab/window ahead (useful to reduce visual flicker on reorderable tab bars). For tab-bar: call after BeginTabBar() and before Tab submissions. Otherwise call with a window name.
    function SetTabItemClosed(tab_or_docked_window_label) { exports.bind.SetTabItemClosed(tab_or_docked_window_label); }
    // Logging/Capture: all text output from interface is captured to tty/file/clipboard. By default, tree nodes are automatically opened during logging.
    // IMGUI_API void          LogToTTY(int max_depth = -1);                                       // start logging to tty
    function LogToTTY(max_depth = -1) {
        exports.bind.LogToTTY(max_depth);
    }
    // IMGUI_API void          LogToFile(int max_depth = -1, const char* filename = NULL);         // start logging to file
    function LogToFile(max_depth = -1, filename = null) {
        exports.bind.LogToFile(max_depth, filename);
    }
    // IMGUI_API void          LogToClipboard(int max_depth = -1);                                 // start logging to OS clipboard
    function LogToClipboard(max_depth = -1) {
        exports.bind.LogToClipboard(max_depth);
    }
    // IMGUI_API void          LogFinish();                                                        // stop logging (close file, etc.)
    function LogFinish() { exports.bind.LogFinish(); }
    // IMGUI_API void          LogButtons();                                                       // helper to display buttons for logging to tty/file/clipboard
    function LogButtons() { exports.bind.LogButtons(); }
    // IMGUI_API void          LogText(const char* fmt, ...) IM_FMTARGS(1);                        // pass text data straight to log (without being displayed)
    function LogText(fmt) {
        exports.bind.LogText(fmt);
    }
    const _ImGui_DragDropPayload_data = {};
    // Drag and Drop
    // [BETA API] Missing Demo code. API may evolve.
    // IMGUI_API bool          BeginDragDropSource(ImGuiDragDropFlags flags = 0);                // call when the current item is active. If this return true, you can call SetDragDropPayload() + EndDragDropSource()
    function BeginDragDropSource(flags = 0) {
        return exports.bind.BeginDragDropSource(flags);
    }
    // IMGUI_API bool          SetDragDropPayload(const char* type, const void* data, size_t size, ImGuiCond cond = 0);// type is a user defined string of maximum 8 characters. Strings starting with '_' are reserved for dear imgui internal types. Data is copied and held by imgui.
    function SetDragDropPayload(type, data, cond = 0) {
        _ImGui_DragDropPayload_data[type] = data;
        return exports.bind.SetDragDropPayload(type, data, 0, cond);
    }
    // IMGUI_API void          EndDragDropSource();
    function EndDragDropSource() {
        exports.bind.EndDragDropSource();
    }
    // IMGUI_API bool          BeginDragDropTarget();                                                                  // call after submitting an item that may receive an item. If this returns true, you can call AcceptDragDropPayload() + EndDragDropTarget()
    function BeginDragDropTarget() {
        return exports.bind.BeginDragDropTarget();
    }
    // IMGUI_API const ImGuiPayload* AcceptDragDropPayload(const char* type, ImGuiDragDropFlags flags = 0);            // accept contents of a given type. If ImGuiDragDropFlags_AcceptBeforeDelivery is set you can peek into the payload before the mouse button is released.
    function AcceptDragDropPayload(type, flags = 0) {
        const data = _ImGui_DragDropPayload_data[type];
        return exports.bind.AcceptDragDropPayload(type, flags) ? { Data: data } : null;
    }
    // IMGUI_API void          EndDragDropTarget();
    function EndDragDropTarget() {
        exports.bind.EndDragDropTarget();
    }
    // Clipping
    // IMGUI_API void          PushClipRect(const ImVec2& clip_rect_min, const ImVec2& clip_rect_max, bool intersect_with_current_clip_rect);
    function PushClipRect(clip_rect_min, clip_rect_max, intersect_with_current_clip_rect) {
        exports.bind.PushClipRect(clip_rect_min, clip_rect_max, intersect_with_current_clip_rect);
    }
    // IMGUI_API void          PopClipRect();
    function PopClipRect() {
        exports.bind.PopClipRect();
    }
    // Focus
    // (FIXME: Those functions will be reworked after we merge the navigation branch + have a pass at focusing/tabbing features.)
    // (Prefer using "SetItemDefaultFocus()" over "if (IsWindowAppearing()) SetScrollHere()" when applicable, to make your code more forward compatible when navigation branch is merged)
    // IMGUI_API void          SetItemDefaultFocus();                                              // make last item the default focused item of a window (WIP navigation branch only). Pleaase use instead of SetScrollHere().
    function SetItemDefaultFocus() { exports.bind.SetItemDefaultFocus(); }
    // IMGUI_API void          SetKeyboardFocusHere(int offset = 0);                               // focus keyboard on the next widget. Use positive 'offset' to access sub components of a multiple component widget. Use -1 to access previous widget.
    function SetKeyboardFocusHere(offset = 0) {
        exports.bind.SetKeyboardFocusHere(offset);
    }
    // Utilities
    // IMGUI_API bool          IsItemHovered(ImGuiHoveredFlags flags = 0);                         // is the last item hovered? (and usable, aka not blocked by a popup, etc.). See ImGuiHoveredFlags for more options.
    function IsItemHovered(flags = 0) {
        return exports.bind.IsItemHovered(flags);
    }
    // IMGUI_API bool          IsItemActive();                                                     // is the last item active? (e.g. button being held, text field being edited- items that don't interact will always return false)
    function IsItemActive() { return exports.bind.IsItemActive(); }
    // IMGUI_API bool          IsItemEdited();                                                     // is the last item active? (e.g. button being held, text field being edited- items that don't interact will always return false)
    function IsItemEdited() { return exports.bind.IsItemEdited(); }
    // IMGUI_API bool          IsItemFocused();                                                    // is the last item focused for keyboard/gamepad navigation?
    function IsItemFocused() { return exports.bind.IsItemFocused(); }
    // IMGUI_API bool          IsItemClicked(int mouse_button = 0);                                // is the last item clicked? (e.g. button/node just clicked on)
    function IsItemClicked(mouse_button = 0) {
        return exports.bind.IsItemClicked(mouse_button);
    }
    // IMGUI_API bool          IsItemVisible();                                                    // is the last item visible? (aka not out of sight due to clipping/scrolling.)
    function IsItemVisible() { return exports.bind.IsItemVisible(); }
    // IMGUI_API bool          IsItemActivated();                                                  // was the last item just made active (item was previously inactive).
    function IsItemActivated() { return exports.bind.IsItemActivated(); }
    // IMGUI_API bool          IsItemDeactivated();                                                // was the last item just made inactive (item was previously active). Useful for Undo/Redo patterns with widgets that requires continuous editing.
    function IsItemDeactivated() { return exports.bind.IsItemDeactivated(); }
    // IMGUI_API bool          IsItemDeactivatedAfterEdit();                                     // was the last item just made inactive and made a value change when it was active? (e.g. Slider/Drag moved). Useful for Undo/Redo patterns with widgets that requires continuous editing. Note that you may get false positives (some widgets such as Combo()/ListBox()/Selectable() will return true even when clicking an already selected item).
    function IsItemDeactivatedAfterEdit() { return exports.bind.IsItemDeactivatedAfterEdit(); }
    // IMGUI_API bool          IsAnyItemHovered();
    function IsAnyItemHovered() { return exports.bind.IsAnyItemHovered(); }
    // IMGUI_API bool          IsAnyItemActive();
    function IsAnyItemActive() { return exports.bind.IsAnyItemActive(); }
    // IMGUI_API bool          IsAnyItemFocused();
    function IsAnyItemFocused() { return exports.bind.IsAnyItemFocused(); }
    // IMGUI_API ImVec2        GetItemRectMin();                                                   // get bounding rectangle of last item, in screen space
    function GetItemRectMin(out = new ImVec2()) {
        return exports.bind.GetItemRectMin(out);
    }
    // IMGUI_API ImVec2        GetItemRectMax();                                                   // "
    function GetItemRectMax(out = new ImVec2()) {
        return exports.bind.GetItemRectMax(out);
    }
    // IMGUI_API ImVec2        GetItemRectSize();                                                  // get size of last item, in screen space
    function GetItemRectSize(out = new ImVec2()) {
        return exports.bind.GetItemRectSize(out);
    }
    // IMGUI_API void          SetItemAllowOverlap();                                              // allow last item to be overlapped by a subsequent item. sometimes useful with invisible buttons, selectables, etc. to catch unused area.
    function SetItemAllowOverlap() { exports.bind.SetItemAllowOverlap(); }
    // IMGUI_API bool          IsWindowFocused(ImGuiFocusedFlags flags = 0);                       // is current window focused? or its root/child, depending on flags. see flags for options.
    function IsWindowFocused(flags = 0) {
        return exports.bind.IsWindowFocused(flags);
    }
    // IMGUI_API bool          IsWindowHovered(ImGuiHoveredFlags flags = 0);                       // is current window hovered (and typically: not blocked by a popup/modal)? see flags for options.
    function IsWindowHovered(flags = 0) {
        return exports.bind.IsWindowHovered(flags);
    }
    function IsRectVisible(...args) {
        if (args.length === 1) {
            const size = args[0];
            return exports.bind.IsRectVisible_A(size);
        }
        else {
            const rect_min = args[0];
            const rect_max = args[1];
            return exports.bind.IsRectVisible_B(rect_min, rect_max);
        }
    }
    // IMGUI_API float         GetTime();
    function GetTime() { return exports.bind.GetTime(); }
    // IMGUI_API int           GetFrameCount();
    function GetFrameCount() { return exports.bind.GetFrameCount(); }
    function GetBackgroundDrawList() {
        return new ImDrawList(exports.bind.GetBackgroundDrawList());
    }
    function GetForegroundDrawList() {
        return new ImDrawList(exports.bind.GetForegroundDrawList());
    }
    // IMGUI_API ImDrawListSharedData* GetDrawListSharedData();
    function GetDrawListSharedData() {
        return new ImDrawListSharedData(exports.bind.GetDrawListSharedData());
    }
    // IMGUI_API const char*   GetStyleColorName(ImGuiCol idx);
    function GetStyleColorName(idx) { return exports.bind.GetStyleColorName(idx); }
    // IMGUI_API ImVec2        CalcTextSize(const char* text, const char* text_end = NULL, bool hide_text_after_double_hash = false, float wrap_width = -1.0f);
    function CalcTextSize(text, text_end = null, hide_text_after_double_hash = false, wrap_width = -1, out = new ImVec2()) {
        return exports.bind.CalcTextSize(text_end !== null ? text.substring(0, text_end) : text, hide_text_after_double_hash, wrap_width, out);
    }
    // IMGUI_API void          CalcListClipping(int items_count, float items_height, int* out_items_display_start, int* out_items_display_end);    // calculate coarse clipping for large list of evenly sized items. Prefer using the ImGuiListClipper higher-level helper if you can.
    function CalcListClipping(items_count, items_height, out_items_display_start, out_items_display_end) {
        return exports.bind.CalcListClipping(items_count, items_height, out_items_display_start, out_items_display_end);
    }
    // IMGUI_API bool          BeginChildFrame(ImGuiID id, const ImVec2& size, ImGuiWindowFlags extra_flags = 0);    // helper to create a child window / scrolling region that looks like a normal widget frame
    function BeginChildFrame(id, size, extra_flags = 0) {
        return exports.bind.BeginChildFrame(id, size, extra_flags);
    }
    // IMGUI_API void          EndChildFrame();
    function EndChildFrame() { exports.bind.EndChildFrame(); }
    // IMGUI_API ImVec4        ColorConvertU32ToFloat4(ImU32 in);
    function ColorConvertU32ToFloat4(in_, out = new ImVec4()) {
        return exports.bind.ColorConvertU32ToFloat4(in_, out);
    }
    // IMGUI_API ImU32         ColorConvertFloat4ToU32(const ImVec4& in);
    function ColorConvertFloat4ToU32(in_) {
        return exports.bind.ColorConvertFloat4ToU32(in_);
    }
    // IMGUI_API void          ColorConvertRGBtoHSV(float r, float g, float b, float& out_h, float& out_s, float& out_v);
    function ColorConvertRGBtoHSV(r, g, b, out_h, out_s, out_v) { exports.bind.ColorConvertRGBtoHSV(r, g, b, out_h, out_s, out_v); }
    // IMGUI_API void          ColorConvertHSVtoRGB(float h, float s, float v, float& out_r, float& out_g, float& out_b);
    function ColorConvertHSVtoRGB(h, s, v, out_r, out_g, out_b) { exports.bind.ColorConvertHSVtoRGB(h, s, v, out_r, out_g, out_b); }
    // Inputs
    // IMGUI_API int           GetKeyIndex(ImGuiKey imgui_key);                                    // map ImGuiKey_* values into user's key index. == io.KeyMap[key]
    function GetKeyIndex(imgui_key) {
        return exports.bind.GetKeyIndex(imgui_key);
    }
    // IMGUI_API bool          IsKeyDown(int user_key_index);                                      // is key being held. == io.KeysDown[user_key_index]. note that imgui doesn't know the semantic of each entry of io.KeyDown[]. Use your own indices/enums according to how your backend/engine stored them into KeyDown[]!
    function IsKeyDown(user_key_index) {
        return exports.bind.IsKeyDown(user_key_index);
    }
    // IMGUI_API bool          IsKeyPressed(int user_key_index, bool repeat = true);               // was key pressed (went from !Down to Down). if repeat=true, uses io.KeyRepeatDelay / KeyRepeatRate
    function IsKeyPressed(user_key_index, repeat = true) {
        return exports.bind.IsKeyPressed(user_key_index, repeat);
    }
    // IMGUI_API bool          IsKeyReleased(int user_key_index);                                  // was key released (went from Down to !Down)..
    function IsKeyReleased(user_key_index) {
        return exports.bind.IsKeyReleased(user_key_index);
    }
    // IMGUI_API int           GetKeyPressedAmount(int key_index, float repeat_delay, float rate); // uses provided repeat rate/delay. return a count, most often 0 or 1 but might be >1 if RepeatRate is small enough that DeltaTime > RepeatRate
    function GetKeyPressedAmount(user_key_index, repeat_delay, rate) {
        return exports.bind.GetKeyPressedAmount(user_key_index, repeat_delay, rate);
    }
    // IMGUI_API bool          IsMouseDown(int button);                                            // is mouse button held
    function IsMouseDown(button) {
        return exports.bind.IsMouseDown(button);
    }
    // IMGUI_API bool          IsMouseClicked(int button, bool repeat = false);                    // did mouse button clicked (went from !Down to Down)
    function IsMouseClicked(button, repeat = false) {
        return exports.bind.IsMouseClicked(button, repeat);
    }
    // IMGUI_API bool          IsMouseDoubleClicked(int button);                                   // did mouse button double-clicked. a double-click returns false in IsMouseClicked(). uses io.MouseDoubleClickTime.
    function IsMouseDoubleClicked(button) {
        return exports.bind.IsMouseDoubleClicked(button);
    }
    // IMGUI_API bool          IsMouseReleased(int button);                                        // did mouse button released (went from Down to !Down)
    function IsMouseReleased(button) {
        return exports.bind.IsMouseReleased(button);
    }
    // IMGUI_API bool          IsMouseDragging(int button = 0, float lock_threshold = -1.0f);      // is mouse dragging. if lock_threshold < -1.0f uses io.MouseDraggingThreshold
    function IsMouseDragging(button = 0, lock_threshold = -1.0) {
        return exports.bind.IsMouseDragging(button, lock_threshold);
    }
    // IMGUI_API bool          IsMouseHoveringRect(const ImVec2& r_min, const ImVec2& r_max, bool clip = true);  // is mouse hovering given bounding rect (in screen space). clipped by current clipping settings. disregarding of consideration of focus/window ordering/blocked by a popup.
    function IsMouseHoveringRect(r_min, r_max, clip = true) {
        return exports.bind.IsMouseHoveringRect(r_min, r_max, clip);
    }
    // IMGUI_API bool          IsMousePosValid(const ImVec2* mouse_pos = NULL);                    //
    function IsMousePosValid(mouse_pos = null) {
        return exports.bind.IsMousePosValid(mouse_pos);
    }
    // IMGUI_API ImVec2        GetMousePos();                                                      // shortcut to ImGui::GetIO().MousePos provided by user, to be consistent with other calls
    function GetMousePos(out = new ImVec2()) {
        return exports.bind.GetMousePos(out);
    }
    // IMGUI_API ImVec2        GetMousePosOnOpeningCurrentPopup();                                 // retrieve backup of mouse positioning at the time of opening popup we have BeginPopup() into
    function GetMousePosOnOpeningCurrentPopup(out = new ImVec2()) {
        return exports.bind.GetMousePosOnOpeningCurrentPopup(out);
    }
    // IMGUI_API ImVec2        GetMouseDragDelta(int button = 0, float lock_threshold = -1.0f);    // dragging amount since clicking. if lock_threshold < -1.0f uses io.MouseDraggingThreshold
    function GetMouseDragDelta(button = 0, lock_threshold = -1.0, out = new ImVec2()) {
        return exports.bind.GetMouseDragDelta(button, lock_threshold, out);
    }
    // IMGUI_API void          ResetMouseDragDelta(int button = 0);                                //
    function ResetMouseDragDelta(button = 0) {
        exports.bind.ResetMouseDragDelta(button);
    }
    // IMGUI_API ImGuiMouseCursor GetMouseCursor();                                                // get desired cursor type, reset in ImGui::NewFrame(), this is updated during the frame. valid before Render(). If you use software rendering by setting io.MouseDrawCursor ImGui will render those for you
    function GetMouseCursor() { return exports.bind.GetMouseCursor(); }
    // IMGUI_API void          SetMouseCursor(ImGuiMouseCursor type);                              // set desired cursor type
    function SetMouseCursor(type) { exports.bind.SetMouseCursor(type); }
    // IMGUI_API void          CaptureKeyboardFromApp(bool capture = true);                        // manually override io.WantCaptureKeyboard flag next frame (said flag is entirely left for your application handle). e.g. force capture keyboard when your widget is being hovered.
    function CaptureKeyboardFromApp(capture = true) {
        return exports.bind.CaptureKeyboardFromApp(capture);
    }
    // IMGUI_API void          CaptureMouseFromApp(bool capture = true);                           // manually override io.WantCaptureMouse flag next frame (said flag is entirely left for your application handle).
    function CaptureMouseFromApp(capture = true) {
        exports.bind.CaptureMouseFromApp(capture);
    }
    // Clipboard Utilities (also see the LogToClipboard() function to capture or output text data to the clipboard)
    // IMGUI_API const char*   GetClipboardText();
    function GetClipboardText() { return exports.bind.GetClipboardText(); }
    // IMGUI_API void          SetClipboardText(const char* text);
    function SetClipboardText(text) { exports.bind.SetClipboardText(text); }
    // Settings/.Ini Utilities
    // The disk functions are automatically called if io.IniFilename != NULL (default is "imgui.ini").
    // Set io.IniFilename to NULL to load/save manually. Read io.WantSaveIniSettings description about handling .ini saving manually.
    // IMGUI_API void          LoadIniSettingsFromDisk(const char* ini_filename);                  // call after CreateContext() and before the first call to NewFrame(). NewFrame() automatically calls LoadIniSettingsFromDisk(io.IniFilename).
    function LoadIniSettingsFromDisk(ini_filename) { throw new Error(); } // TODO
    // IMGUI_API void          LoadIniSettingsFromMemory(const char* ini_data, size_t ini_size=0); // call after CreateContext() and before the first call to NewFrame() to provide .ini data from your own data source.
    function LoadIniSettingsFromMemory(ini_data, ini_size = 0) { exports.bind.LoadIniSettingsFromMemory(ini_data); }
    // IMGUI_API void          SaveIniSettingsToDisk(const char* ini_filename);
    function SaveIniSettingsToDisk(ini_filename) { throw new Error(); } // TODO
    // IMGUI_API const char*   SaveIniSettingsToMemory(size_t* out_ini_size = NULL);               // return a zero-terminated string with the .ini data which you can save by your own mean. call when io.WantSaveIniSettings is set, then save data by your own mean and clear io.WantSaveIniSettings.
    function SaveIniSettingsToMemory(out_ini_size = null) { return exports.bind.SaveIniSettingsToMemory(); }
    // Memory Utilities
    // All those functions are not reliant on the current context.
    // If you reload the contents of imgui.cpp at runtime, you may need to call SetCurrentContext() + SetAllocatorFunctions() again.
    // IMGUI_API void          SetAllocatorFunctions(void* (*alloc_func)(size_t sz, void* user_data), void(*free_func)(void* ptr, void* user_data), void* user_data = NULL);
    function SetAllocatorFunctions(alloc_func, free_func, user_data = null) {
        exports.bind.SetAllocatorFunctions(alloc_func, free_func, user_data);
    }
    // IMGUI_API void*         MemAlloc(size_t sz);
    function MemAlloc(sz) { exports.bind.MemAlloc(sz); }
    // IMGUI_API void          MemFree(void* ptr);
    function MemFree(ptr) { exports.bind.MemFree(ptr); }

    exports.AcceptDragDropPayload = AcceptDragDropPayload;
    exports.AlignTextToFramePadding = AlignTextToFramePadding;
    exports.ArrowButton = ArrowButton;
    exports.BackendFlags = exports.ImGuiBackendFlags;
    exports.Begin = Begin;
    exports.BeginChild = BeginChild;
    exports.BeginChildFrame = BeginChildFrame;
    exports.BeginCombo = BeginCombo;
    exports.BeginDragDropSource = BeginDragDropSource;
    exports.BeginDragDropTarget = BeginDragDropTarget;
    exports.BeginGroup = BeginGroup;
    exports.BeginMainMenuBar = BeginMainMenuBar;
    exports.BeginMenu = BeginMenu;
    exports.BeginMenuBar = BeginMenuBar;
    exports.BeginPopup = BeginPopup;
    exports.BeginPopupContextItem = BeginPopupContextItem;
    exports.BeginPopupContextVoid = BeginPopupContextVoid;
    exports.BeginPopupContextWindow = BeginPopupContextWindow;
    exports.BeginPopupModal = BeginPopupModal;
    exports.BeginTabBar = BeginTabBar;
    exports.BeginTabItem = BeginTabItem;
    exports.BeginTooltip = BeginTooltip;
    exports.Bind = bindImgui$1;
    exports.Bullet = Bullet;
    exports.BulletText = BulletText;
    exports.Button = Button;
    exports.CalcItemWidth = CalcItemWidth;
    exports.CalcListClipping = CalcListClipping;
    exports.CalcTextSize = CalcTextSize;
    exports.CaptureKeyboardFromApp = CaptureKeyboardFromApp;
    exports.CaptureMouseFromApp = CaptureMouseFromApp;
    exports.Checkbox = Checkbox;
    exports.CheckboxFlags = CheckboxFlags;
    exports.CloseCurrentPopup = CloseCurrentPopup;
    exports.Col = exports.ImGuiCol;
    exports.CollapsingHeader = CollapsingHeader;
    exports.ColorButton = ColorButton;
    exports.ColorConvertFloat4ToU32 = ColorConvertFloat4ToU32;
    exports.ColorConvertHSVtoRGB = ColorConvertHSVtoRGB;
    exports.ColorConvertRGBtoHSV = ColorConvertRGBtoHSV;
    exports.ColorConvertU32ToFloat4 = ColorConvertU32ToFloat4;
    exports.ColorEdit3 = ColorEdit3;
    exports.ColorEdit4 = ColorEdit4;
    exports.ColorEditFlags = exports.ImGuiColorEditFlags;
    exports.ColorPicker3 = ColorPicker3;
    exports.ColorPicker4 = ColorPicker4;
    exports.Columns = Columns;
    exports.Combo = Combo;
    exports.ComboFlags = exports.ImGuiComboFlags;
    exports.Cond = exports.ImGuiCond;
    exports.ConfigFlags = exports.ImGuiConfigFlags;
    exports.CreateContext = CreateContext;
    exports.DataType = exports.ImGuiDataType;
    exports.DebugCheckVersionAndDataLayout = DebugCheckVersionAndDataLayout;
    exports.DestroyContext = DestroyContext;
    exports.Dir = exports.ImGuiDir;
    exports.DragDropFlags = exports.ImGuiDragDropFlags;
    exports.DragFloat = DragFloat;
    exports.DragFloat2 = DragFloat2;
    exports.DragFloat3 = DragFloat3;
    exports.DragFloat4 = DragFloat4;
    exports.DragFloatRange2 = DragFloatRange2;
    exports.DragInt = DragInt;
    exports.DragInt2 = DragInt2;
    exports.DragInt3 = DragInt3;
    exports.DragInt4 = DragInt4;
    exports.DragIntRange2 = DragIntRange2;
    exports.DragScalar = DragScalar;
    exports.Dummy = Dummy;
    exports.End = End;
    exports.EndChild = EndChild;
    exports.EndChildFrame = EndChildFrame;
    exports.EndCombo = EndCombo;
    exports.EndDragDropSource = EndDragDropSource;
    exports.EndDragDropTarget = EndDragDropTarget;
    exports.EndFrame = EndFrame;
    exports.EndGroup = EndGroup;
    exports.EndMainMenuBar = EndMainMenuBar;
    exports.EndMenu = EndMenu;
    exports.EndMenuBar = EndMenuBar;
    exports.EndPopup = EndPopup;
    exports.EndTabBar = EndTabBar;
    exports.EndTabItem = EndTabItem;
    exports.EndTooltip = EndTooltip;
    exports.FocusedFlags = exports.ImGuiFocusedFlags;
    exports.GetBackgroundDrawList = GetBackgroundDrawList;
    exports.GetClipboardText = GetClipboardText;
    exports.GetColorU32 = GetColorU32;
    exports.GetColumnIndex = GetColumnIndex;
    exports.GetColumnOffset = GetColumnOffset;
    exports.GetColumnWidth = GetColumnWidth;
    exports.GetColumnsCount = GetColumnsCount;
    exports.GetContentRegionAvail = GetContentRegionAvail;
    exports.GetContentRegionMax = GetContentRegionMax;
    exports.GetCurrentContext = GetCurrentContext;
    exports.GetCursorPos = GetCursorPos;
    exports.GetCursorPosX = GetCursorPosX;
    exports.GetCursorPosY = GetCursorPosY;
    exports.GetCursorScreenPos = GetCursorScreenPos;
    exports.GetCursorStartPos = GetCursorStartPos;
    exports.GetDrawData = GetDrawData;
    exports.GetDrawListSharedData = GetDrawListSharedData;
    exports.GetFont = GetFont;
    exports.GetFontSize = GetFontSize;
    exports.GetFontTexUvWhitePixel = GetFontTexUvWhitePixel;
    exports.GetForegroundDrawList = GetForegroundDrawList;
    exports.GetFrameCount = GetFrameCount;
    exports.GetFrameHeight = GetFrameHeight;
    exports.GetFrameHeightWithSpacing = GetFrameHeightWithSpacing;
    exports.GetID = GetID;
    exports.GetIO = GetIO;
    exports.GetItemRectMax = GetItemRectMax;
    exports.GetItemRectMin = GetItemRectMin;
    exports.GetItemRectSize = GetItemRectSize;
    exports.GetKeyIndex = GetKeyIndex;
    exports.GetKeyPressedAmount = GetKeyPressedAmount;
    exports.GetMouseCursor = GetMouseCursor;
    exports.GetMouseDragDelta = GetMouseDragDelta;
    exports.GetMousePos = GetMousePos;
    exports.GetMousePosOnOpeningCurrentPopup = GetMousePosOnOpeningCurrentPopup;
    exports.GetScrollMaxX = GetScrollMaxX;
    exports.GetScrollMaxY = GetScrollMaxY;
    exports.GetScrollX = GetScrollX;
    exports.GetScrollY = GetScrollY;
    exports.GetStyle = GetStyle;
    exports.GetStyleColorName = GetStyleColorName;
    exports.GetStyleColorVec4 = GetStyleColorVec4;
    exports.GetTextLineHeight = GetTextLineHeight;
    exports.GetTextLineHeightWithSpacing = GetTextLineHeightWithSpacing;
    exports.GetTime = GetTime;
    exports.GetTreeNodeToLabelSpacing = GetTreeNodeToLabelSpacing;
    exports.GetVersion = GetVersion;
    exports.GetWindowContentRegionMax = GetWindowContentRegionMax;
    exports.GetWindowContentRegionMin = GetWindowContentRegionMin;
    exports.GetWindowContentRegionWidth = GetWindowContentRegionWidth;
    exports.GetWindowDrawList = GetWindowDrawList;
    exports.GetWindowHeight = GetWindowHeight;
    exports.GetWindowPos = GetWindowPos;
    exports.GetWindowSize = GetWindowSize;
    exports.GetWindowWidth = GetWindowWidth;
    exports.HoveredFlags = exports.ImGuiHoveredFlags;
    exports.IMGUI_CHECKVERSION = IMGUI_CHECKVERSION;
    exports.IMGUI_PAYLOAD_TYPE_COLOR_3F = IMGUI_PAYLOAD_TYPE_COLOR_3F;
    exports.IMGUI_PAYLOAD_TYPE_COLOR_4F = IMGUI_PAYLOAD_TYPE_COLOR_4F;
    exports.IMGUI_VERSION = IMGUI_VERSION;
    exports.IMGUI_VERSION_NUM = IMGUI_VERSION_NUM;
    exports.IM_ARRAYSIZE = IM_ARRAYSIZE;
    exports.IM_ASSERT = IM_ASSERT;
    exports.IM_COL32 = IM_COL32;
    exports.IM_COL32_A_MASK = IM_COL32_A_MASK;
    exports.IM_COL32_A_SHIFT = IM_COL32_A_SHIFT;
    exports.IM_COL32_BLACK = IM_COL32_BLACK;
    exports.IM_COL32_BLACK_TRANS = IM_COL32_BLACK_TRANS;
    exports.IM_COL32_B_SHIFT = IM_COL32_B_SHIFT;
    exports.IM_COL32_G_SHIFT = IM_COL32_G_SHIFT;
    exports.IM_COL32_R_SHIFT = IM_COL32_R_SHIFT;
    exports.IM_COL32_WHITE = IM_COL32_WHITE;
    exports.ImColor = ImColor;
    exports.ImDrawCallback_ResetRenderState = ImDrawCallback_ResetRenderState;
    exports.ImDrawChannel = ImDrawChannel;
    exports.ImDrawCmd = ImDrawCmd;
    exports.ImDrawCornerFlags = exports.wCornerFlags;
    exports.ImDrawData = ImDrawData;
    exports.ImDrawIdxSize = ImDrawIdxSize;
    exports.ImDrawList = ImDrawList;
    exports.ImDrawListFlags = exports.wListFlags;
    exports.ImDrawListSharedData = ImDrawListSharedData;
    exports.ImDrawVert = ImDrawVert;
    exports.ImDrawVertColOffset = ImDrawVertColOffset;
    exports.ImDrawVertPosOffset = ImDrawVertPosOffset;
    exports.ImDrawVertSize = ImDrawVertSize;
    exports.ImDrawVertUVOffset = ImDrawVertUVOffset;
    exports.ImFont = ImFont;
    exports.ImFontAtlas = ImFontAtlas;
    exports.ImFontConfig = ImFontConfig;
    exports.ImFontGlyph = ImFontGlyph;
    exports.ImGuiContext = ImGuiContext;
    exports.ImGuiIO = ImGuiIO;
    exports.ImGuiInputTextCallbackData = ImGuiInputTextCallbackData;
    exports.ImGuiInputTextDefaultSize = ImGuiInputTextDefaultSize;
    exports.ImGuiInputTextFlags = exports.InputTextFlags;
    exports.ImGuiKey = exports.Key;
    exports.ImGuiListClipper = ImGuiListClipper;
    exports.ImGuiMouseCursor = exports.MouseCursor;
    exports.ImGuiNavInput = exports.NavInput;
    exports.ImGuiSelectableFlags = exports.SelectableFlags;
    exports.ImGuiSizeCallbackData = ImGuiSizeCallbackData;
    exports.ImGuiStorage = ImGuiStorage;
    exports.ImGuiStyle = ImGuiStyle;
    exports.ImGuiStyleVar = exports.StyleVar;
    exports.ImGuiTabBarFlags = exports.TabBarFlags;
    exports.ImGuiTabItemFlags = exports.TabItemFlags;
    exports.ImGuiTextBuffer = ImGuiTextBuffer;
    exports.ImGuiTextFilter = ImGuiTextFilter;
    exports.ImGuiTreeNodeFlags = exports.TreeNodeFlags;
    exports.ImGuiWindowFlags = exports.WindowFlags;
    exports.ImStringBuffer = ImStringBuffer;
    exports.ImVec2 = ImVec2;
    exports.ImVec4 = ImVec4;
    exports.ImVector = ImVector;
    exports.Image = Image;
    exports.ImageButton = ImageButton;
    exports.Indent = Indent;
    exports.InputDouble = InputDouble;
    exports.InputFloat = InputFloat;
    exports.InputFloat2 = InputFloat2;
    exports.InputFloat3 = InputFloat3;
    exports.InputFloat4 = InputFloat4;
    exports.InputInt = InputInt;
    exports.InputInt2 = InputInt2;
    exports.InputInt3 = InputInt3;
    exports.InputInt4 = InputInt4;
    exports.InputScalar = InputScalar;
    exports.InputText = InputText;
    exports.InputTextMultiline = InputTextMultiline;
    exports.InputTextWithHint = InputTextWithHint;
    exports.InvisibleButton = InvisibleButton;
    exports.IsAnyItemActive = IsAnyItemActive;
    exports.IsAnyItemFocused = IsAnyItemFocused;
    exports.IsAnyItemHovered = IsAnyItemHovered;
    exports.IsItemActivated = IsItemActivated;
    exports.IsItemActive = IsItemActive;
    exports.IsItemClicked = IsItemClicked;
    exports.IsItemDeactivated = IsItemDeactivated;
    exports.IsItemDeactivatedAfterEdit = IsItemDeactivatedAfterEdit;
    exports.IsItemEdited = IsItemEdited;
    exports.IsItemFocused = IsItemFocused;
    exports.IsItemHovered = IsItemHovered;
    exports.IsItemVisible = IsItemVisible;
    exports.IsKeyDown = IsKeyDown;
    exports.IsKeyPressed = IsKeyPressed;
    exports.IsKeyReleased = IsKeyReleased;
    exports.IsMouseClicked = IsMouseClicked;
    exports.IsMouseDoubleClicked = IsMouseDoubleClicked;
    exports.IsMouseDown = IsMouseDown;
    exports.IsMouseDragging = IsMouseDragging;
    exports.IsMouseHoveringRect = IsMouseHoveringRect;
    exports.IsMousePosValid = IsMousePosValid;
    exports.IsMouseReleased = IsMouseReleased;
    exports.IsPopupOpen = IsPopupOpen;
    exports.IsRectVisible = IsRectVisible;
    exports.IsWindowAppearing = IsWindowAppearing;
    exports.IsWindowCollapsed = IsWindowCollapsed;
    exports.IsWindowFocused = IsWindowFocused;
    exports.IsWindowHovered = IsWindowHovered;
    exports.LabelText = LabelText;
    exports.ListBox = ListBox;
    exports.ListBoxFooter = ListBoxFooter;
    exports.ListBoxHeader = ListBoxHeader;
    exports.LoadIniSettingsFromDisk = LoadIniSettingsFromDisk;
    exports.LoadIniSettingsFromMemory = LoadIniSettingsFromMemory;
    exports.LogButtons = LogButtons;
    exports.LogFinish = LogFinish;
    exports.LogText = LogText;
    exports.LogToClipboard = LogToClipboard;
    exports.LogToFile = LogToFile;
    exports.LogToTTY = LogToTTY;
    exports.MemAlloc = MemAlloc;
    exports.MemFree = MemFree;
    exports.MenuItem = MenuItem;
    exports.NewFrame = NewFrame;
    exports.NewLine = NewLine;
    exports.NextColumn = NextColumn;
    exports.OpenPopup = OpenPopup;
    exports.OpenPopupOnItemClick = OpenPopupOnItemClick;
    exports.PlotHistogram = PlotHistogram;
    exports.PlotLines = PlotLines;
    exports.PopAllowKeyboardFocus = PopAllowKeyboardFocus;
    exports.PopButtonRepeat = PopButtonRepeat;
    exports.PopClipRect = PopClipRect;
    exports.PopFont = PopFont;
    exports.PopID = PopID;
    exports.PopItemWidth = PopItemWidth;
    exports.PopStyleColor = PopStyleColor;
    exports.PopStyleVar = PopStyleVar;
    exports.PopTextWrapPos = PopTextWrapPos;
    exports.ProgressBar = ProgressBar;
    exports.PushAllowKeyboardFocus = PushAllowKeyboardFocus;
    exports.PushButtonRepeat = PushButtonRepeat;
    exports.PushClipRect = PushClipRect;
    exports.PushFont = PushFont;
    exports.PushID = PushID;
    exports.PushItemWidth = PushItemWidth;
    exports.PushStyleColor = PushStyleColor;
    exports.PushStyleVar = PushStyleVar;
    exports.PushTextWrapPos = PushTextWrapPos;
    exports.RadioButton = RadioButton;
    exports.Render = Render;
    exports.ResetMouseDragDelta = ResetMouseDragDelta;
    exports.SameLine = SameLine;
    exports.SaveIniSettingsToDisk = SaveIniSettingsToDisk;
    exports.SaveIniSettingsToMemory = SaveIniSettingsToMemory;
    exports.Selectable = Selectable;
    exports.Separator = Separator;
    exports.SetAllocatorFunctions = SetAllocatorFunctions;
    exports.SetClipboardText = SetClipboardText;
    exports.SetColorEditOptions = SetColorEditOptions;
    exports.SetColumnOffset = SetColumnOffset;
    exports.SetColumnWidth = SetColumnWidth;
    exports.SetCurrentContext = SetCurrentContext;
    exports.SetCursorPos = SetCursorPos;
    exports.SetCursorPosX = SetCursorPosX;
    exports.SetCursorPosY = SetCursorPosY;
    exports.SetCursorScreenPos = SetCursorScreenPos;
    exports.SetDragDropPayload = SetDragDropPayload;
    exports.SetItemAllowOverlap = SetItemAllowOverlap;
    exports.SetItemDefaultFocus = SetItemDefaultFocus;
    exports.SetKeyboardFocusHere = SetKeyboardFocusHere;
    exports.SetMouseCursor = SetMouseCursor;
    exports.SetNextItemOpen = SetNextItemOpen;
    exports.SetNextItemWidth = SetNextItemWidth;
    exports.SetNextWindowBgAlpha = SetNextWindowBgAlpha;
    exports.SetNextWindowCollapsed = SetNextWindowCollapsed;
    exports.SetNextWindowContentSize = SetNextWindowContentSize;
    exports.SetNextWindowFocus = SetNextWindowFocus;
    exports.SetNextWindowPos = SetNextWindowPos;
    exports.SetNextWindowSize = SetNextWindowSize;
    exports.SetNextWindowSizeConstraints = SetNextWindowSizeConstraints;
    exports.SetScrollFromPosY = SetScrollFromPosY;
    exports.SetScrollHereY = SetScrollHereY;
    exports.SetScrollX = SetScrollX;
    exports.SetScrollY = SetScrollY;
    exports.SetTabItemClosed = SetTabItemClosed;
    exports.SetTooltip = SetTooltip;
    exports.SetWindowCollapsed = SetWindowCollapsed;
    exports.SetWindowFocus = SetWindowFocus;
    exports.SetWindowFontScale = SetWindowFontScale;
    exports.SetWindowPos = SetWindowPos;
    exports.SetWindowSize = SetWindowSize;
    exports.ShowAboutWindow = ShowAboutWindow;
    exports.ShowDemoWindow = ShowDemoWindow;
    exports.ShowFontSelector = ShowFontSelector;
    exports.ShowMetricsWindow = ShowMetricsWindow;
    exports.ShowStyleEditor = ShowStyleEditor;
    exports.ShowStyleSelector = ShowStyleSelector;
    exports.ShowUserGuide = ShowUserGuide;
    exports.SliderAngle = SliderAngle;
    exports.SliderAngle3 = SliderAngle3;
    exports.SliderFloat = SliderFloat;
    exports.SliderFloat2 = SliderFloat2;
    exports.SliderFloat3 = SliderFloat3;
    exports.SliderFloat4 = SliderFloat4;
    exports.SliderInt = SliderInt;
    exports.SliderInt2 = SliderInt2;
    exports.SliderInt3 = SliderInt3;
    exports.SliderInt4 = SliderInt4;
    exports.SliderScalar = SliderScalar;
    exports.SmallButton = SmallButton;
    exports.Spacing = Spacing;
    exports.StyleColorsClassic = StyleColorsClassic;
    exports.StyleColorsDark = StyleColorsDark;
    exports.StyleColorsLight = StyleColorsLight;
    exports.Text = Text;
    exports.TextColored = TextColored;
    exports.TextDisabled = TextDisabled;
    exports.TextUnformatted = TextUnformatted;
    exports.TextWrapped = TextWrapped;
    exports.TreeAdvanceToLabelPos = TreeAdvanceToLabelPos;
    exports.TreeNode = TreeNode;
    exports.TreeNodeEx = TreeNodeEx;
    exports.TreePop = TreePop;
    exports.TreePush = TreePush;
    exports.Unindent = Unindent;
    exports.VSliderFloat = VSliderFloat;
    exports.VSliderInt = VSliderInt;
    exports.VSliderScalar = VSliderScalar;
    exports.Value = Value;
    exports.default = imgui;
    exports.script_ImFontConfig = script_ImFontConfig;
    exports.script_ImFontGlyph = script_ImFontGlyph;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
