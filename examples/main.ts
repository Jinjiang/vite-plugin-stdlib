import 'foo/cjs.cjs'
import 'foo/mjs.mjs'

console.log({
  Buffer,
  process,
  global,
})

document.getElementById('app')!.innerText = [
  Buffer,
  process,
  global
].map(item => item.toString()).join(', ')
