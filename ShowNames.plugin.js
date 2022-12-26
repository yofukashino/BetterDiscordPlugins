/**
 * @name ShowNames
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 2.3.0
 * @invite SgKSKyh9gY
 * @description Makes names visible if they are (almost) the same color as the background.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/ShowNames.plugin.js
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
      name: "ShowNames",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        }
      ],
      version: "2.3.0",
      description: "Makes names visible if they are (almost) the same color as the background.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/ShowNames.plugin.js",
    },
    changelog: [
      {
        title: "v0.0.1",
        items: ["Idea in mind"],
      },
      {
        title: "v0.0.2",
        items: ["Base Model", "Not Working"],
      },
      {
        title: "v0.0.5",
        items: ["Base Model", "Working but buggy"],
      },
      {
        title: "v0.5.0",
        items: ["Intial code done"],
      },
      {
        title: "Initial Release v1.0.0",
        items: [
          "This is the initial release of the plugin :)",
          "Still need some optimization but kinda works",
        ],
      },
      {
        title: "v1.0.1",
        items: ["Library Handler"],
      },
      {
        title: "v1.0.2",
        items: [
          "IDK why i used BDFDB",
          "Well removed the usage of it",
          "FUCK YOU",
        ],
      },
      {
        title: "v1.0.3",
        items: ["Original Cache"],
      },
      {
        title: "v1.0.5",
        items: ["Removed useless code"],
      },
      {
        title: "v1.0.6",
        items: ["I am dumb"],
      },
      {
        title: "v2.0.0",
        items: ["Patch member directly instead of color", "Optimized"],
      },
      {
        title: "v2.0.3",
        items: ["Fixed some errors", "By: Kirai 💜"],
      },
      {
        title: "v2.0.5",
        items: ["Made it optional to patch roles"],
      },
      {
        title: "v2.1.0",
        items: ["Fixed member list color not changing."],
      },
      {
        title: "v2.2.1",
        items: ["Corrected text."],
      },
    ],
    main: "ShowNames.plugin.js",
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
        Patcher,
        PluginUpdater,
        Logger,
        Utilities,
        Settings: { SettingPanel, Slider, Switch },
        DiscordModules: { GuildMemberStore },
      } = ZLibrary;
      const { ColorUtils,
        LibraryModules: { GuildPrototype, ChannelMemberStore }
      } = BunnyLib.build(config);
      const defaultSettings = {
        colorThreshold: 30,
        percentage: 40,
        shouldPatchRole: false,
      };
      return class ShowNames extends Plugin {
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
          this.patchMemberStore();
          this.patchLoadedChannelMembers();
          if (this.settings["shouldPatchRole"]) this.patchGuildPrototype();
        }
        patchMemberStore() {
          Patcher.after(GuildMemberStore, "getMember", (_, args, res) => {
            this.changeColor(res);
          });
        }
        patchLoadedChannelMembers() {
          const ChannelMemerListCache = ChannelMemberStore.__getLocalVars();
          const channelLists = Object.values(ChannelMemerListCache.memberLists._guildLists);
          const LoadedMembersCache = channelLists.map(m => Object.values(m)).flat(1).map(m => Object.values(m.members)).flat(1);
          for (const member of LoadedMembersCache) {
            this.changeColor(member);
          }
        }
        patchGuildPrototype() {
          Patcher.after(GuildPrototype.prototype, "getRole", (_, args, res) => {
            this.changeColor(res);
          });
        }
        changeColor(item) {
          if (!item?.colorString) return;
          const backgroundColor = ColorUtils.getBackgroundColor();
          const difference = ColorUtils.getDifference(
            backgroundColor,
            item.colorString
          );

          if (difference > this.settings["colorThreshold"]) return;
          const changePercent = Math.floor(
            ((this.settings["percentage"] - difference) / 100) * 255
          )
          item.colorString = ColorUtils.makeColorVisible(item.colorString, changePercent);
        }
        onStop() {
          Patcher.unpatchAll();
        }
        getSettingsPanel() {
          return SettingPanel.build(
            this.saveSettings.bind(this),
            new Slider(
              "Color threshold",
              "The threshold at which the plugin should change colors. (Default: 70)",
              10,
              100,
              100 - this.settings["colorThreshold"],
              (e) => {
                this.settings["colorThreshold"] = 100 - e;
              },
              {
                onValueRender: (value) => {
                  return `${value}%`;
                },
              }
            ),
            new Slider(
              "Change percentage",
              "The percentage to lighten/darken the color. (Default: 40)",
              10,
              100,
              this.settings["percentage"],
              (e) => {
                this.settings["percentage"] = e;
              },
              {
                onValueRender: (value) => {
                  return `${value}%`;
                },
              }
            ),
            new Switch(
              "Role color",
              "Whether to change the role color. Normally the member color gets patched directly. (It is recommended to keep this turned off, as it may cause performance issues.)",
              this.settings["shouldPatchRole"],
              (e) => {
                this.settings["shouldPatchRole"] = e;
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
