# Diagrams

## Build System and artifacts

The artifacts that we should produce for the toolbar, where they come from and where they get published to, are as follows.

* Artifact names are demonstrative until the build system is actually constructed

```mermaid
sequenceDiagram
  participant getsentry/sentry-toolbar
  participant getsentry/sentry
  participant NPM
  participant CDN
  getsentry/sentry-toolbar->>CDN: Compile & publish dist/index.iife.js
  getsentry/sentry->>NPM: Compile & publish dist/npm.js (future)
  NPM->>CDN: JS to inject <script> to load from CDN
  getsentry/sentry->>getsentry/sentry: Public page: https://sentry.io/toolbar.html w/ js entrypoint webpack://toolbar-iframe.js
```

Basically what gets built is:
1. From the getsentry/sentry-toolbar repo, one [entrypoint](https://github.com/getsentry/sentry-toolbar/blob/934d1bbc3d0022cace1167b262614c93b27b4d6f/vite.config.ts#L22-L35) currently called `index.iife.js`. This goes onto the CDN, and can be used by adding `<script src="<CDN>/toolbar/index.iife.js"/>` to the page (pending file renames, etc)
2. From the getsentry/sentry repo, or anywhere really, we can build an NPM package that inserts the above `<script>` tag onto the page. Maybe a react-specific version too. [Sample code](https://github.com/getsentry/sentry-toolbar/blob/934d1bbc3d0022cace1167b262614c93b27b4d6f/docs/conditional-script.md) is available.

## Auth Flow

```mermaid
sequenceDiagram
  participant SDK as SDK
  participant iframe as /iframe
  participant login as /login

  autonumber
  SDK ->> SDK: init()
  rect rgba(0, 0, 200, 0.1)
    SDK ->>+ iframe: document.append()
    iframe ->> iframe: window.addEventListener('message', handleLoginWindowMessage) 
    iframe ->> iframe: window.addEventListener('message', handleParentWindowMessage) 
    iframe ->>- SDK: window.parent.postMessage(state)
    SDK ->> SDK: disposePort()
  end

  alt state=logged-out
    rect rgba(0, 0, 200, 0.1)
      SDK ->>+ iframe: iframe.contentWindow.postMessage('request-login')
      iframe ->>+ login: window.open('/login')
      login ->>- iframe: window.opener.postMessage('did-login', cookie)
      iframe --> iframe: document.cookies.set(cookie)
      iframe ->>- SDK: window.parent.postMessage('stale')
      SDK ->> SDK: disposePort()
      SDK -->> iframe: re-render
    end

  else state=invalid-project || state=invalid-domain || state=logged-in
    rect rgba(0, 0, 200, 0.1)
        SDK ->>+ iframe: iframe.contentWindow.postMessage('request-logout')
        iframe ->> iframe: del document.cookies
        iframe ->>- SDK: window.parent.postMessage('stale')
        SDK ->> SDK: disposePort()
        SDK -->> iframe: re-render
    end 
  else state=logged-in
    rect rgba(0, 0, 200, 0.1)
      iframe ->> SDK: window.parent.postMessage('port-connect', port)
    end

    rect rgba(0, 0, 200, 0.1)
      SDK ->>+ iframe: port.postMessage(req)
      iframe ->>- SDK: port.postMessage(resp)
    end
  end
```

```mermaid
flowchart TB
    pageLoad(("Page load")) --> listenLogin("window.addEventListener(handleLoginWindowMessage)")
    listenLogin --> listenParent("window.addEventListener(handleParentWindowMessage)")
    listenParent --> sendState("sendStateMessage(state)")
    
    sendState --> checkState{"State?"}
    checkState -- "missing-proj & invalid-config" --> wait(("END"))
    checkState -- "logged-in" --> getPort("getMessagePort()")
    getPort --> parentPost["parent.postMessage(port-connect, referrer)"]

    listenLogin -. _enables_ .- window.handleLogin(("window.handleMessage<br/>(loginWindowMessageDispatch)"))
    window.handleLogin --> originIsSame{"messageEvent.origin === document.location.origin"}
    originIsSame -- true --> checkLoginMessage{"messageEvent.data.message?"}
    checkLoginMessage -- "did-login" --> saveAccessToken["save cookie/access token"]
    saveAccessToken --> opener.postMessage1["opener.postMessage('stale')"]

    listenParent -. _enables_ .- window.handleParent(("window.handleMessage<br/>(handleParentWindowMessage)"))
    window.handleParent --> originIsReferrer{"messageEvent.origin === referrer?"}
    originIsReferrer -- true --> checkParentMessage{"messageEvent.data.message?"}
    checkParentMessage -- "request-login" --> window.open["window.open"]    
    checkParentMessage -- "requets-logout" --> clearCookie{"document.cookie = ''"}
    clearCookie --> opener.postMessage2["opener.postMessage('stale')"]
    
    parentPost -- enables --> port.handleMessage(("port.handleMessage"))
    port.handleMessage --> checkPortMessage{"messageEvent.data.message.$function?"}
    checkPortMessage -- fetch --> fetch("fetch w/ domain & cookie")
    fetch -- reply with fetch result --> replyPortMessage

```

---

## Previously

The setup flow is basically:
1. JS: Create an iframe element
  - Create a MessageChannel for the iframe
  - Listen to the MessageChannel port, resolve proxy promises based on sequence id
  - Listen to `onload` event from iframe
    - iframe.postMessage(port-init) to send the MessageChannel port into the iframe
    - send a test request to `/api/organizations` to check auth status
    - If auth check returns 401
      - await login() flow
1. JS: Set iframe src to be `/organizations/<org>/toolbar/iframe/`
  - PY: This python view the referer header against an allow-list stored in org-settings on sentry.io
  - PY: If the referer is allowed:
    - Return the iframe page
    - JS: listen to "port-init" message from iframe host
      - accept MessageChannel port reference
      - listen to new port reference
        - run messages through the messageDispatchMap
        - postMessage() results or error
  - Else:
    - Return 401, something that prevents the `onload` from firing

## SDK State

```mermaid
stateDiagram-v2
  [*] --> await_load_iframe
  await_load_iframe --> await_check_auth
  await_check_auth --> auth_true
  await_check_auth --> await_login
  await_login --> auth_true
  auth_true --> await_login
  auth_true --> [*]
```
