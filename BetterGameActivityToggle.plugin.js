/**
 * @name BetterGameActivityToggle
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.8.0
 * @invite SgKSKyh9gY
 * @description Toggle whether you want to show your game activity or not, without opening settings.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/BetterGameActivityToggle.plugin.js
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
      name: "BetterGameActivityToggle",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.8.0",
      description: "Toggle whether you want to show your game activity or not, without opening settings.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/BetterGameActivityToggle.plugin.js",
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
          "Game Activity Toggle looks annoying sometime so this (○｀ 3′○)",
        ],
      },
      {
        title: "v1.0.1",
        items: ["Library Handler"],
      },
      {
        title: "v1.0.3",
        items: ["Changed Icons", "More Options, Check plugin settings"],
      },
      {
        title: "v1.0.7",
        items: ["Keybind ", "Toasts"],
      },
      {
        title: "v1.7.2",
        items: ["Corrected text."],
      },
    ],
    main: "BetterGameActivityToggle.plugin.js",
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
        Toasts,
        Utilities,
        DOMTools,
        Logger,
        PluginUpdater,
        Settings: { SettingPanel, SettingGroup, Switch },
        DiscordModules: { React },
      } = ZLibrary;
      const {
        ReactUtils,
        LibraryIcons,
        UserSettingStore,
        Settings: { Keybind },
        LibraryModules: {
          WindowInfoStore,
          KeybindStore,
          AccountDetails,
          PanelButton,
          Menu,
          StatusPicker,
          SoundModule
        }
      } = BunnyLib.build(config);
      const CSS = `.withTagAsButton-OsgQ9L {
          min-width:0;
          }
          `;
      const Sounds = {
        Enable: "ptt_start",
        Disable: "ptt_stop",
      };

      const defaultSettings = {
        statusPicker: true,
        userPanel: true,
        playAudio: true,
        showToast: true,
        keybind: KeybindStore.Kd("ctrl+shift+g"),
      };
      return class BetterGameActivityToggle extends Plugin {
        constructor() {
          super();
          this.currentlyPressed = {};
          this.keybindListener = this.keybindListener.bind(this);
          this.cleanCallback = this.cleanCallback.bind(this);
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
          this.addListeners();
        }
        addListeners() {
          window.addEventListener("keydown", this.keybindListener);
          window.addEventListener("keyup", this.keybindListener);
          WindowInfoStore.addChangeListener(this.cleanCallback);
        }
        init() {
          if (this.settings["statusPicker"]) this.patchStatusPicker();
          if (this.settings["userPanel"]) this.patchPanelButton();
        }
        patchStatusPicker() {
          Patcher.before(Menu, "ZP", (_, args) => {
            if (args[0]?.navId != "account") return args;
            const enabled = UserSettingStore.getSetting("status", "showCurrentGame");
            const Icon = ReactUtils.addStyle(LibraryIcons.Controller("16", "16"), {
              marginLeft: "-2px",
            });
            const DisabledIcon = ReactUtils.addChilds(Icon, React.createElement("polygon", {
              style: {
                fill: "#a61616",
              },
              points:
                "22.6,2.7 22.6,2.8 19.3,6.1 16,9.3 16,9.4 15,10.4 15,10.4 10.3,15 2.8,22.5 1.4,21.1 21.2,1.3 ",
            }));
            const [{ children }] = args;
            const switchAccount = children.find(
              (c) => c?.props?.children?.key == "switch-account"
            );
            if (!children.find((c) => c?.props?.className == "tharki"))
              children.splice(
                children.indexOf(switchAccount),
                0,
                React.createElement(Menu.kS, {
                  className: "tharki",
                  children: [],
                })
              );
            const section = children.find(
              (c) => c?.props?.className == "tharki"
            );
            if (
              !section.props.children.find((m) => m?.props?.id == "game-activity")
            )
              section.props.children.push(
                React.createElement(Menu.sN, {
                  id: "game-activity",
                  keepItemStyles: true,
                  action: () => {
                    return this.toggleGameActivity(enabled);
                  },
                  render: () =>
                    React.createElement(
                      "div",
                      {
                        className: StatusPicker.statusItem,
                        "aria-label": `${enabled ? "Hide" : "Show"
                          } Game Activity`,
                      },
                      enabled
                        ? Icon
                        : DisabledIcon,
                      React.createElement(
                        "div",
                        {
                          className: StatusPicker.status,
                        },
                        `${enabled ? "Hide" : "Show"} Game Activity`
                      ),
                      React.createElement(
                        "div",
                        {
                          className: StatusPicker.description,
                        },
                        `${enabled ? "Disable" : "Enable"
                        } displaying currently running game in your activity status.`
                      )
                    ),
                }));
          });
        }
        patchPanelButton() {
          DOMTools.addStyle(config.info.name, CSS);
          Patcher.before(AccountDetails, "Z", (_, args) => {
            const [{ children }] = args;
            if (!children?.some?.(m => m?.props?.tooltipText == "Mute" || m?.props?.tooltipText == "Unmute")) return;
            const enabled = UserSettingStore.getSetting("status", "showCurrentGame");
            const Icon = LibraryIcons.Controller("20", "20");
            const DisabledIcon = ReactUtils.addChilds(Icon, React.createElement("polygon", {
              style: {
                fill: "#a61616",
              },
              points:
                "22.6,2.7 22.6,2.8 19.3,6.1 16,9.3 16,9.4 15,10.4 15,10.4 10.3,15 2.8,22.5 1.4,21.1 21.2,1.3 ",
            }));
            children.unshift(
              React.createElement(PanelButton, {
                icon: () =>
                  enabled
                    ? Icon
                    : DisabledIcon,
                tooltipText: `${enabled ? "Hide" : "Show"} Game Activity`,
                onClick: () => {
                  this.toggleGameActivity(enabled);
                },
              })
            );
          })
        }
        cleanCallback() {
          if (WindowInfoStore.isFocused()) this.currentlyPressed = {};
        }
        keybindListener(e) {
          const keybindEvent = KeybindStore.d2(this.settings["keybind"]);
          if (
            e.type == "keyup" &&
            keybindEvent.length &&
            keybindEvent.every(
              (ev) =>
                Object.keys(ev)
                  .filter((k) => k !== "keyCode")
                  .every((k) => ev[k] == e[k]) &&
                this.currentlyPressed[ev["keyCode"]]
            )
          ) {
            const enabled = UserSettingStore.getSetting("status", "showCurrentGame");
            if (this.showToast)
              Toasts.show(
                `${enabled ? "Disabled" : "Enabled"} Game Activity`,
                {
                  icon: "https://tharki-god.github.io/files-random-host/ic_fluent_games_24_regular.png",
                  timeout: 500,
                  type: "success",
                }
              );
            this.toggleGameActivity(enabled);
          }
          this.currentlyPressed[e.keyCode] = e.type == "keydown";
        }
        toggleGameActivity(enabled) {
          if (this.playAudio)
            SoundModule.GN(
              enabled ? Sounds.Disable : Sounds.Enable,
              0.5
            );
          UserSettingStore.setSetting("status", "showCurrentGame", !enabled)
        }

        onStop() {
          Patcher.unpatchAll();
          DOMTools.removeStyle(config.info.name);
          this.removeListeners();
        }
        removeListeners() {
          window.removeEventListener("keydown", this.keybindListener);
          window.removeEventListener("keyup", this.keybindListener);
          WindowInfoStore.removeChangeListener(this.cleanCallback);
        }
        getSettingsPanel() {
          return SettingPanel.build(
            this.saveSettings.bind(this),
            new SettingGroup("Toggle Options", {
              collapsible: true,
              shown: true,
            }).append(
              new Keybind(
                "Toggle by keybind:",
                "Keybind to toggle showing game activity.",
                this.settings["keybind"],
                (e) => {
                  this.settings["keybind"] = e;
                }
              ),
              new Switch(
                "Show toasts",
                "Show toasts on using keybind.",
                this.settings["showToast"],
                (e) => {
                  this.settings["showToast"] = e;
                }
              ),
              new Switch(
                "Status picker",
                "Add an option in the status picker to toggle showing your game activity.",
                this.settings["statusPicker"],
                (e) => {
                  this.settings["statusPicker"] = e;
                }
              ),
              new Switch(
                "User panel",
                "Add a button in the user panel to toggle showing your game activity.",
                this.settings["userPanel"],
                (e) => {
                  this.settings["userPanel"] = e;
                }
              ),
              new Switch(
                "Play audio",
                "Play audio on using the keybind or clicking the button in the status picker or user panel.",
                this.settings["playAudio"],
                (e) => {
                  this.settings["playAudio"] = e;
                }
              )
            )
          );
        }
        saveSettings() {
          Utilities.saveData(config.info.name, "settings", this.settings);
          Patcher.unpatchAll();
          this.init();
        }
      };
    })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
