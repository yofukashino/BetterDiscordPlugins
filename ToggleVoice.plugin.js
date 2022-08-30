/**
 * @name ToggleVoice
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.1.1
 * @invite SgKSKyh9gY
 * @description Keybind to toogle between voice activity and ptt.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/ToggleVoice.plugin.js
 */
/*@cc_on
@if (@_jscript)
// Offer to self-install for clueless users that try to run this directly.
var shell = WScript.CreateObject("WScript.Shell");
var fs = new ActiveXObject("Scripting.FileSystemObject");
var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
var pathSelf = WScript.ScriptFullName;
// Put the user at ease by addressing them in the first person
shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
} else if (!fs.FolderExists(pathPlugins)) {
shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
// Show the user where to put plugins in the future
shell.Exec("explorer " + pathPlugins);
shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
}
WScript.Quit();
@else@*/
module.exports = (() => {
    const config = {
        info: {
            name: "ToggleVoice",
            authors: [{
                    name: "Ahlawat",
                    discord_id: "887483349369765930",
                    github_username: "Tharki-God",
                }, {
                    name: "Kirai",
                    discord_id: "872383230328832031",
                    github_username: "HiddenKirai",
                }
            ],
            version: "1.1.1",
            description: "Keybind to toogle between voice activity and ptt.",
            github: "https://github.com/Tharki-God/BetterDiscordPlugins",
            github_raw:
            "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/ToggleVoice.plugin.js",
        },
        changelog: [{
                title: "v0.0.1",
                items: [
                    "Idea in mind"
                ]
            }, {
                title: "v0.0.5",
                items: [
                    "Base Model"
                ]
            }, {
                title: "Initial Release v1.0.0",
                items: [
                    "This is the initial release of the plugin :)",
                    "Got you sabbee (⊙_⊙)？"
                ]
            }, {
                title: "v1.0.2",
                items: [
                    "Ability To Change Keybinds"
                ]
            }, {
                title: "v1.0.3",
                items: [
                    "Custom icon on toasts"
                ]
            }, {
                title: "v1.0.6",
                items: [
                    "Setting rewrite and refractor"
                ]
            }
        ],
        main: "ToggleVoice.plugin.js",
    };
    return !global.ZeresPluginLibrary
     ? class {
        constructor() {
            this._config = config;
        }
        getName() {
            return config.info.name;
        }
        getAuthor() {
            return config.info.authors.map((a) => a.name).join(", ");
        }
        getDescription() {
            return config.info.description;
        }
        getVersion() {
            return config.info.version;
        }
        load() {

            try {
                global.ZeresPluginLibrary.PluginUpdater.checkForUpdate(config.info.name, config.info.version, config.info.github_raw);
            } catch (err) {
                console.error(this.getName(), "Plugin Updater could not be reached.", err);
            }
            BdApi.showConfirmationModal(
                "Library Missing",
`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get(
                        "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                        async(error, response, body) => {
                        if (error) {
                            return BdApi.showConfirmationModal("Error Downloading",
                                [
                                    "Library plugin download failed. Manually install plugin library from the link below.",
                                    BdApi.React.createElement("a", {
                                        href: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                                        target: "_blank"
                                    }, "Plugin Link")
                                ], );
                        }
                        await new Promise((r) =>
                            require("fs").writeFile(
                                require("path").join(
                                    BdApi.Plugins.folder,
                                    "0PluginLibrary.plugin.js"),
                                body,
                                r));
                    });
                },
            });
        }
        start() {}
        stop() {}
    }
     : (([Plugin, Library]) => {
        const {
            WebpackModules,
            Logger,
            PluginUpdater,
            Toasts,
            Utilities,
            Settings: {SettingPanel, Keybind, Switch}
        } = Library;
        const SoundStore = WebpackModules.getByProps("getVoiceSettings");
        const InputStore = WebpackModules.getByProps('toggleSelfDeaf');
        return class ToggleVoice extends Plugin {
            constructor() {
                super();
                this.keybind = Utilities.loadData(config.info.name, "keybind", ["ctrl", "m"]);
                this.showToast = Utilities.loadData(config.info.name, "showToast", true);
                this.currentlyPressed = {};
            }
            checkForUpdates() {
                try {
                  PluginUpdater.checkForUpdate(
                    config.info.name,
                    config.info.version,
                    config.info.github_raw
                  );
                } catch (err) {
                  Logger.err("Plugin Updater could not be reached.", err);
                }
              }
              start() {
                this.checkForUpdates();
                this.addListeners();  
            }
            addListeners(){
                this.listener = this.listener.bind(this);
                window.addEventListener('keydown', this.listener);
                window.addEventListener('keyup', this.listener);
            }
            onStop() {
                window.removeEventListener("keydown", this.listener);
                window.removeEventListener("keyup", this.listener);
            }
            toogleVoiceMode() {
                const currentMode = SoundStore.getVoiceSettings().input_mode.type;
                let mode = currentMode !== "VOICE_ACTIVITY" ? "VOICE_ACTIVITY" : "PUSH_TO_TALK";
                InputStore.setMode(mode);
                if (this.showToast)
                    Toasts.show(`Set to ${mode == "VOICE_ACTIVITY" ? "Voice Activity" : "PTT"}`, {
                        icon: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/voice-45-470369%20copy.png",
                        timeout: 500,
                        type: 'success'
                    });
            }
            listener(e) {
                const toReplace = {
                    controlleft: "ctrl",
                    capslock: "caps lock",
                    shiftright: "right shift",
                    controlright: "right ctrl",
                    contextmenu: "right meta",
                    metaleft: "meta",
                    backquote: "`",
                    altleft: "alt",
                    altright: "right alt",
                    escape: "esc",
                    shiftleft: "shift",
                    key: "",
                    digit: "",
                    minus: "-",
                    equal: "=",
                    backslash: "\\",
                    bracketleft: "[",
                    bracketright: "]",
                    semicolon: ";",
                    quote: "'",
                    slash: "/",
                    comma: ",",
                    period: ".",
                    numpadadd: "numpad +",
                    numpadenter: "enter",
                    numpaddivide: "numpad /",
                    numpadmultiply: "numpad *",
                    numpadsubtract: "numpad -",
                    arrowleft: "left",
                    arrowright: "right",
                    arrowdown: "down",
                    arrowup: "up",
                    pause: "break",
                    pagedown: "page down",
                    pageup: "page up",
                    numlock: "numpad clear",
                    printscreen: "print screen",
                    scrolllock: "scroll lock",
                    numpad: "numpad ",
                  };
                  const re = new RegExp(Object.keys(toReplace).join("|"), "gi");
                  this.currentlyPressed[
                    e.code?.toLowerCase().replace(re, (matched) => {
                      return toReplace[matched];
                    })
                  ] = e.type == "keydown";
                  if (this.keybind?.length &&
                    this.keybind.every(
                      (key) => this.currentlyPressed[key.toLowerCase()] === true
                    )
                  )
                    this.toogleVoiceMode();
            }
            getSettingsPanel() {
                return SettingPanel.build(this.saveSettings.bind(this),
                    new Keybind("Toggle by keybind:", "Keybind to toggle between PTT and Voice Acitvity", this.keybind, (e) => {
                        this.keybind = e;
                    }),
                    new Switch("Show Toasts", "Weather to show toast on changing voice mode", this.showToast, (e) => {
                        this.showToast = e;
                    }));

            }
            saveSettings() {
                Utilities.saveData(config.info.name, "keybind", this.keybind);
                Utilities.saveData(config.info.name, "showToast", this.showToast);
            }
        }
        return plugin(Plugin, Library);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
