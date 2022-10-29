/**
 * @name ToggleVoice
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.2.0
 * @invite SgKSKyh9gY
 * @description Keybind to toogle between voice activity and ptt.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/ToggleVoice.plugin.js
 */
/*@cc_on
@if (@_jscript)
var shell = WScript.CreateObject("WScript.Shell");
var fs = new ActiveXObject("Scripting.FileSystemObject");
var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
var pathSelf = WScript.ScriptFullName;
shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
} else if (!fs.FolderExists(pathPlugins)) {
shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
} else if (shell.Popup("Should I move myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
fs.MoveFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)));
shell.Exec("explorer " + pathPlugins);
shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
}
WScript.Quit();
@else@*/
module.exports = (() => {
  const config = {
    info: {
      name: "ToggleVoice",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
        {
          name: "Kirai",
          discord_id: "872383230328832031",
          github_username: "HiddenKirai",
        },
      ],
      version: "1.2.0",
      description: "Keybind to toogle between voice activity and ptt.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/ToggleVoice.plugin.js",
    },
    changelog: [
      {
        title: "v0.0.1",
        items: ["Idea in mind"],
      },
      {
        title: "v0.0.5",
        items: ["Base Model"],
      },
      {
        title: "Initial Release v1.0.0",
        items: [
          "This is the initial release of the plugin :)",
          "Got you sabbee (⊙_⊙)？",
        ],
      },
      {
        title: "v1.0.2",
        items: ["Ability To Change Keybinds"],
      },
      {
        title: "v1.0.3",
        items: ["Custom icon on toasts"],
      },
      {
        title: "v1.0.6",
        items: ["Setting rewrite and refractor"],
      },
      {
        title: "v1.1.2",
        items: ["Keybind listner is improved"],
      },
    ],
    main: "ToggleVoice.plugin.js",
  };
  return !window.hasOwnProperty("ZeresPluginLibrary")
  ? class {
      load() {
        BdApi.showConfirmationModal(
          "ZLib Missing",
          `The library plugin (ZeresPluginLibrary) needed for ${config.info.name} is missing. Please click Download Now to install it.`,
          {
            confirmText: "Download Now",
            cancelText: "Cancel",
            onConfirm: () => this.downloadZLib(),
          }
        );
      }
      async downloadZLib() {
        const fs = require("fs");
        const path = require("path");
        const ZLib = await fetch(
          "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js"
        );
        if (!ZLib.ok) return this.errorDownloadZLib();
        const ZLibContent = await ZLib.text();
        try {
          await fs.writeFile(
            path.join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"),
            ZLibContent,
            (err) => {
              if (err) return this.errorDownloadZLib();
            }
          );
        } catch (err) {
          return this.errorDownloadZLib();
        }
      }
      errorDownloadZLib() {
        const { shell } = require("electron");
        BdApi.showConfirmationModal(
          "Error Downloading",
          [
            `ZeresPluginLibrary download failed. Manually install plugin library from the link below.`,
          ],
          {
            confirmText: "Download",
            cancelText: "Cancel",
            onConfirm: () => {
              shell.openExternal(
                "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js"
              );
            },
          }
        );
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
          Settings: { SettingPanel, Keybind, Switch },
        } = Library;
        const SoundStore = WebpackModules.getByProps("isDeaf");
        const InputStore = WebpackModules.getByProps("toggleSelfDeaf");
        const WindowInfoStore = WebpackModules.getByProps(
          "isFocused",
          "isElementFullScreen"
        );
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
        const defaultSettings = {
          keybind: ["ctrl", "m"],
          showToast: true
        }
        return class ToggleVoice extends Plugin {
          constructor() {
            super();
            this.currentlyPressed = {};
            this.keybindListener = this.keybindListener.bind(this);
            this.cleanCallback = this.cleanCallback.bind(this);
            this.settings = Utilities.loadData(config.info.name, "settings", defaultSettings)
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
          addListeners() {
            window.addEventListener("keydown", this.keybindListener);
            window.addEventListener("keyup", this.keybindListener);
            WindowInfoStore.addChangeListener(this.cleanCallback);
          }
          onStop() {
            this.removeListeners();
          }
          removeListeners() {
            window.removeEventListener("keydown", this.keybindListener);
            window.removeEventListener("keyup", this.keybindkeybindListener);
            WindowInfoStore.removeChangeListener(this.cleanCallback);
          }
          cleanCallback() {
            if (WindowInfoStore.isFocused()) this.currentlyPressed = {};
          }

          keybindListener(e) {        
            const re = new RegExp(Object.keys(toReplace).join("|"), "gi");
            this.currentlyPressed[
              e.code?.toLowerCase().replace(re, (matched) => {
                return toReplace[matched];
              })
            ] = e.type == "keydown";
            if (
              this.settings["keybind"]?.length &&
              this.settings["keybind"].every(
                (key) => this.currentlyPressed[key.toLowerCase()] === true
              )
            )
              this.toogleVoiceMode();
            this.currentlyPressed = Object.entries(this.currentlyPressed)
              .filter((t) => t[1] === true)
              .reduce((a, v) => ({ ...a, [v[0]]: v[1] }), {});
          }
          toogleVoiceMode() {
            const currentMode = SoundStore.getMode();
            let mode =
              currentMode !== "VOICE_ACTIVITY"
                ? "VOICE_ACTIVITY"
                : "PUSH_TO_TALK";
            InputStore.setMode(mode);
            if (this.settings["showToast"])
              Toasts.show(
                `Set to ${mode == "VOICE_ACTIVITY" ? "Voice Activity" : "PTT"}`,
                {
                  icon: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/voice-45-470369%20copy.png",
                  timeout: 500,
                  type: "success",
                }
              );
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new Keybind(
                "Toggle by keybind:",
                "Keybind to toggle between PTT and Voice Acitvity",
                this.settings["keybind"],
                (e) => {
                  this.settings["keybind"] = e;
                }
              ),
              new Switch(
                "Show Toasts",
                "Weather to show toast on changing voice mode",
                this.settings["showToast"],
                (e) => {
                  this.settings["showToast"] = e;
                }
              )
            );
          }
          saveSettings() {
            Utilities.saveData(config.info.name, "settings", this.settings);
          }
        };
        return plugin(Plugin, Library);
      })(window.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
