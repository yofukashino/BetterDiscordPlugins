/**
 * @name FluentStatusIcons
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.2.0
 * @invite SgKSKyh9gY
 * @description Adds fluent status icons.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/FluentStatusIcons.plugin.js
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
      name: "FluentStatusIcons",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "872383230328832031",
          github_username: "Tharki-God",
        },
      ],
      version: "1.2.0",
      description: "Adds fluent status icons.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/FluentStatusIcons.plugin.js",
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
          "Fluent just like english, very premium ultra max ┗|｀O′|┛）",
        ],
      },
      {
        title: "v1.1.2",
        items: ["Corrected text."],
      },
    ],
    main: "FluentStatusIcons.plugin.js",
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
          PluginUpdater,
          Logger,
          Patcher,
          Utilities,
          DOMTools,
          Settings: { SettingPanel, Switch },
          DiscordModules: { React, ReactDOM },
        } = ZLibrary;
        const {
          ReactUtils,
          FluentMasks,
          LibraryModules: { AvatarStatusClasses, DMAvatar, GuildAvatar, Masks }
        } = BunnyLib.build(config);  
        const CSS = `        
        .withTagAsButton-OsgQ9L > [aria-label*="Online"]  > svg > svg > rect {
        width: 10px;
        height: 10px;
        x: 7.5;
        y: 5;
        mask: url(#svg-mask-status-online);
        }
        .withTagAsButton-OsgQ9L > [aria-label*="Online via Mobile"]  > svg > svg > rect {
          width: 10px;
          height: 15px;
          x: 7.5;
          y: 0;
          mask: url(#svg-mask-status-online-mobile);
          }
          .withTagAsButton-OsgQ9L > [aria-label*="Idle"]  > svg > svg > rect {
        width: 10px;
        height: 10px;
        x: 7.5;
        y: 5;
        mask: url(#svg-mask-status-idle);
        }        
        .withTagAsButton-OsgQ9L > [aria-label*="Do Not Disturb"]  > svg > svg > rect {
        width: 10px;
        height: 10px;
        x: 7.5;
        y: 5;
        mask: url(#svg-mask-status-dnd);
        }
        .withTagAsButton-OsgQ9L > [aria-label*="Invisible"]  > svg > svg > rect {
        width: 10px;
        height: 10px;
        x: 7.5;
        y: 5;
        mask: url(#svg-mask-status-offline);
        } 
        .withTagAsButton-OsgQ9L > [aria-label*="Offline"]  > svg > svg > rect {
          width: 10px;
          height: 10px;
          x: 7.5;
          y: 5;
          mask: url(#svg-mask-status-offline);
          }       
        .withTagAsButton-OsgQ9L > [aria-label*="Streaming"]  > svg > svg > rect {
        width: 10px;
        height: 10px;
        x: 7.5;
        y: 5;
        mask: url(#svg-mask-status-streaming);
        }   

        [aria-label="Online via Mobile"] svg rect {
          mask: url(#svg-mask-status-online-mobile);
        }        
        [aria-label="Online"] svg rect {
          mask: url(#svg-mask-status-online);
          height: 10px;
          width: 10px;
          x: 0px;
          y:4px;
        }
        
        [aria-label="Offline"] svg rect {
          mask: url(#svg-mask-status-offline);
          height: 10px;
          width: 10px;
          x: 0px;
          y:4px;
        }
        [aria-label="Idle"] svg rect {
          mask: url(#svg-mask-status-idle);
          height: 10px;
          width: 10px;
          x: 0px;
          y:4px;
        }
        [aria-label="Do Not Disturb"] svg rect {
          mask: url(#svg-mask-status-dnd);
          height: 10px;
          width: 10px;
          x: 0px;
          y:4px;
        }
        [aria-label="Streaming"] svg rect {
          mask: url(#svg-mask-status-streaming);
          height: 10px;
          width: 10px;
          x: 0px;
          y:4px;
        }        
        `;
      
        const defaultSettings = {
          PhoneIcon: true,
          OnlineIcon: true,
          StreamingIcon: true,
          DNDIcon: true,
          IdleIcon: true,
          OfflineIcon: true,
        };
        return class FluentStatusIcons extends Plugin {
          constructor() {
            super();
            this.settings = Utilities.loadData(
              config.info.name,
              "settings",
              defaultSettings
            );
            this.bodyObserver = new MutationObserver((e) =>
              this.DiscordShitsAtMask(e)
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
          start() {
            this.checkForUpdates();
            this.patchMaskLibrary();
            this.refreshMaskLibrary();
            DOMTools.addStyle(config.info.name, CSS);
            this.bodyObserver.observe(document.body, {
              childList: true,
              subtree: true,
            });
          }
          patchMaskLibrary() {
            Patcher.after(Masks.Co, "type", (_, args, res) => {
              const masks = res.props.children;
              const OnlineStatusMask = masks.findIndex(
                (mask) => mask.props.id === "svg-mask-status-online"
              );
              const OnlineMobileStatusMask = masks.findIndex(
                (mask) => mask.props.id === "svg-mask-status-online-mobile"
              );
              const IdleStatusMask = masks.findIndex(
                (mask) => mask.props.id === "svg-mask-status-idle"
              );
              const DNDStatusMask = masks.findIndex(
                (mask) => mask.props.id === "svg-mask-status-dnd"
              );
              const OfflineStatusMask = masks.findIndex(
                (mask) => mask.props.id === "svg-mask-status-offline"
              );
              const StreamingStatusMask = masks.findIndex(
                (mask) => mask.props.id === "svg-mask-status-streaming"
              );
              if (this.settings["OnlineIcon"])
                masks[OnlineStatusMask] = FluentMasks.Online;
              if (this.settings["PhoneIcon"])
                masks[OnlineMobileStatusMask] = FluentMasks.Phone;
              if (this.settings["IdleIcon"])
                masks[IdleStatusMask] = FluentMasks.Idle;
              if (this.settings["DNDIcon"])
                masks[DNDStatusMask] = FluentMasks.DND;
              if (this.settings["OfflineIcon"])
                masks[OfflineStatusMask] = FluentMasks.Offline;
              if (this.settings["StreamingIcon"])
                masks[StreamingStatusMask] = FluentMasks.Stream;
              return res;
            });
          }
          refreshMaskLibrary() {
            try {
              if (!Masks)
                return Logger.err(
                  "Missing “MaskLibrary” module, Please report this to the developer."
                );
              const TempMaskContainer = document.createElement("div");
              TempMaskContainer.style.display = "none";
              document.body.appendChild(TempMaskContainer);
              ReactDOM.render(
                React.createElement(Masks.Co, null),
                TempMaskContainer
              );
              const MaskLibrary = document.querySelector(
                "#app-mount #svg-mask-squircle"
              )?.parentNode;
              if (MaskLibrary) {
                MaskLibrary.innerHTML =
                  TempMaskContainer.firstElementChild.innerHTML;
                TempMaskContainer.remove();
              }
            } catch (err) {
              Logger.err(err);
            }
          }
          DiscordShitsAtMask(mutations) {
            for (const mutation of mutations) {
              if (
                [...mutation?.removedNodes]?.some(
                  (e) =>
                    typeof e.classList == "object" &&
                    [...e.classList].some((e) => e == AvatarStatusClasses.dots)
                ) ||
                [...mutation.target.classList].some(
                  (e) =>
                    (e == DMAvatar || e == GuildAvatar) &&
                    !document.querySelector(`.${e}`).querySelector(`.${AvatarStatusClasses.dots}`)
                )
              )
              ReactUtils.forceUpdate(mutation?.target?.parentNode);
              continue;
            }
          }        
          onStop() {
            DOMTools.removeStyle(config.info.name);
            Patcher.unpatchAll();
            this.refreshMaskLibrary();
            this.bodyObserver.disconnect();
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new Switch(
                "Phone Icon",
                "Fluent Phone Icon",
                this.settings["PhoneIcon"],
                (e) => {
                  this.settings["PhoneIcon"] = e;
                }
              ),
              new Switch(
                "Online Icon",
                "Fluent Online Icon",
                this.settings["OnlineIcon"],
                (e) => {
                  this.settings["OnlineIcon"] = e;
                }
              ),
              new Switch(
                "Idle Icon",
                "Fluent Idle Icon",
                this.settings["IdleIcon"],
                (e) => {
                  this.settings["IdleIcon"] = e;
                }
              ),
              new Switch(
                "DND Icon",
                "Fluent DND Icon",
                this.settings["DNDIcon"],
                (e) => {
                  this.settings["DNDIcon"] = e;
                }
              ),
              new Switch(
                "Offline Icon",
                "Fluent Offline Icon",
                this.settings["OfflineIcon"],
                (e) => {
                  this.settings["OfflineIcon"] = e;
                }
              ),
              new Switch(
                "Streaming Icon",
                "Fluent Streaming Icon",
                this.settings["StreamingIcon"],
                (e) => {
                  this.settings["StreamingIcon"] = e;
                }
              )
            );
          }
          saveSettings() {
            Utilities.saveData(config.info.name, "settings", this.settings);
            this.refreshMaskLibrary();
          }
        };
      })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
