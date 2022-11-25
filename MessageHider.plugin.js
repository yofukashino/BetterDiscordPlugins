/**
 * @name MessageHider
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.2.2
 * @invite SgKSKyh9gY
 * @description Get an option to hide a message by right clicking on it.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/MessageHider.plugin.js
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
      name: "MessageHider",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        }        
      ],
      version: "1.2.2",
      description: "Get an option to hide a message by right clicking on it.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/MessageHider.plugin.js",
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
          "Get those fake screen shot －O－",
        ],
      },
      {
        title: "Bug Fix v1.0.1",
        items: ["Fixed settings not being saved"],
      },
      {
        title: "Bug Fix v1.0.2",
        items: ["Library Handler"],
      },
      {
        title: "v1.0.6",
        items: ["Context Menu Icon Added"],
      },
      {
        title: "v1.2.1",
        items: ["Corrected text."],
      },
    ],
    main: "MessageHider.plugin.js",
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
          PluginUpdater,
          Logger,
          Utilities,
          Toasts,
          Settings: { SettingPanel, Switch },
          DiscordModules: { React },
        } = Library;
        const { ContextMenu } = BdApi;
        const Eye = (width, height) =>
        React.createElement("svg", {
          width,
          height,
          viewBox: "0 0 24 24"
        },React.createElement("path", {
          fill: "currentColor",
          d: "M12 5C5.648 5 1 12 1 12C1 12 5.648 19 12 19C18.352 19 23 12 23 12C23 12 18.352 5 12 5ZM12 16C9.791 16 8 14.21 8 12C8 9.79 9.791 8 12 8C14.209 8 16 9.79 16 12C16 14.21 14.209 16 12 16Z"
        }),React.createElement("path", {
          fill: "currentColor",
          d: "M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
        }));
        const defaultSettings = {
          showToast: true,
        };
        return class MessageHider extends Plugin {
          constructor() {
            super();
            this.settings = Utilities.loadData(
              config.info.name,
              "settings",
              defaultSettings
            );
            this.addMessageHider = this.addMessageHider.bind(this);
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
            ContextMenu.patch("message", this.addMessageHider);
          }
          addMessageHider(menu, { message }) {
            menu.props.children.splice(
                3,
                0,
                ContextMenu.buildItem(
                  {
                    name: "Hide Message",
                    separate: false,
                    id: "hide-message",
                    label: "Hide Message",
                    color: "colorDanger",
                    icon: () => Eye("20", "20"),
                    action: () => {
                      document.getElementById(
                        `chat-messages-${message.id}`
                      ).style.display = "none";
                      if (this.settings["showToast"])
                        Toasts.success(
                          `Hiding Successful: Message sent by ${message.author.username} at ${message.timestamp._d}`,
                          {
                            icon: `D`,
                            timeout: 5000,
                            type: "info",
                          }
                        );
                      Logger.info(
                        `Hiding Successful: Message sent by ${message.author.username} at ${message.timestamp._d}`
                      );
                    },
                  }
                )
              );
            
          }
          onStop() {
            ContextMenu.unpatch("message", this.addMessageHinder);
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new Switch(
                "Pop-up/Toast",
                "Display toast when a message gets hidden.",
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
