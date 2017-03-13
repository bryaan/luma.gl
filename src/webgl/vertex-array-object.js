// WebGL2 VertexArray Objects Helper
import {assertWebGLContext, isWebGL2Context} from '../webgl/webgl-checks';
import assert from 'assert';

/* eslint-disable camelcase */
const OES_vertex_array_object = 'OES_vertex_array_object';

export default class VertexArrayObject {

  // Returns true if VertexArrayObject is supported by implementation
  static isSupported(gl) {
    assertWebGLContext(gl);
    return isWebGL2Context(gl) || gl.getExtension('OES_vertex_array_object');
  }

  // Wraps a WebGLVertexArrayObject in a VertexArrayObject
  static wrap(gl, object) {
    return object instanceof VertexArrayObject ?
      object :
      new VertexArrayObject(gl, {handle: object.handle || object});
  }

  // Create a VertexArrayObject
  constructor(gl, {handle} = {}) {
    assertWebGLContext(gl);
    assert(VertexArrayObject.isSupported(gl),
      'VertexArrayObject: WebGL2 or OES_vertex_array_object required');

    handle = handle || createVertexArray(gl);
    // TODO isVertexArray fails when using extension for some reason
    // if (!isVertexArray(gl, handle)) {
    if (!handle) {
      throw new Error('Could not create VertexArrayObject');
    }

    this.gl = gl;
    this.handle = handle;
    this.userData = {};
    Object.seal(this);
  }

  delete() {
    deleteVertexArray(this.gl, this.handle);
    return this;
  }

  bind() {
    bindVertexArray(this.gl, this.handle);
    return this;
  }

  unbind() {
    bindVertexArray(this.gl, null);
    return this;
  }
}

function createVertexArray(gl) {
  if (isWebGL2Context(gl)) {
    return gl.createVertexArray();
  }
  const ext = gl.getExtension(OES_vertex_array_object);
  if (ext) {
    return ext.createVertexArrayOES();
  }
  return null;
}

function deleteVertexArray(gl, vertexArray) {
  if (isWebGL2Context(gl)) {
    gl.deleteVertexArray(vertexArray);
    return;
  }
  const ext = gl.getExtension(OES_vertex_array_object);
  if (ext) {
    ext.deleteVertexArrayOES(vertexArray);
  }
}

export function isVertexArray(gl, vertexArray) {
  if (isWebGL2Context(gl)) {
    return gl.isVertexArray(vertexArray);
  }
  const ext = gl.getExtension(OES_vertex_array_object);
  if (ext) {
    return ext.isVertexArrayOES(vertexArray);
  }
  return false;
}

function bindVertexArray(gl, vertexArray) {
  if (isWebGL2Context(gl)) {
    gl.bindVertexArray(vertexArray);
    return;
  }
  const ext = gl.getExtension(OES_vertex_array_object);
  if (ext) {
    ext.bindVertexArrayOES(vertexArray);
  }
}
