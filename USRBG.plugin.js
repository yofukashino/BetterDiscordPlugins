/**
 * @name USRBG
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.0.1
 * @invite SgKSKyh9gY
 * @description USRBG for better discord.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/USRBG.plugin.js
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
      name: "USRBG",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.0.1",
      description: "USRBG for better discord.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/UserBG.plugin.js",
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
          "Ah my last plugin before i die ...(*￣０￣)ノ",
        ],
      },
    ],
    main: "UserBG.plugin.js",
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
          Patcher,
          Utilities,
          Settings: { SettingPanel, Switch, RadioGroup },
        } = Library;
        const USRBG_URL =
          "https://raw.githubusercontent.com/Discord-Custom-Covers/usrbg/master/dist/usrbg.json";
        const UserBannerParent = WebpackModules.getModule(
          (m) => m.name == "re" && m.toString().includes("displayProfile"),
          { defaultExport: false }
        );
        const UserBannerPopoutParent = WebpackModules.getModule(
          (m) => m.name == "ae" && m.toString().includes("displayProfile"),
          { defaultExport: false }
        );
        const UserPopoutAvatarParent = WebpackModules.getModule((m) =>
          m?.ZP?.toString()?.includes("displayProfile")
        );
        const UserPopoutAvatarParent2 = WebpackModules.getModule((m) =>
        m?.tZ?.toString()?.includes("displayProfile") && !m.ZP
      );
        const defaultSettings = Object.freeze({
          nitroBanner: true,
          style: 2,
        });
        return class USRBG extends Plugin {
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
            this.applyPatches();
          }
          async getUSRBG() {
            const response = await fetch(USRBG_URL);
            const json = await response.json();
            return new Map(json.map((user) => [user.uid, user]));
          }
          async applyPatches() {
            const USRDB = await this.getUSRBG();
            Patcher.before(UserBannerParent, "Z", (_, [args]) => {
              if (
                !USRDB.has(args.user.id) ||
                (args?.displayProfile?.premiumType &&
                  this.settings["nitroBanner"])
              )
                return;
              const img = USRDB.get(args.user.id)?.img;
              args.bannerSrc = img;
              if (!args.displayProfile) return;
              Patcher.instead(args.displayProfile, "getBannerURL", () => img);
            });
            Patcher.before(UserBannerPopoutParent, "Z", (_, [args]) => {
              if (
                !USRDB.has(args.user.id) ||
                (args?.displayProfile?.premiumType &&
                  this.settings["nitroBanner"])
              )
                return;
              const img = USRDB.get(args.user.id)?.img;
              args.bannerSrc = img;
              if (!args.displayProfile) return;
              Patcher.instead(args.displayProfile, "getBannerURL", () => img);
            });
            Patcher.before(UserPopoutAvatarParent, "ZP", (_, [args]) => {
              if (
                !USRDB.has(args.user.id) ||
                (args?.displayProfile?.premiumType &&
                  this.settings["nitroBanner"])
              )
                return;
              args.displayProfile.banner = "_";
            });
            Patcher.before(UserPopoutAvatarParent2, "tZ", (_, [args]) => {
              if (
                !USRDB.has(args.user.id) ||
                (args?.displayProfile?.premiumType &&
                  this.settings["nitroBanner"])
              )
                return;
              args.displayProfile.banner = "_";
            });
            Patcher.after(UserBannerParent, "Z", (_, [args], res) => {
              if (
                !USRDB.has(args.user.id) ||
                (args?.displayProfile?.premiumType &&
                  this.settings["nitroBanner"])
              )
                return;
              res.props.isPremium = true;
              res.props.profileType = this.settings["style"];
              res.props.children.props.children = [];
            });
            Patcher.after(UserBannerPopoutParent, "Z", (_, [args], res) => {
              if (
                !USRDB.has(args.user.id) ||
                (args?.displayProfile?.premiumType &&
                  this.settings["nitroBanner"])
              )
                return;
              res.props.isPremium = true;
              res.props.profileType = this.settings["style"];
              res.props.children.props.children = [];
            });
          }

          onStop() {
            Patcher.unpatchAll();
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new Switch(
                "Priorities",
                "Prioritise Nitro banner",
                this.settings["nitroBanner"],
                (e) => {
                  this.settings["nitroBanner"] = e;
                }
              ),
              new RadioGroup(
                "Avatar Style",
                "Avatar and banner styling",
                this.settings["style"],
                [
                  {
                    name: "Attached with Banner",
                    value: 2,
                  },
                  {
                    name: "With Border Around Avatar",
                    value: 0,
                  },
                ],
                (e) => {
                  this.settings["style"] = e;
                }
              )
            );
          }
        };
        return plugin(Plugin, Library);
      })(window.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
