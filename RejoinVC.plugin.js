/**
 * @name RejoinVC
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.2.1
 * @invite SgKSKyh9gY
 * @description Allows you to rejoin a voice channel by clicking on a button within 10 seconds of leaving.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/RejoinVC.plugin.js
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
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        }
      ],
      version: "1.2.1",
      description:
        "Allows you to rejoin a voice channel by clicking on a button within 10 seconds of leaving.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/RejoinVC.plugin.js",
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
        WebpackModules,
        ReactTools,
        DOMTools,
        PluginUpdater,
        Logger,
        Utilities,
        Settings: { SettingPanel, Slider },
        DiscordModules: { React, ChannelActions, LocaleManager },
      } = ZLibrary;
      const { ContextMenu } = BdApi;
      const {
        LibraryIcons,
        LibraryModules: {
          PanelButton,
          AccountDetails,
          SliderComponent,
          Dispatcher
        }
      } = BunnyLib.build(config);
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
          Patcher.before(AccountDetails, "Z", (_, args) => {
            const [{ children }] = args;
            if (
              !children?.some?.(
                (m) =>
                  m?.props?.tooltipText == LocaleManager.Messages["MUTE"]||
                  m?.props?.tooltipText == LocaleManager.Messages["UNMUTE"]
              )
            )
              return;
            children.unshift(
              React.createElement(PanelButton, {
                icon: () => LibraryIcons.CallJoin("20", "20"),
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
    })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
