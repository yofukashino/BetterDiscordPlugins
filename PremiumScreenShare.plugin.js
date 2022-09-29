/**
 * @name PremiumScreenShare
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 2.1.1
 * @invite SgKSKyh9gY
 * @description Make the Screen Sharing experience Premium.
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
      version: "2.1.1",
      description: "Make the Screen Sharing experience Premium.",
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
        const StreamStore = WebpackModules.getByIndex("664637");

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
            this.originalCache = Object.freeze(Object.assign({}, StreamStore));
            this.toSet = {};
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
            this.initialize();
          }
          initialize() {
            this.fps = Object.values(this.settings["fps"])
              .sort(ascending)
              .filter((item, pos, self) => removeDuplicate(item, pos, self));
            this.resolution = [
              ...Object.values(this.settings["resolution"])
                .sort(ascending)
                .filter((item, pos, self) => removeDuplicate(item, pos, self)),
              0,
            ];
            this.setVaribales();
          }
          setVaribales() {
            this.toSet["StreamFPS"] = {};
            this.toSet["StreamFPSButtons"] = [];
            this.toSet["StreamFPSButtonsWithSuffixLabel"] = [];
            this.toSet["StreamRequirements"] = [];
            this.toSet["StreamResolutionButtons"] = [];
            this.toSet["StreamResolutionButtonsExtended"] = [];
            this.toSet["StreamResolutions"] = {};
            this.toSet["StreamPresetValues"] = {};
            this.toSet["StreamPresetValues"][1] = [
              this.settings["smoothVideo"],
            ];
            this.toSet["StreamPresetValues"][2] = [
              this.settings["betterReadability"],
            ];
            this.toSet["StreamPresetValues"][3] = [];
            for (const resolution of this.resolution) {
              this.toSet["StreamResolutionButtonsExtended"].push({
                value: resolution,
                label: resolution == 0 ? "Source" : `${resolution}p`,
              });
              this.toSet["StreamResolutions"][resolution] =
                "RESOLUTION_" + (resolution == 0 ? "SOURCE" : resolution);
              this.toSet["StreamResolutions"][
                "RESOLUTION_" + (resolution == 0 ? "SOURCE" : resolution)
              ] = resolution;
            }
            for (const fps of this.fps) {
              this.toSet["StreamFPS"][fps] = "FPS_" + fps;
              this.toSet["StreamFPS"]["FPS_" + fps] = fps;
              this.toSet["StreamFPSButtons"].push({
                value: fps,
                label: fps,
              });
              this.toSet["StreamFPSButtonsWithSuffixLabel"].push({
                value: fps,
                label: `${fps} FPS`,
              });
              for (const resolution of this.resolution) {
                this.toSet["StreamRequirements"].push({
                  resolution: resolution,
                  fps: fps,
                });
              }
            }
            this.toSet["StreamRequirements"].push(
              this.settings["betterReadability"]
            );
            this.toSet["StreamRequirements"].push(this.settings["smoothVideo"]);
            const removed = this.resolution.shift();
            for (const resolution of this.resolution) {
              this.toSet["StreamResolutionButtons"].push({
                value: resolution,
                label: resolution == 0 ? "Source" : resolution,
              });
            }
            this.resolution = [removed, ...this.resolution];
            this.patchStream();
          }
          patchStream() {
            for (const StreamRequirements of this.toSet["StreamRequirements"]) {
              const index =
                this.toSet["StreamRequirements"].indexOf(StreamRequirements);
              StreamStore.ND[index] = StreamRequirements;
            }
            for (const FPS in StreamStore.ws) {
              delete StreamStore.ws[FPS];
            }
            for (const FPS in this.toSet["StreamFPS"]) {
              StreamStore.ws[FPS] = this.toSet["StreamFPS"][FPS];
            }
            for (const preset in StreamStore.no) {
              StreamStore.no[preset] = this.toSet["StreamPresetValues"][preset];
            }
            for (const resoOption of this.toSet[
              "StreamResolutionButtonsExtended"
            ]) {
              const index =
                this.toSet["StreamResolutionButtonsExtended"].indexOf(
                  resoOption
                );
              StreamStore.km[index] = resoOption;
            }
            for (const reso in StreamStore.LY) {
              delete StreamStore.LY[reso];
            }
            for (const reso in this.toSet["StreamResolutions"]) {
              StreamStore.LY[reso] = this.toSet["StreamResolutions"][reso];
            }
            for (const fpsOption of this.toSet["StreamFPSButtons"]) {
              const index = this.toSet["StreamFPSButtons"].indexOf(fpsOption);
              StreamStore.k0[index] = fpsOption;
            }
            for (const fpsOption of this.toSet[
              "StreamFPSButtonsWithSuffixLabel"
            ]) {
              const index =
                this.toSet["StreamFPSButtonsWithSuffixLabel"].indexOf(
                  fpsOption
                );
              StreamStore.af[index] = fpsOption;
            }
            for (const resoOption of this.toSet["StreamResolutionButtons"]) {
              const index =
                this.toSet["StreamResolutionButtons"].indexOf(resoOption);
              StreamStore.WC[index] = resoOption;
            }
            for (const resoOption of this.toSet["StreamResolutionButtons"]) {
              const index =
                this.toSet["StreamResolutionButtons"].indexOf(resoOption);
              StreamStore.Q4[index] = resoOption;
            }
          }
          onStop() {
            this.revertChanges();
          }
          revertChanges() {
            for (const StreamRequirements of this.originalCache.ND) {
              const index = this.originalCache.ND.indexOf(StreamRequirements);
              StreamStore.ND[index] = StreamRequirements;
            }
            for (const FPS in StreamStore.ws) {
              delete StreamStore.ws[FPS];
            }
            for (const FPS in this.originalCache.ws) {
              StreamStore.ws[FPS] = this.originalCache.ws[FPS];
            }
            for (const preset in StreamStore.no) {
              StreamStore.no[preset] = this.originalCache.no[preset];
            }
            for (const resoOption of this.originalCache.km) {
              const index = this.originalCache.km.indexOf(resoOption);
              StreamStore.km[index] = resoOption;
            }
            for (const reso in StreamStore.LY) {
              delete StreamStore.LY[reso];
            }
            for (const reso in this.originalCache.LY) {
              StreamStore.LY[reso] = this.originalCache.LY[reso];
            }
            for (const fpsOption of this.originalCache.k0) {
              const index = this.originalCache.k0.indexOf(fpsOption);
              StreamStore.k0[index] = fpsOption;
            }
            for (const fpsOption of this.originalCache.af) {
              const index = this.originalCache.af.indexOf(fpsOption);
              StreamStore.af[index] = fpsOption;
            }
            for (const resoOption of this.originalCache.WC) {
              const index = this.originalCache.WC.indexOf(resoOption);
              StreamStore.WC[index] = resoOption;
            }
            for (const resoOption of this.originalCache.Q4) {
              const index = this.originalCache.Q4.indexOf(resoOption);
              StreamStore.Q4[index] = resoOption;
            }
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
