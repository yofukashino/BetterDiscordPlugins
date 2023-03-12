/**
 * @name DiscordBypasses
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.3.4
 * @invite SgKSKyh9gY
 * @description A collection of bypasses and utilities. Take a look in the plugin's settings for the features.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/DiscordBypasses.plugin.js
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
      name: "DiscordBypasses",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.3.4",
      description:
        "A collection of bypasses and utilities. Take a look in the plugin's settings for the features.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/DiscordBypasses.plugin.js",
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
      {
        title: "v1.2.1",
        items: [
          "Added image compression for Custom screenshare preview",
        ],
      },
      {
        title: "v1.2.2",
        items: ["Corrected text."],
      },
      {
        title: "v1.2.3",
        items: ["Added back limit bypass for discord account switcher."],
      },
      {
        title: "v1.2.5",
        items: ["Fixed Custom stream preview not loading for host."],
      },
      {
        title: "v1.2.6",
        items: ["Corrected text."],
      },
      {
        title: "v1.2.7",
        items: ["Custom stream preview now gets file locally."],
      },
      {
        title: "v1.3.3",
        items: ["Added bypass to stop discord from pausing spotify."],
      },
      {
        title: "v1.3.4",
        items: ["Added experimental client themes."],
      }
    ],
    main: "DiscordBypasses.plugin.js",
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
        Utilities,
        Logger,
        PluginUpdater,
        Patcher,
        Settings: { SettingPanel, Switch, },
        DiscordModules: {
          CurrentUserIdle,
          UserStore,
          ElectronModule,
        },
      } = ZLibrary;
      const {
        LibraryUtils,
        ReactUtils,
        Settings: { ImagePicker },
        LibraryModules: {
          Dispatcher,
          DiscordConstants,
          ChannelPermissionStore,
          StreamPreviewStore,
          SpotifyProtocoalStore,
          SpotifyPremiumCheck,
          Timeout,
          AccountSwitcherStrings,
          DeveloperExperimentStore,
          SettingView,
          ClientThemesBackgroundStore,
          ClientThemesExperimentModule        
        },
      } = BunnyLib.build(config);      
      const defaultSettings = {
        NSFW: !UserStore.getCurrentUser().nsfwAllowed,
        bandwidth: true,
        PTT: true,
        streamPreview: true,
        fakePreview: "",
        noAFK: true,
        experiments: true,
        spotifyPremium: true,
        spotifyPause: true,
        verification: true,
        maxAccounts: true,
        clientThemes: ClientThemesExperimentModule.W.getCurrentConfig().hasSidebarEditor,
      };
      return class DiscordBypasses extends Plugin {
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
        onStart() {
          this.checkForUpdates();
          this.initialize();
        }
        initialize() {
          if (this.settings["NSFW"]) this.bypassNSFW();
          if (this.settings["bandwidth"]) this.patchTimeouts();
          if (this.settings["PTT"]) this.patchPTT();
          if (this.settings["streamPreview"]) this.patchStreamPreview();
          if (this.settings["noAFK"]) this.noIdle();
          if (this.settings["spotifyPremium"]) this.patchSpotifyPremium();
          if (this.settings["spotifyPause"]) this.patchSpotifyPause();          
          if (this.settings["experiments"]) this.enableExperiment(true);
          if (this.settings["verification"])
            this.patchGuildVerificationStore(true);
          if (this.settings["maxAccounts"])
            this.patchAccountSwitcherStrings(true);    
            if (this.settings["clientThemes"])
            this.patchClientThemesBackgroundStore(true);        
        }
        bypassNSFW() {
          Patcher.after(UserStore, "getCurrentUser", (_, args, res) => {
            if (!res?.nsfwAllowed && res?.nsfwAllowed !== undefined) {
              res.nsfwAllowed = true;
            }
          });
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
            if (args[0] == DiscordConstants.Plq.USE_VAD) return true;
          });
        }
        patchStreamPreview() {
          const replacePreviewWith = this.settings["fakePreview"] !== ""
            ? this.settings["fakePreview"]
            : null;
          if (!replacePreviewWith)
            Logger.warn(
              "No image was provided, so no stream preview is being shown."
            );
          Patcher.instead(
            ElectronModule,
            "makeChunkedRequest",
            (_, args, res) => {
              if (!args[0].includes("preview") && args[2].method !== "POST")
                return res(...args);
              if (!replacePreviewWith) return;
              res(args[0], { thumbnail: replacePreviewWith }, args[2]);
            }
          );
          Patcher.instead(StreamPreviewStore, "getPreviewURL", (_, args, res) => {
            if (args[2] == UserStore.getCurrentUser().id)
              return replacePreviewWith;
            else return res(...args);
          });
        }
        noIdle() {
          Patcher.instead(CurrentUserIdle, "getIdleSince", () => null);
          Patcher.instead(CurrentUserIdle, "isIdle", () => false);
          Patcher.instead(CurrentUserIdle, "isAFK", () => false);
        }
        enableExperiment(toggle) {
          const {Z: DevChecker} = LibraryUtils.MakeSubModuleWriteable(DeveloperExperimentStore, "Z"); 
          if (DevChecker.isDeveloper == toggle) return;            
          const { actionHandler : ExperimentStoreActions} = Utilities.findInTree(Dispatcher, n => n?.name == "ExperimentStore" && n.actionHandler["CONNECTION_OPEN"]);
          ExperimentStoreActions.CONNECTION_OPEN({
            type: "CONNECTION_OPEN", user: { flags: toggle }, experiments: [],
          });
          Object.defineProperty(DevChecker, "isDeveloper", {
            value: toggle,
            configurable: true,
            enumerable: true,
            writable: true,
          });  
          ReactUtils.forceUpdate(document.querySelector(`.${SettingView.sidebar}`))
        }       
        patchSpotifyPremium() {
          Patcher.instead(SpotifyProtocoalStore, "Ai", (_, [id]) => {
            Dispatcher.dispatch({
              type: "SPOTIFY_PROFILE_UPDATE",
              accountId: id,
              isPremium: true,
            });
          });
          Patcher.instead(SpotifyPremiumCheck, "Wo", () => true);
          Patcher.instead(SpotifyPremiumCheck, "yp", () => new Promise((resolve) => resolve(true)));
        }
        patchSpotifyPause(){
          Patcher.instead(SpotifyProtocoalStore, "wO", () => null);
        }
        patchGuildVerificationStore(toggle) {
          Object.defineProperty(DiscordConstants, "fDV", {
            value: toggle
              ? { ACCOUNT_AGE: 0, MEMBER_AGE: 0 }
              : { ACCOUNT_AGE: 5, MEMBER_AGE: 10 },
            configurable: true,
            enumerable: true,
            writable: true,
          });
        }
        patchAccountSwitcherStrings(toggle) {
          Object.defineProperty(AccountSwitcherStrings, "$H", {
            value: toggle
              ? Infinity
              : 5,
            writable: true,
          });
        }
        patchClientThemesBackgroundStore(toggle){
          Object.defineProperty(ClientThemesBackgroundStore, "isPreview", {
            value: !toggle,
            configurable: true,
            enumerable: true,
            writable: true,
          });
        }
        onStop() {
          Patcher.unpatchAll();
          this.patchGuildVerificationStore(false);
          this.patchAccountSwitcherStrings(false);
          this.patchClientThemesBackgroundStore(false);
          this.enableExperiment(false);
        }
        getSettingsPanel() {
          return SettingPanel.build(
            this.saveSettings.bind(this),
            new Switch(
              "NSFW bypass",
              "Bypasses the channel restriction when you're too young to enter channels marked as NSFW.",
              this.settings["NSFW"],
              (e) => {
                this.settings["NSFW"] = e;
              },
              {
                disabled: UserStore.getCurrentUser().nsfwAllowed,
              }
            ),
            new Switch(
              "Call timeout",
              "Lets you stay alone in a call for longer than 5 minutes.",
              this.settings["bandwidth"],
              (e) => {
                this.settings["bandwidth"] = e;
              }
            ),
            new Switch(
              "No push-to-talk",
              "Lets you use voice activity in channels that enforce the use of push-to-talk.",
              this.settings["PTT"],
              (e) => {
                this.settings["PTT"] = e;
              }
            ),
            new Switch(
              "Custom stream preview",
              "Stops your stream preview from being rendered. If an image is provided, the image given will be rendered.",
              this.settings["preview"],
              (e) => {
                this.settings["preview"] = e;
              }
            ),
            new ImagePicker(
              "Custom Preview Image",
              "Image to render as stream preview. (Must be under 200kb. If no image is provided, no stream preview will be shown.)",
              this.settings["fakePreview"],
              (e) => {
                this.settings["fakePreview"] = e;
              }
            ),
            new Switch(
              "No AFK",
              "Stops Discord from setting your presence to idle.",
              this.settings["noAFK"],
              (e) => {
                this.settings["noAFK"] = e;
              }
            ),
            new Switch(
              "Experiments",
              "Gain access to Discord's developer settings, debugging tools and experiments. (You will need to reload your Discord client after disabling this.)",
              this.settings["experiments"],
              (e) => {
                this.settings["experiments"] = e;
              }
            ),
            new Switch(
              "Spotify listen along",
              "Allows using the Spotify listen along feature on Discord without premium.",
              this.settings["spotifyPremium"],
              (e) => {
                this.settings["spotifyPremium"] = e;
              }
            ),
            new Switch(
              "Spotify Pause",
              "Prevents Discord from pausing your Spotify when streaming or gaming.",
              this.settings["spotifyPause"],
              (e) => {
                this.settings["spotifyPause"] = e;
              }
            ),            
            new Switch(
              "Guild verification bypass",
              "Removes the 10 minutes wait before being able to join voice channels in newly joined guilds.",
              this.settings["verification"],
              (e) => {
                this.settings["verification"] = e;
              }
            ),
            new Switch(
              "Max. account limit bypass",
              "Removes the maximum account limit in Discord's built-in account switcher.",
              this.settings["maxAccounts"],
              (e) => {
                this.settings["maxAccounts"] = e;
              }
            ),
            new Switch(
              "Client Themes bypass",
              "Remove need of nitro from client themes which is experimental feature (Enable the experiment to toggle this setting).",
              this.settings["clientThemes"],
              (e) => {
                this.settings["clientThemes"] = e;
              },
              {
                disabled: !ClientThemesExperimentModule.W.getCurrentConfig().hasSidebarEditor,
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
    })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
