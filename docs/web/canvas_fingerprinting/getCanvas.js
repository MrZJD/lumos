/**
 * 根据 canvas 生成 fingerprint
 * 
 * fill 方法
 * * 'nonzero' 非零环绕原则
 * * 'evenodd' 奇偶原则
 */

function getCanvas (opt) {
    const result = []
    const canvas = document.createElement('canvas')
    const option = opt || {}

    canvas.width = 2000
    canvas.height = 200
    canvas.style.display = 'inline'

    const ctx = canvas.getContext('2d')

    // detect browser support of canvas winding
    ctx.rect(0, 0, 10, 10)
    ctx.rect(2, 2, 6, 6)
    result.push('canvas winding:' + (ctx.isPointInPath(5, 5, 'evenodd') === false) ? 'yes' : 'no')

    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#f60'
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = '#069'
    if (option.dontUseFakeFontInCanvas) {
        ctx.font = '11pt Arial'
    } else {
        ctx.font = '11pt no-real-font-123'
    }
    ctx.fillText('Cwm fjordbank glyphs vext quiz, \ud83d\ude03', 2, 15)

    ctx.fillStyle = 'rgba(102, 204, 0, 0.2)'
    ctx.font = '18pt Arial'
    ctx.fillText('Cwm fjordbank glyphs vext quiz, \ud83d\ude03', 4, 45)

    // canvas blending (重叠混合规则)
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = 'rgb(255,0,255)'
    ctx.beginPath()
    ctx.arc(50, 50, 50, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = 'rgb(0,255,255)'
    ctx.beginPath()
    ctx.arc(100, 50, 50, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = 'rgb(255,255,0)'
    ctx.beginPath()
    ctx.arc(75, 100, 50, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = 'rgb(255,0,255)'

    // canvas winding (环绕规则)
    ctx.arc(75, 75, 75, 0, Math.PI * 2, true)
    ctx.arc(75, 75, 25, 0, Math.PI * 2, true)
    ctx.fill('evenodd')

    if (canvas.toDataURL) { result.push('canvas fp:' + canvas.toDataURL()) }
    return result
}