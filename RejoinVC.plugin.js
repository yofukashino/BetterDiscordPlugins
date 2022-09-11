/**
 * @name RejoinVC
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.1.1
 * @invite SgKSKyh9gY
 * @description This plugin allows you to rejoin a voice channel by a button within 10 seconds of leaving.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/RejoinVC.plugin.js
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
      name: "RejoinVC",
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
      version: "1.1.1",
      description:
        "This plugin allows you to rejoin a voice channel by a button within 10 seconds of leaving",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/RejoinVC.plugin.js",
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
          "Don't leave your homies hanging －O－",
        ],
      },
      {
        title: "v1.0.1",
        items: ["Bug Fixes"],
      },
      {
        title: "v1.0.2 (I am Dumb, Sorry)",
        items: ["Forgot Contributor's Name so added that."],
      },
      {
        title: "v1.0.3",
        items: ["Library Handler"],
      },
      {
        title: "v1.0.5",
        items: ["Added option to change time to show the button"],
      },
      {
        title: "v1.0.6",
        items: ["Typo"],
      },
    ],
    main: "RejoinVC.plugin.js",
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
  :  (([Plugin, Library]) => {
        const {
          Patcher,
          WebpackModules,
          ReactTools,
          DOMTools,
          PluginUpdater,
          Logger,
          Utilities,
          Settings: { SettingPanel, Slider },
          DiscordModules: { React, Dispatcher, ChannelActions },
        } = Library;
        const classes = WebpackModules.getByProps(
          "container",
          "usernameContainer"
        );
        const PanelButton = WebpackModules.getByDisplayName("PanelButton");
        const Account = ReactTools.getStateNodes(
          document.querySelector(`.${classes.container}`)
        )[0];
        const CallJoin = (width, height) =>
          React.createElement(WebpackModules.getByDisplayName("CallJoin"), {
            width,
            height,
          });
        const CSS = `.withTagAsButton-OsgQ9L {
            min-width:0;
            }
            `;
            const defaultSettings = {
time: 10000
            };
        return class RejoinVC extends Plugin {
          constructor() {
            super();
            this.PutButton = this.PutButton.bind(this);
            this.settings = Utilities.loadData(config.info.name, "settings", defaultSettings);
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
            this.init();
          }
          init() {
            DOMTools.addStyle(config.info.name, CSS);              
            Dispatcher.subscribe("VOICE_CHANNEL_SELECT", this.PutButton);
          }
          onStop() {
            DOMTools.removeStyle(config.info.name);
            Patcher.unpatchAll();
            Dispatcher.unsubscribe("VOICE_CHANNEL_SELECT", this.PutButton);
          }
          PutButton(voice) {
            if (voice.currentVoiceChannelId !== null) {
              Patcher.unpatchAll();
              Patcher.after(Account.__proto__, "render", (_, __, { props }) => {
                props.children[1].props.children.unshift(
                  React.createElement(PanelButton, {
                    icon: () => CallJoin("20", "20"),
                    tooltipText: "ReJoin VC",
                    onClick: () => {
                      Patcher.unpatchAll();
                      ChannelActions.selectVoiceChannel(
                        voice.currentVoiceChannelId
                      );
                    },
                  })
                );
              });
              Account.forceUpdate();
              clearTimeout(this.disappear);
              this.disappear = setTimeout(() => {
                Patcher.unpatchAll();
                Account.forceUpdate();
              }, this.settings["time"]);
            }
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new Slider(
                "Show Time",
                "The Time in seconds to show the button after disconnect.",
                5,
                60,
                this.settings["time"] / 1000,
                (e) => {
                  this.settings["time"] = e * 1000;
                },
                {
                  markers: [5, 10, 15, 20, 25, 30, 45, 60],
                  stickToMarkers: true,
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
