/**
 * @name FakeDeafen
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.4.4
 * @invite SgKSKyh9gY
 * @description Fake your audio status, to make it look like you are muted or deafened when you're not.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/FakeDeafen.plugin.js
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
      name: "FakeDeafen",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.4.4",
      description:
        "Fake your audio status, to make it look like you are muted or deafened when you're not.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/FakeDeafen.plugin.js",
    },
    changelog: [
      {
        title: "v0.2.3",
        items: ["Easier To use Now"],
      },
      {
        title: "v0.2.4",
        items: ["Reindented file"],
      },
      {
        title: "v0.2.6",
        items: ["Fixed some bugs, and made the code better looking."],
      },
      {
        title: "v0.3.7",
        items: ["Updater Library, Meta Update url having bugs."],
      },
      {
        title: "v0.3.8",
        items: ["Wifey.exe executed, lol ヾ(•ω•`)o."],
      },
      {
        title: "v0.3.9",
        items: ["Refractor"],
      },
      {
        title: "v0.4.0",
        items: ["Library Handler"],
      },
      {
        title: "Initial Release v1.0.0",
        items: [
          "This is the initial release of the plugin :)",
          "Fool them all (●'◡'●)",
        ],
      },
      {
        title: "v1.0.2",
        items: ["Added Fake Video", "Removed Useless code"],
      },
      {
        title: "v1.0.6",
        items: ["Option to toogle without disabling plugin itself."],
      },
      {
        title: "v1.0.9",
        items: ["Keybind to toogle, by default: CTRL+D."],
      },
      {
        title: "v1.3.2",
        items: ["Corrected text."],
      },
    ],
    main: "FakeDeafen.plugin.js",
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
        WebpackModules,
        Toasts,
        Utilities,
        PluginUpdater,
        Logger,
        DOMTools,
        Settings: { SettingPanel, SettingGroup, Switch },
        DiscordModules: { React, LocaleManager },
      } = ZLibrary;
      const { Patcher, ContextMenu } = BdApi;
      const {
        LibraryUtils,
        ReactUtils,
        LibraryIcons,
        Settings: { Keybind },
        LibraryModules: {
          WindowInfoStore,
          KeybindUtils,
          AccountDetails,
          PanelButton,
          Menu,
          StatusPicker,
          SoundModule,
          NotificationStore,
          AudioUtils,
          GatewayConnectionStore
        }
      } = BunnyLib.build(config);
      const NotificationVars = () => NotificationStore.__getLocalVars();
      const CSS = `.withTagAsButton-OsgQ9L {
            min-width:0;
            }
            `;
      const Sounds = {
        Enable: "reconnect",
        Disable: "stream_ended",
      };
      const defaultSettings = {
        toFake: {
          mute: true,
          deaf: true,
          video: false,
        },
        statusPicker: true,
        userPanel: false,
        playAudio: false,
        showToast: true,
        keybind: KeybindUtils.Kd("ctrl+d"),
      };
      return class FakeDeafen extends Plugin {
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
          this.enabled = Utilities.loadData(
            config.info.name,
            "enabled",
            true
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
        async init() {
          if (this.enabled) await this.fakeIt();
          if (this.settings["statusPicker"]) this.patchStatusPicker();
          if (this.settings["userPanel"]) this.patchPanelButton();
        }
        patchStatusPicker() {
          Patcher.before(config.info.name, Menu, "ZP", (_, args) => {
            if (args[0]?.navId != "account") return args;
            const [
              {
                children
              }
            ] = args;
            const Icon = ReactUtils.addStyle(LibraryIcons.Sound("16", "16"), {
              marginLeft: "-2px",
            });
            const DisabledIcon = ReactUtils.addChilds(Icon, React.createElement("polygon", {
              style: {
                fill: "#a61616",
              },
              points:
                "22.6,2.7 22.6,2.8 19.3,6.1 16,9.3 16,9.4 15,10.4 15,10.4 10.3,15 2.8,22.5 1.4,21.1 21.2,1.3 ",
            }));
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
              !section.props.children.find((m) => m?.props?.id == "fake-deafen")
            )
              section.props.children.push(
                React.createElement(Menu.sN, {
                  id: "fake-deafen",
                  keepItemStyles: true,
                  action: () => {
                    return this.toggle();
                  },
                  render: () =>
                    React.createElement(
                      "div",
                      {
                        onContextMenu: (event) =>
                          this.renderContextMenu(event),
                        className: StatusPicker.statusItem,
                        "aria-label": `${this.enabled ? "Unfake" : "Fake"
                          } audio status`,
                      },
                      this.enabled ? Icon : DisabledIcon,
                      React.createElement(
                        "div",
                        {
                          className: StatusPicker.status,
                        },
                        `${this.enabled ? "Unfake" : "Fake"} audio status`
                      ),
                      React.createElement(
                        "div",
                        {
                          className: StatusPicker.description,
                        },
                        `Whether to ${this.enabled ? "unfake" : "fake"
                        } deafen/mute/video status for others.`
                      )
                    ),
                })
              );
          });
        }
        patchPanelButton() {
          DOMTools.addStyle(config.info.name, CSS);
          Patcher.before(config.info.name, AccountDetails, "Z", (_, args) => {
            const [{ children }] = args;
            if (
              !children?.some?.(
                (m) =>
                  m?.props?.tooltipText == LocaleManager.Messages["MUTE"] ||
                  m?.props?.tooltipText == LocaleManager.Messages["UNMUTE"]
              )
            )
              return;
            const Icon = LibraryIcons.Sound("20", "20");
            const DisabledIcon = ReactUtils.addChilds(Icon, React.createElement("polygon", {
              style: {
                fill: "#a61616",
              },
              points:
                "22.6,2.7 22.6,2.8 19.3,6.1 16,9.3 16,9.4 15,10.4 15,10.4 10.3,15 2.8,22.5 1.4,21.1 21.2,1.3 ",
            }));
            children.unshift(
              React.createElement(PanelButton, {
                onContextMenu: (event) => this.renderContextMenu(event),
                icon: () =>
                this.enabled
                    ? Icon
                    : DisabledIcon,
                tooltipText: `${this.enabled ? "Unfake" : "Fake"
                  } audio status`,
                onClick: () => {
                  this.toggle();
                },
              })
            );
          });
        }
        renderContextMenu(event) {
          ContextMenu.open(
            event,
            ContextMenu.buildMenu([
              {
                label: "What to fake?",
                type: "text",
              },
              {
                type: "separator",
              },
              {
                type: "toggle",
                label: "Mute",
                checked: this.settings["toFake"]["mute"],
                action: () => {
                  this.settings["toFake"]["mute"] =
                    !this.settings["toFake"]["mute"];
                  this.saveSettings();
                },
              },
              {
                type: "toggle",
                label: "Deafen",
                checked: this.settings["toFake"]["deaf"],
                action: () => {
                  this.settings["toFake"]["deaf"] =
                    !this.settings["toFake"]["deaf"];
                  this.saveSettings();
                },
              },
              {
                type: "toggle",
                label: "Video",
                checked: this.settings["toFake"]["video"],
                action: () => {
                  this.settings["toFake"]["video"] =
                    !this.settings["toFake"]["video"];
                  this.saveSettings();
                },
              },
            ])
          );
        }
        onStop() {
          Patcher.unpatchAll("fake-deafen");
          Patcher.unpatchAll(config.info.name);
          this.removeListeners();
          DOMTools.removeStyle(config.info.name);
        }
        removeListeners() {
          window.removeEventListener("keydown", this.keybindListener);
          window.removeEventListener("keyup", this.keybindListener);
          WindowInfoStore.removeChangeListener(this.cleanCallback);
        }
        cleanCallback() {
          if (WindowInfoStore.isFocused()) this.currentlyPressed = {};
        }
        keybindListener(e) {
          const keybindEvent = KeybindUtils.d2(this.settings["keybind"]);
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
            if (this.settings["showToast"])
              Toasts.show(
                `${this.enabled ? "Unfaked" : "Faked"} audio status`,
                {
                  icon: "https://tharki-god.github.io/files-random-host/sound%20fake%20deaf.png",
                  timeout: 1000,
                  type: "success",
                }
              );
            this.toggle();
          }
          this.currentlyPressed[e.keyCode] = e.type == "keydown";

        }
        toggle() {
          if (this.settings["playAudio"])
            SoundModule.GN(
              this.enabled ? Sounds.Disable : Sounds.Enable,
              0.5
            );
          this.enabled ? this.unfakeIt() : this.fakeIt();
        }
        unfakeIt() {
          Patcher.unpatchAll("fake-deafen");
          this.enabled = false;
          Utilities.saveData(config.info.name, "enabled", this.enabled);
          this.update();
        }
        async fakeIt() {
          const voiceSocket = GatewayConnectionStore.getSocket();
          Patcher.instead(
            "fake-deafen",
            voiceSocket,
            "voiceStateUpdate",
            (instance, args) => {
              instance.send(4, {
                guild_id: args[0].guildId,
                channel_id: args[0].channelId,
                preferredRegion: args[0].preferredRegion,
                self_mute:
                  this.settings["toFake"]["mute"] || args[0].selfMute,
                self_deaf:
                  this.settings["toFake"]["deaf"] || args[0].selfDeaf,
                self_video:
                  this.settings["toFake"]["video"] || args[0].selfVideo,
              });
            }
          );
          this.enabled = true;
          Utilities.saveData(config.info.name, "enabled", this.enabled);
          this.update();
        }
        async update() {
          const toCheck = ["mute", "unmute"];
          const toToggle = toCheck.filter(
            (sound) => !NotificationVars().state.disabledSounds.includes(sound)
          );
          if (toToggle.length > 0)
            Object.defineProperty(NotificationVars().state, "disabledSounds", {
              value: [...toToggle, ...NotificationVars().state.disabledSounds],
              writable: true,
            });
          await AudioUtils.toggleSelfMute();
          await LibraryUtils.Sleep(100);
          AudioUtils.toggleSelfMute();
          if (toToggle.length > 0)
            Object.defineProperty(NotificationVars().state, "disabledSounds", {
              value: NotificationVars().state.disabledSounds.filter(
                (sound) => !toToggle.includes(sound)
              ),
              writable: true,
            });
        }
        getSettingsPanel() {
          return SettingPanel.build(
            this.saveSettings.bind(this),
            new SettingGroup("What to fake?", {
              collapsible: true,
              shown: false,
            }).append(
              new Switch(
                "Mute",
                "Whether you want to fake mute or not.",
                this.settings["toFake"]["mute"],
                (e) => {
                  this.settings["toFake"]["mute"] = e;
                }
              ),
              new Switch(
                "Deafen",
                "Whether you want to fake deafen or not.",
                this.settings["toFake"]["deaf"],
                (e) => {
                  this.settings["toFake"]["deaf"] = e;
                }
              ),
              new Switch(
                "Video",
                "Whether you want to fake video or not.",
                this.settings["toFake"]["video"],
                (e) => {
                  this.settings["toFake"]["video"] = e;
                }
              )
            ),
            new SettingGroup("Toggle options", {
              collapsible: true,
              shown: false,
            }).append(
              new Keybind(
                "Toggle by keybind:",
                "Keybind to toggle faking.",
                this.settings["keybind"],
                (e) => {
                  this.settings["keybind"] = e;
                }
              ),
              new Switch(
                "Show toasts",
                "Whether to show toasts on using keybinds.",
                this.settings["showToast"],
                (e) => {
                  this.settings["showToast"] = e;
                }
              ),
              new Switch(
                "Status picker",
                "Add an option in the status picker to toggle faking.",
                this.settings["statusPicker"],
                (e) => {
                  this.settings["statusPicker"] = e;
                }
              ),
              new Switch(
                "User panel",
                "Add a button in the user panel to toggle faking.",
                this.settings["userPanel"],
                (e) => {
                  this.settings["userPanel"] = e;
                }
              ),
              new Switch(
                "Play audio",
                "Play a sound upon using the keybind or clicking the button in the status picker or user panel.",
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
          Patcher.unpatchAll("fake-deafen");
          Patcher.unpatchAll(config.info.name);
          this.init();
        }
      };
    })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
