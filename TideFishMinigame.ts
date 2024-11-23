// 脚本名称: 潮汐自动钓鱼
// 功能介绍: 检测钓鱼小游戏进度，在接近完美时收杆（暂不能百分百完美）
// 依赖模组: 宏(jsmacros)、潮汐(Tide)
// 创建时间: 2024-11-21
// 修改时间: 2024-11-23
// 当前版本: v1.2
// 更新内容: v1.2 增加丢弃物品名单，修改板条箱概率为100%，适配有经验修补的钓竿
// 更新内容: v1.1 检测主手是否是钓竿
// 更新内容: v1.0 初始化脚本
// 注意事项：板条箱类似重力方块被钓上来，挂机时在脚下和周边铺上按钮，防止板条箱过多影响持续钓鱼

const scriptName = 'TideFishMinigame.ToggleScript'
const isToggle = () => GlobalVars.getBoolean(scriptName)
const mclog = (preix, msg, preixColor = 0x5, msgColor = 0x7) => {
    Chat.log(Chat.createTextBuilder()
        .append("[").withColor(preixColor).append(preix).withColor(preixColor).append("]").withColor(preixColor)
        .append(" " + msg).withColor(msgColor).build())
}
const setToggle = (value) => {
    GlobalVars.putBoolean(scriptName, value)
    mclog(scriptName, value ? "enabled" : "disabled")
}
var reverse = !isToggle()
setToggle(reverse)

