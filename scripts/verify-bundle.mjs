/**
 * Load the built static client bundle in jsdom and exercise plugin
 * registration without a running DSH process.
 *
 * Usage: node scripts/verify-bundle.mjs
 */
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { JSDOM } from 'jsdom'
import React from 'react'
import * as JsxRuntime from 'react/jsx-runtime'
import ReactDOM from 'react-dom'
import ReactDOMClient from 'react-dom/client'

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://127.0.0.1/' })
const win = dom.window
win.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener () {},
  removeEventListener () {},
  addListener () {},
  removeListener () {},
  dispatchEvent () { return false },
})
win.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0)
win.cancelAnimationFrame = (id) => clearTimeout(id)
win.ResizeObserver = class { observe () {} unobserve () {} disconnect () {} }

for (const key of ['window', 'document', 'localStorage', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'ResizeObserver', 'requestAnimationFrame', 'cancelAnimationFrame', 'matchMedia', 'getComputedStyle']) {
  Object.defineProperty(globalThis, key, { configurable: true, writable: true, value: win[key] })
}

let captured
win.__ModuleLoader__ = {
  load (entry) { captured = entry },
}

const bundle = new URL('../lib/client.js', import.meta.url)
await import(bundle.href + '?verify=' + Date.now())
assert.ok(captured, 'client bundle did not call window.__ModuleLoader__.load')
assert.equal(captured.id, 'dsh-chat-a2ui')

const requireShim = (name) => {
  if (name === 'react') return React
  if (name === 'react/jsx-runtime') return JsxRuntime
  if (name === 'react-dom') return ReactDOM
  if (name === 'react-dom/client') return ReactDOMClient
  if (name.startsWith('@deepseek-ai/')) return {}
  throw new Error('unexpected external require: ' + name)
}

const exports = captured.factory(requireShim)
assert.equal(typeof exports.apply, 'function', 'client must export apply')
assert.deepEqual(exports.inject, ['slots', 'sessions', 'workspaces', 'uiWorkspace', 'uiConversation'])

win.localStorage.setItem('dsh.conversation.legacy', JSON.stringify({ draft: 'keep me', viewRequest: null, extra: 7 }))

const registrations = []
const disposers = []
const opened = []
const ctx = {
  slots: {
    inject (name, body) {
      assert.equal(typeof name, 'string')
      const dispose = body()
      if (typeof dispose === 'function') disposers.push(dispose)
    },
    register (options, component) {
      registrations.push({ options, component })
      return () => {}
    },
  },
  sessions: {
    async create (options) { return options?.agentPreset === 'chat' ? 'new-chat' : 'wrong-preset' },
    async fork (options) { assert.equal(options.atSeq, 7); return 'forked' },
    list: {
      getSnapshot: () => ({
        ids: ['legacy'],
        byId: { legacy: { id: 'legacy', cwd: 'D:/work', projectionValues: { agentPreset: 'chat' } } },
      }),
      subscribe: () => () => {},
    },
  },
  uiWorkspace: { openSession: (id) => opened.push(id) },
  uiConversation: { imageUrl: (sessionId, attachment) => 'blob:' + sessionId + '/' + attachment.attachmentId },
  effect (body) { const dispose = body(); if (typeof dispose === 'function') disposers.push(dispose) },
}

assert.equal(typeof ctx.sessions.create, 'function')
exports.apply(ctx)

const view = registrations.find(r => r.options.name === 'conversation.view')
assert.ok(view, 'conversation.view not registered')
assert.equal(view.options.id, 'chat-a2ui')
assert.equal(view.options.order, 1)
assert.equal(view.options.label, 'Chat UI')
assert.equal(typeof view.component, 'function')

const viewInjected = view.options.inject('legacy')
assert.equal(viewInjected.loadImage({ attachmentId: 'a1' }), 'blob:legacy/a1')
assert.equal(typeof viewInjected.forkAt, 'function')

const header = registrations.find(r => r.options.name === 'conversation.session.header.actions')
assert.ok(header, 'header action not registered')
assert.equal(header.options.id, 'chat-a2ui-new')
const headerInjected = header.options.inject('legacy')
assert.equal(typeof headerInjected.createChat, 'function')

await new Promise(resolve => setTimeout(resolve, 0))
const stored = JSON.parse(win.localStorage.getItem('dsh.conversation.legacy'))
assert.equal(stored.view, 'chat-a2ui')
assert.equal(stored.draft, 'keep me')
assert.equal(stored.extra, 7)

const created = await headerInjected.createChat()
assert.equal(created, 'new-chat')
assert.deepEqual(opened, ['new-chat'])
assert.equal(JSON.parse(win.localStorage.getItem('dsh.conversation.new-chat')).view, 'chat-a2ui')

viewInjected.forkAt(7)
await new Promise(resolve => setTimeout(resolve, 0))
assert.deepEqual(opened, ['new-chat', 'forked'])
assert.equal(JSON.parse(win.localStorage.getItem('dsh.conversation.forked')).view, 'chat-a2ui')

console.log('PASS: client bundle registration, seed, New Chat, and fork')