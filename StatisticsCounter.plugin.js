/**
 * @name StatisticsCounter
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.0.6
 * @invite SgKSKyh9gY
 * @description Introduces a similar sort of counter that used to be displayed in-between the home button and servers list.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/StatisticsCounter.plugin.js
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
module.exports = ((_) => {
  const config = {
    info: {
      name: "StatisticsCounter",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.0.6",
      description:
        "Introduces a similar sort of counter that used to be displayed in-between the home button and servers list.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/StatisticsCounter.plugin.js",
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
          "i wanted it so made it huh ...(*￣０￣)ノ",
        ],
      },
      {
        title: "v1.0.3",
        items: [
          "Fixed after discord update",
          "Context menu will be fixed with Zlib update",
        ],
      },
    ],
    main: "StatisticsCounter.plugin.js",
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
          Patcher,
          ContextMenu,
          Utilities,
          Toasts,
          Logger,
          PluginUpdater,
          ReactTools,
          DOMTools,
          Settings: { SettingPanel, Switch, SettingGroup, Slider },
          DiscordModules: { React, ReactDOM, RelationshipStore },
        } = Library;
        const {
          FormattedCounterTypes,
          CounterMessage,
          CounterTranslationKeys,
          ActionTypes,
        } = Object.freeze({
          FormattedCounterTypes: {
            ONLINE: "Online",
            FRIEND: "Friends",
            PENDING: "Pending",
            BLOCKED: "Blocked",
            GUILDS: "Guilds",
            BDVERSION: "BDVersion",
          },
          CounterMessage: {
            STATUS_ONLINE: "Online",
            FRIENDS: "Friends",
            PENDING: "Pending",
            BLOCKED: "Blocked",
            SERVERS: "Servers",
            BDVERSION: "Better Discord",
          },
          CounterTranslationKeys: {
            ONLINE: "STATUS_ONLINE",
            FRIEND: "FRIENDS",
            PENDING: "PENDING",
            BLOCKED: "BLOCKED",
            GUILDS: "SERVERS",
            BDVERSION: "BDVERSION",
          },
          ActionTypes: {
            STATISTICS_COUNTER_SET_ACTIVE: "STATISTICS_COUNTER_SET_ACTIVE",
          },
        });
        const DiscordConstants = WebpackModules.getModule(
          (m) => m?.Plq?.ADMINISTRATOR == 8n
        );
        const Dispatcher = WebpackModules.getByProps(
          "dispatch",
          "_actionHandlers"
        );
        const SliderComponent = WebpackModules.getModule((m) =>
          m.render?.toString().includes("sliderContainer")
        );
        const GuildNav = WebpackModules.getModule((m) =>
          m?.type?.toString?.()?.includes("guildsnav")
        );
        const { tutorialContainer } = WebpackModules.getByProps(
          "homeIcon",
          "tutorialContainer"
        );
        const NavBar = WebpackModules.getByProps("guilds", "base");
        const listStyles = WebpackModules.getByProps("listItem");
        const Flux = Object.assign(
          {},
          WebpackModules.getByProps("Store", "connectStores"),
          ((store) =>
            WebpackModules.getModule(
              (m, e) =>
                m.toString().includes("useStateFromStores") &&
                (store = e.exports)
            ) && store)()
        );
        const PresenceStore = WebpackModules.getByProps(
          "getState",
          "getStatus",
          "isMobileOnline"
        );
        const GuildStore = WebpackModules.getByProps(
          "initialize",
          "totalGuilds"
        );
        const CSS = `.statistics-counter {
            font-size: 10px;
            font-weight: 500;
            line-height: 13px;
            text-align: center;
            text-transform: uppercase;
            white-space: normal;
            width: 62px;
            word-wrap: normal;
            color: var(--channels-default);
          }
          .statistics-counter.ONLINE {
            font-size: 11px;
          }
          .statistics-counter.FRIEND {
            font-size: 11px;
          }
          .statistics-counter.PENDING {
            font-size: 9.4px;
          }
          .statistics-counter.BLOCKED {
            font-size: 11px;
          }
          .statistics-counter.GUILDS {
            font-size: 10.5px;
          }
          .statistics-counter.BDVERSION {
            font-size: 11px;
          }          
          .statistics-counter .clickable {
            cursor: pointer;
          }          
          .statistics-counter .clickable:active {
            color: var(--interactive-active);
          }          
          .statistics-counter .clickable:hover {
            color: var(--interactive-hover);
          }   
          .statistics-counter-list-item {
            display: flex;
            justify-content: center;
            margin-bottom: 8px;
            position: relative;
            width: 72px;
          }
          `;
        const defaultSettings = Object.freeze({
          lastCounter: "ONLINE",
          preserveLastCounter: false,
          autoRotationDelay: 3e4,
          autoRotation: false,
          autoRotationHoverPause: true,
          Counters: {
            Online: true,
            Friends: true,
            Pending: true,
            Blocked: true,
            Guilds: true,
            BDVersion: true,
          },
        });
        return class StatisticsCounter extends Plugin {
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
            DOMTools.addStyle(config.info.name, CSS);
            this.patchHomeButton();
          }
          patchHomeButton() {
            Patcher.after(GuildNav, "type", (_, args, res) => {
              const StatisticsCounter = React.createElement(
                this.ErrBoundary(),
                null,
                this.Counter()
              );
              const HomeButton = document.querySelector(
                `.${tutorialContainer}`
              );
              if (!HomeButton || !StatisticsCounter) return;
              if (!HomeButton.querySelector(`.UnderHomeButton`)) {
                const UnderHomeButtonDiv = document.createElement("div");
                UnderHomeButtonDiv.setAttribute("class", "UnderHomeButton");
                HomeButton.appendChild(UnderHomeButtonDiv);
              }
              const UnderHomeButton =
                document.querySelector(`.UnderHomeButton`);
              ReactDOM.render(StatisticsCounter, UnderHomeButton);
            });
            this.forceUpdate();
          }
          CounterStore() {
            var activeCounter = this.settings["lastCounter"];
            const Counters = this.settings["Counters"];
            class CounterStore extends Flux.Store {
              static STORE_ID = "statistics-counter-store";
              get state() {
                return {
                  activeCounter: activeCounter || this.filteredCounters[0],
                  nextCounter: this.nextCounter,
                };
              }
              get filteredCounters() {
                return Object.keys(FormattedCounterTypes).filter(
                  (counter) => Counters[FormattedCounterTypes[counter]]
                );
              }
              get nextCounter() {
                const counters = this.filteredCounters;
                const currentIndex = counters.indexOf(
                  activeCounter || counters[0]
                );
                return currentIndex >= counters.length - 1
                  ? counters[0]
                  : counters[currentIndex + 1];
              }
            }
            return (
              Flux.Store?.getAll?.().find(
                (store) => store.constructor.STORE_ID === CounterStore.STORE_ID
              ) ||
              new CounterStore(Dispatcher, {
                [ActionTypes.STATISTICS_COUNTER_SET_ACTIVE]: ({ counter }) =>
                  (activeCounter = counter),
              })
            );
          }
          Counter() {
            const CounterStore = this.CounterStore();
            const { activeCounter, nextCounter, counters } = Flux.ZP(
              [CounterStore, RelationshipStore, PresenceStore, GuildStore],
              () => ({
                ...CounterStore.state,
                counters: {
                  ONLINE:
                    RelationshipStore?.getFriendIDs?.().filter(
                      (id) => PresenceStore.getStatus(id) !== "offline"
                    ).length || 0,
                  GUILDS: GuildStore?.totalGuilds || 0,
                  ...this.getRelationshipCounts(),
                  BDVERSION: BdApi.version,
                },
              })
            );
            const paused = React.useRef(false);
            React.useEffect(() => {
              const interval = setInterval(() => {
                if (
                  (activeCounter === nextCounter ||
                    this.settings["autoRotation"]) &&
                  !paused.current
                )
                  this.goToNextCounter();
              }, this.settings["autoRotationDelay"]);
              return () => clearInterval(interval);
            }, []);
            return React.createElement(
              "div",
              { className: listStyles.listItem },
              React.createElement(
                "div",
                {
                  className: `statistics-counter ${activeCounter}`,
                  onMouseEnter: () => {
                    paused.current = this.settings["autoRotationHoverPause"];
                  },
                  onMouseLeave: () => {
                    paused.current = false;
                  },
                },
                React.createElement(
                  "span",
                  {
                    className: activeCounter !== nextCounter && "clickable",
                    onContextMenu: (event) => {
                      ContextMenu.openContextMenu(
                        event,
                        ContextMenu.buildMenu(this.StatisticsCounterMenu())
                      );
                    },
                    onClick: () => this.goToNextCounter(),
                  },
                  `${CounterMessage[CounterTranslationKeys[activeCounter]]} - ${
                    counters[activeCounter]
                  }`
                )
              )
            );
          }
          goToNextCounter() {
            const CounterStore = this.CounterStore();
            if (this.settings["preserveLastCounter"]) {
              this.settings["lastCounter"] = CounterStore.nextCounter;
              this.saveSettings();
            }
            Dispatcher.dispatch({
              type: ActionTypes.STATISTICS_COUNTER_SET_ACTIVE,
              counter: CounterStore.nextCounter,
            });
          }
          getRelationshipCounts() {
            const relationshipTypes = Object.keys(DiscordConstants.OGo).filter(
              isNaN
            );
            const relationshipCounts = relationshipTypes.reduce(
              (obj, type) => ({ ...obj, [type]: 0 }),
              {}
            );
            const relationships = RelationshipStore.getRelationships();
            for (const type in relationships) {
              relationshipCounts[relationshipTypes[relationships[type]]]++;
            }
            relationshipCounts[
              "PENDING"
            ] = `${relationshipCounts["PENDING_INCOMING"]}/${relationshipCounts["PENDING_OUTGOING"]}`;
            return relationshipCounts;
          }
          StatisticsCounterMenu() {
            return [
              {
                label: "Visibility",
                id: "visibility",
                children: ContextMenu.buildMenuChildren([
                  {
                    label: "Show Online",
                    id: "show-online",
                    type: "toggle",
                    checked: this.settings["Counters"]["Online"],
                    action: (e, s) => {
                      this.settings["Counters"]["Online"] =
                        !this.settings["Counters"]["Online"];
                      this.saveSettings();
                    },
                  },
                  {
                    label: "Show Friends",
                    id: "show-friends",
                    type: "toggle",
                    checked: this.settings["Counters"]["Friends"],
                    action: (e) => {
                      this.settings["Counters"]["Friends"] =
                        !this.settings["Counters"]["Friends"];
                      this.saveSettings();
                    },
                  },
                  {
                    label: "Show Pending",
                    id: "show-pending",
                    type: "toggle",
                    checked: this.settings["Counters"]["Pending"],
                    action: (e) => {
                      this.settings["Counters"]["Pending"] =
                        !this.settings["Counters"]["Pending"];
                      this.saveSettings();
                    },
                  },
                  {
                    label: "Show Blocked",
                    id: "show-blocked",
                    type: "toggle",
                    checked: this.settings["Counters"]["Blocked"],
                    action: (e) => {
                      this.settings["Counters"]["Blocked"] =
                        !this.settings["Counters"]["Blocked"];
                      this.saveSettings();
                    },
                  },
                  {
                    label: "Show Guilds",
                    id: "show-guilds",
                    type: "toggle",
                    checked: this.settings["Counters"]["Guilds"],
                    action: (e) => {
                      this.settings["Counters"]["Guilds"] =
                        !this.settings["Counters"]["Guilds"];
                      this.saveSettings();
                    },
                  },
                  {
                    label: "Show BD Version",
                    id: "bd-version",
                    type: "toggle",
                    checked: this.settings["Counters"]["BDVersion"],
                    action: (e) => {
                      this.settings["Counters"]["BDVersion"] =
                        !this.settings["Counters"]["BDVersion"];
                      this.saveSettings();
                    },
                  },
                  {
                    type: "separator",
                  },
                  {
                    label: "Preserve Last Counter",
                    id: "preserve-last-counter",
                    type: "toggle",
                    checked: this.settings["preserveLastCounter"],
                    action: (e) => {
                      this.settings["preserveLastCounter"] =
                        !this.settings["preserveLastCounter"];
                      this.saveSettings();
                    },
                  },
                ]),
              },
              {
                label: "Auto Rotation",
                id: "auto-rotation",
                children: ContextMenu.buildMenuChildren(
                  [
                    {
                      label: "Enabled",
                      id: "auto-rotation-enabled",
                      type: "toggle",
                      checked: this.settings["autoRotation"],
                      action: (e) => {
                        this.settings["autoRotation"] =
                          !this.settings["autoRotation"];
                        this.saveSettings();
                      },
                    },
                    {
                      type: "separator",
                    },
                    {
                      label: "Pause On Hover",
                      id: "pause-on-hover",
                      type: "toggle",
                      checked: this.settings["autoRotationHoverPause"],
                      action: (e) => {
                        this.settings["autoRotationHoverPause"] =
                          !this.settings["autoRotationHoverPause"];
                        this.saveSettings();
                      },
                    },
                    {
                      id: "rotate-interval",
                      label: "Rotate Interval",
                      type: "control",
                      control: () =>
                        React.createElement(SliderComponent, {
                          value: this.settings["autoRotationDelay"],
                          initialValue: 3e4,
                          minValue: 5e3,
                          maxValue: 36e5,
                          renderValue: (value) => {
                            const seconds = value / 1000;
                            const minutes = value / 1000 / 60;
                            return value < 6e4
                              ? `${seconds.toFixed(0)} secs`
                              : `${minutes.toFixed(0)} mins`;
                          },
                          onChange: (e) => {
                            this.settings["autoRotationDelay"] = e;
                            this.saveSettings();
                          },
                        }),
                    },
                  ].filter((item) => item)
                ),
              },
            ];
          }
          ErrBoundary() {
            const encounteredErrs = [];
            return class ErrBoundary extends React.PureComponent {
              constructor(props) {
                super(props);
                this.state = {
                  hasErr: false,
                  err: null,
                  info: null,
                };
              }
              componentDidCatch(err, info) {
                this.setState({
                  hasErr: true,
                  err,
                  info,
                });
              }
              render() {
                const { hasErr, err, info } = this.state;
                if (hasErr) {
                  if (!encounteredErrs.includes(err)) {
                    Logger.err("Err, Contact Dev for Help!", { err, info });
                    encounteredErrs.push(err);
                  }
                  return React.createElement(
                    "div",
                    {
                      className: "statistics-counter-list-item",
                    },
                    React.createElement(
                      "div",
                      {
                        className: "statistics-counter",
                      },
                      "Error ;-;"
                    )
                  );
                }
                return this.props.children;
              }
            };
          }
          forceUpdate() {
            const toForceUpdate = ReactTools.getOwnerInstance(
              document.querySelector(`.${NavBar.guilds}`)
            );
            const original = toForceUpdate.render;
            toForceUpdate.render = function forceRerender() {
              original.call(this);
              toForceUpdate.render = original;
              return null;
            };
            toForceUpdate.forceUpdate(() =>
              toForceUpdate.forceUpdate(() => {})
            );
          }
          onStop() {
            Patcher.unpatchAll();
            DOMTools.removeStyle(config.info.name);
            this.forceUpdate();
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new SettingGroup("Visibility of counters", {
                collapsible: true,
                shown: false,
              }).append(
                new Switch(
                  "Online Friends",
                  "No. of friends Online.",
                  this.settings["Counters"]["Online"],
                  (e) => {
                    this.settings["Counters"]["Online"] = e;
                  }
                ),
                new Switch(
                  "Friends",
                  "Total no. of friends.",
                  this.settings["Counters"]["Friends"],
                  (e) => {
                    this.settings["Counters"]["Friends"] = e;
                  }
                ),
                new Switch(
                  "Pending",
                  "No. of pending friend requests.",
                  this.settings["Counters"]["Pending"],
                  (e) => {
                    this.settings["Counters"]["Pending"] = e;
                  }
                ),
                new Switch(
                  "Blocked",
                  "No. of blocked people.",
                  this.settings["Counters"]["Friends"],
                  (e) => {
                    this.settings["Counters"]["Friends"] = e;
                  }
                ),
                new Switch(
                  "Guilds",
                  "No. of servers you are in.",
                  this.settings["Counters"]["Guilds"],
                  (e) => {
                    this.settings["Counters"]["Guilds"] = e;
                  }
                ),
                new Switch(
                  "BD Version",
                  "Version of better discord.",
                  this.settings["Counters"]["BDVersion"],
                  (e) => {
                    this.settings["Counters"]["BDVersion"] = e;
                  }
                )
              ),
              new Switch(
                "Preserve last counter",
                "Preseve last counter upon restart",
                this.settings["preserveLastCounter"],
                (e) => {
                  this.settings["preserveLastCounter"] = e;
                }
              ),
              new SettingGroup("Auto Rotation", {
                collapsible: true,
                shown: false,
              }).append(
                new Switch(
                  "Enabled?",
                  "Is Auto Rotation enabled.(so that it would go back and forth the coutners without click.)",
                  this.settings["autoRotation"],
                  (e) => {
                    this.settings["autoRotation"] = e;
                  }
                ),
                new Switch(
                  "Pause on Hover",
                  "Pause the counter from changing automatically on hover.",
                  this.settings["autoRotationHoverPause"],
                  (e) => {
                    this.settings["autoRotationHoverPause"] = e;
                  }
                ),
                new Slider(
                  "Auto rotation interval",
                  "Time to take between changing the counter automatically.",
                  5e3,
                  36e5,
                  this.settings["autoRotationDelay"],
                  (e) => {
                    this.settings["autoRotationDelay"] = e;
                  },
                  {
                    onValueRender: (value) => {
                      const seconds = value / 1000;
                      const minutes = value / 1000 / 60;
                      return value < 6e4
                        ? `${seconds.toFixed(0)} secs`
                        : `${minutes.toFixed(0)} mins`;
                    },
                  }
                )
              )
            );
          }
          saveSettings() {
            Utilities.saveData(config.info.name, "settings", this.settings);
          }
        };
        return plugin(Plugin, Library);
      })(window.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
