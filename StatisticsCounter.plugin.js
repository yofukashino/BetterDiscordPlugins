/**
 * @name StatisticsCounter
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.2.2
 * @invite SgKSKyh9gY
 * @description Introduces a similar sort of counter that used to be displayed in-between the home button and servers list.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/StatisticsCounter.plugin.js
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
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.2.2",
      description:
        "Introduces a similar sort of counter that used to be displayed in-between the home button and servers list.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/StatisticsCounter.plugin.js",
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
      {
        title: "v1.1.1",
        items: ["Corrected text."],
      },
      {
        title: "v1.1.2",
        items: ["Changed \"Better Discord\" to \"BD\" in counter text."],
      },
      {
        title: "v1.2.2",
        items: ["Added number input to context menu."],
      }
    ],
    main: "StatisticsCounter.plugin.js",
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
        Patcher,
        Utilities,
        Toasts,
        Logger,
        PluginUpdater,
        ReactTools,
        DOMTools,
        Settings: { SettingPanel, Switch, SettingGroup, Slider },
        DiscordModules: { React, ReactDOM, RelationshipStore },
      } = ZLibrary;
      const { ContextMenu, version } = BdApi;
      const {
        ReactUtils,
        LibraryUtils,
        LibraryModules: {
          SliderComponent,
          Dispatcher,
          DiscordConstants,
          GuildNav,
          PresenceStore,
          Flux,
          NavBarClasses,
          GuildStore
        }
      } = BunnyLib.build(config);
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
          BDVERSION: "BD",
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

      const CSS = `.statistics-counter {           
            font-weight: 500;
            line-height: 13px;
            text-align: center;
            text-transform: uppercase;
            white-space: normal;
            width: 62px;
            word-wrap: normal;
            color: var(--channels-default);
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

          .input-container{                      
            display: flex;            
            background-color: rgba(0,0,0,0);
            border-radius: 45px; 
            margin-left: 1%;
        }
        .statistics-counter-fontsize-input{
            -moz-appearance: textfield;
            text-align: center;
            font-size: 20px;
            width: 100%;
            border: none;            
            background-color: rgba(255,255,255,0.1);
            color: #FFFFFF;
        }
        .statistics-counter-fontsize-input::-webkit-outer-spin-button,
        .statistics-counter-fontsize-input::-webkit-inner-spin-button{
            -webkit-appearance: none;
            
        }
        button{
          text-align: center;
          color: #FFFFFF;
            background-color: rgba(255,255,255,0.1);
            border: none;
            font-size: 20px;
            cursor: pointer;
        }
        .decrement{            
            border-radius: 45px 0 0 45px;
        }
        .increment{           
            border-radius: 0 45px 45px 0;
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
        fontSize: {
          Online: "10",
          Friends: "10",
          Pending: "9.4",
          Blocked: "10",
          Guilds: "10.5",
          BDVersion: "11.5",
        }
      });
      return class StatisticsCounter extends Plugin {
        constructor() {
          super();
          this.settings = Utilities.loadData(
            config.info.name,
            "settings",
            defaultSettings
          );
          this.StatisticsCounterMenu = this.StatisticsCounterMenu.bind(this);
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
            const GuildNavBar = Utilities.findInReactTree(res, (m) => m?.props?.className?.split(" ").includes(NavBarClasses.guilds));
            if (!GuildNavBar) return;
            Patcher.after(GuildNavBar, "type", (_, args, res) => {
              const NavScroll = Utilities.findInReactTree(res, (m) => m?.props?.className?.split(" ").includes(NavBarClasses.scroller));
              if (!NavScroll) return;
              const HomeButtonIndex = NavScroll.props.children.findIndex(m => m?.type?.toString().includes("getHomeLink"));
              const StatisticsCounterIndex = HomeButtonIndex > -1 ? HomeButtonIndex + 1 : 2;
              NavScroll.props.children.splice(StatisticsCounterIndex, 0, React.createElement(
                this.ErrBoundary(),
                null,
                this.Counter()
              ));
            });
          });
          ReactUtils.forceUpdate(document.querySelector(`.${NavBarClasses.guilds}`));
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
                BDVERSION: version,
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
          }, [this.settings["autoRotation"]]);
          [this.fontSize ,this.setFontSize ] = React.useState(this.settings["fontSize"][FormattedCounterTypes[activeCounter]]);
          return React.createElement(
            "div",
            { className: NavBarClasses.listItem },
            React.createElement(
              "div",
              {
                className: `statistics-counter ${activeCounter}`,
                style: {
                  fontSize: `${this.fontSize}px`,
                },

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
                    ContextMenu.open(event, this.StatisticsCounterMenu);
                  },
                  onClick: () => this.goToNextCounter(),

                },
                `${CounterMessage[CounterTranslationKeys[activeCounter]]} - ${counters[activeCounter]
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
          this.setFontSize(this.settings["fontSize"][FormattedCounterTypes[CounterStore.nextCounter]]);
          Dispatcher.dispatch({
            type: ActionTypes.STATISTICS_COUNTER_SET_ACTIVE,
            counter: CounterStore.nextCounter,
          });
        }
        goToCounter(counter) {
          if (this.settings["preserveLastCounter"]) {
            this.settings["lastCounter"] = counter;
            this.saveSettings();
          }          
          this.setFontSize(this.settings["fontSize"][FormattedCounterTypes[counter]])
          Dispatcher.dispatch({
            type: ActionTypes.STATISTICS_COUNTER_SET_ACTIVE,
            counter: counter,
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
        StatisticsCounterMenu(props) {
          const CounterStore = this.CounterStore();
          const [enabledCounters, setCounters] = React.useState(
            Object.keys(FormattedCounterTypes).filter(
              (counter) =>
                this.settings["Counters"][FormattedCounterTypes[counter]]
            )
          );
          const [currentCounter, setCurrentCounter] = React.useState(
            Object.assign(
              {},
              ...Object.keys(FormattedCounterTypes)
                .filter(
                  (counter) =>
                    this.settings["Counters"][FormattedCounterTypes[counter]]
                )
                .map((counter) => {
                  return {
                    [counter]: counter == CounterStore.state.activeCounter,
                  };
                })
            )
          );     
          const [counterSize ,setCounterSize ] = React.useState(this.fontSize);
          return React.createElement(
            ContextMenu.Menu,
            props,
            ContextMenu.buildMenuChildren([
              {
                type: "submenu",
                label: "Active Counter",
                items: enabledCounters.map((counter) => {
                  return {
                    type: "radio",
                    label: CounterMessage[CounterTranslationKeys[counter]],
                    checked: currentCounter[counter],
                    action: () => {
                      this.goToCounter(counter);
                      setCurrentCounter(
                        Object.assign(
                          {},
                          ...Object.keys(FormattedCounterTypes)
                            .filter(
                              (counter) =>
                                this.settings["Counters"][
                                FormattedCounterTypes[counter]
                                ]
                            )
                            .map((counter) => {
                              return {
                                [counter]:
                                  counter == CounterStore.state.activeCounter,
                              };
                            })
                        )
                      );
                    },
                  };
                }),
              },
              {
                type: "submenu",
                label: "Visibility",
                items: Object.keys(FormattedCounterTypes).map((counter) => {
                  return {
                    type: "toggle",
                    label: CounterMessage[CounterTranslationKeys[counter]],
                    active:
                      this.settings["Counters"][
                      FormattedCounterTypes[counter]
                      ],
                    action: () => {
                      this.settings["Counters"][
                        FormattedCounterTypes[counter]
                      ] =
                        !this.settings["Counters"][
                        FormattedCounterTypes[counter]
                        ];
                      this.saveSettings();
                      setCounters(
                        Object.keys(FormattedCounterTypes).filter(
                          (m) =>
                            this.settings["Counters"][
                            FormattedCounterTypes[m]
                            ]
                        )
                      );
                    },
                  };
                }),
              },
              {
                type: "submenu",
                label: "Auto Rotation",
                items: [
                  {
                    type: "toggle",
                    label: "Enabled",
                    active: this.settings["autoRotation"],
                    action: () => {
                      this.settings["autoRotation"] =
                        !this.settings["autoRotation"];
                      this.saveSettings();
                    },
                  },
                  {
                    type: "toggle",
                    label: "Pause on Hover",
                    active: this.settings["autoRotationHoverPause"],
                    action: () => {
                      this.settings["autoRotationHoverPause"] =
                        !this.settings["autoRotationHoverPause"];
                      this.saveSettings();
                    },
                  },
                  {
                    type: "control",
                    label: "Auto Rotation Interval",
                    control: () =>
                      React.createElement(SliderComponent, {
                        value: this.settings["autoRotationDelay"],
                        initialValue: this.settings["autoRotationDelay"],
                        minValue: 5000,
                        maxValue: 60000,
                        renderValue: (value) => {
                          const seconds = value / 1000;
                          const minutes = value / 1000 / 60;
                          return value < 60000
                            ? `${seconds.toFixed(0)} secs`
                            : `${minutes.toFixed(0)} min`;
                        },
                        onChange: (e) => {
                          this.settings["autoRotationDelay"] = e;
                          this.saveSettings();
                        },
                      }),
                  },
                ],
              },
              ,
              {
                type: "control",
                label: "Current Counter Size",
                control: () => React.createElement("div", null, React.createElement(SliderComponent, {                 
                  value: counterSize,
                  initialValue: counterSize,
                  minValue: 5,
                  maxValue: 20,
                  renderValue: (value) => {
                    return `${value.toFixed(1)}px`;
                  },
                  onChange: (e) => {
                    this.settings["fontSize"][FormattedCounterTypes[Object.keys(currentCounter).find(m => currentCounter[m])]] = e.toFixed(1);
                    this.setFontSize(e.toFixed(1));
                    setCounterSize(e.toFixed(1));
                    this.saveSettings();                  
                  },
                }),
                React.createElement("div", {
                  className: "input-container"
                },React.createElement("button", {
                  className: "decrement button",
                  onClick: () => {
                    const value = LibraryUtils.limit(parseFloat((parseFloat(Number.isNaN(counterSize) ? 5 : counterSize) - 0.1).toFixed(1)), 5, 20);                   
                    this.settings["fontSize"][FormattedCounterTypes[Object.keys(currentCounter).find(m => currentCounter[m])]] = value;
                    this.setFontSize(value);
                    setCounterSize(value);
                    this.saveSettings();    
                  }
                }, " - "), React.createElement("input", {
                  type: "number",
                  className: "statistics-counter-fontsize-input",
                  min: 5,
                  max: 20,                 
                  value: counterSize,
                  onChange: ({ target }) => {                                
                    const value = LibraryUtils.limit(parseFloat(target.value).toFixed(1), 5, 20);
                    this.settings["fontSize"][FormattedCounterTypes[Object.keys(currentCounter).find(m => currentCounter[m])]] = value;
                    this.setFontSize(value);
                    setCounterSize(value);
                    this.saveSettings();                          
                   
                },   
                }), React.createElement("button", {
                  className: "increment",
                  onClick: () => {
                    const value = LibraryUtils.limit(parseFloat((parseFloat(Number.isNaN(counterSize) ? 5 : counterSize) + 0.1).toFixed(1)), 5, 20);                    
                    this.settings["fontSize"][FormattedCounterTypes[Object.keys(currentCounter).find(m => currentCounter[m])]] = value;
                    this.setFontSize(value);
                    setCounterSize(value);
                    this.saveSettings();    
                  }
                }, " + ")
                )
                
                )
                
                 
              }

            ])
          );
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
                  Logger.err("An error has occurred. Contact the developer for help!", { err, info });
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

        onStop() {
          Patcher.unpatchAll();
          DOMTools.removeStyle(config.info.name);
          ReactUtils.forceUpdate(document.querySelector(`.${NavBarClasses.guilds}`));
        }
        getSettingsPanel() {
          return SettingPanel.build(
            this.saveSettings.bind(this),
            new SettingGroup("Visibility of counters", {
              collapsible: true,
              shown: false,
            }).append(
              new Switch(
                "Online friends",
                "Amount of friends online.",
                this.settings["Counters"]["Online"],
                (e) => {
                  this.settings["Counters"]["Online"] = e;
                }
              ),
              new Switch(
                "Friends",
                "Total amount of friends.",
                this.settings["Counters"]["Friends"],
                (e) => {
                  this.settings["Counters"]["Friends"] = e;
                }
              ),
              new Switch(
                "Pending",
                "Amount of pending friend requests.",
                this.settings["Counters"]["Pending"],
                (e) => {
                  this.settings["Counters"]["Pending"] = e;
                }
              ),
              new Switch(
                "Blocked",
                "Amount of blocked users.",
                this.settings["Counters"]["Friends"],
                (e) => {
                  this.settings["Counters"]["Friends"] = e;
                }
              ),
              new Switch(
                "Guilds",
                "Amount of servers you are in.",
                this.settings["Counters"]["Guilds"],
                (e) => {
                  this.settings["Counters"]["Guilds"] = e;
                }
              ),
              new Switch(
                "BD version",
                "Version of BetterDiscord.",
                this.settings["Counters"]["BDVersion"],
                (e) => {
                  this.settings["Counters"]["BDVersion"] = e;
                }
              )
            ),
            new Switch(
              "Preserve last counter",
              "Preserve last counter upon restart.",
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
                "Enabled",
                "Automatically switch between counters, without needing to click.",
                this.settings["autoRotation"],
                (e) => {
                  this.settings["autoRotation"] = e;
                }
              ),
              new Switch(
                "Pause on hover",
                "Pause the counter from changing automatically on hover.",
                this.settings["autoRotationHoverPause"],
                (e) => {
                  this.settings["autoRotationHoverPause"] = e;
                }
              ),
              new Slider(
                "Auto rotation interval",
                "The amount of time between changing the counter automatically.",
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
            ),
            new SettingGroup("Counter Sizes", {
              collapsible: true,
              shown: false,
            }).append(
              new Slider(
                "Online friends",
                "Amount of friends online.",
                5,
                20,
                this.settings["fontSize"]["Online"],
                (e) => {
                  this.settings["fontSize"]["Online"] = e;
                },
                {
                  onValueRender: (value) => {
                    return `${Math.floor(value)}px`;
                  },
                }
              ),
              new Slider(
                "Friends",
                "Total amount of friends.",
                5,
                20,
                this.settings["fontSize"]["Friends"],
                (e) => {
                  this.settings["fontSize"]["Friends"] = e;
                },
                {
                  onValueRender: (value) => {
                    return `${Math.floor(value)}px`;
                  },
                }
              ),
              new Slider(
                "Pending",
                "Amount of pending friend requests.",
                5,
                20,
                this.settings["fontSize"]["Pending"],
                (e) => {
                  this.settings["fontSize"]["Pending"] = e;
                },
                {
                  onValueRender: (value) => {
                    return `${Math.floor(value)}px`;
                  },
                }
              ),
              new Slider(
                "Blocked",
                "Amount of blocked users.",
                5,
                20,
                this.settings["fontSize"]["Friends"],
                (e) => {
                  this.settings["fontSize"]["Friends"] = e;
                },
                {
                  onValueRender: (value) => {
                    return `${Math.floor(value)}px`;
                  },
                }
              ),
              new Slider(
                "Guilds",
                "Amount of servers you are in.",
                5,
                20,
                this.settings["fontSize"]["Guilds"],
                (e) => {
                  this.settings["fontSize"]["Guilds"] = e;
                },
                {
                  onValueRender: (value) => {
                    return `${Math.floor(value)}px`;
                  },
                }
              ),
              new Slider(
                "BD version",
                "Version of BetterDiscord.",
                5,
                20,
                this.settings["fontSize"]["BDVersion"],
                (e) => {
                  this.settings["fontSize"]["BDVersion"] = e;
                },
                {
                  onValueRender: (value) => {
                    return `${Math.floor(value)}px`;
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
    })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
