const jrei = (() => {
    const getDecalaredFieldValue = (obj, javaClass, name) => {
        if (obj == null) return null
        let field = Reflection.getDeclaredField(javaClass, name)
        field.setAccessible(true)
        return field.get(obj)
    }
    const getClientScreen = () => {
        // https://maven.fabricmc.net/docs/yarn-1.21+build.2/net/minecraft/client/MinecraftClient.html#currentScreen
        let mc = Client.getMinecraft()
        return mc.currentScreen ?? mc.field_1755
    }
    let instance = {
        class: {},
        mouse: function () { return { X: Hud.getMouseX(), Y: Hud.getMouseY() } },
        getClientScreen: getClientScreen,
        getEntryListWidget: function () { return null },
        getFavoritesListWidget: function () { return null },
        getScreenFocusedStack: function (screen) { return null },
        getWidgetFocusedStack: function (widget) { return null },
        getFocusedStack: function () {
            return [
                { type: 'Inventory', stack: this.getScreenFocusedStack(this.getClientScreen()) },
                { type: 'EntryList', stack: this.getWidgetFocusedStack(this.getEntryListWidget()) },
                { type: 'FavoritesList', stack: this.getWidgetFocusedStack(this.getFavoritesListWidget()) }
            ].filter(v => v.stack != null)[0]
        }
    }
    try {
        instance = {
            class: {
                ScreenRegistry: Reflection.getClass('me.shedaniel.rei.api.client.registry.screen.ScreenRegistry'),
                ScreenOverlayImpl: Reflection.getClass('me.shedaniel.rei.impl.client.gui.ScreenOverlayImpl'),
                Widget: Reflection.getClass('me.shedaniel.rei.api.client.gui.widgets.Widget'),
            },
            mouse: function () { return Reflection.getMethod(this.class.Widget, 'mouse').invoke(null) },
            getClientScreen: getClientScreen,
            getEntryListWidget: function () {
                return Reflection.getMethod(this.class.ScreenOverlayImpl, 'getEntryListWidget').invoke(null)
            },
            getFavoritesListWidget: function () {
                return Reflection.getMethod(this.class.ScreenOverlayImpl, 'getFavoritesListWidget').invoke(null)
            },
            getScreenFocusedStack: function (screen) {
                let screenRegistry = Reflection.getMethod(this.class.ScreenRegistry, 'getInstance').invoke(null)
                let stack = screenRegistry?.getFocusedStack(screen, this.mouse())?.getValue()
                if (stack == null) return null
                return JavaUtils.getHelperFromRaw(stack)
            },
            getWidgetFocusedStack: function (widget) {
                let stack = widget?.getFocusedStack()?.getValue()
                if (stack == null) return null
                return JavaUtils.getHelperFromRaw(stack)
            },
            getFocusedStack: function () {
                return [
                    { type: 'Inventory', stack: this.getScreenFocusedStack(this.getClientScreen()) },
                    { type: 'EntryList', stack: this.getWidgetFocusedStack(this.getEntryListWidget()) },
                    { type: 'FavoritesList', stack: this.getWidgetFocusedStack(this.getFavoritesListWidget()) }
                ].filter(v => v.stack != null)[0]
            }
        }
    } catch {
        try {
            instance = {
                class: {
                    FabricGuiPlugin: Reflection.getClass('mezz.jei.fabric.plugins.fabric.FabricGuiPlugin'),
                },
                mouse: function () { return { X: Hud.getMouseX(), Y: Hud.getMouseY() } },
                getClientScreen: getClientScreen,
                getEntryListWidget: function () {
                    let target = this.class.FabricGuiPlugin
                    return getDecalaredFieldValue(target, target, 'runtime')?.getIngredientListOverlay()
                },
                getFavoritesListWidget: function () {
                    let target = this.class.FabricGuiPlugin
                    return getDecalaredFieldValue(target, target, 'runtime')?.getBookmarkOverlay()
                },
                getScreenFocusedStack: function (screen) {
                    if (screen == null) return null
                    let inv = Player.openInventory()
                    let slot = inv?.getSlotUnderMouse()
                    if (slot < 0) return null
                    let stack = inv.getSlot(slot)
                    if (stack.getCount() == 0) return null
                    return stack
                },
                getWidgetFocusedStack: function (widget) {
                    let typedIngredient = widget?.getIngredientUnderMouse()?.orElse(null)
                    let stack = typedIngredient?.getItemStack()?.orElse(null)
                    if (stack == null) return null
                    return JavaUtils.getHelperFromRaw(stack)
                },
                getFocusedStack: function () {
                    return [
                        { type: 'Inventory', stack: this.getScreenFocusedStack(this.getClientScreen()) },
                        { type: 'EntryList', stack: this.getWidgetFocusedStack(this.getEntryListWidget()) },
                        { type: 'FavoritesList', stack: this.getWidgetFocusedStack(this.getFavoritesListWidget()) }
                    ].filter(v => v.stack != null)[0]
                }
            }
        } catch { }
    }
    return instance
})()

Chat.log(jrei.getFocusedStack()?.stack)