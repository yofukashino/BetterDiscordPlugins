/**
 * @name RejoinVC
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.1.5
 * @invite SgKSKyh9gY
 * @description Allows you to rejoin a voice channel by clicking on a button within 10 seconds of leaving.
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
      version: "1.1.5",
      description:
        "Allows you to rejoin a voice channel by clicking on a button within 10 seconds of leaving.",
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
      {
        title: "v1.1.4",
        items: [
          "Added Context Menu to icon (Wait for Zerebos to fix his library to access it.)",
          "Fixed Icon not being added.",
        ],
      },
      {
        title: "v1.1.5",
        items: ["Corrected text."],
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
    : (([Plugin, Library]) => {
        const {
          Patcher,
          WebpackModules,
          ReactTools,
          DOMTools,
          PluginUpdater,
          Logger,
          Utilities,
          Settings: { SettingPanel, Slider },
          DiscordModules: { React, ChannelActions },
        } = Library;
        const { ContextMenu } = BdApi;
        const PanelButton = WebpackModules.getModule(
          (m) => m?.name == "m" && m?.toString()?.includes("tooltipText")
        );
        const Account = WebpackModules.getModule(
          (m) => m?.Z?.name == "T" && m?.Z?.toString()?.includes(".START")
        );
        const SliderComponent = WebpackModules.getModule((m) =>
          m.render?.toString().includes("sliderContainer")
        );
        const Dispatcher = WebpackModules.getByProps(
          "dispatch",
          "_actionHandlers"
        );
        const CallJoin = (width, height) =>
          React.createElement(
            "svg",
            {
              viewBox: "0 0 24 24",
              width,
              height,
            },
            React.createElement("path", {
              style: {
                fill: "currentColor",
              },
              d: "M11 5V3C16.515 3 21 7.486 21 13H19C19 8.589 15.411 5 11 5ZM17 13H15C15 10.795 13.206 9 11 9V7C14.309 7 17 9.691 17 13ZM11 11V13H13C13 11.896 12.105 11 11 11ZM14 16H18C18.553 16 19 16.447 19 17V21C19 21.553 18.553 22 18 22H13C6.925 22 2 17.075 2 11V6C2 5.447 2.448 5 3 5H7C7.553 5 8 5.447 8 6V10C8 10.553 7.553 11 7 11H6C6.063 14.938 9 18 13 18V17C13 16.447 13.447 16 14 16Z",
            })
          );
        const CSS = `.withTagAsButton-OsgQ9L {
            min-width:0;
            }
            `;
        const defaultSettings = Object.freeze({
          time: 10000,
        });
        return class RejoinVC extends Plugin {
          constructor() {
            super();
            this.PutButton = this.PutButton.bind(this);
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
            if (voice?.currentVoiceChannelId == null) return;
            Patcher.unpatchAll();

            Patcher.before(Account, "Z", (_, args) => {
              const [{ children }] = args;
              if (
                !children?.some?.(
                  (m) =>
                    m?.props?.tooltipText == "Mute" ||
                    m?.props?.tooltipText == "Unmute"
                )
              )
                return;
              children.unshift(
                React.createElement(PanelButton, {
                  icon: () => CallJoin("20", "20"),
                  tooltipText: "Rejoin Voice Channel",
                  onClick: () => {
                    Patcher.unpatchAll();
                    ChannelActions.selectVoiceChannel(
                      voice.currentVoiceChannelId
                    );
                  },
                  onContextMenu: (event) => {
                    ContextMenu.open(
                      event,
                      ContextMenu.buildMenu([
                        {
                          id: "show-time",
                          label: "Show Time",
                          type: "control",
                          control: () =>
                            React.createElement(SliderComponent, {
                              value: this.settings["time"],
                              initialValue: this.settings["time"],
                              minValue: 5000,
                              maxValue: 60000,
                              renderValue: (value) => {
                                const seconds = value / 1000;
                                const minutes = value / 1000 / 60;
                                return value < 60000
                                  ? `${seconds.toFixed(0)} secs`
                                  : `${minutes.toFixed(0)} min`;
                              },
                              onChange: (e) => {
                                this.settings["time"] = e;
                                this.saveSettings();
                              },
                            }),
                        },
                      ])
                    );
                  },
                })
              );
            });
            clearTimeout(this.disappear);
            this.disappear = setTimeout(() => {
              Patcher.unpatchAll();
            }, this.settings["time"]);
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new Slider(
                "Show time",
                "The amount of time to show the button after disconnecting.",
                5000,
                60000,
                this.settings["time"],
                (e) => {
                  this.settings["time"] = e;
                },
                {
                  onValueRender: (value) => {
                    const seconds = value / 1000;
                    const minutes = value / 1000 / 60;
                    return value < 60000
                      ? `${seconds.toFixed(0)} secs`
                      : `${minutes.toFixed(0)} min`;
                  },
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
