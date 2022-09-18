/**
 * @name DiscordBypass
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.1.3
 * @invite SgKSKyh9gY
 * @description A Collection of patches into one, Check plugin settings for features.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/DiscordBypass.plugin.js
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
      name: "DiscordBypass",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.1.3",
      description:
        "A Collection of patches into one, Check plugin settings for features.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/DiscordBypass.plugin.js",
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
          "I :3 wannya *looks at you* cuddwe w-w-with my fiancee :3 (p≧w≦q)",
        ],
      },
      {
        title: "v1.0.1",
        items: ["Infinity account in account switcher"],
      },
      {
        title: "v1.0.7",
        items: ["Added option to stop your stream preview from posting"],
      },
      {
        title: "v1.0.8",
        items: ["Added Discord Experiments"],
      },
      {
        title: "v1.1.1",
        items: [
          "Added Spotify Listen Along without premium.",
          "Fixed Setting items not updating on click.",
        ],
      },
    ],
    main: "DiscordBypass.plugin.js",
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
  :(([Plugin, Library]) => {
        const {
          WebpackModules,
          Utilities,
          Logger,
          PluginUpdater,
          Patcher,
          Settings: { SettingPanel, Switch },
          DiscordModules: {
            CurrentUserIdle,
            UserStore,
            DiscordConstants,
            ExperimentsManager,
            DeviceStore,
            Dispatcher,
          },
        } = Library;
        const { Timeout } = WebpackModules.getByProps("Timeout");
        const GuildVerificationStore = WebpackModules.getByProps(
          "AppliedGuildBoostsRequiredForBoostedGuildTier"
        );
        const ChannelPermissionStore = WebpackModules.getByProps(
          "getChannelPermissions"
        );
        const AccountSwitcher = WebpackModules.getByProps("MAX_ACCOUNTS");
        const postRequests = WebpackModules.getByProps("makeChunkedRequest");
        const isSpotifyPremium = WebpackModules.getByProps("isSpotifyPremium");
        const defaultSettings = {
          NSFW: !UserStore.getCurrentUser().nsfwAllowed,
          verification: true,
          bandwidth: true,
          PTT: true,
          accounts: true,
          streamPreview: true,
          noAFK: true,
          experiments: true,
          spotify: true,
        };
        return class DiscordBypass extends Plugin {
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
          async onStart() {
            this.checkForUpdates();
            this.initialize();
          }
          initialize() {
            if (this.settings["NSFW"]) this.bypassNSFW();
            if (this.settings["verification"]) this.patchVerification(true);
            if (this.settings["bandwidth"]) this.patchTimeouts();
            if (this.settings["PTT"]) this.patchPTT();
            if (this.settings["accounts"]) this.patchMaxAccount(true);
            if (this.settings["streamPreview"]) this.patchStreamPreview();
            if (this.settings["noAFK"]) this.noIdle();
            if (this.settings["experiments"]) this.enableExperiment();
            if (this.settings["spotify"]) this.patchSpotify();
          }
          bypassNSFW() {
            Patcher.after(UserStore, "getCurrentUser", (_, args, res) => {
              if (!res?.nsfwAllowed && res?.nsfwAllowed !== undefined) {
                res.nsfwAllowed = true;
              }
            });
          }
          patchVerification(toggle) {
            GuildVerificationStore.VerificationCriteria = toggle
              ? {
                  ACCOUNT_AGE: 0,
                  MEMBER_AGE: 0,
                }
              : {
                  ACCOUNT_AGE: 5,
                  MEMBER_AGE: 10,
                };
          }
          patchTimeouts() {
            Patcher.after(Timeout.prototype, "start", (timeout, [_, args]) => {
              if (args?.toString().includes("BOT_CALL_IDLE_DISCONNECT")) {
                timeout.stop();
              }
            });
          }
          patchPTT() {
            Patcher.after(ChannelPermissionStore, "can", (_, args, res) => {
              if (args[0] == DiscordConstants.Permissions.USE_VAD) return true;
            });
          }
          patchMaxAccount(toggle) {
            AccountSwitcher.MAX_ACCOUNTS = toggle ? Infinity : 5;
          }
          patchStreamPreview() {
            Patcher.instead(
              postRequests,
              "makeChunkedRequest",
              (_, args, res) => {
                if (!args[0].includes("preview") && !args[2].method == "POST") {
                  res();
                }
              }
            );
          }
          
          
          
          noIdle() {
            Patcher.instead(CurrentUserIdle, "getIdleSince", (_, args, res) => {
              return null;
            });
            Patcher.instead(CurrentUserIdle, "isIdle", (_, args, res) => {
              return false;
            });
            Patcher.instead(CurrentUserIdle, "isAFK", (_, args, res) => {
              return false;
            });
          }
          
          
          enableExperiment() {
            const nodes = Object.values(
              ExperimentsManager._dispatcher._actionHandlers._dependencyGraph
                .nodes
            );
              try {
                nodes
                  .find((x) => x.name == "ExperimentStore")
                  .actionHandler["OVERLAY_INITIALIZE"]({
                    user: { flags: 1 },
                    type: "CONNECTION_OPEN",
                  });
              } catch (err) {
                Logger.err(err);
              }
              const oldGetUser = UserStore.getCurrentUser;
              UserStore.getCurrentUser = () => ({
                hasFlag: () => true,
              });
              nodes
                .find((x) => x.name == "DeveloperExperimentStore")
                .actionHandler["OVERLAY_INITIALIZE"]();
              UserStore.getCurrentUser = oldGetUser;
          }
          patchSpotify() {
            Patcher.instead(DeviceStore, "getProfile", (_, [id, t]) =>
              Dispatcher.dispatch({
                type: "SPOTIFY_PROFILE_UPDATE",
                accountId: id,
                isPremium: true,
              })
            );
            Patcher.instead(isSpotifyPremium, "isSpotifyPremium", () => true);
          }
          onStop() {
            Patcher.unpatchAll();
            this.patchVerification(false);
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new Switch(
                "NSFW Bypass",
                "Bypass NSFW Age restriction",
                this.settings["NSFW"],
                (e) => {
                  this.settings["NSFW"] = e;
                },
                {
                  disabled: UserStore.getCurrentUser().nsfwAllowed,
                }
              ),
              new Switch(
                "Verification Bypass",
                "Disable wait for 10 mins to join vc in new servers",
                this.settings["verification"],
                (e) => {
                  this.settings["verification"] = e;
                }
              ),
              new Switch(
                "Call Timeout",
                "Let you stay alone in call for more than 5 mins.",
                this.settings["bandwidth"],
                (e) => {
                  this.settings["bandwidth"] = e;
                }
              ),
              new Switch(
                "No Push to talk",
                "Let you use voice Activity in push to talk only channels.",
                this.settings["PTT"],
                (e) => {
                  this.settings["PTT"] = e;
                }
              ),
              
              new Switch(
                "Maximum Account",
                "Add Unlimited Account in discord account switcher.",
                this.settings["accounts"],
                (e) => {
                  this.settings["accounts"] = e;
                }
              ),
              new Switch(
                "Stop Stream Preview",
                "Stop stream preview to be rendered for others.",
                this.preview,
                (e) => {
                  this.preview = e;
                }
              ),
              new Switch(
                "No AFK",
                "Stops Discord from setting your presense to idle and Probably no afk in vc too.",
                this.settings["noAFK"],
                (e) => {
                  this.settings["noAFK"] = e;
                }
              ),
              new Switch(
                "Discord Experiments",
                "Enable discord experiments tab and shit.",
                this.settings["experiments"],
                (e) => {
                  this.settings["experiments"] = e;
                }
              ),
              new Switch(
                "Spotify Listen Along",
                "Enables Spotify Listen Along feature on Discord without Premium.",
                this.settings["spotify"],
                (e) => {
                  this.settings["spotify"] = e;
                }
              )
            );
          }
          saveSettings() {
            Utilities.saveData(config.info.name, "settings", this.settings);
            this.stop();
            this.initialize();
          }
        };
        return plugin(Plugin, Library);
      })(window.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
