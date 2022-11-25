/**
 * @name BetterKeybinds
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.1.2
 * @invite SgKSKyh9gY
 * @description Add keybinds to toggle plugins and themes.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BetterKeybinds.plugin.js
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
module.exports = ((_) => {
  const config = {
    info: {
      name: "BetterKeybinds",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.1.2",
      description: "Add keybinds to toggle plugins and themes.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BetterKeybinds.plugin.js",
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
          "ToogleYourStuff but good looking (⊙_⊙)？",
        ],
      },
      {
        title: "v1.1.1",
        items: ["Corrected text."],
      },
    ],
    main: "BetterKeybinds.plugin.js",
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
          Toasts,
          Utilities,
          PluginUpdater,
          Logger,
          Settings: { SettingPanel, SettingGroup, Keybind },
        } = Library;
        const { Plugins, Themes, settings } = BdApi;
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
          pluginsData: {},
          themesData: {},
        };
        return class BetterKeybinds extends Plugin {
          constructor() {
            super();
            this.currentlyPressed = {};
            this.keybindListener = this.keybindListener.bind(this);
            this.cleanCallback = this.cleanCallback.bind(this);
            this.settings = Utilities.loadData(
              config.info.name,
              "settings",
              defaultSettings
            );
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
          onStart() {
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
            window.removeEventListener("keyup", this.keybindListener);
            WindowInfoStore.removeChangeListener(this.cleanCallback);
          }
          cleanCallback() {
            if (WindowInfoStore.isFocused()) this.currentlyPressed = {};
          }
          keybindListener(e) {
            const plugins = Object.entries(this.settings["pluginsData"]);
            const themes = Object.entries(this.settings["themesData"]);
            const replacer = new RegExp(Object.keys(toReplace).join("|"), "gi");
            this.currentlyPressed[
              e.code?.toLowerCase().replace(replacer, (matched) => {
                return toReplace[matched];
              })
            ] = e.type == "keydown";

            for (const [id, keybind] of plugins) {
              if (
                keybind.length &&
                keybind.every((key) => this.currentlyPressed[key] === true)
              )
                Plugins.toggle(id);
            }
            for (const [id, keybind] of themes) {
              if (
                keybind.length &&
                keybind.every(
                  (key) => this.currentlyPressed[key.toLowerCase()] === true
                )
              )
                id == "CustomCSS" ? this.toggleCSS() : Themes.toggle(id);
            }
            this.currentlyPressed = Object.entries(this.currentlyPressed)
              .filter((t) => t[1] === true)
              .reduce((a, v) => ({ ...a, [v[0]]: v[1] }), {});
          }
          toggleCSS() {
            const enabled = this.getBDSetting(
              "settings",
              "customcss",
              "customcss"
            );
            BdApi.toggleSetting("settings", "customcss", "customcss");
            Toasts.show(`${enabled ? "Disabled" : "Enabled"} Custom CSS`, {
              icon: "https://cdn.discordapp.com/attachments/970704927397650462/989897913046040656/ic_fluent_document_css_24_regular.png",
              timeout: 500,
              type: "success",
            });
          }
          getBDSetting(collection, category, key) {
            if (!collection || !category || !key) return;
            return settings
              .find((s) => s.id == collection)
              .settings.find((s) => s.id == category)
              .settings.find((s) => s.id == key)?.value;
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new SettingGroup("Plugins", {
                collapsible: true,
                shown: false,
              }).append(
                ...Plugins.getAll()
                  .filter((plugin) => plugin.id !== config.info.name)
                  .map(
                    (plugin) =>
                      new Keybind(
                        plugin.id,
                        plugin.description,
                        this.settings["pluginsData"][plugin.id] ?? [],
                        (e) => {
                          this.settings["pluginsData"][plugin.id] = e;
                        }
                      )
                  )
              ),
              new SettingGroup("Themes", {
                collapsible: true,
                shown: false,
              }).append(
                new Keybind(
                  "Custom CSS",
                  "Toggle Custom CSS tab and injection.",
                  this.settings["themesData"]["CustomCSS"] ?? [],
                  (e) => {
                    this.settings["themesData"]["CustomCSS"] = e;
                  }
                ),
                ...Themes.getAll().map(
                  (theme) =>
                    new Keybind(
                      theme.id,
                      theme.description,
                      this.settings["themesData"][theme.id] ?? [],
                      (e) => {
                        this.settings["themesData"][theme.id] = e;
                      }
                    )
                )
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
