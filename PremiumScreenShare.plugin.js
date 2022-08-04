/**
 * @name PremiumScreenShare
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 2.0.8
 * @invite SgKSKyh9gY
 * @description Make the Screen Sharing experience Premium
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins/blob/master/PremiumScreenShare
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/PremiumScreenShare.plugin.js
 */
/*@cc_on
@if (@_jscript)
// Offer to self-install for clueless users that try to run this directly.
var shell = WScript.CreateObject("WScript.Shell");
var fs = new ActiveXObject("Scripting.FileSystemObject");
var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
var pathSelf = WScript.ScriptFullName;
// Put the user at ease by addressing them in the first person
shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
} else if (!fs.FolderExists(pathPlugins)) {
shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
// Show the user where to put plugins in the future
shell.Exec("explorer " + pathPlugins);
shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
}
WScript.Quit();
@else@*/
module.exports = (() => {
    const config = {
        info: {
            name: "PremiumScreenShare",
            authors: [{
                    name: "Ahlawat",
                    discord_id: "887483349369765930",
                    github_username: "Tharki-God",
                },
            ],
            version: "2.0.8",
            description:
            "Make the Screen Sharing experience Premium",
            github: "https://github.com/Tharki-God/BetterDiscordPlugins",
            github_raw:
            "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/PremiumScreenShare.plugin.js",
        },
        changelog: [{
                title: "v0.0.1",
                items: [
                    "Idea in mind"
                ]
            }, {
                title: "v0.0.5",
                items: [
                    "Base Model"
                ]
            }, {
                title: "Initial Release v1.0.0",
                items: [
                    "This is the initial release of the plugin :)",
                    "Stream those tiddies real nice (╹ڡ╹ )"
                ]
            }, {
                title: "v1.0.1",
                items: [
                    "Library Handler"
                ]
            }, {
                title: "v1.0.3",
                items: [
                    "Refractor"
                ]
            }, {
                title: "v1.0.4",
                items: [
                    "Module Name"
                ]
            }, {
                title: "v1.0.5",
                items: [
                    "Added option for more fps"
                ]
            }, {
                title: "v2.0.0",
                items: [
                    "Truely premium and cotains feature which nitro don't"
                ]
            }, {
                title: "v2.0.1",
                items: [
                    "removed useless code"
                ]
            }, {
                title: "v2.0.2",
                items: [
                    "optimization"
                ]
            }, {
                title: "v2.0.6",
                items: [
                    "Replaced Dropdowns with RadioGroup because Zlib Broken"
                ]
            }
        ],
        main: "PremiumScreenShare.plugin.js",
    };
    return !global.ZeresPluginLibrary
     ? class {
        constructor() {
            this._config = config;
        }
        getName() {
            return config.info.name;
        }
        getAuthor() {
            return config.info.authors.map((a) => a.name).join(", ");
        }
        getDescription() {
            return config.info.description;
        }
        getVersion() {
            return config.info.version;
        }
        load() {
            try {
                global.ZeresPluginLibrary.PluginUpdater.checkForUpdate(config.info.name, config.info.version, config.info.github_raw);
            } catch (err) {
                console.error(this.getName(), "Plugin Updater could not be reached.", err);
            }
            BdApi.showConfirmationModal(
                "Library Missing",
`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get(
                        "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                        async(error, response, body) => {
                        if (error) {
                            return BdApi.showConfirmationModal("Error Downloading",
                                [
                                    "Library plugin download failed. Manually install plugin library from the link below.",
                                    BdApi.React.createElement("a", {
                                        href: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                                        target: "_blank"
                                    }, "Plugin Link")
                                ], );
                        }
                        await new Promise((r) =>
                            require("fs").writeFile(
                                require("path").join(
                                    BdApi.Plugins.folder,
                                    "0PluginLibrary.plugin.js"),
                                body,
                                r));
                    });
                },
            });
        }
        start() {}
        stop() {}
    }
     : (([Plugin, Library]) => {
        const {
            WebpackModules,
            Settings: {
                SettingPanel,
                SettingGroup,
                RadioGroup,
                Dropdown //not Working
            }
        } = Library;
        const StreamStore = WebpackModules.getByProps("ApplicationStreamFPSButtons");
        const fpsOptions = [{
                name: "FPS 5",
                value: 5
            }, {
                name: "FPS 10",
                value: 10
            }, {
                name: "FPS 15",
                value: 15
            }, {
                name: 'FPS 30',
                value: 30
            }, {
                name: "FPS 45",
                value: 45
            }, {
                name: "FPS 60",
                value: 60
            }, {
                name: "FPS 120",
                value: 120
            }, {
                name: "FPS 144",
                value: 144
            }, {
                name: "FPS 240",
                value: 240
            }, {
                name: "FPS 360",
                value: 360
            }
        ];
        const resoOptions = [{
                name: "144p",
                value: 144
            }, {
                name: "240p",
                value: 240
            }, {
                name: "360p",
                value: 360
            }, {
                name: '480p',
                value: 480
            }, {
                name: "720p",
                value: 720
            }, {
                name: "1080p",
                value: 1080
            }, {
                name: "1440p",
                value: 1440
            }, {
                name: "2160p",
                value: 2160
            }
        ];
        const resoWithSource = [{
                name: "Source",
                value: 0
            }, ...resoOptions];
        return class PremiumScreenShare extends Plugin {
            async onStart() {
                this.originalCache = {};
                this.loadSettings();
                this.initialize();
            }
            loadSettings() {
                this.fps15 = BdApi.loadData(config.info.name, "fps15") ?? 15;
                this.fps30 = BdApi.loadData(config.info.name, "fps30") ?? 30;
                this.fps60 = BdApi.loadData(config.info.name, "fps60") ?? 60;
                this.res480p = BdApi.loadData(config.info.name, "res480p") ?? 480;
                this.res720p = BdApi.loadData(config.info.name, "res720p") ?? 720;
                this.res1080p = BdApi.loadData(config.info.name, "res1080p") ?? 1080;
                this.smoothReso = BdApi.loadData(config.info.name, "smoothReso") ?? 720;
                this.smoothFPS = BdApi.loadData(config.info.name, "smoothFPS") ?? 60;
                this.betterReso = BdApi.loadData(config.info.name, "betterReso") ?? 0;
                this.betterFPS = BdApi.loadData(config.info.name, "betterFPS") ?? 30;
            }
            ascending(a, b) {
                return a - b
            }
            async initialize() {
                this.fps = [this.fps15, this.fps30, this.fps60].sort(this.ascending)
                this.resolution = [...[this.res1080p, this.res720p, this.res480p].sort(this.ascending), 0]
                await this.saveOriginal();
                await this.patchStream();
            }
            saveOriginal() {
                if (!this.originalCache["ApplicationStreamSettingRequirements"])
                    this.originalCache["ApplicationStreamSettingRequirements"] = StreamStore.ApplicationStreamSettingRequirements;
                if (!this.originalCache["ApplicationStreamFPSButtonsWithSuffixLabel"])
                    this.originalCache["ApplicationStreamFPSButtonsWithSuffixLabel"] = StreamStore.ApplicationStreamFPSButtonsWithSuffixLabel;
                if (!this.originalCache["ApplicationStreamPresetValues"])
                    this.originalCache["ApplicationStreamPresetValues"] = StreamStore.ApplicationStreamPresetValues;
                if (!this.originalCache["ApplicationStreamFPSButtons"])
                    this.originalCache["ApplicationStreamFPSButtons"] = StreamStore.ApplicationStreamFPSButtons;
                if (!this.originalCache["ApplicationStreamFPS"])
                    this.originalCache["ApplicationStreamFPS"] = StreamStore.ApplicationStreamFPS;
                if (!this.originalCache["ApplicationStreamResolutionButtons"])
                    this.originalCache["ApplicationStreamResolutionButtons"] = StreamStore.ApplicationStreamResolutionButtons;
                if (!this.originalCache["ApplicationStreamResolutionButtonsExtended"])
                    this.originalCache["ApplicationStreamResolutionButtonsExtended"] = StreamStore.ApplicationStreamResolutionButtonsExtended;
                if (!this.originalCache["ApplicationStreamResolutionButtonsWithSuffixLabel"])
                    this.originalCache["ApplicationStreamResolutionButtonsWithSuffixLabel"] = StreamStore.ApplicationStreamResolutionButtonsWithSuffixLabel;
                if (!this.originalCache["ApplicationStreamResolutions"])
                    this.originalCache["ApplicationStreamResolutions"] = StreamStore.ApplicationStreamResolutions;
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
                for (const smoothVideo of StreamStore.ApplicationStreamPresetValues[1]) {
                    smoothVideo.resolution = this.smoothReso;
                    smoothVideo.fps = this.smoothFPS;
                }
                for (const betterReadability of StreamStore.ApplicationStreamPresetValues[2]) {
                    betterReadability.resolution = this.betterReso;
                    betterReadability.fps = this.betterFPS;
                }
                for (const resolution of this.resolution) {
                    StreamStore.ApplicationStreamResolutionButtons.push({
                        value: resolution,
                        label: resolution == 0 ? "Source" : resolution,
                    });
                    StreamStore.ApplicationStreamResolutionButtonsWithSuffixLabel.push({
                        value: resolution,
                        label: resolution == 0 ? "Source" : `${resolution}P`,
                    });
                    StreamStore.ApplicationStreamResolutions[resolution] = "RESOLUTION_" + (resolution == 0 ? "SOURCE" : resolution);
                    StreamStore.ApplicationStreamResolutions["RESOLUTION_" + (resolution == 0 ? "SOURCE" : resolution)] = resolution;
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
                    };
                };
                const removed = await this.resolution.shift();
                for (const resolution of this.resolution) {
                    StreamStore.ApplicationStreamResolutionButtonsExtended.push({
                        value: resolution,
                        label: resolution == 0 ? "Source" : `${resolution}P`,
                    });

                };
                this.resolution = [removed, ...this.resolution]
            }
            onStop() {
                if (this.originalCache["ApplicationStreamSettingRequirements"])
                    StreamStore.ApplicationStreamSettingRequirements = this.originalCache[
                            "ApplicationStreamSettingRequirements"
                        ];
                if (this.originalCache["ApplicationStreamFPSButtonsWithSuffixLabel"])
                    StreamStore.ApplicationStreamFPSButtonsWithSuffixLabel = this.originalCache[
                            "ApplicationStreamFPSButtonsWithSuffixLabel"
                        ];
                if (this.originalCache["ApplicationStreamFPSButtons"])
                    StreamStore.ApplicationStreamFPSButtons = this.originalCache[
                            "ApplicationStreamFPSButtons"
                        ];
                if (this.originalCache["ApplicationStreamFPS"])
                    StreamStore.ApplicationStreamFPS = this.originalCache[
                            "ApplicationStreamFPS"
                        ];
                if (this.originalCache["ApplicationStreamResolutionButtons"])
                    StreamStore.ApplicationStreamResolutionButtons = this.originalCache[
                            "ApplicationStreamResolutionButtons"
                        ];
                if (this.originalCache["ApplicationStreamResolutionButtonsExtended"])
                    StreamStore.ApplicationStreamResolutionButtonsExtended = this.originalCache[
                            "ApplicationStreamResolutionButtonsExtended"
                        ];
                if (this.originalCache["ApplicationStreamResolutionButtonsWithSuffixLabel"])
                    StreamStore.ApplicationStreamResolutionButtonsWithSuffixLabel = this.originalCache[
                            "ApplicationStreamResolutionButtonsWithSuffixLabel"
                        ];
                if (this.originalCache["ApplicationStreamResolutions"])
                    StreamStore.ApplicationStreamResolutions = this.originalCache[
                            "ApplicationStreamResolutions"
                        ];
                if (this.originalCache["ApplicationStreamPresetValues"])
                    StreamStore.ApplicationStreamResolutions = this.originalCache[
                            "ApplicationStreamPresetValues"
                        ];
            }
            getSettingsPanel() {
                return SettingPanel.build(this.saveSettings.bind(this),
                    new SettingGroup("FPS (Depends on Your OnScreen FPS)", {
                        collapsible: true,
                        shown: false
                    }).append(
                        new RadioGroup("FPS 15", "Replace FPS 15 with custom FPS", this.fps15, fpsOptions,
                            (e) => {
                            this.fps15 = e;
                        }), new RadioGroup("FPS 30", "Replace FPS 30 with custom FPS", this.fps30, fpsOptions,
                            (e) => {
                            this.fps30 = e;
                        }), new RadioGroup("FPS 60", "Replace FPS 60 with custom FPS", this.fps60, fpsOptions,
                            (e) => {
                            this.fps60 = e;
                        })),
                    new SettingGroup("Resolution (Depends on your screen Resolution)", {
                        collapsible: true,
                        shown: false
                    }).append(
                        new RadioGroup("480p", "Replace 480p With Custom Resolution", this.res480p, resoOptions, (e) => {
                            this.res480p = e;
                        }), new RadioGroup("720p", "Replace 720p With Custom Resolution", this.res720p, resoOptions, (e) => {
                            this.res720p = e;
                        }), new RadioGroup("1080p", "Replace 1080p With Custom Resolution", this.res1080p, resoOptions, (e) => {
                            this.res1080p = e;
                        })),
                    new SettingGroup("Preset Smoother Video", {
                        collapsible: true,
                        shown: false
                    }).append(new RadioGroup("Resolution", "Change Smoother video preset Resolution", this.smoothReso, resoWithSource, (e) => {
                            this.smoothReso = e;
                        }),
                        new RadioGroup("FPS", "Change Smoother video preset FPS", this.smoothFPS, fpsOptions, (e) => {
                            this.smoothFPS = e;
                        })),
                    new SettingGroup("Preset Better Readability", {
                        collapsible: true,
                        shown: false
                    }).append(new RadioGroup("Resolution", "Change Better Readability preset Resolution", this.betterReso, resoWithSource, (e) => {
                            this.betterReso = e;
                        }),
                        new RadioGroup("FPS", "Change Better Readability preset FPS", this.betterFPS, fpsOptions, (e) => {
                            this.betterFPS = e;
                        })));
            }
            saveSettings() {
                BdApi.saveData(config.info.name, "fps15", this.fps15);
                BdApi.saveData(config.info.name, "fps30", this.fps30);
                BdApi.saveData(config.info.name, "fps60", this.fps60);
                BdApi.saveData(config.info.name, "res480p", this.res480p);
                BdApi.saveData(config.info.name, "res720p", this.res720p);
                BdApi.saveData(config.info.name, "res1080p", this.res1080p);
                BdApi.saveData(config.info.name, "smoothReso", this.smoothReso);
                BdApi.saveData(config.info.name, "smoothFPS", this.smoothFPS);
                BdApi.saveData(config.info.name, "betterReso", this.betterReso);
                BdApi.saveData(config.info.name, "betterFPS", this.betterFPS);
                this.initialize();
            }
        };
        return plugin(Plugin, Library);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
