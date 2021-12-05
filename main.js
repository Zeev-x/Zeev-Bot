const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const fs = require('fs')
const { banner, start, success } = require('./lib/functions')
const { color } = require('./lib/color')

require('./index.js')
nocache('./index.js', module => console.log(`${module} is now updated!`))

const starts = async (Zeev = new WAConnection()) => {
    Zeev.logger.level = 'warn'
    Zeev.version = [2, 2143, 3]
    Zeev.browserDescription = [ 'Bot Whatsapp', 'Chrome', '3.0' ]
    console.log(banner.string)
    Zeev.on('qr', () => {
        console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan bang'))
    })

    fs.existsSync('./session.json') && Zeev.loadAuthInfo('./session.json')
    Zeev.on('connecting', () => {
        start('2', 'Connecting...')
    })
    Zeev.on('open', () => {
        success('2', 'Connected')
    })
    await Zeev.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./session.json', JSON.stringify(Zeev.base64EncodedAuthInfo(), null, '\t'))

    Zeev.on('chat-update', async (message) => {
        require('./index.js')(Zeev, message)
    })
}

/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module, cb = () => { }) {
    console.log('- Jikalau ada seseorang yang menjual belikan script ini\n  Harap melapor ke Zeev-X.\n- Script ini 100% gratis.\n- Source code bot dari https://github.com/Zeev-x/Zeev-Bot.')
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

starts()
