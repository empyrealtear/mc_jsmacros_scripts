// 脚本名称: 星露谷自动钓鱼
// 功能介绍: 检测钓鱼游戏进度，在接近完美时收杆
// 依赖模组: 宏(jsmacros)、CustomFishing
// 创建时间: 2025-03-16
// 修改时间: 2025-03-16
// 当前版本: v1.0
// 更新内容: v1.0 初始化脚本

const scriptName = 'CustomFishing.ToggleScript'
const mclog = (preix, msg, preixColor = 0x5, msgColor = 0x7) => {
    Chat.log(Chat.createTextBuilder()
        .append("[").withColor(preixColor).append(preix).withColor(preixColor).append("]").withColor(preixColor)
        .append(" " + msg).withColor(msgColor).build())
}
const isToggle = () => GlobalVars.getBoolean(scriptName)
const setToggle = (value) => {
    GlobalVars.putBoolean(scriptName, value)
    mclog(scriptName, value ? "enabled" : "disabled")
}
setToggle(!isToggle())


// 参数区
// 星露谷钓鱼：core\src\main\resources\contents\minigame\default.yml
const customfishingfont = {
    "default": {
        b001: { "chars": ["\ub001"], "type": "bitmap", "height": 15, "ascent": 11, "file": "customfishing:font/bars/pointer.png" },
        b002: {
            "chars": ["\ub002"], "type": "bitmap", "height": 8, "ascent": 8, "file": "customfishing:font/bars/bar1.png",
            "rate": [0, 0, 0, 0.2, 0.6, 1, 0.6, 0.2, 0, 0, 0]
        },
        b003: {
            "chars": ["\ub003"], "type": "bitmap", "height": 8, "ascent": 8, "file": "customfishing:font/bars/bar2.png",
            "rate": [0, 0.2, 0.6, 1, 0.6, 0.2, 0, 0, 0, 0, 0]
        },
        b004: {
            "chars": ["\ub004"], "type": "bitmap", "height": 8, "ascent": 8, "file": "customfishing:font/bars/bar3.png",
            "rate": [0, 0, 0, 0, 0, 0.2, 0.6, 1, 0.6, 0.2, 0]
        },
        b005: {
            "chars": ["\ub005"], "type": "bitmap", "height": 8, "ascent": 8, "file": "customfishing:font/bars/bar4.png",
            "rate": [0, 0, 0.1, 0.1, 0, 0, 0.2, 0.2, 0.6, 0.6, 1, 0.6, 0.2, 0, 0.2, 0.6, 1, 0.6, 0.2, 0.1, 0, 0]
        },
        b006: {
            "chars": ["\ub006"], "type": "bitmap", "height": 8, "ascent": 8, "file": "customfishing:font/bars/bar5.png",
            "rate": [1, 0, 0.1, 0.2, 0.2, 0.6, 0.6, 1, 0.6, 0.2, 0, 0.2, 0.6, 1, 0.6, 0.2, 0, 1, 0.2, 0.1, 0, 0]
        },
        b007: {
            "chars": ["\ub007"], "type": "bitmap", "height": 8, "ascent": 8, "file": "customfishing:font/bars/bar6.png",
            "rate": [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 1, 0, 1, 0, 1, 0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
        },
        b008: {
            "chars": ["\ub008"], "type": "bitmap", "height": 8, "ascent": 8, "file": "customfishing:font/bars/bar7.png",
            "rate": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.1, 0, 0, 1, 0, 0, 0.3, 0.3, 0.3]
        },
        b009: {
            "chars": ["\ub009"], "type": "bitmap", "height": 8, "ascent": 8, "file": "customfishing:font/bars/bar8.png",
            "rate": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.2, 0.2, 0.6, 1, 0.6, 0.2, 0.2, 0.2, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        b00a: {
            "chars": ["\ub00a"], "type": "bitmap", "height": 8, "ascent": 8, "file": "customfishing:font/bars/bar9.png",
            "rate": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
        },
        b00b: {
            "chars": ["\ub00b"], "type": "bitmap", "height": 8, "ascent": 8, "file": "customfishing:font/bars/bar_rainbow.png",
            "rate": [1, 0, 0, 0, 0, 0, 0]
        },

        b00c: { "chars": ["\ub00c"], "type": "bitmap", "height": 8, "ascent": 7, "file": "customfishing:font/bars/bar10.png" },
        b012: {
            "chars": ["\ub012"], "type": "bitmap", "height": 6, "ascent": 6, "file": "customfishing:font/bars/judgment_area_easy.png",
            "bar-effective-area-width": 155, "judgment-area-offset": -160, "judgment-area-width": 45
        },
        b013: {
            "chars": ["\ub013"], "type": "bitmap", "height": 6, "ascent": 6, "file": "customfishing:font/bars/judgment_area_normal.png",
            "bar-effective-area-width": 155, "judgment-area-offset": -160, "judgment-area-width": 36
        },
        b014: {
            "chars": ["\ub014"], "type": "bitmap", "height": 6, "ascent": 6, "file": "customfishing:font/bars/judgment_area_hard.png",
            "bar-effective-area-width": 155, "judgment-area-offset": -160, "judgment-area-width": 27
        },

        b011: { "chars": ["\ub011"], "type": "bitmap", "height": 20, "ascent": 12, "file": "customfishing:font/bars/bar11.png" },
        b00d: { "chars": ["\ub00d"], "type": "bitmap", "height": 5, "ascent": 4, "file": "customfishing:font/bars/fish_icon.png" },
        b00e: { "chars": ["\ub00e"], "type": "bitmap", "height": 5, "ascent": 5, "file": "customfishing:font/bars/struggling_fish_icon.png" },
        b00f: { "chars": ["\ub00f"], "type": "bitmap", "height": 5, "ascent": 4, "file": "customfishing:font/bars/struggling_fish_icon.png" },
        b010: { "chars": ["\ub010"], "type": "bitmap", "height": 5, "ascent": 3, "file": "customfishing:font/bars/struggling_fish_icon.png" },
    },

    "offset_chars": {
        f801: { "chars": ["\uf801"], "type": "bitmap", "ascent": -5000, "height": -3, "file": "customfishing:font/base/space_split.png" },
        f802: { "chars": ["\uf802"], "type": "bitmap", "ascent": -5000, "height": -4, "file": "customfishing:font/base/space_split.png" },
        f803: { "chars": ["\uf803"], "type": "bitmap", "ascent": -5000, "height": -6, "file": "customfishing:font/base/space_split.png" },
        f804: { "chars": ["\uf804"], "type": "bitmap", "ascent": -5000, "height": -10, "file": "customfishing:font/base/space_split.png" },
        f805: { "chars": ["\uf805"], "type": "bitmap", "ascent": -5000, "height": -18, "file": "customfishing:font/base/space_split.png" },
        f806: { "chars": ["\uf806"], "type": "bitmap", "ascent": -5000, "height": -34, "file": "customfishing:font/base/space_split.png" },
        f807: { "chars": ["\uf807"], "type": "bitmap", "ascent": -5000, "height": -66, "file": "customfishing:font/base/space_split.png" },
        f808: { "chars": ["\uf808"], "type": "bitmap", "ascent": -5000, "height": -130, "file": "customfishing:font/base/space_split.png" },
        f811: { "chars": ["\uf811"], "type": "bitmap", "ascent": -5000, "height": -1, "file": "customfishing:font/base/space_split.png" },
        f812: { "chars": ["\uf812"], "type": "bitmap", "ascent": -5000, "height": 1, "file": "customfishing:font/base/space_split.png" },
        f813: { "chars": ["\uf813"], "type": "bitmap", "ascent": -5000, "height": 3, "file": "customfishing:font/base/space_split.png" },
        f814: { "chars": ["\uf814"], "type": "bitmap", "ascent": -5000, "height": 7, "file": "customfishing:font/base/space_split.png" },
        f815: { "chars": ["\uf815"], "type": "bitmap", "ascent": -5000, "height": 15, "file": "customfishing:font/base/space_split.png" },
        f816: { "chars": ["\uf816"], "type": "bitmap", "ascent": -5000, "height": 31, "file": "customfishing:font/base/space_split.png" },
        f817: { "chars": ["\uf817"], "type": "bitmap", "ascent": -5000, "height": 63, "file": "customfishing:font/base/space_split.png" },
        f818: { "chars": ["\uf818"], "type": "bitmap", "ascent": -5000, "height": 12, "file": "customfishing:font/base/space_split.png" },
    },
    "icons": {
        b001: { "chars": ["\ub001"], "type": "bitmap", "height": 13, "ascent": 13, "file": "customfishing:font/icons/progress_1.png" },
        b002: { "chars": ["\ub002"], "type": "bitmap", "height": 13, "ascent": 13, "file": "customfishing:font/icons/progress_2.png" },
        b003: { "chars": ["\ub003"], "type": "bitmap", "height": 13, "ascent": 13, "file": "customfishing:font/icons/progress_3.png" },
        b004: { "chars": ["\ub004"], "type": "bitmap", "height": 13, "ascent": 13, "file": "customfishing:font/icons/progress_4.png" },
        b005: { "chars": ["\ub005"], "type": "bitmap", "height": 13, "ascent": 13, "file": "customfishing:font/icons/progress_5.png" },
        b006: { "chars": ["\ub006"], "type": "bitmap", "height": 13, "ascent": 13, "file": "customfishing:font/icons/progress_6.png" },
        b007: { "chars": ["\ub007"], "type": "bitmap", "height": 13, "ascent": 13, "file": "customfishing:font/icons/progress_7.png" },
        b008: { "chars": ["\ub008"], "type": "bitmap", "height": 13, "ascent": 13, "file": "customfishing:font/icons/progress_8.png" },
        b009: { "chars": ["\ub009"], "type": "bitmap", "height": 13, "ascent": 13, "file": "customfishing:font/icons/progress_9.png" },
        b011: { "chars": ["\ub011"], "type": "bitmap", "height": 13, "ascent": 13, "file": "customfishing:font/icons/strain_1.png" },
        b012: { "chars": ["\ub012"], "type": "bitmap", "height": 13, "ascent": 13, "file": "customfishing:font/icons/strain_2.png" },
        b013: { "chars": ["\ub013"], "type": "bitmap", "height": 13, "ascent": 13, "file": "customfishing:font/icons/strain_3.png" },
        b014: { "chars": ["\ub014"], "type": "bitmap", "height": 13, "ascent": 13, "file": "customfishing:font/icons/strain_4.png" },
        b015: { "chars": ["\ub015"], "type": "bitmap", "height": 13, "ascent": 13, "file": "customfishing:font/icons/strain_5.png" },
        b016: { "chars": ["\ub016"], "type": "bitmap", "height": 13, "ascent": 13, "file": "customfishing:font/icons/strain_6.png" },
        b017: { "chars": ["\ub017"], "type": "bitmap", "height": 13, "ascent": 13, "file": "customfishing:font/icons/strain_7.png" },
        b018: { "chars": ["\ub018"], "type": "bitmap", "height": 13, "ascent": 13, "file": "customfishing:font/icons/strain_8.png" },
        b019: { "chars": ["\ub019"], "type": "bitmap", "height": 13, "ascent": 13, "file": "customfishing:font/icons/strain_9.png" },
    }
}
const fish_d2d = Hud.createDraw2D()
const fish_d2d_setting = {
    x: 5,
    y: fish_d2d.getHeight() - 2,
    color: 0xFFFFFF,
    shadow: true,
    scale: 0.5,
    rotation: 0
}
const fish_panel = []
let titleListener
let titleContainer = { TITLE: null, SUBTITLE: null, ACTIONBAR: null }
// let mcTickListener
const logFile = FS.open("D:/Game/Minecraft/jsmacros/typescript/jsmlogs.txt")

// 函数区
const getDecalaredFieldValue = (obj, javaClass, name) => {
    if (obj == null)
        return null

    let field = Reflection.getDeclaredField(javaClass, name)
    field.setAccessible(true)
    return field.get(obj)
}
const getCustomFishInfos = () => {
    let res = {
        time: new Date(), mainHand: null, hook: null, isFishing: false,

        TITLE: titleContainer.TITLE,
        SUBTITLE: titleContainer.SUBTITLE,
        ACTIONBAR: titleContainer.ACTIONBAR,

        game: {
            type: null,
            ui: null,
        },
    }

    res.mainHand = Player.getPlayer().getMainHand()
    res.hook = Player.getPlayer().getFishingBobber()?.getRaw()
    res.isFishing = res.hook == null ? false : true

    if (res.isFishing) {
        if (res.TITLE && res.SUBTITLE) {
            let title = res.TITLE.message.getJson()
            let subtitle = res.SUBTITLE.message.getJson()

            if (/按照提示跳舞/.test(subtitle)) {
                res.game.type = 'DanceGame' // 跳舞游戏
                let actionEnum = {
                    '←': 'key.mouse.left',
                    '→': 'key.mouse.right',
                    '↑': 'key.keyboard.space',
                    '↓': 'key.keyboard.left.shift'
                }
                res.game.ui = {
                    green: '',
                    gold: '',
                    gray: '',
                    action: ''
                }
                JSON.parse(title).extra?.forEach(v => res.game.ui[v.color] = v.text.trim())
                if (res.game.ui.gold.length > 0)
                    res.game.ui.action = actionEnum[res.game.ui.gold]
            } else if (/customfishing\:offset_chars/.test(subtitle)) {
                let data = JSON.parse(subtitle)
                let barChar = data.extra[0].text.charCodeAt().toString(16)
                if (barChar == 'b011') {
                    res.game.type = 'TensionGame' // 拔河游戏
                    // private void showUI() {
                    //     String bar = AdventureHelper.surroundWithMiniMessageFont(barImage, font)
                    //             + OffsetUtils.getOffsetChars(fishOffset + fish_position)
                    //             + AdventureHelper.surroundWithMiniMessageFont((struggling_time > 0 ? strugglingFishImage[struggling_time % strugglingFishImage.length] : fishImage), font)
                    //             + OffsetUtils.getOffsetChars(barEffectiveWidth - fish_position - fishIconWidth);
                    //     strain = Math.max(0, Math.min(strain, ultimateTension));
                    //     hook.getContext().arg(ContextKeys.PROGRESS, tension[(int) ((strain / ultimateTension) * tension.length)]);
                    //     SparrowHeart.getInstance().sendTitle(getPlayer(), AdventureHelper.miniMessageToJson(tip != null && !played ? tip : title.render(hook.getContext())), AdventureHelper.miniMessageToJson(bar), 0, 20, 0);
                    // }
                    if (/customfishing\:icons/.test(title)) {
                        res.game.ui = { progress: JSON.parse(title)?.text?.charCodeAt()?.toString(16) }
                    }
                } else if (barChar == 'b00c') {
                    res.game.type = 'HoldGame' //平衡游戏
                    // private void showUI() {
                    //     String bar = AdventureHelper.surroundWithMiniMessageFont(barImage, font)
                    //             + OffsetUtils.getOffsetChars((int) (judgementAreaOffset + judgement_position))
                    //             + AdventureHelper.surroundWithMiniMessageFont(judgementAreaImage, font)
                    //             + OffsetUtils.getOffsetChars((int) (barEffectiveWidth - judgement_position - judgementAreaWidth))
                    //             + OffsetUtils.getOffsetChars((int) (-barEffectiveWidth - 1 + fish_position))
                    //             + AdventureHelper.surroundWithMiniMessageFont(pointerImage, font)
                    //             + OffsetUtils.getOffsetChars((int) (barEffectiveWidth - fish_position - pointerIconWidth + 1));
                    //     customFishingHook.getContext().arg(ContextKeys.PROGRESS, progress[(int) ((hold_time / time_requirement) * progress.length)]);
                    //     SparrowHeart.getInstance().sendTitle(super.getPlayer(), AdventureHelper.miniMessageToJson(tip != null && !played ? tip : title.render(customFishingHook.getContext())), AdventureHelper.miniMessageToJson(bar), 0, 20, 0);
                    // }
                    let ui = {
                        judgementAreaOffset: eval(Array.from(data.extra[1].text)
                            .map(v => v.charCodeAt().toString(16))
                            .map(v => customfishingfont["offset_chars"][v]?.height)
                            .join("+")),
                        pointerOffset: eval(Array.from(data.extra[3].text)
                            .map(v => v.charCodeAt().toString(16))
                            .map(v => customfishingfont["offset_chars"][v]?.height)
                            .join("+")),
                        // bar: customfishingfont["default"][barChar],
                        judgementArea: customfishingfont["default"][data.extra[2].text.charCodeAt().toString(16)],
                        // pointer: customfishingfont["default"][data.extra[4].text.charCodeAt().toString(16)],
                    }
                    // // "bar-effective-area-width": 155, "judgment-area-offset": -160, "judgment-area-width": 45
                    let judgementPosition = ui.judgementArea["bar-effective-area-width"] + ui.judgementAreaOffset + Math.floor(ui.judgementArea["judgment-area-width"] / 2)
                    let pointerPosition = ui.judgementArea["bar-effective-area-width"] + ui.pointerOffset
                    res.game.ui = {
                        barChar: barChar,
                        judgementAreaOffset: ui.judgementAreaOffset,
                        pointerOffset: ui.pointerOffset,
                        judgementPosition: judgementPosition,
                        pointerPosition: pointerPosition
                    }
                    // // if (pointer < judgePointer) {
                    // //     keyClick('key.keyboard.left.shift', 1)
                    // // }
                    // // logFile.append(JSON.stringify(ui) + '\n')
                    // keyClick('key.mouse.right')
                } else {
                    res.game.type = 'AccurateClickGame' // 打靶游戏
                    // private void showUI() {
                    //     String bar = AdventureHelper.surroundWithMiniMessageFont(barImage, font)
                    //             + OffsetUtils.getOffsetChars(pointerOffset + progress)
                    //             + AdventureHelper.surroundWithMiniMessageFont(pointerImage, font)
                    //             + OffsetUtils.getOffsetChars(totalWidth - progress - pointerWidth);
                    //     SparrowHeart.getInstance().sendTitle(getPlayer(), AdventureHelper.miniMessageToJson(sendTitle.render(hook.getContext())), AdventureHelper.miniMessageToJson(bar), 0, 20, 0);
                    // }
                    // public boolean isSuccessful() {
                    //     if (forcedGameResult != null) return forcedGameResult;
                    //     if (isTimeOut) return false;
                    //     int last = progress / widthPerSection;
                    //     return (Math.random() < successRate[last]);
                    // }
                    let progressOffset = eval(Array.from(data.extra[1].text)
                        .map(v => v.charCodeAt().toString(16))
                        .map(v => customfishingfont["offset_chars"][v]?.height)
                        .join("+"))
                    let bar = customfishingfont["default"][barChar]
                    let pointer = customfishingfont["default"][data.extra[2].text.charCodeAt().toString(16)]
                    let totalWidth = 16 * 11
                    let pointerOffset = -183
                    let widthPerSection = totalWidth / bar.rate.length
                    // let progress = - pointerOffset + progressOffset
                    let progress = totalWidth + progressOffset
                    let index = Math.floor(progress / widthPerSection)
                    res.game.ui = {
                        barChar: barChar,
                        progressOffset: progressOffset,
                        progress: progress,
                        index: index,
                        chance: bar.rate[index + 16 / widthPerSection],
                        // bar: bar,
                        // pointer: pointer
                    }
                }

            } else if (/点击\d+次/.test(title)) {
                res.game.type = 'ClickGame' // 点击游戏
                res.game.ui = {
                    current: null,
                    total: null,
                    time: null
                }
                let titleMatches = /已点击(?<current>\d+)次/.exec(res.TITLE.message.getString())
                if (titleMatches) {
                    res.game.ui.current = parseInt(titleMatches.groups['total'])
                }
                let SubtitleMatches = /左键点击\s*(?<total>\d+)\s*次以获胜。剩余时间\s*(?<time>[\d+])\s*s/.exec(res.SUBTITLE.message.getString())
                if (SubtitleMatches) {
                    res.game.ui.total = parseInt(SubtitleMatches.groups['total'])
                    res.game.ui.time = parseFloat(SubtitleMatches.groups['time'])
                }
            }
        }
    } else {
        titleContainer = { TITLE: null, SUBTITLE: null, ACTIONBAR: null }
    }

    return {
        attrs: res,
        display: [
            `时间: ${res.time.toLocaleString()}`,
            `主手: ${res.mainHand.getName().getString()}(${res.mainHand.getDurability()}/${res.mainHand.getMaxDurability()})`,
            `钓钩: ${res.hook}`,
            `垂钓: ${res.isFishing ? '是' : '否'}`,
            // `TITLE: ${res.TITLE}`,
            // `SUBTITLE: ${res.SUBTITLE}`,
            // `ACTIONBAR: ${res.ACTIONBAR}`,
            `游戏: ${JSON.stringify(res.game)}`,
        ]
    }
}
const showCustomFishInfo = () => {
    let fishInfos = getCustomFishInfos()
    for (let i = 0; i < fishInfos.display.length; i++)
        fish_panel[i]?.setText(fishInfos.display[i])
    return fishInfos
}
const keyClick = (key, delay = 5) => {
    KeyBind.pressKey(key)
    Client.waitTick(delay)
    KeyBind.releaseKey(key)
}

Hud.clearDraw2Ds()

if (isToggle()) {
    // logFile.write('')

    fish_d2d.setOnInit(JavaWrapper.methodToJava(() => {
        let fishInfos = getCustomFishInfos()
        for (let i = 0; i < fishInfos.display.length; i++) {
            fish_panel.push(fish_d2d.addText(
                fishInfos.display[i],
                fish_d2d_setting.x, fish_d2d_setting.y - Math.round(fish_d2d_setting.scale * 10) * (fishInfos.display.length - i),
                fish_d2d_setting.color, fish_d2d_setting.shadow,
                fish_d2d_setting.scale, fish_d2d_setting.rotation))
        }
    }))
    fish_d2d.register()

    // mcTickListener = JsMacros.on('Tick', JavaWrapper.methodToJava(() => {
    //     Player.openInventory().getSlots(['main', 'hotbar']).forEach(i => {
    //         let slot = Player.openInventory().getSlot(i)
    //         if (dropItemMatch.test(slot.getName().getString())) {
    //             Player.openInventory().dropSlot(i)
    //         }
    //     })
    // }))
    titleListener = JsMacros.on("Title", JavaWrapper.methodToJava(ev => {
        // logFile.append(ev.toString() + '\n')
        titleContainer[ev.type] = ev
        let content = ev.message.getString()

        if (/[\(（].*[）\)]$/.test(content.trim())) {
            // 挂机问答
            let matches = /[\(（](?<val>.*)[）\)]$/.exec(content.trim())
            let answer = matches?.groups['val'].split(/[\:：]/)[1]?.trim()
            if (!matches?.groups['val']?.includes('最佳记录')) {
                Chat.log(content)
                Chat.say(answer)
            }
        } else if (/[0-9]+\=\?$/.test(content.trim())) {
            let matches = /^(?<val>.*)\=\?$/.exec(content.trim())
            let val = matches?.groups['val']?.replace(/[x×]/, '*')?.replace('÷', '/')?.replace('＋', '+')
            try {
                let answer = eval(val)
                Chat.say(`${answer}`)
            } catch (err) {
                Chat.log(err)
                logFile.append(val + '\n')
            }
        } else {
            if (/按下 左Shift 开始/.test(content)) {
                keyClick('key.keyboard.left.shift')
            }
        }
    }))
}

let danceCache = null
while (isToggle()) {
    // 当有经验修补时会交替钓鱼和板条箱补充耐久
    let fishInfos = showCustomFishInfo()
    if (fishInfos.attrs.isFishing) {
        let game = fishInfos.attrs.game
        if (game.type == 'TensionGame') {
            // let icons = JSON.parse(fishInfos.attrs.TITLE.message.getJson())?.text?.charCodeAt()?.toString(16)
            if (game.ui) {
                if (/b01[1-4]$/.test(game.ui.progress)) {
                    keyClick('key.keyboard.left.shift')
                    // Client.waitTick((parseInt(game.ui.progress[game.ui.progress.length - 1]) - 1) * 2)
                }
            }
        } else if (game.type == 'ClickGame') {
            if (game.ui) {
                keyClick('key.mouse.left')
            }
        } else if (game.type == 'DanceGame') {
            if (game.ui) {
                if (danceCache != game.ui.gray) {
                    keyClick(game.ui.action)
                    danceCache = game.ui.gray
                    Client.waitTick(5)
                }
            }
        } else if (game.type == 'AccurateClickGame') {
            if (game.ui) {
                if (game.ui.chance == 1 && game.ui.index >= 0)
                    keyClick('key.mouse.right')
            }
        } else if (game.type == 'HoldGame') {
            // if (game.ui) {
            //     if (game.ui.pointerPosition < game.ui.judgementPosition) {
            //         keyClick('key.keyboard.left.shift')
            //     }
            // }
            keyClick('key.mouse.right')
        }
    } else {
        danceCache = null
    }
    Client.waitTick()
}

// if (mcTickListener)
//     JsMacros.off(mcTickListener)
if (titleListener)
    JsMacros.off(titleListener)
