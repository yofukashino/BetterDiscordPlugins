/**
 * @name FluentStatusIcons
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.0.5
 * @invite SgKSKyh9gY
 * @description Adds Fluent Status icons.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/FluentStatusIcons.plugin.js
 */
/*@cc_on
	@if (@_jscript)
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
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
module.exports = ((_) => {
  const config = {
    info: {
      name: "FluentStatusIcons",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "872383230328832031",
          github_username: "Tharki-God",
        },
      ],
      version: "1.0.5",
      description: "Randomize Ping Number.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/FluentStatusIcons.plugin.js",
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
          "Fluent just like english, very premium ultra max ┗|｀O′|┛）",
        ],
      },
    ],
    main: "FluentStatusIcons.plugin.js",
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
          BdApi.showConfirmationModal(
            "Library Missing",
            `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`,
            {
              confirmText: "Download Now",
              cancelText: "Cancel",
              onConfirm: () => {
                require("request").get(
                  "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                  async (error, response, body) => {
                    if (error) {
                      return BdApi.showConfirmationModal("Error Downloading", [
                        "Library plugin download failed. Manually install plugin library from the link below.",
                        BdApi.React.createElement(
                          "a",
                          {
                            href: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                            target: "_blank",
                          },
                          "ZeresPluginLibrary"
                        ),
                      ]);
                    }
                    await new Promise((r) =>
                      require("fs").writeFile(
                        require("path").join(
                          BdApi.Plugins.folder,
                          "0PluginLibrary.plugin.js"
                        ),
                        body,
                        r
                      )
                    );
                  }
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
          DOMTools,
          Settings: { SettingPanel, Switch },
          DiscordModules: { React, ReactDOM },
        } = Library;
        const Mask = WebpackModules.getByProps("MaskLibrary");
        const Avatar = WebpackModules.getByProps("AnimatedAvatar");
        const CSS = `        
        [aria-label*="Online"]  > svg > svg > rect {
        width: 10px;
        height: 10px;
        x: 7.5;
        y: 5;
        mask: url(#svg-mask-status-online);
        }
        [aria-label*="Online via mobile"]  > svg > svg > rect {
          width: 10px;
          height: 15px;
          x: 7.5;
          y: 0;
          mask: url(#svg-mask-status-online-mobile);
          }
        [aria-label*="Idle"]  > svg > svg > rect {
        width: 10px;
        height: 10px;
        x: 7.5;
        y: 5;
        mask: url(#svg-mask-status-idle);
        }        
        [aria-label*="Do Not Disturb"]  > svg > svg > rect {
        width: 10px;
        height: 10px;
        x: 7.5;
        y: 5;
        mask: url(#svg-mask-status-dnd);
        }
        [aria-label*="Invisible"]  > svg > svg > rect {
        width: 10px;
        height: 10px;
        x: 7.5;
        y: 5;
        mask: url(#svg-mask-status-offline);
        } 
        [aria-label*="Offline"]  > svg > svg > rect {
          width: 10px;
          height: 10px;
          x: 7.5;
          y: 5;
          mask: url(#svg-mask-status-offline);
          }       
        [aria-label*="Streaming"]  > svg > svg > rect {
        width: 10px;
        height: 10px;
        x: 7.5;
        y: 5;
        mask: url(#svg-mask-status-streaming);
        }   

        [aria-label="Online via Mobile"] svg rect {
          mask: url(#svg-mask-status-online-mobile);
        }        
        [aria-label="Online"] svg rect {
          mask: url(#svg-mask-status-online);
          height: 10px;
          width: 10px;
          x: 0px;
          y:2px;
        }
        
        [aria-label="Offline"] svg rect {
          mask: url(#svg-mask-status-offline);
          height: 10px;
          width: 10px;
          x: 0px;
          y:2px;
        }
        [aria-label="Idle"] svg rect {
          mask: url(#svg-mask-status-idle);
          height: 10px;
          width: 10px;
          x: 0px;
          y:2px;
        }
        [aria-label="Do Not Disturb"] svg rect {
          mask: url(#svg-mask-status-dnd);
          height: 10px;
          width: 10px;
          x: 0px;
          y:2px;
        }
        [aria-label="Streaming"] svg rect {
          mask: url(#svg-mask-status-streaming);
          height: 10px;
          width: 10px;
          x: 0px;
          y:2px;
        }        
        `;
        const OnlineFluentIcon = React.createElement(
          "mask",
          {
            id: "svg-mask-status-online",
            maskContentUnits: "objectBoundingBox",
            viewBox: "0 0 1 1",
          },
          React.createElement("path", {
            fill: "white",
            d: "M 0.5 0.125 C 0.292969 0.125 0.125 0.292969 0.125 0.5 C 0.125 0.707031 0.292969 0.875 0.5 0.875 C 0.707031 0.875 0.875 0.707031 0.875 0.5 C 0.875 0.292969 0.707031 0.125 0.5 0.125 Z M 0 0.5 C 0 0.222656 0.222656 0 0.5 0 C 0.777344 0 1 0.222656 1 0.5 C 1 0.777344 0.777344 1 0.5 1 C 0.222656 1 0 0.777344 0 0.5 Z M 0 0.5 ",
          })
        );
        const PhoneFluentIcon = React.createElement(
          "mask",
          {
            id: "svg-mask-status-online-mobile",
            maskContentUnits: "objectBoundingBox",
            viewBox: "0 0 1 1",
          },
          React.createElement("path", {
            fill: "white",
            d: "M 0.8125 0 C 0.917969 0 1 0.0507812 1 0.113281 L 1 0.886719 C 1 0.949219 0.917969 1 0.8125 1 L 0.1875 1 C 0.0820312 1 0 0.949219 0 0.886719 L 0 0.113281 C 0 0.0507812 0.0820312 0 0.1875 0 Z M 0.8125 0.0742188 L 0.1875 0.0742188 C 0.152344 0.0742188 0.125 0.0898438 0.125 0.113281 L 0.125 0.886719 C 0.125 0.910156 0.152344 0.925781 0.1875 0.925781 L 0.8125 0.925781 C 0.847656 0.925781 0.875 0.910156 0.875 0.886719 L 0.875 0.113281 C 0.875 0.0898438 0.847656 0.0742188 0.8125 0.0742188 Z M 0.605469 0.773438 C 0.636719 0.773438 0.667969 0.792969 0.667969 0.8125 C 0.667969 0.832031 0.640625 0.851562 0.605469 0.851562 L 0.394531 0.851562 C 0.363281 0.851562 0.332031 0.832031 0.332031 0.8125 C 0.332031 0.792969 0.359375 0.773438 0.394531 0.773438 Z M 0.605469 0.773438 ",
          })
        );
        const IdleFluentIcon = React.createElement(
          "mask",
          {
            id: "svg-mask-status-idle",
            maskContentUnits: "objectBoundingBox",
            viewBox: "0 0 1 1",
          },
          React.createElement("path", {
            fill: "white",
            d: "M0.455,0A0.509,0.509,0,0,1,.888.2L0.909,0.212V0.225L0.924,0.232,0.931,0.258H0.938L0.953,0.3H0.96v0.02H0.967V0.331H0.974V0.358H0.982v0.02H0.989V0.411H1A0.811,0.811,0,0,1,.989.616H0.982V0.642H0.974v0.02H0.967V0.675H0.96V0.7H0.953l-0.014.04H0.931l-0.007.026H0.917l-0.007.02-0.014.007V0.8l-0.036.026V0.841l-0.029.02V0.868H0.816L0.787,0.9H0.772l-0.007.013-0.022.007V0.927l-0.029.007V0.94H0.7V0.947L0.657,0.96V0.967H0.635V0.974H0.613V0.98H0.585V0.987H0.548V0.993H0.476V1H0.433V0.993L0.325,0.987V0.98H0.3V0.974L0.253,0.967V0.96L0.209,0.947V0.94H0.195V0.934L0.166,0.927V0.921L0.144,0.914,0.137,0.9H0.123L0.094,0.868H0.079L0.058,0.841H0.051V0.828L0.014,0.8V0.788L0,0.781V0.735A0.071,0.071,0,0,0,.014.722H0.029V0.715l0.036-.007V0.7H0.087V0.7l0.029-.007V0.682l0.065-.02,0.007-.013,0.043-.013,0.007-.013H0.253L0.267,0.6H0.281L0.31,0.57l0.051-.04V0.517L0.375,0.51l0.007-.02H0.39L0.4,0.464H0.4l0.014-.04H0.426V0.4H0.433V0.391H0.44V0.371H0.447V0.344H0.455l0.007-.2A0.288,0.288,0,0,1,.44.013,0.074,0.074,0,0,0,.455,0ZM0.534,0.079L0.541,0.172H0.548V0.285H0.541l-0.007.086H0.527v0.02H0.52V0.417H0.512V0.43H0.505V0.45H0.5V0.464H0.491v0.02H0.484V0.5H0.476V0.51l-0.014.007-0.007.026L0.44,0.55V0.563l-0.029.02a0.693,0.693,0,0,1-.3.192V0.781H0.115a0.211,0.211,0,0,0,.079.06L0.2,0.854,0.224,0.861V0.868H0.238V0.874L0.281,0.887V0.894L0.325,0.9V0.907H0.354V0.914H0.39V0.921H0.447A0.446,0.446,0,0,0,.671.868H0.686l0.007-.013H0.707l0.007-.013H0.729l0.014-.02H0.758l0.036-.04,0.014-.007V0.762L0.83,0.748V0.735l0.014-.007,0.007-.02H0.859l0.022-.06H0.888V0.636H0.895V0.616H0.9V0.589A0.309,0.309,0,0,0,.917.444H0.909V0.4H0.9V0.384H0.895L0.88,0.325H0.873V0.311H0.866L0.859,0.285,0.844,0.278V0.265A0.523,0.523,0,0,0,.772.192l-0.014-.02H0.743l-0.014-.02H0.714L0.707,0.139H0.693L0.686,0.126l-0.065-.02V0.1H0.606V0.093Z",
          })
        );
        const DNDFluentIcon = React.createElement(
          "mask",
          {
            id: "svg-mask-status-dnd",
            maskContentUnits: "objectBoundingBox",
            viewBox: "0 0 1 1",
          },
          React.createElement("path", {
            fill: "white",
            d: "M 0.5 0 C 0.222656 0 0 0.222656 0 0.5 C 0 0.777344 0.222656 1 0.5 1 C 0.777344 1 1 0.777344 1 0.5 C 1 0.222656 0.777344 0 0.5 0 Z M 0.125 0.5 C 0.125 0.292969 0.292969 0.125 0.5 0.125 C 0.707031 0.125 0.875 0.292969 0.875 0.5 C 0.875 0.707031 0.707031 0.875 0.5 0.875 C 0.292969 0.875 0.125 0.707031 0.125 0.5 Z M 0.25 0.5 C 0.25 0.464844 0.277344 0.4375 0.3125 0.4375 L 0.6875 0.4375 C 0.722656 0.4375 0.75 0.464844 0.75 0.5 C 0.75 0.535156 0.722656 0.5625 0.6875 0.5625 L 0.3125 0.5625 C 0.277344 0.5625 0.25 0.535156 0.25 0.5 Z M 0.25 0.5 ",
          })
        );
        const OfflineFluentIcon = React.createElement(
          "mask",
          {
            id: "svg-mask-status-offline",
            maskContentUnits: "objectBoundingBox",
            viewBox: "0 0 1 1",
          },
          React.createElement("path", {
            fill: "white",
            d: "M 0.667969 0.332031 C 0.695312 0.355469 0.695312 0.394531 0.667969 0.417969 L 0.589844 0.5 L 0.667969 0.582031 C 0.695312 0.605469 0.695312 0.644531 0.667969 0.667969 C 0.644531 0.695312 0.605469 0.695312 0.582031 0.667969 L 0.5 0.589844 L 0.417969 0.667969 C 0.394531 0.695312 0.355469 0.695312 0.332031 0.667969 C 0.304688 0.644531 0.304688 0.605469 0.332031 0.582031 L 0.410156 0.5 L 0.332031 0.417969 C 0.304688 0.394531 0.304688 0.355469 0.332031 0.332031 C 0.355469 0.304688 0.394531 0.304688 0.417969 0.332031 L 0.5 0.410156 L 0.582031 0.332031 C 0.605469 0.304688 0.644531 0.304688 0.667969 0.332031 Z M 0 0.5 C 0 0.222656 0.222656 0 0.5 0 C 0.777344 0 1 0.222656 1 0.5 C 1 0.777344 0.777344 1 0.5 1 C 0.222656 1 0 0.777344 0 0.5 Z M 0.5 0.125 C 0.292969 0.125 0.125 0.292969 0.125 0.5 C 0.125 0.707031 0.292969 0.875 0.5 0.875 C 0.707031 0.875 0.875 0.707031 0.875 0.5 C 0.875 0.292969 0.707031 0.125 0.5 0.125 Z M 0.5 0.125 ",
          })
        );
        const StreamingFluentIcon = React.createElement(
          "mask",
          {
            id: "svg-mask-status-streaming",
            maskContentUnits: "objectBoundingBox",
            viewBox: "0 0 1 1",
          },
          React.createElement("path", {
            fill: "white",
            d: "M 0.746094 0.46875 L 0.433594 0.28125 C 0.398438 0.261719 0.351562 0.289062 0.351562 0.332031 L 0.351562 0.667969 C 0.351562 0.710938 0.398438 0.738281 0.433594 0.71875 L 0.746094 0.53125 C 0.769531 0.519531 0.769531 0.480469 0.746094 0.46875 Z M 0.5 1 C 0.777344 1 1 0.777344 1 0.5 C 1 0.222656 0.777344 0 0.5 0 C 0.222656 0 0 0.222656 0 0.5 C 0 0.777344 0.222656 1 0.5 1 Z M 0.5 0.0625 C 0.742188 0.0625 0.9375 0.257812 0.9375 0.5 C 0.9375 0.742188 0.742188 0.9375 0.5 0.9375 C 0.257812 0.9375 0.0625 0.742188 0.0625 0.5 C 0.0625 0.257812 0.257812 0.0625 0.5 0.0625 Z M 0.5 0.0625",
          })
        );
        const defaultSettings = {
          PhoneIcon: true,
          OnlineIcon: true,
          StreamingIcon: true,
          DNDIcon: true,
          IdleIcon: true,
          OfflineIcon: true,
          
        }
        return class FluentStatusIcons extends Plugin {
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
            this.patchMaskLibrary();
            this.refreshMaskLibrary();
            DOMTools.addStyle("DiscordShitsAtMask", CSS);
          }
          patchMaskLibrary() {
            Patcher.after(Mask.MaskLibrary, "type", (_, args, res) => {
              const masks = res.props.children;
              const OnlineStatusMask = masks.findIndex(
                (mask) => mask.props.id === "svg-mask-status-online"
              );
              const OnlineMobileStatusMask = masks.findIndex(
                (mask) => mask.props.id === "svg-mask-status-online-mobile"
              );
              const IdleStatusMask = masks.findIndex(
                (mask) => mask.props.id === "svg-mask-status-idle"
              );
              const DNDStatusMask = masks.findIndex(
                (mask) => mask.props.id === "svg-mask-status-dnd"
              );
              const OfflineStatusMask = masks.findIndex(
                (mask) => mask.props.id === "svg-mask-status-offline"
              );
              const StreamingStatusMask = masks.findIndex(
                (mask) => mask.props.id === "svg-mask-status-streaming"
              );
              if (this.settings["OnlineIcon"]) masks[OnlineStatusMask] = OnlineFluentIcon;
              if (this.settings["PhoneIcon"])
                masks[OnlineMobileStatusMask] = PhoneFluentIcon;
              if (this.settings["IdleIcon"]) masks[IdleStatusMask] = IdleFluentIcon;
              if (this.settings["DNDIcon"]) masks[DNDStatusMask] = DNDFluentIcon;
              if (this.settings["OfflineIcon"])
                masks[OfflineStatusMask] = OfflineFluentIcon;
              if (this.settings["StreamingIcon"])
                masks[StreamingStatusMask] = StreamingFluentIcon;
              return res;
            });
          }
          refreshMaskLibrary() {
            try {
              if (!Mask)
                return Logger.err(
                  "Missing “MaskLibrary” module, Please report this to the developer."
                );
              const TempMaskContainer = document.createElement("div");
              TempMaskContainer.style.display = "none";
              document.body.appendChild(TempMaskContainer);
              ReactDOM.render(
                React.createElement(Mask.MaskLibrary, null),
                TempMaskContainer
              );
              const MaskLibrary = document.querySelector(
                "#app-mount #svg-mask-squircle"
              )?.parentNode;
              if (MaskLibrary) {
                MaskLibrary.innerHTML =
                  TempMaskContainer.firstElementChild.innerHTML;
                TempMaskContainer.remove();
              }
            } catch (err) {
              Logger.err(err);
            }
          }  
          onStop() {
            DOMTools.removeStyle("DiscordShitsAtMask");
            Patcher.unpatchAll();
            this.refreshMaskLibrary();
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new Switch(
                "Phone Icon",
                "Fluent Phone Icon",
                this.settings["PhoneIcon"],
                (e) => {
                  this.settings["PhoneIcon"] = e;
                }
              ),
              new Switch(
                "Online Icon",
                "Fluent OnlineIcon",
                this.settings["OnlineIcon"],
                (e) => {
                  this.settings["OnlineIcon"] = e;
                }
              ),
              new Switch(
                "Idle Icon",
                "Fluent Idle Icon",
                this.settings["IdleIcon"],
                (e) => {
                  this.settings["IdleIcon"] = e;
                }
              ),
              new Switch("DND Icon", "Fluent DND Icon", this.settings["DNDIcon"], (e) => {
                this.settings["DNDIcon"] = e;
              }),
              new Switch(
                "Offline Icon",
                "Fluent Offline Icon",
                this.settings["OfflineIcon"],
                (e) => {
                  this.settings["OfflineIcon"] = e;
                }
              ),
              new Switch(
                "Streaming Icon",
                "Fluent Streaming Icon",
                this.settings["StreamingIcon"],
                (e) => {
                  this.settings["StreamingIcon"] = e;
                }
              )
            );
          }
          saveSettings() {
            Utilities.saveData(config.info.name, "settings", this.settings);
            this.refreshMaskLibrary();
          }
        };
        return plugin(Plugin, Library);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/4