// 函数区
const FishCatchMinigame = Java.type('com.li64.tide.data.minigame.FishCatchMinigame')
const Tide = Java.type('com.li64.tide.Tide')
const RefClass = {
    // 参考来源：https://mappings.dev/1.21.1/index.html
    MinecraftClient: Reflection.getClass('net.minecraft.class_310'), // net.minecraft.client.MinecraftClient
    GameConfig: Reflection.getClass('net.minecraft.class_542'), // net.minecraft.client.GameConfig
    MCPlayer: Reflection.getClass('net.minecraft.class_1657'), // net.minecraft.world.entity.player.Player
    MCServerPlayer: Reflection.getClass('net.minecraft.class_3222'), // net.minecraft.server.level.ServerPlayer
    FishingHook: Reflection.getClass('net.minecraft.class_542'), // net.minecraft.world.entity.projectile.FishingHook

    // 参考来源：https://github.com/Lightning-64/Tide/tree/main/common/src/main/java/com/li64/tide
    Tide: Reflection.getClass('com.li64.tide.Tide'),
    FishCatchMinigame: Reflection.getClass('com.li64.tide.data.minigame.FishCatchMinigame'),
    TidePlayerData: Reflection.getClass('com.li64.tide.data.player.TidePlayerData'),
    HookAccessor: Reflection.getClass('com.li64.tide.registries.entities.misc.fishing.HookAccessor'),
    TideFishingHook: Reflection.getClass('com.li64.tide.registries.entities.misc.fishing.TideFishingHook'),
    CatchMinigameOverlay: Reflection.getClass('com.li64.tide.client.gui.overlays.CatchMinigameOverlay'),
}
const printFields = (target) => {
    target.fields().forEach(e => {
        let value = null
        try { value = target.field(e) } catch { value = '[error]' }
        Chat.log(e + '=' + value)
    })
}
const printProperty = (target) => Object.keys(target).forEach(k => { Chat.log(`${k}=${target[k]}`) })
const getDecalaredFieldValue = (obj, javaClass, name) => {
    if (obj == null)
        return null

    let field = Reflection.getDeclaredField(javaClass, name)
    field.setAccessible(true)
    return field.get(obj)
}
const setDecalaredFieldValue = (obj, javaClass, name, value) => {
    if (obj == null)
        return null

    let field = Reflection.getDeclaredField(javaClass, name)
    field.setAccessible(true)
    return field.set(obj, value)
}
const getFishInfos = () => {
    let res = {
        // time: new Date(),
        mainHand: Player.getPlayer().getMainHand(),
        isFishing: false,
        biome: null,
        nibble: 0,
        luck: 0,
        lureSpeed: 0,
        timeUntilLured: 0,
        timeUntilHooked: 0,
        currentState: null,
        catchType: null,
        isOpenWaterFishing: false,
        hookItem: null,
        minigame: FishCatchMinigame.ACTIVE_MINIGAMES?.filter(game => {
            let gameplayer = getDecalaredFieldValue(game, RefClass.FishCatchMinigame, 'player')
            let uuid = Reflection.getReflect(gameplayer).field('field_5981').get()
            return uuid == Player.getPlayer().getUUID()
        }),
    }

    let mc_player = Reflection.getReflect(Client.getMinecraft()).field('field_1724') // .player
    let hook = mc_player.field('field_7513')
    if (hook != null) {
        res = {
            ...res,
            isFishing: hook.get()?.isFishing() ?? false
        }
        if (hook?.get() != null) {
            let tide_hook = getDecalaredFieldValue(hook?.get(), RefClass.HookAccessor, 'hook')
            res = {
                ...res,
                biome: tide_hook?.getBiome(),
                nibble: getDecalaredFieldValue(tide_hook, RefClass.TideFishingHook, 'nibble'),
                luck: tide_hook?.getLuck(),
                lureSpeed: tide_hook?.getLureSpeed(),
                timeUntilLured: getDecalaredFieldValue(tide_hook, RefClass.TideFishingHook, 'timeUntilLured'),
                timeUntilHooked: getDecalaredFieldValue(tide_hook, RefClass.TideFishingHook, 'timeUntilHooked'),
                currentState: getDecalaredFieldValue(tide_hook, RefClass.TideFishingHook, 'currentState'),
                catchType: tide_hook?.getCatchType(),
                isOpenWaterFishing: tide_hook?.isOpenWaterFishing(),
            }
        }
    }

    return {
        attrs: res,
        display: [
            // `时间: ${res.time.toLocaleString()}`,
            `主手: ${res.mainHand.getName().getString()}(${res.mainHand.getDurability()}/${res.mainHand.getMaxDurability()})`,
            `垂钓: ${res.isFishing ? '是' : '否'}`,
            `状态: ${res.currentState}`,
            `渔获: ${res.catchType}`,
            `宝藏: ${Math.round(100 / Tide.CONFIG.general.baseCrateRarity)}%`,
            // `游戏: ${res.minigame}`,
            // `待钓: ${res.nibble}`,
            // `幸运值: ${res.luck}`,
            // `诱饵速度: ${res.lureSpeed}`,
            // `垂钓时限: ${res.timeUntilHooked}`,
            // `诱饵时限: ${res.timeUntilLured}`,
            // `开放水域: ${res.isOpenWaterFishing}`,
        ]
    }
}
const showFishInfo = () => {
    let fishInfos = getFishInfos()
    for (let i = 0; i < fishInfos.display.length; i++)
        fish_panel[i]?.setText(fishInfos.display[i])
    return fishInfos
}
const getMinigameProgress = () => {
    let active = getDecalaredFieldValue(RefClass.CatchMinigameOverlay, RefClass.CatchMinigameOverlay, 'active')
    if (!active)
        return { active: false, accuracyKey: '未开始' }
    let animProgress = getDecalaredFieldValue(RefClass.CatchMinigameOverlay, RefClass.CatchMinigameOverlay, 'animProgress')
    let getSpeedMethod = Reflection.getMethod(RefClass.CatchMinigameOverlay, 'getSpeed')
    let speed = Reflection.invokeMethod(getSpeedMethod, RefClass.CatchMinigameOverlay)
    let accuracy = Math.abs(Math.sin(animProgress * speed))
    let accuracyKey = "垃圾"
    if (accuracy < 0.05)
        accuracyKey = "完美！"
    else if (accuracy < 0.15)
        accuracyKey = "很棒！"
    else if (accuracy < 0.3)
        accuracyKey = "良好"
    else if (accuracy < 0.45)
        accuracyKey = "还行"
    else if (accuracy < 0.6)
        accuracyKey = "不好"
    else if (accuracy < 0.78)
        accuracyKey = "糟糕"
    return { active: true, speed: speed, accuracy: accuracy, accuracyKey: accuracyKey }
}

