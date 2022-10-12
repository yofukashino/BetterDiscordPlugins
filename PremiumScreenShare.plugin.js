/**
 * @name PremiumScreenShare
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 2.1.9
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
      version: "2.1.9",
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
          Patcher,
          Settings: {
            SettingPanel,
            SettingGroup,
            RadioGroup,
            Dropdown, //scorlling issues
          },
        } = Library;
        const StreamStore = WebpackModules.getModule((m) => m?.tI?.PRESET_CUSTOM);
        const { prototype: VideoQualityStore } =
          WebpackModules.getByPrototypes("updateVideoQuality");
        const removeDuplicate = (item, pos, self) => {
          return self.indexOf(item) == pos;
        };
        const ascending = (a, b) => {
          return a - b;
        };
        const fpsOptions = Object.freeze([
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
        ]);
        const resoOptions = Object.freeze([
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
        ]);
        const resoWithSource = Object.freeze([
          {
            name: "Source",
            value: 0,
          },
          ...resoOptions,
        ]);
        const defaultSettings = Object.freeze({
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
        });
        return class PremiumScreenShare extends Plugin {
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
          start() {
            this.checkForUpdates();
            this.saveDefault();
            this.initialize();
            this.patchQualityStore();
          }
          saveDefault() {
            if (!this.defaultParameters)
              this.defaultParameters = Object.freeze({
                LY: Object.freeze(Object.assign({}, StreamStore?.LY)),
                ND: Object.freeze(
                  StreamStore?.ND?.map((n) => Object.freeze(n))
                ),
                WC: Object.freeze(
                  StreamStore?.WC?.map((n) => Object.freeze(n))
                ),
                af: Object.freeze(
                  StreamStore?.af?.map((n) => Object.freeze(n))
                ),
                k0: Object.freeze(
                  StreamStore?.k0?.map((n) => Object.freeze(n))
                ),
                km: Object.freeze(
                  StreamStore?.km?.map((n) => Object.freeze(n))
                ),
                no: Object.freeze(Object.assign({}, StreamStore?.no)),
                ws: Object.freeze(Object.assign({}, StreamStore?.ws)),
              });
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
            this.customParameters = {
              LY: Object.assign(
                {},
                ...this.resolution.map((res) => {
                  const label = `RESOLUTION_${res == 0 ? "SOURCE" : res}`;
                  return { [res]: label, [label]: res };
                })
              ),
              ND: [].concat.apply(
                [],
                [
                  ...[
                    this.settings["smoothVideo"].resolution,
                    this.settings["betterReadability"].resolution,
                    ...this.resolution,
                  ].map((resolution) => {
                    return [
                      this.settings["betterReadability"].fps,
                      this.settings["smoothVideo"].fps,
                      ...this.fps,
                    ].map((fps) => {
                      return { resolution, fps };
                    });
                  }),
                ]
              ),
              WC: this.resolution
                .filter((res) => res !== this.settings["resolution"][1])
                .map((res) => {
                  return { value: res, label: res == 0 ? "Source" : res };
                }),
              af: this.fps.map((fps) => {
                return { value: fps, label: `${fps} FPS` };
              }),
              k0: this.fps.map((fps) => {
                return { value: fps, label: fps };
              }),
              km: this.resolution.map((res) => {
                return { value: res, label: res == 0 ? "Source" : `${res}p` };
              }),
              no: {
                1: [this.settings["smoothVideo"]],
                2: [this.settings["betterReadability"]],
                3: [],
              },
              ws: Object.assign(
                {},
                ...this.fps.map((res) => {
                  const label = `FPS_${res}`;
                  return { [res]: label, [label]: res };
                })
              ),
            };
            this.setStreamParameters(this.customParameters);
          }
          patchQualityStore() {
            const maxReso = Math.max(
              ...[
                ...this.resolution,
                this.settings["smoothVideo"].resolution,
                this.settings["betterReadability"].resolution,
              ]
            );
            const maxFPS = Math.max(
              ...[
                this.settings["betterReadability"].fps,
                this.settings["smoothVideo"].fps,
                ...this.fps,
              ]
            );
            const maxVideoQuality = Object.freeze({
              width: maxReso * (16 / 9),
              height: maxReso,
              framerate: maxFPS,
            });
            Patcher.before(
              VideoQualityStore,
              "updateVideoQuality",
              (instance, args) => {
                instance.videoQualityManager.options.videoBudget =
                  maxVideoQuality;
                instance.videoQualityManager.options.videoCapture =
                  maxVideoQuality;
                for (const ladder in instance.videoQualityManager.ladder
                  .ladder) {
                  instance.videoQualityManager.ladder.ladder[ladder].framerate =
                    maxVideoQuality.framerate;
                  instance.videoQualityManager.ladder.ladder[
                    ladder
                  ].mutedFramerate = maxVideoQuality.framerate / 2;
                }
                for (const ladder of instance.videoQualityManager.ladder
                  .orderedLadder) {
                  ladder.framerate = maxVideoQuality.framerate;
                  ladder.mutedFramerate = maxVideoQuality.framerate / 2;
                }
              }
            );
          }
          setStreamParameters(Parameters) {
            this.clearStreamStore([
              StreamStore.LY,
              StreamStore.ND,
              StreamStore.WC,
              StreamStore.af,
              StreamStore.k0,
              StreamStore.km,
              StreamStore.no,
              StreamStore.ws,
            ]);
            Object.assign(StreamStore.LY, Parameters.LY);
            Object.assign(StreamStore.ND, Parameters.ND);
            Object.assign(StreamStore.WC, Parameters.WC);
            Object.assign(StreamStore.af, Parameters.af);
            Object.assign(StreamStore.k0, Parameters.k0);
            Object.assign(StreamStore.km, Parameters.km);
            Object.assign(StreamStore.no, Parameters.no);
            Object.assign(StreamStore.ws, Parameters.ws);
          }
          clearStreamStore(emptyThis) {
            for (const toClear of emptyThis) {
              const type = typeof toClear;
              switch (type) {
                case "object":
                  for (const key in toClear) {
                    delete toClear[key];
                  }
                  break;
                case "array":
                  toClear.length = 0;
                default:
                  Logger.warn(`Unable to clean ${toClear}`);
              }
            }
          }
          onStop() {
            this.setStreamParameters(this.defaultParameters);
            Patcher.unpatchAll();
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
