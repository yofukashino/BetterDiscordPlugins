/**
 * @name PremiumScreenShare
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 2.1.0
 * @invite SgKSKyh9gY
 * @description Make the Screen Sharing experience Premium
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins/blob/master/PremiumScreenShare
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/PremiumScreenShare.plugin.js
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
      name: "PremiumScreenShare",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "2.1.0",
      description: "Make the Screen Sharing experience Premium",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/PremiumScreenShare.plugin.js",
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
          "Stream those tiddies real nice (╹ڡ╹ )",
        ],
      },
      {
        title: "v1.0.1",
        items: ["Library Handler"],
      },
      {
        title: "v1.0.3",
        items: ["Refractor"],
      },
      {
        title: "v1.0.4",
        items: ["Module Name"],
      },
      {
        title: "v1.0.5",
        items: ["Added option for more fps"],
      },
      {
        title: "v2.0.0",
        items: ["Truely premium and cotains feature which nitro don't"],
      },
      {
        title: "v2.0.1",
        items: ["removed useless code"],
      },
      {
        title: "v2.0.2",
        items: ["optimization"],
      },
      {
        title: "v2.0.6",
        items: ["Replaced Dropdowns with RadioGroup because Zlib Broken"],
      },
    ],
    main: "PremiumScreenShare.plugin.js",
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
          PluginUpdater,
          Logger,
          Utilities,
          Settings: {
            SettingPanel,
            SettingGroup,
            RadioGroup,
            Dropdown, //scorlling issues
          },
        } = Library;
        const StreamStore = WebpackModules.getByProps(
          "ApplicationStreamFPSButtons"
        );
        const removeDuplicate = (item, pos, self) => {
          return self.indexOf(item) == pos;
        };
        const ascending = (a, b) => {
          return a - b;
        };
        const fpsOptions = [
          {
            name: "FPS 5",
            value: 5,
          },
          {
            name: "FPS 10",
            value: 10,
          },
          {
            name: "FPS 15",
            value: 15,
          },
          {
            name: "FPS 30",
            value: 30,
          },
          {
            name: "FPS 45",
            value: 45,
          },
          {
            name: "FPS 60",
            value: 60,
          },
          {
            name: "FPS 120",
            value: 120,
          },
          {
            name: "FPS 144",
            value: 144,
          },
          {
            name: "FPS 240",
            value: 240,
          },
          {
            name: "FPS 360",
            value: 360,
          },
        ];
        const resoOptions = [
          {
            name: "144p",
            value: 144,
          },
          {
            name: "240p",
            value: 240,
          },
          {
            name: "360p",
            value: 360,
          },
          {
            name: "480p",
            value: 480,
          },
          {
            name: "720p",
            value: 720,
          },
          {
            name: "1080p",
            value: 1080,
          },
          {
            name: "1440p",
            value: 1440,
          },
          {
            name: "2160p",
            value: 2160,
          },
        ];
        const resoWithSource = [
          {
            name: "Source",
            value: 0,
          },
          ...resoOptions,
        ];

        const defaultSettings = {
          fps: {
            1: 15,
            2: 30,
            3: 60,
          },
          resolution: {
            1: 480,
            2: 720,
            3: 1080,
          },
          smoothVideo: {
            resolution: 720,
            fps: 60,
          },
          betterReadability: {
            resolution: 0,
            fps: 60,
          },
        };
        return class PremiumScreenShare extends Plugin {
          constructor() {
            super();
            this.originalCache = {};
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
            console.log();
            this.checkForUpdates();
            await this.saveOriginal();
            this.initialize();
          }
          saveOriginal() {
            if (!this.originalCache["ApplicationStreamSettingRequirements"])
              this.originalCache["ApplicationStreamSettingRequirements"] =
                StreamStore.ApplicationStreamSettingRequirements;
            if (
              !this.originalCache["ApplicationStreamFPSButtonsWithSuffixLabel"]
            )
              this.originalCache["ApplicationStreamFPSButtonsWithSuffixLabel"] =
                StreamStore.ApplicationStreamFPSButtonsWithSuffixLabel;
            if (!this.originalCache["ApplicationStreamPresetValues"])
              this.originalCache["ApplicationStreamPresetValues"] =
                StreamStore.ApplicationStreamPresetValues;
            if (!this.originalCache["ApplicationStreamFPSButtons"])
              this.originalCache["ApplicationStreamFPSButtons"] =
                StreamStore.ApplicationStreamFPSButtons;
            if (!this.originalCache["ApplicationStreamFPS"])
              this.originalCache["ApplicationStreamFPS"] =
                StreamStore.ApplicationStreamFPS;
            if (!this.originalCache["ApplicationStreamResolutionButtons"])
              this.originalCache["ApplicationStreamResolutionButtons"] =
                StreamStore.ApplicationStreamResolutionButtons;
            if (
              !this.originalCache["ApplicationStreamResolutionButtonsExtended"]
            )
              this.originalCache["ApplicationStreamResolutionButtonsExtended"] =
                StreamStore.ApplicationStreamResolutionButtonsExtended;
            if (
              !this.originalCache[
                "ApplicationStreamResolutionButtonsWithSuffixLabel"
              ]
            )
              this.originalCache[
                "ApplicationStreamResolutionButtonsWithSuffixLabel"
              ] = StreamStore.ApplicationStreamResolutionButtonsWithSuffixLabel;
            if (!this.originalCache["ApplicationStreamResolutions"])
              this.originalCache["ApplicationStreamResolutions"] =
                StreamStore.ApplicationStreamResolutions;
          }
          async initialize() {
            this.fps = Object.values(this.settings["fps"])
              .sort(ascending)
              .filter((item, pos, self) => removeDuplicate(item, pos, self));
            this.resolution = [
              ...Object.values(this.settings["resolution"])
                .sort(ascending)
                .filter((item, pos, self) => removeDuplicate(item, pos, self)),
              0,
            ];
            await this.patchStream();
          }

          async patchStream() {
            StreamStore.ApplicationStreamFPS = {};
            StreamStore.ApplicationStreamFPSButtons = [];
            StreamStore.ApplicationStreamFPSButtonsWithSuffixLabel = [];
            StreamStore.ApplicationStreamSettingRequirements = [];
            StreamStore.ApplicationStreamResolutionButtons = [];
            StreamStore.ApplicationStreamResolutionButtonsExtended = [];
            StreamStore.ApplicationStreamResolutionButtonsWithSuffixLabel = [];
            StreamStore.ApplicationStreamResolutions = {};
            StreamStore.ApplicationStreamPresetValues = {};
            StreamStore.ApplicationStreamPresetValues[1] = [
              this.settings["smoothVideo"],
            ];
            StreamStore.ApplicationStreamPresetValues[2] = [
              this.settings["betterReadability"],
            ];
            StreamStore.ApplicationStreamPresetValues[3] = [];
            for (const resolution of this.resolution) {
              StreamStore.ApplicationStreamResolutionButtons.push({
                value: resolution,
                label: resolution == 0 ? "Source" : resolution,
              });
              StreamStore.ApplicationStreamResolutionButtonsWithSuffixLabel.push(
                {
                  value: resolution,
                  label: resolution == 0 ? "Source" : `${resolution}P`,
                }
              );
              StreamStore.ApplicationStreamResolutions[resolution] =
                "RESOLUTION_" + (resolution == 0 ? "SOURCE" : resolution);
              StreamStore.ApplicationStreamResolutions[
                "RESOLUTION_" + (resolution == 0 ? "SOURCE" : resolution)
              ] = resolution;
            }
            for (const fps of this.fps) {
              StreamStore.ApplicationStreamFPS[fps] = "FPS_" + fps;
              StreamStore.ApplicationStreamFPS["FPS_" + fps] = fps;
              StreamStore.ApplicationStreamFPSButtons.push({
                value: fps,
                label: fps,
              });
              StreamStore.ApplicationStreamFPSButtonsWithSuffixLabel.push({
                value: fps,
                label: `${fps} FPS`,
              });
              for (const resolution of this.resolution) {
                StreamStore.ApplicationStreamSettingRequirements.push({
                  resolution: resolution,
                  fps: fps,
                });
              }
            }
            const removed = await this.resolution.shift();
            for (const resolution of this.resolution) {
              StreamStore.ApplicationStreamResolutionButtonsExtended.push({
                value: resolution,
                label: resolution == 0 ? "Source" : `${resolution}P`,
              });
            }
            this.resolution = [removed, ...this.resolution];
          }
          onStop() {
            this.revertChanges();
          }
          revertChanges() {
            if (this.originalCache["ApplicationStreamSettingRequirements"])
              StreamStore.ApplicationStreamSettingRequirements =
                this.originalCache["ApplicationStreamSettingRequirements"];
            if (
              this.originalCache["ApplicationStreamFPSButtonsWithSuffixLabel"]
            )
              StreamStore.ApplicationStreamFPSButtonsWithSuffixLabel =
                this.originalCache[
                  "ApplicationStreamFPSButtonsWithSuffixLabel"
                ];
            if (this.originalCache["ApplicationStreamFPSButtons"])
              StreamStore.ApplicationStreamFPSButtons =
                this.originalCache["ApplicationStreamFPSButtons"];
            if (this.originalCache["ApplicationStreamFPS"])
              StreamStore.ApplicationStreamFPS =
                this.originalCache["ApplicationStreamFPS"];
            if (this.originalCache["ApplicationStreamResolutionButtons"])
              StreamStore.ApplicationStreamResolutionButtons =
                this.originalCache["ApplicationStreamResolutionButtons"];
            if (
              this.originalCache["ApplicationStreamResolutionButtonsExtended"]
            )
              StreamStore.ApplicationStreamResolutionButtonsExtended =
                this.originalCache[
                  "ApplicationStreamResolutionButtonsExtended"
                ];
            if (
              this.originalCache[
                "ApplicationStreamResolutionButtonsWithSuffixLabel"
              ]
            )
              StreamStore.ApplicationStreamResolutionButtonsWithSuffixLabel =
                this.originalCache[
                  "ApplicationStreamResolutionButtonsWithSuffixLabel"
                ];
            if (this.originalCache["ApplicationStreamResolutions"])
              StreamStore.ApplicationStreamResolutions =
                this.originalCache["ApplicationStreamResolutions"];
            if (this.originalCache["ApplicationStreamPresetValues"])
              StreamStore.ApplicationStreamPresetValues =
                this.originalCache["ApplicationStreamPresetValues"];
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new SettingGroup("FPS (Depends on Your OnScreen FPS)", {
                collapsible: true,
                shown: false,
              }).append(
                new RadioGroup(
                  "FPS 15",
                  "Replace FPS 15 with custom FPS",
                  this.settings["fps"][1],
                  fpsOptions,
                  (e) => {
                    this.settings["fps"][1] = e;
                  }
                ),
                new RadioGroup(
                  "FPS 30",
                  "Replace FPS 30 with custom FPS",
                  this.settings["fps"][2],
                  fpsOptions,
                  (e) => {
                    this.settings["fps"][2] = e;
                  }
                ),
                new RadioGroup(
                  "FPS 60",
                  "Replace FPS 60 with custom FPS",
                  this.settings["fps"][3],
                  fpsOptions,
                  (e) => {
                    this.settings["fps"][3] = e;
                  }
                )
              ),
              new SettingGroup(
                "Resolution (Depends on your screen Resolution)",
                {
                  collapsible: true,
                  shown: false,
                }
              ).append(
                new RadioGroup(
                  "480p",
                  "Replace 480p With Custom Resolution",
                  this.settings["resolution"][1],
                  resoOptions,
                  (e) => {
                    this.settings["resolution"][1] = e;
                  }
                ),
                new RadioGroup(
                  "720p",
                  "Replace 720p With Custom Resolution",
                  this.settings["resolution"][2],
                  resoOptions,
                  (e) => {
                    this.settings["resolution"][2] = e;
                  }
                ),
                new RadioGroup(
                  "1080p",
                  "Replace 1080p With Custom Resolution",
                  this.settings["resolution"][3],
                  resoOptions,
                  (e) => {
                    this.settings["resolution"][3] = e;
                  }
                )
              ),
              new SettingGroup("Preset Smoother Video", {
                collapsible: true,
                shown: false,
              }).append(
                new RadioGroup(
                  "Resolution",
                  "Change Smoother video preset Resolution",
                  this.settings["smoothVideo"]["resolution"],
                  resoWithSource,
                  (e) => {
                    this.settings["smoothVideo"]["resolution"] = e;
                  }
                ),
                new RadioGroup(
                  "FPS",
                  "Change Smoother video preset FPS",
                  this.settings["smoothVideo"]["fps"],
                  fpsOptions,
                  (e) => {
                    this.settings["smoothVideo"]["fps"] = e;
                  }
                )
              ),
              new SettingGroup("Preset Better Readability", {
                collapsible: true,
                shown: false,
              }).append(
                new RadioGroup(
                  "Resolution",
                  "Change Better Readability preset Resolution",
                  this.settings["betterReadability"]["resolution"],
                  resoWithSource,
                  (e) => {
                    this.settings["betterReadability"]["resolution"] = e;
                  }
                ),
                new RadioGroup(
                  "FPS",
                  "Change Better Readability preset FPS",
                  this.settings["betterReadability"]["fps"],
                  fpsOptions,
                  (e) => {
                    this.settings["betterReadability"]["fps"] = e;
                  }
                )
              )
            );
          }
          saveSettings() {
            Utilities.saveData(config.info.name, "settings", this.settings);
            this.initialize();
          }
        };
        return plugin(Plugin, Library);
      })(window.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
