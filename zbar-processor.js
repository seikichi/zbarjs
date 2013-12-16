// The main barcode scanning processing function.
// Compiled from zbar.sf.net using emscripten.
//
// Copyright (C) 2013 Yury Delendik
//
// This library is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 2.1 of the License, or (at your option) any later version.
//
// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA

var zbarProcessImageData = (function() {
  var Module = null;

  var zbarProcessImageData = function (imgData) {
    if (Module === null) {
      zbarProcessImageData.initializeModule({});
    }

    var result = [];
    Module['imageWidth'] = imgData.width;
    Module['imageHeight'] = imgData.height;
    Module['getImageData'] = function (grayData) {
      var d = imgData.data;
      for (var i = 0, j = 0; i < d.length; i += 4, j++) {
        grayData[j] = (d[i] * 66 + d[i + 1] * 129 + d[i + 2] * 25 + 4096) >> 8;
      }
    };
    Module['outputResult'] = function (symbol, addon, data) {
      result.push([symbol, addon, data]);
    };
    Module['ccall']('ZBarProcessImageData', 'number', [], []);
    return result;
  };

  zbarProcessImageData.initializeModule = function (options) {
    Module = (function () {
      var Module = options || {};

      /* EMSCRIPTEN_CODE */
// Note: For maximum-speed code, see "Optimizing Code" on the Emscripten wiki, https://github.com/kripken/emscripten/wiki/Optimizing-Code
// Note: Some Emscripten settings may limit the speed of the generated code.
// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module;
if (!Module) Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');
// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
for (var key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}
// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  Module['print'] = function(x) {
    process['stdout'].write(x + '\n');
  };
  Module['printErr'] = function(x) {
    process['stderr'].write(x + '\n');
  };
  var nodeFS = require('fs');
  var nodePath = require('path');
  Module['read'] = function(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };
  Module['readBinary'] = function(filename) { return Module['read'](filename, true) };
  Module['load'] = function(f) {
    globalEval(read(f));
  };
  Module['arguments'] = process['argv'].slice(2);
  module.exports = Module;
}
if (ENVIRONMENT_IS_SHELL) {
  Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm
  Module['read'] = read;
  Module['readBinary'] = function(f) {
    return read(f, 'binary');
  };
  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }
  this['Module'] = Module;
}
if (ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER) {
  Module['print'] = function(x) {
    console.log(x);
  };
  Module['printErr'] = function(x) {
    console.log(x);
  };
  this['Module'] = Module;
}
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };
  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }
}
if (ENVIRONMENT_IS_WORKER) {
  // We can do very little here...
  var TRY_USE_DUMP = false;
  Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
    dump(x);
  }) : (function(x) {
    // self.postMessage(x); // enable this if you want stdout to be sent as messages
  }));
  Module['load'] = importScripts;
}
if (!ENVIRONMENT_IS_WORKER && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_SHELL) {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}
function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***
// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];
// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];
// Merge back in the overrides
for (var key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
// === Auto-generated preamble library stuff ===
//========================================
// Runtime code shared with compiler
//========================================
var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      var logg = log2(quantum);
      return '((((' +target + ')+' + (quantum-1) + ')>>' + logg + ')<<' + logg + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (isArrayType(type)) return true;
  if (/<?{ ?[^}]* ?}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type, quantumSize) {
    if (Runtime.QUANTUM_SIZE == 1) return 1;
    var size = {
      '%i1': 1,
      '%i8': 1,
      '%i16': 2,
      '%i32': 4,
      '%i64': 8,
      "%float": 4,
      "%double": 8
    }['%'+type]; // add '%' since float and double confuse Closure compiler as keys, and also spidermonkey as a compiler will remove 's from '_i8' etc
    if (!size) {
      if (type.charAt(type.length-1) == '*') {
        size = Runtime.QUANTUM_SIZE; // A pointer
      } else if (type[0] == 'i') {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 == 0);
        size = bits/8;
      }
    }
    return size;
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (type == 'i64' || type == 'double' || vararg) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    var index = 0;
    type.flatIndexes = type.fields.map(function(field) {
      index++;
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        if (field[1] === '0') {
          // this is [0 x something]. When inside another structure like here, it must be at the end,
          // and it adds no size
          // XXX this happens in java-nbody for example... assert(index === type.fields.length, 'zero-length in the middle!');
          size = 0;
          alignSize = type.alignSize || QUANTUM_SIZE;
        } else {
          size = Types.types[field].flatSize;
          alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
        }
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else {
        throw 'Unclear type in struct: ' + field + ', in ' + type.name_ + ' :: ' + dump(Types.types[type.name_]);
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      if (!args.splice) args = Array.prototype.slice.call(args);
      args.splice(0, 0, ptr);
      return Module['dynCall_' + sig].apply(null, args);
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  functionPointers: [],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2 + 2*i;
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xff;
      if (needed) {
        buffer.push(code);
        needed--;
      }
      if (buffer.length == 0) {
        if (code < 128) return String.fromCharCode(code);
        buffer.push(code);
        if (code > 191 && code < 224) {
          needed = 1;
        } else {
          needed = 2;
        }
        return '';
      }
      if (needed > 0) return '';
      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var ret;
      if (c1 > 191 && c1 < 224) {
        ret = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      } else {
        ret = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = ((((STACKTOP)+7)>>3)<<3); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = ((((STATICTOP)+7)>>3)<<3); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + size)|0;DYNAMICTOP = ((((DYNAMICTOP)+7)>>3)<<3); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+(((low)>>>(0))))+((+(((high)>>>(0))))*(+(4294967296)))) : ((+(((low)>>>(0))))+((+(((high)|(0))))*(+(4294967296))))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}
//========================================
// Runtime essentials
//========================================
var __THREW__ = 0; // Used in checking for thrown exceptions.
var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}
var globalScope = this;
// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays; note that arrays are 8-bit).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;
// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = Module['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}
// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length+1);
      writeStringToMemory(value, ret);
      return ret;
    } else if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}
// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;
// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,((Math.min((+(Math.floor((value)/(+(4294967296))))), (+(4294967295))))|0)>>>0],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;
// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;
var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;
// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }
  var singleType = typeof types === 'string' ? types : null;
  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }
  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }
  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }
  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];
    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }
    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later
    setValue(ret+i, curr, type);
    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }
  return ret;
}
Module['allocate'] = allocate;
function Pointer_stringify(ptr, /* optional */ length) {
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;
  var ret = '';
  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }
  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;
// Memory management
var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return ((x+4095)>>12)<<12;
}
var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk
function enlargeMemory() {
  abort('Cannot enlarge memory arrays in asm.js. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value, or (2) set Module.TOTAL_MEMORY before the program runs.');
}
var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;
// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(!!Int32Array && !!Float64Array && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'Cannot fallback to non-typed array case: Code is too specialized');
var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);
// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');
Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;
function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited
var runtimeInitialized = false;
function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}
function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}
function postRun() {
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
Module['addOnPreRun'] = Module.addOnPreRun = addOnPreRun;
function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
Module['addOnInit'] = Module.addOnInit = addOnInit;
function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
Module['addOnPreMain'] = Module.addOnPreMain = addOnPreMain;
function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
Module['addOnExit'] = Module.addOnExit = addOnExit;
function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
Module['addOnPostRun'] = Module.addOnPostRun = addOnPostRun;
// Tools
// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;
function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;
// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;
function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;
function unSign(value, bits, ignore, sig) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore, sig) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}
if (!Math['imul']) Math['imul'] = function(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
Math.imul = Math['imul'];
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyTracking = {};
var calledInit = false, calledRun = false;
var runDependencyWatcher = null;
function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
  } else {
    Module.printErr('warning: run dependency added without ID');
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    Module.printErr('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    } 
    // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
    if (!calledRun && shouldRunNow) run();
  }
}
Module['removeRunDependency'] = removeRunDependency;
Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data
function loadMemoryInitializer(filename) {
  function applyData(data) {
    HEAPU8.set(data, STATIC_BASE);
  }
  // always do this asynchronously, to keep shell and web as similar as possible
  addOnPreRun(function() {
    if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
      applyData(Module['readBinary'](filename));
    } else {
      Browser.asyncLoad(filename, function(data) {
        applyData(data);
      }, function(data) {
        throw 'could not load memory initializer ' + filename;
      });
    }
  });
}
// === Body ===
STATIC_BASE = 8;
STATICTOP = STATIC_BASE + 10672;
/* global initializers */ __ATINIT__.push({ func: function() { runPostSets() } });
var _stderr;
var _stderr = _stderr=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
/* memory initializer */ allocate([89,56,48,48,0,0,0,0,192,17,0,0,168,17,0,0,128,17,0,0,88,17,0,0,24,17,0,0,0,0,0,0,10,9,8,8,12,11,16,10,14,13,16,12,0,0,0,0,65,0,4,1,1,0,0,1,64,16,4,0,0,16,0,0,16,1,17,0,16,0,16,0,0,17,1,0,0,16,0,0,132,0,66,0,4,0,64,0,128,16,2,0,0,16,0,0,0,108,0,0,0,68,0,0,0,56,0,0,0,16,0,0,0,0,1,1,4,0,3,1,2,0,2,1,0,2,1,2,240,255,255,15,255,31,47,243,255,79,127,248,95,249,246,255,255,111,159,245,143,247,244,255,63,242,241,255,255,255,255,15,208,20,0,0,56,20,0,0,40,19,0,0,176,18,0,0,40,15,0,0,0,0,0,0,255,240,255,31,255,242,255,255,255,255,255,63,244,245,255,111,255,255,255,255,240,241,255,47,255,255,255,255,255,255,63,79,255,15,241,242,255,63,255,244,245,246,247,137,255,171,255,252,255,255,15,31,35,69,246,127,255,255,255,255,248,255,249,175,240,241,255,47,255,243,255,255,79,95,103,137,250,191,255,205,240,241,242,63,244,86,255,255,255,255,127,143,154,255,188,223,15,31,242,255,255,63,255,255,244,255,245,111,255,255,255,255,15,31,35,255,69,111,255,255,247,255,248,159,255,255,255,255,0,7,12,25,36,50,64,71,11,2,8,16,10,4,8,9,255,0,1,4,2,8,5,10,3,14,9,7,6,13,11,12,1,2,4,8,3,6,12,11,5,10,7,14,15,13,9,1,2,4,8,3,6,12,11,5,10,7,14,15,13,9,1,0,82,71,66,52,3,0,0,0,4,8,16,24,66,71,82,49,3,0,0,0,1,160,163,198,52,50,50,80,1,0,0,0,1,0,0,0,89,56,48,48,0,0,0,0,0,0,0,0,89,85,89,50,2,0,0,0,1,0,0,0,74,80,69,71,5,0,0,0,0,0,0,0,89,86,89,85,2,0,0,0,1,0,1,0,89,56,0,0,0,0,0,0,0,0,0,0,78,86,50,49,4,0,0,0,1,1,1,0,78,86,49,50,4,0,0,0,1,1,0,0,66,71,82,51,3,0,0,0,3,16,8,0,89,86,85,57,1,0,0,0,2,2,1,0,82,71,66,79,3,0,0,0,2,106,101,96,82,71,66,81,3,0,0,0,2,98,109,104,71,82,69,89,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,4,16,8,0,89,56,32,32,0,0,0,0,0,0,0,0,73,52,50,48,1,0,0,0,1,1,0,0,82,71,66,49,3,0,0,0,1,165,162,192,89,85,49,50,1,0,0,0,1,1,0,0,89,86,49,50,1,0,0,0,1,1,1,0,82,71,66,51,3,0,0,0,3,0,8,16,82,52,52,52,3,0,0,0,2,136,132,128,66,71,82,52,3,0,0,0,4,16,8,0,89,85,86,57,1,0,0,0,2,2,0,0,77,74,80,71,5,0,0,0,0,0,0,0,52,49,49,80,1,0,0,0,2,0,0,0,82,71,66,80,3,0,0,0,2,107,69,96,82,71,66,82,3,0,0,0,2,99,77,104,89,85,89,86,2,0,0,0,1,0,0,0,85,89,86,89,2,0,0,0,1,0,2,0,0,0,0,0,200,8,0,0,80,7,0,0,128,30,0,0,176,29,0,0,224,28,0,0,176,27,0,0,184,25,0,0,112,25,0,0,136,24,0,0,168,23,0,0,240,22,0,0,64,22,0,0,168,21,0,0,0,0,0,0,6,16,4,19,25,8,17,5,9,18,7,21,22,0,20,3,24,1,2,23,0,0,0,0,0,0,0,0,6,0,0,0,8,0,0,0,22,0,0,0,24,0,0,0,10,0,0,0,32,0,0,0,14,0,0,0,8,0,0,0,22,0,0,0,255,255,255,255,0,0,0,0,1,0,0,0,6,0,0,0,48,0,0,0,4,0,0,0,64,0,0,0,10,0,0,0,128,0,0,0,14,0,0,0,40,0,0,0,22,0,0,0,255,255,255,255,0,0,0,0,24,0,0,0,2,0,0,0,52,0,0,0,2,0,0,0,20,0,0,0,16,0,0,0,144,0,0,0,20,0,0,0,18,0,0,0,2,0,0,0,255,255,255,255,0,0,0,0,112,0,0,0,12,0,0,0,160,0,0,0,12,0,0,0,144,0,0,0,8,0,0,0,120,0,0,0,18,0,0,0,152,0,0,0,12,0,0,0,255,255,255,255,0,0,0,0,1,0,0,0,6,0,0,0,8,0,0,0,22,0,0,0,24,0,0,0,10,0,0,0,32,0,0,0,14,0,0,0,8,0,0,0,22,0,0,0,255,255,255,255,0,0,0,0,255,255,255,255,0,0,0,0,255,255,255,255,0,0,0,0,255,255,255,255,0,0,0,0,255,255,255,255,0,0,0,0,255,255,255,255,0,0,0,0,255,255,255,255,0,0,0,0,128,66,134,200,74,142,208,18,147,213,151,255,217,27,255,255,92,160,226,36,165,255,39,255,232,42,255,255,43,255,255,255,7,26,32,13,16,3,19,23,34,22,29,35,25,13,5,28,19,6,37,7,12,42,42,39,49,4,14,52,0,15,67,21,37,70,28,38,73,11,8,76,18,9,82,25,43,88,15,0,97,2,17,100,9,18,112,6,19,133,36,22,138,41,40,145,33,24,148,43,25,162,40,41,168,39,42,193,31,27,196,38,28,208,35,29,3,20,30,6,27,31,9,10,1,12,17,2,18,24,33,24,14,4,33,1,10,36,8,11,48,5,13,66,22,36,72,12,7,96,3,16,129,30,20,132,37,21,144,34,23,192,32,26,0,0,0,0,48,49,50,51,52,53,54,55,56,57,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,45,46,32,36,47,43,37,42,0,0,0,0,92,191,161,42,197,12,164,45,227,15,95,228,107,232,105,167,231,193,81,30,131,217,0,132,31,199,13,51,134,181,14,21,135,16,218,17,54,229,24,55,204,19,57,137,151,20,27,138,58,189,162,94,1,133,176,2,163,165,44,22,136,188,18,166,97,230,86,98,25,219,26,168,50,28,139,205,29,169,195,32,196,80,93,192,43,198,46,83,96,49,82,194,52,200,85,87,62,206,59,201,106,84,79,56,88,203,47,202,0,0,0,0,52,50,50,80,73,52,50,48,89,85,49,50,89,86,49,50,52,49,49,80,78,86,49,50,78,86,50,49,89,85,89,86,85,89,86,89,89,85,89,50,89,85,86,52,82,71,66,51,3,0,0,0,66,71,82,51,82,71,66,52,66,71,82,52,82,71,66,80,82,71,66,79,82,71,66,82,82,71,66,81,89,85,86,57,89,86,85,57,71,82,69,89,89,56,48,48,89,56,32,32,89,56,0,0,82,71,66,49,82,52,52,52,66,65,56,49,89,52,49,80,89,52,52,52,89,85,86,79,72,77,49,50,72,73,50,52,74,80,69,71,77,74,80,71,77,80,69,71,0,0,0,0,58,32,37,115,32,40,37,100,41,10,0,0,0,0,0,0,37,115,58,32,122,98,97,114,32,37,115,32,105,110,32,37,115,40,41,58,10,32,32,32,32,37,115,58,32,0,0,0,69,65,78,45,56,0,0,0,33,112,114,111,99,45,62,119,97,105,116,95,104,101,97,100,0,0,0,0,0,0,0,0,33,40,99,111,100,101,32,38,32,48,120,56,48,41,0,0,37,115,58,32,69,82,82,79,82,32,119,114,105,116,105,110,103,32,37,115,58,32,37,115,10,0,0,0,0,0,0,0,37,115,58,32,105,109,103,95,121,43,58,32,37,48,52,100,44,37,48,52,100,32,64,37,112,10,0,0,0,0,0,0,37,115,58,32,115,101,116,116,105,110,103,32,98,101,115,116,32,102,111,114,109,97,116,32,37,46,52,115,40,37,48,56,120,41,32,40,37,100,41,10,0,0,0,0,0,0,0,0,46,47,122,98,97,114,47,101,114,114,111,114,46,104,0,0,105,110,118,97,108,105,100,32,105,111,109,111,100,101,32,114,101,113,117,101,115,116,101,100,0,0,0,0,0,0,0,0,80,68,70,52,49,55,0,0,111,117,116,32,111,102,32,109,101,109,111,114,121,0,0,0,122,98,97,114,47,112,114,111,99,101,115,115,111,114,46,99,0,0,0,0,0,0,0,0,99,111,100,101,32,60,32,48,120,49,52,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,105,61,37,120,32,106,61,37,120,32,99,111,100,101,61,37,48,50,120,32,99,104,97,114,115,101,116,61,37,120,32,99,101,120,112,61,37,120,32,37,115,10,0,0,114,99,32,62,61,32,48,0,37,115,58,32,69,82,82,79,82,32,111,112,101,110,105,110,103,32,37,115,58,32,37,115,10,0,0,0,0,0,0,0,37,115,58,32,105,109,103,95,120,45,58,32,37,48,52,100,44,37,48,52,100,32,64,37,112,10,0,0,0,0,0,0,110,111,32,115,117,112,112,111,114,116,101,100,32,105,109,97,103,101,32,102,111,114,109,97,116,115,32,97,118,97,105,108,97,98,108,101,0,0,0,0,115,116,97,116,101,45,62,107,105,99,107,95,102,100,115,91,49,93,32,62,61,32,48,0,101,114,114,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,100,101,118,105,99,101,32,97,108,114,101,97,100,121,32,111,112,101,110,101,100,44,32,117,110,97,98,108,101,32,116,111,32,99,104,97,110,103,101,32,105,111,109,111,100,101,0,0,67,79,68,69,45,49,50,56,0,0,0,0,0,0,0,0,110,111,32,101,114,114,111,114,0,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,99,111,100,101,61,37,48,50,120,32,101,49,61,37,120,32,101,50,61,37,120,32,115,52,61,37,120,32,99,111,108,111,114,61,37,120,10,0,0,0,0,0,0,0,99,111,100,101,32,62,61,32,83,84,65,82,84,95,65,32,38,38,32,99,111,100,101,32,60,61,32,83,84,65,82,84,95,67,0,0,0,0,0,0,46,47,122,98,97,114,47,114,101,102,99,110,116,46,104,0,112,32,61,61,32,100,97,116,97,32,43,32,120,32,43,32,121,32,42,32,40,105,110,116,112,116,114,95,116,41,119,0,37,115,58,32,37,46,52,115,40,37,48,56,120,41,32,45,62,32,37,46,52,115,40,37,48,56,120,41,32,40,37,100,41,10,0,0,0,0,0,0,122,98,97,114,47,112,114,111,99,101,115,115,111,114,47,112,111,115,105,120,46,104,0,0,46,47,122,98,97,114,47,101,114,114,111,114,46,104,0,0,37,115,58,32,114,101,113,117,101,115,116,32,105,110,116,101,114,102,97,99,101,32,118,101,114,115,105,111,110,32,37,100,10,0,0,0,0,0,0,0,67,79,68,69,45,51,57,0,119,0,0,0,0,0,0,0,117,110,107,110,111,119,110,32,105,109,97,103,101,32,102,111,114,109,97,116,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,110,61,37,120,32,100,61,37,120,32,99,104,107,61,37,120,32,37,115,10,0,0,0,0,0,0,0,0,105,100,120,32,60,32,48,120,50,99,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,37,115,10,0,110,101,120,116,32,62,32,115,121,109,115,45,62,100,97,116,97,108,101,110,0,0,0,0,37,115,58,32,100,117,109,112,105,110,103,32,37,46,52,115,40,37,48,56,120,41,32,105,109,97,103,101,32,116,111,32,37,115,10,0,0,0,0,0,37,115,58,32,105,109,103,95,120,43,58,32,37,48,52,100,44,37,48,52,100,32,64,37,112,10,0,0,0,0,0,0,37,115,58,32,37,46,52,115,40,37,48,56,120,41,32,45,62,32,63,32,40,117,110,115,117,112,112,111,114,116,101,100,41,10,0,0,0,0,0,0,37,115,58,32,91,37,100,93,32,102,100,61,37,100,32,104,97,110,100,108,101,114,61,37,112,10,0,0,0,0,0,0,114,99,32,62,61,32,48,0,100,101,118,105,99,101,32,97,108,114,101,97,100,121,32,111,112,101,110,101,100,44,32,117,110,97,98,108,101,32,116,111,32,99,104,97,110,103,101,32,105,110,116,101,114,102,97,99,101,0,0,0,0,0,0,0,73,50,47,53,0,0,0,0,37,120,0,0,0,0,0,0,110,101,119,0,0,0,0,0,122,98,97,114,0,0,0,0,99,104,107,32,60,32,49,48,0,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,32,105,100,120,61,37,120,32,101,110,99,61,37,120,32,115,57,61,37,120,10,0,0,0,0,0,0,0,100,99,111,100,101,45,62,98,117,102,91,100,99,111,100,101,49,50,56,45,62,99,104,97,114,97,99,116,101,114,32,45,32,49,93,32,61,61,32,83,84,79,80,95,70,87,68,0,122,98,97,114,47,113,114,99,111,100,101,47,113,114,100,101,99,116,120,116,46,99,0,0,110,32,60,32,108,101,110,0,33,115,121,109,45,62,115,121,109,115,0,0,0,0,0,0,110,111,32,105,110,112,117,116,32,111,114,32,111,117,116,112,117,116,32,102,111,114,109,97,116,115,32,97,118,97,105,108,97,98,108,101,0,0,0,0,112,114,111,99,45,62,116,104,114,101,97,100,101,100,0,0,46,47,122,98,97,114,47,114,101,102,99,110,116,46,104,0,37,115,58,32,114,101,113,117,101,115,116,32,115,105,122,101,58,32,37,100,32,120,32,37,100,10,0,0,0,0,0,0,73,83,66,78,45,49,51,0,37,100,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,119,61,37,120,32,100,61,37,120,32,99,104,107,61,37,120,32,37,115,10,0,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,99,61,37,48,50,120,32,115,57,61,37,120,10,0,0,0,0,0,0,0,100,117,112,108,105,99,97,116,101,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,99,104,107,61,37,120,32,110,61,37,120,32,37,115,0,0,0,0,0,0,101,110,99,32,60,32,48,120,50,48,0,0,0,0,0,0,100,99,111,100,101,45,62,98,117,102,91,100,99,111,100,101,49,50,56,45,62,99,104,97,114,97,99,116,101,114,32,45,32,49,93,32,61,61,32,83,84,79,80,95,82,69,86,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,97,108,108,111,99,61,37,120,32,105,100,120,61,37,120,32,99,61,37,48,50,120,32,37,115,10,0,0,67,80,52,51,55,0,0,0,37,115,46,37,48,56,120,46,122,105,109,103,0,0,0,0,105,115,99,110,45,62,114,101,99,121,99,108,101,91,105,93,46,110,115,121,109,115,0,0,105,109,97,103,101,32,102,111,114,109,97,116,32,108,105,115,116,32,105,115,32,110,111,116,32,115,111,114,116,101,100,33,63,0,0,0,0,0,0,0,122,98,97,114,47,112,114,111,99,101,115,115,111,114,47,112,111,115,105,120,46,99,0,0,98,117,102,91,37,48,52,120,93,61,0,0,0,0,0,0,97,108,114,101,97,100,121,32,105,110,105,116,105,97,108,105,122,101,100,44,32,117,110,97,98,108,101,32,116,111,32,114,101,115,105,122,101,0,0,0,69,65,78,45,49,51,0,0,60,63,62,0,0,0,0,0,85,84,70,45,56,0,0,0,37,115,58,32,109,97,120,32,102,105,110,100,101,114,32,108,105,110,101,115,32,61,32,37,100,120,37,100,10,0,0,0,60,117,110,107,110,111,119,110,62,0,0,0,0,0,0,0,117,110,99,101,114,116,97,105,110,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,105,61,37,120,32,100,61,37,120,32,99,104,107,61,37,120,32,37,115,10,0,0,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,32,101,110,99,61,37,120,32,115,57,61,37,120,10,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,100,105,114,61,37,120,32,37,115,10,0,0,73,83,79,56,56,53,57,45,37,105,0,0,0,0,0,0,115,121,109,45,62,100,97,116,97,0,0,0,0,0,0,0,37,115,46,37,46,52,115,46,122,105,109,103,0,0,0,0,122,98,97,114,47,105,109,103,95,115,99,97,110,110,101,114,46,99,0,0,0,0,0,0,37,115,58,32,107,105,99,107,105,110,103,32,37,100,32,102,100,115,10,0,0,0,0,0,112,114,111,99,45,62,108,111,99,107,95,108,101,118,101,108,32,61,61,32,49,0,0,0,118,105,100,101,111,32,100,114,105,118,101,114,32,100,111,101,115,32,110,111,116,32,115,117,112,112,111,114,116,32,112,111,108,108,105,110,103,0,0,0,85,80,67,45,65,0,0,0,37,115,58,32,115,104,97,114,101,100,32,102,111,114,109,97,116,58,32,37,52,46,52,115,10,0,0,0,0,0,0,0,122,98,97,114,47,105,109,97,103,101,46,99,0,0,0,0,122,98,97,114,47,101,114,114,111,114,46,99,0,0,0,0,110,111,116,32,99,111,109,112,105,108,101,100,32,119,105,116,104,32,118,105,100,101,111,32,105,110,112,117,116,32,115,117,112,112,111,114,116,0,0,0,78,79,84,69,0,0,0,0,115,114,99,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,105,109,103,45,62,115,114,99,105,100,120,32,62,61,32,48,0,0,0,0,0,0,0,0,87,65,82,78,73,78,71,0,100,115,116,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,79,75,0,0,0,0,0,0,101,114,114,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,69,82,82,79,82,0,0,0,46,47,122,98,97,114,47,101,114,114,111,114,46,104,0,0,70,65,84,65,76,32,69,82,82,79,82,0,0,0,0,0,37,115,58,32,37,115,37,115,58,32,37,115,32,40,37,100,32,112,116,115,41,32,40,113,61,37,100,41,32,40,37,115,41,10,0,0,0,0,0,0,101,114,114,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,122,98,97,114,47,112,114,111,99,101,115,115,111,114,47,108,111,99,107,46,99,0,0,0,37,115,0,0,0,0,0,0,100,32,60,32,49,48,0,0,122,98,97,114,32,98,97,114,99,111,100,101,32,114,101,97,100,101,114,0,0,0,0,0,99,32,60,32,48,120,50,99,0,0,0,0,0,0,0,0,100,99,111,100,101,45,62,98,117,102,95,97,108,108,111,99,32,62,32,100,99,111,100,101,49,50,56,45,62,99,104,97,114,97,99,116,101,114,0,0,114,99,32,62,61,32,48,0,32,0,0,0,0,0,0,0,46,47,122,98,97,114,47,101,114,114,111,114,46,104,0,0,105,109,97,103,101,32,115,99,97,110,110,101,114,0,0,0,83,74,73,83,0,0,0,0,118,105,100,101,111,32,105,110,112,117,116,32,110,111,116,32,105,110,105,116,105,97,108,105,122,101,100,0,0,0,0,0,48,0,0,0,0,0,0,0,46,47,122,98,97,114,47,114,101,102,99,110,116,46,104,0,37,115,58,32,32,32,32,32,91,37,48,50,100,93,32,64,37,48,56,108,120,10,0,0,32,37,46,52,115,40,37,48,56,120,41,61,37,100,0,0,119,105,110,100,111,119,0,0,101,114,114,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,110,111,116,32,99,111,109,112,105,108,101,100,32,119,105,116,104,32,111,117,116,112,117,116,32,119,105,110,100,111,119,32,115,117,112,112,111,114,116,0,100,105,115,112,108,97,121,32,119,105,110,100,111,119,32,110,111,116,32,97,118,97,105,108,97,98,108,101,32,102,111,114,32,105,110,112,117,116,0,0,37,115,58,32,91,37,100,93,32,102,100,61,37,100,32,110,61,37,100,10,0,0,0,0,119,32,61,61,32,119,97,105,116,101,114,0,0,0,0,0,37,115,58,32,100,115,116,61,37,100,120,37,100,32,40,37,108,120,41,32,37,108,120,32,115,114,99,61,37,100,120,37,100,32,37,108,120,10,0,0,101,114,114,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,101,114,114,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,85,83,69,82,80,84,82,0,118,105,100,101,111,0,0,0,110,111,116,32,99,111,109,112,105,108,101,100,32,119,105,116,104,32,111,117,116,112,117,116,32,119,105,110,100,111,119,32,115,117,112,112,111,114,116,0,105,100,120,32,60,61,32,48,120,53,48,0,0,0,0,0,118,105,100,101,111,32,100,101,118,105,99,101,32,110,111,116,32,111,112,101,110,101,100,0,115,114,99,45,62,100,97,116,97,108,101,110,32,62,61,32,115,114,99,45,62,119,105,100,116,104,32,42,32,115,114,99,45,62,104,101,105,103,104,116,0,0,0,0,0,0,0,0,82,69,65,68,0,0,0,0,73,83,66,78,45,49,48,0,112,114,111,99,101,115,115,111,114,0,0,0,0,0,0,0,110,111,32,99,111,109,112,97,116,105,98,108,101,32,105,109,97,103,101,32,102,111,114,109,97,116,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,115,105,103,61,37,120,32,111,102,102,115,101,116,61,37,120,32,98,97,115,101,61,37,120,32,105,100,120,61,37,120,10,0,0,0,0,115,114,99,45,62,100,97,116,97,108,101,110,32,62,61,32,115,114,99,110,32,43,32,50,32,42,32,115,114,99,110,0,37,115,58,32,112,114,101,45,97,108,108,111,99,97,116,101,100,32,37,100,32,37,115,32,98,117,102,102,101,114,115,32,115,105,122,101,61,48,120,37,108,120,10,0,0,0,0,0,114,99,32,62,61,32,48,0,117,110,107,110,111,119,110,32,101,114,114,111,114,0,0,0,122,105,109,97,103,101,0,0,85,80,67,45,69,0,0,0,119,105,110,100,111,119,32,111,117,116,112,117,116,0,0,0,98,97,115,101,32,60,32,56,0,0,0,0,0,0,0,0,115,114,99,45,62,100,97,116,97,108,101,110,32,62,61,32,115,114,99,110,32,43,32,50,32,42,32,115,114,99,109,0,117,110,97,98,108,101,32,116,111,32,97,108,108,111,99,97,116,101,32,105,109,97,103,101,32,98,117,102,102,101,114,115,0,0,0,0,0,0,0,0,46,47,122,98,97,114,47,114,101,102,99,110,116,46,104,0,119,105,110,100,111,119,115,32,115,121,115,116,101,109,32,101,114,114,111,114,0,0,0,0,118,105,100,101,111,32,105,110,112,117,116,0,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,115,105,103,61,37,120,32,111,102,102,115,101,116,61,37,120,32,105,100,120,61,37,120,32,98,97,115,101,61,37,120,10,0,0,0,0,114,99,32,62,61,32,48,0,115,114,99,102,109,116,45,62,112,46,121,117,118,46,120,115,117,98,50,32,61,61,32,49,0,0,0,0,0,0,0,0,33,118,100,111,45,62,98,117,102,0,0,0,0,0,0,0,111,117,116,112,117,116,32,119,105,110,100,111,119,32,105,115,32,99,108,111,115,101,100,0,37,115,58,32,69,82,82,79,82,58,32,110,111,32,99,111,109,112,97,116,105,98,108,101,32,37,115,32,102,111,114,109,97,116,10,0,0,0,0,0,97,99,99,32,60,32,49,48,51,0,0,0,0,0,0,0,46,47,122,98,97,114,47,114,101,102,99,110,116,46,104,0,115,114,99,45,62,100,97,116,97,108,101,110,32,62,61,32,40,115,114,99,45,62,119,105,100,116,104,32,42,32,115,114,99,45,62,104,101,105,103,104,116,32,43,32,117,118,112,95,115,105,122,101,40,115,114,99,44,32,115,114,99,102,109,116,41,32,42,32,50,41,0,0,118,100,111,45,62,100,97,116,97,108,101,110,0,0,0,0,88,49,49,32,112,114,111,116,111,99,111,108,32,101,114,114,111,114,0,0,0,0,0,0,87,65,82,78,73,78,71,58,32,110,111,32,99,111,109,112,97,116,105,98,108,101,32,105,110,112,117,116,32,116,111,32,111,117,116,112,117,116,32,102,111,114,109,97,116,10,46,46,46,116,114,121,105,110,103,32,97,103,97,105,110,32,119,105,116,104,32,111,117,116,112,117,116,32,100,105,115,97,98,108,101,100,10,0,0,0,0,0,115,117,109,32,60,32,49,48,51,0,0,0,0,0,0,0,108,105,110,101,0,0,0,0,115,114,99,45,62,100,97,116,97,108,101,110,32,62,61,32,40,115,114,99,45,62,119,105,100,116,104,32,42,32,115,114,99,45,62,104,101,105,103,104,116,32,42,32,115,114,99,102,109,116,45,62,112,46,114,103,98,46,98,112,112,41,0,0,105,109,103,45,62,115,114,99,105,100,120,32,61,61,32,45,49,0,0,0,0,0,0,0,88,49,49,32,100,105,115,112,108,97,121,32,101,114,114,111,114,0,0,0,0,0,0,0,115,112,97,119,110,105,110,103,32,105,110,112,117,116,32,116,104,114,101,97,100,0,0,0,37,115,58,32,112,114,111,99,101,115,115,105,110,103,58,32,37,46,52,115,40,37,48,56,120,41,32,37,100,120,37,100,32,64,37,112,10,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,100,105,114,61,37,120,32,105,61,37,120,32,115,117,109,61,37,120,32,97,99,99,61,37,120,32,37,115,10,0,0,0,0,0,0,0,37,115,58,32,32,32,32,32,32,114,101,99,121,99,108,101,100,91,37,100,93,32,32,32,32,32,32,32,32,61,32,37,45,52,100,10,0,0,0,0,122,98,97,114,47,99,111,110,118,101,114,116,46,99,0,0,118,100,111,0,0,0,0,0,97,108,108,32,114,101,115,111,117,114,99,101,115,32,98,117,115,121,0,0,0,0,0,0,122,98,97,114,47,100,101,99,111,100,101,114,47,101,97,110,46,99,0,0,0,0,0,0,122,98,97,114,47,100,101,99,111,100,101,114,47,99,111,100,101,51,57,46,99,0,0,0,108,111,99,107,105,110,103,32,101,114,114,111,114,0,0,0,115,112,97,119,110,105,110,103,32,118,105,100,101,111,32,116,104,114,101,97,100,0,0,0,99,111,100,101,32,60,61,32,57,0,0,0,0,0,0,0,122,98,97,114,47,100,101,99,111,100,101,114,47,99,111,100,101,49,50,56,46,99,0,0,37,115,58,32,115,121,109,98,111,108,115,32,97,108,108,111,99,97,116,101,100,32,32,32,32,32,32,32,61,32,37,45,52,100,10,0,0,0,0,0,37,115,58,32,99,108,111,115,101,100,32,99,97,109,101,114,97,32,40,102,100,61,37,100,41,10,0,0,0,0,0,0,37,115,37,48,50,120,0,0,114,99,32,62,61,32,48,0,101,114,114,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,73,83,79,56,56,53,57,45,49,0,0,0,0,0,0,0,37,115,58,32,37,100,120,37,100,32,102,105,110,100,101,114,115,44,32,37,100,32,99,101,110,116,101,114,115,58,10,0,97,108,108,111,99,97,116,105,110,103,32,118,105,100,101,111,32,114,101,115,111,117,114,99,101,115,0,0,0,0,0,0,100,99,111,100,101,45,62,98,117,102,91,106,93,32,60,61,32,39,57,39,0,0,0,0,37,115,58,32,32,32,32,32,105,109,97,103,101,32,115,121,109,115,32,105,110,32,117,115,101,32,32,32,61,32,37,45,52,100,9,114,101,99,121,99,108,101,100,32,32,61,32,37,45,52,100,10,0,0,0,0,115,121,109,45,62,100,97,116,97,95,97,108,108,111,99,0,69,82,82,79,82,58,32,105,109,97,103,101,32,102,111,114,109,97,116,32,108,105,115,116,32,105,115,32,110,111,116,32,115,111,114,116,101,100,33,63,10,0,0,0,0,0,0,0,116,105,109,101,111,117,116,32,62,32,48,0,0,0,0,0,46,47,122,98,97,114,47,114,101,102,99,110,116,46,104,0,43,53,0,0,0,0,0,0,105,109,103,45,62,114,101,102,99,110,116,0,0,0,0,0,37,115,58,32,102,114,111,109,32,37,46,52,115,40,37,48,56,120,41,32,116,111,0,0,115,121,115,116,101,109,32,101,114,114,111,114,0,0,0,0,46,47,122,98,97,114,47,101,114,114,111,114,46,104,0,0,97,108,108,111,99,97,116,105,110,103,32,119,105,110,100,111,119,32,114,101,115,111,117,114,99,101,115,0,0,0,0,0,102,97,105,108,101,100,32,116,111,32,111,112,101,110,32,112,105,112,101,0,0,0,0,0,112,114,111,99,45,62,108,111,99,107,95,108,101,118,101,108,32,62,32,48,0,0,0,0,87,65,82,78,73,78,71,58,32,37,115,58,37,100,58,32,37,115,58,32,65,115,115,101,114,116,105,111,110,32,34,37,115,34,32,102,97,105,108,101,100,46,10,9,115,116,97,114,116,61,37,120,32,101,110,100,61,37,120,32,105,61,37,120,32,106,61,37,120,32,37,115,10,0,0,0,0,0,0,0,37,115,58,32,32,32,32,32,115,99,97,110,110,101,114,32,115,121,109,115,32,105,110,32,117,115,101,32,61,32,37,45,52,100,9,114,101,99,121,99,108,101,100,32,32,61,32,37,45,52,100,10,0,0,0,0,46,47,122,98,97,114,47,101,114,114,111,114,46,104,0,0,33,114,99,0,0,0,0,0,46,47,122,98,97,114,47,101,114,114,111,114,46,104,0,0,105,109,103,0,0,0,0,0,43,50,0,0,0,0,0,0,105,110,118,97,108,105,100,32,114,101,113,117,101,115,116,0,33,112,114,111,99,45,62,119,97,105,116,95,110,101,120,116,0,0,0,0,0,0,0,0,99,111,100,101,32,62,61,32,67,79,68,69,95,67,32,38,38,32,99,111,100,101,32,60,61,32,67,79,68,69,95,65,0,0,0,0,0,0,0,0,47,100,101,118,47,118,105,100,101,111,48,0,0,0,0,0,114,99,32,62,61,32,48,0,37,115,58,32,115,121,109,98,111,108,32,115,101,116,115,32,97,108,108,111,99,97,116,101,100,32,32,32,61,32,37,45,52,100,10,0,0,0,0,0,101,114,114,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,112,45,62,110,117,109,0,0,122,98,97,114,47,118,105,100,101,111,46,99,0,0,0,0,85,78,75,78,79,87,78,0,117,110,115,117,112,112,111,114,116,101,100,32,114,101,113,117,101,115,116,0,0,0,0,0,33,112,114,111,99,45,62,119,97,105,116,95,116,97,105,108,0,0,0,0,0,0,0,0,99,101,120,112,0,0,0,0,46,47,122,98,97,114,47,114,101,102,99,110,116,46,104,0,37,115,58,32,105,109,103,95,121,45,58,32,37,48,52,100,44,37,48,52,100,32,64,37,112,10,0,0,0,0,0,0,46,47,122,98,97,114,47,101,114,114,111,114,46,104,0,0,101,114,114,45,62,109,97,103,105,99,32,61,61,32,69,82,82,73,78,70,79,95,77,65,71,73,67,0,0,0,0,0,97,108,114,101,97,100,121,32,105,110,105,116,105,97,108,105,122,101,100,44,32,114,101,45,105,110,105,116,32,117,110,105,109,112,108,101,109,101,110,116,101,100,0,0,0,0,0,0,81,82,45,67,111,100,101,0,105,110,116,101,114,110,97,108,32,108,105,98,114,97,114,121,32,101,114,114,111,114,0,0,112,114,111,99,101,115,115,111,114,0,0,0,0,0,0,0,46,46,47,116,101,109,112,108,97,116,101,115,47,122,98,97,114,45,109,97,105,110,46,99,0,0,0,0,0,0,0,0,122,98,97,114,95,118,105,100,101,111,95,114,101,113,117,101,115,116,95,115,105,122,101,0,122,98,97,114,95,118,105,100,101,111,95,114,101,113,117,101,115,116,95,105,111,109,111,100,101,0,0,0,0,0,0,0,122,98,97,114,95,118,105,100,101,111,95,114,101,113,117,101,115,116,95,105,110,116,101,114,102,97,99,101,0,0,0,0,122,98,97,114,95,118,105,100,101,111,95,111,112,101,110,0,122,98,97,114,95,118,105,100,101,111,95,110,101,120,116,95,105,109,97,103,101,0,0,0,122,98,97,114,95,118,105,100,101,111,95,105,110,105,116,0,122,98,97,114,95,118,105,100,101,111,95,103,101,116,95,102,100,0,0,0,0,0,0,0,122,98,97,114,95,118,105,100,101,111,95,101,110,97,98,108,101,0,0,0,0,0,0,0,122,98,97,114,95,115,99,97,110,95,105,109,97,103,101,0,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,117,115,101,114,95,119,97,105,116,0,0,0,0,0,0,0,0,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,115,101,116,95,97,99,116,105,118,101,0,0,0,0,0,0,0,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,105,110,105,116,0,0,0,0,0,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,100,101,115,116,114,111,121,0,0,122,98,97,114,95,110,101,103,111,116,105,97,116,101,95,102,111,114,109,97,116,0,0,0,122,98,97,114,95,105,109,97,103,101,95,119,114,105,116,101,0,0,0,0,0,0,0,0,122,98,97,114,95,105,109,97,103,101,95,102,114,101,101,95,100,97,116,97,0,0,0,0,118,105,100,101,111,95,105,110,105,116,95,105,109,97,103,101,115,0,0,0,0,0,0,0,118,97,108,105,100,97,116,101,95,99,104,101,99,107,115,117,109,0,0,0,0,0,0,0,114,101,109,111,118,101,95,112,111,108,108,0,0,0,0,0,113,114,95,104,97,110,100,108,101,114,0,0,0,0,0,0,113,114,95,99,111,100,101,95,100,97,116,97,95,108,105,115,116,95,101,120,116,114,97,99,116,95,116,101,120,116,0,0,112,114,111,99,95,115,108,101,101,112,0,0,0,0,0,0,112,114,111,99,95,112,111,108,108,95,105,110,112,117,116,115,0,0,0,0,0,0,0,0,112,114,111,99,95,107,105,99,107,95,104,97,110,100,108,101,114,0,0,0,0,0,0,0,112,111,115,116,112,114,111,99,101,115,115,95,99,0,0,0,112,111,115,116,112,114,111,99,101,115,115,0,0,0,0,0,105,115,98,110,49,48,95,99,97,108,99,95,99,104,101,99,107,115,117,109,0,0,0,0,101,114,114,95,99,111,112,121,0,0,0,0,0,0,0,0,101,114,114,95,99,108,101,97,110,117,112,0,0,0,0,0,101,114,114,95,99,108,101,97,110,117,112,0,0,0,0,0,101,114,114,95,99,108,101,97,110,117,112,0,0,0,0,0,101,114,114,95,99,97,112,116,117,114,101,0,0,0,0,0,101,114,114,95,99,97,112,116,117,114,101,0,0,0,0,0,101,114,114,95,99,97,112,116,117,114,101,0,0,0,0,0,101,114,114,95,99,97,112,116,117,114,101,0,0,0,0,0,101,114,114,95,99,97,112,116,117,114,101,0,0,0,0,0,101,114,114,95,99,97,112,116,117,114,101,0,0,0,0,0,101,114,114,95,99,97,112,116,117,114,101,0,0,0,0,0,101,97,110,95,118,101,114,105,102,121,95,99,104,101,99,107,115,117,109,0,0,0,0,0,100,117,109,112,95,115,116,97,116,115,0,0,0,0,0,0,100,101,99,111,100,101,95,108,111,0,0,0,0,0,0,0,100,101,99,111,100,101,52,0,99,111,110,118,101,114,116,95,121,117,118,112,95,116,111,95,114,103,98,0,0,0,0,0,99,111,110,118,101,114,116,95,121,117,118,95,116,111,95,114,103,98,0,0,0,0,0,0,99,111,110,118,101,114,116,95,121,117,118,95,112,97,99,107,0,0,0,0,0,0,0,0,99,111,110,118,101,114,116,95,117,118,112,95,97,112,112,101,110,100,0,0,0,0,0,0,99,111,110,118,101,114,116,95,114,103,98,95,116,111,95,121,117,118,112,0,0,0,0,0,99,111,110,118,101,114,116,95,114,103,98,95,116,111,95,121,117,118,0,0,0,0,0,0,99,111,110,118,101,114,116,95,114,103,98,95,114,101,115,97,109,112,108,101,0,0,0,0,99,111,100,101,51,57,95,100,101,99,111,100,101,57,0,0,97,100,100,95,112,111,108,108,0,0,0,0,0,0,0,0,95,122,98,97,114,95,119,105,110,100,111,119,95,97,116,116,97,99,104,0,0,0,0,0,95,122,98,97,114,95,118,105,100,101,111,95,114,101,99,121,99,108,101,95,115,104,97,100,111,119,0,0,0,0,0,0,95,122,98,97,114,95,118,105,100,101,111,95,114,101,99,121,99,108,101,95,105,109,97,103,101,0,0,0,0,0,0,0,95,122,98,97,114,95,118,105,100,101,111,95,111,112,101,110,0,0,0,0,0,0,0,0,95,122,98,97,114,95,114,101,102,99,110,116,0,0,0,0,95,122,98,97,114,95,114,101,102,99,110,116,0,0,0,0,95,122,98,97,114,95,114,101,102,99,110,116,0,0,0,0,95,122,98,97,114,95,114,101,102,99,110,116,0,0,0,0,95,122,98,97,114,95,114,101,102,99,110,116,0,0,0,0,95,122,98,97,114,95,114,101,102,99,110,116,0,0,0,0,95,122,98,97,114,95,114,101,102,99,110,116,0,0,0,0,95,122,98,97,114,95,113,114,95,100,101,115,116,114,111,121,0,0,0,0,0,0,0,0,95,122,98,97,114,95,113,114,95,100,101,99,111,100,101,0,95,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,119,97,105,116,0,0,0,0,95,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,117,110,108,111,99,107,0,0,95,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,115,101,116,95,115,105,122,101,0,0,0,0,0,0,0,0,95,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,111,112,101,110,0,0,0,0,95,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,105,110,118,97,108,105,100,97,116,101,0,0,0,0,0,0,95,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,105,110,105,116,0,0,0,0,95,122,98,97,114,95,112,114,111,99,101,115,115,111,114,95,99,108,111,115,101,0,0,0,95,122,98,97,114,95,112,114,111,99,101,115,115,95,105,109,97,103,101,0,0,0,0,0,95,122,98,97,114,95,105,109,97,103,101,95,115,99,97,110,110,101,114,95,114,101,99,121,99,108,101,95,115,121,109,115,0,0,0,0,0,0,0,0,95,122,98,97,114,95,105,109,97,103,101,95,115,99,97,110,110,101,114,95,97,108,108,111,99,95,115,121,109,0,0,0,95,122,98,97,114,95,101,114,114,111,114,95,115,116,114,105,110,103,0,0,0,0,0,0,95,122,98,97,114,95,101,114,114,111,114,95,115,112,101,119,0,0,0,0,0,0,0,0,95,122,98,97,114,95,100,101,99,111,100,101,95,99,111,100,101,51,57,0,0,0,0,0,95,122,98,97,114,95,100,101,99,111,100,101,95,99,111,100,101,49,50,56,0,0,0,0,95,122,98,97,114,95,98,101,115,116,95,102,111,114,109,97,116,0,0,0,0,0,0,0,90,66,97,114,80,114,111,99,101,115,115,73,109,97,103,101,68,97,116,97,0,0,0,0,7,10,13,17,10,16,22,28,26,26,26,22,24,22,22,26,24,18,22,15,26,18,22,24,30,24,20,24,18,16,24,28,28,28,28,30,24,20,18,18,26,24,28,24,30,26,28,28,26,28,30,30,22,20,24,20,18,26,16,20,30,28,24,22,26,28,26,30,28,30,30,0,0,4,19,55,15,28,37,12,51,39,59,62,10,24,22,41,31,44,7,65,47,33,67,67,48,32,67,67,67,67,67,67,67,67,67,67,67,67,67,67,1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81,48,49,50,51,52,53,54,55,56,57,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,32,36,37,42,43,45,46,47,58,0,0,0,16,18,20,22,24,26,28,20,22,24,24,26,28,28,22,24,24,26,26,28,28,24,24,26,26,26,28,28,24,26,26,26,28,28,0,0,0,0,0,0,148,124,0,0,188,133,0,0,153,154,0,0,211,164,0,0,246,187,0,0,98,199,0,0,71,216,0,0,13,230,0,0,40,249,0,0,120,11,1,0,93,20,1,0,23,42,1,0,50,53,1,0,166,73,1,0,131,86,1,0,201,104,1,0,236,119,1,0,196,142,1,0,225,145,1,0,171,175,1,0,142,176,1,0,26,204,1,0,63,211,1,0,117,237,1,0,80,242,1,0,213,9,2,0,240,22,2,0,186,40,2,0,159,55,2,0,11,75,2,0,46,84,2,0,100,106,2,0,65,117,2,0,105,140,2,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE)
var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);
assert(tempDoublePtr % 8 == 0);
function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
}
function copyTempDouble(ptr) {
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];
  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];
  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];
  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];
}
  function ___assert_func(filename, line, func, condition) {
      throw 'Assertion failed: ' + (condition ? Pointer_stringify(condition) : 'unknown condition') + ', at: ' + [filename ? Pointer_stringify(filename) : 'unknown filename', line, func ? Pointer_stringify(func) : 'unknown function'] + ' at ' + new Error().stack;
    }
  function _js_get_width() { return Module['imageWidth']; }
  function _js_get_height() { return Module['imageHeight']; }
  function _js_read_image(dataPtr, len) {
      var HEAPU8 = Module['HEAPU8'];
      var array = HEAPU8.subarray(dataPtr, dataPtr + len);
      Module['getImageData'](array);
      return array.length;
    }
  function _js_output_result(symbol, addon, data) {
      var Pointer_stringify = Module['Pointer_stringify'];
      Module['outputResult'](Pointer_stringify(symbol),
                             Pointer_stringify(addon),
                             Pointer_stringify(data));
    }
  Module["_memcpy"] = _memcpy;var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;
  Module["_strlen"] = _strlen;
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = HEAPF64[(((varargs)+(argIndex))>>3)];
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+8))>>2)]];
          argIndex += 8; // each 32-bit chunk is in a 64-bit block
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Math.max(Runtime.getNativeFieldSize(type), Runtime.getAlignSize(type, null, true));
        return ret;
      }
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)|0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          }
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
          }
          // Handle precision.
          var precisionSet = false;
          if (next == 46) {
            var precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)|0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)|0)];
          } else {
            var precision = 6; // Standard default.
          }
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)|0)];
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
              // Add sign if needed
              if (flagAlwaysSigned) {
                if (currArg < 0) {
                  prefix = '-' + prefix;
                } else {
                  prefix = '+' + prefix;
                }
              }
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
                // Add sign.
                if (flagAlwaysSigned && currArg >= 0) {
                  argText = '+' + argText;
                }
              }
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)|0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[(i)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _snprintf(s, n, format, varargs) {
      // int snprintf(char *restrict s, size_t n, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var limit = (n === undefined) ? result.length
                                    : Math.min(result.length, Math.max(n - 1, 0));
      if (s < 0) {
        s = -s;
        var buf = _malloc(limit+1);
        HEAP32[((s)>>2)]=buf;
        s = buf;
      }
      for (var i = 0; i < limit; i++) {
        HEAP8[(((s)+(i))|0)]=result[i];
      }
      if (limit < n || (n === undefined)) HEAP8[(((s)+(i))|0)]=0;
      return result.length;
    }function _sprintf(s, format, varargs) {
      // int sprintf(char *restrict s, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      return _snprintf(s, undefined, format, varargs);
    }
  function _strstr(ptr1, ptr2) {
      var check = 0, start;
      do {
        if (!check) {
          start = ptr1;
          check = ptr2;
        }
        var curr1 = HEAP8[((ptr1++)|0)];
        var curr2 = HEAP8[((check++)|0)];
        if (curr2 == 0) return start;
        if (curr2 != curr1) {
          // rewind to one character after start, to find ez in eeez
          ptr1 = start + 1;
          check = 0;
        }
      } while (curr1);
      return 0;
    }
  function _strdup(ptr) {
      var len = _strlen(ptr);
      var newStr = _malloc(len + 1);
      (_memcpy(newStr, ptr, len)|0);
      HEAP8[(((newStr)+(len))|0)]=0;
      return newStr;
    }
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:35,EIDRM:36,ECHRNG:37,EL2NSYNC:38,EL3HLT:39,EL3RST:40,ELNRNG:41,EUNATCH:42,ENOCSI:43,EL2HLT:44,EDEADLK:45,ENOLCK:46,EBADE:50,EBADR:51,EXFULL:52,ENOANO:53,EBADRQC:54,EBADSLT:55,EDEADLOCK:56,EBFONT:57,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:74,ELBIN:75,EDOTDOT:76,EBADMSG:77,EFTYPE:79,ENOTUNIQ:80,EBADFD:81,EREMCHG:82,ELIBACC:83,ELIBBAD:84,ELIBSCN:85,ELIBMAX:86,ELIBEXEC:87,ENOSYS:88,ENMFILE:89,ENOTEMPTY:90,ENAMETOOLONG:91,ELOOP:92,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:106,EPROTOTYPE:107,ENOTSOCK:108,ENOPROTOOPT:109,ESHUTDOWN:110,ECONNREFUSED:111,EADDRINUSE:112,ECONNABORTED:113,ENETUNREACH:114,ENETDOWN:115,ETIMEDOUT:116,EHOSTDOWN:117,EHOSTUNREACH:118,EINPROGRESS:119,EALREADY:120,EDESTADDRREQ:121,EMSGSIZE:122,EPROTONOSUPPORT:123,ESOCKTNOSUPPORT:124,EADDRNOTAVAIL:125,ENETRESET:126,EISCONN:127,ENOTCONN:128,ETOOMANYREFS:129,EPROCLIM:130,EUSERS:131,EDQUOT:132,ESTALE:133,ENOTSUP:134,ENOMEDIUM:135,ENOSHARE:136,ECASECLASH:137,EILSEQ:138,EOVERFLOW:139,ECANCELED:140,ENOTRECOVERABLE:141,EOWNERDEAD:142,ESTRPIPE:143};
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"No message of desired type",36:"Identifier removed",37:"Channel number out of range",38:"Level 2 not synchronized",39:"Level 3 halted",40:"Level 3 reset",41:"Link number out of range",42:"Protocol driver not attached",43:"No CSI structure available",44:"Level 2 halted",45:"Deadlock condition",46:"No record locks available",50:"Invalid exchange",51:"Invalid request descriptor",52:"Exchange full",53:"No anode",54:"Invalid request code",55:"Invalid slot",56:"File locking deadlock error",57:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",74:"Multihop attempted",75:"Inode is remote (not really error)",76:"Cross mount point (not really error)",77:"Trying to read unreadable message",79:"Inappropriate file type or format",80:"Given log. name not unique",81:"f.d. invalid for this operation",82:"Remote address changed",83:"Can\t access a needed shared lib",84:"Accessing a corrupted shared lib",85:".lib section in a.out corrupted",86:"Attempting to link in too many libs",87:"Attempting to exec a shared library",88:"Function not implemented",89:"No more files",90:"Directory not empty",91:"File or path name too long",92:"Too many symbolic links",95:"Operation not supported on transport endpoint",96:"Protocol family not supported",104:"Connection reset by peer",105:"No buffer space available",106:"Address family not supported by protocol family",107:"Protocol wrong type for socket",108:"Socket operation on non-socket",109:"Protocol not available",110:"Can't send after socket shutdown",111:"Connection refused",112:"Address already in use",113:"Connection aborted",114:"Network is unreachable",115:"Network interface is not configured",116:"Connection timed out",117:"Host is down",118:"Host is unreachable",119:"Connection already in progress",120:"Socket already connected",121:"Destination address required",122:"Message too long",123:"Unknown protocol",124:"Socket type not supported",125:"Address not available",126:"ENETRESET",127:"Socket is already connected",128:"Socket is not connected",129:"TOOMANYREFS",130:"EPROCLIM",131:"EUSERS",132:"EDQUOT",133:"ESTALE",134:"Not supported",135:"No medium (in tape drive)",136:"No such host or network path",137:"Filename exists with different case",138:"EILSEQ",139:"Value too large for defined data type",140:"Operation canceled",141:"State not recoverable",142:"Previous owner died",143:"Streams pipe error"};
  var ___errno_state=0;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value
      return value;
    }function _strerror_r(errnum, strerrbuf, buflen) {
      if (errnum in ERRNO_MESSAGES) {
        if (ERRNO_MESSAGES[errnum].length > buflen - 1) {
          return ___setErrNo(ERRNO_CODES.ERANGE);
        } else {
          var msg = ERRNO_MESSAGES[errnum];
          for (var i = 0; i < msg.length; i++) {
            HEAP8[(((strerrbuf)+(i))|0)]=msg.charCodeAt(i)
          }
          HEAP8[(((strerrbuf)+(i))|0)]=0
          return 0;
        }
      } else {
        return ___setErrNo(ERRNO_CODES.EINVAL);
      }
    }function _strerror(errnum) {
      if (!_strerror.buffer) _strerror.buffer = _malloc(256);
      _strerror_r(errnum, _strerror.buffer, 256);
      return _strerror.buffer;
    }
  var _stdin=allocate(1, "i32*", ALLOC_STATIC);
  var _stdout=allocate(1, "i32*", ALLOC_STATIC);
  var _stderr=allocate(1, "i32*", ALLOC_STATIC);
  var __impure_ptr=allocate(1, "i32*", ALLOC_STATIC);var FS={currentPath:"/",nextInode:2,streams:[null],ignorePermissions:true,createFileHandle:function (stream, fd) {
        if (typeof stream === 'undefined') {
          stream = null;
        }
        if (!fd) {
          if (stream && stream.socket) {
            for (var i = 1; i < 64; i++) {
              if (!FS.streams[i]) {
                fd = i;
                break;
              }
            }
            assert(fd, 'ran out of low fds for sockets');
          } else {
            fd = Math.max(FS.streams.length, 64);
            for (var i = FS.streams.length; i < fd; i++) {
              FS.streams[i] = null; // Keep dense
            }
          }
        }
        // Close WebSocket first if we are about to replace the fd (i.e. dup2)
        if (FS.streams[fd] && FS.streams[fd].socket && FS.streams[fd].socket.close) {
          FS.streams[fd].socket.close();
        }
        FS.streams[fd] = stream;
        return fd;
      },removeFileHandle:function (fd) {
        FS.streams[fd] = null;
      },joinPath:function (parts, forceRelative) {
        var ret = parts[0];
        for (var i = 1; i < parts.length; i++) {
          if (ret[ret.length-1] != '/') ret += '/';
          ret += parts[i];
        }
        if (forceRelative && ret[0] == '/') ret = ret.substr(1);
        return ret;
      },absolutePath:function (relative, base) {
        if (typeof relative !== 'string') return null;
        if (base === undefined) base = FS.currentPath;
        if (relative && relative[0] == '/') base = '';
        var full = base + '/' + relative;
        var parts = full.split('/').reverse();
        var absolute = [''];
        while (parts.length) {
          var part = parts.pop();
          if (part == '' || part == '.') {
            // Nothing.
          } else if (part == '..') {
            if (absolute.length > 1) absolute.pop();
          } else {
            absolute.push(part);
          }
        }
        return absolute.length == 1 ? '/' : absolute.join('/');
      },analyzePath:function (path, dontResolveLastLink, linksVisited) {
        var ret = {
          isRoot: false,
          exists: false,
          error: 0,
          name: null,
          path: null,
          object: null,
          parentExists: false,
          parentPath: null,
          parentObject: null
        };
        path = FS.absolutePath(path);
        if (path == '/') {
          ret.isRoot = true;
          ret.exists = ret.parentExists = true;
          ret.name = '/';
          ret.path = ret.parentPath = '/';
          ret.object = ret.parentObject = FS.root;
        } else if (path !== null) {
          linksVisited = linksVisited || 0;
          path = path.slice(1).split('/');
          var current = FS.root;
          var traversed = [''];
          while (path.length) {
            if (path.length == 1 && current.isFolder) {
              ret.parentExists = true;
              ret.parentPath = traversed.length == 1 ? '/' : traversed.join('/');
              ret.parentObject = current;
              ret.name = path[0];
            }
            var target = path.shift();
            if (!current.isFolder) {
              ret.error = ERRNO_CODES.ENOTDIR;
              break;
            } else if (!current.read) {
              ret.error = ERRNO_CODES.EACCES;
              break;
            } else if (!current.contents.hasOwnProperty(target)) {
              ret.error = ERRNO_CODES.ENOENT;
              break;
            }
            current = current.contents[target];
            if (current.link && !(dontResolveLastLink && path.length == 0)) {
              if (linksVisited > 40) { // Usual Linux SYMLOOP_MAX.
                ret.error = ERRNO_CODES.ELOOP;
                break;
              }
              var link = FS.absolutePath(current.link, traversed.join('/'));
              ret = FS.analyzePath([link].concat(path).join('/'),
                                   dontResolveLastLink, linksVisited + 1);
              return ret;
            }
            traversed.push(target);
            if (path.length == 0) {
              ret.exists = true;
              ret.path = traversed.join('/');
              ret.object = current;
            }
          }
        }
        return ret;
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },createObject:function (parent, name, properties, canRead, canWrite) {
        if (!parent) parent = '/';
        if (typeof parent === 'string') parent = FS.findObject(parent);
        if (!parent) {
          ___setErrNo(ERRNO_CODES.EACCES);
          throw new Error('Parent path must exist.');
        }
        if (!parent.isFolder) {
          ___setErrNo(ERRNO_CODES.ENOTDIR);
          throw new Error('Parent must be a folder.');
        }
        if (!parent.write && !FS.ignorePermissions) {
          ___setErrNo(ERRNO_CODES.EACCES);
          throw new Error('Parent folder must be writeable.');
        }
        if (!name || name == '.' || name == '..') {
          ___setErrNo(ERRNO_CODES.ENOENT);
          throw new Error('Name must not be empty.');
        }
        if (parent.contents.hasOwnProperty(name)) {
          ___setErrNo(ERRNO_CODES.EEXIST);
          throw new Error("Can't overwrite object.");
        }
        parent.contents[name] = {
          read: canRead === undefined ? true : canRead,
          write: canWrite === undefined ? false : canWrite,
          timestamp: Date.now(),
          inodeNumber: FS.nextInode++
        };
        for (var key in properties) {
          if (properties.hasOwnProperty(key)) {
            parent.contents[name][key] = properties[key];
          }
        }
        return parent.contents[name];
      },createFolder:function (parent, name, canRead, canWrite) {
        var properties = {isFolder: true, isDevice: false, contents: {}};
        return FS.createObject(parent, name, properties, canRead, canWrite);
      },createPath:function (parent, path, canRead, canWrite) {
        var current = FS.findObject(parent);
        if (current === null) throw new Error('Invalid parent.');
        path = path.split('/').reverse();
        while (path.length) {
          var part = path.pop();
          if (!part) continue;
          if (!current.contents.hasOwnProperty(part)) {
            FS.createFolder(current, part, canRead, canWrite);
          }
          current = current.contents[part];
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        properties.isFolder = false;
        return FS.createObject(parent, name, properties, canRead, canWrite);
      },createDataFile:function (parent, name, data, canRead, canWrite) {
        if (typeof data === 'string') {
          var dataArray = new Array(data.length);
          for (var i = 0, len = data.length; i < len; ++i) dataArray[i] = data.charCodeAt(i);
          data = dataArray;
        }
        var properties = {
          isDevice: false,
          contents: data.subarray ? data.subarray(0) : data // as an optimization, create a new array wrapper (not buffer) here, to help JS engines understand this object
        };
        return FS.createFile(parent, name, properties, canRead, canWrite);
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          var LazyUint8Array = function() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = function(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = Math.floor(idx / this.chunkSize);
            return this.getter(chunkNum)[chunkOffset];
          }
          LazyUint8Array.prototype.setDataGetter = function(getter) {
            this.getter = getter;
          }
          LazyUint8Array.prototype.cacheLength = function() {
              // Find length
              var xhr = new XMLHttpRequest();
              xhr.open('HEAD', url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var chunkSize = 1024*1024; // Chunk size in bytes
              if (!hasByteServing) chunkSize = datalength;
              // Function to get a range from the remote URL.
              var doXHR = (function(from, to) {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
                // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                // Some hints to the browser that we want binary data.
                if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
                if (xhr.overrideMimeType) {
                  xhr.overrideMimeType('text/plain; charset=x-user-defined');
                }
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                  return new Uint8Array(xhr.response || []);
                } else {
                  return intArrayFromString(xhr.responseText || '', true);
                }
              });
              var lazyArray = this;
              lazyArray.setDataGetter(function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum+1) * chunkSize - 1; // including this byte
                end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                  lazyArray.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum];
              });
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
          }
          var lazyArray = new LazyUint8Array();
          Object.defineProperty(lazyArray, "length", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._length;
              }
          });
          Object.defineProperty(lazyArray, "chunkSize", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._chunkSize;
              }
          });
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
        return FS.createFile(parent, name, properties, canRead, canWrite);
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile) {
        Browser.init();
        var fullname = FS.joinPath([parent, name], true);
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },createLink:function (parent, name, target, canRead, canWrite) {
        var properties = {isDevice: false, link: target};
        return FS.createFile(parent, name, properties, canRead, canWrite);
      },createDevice:function (parent, name, input, output) {
        if (!(input || output)) {
          throw new Error('A device must have at least one callback defined.');
        }
        var ops = {isDevice: true, input: input, output: output};
        return FS.createFile(parent, name, ops, Boolean(input), Boolean(output));
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },staticInit:function () {
        // The main file system tree. All the contents are inside this.
        FS.root = {
          read: true,
          write: true,
          isFolder: true,
          isDevice: false,
          timestamp: Date.now(),
          inodeNumber: 1,
          contents: {}
        };
        // Create the temporary folder, if not already created
        try {
          FS.createFolder('/', 'tmp', true, true);
        } catch(e) {}
        FS.createFolder('/', 'dev', true, true);
      },init:function (input, output, error) {
        // Make sure we initialize only once.
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        input = input || Module['stdin'];
        output = output || Module['stdout'];
        error = error || Module['stderr'];
        // Default handlers.
        var stdinOverridden = true, stdoutOverridden = true, stderrOverridden = true;
        if (!input) {
          stdinOverridden = false;
          input = function() {
            if (!input.cache || !input.cache.length) {
              var result;
              if (typeof window != 'undefined' &&
                  typeof window.prompt == 'function') {
                // Browser.
                result = window.prompt('Input: ');
                if (result === null) result = String.fromCharCode(0); // cancel ==> EOF
              } else if (typeof readline == 'function') {
                // Command line.
                result = readline();
              }
              if (!result) result = '';
              input.cache = intArrayFromString(result + '\n', true);
            }
            return input.cache.shift();
          };
        }
        var utf8 = new Runtime.UTF8Processor();
        function createSimpleOutput() {
          var fn = function (val) {
            if (val === null || val === 10) {
              fn.printer(fn.buffer.join(''));
              fn.buffer = [];
            } else {
              fn.buffer.push(utf8.processCChar(val));
            }
          };
          return fn;
        }
        if (!output) {
          stdoutOverridden = false;
          output = createSimpleOutput();
        }
        if (!output.printer) output.printer = Module['print'];
        if (!output.buffer) output.buffer = [];
        if (!error) {
          stderrOverridden = false;
          error = createSimpleOutput();
        }
        if (!error.printer) error.printer = Module['printErr'];
        if (!error.buffer) error.buffer = [];
        // Create the I/O devices.
        var stdin = FS.createDevice('/dev', 'stdin', input);
        stdin.isTerminal = !stdinOverridden;
        var stdout = FS.createDevice('/dev', 'stdout', null, output);
        stdout.isTerminal = !stdoutOverridden;
        var stderr = FS.createDevice('/dev', 'stderr', null, error);
        stderr.isTerminal = !stderrOverridden;
        FS.createDevice('/dev', 'tty', input, output);
        FS.createDevice('/dev', 'null', function(){}, function(){});
        // Create default streams.
        FS.streams[1] = {
          path: '/dev/stdin',
          object: stdin,
          position: 0,
          isRead: true,
          isWrite: false,
          isAppend: false,
          error: false,
          eof: false,
          ungotten: []
        };
        FS.streams[2] = {
          path: '/dev/stdout',
          object: stdout,
          position: 0,
          isRead: false,
          isWrite: true,
          isAppend: false,
          error: false,
          eof: false,
          ungotten: []
        };
        FS.streams[3] = {
          path: '/dev/stderr',
          object: stderr,
          position: 0,
          isRead: false,
          isWrite: true,
          isAppend: false,
          error: false,
          eof: false,
          ungotten: []
        };
        // TODO: put these low in memory like we used to assert on: assert(Math.max(_stdin, _stdout, _stderr) < 15000); // make sure these are low, we flatten arrays with these
        HEAP32[((_stdin)>>2)]=1;
        HEAP32[((_stdout)>>2)]=2;
        HEAP32[((_stderr)>>2)]=3;
        // Other system paths
        FS.createPath('/', 'dev/shm/tmp', true, true); // temp files
        // Newlib initialization
        for (var i = FS.streams.length; i < Math.max(_stdin, _stdout, _stderr) + 4; i++) {
          FS.streams[i] = null; // Make sure to keep FS.streams dense
        }
        FS.streams[_stdin] = FS.streams[1];
        FS.streams[_stdout] = FS.streams[2];
        FS.streams[_stderr] = FS.streams[3];
        allocate([ allocate(
          [0, 0, 0, 0, _stdin, 0, 0, 0, _stdout, 0, 0, 0, _stderr, 0, 0, 0],
          'void*', ALLOC_NORMAL) ], 'void*', ALLOC_NONE, __impure_ptr);
      },quit:function () {
        if (!FS.init.initialized) return;
        // Flush any partially-printed lines in stdout and stderr. Careful, they may have been closed
        if (FS.streams[2] && FS.streams[2].object.output.buffer.length > 0) FS.streams[2].object.output(10);
        if (FS.streams[3] && FS.streams[3].object.output.buffer.length > 0) FS.streams[3].object.output(10);
      },standardizePath:function (path) {
        if (path.substr(0, 2) == './') path = path.substr(2);
        return path;
      },deleteFile:function (path) {
        path = FS.analyzePath(path);
        if (!path.parentExists || !path.exists) {
          throw 'Invalid path ' + path;
        }
        delete path.parentObject.contents[path.name];
      }};
  function _send(fd, buf, len, flags) {
      var info = FS.streams[fd];
      if (!info) return -1;
      info.sender(HEAPU8.subarray(buf, buf+len));
      return len;
    }
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.streams[fildes];
      if (!stream || stream.object.isDevice) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isWrite) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (stream.object.isFolder) {
        ___setErrNo(ERRNO_CODES.EISDIR);
        return -1;
      } else if (nbyte < 0 || offset < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else {
        var contents = stream.object.contents;
        while (contents.length < offset) contents.push(0);
        for (var i = 0; i < nbyte; i++) {
          contents[offset + i] = HEAPU8[(((buf)+(i))|0)];
        }
        stream.object.timestamp = Date.now();
        return i;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.streams[fildes];
      if (stream && ('socket' in stream)) {
          return _send(fildes, buf, nbyte, 0);
      } else if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isWrite) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (nbyte < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else {
        if (stream.object.isDevice) {
          if (stream.object.output) {
            for (var i = 0; i < nbyte; i++) {
              try {
                stream.object.output(HEAP8[(((buf)+(i))|0)]);
              } catch (e) {
                ___setErrNo(ERRNO_CODES.EIO);
                return -1;
              }
            }
            stream.object.timestamp = Date.now();
            return i;
          } else {
            ___setErrNo(ERRNO_CODES.ENXIO);
            return -1;
          }
        } else {
          var bytesWritten = _pwrite(fildes, buf, nbyte, stream.position);
          if (bytesWritten != -1) stream.position += bytesWritten;
          return bytesWritten;
        }
      }
    }function _fputs(s, stream) {
      // int fputs(const char *restrict s, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputs.html
      return _write(stream, s, _strlen(s));
    }
  Module["_strcpy"] = _strcpy;
  function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var bytesWritten = _write(stream, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        if (FS.streams[stream]) FS.streams[stream].error = true;
        return 0;
      } else {
        return Math.floor(bytesWritten / size);
      }
    }function _fprintf(stream, format, varargs) {
      // int fprintf(FILE *restrict stream, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var stack = Runtime.stackSave();
      var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
      Runtime.stackRestore(stack);
      return ret;
    }
  var ___dirent_struct_layout={__size__:1040,d_ino:0,d_name:4,d_off:1028,d_reclen:1032,d_type:1036};function _open(path, oflag, varargs) {
      // int open(const char *path, int oflag, ...);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/open.html
      // NOTE: This implementation tries to mimic glibc rather than strictly
      // following the POSIX standard.
      var mode = HEAP32[((varargs)>>2)];
      // Simplify flags.
      var accessMode = oflag & 3;
      var isWrite = accessMode != 0;
      var isRead = accessMode != 1;
      var isCreate = Boolean(oflag & 512);
      var isExistCheck = Boolean(oflag & 2048);
      var isTruncate = Boolean(oflag & 1024);
      var isAppend = Boolean(oflag & 8);
      // Verify path.
      var origPath = path;
      path = FS.analyzePath(Pointer_stringify(path));
      if (!path.parentExists) {
        ___setErrNo(path.error);
        return -1;
      }
      var target = path.object || null;
      var finalPath;
      // Verify the file exists, create if needed and allowed.
      if (target) {
        if (isCreate && isExistCheck) {
          ___setErrNo(ERRNO_CODES.EEXIST);
          return -1;
        }
        if ((isWrite || isTruncate) && target.isFolder) {
          ___setErrNo(ERRNO_CODES.EISDIR);
          return -1;
        }
        if (isRead && !target.read || isWrite && !target.write) {
          ___setErrNo(ERRNO_CODES.EACCES);
          return -1;
        }
        if (isTruncate && !target.isDevice) {
          target.contents = [];
        } else {
          if (!FS.forceLoadFile(target)) {
            ___setErrNo(ERRNO_CODES.EIO);
            return -1;
          }
        }
        finalPath = path.path;
      } else {
        if (!isCreate) {
          ___setErrNo(ERRNO_CODES.ENOENT);
          return -1;
        }
        if (!path.parentObject.write) {
          ___setErrNo(ERRNO_CODES.EACCES);
          return -1;
        }
        target = FS.createDataFile(path.parentObject, path.name, [],
                                   mode & 0x100, mode & 0x80);  // S_IRUSR, S_IWUSR.
        finalPath = path.parentPath + '/' + path.name;
      }
      // Actually create an open stream.
      var id;
      if (target.isFolder) {
        var entryBuffer = 0;
        if (___dirent_struct_layout) {
          entryBuffer = _malloc(___dirent_struct_layout.__size__);
        }
        var contents = [];
        for (var key in target.contents) contents.push(key);
        id = FS.createFileHandle({
          path: finalPath,
          object: target,
          // An index into contents. Special values: -2 is ".", -1 is "..".
          position: -2,
          isRead: true,
          isWrite: false,
          isAppend: false,
          error: false,
          eof: false,
          ungotten: [],
          // Folder-specific properties:
          // Remember the contents at the time of opening in an array, so we can
          // seek between them relying on a single order.
          contents: contents,
          // Each stream has its own area for readdir() returns.
          currentEntry: entryBuffer
        });
      } else {
        id = FS.createFileHandle({
          path: finalPath,
          object: target,
          position: 0,
          isRead: isRead,
          isWrite: isWrite,
          isAppend: isAppend,
          error: false,
          eof: false,
          ungotten: []
        });
      }
      return id;
    }function _fopen(filename, mode) {
      // FILE *fopen(const char *restrict filename, const char *restrict mode);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fopen.html
      var flags;
      mode = Pointer_stringify(mode);
      if (mode[0] == 'r') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 0;
        }
      } else if (mode[0] == 'w') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 512;
        flags |= 1024;
      } else if (mode[0] == 'a') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 512;
        flags |= 8;
      } else {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return 0;
      }
      var ret = _open(filename, flags, allocate([0x1FF, 0, 0, 0], 'i32', ALLOC_STACK));  // All creation permissions.
      return (ret == -1) ? 0 : ret;
    }
  function ___errno_location() {
      return ___errno_state;
    }var ___errno=___errno_location;
  function _close(fildes) {
      // int close(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/close.html
      if (FS.streams[fildes]) {
        if (FS.streams[fildes].currentEntry) {
          _free(FS.streams[fildes].currentEntry);
        }
        FS.streams[fildes] = null;
        return 0;
      } else {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
    }
  function _fsync(fildes) {
      // int fsync(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fsync.html
      if (FS.streams[fildes]) {
        // We write directly to the file system, so there's nothing to do here.
        return 0;
      } else {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
    }function _fclose(stream) {
      // int fclose(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fclose.html
      _fsync(stream);
      return _close(stream);
    }
  function _gettimeofday(ptr) {
      // %struct.timeval = type { i32, i32 }
      var now = Date.now();
      HEAP32[((ptr)>>2)]=Math.floor(now/1000); // seconds
      HEAP32[(((ptr)+(4))>>2)]=Math.floor((now-1000*Math.floor(now/1000))*1000); // microseconds
      return 0;
    }
  Module["_memset"] = _memset;var _llvm_memset_p0i8_i64=_memset;
  function _llvm_lifetime_start() {}
  function _llvm_lifetime_end() {}
  function _fputc(c, stream) {
      // int fputc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputc.html
      var chr = unSign(c & 0xFF);
      HEAP8[((_fputc.ret)|0)]=chr
      var ret = _write(stream, _fputc.ret, 1);
      if (ret == -1) {
        if (FS.streams[stream]) FS.streams[stream].error = true;
        return -1;
      } else {
        return chr;
      }
    }function _puts(s) {
      // int puts(const char *s);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/puts.html
      // NOTE: puts() always writes an extra newline.
      var stdout = HEAP32[((_stdout)>>2)];
      var ret = _fputs(s, stdout);
      if (ret < 0) {
        return ret;
      } else {
        var newlineRet = _fputc(10, stdout);
        return (newlineRet < 0) ? -1 : ret + 1;
      }
    }function _perror(s) {
      // void perror(const char *s);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/perror.html
      var stdout = HEAP32[((_stdout)>>2)];
      if (s) {
        _fputs(s, stdout);
        _fputc(58, stdout);
        _fputc(32, stdout);
      }
      var errnum = HEAP32[((___errno_location())>>2)];
      _puts(_strerror(errnum));
    }
  function _pipe(fildes) {
      // int pipe(int fildes[2]);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/pipe.html
      // It is possible to implement this using two device streams, but pipes make
      // little sense in a single-threaded environment, so we do not support them.
      ___setErrNo(ERRNO_CODES.ENOSYS);
      return -1;
    }
  Module["_memmove"] = _memmove;var _llvm_memmove_p0i8_p0i8_i32=_memmove;
  function _recv(fd, buf, len, flags) {
      var info = FS.streams[fd];
      if (!info) return -1;
      if (!info.hasData()) {
        ___setErrNo(ERRNO_CODES.EAGAIN); // no data, and all sockets are nonblocking, so this is the right behavior
        return -1;
      }
      var buffer = info.inQueue.shift();
      if (len < buffer.length) {
        if (info.stream) {
          // This is tcp (reliable), so if not all was read, keep it
          info.inQueue.unshift(buffer.subarray(len));
        }
        buffer = buffer.subarray(0, len);
      }
      HEAPU8.set(buffer, buf);
      return buffer.length;
    }
  function _pread(fildes, buf, nbyte, offset) {
      // ssize_t pread(int fildes, void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.streams[fildes];
      if (!stream || stream.object.isDevice) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isRead) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (stream.object.isFolder) {
        ___setErrNo(ERRNO_CODES.EISDIR);
        return -1;
      } else if (nbyte < 0 || offset < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else if (offset >= stream.object.contents.length) {
        return 0;
      } else {
        var bytesRead = 0;
        var contents = stream.object.contents;
        var size = Math.min(contents.length - offset, nbyte);
        assert(size >= 0);
        if (contents.subarray) { // typed array
          HEAPU8.set(contents.subarray(offset, offset+size), buf);
        } else
        if (contents.slice) { // normal array
          for (var i = 0; i < size; i++) {
            HEAP8[(((buf)+(i))|0)]=contents[offset + i]
          }
        } else {
          for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
            HEAP8[(((buf)+(i))|0)]=contents.get(offset + i)
          }
        }
        bytesRead += size;
        return bytesRead;
      }
    }function _read(fildes, buf, nbyte) {
      // ssize_t read(int fildes, void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.streams[fildes];
      if (stream && ('socket' in stream)) {
        return _recv(fildes, buf, nbyte, 0);
      } else if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isRead) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (nbyte < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else {
        var bytesRead;
        if (stream.object.isDevice) {
          if (stream.object.input) {
            bytesRead = 0;
            for (var i = 0; i < nbyte; i++) {
              try {
                var result = stream.object.input();
              } catch (e) {
                ___setErrNo(ERRNO_CODES.EIO);
                return -1;
              }
              if (result === undefined && bytesRead === 0) {
                ___setErrNo(ERRNO_CODES.EAGAIN);
                return -1;
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              HEAP8[(((buf)+(i))|0)]=result
            }
            return bytesRead;
          } else {
            ___setErrNo(ERRNO_CODES.ENXIO);
            return -1;
          }
        } else {
          bytesRead = _pread(fildes, buf, nbyte, stream.position);
          assert(bytesRead >= -1);
          if (bytesRead != -1) {
            stream.position += bytesRead;
          }
          return bytesRead;
        }
      }
    }
  var ___pollfd_struct_layout={__size__:8,fd:0,events:4,revents:6};function _poll(fds, nfds, timeout) {
      // int poll(struct pollfd fds[], nfds_t nfds, int timeout);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/poll.html
      // NOTE: This is pretty much a no-op mimicking glibc.
      var offsets = ___pollfd_struct_layout;
      var nonzero = 0;
      for (var i = 0; i < nfds; i++) {
        var pollfd = fds + ___pollfd_struct_layout.__size__ * i;
        var fd = HEAP32[(((pollfd)+(offsets.fd))>>2)];
        var events = HEAP16[(((pollfd)+(offsets.events))>>1)];
        var revents = 0;
        if (FS.streams[fd]) {
          var stream = FS.streams[fd];
          if (events & 1) revents |= 1;
          if (events & 2) revents |= 2;
        } else {
          if (events & 4) revents |= 4;
        }
        if (revents) nonzero++;
        HEAP16[(((pollfd)+(offsets.revents))>>1)]=revents
      }
      return nonzero;
    }
  function _usleep(useconds) {
      // int usleep(useconds_t useconds);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/usleep.html
      // We're single-threaded, so use a busy loop. Super-ugly.
      var msec = useconds / 1000;
      var start = Date.now();
      while (Date.now() - start < msec) {
        // Do nothing.
      }
      return 0;
    }
  var ___timespec_struct_layout={__size__:8,tv_sec:0,tv_nsec:4};function _nanosleep(rqtp, rmtp) {
      // int nanosleep(const struct timespec  *rqtp, struct timespec *rmtp);
      var seconds = HEAP32[(((rqtp)+(___timespec_struct_layout.tv_sec))>>2)];
      var nanoseconds = HEAP32[(((rqtp)+(___timespec_struct_layout.tv_nsec))>>2)];
      HEAP32[(((rmtp)+(___timespec_struct_layout.tv_sec))>>2)]=0
      HEAP32[(((rmtp)+(___timespec_struct_layout.tv_nsec))>>2)]=0
      return _usleep((seconds * 1e6) + (nanoseconds / 1000));
    }
  var _llvm_memset_p0i8_i32=_memset;
  Module["_memcmp"] = _memcmp;
  function _qsort(base, num, size, cmp) {
      if (num == 0 || size == 0) return;
      // forward calls to the JavaScript sort method
      // first, sort the items logically
      var keys = [];
      for (var i = 0; i < num; i++) keys.push(i);
      keys.sort(function(a, b) {
        return Module['dynCall_iii'](cmp, base+a*size, base+b*size);
      });
      // apply the sort
      var temp = _malloc(num*size);
      _memcpy(temp, base, num*size);
      for (var i = 0; i < num; i++) {
        if (keys[i] == i) continue; // already in place
        _memcpy(base+i*size, temp+keys[i]*size, size);
      }
      _free(temp);
    }
  function _iconv_open(toCode, fromCode) {
      var Pointer_stringify = Module['Pointer_stringify'];
      var iconv = Module['iconvCache'] || (Module['iconvCache'] = {});
      var cd = Module['_malloc'](1);
      var descriptor = {
        toCode: Pointer_stringify(toCode),
        fromCode: Pointer_stringify(fromCode)
      };
      descriptor.decoder = new TextDecoder(descriptor.fromCode
                                                     .toLowerCase()
                                                     .replace(/\/\/.*$/, ''));
      descriptor.encoder = new TextEncoder(descriptor.toCode
                                                     .toLowerCase()
                                                     .replace(/\/\/.*$/, ''));
      iconv[cd] = descriptor;
      return cd;
    }
  function _memchr(ptr, chr, num) {
      chr = unSign(chr);
      for (var i = 0; i < num; i++) {
        if (HEAP8[(ptr)] == chr) return ptr;
        ptr++;
      }
      return 0;
    }
  function _iconv(cd, inbuf, inbytesleft, outbuf, outbytesleft) {
      var iconv = Module['iconvCache'];
      var descriptor = iconv[cd];
      var HEAPU8 = Module['HEAPU8'], HEAP32 = Module['HEAP32'];
      var offset = HEAP32[(inbuf >> 2)];
      var count = HEAP32[(inbytesleft >> 2)];
      var str = descriptor.decoder.decode(HEAPU8.subarray(offset, offset + count));
      HEAP32[(inbuf >> 2)] += count;
      HEAP32[(inbytesleft >> 2)] = 0;
      var bytes = descriptor.encoder.encode(str);
      var dest = HEAP32[(outbuf >> 2)];
      // HACK ignoring overflow for now
      HEAPU8.set(bytes, dest);
      HEAP32[(outbuf >> 2)] += bytes.length;
      HEAP32[(outbytesleft >> 2)] -= bytes.length;
      return str.length;
    }
  function _iconv_close(cd) {
      var iconv = Module['iconvCache'];
      delete iconv[cd];
      Module['_free'](cd);
    }
  function _llvm_uadd_with_overflow_i32(x, y) {
      x = x>>>0;
      y = y>>>0;
      return ((asm["setTempRet0"](x+y > 4294967295),(x+y)>>>0)|0);
    }
  function _abort() {
      Module['abort']();
    }
  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 8: return PAGE_SIZE;
        case 54:
        case 56:
        case 21:
        case 61:
        case 63:
        case 22:
        case 67:
        case 23:
        case 24:
        case 25:
        case 26:
        case 27:
        case 69:
        case 28:
        case 101:
        case 70:
        case 71:
        case 29:
        case 30:
        case 199:
        case 75:
        case 76:
        case 32:
        case 43:
        case 44:
        case 80:
        case 46:
        case 47:
        case 45:
        case 48:
        case 49:
        case 42:
        case 82:
        case 33:
        case 7:
        case 108:
        case 109:
        case 107:
        case 112:
        case 119:
        case 121:
          return 200809;
        case 13:
        case 104:
        case 94:
        case 95:
        case 34:
        case 35:
        case 77:
        case 81:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 91:
        case 94:
        case 95:
        case 110:
        case 111:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 120:
        case 40:
        case 16:
        case 79:
        case 19:
          return -1;
        case 92:
        case 93:
        case 5:
        case 72:
        case 6:
        case 74:
        case 92:
        case 93:
        case 96:
        case 97:
        case 98:
        case 99:
        case 102:
        case 103:
        case 105:
          return 1;
        case 38:
        case 66:
        case 50:
        case 51:
        case 4:
          return 1024;
        case 15:
        case 64:
        case 41:
          return 32;
        case 55:
        case 37:
        case 17:
          return 2147483647;
        case 18:
        case 1:
          return 47839;
        case 59:
        case 57:
          return 99;
        case 68:
        case 58:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 14: return 32768;
        case 73: return 32767;
        case 39: return 16384;
        case 60: return 1000;
        case 106: return 700;
        case 52: return 256;
        case 62: return 255;
        case 2: return 100;
        case 65: return 64;
        case 36: return 20;
        case 100: return 16;
        case 20: return 6;
        case 53: return 4;
        case 10: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }
  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret
      }
      return ret;
    }
  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret;  // Previous break location.
    }
  var Browser={mainLoop:{scheduler:null,shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
        if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
        Browser.initted = true;
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : console.log("warning: cannot create object URLs");
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
        var imagePlugin = {};
        imagePlugin['canHandle'] = function(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var img = new Image();
          img.onload = function() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin['canHandle'] = function(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
        // Canvas event setup
        var canvas = Module['canvas'];
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'];
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas;
        }
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule) {
        var ctx;
        try {
          if (useWebGL) {
            ctx = canvas.getContext('experimental-webgl', {
              alpha: false
            });
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas - ' + e);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement']) === canvas) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'];
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else if (Browser.resizeCanvas){
            Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
        }
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
        }
        canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                   canvas['mozRequestFullScreen'] ||
                                   (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvas.requestFullScreen();
      },requestAnimationFrame:function (func) {
        if (!window.requestAnimationFrame) {
          window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                         window['mozRequestAnimationFrame'] ||
                                         window['webkitRequestAnimationFrame'] ||
                                         window['msRequestAnimationFrame'] ||
                                         window['oRequestAnimationFrame'] ||
                                         window['setTimeout'];
        }
        window.requestAnimationFrame(func);
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getMimetype:function (name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }        
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var x = event.pageX - (window.scrollX + rect.left);
          var y = event.pageY - (window.scrollY + rect.top);
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        canvas.width = width;
        canvas.height = height;
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        var canvas = Module['canvas'];
        this.windowedWidth = canvas.width;
        this.windowedHeight = canvas.height;
        canvas.width = screen.width;
        canvas.height = screen.height;
        // check if SDL is available   
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        var canvas = Module['canvas'];
        canvas.width = this.windowedWidth;
        canvas.height = this.windowedHeight;
        // check if SDL is available       
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      }};
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
FS.staticInit();__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
_fputc.ret = allocate([0], "i8", ALLOC_STATIC);
Module["requestFullScreen"] = function(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function(func) { Browser.requestAnimationFrame(func) };
  Module["pauseMainLoop"] = function() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function() { Browser.getUserMedia() }
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
staticSealed = true; // seal the static portion of memory
STACK_MAX = STACK_BASE + 5242880;
DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);
assert(DYNAMIC_BASE < TOTAL_MEMORY); // Stack must fit in TOTAL_MEMORY; allocations from here on may enlarge TOTAL_MEMORY
 var ctlz_i8 = allocate([8,7,6,6,5,5,5,5,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_DYNAMIC);
 var cttz_i8 = allocate([8,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,7,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0], "i8", ALLOC_DYNAMIC);
var Math_min = Math.min;
function invoke_vi(index,a1) {
  try {
    Module["dynCall_vi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_vii(index,a1,a2) {
  try {
    Module["dynCall_vii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_v(index) {
  try {
    Module["dynCall_v"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iii(index,a1,a2) {
  try {
    return Module["dynCall_iii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiii(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm=(function(global,env,buffer){"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=env.cttz_i8|0;var n=env.ctlz_i8|0;var o=env._stderr|0;var p=+env.NaN;var q=+env.Infinity;var r=0;var s=0;var t=0;var u=0;var v=0,w=0,x=0,y=0,z=0.0,A=0,B=0,C=0,D=0.0;var E=0;var F=0;var G=0;var H=0;var I=0;var J=0;var K=0;var L=0;var M=0;var N=0;var O=global.Math.floor;var P=global.Math.abs;var Q=global.Math.sqrt;var R=global.Math.pow;var S=global.Math.cos;var T=global.Math.sin;var U=global.Math.tan;var V=global.Math.acos;var W=global.Math.asin;var X=global.Math.atan;var Y=global.Math.atan2;var Z=global.Math.exp;var _=global.Math.log;var $=global.Math.ceil;var aa=global.Math.imul;var ab=env.abort;var ac=env.assert;var ad=env.asmPrintInt;var ae=env.asmPrintFloat;var af=env.min;var ag=env.invoke_vi;var ah=env.invoke_vii;var ai=env.invoke_ii;var aj=env.invoke_v;var ak=env.invoke_iii;var al=env.invoke_viiii;var am=env._llvm_lifetime_end;var an=env._llvm_uadd_with_overflow_i32;var ao=env._snprintf;var ap=env._fclose;var aq=env._abort;var ar=env._fprintf;var as=env._pread;var at=env._close;var au=env._fopen;var av=env._usleep;var aw=env._fputc;var ax=env._iconv;var ay=env._poll;var az=env._js_get_width;var aA=env._open;var aB=env._js_read_image;var aC=env.___setErrNo;var aD=env.__reallyNegative;var aE=env._nanosleep;var aF=env._qsort;var aG=env._send;var aH=env._write;var aI=env._fputs;var aJ=env._sprintf;var aK=env._strdup;var aL=env._sysconf;var aM=env._recv;var aN=env._read;var aO=env._iconv_open;var aP=env._time;var aQ=env.__formatString;var aR=env._js_output_result;var aS=env._gettimeofday;var aT=env._iconv_close;var aU=env._perror;var aV=env.___assert_func;var aW=env._js_get_height;var aX=env._pwrite;var aY=env._strstr;var aZ=env._puts;var a_=env._fsync;var a$=env._strerror_r;var a0=env.___errno_location;var a1=env._strerror;var a2=env._pipe;var a3=env._llvm_lifetime_start;var a4=env._sbrk;var a5=env._fwrite;var a6=env._memchr;
// EMSCRIPTEN_START_FUNCS
function bd(a){a=a|0;var b=0;b=i;i=i+a|0;i=i+7>>3<<3;return b|0}function be(){return i|0}function bf(a){a=a|0;i=a}function bg(a,b){a=a|0;b=b|0;if((r|0)==0){r=a;s=b}}function bh(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0]}function bi(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0];a[k+4|0]=a[b+4|0];a[k+5|0]=a[b+5|0];a[k+6|0]=a[b+6|0];a[k+7|0]=a[b+7|0]}function bj(a){a=a|0;E=a}function bk(a){a=a|0;F=a}function bl(a){a=a|0;G=a}function bm(a){a=a|0;H=a}function bn(a){a=a|0;I=a}function bo(a){a=a|0;J=a}function bp(a){a=a|0;K=a}function bq(a){a=a|0;L=a}function br(a){a=a|0;M=a}function bs(a){a=a|0;N=a}function bt(){}function bu(a){a=a|0;return c[a>>2]|0}function bv(a){a=a|0;return c[a+4>>2]|0}function bw(a){a=a|0;return c[a+8>>2]|0}function bx(a){a=a|0;return c[a+12>>2]|0}function by(a,b){a=a|0;b=b|0;c[a>>2]=b;return}function bz(a,b,d){a=a|0;b=b|0;d=d|0;c[a+4>>2]=b;c[a+8>>2]=d;return}function bA(a){a=a|0;var b=0,d=0;b=c[a+48>>2]|0;if((b|0)==0){d=0;return d|0}d=c[b+8>>2]|0;return d|0}function bB(a){a=a|0;var b=0;b=c[a+48>>2]|0;if((b|0)!=0){b2(b,-1)}ea(a);return}function bC(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;bJ(a);c[a+12>>2]=b;c[a+16>>2]=d;c[a+24>>2]=e;return}function bD(a){a=a|0;var b=0,d=0,e=0;a=eb(1,200)|0;b=a;if((a|0)==0){d=0;return d|0}c[a>>2]=1381123450;c[a+4>>2]=0;e=cW()|0;c[a+52>>2]=e;if((e|0)==0){ea(a);d=0;return d|0}else{c[a+88>>2]=0;cy(b)|0;d=b;return d|0}return 0}function bE(){var a=0,b=0,d=0,e=0,f=0,g=0;a=bD(0)|0;c[2532]=a;if((a|0)==0){aV(7848,33,9608,7832);return 0}if((bR(a,0,0)|0)!=0){a=c[2532]|0;bF(a,0)|0;b=1;return b|0}a=bH()|0;if((a|0)==0){aV(7848,40,9608,5560);return 0}by(a,808466521);d=az()|0;e=aW()|0;bz(a,d,e);f=aa(e,d)|0;d=d9(f)|0;bC(a,d,f,8);aB(d|0,f|0)|0;bP(c[2532]|0,a)|0;f=bA(a)|0;if((f|0)!=0){d=f;do{f=bV(d)|0;if((f|0)!=1){e=bN(f)|0;g=bU(f)|0;aR(e|0,g|0,bW(d)|0)}d=b_(d)|0;}while((d|0)!=0)}bI(a);if((bO(c[2532]|0)|0)!=0){a=c[2532]|0;bT(a,-1)|0}bQ(c[2532]|0);b=0;return b|0}function bF(a,b){a=a|0;b=b|0;var d=0;if((c[a>>2]|0)==1381123450){b=c[o>>2]|0;d=bG(a,0)|0;aI(d|0,b|0)|0;return-(c[a+16>>2]|0)|0}else{aV(4320,83,9512,6752);return 0}return 0}function bG(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;d=i;i=i+48|0;e=d+32|0;if((c[b>>2]|0)!=1381123450){aV(4320,103,9488,6752);return 0}f=(c[b+16>>2]|0)+2|0;if(f>>>0<5){g=c[16+(f<<2)>>2]|0}else{g=4520}f=c[b+4>>2]|0;if(f>>>0<4){h=c[168+(f<<2)>>2]|0}else{h=3880}f=c[b+24>>2]|0;j=(f|0)==0?3880:f;f=b+20|0;k=c[f>>2]|0;if(k>>>0<12){l=c[760+(k<<2)>>2]|0}else{l=5544}k=d|0;eg(k|0,1624,30)|0;m=(eh(j|0)|0)+77|0;n=b+8|0;o=ec(c[n>>2]|0,m)|0;c[n>>2]=o;m=aJ(o|0,k|0,(v=i,i=i+32|0,c[v>>2]=g,c[v+8>>2]=h,c[v+16>>2]=j,c[v+24>>2]=l,v)|0)|0;if((m|0)<1){p=3880;i=d;return p|0}l=b+28|0;j=c[l>>2]|0;do{if((j|0)==0){q=m}else{h=(eh(j|0)|0)+m|0;g=h+1|0;L69:do{if((aY(j|0,4656)|0)==0){do{if((aY(j|0,3296)|0)==0){if((aY(j|0,2976)|0)!=0){break}k=ec(c[n>>2]|0,g)|0;c[n>>2]=k;o=k+m|0;k=c[l>>2]|0;r=eh(k|0)|0;s=r+1|0;eg(o|0,k|0,s)|0;t=r;break L69}}while(0);r=ec(c[n>>2]|0,h+33|0)|0;c[n>>2]=r;t=aJ(r+m|0,c[l>>2]|0,(v=i,i=i+8|0,c[v>>2]=c[b+36>>2],v)|0)|0}else{r=b+32|0;s=c[r>>2]|0;if((s|0)==0){k=aK(3832)|0;c[r>>2]=k;u=k}else{u=s}s=c[n>>2]|0;k=ec(s,(eh(u|0)|0)+g|0)|0;c[n>>2]=k;t=aJ(k+m|0,c[l>>2]|0,(v=i,i=i+8|0,c[v>>2]=c[r>>2],v)|0)|0}}while(0);g=t+m|0;if((g|0)<1){p=3880}else{q=g;break}i=d;return p|0}}while(0);if((c[f>>2]|0)==5){f=e|0;eg(f|0,1608,11)|0;e=b+12|0;b=a1(c[e>>2]|0)|0;m=c[n>>2]|0;t=(eh(f|0)|0)+q|0;l=ec(m,t+(eh(b|0)|0)|0)|0;c[n>>2]=l;t=l+q|0;l=c[e>>2]|0;aJ(t|0,f|0,(v=i,i=i+16|0,c[v>>2]=b,c[v+8>>2]=l,v)|0)|0;p=c[n>>2]|0;i=d;return p|0}else{l=ec(c[n>>2]|0,q+2|0)|0;c[n>>2]=l;n=l+q|0;w=10;a[n]=w&255;w=w>>8;a[n+1|0]=w&255;p=l;i=d;return p|0}return 0}function bH(){var a=0,b=0,d=0;a=eb(1,52)|0;bM();b=a+28|0;d=c[b>>2]|0;c[b>>2]=d+1;if((d|0)>-2){c[a+36>>2]=-1;return a|0}else{aV(7656,75,9152,7488);return 0}return 0}function bI(a){a=a|0;var b=0,d=0,e=0;b=a+28|0;d=c[b>>2]|0;e=d-1|0;c[b>>2]=e;if((d|0)<=0){aV(7656,75,9152,7488)}if((e|0)!=0){return}e=c[a+24>>2]|0;if((e|0)!=0){a7[e&15](a)}if((c[a+32>>2]|0)!=0){return}e=c[a+48>>2]|0;if((e|0)!=0){b2(e,-1)}ea(a);return}function bJ(a){a=a|0;var b=0,d=0,e=0,f=0;if((a|0)==0){return}b=a+32|0;do{if((c[b>>2]|0)==0){d=a+24|0;e=c[d>>2]|0;if((e|0)==0){break}f=c[a+12>>2]|0;if((f|0)==0){break}if((e|0)==8){ea(f);break}else{c[d>>2]=8;a7[e&15](a);break}}else{if((c[a+28>>2]|0)==0){aV(4304,113,8248,7048)}e=eb(1,52)|0;bM();d=e+28|0;f=c[d>>2]|0;c[d>>2]=f+1;if((f|0)>-2){f=e;d=a;eg(e|0,d|0,52)|0;a7[c[e+24>>2]&15](f);c[a+24>>2]=0;c[b>>2]=0;c[a+36>>2]=-1;break}else{aV(7656,75,9152,7488)}}}while(0);c[a+12>>2]=0;return}function bK(d,e){d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;f=i;i=i+16|0;g=f|0;h=(eh(e|0)|0)+16|0;j=i;i=i+h|0;i=i+7>>3<<3;ei(j|0,e|0)|0;k=d|0;if((a[d]|0)>31){l=ao(j|0,h|0,4136,(v=i,i=i+16|0,c[v>>2]=e,c[v+8>>2]=d,v)|0)|0}else{m=c[k>>2]|0;l=ao(j|0,h|0,3664,(v=i,i=i+16|0,c[v>>2]=e,c[v+8>>2]=m,v)|0)|0}if((l|0)>=(h|0)){aV(4304,214,8224,3160);return 0}a[j+h|0]=0;if((c[2544]|0)>0){h=c[o>>2]|0;l=c[k>>2]|0;ar(h|0,2760,(v=i,i=i+32|0,c[v>>2]=8224,c[v+8>>2]=d,c[v+16>>2]=l,c[v+24>>2]=j,v)|0)|0}l=au(j|0,2568)|0;if((l|0)==0){h=c[(a0()|0)>>2]|0;if((c[2544]|0)<=0){n=h;i=f;return n|0}m=c[o>>2]|0;e=a1(h|0)|0;ar(m|0,2024,(v=i,i=i+24|0,c[v>>2]=8224,c[v+8>>2]=j,c[v+16>>2]=e,v)|0)|0;n=h;i=f;return n|0}c[g>>2]=1735223674;c[g+4>>2]=c[k>>2];b[g+8>>1]=c[d+4>>2]&65535;b[g+10>>1]=c[d+8>>2]&65535;k=d+16|0;c[g+12>>2]=c[k>>2];do{if((a5(g|0,16,1,l|0)|0)==1){h=a5(c[d+12>>2]|0,1,c[k>>2]|0,l|0)|0;if((h|0)!=(c[k>>2]|0)){break}n=ap(l|0)|0;i=f;return n|0}}while(0);k=c[(a0()|0)>>2]|0;if((c[2544]|0)>0){d=c[o>>2]|0;g=a1(k|0)|0;ar(d|0,1704,(v=i,i=i+24|0,c[v>>2]=8224,c[v+8>>2]=j,c[v+16>>2]=g,v)|0)|0}ap(l|0)|0;n=k;i=f;return n|0}function bL(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,p=0,q=0,r=0,s=0,t=0,u=0,w=0,x=0;d=i;i=i+8|0;e=d|0;f=c[a+80>>2]|0;L156:do{if((b|0)==0){g=0}else{h=a+100|0;if((c[h>>2]|0)!=0){j=c[(c[a+48>>2]|0)+40>>2]|0;bK(j,2992)|0;c[h>>2]=0}h=bu(b)|0;c[e>>2]=h;if((c[2544]|0)>15){j=c[o>>2]|0;k=bv(b)|0;l=bw(b)|0;m=bx(b)|0;ar(j|0,6328,(v=i,i=i+48|0,c[v>>2]=9392,c[v+8>>2]=e,c[v+16>>2]=h,c[v+24>>2]=k,c[v+32>>2]=l,c[v+40>>2]=m,v)|0)|0}m=cE(b,808466521)|0;do{if((m|0)!=0){l=a+168|0;k=c[l>>2]|0;if((k|0)!=0){b2(k,-1);c[l>>2]=0}k=a+52|0;cZ(c[k>>2]|0,b);h=c9(c[k>>2]|0,m)|0;j=b+48|0;n=c[j>>2]|0;p=m+48|0;c[j>>2]=c[p>>2];c[p>>2]=n;bI(m);if((h|0)<0){break}n=c0(c[k>>2]|0)|0;c[l>>2]=n;if((n|0)!=0){b2(n,1)}do{if((c[2544]|0)>7){n=bA(b)|0;if((n|0)==0){break}else{q=n}do{n=bV(q)|0;l=bX(q)|0;if((c[2544]|0)>7){k=c[o>>2]|0;p=bN(n)|0;r=bU(n)|0;n=bW(q)|0;s=bZ(q)|0;t=bY(q)|0;if((l|0)<0){u=3896}else{u=(l|0)>0?3440:2984}ar(k|0,4560,(v=i,i=i+56|0,c[v>>2]=9392,c[v+8>>2]=p,c[v+16>>2]=r,c[v+24>>2]=n,c[v+32>>2]=s,c[v+40>>2]=t,c[v+48>>2]=u,v)|0)|0}q=b_(q)|0;}while((q|0)!=0)}}while(0);do{if((h|0)!=0){ct(a,2);t=c[a+56>>2]|0;if((t|0)==0){break}a8[t&1](b,c[a+40>>2]|0)}}while(0);if((f|0)==0){g=b;break L156}h=c[j>>2]|0;t=cE(b,f)|0;if((t|0)==0){break}c[t+48>>2]=h;b2(h,1);g=t;break L156}}while(0);m=a;if((c[a>>2]|0)!=1381123450){aV(4528,148,8664,4488);return 0}c[a+16>>2]=-1;c[a+20>>2]=3;c[a+24>>2]=9392;c[a+28>>2]=2576;if((c[2544]|0)<=0){w=-1;i=d;return w|0}bF(m,0)|0;w=-1;i=d;return w|0}}while(0);b=a+48|0;q=c[b>>2]|0;if((q|0)==0){x=0}else{u=ck(q,g)|0;do{if((u|0)!=0){q=c[b>>2]|0;if((c[a>>2]|0)!=1381123450){aV(4528,127,8504,4448);return 0}if((c[q>>2]|0)==1381123450){c[a+12>>2]=c[q+12>>2];c[a+16>>2]=c[q+16>>2];c[a+20>>2]=c[q+20>>2];c[a+24>>2]=c[q+24>>2];c[a+28>>2]=c[q+28>>2];e=q+32|0;c[a+32>>2]=c[e>>2];c[e>>2]=0;c[a+36>>2]=c[q+36>>2];break}else{aV(4528,128,8504,4384);return 0}}}while(0);co(a)|0;x=u}if((f|0)==0|(g|0)==0){w=x;i=d;return w|0}bI(g);w=x;i=d;return w|0}function bM(){return}function bN(a){a=a|0;var b=0,c=0;b=a&255;if((b|0)==14){c=3288}else if((b|0)==25){c=2968}else if((b|0)==57){c=1864}else if((b|0)==64){c=7800}else if((b|0)==10){c=5320}else if((b|0)==39){c=2560}else if((b|0)==128){c=2232}else if((b|0)==9){c=5568}else if((b|0)==12){c=4264}else if((b|0)==13){c=3824}else if((b|0)==8){c=1656}else{c=7592}return c|0}function bO(a){a=a|0;var b=0;cc(a)|0;if((c[a+48>>2]|0)==0){b=0}else{b=(c[a+92>>2]|0)!=0|0}cq(a,0)|0;return b|0}function bP(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;cc(a)|0;do{if((b|0)==0){d=186}else{if((c[a+48>>2]|0)==0){d=186;break}e=bv(b)|0;f=cn(a,e,bw(b)|0)|0;if((f|0)==0){d=186}else{g=f}}}while(0);do{if((d|0)==186){f=a+52|0;c3(c[f>>2]|0,0);e=bL(a,b)|0;if((c[a+96>>2]|0)==0){g=e;break}c3(c[f>>2]|0,1);g=e}}while(0);cq(a,0)|0;return g|0}function bQ(a){a=a|0;var b=0,d=0,e=0;bR(a,0,0)|0;b=a+52|0;d=c[b>>2]|0;if((d|0)!=0){cX(d);c[b>>2]=0}cB(a)|0;if((c[a+180>>2]|0)!=0){aV(1888,299,8176,1664)}if((c[a+184>>2]|0)!=0){aV(1888,300,8176,7624)}if((c[a+188>>2]|0)!=0){aV(1888,301,8176,7408)}b=c[a+192>>2]|0;if((b|0)!=0){d=b;while(1){b=c[d>>2]|0;cs(d+4|0);ea(d);if((b|0)==0){break}else{d=b}}}if((c[a>>2]|0)!=1381123450){aV(4528,214,8552,4488)}d=a+8|0;b=c[d>>2]|0;if((b|0)!=0){ea(b);c[d>>2]=0}d=c[a+32>>2]|0;if((d|0)==0){e=a;ea(e);return}ea(d);e=a;ea(e);return}function bR(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,p=0,q=0,r=0;e=i;f=a+44|0;if((c[f>>2]|0)!=0){bS(a,0)|0}g=a+48|0;do{if((c[g>>2]|0)!=0){if((c[a+116>>2]|0)!=0){break}cm(a)|0}}while(0);cc(a)|0;h=c[g>>2]|0;if((h|0)!=0){cj(h);c[g>>2]=0}h=c[f>>2]|0;if((h|0)!=0){b5(h);c[f>>2]=0}h=(b|0)!=0;j=(d|0)==0;if(j&(h^1)){k=0;l=cq(a,0)|0;i=e;return k|0}do{if(!j){d=cd()|0;c[g>>2]=d;if((d|0)!=0){break}d=a;if((c[a>>2]|0)!=1381123450){aV(4528,148,8664,4488);return 0}c[a+16>>2]=-2;c[a+20>>2]=1;c[a+24>>2]=8152;c[a+28>>2]=7120;if((c[2544]|0)<=0){k=-1;l=cq(a,0)|0;i=e;return k|0}bF(d,0)|0;k=-1;l=cq(a,0)|0;i=e;return k|0}}while(0);do{if(h){j=b0()|0;c[f>>2]=j;if((j|0)==0){d=a;if((c[a>>2]|0)!=1381123450){aV(4528,148,8664,4488);return 0}c[a+16>>2]=-2;c[a+20>>2]=1;c[a+24>>2]=8152;c[a+28>>2]=6832;if((c[2544]|0)<=0){k=-1;l=cq(a,0)|0;i=e;return k|0}bF(d,0)|0;k=-1;l=cq(a,0)|0;i=e;return k|0}d=c[a+60>>2]|0;m=c[a+64>>2]|0;if((d|m|0)!=0){b9(j,d,m)|0}m=c[a+68>>2]|0;if((m|0)!=0){d=c[f>>2]|0;ce(d,m)|0}m=c[a+72>>2]|0;if((m|0)==0){n=236}else{if((cf(c[f>>2]|0,m)|0)==0){n=236}}if((n|0)==236){if((b1(c[f>>2]|0,b)|0)==0){break}}m=c[f>>2]|0;d=m;if((c[a>>2]|0)!=1381123450){aV(4528,127,8504,4448);return 0}if((c[m>>2]|0)!=1381123450){aV(4528,128,8504,4384);return 0}c[a+12>>2]=c[d+12>>2];c[a+16>>2]=c[d+16>>2];c[a+20>>2]=c[d+20>>2];c[a+24>>2]=c[d+24>>2];c[a+28>>2]=c[d+28>>2];m=d+32|0;c[a+32>>2]=c[m>>2];c[m>>2]=0;c[a+36>>2]=c[d+36>>2];k=-1;l=cq(a,0)|0;i=e;return k|0}}while(0);b=a+88|0;L328:do{if((c[b>>2]|0)!=0){n=c[f>>2]|0;do{if((n|0)!=0){if((b8(n)|0)>=0){if((c[b>>2]|0)==0){break L328}else{break}}h=a;if((c[a>>2]|0)!=1381123450){aV(4528,148,8664,4488);return 0}c[a+12>>2]=c[(a0()|0)>>2];c[a+16>>2]=-1;c[a+20>>2]=5;c[a+24>>2]=8152;c[a+28>>2]=6600;if((c[2544]|0)<=0){k=-1;l=cq(a,0)|0;i=e;return k|0}bF(h,0)|0;k=-1;l=cq(a,0)|0;i=e;return k|0}}while(0);if((c[g>>2]|0)==0){if((c[f>>2]|0)==0){break}}n=a;if((c[a>>2]|0)!=1381123450){aV(4528,148,8664,4488);return 0}c[a+12>>2]=c[(a0()|0)>>2];c[a+16>>2]=-1;c[a+20>>2]=5;c[a+24>>2]=8152;c[a+28>>2]=6304;if((c[2544]|0)<=0){k=-1;l=cq(a,0)|0;i=e;return k|0}bF(n,0)|0;k=-1;l=cq(a,0)|0;i=e;return k|0}}while(0);do{if((c[g>>2]|0)!=0){b=c[f>>2]|0;if((b|0)==0){p=480;q=640}else{n=ca(b)|0;p=cb(c[f>>2]|0)|0;q=n}n=cl(a,4672,q,p)|0;if((n|0)==0){break}else{k=n}l=cq(a,0)|0;i=e;return k|0}}while(0);p=c[f>>2]|0;if((p|0)==0){k=0;l=cq(a,0)|0;i=e;return k|0}q=c[a+76>>2]|0;if((q|0)!=0){if((cg(p,q)|0)==0){k=0;l=cq(a,0)|0;i=e;return k|0}q=c[f>>2]|0;n=q;if((c[a>>2]|0)!=1381123450){aV(4528,127,8504,4448);return 0}if((c[q>>2]|0)!=1381123450){aV(4528,128,8504,4384);return 0}c[a+12>>2]=c[n+12>>2];c[a+16>>2]=c[n+16>>2];c[a+20>>2]=c[n+20>>2];c[a+24>>2]=c[n+24>>2];c[a+28>>2]=c[n+28>>2];q=n+32|0;c[a+32>>2]=c[q>>2];c[q>>2]=0;c[a+36>>2]=c[n+36>>2];k=-1;l=cq(a,0)|0;i=e;return k|0}n=c[g>>2]|0;do{if((n|0)==0){r=p}else{if((cJ(p,n)|0)==0){k=0;l=cq(a,0)|0;i=e;return k|0}else{g=c[o>>2]|0;a5(6080,83,1,g|0)|0;r=c[f>>2]|0;break}}}while(0);if((cJ(r,0)|0)==0){k=0;l=cq(a,0)|0;i=e;return k|0}if((c[2544]|0)>0){r=c[o>>2]|0;n=(c[f>>2]|0)!=0?5720:5576;ar(r|0,5896,(v=i,i=i+16|0,c[v>>2]=8152,c[v+8>>2]=n,v)|0)|0}if((c[a>>2]|0)!=1381123450){aV(4528,148,8664,4488);return 0}c[a+16>>2]=-1;c[a+20>>2]=3;c[a+24>>2]=8152;c[a+28>>2]=5344;if((c[2544]|0)<=0){k=-1;l=cq(a,0)|0;i=e;return k|0}bF(a,0)|0;k=-1;l=cq(a,0)|0;i=e;return k|0}function bS(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;cc(a)|0;d=a+44|0;if((c[d>>2]|0)==0){e=a;if((c[a>>2]|0)!=1381123450){aV(4528,148,8664,4488);return 0}c[a+16>>2]=-1;c[a+20>>2]=4;c[a+24>>2]=8120;c[a+28>>2]=4808;if((c[2544]|0)<=0){f=-1;g=cq(a,0)|0;return f|0}bF(e,0)|0;f=-1;g=cq(a,0)|0;return f|0}c3(c[a+52>>2]|0,b);e=b7(c[d>>2]|0,b)|0;do{if((e|0)==0){h=a+96|0;c[h>>2]=b;i=cC(a)|0;j=h}else{h=c[d>>2]|0;k=h;if((c[a>>2]|0)!=1381123450){aV(4528,127,8504,4448);return 0}if((c[h>>2]|0)==1381123450){c[a+12>>2]=c[k+12>>2];c[a+16>>2]=c[k+16>>2];c[a+20>>2]=c[k+20>>2];c[a+24>>2]=c[k+24>>2];c[a+28>>2]=c[k+28>>2];h=k+32|0;c[a+32>>2]=c[h>>2];c[h>>2]=0;c[a+36>>2]=c[k+36>>2];i=e;j=a+96|0;break}else{aV(4528,128,8504,4384);return 0}}}while(0);do{if((c[j>>2]|0)==0){e=a+48|0;d=c[e>>2]|0;if((d|0)==0){l=i;break}do{if((ck(d,0)|0)!=0&(i|0)==0){b=c[e>>2]|0;if((c[a>>2]|0)!=1381123450){aV(4528,127,8504,4448);return 0}if((c[b>>2]|0)==1381123450){c[a+12>>2]=c[b+12>>2];c[a+16>>2]=c[b+16>>2];c[a+20>>2]=c[b+20>>2];c[a+24>>2]=c[b+24>>2];c[a+28>>2]=c[b+28>>2];k=b+32|0;c[a+32>>2]=c[k>>2];c[k>>2]=0;c[a+36>>2]=c[b+36>>2];m=-1;break}else{aV(4528,128,8504,4384);return 0}}else{m=i}}while(0);co(a)|0;l=m}else{l=i}}while(0);if((c[a+144>>2]|0)==0){f=l;g=cq(a,0)|0;return f|0}cu(a+152|0);f=l;g=cq(a,0)|0;return f|0}function bT(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;d=i;i=i+8|0;e=d|0;cc(a)|0;f=a+92|0;if((c[f>>2]|0)==0){if((c[a+96>>2]|0)!=0|(b|0)>-1){g=327}}else{g=327}do{if((g|0)==327){if((b|0)<0){h=0}else{aS(e|0,0)|0;j=e+4|0;k=(c[j>>2]|0)+(((b|0)%1e3|0)*1e3|0)|0;l=e|0;c[l>>2]=((k|0)/1e6|0)+((b|0)/1e3|0)+(c[l>>2]|0);c[j>>2]=(k|0)%1e6|0;h=e}k=cv(a,1,h)|0;if((c[f>>2]|0)==0){break}if((k|0)<=0){m=k;n=cq(a,0)|0;i=d;return m|0}m=c[a+84>>2]|0;n=cq(a,0)|0;i=d;return m|0}}while(0);if((c[a>>2]|0)!=1381123450){aV(4528,148,8664,4488);return 0}c[a+16>>2]=1;c[a+20>>2]=10;c[a+24>>2]=8088;c[a+28>>2]=4984;if((c[2544]|0)<=0){m=-1;n=cq(a,0)|0;i=d;return m|0}bF(a,0)|0;m=-1;n=cq(a,0)|0;i=d;return m|0}function bU(a){a=a|0;var b=0,c=0;b=a&1792;if((b|0)==512){c=7384}else if((b|0)==1280){c=7040}else{c=10200}return c|0}function bV(a){a=a|0;return c[a>>2]|0}function bW(a){a=a|0;return c[a+12>>2]|0}function bX(a){a=a|0;return c[a+44>>2]|0}function bY(a){a=a|0;return c[a+48>>2]|0}function bZ(a){a=a|0;return c[a+20>>2]|0}function b_(a){a=a|0;var b=0;if((a|0)==0){b=0}else{b=c[a+32>>2]|0}return b|0}function b$(a){a=a|0;var b=0,d=0,e=0;b=a+36|0;d=c[b>>2]|0;if((d|0)!=0){b2(d,-1);c[b>>2]=0}b=c[a+24>>2]|0;if((b|0)!=0){ea(b)}if((c[a+4>>2]|0)==0){e=a;ea(e);return}b=c[a+12>>2]|0;if((b|0)==0){e=a;ea(e);return}ea(b);e=a;ea(e);return}function b0(){var a=0,b=0,d=0,e=0,f=0,g=0,h=0;a=eb(1,140)|0;b=a;if((a|0)==0){d=0;return d|0}c[a>>2]=1381123450;c[a+4>>2]=1;c[a+40>>2]=-1;c[a+92>>2]=4;e=eb(4,4)|0;f=a+96|0;c[f>>2]=e;if((e|0)==0){b5(b);d=0;return d|0}else{g=0}while(1){e=bH()|0;c[(c[f>>2]|0)+(g<<2)>>2]=e;if((e|0)==0){break}c[e+28>>2]=0;c[e+24>>2]=6;c[e+36>>2]=g;c[e+32>>2]=b;e=g+1|0;if((e|0)<4){g=e}else{d=b;h=373;break}}if((h|0)==373){return d|0}b5(b);d=0;return d|0}function b1(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0;e=i;f=b+60|0;g=a[f]|0;if((g&2)!=0){a[f]=g&-3;g=b+92|0;if((c[g>>2]|0)>0){f=b+96|0;h=0;do{c[(c[(c[f>>2]|0)+(h<<2)>>2]|0)+40>>2]=0;h=h+1|0;}while((h|0)<(c[g>>2]|0))}c[b+104>>2]=0;c[b+100>>2]=0;g=c[b+128>>2]|0;a9[g&1](b)|0}g=b+52|0;if((c[g>>2]|0)!=0){h=b+120|0;f=c[h>>2]|0;if((f|0)!=0){a9[f&1](b)|0;c[h>>2]=0}if((c[2544]|0)>0){h=c[o>>2]|0;f=c[b+40>>2]|0;ar(h|0,6704,(v=i,i=i+16|0,c[v>>2]=7968,c[v+8>>2]=f,v)|0)|0}c[g>>2]=0}if((d|0)==0){j=0;i=e;return j|0}g=a[d]|0;if((g&255)>=16){j=cG(b,d)|0;i=e;return j|0}d=aK(7472)|0;a[d+10|0]=g+48&255;g=cG(b,d)|0;if((d|0)==0){j=g;i=e;return j|0}ea(d);j=g;i=e;return j|0}function b2(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=a|0;e=(c[d>>2]|0)+b|0;c[d>>2]=e;if((e|0)<=-1){aV(5680,75,9136,5536)}if(!((e|0)==0&(b|0)<1)){return}b=c[a+8>>2]|0;L533:do{if((b|0)!=0){e=b;while(1){d=e+32|0;f=c[d>>2]|0;c[d>>2]=0;d=e+28|0;g=c[d>>2]|0;h=g-1|0;c[d>>2]=h;if((g|0)<=0){break}if((h|0)==0){h=e+36|0;g=c[h>>2]|0;if((g|0)!=0){b2(g,-1);c[h>>2]=0}h=c[e+24>>2]|0;if((h|0)!=0){ea(h)}do{if((c[e+4>>2]|0)!=0){h=c[e+12>>2]|0;if((h|0)==0){break}ea(h)}}while(0);ea(e)}if((f|0)==0){break L533}else{e=f}}aV(5680,75,9136,5536)}}while(0);ea(a);return}function b3(){var a=0,b=0,d=0;a=eb(1,16)|0;b=a;d=c[b>>2]|0;c[b>>2]=d+1;if((d|0)>-2){return a|0}else{aV(5680|0,75,9136|0,5536|0);return 0}return 0}function b4(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0;b=c[a+8>>2]|0;if((b|0)==0){d=a;ea(d);return}else{e=b}while(1){b=e+32|0;f=c[b>>2]|0;c[b>>2]=0;b=e+28|0;g=c[b>>2]|0;h=g-1|0;c[b>>2]=h;if((g|0)<=0){i=421;break}if((h|0)==0){h=e+36|0;g=c[h>>2]|0;if((g|0)!=0){b2(g,-1);c[h>>2]=0}h=c[e+24>>2]|0;if((h|0)!=0){ea(h)}do{if((c[e+4>>2]|0)!=0){h=c[e+12>>2]|0;if((h|0)==0){break}ea(h)}}while(0);ea(e)}if((f|0)==0){i=433;break}else{e=f}}if((i|0)==421){aV(5680,75,9136,5536)}else if((i|0)==433){d=a;ea(d);return}}function b5(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;d=i;e=b+52|0;do{if((c[e>>2]|0)!=0){f=b+60|0;g=a[f]|0;if((g&2)!=0){a[f]=g&-3;g=b+92|0;if((c[g>>2]|0)>0){f=b+96|0;h=0;do{c[(c[(c[f>>2]|0)+(h<<2)>>2]|0)+40>>2]=0;h=h+1|0;}while((h|0)<(c[g>>2]|0))}c[b+104>>2]=0;c[b+100>>2]=0;g=c[b+128>>2]|0;a9[g&1](b)|0;if((c[e>>2]|0)==0){break}}g=b+120|0;h=c[g>>2]|0;if((h|0)!=0){a9[h&1](b)|0;c[g>>2]=0}if((c[2544]|0)>0){g=c[o>>2]|0;h=c[b+40>>2]|0;ar(g|0,6704,(v=i,i=i+16|0,c[v>>2]=7968,c[v+8>>2]=h,v)|0)|0}c[e>>2]=0}}while(0);e=b+96|0;h=c[e>>2]|0;if((h|0)!=0){g=c[h>>2]|0;if((g|0)==0){j=h}else{ea(g);j=c[e>>2]|0}g=c[j+4>>2]|0;if((g|0)==0){k=j}else{ea(g);k=c[e>>2]|0}g=c[k+8>>2]|0;if((g|0)==0){l=k}else{ea(g);l=c[e>>2]|0}g=c[l+12>>2]|0;if((g|0)==0){m=l}else{ea(g);m=c[e>>2]|0}ea(m)}m=b+108|0;e=c[m>>2]|0;if((e|0)!=0){g=e;do{c[m>>2]=c[g+40>>2];ea(c[g+12>>2]|0);ea(g);g=c[m>>2]|0;}while((g|0)!=0)}g=c[b+84>>2]|0;if((g|0)!=0){ea(g)}g=c[b+72>>2]|0;if((g|0)!=0){ea(g)}if((c[b>>2]|0)!=1381123450){aV(4768,214,8536,4600)}g=b+8|0;m=c[g>>2]|0;if((m|0)!=0){ea(m);c[g>>2]=0}g=c[b+32>>2]|0;if((g|0)==0){n=b;ea(n);i=d;return}ea(g);n=b;ea(n);i=d;return}function b6(b){b=b|0;var d=0,e=0,f=0;d=c[b+32>>2]|0;if((d|0)==0){aV(7576,36,9e3,6504)}e=c[b+36>>2]|0;if((e|0)<=-1){aV(7576,37,9e3,4416)}f=(c[d+96>>2]|0)+(e<<2)|0;if((c[f>>2]|0)!=(b|0)){c[f>>2]=b}if((a[d+60|0]&2)==0){return}bb[c[d+132>>2]&15](d,b)|0;return}function b7(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0;e=b+60|0;f=a[e]|0;if(((f&255)>>>1&1|0)==(d|0)){g=0;return g|0}if((d|0)==0){a[e]=f&-3;h=b+92|0;if((c[h>>2]|0)>0){i=b+96|0;j=0;do{c[(c[(c[i>>2]|0)+(j<<2)>>2]|0)+40>>2]=0;j=j+1|0;}while((j|0)<(c[h>>2]|0))}c[b+104>>2]=0;c[b+100>>2]=0;g=a9[c[b+128>>2]&1](b)|0;return g|0}if((c[b+52>>2]|0)==0){h=b;if((c[b>>2]|0)!=1381123450){aV(4768,148,8648,4600);return 0}c[b+16>>2]=-1;c[b+20>>2]=4;c[b+24>>2]=8048;c[b+28>>2]=5240;if((c[2544]|0)<=0){g=-1;return g|0}bF(h,0)|0;g=-1;return g|0}do{if((f&1)==0){if((cJ(b,0)|0)==0){k=a[e]|0;break}else{g=-1;return g|0}}else{k=f}}while(0);a[e]=k&-3|(d&255)<<1&2;d=b+92|0;L675:do{if((c[d>>2]|0)>0){k=b+132|0;e=b+96|0;f=0;while(1){h=f+1|0;if((bb[c[k>>2]&15](b,c[(c[e>>2]|0)+(f<<2)>>2]|0)|0)!=0){g=-1;break}if((h|0)<(c[d>>2]|0)){f=h}else{break L675}}return g|0}}while(0);g=a9[c[b+124>>2]&1](b)|0;return g|0}function b8(a){a=a|0;var b=0,d=0,e=0;b=c[a+52>>2]|0;if((b|0)==0){d=a;if((c[a>>2]|0)!=1381123450){aV(4768,148,8648,4600);return 0}c[a+16>>2]=-1;c[a+20>>2]=4;c[a+24>>2]=8024;c[a+28>>2]=5240;if((c[2544]|0)<=0){e=-1;return e|0}bF(d,0)|0;e=-1;return e|0}else if((b|0)==2){e=c[a+40>>2]|0;return e|0}else{if((c[a>>2]|0)!=1381123450){aV(4768,148,8648,4600);return 0}c[a+16>>2]=1;c[a+20>>2]=3;c[a+24>>2]=8024;c[a+28>>2]=4224;if((c[2544]|0)<=0){e=-1;return e|0}bF(a,0)|0;e=-1;return e|0}return 0}function b9(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=i;if((a[b+60|0]&1)==0){c[b+44>>2]=d;c[b+48>>2]=e;if((c[2544]|0)<=0){g=0;i=f;return g|0}h=c[o>>2]|0;ar(h|0,3256,(v=i,i=i+24|0,c[v>>2]=7880,c[v+8>>2]=d,c[v+16>>2]=e,v)|0)|0;g=0;i=f;return g|0}if((c[b>>2]|0)!=1381123450){aV(4768,148,8648,4600);return 0}c[b+16>>2]=-1;c[b+20>>2]=4;c[b+24>>2]=7880;c[b+28>>2]=3784;if((c[2544]|0)<=0){g=-1;i=f;return g|0}bF(b,0)|0;g=-1;i=f;return g|0}function ca(a){a=a|0;return c[a+44>>2]|0}function cb(a){a=a|0;return c[a+48>>2]|0}function cc(a){a=a|0;var b=0,d=0,e=0;b=a+172|0;d=c[b>>2]|0;if((d|0)==0){c[a+176>>2]=0;e=1}else{e=d+1|0}c[b>>2]=e;return 0}function cd(){var a=0,b=0;a=eb(1,148)|0;if((a|0)==0){b=0;return b|0}c[a>>2]=1381123450;c[a+4>>2]=2;c[a+44>>2]=1;b=a;return b|0}function ce(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=i;e=a+52|0;if((c[e>>2]|0)==0){c[e>>2]=b;if((c[2544]|0)<=0){f=0;i=d;return f|0}e=c[o>>2]|0;ar(e|0,2520,(v=i,i=i+16|0,c[v>>2]=7936,c[v+8>>2]=b,v)|0)|0;f=0;i=d;return f|0}if((c[a>>2]|0)!=1381123450){aV(4768,148,8648,4600);return 0}c[a+16>>2]=-1;c[a+20>>2]=4;c[a+24>>2]=7936;c[a+28>>2]=2912;if((c[2544]|0)<=0){f=-1;i=d;return f|0}bF(a,0)|0;f=-1;i=d;return f|0}function cf(a,b){a=a|0;b=b|0;var d=0,e=0;if((c[a+52>>2]|0)!=0){d=a;if((c[a>>2]|0)!=1381123450){aV(4768,148,8648,4600);return 0}c[a+16>>2]=-1;c[a+20>>2]=4;c[a+24>>2]=7904;c[a+28>>2]=2184;if((c[2544]|0)<=0){e=-1;return e|0}bF(d,0)|0;e=-1;return e|0}if(b>>>0<=3){c[a+56>>2]=b;e=0;return e|0}if((c[a>>2]|0)!=1381123450){aV(4768,148,8648,4600);return 0}c[a+16>>2]=-1;c[a+20>>2]=4;c[a+24>>2]=7904;c[a+28>>2]=1832;if((c[2544]|0)<=0){e=-1;return e|0}bF(a,0)|0;e=-1;return e|0}function cg(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,p=0,q=0,r=0,s=0;e=i;f=b+60|0;if((a[f]&1)!=0){g=b;if((c[b>>2]|0)!=1381123450){aV(4768,148,8648,4600);return 0}c[b+16>>2]=-1;c[b+20>>2]=4;c[b+24>>2]=8008;c[b+28>>2]=7752;if((c[2544]|0)<=0){h=-1;i=e;return h|0}bF(g,0)|0;h=-1;i=e;return h|0}if((bb[c[b+116>>2]&15](b,d)|0)!=0){h=-1;i=e;return h|0}g=b+64|0;c[g>>2]=d;d=b+76|0;j=c[d>>2]|0;if((j|0)==0){aV(7576,231,8272,6040);return 0}k=b+56|0;l=c[k>>2]|0;do{if((l|0)==2){m=b+92|0}else{n=b+84|0;if((c[n>>2]|0)!=0){aV(7576,233,8272,5856);return 0}p=b+92|0;q=c[p>>2]|0;r=aa(q,j)|0;c[b+80>>2]=r;s=d9(r)|0;c[n>>2]=s;if((s|0)!=0){if((c[2544]|0)<=0){m=p;break}s=c[o>>2]|0;n=(l|0)==1?5312:5168;ar(s|0,5488,(v=i,i=i+32|0,c[v>>2]=8272,c[v+8>>2]=q,c[v+16>>2]=n,c[v+24>>2]=r,v)|0)|0;m=p;break}p=b;if((c[b>>2]|0)!=1381123450){aV(4768,148,8648,4600);return 0}c[b+16>>2]=-2;c[b+20>>2]=1;c[b+24>>2]=8272;c[b+28>>2]=5640;if((c[2544]|0)<=0){h=-1;i=e;return h|0}bF(p,0)|0;h=-1;i=e;return h|0}}while(0);if((c[m>>2]|0)>0){l=b+96|0;j=b+44|0;p=b+48|0;r=b+84|0;b=0;do{n=c[(c[l>>2]|0)+(b<<2)>>2]|0;c[n>>2]=c[g>>2];c[n+4>>2]=c[j>>2];c[n+8>>2]=c[p>>2];do{if((c[k>>2]|0)!=2){c[n+16>>2]=c[d>>2];q=aa(c[d>>2]|0,b)|0;c[n+12>>2]=(c[r>>2]|0)+q;if((c[2544]|0)<=1){break}s=c[o>>2]|0;ar(s|0,4864,(v=i,i=i+24|0,c[v>>2]=8272,c[v+8>>2]=b,c[v+16>>2]=q,v)|0)|0}}while(0);b=b+1|0;}while((b|0)<(c[m>>2]|0))}a[f]=a[f]|1;h=0;i=e;return h|0}function ch(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;if((a[b+60|0]&2)==0){d=0;return d|0}e=b+88|0;f=c[e>>2]|0;c[e>>2]=f+1;e=a9[c[b+136>>2]&1](b)|0;if((e|0)==0){d=0;return d|0}c[e+44>>2]=f;do{if((c[b+92>>2]|0)<2){g=b+108|0;h=c[g>>2]|0;do{if((h|0)==0){c[g>>2]=0;i=bH()|0;if((i|0)==0){aV(7576,359,7984,7376);return 0}else{c[i+28>>2]=0;c[i+32>>2]=b;c[i>>2]=c[b+64>>2];c[i+4>>2]=c[b+44>>2];c[i+8>>2]=c[b+48>>2];j=b+76|0;c[i+16>>2]=c[j>>2];k=d9(c[j>>2]|0)|0;c[i+12>>2]=k;l=i;m=k;break}}else{c[g>>2]=c[h+40>>2];l=h;m=c[h+12>>2]|0}}while(0);c[l+24>>2]=4;c[l+44>>2]=f;h=c[e+12>>2]|0;g=c[l+16>>2]|0;eg(m|0,h|0,g)|0;g=c[e+32>>2]|0;if((g|0)==0){aV(7576,36,9e3,6504);return 0}h=c[e+36>>2]|0;if((h|0)<=-1){aV(7576,37,9e3,4416);return 0}k=(c[g+96>>2]|0)+(h<<2)|0;if((c[k>>2]|0)!=(e|0)){c[k>>2]=e}if((a[g+60|0]&2)==0){n=l;break}k=c[g+132>>2]|0;bb[k&15](g,e)|0;n=l}else{c[e+24>>2]=6;n=e}}while(0);e=n+28|0;l=c[e>>2]|0;c[e>>2]=l+1;if((l|0)>-2){d=n;return d|0}else{aV(7024,75,9120,6744);return 0}return 0}function ci(a){a=a|0;var b=0,d=0;b=c[a+32>>2]|0;if((b|0)==0){aV(7576,50,8968,6504)}if((c[a+36>>2]|0)==-1){d=b+108|0;c[a+40>>2]=c[d>>2];c[d>>2]=a;return}else{aV(7576,51,8968,6256)}}function cj(a){a=a|0;var b=0,d=0,e=0;ck(a,0)|0;b=a+144|0;d=c[b>>2]|0;if((d|0)!=0){a9[d&1](a)|0;c[b>>2]=0;c[a+140>>2]=0}b=a+112|0;d=c[b>>2]|0;if((d|0)!=0){ea(d);c[b>>2]=0}c[a+108>>2]=0;c[a+104>>2]=0;ej(a+68|0,0,20);c[a+64>>2]=32768;c[a+60>>2]=32768;c[a+92>>2]=1;c[a+88>>2]=1;cp(a,0,0)|0;if((c[a>>2]|0)!=1381123450){aV(2504,214,8520,2152)}b=a+8|0;d=c[b>>2]|0;if((d|0)!=0){ea(d);c[b>>2]=0}b=c[a+32>>2]|0;if((b|0)==0){e=a;ea(e);return}ea(b);e=a;ea(e);return}function ck(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=(c[a+140>>2]|0)==0?0:b;do{if((d|0)!=0){b=d+28|0;e=c[b>>2]|0;c[b>>2]=e+1;if((e|0)<=-2){aV(3240,75,9104,2904);return 0}if((c[d+4>>2]|0)==(c[a+72>>2]|0)){if((c[d+8>>2]|0)==(c[a+76>>2]|0)){break}}c[a+80>>2]=0}}while(0);e=a+40|0;a=c[e>>2]|0;if((a|0)==0){c[e>>2]=d;return 0}b=a+28|0;f=c[b>>2]|0;g=f-1|0;c[b>>2]=g;if((f|0)<=0){aV(3240,75,9104,2904);return 0}if((g|0)!=0){c[e>>2]=d;return 0}g=c[a+24>>2]|0;if((g|0)!=0){a7[g&15](a)}if((c[a+32>>2]|0)!=0){c[e>>2]=d;return 0}bB(a);c[e>>2]=d;return 0}function cl(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;if((c[a>>2]|0)!=1381123450){aV(7360,148,8632,5136);return 0}c[a+16>>2]=-1;c[a+20>>2]=3;c[a+24>>2]=9288;c[a+28>>2]=5184;if((c[2544]|0)<=0){return-1|0}bF(a,0)|0;return-1|0}function cm(a){a=a|0;if((c[a>>2]|0)!=1381123450){aV(7360,148,8632,5136);return 0}c[a+16>>2]=-1;c[a+20>>2]=3;c[a+24>>2]=9368;c[a+28>>2]=5184;if((c[2544]|0)<=0){return-1|0}bF(a,0)|0;return-1|0}function cn(a,b,d){a=a|0;b=b|0;d=d|0;if((c[a>>2]|0)!=1381123450){aV(7360,148,8632,5136);return 0}c[a+16>>2]=-1;c[a+20>>2]=3;c[a+24>>2]=9256;c[a+28>>2]=5184;if((c[2544]|0)<=0){return-1|0}bF(a,0)|0;return-1|0}function co(a){a=a|0;if((c[a>>2]|0)!=1381123450){aV(7360,148,8632,5136);return 0}c[a+16>>2]=-1;c[a+20>>2]=3;c[a+24>>2]=9312;c[a+28>>2]=5184;if((c[2544]|0)<=0){return-1|0}bF(a,0)|0;return-1|0}function cp(a,b,d){a=a|0;b=b|0;d=d|0;if((c[a>>2]|0)!=1381123450){aV(7336,148,8616,5104);return 0}c[a+16>>2]=-1;c[a+20>>2]=3;c[a+24>>2]=8944;c[a+28>>2]=4944;if((c[2544]|0)<=0){return-1|0}bF(a,0)|0;return-1|0}function cq(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0;d=a+172|0;e=c[d>>2]|0;if((e|0)<=0){aV(4632,126,9232,7176);return 0}f=(b|0)==0?e-1|0:0;c[d>>2]=f;if((f|0)!=0){return 0}f=a+188|0;e=c[f>>2]|0;b=a+180|0;g=c[((e|0)==0?b:e|0)>>2]|0;if((g|0)==0){return 0}else{h=e;i=g}while(1){if((c[i+16>>2]&3|0)==0){break}c[f>>2]=i;g=c[i>>2]|0;if((g|0)==0){j=723;break}else{h=i;i=g}}if((j|0)==723){return 0}j=i|0;f=c[j>>2]|0;if((h|0)==0){c[b>>2]=f}else{c[h>>2]=f}if((c[j>>2]|0)==0){c[a+184>>2]=h}c[j>>2]=0;c[d>>2]=1;c[a+176>>2]=c[i+12>>2];if((i|0)==0){return 0}cu(i+4|0);return 0}function cr(a){a=a|0;c[a>>2]=0;c[a+4>>2]=-1;return 0}function cs(a){a=a|0;c[a>>2]=-1;c[a+4>>2]=-1;return}function ct(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;d=a+188|0;c[d>>2]=0;e=a+180|0;f=c[e>>2]|0;if((f|0)!=0){g=~b;h=b&128;b=f;do{f=b+16|0;c[f>>2]=c[f>>2]&g|h;b=c[b>>2]|0;}while((b|0)!=0)}b=a+172|0;if((c[b>>2]|0)!=0){return}h=c[d>>2]|0;g=c[((h|0)==0?e:h|0)>>2]|0;if((g|0)==0){return}else{i=h;j=g}while(1){if((c[j+16>>2]&3|0)==0){break}c[d>>2]=j;g=c[j>>2]|0;if((g|0)==0){k=743;break}else{i=j;j=g}}if((k|0)==743){return}k=j|0;d=c[k>>2]|0;if((i|0)==0){c[e>>2]=d}else{c[i>>2]=d}if((c[k>>2]|0)==0){c[a+184>>2]=i}c[k>>2]=0;c[b>>2]=1;c[a+176>>2]=c[j+12>>2];if((j|0)==0){return}cu(j+4|0);return}function cu(a){a=a|0;var b=0,d=0,e=0;b=i;i=i+8|0;d=b|0;c[a>>2]=1;e=a+4|0;a=c[e>>2]|0;if((a|0)<=-1){i=b;return}c[d>>2]=0;if((aH(a|0,d|0,4)|0)<0){aU(10192)}c[e>>2]=-1;i=b;return}function cv(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;e=i;i=i+8|0;f=e|0;g=a+172|0;h=c[g>>2]|0;j=a+192|0;k=c[j>>2]|0;if((k|0)==0){l=eb(1,20)|0;m=l;n=l+4|0;cr(n)|0;o=m}else{c[j>>2]=c[k>>2];c[k+16>>2]=0;o=k}k=o|0;c[k>>2]=0;c[o+12>>2]=0;m=a+180|0;if((c[m>>2]|0)==0){c[m>>2]=o;p=a+184|0}else{n=a+184|0;c[c[n>>2]>>2]=o;p=n}c[p>>2]=o;p=o+16|0;c[p>>2]=b&3;cq(a,1)|0;b=a+88|0;L1006:do{if((c[b>>2]|0)==0){do{if((c[a+96>>2]|0)==0){n=f;if((d|0)==0){q=n;r=772}else{s=f+4|0;t=d+4|0;u=f|0;v=d|0;w=n;r=771}}else{n=a+44|0;l=f;x=(d|0)==0;y=d|0;z=f|0;A=d+4|0;B=f+4|0;if((b8(c[n>>2]|0)|0)>=0){if(x){q=l;r=772;break}else{s=B;t=A;u=z;v=y;w=l;r=771;break}}if(x){x=1;while(1){if((c[p>>2]&3|0)==0){C=x;r=778;break L1006}l=ch(c[n>>2]|0)|0;if((l|0)==0){D=-1;r=779;break L1006}bL(a,l)|0;bI(l);l=cx(a,0,15)|0;if((l|0)>0){x=l}else{D=l;r=779;break L1006}}}else{x=1;while(1){if((c[p>>2]&3|0)==0){C=x;r=778;break L1006}l=ch(c[n>>2]|0)|0;if((l|0)==0){D=-1;r=779;break L1006}bL(a,l)|0;bI(l);aS(f|0,0)|0;l=(((c[A>>2]|0)-(c[B>>2]|0)|0)/1e3|0)+(((c[y>>2]|0)-(c[z>>2]|0)|0)*1e3|0)|0;E=cx(a,0,l>>>0>15?15:l)|0;if((E|0)>0){x=E}else{D=E;r=779;break L1006}}}}}while(0);if((r|0)==772){x=1;while(1){if((c[p>>2]&3|0)==0){C=x;r=778;break L1006}z=cx(a,0,-1)|0;if((z|0)>0){x=z}else{D=z;r=779;break}}}else if((r|0)==771){x=1;while(1){if((c[p>>2]&3|0)==0){C=x;r=778;break L1006}aS(f|0,0)|0;z=cx(a,0,(((c[t>>2]|0)-(c[s>>2]|0)|0)/1e3|0)+(((c[v>>2]|0)-(c[u>>2]|0)|0)*1e3|0)|0)|0;if((z|0)>0){x=z}else{D=z;r=779;break}}}}else{x=cw(o+4|0,a+172|0,d)|0;if((x|0)<1){D=x;r=779}else{C=x;r=778}}}while(0);if((r|0)==778){if((c[b>>2]|0)==0){D=C;r=779}else{F=C}}do{if((r|0)==779){c[p>>2]=c[p>>2]&128;C=a+188|0;c[C>>2]=0;if((c[g>>2]|0)!=0){b=o+4|0;d=a+172|0;cw(b,d,0)|0;F=D;break}d=c[m>>2]|0;L1040:do{if((d|0)==0){G=0}else{b=0;u=d;while(1){if((c[u+16>>2]&3|0)==0){break}c[C>>2]=u;v=c[u>>2]|0;if((v|0)==0){G=0;break L1040}else{b=u;u=v}}v=u|0;s=c[v>>2]|0;if((b|0)==0){c[m>>2]=s}else{c[b>>2]=s}if((c[v>>2]|0)==0){c[a+184>>2]=b}c[v>>2]=0;c[g>>2]=1;c[a+176>>2]=c[u+12>>2];G=u}}while(0);if((G|0)==(o|0)){F=D;break}aV(4632,212,9208,5048);return 0}}while(0);if((F|0)>0){H=(c[p>>2]&128|0)==0?F:-1}else{H=F}if((c[g>>2]|0)!=1){aV(4632,220,9208,4200);return 0}c[g>>2]=h;if((o|0)==0){i=e;return H|0}c[k>>2]=c[j>>2];c[j>>2]=o;i=e;return H|0}function cw(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0;b=i;i=i+24|0;e=b|0;f=b+8|0;g=b+16|0;h=a|0;L1066:do{if((c[h>>2]|0)==0){if((d|0)==0){j=-1;i=b;return j|0}aS(g|0,0)|0;a=(((c[d+4>>2]|0)-(c[g+4>>2]|0)|0)/1e3|0)+(((c[d>>2]|0)-(c[g>>2]|0)|0)*1e3|0)|0;if((a|0)==0){break}k=e;l=f;if((a|0)<=0){aV(3744,33,8384,7008);return 0}c[e>>2]=(a|0)/1e3|0;c[k+4>>2]=((a|0)%1e3|0)*1e6|0;if((aE(k|0,l|0)|0)==0){break}do{if((c[(a0()|0)>>2]|0)!=4){break L1066}a=c[f+4>>2]|0;c[e>>2]=c[f>>2];c[e+4>>2]=a;}while((aE(k|0,l|0)|0)!=0)}}while(0);e=(c[h>>2]|0)==0|0;c[h>>2]=0;j=e;i=b;return j|0}function cx(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;f=i;i=i+16|0;g=f|0;h=f+8|0;j=a+196|0;k=c[j>>2]|0;if((c[k+12>>2]|0)==0){if((e|0)==0){l=-1;i=f;return l|0}m=g;n=h;if((e|0)<=0){aV(3744,33,8384,7008);return 0}c[g>>2]=(e|0)/1e3|0;c[m+4>>2]=((e|0)%1e3|0)*1e6|0;if((aE(m|0,n|0)|0)==0){l=1;i=f;return l|0}while(1){if((c[(a0()|0)>>2]|0)!=4){l=1;o=841;break}p=c[h+4>>2]|0;c[g>>2]=c[h>>2];c[g+4>>2]=p;if((aE(m|0,n|0)|0)==0){l=1;o=842;break}}if((o|0)==841){i=f;return l|0}else if((o|0)==842){i=f;return l|0}}if((d|0)==0){q=k}else{c[d+4>>2]=c[k+28>>2];q=c[j>>2]|0}j=c[q+32>>2]|0;if((j|0)!=0){bb[j&15](a,-1)|0}j=q+12|0;k=c[j>>2]|0;if((k|0)==0){aV(3744,240,8400,7568);return 0}d=q+16|0;o=ay(c[d>>2]|0,k|0,e|0)|0;if((o|0)<1){l=o;i=f;return l|0}e=q+20|0;q=c[j>>2]|0;j=o;L1110:while(1){o=q;while(1){r=o-1|0;if((o|0)<=0){break L1110}s=c[d>>2]|0;if((b[s+(r<<3)+6>>1]|0)==0){o=r}else{break}}o=c[(c[e>>2]|0)+(r<<2)>>2]|0;if((o|0)==0){t=s}else{bb[o&15](a,r)|0;t=c[d>>2]|0}b[t+(r<<3)+6>>1]=0;q=r;j=j-1|0}if((j|0)==0){l=1;i=f;return l|0}else{aV(3744,253,8400,7352);return 0}return 0}function cy(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0;b=eb(1,36)|0;d=a+196|0;c[d>>2]=b;c[b+28>>2]=-1;e=b+24|0;c[e>>2]=-1;if((c[a+88>>2]|0)==0){f=0;return f|0}if((a2(e|0)|0)==0){cz(a,c[e>>2]|0,8);e=c[d>>2]|0;d=c[e>>2]|0;b=e+12|0;c[b>>2]=d;g=e+16|0;c[g>>2]=ec(c[g>>2]|0,c[b>>2]<<3)|0;h=e+20|0;c[h>>2]=ec(c[h>>2]|0,c[b>>2]<<2)|0;b=c[g>>2]|0;g=c[e+4>>2]|0;i=d<<3;eg(b|0,g|0,i)|0;i=c[h>>2]|0;h=c[e+8>>2]|0;e=d<<2;eg(i|0,h|0,e)|0;f=0;return f|0}if((c[a>>2]|0)!=1381123450){aV(1816,148,8600,7720);return 0}c[a+12>>2]=c[(a0()|0)>>2];c[a+16>>2]=-2;c[a+20>>2]=5;c[a+24>>2]=9344;c[a+28>>2]=7152;if((c[2544]|0)<=0){f=-1;return f|0}bF(a,0)|0;f=-1;return f|0}function cz(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;f=i;i=i+8|0;g=f|0;h=c[a+196>>2]|0;j=h|0;k=c[j>>2]|0;c[j>>2]=k+1;c[g>>2]=k;if((c[2544]|0)>4){l=c[o>>2]|0;ar(l|0,2872,(v=i,i=i+32|0,c[v>>2]=8928,c[v+8>>2]=k,c[v+16>>2]=d,c[v+24>>2]=e,v)|0)|0}k=h+4|0;c[k>>2]=ec(c[k>>2]|0,c[j>>2]<<3)|0;l=h+8|0;c[l>>2]=ec(c[l>>2]|0,c[j>>2]<<2)|0;m=c[g>>2]|0;n=(c[k>>2]|0)+(m<<3)|0;c[n>>2]=0;c[n+4>>2]=0;c[(c[k>>2]|0)+(m<<3)>>2]=d;b[(c[k>>2]|0)+(m<<3)+4>>1]=1;c[(c[l>>2]|0)+(m<<2)>>2]=e;if((c[a+116>>2]|0)!=0){e=c[h+28>>2]|0;if((e|0)>-1){m=g;aH(e|0,m|0,4)|0;i=f;return}else{aV(2480,85,8928,2128)}}if((c[a+88>>2]|0)!=0){i=f;return}c[h+12>>2]=c[j>>2];c[h+16>>2]=c[k>>2];c[h+20>>2]=c[l>>2];i=f;return}function cA(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;b=i;i=i+8|0;d=a+196|0;e=c[d>>2]|0;if((c[2544]|0)>4){f=c[o>>2]|0;g=c[e>>2]|0;ar(f|0,4176,(v=i,i=i+16|0,c[v>>2]=8424,c[v+8>>2]=g,v)|0)|0}g=aN(c[e+24>>2]|0,b|0,8)|0;if((c[a+88>>2]|0)==0){aV(3744,225,8424,3224);return 0}else{a=c[d>>2]|0;d=c[a>>2]|0;e=a+12|0;c[e>>2]=d;f=a+16|0;c[f>>2]=ec(c[f>>2]|0,c[e>>2]<<3)|0;h=a+20|0;c[h>>2]=ec(c[h>>2]|0,c[e>>2]<<2)|0;e=c[f>>2]|0;f=c[a+4>>2]|0;j=d<<3;eg(e|0,f|0,j)|0;j=c[h>>2]|0;h=c[a+8>>2]|0;a=d<<2;eg(j|0,h|0,a)|0;i=b;return g|0}return 0}function cB(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0;b=a+196|0;d=c[b>>2]|0;e=a+88|0;if((c[e>>2]|0)!=0){a=d+24|0;f=c[a>>2]|0;at(f|0)|0;f=d+28|0;g=c[f>>2]|0;at(g|0)|0;c[f>>2]=-1;c[a>>2]=-1}a=d+4|0;f=c[a>>2]|0;do{if((f|0)!=0){ea(f);c[a>>2]=0;if((c[e>>2]|0)!=0){break}c[d+16>>2]=0}}while(0);a=d+8|0;f=c[a>>2]|0;do{if((f|0)!=0){ea(f);c[a>>2]=0;if((c[e>>2]|0)!=0){break}c[d+20>>2]=0}}while(0);e=d+16|0;a=c[e>>2]|0;if((a|0)!=0){ea(a);c[e>>2]=0}e=d+20|0;d=c[e>>2]|0;if((d|0)==0){h=c[b>>2]|0;i=h;ea(i);c[b>>2]=0;return 0}ea(d);c[e>>2]=0;h=c[b>>2]|0;i=h;ea(i);c[b>>2]=0;return 0}function cC(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,p=0,q=0,r=0;b=i;i=i+8|0;d=b|0;e=b8(c[a+44>>2]|0)|0;if((e|0)<0){i=b;return 0}if((c[a+96>>2]|0)!=0){cz(a,e,10);i=b;return 0}f=d;g=c[a+196>>2]|0;h=g|0;j=c[h>>2]|0;k=g+4|0;l=j;while(1){m=l-1|0;if((l|0)<=0){n=0;break}if((c[(c[k>>2]|0)+(m<<3)>>2]|0)==(e|0)){n=1;break}else{l=m}}c[d>>2]=m;if((c[2544]|0)>4){p=c[o>>2]|0;ar(p|0,5024,(v=i,i=i+32|0,c[v>>2]=8320,c[v+8>>2]=m,c[v+16>>2]=e,c[v+24>>2]=j,v)|0)|0}if(n){n=c[h>>2]|0;if((l|0)<(n|0)){j=n-m-1|0;e=c[k>>2]|0;ek(e+(m<<3)|0,e+(l<<3)|0,j<<3|0);e=g+8|0;p=c[e>>2]|0;ek(p+(m<<2)|0,p+(l<<2)|0,j|0);q=c[h>>2]|0;r=e}else{q=n;r=g+8|0}c[h>>2]=q-1;c[k>>2]=ec(c[k>>2]|0,c[h>>2]<<3)|0;c[r>>2]=ec(c[r>>2]|0,c[h>>2]<<2)|0;c[d>>2]=0}if((c[a+116>>2]|0)!=0){d=c[g+28>>2]|0;aH(d|0,f|0,4)|0;i=b;return 0}if((c[a+88>>2]|0)!=0){i=b;return 0}c[g+12>>2]=c[h>>2];c[g+16>>2]=c[k>>2];c[g+20>>2]=c[g+8>>2];i=b;return 0}function cD(a,b){a=a|0;b=b|0;cc(a)|0;do{if((c[a+96>>2]|0)!=0){b=ch(c[a+44>>2]|0)|0;if((b|0)==0){break}bL(a,b)|0;cq(a,0)|0;bI(b);return 0}}while(0);cq(a,0)|0;return 0}function cE(a,b){a=a|0;b=b|0;return cH(a,b,c[a+4>>2]|0,c[a+8>>2]|0)|0}function cF(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,p=0,q=0,r=0,s=0,t=0,u=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;e=i;i=i+8|0;f=e|0;c[f>>2]=a;g=(b|0)!=0;if(g){c[b>>2]=0}if((d|0)==0){h=-1;i=e;return h|0}j=c[d>>2]|0;L1223:do{if((j|0)==0){k=0}else{l=d;m=j;while(1){n=l+4|0;if((m|0)==(a|0)){break}p=c[n>>2]|0;if((p|0)==0){k=0;break L1223}else{l=n;m=p}}if((c[2544]|0)>7){m=c[o>>2]|0;ar(m|0,4272,(v=i,i=i+16|0,c[v>>2]=9584,c[v+8>>2]=f,v)|0)|0}if(!g){h=0;i=e;return h|0}c[b>>2]=c[f>>2];h=0;i=e;return h|0}}while(0);while(1){q=384+(k*12|0)|0;m=c[q>>2]|0;if((m|0)==(a|0)){break}l=(m>>>0<a>>>0)+(k<<1|1)|0;if((l|0)<31){k=l}else{h=-1;r=960;break}}if((r|0)==960){i=e;return h|0}if((q|0)==0){h=-1;i=e;return h|0}if((c[2544]|0)>7){q=c[o>>2]|0;ar(q|0,7064,(v=i,i=i+24|0,c[v>>2]=9584,c[v+8>>2]=f,c[v+16>>2]=a,v)|0)|0;s=c[d>>2]|0}else{s=j}L1247:do{if((s|0)==0){t=-1}else{j=388+(k*12|0)|0;a=392+(k*12|0)|0;if(g){u=d;w=-1;x=s}else{f=d;q=-1;l=s;while(1){m=0;while(1){y=384+(m*12|0)|0;p=c[y>>2]|0;if((p|0)==(l|0)){r=937;break}n=(p>>>0<l>>>0)+(m<<1|1)|0;if((n|0)<31){m=n}else{z=q;break}}do{if((r|0)==937){r=0;if((y|0)==0){z=q;break}n=c[j>>2]|0;p=c[388+(m*12|0)>>2]|0;if((n|0)==(p|0)){if((c[a>>2]|0)==(c[392+(m*12|0)>>2]|0)){A=0}else{r=940}}else{r=940}if((r|0)==940){r=0;A=c[840+(n*48|0)+(p<<3)>>2]|0}if((c[2544]|0)>7){p=c[o>>2]|0;ar(p|0,4888,(v=i,i=i+24|0,c[v>>2]=f,c[v+8>>2]=l,c[v+16>>2]=A,v)|0)|0}z=q>>>0<=A>>>0|(A|0)<0?q:A}}while(0);m=f+4|0;p=c[m>>2]|0;if((p|0)==0){t=z;break L1247}else{f=m;q=z;l=p}}}while(1){l=0;while(1){B=384+(l*12|0)|0;q=c[B>>2]|0;if((q|0)==(x|0)){r=948;break}f=(q>>>0<x>>>0)+(l<<1|1)|0;if((f|0)<31){l=f}else{C=w;break}}do{if((r|0)==948){r=0;if((B|0)==0){C=w;break}f=c[j>>2]|0;q=c[388+(l*12|0)>>2]|0;if((f|0)==(q|0)){if((c[a>>2]|0)==(c[392+(l*12|0)>>2]|0)){D=0}else{r=951}}else{r=951}if((r|0)==951){r=0;D=c[840+(f*48|0)+(q<<3)>>2]|0}if((c[2544]|0)>7){q=c[o>>2]|0;ar(q|0,4888,(v=i,i=i+24|0,c[v>>2]=u,c[v+8>>2]=x,c[v+16>>2]=D,v)|0)|0}q=w>>>0<=D>>>0|(D|0)<0;if(q){C=q?w:D;break}c[b>>2]=c[u>>2];C=D}}while(0);l=u+4|0;q=c[l>>2]|0;if((q|0)==0){t=C;break}else{u=l;w=C;x=q}}}}while(0);if((c[2544]|0)<=7){h=t;i=e;return h|0}aw(10,c[o>>2]|0)|0;h=t;i=e;return h|0}function cG(a,b){a=a|0;b=b|0;if((c[a>>2]|0)!=1381123450){aV(7104,148,8584,4912);return 0}c[a+16>>2]=-1;c[a+20>>2]=3;c[a+24>>2]=9032;c[a+28>>2]=4336;if((c[2544]|0)<=0){return-1|0}bF(a,0)|0;return-1|0}function cH(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;f=bH()|0;c[f>>2]=b;c[f+4>>2]=d;c[f+8>>2]=e;g=c[a>>2]|0;do{if((g|0)==(b|0)){if((c[a+4>>2]|0)!=(d|0)){h=0;break}if((c[a+8>>2]|0)!=(e|0)){h=0;break}c[f+12>>2]=c[a+12>>2];c[f+16>>2]=c[a+16>>2];c[f+24>>2]=2;c[f+40>>2]=a;i=a+28|0;j=c[i>>2]|0;c[i>>2]=j+1;if((j|0)>-2){k=f;return k|0}else{aV(4848,75,9088,4752);return 0}}else{h=0}}while(0);while(1){j=384+(h*12|0)|0;i=c[j>>2]|0;if((i|0)==(g|0)){l=j;break}j=(i>>>0<g>>>0)+(h<<1|1)|0;if((j|0)<31){h=j}else{l=0;break}}h=0;while(1){m=384+(h*12|0)|0;g=c[m>>2]|0;if((g|0)==(b|0)){break}j=(g>>>0<b>>>0)+(h<<1|1)|0;if((j|0)<31){h=j}else{k=0;n=995;break}}if((n|0)==995){return k|0}if((l|0)==0|(m|0)==0){k=0;return k|0}n=c[l+4>>2]|0;b=c[388+(h*12|0)>>2]|0;do{if((n|0)==(b|0)){if((c[l+8>>2]|0)!=(c[392+(h*12|0)>>2]|0)){break}if((c[a+4>>2]|0)!=(d|0)){break}if((c[a+8>>2]|0)!=(e|0)){break}c[f+12>>2]=c[a+12>>2];c[f+16>>2]=c[a+16>>2];c[f+24>>2]=2;c[f+40>>2]=a;j=a+28|0;g=c[j>>2]|0;c[j>>2]=g+1;if((g|0)>-2){k=f;return k|0}else{aV(4848,75,9088,4752);return 0}}}while(0);e=c[840+(n*48|0)+(b<<3)+4>>2]|0;c[f+24>>2]=8;bc[e&31](f,m,a,l);if((c[f+12>>2]|0)!=0){k=f;return k|0}bI(f);k=0;return k|0}function cI(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;e=c[a+4>>2]|0;do{if((c[d+4>>2]|0)==(e|0)){b=c[a+8>>2]|0;if((c[d+8>>2]|0)!=(b|0)){f=b;break}c[a+12>>2]=c[d+12>>2];c[a+16>>2]=c[d+16>>2];c[a+24>>2]=2;c[a+40>>2]=d;b=d+28|0;g=c[b>>2]|0;c[b>>2]=g+1;if((g|0)>-2){return}else{aV(4848,75,9088,4752)}}else{f=c[a+8>>2]|0}}while(0);cR(a,d,aa(f,e)|0);return}function cJ(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,p=0,q=0,r=0,s=0,t=0,u=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;d=i;i=i+16|0;e=d|0;f=d+8|0;g=(a|0)!=0;if((b|0)==0&(g^1)){h=0;i=d;return h|0}j=(b|0)!=0;k=g?a|0:b|0;l=0;while(1){m=l<<1|1;if((m|0)<31){if((c[384+(l*12|0)>>2]|0)>>>0<(c[384+(m*12|0)>>2]|0)>>>0){break}}n=m+1|0;if((n|0)<31){if((c[384+(n*12|0)>>2]|0)>>>0<(c[384+(l*12|0)>>2]|0)>>>0){p=l;q=1016;break}}n=l+1|0;if((n|0)<31){l=n}else{p=n;q=1016;break}}do{if((q|0)==1016){if((p|0)!=31){break}if(g){if((c[a+72>>2]|0)!=0){q=1023}}else{q=1023}do{if((q|0)==1023){if(j){if((c[b+112>>2]|0)==0){break}}if(g){r=c[a+72>>2]|0}else{r=8}if(j){s=c[b+112>>2]|0}else{s=8}c[e>>2]=0;l=-1;n=1456;m=1345466932;L1370:while(1){t=c[r>>2]|0;L1372:do{if((t|0)==0){u=l}else{w=r;x=t;while(1){y=w+4|0;if((x|0)==(m|0)){break}z=c[y>>2]|0;if((z|0)==0){u=l;break L1372}else{w=y;x=z}}c[f>>2]=0;x=cF(c[n>>2]|0,f,s)|0;w=(c[2544]|0)>3;if((x|0)<0){if(!w){u=l;break}z=c[o>>2]|0;y=c[n>>2]|0;ar(z|0,2832,(v=i,i=i+24|0,c[v>>2]=8200,c[v+8>>2]=n,c[v+16>>2]=y,v)|0)|0;u=l;break}if(w){w=c[o>>2]|0;y=c[n>>2]|0;z=c[f>>2]|0;ar(w|0,2440,(v=i,i=i+48|0,c[v>>2]=8200,c[v+8>>2]=n,c[v+16>>2]=y,c[v+24>>2]=f,c[v+32>>2]=z,c[v+40>>2]=x,v)|0)|0}if(l>>>0<=x>>>0){u=l;break}z=c[n>>2]|0;c[e>>2]=z;if((x|0)==0){A=0;B=z;break L1370}else{u=x}}}while(0);t=n+4|0;x=c[t>>2]|0;if((x|0)==0){q=1045;break}else{l=u;n=t;m=x}}if((q|0)==1045){A=u;B=c[e>>2]|0}if((B|0)==0){m=k;if((c[k>>2]|0)!=1381123450){aV(7704,148,8568,7536);return 0}c[k+16>>2]=-1;c[k+20>>2]=3;c[k+24>>2]=8200;c[k+28>>2]=2088;if((c[2544]|0)<=0){h=-1;i=d;return h|0}bF(m,0)|0;h=-1;i=d;return h|0}else{if(!g){h=0;i=d;return h|0}if((c[2544]|0)>1){m=c[o>>2]|0;ar(m|0,1768,(v=i,i=i+32|0,c[v>>2]=8200,c[v+8>>2]=e,c[v+16>>2]=B,c[v+24>>2]=A,v)|0)|0;C=c[e>>2]|0}else{C=B}h=cg(a,C)|0;i=d;return h|0}}}while(0);m=k;if((c[k>>2]|0)!=1381123450){aV(7704,148,8568,7536);return 0}c[k+16>>2]=-1;c[k+20>>2]=3;c[k+24>>2]=8200;c[k+28>>2]=3184;if((c[2544]|0)<=0){h=-1;i=d;return h|0}bF(m,0)|0;h=-1;i=d;return h|0}}while(0);a5(6960,41,1,c[o>>2]|0)|0;if((c[k>>2]|0)!=1381123450){aV(7704,148,8568,7536);return 0}c[k+16>>2]=-2;c[k+20>>2]=2;c[k+24>>2]=8200;c[k+28>>2]=3704;if((c[2544]|0)<=0){h=-1;i=d;return h|0}bF(k,0)|0;h=-1;i=d;return h|0}function cK(a,b,e,f){a=a|0;b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,p=0,q=0,r=0,s=0,t=0,u=0,w=0;f=i;g=b+4|0;do{if((c[g>>2]|0)==0){h=0;j=c[a+4>>2]|0;k=c[a+8>>2]|0}else{l=b+8|0;m=l;n=1<<(d[m]|0);p=n-1|0;q=a+4|0;r=c[q>>2]|0;if((p&r|0)==0){s=r}else{t=p+r&-n;c[q>>2]=t;s=t}t=l+1|0;l=1<<(d[t]|0);q=l-1|0;n=a+8|0;r=c[n>>2]|0;if((q&r|0)==0){u=r}else{p=q+r&-l;c[n>>2]=p;u=p}if((c[g>>2]|0)==0){h=0;j=s;k=u;break}h=aa(s>>>((d[m]|0)>>>0)<<1,u>>>((d[t]|0)>>>0))|0;j=s;k=u}}while(0);u=a+16|0;s=aa(k,j)|0;g=s+h|0;c[u>>2]=g;h=c[e+16>>2]|0;b=c[e+4>>2]|0;t=c[e+8>>2]|0;if(h>>>0<(aa(t,b)|0)>>>0){aV(6488,369,8816,5264)}if((c[2544]|0)>23){m=c[o>>2]|0;ar(m|0,5064,(v=i,i=i+64|0,c[v>>2]=8816,c[v+8>>2]=j,c[v+16>>2]=k,c[v+24>>2]=s,c[v+32>>2]=g,c[v+40>>2]=b,c[v+48>>2]=t,c[v+56>>2]=h,v)|0)|0;w=c[u>>2]|0}else{w=g}g=d9(w)|0;w=a+12|0;c[w>>2]=g;if((g|0)==0){i=f;return}cR(a,e,s);ej((c[w>>2]|0)+s|0,-128|0,(c[u>>2]|0)-s|0);i=f;return}function cL(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0;h=e+4|0;do{if((c[h>>2]|0)==0){i=b+4|0;j=b+8|0;k=0;l=i;m=j;n=aa(c[j>>2]|0,c[i>>2]|0)|0}else{i=e+8|0;j=i;o=1<<(d[j]|0);p=o-1|0;q=b+4|0;r=c[q>>2]|0;if((p&r|0)==0){s=r}else{t=p+r&-o;c[q>>2]=t;s=t}t=i+1|0;i=1<<(d[t]|0);o=i-1|0;r=b+8|0;p=c[r>>2]|0;if((o&p|0)==0){u=p}else{v=o+p&-i;c[r>>2]=v;u=v}v=c[h>>2]|0;i=aa(u,s)|0;if((v|0)==0){k=0;l=q;m=r;n=i;break}k=aa(s>>>((d[j]|0)>>>0)<<1,u>>>((d[t]|0)>>>0))|0;l=q;m=r;n=i}}while(0);u=k+n|0;c[b+16>>2]=u;n=d9(u)|0;c[b+12>>2]=n;if((n|0)==0){return}b=c[f+4>>2]|0;if((c[g+4>>2]|0)==0){w=0;x=c[f+8>>2]|0}else{u=g+8|0;k=c[f+8>>2]|0;w=aa(k>>>((d[u+1|0]|0)>>>0),b>>>((d[u]|0)>>>0))|0;x=k}k=f+4|0;u=f+8|0;s=aa(x,b)|0;if((c[f+16>>2]|0)>>>0<(s*3|0)>>>0){aV(6488,393,8792,5456)}x=a[e+10|0]|0;e=g+8|0;g=e;h=c[f+12>>2]|0;f=((a[g+2|0]^x)&1)==0;i=h+s|0;r=h+(s+w)|0;w=d[e]|0;e=(1<<w)-1|0;s=(1<<(d[g+1|0]|0))-1|0;if((c[m>>2]|0)==0){return}g=-(b>>>(w>>>0))|0;w=(x&2)==0;x=f?i:r;q=f?r:i;i=h;h=n;n=0;r=0;f=0;t=-128;j=-128;v=b;while(1){do{if(n>>>0<(c[u>>2]|0)>>>0){if((n&s|0)==0){y=i;z=q;A=x;break}y=i;z=q+g|0;A=x+g|0}else{y=i+(-v|0)|0;z=q+g|0;A=x+g|0}}while(0);if((c[l>>2]|0)==0){B=A;C=z;D=y;E=h;F=0;G=r;H=f;I=t;J=j;K=v}else{b=A;p=z;o=y;L=h;M=0;N=r;O=f;P=t;Q=j;while(1){do{if(M>>>0<(c[k>>2]|0)>>>0){R=a[o]|0;S=o+2|0;T=a[o+1|0]|0;if((M&e|0)!=0){U=Q;V=P;W=T;X=R;Y=S;Z=p;_=b;break}U=a[p]|0;V=a[b]|0;W=T;X=R;Y=S;Z=p+1|0;_=b+1|0}else{U=Q;V=P;W=O;X=N;Y=o;Z=p;_=b}}while(0);S=L+1|0;if(w){a[L]=X;a[S]=V;a[L+2|0]=W;a[L+3|0]=U}else{a[L]=V;a[S]=X;a[L+2|0]=U;a[L+3|0]=W}$=L+4|0;ab=M+2|0;if(ab>>>0<(c[l>>2]|0)>>>0){b=_;p=Z;o=Y;L=$;M=ab;N=X;O=W;P=V;Q=U}else{break}}B=_;C=Z;D=Y;E=$;F=ab;G=X;H=W;I=V;J=U;K=c[k>>2]|0}if(F>>>0<K>>>0){Q=B;P=C;O=D;N=F;while(1){M=O+2|0;if((N&e|0)==0){ac=P+1|0;ad=Q+1|0}else{ac=P;ad=Q}L=N+2|0;if(L>>>0<K>>>0){Q=ad;P=ac;O=M;N=L}else{ae=ad;af=ac;ag=M;break}}}else{ae=B;af=C;ag=D}N=n+1|0;if(N>>>0<(c[m>>2]|0)>>>0){x=ae;q=af;i=ag;h=E;n=N;r=G;f=H;t=I;j=J;v=K}else{break}}return}function cM(e,f,g,h){e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0;i=e+4|0;j=c[i>>2]|0;k=e+8|0;l=c[k>>2]|0;m=aa(l,j)|0;n=f+8|0;f=n;o=n;n=aa(m,d[o]|0)|0;c[e+16>>2]=n;m=d9(n)|0;c[e+12>>2]=m;if((m|0)==0){return}e=d[f+1|0]|0;n=e>>>5;p=e&31;e=d[f+2|0]|0;q=e>>>5;r=e&31;e=d[f+3|0]|0;f=e>>>5;s=e&31;e=c[g+4>>2]|0;if((c[h+4>>2]|0)==0){t=0;u=c[g+8>>2]|0}else{v=h+8|0;h=c[g+8>>2]|0;t=aa(e>>>((d[v]|0)>>>0)<<1,h>>>((d[v+1|0]|0)>>>0))|0;u=h}h=g+4|0;v=g+8|0;w=aa(u,e)|0;if((c[g+16>>2]|0)>>>0<(w+t|0)>>>0){aV(6488,577,8744,5608)}if((l|0)==0){return}l=c[g+12>>2]|0;g=0;t=0;w=m;m=e;e=j;while(1){if(g>>>0<(c[v>>2]|0)>>>0){x=l}else{x=l+(-m|0)|0}j=(m|0)!=0;if((e|0)==0){y=x;z=0;A=t;B=w;C=j;D=m;E=0}else{u=x;F=0;G=t;H=w;I=j;while(1){if(I){j=d[u]|0;J=j>>>(n>>>0)<<p|j>>>(q>>>0)<<r|j>>>(f>>>0)<<s;K=u+1|0}else{J=G;K=u}j=d[o]|0;if((j|0)==2){b[H>>1]=J&65535}else if((j|0)==3){a[H]=J&255;a[H+1|0]=J>>>8&255;a[H+2|0]=J>>>16&255}else if((j|0)==4){c[H>>2]=J}else{a[H]=J&255}j=H+(d[o]|0)|0;L=F+1|0;M=c[i>>2]|0;N=c[h>>2]|0;O=L>>>0<N>>>0;if(L>>>0<M>>>0){u=K;F=L;G=J;H=j;I=O}else{y=K;z=L;A=J;B=j;C=O;D=N;E=M;break}}}if(C){P=y+(D-z)|0}else{P=y}I=g+1|0;if(I>>>0<(c[k>>2]|0)>>>0){l=P;g=I;t=A;w=B;m=D;e=E}else{break}}return}function cN(a,b,e,f){a=a|0;b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;f=b+4|0;do{if((c[f>>2]|0)==0){g=0;h=aa(c[a+8>>2]|0,c[a+4>>2]|0)|0}else{i=b+8|0;j=i;k=1<<(d[j]|0);l=k-1|0;m=a+4|0;n=c[m>>2]|0;if((l&n|0)==0){o=n}else{p=l+n&-k;c[m>>2]=p;o=p}p=i+1|0;i=1<<(d[p]|0);m=i-1|0;k=a+8|0;n=c[k>>2]|0;if((m&n|0)==0){q=n}else{l=m+n&-i;c[k>>2]=l;q=l}l=c[f>>2]|0;k=aa(q,o)|0;if((l|0)==0){g=0;h=k;break}g=aa(o>>>((d[j]|0)>>>0)<<1,q>>>((d[p]|0)>>>0))|0;h=k}}while(0);q=g+h|0;c[a+16>>2]=q;o=d9(q)|0;q=a+12|0;c[q>>2]=o;if((o|0)==0){return}cR(a,e,h);if((g|0)==0){return}ej((c[q>>2]|0)+h|0,-128|0,g|0);return}function cO(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0;h=e+4|0;do{if((c[h>>2]|0)==0){i=b+4|0;j=b+8|0;k=0;l=i;m=j;n=aa(c[j>>2]|0,c[i>>2]|0)|0}else{i=e+8|0;j=i;o=1<<(d[j]|0);p=o-1|0;q=b+4|0;r=c[q>>2]|0;if((p&r|0)==0){s=r}else{t=p+r&-o;c[q>>2]=t;s=t}t=i+1|0;i=1<<(d[t]|0);o=i-1|0;r=b+8|0;p=c[r>>2]|0;if((o&p|0)==0){u=p}else{v=o+p&-i;c[r>>2]=v;u=v}v=c[h>>2]|0;i=aa(u,s)|0;if((v|0)==0){k=0;l=q;m=r;n=i;break}k=aa(s>>>((d[j]|0)>>>0)<<1,u>>>((d[t]|0)>>>0))|0;l=q;m=r;n=i}}while(0);u=k+n|0;c[b+16>>2]=u;s=d9(u)|0;c[b+12>>2]=s;if((s|0)==0){return}if((k|0)!=0){ej(s+n|0,-128|0,k|0)}k=g+8|0;g=c[f+12>>2]|0;n=f+4|0;b=c[n>>2]|0;if((c[m>>2]|0)==0){return}u=f+8|0;f=-(b+(b>>>((d[k]|0)>>>0))|0)|0;h=((a[e+10|0]^a[k+2|0])&2)==0?g:g+1|0;g=s;s=0;k=0;e=0;i=b;while(1){if(s>>>0<(c[u>>2]|0)>>>0){w=h}else{w=h+f|0}b=(i|0)!=0;if((c[l>>2]|0)==0){x=w;y=g;z=0;A=k;B=e;C=b;D=i}else{r=w;q=g;t=0;j=k;v=e;p=b;while(1){if(p){E=a[r+2|0]|0;F=a[r]|0;G=r+4|0}else{E=v;F=j;G=r}a[q]=F;b=q+2|0;a[q+1|0]=E;o=t+2|0;H=c[n>>2]|0;I=o>>>0<H>>>0;if(o>>>0<(c[l>>2]|0)>>>0){r=G;q=b;t=o;j=F;v=E;p=I}else{x=G;y=b;z=o;A=F;B=E;C=I;D=H;break}}}if(C){J=x+(D-z<<1)|0}else{J=x}p=s+1|0;if(p>>>0<(c[m>>2]|0)>>>0){h=J;g=y;s=p;k=A;e=B;i=D}else{break}}return}function cP(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0;h=e+4|0;do{if((c[h>>2]|0)==0){i=b+4|0;j=b+8|0;k=0;l=i;m=j;n=aa(c[j>>2]|0,c[i>>2]|0)|0}else{i=e+8|0;j=i;o=1<<(d[j]|0);p=o-1|0;q=b+4|0;r=c[q>>2]|0;if((p&r|0)==0){s=r}else{t=p+r&-o;c[q>>2]=t;s=t}t=i+1|0;i=1<<(d[t]|0);o=i-1|0;r=b+8|0;p=c[r>>2]|0;if((o&p|0)==0){u=p}else{v=o+p&-i;c[r>>2]=v;u=v}v=c[h>>2]|0;i=aa(u,s)|0;if((v|0)==0){k=0;l=q;m=r;n=i;break}k=aa(s>>>((d[j]|0)>>>0)<<1,u>>>((d[t]|0)>>>0))|0;l=q;m=r;n=i}}while(0);u=k+n|0;c[b+16>>2]=u;n=d9(u)|0;c[b+12>>2]=n;if((n|0)==0){return}b=g+8|0;g=b+2|0;u=e+10|0;e=f+4|0;k=c[e>>2]|0;if((c[m>>2]|0)==0){return}s=f+8|0;h=-(k+(k>>>((d[b]|0)>>>0))|0)|0;b=((a[u]^a[g])&1)==0;i=c[f+12>>2]|0;f=0;r=0;q=0;t=-128;j=-128;v=n;n=k;while(1){if(f>>>0<(c[s>>2]|0)>>>0){w=i}else{w=i+h|0}k=(n|0)!=0;if((c[l>>2]|0)==0){x=w;y=0;z=r;A=q;B=t;C=j;D=v;E=k;F=n}else{p=w;o=0;G=r;H=q;I=t;J=j;K=v;L=k;while(1){if(L){k=(a[g]&2)==0;M=a[p]|0;N=p+2|0;O=a[p+1|0]|0;P=p+3|0;Q=k?O:M;R=a[k?P:N]|0;S=b?R:Q;T=b?Q:R;U=a[k?N:P]|0;V=k?M:O;W=p+4|0}else{S=J;T=I;U=H;V=G;W=p}O=K+1|0;if((a[u]&2)==0){a[K]=V;a[O]=T;a[K+2|0]=U;a[K+3|0]=S}else{a[K]=T;a[O]=V;a[K+2|0]=S;a[K+3|0]=U}O=K+4|0;M=o+2|0;k=c[e>>2]|0;P=M>>>0<k>>>0;if(M>>>0<(c[l>>2]|0)>>>0){p=W;o=M;G=V;H=U;I=T;J=S;K=O;L=P}else{x=W;y=M;z=V;A=U;B=T;C=S;D=O;E=P;F=k;break}}}if(E){X=x+(F-y<<1)|0}else{X=x}L=f+1|0;if(L>>>0<(c[m>>2]|0)>>>0){i=X;f=L;r=z;q=A;t=B;j=C;v=D;n=F}else{break}}return}function cQ(e,f,g,h){e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0;i=e+4|0;j=c[i>>2]|0;k=e+8|0;l=c[k>>2]|0;m=aa(l,j)|0;n=f+8|0;f=n;o=n;n=aa(m,d[o]|0)|0;c[e+16>>2]=n;m=d9(n)|0;c[e+12>>2]=m;if((m|0)==0){return}e=d[f+1|0]|0;n=e>>>5;p=e&31;e=d[f+2|0]|0;q=e>>>5;r=e&31;e=d[f+3|0]|0;f=e>>>5;s=e&31;e=c[g+16>>2]|0;t=g+4|0;u=c[t>>2]|0;v=g+8|0;w=c[v>>2]|0;x=aa(w,u)|0;if((c[h+4>>2]|0)==0){y=0}else{z=h+8|0;y=aa(u>>>((d[z]|0)>>>0)<<1,w>>>((d[z+1|0]|0)>>>0))|0}if(e>>>0<(y+x|0)>>>0){aV(6488,676,8768,5968)}x=c[g+12>>2]|0;g=h+8|0;if((a[g]|0)!=1){aV(6488,681,8768,5824)}if((l|0)==0){return}l=-(u+(u>>>1)|0)|0;h=(a[g+2|0]&2)==0?x:x+1|0;x=m;m=0;g=0;y=j;j=u;u=w;while(1){if(m>>>0<u>>>0){A=h}else{A=h+l|0}w=(j|0)!=0;if((y|0)==0){B=A;C=x;D=0;E=g;F=w;G=0;H=j}else{e=A;z=x;I=0;J=g;K=w;while(1){if(K){w=a[e]|0;L=e+2|0;M=w&255;do{if((w&255)<17){N=0}else{if((w&255)>234){N=255;break}N=((((M-16&65535)*255|0)>>>0)/219|0)&255}}while(0);O=N>>>(n>>>0)<<p|N>>>(q>>>0)<<r|N>>>(f>>>0)<<s;P=L}else{O=J;P=e}M=d[o]|0;if((M|0)==4){c[z>>2]=O}else if((M|0)==2){b[z>>1]=O&65535}else if((M|0)==3){a[z]=O&255;a[z+1|0]=O>>>8&255;a[z+2|0]=O>>>16&255}else{a[z]=O&255}M=z+(d[o]|0)|0;w=I+1|0;Q=c[i>>2]|0;R=c[t>>2]|0;S=w>>>0<R>>>0;if(w>>>0<Q>>>0){e=P;z=M;I=w;J=O;K=S}else{B=P;C=M;D=w;E=O;F=S;G=Q;H=R;break}}}if(F){T=B+(H-D<<1)|0}else{T=B}K=m+1|0;if(K>>>0>=(c[k>>2]|0)>>>0){break}h=T;x=C;m=K;g=E;y=G;j=H;u=c[v>>2]|0}return}function cR(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;f=c[b+4>>2]|0;g=d+4|0;h=c[g>>2]|0;i=c[b+8>>2]|0;j=c[d+8>>2]|0;if((f|0)==(h|0)&(i|0)==(j|0)){k=c[b+12>>2]|0;l=c[d+12>>2]|0;eg(k|0,l|0,e)|0;return}e=c[d+12>>2]|0;d=c[b+12>>2]|0;l=f>>>0>h>>>0;k=l?h:f;m=l?f-h|0:0;l=b+8|0;b=i>>>0>j>>>0?j:i;if((b|0)==0){n=d;o=e;p=0;q=h;r=i}else{s=k+m|0;t=~j;j=~i;i=t>>>0>j>>>0?t:j;if((m|0)==0){j=~h;h=~f;f=j>>>0>h>>>0?j:h;h=(aa(-2-i|0,~f)|0)-1-f|0;f=d;j=e;t=0;while(1){eg(f|0,j|0,k)|0;u=c[g>>2]|0;v=j+u|0;w=t+1|0;if(w>>>0<b>>>0){f=f+k|0;j=v;t=w}else{break}}x=d+h|0;y=v;z=u}else{u=d;d=e;e=0;while(1){eg(u|0,d|0,k)|0;v=c[g>>2]|0;A=d+v|0;ej(u+k|0,a[d+(v-1)|0]|0,m|0);B=u+s|0;v=e+1|0;if(v>>>0<b>>>0){u=B;d=A;e=v}else{break}}x=B;y=A;z=c[g>>2]|0}n=x;o=y;p=~i;q=z;r=c[l>>2]|0}z=o+(-q|0)|0;if(p>>>0>=r>>>0){return}r=o+~q|0;q=k+m|0;if((m|0)==0){o=n;i=p;while(1){eg(o|0,z|0,k)|0;y=i+1|0;if(y>>>0<(c[l>>2]|0)>>>0){o=o+k|0;i=y}else{break}}return}else{i=n;n=p;while(1){eg(i|0,z|0,k)|0;ej(i+k|0,a[r]|0,m|0);p=n+1|0;if(p>>>0<(c[l>>2]|0)>>>0){i=i+q|0;n=p}else{break}}return}}function cS(b,f,g,h){b=b|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0;i=f+4|0;do{if((c[i>>2]|0)==0){j=b+4|0;k=b+8|0;l=0;m=j;n=k;o=aa(c[k>>2]|0,c[j>>2]|0)|0}else{j=f+8|0;k=j;p=1<<(d[k]|0);q=p-1|0;r=b+4|0;s=c[r>>2]|0;if((q&s|0)==0){t=s}else{u=q+s&-p;c[r>>2]=u;t=u}u=j+1|0;j=1<<(d[u]|0);p=j-1|0;s=b+8|0;q=c[s>>2]|0;if((p&q|0)==0){v=q}else{w=p+q&-j;c[s>>2]=w;v=w}w=c[i>>2]|0;j=aa(v,t)|0;if((w|0)==0){l=0;m=r;n=s;o=j;break}l=aa(t>>>((d[k]|0)>>>0)<<1,v>>>((d[u]|0)>>>0))|0;m=r;n=s;o=j}}while(0);v=l+o|0;c[b+16>>2]=v;t=d9(v)|0;c[b+12>>2]=t;if((t|0)==0){return}if((l|0)!=0){ej(t+o|0,-128|0,l|0)}l=c[g+16>>2]|0;o=g+4|0;b=c[o>>2]|0;v=g+8|0;i=c[v>>2]|0;f=aa(i,b)|0;j=h+8|0;h=j;s=j;j=d[s]|0;if(l>>>0<(aa(f,j)|0)>>>0){aV(6488,619,8840,6192)}f=d[h+1|0]|0;l=f>>>5;r=f&31;f=d[h+2|0]|0;u=f>>>5;k=f&31;f=d[h+3|0]|0;h=f>>>5;w=f&31;if((c[n>>2]|0)==0){return}f=c[g+12>>2]|0;g=aa(j,-b|0)|0;j=0;q=0;p=f;f=t;t=b;b=i;while(1){if(q>>>0<b>>>0){x=p}else{x=p+g|0}i=(t|0)!=0;if((c[m>>2]|0)==0){y=j;z=0;A=x;B=f;C=i;D=t}else{E=j;F=0;G=x;H=f;I=i;while(1){if(I){i=d[s]|0;if((i|0)==4){J=c[G>>2]|0}else if((i|0)==3){J=(d[G+1|0]|0)<<8|(d[G]|0)|(d[G+2|0]|0)<<16}else if((i|0)==2){J=e[G>>1]|0}else{J=d[G]|0}K=G+i|0;L=(((J>>>(k>>>0)<<u&255)*150|0)+128+((J>>>(r>>>0)<<l&255)*77|0)+((J>>>(w>>>0)<<h&255)*29|0)|0)>>>8&255}else{K=G;L=E}i=H+1|0;a[H]=L;M=F+1|0;N=c[o>>2]|0;O=M>>>0<N>>>0;if(M>>>0<(c[m>>2]|0)>>>0){E=L;F=M;G=K;H=i;I=O}else{y=L;z=M;A=K;B=i;C=O;D=N;break}}}if(C){P=A+(aa(d[s]|0,D-z|0)|0)|0}else{P=A}I=q+1|0;if(I>>>0>=(c[n>>2]|0)>>>0){break}j=y;q=I;p=P;f=B;t=D;b=c[v>>2]|0}return}function cT(b,f,g,h){b=b|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0;i=f+4|0;do{if((c[i>>2]|0)==0){j=b+4|0;k=b+8|0;l=0;m=j;n=k;o=aa(c[k>>2]|0,c[j>>2]|0)|0}else{j=f+8|0;k=j;p=1<<(d[k]|0);q=p-1|0;r=b+4|0;s=c[r>>2]|0;if((q&s|0)==0){t=s}else{u=q+s&-p;c[r>>2]=u;t=u}u=j+1|0;j=1<<(d[u]|0);p=j-1|0;s=b+8|0;q=c[s>>2]|0;if((p&q|0)==0){v=q}else{w=p+q&-j;c[s>>2]=w;v=w}w=c[i>>2]|0;j=aa(v,t)|0;if((w|0)==0){l=0;m=r;n=s;o=j;break}l=aa(t>>>((d[k]|0)>>>0)<<1,v>>>((d[u]|0)>>>0))|0;m=r;n=s;o=j}}while(0);v=l+o|0;c[b+16>>2]=v;o=d9(v)|0;c[b+12>>2]=o;if((o|0)==0){return}b=a[f+10|0]&2;f=c[g+16>>2]|0;v=g+4|0;l=c[v>>2]|0;t=g+8|0;i=c[t>>2]|0;j=aa(i,l)|0;s=h+8|0;h=s;r=s;s=d[r]|0;if(f>>>0<(aa(j,s)|0)>>>0){aV(6488,727,8864,6192)}j=d[h+1|0]|0;f=j>>>5;u=j&31;j=d[h+2|0]|0;k=j>>>5;w=j&31;j=d[h+3|0]|0;h=j>>>5;q=j&31;if((c[n>>2]|0)==0){return}j=c[g+12>>2]|0;g=aa(s,-l|0)|0;s=b<<24>>24==0;b=0;p=0;x=j;j=o;o=l;l=i;while(1){if(p>>>0<l>>>0){y=x}else{y=x+g|0}i=(o|0)!=0;if((c[m>>2]|0)==0){z=b;A=0;B=y;C=j;D=i;E=o}else{F=b;G=0;H=y;I=j;J=i;while(1){if(J){i=d[r]|0;if((i|0)==3){K=(d[H+1|0]|0)<<8|(d[H]|0)|(d[H+2|0]|0)<<16}else if((i|0)==4){K=c[H>>2]|0}else if((i|0)==2){K=e[H>>1]|0}else{K=d[H]|0}L=H+i|0;M=(((K>>>(w>>>0)<<k&255)*150|0)+128+((K>>>(u>>>0)<<f&255)*77|0)+((K>>>(q>>>0)<<h&255)*29|0)|0)>>>8&255}else{L=H;M=F}a[I]=s?M:-128;a[I+1|0]=s?-128:M;i=I+2|0;N=G+1|0;O=c[v>>2]|0;P=N>>>0<O>>>0;if(N>>>0<(c[m>>2]|0)>>>0){F=M;G=N;H=L;I=i;J=P}else{z=M;A=N;B=L;C=i;D=P;E=O;break}}}if(D){Q=B+(aa(d[r]|0,E-A|0)|0)|0}else{Q=B}J=p+1|0;if(J>>>0>=(c[n>>2]|0)>>>0){break}b=z;p=J;x=Q;j=C;o=E;l=c[t>>2]|0}return}function cU(f,g,h,i){f=f|0;g=g|0;h=h|0;i=i|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0;j=f+4|0;k=c[j>>2]|0;l=f+8|0;m=c[l>>2]|0;n=aa(m,k)|0;o=g+8|0;g=o;p=o;o=aa(n,d[p]|0)|0;c[f+16>>2]=o;n=d9(o)|0;c[f+12>>2]=n;if((n|0)==0){return}f=d[g+1|0]|0;o=f>>>5;q=f&31;f=d[g+2|0]|0;r=f>>>5;s=f&31;f=d[g+3|0]|0;g=f>>>5;t=f&31;f=c[h+16>>2]|0;u=h+4|0;v=c[u>>2]|0;w=h+8|0;x=c[w>>2]|0;y=aa(x,v)|0;z=i+8|0;i=z;A=z;z=d[A]|0;if(f>>>0<(aa(y,z)|0)>>>0){aV(6488,788,8888,6192)}y=d[i+1|0]|0;f=y>>>5;B=y&31;y=d[i+2|0]|0;C=y>>>5;D=y&31;y=d[i+3|0]|0;i=y>>>5;E=y&31;y=aa(z,v)|0;if((m|0)==0){return}m=0;z=0;F=c[h+12>>2]|0;h=n;n=k;k=v;v=x;while(1){x=m>>>0<v>>>0?0:-y|0;G=(k|0)!=0;if((n|0)==0){H=z;I=0;J=F;K=h;L=G;M=0;N=k}else{O=z;P=0;Q=F;R=h;S=G;while(1){if(S){G=d[A]|0;if((G|0)==4){T=c[Q>>2]|0}else if((G|0)==3){T=(d[Q+1|0]|0)<<8|(d[Q]|0)|(d[Q+2|0]|0)<<16}else if((G|0)==2){T=e[Q>>1]|0}else{T=d[Q]|0}U=Q+G|0;V=(T>>>(B>>>0)<<f&255)>>>(o>>>0)<<q|(T>>>(D>>>0)<<C&255)>>>(r>>>0)<<s|(T>>>(E>>>0)<<i&255)>>>(g>>>0)<<t}else{U=Q;V=O}G=d[p]|0;if((G|0)==3){a[R]=V&255;a[R+1|0]=V>>>8&255;a[R+2|0]=V>>>16&255}else if((G|0)==4){c[R>>2]=V}else if((G|0)==2){b[R>>1]=V&65535}else{a[R]=V&255}G=R+(d[p]|0)|0;W=P+1|0;X=c[j>>2]|0;Y=c[u>>2]|0;Z=W>>>0<Y>>>0;if(W>>>0<X>>>0){O=V;P=W;Q=U;R=G;S=Z}else{H=V;I=W;J=U;K=G;L=Z;M=X;N=Y;break}}}if(L){_=J+(aa(d[A]|0,N-I|0)|0)|0}else{_=J}S=m+1+x|0;if(S>>>0>=(c[l>>2]|0)>>>0){break}m=S;z=H;F=_;h=K;n=M;k=N;v=c[w>>2]|0}return}function cV(a){a=a|0;var b=0,d=0,e=0;b=c[a+40>>2]|0;if((b|0)==0){return}a=b+28|0;d=c[a>>2]|0;e=d-1|0;c[a>>2]=e;if((d|0)<=0){aV(4848,75,9088,4752)}if((e|0)!=0){return}e=c[b+24>>2]|0;if((e|0)!=0){a7[e&15](b)}if((c[b+32>>2]|0)!=0){return}bB(b);return}function cW(){var a=0,b=0,d=0,e=0,f=0,g=0;a=eb(1,156)|0;b=a;if((a|0)==0){d=0;return d|0}e=dR()|0;f=a+4|0;c[f>>2]=e;g=c4(e)|0;c[a>>2]=g;e=c[f>>2]|0;if((e|0)==0|(g|0)==0){cX(b);d=0;return d|0}else{dN(e,a);e=c[f>>2]|0;dM(e,10)|0;c[a+8>>2]=de()|0;c[a+104>>2]=1;c[a+108>>2]=1;e=a+100|0;c[e>>2]=c[e>>2]|1;d=b;return d|0}return 0}function cX(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;do{if((c[2544]|0)>0){d=c[o>>2]|0;e=c[a+112>>2]|0;ar(d|0,7496,(v=i,i=i+16|0,c[v>>2]=8704,c[v+8>>2]=e,v)|0)|0;if((c[2544]|0)<=0){break}e=c[o>>2]|0;d=c[a+116>>2]|0;f=c[a+120>>2]|0;ar(e|0,7280,(v=i,i=i+24|0,c[v>>2]=8704,c[v+8>>2]=d,c[v+16>>2]=f,v)|0)|0;if((c[2544]|0)<=0){break}f=c[o>>2]|0;d=c[a+124>>2]|0;e=c[a+128>>2]|0;ar(f|0,6888,(v=i,i=i+24|0,c[v>>2]=8704,c[v+8>>2]=d,c[v+16>>2]=e,v)|0)|0;if((c[2544]|0)<=0){break}e=c[o>>2]|0;d=c[a+132>>2]|0;ar(e|0,6664,(v=i,i=i+16|0,c[v>>2]=8704,c[v+8>>2]=d,v)|0)|0;if((c[2544]|0)<=0){break}d=c[o>>2]|0;e=c[a+136>>2]|0;ar(d|0,6448,(v=i,i=i+24|0,c[v>>2]=8704,c[v+8>>2]=0,c[v+16>>2]=e,v)|0)|0;if((c[2544]|0)<=0){break}e=c[o>>2]|0;d=c[a+140>>2]|0;ar(e|0,6448,(v=i,i=i+24|0,c[v>>2]=8704,c[v+8>>2]=1,c[v+16>>2]=d,v)|0)|0;if((c[2544]|0)<=0){break}d=c[o>>2]|0;e=c[a+144>>2]|0;ar(d|0,6448,(v=i,i=i+24|0,c[v>>2]=8704,c[v+8>>2]=2,c[v+16>>2]=e,v)|0)|0;if((c[2544]|0)<=0){break}e=c[o>>2]|0;d=c[a+148>>2]|0;ar(e|0,6448,(v=i,i=i+24|0,c[v>>2]=8704,c[v+8>>2]=3,c[v+16>>2]=d,v)|0)|0;if((c[2544]|0)<=0){break}d=c[o>>2]|0;e=c[a+152>>2]|0;ar(d|0,6448,(v=i,i=i+24|0,c[v>>2]=8704,c[v+8>>2]=4,c[v+16>>2]=e,v)|0)|0}}while(0);e=a+48|0;d=c[e>>2]|0;if((d|0)!=0){if((c[d>>2]|0)==0){b4(d)}else{b2(d,-1)}c[e>>2]=0}e=a|0;d=c[e>>2]|0;if((d|0)!=0){c5(d)}c[e>>2]=0;e=a+4|0;d=c[e>>2]|0;if((d|0)!=0){dT(d)}c[e>>2]=0;e=c[a+56>>2]|0;if((e|0)!=0){d=e;while(1){e=c[d+32>>2]|0;b$(d);if((e|0)==0){break}else{d=e}}}d=c[a+64>>2]|0;if((d|0)!=0){e=d;while(1){d=c[e+32>>2]|0;b$(e);if((d|0)==0){break}else{e=d}}}e=c[a+72>>2]|0;if((e|0)!=0){d=e;while(1){e=c[d+32>>2]|0;b$(d);if((e|0)==0){break}else{d=e}}}d=c[a+80>>2]|0;if((d|0)!=0){e=d;while(1){d=c[e+32>>2]|0;b$(e);if((d|0)==0){break}else{e=d}}}e=c[a+88>>2]|0;if((e|0)!=0){d=e;while(1){e=c[d+32>>2]|0;b$(d);if((e|0)==0){break}else{d=e}}}d=c[a+8>>2]|0;if((d|0)==0){g=a;ea(g);i=b;return}df(d);g=a;ea(g);i=b;return}function cY(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;if((b|0)==0){return}else{d=b}L1902:while(1){b=d+32|0;e=c[b>>2]|0;f=d+28|0;g=c[f>>2]|0;do{if((g|0)==0){h=1421}else{i=g-1|0;c[f>>2]=i;if((g|0)<=0){h=1415;break L1902}if((i|0)==0){h=1421;break}if((c[d+4>>2]|0)==0){h=1418;break L1902}c[b>>2]=0}}while(0);if((h|0)==1421){h=0;g=d+4|0;f=c[g>>2]|0;if((f|0)==0){c[d+12>>2]=0;c[d+8>>2]=0}i=d+36|0;j=c[i>>2]|0;if((j|0)==0){k=f}else{f=j|0;j=c[f>>2]|0;l=j-1|0;c[f>>2]=l;if((j|0)<=0){h=1425;break}if((l|0)!=0){h=1427;break}cY(a,c[(c[i>>2]|0)+8>>2]|0);c[(c[i>>2]|0)+8>>2]=0;b4(c[i>>2]|0);c[i>>2]=0;k=c[g>>2]|0}i=0;while(1){l=i+1|0;if(k>>>0<1<<(i<<1)>>>0){m=i;break}if((l|0)<5){i=l}else{m=l;break}}if((m|0)==5){i=d+12|0;l=c[i>>2]|0;if((l|0)==0){h=1434;break}ea(l);c[i>>2]=0;c[g>>2]=0;n=0}else{n=m}i=a+52+(n<<3)|0;c[i>>2]=(c[i>>2]|0)+1;i=a+52+(n<<3)+4|0;c[b>>2]=c[i>>2];c[i>>2]=d}if((e|0)==0){h=1438;break}else{d=e}}if((h|0)==1427){aV(4152,146,9416,4840)}else if((h|0)==1425){aV(5952,75,9072,5816)}else if((h|0)==1418){aV(4152,135,9416,6944)}else if((h|0)==1438){return}else if((h|0)==1415){aV(5952,75,9072,5816)}else if((h|0)==1434){aV(4152,157,9416,4120)}}function cZ(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=a+48|0;e=c[d>>2]|0;do{if((e|0)!=0){f=e|0;g=c[f>>2]|0;if((g|0)==0){break}h=g-1|0;c[f>>2]=h;if((g|0)<=0){aV(5952,75,9072,5816)}if((h|0)==0){h=e+8|0;cY(a,c[h>>2]|0);c[e+12>>2]=0;c[h>>2]=0;c[e+4>>2]=0;h=a+120|0;c[h>>2]=(c[h>>2]|0)+1;break}else{h=a+116|0;c[h>>2]=(c[h>>2]|0)+1;c[d>>2]=0;break}}}while(0);e=b+48|0;b=c[e>>2]|0;c[e>>2]=0;if((b|0)==0){return}e=b|0;h=c[e>>2]|0;g=h-1|0;c[e>>2]=g;if((h|0)<=0){aV(5952,75,9072,5816)}if((g|0)!=0){g=a+124|0;c[g>>2]=(c[g>>2]|0)+1;return}g=b+8|0;cY(a,c[g>>2]|0);c[b+12>>2]=0;c[g>>2]=0;c[b+4>>2]=0;g=a+128|0;c[g>>2]=(c[g>>2]|0)+1;if((c[d>>2]|0)==0){c[d>>2]=b;return}else{b4(b);return}}function c_(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0;e=0;while(1){f=e+1|0;if((1<<(e<<1)|0)>=(d|0)){g=1462;break}if((f|0)<4){e=f}else{h=f;g=1465;break}}if((g|0)==1462){if((e|0)>0){h=e;g=1465}else{g=1469}}L1967:do{if((g|0)==1465){while(1){g=0;i=a+52+(h<<3)+4|0;j=c[i>>2]|0;e=h-1|0;if((j|0)!=0){break}if((e|0)>0){h=e;g=1465}else{g=1469;break L1967}}e=a+136+(h<<2)|0;c[e>>2]=(c[e>>2]|0)+1;e=j+32|0;c[i>>2]=c[e>>2];c[e>>2]=0;e=a+52+(h<<3)|0;f=c[e>>2]|0;if((f|0)==0){aV(4152,237,9456,3680);return 0}else{c[e>>2]=f-1;k=j;break}}}while(0);if((g|0)==1469){g=eb(1,52)|0;j=a+132|0;c[j>>2]=(c[j>>2]|0)+1;k=g}c[k>>2]=b;c[k+48>>2]=1;c[k+20>>2]=0;c[k+44>>2]=0;c[k+40>>2]=c[a+20>>2];if((c[k+36>>2]|0)!=0){aV(4152,251,9456,3168);return 0}if((d|0)<=0){a=k+12|0;b=c[a>>2]|0;if((b|0)!=0){ea(b)}c[a>>2]=0;c[k+4>>2]=0;c[k+8>>2]=0;return k|0}c[k+8>>2]=d-1;a=k+4|0;if((c[a>>2]|0)>>>0>=d>>>0){return k|0}b=k+12|0;g=c[b>>2]|0;if((g|0)!=0){ea(g)}c[a>>2]=d;c[b>>2]=d9(d)|0;return k|0}function c$(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;do{if((c[a+92>>2]|0)==0){c[b+44>>2]=0;d=c[a+48>>2]|0;e=b+44|0;f=1501}else{g=a+96|0;h=c[g>>2]|0;i=b|0;j=b+8|0;k=b+12|0;l=b+40|0;L1999:do{if((h|0)==0){f=1494}else{m=g;n=h;L2000:while(1){o=n;while(1){do{if((c[o>>2]|0)==(c[i>>2]|0)){p=c[o+8>>2]|0;if((p|0)!=(c[j>>2]|0)){break}if((el(c[o+12>>2]|0,c[k>>2]|0,p|0)|0)==0){break L2000}}}while(0);q=o+32|0;r=c[q>>2]|0;if(((c[l>>2]|0)-(c[o+40>>2]|0)|0)>>>0<=4e3){break}c[q>>2]=0;cY(a,c[m>>2]|0);c[m>>2]=r;if((r|0)==0){f=1494;break L1999}else{o=r}}if((r|0)==0){f=1494;break L1999}else{m=q;n=r}}if((o|0)==0){f=1494}else{s=o}}}while(0);if((f|0)==1494){h=c_(a,c[i>>2]|0,(c[j>>2]|0)+1|0)|0;n=c[h+12>>2]|0;m=c[k>>2]|0;p=c[j>>2]|0;eg(n|0,m|0,p)|0;c[h+40>>2]=(c[l>>2]|0)-2e3;c[h+44>>2]=-3;c[h+32>>2]=c[g>>2];c[g>>2]=h;s=h}h=c[l>>2]|0;p=s+40|0;m=h-(c[p>>2]|0)|0;c[p>>2]=h;h=m>>>0<1e3;p=s+44|0;n=c[p>>2]|0;t=(n|0)>-1;if(m>>>0>1999|(t|h)^1){c[p>>2]=-3;c[b+44>>2]=-3;u=c[a+48>>2]|0;v=b+44|0;f=1502;break}if(t|h){h=n+1|0;c[p>>2]=h;w=h}else{w=n}c[b+44>>2]=w;n=c[a+48>>2]|0;h=b+44|0;if((w|0)==0){d=n;e=h;f=1501}else{u=n;v=h;f=1502}}}while(0);do{if((f|0)==1501){w=d+12|0;a=c[w>>2]|0;if((a|0)==0){u=d;v=e;f=1502;break}c[b+32>>2]=c[a+32>>2];c[(c[w>>2]|0)+32>>2]=b;x=d;y=e}}while(0);if((f|0)==1502){f=u+8|0;c[b+32>>2]=c[f>>2];c[f>>2]=b;x=u;y=v}do{if((c[y>>2]|0)==0){v=x+4|0;c[v>>2]=(c[v>>2]|0)+1}else{v=x+12|0;if((c[v>>2]|0)!=0){break}c[v>>2]=b}}while(0);x=b+28|0;b=c[x>>2]|0;c[x>>2]=b+1;if((b|0)>-2){return}else{aV(5952,75,9072,5816)}}function c0(a){a=a|0;return c[a+48>>2]|0}function c1(a){a=a|0;return c[a+44>>2]|0}function c2(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=(c[a+40>>2]|0)-b-48|0;b=5-d|0;if((b|0)>0){f=e>>>(b>>>0);return f|0}if((d|0)==5){f=e;return f|0}f=e<<-b;return f|0}function c3(a,b){a=a|0;b=b|0;var d=0,e=0;d=a+96|0;e=c[d>>2]|0;if((e|0)!=0){cY(a,e);c[d>>2]=0}c[a+92>>2]=(b|0)!=0;return}function c4(a){a=a|0;var b=0,d=0;b=d9(48)|0;d=b;c[b>>2]=a;c[b+4>>2]=4;ej(b+8|0,0,40);c[b+32>>2]=4;if((a|0)==0){return d|0}dS(a);return d|0}function c5(a){a=a|0;ea(a);return}function c6(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;b=a+28|0;d=c[b>>2]|0;if((d|0)==0){e=0;return e|0}f=c[a+8>>2]<<5|16;g=a+36|0;h=c[g>>2]|0;if(!((h|0)!=(f|0)|(d|0)>0)){c[a+44>>2]=0;c[b>>2]=0;i=c[a>>2]|0;if((i|0)==0){e=1;return e|0}e=dV(i,0)|0;return e|0}i=a+40|0;j=c[i>>2]|0;if((j|0)==0){c[i>>2]=h;k=h}else{k=j}j=h-k|0;c[a+44>>2]=j;c[i>>2]=h;h=c[a>>2]|0;if((h|0)==0){l=1;m=d}else{d=dV(h,j)|0;l=d;m=c[b>>2]|0}c[g>>2]=f;c[b>>2]=-m;e=l;return e|0}function c7(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;b=a+28|0;d=c[b>>2]|0;e=a+8|0;L2074:do{if((d|0)==0){f=0;g=a|0}else{h=a+36|0;i=a+40|0;j=a+44|0;k=a|0;l=0;m=d;while(1){n=c[e>>2]<<5|16;o=c[h>>2]|0;if((o|0)!=(n|0)|(m|0)>0){p=c[i>>2]|0;if((p|0)==0){c[i>>2]=o;q=o}else{q=p}p=o-q|0;c[j>>2]=p;c[i>>2]=o;o=c[k>>2]|0;if((o|0)==0){r=1;s=m}else{t=dV(o,p)|0;r=t;s=c[b>>2]|0}c[h>>2]=n;n=-s|0;c[b>>2]=n;u=r;v=n}else{c[j>>2]=0;c[b>>2]=0;n=c[k>>2]|0;if((n|0)==0){break}t=dV(n,0)|0;u=t;v=c[b>>2]|0}t=u>>>0>l>>>0?u:l;if((v|0)==0){f=t;g=k;break L2074}else{l=t;m=v}}f=(l|0)==0?1:l;g=k}}while(0);ej(e|0,0,40);c[a+32>>2]=c[a+4>>2];a=c[g>>2]|0;if((a|0)==0){return f|0}dU(a);return f|0}function c8(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;b=dO(a)|0;d=b;e=dP(a)|0;if(e>>>0<2){return}if((e|0)==64){f=da(c[b+4>>2]|0)|0;if((f|0)==0){aV(4152,362,8336,6184)}g=b;h=c2(c[g>>2]|0,c[f>>2]|0,2)|0;i=f+12|0;c[i>>2]=h-(c2(c[g>>2]|0,c[i>>2]|0,2)|0);j=f+8|0;c[j>>2]=c2(c[g>>2]|0,c[j>>2]|0,2)|0;k=f+16|0;l=c2(c[g>>2]|0,c[k>>2]|0,2)|0;g=c[j>>2]|0;m=l-g|0;c[k>>2]=m;l=g-h|0;c[j>>2]=l;j=c[b+40>>2]<<2;g=c[b+36>>2]|0;n=(aa(g,h)|0)+j|0;if((g|0)<0){g=c[i>>2]|0;c[i>>2]=m;c[k>>2]=g;o=n-l|0}else{o=n}n=(c[b+28>>2]|0)!=0|0;l=n^1;c[f+(l<<2)>>2]=o;c[f+(n<<2)>>2]=c[b+44>>2]<<2|2;n=c[b+8>>2]|0;dk(n,l,f)|0;return}f=dK(a)|0;l=dL(a)|0;a=b+100|0;if((c[a>>2]&1|0)==0){p=0;q=0}else{n=b;o=c1(c[n>>2]|0)|0;g=c[b+40>>2]|0;k=c[b+36>>2]|0;m=(aa(c2(c[n>>2]|0,o,0)|0,k)|0)+g|0;g=(c[b+28>>2]|0)==0;k=c[b+44>>2]|0;p=g?k:m;q=g?m:k}k=c[(c[b+48>>2]|0)+8>>2]|0;L2113:do{if((k|0)!=0){b=k;L2114:while(1){do{if((c[b>>2]|0)==(e|0)){if((c[b+8>>2]|0)!=(l|0)){break}if((el(c[b+12>>2]|0,f|0,l|0)|0)==0){break L2114}}}while(0);m=c[b+32>>2]|0;if((m|0)==0){break L2113}else{b=m}}m=b+48|0;c[m>>2]=(c[m>>2]|0)+1;if((c[a>>2]&1|0)==0){return}m=b+20|0;g=c[m>>2]|0;o=g+1|0;c[m>>2]=o;m=b+16|0;n=c[m>>2]|0;i=b+24|0;j=c[i>>2]|0;if(o>>>0<n>>>0){r=j}else{o=n+1|0;c[m>>2]=o;m=ec(j,o<<3)|0;c[i>>2]=m;r=m}c[r+(g<<3)>>2]=p;c[(c[i>>2]|0)+(g<<3)+4>>2]=q;return}}while(0);r=l+1|0;l=c_(d,e,r)|0;e=c[l+12>>2]|0;eg(e|0,f|0,r)|0;if((c[a>>2]&1|0)!=0){a=l+20|0;r=c[a>>2]|0;f=r+1|0;c[a>>2]=f;a=l+16|0;e=c[a>>2]|0;k=l+24|0;g=c[k>>2]|0;if(f>>>0<e>>>0){s=g}else{f=e+1|0;c[a>>2]=f;a=ec(g,f<<3)|0;c[k>>2]=a;s=a}c[s+(r<<3)>>2]=p;c[(c[k>>2]|0)+(r<<3)+4>>2]=q}c$(d,l);return}function c9(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,p=0,q=0,r=0,s=0,t=0,u=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0;e=i;i=i+8|0;f=e|0;aS(f|0,0)|0;c[a+20>>2]=((((c[f+4>>2]|0)/500|0)+1|0)/2|0)+((c[f>>2]|0)*1e3|0);f=a+8|0;dc(c[f>>2]|0);g=c[b>>2]|0;if(!((g|0)==808466521|(g|0)==1497715271)){h=-1;i=e;return h|0}g=a+24|0;c[g>>2]=b;cZ(a,b);j=a+48|0;k=c[j>>2]|0;if((k|0)==0){l=b3()|0;c[j>>2]=l;j=a+112|0;c[j>>2]=(c[j>>2]|0)+1;b2(l,1);m=l}else{b2(k,2);m=k}c[b+48>>2]=m;k=c[b+4>>2]|0;l=c[b+8>>2]|0;j=c[b+12>>2]|0;n=a|0;p=c[n>>2]|0;q=a+108|0;r=c[q>>2]|0;L2144:do{if((r|0)>0){c[a+32>>2]=0;s=((((l-1|0)>>>0)%(r>>>0)|0)+1|0)>>>1;t=l>>>1;u=s>>>0>t>>>0?t:s;s=a+44|0;c[s>>2]=u;c7(p)|0;if(u>>>0>=l>>>0){break}t=j+(aa(u,k)|0)|0;w=a+36|0;x=a+28|0;y=a+40|0;z=aa(r,k)|0;A=z-1|0;B=z+1|0;z=u;u=0;C=t;while(1){if((c[2544]|0)>127){t=c[o>>2]|0;ar(t|0,2800,(v=i,i=i+32|0,c[v>>2]=8072,c[v+8>>2]=u,c[v+16>>2]=z,c[v+24>>2]=C,v)|0)|0}c[w>>2]=1;c[x>>2]=1;c[y>>2]=0;if(u>>>0<k>>>0){t=u;D=C;while(1){E=t+1|0;dd(p,d[D]|0)|0;if(E>>>0<k>>>0){t=E;D=D+1|0}else{break}}F=k;G=C+(k-u)|0}else{F=u;G=C}if((G|0)!=(j+(F+(aa(z,k)|0))|0)){H=1604;break}D=c[n>>2]|0;c6(D)|0;c6(D)|0;c7(D)|0;D=F-1|0;t=z+r|0;E=G+A|0;c[s>>2]=t;if(t>>>0>=l>>>0){break L2144}if((c[2544]|0)>127){I=c[o>>2]|0;ar(I|0,2056,(v=i,i=i+32|0,c[v>>2]=8072,c[v+8>>2]=D,c[v+16>>2]=t,c[v+24>>2]=E,v)|0)|0}c[w>>2]=-1;c[x>>2]=-1;c[y>>2]=k;if((F|0)>0){I=D;J=E;while(1){dd(p,d[J]|0)|0;if((I|0)>0){I=I-1|0;J=J-1|0}else{break}}K=-1;L=G+(A-F)|0}else{K=D;L=E}if((L|0)!=(j+(K+(aa(t,k)|0))|0)){H=1612;break}J=c[n>>2]|0;c6(J)|0;c6(J)|0;c7(J)|0;J=t+r|0;c[s>>2]=J;if(J>>>0<l>>>0){z=J;u=K+1|0;C=L+B|0}else{break L2144}}if((H|0)==1604){aV(4152,670,8072,2408);return 0}else if((H|0)==1612){aV(4152,688,8072,2408);return 0}}}while(0);c[a+28>>2]=0;L=c[a+104>>2]|0;L2172:do{if((L|0)>0){K=((((k-1|0)>>>0)%(L>>>0)|0)+1|0)>>>1;r=k>>>1;F=K>>>0>r>>>0?r:K;K=a+44|0;c[K>>2]=F;if(F>>>0>=k>>>0){break}r=a+36|0;G=a+32|0;B=a+40|0;C=-k|0;u=L-k|0;z=L+k|0;s=F;A=j+F|0;F=0;while(1){if((c[2544]|0)>127){y=c[o>>2]|0;ar(y|0,1736,(v=i,i=i+32|0,c[v>>2]=8072,c[v+8>>2]=s,c[v+16>>2]=F,c[v+24>>2]=A,v)|0)|0}c[r>>2]=1;c[G>>2]=1;c[B>>2]=0;if(F>>>0<l>>>0){y=aa(k,l-F|0)|0;x=A;w=F;while(1){J=w+1|0;dd(p,d[x]|0)|0;if(J>>>0<l>>>0){x=x+k|0;w=J}else{break}}M=A+y|0;N=l}else{M=A;N=F}if((M|0)!=(j+((aa(N,k)|0)+s)|0)){H=1624;break}w=c[n>>2]|0;c6(w)|0;c6(w)|0;c7(w)|0;w=s+L|0;x=N-1|0;t=M+u|0;c[K>>2]=w;if(w>>>0>=k>>>0){break L2172}if((c[2544]|0)>127){E=c[o>>2]|0;ar(E|0,7672,(v=i,i=i+32|0,c[v>>2]=8072,c[v+8>>2]=w,c[v+16>>2]=x,c[v+24>>2]=t,v)|0)|0}c[r>>2]=-1;c[G>>2]=-1;c[B>>2]=l;if((N|0)>0){E=aa(k,~N)|0;D=t;J=x;while(1){dd(p,d[D]|0)|0;if((J|0)>0){D=D+C|0;J=J-1|0}else{break}}O=M+(L+E)|0;P=-1}else{O=t;P=x}if((O|0)!=(j+((aa(P,k)|0)+w)|0)){H=1633;break}J=c[n>>2]|0;c6(J)|0;c6(J)|0;c7(J)|0;J=w+L|0;c[K>>2]=J;if(J>>>0<k>>>0){s=J;A=O+z|0;F=P+1|0}else{break L2172}}if((H|0)==1633){aV(4152,739,8072,2408);return 0}else if((H|0)==1624){aV(4152,721,8072,2408);return 0}}}while(0);c[a+32>>2]=0;c[g>>2]=0;dl(c[f>>2]|0,a,b)|0;f=m+4|0;g=c[f>>2]|0;if((g|0)==0){h=0;i=e;return h|0}do{if((c[a+92>>2]|0)==0){if((L|0)==1){H=1639}else{if((c[q>>2]|0)==1){H=1639}else{Q=g}}if((H|0)==1639){P=m+8|0;O=c[P>>2]|0;L2211:do{if((O|0)!=0){k=P;n=O;do{j=n;while(1){if(((c[j>>2]|0)-2|0)>>>0>=23){break}if((c[j+48>>2]|0)>=3){break}M=j+32|0;c[k>>2]=c[M>>2];c[f>>2]=(c[f>>2]|0)-1;c[M>>2]=0;cY(a,j);M=c[k>>2]|0;if((M|0)==0){break L2211}else{j=M}}k=j+32|0;n=c[k>>2]|0;}while((n|0)!=0)}}while(0);Q=c[f>>2]|0}if((Q|0)==0){h=0}else{R=Q;break}i=e;return h|0}else{R=g}}while(0);g=c[a+16>>2]|0;if((g|0)==0){h=R;i=e;return h|0}a8[g&1](b,c[a+12>>2]|0);h=c[f>>2]|0;i=e;return h|0}function da(a){a=a|0;return a+260|0}function db(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;d=a[b|0]|0;e=d&255;f=b+256|0;g=(c[f>>2]|0)-(c[b+4+((e+10&15)<<2)>>2]|0)|0;c[f>>2]=g;h=b+4+((e+15&15)<<2)|0;i=(c[h>>2]|0)+g|0;c[f>>2]=i;if((d&1)!=0|i>>>0<7){j=0;return j|0}d=c[h>>2]|0;h=b+4+((e+14&15)<<2)|0;f=c[h>>2]|0;if((((((f+d|0)*14|0|1)>>>0)/(i>>>0)|0)+509&510|0)!=0){j=0;return j|0}g=b+4+((e+13&15)<<2)|0;k=c[g>>2]|0;if((((((k+f|0)*14|0|1)>>>0)/(i>>>0)|0)+509&510|0)!=4){j=0;return j|0}f=b+4+((e+12&15)<<2)|0;l=c[f>>2]|0;if((((((l+k|0)*14|0|1)>>>0)/(i>>>0)|0)+509&510|0)!=4){j=0;return j|0}k=b+4+((e+11&15)<<2)|0;if(((((((c[k>>2]|0)+l|0)*14|0|1)>>>0)/(i>>>0)|0)+509&510|0)!=0){j=0;return j|0}i=c[b+4+((e&15)<<2)>>2]|0;c[b+276>>2]=i+((d+1|0)>>>1);e=i+d+(c[h>>2]|0)|0;c[b+268>>2]=e;h=(c[g>>2]|0)+e|0;c[b+260>>2]=h;c[b+264>>2]=h;c[b+272>>2]=(c[f>>2]|0)+h+(((c[k>>2]|0)+1|0)>>>1);j=64;return j|0}function dc(a){a=a|0;c[a+2836>>2]=0;c[a+2848>>2]=0;return}function dd(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;d=a+8|0;e=c[d>>2]|0;f=c[a+12+((e+3&3)<<2)>>2]|0;if((e|0)==0){c[a+24>>2]=b;c[a+20>>2]=b;c[a+16>>2]=b;c[a+12>>2]=b;g=b;h=b}else{i=(((b-f|0)*25|0)>>5)+f|0;c[a+12+((e&3)<<2)>>2]=i;g=f;h=i}i=c[a+12+((e+2&3)<<2)>>2]|0;f=e+1|0;b=c[a+12+((f&3)<<2)>>2]|0;j=g-i|0;k=i-b|0;if((((j|0)>-1?j:-j|0)|0)<(((k|0)>-1?k:-k|0)|0)){l=(j>>>31|0)==(k>>>31|0)?k:j}else{l=j}j=h-(g<<1)+i|0;h=g-(i<<1)+b|0;b=(j|0)!=0;do{if(b){if((j|0)>0){if((h|0)<0){break}else{m=0}c[d>>2]=f;return m|0}else{if((h|0)>0){break}else{m=0}c[d>>2]=f;return m|0}}}while(0);i=a+32|0;g=c[i>>2]|0;k=a+4|0;n=c[k>>2]|0;do{if(g>>>0>n>>>0){o=c[a+44>>2]|0;if((o|0)==0){p=n;break}q=(((aa((c[d>>2]<<5)-(c[a+40>>2]|0)|0,g)|0)>>>0)/(o>>>0)|0)>>>3;if(g>>>0>q>>>0){o=g-q|0;if(o>>>0>n>>>0){p=o;break}}c[i>>2]=n;p=n}else{p=n}}while(0);n=(l|0)>-1?l:-l|0;if(p>>>0>n>>>0){m=0;c[d>>2]=f;return m|0}p=a+28|0;g=c[p>>2]|0;do{if((g|0)>0?(l|0)<0:(l|0)>0){do{if((g|0)==0){c[a+36>>2]=48;c[a+40>>2]=48;r=48;s=48}else{o=a+40|0;q=c[o>>2]|0;t=c[a+36>>2]|0;if((q|0)!=0){r=q;s=t;break}c[o>>2]=t;r=t;s=t}}while(0);t=s-r|0;c[a+44>>2]=t;c[a+40>>2]=s;o=c[a>>2]|0;if((o|0)==0){u=1;break}u=dV(o,t)|0}else{if((((g|0)>-1?g:-g|0)|0)<(n|0)){u=0;break}else{m=0}c[d>>2]=f;return m|0}}while(0);c[p>>2]=l;l=((n*14|0)+16|0)>>>5;n=c[k>>2]|0;c[i>>2]=l>>>0<n>>>0?n:l;l=j-h|0;n=a+36|0;c[n>>2]=32;do{if((j|0)==(h|0)){c[n>>2]=16;v=16}else{if(!b){v=32;break}a=32-((j<<5|1|0)/(l|0)|0)|0;c[n>>2]=a;v=a}}while(0);c[n>>2]=v+(e<<5);m=u;c[d>>2]=f;return m|0}function de(){var a=0;a=eb(1,2856)|0;d7(a+768|0,0,0);dD(a,29);return a|0}function df(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=i;if((c[2544]|0)>0){d=c[o>>2]|0;e=c[a+2840>>2]|0;f=c[a+2852>>2]|0;ar(d|0,3848,(v=i,i=i+24|0,c[v>>2]=9168,c[v+8>>2]=e,c[v+16>>2]=f,v)|0)|0}f=c[a+2832>>2]|0;if((f|0)!=0){ea(f)}f=c[a+2844>>2]|0;if((f|0)==0){g=a|0;ea(g);i=b;return}ea(f);g=a|0;ea(g);i=b;return}function dg(b,d,e,f,g,h,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0;k=i;i=i+64|0;l=k|0;m=k+16|0;n=eb(f,1)|0;if((f|0)<=0){ea(n);i=k;return}o=l|0;p=l+4|0;q=l+8|0;l=d+4|0;r=d+8|0;s=d|0;t=m;u=m+16|0;v=m+24|0;w=m+20|0;x=m+28|0;y=m+40|0;z=m+44|0;A=m+32|0;B=m+36|0;C=0;while(1){D=C+1|0;E=n+C|0;F=(D|0)<(f|0);if((a[E]|0)==0&F){G=e+(C<<4)|0;H=D;while(1){I=H+1|0;J=n+H|0;K=(I|0)<(f|0);if((a[J]|0)==0&K){L=e+(H<<4)|0;M=I;do{N=n+M|0;do{if((a[N]|0)==0){c[o>>2]=G;c[p>>2]=L;c[q>>2]=e+(M<<4);if((dh(b,m,g,h,j,o)|0)<=-1){O=1;break}P=c[l>>2]|0;Q=c[r>>2]|0;if((P|0)<(Q|0)){R=P;S=c[s>>2]|0}else{P=Q<<1|1;c[r>>2]=P;Q=ec(c[s>>2]|0,P*48|0)|0;c[s>>2]=Q;R=c[l>>2]|0;S=Q}c[l>>2]=R+1;Q=S+(R*48|0)|0;eg(Q|0,t|0,48)|0;Q=(c[s>>2]|0)+(((c[l>>2]|0)-1|0)*48|0)+16|0;c[Q>>2]=c[Q>>2]>>2;Q=(c[s>>2]|0)+(((c[l>>2]|0)-1|0)*48|0)+20|0;c[Q>>2]=c[Q>>2]>>2;Q=(c[s>>2]|0)+(((c[l>>2]|0)-1|0)*48|0)+24|0;c[Q>>2]=c[Q>>2]>>2;Q=(c[s>>2]|0)+(((c[l>>2]|0)-1|0)*48|0)+28|0;c[Q>>2]=c[Q>>2]>>2;Q=(c[s>>2]|0)+(((c[l>>2]|0)-1|0)*48|0)+32|0;c[Q>>2]=c[Q>>2]>>2;Q=(c[s>>2]|0)+(((c[l>>2]|0)-1|0)*48|0)+36|0;c[Q>>2]=c[Q>>2]>>2;Q=(c[s>>2]|0)+(((c[l>>2]|0)-1|0)*48|0)+40|0;c[Q>>2]=c[Q>>2]>>2;Q=(c[s>>2]|0)+(((c[l>>2]|0)-1|0)*48|0)+44|0;c[Q>>2]=c[Q>>2]>>2;a[N]=1;a[J]=1;a[E]=1;Q=c[u>>2]|0;P=c[w>>2]|0;T=c[v>>2]|0;U=c[x>>2]|0;V=T-Q|0;W=U-P|0;X=c[y>>2]|0;Y=c[z>>2]|0;Z=X-T|0;_=Y-U|0;$=c[A>>2]|0;ab=c[B>>2]|0;ac=$-X|0;ad=ab-Y|0;ae=Q-$|0;af=P-ab|0;ag=0;ah=0;while(1){ai=n+ah|0;do{if((a[ai]|0)==0){aj=c[e+(ah<<4)>>2]|0;ak=c[e+(ah<<4)+4>>2]|0;al=aa(ak-P|0,V)|0;if((al-(aa(aj-Q|0,W)|0)|0)<=-1){am=ag;break}al=aa(Z,ak-U|0)|0;if((al-(aa(_,aj-T|0)|0)|0)<=-1){am=ag;break}al=aa(ac,ak-Y|0)|0;if((al-(aa(ad,aj-X|0)|0)|0)<=-1){am=ag;break}al=aa(ak-ab|0,ae)|0;if((al-(aa(af,aj-$|0)|0)|0)<=-1){am=ag;break}a[ai]=2;am=ag+1|0}else{am=ag}}while(0);ai=ah+1|0;if((ai|0)<(f|0)){ag=am;ah=ai}else{break}}if((am|0)>2){ah=d9(am<<4)|0;ag=ah;$=0;af=0;while(1){if((a[n+af|0]|0)==2){ae=ag+($<<4)|0;ab=e+(af<<4)|0;c[ae>>2]=c[ab>>2];c[ae+4>>2]=c[ab+4>>2];c[ae+8>>2]=c[ab+8>>2];c[ae+12>>2]=c[ab+12>>2];an=$+1|0}else{an=$}ab=af+1|0;if((ab|0)<(f|0)){$=an;af=ab}else{break}}dg(b,d,ag,an,g,h,j);ea(ah);ao=0}else{ao=0}do{af=n+ao|0;if((a[af]|0)==2){a[af]=1}ao=ao+1|0;}while((ao|0)<(f|0));O=(a[J]|0)==0}else{O=1}}while(0);M=M+1|0;}while(O&(M|0)<(f|0));ap=(a[E]|0)==0}else{ap=1}if(ap&K){H=I}else{break}}}if(F){C=D}else{break}}ea(n);i=k;return}function dh(b,e,f,g,h,j){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0,at=0,au=0,av=0,aw=0,ax=0,ay=0,az=0,aA=0,aB=0,aC=0,aD=0,aE=0,aF=0,aG=0,aH=0,aI=0,aJ=0,aK=0,aL=0,aM=0,aN=0,aO=0,aP=0,aQ=0,aR=0,aS=0,aT=0,aU=0,aV=0,aW=0,aX=0,aY=0,aZ=0,a_=0,a$=0,a0=0,a1=0,a2=0,a3=0,a4=0,a5=0,a6=0,a7=0,a8=0,a9=0,ba=0,bb=0,bc=0,bd=0,be=0,bf=0,bg=0,bh=0,bi=0,bj=0,bk=0,bl=0,bm=0,bn=0,bo=0,bp=0,bq=0,br=0,bs=0,bt=0,bu=0,bv=0,bw=0,bx=0,by=0,bz=0,bA=0,bB=0,bC=0,bD=0,bE=0,bF=0,bG=0,bH=0,bI=0,bJ=0,bK=0,bL=0,bM=0,bN=0,bO=0,bP=0,bQ=0,bR=0,bS=0,bT=0,bU=0,bV=0,bW=0,bX=0,bY=0,bZ=0,b_=0,b$=0,b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0,b7=0,b8=0,b9=0,ca=0,cb=0,cc=0,cd=0,ce=0,cf=0,cg=0,ch=0,ci=0,cj=0,ck=0,cl=0,cm=0,cn=0,co=0,cp=0,cq=0,cr=0,cs=0,ct=0,cu=0,cv=0,cw=0,cx=0,cy=0,cz=0,cA=0,cB=0,cC=0,cD=0,cE=0,cF=0,cG=0,cH=0,cI=0,cJ=0,cK=0,cL=0,cM=0,cN=0,cO=0,cP=0,cQ=0,cR=0,cS=0,cT=0,cU=0,cV=0,cW=0,cX=0,cY=0,cZ=0,c_=0,c$=0,c0=0,c1=0,c2=0,c3=0,c4=0,c5=0,c6=0,c7=0,c8=0,c9=0,da=0,db=0,dc=0,dd=0,de=0,df=0,dg=0,dh=0,di=0,dj=0,dk=0,dl=0,dm=0,du=0,dx=0,dC=0,dD=0,dF=0,dG=0,dH=0,dJ=0,dK=0,dL=0,dM=0,dN=0,dO=0,dP=0,dQ=0,dR=0,dS=0,dT=0,dU=0,dV=0,dW=0,dX=0,dY=0,dZ=0,d_=0,d$=0,d0=0,d1=0,d2=0,d3=0,d5=0,d6=0,d7=0,d8=0,ed=0,ee=0,ef=0,eh=0,ei=0,el=0,eo=0,ep=0,er=0,es=0,et=0,ev=0,ex=0,ey=0,ez=0,eA=0,eB=0,eC=0,eD=0,eE=0,eF=0,eG=0,eH=0,eI=0,eJ=0,eK=0,eL=0,eM=0,eN=0,eO=0,eP=0,eQ=0,eR=0,eS=0,eT=0,eU=0,eV=0,eW=0,eX=0,eY=0,eZ=0,e_=0,e$=0,e0=0,e1=0,e2=0,e3=0,e4=0,e5=0,e6=0,e7=0,e8=0,e9=0,fa=0,fb=0,fc=0,fd=0,fe=0,ff=0,fg=0,fh=0,fi=0,fj=0,fk=0,fl=0,fm=0,fn=0,fo=0,fp=0,fq=0,fr=0,fs=0,ft=0,fu=0,fv=0,fw=0,fx=0,fy=0,fz=0,fA=0,fB=0,fC=0,fD=0,fE=0,fF=0,fG=0,fH=0,fI=0,fJ=0,fK=0,fL=0,fM=0,fN=0,fO=0,fP=0,fQ=0,fR=0,fS=0,fT=0,fU=0,fV=0,fW=0,fX=0,fY=0,fZ=0,f_=0,f$=0,f0=0,f1=0,f2=0,f3=0,f4=0,f5=0,f6=0,f7=0,f8=0,f9=0,ga=0,gb=0,gc=0,gd=0,ge=0,gf=0,gg=0,gh=0,gi=0,gj=0,gk=0,gl=0,gm=0,gn=0,go=0,gp=0,gq=0,gr=0,gs=0,gt=0,gu=0,gv=0,gw=0,gx=0,gy=0,gz=0,gA=0,gB=0,gC=0,gD=0,gE=0,gF=0,gG=0,gH=0,gI=0,gJ=0;k=i;i=i+736|0;l=k|0;m=k+16|0;n=k+32|0;o=k+48|0;p=k+56|0;q=k+104|0;r=k+112|0;s=k+120|0;t=k+176|0;u=k+232|0;v=k+264|0;w=k+272|0;x=k+280|0;y=k+288|0;z=k+344|0;A=k+376|0;B=k+424|0;C=k+496|0;D=k+576|0;F=k+656|0;G=c[j>>2]|0;H=c[j+4>>2]|0;I=c[j+8>>2]|0;J=c[G>>2]|0;K=c[G+4>>2]|0;G=c[H>>2]|0;L=c[H+4>>2]|0;H=c[I>>2]|0;M=c[I+4>>2]|0;I=aa(M-K|0,G-J|0)|0;N=aa(H-J|0,L-K|0)|0;if((I|0)==(N|0)){O=-1;i=k;return O|0}c[z>>2]=0;c[z+12>>2]=0;c[z+24>>2]=0;P=(I-N|0)>>>31;N=P+1|0;c[z+4>>2]=N;c[z+16>>2]=N;I=2-P|0;c[z+8>>2]=I;c[z+20>>2]=I;P=G-H|0;H=aa(P,P)|0;P=L-M|0;M=(aa(P,P)|0)+H|0;H=c[j+(I<<2)>>2]|0;I=c[H+4>>2]|0;P=(c[H>>2]|0)-J|0;H=aa(P,P)|0;P=I-K|0;I=(aa(P,P)|0)+H|0;H=I>>>0>M>>>0;P=c[j+(N<<2)>>2]|0;N=c[P+4>>2]|0;L=J-(c[P>>2]|0)|0;P=aa(L,L)|0;L=K-N|0;N=((aa(L,L)|0)+P|0)>>>0>(H?I:M)>>>0?2:H&1;H=C+72|0;M=D+72|0;I=F+72|0;P=g-1|0;L=P+((h|0)>(g|0)?h-g|0:0)|0;K=A|0;J=A+4|0;G=A+8|0;Q=A+12|0;R=A+16|0;S=A+20|0;T=A+24|0;U=A+28|0;V=A+32|0;W=A+36|0;X=A+40|0;Y=D+64|0;Z=D+68|0;_=F+64|0;$=F+68|0;ab=D+12|0;ac=F+8|0;ad=C+64|0;ae=C+68|0;af=C+12|0;ag=C+8|0;ah=b+768|0;ai=p|0;aj=p+4|0;ak=p+8|0;al=p+24|0;am=p+28|0;an=p+32|0;ao=D+4|0;ap=p+12|0;aq=D+52|0;ar=D|0;as=F|0;at=p+36|0;au=F+60|0;av=F+4|0;aw=D+20|0;ax=F+28|0;ay=p+40|0;az=p+16|0;aA=-g<<2;aB=g<<3;aC=-h<<2;aD=h<<3;aE=e+40|0;aF=e+44|0;aG=D+8|0;aH=F+12|0;aI=e+16|0;aJ=e+20|0;aK=e+24|0;aL=e+28|0;aM=e+32|0;aN=e+36|0;aO=v|0;aP=v+4|0;aQ=B|0;aR=B+4|0;aS=B+56|0;aT=B+8|0;aU=B+12|0;aV=B+60|0;aW=B+16|0;aX=B+20|0;aY=B+48|0;aZ=B+24|0;a_=B+28|0;a$=B+32|0;a0=B+36|0;a1=B+40|0;a2=B+44|0;a3=B+52|0;a4=B+64|0;a5=C|0;a6=C+4|0;a7=h-1|0;a8=w|0;a9=w+4|0;ba=b|0;b=t;bb=e+16|0;bc=y+52|0;bd=y|0;be=y+24|0;bf=y+28|0;bg=u+4|0;bh=e|0;bi=e+4|0;bj=e+11|0;bk=e+10|0;bl=e+12|0;bm=e+8|0;bn=e+9|0;bo=e+13|0;bp=u|0;bq=x|0;br=x+4|0;x=n|0;bs=p+44|0;bt=p+20|0;bu=N;L2355:while(1){bv=c[j+(c[z+(bu<<2)>>2]<<2)>>2]|0;c[H>>2]=bv;bw=bu+1|0;bx=c[j+(c[z+(bw<<2)>>2]<<2)>>2]|0;c[M>>2]=bx;by=c[j+(c[z+(bu+2<<2)>>2]<<2)>>2]|0;c[I>>2]=by;bz=28-(dI(L)|0)|0;bA=bv|0;bB=bx|0;bC=by|0;bD=bx+4|0;bx=c[bD>>2]|0;bE=c[bC>>2]|0;bF=by+4|0;by=c[bA>>2]|0;bG=bv+4|0;bv=c[bG>>2]|0;bH=(c[bB>>2]|0)-by|0;bI=(c[bF>>2]|0)-bv|0;bJ=aa(bI,bH)|0;bK=bx-bv|0;bv=bE-by|0;by=bJ-(aa(bK,bv)|0)|0;c[K>>2]=bH;c[J>>2]=bv;c[G>>2]=bK;c[Q>>2]=bI;bJ=bI<<bz;bI=by>>1;bE=bJ>>31;bx=((bI+bE^bE)+bJ|0)/(by|0)|0;c[R>>2]=bx;bJ=-bv<<bz;bv=bJ>>31;bE=((bI+bv^bv)+bJ|0)/(by|0)|0;c[S>>2]=bE;bJ=-bK<<bz;bK=bJ>>31;bv=((bI+bK^bK)+bJ|0)/(by|0)|0;c[T>>2]=bv;bJ=bH<<bz;bH=bJ>>31;bK=((bI+bH^bH)+bJ|0)/(by|0)|0;c[U>>2]=bK;by=c[bA>>2]|0;c[V>>2]=by;bJ=c[bG>>2]|0;c[W>>2]=bJ;c[X>>2]=bz;bH=c[bD>>2]|0;bD=(c[bB>>2]|0)-by|0;by=aa(bD,bx)|0;bx=bH-bJ|0;c[Y>>2]=(aa(bx,bE)|0)+by;by=aa(bD,bv)|0;c[Z>>2]=(aa(bx,bK)|0)+by;dq(D,A);by=1<<bz;L2357:do{if((dn(D,by,by)|0)>=0){bz=c[bF>>2]|0;bK=(c[bC>>2]|0)-(c[V>>2]|0)|0;bx=aa(bK,c[R>>2]|0)|0;bv=bz-(c[W>>2]|0)|0;c[_>>2]=(aa(bv,c[S>>2]|0)|0)+bx;bx=aa(bK,c[T>>2]|0)|0;c[$>>2]=(aa(bv,c[U>>2]|0)|0)+bx;dq(F,A);if((dn(F,by,by)|0)<0){break}bx=c[ab>>2]|0;bv=c[ac>>2]|0;bK=bx-bv|0;if((((bK|0)>-1?bK:-bK|0)|0)>3){break}bK=c[bG>>2]|0;bz=(c[bA>>2]|0)-(c[V>>2]|0)|0;bD=aa(bz,c[R>>2]|0)|0;bE=bK-(c[W>>2]|0)|0;c[ad>>2]=(aa(bE,c[S>>2]|0)|0)+bD;bD=aa(bz,c[T>>2]|0)|0;c[ae>>2]=(aa(bE,c[U>>2]|0)|0)+bD;dq(C,A);if((dn(C,by,by)|0)<0){break}bD=(c[af>>2]|0)-bx|0;if((((bD|0)>-1?bD:-bD|0)|0)>3){break}bD=(c[ag>>2]|0)-bv|0;if((((bD|0)>-1?bD:-bD|0)|0)>3){break}dy(C,A,ah,0);dy(F,A,ah,0);dz(ai,A,C,F,0);bD=c[I>>2]|0;bv=bD|0;bx=bD+4|0;bD=c[bx>>2]|0;bE=c[ai>>2]|0;bz=c[aj>>2]|0;bK=c[ak>>2]|0;bJ=aa(bE,c[bv>>2]|0)|0;if((bK+bJ+(aa(bz,bD)|0)|0)<0){break}bD=c[M>>2]|0;bJ=c[bD+4>>2]|0;bH=aa(c[bD>>2]|0,bE)|0;if((bH+bK+(aa(bJ,bz)|0)|0)<0){break}dy(C,A,ah,2);dy(D,A,ah,2);dz(al,A,C,D,2);bz=c[bx>>2]|0;bJ=c[al>>2]|0;bK=c[am>>2]|0;bH=c[an>>2]|0;bE=aa(bJ,c[bv>>2]|0)|0;if((bH+bE+(aa(bK,bz)|0)|0)<0){break}bz=c[M>>2]|0;bE=c[bz+4>>2]|0;bD=aa(c[bz>>2]|0,bJ)|0;if((bD+bH+(aa(bE,bK)|0)|0)<0){break}bK=c[ao>>2]>>1;dy(D,A,ah,1);bE=c[X>>2]|0;bH=c[aq>>2]|0;if((bH|0)<2){c[q>>2]=0;bL=0}else{bD=d9(bH<<3)|0;bJ=bD;bz=c[aw>>2]|0;bB=0;do{c[bJ+(bB<<3)>>2]=c[bz+(bB<<4)>>2];c[bJ+(bB<<3)+4>>2]=c[bz+(bB<<4)+4>>2];bB=bB+1|0;}while((bB|0)<(bH|0));dB(ap,bJ,bH,bE);bB=c[M>>2]|0;bz=c[bB+4>>2]|0;bI=c[ap>>2]|0;bM=c[az>>2]|0;bN=c[bt>>2]|0;bO=aa(bI,c[bB>>2]|0)|0;if((bN+bO+(aa(bM,bz)|0)|0)<0){bz=-bI|0;c[ap>>2]=bz;bO=-bM|0;c[az>>2]=bO;bB=-bN|0;c[bt>>2]=bB;bP=bz;bQ=bO;bR=bB}else{bP=bI;bQ=bM;bR=bN}ea(bD);bN=c[H>>2]|0;bM=c[bN+4>>2]|0;bI=aa(bP,c[bN>>2]|0)|0;if((bR+bI+(aa(bQ,bM)|0)|0)<0){break}bM=c[bx>>2]|0;bI=aa(c[bv>>2]|0,bP)|0;if((bI+bR+(aa(bM,bQ)|0)|0)<0){break}if((dA(A,bP,bQ,1,bK,q)|0)<0){break}bL=c[q>>2]|0}bM=c[Y>>2]|0;bI=c[ar>>2]|0;bN=bM-(bL<<1)+(bI*3|0)|0;bB=(c[Z>>2]|0)-(bK<<1)|0;bO=c[as>>2]>>1;dy(F,A,ah,3);bz=c[X>>2]|0;bS=c[au>>2]|0;if((bS|0)<2){c[r>>2]=0;bT=0}else{bU=d9(bS<<3)|0;bV=bU;bW=c[ax>>2]|0;bX=0;do{c[bV+(bX<<3)>>2]=c[bW+(bX<<4)>>2];c[bV+(bX<<3)+4>>2]=c[bW+(bX<<4)+4>>2];bX=bX+1|0;}while((bX|0)<(bS|0));dB(at,bV,bS,bz);bX=c[I>>2]|0;bW=c[bX+4>>2]|0;bv=c[at>>2]|0;bx=c[ay>>2]|0;bD=c[bs>>2]|0;bE=aa(bv,c[bX>>2]|0)|0;if((bD+bE+(aa(bx,bW)|0)|0)<0){bW=-bv|0;c[at>>2]=bW;bE=-bx|0;c[ay>>2]=bE;bX=-bD|0;c[bs>>2]=bX;bY=bW;bZ=bE;b_=bX}else{bY=bv;bZ=bx;b_=bD}ea(bU);bD=c[H>>2]|0;bx=c[bD+4>>2]|0;bv=aa(bY,c[bD>>2]|0)|0;if((b_+bv+(aa(bZ,bx)|0)|0)<0){break}bx=c[M>>2]|0;bv=c[bx+4>>2]|0;bD=aa(c[bx>>2]|0,bY)|0;if((bD+b_+(aa(bv,bZ)|0)|0)<0){break}if((dA(A,bY,bZ,0,bO,r)|0)<0){break}bT=c[r>>2]|0}bv=(c[_>>2]|0)-(bO<<1)|0;bD=c[$>>2]|0;bx=c[av>>2]|0;bX=bD-(bT<<1)+(bx*3|0)|0;bE=((bK-1-bB+bD|0)/(bK|0)|0)+bH|0;bD=d9(bE<<3)|0;if((bH|0)>0){bW=c[aw>>2]|0;bJ=0;do{b$=bW+(bJ<<4)|0;b0=bD+(bJ<<3)|0;b1=c[b$+4>>2]|0;c[b0>>2]=c[b$>>2];c[b0+4>>2]=b1;bJ=bJ+1|0;}while((bJ|0)<(bH|0))}bJ=((bO-1-bv+bM|0)/(bO|0)|0)+bS|0;bW=d9(bJ<<3)|0;if((bS|0)>0){bU=c[ax>>2]|0;bz=0;do{bV=bU+(bz<<4)|0;b1=bW+(bz<<3)|0;b0=c[bV+4>>2]|0;c[b1>>2]=c[bV>>2];c[b1+4>>2]=b0;bz=bz+1|0;}while((bz|0)<(bS|0))}bz=c[X>>2]|0;bU=1<<bz-1;bM=bU+(c[V>>2]<<bz)|0;b0=(c[W>>2]<<bz)+bU|0;bU=c[K>>2]|0;bz=aa(bU,bN)|0;b1=c[J>>2]|0;bV=bM+bz+(aa(b1,bB)|0)|0;bz=c[G>>2]|0;b$=aa(bz,bN)|0;b2=c[Q>>2]|0;b3=b$+b0+(aa(b2,bB)|0)|0;b$=aa(bU,bL)|0;b4=(aa(b1,bK)|0)+b$|0;b$=aa(bz,bL)|0;b5=(aa(b2,bK)|0)+b$|0;b$=aa(bI,bU)|0;b6=aa(bI,bz)|0;b7=aa(bU,bv)|0;b8=bM+b7+(aa(b1,bX)|0)|0;b7=aa(bz,bv)|0;b9=b7+b0+(aa(b2,bX)|0)|0;b7=aa(bU,bO)|0;bU=(aa(b1,bT)|0)+b7|0;b7=aa(bz,bO)|0;bz=(aa(b2,bT)|0)+b7|0;b7=aa(b1,bx)|0;b1=aa(b2,bx)|0;b2=(bO|0)>0;ca=b2?bO:0;cb=(bK|0)>0;cc=cb?bK:0;cd=bW;ce=bS;cf=bJ;cg=bD;ch=bH;ci=bE;cj=bS;ck=0;cl=bN;cm=bB;cn=bv;co=bz;bz=bU;bU=b9;b9=b8;b8=bH;cp=0;cq=bX;cr=bV;bV=b3;b3=b5;b5=b4;L2404:while(1){b4=(cp|0)>14;cs=cd;ct=ce;cu=cf;cv=cj;cw=ck;cx=cn;cy=co;cz=bz;cA=bU;cB=b9;cC=cq;while(1){cD=(c[$>>2]|0)+cC>>1;cE=c[Y>>2]|0;cF=cE+cl>>1;cG=(cw|0)>14|(cx|0)>=(((cF|0)<(cl|0)?cF:cl)|0);if(!(b4|(cm|0)>=(((cD|0)<(cC|0)?cD:cC)|0))){if(cG|(cm|0)<(cx|0)){break}}if(cG){break L2404}cG=(c[X>>2]|0)+2|0;cD=cB+b7>>cG;cF=cA+b1>>cG;cH=cB-b7>>cG;cI=cA-b1>>cG;if((ct|0)<(cu|0)){cJ=cs;cK=cu}else{cG=cu<<1|1;cJ=ec(cs,cG<<3)|0;cK=cG}do{if((cI|0)<(h|0)&(((cD|0)>=(g|0)|(cD|0)<0|(cF|0)<0|(cF|0)>=(h|0)|(cH|0)<0|(cH|0)>=(g|0)|(cI|0)<0)^1)){if((a[f+((aa(cF,g)|0)+cD)|0]|0)!=0){cL=ct;cM=cv;cN=0;cO=cx;cP=cy;cQ=cz;cR=cA;cS=cB;cT=cC;break}if((a[f+((aa(cI,g)|0)+cH)|0]|0)!=0){cL=ct;cM=cv;cN=0;cO=cx;cP=cy;cQ=cz;cR=cA;cS=cB;cT=cC;break}cG=(a[f+((aa(cI+cF>>1,g)|0)+(cH+cD>>1))|0]|0)==0;if(cG){cU=cG<<31>>31}else{cU=dv(f,g,cD,cF,cH,cI,1,cJ+(ct<<3)|0)|0}if((cU|0)<=-1){cV=1823;break}if((cU|0)!=0){cL=ct;cM=cv;cN=0;cO=cx;cP=cy;cQ=cz;cR=cA;cS=cB;cT=cC;break}cG=c[cJ+(ct<<3)+4>>2]|0;cW=(c[cJ+(ct<<3)>>2]|0)-(c[V>>2]|0)|0;cX=aa(cW,c[R>>2]|0)|0;cY=cG-(c[W>>2]|0)|0;cG=(aa(cY,c[S>>2]|0)|0)+cX|0;cX=aa(c[T>>2]|0,cW)|0;cW=aa(c[U>>2]|0,cY)|0;if((cG+bO|0)>(cx|0)){cZ=cG+cx>>1}else{cZ=cx}cG=cX+cC+cW>>1;cW=aa(c[K>>2]|0,cZ)|0;cX=cW+bM+(aa(c[J>>2]|0,cG)|0)|0;cW=aa(c[G>>2]|0,cZ)|0;cY=cW+b0+(aa(c[Q>>2]|0,cG)|0)|0;cW=ct+1|0;c_=(cv>>2)+cv|0;if((ct|0)<(((c_|0)>1?c_:1)|0)){cL=cW;cM=cv;cN=0;cO=cZ;cP=cy;cQ=cz;cR=cY;cS=cX;cT=cG;break}dB(at,cJ,cW,c[X>>2]|0);if((dA(A,c[at>>2]|0,c[ay>>2]|0,0,bO,r)|0)<=-1){cL=cW;cM=cW;cN=0;cO=cZ;cP=cy;cQ=cz;cR=cY;cS=cX;cT=cG;break}c_=aa(c[K>>2]|0,bO)|0;c$=c[r>>2]|0;c0=(aa(c$,c[J>>2]|0)|0)+c_|0;c_=aa(c[G>>2]|0,bO)|0;cL=cW;cM=cW;cN=0;cO=cZ;cP=(aa(c[Q>>2]|0,c$)|0)+c_|0;cQ=c0;cR=cY;cS=cX;cT=cG}else{cV=1823}}while(0);if((cV|0)==1823){cV=0;cL=ct;cM=cv;cN=cw+1|0;cO=cx;cP=cy;cQ=cz;cR=cA;cS=cB;cT=cC}cs=cJ;ct=cL;cu=cK;cv=cM;cw=b2?cN:2147483647;cx=cO+ca|0;cy=cP;cz=cQ;cA=cP+cR|0;cB=cQ+cS|0;cC=(c[r>>2]|0)+cT|0}b4=(c[X>>2]|0)+2|0;cI=cr+b$>>b4;cH=bV+b6>>b4;cF=cr-b$>>b4;cD=bV-b6>>b4;if((ch|0)<(ci|0)){c1=cg;c2=ci}else{b4=ci<<1|1;c1=ec(cg,b4<<3)|0;c2=b4}do{if((cD|0)<(h|0)&(((cI|0)>=(g|0)|(cI|0)<0|(cH|0)<0|(cH|0)>=(h|0)|(cF|0)<0|(cF|0)>=(g|0)|(cD|0)<0)^1)){if((a[f+((aa(cH,g)|0)+cI)|0]|0)!=0){c3=ch;c4=cl;c5=cm;c6=b8;c7=0;c8=cr;c9=bV;da=b3;db=b5;break}if((a[f+((aa(cD,g)|0)+cF)|0]|0)!=0){c3=ch;c4=cl;c5=cm;c6=b8;c7=0;c8=cr;c9=bV;da=b3;db=b5;break}b4=(a[f+((aa(cD+cH>>1,g)|0)+(cF+cI>>1))|0]|0)==0;if(b4){dc=b4<<31>>31}else{dc=dv(f,g,cI,cH,cF,cD,1,c1+(ch<<3)|0)|0}if((dc|0)<=-1){cV=1806;break}if((dc|0)!=0){c3=ch;c4=cl;c5=cm;c6=b8;c7=0;c8=cr;c9=bV;da=b3;db=b5;break}b4=c[c1+(ch<<3)+4>>2]|0;cG=(c[c1+(ch<<3)>>2]|0)-(c[V>>2]|0)|0;cX=aa(cG,c[R>>2]|0)|0;cY=b4-(c[W>>2]|0)|0;b4=aa(cY,c[S>>2]|0)|0;c0=aa(c[T>>2]|0,cG)|0;cG=(aa(c[U>>2]|0,cY)|0)+c0|0;c0=cX+cl+b4>>1;if((cG+bK|0)>(cm|0)){dd=cG+cm>>1}else{dd=cm}cG=aa(c[K>>2]|0,c0)|0;b4=cG+bM+(aa(c[J>>2]|0,dd)|0)|0;cG=aa(c[G>>2]|0,c0)|0;cX=cG+b0+(aa(c[Q>>2]|0,dd)|0)|0;cG=ch+1|0;cY=(b8>>2)+b8|0;if((ch|0)<(((cY|0)>1?cY:1)|0)){c3=cG;c4=c0;c5=dd;c6=b8;c7=cp;c8=b4;c9=cX;da=b3;db=b5;break}dB(ap,c1,cG,c[X>>2]|0);if((dA(A,c[ap>>2]|0,c[az>>2]|0,1,bK,q)|0)<=-1){c3=cG;c4=c0;c5=dd;c6=cG;c7=cp;c8=b4;c9=cX;da=b3;db=b5;break}cY=c[q>>2]|0;c_=aa(cY,c[K>>2]|0)|0;c$=(aa(c[J>>2]|0,bK)|0)+c_|0;c_=aa(c[G>>2]|0,cY)|0;c3=cG;c4=c0;c5=dd;c6=cG;c7=cp;c8=b4;c9=cX;da=(aa(c[Q>>2]|0,bK)|0)+c_|0;db=c$}else{cV=1806}}while(0);if((cV|0)==1806){cV=0;c3=ch;c4=cl;c5=cm;c6=b8;c7=cp+1|0;c8=cr;c9=bV;da=b3;db=b5}cd=cs;ce=ct;cf=cu;cg=c1;ch=c3;ci=c2;cj=cv;ck=cw;cl=(c[q>>2]|0)+c4|0;cm=c5+cc|0;cn=cx;co=cy;bz=cz;bU=cA;b9=cB;b8=c6;cp=cb?c7:2147483647;cq=cC;cr=c8+db|0;bV=c9+da|0;b3=da;b5=db}if((ch|0)>1){dB(ap,cg,ch,c[X>>2]|0)}else{b5=((c[ar>>2]|0)*3|0)+cE|0;b3=c[Z>>2]|0;bV=aa(c[K>>2]|0,b5)|0;cr=c[J>>2]|0;cq=(aa(cr,b3)|0)+bV|0;bV=c[X>>2]|0;cb=1<<bV-1;cp=(cq+cb>>bV)+(c[V>>2]|0)|0;cq=aa(c[G>>2]|0,b5)|0;b5=c[Q>>2]|0;b8=cq+cb+(aa(b5,b3)|0)>>bV;bV=b8+(c[W>>2]|0)|0;b8=(cr|0)>-1?cr:-cr|0;cr=(b5|0)>-1?b5:-b5|0;b5=dI(b8-((cr|0)>(b8|0)?b8-cr|0:0)|0)|0;cr=(c[X>>2]|0)+1>>1;b8=c[J>>2]|0;b3=(b8|0)>-1?b8:-b8|0;b8=c[Q>>2]|0;cb=(b8|0)>-1?b8:-b8|0;b8=dI(b3-((cb|0)>(b3|0)?b3-cb|0:0)|0)|0;cb=(b8-((c[X>>2]|0)+1>>1)|0)>0?b5-cr|0:0;cr=1<<cb>>1;b5=cr+(c[Q>>2]|0)>>cb;c[ap>>2]=b5;b8=cr-(c[J>>2]|0)>>cb;c[az>>2]=b8;cb=aa(b5,cp)|0;c[bt>>2]=-(cb+(aa(b8,bV)|0)|0)}ea(cg);if((ct|0)>1){dB(at,cs,ct,c[X>>2]|0)}else{bV=c[_>>2]|0;b8=((c[av>>2]|0)*3|0)+(c[$>>2]|0)|0;cb=aa(c[K>>2]|0,bV)|0;cp=c[J>>2]|0;b5=(aa(cp,b8)|0)+cb|0;cb=c[X>>2]|0;cr=1<<cb-1;b3=(b5+cr>>cb)+(c[V>>2]|0)|0;b5=aa(c[G>>2]|0,bV)|0;bV=c[Q>>2]|0;cq=b5+cr+(aa(bV,b8)|0)>>cb;cb=cq+(c[W>>2]|0)|0;cq=(cp|0)>-1?cp:-cp|0;cp=(bV|0)>-1?bV:-bV|0;bV=dI(cq-((cp|0)>(cq|0)?cq-cp|0:0)|0)|0;cp=(c[X>>2]|0)+1>>1;cq=c[J>>2]|0;b8=(cq|0)>-1?cq:-cq|0;cq=c[Q>>2]|0;cr=(cq|0)>-1?cq:-cq|0;cq=dI(b8-((cr|0)>(b8|0)?b8-cr|0:0)|0)|0;cr=(cq-((c[X>>2]|0)+1>>1)|0)>0?bV-cp|0:0;cp=1<<cr>>1;c[at>>2]=cp+(c[G>>2]|0)>>cr;c[ay>>2]=cp-(c[K>>2]|0)>>cr;cr=aa(c[ap>>2]|0,b3)|0;c[bs>>2]=-(cr+(aa(c[az>>2]|0,cb)|0)|0)}ea(cs);cb=0;do{cr=cb&1;b3=(cb>>1)+2|0;cp=c[p+(cr*12|0)>>2]|0;bV=c[p+(b3*12|0)+4>>2]|0;cq=aa(bV,cp)|0;b8=c[p+(cr*12|0)+4>>2]|0;b5=c[p+(b3*12|0)>>2]|0;b9=aa(b5,b8)|0;bU=cq-b9|0;if((cq|0)==(b9|0)){break L2357}b9=c[p+(b3*12|0)+8>>2]|0;b3=aa(b9,b8)|0;b8=c[p+(cr*12|0)+8>>2]|0;cr=b3-(aa(b8,bV)|0)|0;bV=aa(b8,b5)|0;b5=bV-(aa(b9,cp)|0)|0;if((bU|0)<0){de=-b5|0;df=-cr|0;dg=-bU|0}else{de=b5;df=cr;dg=bU}bU=dg>>1;cr=df>>31;b5=((cr+bU^cr)+df|0)/(dg|0)|0;c[e+16+(cb<<3)>>2]=b5;cr=de>>31;cp=((cr+bU^cr)+de|0)/(dg|0)|0;c[e+16+(cb<<3)+4>>2]=cp;if(!((b5|0)>=(aA|0)&(b5|0)<(aB|0))){break L2357}cb=cb+1|0;if(!((cp|0)>=(aC|0)&(cp|0)<(aD|0))){break L2357}}while((cb|0)<4);cb=c[aE>>2]|0;cg=c[aF>>2]|0;ch=(c[af>>2]|0)+(c[ag>>2]|0)+(c[aG>>2]|0)+(c[aH>>2]|0)|0;do{if((ch|0)>4){cp=ch+16|0;dt(s,0,0,cp,0,0,cp,cp,cp,c[aI>>2]|0,c[aJ>>2]|0,c[aK>>2]|0,c[aL>>2]|0,c[aM>>2]|0,c[aN>>2]|0,cb,cg);cp=ch+10|0;if((dw(aO,s,cp,cp,4,f,g,h)|0)<=-1){dh=cg;di=cb;break}b5=c[aM>>2]|0;cr=c[aL>>2]|0;bU=aa(cr,b5)|0;b9=c[aN>>2]|0;bV=c[aK>>2]|0;b8=bU-(aa(bV,b9)|0)|0;bU=b5-bV|0;bV=b9-cr|0;cr=aa(b8,cp)|0;b9=ch+4|0;b5=c[aI>>2]|0;b3=aa(b5,bV)|0;cq=c[aJ>>2]|0;bz=aa(cq,bU)|0;co=(aa(b3-bz|0,b9)|0)+cr|0;cr=c[aO>>2]|0;cn=aa(cr,bV)|0;bV=c[aP>>2]|0;cc=aa(bV,bU)|0;cm=co+((cn-cc|0)*6|0)|0;co=cm>>31;cl=(cm|0)>-1?cm:-cm|0;cm=aa(b5,cp)|0;ck=ew(cn,(cn|0)<0?-1:0,cm,(cm|0)<0?-1:0)|0;cm=E;cj=aa(cr,b9)|0;cr=b8-bz|0;bz=ew(cj,(cj|0)<0?-1:0,cr,(cr|0)<0?-1:0)|0;cr=E;cj=b5*6|0;b5=b8-cc|0;cc=ew(b5,(b5|0)<0?-1:0,cj,(cj|0)<0?-1:0)|0;cj=E;b5=co;ci=(co|0)<0?-1:0;co=em(ck,cm,bz,cr)|0;cr=em(co,E,cc,cj)|0;cj=em(cr,E,b5,ci)|0;cr=E^ci;cc=cl>>1;co=cr>>>31|0<<1;bz=cc-co^-co;co=em(bz,(bz|0)<0?-1:0,cj^b5,cr)|0;cr=cl;cj=(cl|0)<0?-1:0;cl=eu(co,E,cr,cj)|0;co=aa(cq,cp)|0;cp=aa(bV,-bU|0)|0;bU=ew(cp,(cp|0)<0?-1:0,co,(co|0)<0?-1:0)|0;co=E;cp=aa(bV,b9)|0;b9=b8+b3|0;b3=ew(cp,(cp|0)<0?-1:0,b9,(b9|0)<0?-1:0)|0;b9=E;cp=cq*6|0;cq=cn+b8|0;b8=ew(cq,(cq|0)<0?-1:0,cp,(cp|0)<0?-1:0)|0;cp=em(b3,b9,b8,E)|0;b8=em(cp,E,bU,co)|0;co=em(b8,E,b5,ci)|0;b8=E^ci;ci=b8>>>31|0<<1;bU=cc-ci^-ci;ci=em(bU,(bU|0)<0?-1:0,co^b5,b8)|0;b8=eu(ci,E,cr,cj)|0;dh=b8;di=cl}else{dh=cg;di=cb}}while(0);cb=c[aI>>2]|0;cg=c[aJ>>2]|0;ch=c[aK>>2]|0;cl=c[aL>>2]|0;b8=c[aM>>2]|0;cj=c[aN>>2]|0;cr=ch-cb|0;ci=b8-cb|0;b5=di-cb|0;co=di-ch|0;ch=di-b8|0;b8=cl-cg|0;bU=cj-cg|0;cc=dh-cg|0;cp=dh-cl|0;cl=dh-cj|0;cj=aa(ch,b8)|0;b9=cj-(aa(cl,cr)|0)|0;cj=aa(ci,cp)|0;b3=cj-(aa(bU,co)|0)|0;cj=aa(ch,cp)|0;cp=cj-(aa(cl,co)|0)|0;co=(cr|0)>-1?cr:-cr|0;cl=(b8|0)>-1?b8:-b8|0;cj=dI(co-((cl|0)>(co|0)?co-cl|0:0)|0)|0;ch=b9+cp|0;cq=(dI((ch|0)>-1?ch:-ch|0)|0)+cj|0;cj=(ci|0)>-1?ci:-ci|0;cn=(bU|0)>-1?bU:-bU|0;bV=dI(cj-((cn|0)>(cj|0)?cj-cn|0:0)|0)|0;bz=b3+cp|0;cm=(dI((bz|0)>-1?bz:-bz|0)|0)+bV|0;bV=(b9|0)>-1?b9:-b9|0;ck=(b3|0)>-1?b3:-b3|0;cf=bV-((ck|0)>(bV|0)?bV-ck|0:0)|0;ck=(cp|0)>-1?cp:-cp|0;bV=dI(cf-((ck|0)>(cf|0)?cf-ck|0:0)|0)|0;cf=cq-((cm|0)>(cq|0)?cq-cm|0:0)|0;cm=cf-((bV|0)>(cf|0)?cf-bV|0:0)-16|0;bV=(cm|0)>0?cm:0;cm=1<<bV;cf=cm>>1;cq=ch;ce=(ch|0)<0?-1:0;ch=ew(cq,ce,cr,(cr|0)<0?-1:0)|0;cr=cf;cd=(cf|0)<0?-1:0;bK=em(cr,cd,ch,E)|0;ch=bV;b0=eq(bK|0,E|0,ch|0)|0;bK=E;c[aQ>>2]=b0;b0=bz;bK=(bz|0)<0?-1:0;bz=ew(b0,bK,ci,(ci|0)<0?-1:0)|0;ci=em(cr,cd,bz,E)|0;bz=eq(ci|0,E|0,ch|0)|0;ci=E;c[aR>>2]=bz;c[aS>>2]=cb;cb=ew(cq,ce,b8,(b8|0)<0?-1:0)|0;b8=em(cr,cd,cb,E)|0;cb=eq(b8|0,E|0,ch|0)|0;b8=E;c[aT>>2]=cb;cb=ew(b0,bK,bU,(bU|0)<0?-1:0)|0;bU=em(cr,cd,cb,E)|0;cb=eq(bU|0,E|0,ch|0)|0;ch=E;c[aU>>2]=cb;c[aV>>2]=cg;c[aW>>2]=cf+b9>>bV;c[aX>>2]=cf+b3>>bV;if((bV|0)>14){dj=(cm>>15)+cp>>bV-14}else{dj=cp<<14-bV}c[aY>>2]=dj;cm=co-((cj|0)>(co|0)?co-cj|0:0)|0;cj=(b5|0)>-1?b5:-b5|0;b5=dI(cm-((cj|0)>(cm|0)?cm-cj|0:0)|0)|0;cj=c[aQ>>2]|0;cm=(cj|0)>-1?cj:-cj|0;cj=c[aT>>2]|0;co=(cj|0)>-1?cj:-cj|0;cj=(dI(cm-((co|0)>(cm|0)?cm-co|0:0)|0)|0)+b5|0;b5=cl-((cn|0)>(cl|0)?cl-cn|0:0)|0;cn=(cc|0)>-1?cc:-cc|0;cc=dI(b5-((cn|0)>(b5|0)?b5-cn|0:0)|0)|0;cn=c[aR>>2]|0;b5=(cn|0)>-1?cn:-cn|0;cn=c[aU>>2]|0;cl=(cn|0)>-1?cn:-cn|0;cn=(dI(b5-((cl|0)>(b5|0)?b5-cl|0:0)|0)|0)+cc|0;cc=-29-bV+cj+(dI(ck)|0)+((cn|0)>(cj|0)?cn-cj|0:0)|0;cj=(cc|0)>0?cc:0;cc=1<<cj>>1;cn=cf<<cj;cf=c[aU>>2]|0;ck=cf;cl=(cf|0)<0?-1:0;cf=cp;b5=(cp|0)<0?-1:0;cp=ew(ck,cl,cf,b5)|0;co=cn;cm=(cn|0)<0?-1:0;cn=em(co,cm,cp,E)|0;cp=cj+bV|0;bV=eq(cn|0,E|0,cp|0)|0;cn=E;cn=bV;c[aZ>>2]=cn;bV=c[aR>>2]|0;b3=-bV|0;b9=ew(b3,(b3|0)<0?-1:0,cf,b5)|0;b3=em(co,cm,b9,E)|0;b9=eq(b3|0,E|0,cp|0)|0;b3=E;b3=b9;c[a_>>2]=b3;b9=c[aT>>2]|0;cg=-b9|0;cb=ew(cg,(cg|0)<0?-1:0,cf,b5)|0;cg=em(co,cm,cb,E)|0;cb=eq(cg|0,E|0,cp|0)|0;cg=E;cg=cb;c[a$>>2]=cg;cb=c[aQ>>2]|0;ch=cb;bU=(cb|0)<0?-1:0;cb=ew(ch,bU,cf,b5)|0;b5=em(co,cm,cb,E)|0;cb=eq(b5|0,E|0,cp|0)|0;cp=E;cp=cb;c[a0>>2]=cp;cb=b9;b5=(b9|0)<0?-1:0;b9=c[aX>>2]|0;cm=b9;co=(b9|0)<0?-1:0;b9=ew(cm,co,cb,b5)|0;cf=E;cd=c[aW>>2]|0;cr=cd;bK=(cd|0)<0?-1:0;cd=ew(cr,bK,ck,cl)|0;b0=E;b8=cc;ce=(cc|0)<0?-1:0;cc=en(b9,cf,b8,ce)|0;cf=en(cc,E,cd,b0)|0;b0=cj;cj=eq(cf|0,E|0,b0|0)|0;cf=E;cf=cj;c[a1>>2]=cf;cj=bV;cd=(bV|0)<0?-1:0;bV=ew(cr,bK,cj,cd)|0;bK=E;cr=ew(cm,co,ch,bU)|0;co=em(b8,ce,cr,E)|0;cr=en(bV,bK,co,E)|0;co=eq(cr|0,E|0,b0|0)|0;cr=E;cr=co;c[a2>>2]=cr;co=ew(ch,bU,ck,cl)|0;cl=E;ck=ew(cb,b5,cj,cd)|0;cd=en(co,cl,ck,E)|0;ck=en(cd,E,b8,ce)|0;ce=eq(ck|0,E|0,b0|0)|0;b0=E;b0=ce;c[a3>>2]=b0;c[a4>>2]=14;ce=c[H>>2]|0;ck=c[aS>>2]|0;b8=(c[ce>>2]|0)-ck|0;cd=c[aV>>2]|0;cl=(c[ce+4>>2]|0)-cd|0;ce=aa(cn,b8)|0;co=(aa(b3,cl)|0)+ce|0;ce=aa(cg,b8)|0;cj=(aa(cp,cl)|0)+ce|0;ce=aa(cf,b8)|0;b8=(aa(cr,cl)|0)+ce+b0+8192>>14;if((b8|0)==0){ce=(co>>>31)+2147483647|0;c[ad>>2]=ce;dk=(cj>>>31)+2147483647|0;dl=ce}else{if((b8|0)<0){dm=-b8|0;du=-cj|0;dx=-co|0}else{dm=b8;du=cj;dx=co}co=dm>>1;cj=dx>>31;b8=((co+cj^cj)+dx|0)/(dm|0)|0;c[ad>>2]=b8;cj=du>>31;dk=((co+cj^cj)+du|0)/(dm|0)|0;dl=b8}c[ae>>2]=dk;b8=c[M>>2]|0;cj=(c[b8>>2]|0)-ck|0;co=(c[b8+4>>2]|0)-cd|0;b8=aa(cn,cj)|0;ce=(aa(b3,co)|0)+b8|0;b8=aa(cg,cj)|0;cl=(aa(cp,co)|0)+b8|0;b8=aa(cf,cj)|0;cj=(aa(cr,co)|0)+b8+b0+8192>>14;if((cj|0)==0){c[Y>>2]=(ce>>>31)+2147483647;dC=(cl>>>31)+2147483647|0}else{if((cj|0)<0){dD=-cj|0;dF=-cl|0;dG=-ce|0}else{dD=cj;dF=cl;dG=ce}ce=dD>>1;cl=dG>>31;c[Y>>2]=((ce+cl^cl)+dG|0)/(dD|0)|0;cl=dF>>31;dC=((ce+cl^cl)+dF|0)/(dD|0)|0}c[Z>>2]=dC;cl=c[I>>2]|0;ce=(c[cl>>2]|0)-ck|0;ck=(c[cl+4>>2]|0)-cd|0;cd=aa(cn,ce)|0;cn=(aa(b3,ck)|0)+cd|0;cd=aa(cg,ce)|0;cg=(aa(cp,ck)|0)+cd|0;cd=aa(cf,ce)|0;ce=(aa(cr,ck)|0)+cd+b0+8192>>14;if((ce|0)==0){c[_>>2]=(cn>>>31)+2147483647;dH=(cg>>>31)+2147483647|0}else{if((ce|0)<0){dJ=-ce|0;dK=-cg|0;dL=-cn|0}else{dJ=ce;dK=cg;dL=cn}cn=dJ>>1;cg=dL>>31;c[_>>2]=((cn+cg^cg)+dL|0)/(dJ|0)|0;cg=dK>>31;dH=((cn+cg^cg)+dK|0)/(dJ|0)|0}c[$>>2]=dH;dr(D,B);cg=(c[Y>>2]|0)-dl|0;if((dn(D,cg,cg)|0)<0){break}dr(F,B);cg=(c[$>>2]|0)-dk|0;if((dn(F,cg,cg)|0)<0){break}cg=c[ab>>2]|0;cn=c[ac>>2]|0;do{if((cg|0)==(cn|0)&(cg|0)<7){dM=cg;dN=cg}else{ce=cg-cn|0;if((((ce|0)>-1?ce:-ce|0)|0)>3){break L2357}if((cg|0)>3){ce=dp(D,B,f,g,h,0)|0;b0=ce-cg|0;dO=(((b0|0)>-1?b0:-b0|0)|0)>3?-1:ce}else{dO=-1}if((cn|0)>3){ce=dp(F,B,f,g,h,1)|0;b0=ce-cn|0;dP=(((b0|0)>-1?b0:-b0|0)|0)>3?-1:ce}else{dP=-1}ce=(dP|0)<0;if((dO|0)>-1){if(ce|(dP|0)==(dO|0)){dM=dO;dN=cn;break}else{break L2357}}else{if(ce){break L2357}else{dM=dP;dN=cn;break}}}}while(0);dr(C,B);cn=c[Y>>2]|0;ce=c[_>>2]|0;b0=c[$>>2]|0;if((dn(C,cn-ce|0,b0-(c[ae>>2]|0)|0)|0)<0){break}cd=(c[af>>2]|0)-cg|0;if((((cd|0)>-1?cd:-cd|0)|0)>1){break}cd=(c[ag>>2]|0)-dN|0;if((((cd|0)>-1?cd:-cd|0)|0)>1){break}c[aO>>2]=0;cd=c[a5>>2]|0;ck=(cd*5|0)+(c[ad>>2]|0)|0;cr=c[a6>>2]|0;cf=(cr*-3|0)+(c[ae>>2]|0)|0;cp=c[aQ>>2]|0;b3=aa(cp,ck)|0;cl=c[aR>>2]|0;cj=(aa(cl,cf)|0)+b3|0;b3=c[aT>>2]|0;b8=aa(b3,ck)|0;co=c[aU>>2]|0;b5=(aa(co,cf)|0)+b8|0;b8=c[aW>>2]|0;cb=aa(b8,ck)|0;ck=c[aX>>2]|0;bU=(aa(ck,cf)|0)+cb|0;cb=c[aY>>2]|0;cf=aa(cl,cr)|0;ch=aa(co,cr)|0;bK=aa(ck,cr)|0;cr=c[aS>>2]|0;bV=c[aV>>2]|0;cm=0;cc=0;b9=bU+cb|0;bU=b5;b5=cj;cj=0;while(1){if((cc|0)==6){dQ=cm;dR=cj}else{if((b9|0)==0){dS=(b5>>>31)+2147483647|0;dT=(bU>>>31)+2147483647|0}else{if((b9|0)<0){dU=-b9|0;dV=-bU|0;dW=-b5|0}else{dU=b9;dV=bU;dW=b5}cq=dU>>1;bz=dW>>31;ci=dV>>31;dS=cr+(((cq+bz^bz)+dW|0)/(dU|0)|0)|0;dT=bV+(((cq+ci^ci)+dV|0)/(dU|0)|0)|0}ci=dS>>2;cq=dT>>2;bz=(cq|0)>=(h|0)?a7:cq;cq=(ci|0)>=(g|0)?P:ci;dX=cm+1|0;dY=((a[f+((aa((bz|0)>0?bz:0,g)|0)+((cq|0)>0?cq:0))|0]|0)!=0)<<cm|cj;if((cc|0)>7){break}else{dQ=dX;dR=dY}}cm=dQ;cc=cc+1|0;b9=b9+bK|0;bU=bU+ch|0;b5=b5+cf|0;cj=dR}c[aO>>2]=dY;c[a8>>2]=0;cj=aa(cp,cd)|0;cf=aa(b3,cd)|0;ch=aa(b8,cd)|0;bK=dX;cm=cc;cg=b9;cq=bU;bz=b5;ci=0;L2531:while(1){bM=cm;b6=cg;b$=cq;ca=bz;while(1){dZ=bM-1|0;if((bM|0)<=0){break L2531}d_=ca-cj|0;d$=b$-cf|0;d0=b6-ch|0;if((dZ|0)==6){bM=6;b6=d0;b$=d$;ca=d_}else{break}}if((b6|0)==(ch|0)){d1=(d_>>>31)+2147483647|0;d2=(d$>>>31)+2147483647|0}else{if((d0|0)<0){d3=-d0|0;d5=-d$|0;d6=-d_|0}else{d3=d0;d5=d$;d6=d_}ca=d3>>1;b$=d6>>31;bM=d5>>31;d1=cr+(((ca+b$^b$)+d6|0)/(d3|0)|0)|0;d2=bV+(((ca+bM^bM)+d5|0)/(d3|0)|0)|0}bM=d1>>2;ca=d2>>2;b$=(ca|0)>=(h|0)?a7:ca;ca=(bM|0)>=(g|0)?P:bM;bM=((a[f+((aa((b$|0)>0?b$:0,g)|0)+((ca|0)>0?ca:0))|0]|0)!=0)<<bK|ci;c[a8>>2]=bM;bK=bK+1|0;cm=dZ;cg=d0;cq=d$;bz=d_;ci=bM}c[aP>>2]=0;bz=c[ar>>2]|0;cq=(bz*3|0)+cn|0;cg=((c[ao>>2]|0)*5|0)+(c[Z>>2]|0)|0;cm=aa(cq,cp)|0;bK=(aa(cg,cl)|0)+cm|0;cm=aa(cq,b3)|0;ch=(aa(cg,co)|0)+cm|0;cm=aa(cq,b8)|0;cq=cm+cb+(aa(cg,ck)|0)|0;cg=aa(bz,cp)|0;cm=aa(bz,b3)|0;cf=aa(bz,b8)|0;bz=bK;bK=ch;ch=cq;cq=0;cj=0;while(1){if((ch|0)==0){d7=(bz>>>31)+2147483647|0;d8=(bK>>>31)+2147483647|0}else{if((ch|0)<0){ed=-ch|0;ee=-bK|0;ef=-bz|0}else{ed=ch;ee=bK;ef=bz}b5=ed>>1;bU=ef>>31;b9=ee>>31;d7=cr+(((b5+bU^bU)+ef|0)/(ed|0)|0)|0;d8=bV+(((b5+b9^b9)+ee|0)/(ed|0)|0)|0}b9=d7>>2;b5=d8>>2;bU=(b5|0)>=(h|0)?a7:b5;b5=(b9|0)>=(g|0)?P:b9;eh=((a[f+((aa((bU|0)>0?bU:0,g)|0)+((b5|0)>0?b5:0))|0]|0)!=0)<<cq|cj;b5=cq+1|0;if((b5|0)<8){bz=bz-cg|0;bK=bK-cm|0;ch=ch-cf|0;cq=b5;cj=eh}else{break}}c[aP>>2]=eh;c[a9>>2]=0;cj=((c[as>>2]|0)*5|0)+ce|0;cq=c[av>>2]|0;cf=(cq*-3|0)+b0|0;ch=aa(cj,cp)|0;cm=(aa(cf,cl)|0)+ch|0;ch=aa(cj,b3)|0;bK=(aa(cf,co)|0)+ch|0;ch=aa(cj,b8)|0;cj=ch+cb+(aa(cf,ck)|0)|0;cf=aa(cq,cl)|0;ch=aa(cq,co)|0;cg=aa(cq,ck)|0;cq=cm;cm=bK;bK=cj;cj=8;bz=0;while(1){if((bK|0)==0){ei=(cq>>>31)+2147483647|0;el=(cm>>>31)+2147483647|0}else{if((bK|0)<0){eo=-bK|0;ep=-cm|0;er=-cq|0}else{eo=bK;ep=cm;er=cq}cn=eo>>1;b5=er>>31;bU=ep>>31;ei=cr+(((cn+b5^b5)+er|0)/(eo|0)|0)|0;el=bV+(((cn+bU^bU)+ep|0)/(eo|0)|0)|0}bU=ei>>2;cn=el>>2;b5=(cn|0)>=(h|0)?a7:cn;cn=(bU|0)>=(g|0)?P:bU;es=((a[f+((aa((b5|0)>0?b5:0,g)|0)+((cn|0)>0?cn:0))|0]|0)!=0)<<cj|bz;cn=cj+1|0;if((cn|0)<15){cq=cq+cf|0;cm=cm+ch|0;bK=bK+cg|0;cj=cn;bz=es}else{break}}c[a9>>2]=es;bz=2<<((ci|0)!=(es|0));cj=(dY|0)==(eh|0)?2:1;do{if((bz|0)>0){cg=0;bK=0;while(1){c[o>>2]=(c[w+(bK>>1<<2)>>2]|c[v+((bK&1)<<2)>>2])^21522;ch=d4(o)|0;cm=(c[o>>2]|0)>>>10;c[o>>2]=cm;cf=(ch|0)<0?4:ch;L2568:do{if((cg|0)>0){ch=0;while(1){cq=ch+1|0;if((c[l+(ch<<2)>>2]|0)==(cm|0)){break}if((cq|0)<(cg|0)){ch=cq}else{et=cq;cV=1911;break L2568}}cq=m+(ch<<2)|0;c[cq>>2]=(c[cq>>2]|0)+1;cq=n+(ch<<2)|0;if((cf|0)>=(c[cq>>2]|0)){ev=cg;break}c[cq>>2]=cf;ev=cg}else{et=0;cV=1911}}while(0);if((cV|0)==1911){cV=0;c[l+(et<<2)>>2]=cm;c[m+(et<<2)>>2]=1;c[n+(et<<2)>>2]=cf;ev=cg+1|0}cq=bK+cj|0;if((cq|0)<(bz|0)){cg=ev;bK=cq}else{break}}bK=c[x>>2]|0;if((ev|0)>1){cg=0;b6=1;cq=bK;while(1){if((cq|0)>3){if((c[n+(b6<<2)>>2]|0)<4){cV=1921}else{cV=1918}}else{cV=1918}do{if((cV|0)==1918){cV=0;bV=c[m+(b6<<2)>>2]|0;cr=c[m+(cg<<2)>>2]|0;if((bV|0)>(cr|0)){cV=1921;break}if((bV|0)!=(cr|0)){ex=cg;break}if((c[n+(b6<<2)>>2]|0)<(cq|0)){cV=1921}else{ex=cg}}}while(0);if((cV|0)==1921){cV=0;ex=b6}cf=b6+1|0;cm=c[n+(ex<<2)>>2]|0;if((cf|0)<(ev|0)){cg=ex;b6=cf;cq=cm}else{ey=ex;ez=cm;break}}}else{ey=0;ez=bK}if((ez|0)>=4){eA=-1;break}eA=c[l+(ey<<2)>>2]|0}else{eA=-1}}while(0);if((eA|0)<0){break}bz=c[H>>2]|0;cj=bz|0;ci=c[M>>2]|0;cq=ci|0;b6=c[I>>2]|0;cg=b6|0;cm=dM<<2;cf=cm+17|0;cr=(dM|0)/7|0;bV=cr+2|0;ck=cm+16|0;dt(t,0,0,ck,0,0,ck,ck,ck,c[bb>>2]|0,c[aJ>>2]|0,c[aK>>2]|0,c[aL>>2]|0,c[aM>>2]|0,c[aN>>2]|0,c[aE>>2]|0,c[aF>>2]|0);co=cr+1|0;c[bc>>2]=co;cl=d9(aa(co*52|0,co)|0)|0;c[bd>>2]=cl;cb=(dM|0)>6;if(cb){b8=1;b3=co;cp=cl;while(1){cl=cp+(b3*52|0)|0;c[y+(b8<<2)>>2]=cl;b0=b8+1|0;ce=c[bc>>2]|0;if((b0|0)<(ce|0)){b8=b0;b3=ce;cp=cl}else{eB=ce;break}}}else{eB=co}cp=cm+48>>5;b3=cp<<2;b8=eb(cf,b3)|0;c[be>>2]=b8;c[b8>>2]=c[b8>>2]|511;ce=b8+(cp<<2)|0;c[ce>>2]=c[ce>>2]|511;ce=b8+(cp<<1<<2)|0;c[ce>>2]=c[ce>>2]|511;ce=cp*3|0;cl=b8+(ce<<2)|0;c[cl>>2]=c[cl>>2]|511;cl=b8+(cp<<2<<2)|0;c[cl>>2]=c[cl>>2]|511;cl=cp*5|0;b0=b8+(cl<<2)|0;c[b0>>2]=c[b0>>2]|511;b0=cp*6|0;cn=b8+(b0<<2)|0;c[cn>>2]=c[cn>>2]|511;cn=cp*7|0;b5=b8+(cn<<2)|0;c[b5>>2]=c[b5>>2]|511;b5=b8+(cp<<3<<2)|0;c[b5>>2]=c[b5>>2]|511;b5=cm+9|0;bU=b5;while(1){b9=b8+(bU>>5<<2)|0;c[b9>>2]=1<<(bU&31)|c[b9>>2];b9=bU+1|0;if((b9|0)<(cf|0)){bU=b9}else{eC=b5;break}}do{bU=b8+((eC>>5)+cp<<2)|0;c[bU>>2]=1<<(eC&31)|c[bU>>2];eC=eC+1|0;}while((eC|0)<(cf|0));bU=cp<<1;b9=b5;while(1){cc=b8+((b9>>5)+bU<<2)|0;c[cc>>2]=1<<(b9&31)|c[cc>>2];cc=b9+1|0;if((cc|0)<(cf|0)){b9=cc}else{eD=b5;break}}while(1){b9=b8+((eD>>5)+ce<<2)|0;c[b9>>2]=1<<(eD&31)|c[b9>>2];b9=eD+1|0;if((b9|0)<(cf|0)){eD=b9}else{eE=b5;break}}while(1){b9=b8+((eE>>5)+b3<<2)|0;c[b9>>2]=1<<(eE&31)|c[b9>>2];b9=eE+1|0;if((b9|0)<(cf|0)){eE=b9}else{eF=b5;break}}while(1){b9=b8+((eF>>5)+cl<<2)|0;c[b9>>2]=1<<(eF&31)|c[b9>>2];b9=eF+1|0;if((b9|0)<(cf|0)){eF=b9}else{eG=b5;break}}while(1){b9=b8+((eG>>5)+b0<<2)|0;c[b9>>2]=1<<(eG&31)|c[b9>>2];b9=eG+1|0;if((b9|0)<(cf|0)){eG=b9}else{eH=b5;break}}do{b9=b8+((eH>>5)+cn<<2)|0;c[b9>>2]=1<<(eH&31)|c[b9>>2];eH=eH+1|0;}while((eH|0)<(cf|0));cn=cp<<3;b9=b5;while(1){cc=b8+((b9>>5)+cn<<2)|0;c[cc>>2]=1<<(b9&31)|c[cc>>2];cc=b9+1|0;if((cc|0)<(cf|0)){b9=cc}else{eI=b5;break}}do{b9=b8+((aa(eI,cp)|0)<<2)|0;c[b9>>2]=c[b9>>2]|511;eI=eI+1|0;}while((eI|0)<(cf|0));if(cb){b9=cm+6|0;cn=b9;while(1){cc=b8+(cn>>5<<2)|0;c[cc>>2]=1<<(cn&31)|c[cc>>2];cc=cn+1|0;if((cc|0)<(b5|0)){cn=cc}else{eJ=b9;break}}while(1){cn=b8+((eJ>>5)+cp<<2)|0;c[cn>>2]=1<<(eJ&31)|c[cn>>2];cn=eJ+1|0;if((cn|0)<(b5|0)){eJ=cn}else{eK=b9;break}}while(1){cn=b8+((eK>>5)+bU<<2)|0;c[cn>>2]=1<<(eK&31)|c[cn>>2];cn=eK+1|0;if((cn|0)<(b5|0)){eK=cn}else{eL=b9;break}}while(1){bU=b8+((eL>>5)+ce<<2)|0;c[bU>>2]=1<<(eL&31)|c[bU>>2];bU=eL+1|0;if((bU|0)<(b5|0)){eL=bU}else{eM=b9;break}}while(1){ce=b8+((eM>>5)+b3<<2)|0;c[ce>>2]=1<<(eM&31)|c[ce>>2];ce=eM+1|0;if((ce|0)<(b5|0)){eM=ce}else{eN=b9;break}}while(1){ce=b8+((eN>>5)+cl<<2)|0;c[ce>>2]=1<<(eN&31)|c[ce>>2];ce=eN+1|0;if((ce|0)<(b5|0)){eN=ce}else{eO=b9;break}}do{b9=b8+((aa(eO,cp)|0)<<2)|0;c[b9>>2]=c[b9>>2]|63;eO=eO+1|0;}while((eO|0)<(b5|0))}if((cm|0)>0){b9=9;while(1){cl=b8+((aa(b9,cp)|0)<<2)|0;c[cl>>2]=c[cl>>2]|64;cl=b9+1|0;if((cl|0)<(b5|0)){b9=cl}else{eP=9;break}}do{b9=b8+((eP>>5)+b0<<2)|0;c[b9>>2]=1<<(eP&31)|c[b9>>2];eP=eP+1|0;}while((eP|0)<(b5|0))}if((dM|0)<2){b5=c[bd>>2]|0;eg(b5|0,b|0,52)|0}else{b5=aa(bV<<3,bV)|0;b0=d9(b5)|0;b9=b0;cl=d9(b5)|0;b5=cl;c[bp>>2]=6;ce=cm+10|0;c[u+(co<<2)>>2]=ce;if(cb){bU=d[9952+(dM-7)|0]|0;cn=cr;cc=ce;while(1){ce=cc-bU|0;c[u+(cn<<2)>>2]=ce;if((cn|0)>1){cn=cn-1|0;cc=ce}else{break}}}c[b0>>2]=3;c[b0+4>>2]=3;c[cl>>2]=c[cj>>2];c[cl+4>>2]=c[bz+4>>2];cc=cm+13|0;c[b9+(co<<3)>>2]=cc;c[b9+(co<<3)+4>>2]=3;c[b5+(co<<3)>>2]=c[cq>>2];c[b5+(co<<3)+4>>2]=c[ci+4>>2];cn=aa(co,bV)|0;c[b9+(cn<<3)>>2]=3;c[b9+(cn<<3)+4>>2]=cc;c[b5+(cn<<3)>>2]=c[cg>>2];c[b5+(cn<<3)+4>>2]=c[b6+4>>2];cn=(bV<<1)-1|0;if((cn|0)>1){cc=1;do{bU=(cc|0)==(co|0)|0;cr=((co|0)<(cc|0)?co:cc)-bU|0;cb=cc-co|0;ce=((cb|0)>0?cb:0)+bU|0;if((ce|0)<=(cr|0)){bU=ce;while(1){cb=ce-bU+cr|0;cd=(aa(cb,bV)|0)+bU|0;bM=c[u+(bU<<2)>>2]|0;ca=c[u+(cb<<2)>>2]|0;c[b9+(cd<<3)>>2]=bM;c[b9+(cd<<3)+4>>2]=ca;b$=ca-2|0;cC=ca+2|0;cB=bM+2|0;cA=bM-2|0;while(1){cz=aa(cA,cp)|0;cy=b$;while(1){cx=b8+((cy>>5)+cz<<2)|0;c[cx>>2]=1<<(cy&31)|c[cx>>2];if((cy|0)<(cC|0)){cy=cy+1|0}else{break}}if((cA|0)<(cB|0)){cA=cA+1|0}else{break}}cA=(cb|0)>1;cB=(bU|0)>1;do{if(cA&cB){cC=c[y+(cb-2<<2)>>2]|0;b$=bU-1|0;ds(aO,cC+(b$*52|0)|0,bM,ca,0);cy=bU-2|0;ds(a8,cC+(cy*52|0)|0,bM,ca,0);cC=c[y+(cb-1<<2)>>2]|0;ds(bq,cC+(cy*52|0)|0,bM,ca,0);cy=c[aO>>2]|0;cz=c[a8>>2]|0;ch=(cz|0)<(cy|0)?cz:cy;cx=cz^cy^ch;cy=c[aP>>2]|0;cz=c[a9>>2]|0;cw=(cz|0)<(cy|0)?cz:cy;cv=cz^cy^cw;cy=c[bq>>2]|0;cz=(cy|0)<(cx|0)?cy:cx;c[bq>>2]=cy^cx^cz;cx=c[br>>2]|0;cy=(cx|0)<(cv|0)?cx:cv;c[br>>2]=cv^cx^cy;cx=(cz|0)<(ch|0)?cz:ch;c[aO>>2]=cx;cv=cz^ch^cx;c[a8>>2]=cv;cx=(cy|0)<(cw|0)?cy:cw;c[aP>>2]=cx;ch=cy^cw^cx;c[a9>>2]=ch;cx=cC+(b$*52|0)|0;b$=cd-bV|0;cC=b$-1|0;cw=cd-1|0;dt(cx,c[b9+(cC<<3)>>2]|0,c[b9+(cC<<3)+4>>2]|0,c[b9+(b$<<3)>>2]|0,c[b9+(b$<<3)+4>>2]|0,c[b9+(cw<<3)>>2]|0,c[b9+(cw<<3)+4>>2]|0,bM,ca,c[b5+(cC<<3)>>2]|0,c[b5+(cC<<3)+4>>2]|0,c[b5+(b$<<3)>>2]|0,c[b5+(b$<<3)+4>>2]|0,c[b5+(cw<<3)>>2]|0,c[b5+(cw<<3)+4>>2]|0,cv,ch);eQ=cx}else{if(cA&(bU|0)>0){eQ=(c[y+(cb-2<<2)>>2]|0)+((bU-1|0)*52|0)|0;break}if(!((cb|0)>0&cB)){eQ=t;break}eQ=(c[y+(cb-1<<2)>>2]|0)+((bU-2|0)*52|0)|0}}while(0);cB=b5+(cd<<3)|0;dw(cB,eQ,bM,ca,2,f,g,h)|0;if((cb|0)>0&(bU|0)>0){cA=cd-bV|0;cx=cA-1|0;ch=cd-1|0;dt((c[y+(cb-1<<2)>>2]|0)+((bU-1|0)*52|0)|0,c[b9+(cx<<3)>>2]|0,c[b9+(cx<<3)+4>>2]|0,c[b9+(cA<<3)>>2]|0,c[b9+(cA<<3)+4>>2]|0,c[b9+(ch<<3)>>2]|0,c[b9+(ch<<3)+4>>2]|0,bM,ca,c[b5+(cx<<3)>>2]|0,c[b5+(cx<<3)+4>>2]|0,c[b5+(cA<<3)>>2]|0,c[b5+(cA<<3)+4>>2]|0,c[b5+(ch<<3)>>2]|0,c[b5+(ch<<3)+4>>2]|0,c[cB>>2]|0,c[b5+(cd<<3)+4>>2]|0)}if((bU|0)<(cr|0)){bU=bU+1|0}else{break}}}cc=cc+1|0;}while((cc|0)<(cn|0))}ea(b0);ea(cl)}cn=(eB<<2)-4|0;eg(bf|0,bg|0,cn)|0;c[y+28+((c[bc>>2]|0)-1<<2)>>2]=cf;cn=c[bd>>2]|0;ds(bb,cn,-1,-1,1);cc=c[bc>>2]|0;b5=cc-1|0;b9=(cf<<1)-1|0;ds(aK,cn+(b5*52|0)|0,b9,-1,1);cn=c[y+(b5<<2)>>2]|0;ds(aM,cn,-1,b9,1);ds(aE,cn+(b5*52|0)|0,b9,b9,1);b9=c[bb>>2]|0;b5=(aB|0)<(b9|0)?aB:b9;c[bb>>2]=aA-((b5|0)>(aA|0)?aA-b5|0:0);b5=c[aJ>>2]|0;b9=(aD|0)<(b5|0)?aD:b5;c[aJ>>2]=aC-((b9|0)>(aC|0)?aC-b9|0:0);b9=c[aK>>2]|0;b5=(aB|0)<(b9|0)?aB:b9;c[aK>>2]=aA-((b5|0)>(aA|0)?aA-b5|0:0);b5=c[aL>>2]|0;b9=(aD|0)<(b5|0)?aD:b5;c[aL>>2]=aC-((b9|0)>(aC|0)?aC-b9|0:0);b9=c[aM>>2]|0;b5=(aB|0)<(b9|0)?aB:b9;c[aM>>2]=aA-((b5|0)>(aA|0)?aA-b5|0:0);b5=c[aN>>2]|0;b9=(aD|0)<(b5|0)?aD:b5;c[aN>>2]=aC-((b9|0)>(aC|0)?aC-b9|0:0);b9=c[aE>>2]|0;b5=(aB|0)<(b9|0)?aB:b9;c[aE>>2]=aA-((b5|0)>(aA|0)?aA-b5|0:0);b5=c[aF>>2]|0;b9=(aD|0)<(b5|0)?aD:b5;c[aF>>2]=aC-((b9|0)>(aC|0)?aC-b9|0:0);b9=aa(cf<<2,cp)|0;b5=d9(b9)|0;cn=b5;bV=eA&7;do{if((bV|0)==6){if((cf|0)<=0){break}b8=(cp|0)>0;co=0;do{b6=co<<1;cg=co*3|0;ci=co<<2;cq=co*5|0;cm=(((b6|0)%3|0)+b6<<2&4|((co|0)%3|0)+co<<1&2|((cg|0)%3|0)+cg<<3&8|((ci|0)%3|0)+ci<<4&16|((cq|0)%3|0)+cq<<5&32)^63;cq=cm<<6|cm;if(b8){cm=aa(co,cp)|0;ci=0;cg=cq<<12|cq|cq<<24;while(1){c[cn+(ci+cm<<2)>>2]=cg;cq=ci+1|0;if((cq|0)<(cp|0)){ci=cq;cg=cg>>>2|cg<<4}else{break}}}co=co+1|0;}while((co|0)<(cf|0))}else if((bV|0)==5){if((cf|0)<=0){break}co=(cp|0)>0;b8=0;do{cg=(((b8|0)%6|0|0)==0)<<1|(((b8<<1|0)%6|0|0)==0)<<2|(((b8*3|0|0)%6|0|0)==0)<<3|(((b8<<2|0)%6|0|0)==0)<<4|(((b8*5|0|0)%6|0|0)==0)<<5|1;ci=cg<<6|cg;if(co){cg=aa(b8,cp)|0;cm=0;cd=ci<<12|ci|ci<<24;while(1){c[cn+(cm+cg<<2)>>2]=cd;ci=cm+1|0;if((ci|0)<(cp|0)){cm=ci;cd=cd>>>2|cd<<4}else{break}}}b8=b8+1|0;}while((b8|0)<(cf|0))}else if((bV|0)==4){if((cf|0)>0){eR=0;eS=7}else{break}while(1){ej(cn+((aa(eR,cp)|0)<<2)|0,(-(eS&1)^204)&255|0,b3|0);b8=eR+1|0;if((b8|0)<(cf|0)){eR=b8;eS=eS>>>1|eS<<5}else{break}}}else if((bV|0)==3){if((cf|0)<=0){break}b8=(cp|0)>0;co=0;cd=1227133513;while(1){if(b8){cm=aa(co,cp)|0;cg=0;ci=cd;while(1){c[cn+(cg+cm<<2)>>2]=ci;ca=cg+1|0;if((ca|0)<(cp|0)){cg=ca;ci=ci>>>2|ci<<1}else{break}}}ci=co+1|0;if((ci|0)<(cf|0)){co=ci;cd=cd>>>1|cd<<2}else{break}}}else if((bV|0)==2){if((cf|0)>0){eT=0;eU=255}else{break}while(1){ej(cn+((aa(eT,cp)|0)<<2)|0,eU&255|0,b3|0);cd=eT+1|0;if((cd|0)<(cf|0)){eT=cd;eU=eU<<8|eU>>>16}else{break}}}else if((bV|0)==0){if((cf|0)>0){eV=0;eW=85}else{break}while(1){ej(cn+((aa(eV,cp)|0)<<2)|0,eW&255|0,b3|0);cd=eV+1|0;if((cd|0)<(cf|0)){eV=cd;eW=eW^255}else{break}}}else if((bV|0)==1){ej(b5|0,85,b9|0)}else{if((cf|0)<=0){break}cd=(cp|0)>0;co=0;while(1){b8=co+1|0;ci=(b8+((co|0)%3|0)<<1&2|co&1|((co<<1|0)%3|0)+co<<2&4|((co*3|0|0)%3|0)+b8<<3&8|((co<<2|0)%3|0)+co<<4&16|((co*5|0|0)%3|0)+b8<<5&32)^63;cg=ci<<6|ci;if(cd){ci=aa(co,cp)|0;cm=0;ca=cg<<12|cg|cg<<24;while(1){c[cn+(cm+ci<<2)>>2]=ca;cg=cm+1|0;if((cg|0)<(cp|0)){cm=cg;ca=ca>>>2|ca<<4}else{break}}}if((b8|0)<(cf|0)){co=b8}else{break}}}}while(0);if((cc|0)>0){b9=c[be>>2]|0;bV=0;b3=0;while(1){cl=c[y+28+(bV<<2)>>2]|0;b0=(b3|0)<(cl|0);co=0;cd=0;while(1){ca=c[y+28+(cd<<2)>>2]|0;cm=c[y+(cd<<2)>>2]|0;ci=b3-(c[cm+(bV*52|0)+44>>2]|0)|0;cg=co-(c[cm+(bV*52|0)+48>>2]|0)|0;if(b0){bM=c[cm+(bV*52|0)+28>>2]|0;cb=c[cm+(bV*52|0)+24>>2]|0;cq=c[cm+(bV*52|0)+16>>2]|0;b6=c[cm+(bV*52|0)+12>>2]|0;bz=c[cm+(bV*52|0)+4>>2]|0;cj=c[cm+(bV*52|0)>>2]|0;bU=aa(bM,cg)|0;cr=aa(cb,ci)|0;ce=aa(cq,cg)|0;bK=aa(b6,ci)|0;cB=aa(bz,cg)|0;cg=aa(cj,ci)|0;ci=(co|0)<(ca|0);ch=cm+(bV*52|0)+36|0;cA=cm+(bV*52|0)+40|0;cx=cg+cB+(c[cm+(bV*52|0)+8>>2]|0)|0;cB=bK+ce+(c[cm+(bV*52|0)+20>>2]|0)|0;ce=cr+bU+(c[cm+(bV*52|0)+32>>2]|0)|0;cm=b3;while(1){L2736:do{if(ci){bU=aa(cm,cp)|0;cr=cx;bK=cB;cg=ce;cv=co;while(1){cw=(cv>>5)+bU|0;b$=cv&31;if((c[b9+(cw<<2)>>2]&1<<b$|0)==0){if((cg|0)==0){eX=(cr>>>31)+2147483647|0;eY=(bK>>>31)+2147483647|0}else{if((cg|0)<0){eZ=-cg|0;e_=-bK|0;e$=-cr|0}else{eZ=cg;e_=bK;e$=cr}cC=eZ>>1;cy=e$>>31;cz=e_>>31;eX=(c[ch>>2]|0)+(((cC+cy^cy)+e$|0)/(eZ|0)|0)|0;eY=(c[cA>>2]|0)+(((cC+cz^cz)+e_|0)/(eZ|0)|0)|0}cz=eX>>2;cC=eY>>2;cy=(cC|0)>=(h|0)?a7:cC;cC=(cz|0)>=(g|0)?P:cz;cz=((a[f+((aa((cy|0)>0?cy:0,g)|0)+((cC|0)>0?cC:0))|0]|0)!=0)<<b$;b$=cn+(cw<<2)|0;c[b$>>2]=cz^c[b$>>2]}b$=cv+1|0;if((b$|0)>=(ca|0)){break L2736}cr=cr+bz|0;bK=bK+cq|0;cg=cg+bM|0;cv=b$}}}while(0);cv=cm+1|0;if((cv|0)<(cl|0)){cx=cx+cj|0;cB=cB+b6|0;ce=ce+cb|0;cm=cv}else{break}}}cm=cd+1|0;if((cm|0)<(cc|0)){co=ca;cd=cm}else{break}}cd=bV+1|0;if((cd|0)<(cc|0)){bV=cd;b3=cl}else{break}}}b3=eA>>3^1;bV=dM-1|0;cc=a[9744+(bV<<2)+b3|0]|0;b9=cc&255;cd=d[9632+((d[9704+bV|0]|0)+b3)|0]|0;if((dM|0)==1){e0=26}else{bV=aa(dM<<4,dM+8|0)|0;co=((dM>>>0)/7|0)*5|0;e0=(bV+83+(dM>>>0<7?36:0)-(aa(co+10|0,co+8|0)|0)|0)>>>3}co=(e0>>>0)/(b9>>>0)|0;bV=(e0>>>0)%(b9>>>0)|0;b0=b9-bV|0;cm=d9(b9<<2)|0;cb=cm;ce=d9(e0)|0;c[cb>>2]=ce;if((cc&255)>1){b6=1;cB=ce;do{cB=cB+(((b6|0)>(b0|0))+co)|0;c[cb+(b6<<2)>>2]=cB;b6=b6+1|0;}while((b6|0)<(b9|0))}b6=co-cd|0;cB=c[be>>2]|0;cj=(bV|0)!=0?b0:0;if((ck|0)>0){cx=ck&28|1;bM=(cp|0)>0;cq=0;bz=0;cA=0;ch=0;ci=ck;while(1){b8=aa(ci,cp)|0;if(bM){cv=cq;cg=bz;bK=cA;cr=ch;bU=cx;b$=cp;while(1){cz=b$-1|0;cw=cz+b8|0;cC=c[cn+(cw<<2)>>2]|0;cy=c[cB+(cw<<2)>>2]|0;cu=cw-cp|0;cw=c[cn+(cu<<2)>>2]|0;b2=c[cB+(cu<<2)>>2]|0;cu=bU;e1=cr;bO=bK;b1=cg;b7=cv;L2770:while(1){bX=cu;e2=bO;bH=b1;bv=b7;while(1){bB=bX;e3=bH;e4=bv;while(1){e5=bB-1|0;if((bB|0)<=0){break L2770}bN=1<<e5;if((bN&cy|0)==0){e6=e3+1|0;e7=cC>>>(e5>>>0)&1|e4<<1}else{e6=e3;e7=e4}if((bN&b2|0)==0){e8=e6+1|0;e9=e7<<1|cw>>>(e5>>>0)&1}else{e8=e6;e9=e7}if((e8|0)>7){break}else{bB=e5;e3=e8;e4=e9}}fa=e8-8|0;bB=e2+1|0;bN=cb+(e2<<2)|0;bS=c[bN>>2]|0;c[bN>>2]=bS+1;a[bS]=e9>>>(fa>>>0)&255;if((bB|0)<(b9|0)){bX=e5;e2=bB;bH=fa;bv=e9}else{break}}bv=e1+1|0;cu=e5;e1=bv;bO=(bv|0)==(b6|0)?cj:0;b1=fa;b7=e9}if((cz|0)>0){cv=e4;cg=e3;bK=e2;cr=e1;bU=32;b$=cz}else{break}}b$=ci-2|0;bU=(b$|0)==6?ci-3|0:b$;b$=aa(bU,cp)|0;cr=e4;bK=e3;cg=e2;cv=e1;b8=0;while(1){cl=b8+b$|0;b7=cl-cp|0;b1=cf-(b8<<5)|0;bO=(b1|0)>32?32:b1;b1=c[cB+(b7<<2)>>2]|0;cu=c[cB+(cl<<2)>>2]|0;cw=c[cn+(b7<<2)>>2]|0;b7=c[cn+(cl<<2)>>2]|0;cl=cv;b2=cg;cC=bK;cy=cr;L2789:while(1){ca=bO;bv=b1;bH=cu;bX=cw;bB=b7;fb=b2;bS=cC;bN=cy;while(1){bE=ca;bD=bv;bJ=bH;bW=bX;bx=bB;fc=bS;fd=bN;while(1){fe=bE-1|0;if((bE|0)<=0){break L2789}if((bJ&1|0)==0){ff=fc+1|0;fg=bx&1|fd<<1}else{ff=fc;fg=fd}fh=bx>>>1;fi=bJ>>>1;if((bD&1|0)==0){fj=ff+1|0;fk=fg<<1|bW&1}else{fj=ff;fk=fg}fl=bW>>>1;fm=bD>>>1;if((fj|0)>7){break}else{bE=fe;bD=fm;bJ=fi;bW=fl;bx=fh;fc=fj;fd=fk}}fn=fj-8|0;bx=fb+1|0;bW=cb+(fb<<2)|0;bJ=c[bW>>2]|0;c[bW>>2]=bJ+1;a[bJ]=fk>>>(fn>>>0)&255;if((bx|0)<(b9|0)){ca=fe;bv=fm;bH=fi;bX=fl;bB=fh;fb=bx;bS=fn;bN=fk}else{break}}bN=cl+1|0;bO=fe;b1=fm;cu=fi;cw=fl;b7=fh;cl=bN;b2=(bN|0)==(b6|0)?cj:0;cC=fn;cy=fk}cy=b8+1|0;if((cy|0)<(cp|0)){cr=fd;bK=fc;cg=fb;cv=cl;b8=cy}else{fo=fd;fp=fc;fq=fb;fr=cl;fs=bU;break}}}else{bU=ci-2|0;fo=cq;fp=bz;fq=cA;fr=ch;fs=(bU|0)==6?ci-3|0:bU}bU=fs-2|0;if((bU|0)>0){cq=fo;bz=fp;cA=fq;ch=fr;ci=bU}else{break}}}ea(cB);ea(c[bd>>2]|0);ea(cm);ea(b5);L2807:do{if(cc<<24>>24==0){ft=0;cV=2053}else{ci=0;ch=0;cA=0;while(1){bz=((ci|0)>=(b0|0))+co|0;cq=ce+cA|0;if((dE(ba,0,cq,bz,cd,0,0)|0)<0){fu=-1;break L2807}cp=bz-cd|0;ek(ce+ch|0,cq|0,cp|0);cq=cp+ch|0;cp=ci+1|0;if((cp|0)<(b9|0)){ci=cp;ch=cq;cA=bz+cA|0}else{ft=cq;cV=2053;break}}}}while(0);if((cV|0)==2053){cV=0;c[bh>>2]=0;c[bi>>2]=0;a[bj]=0;b9=((dM|0)>9)+((dM|0)>26)|0;do{if((ft<<3|0)>3){cd=40+(b9<<2)|0;co=41+(b9<<2)|0;b0=42+(b9<<2)|0;cc=43+(b9<<2)|0;b5=0;cm=0;cB=0;cA=ft;L2815:while(1){ch=b5+4|0;do{if((cA|0)<3){if((cA<<3|0)<(ch|0)){fv=-1;break}if((ch|0)==0){cV=2187;break L2815}else{cV=2058}}else{cV=2058}}while(0);if((cV|0)==2058){cV=0;cl=d[ce+cm|0]<<b5+8;do{if((ch|0)>8){ci=d[ce+(cm+1)|0]<<b5|cl;if((ch|0)<=16){fw=ci;break}fw=(d[ce+(cm+2)|0]|0)>>>((8-b5|0)>>>0)|ci}else{fw=cl}}while(0);cl=fw>>>12&15;if((cl|0)==0){cV=2187;break}else{fv=cl}}cl=ch&7;ci=(ch>>3)+cm|0;cq=c[bi>>2]|0;if((cq|0)<(cB|0)){fx=cB;fy=cq;fz=c[bh>>2]|0}else{cq=cB<<1|1;bz=ec(c[bh>>2]|0,cq*12|0)|0;c[bh>>2]=bz;fx=cq;fy=c[bi>>2]|0;fz=bz}c[bi>>2]=fy+1;bz=fz+(fy*12|0)|0;c[bz>>2]=-1;do{if((fv|0)==1){cq=d[cd]|0;cp=16-cq|0;cj=cq+cl|0;b6=ft-ci|0;if((b6|0)<3){if((b6<<3|0)<(cj|0)){break L2815}if((cj|0)==0){fA=cl;fB=ci;fC=0}else{cV=2069}}else{cV=2069}if((cV|0)==2069){cV=0;b6=d[ce+ci|0]<<(cl|8);do{if((cj|0)>8){cb=d[ce+(ci+1)|0]<<cl|b6;if((cj|0)<=16){fD=cb;break}fD=(d[ce+(ci+2)|0]|0)>>>((8-cl|0)>>>0)|cb}else{fD=b6}}while(0);b6=(fD&65535)>>>(cp>>>0);if((b6|0)<0){break L2815}else{fA=cq+ch&7;fB=(cj>>>3)+ci|0;fC=b6}}b6=(fC|0)/3|0;cb=(fC|0)%3|0;if(((ft-fB<<3)-fA|0)<((cb<<2&4)+(b6*10|0)+(-(cb>>>1&1)&7)|0)){break L2815}c[bz>>2]=1;cn=d9(fC)|0;c[fz+(fy*12|0)+4>>2]=cn;c[fz+(fy*12|0)+8>>2]=fC;if((fC|0)>2){cf=fA;cx=fB;bM=cn;ck=b6;while(1){b6=ck-1|0;bV=cf+10|0;bU=ft-cx|0;if((bU|0)<3){if((bU<<3|0)<(bV|0)){break L2815}if((bV|0)==0){fE=cf;fF=cx;fG=0}else{cV=2078}}else{cV=2078}if((cV|0)==2078){cV=0;bU=d[ce+cx|0]<<cf+8;do{if((bV|0)>8){b8=d[ce+(cx+1)|0]<<cf|bU;if((bV|0)<=16){fH=b8;break}fH=(d[ce+(cx+2)|0]|0)>>>((8-cf|0)>>>0)|b8}else{fH=bU}}while(0);bU=fH>>>6&1023;if(bU>>>0>999){break L2815}else{fE=bV&7;fF=(bV>>3)+cx|0;fG=bU}}a[bM]=((fG>>>0)/100|0|48)&255;bU=(fG>>>0)%100|0;a[bM+1|0]=((bU>>>0)/10|0|48)&255;b8=bM+3|0;a[bM+2|0]=((bU>>>0)%10|0|48)&255;if((b6|0)>0){cf=fE;cx=fF;bM=b8;ck=b6}else{fI=fE;fJ=fF;fK=b8;break}}}else{fI=fA;fJ=fB;fK=cn}if((cb|0)>1){ck=fI+7|0;bM=ft-fJ|0;if((bM|0)<3){if((bM<<3|0)<(ck|0)){break L2815}if((ck|0)==0){fL=fI;fM=fJ;fN=0}else{cV=2087}}else{cV=2087}if((cV|0)==2087){cV=0;bM=d[ce+fJ|0]<<fI+8;do{if((ck|0)>8){cx=d[ce+(fJ+1)|0]<<fI|bM;if((ck|0)<=16){fO=cx;break}fO=(d[ce+(fJ+2)|0]|0)>>>((8-fI|0)>>>0)|cx}else{fO=bM}}while(0);bM=fO>>>9&127;if(bM>>>0>99){break L2815}else{fL=ck&7;fM=(ck>>3)+fJ|0;fN=bM}}a[fK]=((fN>>>0)/10|0|48)&255;a[fK+1|0]=((fN>>>0)%10|0|48)&255;fP=fM;fQ=fL;break}if((cb|0)==0){fP=fJ;fQ=fI;break}bM=fI+4|0;cn=ft-fJ|0;if((cn|0)<3){if((cn<<3|0)<(bM|0)){break L2815}if((bM|0)==0){fR=fI;fS=fJ;fT=0}else{cV=2096}}else{cV=2096}if((cV|0)==2096){cV=0;cn=d[ce+fJ|0]<<fI+8;do{if((bM|0)>8){cx=d[ce+(fJ+1)|0]<<fI|cn;if((bM|0)<=16){fU=cx;break}fU=(d[ce+(fJ+2)|0]|0)>>>((8-fI|0)>>>0)|cx}else{fU=cn}}while(0);cn=fU>>>12&15;if(cn>>>0>9){break L2815}else{fR=bM&7;fS=(bM>>3)+fJ|0;fT=cn}}a[fK]=(fT|48)&255;fP=fS;fQ=fR}else if((fv|0)==2){cn=d[co]|0;cb=16-cn|0;ck=cn+cl|0;cx=ft-ci|0;if((cx|0)<3){if((cx<<3|0)<(ck|0)){break L2815}if((ck|0)==0){fV=cl;fW=ci;fX=0}else{cV=2104}}else{cV=2104}if((cV|0)==2104){cV=0;cx=d[ce+ci|0]<<(cl|8);do{if((ck|0)>8){cf=d[ce+(ci+1)|0]<<cl|cx;if((ck|0)<=16){fY=cf;break}fY=(d[ce+(ci+2)|0]|0)>>>((8-cl|0)>>>0)|cf}else{fY=cx}}while(0);cx=(fY&65535)>>>(cb>>>0);if((cx|0)<0){break L2815}else{fV=cn+ch&7;fW=(ck>>>3)+ci|0;fX=cx}}cx=fX>>1;bM=fX&1;if(((ft-fW<<3)-fV|0)<((cx*11|0)+(-bM&6)|0)){break L2815}c[bz>>2]=2;cf=d9(fX)|0;c[fz+(fy*12|0)+4>>2]=cf;c[fz+(fy*12|0)+8>>2]=fX;if((cx|0)>0){cj=fV;cq=fW;cp=cf;b8=cx;while(1){cx=b8-1|0;bU=cj+11|0;cv=ft-cq|0;if((cv|0)<3){if((cv<<3|0)<(bU|0)){break L2815}if((bU|0)==0){fZ=cj;f_=cq;f$=0}else{cV=2113}}else{cV=2113}if((cV|0)==2113){cV=0;cv=d[ce+cq|0]<<cj+8;do{if((bU|0)>8){cg=d[ce+(cq+1)|0]<<cj|cv;if((bU|0)<=16){f0=cg;break}f0=(d[ce+(cq+2)|0]|0)>>>((8-cj|0)>>>0)|cg}else{f0=cv}}while(0);cv=f0>>>5&2047;if(cv>>>0>2024){break L2815}else{fZ=bU&7;f_=(bU>>3)+cq|0;f$=cv}}a[cp]=a[9904+((f$>>>0)/45|0)|0]|0;cv=cp+2|0;a[cp+1|0]=a[9904+((f$>>>0)%45|0)|0]|0;if((cx|0)>0){cj=fZ;cq=f_;cp=cv;b8=cx}else{f1=fZ;f2=f_;f3=cv;break}}}else{f1=fV;f2=fW;f3=cf}if((bM|0)==0){fP=f2;fQ=f1;break}b8=f1+6|0;cp=ft-f2|0;if((cp|0)<3){if((cp<<3|0)<(b8|0)){break L2815}if((b8|0)==0){f4=f1;f5=f2;f6=0}else{cV=2122}}else{cV=2122}if((cV|0)==2122){cV=0;cp=d[ce+f2|0]<<f1+8;do{if((b8|0)>8){cq=d[ce+(f2+1)|0]<<f1|cp;if((b8|0)<=16){f7=cq;break}f7=(d[ce+(f2+2)|0]|0)>>>((8-f1|0)>>>0)|cq}else{f7=cp}}while(0);cp=f7>>>10&63;if(cp>>>0>44){break L2815}else{f4=b8&7;f5=(b8>>3)+f2|0;f6=cp}}a[f3]=a[9904+f6|0]|0;fP=f5;fQ=f4}else if((fv|0)==3){c[bz>>2]=3;cp=cl|16;bM=ft-ci|0;if((bM|0)<3&(bM<<3|0)<(cp|0)){break L2815}bM=d[ce+(ci+1)|0]<<cl|d[ce+ci|0]<<(cl|8);cf=ci+2|0;if((cp|0)==16){f8=bM}else{f8=(d[ce+cf|0]|0)>>>((8-cl|0)>>>0)|bM}bM=f8>>>12&15;cp=fz+(fy*12|0)+4|0;cq=cp;a[cp]=bM;a[bk]=bM;bM=(f8>>>8&15)+1&255;a[cq+1|0]=bM;a[bj]=bM;bM=f8&255;a[cq+2|0]=bM;a[bl]=bM;fP=cf;fQ=cl}else if((fv|0)==4){cf=d[b0]|0;bM=16-cf|0;cq=cf+cl|0;cp=ft-ci|0;if((cp|0)<3){if((cp<<3|0)<(cq|0)){break L2815}if((cq|0)==0){f9=cl;ga=ci;gb=0}else{cV=2135}}else{cV=2135}if((cV|0)==2135){cV=0;cp=d[ce+ci|0]<<(cl|8);do{if((cq|0)>8){cj=d[ce+(ci+1)|0]<<cl|cp;if((cq|0)<=16){gc=cj;break}gc=(d[ce+(ci+2)|0]|0)>>>((8-cl|0)>>>0)|cj}else{gc=cp}}while(0);cp=(gc&65535)>>>(bM>>>0);if((cp|0)<0){break L2815}else{f9=cf+ch&7;ga=(cq>>>3)+ci|0;gb=cp}}if(((ft-ga<<3)-f9|0)<(gb<<3|0)){break L2815}c[bz>>2]=4;cp=d9(gb)|0;c[fz+(fy*12|0)+4>>2]=cp;c[fz+(fy*12|0)+8>>2]=gb;if((gb|0)>0){gd=f9;ge=ga;gf=cp;gg=gb}else{fP=ga;fQ=f9;break}while(1){cp=gg-1|0;b8=gd+8|0;cj=ft-ge|0;do{if((cj|0)<3){if((cj<<3|0)<(b8|0)){gh=-1;gi=(b8>>3)+ge|0;gj=b8&7;break}else{if((b8|0)==0){gh=0;gi=ge;gj=gd;break}else{cV=2145;break}}}else{cV=2145}}while(0);if((cV|0)==2145){cV=0;cj=d[ce+ge|0]<<b8;cx=cj>>>8&255;do{if((gd|0)>0){bU=d[ce+(ge+1)|0]<<gd|cj;if((b8|0)<=16){gk=bU>>>8&255;break}gk=((d[ce+(ge+2)|0]|0)>>>((8-gd|0)>>>0)|bU)>>>8&255}else{gk=cx}}while(0);gh=gk;gi=(b8>>3)+ge|0;gj=b8&7}a[gf]=gh;if((cp|0)>0){gd=gj;ge=gi;gf=gf+1|0;gg=cp}else{fP=gi;fQ=gj;break}}}else if((fv|0)==5){c[bz>>2]=5;fP=ci;fQ=cl}else if((fv|0)==7){cq=cl|8;cf=ft-ci|0;if((cf|0)<3&(cf<<3|0)<(cq|0)){break L2815}cf=d[ce+ci|0]<<cq;bM=(cq|0)==8;cx=ci+1|0;if(bM){gl=cf}else{gl=d[ce+cx|0]<<cl|cf}cf=gl>>>8;do{if((cf&128|0)==0){gm=cf&255;gn=cx}else{if((cf&64|0)==0){cj=ft-cx|0;if((cj|0)<3&(cj<<3|0)<(cq|0)){break L2815}cj=d[ce+cx|0]<<cq;bU=ci+2|0;if(bM){go=cj}else{go=d[ce+bU|0]<<cl|cj}gm=go>>>8&255;gn=bU;break}if((cf&32|0)!=0){break L2815}bU=cl|16;cj=ft-cx|0;if((cj|0)<3&(cj<<3|0)<(bU|0)){break L2815}cj=d[ce+(ci+2)|0]<<cl|d[ce+cx|0]<<cq;ck=ci+3|0;if((bU|0)==16){gp=cj}else{gp=(d[ce+ck|0]|0)>>>((8-cl|0)>>>0)|cj}gm=gp&65535;gn=ck}}while(0);c[bz>>2]=7;c[fz+(fy*12|0)+4>>2]=gm;fP=gn;fQ=cl}else if((fv|0)==8){cq=d[cc]|0;cx=16-cq|0;cf=cq+cl|0;bM=ft-ci|0;if((bM|0)<3){if((bM<<3|0)<(cf|0)){break L2815}if((cf|0)==0){gq=cl;gr=ci;gs=0}else{cV=2169}}else{cV=2169}if((cV|0)==2169){cV=0;bM=d[ce+ci|0]<<(cl|8);do{if((cf|0)>8){ck=d[ce+(ci+1)|0]<<cl|bM;if((cf|0)<=16){gt=ck;break}gt=(d[ce+(ci+2)|0]|0)>>>((8-cl|0)>>>0)|ck}else{gt=bM}}while(0);bM=(gt&65535)>>>(cx>>>0);if((bM|0)<0){break L2815}else{gq=cq+ch&7;gr=(cf>>>3)+ci|0;gs=bM}}if(((ft-gr<<3)-gq|0)<(gs*13|0|0)){break L2815}c[bz>>2]=8;bM=gs<<1;ck=d9(bM)|0;c[fz+(fy*12|0)+4>>2]=ck;c[fz+(fy*12|0)+8>>2]=bM;if((gs|0)>0){gu=gq;gv=gr;gw=ck;gx=gs}else{fP=gr;fQ=gq;break}while(1){ck=gx-1|0;bM=gu+13|0;cj=ft-gv|0;do{if((cj|0)<3){if((cj<<3|0)<(bM|0)){gy=-1;gz=(bM>>3)+gv|0;gA=bM&7;break}else{if((bM|0)==0){gy=0;gz=gv;gA=gu;break}else{cV=2179;break}}}else{cV=2179}}while(0);if((cV|0)==2179){cV=0;cj=d[ce+gv|0]<<gu+8;do{if((bM|0)>8){cp=d[ce+(gv+1)|0]<<gu|cj;if((bM|0)<=16){gB=cp;break}gB=(d[ce+(gv+2)|0]|0)>>>((8-gu|0)>>>0)|cp}else{gB=cj}}while(0);gy=gB>>>3&8191;gz=(bM>>3)+gv|0;gA=bM&7}cj=((gy>>>0)/192|0)<<8|((gy>>>0)%192|0);cp=cj+33088|0;if(cp>>>0>40959){b8=cj+49472|0;gC=b8>>>8&255;gD=b8&255}else{gC=cp>>>8&255;gD=cp&255}a[gw]=gC;a[gw+1|0]=gD;if((ck|0)>0){gu=gA;gv=gz;gw=gw+2|0;gx=ck}else{fP=gz;fQ=gA;break}}}else if((fv|0)==9){c[bz>>2]=9;fP=ci;fQ=cl}else{break L2815}}while(0);cl=ft-fP|0;if(((cl<<3)-fQ|0)>3){b5=fQ;cm=fP;cB=fx;cA=cl}else{cV=2187;break}}if((cV|0)==2187){cV=0;gE=c[bh>>2]|0;gF=(c[bi>>2]|0)*12|0;cV=2188;break}cA=c[bi>>2]|0;cB=c[bh>>2]|0;if((cA|0)>0){cm=0;b5=cB;cc=cA;while(1){cA=c[b5+(cm*12|0)>>2]|0;if((cA-1&cA|0)==0){ea(c[b5+(cm*12|0)+4>>2]|0);gG=c[bi>>2]|0;gH=c[bh>>2]|0}else{gG=cc;gH=b5}cA=cm+1|0;if((cA|0)<(gG|0)){cm=cA;b5=gH;cc=gG}else{gI=gH;break}}}else{gI=cB}ea(gI);gJ=-1}else{gE=0;gF=0;cV=2188}}while(0);if((cV|0)==2188){cV=0;a[bo]=0;c[bh>>2]=ec(gE,gF)|0;gJ=0}a[bm]=dM&255;a[bn]=b3&255;fu=gJ}ea(ce);if((fu|0)>=0){O=dM;cV=2209;break L2355}}}while(0);if((bu|0)<(N+2|0)){bu=bw}else{O=-1;cV=2208;break}}if((cV|0)==2208){i=k;return O|0}else if((cV|0)==2209){i=k;return O|0}return 0}function di(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=c[a>>2]|0;e=c[b>>2]|0;f=c[a+4>>2]|0;a=c[b+4>>2]|0;return(((d|0)>(e|0))-((d|0)<(e|0))<<1|(f|0)>(a|0))-((f|0)<(a|0))|0}function dj(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=c[b+12>>2]|0;e=c[a+12>>2]|0;f=c[a+4>>2]|0;g=c[b+4>>2]|0;h=c[a>>2]|0;a=c[b>>2]|0;return((((f|0)>(g|0))-((f|0)<(g|0))<<1)+(((d|0)>(e|0))-((d|0)<(e|0))<<2)|(h|0)>(a|0))-((h|0)<(a|0))|0}function dk(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;e=a+2832+(b*12|0)|0;f=a+2832+(b*12|0)+4|0;g=c[f>>2]|0;h=a+2832+(b*12|0)+8|0;b=c[h>>2]|0;if((g|0)<(b|0)){i=g;j=c[e>>2]|0}else{g=e|0;e=c[g>>2]|0;a=b<<1|1;c[h>>2]=a;h=ec(e,a*20|0)|0;c[g>>2]=h;i=c[f>>2]|0;j=h}c[f>>2]=i+1;f=j+(i*20|0)|0;i=d;c[f>>2]=c[i>>2];c[f+4>>2]=c[i+4>>2];c[f+8>>2]=c[i+8>>2];c[f+12>>2]=c[i+12>>2];c[f+16>>2]=c[i+16>>2];return 0}function dl(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,p=0,q=0,r=0,s=0,t=0,u=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,as=0,at=0,au=0,av=0,aw=0,ax=0,ay=0,az=0,aA=0,aB=0,aC=0;f=i;i=i+16|0;g=f|0;h=b+2836|0;j=c[h>>2]|0;if((j|0)<9){k=0;i=f;return k|0}l=b+2848|0;m=c[l>>2]|0;if((m|0)<9){k=0;i=f;return k|0}n=c[b+2832>>2]|0;p=c[b+2844>>2]|0;q=d9(j<<2)|0;r=d9(j>>>1<<3)|0;s=r;t=dm(s,q,n,j,0)|0;aF(p|0,m|0,20,6);j=d9(m<<2)|0;n=d9(m>>>1<<3)|0;u=n;w=dm(u,j,p,m,1)|0;if((t|0)>2&(w|0)>2){m=(t|0)>0;if(m){p=0;x=0;while(1){y=(c[s+(x<<3)+4>>2]|0)+p|0;z=x+1|0;if((z|0)<(t|0)){p=y;x=z}else{A=y;break}}}else{A=0}x=(w|0)>0;if(x){p=A;y=0;while(1){z=(c[u+(y<<3)+4>>2]|0)+p|0;B=y+1|0;if((B|0)<(w|0)){p=z;y=B}else{C=z;break}}}else{C=A}A=d9(C<<5)|0;C=d9(((w|0)<(t|0)?w:t)<<4)|0;y=C;p=d9(t<<2)|0;z=p;B=d9(w<<2)|0;D=B;E=eb(t,1)|0;F=eb(w,1)|0;if(m){m=0;G=0;H=A;while(1){do{if((a[E+m|0]|0)==0){I=s+(m<<3)|0;J=c[(c[I>>2]|0)+(c[s+(m<<3)+4>>2]>>1<<2)>>2]|0;if(!x){K=H;L=G;break}M=J|0;N=J+8|0;O=J+4|0;P=0;Q=0;R=0;while(1){S=F+P|0;do{if((a[S]|0)==0){T=u+(P<<3)|0;U=c[(c[T>>2]|0)+(c[u+(P<<3)+4>>2]>>1<<2)>>2]|0;V=c[M>>2]|0;W=c[U>>2]|0;if((V|0)>(W|0)){X=R;Y=Q;break}if((W|0)>=((c[N>>2]|0)+V|0)){X=R;Y=Q;break}V=c[U+4>>2]|0;W=c[O>>2]|0;if((V|0)>(W|0)){X=R;Y=Q;break}Z=c[U+8>>2]|0;if((W|0)>=(Z+V|0)){X=R;Y=Q;break}a[S]=1;W=(V<<1)+R+Z|0;Z=c[U+12>>2]|0;do{if((Z|0)>0){V=c[U+16>>2]|0;if((V|0)<=0){_=W;break}_=W-Z+V|0}else{_=W}}while(0);c[D+(Q<<2)>>2]=T;X=_;Y=Q+1|0}else{X=R;Y=Q}}while(0);S=P+1|0;if((S|0)<(w|0)){P=S;Q=Y;R=X}else{break}}if((Y|0)<=0){K=H;L=G;break}R=(c[M>>2]<<1)+(c[N>>2]|0)|0;Q=c[J+12>>2]|0;do{if((Q|0)>0){P=c[J+16>>2]|0;if((P|0)<=0){$=R;break}$=R-Q+P|0}else{$=R}}while(0);c[z>>2]=I;R=c[D+(Y>>1<<2)>>2]|0;Q=c[(c[R>>2]|0)+(c[R+4>>2]>>1<<2)>>2]|0;R=m+1|0;L3069:do{if((R|0)<(t|0)){J=Q|0;N=Q+4|0;M=Q+8|0;P=1;O=$;S=R;while(1){W=S;L3073:while(1){aa=E+W|0;do{if((a[aa]|0)==0){ab=s+(W<<3)|0;ac=c[(c[ab>>2]|0)+(c[s+(W<<3)+4>>2]>>1<<2)>>2]|0;ad=c[ac>>2]|0;Z=c[J>>2]|0;if((ad|0)>(Z|0)){break}ae=c[ac+8>>2]|0;if((Z|0)>=(ae+ad|0)){break}Z=c[N>>2]|0;U=c[ac+4>>2]|0;if((Z|0)>(U|0)){break}if((U|0)<((c[M>>2]|0)+Z|0)){break L3073}}}while(0);Z=W+1|0;if((Z|0)<(t|0)){W=Z}else{af=P;ag=O;break L3069}}a[aa]=1;T=(ad<<1)+O+ae|0;Z=c[ac+12>>2]|0;do{if((Z|0)>0){U=c[ac+16>>2]|0;if((U|0)<=0){ah=T;break}ah=T-Z+U|0}else{ah=T}}while(0);T=P+1|0;c[z+(P<<2)>>2]=ab;Z=W+1|0;if((Z|0)<(t|0)){P=T;O=ah;S=Z}else{af=T;ag=ah;break}}}else{af=1;ag=$}}while(0);R=G+1|0;c[y+(G<<4)>>2]=(af+ag|0)/(af<<1|0)|0;c[y+(G<<4)+4>>2]=(X+Y|0)/(Y<<1|0)|0;c[y+(G<<4)+8>>2]=H;if((af|0)>0){Q=0;I=0;while(1){S=c[z+(Q<<2)>>2]|0;O=S+4|0;if((c[O>>2]|0)>0){P=S|0;S=0;M=I;while(1){N=c[(c[P>>2]|0)+(S<<2)>>2]|0;J=N+12|0;if((c[J>>2]|0)>0){T=c[N>>2]|0;Z=H+(M<<4)|0;c[Z>>2]=T;c[H+(M<<4)+4>>2]=c[N+4>>2];c[Z>>2]=T-(c[J>>2]|0);ai=M+1|0}else{ai=M}J=N+16|0;if((c[J>>2]|0)>0){T=c[N>>2]|0;Z=H+(ai<<4)|0;c[Z>>2]=T;c[H+(ai<<4)+4>>2]=c[N+4>>2];c[Z>>2]=(c[N+8>>2]|0)+T+(c[J>>2]|0);aj=ai+1|0}else{aj=ai}J=S+1|0;if((J|0)<(c[O>>2]|0)){S=J;M=aj}else{ak=aj;break}}}else{ak=I}M=Q+1|0;if((M|0)<(af|0)){Q=M;I=ak}else{al=0;am=ak;break}}}else{al=0;am=0}while(1){I=c[D+(al<<2)>>2]|0;Q=I+4|0;if((c[Q>>2]|0)>0){M=I|0;I=0;S=am;while(1){O=c[(c[M>>2]|0)+(I<<2)>>2]|0;P=O+12|0;if((c[P>>2]|0)>0){c[H+(S<<4)>>2]=c[O>>2];J=c[O+4>>2]|0;T=H+(S<<4)+4|0;c[T>>2]=J;c[T>>2]=J-(c[P>>2]|0);an=S+1|0}else{an=S}P=O+16|0;if((c[P>>2]|0)>0){c[H+(an<<4)>>2]=c[O>>2];J=c[O+4>>2]|0;T=H+(an<<4)+4|0;c[T>>2]=J;c[T>>2]=(c[O+8>>2]|0)+J+(c[P>>2]|0);ao=an+1|0}else{ao=an}P=I+1|0;if((P|0)<(c[Q>>2]|0)){I=P;S=ao}else{ap=ao;break}}}else{ap=am}S=al+1|0;if((S|0)<(Y|0)){al=S;am=ap}else{break}}c[y+(G<<4)+12>>2]=ap;K=H+(ap<<4)|0;L=R}else{K=H;L=G}}while(0);S=m+1|0;if((S|0)<(t|0)){m=S;G=L;H=K}else{aq=L;break}}}else{aq=0}ea(F);ea(E);ea(B);ea(p);aF(C|0,aq|0,16,4);as=aq;at=y;au=A}else{as=0;at=0;au=0}ea(n);ea(j);ea(r);ea(q);if((c[2544]|0)>13){q=c[o>>2]|0;r=c[h>>2]|0;h=c[l>>2]|0;ar(q|0,6800,(v=i,i=i+32|0,c[v>>2]=9192,c[v+8>>2]=r,c[v+16>>2]=h,c[v+24>>2]=as,v)|0)|0}if((as|0)>2){h=e+4|0;r=e+8|0;q=d5(c[e+12>>2]|0,c[h>>2]|0,c[r>>2]|0)|0;l=g|0;c[l>>2]=0;j=g+8|0;c[j>>2]=0;n=g+4|0;c[n>>2]=0;dg(b,g,at,as,q,c[h>>2]|0,c[r>>2]|0);do{if((c[n>>2]|0)>0){r=dC(g,d,e)|0;h=c[l>>2]|0;if((c[n>>2]|0)>0){av=0;aw=h}else{ax=h;ay=r;break}while(1){h=aw+(av*48|0)+4|0;as=c[h>>2]|0;b=aw+(av*48|0)|0;A=c[b>>2]|0;if((as|0)>0){y=0;aq=A;C=as;while(1){as=c[aq+(y*12|0)>>2]|0;if((as-1&as|0)==0){ea(c[aq+(y*12|0)+4>>2]|0);az=c[h>>2]|0;aA=c[b>>2]|0}else{az=C;aA=aq}as=y+1|0;if((as|0)<(az|0)){y=as;aq=aA;C=az}else{aB=aA;break}}}else{aB=A}ea(aB);C=av+1|0;aq=c[l>>2]|0;if((C|0)<(c[n>>2]|0)){av=C;aw=aq}else{ax=aq;ay=r;break}}}else{ax=c[l>>2]|0;ay=0}}while(0);ea(ax);c[l>>2]=0;c[j>>2]=0;c[n>>2]=0;ea(q);aC=ay}else{aC=0}if((at|0)!=0){ea(at)}if((au|0)==0){k=aC;i=f;return k|0}ea(au);k=aC;i=f;return k|0}function dm(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0;h=eb(f,1)|0;i=f-1|0;if((i|0)<=0){j=0;ea(h);return j|0}k=e;l=1-g|0;m=0;n=0;o=d;while(1){do{if((a[h+m|0]|0)==0){d=e+(m*20|0)|0;c[o>>2]=d;p=m+1|0;if((p|0)<(f|0)){q=c[e+(m*20|0)+8>>2]|0;r=1;s=p;t=d}else{u=o;v=n;w=p;break}L3152:while(1){d=s;L3154:while(1){L3156:do{if((a[h+d|0]|0)==0){x=e+(d*20|0)|0;y=c[t+8>>2]|0;z=y+7>>2;A=(c[t+(l<<2)>>2]|0)-(c[e+(d*20|0)+(l<<2)>>2]|0)|0;if((((A|0)>-1?A:-A|0)|0)>(z|0)){B=q;C=r;break L3152}A=c[t+(g<<2)>>2]|0;D=c[e+(d*20|0)+(g<<2)>>2]|0;E=A-D|0;if((((E|0)>-1?E:-E|0)|0)>(z|0)){break}F=e+(d*20|0)+8|0;G=c[F>>2]|0;H=A+y-D-G|0;if((((H|0)>-1?H:-H|0)|0)>(z|0)){break}H=c[t+12>>2]|0;do{if((H|0)>0){I=c[e+(d*20|0)+12>>2]|0;if((I|0)<=0){break}J=E-H+I|0;if((((J|0)>-1?J:-J|0)|0)>(z|0)){break L3156}}}while(0);H=c[t+16>>2]|0;if((H|0)<=0){break L3154}E=c[e+(d*20|0)+16>>2]|0;if((E|0)<=0){break L3154}J=H-E+A+y-D-G|0;if((((J|0)>-1?J:-J|0)|0)<=(z|0)){break L3154}}}while(0);J=d+1|0;if((J|0)<(f|0)){d=J}else{B=q;C=r;break L3152}}J=r+1|0;c[o+(r<<2)>>2]=x;E=(c[F>>2]|0)+q|0;H=d+1|0;if((H|0)<(f|0)){q=E;r=J;s=H;t=x}else{B=E;C=J;break}}if((C|0)<3){u=o;v=n;w=p;break}if((C*20|0|0)<((C+(B<<1)|0)/(C<<1|0)|0|0)){u=o;v=n;w=p;break}c[b+(n<<3)>>2]=o;c[b+(n<<3)+4>>2]=C;if((C|0)>0){J=0;do{a[h+(((c[o+(J<<2)>>2]|0)-k|0)/20|0)|0]=1;J=J+1|0;}while((J|0)<(C|0))}u=o+(C<<2)|0;v=n+1|0;w=p}else{u=o;v=n;w=m+1|0}}while(0);if((w|0)<(i|0)){m=w;n=v;o=u}else{j=v;break}}ea(h);return j|0}function dn(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;e=i;i=i+40|0;f=e|0;g=e+8|0;h=e+24|0;j=f+4|0;c[j>>2]=0;k=f|0;c[k>>2]=0;l=0;do{m=c[a+32+(l<<2)>>2]|0;if((m|0)>0){n=c[a+16+(l<<2)>>2]|0;o=m>>2;p=m-o|0;if((o|0)<(p|0)){q=0;r=o;while(1){s=(c[n+(r<<4)+12>>2]|0)+q|0;t=r+1|0;if((t|0)<(p|0)){q=s;r=t}else{u=s;break}}}else{u=0}r=m-(o<<1)|0;q=u>>31;p=f+(l>>1<<2)|0;c[p>>2]=(c[p>>2]|0)+(((q+(r>>1)^q)+u|0)/(r|0)|0);c[g+(l<<2)>>2]=u;c[h+(l<<2)>>2]=r}else{c[g+(l<<2)>>2]=0;c[h+(l<<2)>>2]=0}l=l+1|0;}while((l|0)<4);do{if((c[a+32>>2]|0)>0){if((c[a+36>>2]|0)<=0){break}l=c[k>>2]|0;u=a+64|0;c[u>>2]=(c[u>>2]|0)-(l>>1);u=(aa(c[h>>2]|0,l)|0)>>1;f=g|0;c[f>>2]=(c[f>>2]|0)-u;u=(aa(c[h+4>>2]|0,l)|0)>>1;l=g+4|0;c[l>>2]=(c[l>>2]|0)-u}}while(0);do{if((c[a+40>>2]|0)>0){if((c[a+44>>2]|0)<=0){break}k=c[j>>2]|0;u=a+68|0;c[u>>2]=(c[u>>2]|0)-(k>>1);u=(aa(c[h+8>>2]|0,k)|0)>>1;l=g+8|0;c[l>>2]=(c[l>>2]|0)-u;u=(aa(c[h+12>>2]|0,k)|0)>>1;k=g+12|0;c[k>>2]=(c[k>>2]|0)-u}}while(0);j=(c[h+4>>2]|0)+(c[h>>2]|0)|0;if((j|0)<1){v=-1;i=e;return v|0}u=(((c[g+4>>2]|0)-(c[g>>2]|0)<<1)+(j*3|0)|0)/(j*6|0|0)|0;if((u|0)<1){v=-1;i=e;return v|0}j=(b-(u<<3)|0)/(u<<2|0)|0;if((j-1|0)>>>0>42){v=-1;i=e;return v|0}b=(c[h+12>>2]|0)+(c[h+8>>2]|0)|0;if((b|0)<1){v=-1;i=e;return v|0}h=(((c[g+12>>2]|0)-(c[g+8>>2]|0)<<1)+(b*3|0)|0)/(b*6|0|0)|0;if((h|0)<1){v=-1;i=e;return v|0}b=(d-(h<<3)|0)/(h<<2|0)|0;if((b-1|0)>>>0>42){v=-1;i=e;return v|0}d=j-b|0;if((((d|0)>-1?d:-d|0)|0)>3){v=-1;i=e;return v|0}c[a>>2]=u;c[a+4>>2]=h;c[a+8>>2]=j;c[a+12>>2]=b;v=0;i=e;return v|0}function dp(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0;j=i;i=i+8|0;k=j|0;l=c[b+(h<<2)>>2]|0;c[k+(h<<2)>>2]=(l*-7|0)+(c[b+64+(h<<2)>>2]|0);m=1-h|0;n=c[b+(m<<2)>>2]|0;c[k+(m<<2)>>2]=(n*-3|0)+(c[b+64+(m<<2)>>2]|0);b=c[k>>2]|0;o=aa(b,c[d>>2]|0)|0;p=c[k+4>>2]|0;k=(aa(p,c[d+4>>2]|0)|0)+o|0;o=aa(c[d+8>>2]|0,b)|0;q=(aa(c[d+12>>2]|0,p)|0)+o|0;o=aa(c[d+16>>2]|0,b)|0;b=(aa(c[d+20>>2]|0,p)|0)+o|0;o=b+(c[d+48>>2]|0)|0;b=aa(n,c[d+(m<<2)>>2]|0)|0;p=aa(c[d+8+(m<<2)>>2]|0,n)|0;r=aa(c[d+16+(m<<2)>>2]|0,n)|0;n=aa(l,c[d+(h<<2)>>2]|0)|0;m=aa(c[d+8+(h<<2)>>2]|0,l)|0;s=aa(c[d+16+(h<<2)>>2]|0,l)|0;l=g-1|0;h=f-1|0;t=d+56|0;u=d+60|0;d=0;v=o;o=q;q=k;k=0;w=0;while(1){x=d;y=0;z=w;A=q;B=o;C=v;while(1){if((C|0)==0){D=(A>>>31)+2147483647|0;E=(B>>>31)+2147483647|0}else{if((C|0)<0){F=-C|0;G=-B|0;H=-A|0}else{F=C;G=B;H=A}I=F>>1;J=H>>31;K=G>>31;D=(c[t>>2]|0)+(((I+J^J)+H|0)/(F|0)|0)|0;E=(c[u>>2]|0)+(((I+K^K)+G|0)/(F|0)|0)|0}K=D>>2;I=E>>2;J=(I|0)>=(g|0)?l:I;I=(K|0)>=(f|0)?h:K;L=((a[e+((aa((J|0)>0?J:0,f)|0)+((I|0)>0?I:0))|0]|0)!=0)<<z|x;I=y+1|0;if((I|0)<3){x=L;y=I;z=z+1|0;A=A+n|0;B=B+m|0;C=C+s|0}else{break}}C=k+1|0;if((C|0)<6){d=L;v=v+r|0;o=o+p|0;q=q+b|0;k=C;w=w+3|0}else{break}}w=L>>>12;do{if((L-28672|0)>>>0<139264){k=c[9992+(w-7<<2)>>2]|0;if((k|0)==(L|0)){M=L;break}b=k^L;q=0;while(1){p=b-1&b;N=q+1|0;if((q|0)>2|(p|0)==0){break}else{b=p;q=N}}if((N|0)<4){O=N;P=k;Q=2372}else{R=0;Q=2366}}else{R=0;Q=2366}}while(0);L3241:do{if((Q|0)==2366){while(1){Q=0;if((R+7|0)!=(w|0)){N=c[9992+(R<<2)>>2]|0;if((N|0)==(L|0)){M=L;break L3241}q=N^L;b=0;while(1){p=q-1&q;S=b+1|0;if((b|0)>2|(p|0)==0){break}else{q=p;b=S}}if((S|0)<4){O=S;P=N;Q=2372;break L3241}}b=R+1|0;if(b>>>0<34){R=b;Q=2366}else{T=-1;break}}i=j;return T|0}}while(0);do{if((Q|0)==2372){if((O|0)>-1){M=P;break}else{T=O}i=j;return T|0}}while(0);T=M>>>12;i=j;return T|0}function dq(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0;d=i;i=i+8|0;e=d|0;f=c[a+72>>2]|0;g=a+32|0;ej(g|0,0,16);h=f+12|0;j=c[h>>2]|0;if((j|0)>0){k=e|0;l=f+8|0;m=b+16|0;n=b+32|0;o=b+20|0;p=b+36|0;q=b+24|0;r=b+28|0;b=e+4|0;s=a+64|0;t=a+68|0;u=0;while(1){v=c[l>>2]|0;w=c[v+(u<<4)+4>>2]|0;x=(c[v+(u<<4)>>2]|0)-(c[n>>2]|0)|0;v=aa(x,c[m>>2]|0)|0;y=w-(c[p>>2]|0)|0;w=(aa(y,c[o>>2]|0)|0)+v|0;v=aa(x,c[q>>2]|0)|0;x=(aa(y,c[r>>2]|0)|0)+v|0;v=c[t>>2]|0;y=w-(c[s>>2]|0)|0;c[k>>2]=y;w=x-v|0;c[b>>2]=w;v=(((w|0)>-1?w:-w|0)|0)>(((y|0)>-1?y:-y|0)|0)|0;y=c[e+(v<<2)>>2]|0;w=(v<<1|y>>>31)^1;v=a+32+(w<<2)|0;c[v>>2]=(c[v>>2]|0)+1;c[(c[l>>2]|0)+(u<<4)+8>>2]=w;c[(c[l>>2]|0)+(u<<4)+12>>2]=y;y=u+1|0;w=c[h>>2]|0;if((y|0)<(w|0)){u=y}else{z=w;A=l;break}}}else{z=j;A=f+8|0}aF(c[A>>2]|0,z|0,16,2);z=c[A>>2]|0;c[a+16>>2]=z;A=c[g>>2]|0;c[a+20>>2]=z+(A<<4);g=A+(c[a+36>>2]|0)|0;c[a+24>>2]=z+(g<<4);c[a+28>>2]=z+(g+(c[a+40>>2]|0)<<4);i=d;return}function dr(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0;d=i;i=i+8|0;e=d|0;f=c[a+72>>2]|0;g=a+32|0;ej(g|0,0,16);h=f+12|0;j=c[h>>2]|0;if((j|0)<=0){k=j;l=f+8|0;m=c[l>>2]|0;n=m;aF(n|0,k|0,16,2);o=c[l>>2]|0;p=a+16|0;c[p>>2]=o;q=c[g>>2]|0;r=o+(q<<4)|0;s=a+20|0;c[s>>2]=r;t=a+36|0;u=c[t>>2]|0;v=q+u|0;w=o+(v<<4)|0;x=a+24|0;c[x>>2]=w;y=a+40|0;z=c[y>>2]|0;A=v+z|0;B=o+(A<<4)|0;C=a+28|0;c[C>>2]=B;i=d;return}j=e|0;D=f+8|0;f=b+56|0;E=b+60|0;F=b+24|0;G=b+28|0;H=b+32|0;I=b+36|0;J=b+40|0;K=b+44|0;L=b+52|0;M=b+64|0;b=e+4|0;N=a+64|0;O=a+68|0;P=0;while(1){Q=c[D>>2]|0;R=(c[Q+(P<<4)>>2]|0)-(c[f>>2]|0)|0;S=(c[Q+(P<<4)+4>>2]|0)-(c[E>>2]|0)|0;T=aa(c[F>>2]|0,R)|0;U=(aa(c[G>>2]|0,S)|0)+T|0;T=aa(c[H>>2]|0,R)|0;V=(aa(c[I>>2]|0,S)|0)+T|0;T=aa(c[J>>2]|0,R)|0;R=(aa(c[K>>2]|0,S)|0)+T|0;T=c[M>>2]|0;S=R+(c[L>>2]|0)+(1<<T-1)>>T;if((S|0)==0){T=(U>>>31)+2147483647|0;c[j>>2]=T;c[b>>2]=(V>>>31)+2147483647;c[Q+(P<<4)+8>>2]=4;c[(c[D>>2]|0)+(P<<4)+12>>2]=T}else{if((S|0)<0){W=-S|0;X=-V|0;Y=-U|0}else{W=S;X=V;Y=U}U=W>>1;V=Y>>31;S=X>>31;T=c[O>>2]|0;Q=(((U+V^V)+Y|0)/(W|0)|0)-(c[N>>2]|0)|0;c[j>>2]=Q;V=(((U+S^S)+X|0)/(W|0)|0)-T|0;c[b>>2]=V;T=(((V|0)>-1?V:-V|0)|0)>(((Q|0)>-1?Q:-Q|0)|0)|0;Q=c[e+(T<<2)>>2]|0;V=(T<<1|Q>>>31)^1;T=a+32+(V<<2)|0;c[T>>2]=(c[T>>2]|0)+1;c[(c[D>>2]|0)+(P<<4)+8>>2]=V;c[(c[D>>2]|0)+(P<<4)+12>>2]=Q}Q=P+1|0;V=c[h>>2]|0;if((Q|0)<(V|0)){P=Q}else{k=V;l=D;break}}m=c[l>>2]|0;n=m;aF(n|0,k|0,16,2);o=c[l>>2]|0;p=a+16|0;c[p>>2]=o;q=c[g>>2]|0;r=o+(q<<4)|0;s=a+20|0;c[s>>2]=r;t=a+36|0;u=c[t>>2]|0;v=q+u|0;w=o+(v<<4)|0;x=a+24|0;c[x>>2]=w;y=a+40|0;z=c[y>>2]|0;A=v+z|0;B=o+(A<<4)|0;C=a+28|0;c[C>>2]=B;i=d;return}function ds(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0;g=d-(c[b+44>>2]<<f)|0;d=e-(c[b+48>>2]<<f)|0;e=aa(c[b>>2]|0,g)|0;h=(aa(c[b+4>>2]|0,d)|0)+e|0;e=h+(c[b+8>>2]<<f)|0;h=aa(c[b+12>>2]|0,g)|0;i=(aa(c[b+16>>2]|0,d)|0)+h|0;h=i+(c[b+20>>2]<<f)|0;i=aa(c[b+24>>2]|0,g)|0;g=(aa(c[b+28>>2]|0,d)|0)+i|0;i=g+(c[b+32>>2]<<f)|0;if((i|0)==0){c[a>>2]=(e>>>31)+2147483647;c[a+4>>2]=(h>>>31)+2147483647;return}if((i|0)<0){j=-i|0;k=-h|0;l=-e|0}else{j=i;k=h;l=e}e=j>>1;h=l>>31;c[a>>2]=(c[b+36>>2]|0)+(((e+h^h)+l|0)/(j|0)|0);l=k>>31;c[a+4>>2]=(c[b+40>>2]|0)+(((e+l^l)+k|0)/(j|0)|0);return}function dt(a,b,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;j=j|0;k=k|0;l=l|0;m=m|0;n=n|0;o=o|0;p=p|0;q=q|0;r=r|0;var s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0,at=0,au=0,av=0,aw=0,ax=0,ay=0,az=0,aA=0,aB=0,aC=0,aD=0,aE=0,aF=0,aG=0,aH=0,aI=0,aJ=0,aK=0,aL=0,aM=0,aN=0,aO=0,aP=0,aQ=0,aR=0,aS=0,aT=0,aU=0,aV=0,aW=0,aX=0,aY=0,aZ=0,a_=0,a$=0,a0=0,a1=0,a2=0,a3=0,a4=0,a5=0,a6=0,a7=0,a8=0,a9=0,ba=0;s=e-b|0;t=g-b|0;u=i-b|0;v=i-e|0;e=i-g|0;g=f-d|0;i=h-d|0;w=j-d|0;x=j-f|0;f=j-h|0;h=aa(e,g)|0;j=aa(f,s)|0;y=h-j|0;z=aa(x,t)|0;A=aa(v,i)|0;B=z-A|0;if((h|0)==(j|0)&(z|0)==(A|0)){C=1}else{A=aa(x,e)|0;C=A-(aa(f,v)|0)|0}v=C+y|0;f=aa(v,s)|0;A=C+B|0;e=aa(A,t)|0;x=aa(v,g)|0;v=aa(A,i)|0;A=aa(v,C)|0;z=-C|0;j=aa(e,z)|0;h=aa(x,z)|0;z=aa(f,C)|0;C=aa(x,B)|0;D=aa(v,y)|0;F=C-D|0;G=aa(e,y)|0;y=aa(f,B)|0;B=G-y|0;H=aa(f,v)|0;v=H-(aa(e,x)|0)|0;if((A|0)==0){I=0}else{x=(A|0)>-1?A:-A|0;e=v>>31;H=A>>31;I=((((x>>1)+e^e)+v|0)/(x|0)|0)+H^H}if((j|0)==0){J=0}else{H=(j|0)>-1?j:-j|0;x=v>>31;e=j>>31;J=((((H>>1)+x^x)+v|0)/(H|0)|0)+e^e}if((h|0)==0){K=0}else{e=(h|0)>-1?h:-h|0;H=v>>31;x=h>>31;K=((((e>>1)+H^H)+v|0)/(e|0)|0)+x^x}if((z|0)==0){L=0}else{x=(z|0)>-1?z:-z|0;e=v>>31;H=z>>31;L=((((x>>1)+e^e)+v|0)/(x|0)|0)+H^H}if((C|0)==(D|0)){M=F}else{D=(F|0)>-1?F:-F|0;C=v>>31;H=F>>31;M=((((D>>1)+C^C)+v|0)/(D|0)|0)+H^H}if((G|0)==(y|0)){N=B}else{y=(B|0)>-1?B:-B|0;G=v>>31;H=B>>31;N=((((y>>1)+G^G)+v|0)/(y|0)|0)+H^H}H=m-k|0;y=o-k|0;v=q-k|0;G=q-m|0;m=q-o|0;o=n-l|0;q=p-l|0;B=r-l|0;D=r-n|0;n=r-p|0;p=aa(m,o)|0;r=p-(aa(n,H)|0)|0;p=aa(D,y)|0;C=p-(aa(G,q)|0)|0;p=aa(D,m)|0;m=p-(aa(n,G)|0)|0;G=(H|0)>-1?H:-H|0;n=(o|0)>-1?o:-o|0;p=dI(G-((n|0)>(G|0)?G-n|0:0)|0)|0;n=r+m|0;G=(dI((n|0)>-1?n:-n|0)|0)+p|0;p=(y|0)>-1?y:-y|0;D=(q|0)>-1?q:-q|0;F=dI(p-((D|0)>(p|0)?p-D|0:0)|0)|0;D=C+m|0;p=(dI((D|0)>-1?D:-D|0)|0)+F|0;F=(r|0)>-1?r:-r|0;x=(C|0)>-1?C:-C|0;e=F-((x|0)>(F|0)?F-x|0:0)|0;x=(m|0)>-1?m:-m|0;F=dI(e-((x|0)>(e|0)?e-x|0:0)|0)|0;x=G-((p|0)>(G|0)?G-p|0:0)|0;p=x-((F|0)>(x|0)?x-F|0:0)-27|0;F=(p|0)>0?p:0;p=1<<F>>1;x=n;G=(n|0)<0?-1:0;n=ew(x,G,H,(H|0)<0?-1:0)|0;e=p;z=(p|0)<0?-1:0;h=em(e,z,n,E)|0;n=F;j=eq(h|0,E|0,n|0)|0;h=E;h=j;j=D;A=(D|0)<0?-1:0;D=ew(j,A,y,(y|0)<0?-1:0)|0;f=em(e,z,D,E)|0;D=eq(f|0,E|0,n|0)|0;f=E;f=D;D=ew(x,G,o,(o|0)<0?-1:0)|0;G=em(e,z,D,E)|0;D=eq(G|0,E|0,n|0)|0;G=E;G=D;D=ew(j,A,q,(q|0)<0?-1:0)|0;A=em(e,z,D,E)|0;D=eq(A|0,E|0,n|0)|0;n=E;n=D;D=(I|0)!=0;if(D){A=h>>31;O=((A+(I>>1)^A)+h|0)/(I|0)|0}else{O=0}A=(K|0)!=0;if(A){z=f>>31;P=((z+(K>>1)^z)+f|0)/(K|0)|0}else{P=0}z=P+O|0;c[a>>2]=z;O=(J|0)!=0;if(O){P=h>>31;Q=((P+(J>>1)^P)+h|0)/(J|0)|0}else{Q=0}h=(L|0)!=0;if(h){P=f>>31;R=((P+(L>>1)^P)+f|0)/(L|0)|0}else{R=0}f=R+Q|0;c[a+4>>2]=f;if(D){Q=G>>31;S=((Q+(I>>1)^Q)+G|0)/(I|0)|0}else{S=0}if(A){Q=n>>31;T=((Q+(K>>1)^Q)+n|0)/(K|0)|0}else{T=0}Q=T+S|0;c[a+12>>2]=Q;if(O){S=G>>31;U=((S+(J>>1)^S)+G|0)/(J|0)|0}else{U=0}if(h){G=n>>31;V=((G+(L>>1)^G)+n|0)/(L|0)|0}else{V=0}n=V+U|0;c[a+16>>2]=n;if(D){D=r>>31;W=(((I>>1)+D^D)+r|0)/(I|0)|0}else{W=0}if(A){A=C>>31;X=(((K>>1)+A^A)+C|0)/(K|0)|0}else{X=0}if((M|0)==0){Y=0}else{K=m>>31;Y=(((M>>1)+K^K)+m|0)/(M|0)|0}M=W+p+X+Y>>F;c[a+24>>2]=M;if(O){O=r>>31;Z=(((J>>1)+O^O)+r|0)/(J|0)|0}else{Z=0}if(h){h=C>>31;_=(((L>>1)+h^h)+C|0)/(L|0)|0}else{_=0}if((N|0)==0){$=0;ab=Z+p|0;ac=ab+_|0;ad=ac+$|0;ae=ad>>F;af=a+28|0;c[af>>2]=ae;ag=p+m|0;ah=ag>>F;ai=a+32|0;c[ai>>2]=ah;aj=aa(z,s)|0;ak=aa(f,g)|0;al=aa(Q,s)|0;am=aa(n,g)|0;an=aa(M,s)|0;ao=aa(ae,g)|0;ap=an+ah|0;aq=ap+ao|0;ar=aa(aq,H)|0;as=aa(aq,o)|0;at=aa(z,t)|0;au=aa(f,i)|0;av=aa(Q,t)|0;aw=aa(n,i)|0;ax=aa(M,t)|0;ay=aa(ae,i)|0;az=ax+ah|0;aA=az+ay|0;aB=aa(aA,y)|0;aC=aa(aA,q)|0;aD=aa(z,u)|0;aE=aa(f,w)|0;aF=aa(Q,u)|0;aG=aa(n,w)|0;aH=aa(M,u)|0;aI=aa(ae,w)|0;aJ=aH+ah|0;aK=aJ+aI|0;aL=aa(aK,v)|0;aM=aa(aK,B)|0;aN=2-aj|0;aO=aN-at|0;aP=aO-aD|0;aQ=aP-ak|0;aR=aQ-au|0;aS=aR-aE|0;aT=aS+ar|0;aU=aT+aB|0;aV=aU+aL|0;aW=aV>>2;aX=a+8|0;c[aX>>2]=aW;aY=2-al|0;aZ=aY-av|0;a_=aZ-aF|0;a$=a_-am|0;a0=a$-aw|0;a1=a0-aG|0;a2=a1+as|0;a3=a2+aC|0;a4=a3+aM|0;a5=a4>>2;a6=a+20|0;c[a6>>2]=a5;a7=a+36|0;c[a7>>2]=k;a8=a+40|0;c[a8>>2]=l;a9=a+44|0;c[a9>>2]=b;ba=a+48|0;c[ba>>2]=d;return}L=m>>31;$=(((N>>1)+L^L)+m|0)/(N|0)|0;ab=Z+p|0;ac=ab+_|0;ad=ac+$|0;ae=ad>>F;af=a+28|0;c[af>>2]=ae;ag=p+m|0;ah=ag>>F;ai=a+32|0;c[ai>>2]=ah;aj=aa(z,s)|0;ak=aa(f,g)|0;al=aa(Q,s)|0;am=aa(n,g)|0;an=aa(M,s)|0;ao=aa(ae,g)|0;ap=an+ah|0;aq=ap+ao|0;ar=aa(aq,H)|0;as=aa(aq,o)|0;at=aa(z,t)|0;au=aa(f,i)|0;av=aa(Q,t)|0;aw=aa(n,i)|0;ax=aa(M,t)|0;ay=aa(ae,i)|0;az=ax+ah|0;aA=az+ay|0;aB=aa(aA,y)|0;aC=aa(aA,q)|0;aD=aa(z,u)|0;aE=aa(f,w)|0;aF=aa(Q,u)|0;aG=aa(n,w)|0;aH=aa(M,u)|0;aI=aa(ae,w)|0;aJ=aH+ah|0;aK=aJ+aI|0;aL=aa(aK,v)|0;aM=aa(aK,B)|0;aN=2-aj|0;aO=aN-at|0;aP=aO-aD|0;aQ=aP-ak|0;aR=aQ-au|0;aS=aR-aE|0;aT=aS+ar|0;aU=aT+aB|0;aV=aU+aL|0;aW=aV>>2;aX=a+8|0;c[aX>>2]=aW;aY=2-al|0;aZ=aY-av|0;a_=aZ-aF|0;a$=a_-am|0;a0=a$-aw|0;a1=a0-aG|0;a2=a1+as|0;a3=a2+aC|0;a4=a3+aM|0;a5=a4>>2;a6=a+20|0;c[a6>>2]=a5;a7=a+36|0;c[a7>>2]=k;a8=a+40|0;c[a8>>2]=l;a9=a+44|0;c[a9>>2]=b;ba=a+48|0;c[ba>>2]=d;return}function du(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;i=d-(c[b+96>>2]|0)|0;d=e-(c[b+100>>2]|0)|0;e=h-1|0;j=g-1|0;k=0;l=0;m=0;while(1){n=i+(c[b+(l*40|0)>>2]|0)>>2;o=d+(c[b+(l*40|0)+4>>2]|0)>>2;p=(o|0)>=(h|0)?e:o;o=(n|0)>=(g|0)?j:n;n=((a[f+((aa((p|0)>0?p:0,g)|0)+((o|0)>0?o:0))|0]|0)!=0)<<k|m;o=i+(c[b+(l*40|0)+8>>2]|0)>>2;p=d+(c[b+(l*40|0)+12>>2]|0)>>2;q=(p|0)>=(h|0)?e:p;p=(o|0)>=(g|0)?j:o;o=((a[f+((aa((q|0)>0?q:0,g)|0)+((p|0)>0?p:0))|0]|0)!=0)<<k+1|n;n=i+(c[b+(l*40|0)+16>>2]|0)>>2;p=d+(c[b+(l*40|0)+20>>2]|0)>>2;q=(p|0)>=(h|0)?e:p;p=(n|0)>=(g|0)?j:n;n=((a[f+((aa((q|0)>0?q:0,g)|0)+((p|0)>0?p:0))|0]|0)!=0)<<k+2|o;o=i+(c[b+(l*40|0)+24>>2]|0)>>2;p=d+(c[b+(l*40|0)+28>>2]|0)>>2;q=(p|0)>=(h|0)?e:p;p=(o|0)>=(g|0)?j:o;o=((a[f+((aa((q|0)>0?q:0,g)|0)+((p|0)>0?p:0))|0]|0)!=0)<<k+3|n;n=i+(c[b+(l*40|0)+32>>2]|0)>>2;p=d+(c[b+(l*40|0)+36>>2]|0)>>2;q=(p|0)>=(h|0)?e:p;p=(n|0)>=(g|0)?j:n;r=((a[f+((aa((q|0)>0?q:0,g)|0)+((p|0)>0?p:0))|0]|0)!=0)<<k+4|o;o=l+1|0;if((o|0)<5){k=k+5|0;l=o;m=r}else{break}}return r|0}function dv(b,d,e,f,g,h,j,k){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0;l=i;i=i+32|0;m=l|0;n=l+8|0;o=l+16|0;p=l+24|0;q=m|0;c[q>>2]=e;r=m+4|0;c[r>>2]=f;s=n|0;c[s>>2]=g;t=n+4|0;c[t>>2]=h;u=g-e|0;v=(u|0)>-1?u:-u|0;c[o>>2]=v;u=h-f|0;w=(u|0)>-1?u:-u|0;c[o+4>>2]=w;u=(w|0)>(v|0)|0;v=u^1;w=c[o+(v<<2)>>2]|0;c[p>>2]=(((e|0)<(g|0))<<1)-1;c[p+4>>2]=(((f|0)<(h|0))<<1)-1;f=m+(u<<2)|0;e=n+(u<<2)|0;x=c[e>>2]|0;y=p+(u<<2)|0;z=o+(u<<2)|0;u=p+(v<<2)|0;p=m+(v<<2)|0;m=0;while(1){o=c[f>>2]|0;if((o|0)==(x|0)){A=-1;B=2465;break}C=c[y>>2]|0;c[f>>2]=C+o;o=m+w|0;D=c[z>>2]|0;if((o<<1|0)>(D|0)){c[p>>2]=(c[p>>2]|0)+(c[u>>2]|0);E=o-D|0}else{E=o}F=c[r>>2]|0;o=aa(F,d)|0;G=c[q>>2]|0;if(((a[b+(o+G)|0]|0)==0|0)==(j|0)){m=E}else{break}}if((B|0)==2465){i=l;return A|0}B=c[f>>2]|0;f=n+(v<<2)|0;v=0;n=g;g=h;h=x;while(1){if((B|0)==(h|0)){H=n;I=g;break}c[e>>2]=h-C;x=v+w|0;if((x<<1|0)>(D|0)){c[f>>2]=(c[f>>2]|0)-(c[u>>2]|0);J=x-D|0}else{J=x}x=c[t>>2]|0;E=aa(x,d)|0;m=c[s>>2]|0;if(((a[b+(E+m)|0]|0)==0|0)!=(j|0)){H=m;I=x;break}v=J;n=m;g=x;h=c[e>>2]|0}c[k>>2]=(H+G<<2)+4>>1;c[k+4>>2]=(I+F<<2)+4>>1;A=0;i=l;return A|0}function dw(a,b,e,f,g,h,j,k){a=a|0;b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0,at=0,au=0,av=0,aw=0,ax=0,ay=0,az=0,aA=0,aB=0,aC=0,aD=0,aE=0,aF=0,aG=0,aH=0,aI=0,aJ=0,aK=0,aL=0,aM=0,aN=0,aO=0,aP=0,aQ=0,aR=0,aS=0,aT=0,aU=0,aV=0,aW=0,aX=0,aY=0,aZ=0,a_=0,a$=0;l=i;i=i+256|0;m=l|0;n=l+32|0;o=l+48|0;p=l+248|0;q=c[b+44>>2]|0;r=e-2-q|0;s=c[b+48>>2]|0;t=f-2-s|0;u=c[b>>2]|0;v=aa(u,r)|0;w=c[b+4>>2]|0;x=(aa(w,t)|0)+v|0;v=c[b+8>>2]|0;y=c[b+12>>2]|0;z=aa(y,r)|0;A=c[b+16>>2]|0;B=(aa(A,t)|0)+z|0;z=c[b+20>>2]|0;C=c[b+24>>2]|0;D=aa(C,r)|0;r=c[b+28>>2]|0;E=(aa(r,t)|0)+D|0;D=c[b+32>>2]|0;t=b+36|0;F=b+40|0;G=E+D|0;E=B+z|0;B=x+v|0;x=0;while(1){H=G;I=E;J=B;K=0;while(1){L=o+(x*40|0)+(K<<3)|0;if((H|0)==0){c[L>>2]=(J>>>31)+2147483647;c[o+(x*40|0)+(K<<3)+4>>2]=(I>>>31)+2147483647}else{if((H|0)<0){M=-H|0;N=-I|0;O=-J|0}else{M=H;N=I;O=J}P=M>>1;Q=O>>31;c[L>>2]=(c[t>>2]|0)+(((P+Q^Q)+O|0)/(M|0)|0);Q=N>>31;c[o+(x*40|0)+(K<<3)+4>>2]=(c[F>>2]|0)+(((P+Q^Q)+N|0)/(M|0)|0)}Q=K+1|0;if((Q|0)<5){H=H+C|0;I=I+y|0;J=J+u|0;K=Q}else{break}}K=x+1|0;if((K|0)<5){G=G+r|0;E=E+A|0;B=B+w|0;x=K}else{break}}x=c[o+96>>2]|0;B=c[o+100>>2]|0;E=o|0;G=du(E,x,B,h,j,k)|0;L3390:do{if((G|0)==33084991){R=B;S=x;T=0;U=33084991}else{M=G^33084991;N=0;while(1){O=M-1&M;V=N+1|0;if((N|0)>23|(O|0)==0){break}else{M=O;N=V}}if((N|0)<=-1){R=B;S=x;T=V;U=G;break}M=e-q|0;O=f-s|0;K=g<<2;if((K|0)>1){J=aa(r,O)|0;I=aa(C,M)|0;H=aa(A,O)|0;Q=aa(y,M)|0;P=aa(w,O)|0;O=w+u|0;L=A+y|0;W=r+C|0;X=p|0;Y=p+4|0;Z=J+I+D<<2;I=H+Q+z<<2;Q=P+(aa(u,M)|0)+v<<2;M=1;P=B;H=x;J=V;_=G;while(1){$=(M<<1)-1|0;ab=Q-O|0;ac=I-L|0;ad=Z-W|0;ae=$<<2;if(($|0)>0){af=$<<1;ag=$*3|0;ah=ad;ai=ac;aj=ab;ak=0;al=P;am=H;an=J;ao=_;while(1){if((ah|0)==0){ap=(aj>>>31)+2147483647|0;c[X>>2]=ap;aq=ap;ar=(ai>>>31)+2147483647|0}else{if((ah|0)<0){as=-ah|0;at=-ai|0;au=-aj|0}else{as=ah;at=ai;au=aj}ap=as>>1;av=au>>31;aw=(c[t>>2]|0)+(((ap+av^av)+au|0)/(as|0)|0)|0;c[X>>2]=aw;av=at>>31;aq=aw;ar=(c[F>>2]|0)+(((ap+av^av)+at|0)/(as|0)|0)|0}c[Y>>2]=ar;av=du(E,aq,ar,h,j,k)|0;if((an|0)<0|(av|0)==33084991){ax=0}else{ap=av^33084991;aw=0;while(1){ay=ap-1&ap;az=aw+1|0;if((aw|0)>=(an|0)|(ay|0)==0){ax=az;break}else{ap=ay;aw=az}}}aw=(ax|0)<(an|0);ap=aw?ar:al;az=aw?aq:am;ay=aw?ax:an;aA=aw?av:ao;if((ak|0)<(af|0)){aw=(ak|0)>=($|0)|0;aB=(c[b+(aw<<2)>>2]|0)+aj|0;aC=(c[b+12+(aw<<2)>>2]|0)+ai|0;aD=(c[b+24+(aw<<2)>>2]|0)+ah|0}else{aw=(ak|0)>=(ag|0)|0;aB=aj-(c[b+(aw<<2)>>2]|0)|0;aC=ai-(c[b+12+(aw<<2)>>2]|0)|0;aD=ah-(c[b+24+(aw<<2)>>2]|0)|0}aw=ak+1|0;if((ay|0)==0){R=ap;S=az;T=0;U=aA;break L3390}if((aw|0)<(ae|0)){ah=aD;ai=aC;aj=aB;ak=aw;al=ap;am=az;an=ay;ao=aA}else{aE=aD;aF=aC;aG=aB;aH=ap;aI=az;aJ=ay;aK=aA;break}}}else{aE=ad;aF=ac;aG=ab;aH=P;aI=H;aJ=J;aK=_}ao=M+1|0;if((aJ|0)==0){R=aH;S=aI;T=0;U=aK;break L3390}if((ao|0)<(K|0)){Z=aE;I=aF;Q=aG;M=ao;P=aH;H=aI;J=aJ;_=aK}else{aL=aH;aM=aI;aN=aJ;aO=aK;break}}}else{aL=B;aM=x;aN=V;aO=G}if((aN|0)<=6){R=aL;S=aM;T=aN;U=aO;break}c[a>>2]=x;c[a+4>>2]=B;aP=-1;i=l;return aP|0}}while(0);aO=S-x|0;x=R-B|0;ej(n|0,0,16);ej(m|0,0,32);B=p|0;aN=p+4|0;p=0;do{do{if((c[56+(p<<3)>>2]&U|0)==(c[60+(p<<3)>>2]|0)){aM=d[120+(p<<1)|0]|0;aL=d[121+(p<<1)|0]|0;G=(c[o+(aL*40|0)+(aM<<3)>>2]|0)+aO>>2;if(!((G|0)>-1&(G|0)<(j|0))){break}V=(c[o+(aL*40|0)+(aM<<3)+4>>2]|0)+x>>2;if(!((V|0)>-1&(V|0)<(k|0))){break}aK=4-aM|0;aM=4-aL|0;aL=(c[o+(aM*40|0)+(aK<<3)>>2]|0)+aO>>2;if(!((aL|0)>-1&(aL|0)<(j|0))){break}aJ=(c[o+(aM*40|0)+(aK<<3)+4>>2]|0)+x>>2;if(!((aJ|0)>-1&(aJ|0)<(k|0))){break}aK=p&1;if((dv(h,j,G,V,aL,aJ,aK,B)|0)!=0){break}aJ=(c[B>>2]|0)-S|0;aL=(c[aN>>2]|0)-R|0;if((aK|0)==0){aQ=aL;aR=aJ;aS=1}else{aQ=aL*3|0;aR=aJ*3|0;aS=3}aJ=p>>1;aL=n+(aJ<<2)|0;c[aL>>2]=(c[aL>>2]|0)+aS;aL=m+(aJ<<3)|0;c[aL>>2]=(c[aL>>2]|0)+aR;aL=m+(aJ<<3)+4|0;c[aL>>2]=(c[aL>>2]|0)+aQ}}while(0);p=p+1|0;}while((p|0)<8);p=n|0;aQ=c[p>>2]|0;aR=c[n+4>>2]|0;if((aQ|0)==0|(aR|0)==0){aS=m|0;aN=(c[aS>>2]|0)+(c[m+8>>2]|0)|0;c[aS>>2]=aN;aS=m+4|0;B=(c[aS>>2]|0)+(c[m+12>>2]|0)|0;c[aS>>2]=B;aT=aQ+aR|0;aU=aN;aV=B}else{B=aQ-((aR|0)>(aQ|0)?aQ-aR|0:0)|0;aN=m|0;aS=aa(c[aN>>2]|0,aR)|0;x=aa((aa(c[m+8>>2]|0,aQ)|0)+aS|0,B)|0;aS=aa(aR,aQ)|0;o=aS>>1;aO=x>>31;U=((aO+o^aO)+x|0)/(aS|0)|0;c[aN>>2]=U;aN=m+4|0;x=aa(c[aN>>2]|0,aR)|0;aR=aa((aa(c[m+12>>2]|0,aQ)|0)+x|0,B)|0;x=aR>>31;aQ=((x+o^x)+aR|0)/(aS|0)|0;c[aN>>2]=aQ;aT=B<<1;aU=U;aV=aQ}c[p>>2]=aT;aQ=n+8|0;U=c[aQ>>2]|0;B=c[n+12>>2]|0;if((U|0)==0|(B|0)==0){n=m+16|0;aN=(c[n>>2]|0)+(c[m+24>>2]|0)|0;c[n>>2]=aN;n=m+20|0;aS=(c[n>>2]|0)+(c[m+28>>2]|0)|0;c[n>>2]=aS;aW=U+B|0;aX=aN;aY=aS}else{aS=U-((B|0)>(U|0)?U-B|0:0)|0;aN=m+16|0;n=aa(c[aN>>2]|0,B)|0;aR=aa((aa(c[m+24>>2]|0,U)|0)+n|0,aS)|0;n=aa(B,U)|0;x=n>>1;o=aR>>31;aO=((o+x^o)+aR|0)/(n|0)|0;c[aN>>2]=aO;aN=m+20|0;aR=aa(c[aN>>2]|0,B)|0;B=aa((aa(c[m+28>>2]|0,U)|0)+aR|0,aS)|0;aR=B>>31;U=((aR+x^aR)+B|0)/(n|0)|0;c[aN>>2]=U;aW=aS<<1;aX=aO;aY=U}c[aQ>>2]=aW;aQ=aU+aX|0;c[m>>2]=aQ;aX=aV+aY|0;c[m+4>>2]=aX;m=aT+aW|0;c[p>>2]=m;if((m|0)==0){aZ=S;a_=R}else{p=m>>1;aW=aQ>>31;aT=aX>>31;aY=(((aW+p^aW)+aQ|0)/(m|0)|0)+S|0;aQ=(((aT+p^aT)+aX|0)/(m|0)|0)+R|0;m=du(E,aY,aQ,h,j,k)|0;if((T|0)<0|(m|0)==33084991){a$=0}else{k=m^33084991;m=0;while(1){j=k-1&k;h=m+1|0;if((m|0)>=(T|0)|(j|0)==0){a$=h;break}else{k=j;m=h}}}m=(a$|0)>(T|0);aZ=m?S:aY;a_=m?R:aQ}c[a>>2]=aZ;c[a+4>>2]=a_;aP=0;i=l;return aP|0}function dx(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=c[a+8>>2]|0;e=c[b+8>>2]|0;f=c[a+12>>2]|0;a=c[b+12>>2]|0;return(((d|0)>(e|0))-((d|0)<(e|0))<<1|(f|0)>(a|0))-((f|0)<(a|0))|0}function dy(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,ab=0,ac=0,ad=0,ae=0,af=0;f=i;i=i+32|0;g=f|0;h=f+8|0;j=f+16|0;k=c[a+16+(e<<2)>>2]|0;l=c[a+32+(e<<2)>>2]|0;if((l|0)<=1){m=0;n=a+48+(e<<2)|0;c[n>>2]=m;i=f;return}o=l-1|0;p=g|0;q=b+16|0;r=b+32|0;s=b+20|0;t=b+36|0;u=b+24|0;v=b+28|0;b=g+4|0;w=h|0;x=h+4|0;y=a+64|0;z=a+68|0;A=e>>1;B=g+(A<<2)|0;C=h+(A<<2)|0;D=1-A|0;A=g+(D<<2)|0;g=h+(D<<2)|0;D=l>>1;h=(l*67|0)-1|0;E=l<<1;F=0;G=17;H=0;while(1){I=d8(d,l)|0;J=d8(d,o)|0;K=((J|0)>=(I|0))+J|0;J=k+(I<<4)|0;L=k+(K<<4)|0;M=c[J>>2]|0;N=k+(I<<4)+4|0;I=c[N>>2]|0;O=c[q>>2]|0;P=c[r>>2]|0;Q=M-P|0;R=aa(Q,O)|0;S=c[s>>2]|0;T=c[t>>2]|0;U=I-T|0;V=(aa(U,S)|0)+R|0;R=c[u>>2]|0;W=aa(Q,R)|0;Q=c[v>>2]|0;X=(aa(U,Q)|0)+W|0;W=c[L>>2]|0;U=k+(K<<4)+4|0;K=c[U>>2]|0;Y=W-P|0;P=aa(Y,O)|0;O=K-T|0;T=(aa(O,S)|0)+P|0;P=aa(Y,R)|0;R=(aa(O,Q)|0)+P|0;P=c[y>>2]|0;Q=c[z>>2]|0;c[p>>2]=V-P;c[b>>2]=X-Q;c[w>>2]=T-P;c[x>>2]=R-Q;Q=(c[B>>2]|0)-(c[C>>2]|0)|0;R=(c[A>>2]|0)-(c[g>>2]|0)|0;do{if((((Q|0)>-1?Q:-Q|0)|0)>(((R|0)>-1?R:-R|0)|0)){Z=H;_=G}else{P=M-W|0;T=aa(P,P)|0;P=I-K|0;X=dG((aa(P,P)|0)+T<<5)|0;T=c[J>>2]|0;P=c[N>>2]|0;V=(c[L>>2]|0)-T|0;O=(c[U>>2]|0)-P|0;Y=0;S=0;while(1){$=c[k+(S<<4)>>2]|0;ab=aa((c[k+(S<<4)+4>>2]|0)-P|0,V)|0;ac=ab-(aa($-T|0,O)|0)|0;$=k+(S<<4)+12|0;ab=c[$>>2]|0;if((((ac|0)>-1?ac:-ac|0)|0)>(X|0)){c[$>>2]=ab&-2;ad=Y}else{c[$>>2]=ab|1;ad=Y+1|0}ab=S+1|0;if((ab|0)<(l|0)){Y=ad;S=ab}else{break}}if((ad|0)>(H|0)){ae=0}else{Z=H;_=G;break}do{S=k+(ae<<4)+12|0;c[S>>2]=c[S>>2]<<1;ae=ae+1|0;}while((ae|0)<(l|0));if((ad|0)<=(D|0)){Z=ad;_=G;break}Z=ad;_=(h+(ad*-63|0)|0)/(E|0)|0}}while(0);U=F+1|0;if((U|0)<(_|0)){F=U;G=_;H=Z}else{break}}if((Z|0)<=0){m=Z;n=a+48+(e<<2)|0;c[n>>2]=m;i=f;return}H=j;j=0;_=0;while(1){G=k+(_<<4)|0;if((c[k+(_<<4)+12>>2]&2|0)==0){af=j}else{if((j|0)<(_|0)){F=G;c[H>>2]=c[F>>2];c[H+4>>2]=c[F+4>>2];c[H+8>>2]=c[F+8>>2];c[H+12>>2]=c[F+12>>2];G=k+(j<<4)|0;c[G>>2]=c[F>>2];c[G+4>>2]=c[F+4>>2];c[G+8>>2]=c[F+8>>2];c[G+12>>2]=c[F+12>>2];c[F>>2]=c[H>>2];c[F+4>>2]=c[H+4>>2];c[F+8>>2]=c[H+8>>2];c[F+12>>2]=c[H+12>>2]}af=j+1|0}if((af|0)<(Z|0)){j=af;_=_+1|0}else{m=Z;break}}n=a+48+(e<<2)|0;c[n>>2]=m;i=f;return}function dz(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;g=i;i=i+8|0;h=g|0;j=c[d+48+(f<<2)>>2]|0;k=c[e+48+(f<<2)>>2]|0;l=k-((k|0)<1?k-1|0:0)+(j-((j|0)<1?j-1|0:0))|0;m=d9(l<<3)|0;n=m;if((j|0)>0){o=c[d+16+(f<<2)>>2]|0;p=0;while(1){c[n+(p<<3)>>2]=c[o+(p<<4)>>2];c[n+(p<<3)+4>>2]=c[o+(p<<4)+4>>2];q=p+1|0;if((q|0)<(j|0)){p=q}else{r=j;break}}}else{p=h|0;c[p>>2]=c[d+64>>2];o=h+4|0;c[o>>2]=c[d+68>>2];q=f>>1;s=aa(c[d+(q<<2)>>2]|0,(f<<1&2)-1|0)|0;t=h+(q<<2)|0;c[t>>2]=(c[t>>2]|0)+s;s=c[p>>2]|0;p=c[o>>2]|0;o=aa(c[b>>2]|0,s)|0;t=(aa(c[b+4>>2]|0,p)|0)+o|0;o=c[b+40>>2]|0;q=1<<o-1;c[m>>2]=(t+q>>o)+(c[b+32>>2]|0);t=aa(c[b+8>>2]|0,s)|0;s=(aa(c[b+12>>2]|0,p)|0)+t+q>>o;c[m+4>>2]=s+(c[b+36>>2]|0);r=j+1|0}if((k|0)>0){j=c[e+16+(f<<2)>>2]|0;s=0;do{o=s+r|0;c[n+(o<<3)>>2]=c[j+(s<<4)>>2];c[n+(o<<3)+4>>2]=c[j+(s<<4)+4>>2];s=s+1|0;}while((s|0)<(k|0));u=c[b+40>>2]|0}else{k=h|0;c[k>>2]=c[e+64>>2];s=h+4|0;c[s>>2]=c[e+68>>2];j=f>>1;o=aa(c[e+(j<<2)>>2]|0,(f<<1&2)-1|0)|0;f=h+(j<<2)|0;c[f>>2]=(c[f>>2]|0)+o;o=c[k>>2]|0;k=c[s>>2]|0;s=aa(c[b>>2]|0,o)|0;f=(aa(c[b+4>>2]|0,k)|0)+s|0;s=c[b+40>>2]|0;j=1<<s-1;c[n+(r<<3)>>2]=(f+j>>s)+(c[b+32>>2]|0);f=aa(c[b+8>>2]|0,o)|0;o=(aa(c[b+12>>2]|0,k)|0)+f+j>>s;c[n+(r<<3)+4>>2]=o+(c[b+36>>2]|0);u=s}dB(a,n,l,u);u=c[d+72>>2]|0;d=c[u+4>>2]|0;l=c[a>>2]|0;n=a+4|0;s=c[n>>2]|0;b=a+8|0;o=c[b>>2]|0;r=aa(l,c[u>>2]|0)|0;if((o+r+(aa(s,d)|0)|0)>=0){ea(m);i=g;return}c[a>>2]=-l;c[n>>2]=-s;c[b>>2]=-o;ea(m);i=g;return}function dA(a,b,d,e,f,g){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0;h=aa(c[a+(e<<2)>>2]|0,b)|0;i=(aa(c[a+8+(e<<2)>>2]|0,d)|0)+h|0;h=1-e|0;e=aa(c[a+(h<<2)>>2]|0,b)|0;b=(aa(c[a+8+(h<<2)>>2]|0,d)|0)+e|0;if((b|0)<0){j=-b|0;k=-i|0}else{j=b;k=i}i=dI(f)|0;b=(k|0)>-1?k:-k|0;e=dI(b)|0;d=dI(f)|0;h=(d-29+(dI(b)|0)|0)>0?i-29+e|0:0;e=1<<h>>1;i=e+k>>h;k=e+j>>h;if((((i|0)>-1?i:-i|0)|0)>=(k|0)){l=-1;return l|0}h=aa(i,-f|0)|0;i=h>>31;j=((i+(k>>1)^i)+h|0)/(k|0)|0;if((((j|0)>-1?j:-j|0)|0)>=(f|0)){l=-1;return l|0}c[g>>2]=j;l=0;return l|0}function dB(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0;f=(d|0)>0;if(f){g=-2147483648;h=2147483647;i=-2147483648;j=2147483647;k=0;l=0;m=0;while(1){n=c[b+(m<<3)>>2]|0;o=n+l|0;p=(n|0)<(j|0)?n:j;q=i-((n|0)>(i|0)?i-n|0:0)|0;n=c[b+(m<<3)+4>>2]|0;r=n+k|0;s=(n|0)<(h|0)?n:h;t=g-((n|0)>(g|0)?g-n|0:0)|0;n=m+1|0;if((n|0)<(d|0)){g=t;h=s;i=q;j=p;k=r;l=o;m=n}else{u=t;v=s;w=q;x=p;y=r;z=o;break}}}else{u=-2147483648;v=2147483647;w=-2147483648;x=2147483647;y=0;z=0}m=d>>1;l=(z+m|0)/(d|0)|0;z=(y+m|0)/(d|0)|0;m=w-l|0;w=l-x|0;x=m-((w|0)>(m|0)?m-w|0:0)|0;w=u-z|0;u=z-v|0;v=w-((u|0)>(w|0)?w-u|0:0)|0;u=aa(x-((v|0)>(x|0)?x-v|0:0)|0,d)|0;v=dI(u)|0;x=((dI(u)|0)-15|0)>0?v-15|0:0;v=1<<x>>1;if(f){f=v-l|0;u=v-z|0;v=0;w=0;m=0;y=0;while(1){k=f+(c[b+(y<<3)>>2]|0)>>x;j=u+(c[b+(y<<3)+4>>2]|0)>>x;i=(aa(k,k)|0)+v|0;h=(aa(j,k)|0)+w|0;k=(aa(j,j)|0)+m|0;j=y+1|0;if((j|0)<(d|0)){v=i;w=h;m=k;y=j}else{A=i;B=h;C=k;break}}}else{A=0;B=0;C=0}y=A-C|0;m=(y|0)>-1?y:-y|0;y=-B<<1;B=dH(m,y)|0;w=dI(m)|0;v=dI(m)|0;d=(y|0)>-1?y:-y|0;x=dI(d)|0;b=dI(d)|0;u=(b|0)>(dI(m)|0)?x-v|0:0;v=dI(m)|0;x=dI(m)|0;b=dI(d)|0;f=dI(d)|0;d=1-(e+1>>1)|0;e=(v+d+((f|0)>(dI(m)|0)?b-x|0:0)|0)>0?w+d+u|0:0;u=1<<e>>1;if((A|0)>(C|0)){C=u+y>>e;c[a>>2]=C;A=B+m+u>>e;c[a+4>>2]=A;D=C;E=A;F=aa(D,l)|0;G=aa(E,z)|0;H=F+G|0;I=-H|0;J=a+8|0;c[J>>2]=I;return}else{A=B+m+u>>e;c[a>>2]=A;m=u+y>>e;c[a+4>>2]=m;D=A;E=m;F=aa(D,l)|0;G=aa(E,z)|0;H=F+G|0;I=-H|0;J=a+8|0;c[J>>2]=I;return}}function dC(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0,at=0,au=0,av=0,aw=0,ay=0,az=0,aA=0,aB=0,aC=0,aD=0,aE=0,aF=0,aG=0,aH=0,aI=0,aK=0,aL=0,aM=0,aN=0,aP=0,aQ=0,aR=0,aS=0,aU=0,aW=0,aX=0,aY=0,aZ=0,a_=0,a$=0,a0=0,a1=0,a2=0,a3=0,a4=0,a5=0,a7=0,a8=0,a9=0,ba=0,bb=0,bc=0,bd=0,be=0,bf=0,bg=0,bh=0,bi=0,bj=0,bk=0,bl=0,bm=0,bn=0,bo=0,bp=0,bq=0,br=0,bs=0,bt=0,bu=0;g=i;i=i+80|0;h=g|0;j=g+16|0;k=j;l=i;i=i+4|0;i=i+7>>3<<3;m=i;i=i+4|0;i=i+7>>3<<3;n=i;i=i+4|0;i=i+7>>3<<3;o=i;i=i+4|0;i=i+7>>3<<3;p=i;i=i+4|0;i=i+7>>3<<3;q=i;i=i+16|0;r=c[b>>2]|0;s=c[b+4>>2]|0;b=eb(s,1)|0;t=aO(3840,6784)|0;u=aO(3840,4800)|0;w=aO(3840,3840)|0;L3537:do{if((s|0)>0){x=j|0;y=h|0;z=h+4|0;A=h+8|0;B=f+4|0;C=f+8|0;D=(w|0)==-1;E=(u|0)==-1;F=q|0;G=0;L3539:while(1){L3541:do{if((a[b+G|0]|0)==0){H=a[r+(G*48|0)+11|0]|0;if(H<<24>>24==0){c[x>>2]=G;I=1;J=2599}else{K=H&255;L=a[r+(G*48|0)+12|0]|0;ej(k|0,-1|0,((H&255)>1?K<<2:4)|0);M=G;N=1;while(1){O=b+M|0;do{if(N){if((a[r+(M*48|0)+11|0]|0)!=H<<24>>24){break}if((a[r+(M*48|0)+12|0]|0)!=L<<24>>24){break}P=j+(d[r+(M*48|0)+10|0]<<2)|0;if((c[P>>2]|0)>=0){break}c[P>>2]=M;a[O]=1}}while(0);O=M+1|0;if((O|0)>=(s|0)){break}M=O;N=(a[b+O|0]|0)==0}if(H<<24>>24==0){Q=0;R=0;S=0;T=1}else{I=K;J=2599}}if((J|0)==2599){J=0;N=0;M=0;L=0;while(1){O=c[j+(L<<2)>>2]|0;do{if((O|0)>-1){P=c[r+(O*48|0)+4>>2]|0;if((P|0)<=0){U=M;V=N;break}W=c[r+(O*48|0)>>2]|0;X=N;Y=M;Z=0;while(1){_=c[W+(Z*12|0)>>2]|0;if((_|0)==4){$=1;J=2605}else if((_|0)==8){$=2;J=2605}else if((_|0)==5|(_|0)==9){aa=1;ab=X}else{ac=0;J=2606}if((J|0)==2605){J=0;ac=$;J=2606}do{if((J|0)==2606){J=0;if((_-1&_|0)!=0){aa=Y;ab=X;break}aa=Y;ab=(c[W+(Z*12|0)+8>>2]<<ac)+X|0}}while(0);_=Z+1|0;if((_|0)<(P|0)){X=ab;Y=aa;Z=_}else{U=aa;V=ab;break}}}else{U=M;V=N}}while(0);O=L+1|0;if((O|0)<(I|0)){N=V;M=U;L=O}else{Q=V;R=U;S=I;T=0;break}}}L=Q+1|0;M=d9(L)|0;c[y>>2]=u;c[z>>2]=t;c[A>>2]=w;c[l>>2]=0;do{if(T){ad=0}else{N=(R|0)==0;K=M;H=-1;O=0;Z=-1;Y=0;X=l;L3577:while(1){P=c_(e,64,0)|0;c[X>>2]=P;c[P+8>>2]=O;P=c[j+(Y<<2)>>2]|0;W=c[X>>2]|0;if((P|0)<0){c[W>>2]=1;_=Y;do{_=_+1|0;if((_|0)>=(S|0)){ae=H;af=O;ag=1;break L3577}ah=c[j+(_<<2)>>2]|0;}while((ah|0)<0);ai=O+1|0;a[M+O|0]=0;c[(c[X>>2]|0)+8>>2]=ai;aj=(c[X>>2]|0)+32|0;ak=c_(e,64,0)|0;c[aj>>2]=ak;al=aj;am=_;an=ai;ao=ah;ap=ak}else{al=X;am=Y;an=O;ao=P;ap=W}ak=c[r+(ao*48|0)+16>>2]|0;ai=c[r+(ao*48|0)+20>>2]|0;aj=ap+20|0;aq=c[aj>>2]|0;ar=aq+1|0;c[aj>>2]=ar;aj=ap+16|0;as=c[aj>>2]|0;at=ap+24|0;au=c[at>>2]|0;if(ar>>>0<as>>>0){av=au}else{ar=as+1|0;c[aj>>2]=ar;aj=ec(au,ar<<3)|0;c[at>>2]=aj;av=aj}c[av+(aq<<3)>>2]=ak;c[(c[at>>2]|0)+(aq<<3)+4>>2]=ai;ai=c[al>>2]|0;aq=c[r+(ao*48|0)+32>>2]|0;at=c[r+(ao*48|0)+36>>2]|0;ak=ai+20|0;aj=c[ak>>2]|0;ar=aj+1|0;c[ak>>2]=ar;ak=ai+16|0;au=c[ak>>2]|0;as=ai+24|0;ai=c[as>>2]|0;if(ar>>>0<au>>>0){aw=ai}else{ar=au+1|0;c[ak>>2]=ar;ak=ec(ai,ar<<3)|0;c[as>>2]=ak;aw=ak}c[aw+(aj<<3)>>2]=aq;c[(c[as>>2]|0)+(aj<<3)+4>>2]=at;at=c[al>>2]|0;aj=c[r+(ao*48|0)+40>>2]|0;as=c[r+(ao*48|0)+44>>2]|0;aq=at+20|0;ak=c[aq>>2]|0;ar=ak+1|0;c[aq>>2]=ar;aq=at+16|0;ai=c[aq>>2]|0;au=at+24|0;at=c[au>>2]|0;if(ar>>>0<ai>>>0){ay=at}else{ar=ai+1|0;c[aq>>2]=ar;aq=ec(at,ar<<3)|0;c[au>>2]=aq;ay=aq}c[ay+(ak<<3)>>2]=aj;c[(c[au>>2]|0)+(ak<<3)+4>>2]=as;as=c[al>>2]|0;ak=c[r+(ao*48|0)+24>>2]|0;au=c[r+(ao*48|0)+28>>2]|0;aj=as+20|0;aq=c[aj>>2]|0;ar=aq+1|0;c[aj>>2]=ar;aj=as+16|0;at=c[aj>>2]|0;ai=as+24|0;as=c[ai>>2]|0;if(ar>>>0<at>>>0){az=as}else{ar=at+1|0;c[aj>>2]=ar;aj=ec(as,ar<<3)|0;c[ai>>2]=aj;az=aj}c[az+(aq<<3)>>2]=ak;c[(c[ai>>2]|0)+(aq<<3)+4>>2]=au;au=r+(ao*48|0)+4|0;L3598:do{if((c[au>>2]|0)>0){aq=r+(ao*48|0)|0;ai=H;ak=an;aj=Z;ar=0;while(1){as=c[aq>>2]|0;at=c[as+(ar*12|0)>>2]|0;L3602:do{if((at|0)==1){aA=as+(ar*12|0)+8|0;aB=c[aA>>2]|0;if((Q-ak|0)>>>0<aB>>>0){aC=ai;aD=ak;aE=aj;aF=1;break L3598}aG=M+ak|0;aH=c[as+(ar*12|0)+4>>2]|0;eg(aG|0,aH|0,aB)|0;aI=0;aK=aj;aL=(c[aA>>2]|0)+ak|0;aM=ai}else if((at|0)==2){aA=c[as+(ar*12|0)+4>>2]|0;c[o>>2]=aA;aB=c[as+(ar*12|0)+8>>2]|0;c[m>>2]=aB;do{if(N){aN=ak;aP=aB;aQ=aA}else{aH=a6(aA|0,37,aB|0)|0;if((aH|0)==0){aN=ak;aP=aB;aQ=aA;break}else{aR=ak;aS=aA;aU=aH;aW=aB}while(1){aH=aU-aS|0;aG=aH+1|0;if((Q-aR|0)>>>0<aG>>>0){aC=ai;aD=aR;aE=aj;aF=1;break L3598}aX=M+aR|0;eg(aX|0,aS|0,aH)|0;aX=aH+aR|0;if(aG>>>0<aW>>>0){aY=aU+1|0;if((a[aY]|0)==37){aZ=37;a_=aG;a$=aY}else{J=2635}}else{J=2635}if((J|0)==2635){J=0;aZ=29;a_=aH;a$=aU}aH=aX+1|0;a[M+aX|0]=aZ;aX=aW+~a_|0;c[m>>2]=aX;aY=a$+1|0;c[o>>2]=aY;aG=a6(aY|0,37,aX|0)|0;if((aG|0)==0){aN=aH;aP=aX;aQ=aY;break}else{aR=aH;aS=aY;aU=aG;aW=aX}}}}while(0);if((Q-aN|0)>>>0<aP>>>0){aC=ai;aD=aN;aE=aj;aF=1;break L3598}aB=M+aN|0;eg(aB|0,aQ|0,aP)|0;aI=0;aK=aj;aL=aP+aN|0;aM=ai}else if((at|0)==4){aB=as+(ar*12|0)+4|0;aA=c[aB>>2]|0;c[o>>2]=aA;aX=as+(ar*12|0)+8|0;aG=c[aX>>2]|0;c[m>>2]=aG;aY=M+ak|0;c[p>>2]=aY;aH=Q-ak|0;c[n>>2]=aH;if((aj|0)>=0){if((ai|0)==-1){aC=-1;aD=ak;aE=aj;aF=1;break L3598}a0=(ax(ai|0,o|0,m|0,p|0,n|0)|0)==-1;a1=a0&1;if(a0){aI=a1;aK=aj;aL=ak;aM=ai;break}aI=a1;aK=aj;aL=(c[p>>2]|0)-K|0;aM=ai;break}do{if(aG>>>0>2){if((a[aA]|0)!=-17){J=2653;break}if((a[aA+1|0]|0)!=-69){J=2653;break}if((a[aA+2|0]|0)!=-65){J=2653;break}c[o>>2]=aA+3;c[m>>2]=aG-3;do{if(D){a2=1}else{a1=(ax(w|0,o|0,m|0,p|0,n|0)|0)==-1;a0=a1&1;if(a1){a2=a0;break}a1=(c[p>>2]|0)-K|0;a3=0;while(1){a4=a3+1|0;if((c[h+(a3<<2)>>2]|0)==(w|0)){break}if((a4|0)<3){a3=a4}else{aI=a0;aK=aj;aL=a1;aM=ai;break L3602}}if((a3|0)>0){a4=a3;while(1){a5=a4-1|0;c[h+(a4<<2)>>2]=c[h+(a5<<2)>>2];if((a5|0)>0){a4=a5}else{break}}}c[y>>2]=w;aI=a0;aK=aj;aL=a1;aM=ai;break L3602}}while(0);a4=c[aB>>2]|0;c[o>>2]=a4;a3=c[aX>>2]|0;c[m>>2]=a3;c[p>>2]=aY;c[n>>2]=aH;a7=a2;a8=0;a9=a4;ba=a3}else{J=2653}}while(0);L3641:do{if((J|0)==2653){J=0;if((aG|0)>0){a3=0;while(1){a4=a3+1|0;if((a[aA+a3|0]|0)<0){a7=0;a8=0;a9=aA;ba=aG;break L3641}if((a4|0)<(aG|0)){a3=a4}else{bb=0;break}}}else{bb=0}while(1){a3=bb+1|0;if((c[h+(bb<<2)>>2]|0)==(w|0)){break}if((a3|0)<3){bb=a3}else{a7=0;a8=0;a9=aA;ba=aG;break L3641}}if((bb|0)>0){a3=bb;while(1){a4=a3-1|0;c[h+(a3<<2)>>2]=c[h+(a4<<2)>>2];if((a4|0)>0){a3=a4}else{break}}}c[y>>2]=w;a7=0;a8=0;a9=aA;ba=aG}}while(0);while(1){aG=h+(a8<<2)|0;aA=c[aG>>2]|0;if((aA|0)==-1){bc=a7;bd=a9;be=ba}else{L3659:do{if((a8|0)<2&(aA|0)==(t|0)){if((ba|0)>0){bf=0}else{bg=t;break}while(1){a3=a[a9+bf|0]|0;a4=bf+1|0;if(a3<<24>>24<0&(a3&255)<160){break}if((a4|0)<(ba|0)){bf=a4}else{bg=t;break L3659}}a1=a8+1|0;if((a1|0)<3){a0=a8;a4=a1;while(1){c[h+(a0<<2)>>2]=c[h+(a4<<2)>>2];a1=a4+1|0;if((a1|0)<3){a0=a4;a4=a1}else{break}}}c[A>>2]=t;bg=c[aG>>2]|0}else{bg=aA}}while(0);aA=(ax(bg|0,o|0,m|0,p|0,n|0)|0)==-1;bh=aA&1;if(!aA){break}aA=c[aB>>2]|0;c[o>>2]=aA;aG=c[aX>>2]|0;c[m>>2]=aG;c[p>>2]=aY;c[n>>2]=aH;bc=bh;bd=aA;be=aG}aG=a8+1|0;if((aG|0)<3){a7=bc;a8=aG;a9=bd;ba=be}else{aI=bc;aK=aj;aL=ak;aM=ai;break L3602}}aH=(c[p>>2]|0)-K|0;aY=0;while(1){aX=aY+1|0;if((c[h+(aY<<2)>>2]|0)==(bg|0)){break}if((aX|0)<3){aY=aX}else{aI=bh;aK=aj;aL=aH;aM=ai;break L3602}}if((aY|0)>0){aX=aY;while(1){aB=aX-1|0;c[h+(aX<<2)>>2]=c[h+(aB<<2)>>2];if((aB|0)>0){aX=aB}else{break}}}c[y>>2]=bg;aI=bh;aK=aj;aL=aH;aM=ai}else if((at|0)==8){c[o>>2]=c[as+(ar*12|0)+4>>2];c[m>>2]=c[as+(ar*12|0)+8>>2];c[p>>2]=M+ak;c[n>>2]=Q-ak;if(E){aC=ai;aD=ak;aE=aj;aF=1;break L3598}aX=(ax(u|0,o|0,m|0,p|0,n|0)|0)==-1;aY=aX&1;if(aX){aI=aY;aK=aj;aL=ak;aM=ai;break}aI=aY;aK=aj;aL=(c[p>>2]|0)-K|0;aM=ai}else if((at|0)==7){aY=c[as+(ar*12|0)+4>>2]|0;do{if(aY>>>0<19&(aY|0)!=14){if((aY|0)==2|(aY|0)==0){bi=3656;break}aX=aY-2+(aY>>>0<3?3-aY|0:0)|0;aJ(F|0,4104,(v=i,i=i+8|0,c[v>>2]=aX,v)|0)|0;bi=F}else{if((aY|0)==20){bi=4800}else{aI=0;aK=aj;aL=ak;aM=ai;break L3602}}}while(0);aI=0;aK=aY;aL=ak;aM=aO(3840,bi|0)|0}else{aI=0;aK=aj;aL=ak;aM=ai}}while(0);as=ar+1|0;if((as|0)<(c[au>>2]|0)&(aI|0)==0){ai=aM;ak=aL;aj=aK;ar=as}else{aC=aM;aD=aL;aE=aK;aF=aI;break}}}else{aC=H;aD=an;aE=Z;aF=0}}while(0);do{if((aE|0)<2){if((aC|0)==-1){bj=-1;break}aT(aC|0)|0;bj=-1}else{bj=aE}}while(0);au=am+1|0;W=(aF|0)==0;if(!((au|0)<(S|0)&W)){ae=aC;af=aD;ag=W;break}H=aC;O=aD;Z=bj;Y=au;X=(c[al>>2]|0)+32|0}if((ae|0)==-1){if(ag){ad=af;break}}else{aT(ae|0)|0;if(ag){ad=af;break}}cY(e,c[l>>2]|0);ea(M);break L3541}}while(0);X=ad+1|0;a[M+ad|0]=0;if(L>>>0>X>>>0){bk=ec(M,X)|0}else{bk=M}do{if((S|0)==1){bl=c[l>>2]|0}else{Y=c_(e,64,0)|0;Z=b3()|0;c[Y+36>>2]=Z;O=c[l>>2]|0;c[Z+8>>2]=O;if((O|0)==0){bl=Y;break}Z=Y|0;H=O;O=c[B>>2]|0;K=-2;N=c[C>>2]|0;au=-2;while(1){W=H+28|0;P=c[W>>2]|0;c[W>>2]=P+1;if((P|0)<=-2){J=2705;break L3539}do{if((c[H>>2]|0)==1){c[Z>>2]=1;bm=au;bn=N;bo=K;bp=O}else{P=c[H+20>>2]|0;if((P|0)==0){bm=au;bn=N;bo=K;bp=O;break}W=c[H+24>>2]|0;_=0;ar=O;aj=K;ak=N;ai=au;while(1){aq=c[W+(_<<3)>>2]|0;as=(ar|0)<(aq|0)?ar:aq-1|0;at=(aj|0)>(aq|0)?aj:aq+1|0;aq=c[W+(_<<3)+4>>2]|0;aH=(ak|0)<(aq|0)?ak:aq-1|0;aX=(ai|0)>(aq|0)?ai:aq+1|0;aq=_+1|0;if(aq>>>0<P>>>0){_=aq;ar=as;aj=at;ak=aH;ai=aX}else{bm=aX;bn=aH;bo=at;bp=as;break}}}}while(0);c[H+12>>2]=bk+(c[H+8>>2]|0);ai=c[l>>2]|0;ak=c[ai+32>>2]|0;aj=(ak|0)==0;if(aj){bq=X}else{bq=c[ak+8>>2]|0}ar=ai+8|0;ai=c[ar>>2]|0;if(bq>>>0<=ai>>>0){J=2714;break L3539}c[ar>>2]=bq-1-ai;c[l>>2]=ak;if(aj){break}else{H=ak;O=bp;K=bo;N=bn;au=bm}}if((bo|0)<=-2){bl=Y;break}au=Y+20|0;N=c[au>>2]|0;K=N+1|0;c[au>>2]=K;O=Y+16|0;H=c[O>>2]|0;Z=Y+24|0;ak=c[Z>>2]|0;if(K>>>0<H>>>0){br=ak}else{K=H+1|0;c[O>>2]=K;H=ec(ak,K<<3)|0;c[Z>>2]=H;br=H}c[br+(N<<3)>>2]=bp;c[(c[Z>>2]|0)+(N<<3)+4>>2]=bn;N=c[au>>2]|0;H=N+1|0;c[au>>2]=H;K=c[O>>2]|0;ak=c[Z>>2]|0;if(H>>>0<K>>>0){bs=ak}else{H=K+1|0;c[O>>2]=H;K=ec(ak,H<<3)|0;c[Z>>2]=K;bs=K}c[bs+(N<<3)>>2]=bp;c[(c[Z>>2]|0)+(N<<3)+4>>2]=bm;N=c[au>>2]|0;K=N+1|0;c[au>>2]=K;H=c[O>>2]|0;ak=c[Z>>2]|0;if(K>>>0<H>>>0){bt=ak}else{K=H+1|0;c[O>>2]=K;H=ec(ak,K<<3)|0;c[Z>>2]=H;bt=H}c[bt+(N<<3)>>2]=bo;c[(c[Z>>2]|0)+(N<<3)+4>>2]=bm;N=c[au>>2]|0;H=N+1|0;c[au>>2]=H;au=c[O>>2]|0;K=c[Z>>2]|0;if(H>>>0<au>>>0){bu=K}else{H=au+1|0;c[O>>2]=H;O=ec(K,H<<3)|0;c[Z>>2]=O;bu=O}c[bu+(N<<3)>>2]=bo;c[(c[Z>>2]|0)+(N<<3)+4>>2]=bn;bl=Y}}while(0);c[bl+12>>2]=bk;c[bl+4>>2]=X;c[bl+8>>2]=ad;c$(e,bl)}}while(0);G=G+1|0;if((G|0)>=(s|0)){break L3537}}if((J|0)==2705){aV(2392,75,9056,2016);return 0}else if((J|0)==2714){aV(3136,368,8352,2736);return 0}}}while(0);if((w|0)!=-1){aT(w|0)|0}if((u|0)!=-1){aT(u|0)|0}if((t|0)==-1){ea(b);i=g;return 0}aT(t|0)|0;ea(b);i=g;return 0}function dD(b,c){b=b|0;c=c|0;var e=0,f=0,g=0,h=0;e=1;f=0;while(1){g=e&255;a[f+255+(b+256)|0]=g;a[b+256+f|0]=g;g=f+1|0;if((g|0)<256){e=(-(e>>>7)&c^e<<1)&255;f=g}else{h=0;break}}do{a[b+(d[b+256+h|0]|0)|0]=h&255;h=h+1|0;}while((h|0)<255);a[b|0]=0;return}function dE(b,c,e,f,g,h,j){b=b|0;c=c|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,ab=0,ac=0,ad=0;k=i;i=i+1280|0;l=k|0;m=k+256|0;n=k+512|0;o=k+768|0;p=k+1024|0;if((j|0)>(g|0)){q=-1;i=k;return q|0}r=p|0;s=(g|0)>0;if(!s){q=0;i=k;return q|0}do{if((f|0)>0){t=0;do{u=d[b+(d[t+c+(b+256)|0]|0)|0]|0;v=0;w=0;do{if((w|0)==0){x=0}else{x=d[(d[b+w|0]|0)+u+(b+256)|0]|0}w=x^d[e+v|0];v=v+1|0;}while((v|0)<(f|0));a[p+t|0]=w&255;t=t+1|0;}while((t|0)<(g|0));if(s){y=0;break}else{q=0}i=k;return q|0}else{ej(r|0,0,g|0);y=0}}while(0);while(1){r=y+1|0;if((a[p+y|0]|0)!=0){break}if((r|0)<(g|0)){y=r}else{q=0;z=2828;break}}if((z|0)==2828){i=k;return q|0}y=m|0;r=n|0;s=l|0;x=g+1|0;ej(y|0,0,((g|0)<4?5:x)|0);a[y]=1;if((j|0)>0){t=f-1|0;v=0;while(1){u=v+1|0;A=h+v|0;B=u;while(1){C=B-1|0;D=a[m+C|0]|0;if(D<<24>>24==0){E=0}else{E=a[t-(d[A]|0)+(d[b+(D&255)|0]|0)+(b+256)|0]|0}D=m+B|0;a[D]=a[D]^E;if((C|0)>0){B=C}else{break}}if((u|0)<(j|0)){v=u}else{break}}}eg(s|0,y|0,x)|0;L3796:do{if((j|0)<(g|0)){x=l+1|0;y=0;v=j;E=j;while(1){t=E+1|0;if((v|0)<0){F=t;break}else{G=E;H=t}L3800:while(1){I=H-y|0;ek(x|0,s|0,I|0);a[s]=0;t=0;h=0;while(1){B=a[m+t|0]|0;A=a[p+(G-t)|0]|0;if(B<<24>>24==0|A<<24>>24==0){J=0}else{J=d[(d[b+(A&255)|0]|0)+(d[b+(B&255)|0]|0)+(b+256)|0]|0}K=J^h;if((t|0)>=(v|0)){break}t=t+1|0;h=K}L3809:do{if((J|0)!=(h|0)){L=d[b+K|0]|0;if((v|0)<(I|0)){break L3800}else{M=0;N=0}while(1){t=m+M|0;if(N<<24>>24==0){O=0}else{O=a[(d[b+(N&255)|0]|0)+L+(b+256)|0]|0}a[t]=O^a[t];t=M+1|0;if((M|0)>=(v|0)){break L3809}M=t;N=a[l+t|0]|0}}}while(0);if((H|0)<(g|0)){G=H;H=H+1|0}else{P=v;break L3796}}L3819:do{if((I|0)>=0){w=L^255;h=0;t=0;while(1){B=m+h|0;A=a[B]|0;if(A<<24>>24==0){Q=0}else{Q=a[(d[b+(A&255)|0]|0)+w+(b+256)|0]|0}a[l+h|0]=Q;if(t<<24>>24==0){R=0}else{R=a[(d[b+(t&255)|0]|0)+L+(b+256)|0]|0}a[B]=R^A;A=h+1|0;if((h|0)>=(I|0)){break L3819}h=A;t=a[l+A|0]|0}}}while(0);if((H|0)<(g|0)){y=H-v|0;v=I;E=H}else{P=I;break L3796}}while(1){ek(x|0,s|0,F-y|0);a[s]=0;if((F|0)<(g|0)){F=F+1|0}else{P=v;break}}}else{P=j}}while(0);F=P+1|0;ej(r|0,0,g|0);r=(F|0)<(g|0)?F:g;if((r|0)>0){F=0;do{s=a[m+F|0]|0;do{if(s<<24>>24!=0){I=g-F|0;H=(I|0)<(g|0)?I:g;I=d[b+(s&255)|0]|0;if((H|0)>0){S=0}else{break}do{l=a[p+S|0]|0;if(l<<24>>24==0){T=0}else{T=a[(d[b+(l&255)|0]|0)+I+(b+256)|0]|0}l=n+(S+F)|0;a[l]=a[l]^T;S=S+1|0;}while((S|0)<(H|0))}}while(0);F=F+1|0;}while((F|0)<(r|0))}if((P|0)<1){q=-1;i=k;return q|0}if((P-j|0)>(g-j>>1|0)){q=-1;i=k;return q|0}do{if((P|0)<5){j=dF(b,d[m+1|0]|0,d[m+2|0]|0,d[m+3|0]|0,d[m+4|0]|0,o|0)|0;if((j|0)>0){U=0;V=0}else{W=0;break}while(1){r=a[o+V|0]|0;do{if(r<<24>>24==0){X=U}else{F=a[b+(r&255)|0]|0;if((F&255|0)>=(f|0)){X=U;break}a[o+U|0]=F;X=U+1|0}}while(0);r=V+1|0;if((r|0)<(j|0)){U=X;V=r}else{W=X;break}}}else{if((f|0)<=0){W=0;break}j=(P|0)<0;r=0;F=0;while(1){if(j){z=2808}else{S=0;T=0;p=0;while(1){s=a[m+(P-S)|0]|0;if(s<<24>>24==0){Y=0}else{Y=d[(d[b+(s&255)|0]|0)+T+(b+256)|0]|0}if((S|0)<(P|0)){S=S+1|0;T=d[b+(d[T+r+(b+256)|0]|0)|0]|0;p=Y^p}else{break}}if((Y|0)==(p|0)){z=2808}else{Z=F}}if((z|0)==2808){z=0;a[o+F|0]=r&255;Z=F+1|0}T=r+1|0;if((T|0)<(f|0)){r=T;F=Z}else{W=Z;break}}}}while(0);if((W|0)<(P|0)){q=-1;i=k;return q|0}if((P|0)<=0){q=P;i=k;return q|0}W=(g|0)<1;Z=f-1|0;f=0;while(1){z=d[o+f|0]|0;Y=z^255;X=0;V=0;U=0;while(1){F=a[n+V|0]|0;if(F<<24>>24==0){_=0}else{_=d[(d[b+(F&255)|0]|0)+U+(b+256)|0]|0}$=_^X;F=V+1|0;if((F|0)<(g|0)){X=$;V=F;U=d[b+(d[U+Y+(b+256)|0]|0)|0]|0}else{break}}U=d[b+(d[(Y<<1)+(b+256)|0]|0)|0]|0;L3889:do{if(W){ab=0}else{V=0;F=1;r=(((aa(z,c)|0)>>>0)%255|0)+Y|0;while(1){j=a[m+F|0]|0;if(j<<24>>24==0){ac=0}else{ac=d[(d[b+(j&255)|0]|0)+r+(b+256)|0]|0}j=ac^V;T=F+2|0;if((T|0)>(g|0)){ab=j;break L3889}V=j;F=T;r=d[b+(d[r+U+(b+256)|0]|0)|0]|0}}}while(0);if((_|0)==(X|0)){ad=0}else{ad=a[(d[b+$|0]|0)+255-(d[b+ab|0]|0)+(b+256)|0]|0}U=e+(Z-z)|0;a[U]=a[U]^ad;U=f+1|0;if((U|0)<(P|0)){f=U}else{q=P;break}}i=k;return q|0}function dF(b,c,e,f,g,h){b=b|0;c=c|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;if((g|0)==0){i=dQ(b,c,e,f,h)|0;if((f|0)==0){j=i;return j|0}a[h+i|0]=0;j=i+1|0;return j|0}if((c|0)==0){if((f|0)==0){if((e|0)==0){k=0}else{i=d[b+e|0]|0;k=d[(((-(i&1)&255)+i|0)>>>1)+(b+256)|0]|0}i=d[b+g|0]|0;j=dJ(b,k,d[(((-(i&1)&255)+i|0)>>>1)+(b+256)|0]|0,h)|0;return j|0}if((dQ(b,0,e,f,h)|0)<1){j=0;return j|0}i=d[h]|0;if((dJ(b,d[(d[b+f|0]|0)+255-(d[b+i|0]|0)+(b+256)|0]|0,g,h)|0)<2){j=0;return j|0}k=d[h+1|0]|0;l=dJ(b,i,d[h]|0,h)|0;j=(dJ(b,i,k,h+l|0)|0)+l|0;return j|0}l=d[b+c|0]|0;do{if((f|0)==0){m=0;n=0;o=0;p=g}else{k=a[(d[b+f|0]|0)+(l^255)+(b+256)|0]|0;i=k&255;if(k<<24>>24==0){m=0;n=0;o=0;p=g;break}k=d[b+i|0]|0;if((e|0)==0){q=g}else{q=(d[k+(d[b+e|0]|0)+(b+256)|0]|0)^g}m=d[(k<<1)+(b+256)|0]|0;n=d[(((-(k&1)&255)+k|0)>>>1)+(b+256)|0]|0;o=i;p=q}}while(0);if((p|0)==(m|0)){q=dJ(b,c,o^e,h)|0;do{if((q|0)==2){if((d[h]|0|0)==(n|0)){j=2;return j|0}if((d[h+1|0]|0|0)==(n|0)){j=2}else{break}return j|0}}while(0);a[h+q|0]=n&255;j=q+1|0;return j|0}q=(d[b+(m^p)|0]|0)^255;if((n|0)==0){r=0}else{r=d[(d[b+n|0]|0)+l+(b+256)|0]|0}if((r|0)==(e|0)){s=0}else{s=d[(d[b+(r^e)|0]|0)+q+(b+256)|0]|0}e=dF(b,0,s,d[q+l+(b+256)|0]|0,d[b+256+q|0]|0,h)|0;if((e|0)>0){t=0}else{j=e;return j|0}while(1){q=h+t|0;a[q]=((d[((d[b+(d[q]|0)|0]|0)^255)+(b+256)|0]|0)^n)&255;q=t+1|0;if((q|0)<(e|0)){t=q}else{j=e;break}}return j|0}function dG(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0;b=0;c=32768;d=a;a=15;while(1){e=(b<<1)+c<<a;if(e>>>0>d>>>0){f=d;g=b}else{f=d-e|0;g=c+b|0}if((a|0)>0){b=g;c=c>>>1;d=f;a=a-1|0}else{break}}return g|0}function dH(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;c=(a|0)>-1?a:-a|0;a=(b|0)>-1?b:-b|0;b=c>>>0>a>>>0?a^c:0;d=b^a;a=(d>>>0>65535)<<4;e=d>>>(a>>>0);f=((e&65280|0)!=0)<<3;g=e>>>(f>>>0);e=((g&240|0)!=0)<<2;h=g>>>(e>>>0);g=((h&12|0)!=0)<<1;i=h>>>(g>>>0);h=(((i|0)!=0)<<31>>31)+31-(f|a|e|g|i>>>1&1)|0;i=h&~(h>>31);ew((b^c)<<i,0,-1686835798,0)|0;c=E;b=d<<i;ew(b,(b|0)<0?-1:0,-1686835799,0)|0;b=E;d=b;h=b>>>31|0<<1;b=-h|0;g=(d-h^b)+c|0;e=d-(c-h^b)|0;b=e>>31;h=((e+1>>1)+b^b)+g|0;c=1;d=e-(((g+1|0)>>>1)+b^b)|0;while(1){b=c<<1;g=d>>31;j=(((1<<b>>1)+d>>b)+g^g)+h|0;b=d-(g+((h+1|0)>>>2)^g)<<1;g=c+1|0;if((g|0)<16){h=j;c=g;d=b}else{break}}return(j+(1<<i>>>1)|0)>>>(i>>>0)|0}function dI(a){a=a|0;var b=0,c=0,d=0,e=0,f=0;b=(a>>>0>65535)<<4;c=a>>>(b>>>0);a=((c&65280|0)!=0)<<3;d=c>>>(a>>>0);c=((d&240|0)!=0)<<2;e=d>>>(c>>>0);d=((e&12|0)!=0)<<1;f=e>>>(d>>>0);return(a|b|c|d|f>>>1&1)+((f|0)!=0)|0}function dJ(b,c,e,f){b=b|0;c=c|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;g=(e|0)==0;if((c|0)==0){if(g){h=0}else{i=d[b+e|0]|0;h=a[(((-(i&1)&255)+i|0)>>>1)+(b+256)|0]|0}a[f]=h;j=1;return j|0}if(g){a[f]=0;a[f+1|0]=c&255;j=2;return j|0}g=a[b+c|0]|0;h=g&255;i=d[b+e|0]|0;k=((g&255)%17|0)<<24>>24==0;g=k&1;if(k){k=d[h+254+(b+256)|0]|0;l=d[i+253+(b+256)|0]|0;m=l;n=k;o=d[b+k|0]|0;p=d[b+l|0]|0}else{m=e;n=c;o=h;p=i}i=d[b+(d[(o<<1)+(b+256)|0]|0)|0]|0;h=d[b+(d[(i<<1)+(b+256)|0]|0)|0]|0;e=d[b+(d[(h<<1)+(b+256)|0]|0)|0]|0;l=d[b+(d[e+h+(b+256)|0]|0)|0]|0;h=d[b+(d[(p<<1)+(b+256)|0]|0)|0]|0;k=d[b+(d[(h<<1)+(b+256)|0]|0)|0]|0;q=a[(k<<1)+(b+256)|0]|0;r=a[h+l+(b+256)|0]^a[(d[b+(d[l+i+(b+256)|0]|0)|0]|0)+p+(b+256)|0]^a[k+e+(b+256)|0];if(r<<24>>24==q<<24>>24){s=0}else{s=d[(d[b+((r^q)&255)|0]|0)+o+(b+256)|0]|0}q=a[b+s|0]|0;if(((q&255)%17|0)<<24>>24!=0){j=0;return j|0}do{if((s|0)==0){t=0;u=0;v=0}else{r=a[(q&255)+255-(d[b+((d[(e<<1)+(b+256)|0]|0)^n)|0]|0)+(b+256)|0]|0;k=r&255;if(r<<24>>24==0){t=0;u=0;v=0;break}r=d[b+k|0]|0;t=d[r+o+(b+256)|0]|0;u=k;v=d[(r<<1)+(b+256)|0]|0}}while(0);n=t^v;do{if((n|0)==(m|0)){w=0;x=1;y=0;z=0;A=0}else{v=a[(d[b+(n^m)|0]|0)+(i^255)+(b+256)|0]|0;if(v<<24>>24==0){w=0;x=1;y=0;z=0;A=0;break}t=a[(d[b+(v&255)|0]|0)+221+(b+256)|0]|0;v=t&255;if(t<<24>>24==0){w=0;x=1;y=0;z=0;A=0;break}t=d[b+v|0]|0;e=a[t+221+(b+256)|0]|0;q=a[(t<<1)+(b+256)|0]|0;if(e<<24>>24==q<<24>>24){w=0;x=1;y=0;z=0;A=v;break}t=a[(d[b+((q^e)&255)|0]|0)+238+(b+256)|0]|0;if(t<<24>>24==0){w=0;x=1;y=0;z=0;A=v;break}e=a[(d[b+(t&255)|0]|0)+255-(d[b+((a[b+443|0]^a[b+494|0])&255)|0]|0)+(b+256)|0]|0;t=e&255;if(e<<24>>24==0){w=0;x=1;y=0;z=0;A=v;break}e=d[b+t|0]|0;w=d[e+238+(b+256)|0]|0;x=0;y=t;z=d[(e<<1)+(b+256)|0]|0;A=v}}while(0);i=w^z;do{if((i|0)==(A|0)){B=0}else{z=a[(d[b+(i^A)|0]|0)+34+(b+256)|0]|0;if(z<<24>>24==0){B=0;break}B=d[(d[b+(z&255)|0]|0)+85+(b+256)|0]|0}}while(0);if(x){C=0}else{C=d[(d[b+y|0]|0)+17+(b+256)|0]|0}if((B|0)==(C|0)){D=0}else{D=d[(d[b+(C^B)|0]|0)+o+(b+256)|0]|0}o=a[(d[b+(D^u)|0]|0)+g+(b+256)|0]|0;a[f]=o;a[f+1|0]=(o&255^c)&255;j=2;return j|0}function dK(a){a=a|0;return c[a+84>>2]|0}function dL(a){a=a|0;return c[a+80>>2]|0}function dM(a,b){a=a|0;b=b|0;var d=0;d=a+92|0;a=c[d>>2]|0;c[d>>2]=b;return a|0}function dN(a,b){a=a|0;b=b|0;c[a+88>>2]=b;return}function dO(a){a=a|0;return c[a+88>>2]|0}function dP(a){a=a|0;return c[a+68>>2]|0}function dQ(b,c,e,f,g){b=b|0;c=c|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;if((f|0)==0){h=dJ(b,c,e,g)|0;if((e|0)==0){i=h;return i|0}a[g+h|0]=0;i=h+1|0;return i|0}h=(c|0)==0;if(h|(e|0)==0){j=0}else{j=d[(d[b+e|0]|0)+(d[b+c|0]|0)+(b+256)|0]|0}k=j^f;if(h){l=0}else{l=d[((d[b+c|0]|0)<<1)+(b+256)|0]|0}if((l|0)==(e|0)){if((j|0)==(f|0)){a[g]=c&255;i=1;return i|0}h=a[b+k|0]|0;if(((h&255)%3|0)<<24>>24!=0){i=0;return i|0}m=((h&255)/3|0)&255;h=((d[b+256+m|0]|0)^c)&255;a[g]=h;n=a[m+85+(b+256)|0]|0;a[g+1|0]=(n&255^c)&255;a[g+2|0]=h^n;i=3;return i|0}n=d[b+(l^e)|0]|0;e=((-(n&1)&255)+n|0)>>>1;if((j|0)==(f|0)){o=0}else{o=d[(d[b+k|0]|0)+255-(d[b+(d[e+n+(b+256)|0]|0)|0]|0)+(b+256)|0]|0}if((dJ(b,o,1,g)|0)<1){i=0;return i|0}o=a[b+(d[g]|0)|0]|0;if(o<<24>>24==0){a[g]=c&255;i=1;return i|0}if(((o&255)%3|0)<<24>>24!=0){i=0;return i|0}n=((o&255)/3|0)&255;o=((d[(d[b+((a[(n^255)+(b+256)|0]^a[b+256+n|0])&255)|0]|0)+e+(b+256)|0]|0)^c)&255;a[g]=o;k=a[(d[b+((a[170-n+(b+256)|0]^a[n+85+(b+256)|0])&255)|0]|0)+e+(b+256)|0]|0;a[g+1|0]=(k&255^c)&255;a[g+2|0]=o^k;i=3;return i|0}function dR(){var d=0,e=0;d=eb(1,284)|0;c[d+76>>2]=32;c[d+84>>2]=d9(32)|0;a[d+162|0]=1;c[d+164>>2]=5;c[d+168>>2]=5;c[d+172>>2]=4;c[d+176>>2]=4;c[d+180>>2]=4;c[d+184>>2]=4;c[d+200>>2]=1;c[d+204>>2]=6;c[d+224>>2]=1;c[d+228>>2]=1;c[d+244>>2]=1;c[d+280>>2]=1;ej(d|0,0,76);a[d+104|0]=-1;a[d+96|0]=-1;a[d+120|0]=-1;a[d+112|0]=-1;ej(d+128|0,0,16);e=d+188|0;c[e>>2]=c[e>>2]&-131072|131040;c[d+192>>2]=0;e=d+212|0;c[e>>2]=c[e>>2]&-131072|131040;c[d+216>>2]=0;b[d+236>>1]=-16;c[d+240>>2]=0;c[d+256>>2]=0;return d|0}function dS(d){d=d|0;var e=0;ej(d|0,0,76);a[d+104|0]=-1;a[d+96|0]=-1;a[d+120|0]=-1;a[d+112|0]=-1;ej(d+128|0,0,16);e=d+188|0;c[e>>2]=c[e>>2]&-131072|131040;c[d+192>>2]=0;e=d+212|0;c[e>>2]=c[e>>2]&-131072|131040;c[d+216>>2]=0;b[d+236>>1]=-16;c[d+240>>2]=0;c[d+256>>2]=0;return}function dT(a){a=a|0;var b=0;b=c[a+84>>2]|0;if((b|0)!=0){ea(b)}ea(a|0);return}function dU(d){d=d|0;var e=0;ej(d+4|0,0,64);c[d+72>>2]=0;a[d|0]=0;a[d+104|0]=-1;a[d+96|0]=-1;a[d+120|0]=-1;a[d+112|0]=-1;c[d+140>>2]=0;e=d+188|0;c[e>>2]=c[e>>2]&-131072|131040;c[d+192>>2]=0;e=d+212|0;c[e>>2]=c[e>>2]&-131072|131040;c[d+216>>2]=0;b[d+236>>1]=-16;c[d+240>>2]=0;c[d+256>>2]=0;return}function dV(b,d){b=b|0;d=d|0;var e=0,f=0,g=0;e=b|0;c[b+4+((a[e]&15)<<2)>>2]=d;d=b+68|0;c[d>>2]=0;do{if((a[b+162|0]|0)!=0){f=d$(b)|0;if((f|0)==0){break}c[d>>2]=f}}while(0);do{if((c[b+224>>2]&1|0)!=0){f=dZ(b)|0;if(f>>>0<=1){break}c[d>>2]=f}}while(0);do{if((c[b+244>>2]&1|0)!=0){f=dX(b)|0;if(f>>>0<=1){break}c[d>>2]=f}}while(0);do{if((c[b+200>>2]&1|0)!=0){f=d3(b)|0;if(f>>>0<=1){break}c[d>>2]=f}}while(0);do{if((c[b+280>>2]&1|0)!=0){f=db(b)|0;if(f>>>0<=1){break}c[d>>2]=f}}while(0);a[e]=(a[e]|0)+1&255;if((c[d>>2]|0)==0){g=0;return g|0}e=c[b+92>>2]|0;if((e|0)!=0){a7[e&15](b)}e=b+72|0;b=c[d>>2]|0;if(!((c[e>>2]|0)!=0&b>>>0>1)){g=b;return g|0}c[e>>2]=0;g=b;return g|0}function dW(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;f=(b*3|0)+12|0;g=c[2542]|0;h=(g|0)==0;if(h|f>>>0>(c[2540]|0)>>>0){if(!h){ea(g)}h=d9(f)|0;c[2542]=h;c[2540]=f;j=h}else{j=g}g=ao(j|0,12,3768,(v=i,i=i+8|0,c[v>>2]=b>>>0>65535?65535:b,v)|0)|0;if((b|0)==0){k=c[2542]|0;i=e;return k|0}h=j+g|0;g=0;do{j=d[a+g|0]|0;h=h+(ao(h|0,4,6736,(v=i,i=i+16|0,c[v>>2]=(g|0)!=0?4760:10184,c[v+8>>2]=j,v)|0)|0)|0;g=g+1|0;}while(g>>>0<b>>>0);k=c[2542]|0;i=e;return k|0}function dX(e){e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,p=0,q=0,r=0,s=0,t=0,u=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,as=0,at=0,au=0,av=0;f=i;g=e|0;h=a[g]|0;j=h&255;k=e+240|0;l=(c[k>>2]|0)-(c[e+4+((j+10&15)<<2)>>2]|0)|0;c[k>>2]=l;m=e+4+((j&15)<<2)|0;n=(c[m>>2]|0)+l|0;c[k>>2]=n;l=e+236|0;p=b[l>>1]|0;do{if(p<<16>>16>-1){q=((p&65535)>>>1)+1&7;r=q<<1|p&-15;b[l>>1]=r;if(q<<16>>16==6){s=r;break}else{t=0}i=f;return t|0}else{s=p}}while(0);p=h&1;if((p&255|0)!=(s&1|0)){t=0;i=f;return t|0}b[l>>1]=s&-15;L8:do{if(n>>>0<5){u=-1}else{s=p<<24>>24==0;if(s){h=c[e+4+((j+12&15)<<2)>>2]|0;r=(((((h+(c[e+4+((j+11&15)<<2)>>2]|0)|0)*22|0|1)>>>0)/(n>>>0)|0)+509|0)>>>1&255;q=c[e+4+((j+13&15)<<2)>>2]|0;w=(((((q+h|0)*22|0|1)>>>0)/(n>>>0)|0)+509|0)>>>1&255;h=c[e+4+((j+14&15)<<2)>>2]|0;x=(((((h+q|0)*22|0|1)>>>0)/(n>>>0)|0)+509|0)>>>1&255;q=((((((c[e+4+((j+15&15)<<2)>>2]|0)+h|0)*22|0|1)>>>0)/(n>>>0)|0)+509|0)>>>1&255;y=(w>>>0>7?-256:w<<8)|(r>>>0>7?-4096:r<<12)|(x>>>0>7?-16:x<<4)|(q>>>0>7?-1:q)}else{q=c[e+4+((j+15&15)<<2)>>2]|0;x=(((((q+(c[m>>2]|0)|0)*22|0|1)>>>0)/(n>>>0)|0)+509|0)>>>1&255;r=c[e+4+((j+14&15)<<2)>>2]|0;w=(((((r+q|0)*22|0|1)>>>0)/(n>>>0)|0)+509|0)>>>1&255;q=c[e+4+((j+13&15)<<2)>>2]|0;h=(((((q+r|0)*22|0|1)>>>0)/(n>>>0)|0)+509|0)>>>1&255;r=((((((c[e+4+((j+12&15)<<2)>>2]|0)+q|0)*22|0|1)>>>0)/(n>>>0)|0)+509|0)>>>1&255;y=(w>>>0>7?-256:w<<8)|(x>>>0>7?-4096:x<<12)|(h>>>0>7?-16:h<<4)|(r>>>0>7?-1:r)}if((y|0)<0){u=-1;break}do{if((y&17476|0)==0){r=y>>>1&1|y>>>3&6|y>>>5&24|y>>>7&96;h=a[192+r|0]|0;x=(y&1|0)==0?(h&255)>>>4:h&15;if(x<<24>>24==15){u=-1;break L8}h=y>>>11&255|y>>>9&1;if(h>>>0>=8){w=c[o>>2]|0;ar(w|0,5736,(v=i,i=i+64|0,c[v>>2]=6640,c[v+8>>2]=132,c[v+16>>2]=8720,c[v+24>>2]=5592,c[v+32>>2]=y,c[v+40>>2]=r,c[v+48>>2]=x&255,c[v+56>>2]=h,v)|0)|0;u=-1;break L8}w=(a[320+h|0]|0)+x&255;x=w&255;if((w&255)<81){z=x;break}w=c[o>>2]|0;ar(w|0,5376,(v=i,i=i+64|0,c[v>>2]=6640,c[v+8>>2]=136,c[v+16>>2]=8720,c[v+24>>2]=5224,c[v+32>>2]=y,c[v+40>>2]=r,c[v+48>>2]=h,c[v+56>>2]=x,v)|0)|0;u=-1;break L8}else{x=(y&17408|0)!=0;h=x&1;if(x){A=y>>>12&15|y>>>4&240|y<<4&3840|y<<12&61440}else{A=y}if((A|0)==37){B=1;C=h}else if((A|0)==52){B=2;C=h}else if((A|0)==308){B=3;C=h}else if((A|0)==323){B=4;C=h}else if((A|0)==579){B=5;C=h}else if((A|0)==833){B=6;C=h}else if((A|0)==850){B=7;C=h}else if((A|0)==4132){B=8;C=h}else if((A|0)==4372){B=9;C=h}else if((A|0)==4404){B=10;C=h}else if((A|0)==4674){B=11;C=h}else if((A|0)==4675){B=12;C=h}else if((A|0)==5185){B=13;C=0}else if((A|0)==20){B=0;C=h}else{u=-1;break L8}z=((C<<24>>24==0?B:B+14&255)&255)+81|0}}while(0);h=a[1344+z|0]|0;if(s){D=(c[e+4+((j+13&15)<<2)>>2]|0)+(c[e+4+((j+15&15)<<2)>>2]|0)+(c[e+4+((j+11&15)<<2)>>2]|0)|0}else{D=(c[e+4+((j+14&15)<<2)>>2]|0)+(c[m>>2]|0)+(c[e+4+((j+12&15)<<2)>>2]|0)|0}x=((D*44|0)>>>0)/(n>>>0)|0;r=h&127;do{if(h<<24>>24>-1){E=24}else{if((r&255)<61){if((r&255)>=48){E=32;break}E=(z|0)!=44?16:32;break}if((r&255)<80){E=(z|0)==75?32:16;break}else{E=(r&255)<103?32:16;break}}}while(0);h=E&255;u=(h-7|0)>>>0>x>>>0|x>>>0>(h|7)>>>0?-1:r}}while(0);E=b[l>>1]|0;z=E<<16>>16>>4;n=u<<24>>24;L57:do{if(z<<16>>16<0){if((u-103&255)>4|u<<24>>24==106){t=0;i=f;return t|0}D=c[e+4+(((d[g]|0)+10&15)<<2)>>2]|0;do{if((D|0)!=0){if(D>>>0<((c[k>>2]|0)*3|0)>>>2>>>0){t=0}else{break}i=f;return t|0}}while(0);D=e+72|0;if((c[D>>2]|0)!=0){b[l>>1]=E|-16;t=0;i=f;return t|0}c[D>>2]=128;b[l>>1]=E&15;if(u<<24>>24==107){b[l>>1]=15;F=15;break}else{D=E&14;b[l>>1]=D;F=D;break}}else{do{if(u<<24>>24<0){G=E}else{if(z<<16>>16<=31){F=E;break L57}D=z+1&65535;r=D<<16>>16;x=e+76|0;j=c[x>>2]|0;if(j>>>0>r>>>0){F=E;break L57}if((D&65535)>256){G=E;break}D=j+16|0;if(D>>>0>r>>>0){H=D>>>0>256?256:D}else{H=r}r=e+84|0;D=ec(c[r>>2]|0,H)|0;if((D|0)==0){G=b[l>>1]|0;break}else{c[r>>2]=D;c[x>>2]=H;F=b[l>>1]|0;break L57}}}while(0);c[e+72>>2]=0;b[l>>1]=G|-16;t=0;i=f;return t|0}}while(0);G=c[e+76>>2]|0;H=F<<16>>16>>4;E=H<<16>>16;if(G>>>0<=E>>>0){z=c[o>>2]|0;k=dW(c[e+84>>2]|0,G)|0;ar(z|0,3584,(v=i,i=i+64|0,c[v>>2]=6640,c[v+8>>2]=487,c[v+16>>2]=9560,c[v+24>>2]=4712,c[v+32>>2]=G,c[v+40>>2]=E,c[v+48>>2]=n,c[v+56>>2]=k,v)|0)|0;t=0;i=f;return t|0}b[l>>1]=(H<<4)+16&65535|F&15;F=e+84|0;a[(c[F>>2]|0)+E|0]=u;E=b[l>>1]|0;H=E<<16>>16>>4;if(H<<16>>16<=2){t=0;i=f;return t|0}k=E&1;n=k<<16>>16==0;do{if(n){if(u<<24>>24==106){break}else{t=0}i=f;return t|0}else{if((u-103&255)<3){break}else{t=0}i=f;return t|0}}while(0);L101:do{if(H<<16>>16>=3){if(n){I=0}else{I=(H-1&65535)<<16>>16}u=c[F>>2]|0;G=a[u+I|0]|0;z=G&255;g=(G&255)>102?z-103|0:z;z=H-3&65535;L106:do{if(z<<16>>16==0){J=g}else{G=z<<16>>16;x=(H-1&65535)<<16>>16;L108:do{if(n){D=g;r=G;j=0;while(1){if(D>>>0>=103){K=j;L=r;M=D;N=77;break L108}m=(d[u+r|0]|0)+j|0;B=m>>>0>102?m-103|0:m;if(B>>>0>=103){O=r;P=D;Q=B;N=79;break L108}m=B+D|0;C=m>>>0>102?m-103|0:m;m=r-1|0;if((m|0)==0){J=C;break L106}else{D=C;r=m;j=B}}}else{j=g;r=G;D=0;while(1){if(j>>>0>=103){K=D;L=r;M=j;N=77;break L108}B=(d[u+(x-r)|0]|0)+D|0;m=B>>>0>102?B-103|0:B;if(m>>>0>=103){O=r;P=j;Q=m;N=79;break L108}B=m+j|0;C=B>>>0>102?B-103|0:B;B=r-1|0;if((B|0)==0){J=C;break L106}else{j=C;r=B;D=m}}}}while(0);if((N|0)==77){x=c[o>>2]|0;G=k&65535;D=dW(u,H<<16>>16)|0;ar(x|0,6368,(v=i,i=i+72|0,c[v>>2]=6640,c[v+8>>2]=246,c[v+16>>2]=8296,c[v+24>>2]=6168,c[v+32>>2]=G,c[v+40>>2]=L,c[v+48>>2]=M,c[v+56>>2]=K,c[v+64>>2]=D,v)|0)|0;break L101}else if((N|0)==79){D=c[o>>2]|0;G=dW(u,H<<16>>16)|0;ar(D|0,6368,(v=i,i=i+72|0,c[v>>2]=6640,c[v+8>>2]=253,c[v+16>>2]=8296,c[v+24>>2]=5936,c[v+32>>2]=k&65535,c[v+40>>2]=O,c[v+48>>2]=P,c[v+56>>2]=Q,c[v+64>>2]=G,v)|0)|0;break L101}}}while(0);if(n){R=(H-2&65535)<<16>>16}else{R=1}if((J|0)!=(d[u+R|0]|0)){break}g=k&65535;z=H<<16>>16;do{if(n){if((a[u+(z-1)|0]|0)==106){S=u;T=E;break}G=c[o>>2]|0;D=dW(u,z)|0;ar(G|0,4048,(v=i,i=i+48|0,c[v>>2]=6640,c[v+8>>2]=340,c[v+16>>2]=8464,c[v+24>>2]=3088,c[v+32>>2]=g,c[v+40>>2]=D,v)|0)|0;break L101}else{D=z-1|0;if((z+1|0)>>>0>2){G=0;x=D;r=u;while(1){j=x-G|0;m=r+G|0;B=a[m]|0;a[m]=a[r+j|0]|0;a[(c[F>>2]|0)+j|0]=B;B=G+1|0;j=b[l>>1]|0;m=j<<16>>16>>4<<16>>16;C=m-1|0;A=c[F>>2]|0;if(B>>>0<((m|0)/2|0)>>>0){G=B;x=C;r=A}else{U=m;V=C;W=j;X=A;break}}}else{U=z;V=D;W=E;X=u}if((a[X+V|0]|0)==107){S=X;T=W;break}r=c[o>>2]|0;x=W&1;G=dW(X,U)|0;ar(r|0,4048,(v=i,i=i+48|0,c[v>>2]=6640,c[v+8>>2]=335,c[v+16>>2]=8464,c[v+24>>2]=3536,c[v+32>>2]=x,c[v+40>>2]=G,v)|0)|0;break L101}}while(0);u=a[S]|0;z=u&255;g=u-103&255;if((g&255)>=3){G=c[o>>2]|0;x=dW(S,T<<16>>16>>4<<16>>16)|0;ar(G|0,2688,(v=i,i=i+40|0,c[v>>2]=6640,c[v+8>>2]=344,c[v+16>>2]=8464,c[v+24>>2]=2352,c[v+32>>2]=x,v)|0)|0;break}x=u<<24>>24==105|0;u=T<<16>>16>>4<<16>>16;L138:do{if((u-2|0)>>>0>1){G=a[S+1|0]|0;r=G&255;L140:do{if((r&128|0)==0){A=S;j=u;C=1;m=x;B=g;y=0;p=G;h=r;L141:while(1){Y=B&255;s=(Y&2|0)!=0;do{if(s&(p&255)<100){Z=C;_=m;$=B;aa=y}else{if((p&255)<96){w=p+32&255;if((B<<24>>24|0)==0|(B<<24>>24|0)==(-127|0)){ab=(w&255)>95?p-64&255:w}else{ab=w}a[A+y|0]=ab;Z=C;_=m;$=(Y&128|0)==0?B:B&127;aa=y+1|0;break}if(s){if((m|0)==0){N=103;break L141}w=dY(e,m,C,y)|0;ac=w+C|0;ad=0;ae=(w<<1)+y|0}else{ac=C;ad=m;ae=y}do{if((p&255)<99){af=p<<24>>24==98?B|-128:B}else{if(p<<24>>24==102){af=B;break}if((p&255)>102){break L101}if((p&255)>=102){N=110;break L141}af=101-p&255}}while(0);Z=ac;_=(af&2)==0?ad:ac+1|0;$=af;aa=ae}}while(0);s=Z+1|0;w=b[l>>1]>>4<<16>>16;if(s>>>0>=(w-2|0)>>>0){ag=aa;ah=$;ai=_;aj=s;ak=w;break L138}q=c[F>>2]|0;al=a[q+s|0]|0;am=al&255;if((am&128|0)==0){A=q;j=w;C=s;m=_;B=$;y=aa;p=al;h=am}else{an=q;ao=w;ap=s;aq=_;as=$;at=aa;au=am;break L140}}if((N|0)==103){p=c[o>>2]|0;B=dW(A,j)|0;ar(p|0,1928,(v=i,i=i+80|0,c[v>>2]=6640,c[v+8>>2]=377,c[v+16>>2]=8464,c[v+24>>2]=7648,c[v+32>>2]=C,c[v+40>>2]=y,c[v+48>>2]=h,c[v+56>>2]=Y,c[v+64>>2]=0,c[v+72>>2]=B,v)|0)|0;break L101}else if((N|0)==110){B=c[o>>2]|0;p=dW(c[F>>2]|0,b[l>>1]>>4<<16>>16)|0;ar(B|0,1928,(v=i,i=i+80|0,c[v>>2]=6640,c[v+8>>2]=402,c[v+16>>2]=8464,c[v+24>>2]=7432,c[v+32>>2]=ac,c[v+40>>2]=ae,c[v+48>>2]=h,c[v+56>>2]=Y,c[v+64>>2]=ad,c[v+72>>2]=p,v)|0)|0;break L101}}else{an=S;ao=u;ap=1;aq=x;as=g;at=0;au=r}}while(0);r=c[o>>2]|0;G=as&255;D=dW(an,ao)|0;ar(r|0,1928,(v=i,i=i+80|0,c[v>>2]=6640,c[v+8>>2]=355,c[v+16>>2]=8464,c[v+24>>2]=1688,c[v+32>>2]=ap,c[v+40>>2]=at,c[v+48>>2]=au,c[v+56>>2]=G,c[v+64>>2]=aq,c[v+72>>2]=D,v)|0)|0;break L101}else{ag=0;ah=g;ai=x;aj=1;ak=u}}while(0);u=ah&255;do{if((u&2|0)==0){av=ag}else{if((ai|0)==0){x=c[o>>2]|0;g=dW(c[F>>2]|0,ak)|0;ar(x|0,1928,(v=i,i=i+80|0,c[v>>2]=6640,c[v+8>>2]=417,c[v+16>>2]=8464,c[v+24>>2]=7648,c[v+32>>2]=aj,c[v+40>>2]=ag,c[v+48>>2]=z,c[v+56>>2]=u,c[v+64>>2]=0,c[v+72>>2]=g,v)|0)|0;break L101}else{av=((dY(e,ai,aj,ag)|0)<<1)+ag|0;break}}}while(0);c[e+80>>2]=av;a[(c[F>>2]|0)+av|0]=0;u=b[l>>1]|0;b[l>>1]=u&15|(av&65535)<<4;z=av<<20>>20;if((z|0)<(c[e+248>>2]|0)){break}g=c[e+252>>2]|0;if((g|0)>0&(z|0)>(g|0)){break}b[l>>1]=u|-16;t=128;i=f;return t|0}}while(0);b[l>>1]=b[l>>1]|-16;c[e+72>>2]=0;t=0;i=f;return t|0}function dY(e,f,g,h){e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,p=0,q=0,r=0,s=0,t=0,u=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;j=i;k=g-f|0;l=e+236|0;m=(b[l>>1]>>4<<16>>16)+k|0;n=e+76|0;p=c[n>>2]|0;do{if(p>>>0>m>>>0|m>>>0>256){q=e+84|0}else{r=p+16|0;if(r>>>0>m>>>0){s=r>>>0>256?256:r}else{s=m}r=e+84|0;t=ec(c[r>>2]|0,s)|0;if((t|0)==0){q=r;break}c[r>>2]=t;c[n>>2]=s;q=r}}while(0);s=c[q>>2]|0;ek(s+g|0,s+f|0,(b[l>>1]>>4<<16>>16)-f|0);b[l>>1]=b[l>>1]&15|(m&65535)<<4;if((g|0)==(f|0)){i=j;return k|0}else{u=0;w=h}while(1){h=c[q>>2]|0;m=a[h+(u+g)|0]|0;a[h+w|0]=48;if((m&255)>49){h=(c[q>>2]|0)+w|0;a[h]=(a[h]|0)+5&255;x=m-50&255}else{x=m}if((x&255)>29){m=(c[q>>2]|0)+w|0;a[m]=(a[m]|0)+3&255;y=x-30&255}else{y=x}if((y&255)>19){m=(c[q>>2]|0)+w|0;a[m]=(a[m]|0)+2&255;z=y-20&255}else{z=y}if((z&255)>9){m=(c[q>>2]|0)+w|0;a[m]=(a[m]|0)+1&255;A=z-10&255}else{A=z}B=c[q>>2]|0;if((d[B+w|0]|0)>=58){C=152;break}if((A&255)>=10){C=154;break}a[B+(w+1)|0]=A+48&255;m=u+1|0;if(m>>>0<k>>>0){u=m;w=w+2|0}else{C=160;break}}if((C|0)==152){A=c[o>>2]|0;q=dW(B,b[l>>1]>>4<<16>>16)|0;ar(A|0,7200,(v=i,i=i+72|0,c[v>>2]=6640,c[v+8>>2]=308,c[v+16>>2]=8448,c[v+24>>2]=6864,c[v+32>>2]=f,c[v+40>>2]=g,c[v+48>>2]=u,c[v+56>>2]=w,c[v+64>>2]=q,v)|0)|0;i=j;return k|0}else if((C|0)==154){q=c[o>>2]|0;A=dW(B,b[l>>1]>>4<<16>>16)|0;ar(q|0,7200,(v=i,i=i+72|0,c[v>>2]=6640,c[v+8>>2]=311,c[v+16>>2]=8448,c[v+24>>2]=6624,c[v+32>>2]=f,c[v+40>>2]=g,c[v+48>>2]=u,c[v+56>>2]=w,c[v+64>>2]=A,v)|0)|0;i=j;return k|0}else if((C|0)==160){i=j;return k|0}return 0}function dZ(b){b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,p=0,q=0,r=0,s=0,t=0,u=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;e=i;f=b|0;g=a[f]|0;h=g&255;j=b+216|0;k=(c[j>>2]|0)-(c[b+4+((h+7&15)<<2)>>2]|0)|0;c[j>>2]=k;l=b+4+((h&15)<<2)|0;c[j>>2]=(c[l>>2]|0)+k;k=b+212|0;h=c[k>>2]|0;if((h&65536|0)!=0){if((g&1)==0){m=0;i=e;return m|0}g=d_(b)|0;if((g<<24>>24|0)==25){c[k>>2]=c[k>>2]^1}else if((g<<24>>24|0)!=43){m=0;i=e;return m|0}g=c[b+4+(((d[f]|0)+7&15)<<2)>>2]|0;do{if((g|0)!=0){if(g>>>0<(c[j>>2]|0)>>>1>>>0){m=0}else{break}i=e;return m|0}}while(0);c[k>>2]=c[k>>2]&-131071|18;m=1;i=e;return m|0}g=(h>>>1)+1&15;f=g<<1|h&-31;c[k>>2]=f;if(g>>>0<9){m=0;i=e;return m|0}if((g|0)==10){g=c[l>>2]|0;l=h<<15>>20;do{if((l|0)!=0){n=b+84|0;p=c[n>>2]|0;if((a[p+(l-1)|0]|0)!=43){break}q=(l<<5)+131040|0;r=f&-131041|q&131040;c[k>>2]=r;if((g|0)==0){s=174}else{if(g>>>0>=(c[b+220>>2]|0)>>>1>>>0){s=174}}do{if((s|0)==174){t=q<<15;u=t>>20;if((u|0)<(c[b+228>>2]|0)){break}w=c[b+232>>2]|0;if((w|0)>0&(u|0)>(w|0)){break}L271:do{if((h&1|0)!=0&(t|0)>1048576){w=0;x=u;y=p;while(1){z=x+~w|0;A=y+w|0;B=a[A]|0;a[A]=a[y+z|0]|0;a[(c[n>>2]|0)+z|0]=B;B=w+1|0;z=c[k>>2]|0;A=z<<15>>20;if((B|0)>=((A|0)/2|0|0)){C=z;break L271}w=B;x=A;y=c[n>>2]|0}}else{C=r}}while(0);if((C<<15>>20|0)>0){u=0;while(1){t=(c[n>>2]|0)+u|0;y=a[t]|0;if((y&255)<43){D=a[1296+(y&255)|0]|0}else{D=63}a[t]=D;t=u+1|0;if((t|0)<(c[k>>2]<<15>>20|0)){u=t}else{E=t;break}}}else{E=0}c[b+80>>2]=E;a[(c[n>>2]|0)+E|0]=0;c[k>>2]=c[k>>2]|131040;m=39;i=e;return m|0}}while(0);c[k>>2]=f|131040;c[b+72>>2]=0;m=0;i=e;return m|0}}while(0);if(g>>>0>(c[b+220>>2]|0)>>>1>>>0){c[b+72>>2]=0;g=f|131040;c[k>>2]=g;F=g}else{F=f}c[k>>2]=F&-31;m=0;i=e;return m|0}else{F=d_(b)|0;f=c[k>>2]|0;do{if((f&131040|0)==0){g=b+72|0;if((c[g>>2]|0)==0){c[g>>2]=39;break}c[k>>2]=f|131040;m=1;i=e;return m|0}}while(0);g=F<<24>>24;L241:do{if(F<<24>>24<0){G=f}else{E=f<<15>>20;do{if((E|0)>31){D=E+1|0;C=b+76|0;h=c[C>>2]|0;if(h>>>0>D>>>0){break}if(D>>>0>256){G=f;break L241}s=h+16|0;if(s>>>0>D>>>0){H=s>>>0>256?256:s}else{H=D}D=b+84|0;s=ec(c[D>>2]|0,H)|0;if((s|0)==0){G=c[k>>2]|0;break L241}else{c[D>>2]=s;c[C>>2]=H;break}}}while(0);if(F<<24>>24<44){E=c[k>>2]|0;C=E<<15>>20;c[k>>2]=(C<<5)+32&131040|E&-131041;a[(c[b+84>>2]|0)+C|0]=F;m=0;i=e;return m|0}else{C=c[o>>2]|0;E=c[j>>2]|0;ar(C|0,3376,(v=i,i=i+48|0,c[v>>2]=6560,c[v+8>>2]=320,c[v+16>>2]=9536,c[v+24>>2]=4696,c[v+32>>2]=g,c[v+40>>2]=E,v)|0)|0;m=0;i=e;return m|0}}}while(0);c[b+72>>2]=0;c[k>>2]=G|131040;m=0;i=e;return m|0}return 0}function d_(b){b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,p=0,q=0,r=0,s=0,t=0,u=0,w=0,x=0;e=i;f=b+212|0;g=c[b+216>>2]|0;if(g>>>0<9){h=-1;i=e;return h|0}j=d[b|0]|0;k=0;l=0;while(1){m=(((((c[b+4+((j-(k&255)&15)<<2)>>2]|0)*72|0|1)>>>0)/(g>>>0)|0)+509|0)>>>1&255;n=m>>>0>32?255:m;if(n>>>0>7){h=-1;p=243;break}q=n>>>0>2|l<<1;r=k+1&255;if(q<<24>>24==-1){h=-1;p=244;break}if((r&255)<5){k=r;l=q}else{p=223;break}}if((p|0)==223){l=q&255;if((q&255)>=32){k=c[o>>2]|0;ar(k|0,3984,(v=i,i=i+48|0,c[v>>2]=6560,c[v+8>>2]=161,c[v+16>>2]=8912,c[v+24>>2]=3520,c[v+32>>2]=l,c[v+40>>2]=g,v)|0)|0;h=-1;i=e;return h|0}k=a[1128+l|0]|0;n=k&255;if((-325007360>>>(l>>>0)&1|0)!=0){h=-1;i=e;return h|0}L308:do{if((r&255)<9){l=r;m=q;while(1){s=(((((c[b+4+((j-(l&255)&15)<<2)>>2]|0)*72|0|1)>>>0)/(g>>>0)|0)+509|0)>>>1&255;t=s>>>0>32?255:s;if(t>>>0>7){h=-1;p=247;break}s=t>>>0>2|m<<1;t=l+1&255;if(s<<24>>24==-1){h=-1;p=248;break}if((t&255)<9){l=t;m=s}else{u=s;break L308}}if((p|0)==247){i=e;return h|0}else if((p|0)==248){i=e;return h|0}}else{u=q}}while(0);q=n&192;if((q|0)==128){w=((u&255)>>>3&1)+(k&63)&255}else if((q|0)==192){w=((u&255)>>>2&1)+(k&63)&255}else if((q|0)==0){w=k}else{w=((u&255)>>>2&3)+(k&63)&255}k=w&255;if((w&255)>=44){w=c[o>>2]|0;q=u&255;ar(w|0,3016,(v=i,i=i+56|0,c[v>>2]=6560,c[v+8>>2]=181,c[v+16>>2]=8912,c[v+24>>2]=2672,c[v+32>>2]=k,c[v+40>>2]=q,c[v+48>>2]=g,v)|0)|0;h=-1;i=e;return h|0}if(u<<24>>24!=(a[1160+(k*3|0)|0]|0)){h=-1;i=e;return h|0}c[b+220>>2]=g;if((c[f>>2]&1|0)==0){x=1162+(k*3|0)|0}else{x=1161+(k*3|0)|0}h=a[x]|0;i=e;return h|0}else if((p|0)==243){i=e;return h|0}else if((p|0)==244){i=e;return h|0}return 0}function d$(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,p=0,q=0,r=0,s=0,t=0,u=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,as=0,at=0,au=0,av=0,aw=0,ax=0,ay=0,az=0,aA=0,aB=0,aC=0,aD=0,aE=0,aF=0,aG=0,aH=0,aI=0,aJ=0,aK=0,aL=0,aM=0,aN=0,aO=0,aP=0,aQ=0,aR=0,aS=0,aT=0,aU=0,aV=0,aW=0,aX=0,aY=0,aZ=0,a_=0,a$=0,a0=0,a1=0,a2=0,a3=0,a4=0,a5=0,a6=0,a7=0,a8=0,a9=0,ba=0,bb=0;d=i;e=b|0;f=a[e]|0;g=f&3;h=f&255;f=b+96|0;j=b+140|0;k=(c[j>>2]|0)-(c[b+4+((h+12&15)<<2)>>2]|0)|0;c[j>>2]=k;c[j>>2]=(c[b+4+((h&15)<<2)>>2]|0)+k;k=b+168|0;h=b+164|0;l=b+128|0;m=b+132|0;n=b+156|0;p=b+144|0;q=b+145|0;r=b+146|0;s=b+147|0;t=b+148|0;u=b+149|0;x=u;y=b+153|0;z=b+154|0;A=b+155|0;B=b+150|0;C=b+151|0;D=C;E=b+136|0;F=b+104|0;G=f|0;H=b+120|0;I=b+112|0;J=b+72|0;K=b+84|0;L=b+180|0;M=b+172|0;N=b+176|0;O=b+184|0;P=b+80|0;Q=b+157|0;R=b+152|0;S=0;T=0;while(1){U=S&255;V=b+96+(U<<3)|0;W=a[V]|0;L339:do{if(W<<24>>24>-1|S<<24>>24==g<<24>>24){X=W+1&255;a[V]=X;Y=X&31;Z=X&1;_=a[e]|0;$=(_&1)==0;do{if($){if((Y-16&255)>=2){ab=262;break}if((c[k>>2]&1|0)==0){ab=262;break}if((d0(b,Z)|0)<<24>>24!=0){ab=262;break}ac=b+96+(U<<3)+2|0;ad=a[ac]|0;ae=b+96+(U<<3)+3|0;af=a[ae]|0;ag=b+96+(U<<3)+4|0;ah=a[ag]|0;ai=b+96+(U<<3)+5|0;aj=a[ai]|0;ak=(af&255)>>>2&4|(ad&255)>>>1&8|(ah&255)>>>3&2|(aj&255)>>>4&1;if(!((ak<<24>>24|0)==0|(ak<<24>>24|0)==15)){ab=304;break}al=ak<<24>>24!=0;if((al&1^1|0)==(Z&255|0)){a[ac]=aj;a[ai]=ad;a[ae]=ah;a[ag]=af}am=al?8:4104}else{ab=262}}while(0);do{if((ab|0)==262){ab=0;L352:do{if((X&3)==0&(Y&255)<21){al=c[j>>2]|0;if((al|0)==0){an=T;break L339}L355:do{if(X<<24>>24==0){af=_&255;ag=c[b+4+((af+11&15)<<2)>>2]|0;ah=c[b+4+((af+10&15)<<2)>>2]|0;L357:do{if((((((ah+ag|0)*14|0|1)>>>0)/(al>>>0)|0)+509&510|0)==0){ae=((((((c[b+4+((af+12&15)<<2)>>2]|0)+ag|0)*14|0|1)>>>0)/(al>>>0)|0)+509|0)>>>1&255;ad=ae>>>0>3?-1:ae;ae=ad&255;do{if($){if(ae<<24>>24!=0){break L357}if(((((((c[b+4+((af+9&15)<<2)>>2]|0)+ah|0)*14|0|1)>>>0)/(al>>>0)|0)+509&510|0)==0){ao=0}else{break L357}}else{ai=c[b+4+((af+9&15)<<2)>>2]|0;if((ai|0)!=0){if(ai>>>0<(al*3|0)>>>2>>>0){break L357}}if(ae<<24>>24==0){ao=0;break}if((ad&255|0)==1){ao=64}else{break L357}}}while(0);a[V]=ao;ap=0;aq=a[e]|0;break L355}}while(0);a[V]=-1;an=T;break L339}else{ap=Y;aq=_}}while(0);af=aq&1;ah=af<<24>>24==0;ag=aq&255;if(ah){ad=c[b+4+((ag+14&15)<<2)>>2]|0;as=(c[b+4+((ag+13&15)<<2)>>2]|0)+ad|0;at=c[b+4+((ag+15&15)<<2)>>2]|0;au=ad}else{ad=c[b+4+((ag+15&15)<<2)>>2]|0;as=ad+(c[b+4+((ag&15)<<2)>>2]|0)|0;at=ad;au=c[b+4+((ag+14&15)<<2)>>2]|0}ad=at+au|0;ae=((((as*14|0|1)>>>0)/(al>>>0)|0)+509|0)>>>1&255;ai=((((ad*14|0|1)>>>0)/(al>>>0)|0)+509|0)>>>1;aj=(((ai&252)>>>0>3?255:ai)|(ae>>>0>3?252:ae<<2))&255;ae=aj<<24>>24;do{if(aj<<24>>24>=0){ai=1<<ae;do{if((ai&1632|0)==0){av=aj}else{if(ah){aw=(c[b+4+((ag+13&15)<<2)>>2]|0)+at|0}else{aw=(c[b+4+((ag&15)<<2)>>2]|0)+au|0}if((aw*7|0)>>>0<=(aa((ai&1056|0)!=0?3:4,al)|0)>>>0){av=aj;break}av=(ae>>>1&3|16)&255}}while(0);if(av<<24>>24>=20){ai=av<<24>>24;ac=c[o>>2]|0;ak=af&255;ar(ac|0,2264,(v=i,i=i+72|0,c[v>>2]=6536,c[v+8>>2]=227,c[v+16>>2]=8736,c[v+24>>2]=1912,c[v+32>>2]=ai,c[v+40>>2]=as,c[v+48>>2]=ad,c[v+56>>2]=al,c[v+64>>2]=ak,v)|0)|0;break}if(av<<24>>24<0){break}a[((ap&255)>>>2)+1+(b+96+(U<<3)+1)|0]=a[816+(av&255)|0]|0;ax=ap;break L352}}while(0);a[V]=-1;ax=ap}else{ax=Y}}while(0);if((a[e]&1)!=0){an=T;break L339}if((ax-24&255)>=2){an=T;break L339}if((d0(b,Z)|0)<<24>>24!=0){ab=304;break}al=b+96+(U<<3)+2|0;ad=a[al]|0;af=ad&16;if(Z<<24>>24==0){ae=a[b+96+(U<<3)+3|0]|0;aj=a[b+96+(U<<3)+4|0]|0;ag=a[b+96+(U<<3)+5|0]|0;ah=a[b+96+(U<<3)+6|0]|0;ak=a[b+96+(U<<3)+7|0]|0;ay=ak;az=ae;aA=ah;aB=aj;aC=ag;aD=((ae&255)>>>3&2|af>>>4|(aj&255)>>>2&4|(ag&255)>>>1&8|ah&16|(ak&255)<<1&32)&255}else{ak=a[b+96+(U<<3)+3|0]|0;ah=a[b+96+(U<<3)+4|0]|0;ag=a[b+96+(U<<3)+5|0]|0;aj=a[b+96+(U<<3)+6|0]|0;ae=a[b+96+(U<<3)+7|0]|0;ay=ae;az=ak;aA=aj;aB=ah;aC=ag;aD=(ak&16|af<<1|(ah&255)>>>1&8|(ag&255)>>>2&4|(aj&255)>>>3&2|(ae&255)>>>4&1)&255}ae=aD&255;aj=a[136+(ae>>>1)|0]|0;ag=((ae&1|0)==0?aj:(aj&255)>>>4)&15;a[b+96+(U<<3)+1|0]=ag;if(ag<<24>>24==15){ab=304;break}ag=aD<<24>>24!=0;if((ag&1^1|0)==(Z&255|0)){a[al]=ay;a[b+96+(U<<3)+7|0]=ad;a[b+96+(U<<3)+3|0]=aA;a[b+96+(U<<3)+6|0]=az;a[b+96+(U<<3)+4|0]=aC;a[b+96+(U<<3)+5|0]=aB}if((c[h>>2]&1|0)!=0){if(!ag){am=4109;break}if((ae&32|0)!=0){am=13;break}}if(aD<<24>>24==0){ab=304;break}if((ae&32|0)==0){am=9}else{ab=304}}}while(0);if((ab|0)==304){ab=0;a[V]=-1;an=T;break}a[V]=-1;Z=c[l>>2]|0;if((Z|0)==0){ab=307}else{if((am&13|0)==(Z|0)){ab=307}else{ab=309}}do{if((ab|0)==307){ab=0;Y=c[m>>2]|0;if((Y|0)==0){aE=Z;aF=0;break}if((am&13|0)==(Y|0)){aE=Z;aF=Y}else{ab=309}}}while(0);if((ab|0)==309){ab=0;c[E>>2]=0;c[m>>2]=0;c[l>>2]=0;aE=0;aF=0}do{if((am&4096|0)==0){if((am|0)!=9){Z=(am|0)==13;Y=Z?6:3;_=Y;$=Z?6:4;Z=Y&255;Y=aE;while(1){X=a[($<<24>>24)+(b+96+(U<<3)+1)|0]&15;ae=b+144+Z|0;do{if((Y|0)!=0){if((a[ae]|0)==(X&255|0)){break}c[E>>2]=0;c[m>>2]=0;c[l>>2]=0}}while(0);a[ae]=X;ag=_-1&255;if(ag<<24>>24<=-1){break}_=ag;$=$-1&255;Z=ag<<24>>24;Y=c[l>>2]|0}c[l>>2]=am;aG=am;ab=336;break}a[n]=a[b+96+(U<<3)+1|0]|0;Y=a[b+96+(U<<3)+7|0]&15;a[p]=0;a[q]=0;a[r]=a[b+96+(U<<3)+2|0]&15;a[s]=a[b+96+(U<<3)+3|0]&15;do{if((Y&255)<3){a[t]=Y;w=0;a[x]=w&255;w=w>>8;a[x+1|0]=w&255;w=w>>8;a[x+2|0]=w&255;w=w>>8;a[x+3|0]=w&255;aH=a[b+96+(U<<3)+4|0]&15;ab=333}else{a[t]=a[b+96+(U<<3)+4|0]&15;if((Y&255)<4){w=0;a[x]=w&255;w=w>>8;a[x+1|0]=w&255;w=w>>8;a[x+2|0]=w&255;w=w>>8;a[x+3|0]=w&255;aH=0;ab=333;break}a[u]=a[b+96+(U<<3)+5|0]&15;if((Y&255)<5){a[B]=0;w=0;a[D]=w&255;w=w>>8;a[D+1|0]=w&255;w=w>>8;a[D+2|0]=w&255;w=w>>8;a[D+3|0]=w&255;ab=334;break}else{a[B]=a[b+96+(U<<3)+6|0]&15;w=0;a[D]=w&255;w=w>>8;a[D+1|0]=w&255;w=w>>8;a[D+2|0]=w&255;w=w>>8;a[D+3|0]=w&255;aI=Y;break}}}while(0);if((ab|0)==333){ab=0;a[y]=aH;a[z]=a[b+96+(U<<3)+5|0]&15;ab=334}if((ab|0)==334){ab=0;aI=a[b+96+(U<<3)+6|0]&15}a[A]=aI;aJ=9;ab=339}else{Y=am&13;Z=(Y|0)==13;$=Z?12:7;_=Z?6:4;Z=aF;while(1){ag=a[(_<<24>>24)+(b+96+(U<<3)+1)|0]&15;ad=($<<24>>24)+(b+144)|0;do{if((Z|0)!=0){if((a[ad]|0)==(ag&255|0)){break}c[E>>2]=0;c[m>>2]=0;c[l>>2]=0}}while(0);a[ad]=ag;X=_-1&255;if(X<<24>>24==0){break}$=$-1&255;_=X;Z=c[m>>2]|0}c[m>>2]=Y;aG=Y;ab=336}}while(0);if((ab|0)==336){ab=0;if((aG&255|0)==9){aK=aG}else{Z=c[m>>2]&c[l>>2];aK=(Z|0)!=0?Z:1}if((aK&-5|0)==9){aJ=aK;ab=339}else{aL=aK}}if((ab|0)==339){ab=0;if((d2(f,12)|0)<<24>>24==0){aL=aJ}else{an=0;break}}do{if((aL|0)==8){if((d2(f,7)|0)<<24>>24==0){aM=8;ab=355}else{an=0;break L339}}else if((aL|0)==13){Z=a[p]|0;if((Z<<24>>24|0)==0){if((c[M>>2]&1|0)==0){aN=13;ab=353;break}else{aM=12;ab=355;break}}else if((Z<<24>>24|0)!=9){aN=13;ab=353;break}if((a[q]|0)!=7){aN=13;ab=353;break}Z=a[r]|0;if(Z<<24>>24==8){if((c[L>>2]&1|0)!=0){aM=10;ab=355;break}}else{if((Z-8&255)>=2){aN=13;ab=353;break}}aO=(c[O>>2]&1)+13|0;ab=354}else if((aL|0)==9){if((c[N>>2]&1|0)!=0){a[q]=0;a[p]=0;a[r]=a[b+96+(U<<3)+2|0]&15;a[s]=a[b+96+(U<<3)+3|0]&15;a[t]=a[b+96+(U<<3)+4|0]&15;a[u]=a[b+96+(U<<3)+5|0]&15;a[B]=a[b+96+(U<<3)+6|0]&15;a[C]=a[b+96+(U<<3)+7|0]&15;a[R]=a[b+96+(U<<3)+1|0]&15;aN=9;ab=353;break}if((c[M>>2]&1|0)!=0){aM=12;ab=355;break}aO=(c[h>>2]&1|0)==0?0:13;ab=354}else{aO=aL;ab=354}}while(0);if((ab|0)==353){ab=0;aM=aN;ab=355}else if((ab|0)==354){ab=0;if(aO>>>0>1){aM=aO;ab=355}else{aP=aO}}if((ab|0)==355){ab=0;aP=c[E>>2]|aM}if((aP|0)==0){an=0;break}a[F]=-1;a[G]=-1;a[H]=-1;a[I]=-1;if(aP>>>0<=1){an=1;break}if((c[J>>2]|0)!=0){an=1;break}c[J>>2]=13;Z=aP&255;do{if(Z>>>0>1){do{if((Z|0)==12){aQ=1;ab=364}else if((Z|0)==9){aR=1;aS=8;ab=365}else if((Z|0)==14){aT=0;aU=13;ab=366}else{_=(Z|0)==10;$=_?3:0;if(_){aV=9;aW=$;break}if((Z|0)==12){aQ=$;ab=364;break}else if((Z|0)==9){aR=$;aS=9;ab=365;break}else if((Z|0)==14){aT=$;aU=14;ab=366;break}else if((Z|0)==13){aX=h;aY=$;aZ=13;ab=367;break}else if((Z|0)!=8){a_=Z;a$=$;ab=368;break}aX=k;aY=$;aZ=8;ab=367}}while(0);if((ab|0)==364){ab=0;aX=M;aY=aQ;aZ=12;ab=367}else if((ab|0)==365){ab=0;aX=N;aY=aR;aZ=aS;ab=367}else if((ab|0)==366){ab=0;aX=O;aY=aT;aZ=aU;ab=367}if((ab|0)==367){ab=0;if((c[aX>>2]&4|0)==0){a_=aZ;a$=aY;ab=368}else{aV=aZ;aW=aY}}if((ab|0)==368){ab=0;Y=a_-1|0;if((Y|0)==0){a0=0;break}else{aV=Y;aW=a$}}Y=aW;$=0;while(1){_=a[b+144+Y|0]|0;if(_<<24>>24<=-1){a1=$;break}a[(c[K>>2]|0)+$|0]=_+48&255;_=$+1|0;if(_>>>0<aV>>>0){Y=Y+1|0;$=_}else{a1=_;break}}if(!((Z|0)==10&(a1|0)==9)){a0=a1;break}if((c[L>>2]&4|0)==0){a0=9;break}else{a2=0;a3=10;a4=10}while(1){$=a[13-a4+(b+144)|0]|0;a5=$&255;if(($&255)>=10){ab=375;break}a6=(aa(a5,a4)|0)+a2|0;$=a3-1&255;if(($&255)>1){a2=a6;a3=$;a4=$&255}else{ab=377;break}}do{if((ab|0)==375){ab=0;$=c[o>>2]|0;Y=dW(p,18)|0;ar($|0,3304,(v=i,i=i+64|0,c[v>>2]=6536,c[v+8>>2]=418,c[v+16>>2]=8480,c[v+24>>2]=4664,c[v+32>>2]=a4,c[v+40>>2]=a5,c[v+48>>2]=a2,c[v+56>>2]=Y,v)|0)|0;a7=63}else if((ab|0)==377){ab=0;Y=(a6>>>0)%11|0;if((Y|0)==0){a7=48;break}$=11-Y|0;if($>>>0>=10){a7=88;break}a7=$+48&255}}while(0);a[(c[K>>2]|0)+9|0]=a7;a0=10}else{a0=0}}while(0);do{if((aP&1792|0)==0){a8=a0}else{Z=a[Q]|0;if(Z<<24>>24>-1){a9=13;ba=a0;bb=Z}else{a8=a0;break}while(1){a[(c[K>>2]|0)+ba|0]=bb+48&255;Z=a9+1|0;$=ba+1|0;Y=a[b+144+Z|0]|0;if(Y<<24>>24>-1){a9=Z;ba=$;bb=Y}else{a8=$;break}}}}while(0);c[P>>2]=a8;a[(c[K>>2]|0)+a8|0]=0;an=aP}else{an=T}}while(0);U=S+1&255;if((U&255)<4){S=U;T=an}else{break}}i=d;return an|0}function d0(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;e=b&255;f=d[a|0]|0;g=(c[a+4+((f-(b+5&255)&15)<<2)>>2]|0)+(c[a+4+((f-(b+4&255)&15)<<2)>>2]|0)+(c[a+4+((f-(b+6&255)&15)<<2)>>2]|0)+(c[a+4+((f-(b+7&255)&15)<<2)>>2]|0)|0;h=c[a+4+((f&15)<<2)>>2]|0;do{if(!(b<<24>>24!=0|(h|0)==0)){if(h>>>0<(g*3|0)>>>2>>>0){i=-1}else{break}return i|0}}while(0);h=e+3|0;e=1-b&255;b=0;while(1){j=e&255;if(j>>>0>=h>>>0){i=b;k=394;break}l=e+1&255;m=((((((c[a+4+((f-(l&255)&15)<<2)>>2]|0)+(c[a+4+((f-j&15)<<2)>>2]|0)|0)*14|0|1)>>>0)/(g>>>0)|0)+509|0)>>>1;j=(((m&252)>>>0>3?255:m)|b<<24>>24<<2)&255;if(j<<24>>24<0){i=-1;k=395;break}else{e=l;b=j}}if((k|0)==395){return i|0}else if((k|0)==394){return i|0}return 0}function d1(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;e=c[a+192>>2]|0;if(e>>>0<10){f=-1;return f|0}g=(d[a|0]|0)-(b&255)|0;L538:do{if((c[a+188>>2]&1|0)==0){b=0;h=0;i=8;while(1){j=(((((c[a+4+((g+(i+8)&15)<<2)>>2]|0)*90|0|1)>>>0)/(e>>>0)|0)+509|0)>>>1;k=(j&254)>>>0>41?255:j&255;if(k>>>0>7){f=-1;l=417;break}j=k>>>0>2|0;k=j|b<<1;if(k<<24>>24==-1){f=-1;l=411;break}m=j+h&255;j=(i<<24)-33554432|0;if((j|0)>-16777216){b=k;h=m;i=j>>24}else{n=k;o=m;break L538}}if((l|0)==411){return f|0}else if((l|0)==417){return f|0}}else{i=0;h=0;b=8;while(1){m=(((((c[a+4+((g-b&15)<<2)>>2]|0)*90|0|1)>>>0)/(e>>>0)|0)+509|0)>>>1;k=(m&254)>>>0>41?255:m&255;if(k>>>0>7){f=-1;l=412;break}m=k>>>0>2|0;k=m|i<<1;if(k<<24>>24==-1){f=-1;l=413;break}j=m+h&255;m=(b<<24)-33554432|0;if((m|0)>-16777216){i=k;h=j;b=m>>24}else{n=k;o=j;break L538}}if((l|0)==412){return f|0}else if((l|0)==413){return f|0}}}while(0);if(o<<24>>24!=2){f=-1;return f|0}o=n&15;do{if((n&8)==0){p=o}else{if(o<<24>>24==12){p=0;break}l=o-1&255;if((l&255)>9){f=-1}else{p=l;break}return f|0}}while(0);f=p;return f|0}function d2(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,p=0,q=0,r=0,s=0;e=i;do{if((d|0)>0){f=0;g=0;h=0;while(1){j=a[b+48+h|0]|0;if((j&255)>=10){k=420;break}l=j+g&255;if(((h^d)&1|0)==0){m=l}else{n=l+(j<<1)&255;m=(n&255)>19?n-20&255:n}p=(m&255)>9?m-10&255:m;n=f+1&255;l=n&255;if((l|0)<(d|0)){f=n;g=p;h=l}else{break}}if((k|0)==420){f=j&255;l=c[o>>2]|0;n=g&255;q=dW(b+48|0,18)|0;ar(l|0,3912|0,(v=i,i=i+64|0,c[v>>2]=6536,c[v+8>>2]=386,c[v+16>>2]=8680,c[v+24>>2]=4664,c[v+32>>2]=h,c[v+40>>2]=f,c[v+48>>2]=n,c[v+56>>2]=q,v)|0)|0;r=-1;i=e;return r|0}if((p&255)<10){s=p;break}q=c[o>>2]|0;n=dW(b+48|0,18)|0;ar(q|0,3456|0,(v=i,i=i+56|0,c[v>>2]=6536,c[v+8>>2]=397,c[v+16>>2]=8680,c[v+24>>2]=3e3,c[v+32>>2]=p&255,c[v+40>>2]=d,c[v+48>>2]=n,v)|0)|0;r=-1;i=e;return r|0}else{s=0}}while(0);p=s<<24>>24==0?0:10-s&255;s=a[b+48+d|0]|0;if((s&255)<10){r=(p<<24>>24!=s<<24>>24)<<31>>31;i=e;return r|0}else{j=s&255;s=c[o>>2]|0;k=p&255;p=dW(b+48|0,18)|0;ar(s|0,2600|0,(v=i,i=i+64|0,c[v>>2]=6536,c[v+8>>2]=402,c[v+16>>2]=8680,c[v+24>>2]=4664,c[v+32>>2]=d,c[v+40>>2]=j,c[v+48>>2]=k,c[v+56>>2]=p,v)|0)|0;r=-1;i=e;return r|0}return 0}function d3(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;d=a[b|0]|0;e=d&255;f=b+4+((e+6&15)<<2)|0;g=b+192|0;h=(c[g>>2]|0)-(c[f>>2]|0)|0;c[g>>2]=h;i=b+4+((e&15)<<2)|0;j=(c[i>>2]|0)+h|0;c[g>>2]=j;g=b+188|0;h=c[g>>2]|0;if((h&65536|0)==0){k=h}else{if(j>>>0<10){l=0;return l|0}m=(((((c[f>>2]|0)*90|0|1)>>>0)/(j>>>0)|0)+509|0)>>>1;f=(m&254)>>>0>41?255:m&255;if(f>>>0>7){n=-2}else{n=(f>>>0>2)<<1}f=(((((c[b+4+((e+5&15)<<2)>>2]|0)*90|0|1)>>>0)/(j>>>0)|0)+509|0)>>>1;m=(f&254)>>>0>41?255:f&255;if(m>>>0>7){o=-2}else{o=(m>>>0>2|n)<<1}n=(((((c[b+4+((e+4&15)<<2)>>2]|0)*90|0|1)>>>0)/(j>>>0)|0)+509|0)>>>1;m=(n&254)>>>0>41?255:n&255;if(m>>>0>7){p=-1}else{p=m>>>0>2|o}do{if((d&1)==0){o=(((((c[b+4+((e+3&15)<<2)>>2]|0)*90|0|1)>>>0)/(j>>>0)|0)+509|0)>>>1;m=(o&254)>>>0>41?255:o&255;if(m>>>0>7){l=0;return l|0}if((m>>>0>2|p<<1)<<24>>24==0){q=14;break}else{l=0}return l|0}else{if(p<<24>>24==4){q=13;break}else{l=0}return l|0}}while(0);p=c[b+4+((e-q&15)<<2)>>2]|0;do{if((p|0)!=0){if(p>>>0<(j*3|0)>>>3>>>0){l=0}else{break}return l|0}}while(0);p=e&1|h&-131072|2;c[g>>2]=p;k=p}p=(k>>>1)+15&15;h=p<<1|k&-31;c[g>>2]=h;if((p|0)==(6-(k&1)|0)){q=c[i>>2]|0;i=c[b+196>>2]|0;do{if((q|0)!=0){if(q>>>0<(i*3|0)>>>3>>>0){l=0}else{break}return l|0}}while(0);if((((((((c[b+4+((e+15&15)<<2)>>2]|0)*90|0|1)>>>0)/(i>>>0)|0)+509|0)>>>1&255)-3|0)>>>0<39){l=0;return l|0}if((((((((c[b+4+((e+14&15)<<2)>>2]|0)*90|0|1)>>>0)/(i>>>0)|0)+509|0)>>>1&255)-3|0)>>>0<39){l=0;return l|0}q=(((((c[b+4+((e+13&15)<<2)>>2]|0)*90|0|1)>>>0)/(i>>>0)|0)+509|0)>>>1;d=(q&254)>>>0>41?255:q&255;do{if((k&1|0)==0){if((d-3|0)>4){l=0}else{r=h;break}return l|0}else{if(d>>>0>2){l=0;return l|0}if((((((((c[b+4+((e+12&15)<<2)>>2]|0)*90|0|1)>>>0)/(i>>>0)|0)+509|0)>>>1&255)-3|0)>>>0<39){l=0;return l|0}q=k<<15>>20;if((q|0)<=1){r=h;break}m=b+84|0;o=0;n=q;while(1){q=n+~o|0;f=c[m>>2]|0;s=f+o|0;t=a[s]|0;a[s]=a[f+q|0]|0;a[(c[m>>2]|0)+q|0]=t;t=o+1|0;q=c[g>>2]|0;f=q<<15>>20;if((t|0)<((f|0)/2|0|0)){o=t;n=f}else{r=q;break}}}}while(0);i=r<<15>>20;do{if((i|0)>=(c[b+204>>2]|0)){e=c[b+208>>2]|0;if((e|0)>0&(i|0)>(e|0)){break}c[b+80>>2]=i;a[(c[b+84>>2]|0)+i|0]=0;c[g>>2]=c[g>>2]|131040;l=25;return l|0}}while(0);c[b+72>>2]=0;c[g>>2]=r|131040;l=0;return l|0}else{if((p|0)!=0){l=0;return l|0}c[b+196>>2]=j;do{if((k&131040|0)==0){j=b+72|0;if((c[j>>2]|0)==0){c[j>>2]=25;break}c[g>>2]=h|131040;l=1;return l|0}}while(0);j=d1(b,1)|0;L655:do{if((j&255)>9){u=h}else{p=k<<15>>20;do{if((p|0)>31){r=p+2|0;i=b+76|0;e=c[i>>2]|0;if(e>>>0>r>>>0){v=h;break}if(r>>>0>256){u=h;break L655}d=e+16|0;if(d>>>0>r>>>0){w=d>>>0>256?256:d}else{w=r}r=b+84|0;d=ec(c[r>>2]|0,w)|0;if((d|0)==0){u=c[g>>2]|0;break L655}else{c[r>>2]=d;c[i>>2]=w;v=c[g>>2]|0;break}}else{v=h}}while(0);p=v<<15>>20;c[g>>2]=(p<<5)+32&131040|v&-131041;i=b+84|0;a[(c[i>>2]|0)+p|0]=j+48&255;p=d1(b,0)|0;if((p&255)>9){c[b+72>>2]=0;c[g>>2]=c[g>>2]|131040;l=0;return l|0}else{d=c[g>>2]|0;r=d<<15>>20;c[g>>2]=(r<<5)+32&131040|d&-131041;a[(c[i>>2]|0)+r|0]=p+48&255;p=c[g>>2]|0;c[g>>2]=p&-31|20;l=(p&131040|0)==64|0;return l|0}}}while(0);c[b+72>>2]=0;c[g>>2]=u|131040;l=0;return l|0}return 0}function d4(b){b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0;e=i;i=i+32|0;f=e|0;g=e+16|0;h=c[b>>2]|0;j=0;k=0;while(1){if((1<<k&h|0)==0){l=j}else{l=d[352+k|0]^j}m=k+1|0;if((m|0)<15){j=l;k=m}else{break}}k=h&1;j=h&2;m=j<<2|k;n=(h&4|0)==0;o=n?m:m^12;m=h&8;p=(m|0)==0?o:o^10;o=(h&16|0)==0;q=h&32;r=(o?p:p^15)^q>>>5;p=h&64;s=(p|0)==0?r:r^8;r=(h&128|0)==0;t=r?s:s^12;s=(h&256|0)==0;u=s?t:t^10;t=h&512;v=h&1024;w=((t|0)==0?u:u^15)^v>>>10;u=(h&2048|0)==0;x=u?w:w^8;w=h&4096;y=(w|0)==0?x:x^12;x=(h&8192|0)==0;z=x?y:y^10;y=(h&16384|0)==0;A=y?z:z^15;z=(j|0)==0?k:k|6;k=(n?z:z^7)^m>>>3;m=o?k:k^6;k=((q|0)==0?m:m^7)^p>>>6;p=r?k:k^6;k=(s?p:p^7)^t>>>9;t=(v|0)==0?k:k^6;k=(u?t:t^7)^w>>>12;w=x?k:k^6;k=y?w:w^7;if((l|A|k|0)==0){B=0;i=e;return B|0}w=g|0;c[f>>2]=l;y=(l|0)==0;do{if(y){C=0;D=A;E=0;F=A}else{x=a[336+l|0]|0;t=a[336+(d[352+(x<<1)|0]|0)|0]|0;u=d[352+(t+x)|0]|0;x=u^A;if((A|0)==0){C=0;D=0;E=u;F=x;break}C=d[352+((a[336+A|0]|0)+t)|0]|0;D=A;E=u;F=x}}while(0);do{if((D|0)==(E|0)|(k|0)==(C|0)){c[f+4>>2]=0;G=0;H=0}else{A=d[352+((a[336+(C^k)|0]|0)+15-(a[336+F|0]|0))|0]|0;c[f+4>>2]=A;if(y){G=0;H=A;break}G=d[352+((a[336+A|0]|0)+(a[336+l|0]|0))|0]|0;H=A}}while(0);k=G^F;c[f+8>>2]=k;F=3;while(1){if((F|0)<=0){B=-1;I=542;break}G=F-1|0;if((c[f+(G<<2)>>2]|0)==0){F=G}else{break}}if((I|0)==542){i=e;return B|0}do{if((F|0)==1){c[w>>2]=a[336+l|0]|0;J=1;I=537}else{f=(H|0)==0;G=336+H|0;L702:do{if(y){if(f){C=0;E=0;while(1){if((d[352+((a[336+(d[352+(E<<1)|0]|0)|0]|0)+E)|0]|0)==(k|0)){c[g+(C<<2)>>2]=E;K=C+1|0}else{K=C}D=E+1|0;if((D|0)<15){C=K;E=D}else{L=K;break}}}else{E=0;C=0;while(1){if(((a[352+((a[G]|0)+C)|0]^a[352+((a[336+(d[352+(C<<1)|0]|0)|0]|0)+C)|0])&255|0)==(k|0)){c[g+(E<<2)>>2]=C;M=E+1|0}else{M=E}D=C+1|0;if((D|0)<15){E=M;C=D}else{L=M;break}}}}else{C=a[336+l|0]|0;if(f){E=0;D=0;while(1){A=a[336+(d[352+(D<<1)|0]|0)|0]|0;if(((a[352+(C+A)|0]^a[352+(A+D)|0])&255|0)==(k|0)){c[g+(E<<2)>>2]=D;N=E+1|0}else{N=E}A=D+1|0;if((A|0)<15){E=N;D=A}else{L=N;break L702}}}D=a[G]|0;E=0;A=0;while(1){x=a[336+(d[352+(A<<1)|0]|0)|0]|0;if(((a[352+(C+x)|0]^a[352+(x+A)|0]^a[352+(D+A)|0])&255|0)==(k|0)){c[g+(E<<2)>>2]=A;O=E+1|0}else{O=E}x=A+1|0;if((x|0)<15){E=O;A=x}else{L=O;break}}}}while(0);if((L|0)>=(F|0)&(L|0)>0){if((L|0)>0){J=L;I=537;break}else{P=h;Q=L;break}}else{B=-1;i=e;return B|0}}}while(0);if((I|0)==537){I=h;h=0;while(1){L=1<<c[g+(h<<2)>>2]^I;F=h+1|0;if((F|0)<(J|0)){I=L;h=F}else{P=L;Q=J;break}}}if((-(P>>>11&1)&2670^-(P>>>10&1)&1335^-(P>>>12&1)&4587^-(P>>>13&1)&9174^-(P>>>14&1)&17051|0)!=(P|0)){B=-1;i=e;return B|0}c[b>>2]=P;B=Q;i=e;return B|0}function d5(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;if(!((e|0)>0&(f|0)>0)){g=0;return g|0}h=d9(aa(f,e)|0)|0;i=e+7>>3;j=4;while(1){k=j+1|0;if((1<<j|0)>=(i|0)){l=j;break}if((k|0)<8){j=k}else{l=k;break}}j=f+7>>3;i=4;while(1){k=i+1|0;if((1<<i|0)>=(j|0)){m=i;break}if((k|0)<8){i=k}else{m=k;break}}i=1<<l;j=1<<m;k=d9(e<<2)|0;n=k;o=m-1|0;p=0;do{q=d[b+p|0]|0;c[n+(p<<2)>>2]=(q<<o)+q;p=p+1|0;}while((p|0)<(e|0));p=j>>1;if((p|0)>1){j=f-1|0;o=1;do{q=aa((o|0)>=(f|0)?j:o,e)|0;r=0;do{s=n+(r<<2)|0;c[s>>2]=(c[s>>2]|0)+(d[b+(r+q)|0]|0);r=r+1|0;}while((r|0)<(e|0));o=o+1|0;}while((o|0)<(p|0))}o=l-1|0;j=i>>1;i=m+l|0;l=e-1|0;m=f-1|0;L765:do{if((j|0)>1){r=0;while(1){q=c[n>>2]|0;s=1;t=(q<<o)+q|0;do{t=(c[n+(((s|0)>=(e|0)?l:s)<<2)>>2]|0)+t|0;s=s+1|0;}while((s|0)<(j|0));s=aa(r,e)|0;u=t;v=0;L771:while(1){w=v;while(1){if((w|0)>=(e|0)){break L771}x=w+s|0;a[h+x|0]=((d[b+x|0]|0)+3<<i>>>0<u>>>0)<<31>>31;y=w+1|0;if((y|0)<(e|0)){break}else{w=y}}x=w-j|0;z=w+j|0;u=(c[n+(((z|0)>=(e|0)?l:z)<<2)>>2]|0)+u-(c[n+(((x|0)>0?x:0)<<2)>>2]|0)|0;v=y}v=r+1|0;u=(v|0)<(f|0);if(!u){break L765}s=r-p|0;t=aa((s|0)>0?s:0,e)|0;s=r+p|0;x=aa((s|0)>=(f|0)?m:s,e)|0;s=0;z=q;while(1){c[n+(s<<2)>>2]=(d[b+(s+x)|0]|0)+(z-(d[b+(s+t)|0]|0));A=s+1|0;if((A|0)>=(e|0)){break}s=A;z=c[n+(A<<2)>>2]|0}if(u){r=v}else{break}}}else{r=0;while(1){z=c[n>>2]|0;s=aa(r,e)|0;t=(z<<o)+z|0;x=0;L785:while(1){q=x;while(1){if((q|0)>=(e|0)){break L785}A=q+s|0;a[h+A|0]=((d[b+A|0]|0)+3<<i>>>0<t>>>0)<<31>>31;B=q+1|0;if((B|0)<(e|0)){break}else{q=B}}w=q-j|0;A=q+j|0;t=(c[n+(((A|0)>=(e|0)?l:A)<<2)>>2]|0)+t-(c[n+(((w|0)>0?w:0)<<2)>>2]|0)|0;x=B}x=r+1|0;t=(x|0)<(f|0);if(!t){break L765}s=r-p|0;v=aa((s|0)>0?s:0,e)|0;s=r+p|0;u=aa((s|0)>=(f|0)?m:s,e)|0;s=0;w=z;while(1){c[n+(s<<2)>>2]=(d[b+(s+u)|0]|0)+(w-(d[b+(s+v)|0]|0));A=s+1|0;if((A|0)>=(e|0)){break}s=A;w=c[n+(A<<2)>>2]|0}if(t){r=x}else{break}}}}while(0);ea(k);g=h;return g|0}function d6(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;b=a+2052|0;d=c[b>>2]|0;e=a+2056|0;f=c[e>>2]|0;g=a+2060|0;h=(c[g>>2]|0)+1|0;c[g>>2]=h;g=d;d=h+f|0;f=0;while(1){h=a+1028+(f<<2)|0;i=c[h>>2]|0;j=(c[a+1028+(f+128<<2)>>2]|0)+(g<<13^g)|0;k=j+d+(c[a+1028+((i>>>2&255)<<2)>>2]|0)|0;c[h>>2]=k;h=(c[a+1028+((k>>>10&255)<<2)>>2]|0)+i|0;c[a+4+(f<<2)>>2]=h;i=f|1;k=a+1028+(i<<2)|0;l=c[k>>2]|0;m=(c[a+1028+(f+129<<2)>>2]|0)+(j>>>6^j)|0;j=m+h+(c[a+1028+((l>>>2&255)<<2)>>2]|0)|0;c[k>>2]=j;k=(c[a+1028+((j>>>10&255)<<2)>>2]|0)+l|0;c[a+4+(i<<2)>>2]=k;i=f|2;l=a+1028+(i<<2)|0;j=c[l>>2]|0;h=(c[a+1028+(f+130<<2)>>2]|0)+(m<<2^m)|0;m=h+k+(c[a+1028+((j>>>2&255)<<2)>>2]|0)|0;c[l>>2]=m;l=(c[a+1028+((m>>>10&255)<<2)>>2]|0)+j|0;c[a+4+(i<<2)>>2]=l;i=f|3;j=a+1028+(i<<2)|0;m=c[j>>2]|0;k=(c[a+1028+(f+131<<2)>>2]|0)+(h>>>16^h)|0;h=k+l+(c[a+1028+((m>>>2&255)<<2)>>2]|0)|0;c[j>>2]=h;j=(c[a+1028+((h>>>10&255)<<2)>>2]|0)+m|0;c[a+4+(i<<2)>>2]=j;i=f+4|0;if((i|0)<128){g=k;d=j;f=i}else{n=k;o=j;p=128;break}}do{f=a+1028+(p<<2)|0;d=c[f>>2]|0;g=(c[a+1028+(p-128<<2)>>2]|0)+(n<<13^n)|0;j=g+o+(c[a+1028+((d>>>2&255)<<2)>>2]|0)|0;c[f>>2]=j;f=(c[a+1028+((j>>>10&255)<<2)>>2]|0)+d|0;c[a+4+(p<<2)>>2]=f;d=p|1;j=a+1028+(d<<2)|0;k=c[j>>2]|0;i=(c[a+1028+(p-127<<2)>>2]|0)+(g>>>6^g)|0;g=i+f+(c[a+1028+((k>>>2&255)<<2)>>2]|0)|0;c[j>>2]=g;j=(c[a+1028+((g>>>10&255)<<2)>>2]|0)+k|0;c[a+4+(d<<2)>>2]=j;d=p|2;k=a+1028+(d<<2)|0;g=c[k>>2]|0;f=(c[a+1028+(p-126<<2)>>2]|0)+(i<<2^i)|0;i=f+j+(c[a+1028+((g>>>2&255)<<2)>>2]|0)|0;c[k>>2]=i;k=(c[a+1028+((i>>>10&255)<<2)>>2]|0)+g|0;c[a+4+(d<<2)>>2]=k;d=p|3;g=a+1028+(d<<2)|0;i=c[g>>2]|0;n=(c[a+1028+(p-125<<2)>>2]|0)+(f>>>16^f)|0;f=n+k+(c[a+1028+((i>>>2&255)<<2)>>2]|0)|0;c[g>>2]=f;o=(c[a+1028+((f>>>10&255)<<2)>>2]|0)+i|0;c[a+4+(d<<2)>>2]=o;p=p+4|0;}while((p|0)<256);c[e>>2]=o;c[b>>2]=n;c[a>>2]=256;return}function d7(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;f=i;i=i+32|0;g=f|0;c[a+2060>>2]=0;c[a+2056>>2]=0;c[a+2052>>2]=0;h=g+28|0;c[h>>2]=-1640531527;j=g+24|0;c[j>>2]=-1640531527;k=g+20|0;c[k>>2]=-1640531527;l=g+16|0;c[l>>2]=-1640531527;m=g+12|0;c[m>>2]=-1640531527;n=g+8|0;c[n>>2]=-1640531527;o=g+4|0;c[o>>2]=-1640531527;p=g|0;c[p>>2]=-1640531527;q=0;do{r=0;while(1){s=r|1;t=g+(s<<2)|0;u=g+(r<<2)|0;v=c[t>>2]<<(d[328+r|0]|0)^c[u>>2];c[u>>2]=v;u=g+((r+3&7)<<2)|0;c[u>>2]=v+(c[u>>2]|0);v=r+2|0;w=g+((v&6)<<2)|0;x=(c[t>>2]|0)+(c[w>>2]|0)|0;c[t>>2]=x;y=(c[w>>2]|0)>>>((d[328+s|0]|0)>>>0)^x;c[t>>2]=y;t=g+((r+4&6)<<2)|0;c[t>>2]=y+(c[t>>2]|0);c[w>>2]=(c[w>>2]|0)+(c[u>>2]|0);if((v|0)<8){r=v}else{break}}q=q+1|0;}while((q|0)<4);q=(e|0)>1024?1024:e;e=q>>2;if((e|0)>0){r=0;while(1){v=r<<2;c[a+4+(r<<2)>>2]=(d[b+(v|2)|0]|0)<<16|(d[b+(v|3)|0]|0)<<24|(d[b+(v|1)|0]|0)<<8|(d[b+v|0]|0);v=r+1|0;if((v|0)<(e|0)){r=v}else{z=e;break}}}else{z=0}e=q&3;if((e|0)==0){A=z}else{q=z<<2;r=d[b+q|0]|0;v=a+4+(z<<2)|0;c[v>>2]=r;if(e>>>0>1){u=1;w=r;do{w=((d[b+(u|q)|0]|0)<<(u<<3))+w|0;c[v>>2]=w;u=u+1|0;}while((u|0)<(e|0))}A=z+1|0}ej(a+4+(A<<2)|0,0,256-A<<2|0);A=g;z=0;while(1){e=(c[p>>2]|0)+(c[a+4+(z<<2)>>2]|0)|0;c[p>>2]=e;c[o>>2]=(c[o>>2]|0)+(c[a+4+((z|1)<<2)>>2]|0);c[n>>2]=(c[n>>2]|0)+(c[a+4+((z|2)<<2)>>2]|0);c[m>>2]=(c[m>>2]|0)+(c[a+4+((z|3)<<2)>>2]|0);c[l>>2]=(c[l>>2]|0)+(c[a+4+((z|4)<<2)>>2]|0);c[k>>2]=(c[k>>2]|0)+(c[a+4+((z|5)<<2)>>2]|0);c[j>>2]=(c[j>>2]|0)+(c[a+4+((z|6)<<2)>>2]|0);c[h>>2]=(c[h>>2]|0)+(c[a+4+((z|7)<<2)>>2]|0);u=0;w=e;while(1){e=u|1;v=g+(e<<2)|0;q=c[v>>2]<<(d[328+u|0]|0)^w;c[g+(u<<2)>>2]=q;b=g+((u+3&7)<<2)|0;c[b>>2]=q+(c[b>>2]|0);q=u+2|0;r=g+((q&6)<<2)|0;t=(c[v>>2]|0)+(c[r>>2]|0)|0;c[v>>2]=t;y=(c[r>>2]|0)>>>((d[328+e|0]|0)>>>0)^t;c[v>>2]=y;v=g+((u+4&6)<<2)|0;c[v>>2]=y+(c[v>>2]|0);c[r>>2]=(c[r>>2]|0)+(c[b>>2]|0);if((q|0)>=8){break}u=q;w=c[g+(q<<2)>>2]|0}w=a+1028+(z<<2)|0;eg(w|0,A|0,32)|0;w=z+8|0;if((w|0)<256){z=w}else{B=0;break}}do{z=a+1028+(B<<2)|0;w=(c[p>>2]|0)+(c[z>>2]|0)|0;c[p>>2]=w;c[o>>2]=(c[o>>2]|0)+(c[a+1028+((B|1)<<2)>>2]|0);c[n>>2]=(c[n>>2]|0)+(c[a+1028+((B|2)<<2)>>2]|0);c[m>>2]=(c[m>>2]|0)+(c[a+1028+((B|3)<<2)>>2]|0);c[l>>2]=(c[l>>2]|0)+(c[a+1028+((B|4)<<2)>>2]|0);c[k>>2]=(c[k>>2]|0)+(c[a+1028+((B|5)<<2)>>2]|0);c[j>>2]=(c[j>>2]|0)+(c[a+1028+((B|6)<<2)>>2]|0);c[h>>2]=(c[h>>2]|0)+(c[a+1028+((B|7)<<2)>>2]|0);u=0;q=w;while(1){w=u|1;b=g+(w<<2)|0;r=c[b>>2]<<(d[328+u|0]|0)^q;c[g+(u<<2)>>2]=r;v=g+((u+3&7)<<2)|0;c[v>>2]=r+(c[v>>2]|0);r=u+2|0;y=g+((r&6)<<2)|0;t=(c[b>>2]|0)+(c[y>>2]|0)|0;c[b>>2]=t;e=(c[y>>2]|0)>>>((d[328+w|0]|0)>>>0)^t;c[b>>2]=e;b=g+((u+4&6)<<2)|0;c[b>>2]=e+(c[b>>2]|0);c[y>>2]=(c[y>>2]|0)+(c[v>>2]|0);if((r|0)>=8){break}u=r;q=c[g+(r<<2)>>2]|0}q=z;eg(q|0,A|0,32)|0;B=B+8|0;}while((B|0)<256);d6(a);i=f;return}function d8(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0;d=a|0;e=b-1|0;f=c[d>>2]|0;do{if((f|0)==0){d6(a);g=c[d>>2]|0}else{g=f}f=g-1|0;c[d>>2]=f;h=c[a+4+(f<<2)>>2]|0;i=(h>>>0)%(b>>>0)|0;an(e|0,h-i|0)|0;}while(E);return i|0}
function d9(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,ar=0,as=0,at=0,au=0,av=0,aw=0,ax=0,ay=0,az=0,aA=0,aB=0,aC=0,aD=0,aE=0,aF=0,aG=0,aH=0,aI=0,aJ=0,aK=0;do{if(a>>>0<245){if(a>>>0<11){b=16}else{b=a+11&-8}d=b>>>3;e=c[2552]|0;f=e>>>(d>>>0);if((f&3|0)!=0){g=(f&1^1)+d|0;h=g<<1;i=10248+(h<<2)|0;j=10248+(h+2<<2)|0;h=c[j>>2]|0;k=h+8|0;l=c[k>>2]|0;do{if((i|0)==(l|0)){c[2552]=e&~(1<<g)}else{if(l>>>0<(c[2556]|0)>>>0){aq();return 0}m=l+12|0;if((c[m>>2]|0)==(h|0)){c[m>>2]=i;c[j>>2]=l;break}else{aq();return 0}}}while(0);l=g<<3;c[h+4>>2]=l|3;j=h+(l|4)|0;c[j>>2]=c[j>>2]|1;n=k;return n|0}if(b>>>0<=(c[2554]|0)>>>0){o=b;break}if((f|0)!=0){j=2<<d;l=f<<d&(j|-j);j=(l&-l)-1|0;l=j>>>12&16;i=j>>>(l>>>0);j=i>>>5&8;m=i>>>(j>>>0);i=m>>>2&4;p=m>>>(i>>>0);m=p>>>1&2;q=p>>>(m>>>0);p=q>>>1&1;r=(j|l|i|m|p)+(q>>>(p>>>0))|0;p=r<<1;q=10248+(p<<2)|0;m=10248+(p+2<<2)|0;p=c[m>>2]|0;i=p+8|0;l=c[i>>2]|0;do{if((q|0)==(l|0)){c[2552]=e&~(1<<r)}else{if(l>>>0<(c[2556]|0)>>>0){aq();return 0}j=l+12|0;if((c[j>>2]|0)==(p|0)){c[j>>2]=q;c[m>>2]=l;break}else{aq();return 0}}}while(0);l=r<<3;m=l-b|0;c[p+4>>2]=b|3;q=p;e=q+b|0;c[q+(b|4)>>2]=m|1;c[q+l>>2]=m;l=c[2554]|0;if((l|0)!=0){q=c[2557]|0;d=l>>>3;l=d<<1;f=10248+(l<<2)|0;k=c[2552]|0;h=1<<d;do{if((k&h|0)==0){c[2552]=k|h;s=f;t=10248+(l+2<<2)|0}else{d=10248+(l+2<<2)|0;g=c[d>>2]|0;if(g>>>0>=(c[2556]|0)>>>0){s=g;t=d;break}aq();return 0}}while(0);c[t>>2]=q;c[s+12>>2]=q;c[q+8>>2]=s;c[q+12>>2]=f}c[2554]=m;c[2557]=e;n=i;return n|0}l=c[2553]|0;if((l|0)==0){o=b;break}h=(l&-l)-1|0;l=h>>>12&16;k=h>>>(l>>>0);h=k>>>5&8;p=k>>>(h>>>0);k=p>>>2&4;r=p>>>(k>>>0);p=r>>>1&2;d=r>>>(p>>>0);r=d>>>1&1;g=c[10512+((h|l|k|p|r)+(d>>>(r>>>0))<<2)>>2]|0;r=g;d=g;p=(c[g+4>>2]&-8)-b|0;while(1){g=c[r+16>>2]|0;if((g|0)==0){k=c[r+20>>2]|0;if((k|0)==0){break}else{u=k}}else{u=g}g=(c[u+4>>2]&-8)-b|0;k=g>>>0<p>>>0;r=u;d=k?u:d;p=k?g:p}r=d;i=c[2556]|0;if(r>>>0<i>>>0){aq();return 0}e=r+b|0;m=e;if(r>>>0>=e>>>0){aq();return 0}e=c[d+24>>2]|0;f=c[d+12>>2]|0;do{if((f|0)==(d|0)){q=d+20|0;g=c[q>>2]|0;if((g|0)==0){k=d+16|0;l=c[k>>2]|0;if((l|0)==0){v=0;break}else{w=l;x=k}}else{w=g;x=q}while(1){q=w+20|0;g=c[q>>2]|0;if((g|0)!=0){w=g;x=q;continue}q=w+16|0;g=c[q>>2]|0;if((g|0)==0){break}else{w=g;x=q}}if(x>>>0<i>>>0){aq();return 0}else{c[x>>2]=0;v=w;break}}else{q=c[d+8>>2]|0;if(q>>>0<i>>>0){aq();return 0}g=q+12|0;if((c[g>>2]|0)!=(d|0)){aq();return 0}k=f+8|0;if((c[k>>2]|0)==(d|0)){c[g>>2]=f;c[k>>2]=q;v=f;break}else{aq();return 0}}}while(0);L921:do{if((e|0)!=0){f=d+28|0;i=10512+(c[f>>2]<<2)|0;do{if((d|0)==(c[i>>2]|0)){c[i>>2]=v;if((v|0)!=0){break}c[2553]=c[2553]&~(1<<c[f>>2]);break L921}else{if(e>>>0<(c[2556]|0)>>>0){aq();return 0}q=e+16|0;if((c[q>>2]|0)==(d|0)){c[q>>2]=v}else{c[e+20>>2]=v}if((v|0)==0){break L921}}}while(0);if(v>>>0<(c[2556]|0)>>>0){aq();return 0}c[v+24>>2]=e;f=c[d+16>>2]|0;do{if((f|0)!=0){if(f>>>0<(c[2556]|0)>>>0){aq();return 0}else{c[v+16>>2]=f;c[f+24>>2]=v;break}}}while(0);f=c[d+20>>2]|0;if((f|0)==0){break}if(f>>>0<(c[2556]|0)>>>0){aq();return 0}else{c[v+20>>2]=f;c[f+24>>2]=v;break}}}while(0);if(p>>>0<16){e=p+b|0;c[d+4>>2]=e|3;f=r+(e+4)|0;c[f>>2]=c[f>>2]|1}else{c[d+4>>2]=b|3;c[r+(b|4)>>2]=p|1;c[r+(p+b)>>2]=p;f=c[2554]|0;if((f|0)!=0){e=c[2557]|0;i=f>>>3;f=i<<1;q=10248+(f<<2)|0;k=c[2552]|0;g=1<<i;do{if((k&g|0)==0){c[2552]=k|g;y=q;z=10248+(f+2<<2)|0}else{i=10248+(f+2<<2)|0;l=c[i>>2]|0;if(l>>>0>=(c[2556]|0)>>>0){y=l;z=i;break}aq();return 0}}while(0);c[z>>2]=e;c[y+12>>2]=e;c[e+8>>2]=y;c[e+12>>2]=q}c[2554]=p;c[2557]=m}n=d+8|0;return n|0}else{if(a>>>0>4294967231){o=-1;break}f=a+11|0;g=f&-8;k=c[2553]|0;if((k|0)==0){o=g;break}r=-g|0;i=f>>>8;do{if((i|0)==0){A=0}else{if(g>>>0>16777215){A=31;break}f=(i+1048320|0)>>>16&8;l=i<<f;h=(l+520192|0)>>>16&4;j=l<<h;l=(j+245760|0)>>>16&2;B=14-(h|f|l)+(j<<l>>>15)|0;A=g>>>((B+7|0)>>>0)&1|B<<1}}while(0);i=c[10512+(A<<2)>>2]|0;L969:do{if((i|0)==0){C=0;D=r;E=0}else{if((A|0)==31){F=0}else{F=25-(A>>>1)|0}d=0;m=r;p=i;q=g<<F;e=0;while(1){B=c[p+4>>2]&-8;l=B-g|0;if(l>>>0<m>>>0){if((B|0)==(g|0)){C=p;D=l;E=p;break L969}else{G=p;H=l}}else{G=d;H=m}l=c[p+20>>2]|0;B=c[p+16+(q>>>31<<2)>>2]|0;j=(l|0)==0|(l|0)==(B|0)?e:l;if((B|0)==0){C=G;D=H;E=j;break}else{d=G;m=H;p=B;q=q<<1;e=j}}}}while(0);if((E|0)==0&(C|0)==0){i=2<<A;r=k&(i|-i);if((r|0)==0){o=g;break}i=(r&-r)-1|0;r=i>>>12&16;e=i>>>(r>>>0);i=e>>>5&8;q=e>>>(i>>>0);e=q>>>2&4;p=q>>>(e>>>0);q=p>>>1&2;m=p>>>(q>>>0);p=m>>>1&1;I=c[10512+((i|r|e|q|p)+(m>>>(p>>>0))<<2)>>2]|0}else{I=E}if((I|0)==0){J=D;K=C}else{p=I;m=D;q=C;while(1){e=(c[p+4>>2]&-8)-g|0;r=e>>>0<m>>>0;i=r?e:m;e=r?p:q;r=c[p+16>>2]|0;if((r|0)!=0){p=r;m=i;q=e;continue}r=c[p+20>>2]|0;if((r|0)==0){J=i;K=e;break}else{p=r;m=i;q=e}}}if((K|0)==0){o=g;break}if(J>>>0>=((c[2554]|0)-g|0)>>>0){o=g;break}q=K;m=c[2556]|0;if(q>>>0<m>>>0){aq();return 0}p=q+g|0;k=p;if(q>>>0>=p>>>0){aq();return 0}e=c[K+24>>2]|0;i=c[K+12>>2]|0;do{if((i|0)==(K|0)){r=K+20|0;d=c[r>>2]|0;if((d|0)==0){j=K+16|0;B=c[j>>2]|0;if((B|0)==0){L=0;break}else{M=B;N=j}}else{M=d;N=r}while(1){r=M+20|0;d=c[r>>2]|0;if((d|0)!=0){M=d;N=r;continue}r=M+16|0;d=c[r>>2]|0;if((d|0)==0){break}else{M=d;N=r}}if(N>>>0<m>>>0){aq();return 0}else{c[N>>2]=0;L=M;break}}else{r=c[K+8>>2]|0;if(r>>>0<m>>>0){aq();return 0}d=r+12|0;if((c[d>>2]|0)!=(K|0)){aq();return 0}j=i+8|0;if((c[j>>2]|0)==(K|0)){c[d>>2]=i;c[j>>2]=r;L=i;break}else{aq();return 0}}}while(0);L1019:do{if((e|0)!=0){i=K+28|0;m=10512+(c[i>>2]<<2)|0;do{if((K|0)==(c[m>>2]|0)){c[m>>2]=L;if((L|0)!=0){break}c[2553]=c[2553]&~(1<<c[i>>2]);break L1019}else{if(e>>>0<(c[2556]|0)>>>0){aq();return 0}r=e+16|0;if((c[r>>2]|0)==(K|0)){c[r>>2]=L}else{c[e+20>>2]=L}if((L|0)==0){break L1019}}}while(0);if(L>>>0<(c[2556]|0)>>>0){aq();return 0}c[L+24>>2]=e;i=c[K+16>>2]|0;do{if((i|0)!=0){if(i>>>0<(c[2556]|0)>>>0){aq();return 0}else{c[L+16>>2]=i;c[i+24>>2]=L;break}}}while(0);i=c[K+20>>2]|0;if((i|0)==0){break}if(i>>>0<(c[2556]|0)>>>0){aq();return 0}else{c[L+20>>2]=i;c[i+24>>2]=L;break}}}while(0);L1047:do{if(J>>>0<16){e=J+g|0;c[K+4>>2]=e|3;i=q+(e+4)|0;c[i>>2]=c[i>>2]|1}else{c[K+4>>2]=g|3;c[q+(g|4)>>2]=J|1;c[q+(J+g)>>2]=J;i=J>>>3;if(J>>>0<256){e=i<<1;m=10248+(e<<2)|0;r=c[2552]|0;j=1<<i;do{if((r&j|0)==0){c[2552]=r|j;O=m;P=10248+(e+2<<2)|0}else{i=10248+(e+2<<2)|0;d=c[i>>2]|0;if(d>>>0>=(c[2556]|0)>>>0){O=d;P=i;break}aq();return 0}}while(0);c[P>>2]=k;c[O+12>>2]=k;c[q+(g+8)>>2]=O;c[q+(g+12)>>2]=m;break}e=p;j=J>>>8;do{if((j|0)==0){Q=0}else{if(J>>>0>16777215){Q=31;break}r=(j+1048320|0)>>>16&8;i=j<<r;d=(i+520192|0)>>>16&4;B=i<<d;i=(B+245760|0)>>>16&2;l=14-(d|r|i)+(B<<i>>>15)|0;Q=J>>>((l+7|0)>>>0)&1|l<<1}}while(0);j=10512+(Q<<2)|0;c[q+(g+28)>>2]=Q;c[q+(g+20)>>2]=0;c[q+(g+16)>>2]=0;m=c[2553]|0;l=1<<Q;if((m&l|0)==0){c[2553]=m|l;c[j>>2]=e;c[q+(g+24)>>2]=j;c[q+(g+12)>>2]=e;c[q+(g+8)>>2]=e;break}l=c[j>>2]|0;if((Q|0)==31){R=0}else{R=25-(Q>>>1)|0}L1068:do{if((c[l+4>>2]&-8|0)==(J|0)){S=l}else{j=l;m=J<<R;while(1){T=j+16+(m>>>31<<2)|0;i=c[T>>2]|0;if((i|0)==0){break}if((c[i+4>>2]&-8|0)==(J|0)){S=i;break L1068}else{j=i;m=m<<1}}if(T>>>0<(c[2556]|0)>>>0){aq();return 0}else{c[T>>2]=e;c[q+(g+24)>>2]=j;c[q+(g+12)>>2]=e;c[q+(g+8)>>2]=e;break L1047}}}while(0);l=S+8|0;m=c[l>>2]|0;i=c[2556]|0;if(S>>>0<i>>>0){aq();return 0}if(m>>>0<i>>>0){aq();return 0}else{c[m+12>>2]=e;c[l>>2]=e;c[q+(g+8)>>2]=m;c[q+(g+12)>>2]=S;c[q+(g+24)>>2]=0;break}}}while(0);n=K+8|0;return n|0}}while(0);K=c[2554]|0;if(o>>>0<=K>>>0){S=K-o|0;T=c[2557]|0;if(S>>>0>15){J=T;c[2557]=J+o;c[2554]=S;c[J+(o+4)>>2]=S|1;c[J+K>>2]=S;c[T+4>>2]=o|3}else{c[2554]=0;c[2557]=0;c[T+4>>2]=K|3;S=T+(K+4)|0;c[S>>2]=c[S>>2]|1}n=T+8|0;return n|0}T=c[2555]|0;if(o>>>0<T>>>0){S=T-o|0;c[2555]=S;T=c[2558]|0;K=T;c[2558]=K+o;c[K+(o+4)>>2]=S|1;c[T+4>>2]=o|3;n=T+8|0;return n|0}do{if((c[2534]|0)==0){T=aL(8)|0;if((T-1&T|0)==0){c[2536]=T;c[2535]=T;c[2537]=-1;c[2538]=2097152;c[2539]=0;c[2663]=0;c[2534]=(aP(0)|0)&-16^1431655768;break}else{aq();return 0}}}while(0);T=o+48|0;S=c[2536]|0;K=o+47|0;J=S+K|0;R=-S|0;S=J&R;if(S>>>0<=o>>>0){n=0;return n|0}Q=c[2662]|0;do{if((Q|0)!=0){O=c[2660]|0;P=O+S|0;if(P>>>0<=O>>>0|P>>>0>Q>>>0){n=0}else{break}return n|0}}while(0);L1112:do{if((c[2663]&4|0)==0){Q=c[2558]|0;L1114:do{if((Q|0)==0){U=798}else{P=Q;O=10656;while(1){V=O|0;L=c[V>>2]|0;if(L>>>0<=P>>>0){W=O+4|0;if((L+(c[W>>2]|0)|0)>>>0>P>>>0){break}}L=c[O+8>>2]|0;if((L|0)==0){U=798;break L1114}else{O=L}}if((O|0)==0){U=798;break}P=J-(c[2555]|0)&R;if(P>>>0>=2147483647){X=0;break}e=a4(P|0)|0;L=(e|0)==((c[V>>2]|0)+(c[W>>2]|0)|0);Y=L?e:-1;Z=L?P:0;_=e;$=P;U=807}}while(0);do{if((U|0)==798){Q=a4(0)|0;if((Q|0)==-1){X=0;break}P=Q;e=c[2535]|0;L=e-1|0;if((L&P|0)==0){aa=S}else{aa=S-P+(L+P&-e)|0}e=c[2660]|0;P=e+aa|0;if(!(aa>>>0>o>>>0&aa>>>0<2147483647)){X=0;break}L=c[2662]|0;if((L|0)!=0){if(P>>>0<=e>>>0|P>>>0>L>>>0){X=0;break}}L=a4(aa|0)|0;P=(L|0)==(Q|0);Y=P?Q:-1;Z=P?aa:0;_=L;$=aa;U=807}}while(0);L1134:do{if((U|0)==807){L=-$|0;if((Y|0)!=-1){ab=Z;ac=Y;U=818;break L1112}do{if((_|0)!=-1&$>>>0<2147483647&$>>>0<T>>>0){P=c[2536]|0;Q=K-$+P&-P;if(Q>>>0>=2147483647){ad=$;break}if((a4(Q|0)|0)==-1){a4(L|0)|0;X=Z;break L1134}else{ad=Q+$|0;break}}else{ad=$}}while(0);if((_|0)==-1){X=Z}else{ab=ad;ac=_;U=818;break L1112}}}while(0);c[2663]=c[2663]|4;ae=X;U=815}else{ae=0;U=815}}while(0);do{if((U|0)==815){if(S>>>0>=2147483647){break}X=a4(S|0)|0;_=a4(0)|0;if(!((_|0)!=-1&(X|0)!=-1&X>>>0<_>>>0)){break}ad=_-X|0;_=ad>>>0>(o+40|0)>>>0;if(_){ab=_?ad:ae;ac=X;U=818}}}while(0);do{if((U|0)==818){ae=(c[2660]|0)+ab|0;c[2660]=ae;if(ae>>>0>(c[2661]|0)>>>0){c[2661]=ae}ae=c[2558]|0;L1154:do{if((ae|0)==0){S=c[2556]|0;if((S|0)==0|ac>>>0<S>>>0){c[2556]=ac}c[2664]=ac;c[2665]=ab;c[2667]=0;c[2561]=c[2534];c[2560]=-1;S=0;do{X=S<<1;ad=10248+(X<<2)|0;c[10248+(X+3<<2)>>2]=ad;c[10248+(X+2<<2)>>2]=ad;S=S+1|0;}while(S>>>0<32);S=ac+8|0;if((S&7|0)==0){af=0}else{af=-S&7}S=ab-40-af|0;c[2558]=ac+af;c[2555]=S;c[ac+(af+4)>>2]=S|1;c[ac+(ab-36)>>2]=40;c[2559]=c[2538]}else{S=10656;while(1){ag=c[S>>2]|0;ah=S+4|0;ai=c[ah>>2]|0;if((ac|0)==(ag+ai|0)){U=830;break}ad=c[S+8>>2]|0;if((ad|0)==0){break}else{S=ad}}do{if((U|0)==830){if((c[S+12>>2]&8|0)!=0){break}ad=ae;if(!(ad>>>0>=ag>>>0&ad>>>0<ac>>>0)){break}c[ah>>2]=ai+ab;ad=c[2558]|0;X=(c[2555]|0)+ab|0;_=ad;Z=ad+8|0;if((Z&7|0)==0){aj=0}else{aj=-Z&7}Z=X-aj|0;c[2558]=_+aj;c[2555]=Z;c[_+(aj+4)>>2]=Z|1;c[_+(X+4)>>2]=40;c[2559]=c[2538];break L1154}}while(0);if(ac>>>0<(c[2556]|0)>>>0){c[2556]=ac}S=ac+ab|0;X=10656;while(1){ak=X|0;if((c[ak>>2]|0)==(S|0)){U=840;break}_=c[X+8>>2]|0;if((_|0)==0){break}else{X=_}}do{if((U|0)==840){if((c[X+12>>2]&8|0)!=0){break}c[ak>>2]=ac;S=X+4|0;c[S>>2]=(c[S>>2]|0)+ab;S=ac+8|0;if((S&7|0)==0){al=0}else{al=-S&7}S=ac+(ab+8)|0;if((S&7|0)==0){am=0}else{am=-S&7}S=ac+(am+ab)|0;_=S;Z=al+o|0;ad=ac+Z|0;$=ad;K=S-(ac+al)-o|0;c[ac+(al+4)>>2]=o|3;L1191:do{if((_|0)==(c[2558]|0)){T=(c[2555]|0)+K|0;c[2555]=T;c[2558]=$;c[ac+(Z+4)>>2]=T|1}else{if((_|0)==(c[2557]|0)){T=(c[2554]|0)+K|0;c[2554]=T;c[2557]=$;c[ac+(Z+4)>>2]=T|1;c[ac+(T+Z)>>2]=T;break}T=ab+4|0;Y=c[ac+(T+am)>>2]|0;if((Y&3|0)==1){aa=Y&-8;W=Y>>>3;L1199:do{if(Y>>>0<256){V=c[ac+((am|8)+ab)>>2]|0;R=c[ac+(ab+12+am)>>2]|0;J=10248+(W<<1<<2)|0;do{if((V|0)!=(J|0)){if(V>>>0<(c[2556]|0)>>>0){aq();return 0}if((c[V+12>>2]|0)==(_|0)){break}aq();return 0}}while(0);if((R|0)==(V|0)){c[2552]=c[2552]&~(1<<W);break}do{if((R|0)==(J|0)){an=R+8|0}else{if(R>>>0<(c[2556]|0)>>>0){aq();return 0}L=R+8|0;if((c[L>>2]|0)==(_|0)){an=L;break}aq();return 0}}while(0);c[V+12>>2]=R;c[an>>2]=V}else{J=S;L=c[ac+((am|24)+ab)>>2]|0;O=c[ac+(ab+12+am)>>2]|0;do{if((O|0)==(J|0)){Q=am|16;P=ac+(T+Q)|0;e=c[P>>2]|0;if((e|0)==0){M=ac+(Q+ab)|0;Q=c[M>>2]|0;if((Q|0)==0){ao=0;break}else{ap=Q;ar=M}}else{ap=e;ar=P}while(1){P=ap+20|0;e=c[P>>2]|0;if((e|0)!=0){ap=e;ar=P;continue}P=ap+16|0;e=c[P>>2]|0;if((e|0)==0){break}else{ap=e;ar=P}}if(ar>>>0<(c[2556]|0)>>>0){aq();return 0}else{c[ar>>2]=0;ao=ap;break}}else{P=c[ac+((am|8)+ab)>>2]|0;if(P>>>0<(c[2556]|0)>>>0){aq();return 0}e=P+12|0;if((c[e>>2]|0)!=(J|0)){aq();return 0}M=O+8|0;if((c[M>>2]|0)==(J|0)){c[e>>2]=O;c[M>>2]=P;ao=O;break}else{aq();return 0}}}while(0);if((L|0)==0){break}O=ac+(ab+28+am)|0;V=10512+(c[O>>2]<<2)|0;do{if((J|0)==(c[V>>2]|0)){c[V>>2]=ao;if((ao|0)!=0){break}c[2553]=c[2553]&~(1<<c[O>>2]);break L1199}else{if(L>>>0<(c[2556]|0)>>>0){aq();return 0}R=L+16|0;if((c[R>>2]|0)==(J|0)){c[R>>2]=ao}else{c[L+20>>2]=ao}if((ao|0)==0){break L1199}}}while(0);if(ao>>>0<(c[2556]|0)>>>0){aq();return 0}c[ao+24>>2]=L;J=am|16;O=c[ac+(J+ab)>>2]|0;do{if((O|0)!=0){if(O>>>0<(c[2556]|0)>>>0){aq();return 0}else{c[ao+16>>2]=O;c[O+24>>2]=ao;break}}}while(0);O=c[ac+(T+J)>>2]|0;if((O|0)==0){break}if(O>>>0<(c[2556]|0)>>>0){aq();return 0}else{c[ao+20>>2]=O;c[O+24>>2]=ao;break}}}while(0);as=ac+((aa|am)+ab)|0;at=aa+K|0}else{as=_;at=K}T=as+4|0;c[T>>2]=c[T>>2]&-2;c[ac+(Z+4)>>2]=at|1;c[ac+(at+Z)>>2]=at;T=at>>>3;if(at>>>0<256){W=T<<1;Y=10248+(W<<2)|0;O=c[2552]|0;L=1<<T;do{if((O&L|0)==0){c[2552]=O|L;au=Y;av=10248+(W+2<<2)|0}else{T=10248+(W+2<<2)|0;V=c[T>>2]|0;if(V>>>0>=(c[2556]|0)>>>0){au=V;av=T;break}aq();return 0}}while(0);c[av>>2]=$;c[au+12>>2]=$;c[ac+(Z+8)>>2]=au;c[ac+(Z+12)>>2]=Y;break}W=ad;L=at>>>8;do{if((L|0)==0){aw=0}else{if(at>>>0>16777215){aw=31;break}O=(L+1048320|0)>>>16&8;aa=L<<O;T=(aa+520192|0)>>>16&4;V=aa<<T;aa=(V+245760|0)>>>16&2;R=14-(T|O|aa)+(V<<aa>>>15)|0;aw=at>>>((R+7|0)>>>0)&1|R<<1}}while(0);L=10512+(aw<<2)|0;c[ac+(Z+28)>>2]=aw;c[ac+(Z+20)>>2]=0;c[ac+(Z+16)>>2]=0;Y=c[2553]|0;R=1<<aw;if((Y&R|0)==0){c[2553]=Y|R;c[L>>2]=W;c[ac+(Z+24)>>2]=L;c[ac+(Z+12)>>2]=W;c[ac+(Z+8)>>2]=W;break}R=c[L>>2]|0;if((aw|0)==31){ax=0}else{ax=25-(aw>>>1)|0}L1288:do{if((c[R+4>>2]&-8|0)==(at|0)){ay=R}else{L=R;Y=at<<ax;while(1){az=L+16+(Y>>>31<<2)|0;aa=c[az>>2]|0;if((aa|0)==0){break}if((c[aa+4>>2]&-8|0)==(at|0)){ay=aa;break L1288}else{L=aa;Y=Y<<1}}if(az>>>0<(c[2556]|0)>>>0){aq();return 0}else{c[az>>2]=W;c[ac+(Z+24)>>2]=L;c[ac+(Z+12)>>2]=W;c[ac+(Z+8)>>2]=W;break L1191}}}while(0);R=ay+8|0;Y=c[R>>2]|0;J=c[2556]|0;if(ay>>>0<J>>>0){aq();return 0}if(Y>>>0<J>>>0){aq();return 0}else{c[Y+12>>2]=W;c[R>>2]=W;c[ac+(Z+8)>>2]=Y;c[ac+(Z+12)>>2]=ay;c[ac+(Z+24)>>2]=0;break}}}while(0);n=ac+(al|8)|0;return n|0}}while(0);X=ae;Z=10656;while(1){aA=c[Z>>2]|0;if(aA>>>0<=X>>>0){aB=c[Z+4>>2]|0;aC=aA+aB|0;if(aC>>>0>X>>>0){break}}Z=c[Z+8>>2]|0}Z=aA+(aB-39)|0;if((Z&7|0)==0){aD=0}else{aD=-Z&7}Z=aA+(aB-47+aD)|0;ad=Z>>>0<(ae+16|0)>>>0?X:Z;Z=ad+8|0;$=ac+8|0;if(($&7|0)==0){aE=0}else{aE=-$&7}$=ab-40-aE|0;c[2558]=ac+aE;c[2555]=$;c[ac+(aE+4)>>2]=$|1;c[ac+(ab-36)>>2]=40;c[2559]=c[2538];c[ad+4>>2]=27;c[Z>>2]=c[2664];c[Z+4>>2]=c[10660>>2];c[Z+8>>2]=c[10664>>2];c[Z+12>>2]=c[10668>>2];c[2664]=ac;c[2665]=ab;c[2667]=0;c[2666]=Z;Z=ad+28|0;c[Z>>2]=7;if((ad+32|0)>>>0<aC>>>0){$=Z;while(1){Z=$+4|0;c[Z>>2]=7;if(($+8|0)>>>0<aC>>>0){$=Z}else{break}}}if((ad|0)==(X|0)){break}$=ad-ae|0;Z=X+($+4)|0;c[Z>>2]=c[Z>>2]&-2;c[ae+4>>2]=$|1;c[X+$>>2]=$;Z=$>>>3;if($>>>0<256){K=Z<<1;_=10248+(K<<2)|0;S=c[2552]|0;j=1<<Z;do{if((S&j|0)==0){c[2552]=S|j;aF=_;aG=10248+(K+2<<2)|0}else{Z=10248+(K+2<<2)|0;Y=c[Z>>2]|0;if(Y>>>0>=(c[2556]|0)>>>0){aF=Y;aG=Z;break}aq();return 0}}while(0);c[aG>>2]=ae;c[aF+12>>2]=ae;c[ae+8>>2]=aF;c[ae+12>>2]=_;break}K=ae;j=$>>>8;do{if((j|0)==0){aH=0}else{if($>>>0>16777215){aH=31;break}S=(j+1048320|0)>>>16&8;X=j<<S;ad=(X+520192|0)>>>16&4;Z=X<<ad;X=(Z+245760|0)>>>16&2;Y=14-(ad|S|X)+(Z<<X>>>15)|0;aH=$>>>((Y+7|0)>>>0)&1|Y<<1}}while(0);j=10512+(aH<<2)|0;c[ae+28>>2]=aH;c[ae+20>>2]=0;c[ae+16>>2]=0;_=c[2553]|0;Y=1<<aH;if((_&Y|0)==0){c[2553]=_|Y;c[j>>2]=K;c[ae+24>>2]=j;c[ae+12>>2]=ae;c[ae+8>>2]=ae;break}Y=c[j>>2]|0;if((aH|0)==31){aI=0}else{aI=25-(aH>>>1)|0}L1342:do{if((c[Y+4>>2]&-8|0)==($|0)){aJ=Y}else{j=Y;_=$<<aI;while(1){aK=j+16+(_>>>31<<2)|0;X=c[aK>>2]|0;if((X|0)==0){break}if((c[X+4>>2]&-8|0)==($|0)){aJ=X;break L1342}else{j=X;_=_<<1}}if(aK>>>0<(c[2556]|0)>>>0){aq();return 0}else{c[aK>>2]=K;c[ae+24>>2]=j;c[ae+12>>2]=ae;c[ae+8>>2]=ae;break L1154}}}while(0);$=aJ+8|0;Y=c[$>>2]|0;_=c[2556]|0;if(aJ>>>0<_>>>0){aq();return 0}if(Y>>>0<_>>>0){aq();return 0}else{c[Y+12>>2]=K;c[$>>2]=K;c[ae+8>>2]=Y;c[ae+12>>2]=aJ;c[ae+24>>2]=0;break}}}while(0);ae=c[2555]|0;if(ae>>>0<=o>>>0){break}Y=ae-o|0;c[2555]=Y;ae=c[2558]|0;$=ae;c[2558]=$+o;c[$+(o+4)>>2]=Y|1;c[ae+4>>2]=o|3;n=ae+8|0;return n|0}}while(0);c[(a0()|0)>>2]=12;n=0;return n|0}function ea(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0;if((a|0)==0){return}b=a-8|0;d=b;e=c[2556]|0;if(b>>>0<e>>>0){aq()}f=c[a-4>>2]|0;g=f&3;if((g|0)==1){aq()}h=f&-8;i=a+(h-8)|0;j=i;L1373:do{if((f&1|0)==0){k=c[b>>2]|0;if((g|0)==0){return}l=-8-k|0;m=a+l|0;n=m;o=k+h|0;if(m>>>0<e>>>0){aq()}if((n|0)==(c[2557]|0)){p=a+(h-4)|0;if((c[p>>2]&3|0)!=3){q=n;r=o;break}c[2554]=o;c[p>>2]=c[p>>2]&-2;c[a+(l+4)>>2]=o|1;c[i>>2]=o;return}p=k>>>3;if(k>>>0<256){k=c[a+(l+8)>>2]|0;s=c[a+(l+12)>>2]|0;t=10248+(p<<1<<2)|0;do{if((k|0)!=(t|0)){if(k>>>0<e>>>0){aq()}if((c[k+12>>2]|0)==(n|0)){break}aq()}}while(0);if((s|0)==(k|0)){c[2552]=c[2552]&~(1<<p);q=n;r=o;break}do{if((s|0)==(t|0)){u=s+8|0}else{if(s>>>0<e>>>0){aq()}v=s+8|0;if((c[v>>2]|0)==(n|0)){u=v;break}aq()}}while(0);c[k+12>>2]=s;c[u>>2]=k;q=n;r=o;break}t=m;p=c[a+(l+24)>>2]|0;v=c[a+(l+12)>>2]|0;do{if((v|0)==(t|0)){w=a+(l+20)|0;x=c[w>>2]|0;if((x|0)==0){y=a+(l+16)|0;z=c[y>>2]|0;if((z|0)==0){A=0;break}else{B=z;C=y}}else{B=x;C=w}while(1){w=B+20|0;x=c[w>>2]|0;if((x|0)!=0){B=x;C=w;continue}w=B+16|0;x=c[w>>2]|0;if((x|0)==0){break}else{B=x;C=w}}if(C>>>0<e>>>0){aq()}else{c[C>>2]=0;A=B;break}}else{w=c[a+(l+8)>>2]|0;if(w>>>0<e>>>0){aq()}x=w+12|0;if((c[x>>2]|0)!=(t|0)){aq()}y=v+8|0;if((c[y>>2]|0)==(t|0)){c[x>>2]=v;c[y>>2]=w;A=v;break}else{aq()}}}while(0);if((p|0)==0){q=n;r=o;break}v=a+(l+28)|0;m=10512+(c[v>>2]<<2)|0;do{if((t|0)==(c[m>>2]|0)){c[m>>2]=A;if((A|0)!=0){break}c[2553]=c[2553]&~(1<<c[v>>2]);q=n;r=o;break L1373}else{if(p>>>0<(c[2556]|0)>>>0){aq()}k=p+16|0;if((c[k>>2]|0)==(t|0)){c[k>>2]=A}else{c[p+20>>2]=A}if((A|0)==0){q=n;r=o;break L1373}}}while(0);if(A>>>0<(c[2556]|0)>>>0){aq()}c[A+24>>2]=p;t=c[a+(l+16)>>2]|0;do{if((t|0)!=0){if(t>>>0<(c[2556]|0)>>>0){aq()}else{c[A+16>>2]=t;c[t+24>>2]=A;break}}}while(0);t=c[a+(l+20)>>2]|0;if((t|0)==0){q=n;r=o;break}if(t>>>0<(c[2556]|0)>>>0){aq()}else{c[A+20>>2]=t;c[t+24>>2]=A;q=n;r=o;break}}else{q=d;r=h}}while(0);d=q;if(d>>>0>=i>>>0){aq()}A=a+(h-4)|0;e=c[A>>2]|0;if((e&1|0)==0){aq()}do{if((e&2|0)==0){if((j|0)==(c[2558]|0)){B=(c[2555]|0)+r|0;c[2555]=B;c[2558]=q;c[q+4>>2]=B|1;if((q|0)==(c[2557]|0)){c[2557]=0;c[2554]=0}if(B>>>0<=(c[2559]|0)>>>0){return}ed(0)|0;return}if((j|0)==(c[2557]|0)){B=(c[2554]|0)+r|0;c[2554]=B;c[2557]=q;c[q+4>>2]=B|1;c[d+B>>2]=B;return}B=(e&-8)+r|0;C=e>>>3;L1478:do{if(e>>>0<256){u=c[a+h>>2]|0;g=c[a+(h|4)>>2]|0;b=10248+(C<<1<<2)|0;do{if((u|0)!=(b|0)){if(u>>>0<(c[2556]|0)>>>0){aq()}if((c[u+12>>2]|0)==(j|0)){break}aq()}}while(0);if((g|0)==(u|0)){c[2552]=c[2552]&~(1<<C);break}do{if((g|0)==(b|0)){D=g+8|0}else{if(g>>>0<(c[2556]|0)>>>0){aq()}f=g+8|0;if((c[f>>2]|0)==(j|0)){D=f;break}aq()}}while(0);c[u+12>>2]=g;c[D>>2]=u}else{b=i;f=c[a+(h+16)>>2]|0;t=c[a+(h|4)>>2]|0;do{if((t|0)==(b|0)){p=a+(h+12)|0;v=c[p>>2]|0;if((v|0)==0){m=a+(h+8)|0;k=c[m>>2]|0;if((k|0)==0){E=0;break}else{F=k;G=m}}else{F=v;G=p}while(1){p=F+20|0;v=c[p>>2]|0;if((v|0)!=0){F=v;G=p;continue}p=F+16|0;v=c[p>>2]|0;if((v|0)==0){break}else{F=v;G=p}}if(G>>>0<(c[2556]|0)>>>0){aq()}else{c[G>>2]=0;E=F;break}}else{p=c[a+h>>2]|0;if(p>>>0<(c[2556]|0)>>>0){aq()}v=p+12|0;if((c[v>>2]|0)!=(b|0)){aq()}m=t+8|0;if((c[m>>2]|0)==(b|0)){c[v>>2]=t;c[m>>2]=p;E=t;break}else{aq()}}}while(0);if((f|0)==0){break}t=a+(h+20)|0;u=10512+(c[t>>2]<<2)|0;do{if((b|0)==(c[u>>2]|0)){c[u>>2]=E;if((E|0)!=0){break}c[2553]=c[2553]&~(1<<c[t>>2]);break L1478}else{if(f>>>0<(c[2556]|0)>>>0){aq()}g=f+16|0;if((c[g>>2]|0)==(b|0)){c[g>>2]=E}else{c[f+20>>2]=E}if((E|0)==0){break L1478}}}while(0);if(E>>>0<(c[2556]|0)>>>0){aq()}c[E+24>>2]=f;b=c[a+(h+8)>>2]|0;do{if((b|0)!=0){if(b>>>0<(c[2556]|0)>>>0){aq()}else{c[E+16>>2]=b;c[b+24>>2]=E;break}}}while(0);b=c[a+(h+12)>>2]|0;if((b|0)==0){break}if(b>>>0<(c[2556]|0)>>>0){aq()}else{c[E+20>>2]=b;c[b+24>>2]=E;break}}}while(0);c[q+4>>2]=B|1;c[d+B>>2]=B;if((q|0)!=(c[2557]|0)){H=B;break}c[2554]=B;return}else{c[A>>2]=e&-2;c[q+4>>2]=r|1;c[d+r>>2]=r;H=r}}while(0);r=H>>>3;if(H>>>0<256){d=r<<1;e=10248+(d<<2)|0;A=c[2552]|0;E=1<<r;do{if((A&E|0)==0){c[2552]=A|E;I=e;J=10248+(d+2<<2)|0}else{r=10248+(d+2<<2)|0;h=c[r>>2]|0;if(h>>>0>=(c[2556]|0)>>>0){I=h;J=r;break}aq()}}while(0);c[J>>2]=q;c[I+12>>2]=q;c[q+8>>2]=I;c[q+12>>2]=e;return}e=q;I=H>>>8;do{if((I|0)==0){K=0}else{if(H>>>0>16777215){K=31;break}J=(I+1048320|0)>>>16&8;d=I<<J;E=(d+520192|0)>>>16&4;A=d<<E;d=(A+245760|0)>>>16&2;r=14-(E|J|d)+(A<<d>>>15)|0;K=H>>>((r+7|0)>>>0)&1|r<<1}}while(0);I=10512+(K<<2)|0;c[q+28>>2]=K;c[q+20>>2]=0;c[q+16>>2]=0;r=c[2553]|0;d=1<<K;L1565:do{if((r&d|0)==0){c[2553]=r|d;c[I>>2]=e;c[q+24>>2]=I;c[q+12>>2]=q;c[q+8>>2]=q}else{A=c[I>>2]|0;if((K|0)==31){L=0}else{L=25-(K>>>1)|0}L1571:do{if((c[A+4>>2]&-8|0)==(H|0)){M=A}else{J=A;E=H<<L;while(1){N=J+16+(E>>>31<<2)|0;h=c[N>>2]|0;if((h|0)==0){break}if((c[h+4>>2]&-8|0)==(H|0)){M=h;break L1571}else{J=h;E=E<<1}}if(N>>>0<(c[2556]|0)>>>0){aq()}else{c[N>>2]=e;c[q+24>>2]=J;c[q+12>>2]=q;c[q+8>>2]=q;break L1565}}}while(0);A=M+8|0;B=c[A>>2]|0;E=c[2556]|0;if(M>>>0<E>>>0){aq()}if(B>>>0<E>>>0){aq()}else{c[B+12>>2]=e;c[A>>2]=e;c[q+8>>2]=B;c[q+12>>2]=M;c[q+24>>2]=0;break}}}while(0);q=(c[2560]|0)-1|0;c[2560]=q;if((q|0)==0){O=10664}else{return}while(1){q=c[O>>2]|0;if((q|0)==0){break}else{O=q+8|0}}c[2560]=-1;return}function eb(a,b){a=a|0;b=b|0;var d=0,e=0;do{if((a|0)==0){d=0}else{e=aa(b,a)|0;if((b|a)>>>0<=65535){d=e;break}d=((e>>>0)/(a>>>0)|0|0)==(b|0)?e:-1}}while(0);b=d9(d)|0;if((b|0)==0){return b|0}if((c[b-4>>2]&3|0)==0){return b|0}ej(b|0,0,d|0);return b|0}function ec(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;if((a|0)==0){d=d9(b)|0;return d|0}if(b>>>0>4294967231){c[(a0()|0)>>2]=12;d=0;return d|0}if(b>>>0<11){e=16}else{e=b+11&-8}f=ee(a-8|0,e)|0;if((f|0)!=0){d=f+8|0;return d|0}f=d9(b)|0;if((f|0)==0){d=0;return d|0}e=c[a-4>>2]|0;g=(e&-8)-((e&3|0)==0?8:4)|0;e=g>>>0<b>>>0?g:b;eg(f|0,a|0,e)|0;ea(a);d=f;return d|0}function ed(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;do{if((c[2534]|0)==0){b=aL(8)|0;if((b-1&b|0)==0){c[2536]=b;c[2535]=b;c[2537]=-1;c[2538]=2097152;c[2539]=0;c[2663]=0;c[2534]=(aP(0)|0)&-16^1431655768;break}else{aq();return 0}}}while(0);if(a>>>0>=4294967232){d=0;return d|0}b=c[2558]|0;if((b|0)==0){d=0;return d|0}e=c[2555]|0;do{if(e>>>0>(a+40|0)>>>0){f=c[2536]|0;g=(((-40-a-1+e+f|0)>>>0)/(f>>>0)|0)-1|0;h=b;i=10656;while(1){j=i|0;k=c[j>>2]|0;if(k>>>0<=h>>>0){l=i+4|0;if((k+(c[l>>2]|0)|0)>>>0>h>>>0){break}}i=c[i+8>>2]|0}h=aa(g,f)|0;if((c[i+12>>2]&8|0)!=0){break}k=a4(0)|0;if((k|0)!=((c[j>>2]|0)+(c[l>>2]|0)|0)){break}m=a4(-(h>>>0>2147483646?-2147483648-f|0:h)|0)|0;h=a4(0)|0;if(!((m|0)!=-1&h>>>0<k>>>0)){break}m=k-h|0;if((k|0)==(h|0)){break}c[l>>2]=(c[l>>2]|0)-m;c[2660]=(c[2660]|0)-m;n=c[2558]|0;o=(c[2555]|0)-m|0;m=n;p=n+8|0;if((p&7|0)==0){q=0}else{q=-p&7}p=o-q|0;c[2558]=m+q;c[2555]=p;c[m+(q+4)>>2]=p|1;c[m+(o+4)>>2]=40;c[2559]=c[2538];d=(k|0)!=(h|0)|0;return d|0}}while(0);if((c[2555]|0)>>>0<=(c[2559]|0)>>>0){d=0;return d|0}c[2559]=-1;d=0;return d|0}function ee(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0;d=a+4|0;e=c[d>>2]|0;f=e&-8;g=a;h=g+f|0;i=h;j=c[2556]|0;if(g>>>0<j>>>0){aq();return 0}k=e&3;if(!((k|0)!=1&g>>>0<h>>>0)){aq();return 0}l=g+(f|4)|0;m=c[l>>2]|0;if((m&1|0)==0){aq();return 0}if((k|0)==0){if(b>>>0<256){n=0;return n|0}do{if(f>>>0>=(b+4|0)>>>0){if((f-b|0)>>>0>c[2536]<<1>>>0){break}else{n=a}return n|0}}while(0);n=0;return n|0}if(f>>>0>=b>>>0){k=f-b|0;if(k>>>0<=15){n=a;return n|0}c[d>>2]=e&1|b|2;c[g+(b+4)>>2]=k|3;c[l>>2]=c[l>>2]|1;ef(g+b|0,k);n=a;return n|0}if((i|0)==(c[2558]|0)){k=(c[2555]|0)+f|0;if(k>>>0<=b>>>0){n=0;return n|0}l=k-b|0;c[d>>2]=e&1|b|2;c[g+(b+4)>>2]=l|1;c[2558]=g+b;c[2555]=l;n=a;return n|0}if((i|0)==(c[2557]|0)){l=(c[2554]|0)+f|0;if(l>>>0<b>>>0){n=0;return n|0}k=l-b|0;if(k>>>0>15){c[d>>2]=e&1|b|2;c[g+(b+4)>>2]=k|1;c[g+l>>2]=k;o=g+(l+4)|0;c[o>>2]=c[o>>2]&-2;p=g+b|0;q=k}else{c[d>>2]=e&1|l|2;e=g+(l+4)|0;c[e>>2]=c[e>>2]|1;p=0;q=0}c[2554]=q;c[2557]=p;n=a;return n|0}if((m&2|0)!=0){n=0;return n|0}p=(m&-8)+f|0;if(p>>>0<b>>>0){n=0;return n|0}q=p-b|0;e=m>>>3;L1712:do{if(m>>>0<256){l=c[g+(f+8)>>2]|0;k=c[g+(f+12)>>2]|0;o=10248+(e<<1<<2)|0;do{if((l|0)!=(o|0)){if(l>>>0<j>>>0){aq();return 0}if((c[l+12>>2]|0)==(i|0)){break}aq();return 0}}while(0);if((k|0)==(l|0)){c[2552]=c[2552]&~(1<<e);break}do{if((k|0)==(o|0)){r=k+8|0}else{if(k>>>0<j>>>0){aq();return 0}s=k+8|0;if((c[s>>2]|0)==(i|0)){r=s;break}aq();return 0}}while(0);c[l+12>>2]=k;c[r>>2]=l}else{o=h;s=c[g+(f+24)>>2]|0;t=c[g+(f+12)>>2]|0;do{if((t|0)==(o|0)){u=g+(f+20)|0;v=c[u>>2]|0;if((v|0)==0){w=g+(f+16)|0;x=c[w>>2]|0;if((x|0)==0){y=0;break}else{z=x;A=w}}else{z=v;A=u}while(1){u=z+20|0;v=c[u>>2]|0;if((v|0)!=0){z=v;A=u;continue}u=z+16|0;v=c[u>>2]|0;if((v|0)==0){break}else{z=v;A=u}}if(A>>>0<j>>>0){aq();return 0}else{c[A>>2]=0;y=z;break}}else{u=c[g+(f+8)>>2]|0;if(u>>>0<j>>>0){aq();return 0}v=u+12|0;if((c[v>>2]|0)!=(o|0)){aq();return 0}w=t+8|0;if((c[w>>2]|0)==(o|0)){c[v>>2]=t;c[w>>2]=u;y=t;break}else{aq();return 0}}}while(0);if((s|0)==0){break}t=g+(f+28)|0;l=10512+(c[t>>2]<<2)|0;do{if((o|0)==(c[l>>2]|0)){c[l>>2]=y;if((y|0)!=0){break}c[2553]=c[2553]&~(1<<c[t>>2]);break L1712}else{if(s>>>0<(c[2556]|0)>>>0){aq();return 0}k=s+16|0;if((c[k>>2]|0)==(o|0)){c[k>>2]=y}else{c[s+20>>2]=y}if((y|0)==0){break L1712}}}while(0);if(y>>>0<(c[2556]|0)>>>0){aq();return 0}c[y+24>>2]=s;o=c[g+(f+16)>>2]|0;do{if((o|0)!=0){if(o>>>0<(c[2556]|0)>>>0){aq();return 0}else{c[y+16>>2]=o;c[o+24>>2]=y;break}}}while(0);o=c[g+(f+20)>>2]|0;if((o|0)==0){break}if(o>>>0<(c[2556]|0)>>>0){aq();return 0}else{c[y+20>>2]=o;c[o+24>>2]=y;break}}}while(0);if(q>>>0<16){c[d>>2]=p|c[d>>2]&1|2;y=g+(p|4)|0;c[y>>2]=c[y>>2]|1;n=a;return n|0}else{c[d>>2]=c[d>>2]&1|b|2;c[g+(b+4)>>2]=q|3;d=g+(p|4)|0;c[d>>2]=c[d>>2]|1;ef(g+b|0,q);n=a;return n|0}return 0}function ef(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0;d=a;e=d+b|0;f=e;g=c[a+4>>2]|0;L1788:do{if((g&1|0)==0){h=c[a>>2]|0;if((g&3|0)==0){return}i=d+(-h|0)|0;j=i;k=h+b|0;l=c[2556]|0;if(i>>>0<l>>>0){aq()}if((j|0)==(c[2557]|0)){m=d+(b+4)|0;if((c[m>>2]&3|0)!=3){n=j;o=k;break}c[2554]=k;c[m>>2]=c[m>>2]&-2;c[d+(4-h)>>2]=k|1;c[e>>2]=k;return}m=h>>>3;if(h>>>0<256){p=c[d+(8-h)>>2]|0;q=c[d+(12-h)>>2]|0;r=10248+(m<<1<<2)|0;do{if((p|0)!=(r|0)){if(p>>>0<l>>>0){aq()}if((c[p+12>>2]|0)==(j|0)){break}aq()}}while(0);if((q|0)==(p|0)){c[2552]=c[2552]&~(1<<m);n=j;o=k;break}do{if((q|0)==(r|0)){s=q+8|0}else{if(q>>>0<l>>>0){aq()}t=q+8|0;if((c[t>>2]|0)==(j|0)){s=t;break}aq()}}while(0);c[p+12>>2]=q;c[s>>2]=p;n=j;o=k;break}r=i;m=c[d+(24-h)>>2]|0;t=c[d+(12-h)>>2]|0;do{if((t|0)==(r|0)){u=16-h|0;v=d+(u+4)|0;w=c[v>>2]|0;if((w|0)==0){x=d+u|0;u=c[x>>2]|0;if((u|0)==0){y=0;break}else{z=u;A=x}}else{z=w;A=v}while(1){v=z+20|0;w=c[v>>2]|0;if((w|0)!=0){z=w;A=v;continue}v=z+16|0;w=c[v>>2]|0;if((w|0)==0){break}else{z=w;A=v}}if(A>>>0<l>>>0){aq()}else{c[A>>2]=0;y=z;break}}else{v=c[d+(8-h)>>2]|0;if(v>>>0<l>>>0){aq()}w=v+12|0;if((c[w>>2]|0)!=(r|0)){aq()}x=t+8|0;if((c[x>>2]|0)==(r|0)){c[w>>2]=t;c[x>>2]=v;y=t;break}else{aq()}}}while(0);if((m|0)==0){n=j;o=k;break}t=d+(28-h)|0;l=10512+(c[t>>2]<<2)|0;do{if((r|0)==(c[l>>2]|0)){c[l>>2]=y;if((y|0)!=0){break}c[2553]=c[2553]&~(1<<c[t>>2]);n=j;o=k;break L1788}else{if(m>>>0<(c[2556]|0)>>>0){aq()}i=m+16|0;if((c[i>>2]|0)==(r|0)){c[i>>2]=y}else{c[m+20>>2]=y}if((y|0)==0){n=j;o=k;break L1788}}}while(0);if(y>>>0<(c[2556]|0)>>>0){aq()}c[y+24>>2]=m;r=16-h|0;t=c[d+r>>2]|0;do{if((t|0)!=0){if(t>>>0<(c[2556]|0)>>>0){aq()}else{c[y+16>>2]=t;c[t+24>>2]=y;break}}}while(0);t=c[d+(r+4)>>2]|0;if((t|0)==0){n=j;o=k;break}if(t>>>0<(c[2556]|0)>>>0){aq()}else{c[y+20>>2]=t;c[t+24>>2]=y;n=j;o=k;break}}else{n=a;o=b}}while(0);a=c[2556]|0;if(e>>>0<a>>>0){aq()}y=d+(b+4)|0;z=c[y>>2]|0;do{if((z&2|0)==0){if((f|0)==(c[2558]|0)){A=(c[2555]|0)+o|0;c[2555]=A;c[2558]=n;c[n+4>>2]=A|1;if((n|0)!=(c[2557]|0)){return}c[2557]=0;c[2554]=0;return}if((f|0)==(c[2557]|0)){A=(c[2554]|0)+o|0;c[2554]=A;c[2557]=n;c[n+4>>2]=A|1;c[n+A>>2]=A;return}A=(z&-8)+o|0;s=z>>>3;L1888:do{if(z>>>0<256){g=c[d+(b+8)>>2]|0;t=c[d+(b+12)>>2]|0;h=10248+(s<<1<<2)|0;do{if((g|0)!=(h|0)){if(g>>>0<a>>>0){aq()}if((c[g+12>>2]|0)==(f|0)){break}aq()}}while(0);if((t|0)==(g|0)){c[2552]=c[2552]&~(1<<s);break}do{if((t|0)==(h|0)){B=t+8|0}else{if(t>>>0<a>>>0){aq()}m=t+8|0;if((c[m>>2]|0)==(f|0)){B=m;break}aq()}}while(0);c[g+12>>2]=t;c[B>>2]=g}else{h=e;m=c[d+(b+24)>>2]|0;l=c[d+(b+12)>>2]|0;do{if((l|0)==(h|0)){i=d+(b+20)|0;p=c[i>>2]|0;if((p|0)==0){q=d+(b+16)|0;v=c[q>>2]|0;if((v|0)==0){C=0;break}else{D=v;E=q}}else{D=p;E=i}while(1){i=D+20|0;p=c[i>>2]|0;if((p|0)!=0){D=p;E=i;continue}i=D+16|0;p=c[i>>2]|0;if((p|0)==0){break}else{D=p;E=i}}if(E>>>0<a>>>0){aq()}else{c[E>>2]=0;C=D;break}}else{i=c[d+(b+8)>>2]|0;if(i>>>0<a>>>0){aq()}p=i+12|0;if((c[p>>2]|0)!=(h|0)){aq()}q=l+8|0;if((c[q>>2]|0)==(h|0)){c[p>>2]=l;c[q>>2]=i;C=l;break}else{aq()}}}while(0);if((m|0)==0){break}l=d+(b+28)|0;g=10512+(c[l>>2]<<2)|0;do{if((h|0)==(c[g>>2]|0)){c[g>>2]=C;if((C|0)!=0){break}c[2553]=c[2553]&~(1<<c[l>>2]);break L1888}else{if(m>>>0<(c[2556]|0)>>>0){aq()}t=m+16|0;if((c[t>>2]|0)==(h|0)){c[t>>2]=C}else{c[m+20>>2]=C}if((C|0)==0){break L1888}}}while(0);if(C>>>0<(c[2556]|0)>>>0){aq()}c[C+24>>2]=m;h=c[d+(b+16)>>2]|0;do{if((h|0)!=0){if(h>>>0<(c[2556]|0)>>>0){aq()}else{c[C+16>>2]=h;c[h+24>>2]=C;break}}}while(0);h=c[d+(b+20)>>2]|0;if((h|0)==0){break}if(h>>>0<(c[2556]|0)>>>0){aq()}else{c[C+20>>2]=h;c[h+24>>2]=C;break}}}while(0);c[n+4>>2]=A|1;c[n+A>>2]=A;if((n|0)!=(c[2557]|0)){F=A;break}c[2554]=A;return}else{c[y>>2]=z&-2;c[n+4>>2]=o|1;c[n+o>>2]=o;F=o}}while(0);o=F>>>3;if(F>>>0<256){z=o<<1;y=10248+(z<<2)|0;C=c[2552]|0;b=1<<o;do{if((C&b|0)==0){c[2552]=C|b;G=y;H=10248+(z+2<<2)|0}else{o=10248+(z+2<<2)|0;d=c[o>>2]|0;if(d>>>0>=(c[2556]|0)>>>0){G=d;H=o;break}aq()}}while(0);c[H>>2]=n;c[G+12>>2]=n;c[n+8>>2]=G;c[n+12>>2]=y;return}y=n;G=F>>>8;do{if((G|0)==0){I=0}else{if(F>>>0>16777215){I=31;break}H=(G+1048320|0)>>>16&8;z=G<<H;b=(z+520192|0)>>>16&4;C=z<<b;z=(C+245760|0)>>>16&2;o=14-(b|H|z)+(C<<z>>>15)|0;I=F>>>((o+7|0)>>>0)&1|o<<1}}while(0);G=10512+(I<<2)|0;c[n+28>>2]=I;c[n+20>>2]=0;c[n+16>>2]=0;o=c[2553]|0;z=1<<I;if((o&z|0)==0){c[2553]=o|z;c[G>>2]=y;c[n+24>>2]=G;c[n+12>>2]=n;c[n+8>>2]=n;return}z=c[G>>2]|0;if((I|0)==31){J=0}else{J=25-(I>>>1)|0}L1981:do{if((c[z+4>>2]&-8|0)==(F|0)){K=z}else{I=z;G=F<<J;while(1){L=I+16+(G>>>31<<2)|0;o=c[L>>2]|0;if((o|0)==0){break}if((c[o+4>>2]&-8|0)==(F|0)){K=o;break L1981}else{I=o;G=G<<1}}if(L>>>0<(c[2556]|0)>>>0){aq()}c[L>>2]=y;c[n+24>>2]=I;c[n+12>>2]=n;c[n+8>>2]=n;return}}while(0);L=K+8|0;F=c[L>>2]|0;J=c[2556]|0;if(K>>>0<J>>>0){aq()}if(F>>>0<J>>>0){aq()}c[F+12>>2]=y;c[L>>2]=y;c[n+8>>2]=F;c[n+12>>2]=K;c[n+24>>2]=0;return}function eg(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=b|0;if((b&3)==(d&3)){while(b&3){if((e|0)==0)return f|0;a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}while((e|0)>=4){c[b>>2]=c[d>>2];b=b+4|0;d=d+4|0;e=e-4|0}}while((e|0)>0){a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}return f|0}function eh(b){b=b|0;var c=0;c=b;while(a[c]|0){c=c+1|0}return c-b|0}function ei(b,c){b=b|0;c=c|0;var d=0;do{a[b+d|0]=a[c+d|0];d=d+1|0}while(a[c+(d-1)|0]|0);return b|0}function ej(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=b+e|0;if((e|0)>=20){d=d&255;e=b&3;g=d|d<<8|d<<16|d<<24;h=f&~3;if(e){e=b+4-e|0;while((b|0)<(e|0)){a[b]=d;b=b+1|0}}while((b|0)<(h|0)){c[b>>2]=g;b=b+4|0}}while((b|0)<(f|0)){a[b]=d;b=b+1|0}}function ek(b,c,d){b=b|0;c=c|0;d=d|0;if((c|0)<(b|0)&(b|0)<(c+d|0)){c=c+d|0;b=b+d|0;while((d|0)>0){b=b-1|0;c=c-1|0;d=d-1|0;a[b]=a[c]|0}}else{eg(b,c,d)|0}}function el(a,b,c){a=a|0;b=b|0;c=c|0;var e=0,f=0,g=0;while((e|0)<(c|0)){f=d[a+e|0]|0;g=d[b+e|0]|0;if((f|0)!=(g|0))return((f|0)>(g|0)?1:-1)|0;e=e+1|0}return 0}function em(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=a+c>>>0;return(E=b+d+(e>>>0<a>>>0|0)>>>0,e|0)|0}function en(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=b-d>>>0;e=b-d-(c>>>0>a>>>0|0)>>>0;return(E=e,a-c>>>0|0)|0}function eo(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){E=b<<c|(a&(1<<c)-1<<32-c)>>>32-c;return a<<c}E=a<<c-32;return 0}function ep(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){E=b>>>c;return a>>>c|(b&(1<<c)-1)<<32-c}E=0;return b>>>c-32|0}function eq(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){E=b>>c;return a>>>c|(b&(1<<c)-1)<<32-c}E=(b|0)<0?-1:0;return b>>c-32|0}function er(b){b=b|0;var c=0;c=a[n+(b>>>24)|0]|0;if((c|0)<8)return c|0;c=a[n+(b>>16&255)|0]|0;if((c|0)<8)return c+8|0;c=a[n+(b>>8&255)|0]|0;if((c|0)<8)return c+16|0;return(a[n+(b&255)|0]|0)+24|0}function es(b){b=b|0;var c=0;c=a[m+(b&255)|0]|0;if((c|0)<8)return c|0;c=a[m+(b>>8&255)|0]|0;if((c|0)<8)return c+8|0;c=a[m+(b>>16&255)|0]|0;if((c|0)<8)return c+16|0;return(a[m+(b>>>24)|0]|0)+24|0}function et(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;c=a&65535;d=b&65535;e=aa(d,c)|0;f=a>>>16;a=(e>>>16)+(aa(d,f)|0)|0;d=b>>>16;b=aa(d,c)|0;return(E=(a>>>16)+(aa(d,f)|0)+(((a&65535)+b|0)>>>16)|0,a+b<<16|e&65535|0)|0}function eu(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,i=0;e=b>>31|((b|0)<0?-1:0)<<1;f=((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1;g=d>>31|((d|0)<0?-1:0)<<1;h=((d|0)<0?-1:0)>>31|((d|0)<0?-1:0)<<1;i=en(e^a,f^b,e,f)|0;b=E;a=g^e;e=h^f;f=en((ez(i,b,en(g^c,h^d,g,h)|0,E,0)|0)^a,E^e,a,e)|0;return(E=E,f)|0}function ev(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0;f=i;i=i+8|0;g=f|0;h=b>>31|((b|0)<0?-1:0)<<1;j=((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1;k=e>>31|((e|0)<0?-1:0)<<1;l=((e|0)<0?-1:0)>>31|((e|0)<0?-1:0)<<1;m=en(h^a,j^b,h,j)|0;b=E;a=en(k^d,l^e,k,l)|0;ez(m,b,a,E,g)|0;a=en(c[g>>2]^h,c[g+4>>2]^j,h,j)|0;j=E;i=f;return(E=j,a)|0}function ew(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;e=a;a=c;c=et(e,a)|0;f=E;return(E=(aa(b,a)|0)+(aa(d,e)|0)+f|f&0,c|0|0)|0}function ex(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=ez(a,b,c,d,0)|0;return(E=E,e)|0}function ey(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;f=i;i=i+8|0;g=f|0;ez(a,b,d,e,g)|0;i=f;return(E=c[g+4>>2]|0,c[g>>2]|0)|0}function ez(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0;g=a;h=b;i=h;j=d;k=e;l=k;if((i|0)==0){m=(f|0)!=0;if((l|0)==0){if(m){c[f>>2]=(g>>>0)%(j>>>0);c[f+4>>2]=0}n=0;o=(g>>>0)/(j>>>0)>>>0;return(E=n,o)|0}else{if(!m){n=0;o=0;return(E=n,o)|0}c[f>>2]=a|0;c[f+4>>2]=b&0;n=0;o=0;return(E=n,o)|0}}m=(l|0)==0;do{if((j|0)==0){if(m){if((f|0)!=0){c[f>>2]=(i>>>0)%(j>>>0);c[f+4>>2]=0}n=0;o=(i>>>0)/(j>>>0)>>>0;return(E=n,o)|0}if((g|0)==0){if((f|0)!=0){c[f>>2]=0;c[f+4>>2]=(i>>>0)%(l>>>0)}n=0;o=(i>>>0)/(l>>>0)>>>0;return(E=n,o)|0}p=l-1|0;if((p&l|0)==0){if((f|0)!=0){c[f>>2]=a|0;c[f+4>>2]=p&i|b&0}n=0;o=i>>>((es(l|0)|0)>>>0);return(E=n,o)|0}p=(er(l|0)|0)-(er(i|0)|0)|0;if(p>>>0<=30){q=p+1|0;r=31-p|0;s=q;t=i<<r|g>>>(q>>>0);u=i>>>(q>>>0);v=0;w=g<<r;break}if((f|0)==0){n=0;o=0;return(E=n,o)|0}c[f>>2]=a|0;c[f+4>>2]=h|b&0;n=0;o=0;return(E=n,o)|0}else{if(!m){r=(er(l|0)|0)-(er(i|0)|0)|0;if(r>>>0<=31){q=r+1|0;p=31-r|0;x=r-31>>31;s=q;t=g>>>(q>>>0)&x|i<<p;u=i>>>(q>>>0)&x;v=0;w=g<<p;break}if((f|0)==0){n=0;o=0;return(E=n,o)|0}c[f>>2]=a|0;c[f+4>>2]=h|b&0;n=0;o=0;return(E=n,o)|0}p=j-1|0;if((p&j|0)!=0){x=(er(j|0)|0)+33-(er(i|0)|0)|0;q=64-x|0;r=32-x|0;y=r>>31;z=x-32|0;A=z>>31;s=x;t=r-1>>31&i>>>(z>>>0)|(i<<r|g>>>(x>>>0))&A;u=A&i>>>(x>>>0);v=g<<q&y;w=(i<<q|g>>>(z>>>0))&y|g<<r&x-33>>31;break}if((f|0)!=0){c[f>>2]=p&g;c[f+4>>2]=0}if((j|0)==1){n=h|b&0;o=a|0|0;return(E=n,o)|0}else{p=es(j|0)|0;n=i>>>(p>>>0)|0;o=i<<32-p|g>>>(p>>>0)|0;return(E=n,o)|0}}}while(0);if((s|0)==0){B=w;C=v;D=u;F=t;G=0;H=0}else{g=d|0|0;d=k|e&0;e=em(g,d,-1,-1)|0;k=E;i=w;w=v;v=u;u=t;t=s;s=0;while(1){I=w>>>31|i<<1;J=s|w<<1;j=u<<1|i>>>31|0;a=u>>>31|v<<1|0;en(e,k,j,a)|0;b=E;h=b>>31|((b|0)<0?-1:0)<<1;K=h&1;L=en(j,a,h&g,(((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1)&d)|0;M=E;b=t-1|0;if((b|0)==0){break}else{i=I;w=J;v=M;u=L;t=b;s=K}}B=I;C=J;D=M;F=L;G=0;H=K}K=C;C=0;if((f|0)!=0){c[f>>2]=F;c[f+4>>2]=D}n=(K|0)>>>31|(B|C)<<1|(C<<1|K>>>31)&0|G;o=(K<<1|0>>>31)&-2|H;return(E=n,o)|0}function eA(a,b){a=a|0;b=b|0;a7[a&15](b|0)}function eB(a,b,c){a=a|0;b=b|0;c=c|0;a8[a&1](b|0,c|0)}function eC(a,b){a=a|0;b=b|0;return a9[a&1](b|0)|0}function eD(a){a=a|0;ba[a&1]()}function eE(a,b,c){a=a|0;b=b|0;c=c|0;return bb[a&15](b|0,c|0)|0}function eF(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;bc[a&31](b|0,c|0,d|0,e|0)}function eG(a){a=a|0;ab(0)}function eH(a,b){a=a|0;b=b|0;ab(1)}function eI(a){a=a|0;ab(2);return 0}function eJ(){ab(3)}function eK(a,b){a=a|0;b=b|0;ab(4);return 0}function eL(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;ab(5)}
// EMSCRIPTEN_END_FUNCS
var a7=[eG,eG,cV,eG,ci,eG,b6,eG,bJ,eG,c8,eG,eG,eG,eG,eG];var a8=[eH,eH];var a9=[eI,eI];var ba=[eJ,eJ];var bb=[eK,eK,dx,eK,dj,eK,di,eK,cA,eK,cD,eK,eK,eK,eK,eK];var bc=[eL,eL,cO,eL,cN,eL,cI,eL,cT,eL,cL,eL,cS,eL,cM,eL,cP,eL,cU,eL,cQ,eL,cK,eL,eL,eL,eL,eL,eL,eL,eL,eL];return{_memcmp:el,_strlen:eh,_free:ea,_realloc:ec,_ZBarProcessImageData:bE,_memset:ej,_malloc:d9,_memcpy:eg,_memmove:ek,_strcpy:ei,_calloc:eb,runPostSets:bt,stackAlloc:bd,stackSave:be,stackRestore:bf,setThrew:bg,setTempRet0:bj,setTempRet1:bk,setTempRet2:bl,setTempRet3:bm,setTempRet4:bn,setTempRet5:bo,setTempRet6:bp,setTempRet7:bq,setTempRet8:br,setTempRet9:bs,dynCall_vi:eA,dynCall_vii:eB,dynCall_ii:eC,dynCall_v:eD,dynCall_iii:eE,dynCall_viiii:eF}})
// EMSCRIPTEN_END_ASM
({ "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array }, { "abort": abort, "assert": assert, "asmPrintInt": asmPrintInt, "asmPrintFloat": asmPrintFloat, "min": Math_min, "invoke_vi": invoke_vi, "invoke_vii": invoke_vii, "invoke_ii": invoke_ii, "invoke_v": invoke_v, "invoke_iii": invoke_iii, "invoke_viiii": invoke_viiii, "_llvm_lifetime_end": _llvm_lifetime_end, "_llvm_uadd_with_overflow_i32": _llvm_uadd_with_overflow_i32, "_snprintf": _snprintf, "_fclose": _fclose, "_abort": _abort, "_fprintf": _fprintf, "_pread": _pread, "_close": _close, "_fopen": _fopen, "_usleep": _usleep, "_fputc": _fputc, "_iconv": _iconv, "_poll": _poll, "_js_get_width": _js_get_width, "_open": _open, "_js_read_image": _js_read_image, "___setErrNo": ___setErrNo, "__reallyNegative": __reallyNegative, "_nanosleep": _nanosleep, "_qsort": _qsort, "_send": _send, "_write": _write, "_fputs": _fputs, "_sprintf": _sprintf, "_strdup": _strdup, "_sysconf": _sysconf, "_recv": _recv, "_read": _read, "_iconv_open": _iconv_open, "_time": _time, "__formatString": __formatString, "_js_output_result": _js_output_result, "_gettimeofday": _gettimeofday, "_iconv_close": _iconv_close, "_perror": _perror, "___assert_func": ___assert_func, "_js_get_height": _js_get_height, "_pwrite": _pwrite, "_strstr": _strstr, "_puts": _puts, "_fsync": _fsync, "_strerror_r": _strerror_r, "___errno_location": ___errno_location, "_strerror": _strerror, "_pipe": _pipe, "_llvm_lifetime_start": _llvm_lifetime_start, "_sbrk": _sbrk, "_fwrite": _fwrite, "_memchr": _memchr, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "cttz_i8": cttz_i8, "ctlz_i8": ctlz_i8, "NaN": NaN, "Infinity": Infinity, "_stderr": _stderr }, buffer);
var _memcmp = Module["_memcmp"] = asm["_memcmp"];
var _strlen = Module["_strlen"] = asm["_strlen"];
var _free = Module["_free"] = asm["_free"];
var _realloc = Module["_realloc"] = asm["_realloc"];
var _ZBarProcessImageData = Module["_ZBarProcessImageData"] = asm["_ZBarProcessImageData"];
var _memset = Module["_memset"] = asm["_memset"];
var _malloc = Module["_malloc"] = asm["_malloc"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var _memmove = Module["_memmove"] = asm["_memmove"];
var _strcpy = Module["_strcpy"] = asm["_strcpy"];
var _calloc = Module["_calloc"] = asm["_calloc"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
var dynCall_iii = Module["dynCall_iii"] = asm["dynCall_iii"];
var dynCall_viiii = Module["dynCall_viiii"] = asm["dynCall_viiii"];
Runtime.stackAlloc = function(size) { return asm['stackAlloc'](size) };
Runtime.stackSave = function() { return asm['stackSave']() };
Runtime.stackRestore = function(top) { asm['stackRestore'](top) };
// TODO: strip out parts of this we do not need
//======= begin closure i64 code =======
// Copyright 2009 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * @fileoverview Defines a Long class for representing a 64-bit two's-complement
 * integer value, which faithfully simulates the behavior of a Java "long". This
 * implementation is derived from LongLib in GWT.
 *
 */
var i64Math = (function() { // Emscripten wrapper
  var goog = { math: {} };
  /**
   * Constructs a 64-bit two's-complement integer, given its low and high 32-bit
   * values as *signed* integers.  See the from* functions below for more
   * convenient ways of constructing Longs.
   *
   * The internal representation of a long is the two given signed, 32-bit values.
   * We use 32-bit pieces because these are the size of integers on which
   * Javascript performs bit-operations.  For operations like addition and
   * multiplication, we split each number into 16-bit pieces, which can easily be
   * multiplied within Javascript's floating-point representation without overflow
   * or change in sign.
   *
   * In the algorithms below, we frequently reduce the negative case to the
   * positive case by negating the input(s) and then post-processing the result.
   * Note that we must ALWAYS check specially whether those values are MIN_VALUE
   * (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
   * a positive number, it overflows back into a negative).  Not handling this
   * case would often result in infinite recursion.
   *
   * @param {number} low  The low (signed) 32 bits of the long.
   * @param {number} high  The high (signed) 32 bits of the long.
   * @constructor
   */
  goog.math.Long = function(low, high) {
    /**
     * @type {number}
     * @private
     */
    this.low_ = low | 0;  // force into 32 signed bits.
    /**
     * @type {number}
     * @private
     */
    this.high_ = high | 0;  // force into 32 signed bits.
  };
  // NOTE: Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the
  // from* methods on which they depend.
  /**
   * A cache of the Long representations of small integer values.
   * @type {!Object}
   * @private
   */
  goog.math.Long.IntCache_ = {};
  /**
   * Returns a Long representing the given (32-bit) integer value.
   * @param {number} value The 32-bit integer in question.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromInt = function(value) {
    if (-128 <= value && value < 128) {
      var cachedObj = goog.math.Long.IntCache_[value];
      if (cachedObj) {
        return cachedObj;
      }
    }
    var obj = new goog.math.Long(value | 0, value < 0 ? -1 : 0);
    if (-128 <= value && value < 128) {
      goog.math.Long.IntCache_[value] = obj;
    }
    return obj;
  };
  /**
   * Returns a Long representing the given value, provided that it is a finite
   * number.  Otherwise, zero is returned.
   * @param {number} value The number in question.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromNumber = function(value) {
    if (isNaN(value) || !isFinite(value)) {
      return goog.math.Long.ZERO;
    } else if (value <= -goog.math.Long.TWO_PWR_63_DBL_) {
      return goog.math.Long.MIN_VALUE;
    } else if (value + 1 >= goog.math.Long.TWO_PWR_63_DBL_) {
      return goog.math.Long.MAX_VALUE;
    } else if (value < 0) {
      return goog.math.Long.fromNumber(-value).negate();
    } else {
      return new goog.math.Long(
          (value % goog.math.Long.TWO_PWR_32_DBL_) | 0,
          (value / goog.math.Long.TWO_PWR_32_DBL_) | 0);
    }
  };
  /**
   * Returns a Long representing the 64-bit integer that comes by concatenating
   * the given high and low bits.  Each is assumed to use 32 bits.
   * @param {number} lowBits The low 32-bits.
   * @param {number} highBits The high 32-bits.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromBits = function(lowBits, highBits) {
    return new goog.math.Long(lowBits, highBits);
  };
  /**
   * Returns a Long representation of the given string, written using the given
   * radix.
   * @param {string} str The textual representation of the Long.
   * @param {number=} opt_radix The radix in which the text is written.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromString = function(str, opt_radix) {
    if (str.length == 0) {
      throw Error('number format error: empty string');
    }
    var radix = opt_radix || 10;
    if (radix < 2 || 36 < radix) {
      throw Error('radix out of range: ' + radix);
    }
    if (str.charAt(0) == '-') {
      return goog.math.Long.fromString(str.substring(1), radix).negate();
    } else if (str.indexOf('-') >= 0) {
      throw Error('number format error: interior "-" character: ' + str);
    }
    // Do several (8) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 8));
    var result = goog.math.Long.ZERO;
    for (var i = 0; i < str.length; i += 8) {
      var size = Math.min(8, str.length - i);
      var value = parseInt(str.substring(i, i + size), radix);
      if (size < 8) {
        var power = goog.math.Long.fromNumber(Math.pow(radix, size));
        result = result.multiply(power).add(goog.math.Long.fromNumber(value));
      } else {
        result = result.multiply(radixToPower);
        result = result.add(goog.math.Long.fromNumber(value));
      }
    }
    return result;
  };
  // NOTE: the compiler should inline these constant values below and then remove
  // these variables, so there should be no runtime penalty for these.
  /**
   * Number used repeated below in calculations.  This must appear before the
   * first call to any from* function below.
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_16_DBL_ = 1 << 16;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_24_DBL_ = 1 << 24;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_32_DBL_ =
      goog.math.Long.TWO_PWR_16_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_31_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ / 2;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_48_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_64_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_32_DBL_;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_63_DBL_ =
      goog.math.Long.TWO_PWR_64_DBL_ / 2;
  /** @type {!goog.math.Long} */
  goog.math.Long.ZERO = goog.math.Long.fromInt(0);
  /** @type {!goog.math.Long} */
  goog.math.Long.ONE = goog.math.Long.fromInt(1);
  /** @type {!goog.math.Long} */
  goog.math.Long.NEG_ONE = goog.math.Long.fromInt(-1);
  /** @type {!goog.math.Long} */
  goog.math.Long.MAX_VALUE =
      goog.math.Long.fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0);
  /** @type {!goog.math.Long} */
  goog.math.Long.MIN_VALUE = goog.math.Long.fromBits(0, 0x80000000 | 0);
  /**
   * @type {!goog.math.Long}
   * @private
   */
  goog.math.Long.TWO_PWR_24_ = goog.math.Long.fromInt(1 << 24);
  /** @return {number} The value, assuming it is a 32-bit integer. */
  goog.math.Long.prototype.toInt = function() {
    return this.low_;
  };
  /** @return {number} The closest floating-point representation to this value. */
  goog.math.Long.prototype.toNumber = function() {
    return this.high_ * goog.math.Long.TWO_PWR_32_DBL_ +
           this.getLowBitsUnsigned();
  };
  /**
   * @param {number=} opt_radix The radix in which the text should be written.
   * @return {string} The textual representation of this value.
   */
  goog.math.Long.prototype.toString = function(opt_radix) {
    var radix = opt_radix || 10;
    if (radix < 2 || 36 < radix) {
      throw Error('radix out of range: ' + radix);
    }
    if (this.isZero()) {
      return '0';
    }
    if (this.isNegative()) {
      if (this.equals(goog.math.Long.MIN_VALUE)) {
        // We need to change the Long value before it can be negated, so we remove
        // the bottom-most digit in this base and then recurse to do the rest.
        var radixLong = goog.math.Long.fromNumber(radix);
        var div = this.div(radixLong);
        var rem = div.multiply(radixLong).subtract(this);
        return div.toString(radix) + rem.toInt().toString(radix);
      } else {
        return '-' + this.negate().toString(radix);
      }
    }
    // Do several (6) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 6));
    var rem = this;
    var result = '';
    while (true) {
      var remDiv = rem.div(radixToPower);
      var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
      var digits = intval.toString(radix);
      rem = remDiv;
      if (rem.isZero()) {
        return digits + result;
      } else {
        while (digits.length < 6) {
          digits = '0' + digits;
        }
        result = '' + digits + result;
      }
    }
  };
  /** @return {number} The high 32-bits as a signed value. */
  goog.math.Long.prototype.getHighBits = function() {
    return this.high_;
  };
  /** @return {number} The low 32-bits as a signed value. */
  goog.math.Long.prototype.getLowBits = function() {
    return this.low_;
  };
  /** @return {number} The low 32-bits as an unsigned value. */
  goog.math.Long.prototype.getLowBitsUnsigned = function() {
    return (this.low_ >= 0) ?
        this.low_ : goog.math.Long.TWO_PWR_32_DBL_ + this.low_;
  };
  /**
   * @return {number} Returns the number of bits needed to represent the absolute
   *     value of this Long.
   */
  goog.math.Long.prototype.getNumBitsAbs = function() {
    if (this.isNegative()) {
      if (this.equals(goog.math.Long.MIN_VALUE)) {
        return 64;
      } else {
        return this.negate().getNumBitsAbs();
      }
    } else {
      var val = this.high_ != 0 ? this.high_ : this.low_;
      for (var bit = 31; bit > 0; bit--) {
        if ((val & (1 << bit)) != 0) {
          break;
        }
      }
      return this.high_ != 0 ? bit + 33 : bit + 1;
    }
  };
  /** @return {boolean} Whether this value is zero. */
  goog.math.Long.prototype.isZero = function() {
    return this.high_ == 0 && this.low_ == 0;
  };
  /** @return {boolean} Whether this value is negative. */
  goog.math.Long.prototype.isNegative = function() {
    return this.high_ < 0;
  };
  /** @return {boolean} Whether this value is odd. */
  goog.math.Long.prototype.isOdd = function() {
    return (this.low_ & 1) == 1;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long equals the other.
   */
  goog.math.Long.prototype.equals = function(other) {
    return (this.high_ == other.high_) && (this.low_ == other.low_);
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long does not equal the other.
   */
  goog.math.Long.prototype.notEquals = function(other) {
    return (this.high_ != other.high_) || (this.low_ != other.low_);
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is less than the other.
   */
  goog.math.Long.prototype.lessThan = function(other) {
    return this.compare(other) < 0;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is less than or equal to the other.
   */
  goog.math.Long.prototype.lessThanOrEqual = function(other) {
    return this.compare(other) <= 0;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is greater than the other.
   */
  goog.math.Long.prototype.greaterThan = function(other) {
    return this.compare(other) > 0;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is greater than or equal to the other.
   */
  goog.math.Long.prototype.greaterThanOrEqual = function(other) {
    return this.compare(other) >= 0;
  };
  /**
   * Compares this Long with the given one.
   * @param {goog.math.Long} other Long to compare against.
   * @return {number} 0 if they are the same, 1 if the this is greater, and -1
   *     if the given one is greater.
   */
  goog.math.Long.prototype.compare = function(other) {
    if (this.equals(other)) {
      return 0;
    }
    var thisNeg = this.isNegative();
    var otherNeg = other.isNegative();
    if (thisNeg && !otherNeg) {
      return -1;
    }
    if (!thisNeg && otherNeg) {
      return 1;
    }
    // at this point, the signs are the same, so subtraction will not overflow
    if (this.subtract(other).isNegative()) {
      return -1;
    } else {
      return 1;
    }
  };
  /** @return {!goog.math.Long} The negation of this value. */
  goog.math.Long.prototype.negate = function() {
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      return goog.math.Long.MIN_VALUE;
    } else {
      return this.not().add(goog.math.Long.ONE);
    }
  };
  /**
   * Returns the sum of this and the given Long.
   * @param {goog.math.Long} other Long to add to this one.
   * @return {!goog.math.Long} The sum of this and the given Long.
   */
  goog.math.Long.prototype.add = function(other) {
    // Divide each number into 4 chunks of 16 bits, and then sum the chunks.
    var a48 = this.high_ >>> 16;
    var a32 = this.high_ & 0xFFFF;
    var a16 = this.low_ >>> 16;
    var a00 = this.low_ & 0xFFFF;
    var b48 = other.high_ >>> 16;
    var b32 = other.high_ & 0xFFFF;
    var b16 = other.low_ >>> 16;
    var b00 = other.low_ & 0xFFFF;
    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 + b48;
    c48 &= 0xFFFF;
    return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
  };
  /**
   * Returns the difference of this and the given Long.
   * @param {goog.math.Long} other Long to subtract from this.
   * @return {!goog.math.Long} The difference of this and the given Long.
   */
  goog.math.Long.prototype.subtract = function(other) {
    return this.add(other.negate());
  };
  /**
   * Returns the product of this and the given long.
   * @param {goog.math.Long} other Long to multiply with this.
   * @return {!goog.math.Long} The product of this and the other.
   */
  goog.math.Long.prototype.multiply = function(other) {
    if (this.isZero()) {
      return goog.math.Long.ZERO;
    } else if (other.isZero()) {
      return goog.math.Long.ZERO;
    }
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      return other.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
      return this.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
    }
    if (this.isNegative()) {
      if (other.isNegative()) {
        return this.negate().multiply(other.negate());
      } else {
        return this.negate().multiply(other).negate();
      }
    } else if (other.isNegative()) {
      return this.multiply(other.negate()).negate();
    }
    // If both longs are small, use float multiplication
    if (this.lessThan(goog.math.Long.TWO_PWR_24_) &&
        other.lessThan(goog.math.Long.TWO_PWR_24_)) {
      return goog.math.Long.fromNumber(this.toNumber() * other.toNumber());
    }
    // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
    // We can skip products that would overflow.
    var a48 = this.high_ >>> 16;
    var a32 = this.high_ & 0xFFFF;
    var a16 = this.low_ >>> 16;
    var a00 = this.low_ & 0xFFFF;
    var b48 = other.high_ >>> 16;
    var b32 = other.high_ & 0xFFFF;
    var b16 = other.low_ >>> 16;
    var b00 = other.low_ & 0xFFFF;
    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 0xFFFF;
    return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
  };
  /**
   * Returns this Long divided by the given one.
   * @param {goog.math.Long} other Long by which to divide.
   * @return {!goog.math.Long} This Long divided by the given one.
   */
  goog.math.Long.prototype.div = function(other) {
    if (other.isZero()) {
      throw Error('division by zero');
    } else if (this.isZero()) {
      return goog.math.Long.ZERO;
    }
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      if (other.equals(goog.math.Long.ONE) ||
          other.equals(goog.math.Long.NEG_ONE)) {
        return goog.math.Long.MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
      } else if (other.equals(goog.math.Long.MIN_VALUE)) {
        return goog.math.Long.ONE;
      } else {
        // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
        var halfThis = this.shiftRight(1);
        var approx = halfThis.div(other).shiftLeft(1);
        if (approx.equals(goog.math.Long.ZERO)) {
          return other.isNegative() ? goog.math.Long.ONE : goog.math.Long.NEG_ONE;
        } else {
          var rem = this.subtract(other.multiply(approx));
          var result = approx.add(rem.div(other));
          return result;
        }
      }
    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
      return goog.math.Long.ZERO;
    }
    if (this.isNegative()) {
      if (other.isNegative()) {
        return this.negate().div(other.negate());
      } else {
        return this.negate().div(other).negate();
      }
    } else if (other.isNegative()) {
      return this.div(other.negate()).negate();
    }
    // Repeat the following until the remainder is less than other:  find a
    // floating-point that approximates remainder / other *from below*, add this
    // into the result, and subtract it from the remainder.  It is critical that
    // the approximate value is less than or equal to the real value so that the
    // remainder never becomes negative.
    var res = goog.math.Long.ZERO;
    var rem = this;
    while (rem.greaterThanOrEqual(other)) {
      // Approximate the result of division. This may be a little greater or
      // smaller than the actual value.
      var approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));
      // We will tweak the approximate result by changing it in the 48-th digit or
      // the smallest non-fractional digit, whichever is larger.
      var log2 = Math.ceil(Math.log(approx) / Math.LN2);
      var delta = (log2 <= 48) ? 1 : Math.pow(2, log2 - 48);
      // Decrease the approximation until it is smaller than the remainder.  Note
      // that if it is too large, the product overflows and is negative.
      var approxRes = goog.math.Long.fromNumber(approx);
      var approxRem = approxRes.multiply(other);
      while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
        approx -= delta;
        approxRes = goog.math.Long.fromNumber(approx);
        approxRem = approxRes.multiply(other);
      }
      // We know the answer can't be zero... and actually, zero would cause
      // infinite recursion since we would make no progress.
      if (approxRes.isZero()) {
        approxRes = goog.math.Long.ONE;
      }
      res = res.add(approxRes);
      rem = rem.subtract(approxRem);
    }
    return res;
  };
  /**
   * Returns this Long modulo the given one.
   * @param {goog.math.Long} other Long by which to mod.
   * @return {!goog.math.Long} This Long modulo the given one.
   */
  goog.math.Long.prototype.modulo = function(other) {
    return this.subtract(this.div(other).multiply(other));
  };
  /** @return {!goog.math.Long} The bitwise-NOT of this value. */
  goog.math.Long.prototype.not = function() {
    return goog.math.Long.fromBits(~this.low_, ~this.high_);
  };
  /**
   * Returns the bitwise-AND of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to AND.
   * @return {!goog.math.Long} The bitwise-AND of this and the other.
   */
  goog.math.Long.prototype.and = function(other) {
    return goog.math.Long.fromBits(this.low_ & other.low_,
                                   this.high_ & other.high_);
  };
  /**
   * Returns the bitwise-OR of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to OR.
   * @return {!goog.math.Long} The bitwise-OR of this and the other.
   */
  goog.math.Long.prototype.or = function(other) {
    return goog.math.Long.fromBits(this.low_ | other.low_,
                                   this.high_ | other.high_);
  };
  /**
   * Returns the bitwise-XOR of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to XOR.
   * @return {!goog.math.Long} The bitwise-XOR of this and the other.
   */
  goog.math.Long.prototype.xor = function(other) {
    return goog.math.Long.fromBits(this.low_ ^ other.low_,
                                   this.high_ ^ other.high_);
  };
  /**
   * Returns this Long with bits shifted to the left by the given amount.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the left by the given amount.
   */
  goog.math.Long.prototype.shiftLeft = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var low = this.low_;
      if (numBits < 32) {
        var high = this.high_;
        return goog.math.Long.fromBits(
            low << numBits,
            (high << numBits) | (low >>> (32 - numBits)));
      } else {
        return goog.math.Long.fromBits(0, low << (numBits - 32));
      }
    }
  };
  /**
   * Returns this Long with bits shifted to the right by the given amount.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the right by the given amount.
   */
  goog.math.Long.prototype.shiftRight = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var high = this.high_;
      if (numBits < 32) {
        var low = this.low_;
        return goog.math.Long.fromBits(
            (low >>> numBits) | (high << (32 - numBits)),
            high >> numBits);
      } else {
        return goog.math.Long.fromBits(
            high >> (numBits - 32),
            high >= 0 ? 0 : -1);
      }
    }
  };
  /**
   * Returns this Long with bits shifted to the right by the given amount, with
   * the new top bits matching the current sign bit.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the right by the given amount, with
   *     zeros placed into the new leading bits.
   */
  goog.math.Long.prototype.shiftRightUnsigned = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var high = this.high_;
      if (numBits < 32) {
        var low = this.low_;
        return goog.math.Long.fromBits(
            (low >>> numBits) | (high << (32 - numBits)),
            high >>> numBits);
      } else if (numBits == 32) {
        return goog.math.Long.fromBits(high, 0);
      } else {
        return goog.math.Long.fromBits(high >>> (numBits - 32), 0);
      }
    }
  };
  //======= begin jsbn =======
  var navigator = { appName: 'Modern Browser' }; // polyfill a little
  // Copyright (c) 2005  Tom Wu
  // All Rights Reserved.
  // http://www-cs-students.stanford.edu/~tjw/jsbn/
  /*
   * Copyright (c) 2003-2005  Tom Wu
   * All Rights Reserved.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND, 
   * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY 
   * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  
   *
   * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
   * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
   * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
   * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
   * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * In addition, the following condition applies:
   *
   * All redistributions must retain an intact copy of this copyright notice
   * and disclaimer.
   */
  // Basic JavaScript BN library - subset useful for RSA encryption.
  // Bits per digit
  var dbits;
  // JavaScript engine analysis
  var canary = 0xdeadbeefcafe;
  var j_lm = ((canary&0xffffff)==0xefcafe);
  // (public) Constructor
  function BigInteger(a,b,c) {
    if(a != null)
      if("number" == typeof a) this.fromNumber(a,b,c);
      else if(b == null && "string" != typeof a) this.fromString(a,256);
      else this.fromString(a,b);
  }
  // return new, unset BigInteger
  function nbi() { return new BigInteger(null); }
  // am: Compute w_j += (x*this_i), propagate carries,
  // c is initial carry, returns final carry.
  // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
  // We need to select the fastest one that works in this environment.
  // am1: use a single mult and divide to get the high bits,
  // max digit bits should be 26 because
  // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
  function am1(i,x,w,j,c,n) {
    while(--n >= 0) {
      var v = x*this[i++]+w[j]+c;
      c = Math.floor(v/0x4000000);
      w[j++] = v&0x3ffffff;
    }
    return c;
  }
  // am2 avoids a big mult-and-extract completely.
  // Max digit bits should be <= 30 because we do bitwise ops
  // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
  function am2(i,x,w,j,c,n) {
    var xl = x&0x7fff, xh = x>>15;
    while(--n >= 0) {
      var l = this[i]&0x7fff;
      var h = this[i++]>>15;
      var m = xh*l+h*xl;
      l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
      c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
      w[j++] = l&0x3fffffff;
    }
    return c;
  }
  // Alternately, set max digit bits to 28 since some
  // browsers slow down when dealing with 32-bit numbers.
  function am3(i,x,w,j,c,n) {
    var xl = x&0x3fff, xh = x>>14;
    while(--n >= 0) {
      var l = this[i]&0x3fff;
      var h = this[i++]>>14;
      var m = xh*l+h*xl;
      l = xl*l+((m&0x3fff)<<14)+w[j]+c;
      c = (l>>28)+(m>>14)+xh*h;
      w[j++] = l&0xfffffff;
    }
    return c;
  }
  if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    BigInteger.prototype.am = am2;
    dbits = 30;
  }
  else if(j_lm && (navigator.appName != "Netscape")) {
    BigInteger.prototype.am = am1;
    dbits = 26;
  }
  else { // Mozilla/Netscape seems to prefer am3
    BigInteger.prototype.am = am3;
    dbits = 28;
  }
  BigInteger.prototype.DB = dbits;
  BigInteger.prototype.DM = ((1<<dbits)-1);
  BigInteger.prototype.DV = (1<<dbits);
  var BI_FP = 52;
  BigInteger.prototype.FV = Math.pow(2,BI_FP);
  BigInteger.prototype.F1 = BI_FP-dbits;
  BigInteger.prototype.F2 = 2*dbits-BI_FP;
  // Digit conversions
  var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
  var BI_RC = new Array();
  var rr,vv;
  rr = "0".charCodeAt(0);
  for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
  rr = "a".charCodeAt(0);
  for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
  rr = "A".charCodeAt(0);
  for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
  function int2char(n) { return BI_RM.charAt(n); }
  function intAt(s,i) {
    var c = BI_RC[s.charCodeAt(i)];
    return (c==null)?-1:c;
  }
  // (protected) copy this to r
  function bnpCopyTo(r) {
    for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
    r.t = this.t;
    r.s = this.s;
  }
  // (protected) set from integer value x, -DV <= x < DV
  function bnpFromInt(x) {
    this.t = 1;
    this.s = (x<0)?-1:0;
    if(x > 0) this[0] = x;
    else if(x < -1) this[0] = x+DV;
    else this.t = 0;
  }
  // return bigint initialized to value
  function nbv(i) { var r = nbi(); r.fromInt(i); return r; }
  // (protected) set from string and radix
  function bnpFromString(s,b) {
    var k;
    if(b == 16) k = 4;
    else if(b == 8) k = 3;
    else if(b == 256) k = 8; // byte array
    else if(b == 2) k = 1;
    else if(b == 32) k = 5;
    else if(b == 4) k = 2;
    else { this.fromRadix(s,b); return; }
    this.t = 0;
    this.s = 0;
    var i = s.length, mi = false, sh = 0;
    while(--i >= 0) {
      var x = (k==8)?s[i]&0xff:intAt(s,i);
      if(x < 0) {
        if(s.charAt(i) == "-") mi = true;
        continue;
      }
      mi = false;
      if(sh == 0)
        this[this.t++] = x;
      else if(sh+k > this.DB) {
        this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
        this[this.t++] = (x>>(this.DB-sh));
      }
      else
        this[this.t-1] |= x<<sh;
      sh += k;
      if(sh >= this.DB) sh -= this.DB;
    }
    if(k == 8 && (s[0]&0x80) != 0) {
      this.s = -1;
      if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
    }
    this.clamp();
    if(mi) BigInteger.ZERO.subTo(this,this);
  }
  // (protected) clamp off excess high words
  function bnpClamp() {
    var c = this.s&this.DM;
    while(this.t > 0 && this[this.t-1] == c) --this.t;
  }
  // (public) return string representation in given radix
  function bnToString(b) {
    if(this.s < 0) return "-"+this.negate().toString(b);
    var k;
    if(b == 16) k = 4;
    else if(b == 8) k = 3;
    else if(b == 2) k = 1;
    else if(b == 32) k = 5;
    else if(b == 4) k = 2;
    else return this.toRadix(b);
    var km = (1<<k)-1, d, m = false, r = "", i = this.t;
    var p = this.DB-(i*this.DB)%k;
    if(i-- > 0) {
      if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
      while(i >= 0) {
        if(p < k) {
          d = (this[i]&((1<<p)-1))<<(k-p);
          d |= this[--i]>>(p+=this.DB-k);
        }
        else {
          d = (this[i]>>(p-=k))&km;
          if(p <= 0) { p += this.DB; --i; }
        }
        if(d > 0) m = true;
        if(m) r += int2char(d);
      }
    }
    return m?r:"0";
  }
  // (public) -this
  function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }
  // (public) |this|
  function bnAbs() { return (this.s<0)?this.negate():this; }
  // (public) return + if this > a, - if this < a, 0 if equal
  function bnCompareTo(a) {
    var r = this.s-a.s;
    if(r != 0) return r;
    var i = this.t;
    r = i-a.t;
    if(r != 0) return (this.s<0)?-r:r;
    while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
    return 0;
  }
  // returns bit length of the integer x
  function nbits(x) {
    var r = 1, t;
    if((t=x>>>16) != 0) { x = t; r += 16; }
    if((t=x>>8) != 0) { x = t; r += 8; }
    if((t=x>>4) != 0) { x = t; r += 4; }
    if((t=x>>2) != 0) { x = t; r += 2; }
    if((t=x>>1) != 0) { x = t; r += 1; }
    return r;
  }
  // (public) return the number of bits in "this"
  function bnBitLength() {
    if(this.t <= 0) return 0;
    return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
  }
  // (protected) r = this << n*DB
  function bnpDLShiftTo(n,r) {
    var i;
    for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
    for(i = n-1; i >= 0; --i) r[i] = 0;
    r.t = this.t+n;
    r.s = this.s;
  }
  // (protected) r = this >> n*DB
  function bnpDRShiftTo(n,r) {
    for(var i = n; i < this.t; ++i) r[i-n] = this[i];
    r.t = Math.max(this.t-n,0);
    r.s = this.s;
  }
  // (protected) r = this << n
  function bnpLShiftTo(n,r) {
    var bs = n%this.DB;
    var cbs = this.DB-bs;
    var bm = (1<<cbs)-1;
    var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
    for(i = this.t-1; i >= 0; --i) {
      r[i+ds+1] = (this[i]>>cbs)|c;
      c = (this[i]&bm)<<bs;
    }
    for(i = ds-1; i >= 0; --i) r[i] = 0;
    r[ds] = c;
    r.t = this.t+ds+1;
    r.s = this.s;
    r.clamp();
  }
  // (protected) r = this >> n
  function bnpRShiftTo(n,r) {
    r.s = this.s;
    var ds = Math.floor(n/this.DB);
    if(ds >= this.t) { r.t = 0; return; }
    var bs = n%this.DB;
    var cbs = this.DB-bs;
    var bm = (1<<bs)-1;
    r[0] = this[ds]>>bs;
    for(var i = ds+1; i < this.t; ++i) {
      r[i-ds-1] |= (this[i]&bm)<<cbs;
      r[i-ds] = this[i]>>bs;
    }
    if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
    r.t = this.t-ds;
    r.clamp();
  }
  // (protected) r = this - a
  function bnpSubTo(a,r) {
    var i = 0, c = 0, m = Math.min(a.t,this.t);
    while(i < m) {
      c += this[i]-a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    if(a.t < this.t) {
      c -= a.s;
      while(i < this.t) {
        c += this[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += this.s;
    }
    else {
      c += this.s;
      while(i < a.t) {
        c -= a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c -= a.s;
    }
    r.s = (c<0)?-1:0;
    if(c < -1) r[i++] = this.DV+c;
    else if(c > 0) r[i++] = c;
    r.t = i;
    r.clamp();
  }
  // (protected) r = this * a, r != this,a (HAC 14.12)
  // "this" should be the larger one if appropriate.
  function bnpMultiplyTo(a,r) {
    var x = this.abs(), y = a.abs();
    var i = x.t;
    r.t = i+y.t;
    while(--i >= 0) r[i] = 0;
    for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
    r.s = 0;
    r.clamp();
    if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
  }
  // (protected) r = this^2, r != this (HAC 14.16)
  function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2*x.t;
    while(--i >= 0) r[i] = 0;
    for(i = 0; i < x.t-1; ++i) {
      var c = x.am(i,x[i],r,2*i,0,1);
      if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
        r[i+x.t] -= x.DV;
        r[i+x.t+1] = 1;
      }
    }
    if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
    r.s = 0;
    r.clamp();
  }
  // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
  // r != q, this != m.  q or r may be null.
  function bnpDivRemTo(m,q,r) {
    var pm = m.abs();
    if(pm.t <= 0) return;
    var pt = this.abs();
    if(pt.t < pm.t) {
      if(q != null) q.fromInt(0);
      if(r != null) this.copyTo(r);
      return;
    }
    if(r == null) r = nbi();
    var y = nbi(), ts = this.s, ms = m.s;
    var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
    if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
    else { pm.copyTo(y); pt.copyTo(r); }
    var ys = y.t;
    var y0 = y[ys-1];
    if(y0 == 0) return;
    var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
    var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
    var i = r.t, j = i-ys, t = (q==null)?nbi():q;
    y.dlShiftTo(j,t);
    if(r.compareTo(t) >= 0) {
      r[r.t++] = 1;
      r.subTo(t,r);
    }
    BigInteger.ONE.dlShiftTo(ys,t);
    t.subTo(y,y);	// "negative" y so we can replace sub with am later
    while(y.t < ys) y[y.t++] = 0;
    while(--j >= 0) {
      // Estimate quotient digit
      var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
      if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
        y.dlShiftTo(j,t);
        r.subTo(t,r);
        while(r[i] < --qd) r.subTo(t,r);
      }
    }
    if(q != null) {
      r.drShiftTo(ys,q);
      if(ts != ms) BigInteger.ZERO.subTo(q,q);
    }
    r.t = ys;
    r.clamp();
    if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
    if(ts < 0) BigInteger.ZERO.subTo(r,r);
  }
  // (public) this mod a
  function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a,null,r);
    if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
    return r;
  }
  // Modular reduction using "classic" algorithm
  function Classic(m) { this.m = m; }
  function cConvert(x) {
    if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
    else return x;
  }
  function cRevert(x) { return x; }
  function cReduce(x) { x.divRemTo(this.m,null,x); }
  function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
  function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
  Classic.prototype.convert = cConvert;
  Classic.prototype.revert = cRevert;
  Classic.prototype.reduce = cReduce;
  Classic.prototype.mulTo = cMulTo;
  Classic.prototype.sqrTo = cSqrTo;
  // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
  // justification:
  //         xy == 1 (mod m)
  //         xy =  1+km
  //   xy(2-xy) = (1+km)(1-km)
  // x[y(2-xy)] = 1-k^2m^2
  // x[y(2-xy)] == 1 (mod m^2)
  // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
  // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
  // JS multiply "overflows" differently from C/C++, so care is needed here.
  function bnpInvDigit() {
    if(this.t < 1) return 0;
    var x = this[0];
    if((x&1) == 0) return 0;
    var y = x&3;		// y == 1/x mod 2^2
    y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
    y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
    y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
    // last step - calculate inverse mod DV directly;
    // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
    y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
    // we really want the negative inverse, and -DV < y < DV
    return (y>0)?this.DV-y:-y;
  }
  // Montgomery reduction
  function Montgomery(m) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp&0x7fff;
    this.mph = this.mp>>15;
    this.um = (1<<(m.DB-15))-1;
    this.mt2 = 2*m.t;
  }
  // xR mod m
  function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t,r);
    r.divRemTo(this.m,null,r);
    if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
    return r;
  }
  // x/R mod m
  function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
  }
  // x = x/R mod m (HAC 14.32)
  function montReduce(x) {
    while(x.t <= this.mt2)	// pad x so am has enough room later
      x[x.t++] = 0;
    for(var i = 0; i < this.m.t; ++i) {
      // faster way of calculating u0 = x[i]*mp mod DV
      var j = x[i]&0x7fff;
      var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
      // use am to combine the multiply-shift-add into one call
      j = i+this.m.t;
      x[j] += this.m.am(0,u0,x,i,0,this.m.t);
      // propagate carry
      while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
    }
    x.clamp();
    x.drShiftTo(this.m.t,x);
    if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
  }
  // r = "x^2/R mod m"; x != r
  function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
  // r = "xy/R mod m"; x,y != r
  function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
  Montgomery.prototype.convert = montConvert;
  Montgomery.prototype.revert = montRevert;
  Montgomery.prototype.reduce = montReduce;
  Montgomery.prototype.mulTo = montMulTo;
  Montgomery.prototype.sqrTo = montSqrTo;
  // (protected) true iff this is even
  function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }
  // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
  function bnpExp(e,z) {
    if(e > 0xffffffff || e < 1) return BigInteger.ONE;
    var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
    g.copyTo(r);
    while(--i >= 0) {
      z.sqrTo(r,r2);
      if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
      else { var t = r; r = r2; r2 = t; }
    }
    return z.revert(r);
  }
  // (public) this^e % m, 0 <= e < 2^32
  function bnModPowInt(e,m) {
    var z;
    if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
    return this.exp(e,z);
  }
  // protected
  BigInteger.prototype.copyTo = bnpCopyTo;
  BigInteger.prototype.fromInt = bnpFromInt;
  BigInteger.prototype.fromString = bnpFromString;
  BigInteger.prototype.clamp = bnpClamp;
  BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
  BigInteger.prototype.drShiftTo = bnpDRShiftTo;
  BigInteger.prototype.lShiftTo = bnpLShiftTo;
  BigInteger.prototype.rShiftTo = bnpRShiftTo;
  BigInteger.prototype.subTo = bnpSubTo;
  BigInteger.prototype.multiplyTo = bnpMultiplyTo;
  BigInteger.prototype.squareTo = bnpSquareTo;
  BigInteger.prototype.divRemTo = bnpDivRemTo;
  BigInteger.prototype.invDigit = bnpInvDigit;
  BigInteger.prototype.isEven = bnpIsEven;
  BigInteger.prototype.exp = bnpExp;
  // public
  BigInteger.prototype.toString = bnToString;
  BigInteger.prototype.negate = bnNegate;
  BigInteger.prototype.abs = bnAbs;
  BigInteger.prototype.compareTo = bnCompareTo;
  BigInteger.prototype.bitLength = bnBitLength;
  BigInteger.prototype.mod = bnMod;
  BigInteger.prototype.modPowInt = bnModPowInt;
  // "constants"
  BigInteger.ZERO = nbv(0);
  BigInteger.ONE = nbv(1);
  // jsbn2 stuff
  // (protected) convert from radix string
  function bnpFromRadix(s,b) {
    this.fromInt(0);
    if(b == null) b = 10;
    var cs = this.chunkSize(b);
    var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
    for(var i = 0; i < s.length; ++i) {
      var x = intAt(s,i);
      if(x < 0) {
        if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
        continue;
      }
      w = b*w+x;
      if(++j >= cs) {
        this.dMultiply(d);
        this.dAddOffset(w,0);
        j = 0;
        w = 0;
      }
    }
    if(j > 0) {
      this.dMultiply(Math.pow(b,j));
      this.dAddOffset(w,0);
    }
    if(mi) BigInteger.ZERO.subTo(this,this);
  }
  // (protected) return x s.t. r^x < DV
  function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }
  // (public) 0 if this == 0, 1 if this > 0
  function bnSigNum() {
    if(this.s < 0) return -1;
    else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
    else return 1;
  }
  // (protected) this *= n, this >= 0, 1 < n < DV
  function bnpDMultiply(n) {
    this[this.t] = this.am(0,n-1,this,0,0,this.t);
    ++this.t;
    this.clamp();
  }
  // (protected) this += n << w words, this >= 0
  function bnpDAddOffset(n,w) {
    if(n == 0) return;
    while(this.t <= w) this[this.t++] = 0;
    this[w] += n;
    while(this[w] >= this.DV) {
      this[w] -= this.DV;
      if(++w >= this.t) this[this.t++] = 0;
      ++this[w];
    }
  }
  // (protected) convert to radix string
  function bnpToRadix(b) {
    if(b == null) b = 10;
    if(this.signum() == 0 || b < 2 || b > 36) return "0";
    var cs = this.chunkSize(b);
    var a = Math.pow(b,cs);
    var d = nbv(a), y = nbi(), z = nbi(), r = "";
    this.divRemTo(d,y,z);
    while(y.signum() > 0) {
      r = (a+z.intValue()).toString(b).substr(1) + r;
      y.divRemTo(d,y,z);
    }
    return z.intValue().toString(b) + r;
  }
  // (public) return value as integer
  function bnIntValue() {
    if(this.s < 0) {
      if(this.t == 1) return this[0]-this.DV;
      else if(this.t == 0) return -1;
    }
    else if(this.t == 1) return this[0];
    else if(this.t == 0) return 0;
    // assumes 16 < DB < 32
    return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
  }
  // (protected) r = this + a
  function bnpAddTo(a,r) {
    var i = 0, c = 0, m = Math.min(a.t,this.t);
    while(i < m) {
      c += this[i]+a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    if(a.t < this.t) {
      c += a.s;
      while(i < this.t) {
        c += this[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += this.s;
    }
    else {
      c += this.s;
      while(i < a.t) {
        c += a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += a.s;
    }
    r.s = (c<0)?-1:0;
    if(c > 0) r[i++] = c;
    else if(c < -1) r[i++] = this.DV+c;
    r.t = i;
    r.clamp();
  }
  BigInteger.prototype.fromRadix = bnpFromRadix;
  BigInteger.prototype.chunkSize = bnpChunkSize;
  BigInteger.prototype.signum = bnSigNum;
  BigInteger.prototype.dMultiply = bnpDMultiply;
  BigInteger.prototype.dAddOffset = bnpDAddOffset;
  BigInteger.prototype.toRadix = bnpToRadix;
  BigInteger.prototype.intValue = bnIntValue;
  BigInteger.prototype.addTo = bnpAddTo;
  //======= end jsbn =======
  // Emscripten wrapper
  var Wrapper = {
    abs: function(l, h) {
      var x = new goog.math.Long(l, h);
      var ret;
      if (x.isNegative()) {
        ret = x.negate();
      } else {
        ret = x;
      }
      HEAP32[tempDoublePtr>>2] = ret.low_;
      HEAP32[tempDoublePtr+4>>2] = ret.high_;
    },
    ensureTemps: function() {
      if (Wrapper.ensuredTemps) return;
      Wrapper.ensuredTemps = true;
      Wrapper.two32 = new BigInteger();
      Wrapper.two32.fromString('4294967296', 10);
      Wrapper.two64 = new BigInteger();
      Wrapper.two64.fromString('18446744073709551616', 10);
      Wrapper.temp1 = new BigInteger();
      Wrapper.temp2 = new BigInteger();
    },
    lh2bignum: function(l, h) {
      var a = new BigInteger();
      a.fromString(h.toString(), 10);
      var b = new BigInteger();
      a.multiplyTo(Wrapper.two32, b);
      var c = new BigInteger();
      c.fromString(l.toString(), 10);
      var d = new BigInteger();
      c.addTo(b, d);
      return d;
    },
    stringify: function(l, h, unsigned) {
      var ret = new goog.math.Long(l, h).toString();
      if (unsigned && ret[0] == '-') {
        // unsign slowly using jsbn bignums
        Wrapper.ensureTemps();
        var bignum = new BigInteger();
        bignum.fromString(ret, 10);
        ret = new BigInteger();
        Wrapper.two64.addTo(bignum, ret);
        ret = ret.toString(10);
      }
      return ret;
    },
    fromString: function(str, base, min, max, unsigned) {
      Wrapper.ensureTemps();
      var bignum = new BigInteger();
      bignum.fromString(str, base);
      var bigmin = new BigInteger();
      bigmin.fromString(min, 10);
      var bigmax = new BigInteger();
      bigmax.fromString(max, 10);
      if (unsigned && bignum.compareTo(BigInteger.ZERO) < 0) {
        var temp = new BigInteger();
        bignum.addTo(Wrapper.two64, temp);
        bignum = temp;
      }
      var error = false;
      if (bignum.compareTo(bigmin) < 0) {
        bignum = bigmin;
        error = true;
      } else if (bignum.compareTo(bigmax) > 0) {
        bignum = bigmax;
        error = true;
      }
      var ret = goog.math.Long.fromString(bignum.toString()); // min-max checks should have clamped this to a range goog.math.Long can handle well
      HEAP32[tempDoublePtr>>2] = ret.low_;
      HEAP32[tempDoublePtr+4>>2] = ret.high_;
      if (error) throw 'range error';
    }
  };
  return Wrapper;
})();
//======= end closure i64 code =======
// === Auto-generated postamble setup entry stuff ===
var initialStackTop;
var inMain;
Module['callMain'] = Module.callMain = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');
  args = args || [];
  ensureInitRuntime();
  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);
  initialStackTop = STACKTOP;
  inMain = true;
  var ret;
  try {
    ret = Module['_main'](argc, argv, 0);
  }
  catch(e) {
    if (e && typeof e == 'object' && e.type == 'ExitStatus') {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      Module.print('Exit Status: ' + e.value);
      return e.value;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
    } else {
      throw e;
    }
  } finally {
    inMain = false;
  }
  // if we're not running an evented main loop, it's time to exit
  if (!Module['noExitRuntime']) {
    exit(ret);
  }
}
function run(args) {
  args = args || Module['arguments'];
  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return;
  }
  preRun();
  if (runDependencies > 0) {
    // a preRun added a dependency, run will be called later
    return;
  }
  function doRun() {
    ensureInitRuntime();
    preMain();
    calledRun = true;
    if (Module['_main'] && shouldRunNow) {
      Module['callMain'](args);
    }
    postRun();
  }
  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      if (!ABORT) doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module['run'] = Module.run = run;
function exit(status) {
  ABORT = true;
  STACKTOP = initialStackTop;
  // TODO call externally added 'exit' callbacks with the status code.
  // It'd be nice to provide the same interface for all Module events (e.g.
  // prerun, premain, postmain). Perhaps an EventEmitter so we can do:
  // Module.on('exit', function (status) {});
  // exit the runtime
  exitRuntime();
  if (inMain) {
    // if we're still inside the callMain's try/catch, we need to throw an
    // exception in order to immediately terminate execution.
    throw { type: 'ExitStatus', value: status };
  }
}
Module['exit'] = Module.exit = exit;
function abort(text) {
  if (text) {
    Module.print(text);
  }
  ABORT = true;
  throw 'abort() at ' + (new Error().stack);
}
Module['abort'] = Module.abort = abort;
// {{PRE_RUN_ADDITIONS}}
if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}
// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}
run();
// {{POST_RUN_ADDITIONS}}
// {{MODULE_ADDITIONS}}

      return Module;
    })();
  };

  return zbarProcessImageData
})();