Hud.clearDraw2Ds()

// 参数区
const fish_d2d = Hud.createDraw2D()
const fish_d2d_setting = {
    x: 30,
    y: fish_d2d.getHeight() - 2,
    color: 0xFFFFFF,
    shadow: true,
    scale: 0.5,
    rotation: 0
}
const fish_panel = []
let mcTickListener
const dropItemMatch = /烈焰剑鱼|碗|便条/
const TideGeneralConfig = {
    holdToCast: false, // 蓄力抛竿，默认值：true
    baseCrateRarity: 1, // 板条箱基础概率（1 / baseCrateRarity * 100%），默认值：20
}

if (isToggle()) {
    fish_d2d.setOnInit(JavaWrapper.methodToJava(() => {
        let fishInfos = getFishInfos()
        let gamePs = getMinigameProgress()
        fishInfos.display.push(`进度: ${gamePs.accuracyKey}`)
        for (let i = 0; i < fishInfos.display.length; i++) {
            fish_panel.push(fish_d2d.addText(
                fishInfos.display[i],
                fish_d2d_setting.x, fish_d2d_setting.y - Math.round(fish_d2d_setting.scale * 10) * (fishInfos.display.length - i),
                fish_d2d_setting.color, fish_d2d_setting.shadow,
                fish_d2d_setting.scale, fish_d2d_setting.rotation))
        }
    }))
    fish_d2d.register()

    mcTickListener = JsMacros.on('Tick', JavaWrapper.methodToJava(() => {
        Player.openInventory().getSlots(['main', 'hotbar']).forEach(i => {
            let slot = Player.openInventory().getSlot(i)
            if (dropItemMatch.test(slot.getName().getString())) {
                Player.openInventory().dropSlot(i)
            }
        })
    }))

    Object.keys(TideGeneralConfig).forEach(k => Tide.CONFIG.general[k] = TideGeneralConfig[k])
}
Chat.log(Player.getPlayer().getMainHand())
while (isToggle()) {
    // 当有经验修补时会交替钓鱼和板条箱补充耐久
    let mainHand = Player.getPlayer().getMainHand()
    Tide.CONFIG.general.baseCrateRarity = mainHand.getDurability() < mainHand.getMaxDurability() - 10 &&
        /fishing_rod$/.test(mainHand.getItemId()) &&
        mainHand.getEnchantments().some(v => v.getId() == 'minecraft:mending') ? 20 : TideGeneralConfig.baseCrateRarity
    
    let fishInfos = showFishInfo()
    if (FishCatchMinigame.ACTIVE_MINIGAMES.length > 0) {
        fishInfos = showFishInfo()
        for (let game of fishInfos.attrs.minigame) {
            do {
                let gamePs = getMinigameProgress()
                fish_panel[fish_panel.length - 1]?.setText(`进度: ${gamePs.accuracyKey}(${Math.round(gamePs.accuracy * 10000) / 100}%)`)
                if (gamePs.accuracy < 0.07)
                    break
                Time.sleep(1)
            } while (isToggle())
            game.interact()
            Client.waitTick(10)
        }
    } else if (fishInfos.attrs.catchType == 'FISH') {
        if (fishInfos.attrs.minigame.length == 0) {
            Player.getInteractionManager().interact()
            Client.waitTick(3)
        }
    } else if (fishInfos.attrs.catchType != 'NOTHING' ||
        (fishInfos.attrs.isFishing && fishInfos.attrs.catchType == 'NOTHING' && /FLYING|HOOKED_IN_ENTITY/.test(fishInfos.attrs.currentState))) {
        if (fishInfos.attrs.mainHand.getItemId().match('fishing_rod')) {
            Player.getInteractionManager().interact()
        }
        Client.waitTick(10)
    }
}

if (mcTickListener)
    JsMacros.off(mcTickListener)
