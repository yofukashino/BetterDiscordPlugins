/**
 * @name DiscordBypasses
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.2.8
 * @invite SgKSKyh9gY
 * @description A collection of bypasses and utilities. Take a look in the plugin's settings for the features.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/DiscordBypasses.plugin.js
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
      version: "1.2.8",
      description:
        "A collection of bypasses and utilities. Take a look in the plugin's settings for the features.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/DiscordBypasses.plugin.js",
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
      }
    ],
    main: "DiscordBypasses.plugin.js",
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
      start() { }
      stop() { }
    }
    : (([Plugin, Library]) => {
      const {
        WebpackModules,
        Utilities,
        Logger,
        PluginUpdater,
        Patcher,
        Toasts,
        Settings: { SettingPanel, Switch, SettingField },
        DiscordModules: {
          CurrentUserIdle,
          UserStore,
          ExperimentsManager,
          ElectronModule,
          React
        },
      } = Library;
      const Dispatcher = WebpackModules.getByProps(
        "dispatch",
        "_actionHandlers"
      );
      const { V7: Timeout } = WebpackModules.getModule(
        (m) =>
          ["start", "stop", "isStarted"].every(proto => m?.V7?.prototype?.[proto])
      );
      const DiscordConstants = WebpackModules.getModule(
        (m) => m?.Plq?.ADMINISTRATOR == 8n
      );
      const ChannelPermissionStore = WebpackModules.getByProps(
        "getChannelPermissions"
      );
      const StreamPreviewStore = WebpackModules.getByProps("getPreviewURL");
      const DeviceStore = WebpackModules.getModule((m) =>
        m?.Ai?.toString?.()?.includes("SPOTIFY_PROFILE_UPDATE")
      );
      const SpotifyPremiumCheck = WebpackModules.getModule((m) =>
        m?.yp?.toString?.()?.includes("spotify account is not premium")
      );
      const AccountSwitcherStrings = WebpackModules.getModule(
        (m) => m.Ip == "multiaccount_cta_tooltip_seen"
      );
      class ClearButton extends React.Component {
        render() {
          const size = this.props.size || "16px";
          return React.createElement("svg", {
            className: this.props.className || "", fill: "currentColor", viewBox: "0 0 24 24", style: {
              width: size, height: size,
              padding: "0.5rem",
              borderRadius: "0.3rem",
              cursor: "pointer",
              marginLeft: "70%",
              marginRight: "auto",
              marginTop: "1rem",
            }, onClick: this.props.onClick
          },
            React.createElement("path", { d: "M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z" })
          );
        }
      }
      class ImagePickerWrapper extends React.Component {
        constructor(props) {
          super(props);
          this.state = { img: this.props.file };
        }
        clear() {
          this.setState({ img: "" });
          this.props.onFileChange("");
        }
        getBase64(url) {
          return new Promise(async (resolve) => {
            const data = await fetch(url);
            const blob = await data.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              resolve(reader.result);
            };
          });
        }
        render() {
          return React.createElement("div", { style: { color: "white" } }, this.state.img ? React.createElement(ClearButton, {
            className: "image-clear", onClick: this.clear.bind(this),
          }) : "", React.createElement("div", null, React.createElement("input", {
            ref: "file",
            id: "actual-btn",
            type: "file",
            multiple: "false",
            accept: "image/png, image/jpeg, image/webp,",
            onChange: async (e) => {
              const file = e.target.files[0]
              if ((file.size / 1024) > 200) return Toasts.show(`File Must be under 200kb.`,
                {
                  icon: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/ic_fluent_error_circle_24_regular.png",
                  timeout: 5000,
                  type: "error",
                });
              const url = URL.createObjectURL(file);
              const base64 = await this.getBase64(url);
              this.props.onFileChange(base64);
              this.setState({ img: base64 });
            },
            style: {
              display: "none"
            }
          }), React.createElement("label", {
            for: "actual-btn",
            style: {

              padding: "0.5rem",
              borderRadius: "0.3rem",
              cursor: "pointer",
              marginLeft: "25%",
              marginRight: "auto",
              marginTop: "1rem",
            }
          }, this.state.img ? React.createElement("img", {
            src: this.state.img,
            style: {
              maxWidth: "250px",
              maxHeight: "250px",

            }
          }) : React.createElement("svg", {
            width: "250",
            height: "250",
            viewBox: "0 0 24 24",
            fill: "currentColor"
          }, React.createElement("path", {
            d: "M18.75 4C20.5449 4 22 5.45507 22 7.25V18.75C22 20.5449 20.5449 22 18.75 22H7.25C5.45507 22 4 20.5449 4 18.75V12.5019C4.47425 12.6996 4.97687 12.8428 5.50009 12.9236L5.5 18.75C5.5 18.9584 5.53643 19.1583 5.60326 19.3437L11.4258 13.643C12.2589 12.8273 13.5675 12.7885 14.4458 13.5266L14.5742 13.6431L20.3964 19.3447C20.4634 19.159 20.5 18.9588 20.5 18.75V7.25C20.5 6.2835 19.7165 5.5 18.75 5.5L12.9236 5.50009C12.8428 4.97687 12.6996 4.47425 12.5019 4H18.75ZM12.5588 14.644L12.4752 14.7148L6.66845 20.4011C6.8504 20.4651 7.04613 20.5 7.25 20.5H18.75C18.9535 20.5 19.1489 20.4653 19.3305 20.4014L13.5247 14.7148C13.2596 14.4553 12.8501 14.4316 12.5588 14.644ZM16.2521 7.5C17.4959 7.5 18.5042 8.50831 18.5042 9.75212C18.5042 10.9959 17.4959 12.0042 16.2521 12.0042C15.0083 12.0042 14 10.9959 14 9.75212C14 8.50831 15.0083 7.5 16.2521 7.5ZM6.5 1C9.53757 1 12 3.46243 12 6.5C12 9.53757 9.53757 12 6.5 12C3.46243 12 1 9.53757 1 6.5C1 3.46243 3.46243 1 6.5 1ZM16.2521 9C15.8367 9 15.5 9.33673 15.5 9.75212C15.5 10.1675 15.8367 10.5042 16.2521 10.5042C16.6675 10.5042 17.0042 10.1675 17.0042 9.75212C17.0042 9.33673 16.6675 9 16.2521 9ZM6.5 2.99923L6.41012 3.00729C6.20603 3.04433 6.0451 3.20527 6.00806 3.40936L6 3.49923L5.99965 5.99923L3.49765 6L3.40777 6.00806C3.20368 6.0451 3.04275 6.20603 3.00571 6.41012L2.99765 6.5L3.00571 6.58988C3.04275 6.79397 3.20368 6.9549 3.40777 6.99194L3.49765 7L6.00065 6.99923L6.00111 9.50348L6.00916 9.59336C6.04621 9.79745 6.20714 9.95839 6.41123 9.99543L6.50111 10.0035L6.59098 9.99543C6.79508 9.95839 6.95601 9.79745 6.99305 9.59336L7.00111 9.50348L7.00065 6.99923L9.50457 7L9.59444 6.99194C9.79853 6.9549 9.95947 6.79397 9.99651 6.58988L10.0046 6.5L9.99651 6.41012C9.95947 6.20603 9.79853 6.0451 9.59444 6.00806L9.50457 6L6.99965 5.99923L7 3.49923L6.99194 3.40936C6.9549 3.20527 6.79397 3.04433 6.58988 3.00729L6.5 2.99923Z"
          })), React.createElement("div", {
            for: "actual-btn",
            style: {
              color: "white",
              padding: "0.5rem",
              borderRadius: "0.3rem",
              cursor: "pointer",
              marginLeft: this.state.img ? "38%" : "42%",
              marginRight: "auto",
              marginTop: "1rem",
            }
          }, this.state.img ? "Change Image" : "Add Image"))));
        }
      }
      class ImagePicker extends SettingField {
        constructor(name, note, value, onChange, options = {}) {
          const { disabled = false } = options;
          super(name, note, onChange, ImagePickerWrapper, {
            disabled: disabled,
            file: value,
            onFileChange: (e) => { this.onChange(e) },
            onChange: () => null,
          });
        }
      }

      const defaultSettings = {
        NSFW: !UserStore.getCurrentUser().nsfwAllowed,
        bandwidth: true,
        PTT: true,
        streamPreview: true,
        fakePreview: "",
        noAFK: true,
        experiments: true,
        spotify: true,
        verification: true,
        maxAccounts: true,
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
          if (this.settings["spotify"]) this.patchSpotify();
          if (this.settings["experiments"]) this.enableExperiment();
          if (this.settings["verification"])
            this.patchGuildVerificationStore(true);
          if (this.settings["maxAccounts"])
            this.patchAccountSwitcherStrings(true);
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
        async patchStreamPreview() {
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
          } catch (err) { }
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
          Patcher.instead(DeviceStore, "Ai", (_, [id]) => {
            Dispatcher.dispatch({
              type: "SPOTIFY_PROFILE_UPDATE",
              accountId: id,
              isPremium: true,
            });
          });
          Patcher.instead(SpotifyPremiumCheck, "Wo", () => true);
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
        onStop() {
          Patcher.unpatchAll();
          this.patchGuildVerificationStore(false);
          this.patchAccountSwitcherStrings(false);
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
              "Stops your stream preview from being rendered. If an image link is provided, the image given will be rendered.",
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
              this.settings["spotify"],
              (e) => {
                this.settings["spotify"] = e;
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
