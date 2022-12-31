/**
 * @name Address
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.3.0
 * @invite SgKSKyh9gY
 * @description Get an option to copy the current web address by right clicking on the home button.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/Address.plugin.js
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
      name: "Address",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.3.0",
      description:
        "Get an option to copy the current web address by right clicking on the home button.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/Address.plugin.js",
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
          "Who uses web discord anyways (ノω<。)ノ))☆.。",
        ],
      },
      {
        title: "v1.0.1",
        items: [
          "Option to normalize address to normal discord from ptb/canary.",
        ],
      },
      {
        title: "v1.2.2",
        items: ["Corrected text."],
      },
    ],
    main: "Address.plugin.js",
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
      for (const Lib of RequiredLibs.filter(lib => !window.hasOwnProperty(lib.window)))
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
        Utilities,
        Toasts,
        Logger,
        PluginUpdater,
        Settings: { SettingPanel, Switch },
      } = ZLibrary;
      const {
        HBCM,
        LibraryIcons,
        LibraryModules: {
          DiscordNative: { clipboard }
        }
      } = BunnyLib.build(config);
      const defaultSettings = {
        showToast: true,
        normalizeAddress: true,
      };

      return class Address extends Plugin {
        constructor() {
          super();
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
          HBCM.insert(config.info.name, this.makeMenuItem());
        }
        makeMenuItem() {
          return {
            label: "Copy Address",
            id: "copy-address",
            icon: () => LibraryIcons.Glob("20", "20"),
            action: async () => {
              try {
                var Address = window.location.href;
                if (this.settings["normalizeAddress"])
                  var Address = `https://discord.com/${Address.split("discord.com/")[1]
                    }`;
                if (!Address) {
                  Logger.err(
                    `Whoops! I couldn't find the current web address.`
                  );
                  if (this.settings["showToast"])
                    Toasts.show(
                      `Whoops! I couldn't find the current web address.`,
                      {
                        icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
                        timeout: 5000,
                        type: "error",
                      }
                    );
                  return;
                }
                clipboard.copy(Address);
                if (this.settings["showToast"])
                  Toasts.show(`Address Copied to Clipboard`, {
                    icon: "https://tharki-god.github.io/files-random-host/ic_fluent_send_copy_24_regular.png",
                    timeout: 5000,
                    type: "success",
                  });
              } catch (err) {
                if (this.settings["showToast"])
                  Toasts.show(`Error: ${err}.`, {
                    icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
                    timeout: 5000,
                    type: "error",
                  });
                Logger.err(err);
              }
            },
          };
        }
        onStop() {
          HBCM.remove(config.info.name);
        }
        getSettingsPanel() {
          return SettingPanel.build(
            this.saveSettings.bind(this),
            new Switch(
              "Pop-up/Toast",
              "Get a confirmation/error message when copying the web address.",
              this.settings["showToast"],
              (e) => {
                this.settings["showToast"] = e;
              }
            ),
            new Switch(
              "Normalize address",
              "Replace PTB/Canary links with normal (Stable) Discord links.",
              this.settings["normalizeAddress"],
              (e) => {
                this.settings["normalizeAddress"] = e;
              }
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
