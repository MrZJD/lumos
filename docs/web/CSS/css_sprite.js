/**
 * https://www.toptal.com/developers/css/sprite-generator
 * CSS代码重新格式化
 */
;(function generateCSSSprite(lessFnName, prefix) {
    return [].slice.call(document.querySelectorAll('.tool__area__item__files-list__item pre'))
        .map(value => value.innerText)
        .map(value => {
            return {
                name: /^.([\S]+) \{/.exec(value)[1].slice(3),
                width: /width: (\d+)px/g.exec(value)[1],
                height: /height: (\d+)px;/g.exec(value)[1],
                posx: /background: url\('css_sprites.png'\) (-\d+)px (-\d+)px;/.exec(value)[1],
                posy: /background: url\('css_sprites.png'\) (-\d+)px (-\d+)px;/.exec(value)[2],
            }
        })
        .map(value => {
            return `.${prefix ? prefix + '-' : ''}${value.name.replace(/_/g, '-')} {\n\t.${lessFnName}(${value.width}, ${value.height}, ${value.posx}, ${value.posy});\n}`
        })
        .join('\n')
})('getSprite', '');
