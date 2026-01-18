# Debugging Tools

## Chrome DevTools

- **Network**: Check Headers, payload, timing.
- **Sources**: Breakpoints. Use `debugger;` statement in code.
- **Application**: Check LocalStorage, Cookies.
- **Performance**: Frame drops, Long tasks.

## VS Code Debugger

Don't use `console.log`. Use breakpoints.
1. Click gutter to set red dot.
2. Run "JavaScript Debug Terminal".
3. Variables panel shows all values in scope.
4. Watch panel tracks specific expressions.

## Network Sniffing

When you need to see what leaves the machine (not just browser).

- **Wireshark**: Packet level (TCP/IP). Hard.
- **Charles Proxy / Proxyman**: HTTP level. Easy.
  - Can Edit & Replay requests.
  - Can Breakpoint requests (Pause before sending).
