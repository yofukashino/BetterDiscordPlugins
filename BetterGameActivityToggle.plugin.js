/**
 * @name BetterGameActivityToggle
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.6.4
 * @invite SgKSKyh9gY
 * @description Toogle your game activity without opening settings.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BetterGameActivityToggle.plugin.js
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
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.6.4",
      description: "Toogle your game activity without opening settings.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BetterGameActivityToggle.plugin.js",
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
    ],
    main: "BetterGameActivityToggle.plugin.js",
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
          Patcher,
          WebpackModules,
          ReactTools,
          Toasts,
          Utilities,
          DOMTools,
          Logger,
          PluginUpdater,
          Settings: { SettingPanel, SettingGroup, Keybind, Switch },
          DiscordModules: { React, SoundModule },
        } = Library;
        const enabledIcon = (width, height) =>
          React.createElement(
            "svg",
            {
              viewBox: "0 0 24 24",
              width,
              height,
              style: {
                "margin-left": "-2px",
              },
            },
            React.createElement("path", {
              style: {
                fill: "currentColor",
              },
              d: "M17 2H7C4.8 2 3 3.8 3 6V18C3 20.2 4.8 22 7 22H17C19.2 22 21 20.2 21 18V6C21 3.8 19.2 2 17 2ZM10.86 18.14C10.71 18.29 10.52 18.36 10.33 18.36C10.14 18.36 9.95 18.29 9.8 18.14L9.15 17.49L8.53 18.11C8.38 18.26 8.19 18.33 8 18.33C7.81 18.33 7.62 18.26 7.47 18.11C7.18 17.82 7.18 17.34 7.47 17.05L8.09 16.43L7.5 15.84C7.21 15.55 7.21 15.07 7.5 14.78C7.79 14.49 8.27 14.49 8.56 14.78L9.15 15.37L9.77 14.75C10.06 14.46 10.54 14.46 10.83 14.75C11.12 15.04 11.12 15.52 10.83 15.81L10.21 16.43L10.86 17.08C11.15 17.37 11.15 17.85 10.86 18.14ZM14.49 18.49C13.94 18.49 13.49 18.05 13.49 17.5V17.48C13.49 16.93 13.94 16.48 14.49 16.48C15.04 16.48 15.49 16.93 15.49 17.48C15.49 18.03 15.04 18.49 14.49 18.49ZM16.51 16.33C15.96 16.33 15.5 15.88 15.5 15.33C15.5 14.78 15.94 14.33 16.49 14.33H16.51C17.06 14.33 17.51 14.78 17.51 15.33C17.51 15.88 17.06 16.33 16.51 16.33ZM18 9.25C18 10.21 17.21 11 16.25 11H7.75C6.79 11 6 10.21 6 9.25V6.75C6 5.79 6.79 5 7.75 5H16.25C17.21 5 18 5.79 18 6.75V9.25Z",
            })
          );
        const disabledIcon = (width, height) =>
          React.createElement(
            "svg",
            {
              viewBox: "0 0 24 24",
              width,
              height,
              style: {
                "margin-left": "-2px",
              },
            },
            React.createElement("path", {
              style: {
                fill: "currentColor",
              },
              d: "M17 2H7C4.8 2 3 3.8 3 6V18C3 20.2 4.8 22 7 22H17C19.2 22 21 20.2 21 18V6C21 3.8 19.2 2 17 2ZM10.86 18.14C10.71 18.29 10.52 18.36 10.33 18.36C10.14 18.36 9.95 18.29 9.8 18.14L9.15 17.49L8.53 18.11C8.38 18.26 8.19 18.33 8 18.33C7.81 18.33 7.62 18.26 7.47 18.11C7.18 17.82 7.18 17.34 7.47 17.05L8.09 16.43L7.5 15.84C7.21 15.55 7.21 15.07 7.5 14.78C7.79 14.49 8.27 14.49 8.56 14.78L9.15 15.37L9.77 14.75C10.06 14.46 10.54 14.46 10.83 14.75C11.12 15.04 11.12 15.52 10.83 15.81L10.21 16.43L10.86 17.08C11.15 17.37 11.15 17.85 10.86 18.14ZM14.49 18.49C13.94 18.49 13.49 18.05 13.49 17.5V17.48C13.49 16.93 13.94 16.48 14.49 16.48C15.04 16.48 15.49 16.93 15.49 17.48C15.49 18.03 15.04 18.49 14.49 18.49ZM16.51 16.33C15.96 16.33 15.5 15.88 15.5 15.33C15.5 14.78 15.94 14.33 16.49 14.33H16.51C17.06 14.33 17.51 14.78 17.51 15.33C17.51 15.88 17.06 16.33 16.51 16.33ZM18 9.25C18 10.21 17.21 11 16.25 11H7.75C6.79 11 6 10.21 6 9.25V6.75C6 5.79 6.79 5 7.75 5H16.25C17.21 5 18 5.79 18 6.75V9.25Z",
            }),
            React.createElement("polygon", {
              style: {
                fill: "#a61616",
              },
              points:
                "22.6,2.7 22.6,2.8 19.3,6.1 16,9.3 16,9.4 15,10.4 15,10.4 10.3,15 2.8,22.5 1.4,21.1 21.2,1.3 ",
            })
          );
        const toReplace = {
          controlleft: "ctrl",
          capslock: "caps lock",
          shiftright: "right shift",
          controlright: "right ctrl",
          contextmenu: "right meta",
          metaleft: "meta",
          backquote: "`",
          altleft: "alt",
          altright: "right alt",
          escape: "esc",
          shiftleft: "shift",
          key: "",
          digit: "",
          minus: "-",
          equal: "=",
          backslash: "\\",
          bracketleft: "[",
          bracketright: "]",
          semicolon: ";",
          quote: "'",
          slash: "/",
          comma: ",",
          period: ".",
          numpadadd: "numpad +",
          numpadenter: "enter",
          numpaddivide: "numpad /",
          numpadmultiply: "numpad *",
          numpadsubtract: "numpad -",
          arrowleft: "left",
          arrowright: "right",
          arrowdown: "down",
          arrowup: "up",
          pause: "break",
          pagedown: "page down",
          pageup: "page up",
          numlock: "numpad clear",
          printscreen: "print screen",
          scrolllock: "scroll lock",
          numpad: "numpad ",
        };
        const settingStore = WebpackModules.getByProps("ShowCurrentGame");
        const StatusPicker = WebpackModules.getByProps("status", "statusItem");
        const SideBar = WebpackModules.getByProps("MenuItem");
        const classes = WebpackModules.getByProps(
          "container",
          "usernameContainer"
        );
        const PanelButton = WebpackModules.getByDisplayName("PanelButton");
        const [Account] = ReactTools.getStateNodes(
          document.querySelector(`.${classes.container}`)
        );
        const css = `.withTagAsButton-OsgQ9L {
              min-width:0;
              }`;
        const Sounds = {
          Enable: "ptt_start",
          Disable: "ptt_stop",
        };
        const WindowInfoStore = WebpackModules.getByProps(
          "isFocused",
          "isElementFullScreen"
        );
        const defaultSettings = {
          statusPicker: true,
          userPanel: true,
          playAudio: true,
          showToast: true,
          keybind: ["ctrl", "shift", "g"],
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
            Patcher.before(SideBar, "default", (_, args) => {
              if (args[0]?.navId != "account") return args;
              const enabled = settingStore.ShowCurrentGame.getSetting();
              const [{ children: {props: {children}} }] = args;
              const switchAccount = children.find(
                (c) => c?.props?.children?.key == "switch-account"
              );
              if (!children.find((c) => c?.props?.id == "game-activity")) {
                children.splice(
                  children.indexOf(switchAccount),
                  0,
                  React.createElement(SideBar.MenuItem, {
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
                          "aria-label": `${
                            enabled ? "Hide" : "Show"
                          } Game Activity`,
                        },
                        enabled
                          ? disabledIcon("16", "16")
                          : enabledIcon("16", "16"),
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
                          `${
                            enabled ? "Disable" : "Enable"
                          } displaying currently running game in your activity status.`
                        )
                      ),
                  })
                );
              }
            });
          }
          patchPanelButton() {
            DOMTools.addStyle("gamePanelButton", css);
            Patcher.after(Account, "render", (_, args, res) => {
              const {props: {children: [__, {props: {children}}]}} = res; 
              const enabled = settingStore.ShowCurrentGame.getSetting();
             children.unshift(
                React.createElement(PanelButton, {
                  icon: () =>
                    enabled
                      ? enabledIcon("20", "20")
                      : disabledIcon("20", "20"),
                  tooltipText: `${enabled ? "Hide" : "Show"} Game Activity`,
                  onClick: () => {
                    this.toggleGameActivity(enabled);
                  },
                })
              );
            });
          }
          cleanCallback() {
            if (WindowInfoStore.isFocused()) this.currentlyPressed = {};
          }
          keybindListener(e) {
            const re = new RegExp(Object.keys(toReplace).join("|"), "gi");
            this.currentlyPressed[
              e.code?.toLowerCase().replace(re, (matched) => {
                return toReplace[matched];
              })
            ] = e.type == "keydown";
            if (
              this.settings["keybind"]?.length &&
              this.settings["keybind"].every(
                (key) => this.currentlyPressed[key.toLowerCase()] === true
              )
            ) {
              const enabled = settingStore.ShowCurrentGame.getSetting();
              if (this.showToast)
                Toasts.show(
                  `${enabled ? "Disabled" : "Enabled"} Game Activity`,
                  {
                    icon: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/ic_fluent_games_24_regular.png",
                    timeout: 500,
                    type: "success",
                  }
                );
              this.toggleGameActivity(enabled);
            }
            this.currentlyPressed = Object.entries(this.currentlyPressed)
              .filter((t) => t[1] === true)
              .reduce((a, v) => ({ ...a, [v[0]]: v[1] }), {});
          }
          toggleGameActivity(enabled) {
            if (this.playAudio)
              SoundModule.playSound(
                enabled ? Sounds.Disable : Sounds.Enable,
                0.5
              );
            settingStore.ShowCurrentGame.updateSetting(!enabled);
            Account.forceUpdate();
          }
          onStop() {
            Patcher.unpatchAll();
            DOMTools.removeStyle("gamePanelButton");
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
              new SettingGroup("Toogle Options", {
                collapsible: true,
                shown: true,
              }).append(
                new Keybind(
                  "Toggle by keybind:",
                  "Keybind to toggle Game Activity",
                  this.settings["keybind"],
                  (e) => {
                    this.settings["keybind"] = e;
                  }
                ),
                new Switch(
                  "Show Toasts",
                  "Whether to show toast on using keybind",
                  this.settings["showToast"],
                  (e) => {
                    this.settings["showToast"] = e;
                  }
                ),
                new Switch(
                  "Status Picker",
                  "Add Option in status Picker to toogle Game Activity.",
                  this.settings["statusPicker"],
                  (e) => {
                    this.settings["statusPicker"] = e;
                  }
                ),
                new Switch(
                  "User Panel",
                  "Add Button in in user panel to toogle fGame Activity.",
                  this.settings["userPanel"],
                  (e) => {
                    this.settings["userPanel"] = e;
                  }
                ),
                new Switch(
                  "Play Audio",
                  "Play Audio on clicking button in user panel/using keybind.",
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
        return plugin(Plugin, Library);
      })(window.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
