/**
 * @name BetterKeybinds
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.2.1
 * @invite SgKSKyh9gY
 * @description Add keybinds to toggle plugins and themes.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/BetterKeybinds.plugin.js
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
      version: "1.2.1",
      description: "Add keybinds to toggle plugins and themes.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/BetterKeybinds.plugin.js",
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
   const RequiredLibs = [{
    window: "ZeresPluginLibrary",
    filename: "0PluginLibrary.plugin.js",
    external: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
    downloadUrl: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js"
  },
  {
    window: "BunnyLib",
    filename: "1BunnyLib.plugin.js",
    external: "https://github.com/Tharki-God/BetterDiscordPlugins",
    downloadUrl: "https://tharki-god.github.io/BetterDiscordPlugins/1BunnyLib.plugin.js"
  },
  ];
  class handleMissingLibrarys {
    load() {
      for (const Lib of RequiredLibs.filter(lib =>  !window.hasOwnProperty(lib.window)))
        BdApi.showConfirmationModal(
          "Library Missing",
          `The library plugin (${Lib.window}) needed for ${config.info.name} is missing. Please click Download Now to install it.`,
          {
            confirmText: "Download Now",
            cancelText: "Cancel",
            onConfirm: () => this.downloadLib(Lib),
          }
        );
    }
    async downloadLib(Lib) {
      const fs = require("fs");
      const path = require("path");
      const { Plugins } = BdApi;
      const LibFetch = await fetch(
        Lib.downloadUrl
      );
      if (!LibFetch.ok) return this.errorDownloadLib(Lib);
      const LibContent = await LibFetch.text();
      try {
        await fs.writeFile(
          path.join(Plugins.folder, Lib.filename),
          LibContent,
          (err) => {
            if (err) return this.errorDownloadLib(Lib);
          }
        );
      } catch (err) {
        return this.errorDownloadLib(Lib);
      }
    }
    errorDownloadZLib(Lib) {
      const { shell } = require("electron");
      BdApi.showConfirmationModal(
        "Error Downloading",
        [
          `${Lib.window} download failed. Manually install plugin library from the link below.`,
        ],
        {
          confirmText: "Download",
          cancelText: "Cancel",
          onConfirm: () => {
            shell.openExternal(
              Lib.external
            );
          },
        }
      );
    }
    start() { }
    stop() { }
  }
  return RequiredLibs.some(m => !window.hasOwnProperty(m.window))
    ? handleMissingLibrarys
    : (([Plugin, ZLibrary]) => {
      const {
        Toasts,
        Utilities,
        PluginUpdater,
        Logger,
        Settings: { SettingPanel, SettingGroup },
      } = ZLibrary;
      const { Plugins, Themes, settings } = BdApi;
      const { 
        Settings: { Keybind },
        LibraryModules: {
          WindowInfoStore,
          KeybindUtils
        },
      } = BunnyLib.build(config);
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
          for (const [id, keybind] of plugins) {
            const keybindEvent = KeybindUtils.d2(keybind);
            if (
              e.type == "keyup" &&
              keybindEvent.length &&
              keybindEvent.every(
                (ev) =>
                  Object.keys(ev)
                    .filter((k) => k !== "keyCode")
                    .every((k) => ev[k] == e[k]) &&
                  this.currentlyPressed[ev["keyCode"]]
              )
            )
              Plugins.toggle(id);
          }
          for (const [id, keybind] of themes) {
            const keybindEvent = KeybindUtils.d2(keybind);
            if (
              e.type == "keyup" &&
              keybindEvent.length &&
              keybindEvent.every(
                (ev) =>
                  Object.keys(ev)
                    .filter((k) => k !== "keyCode")
                    .every((k) => ev[k] == e[k]) &&
                  this.currentlyPressed[ev["keyCode"]]
              )
            )
              id == "CustomCSS" ? this.toggleCSS() : Themes.toggle(id);
          }
          this.currentlyPressed[e.keyCode] = e.type == "keydown";
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
    })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
