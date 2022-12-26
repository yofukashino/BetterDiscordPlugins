/**
 * @name HypeSquad
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.2.0
 * @invite SgKSKyh9gY
 * @description Get an option to choose in which HypeSquad House you want to be by right clicking on the home button.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/HypeSquad.plugin.js
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
      name: "HypeSquad",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.2.0",
      description:
        "Get an option to choose in which HypeSquad House you want to be by right clicking on the home button.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/HypeSquad.plugin.js",
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
          "Better than Astrological sign []~(￣▽￣)~*",
        ],
      },
      {
        title: "v1.0.2",
        items: ["Custom Icons"],
      },
      {
        title: "v1.0.5",
        items: ["More Custom Icons"],
      },
      {
        title: "v1.1.2",
        items: ["Corrected text."],
      },
    ],
    main: "HypeSquad.plugin.js",
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
        Patcher,
        WebpackModules,
        ContextMenu,
        PluginUpdater,
        Logger,
        Utilities,
        Toasts,
        ReactTools,
        Settings: { SettingPanel, Switch },
        DiscordModules: { React },
      } = ZLibrary;
      const { 
        HBCM, 
        LibraryIcons,
         LibraryModules: { HypeSquadStore }
        } = BunnyLib.build(config);      
      const defaultSettings = {
        showToast: true,
      };      
      return class HypeSquad extends Plugin {
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
        async start() {
          this.checkForUpdates();
          this.addMenu();
        }
        addMenu() {
          HBCM.insert(config.info.name, this.HypeSquad());
        }
        HypeSquad() {
          return {
            label: "Change HypeSquad House",
            id: "change-hypesquad",
            action: () => {
              this.changeHypeSquad();
            },
            children: ContextMenu.buildMenuChildren([
              {
                label: "Bravery",
                id: "bravery",
                icon: () => LibraryIcons.Bravery("21", "21"),
                action: () => {
                  this.changeHypeSquad("HOUSE_1");
                },
              },
              {
                label: "Brilliance",
                id: "brilliance",
                icon: () => LibraryIcons.Brilliance("21", "21"),
                action: () => {
                  this.changeHypeSquad("HOUSE_2");
                },
              },
              {
                label: "Balance",
                id: "balance",
                icon: () => LibraryIcons.Balance("21", "21"),
                action: () => {
                  this.changeHypeSquad("HOUSE_3");
                },
              },
              {
                label: "None",
                id: "leave-hypesquad",
                icon: () => LibraryIcons.Hypesquad("21", "21"),
                action: () => {
                  this.changeHypeSquad();
                },
              },
            ]),
          };
        }
        changeHypeSquad(house) {          
          try {
            switch (house) {
              case "HOUSE_1":
                HypeSquadStore.joinHypeSquadOnline({
                  houseID: "HOUSE_1",
                });
                if (this.settings["showToast"])
                  Toasts.show("You are now in the House of Bravery", {
                    icon: "https://tharki-god.github.io/files-random-host/BraveryLogo%20copy.png",
                    timeout: 1000,
                    type: "success",
                  });

                break;
              case "HOUSE_2":
                HypeSquadStore.joinHypeSquadOnline({
                  houseID: "HOUSE_2",
                });
                if (this.settings["showToast"])
                  Toasts.show("You are now in the House of Brillance", {
                    icon: "https://tharki-god.github.io/files-random-host/BrillianceLogo%20copy.png",
                    timeout: 1000,
                    type: "success",
                  });

                break;
              case "HOUSE_3":
                HypeSquadStore.joinHypeSquadOnline({
                  houseID: "HOUSE_3",
                });
                if (this.settings["showToast"])
                  Toasts.show("You are now in the House of Balance", {
                    icon: "https://tharki-god.github.io/files-random-host/BalanceLogo%20copy.png",
                    timeout: 1000,
                    type: "success",
                  });
                break;
              default:
                HypeSquadStore.leaveHypeSquadOnline();
                if (this.settings["showToast"])
                  Toasts.show("You have left the HypeSquad", {
                    icon: "https://tharki-god.github.io/files-random-host/HypeSquad%20copy.png",
                    timeout: 1000,
                    type: "success",
                  });
            }
          } catch (err) {
            Logger.err(err);
            if (this.settings["showToast"])
              Toasts.show(`Error: ${err}.`, {
                icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
                timeout: 5000,
                type: "error",
              });
          }
        }
        onStop() {
          HBCM.remove(config.info.name);
        }
        getSettingsPanel() {
          return SettingPanel.build(
            this.saveSettings.bind(this),
            new Switch(
              "Pop-up/Toast",
              "Display a message when switching houses.",
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
    })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
