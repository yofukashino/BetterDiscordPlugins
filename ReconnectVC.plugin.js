/**
 * @name ReconnectVC
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.2.0
 * @invite SgKSKyh9gY
 * @description Attempts to disconnect from / rejoin a voice chat if the ping goes above a certain threshold.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/ReconnectVC.plugin.js
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
		name: "ReconnectVC",
		authors: [
		  {
			name: "Ahlawat",
			discord_id: "887483349369765930",
			github_username: "Tharki-God",
		  },
		],
		version: "1.2.0",
		description:
		  "Attempts to disconnect from / rejoin a voice chat if the ping goes above a certain threshold.",
		github: "https://github.com/Tharki-God/BetterDiscordPlugins",
		github_raw:
		  "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/ReconnectVC.plugin.js",
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
			"Teri Mummy Meri Hoja (^///^)",
		  ],
		},
		{
			title: "v1.2.0",
			items: [
			  "Fixed issues with disconnecting from vc",
			],
		  }
	  ],
	  main: "ReconnectVC.plugin.js",
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
			Utilities,
			PluginUpdater,
			Logger,
			WebpackModules,
			Settings: { SettingPanel, Slider },
			DiscordModules: { ChannelActions, SelectedChannelStore },
		  } = Library;
		  const Dispatcher = WebpackModules.getByProps(
			"dispatch",
			"_actionHandlers"
		  );
		  const defaultSettings = {
			PingThreshold: 500,
		  };
		  return class ReconnectVC extends Plugin {
			constructor() {
			  super();
			  this.settings = Utilities.loadData(
				config.info.name,
				"settings",
				defaultSettings
			  );
			  this.pingCheckEnabled = true;
			  this.checkPing = this.checkPing.bind(this);
			  this.reconnectV2 = this.reconnectV2.bind(this);
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
			  this.addListener();
			}
			addListener() {
			  Dispatcher.subscribe("RTC_CONNECTION_PING", this.checkPing);
			}
			checkPing(arg) {
			  if (!this.pingCheckEnabled) return;
			  const pingArray = arg.pings;
			  const lastPing = pingArray[pingArray.length - 1].value;
			  if (lastPing < this.settings["PingThreshold"]) return;
			  Logger.warn(
				`Ping higher than set threshold! Attempting to rejoin VC. ${lastPing} > ${this.PingThreshold}`
			  );
			  this.reconnect();
			}
			reconnect() {	
			this.voiceId = SelectedChannelStore.getVoiceChannelId();		  
			  Dispatcher.subscribe(
				"RTC_CONNECTION_STATE",
				this.reconnectV2
			  );
			  this.setPing();
			  ChannelActions.disconnect();
			}
			setPing() {
			  this.pingCheckEnabled = !this.pingCheckEnabled;
			}
			reconnectV2(e) {				
				if (e.state === "DISCONNECTED") {
				  ChannelActions.selectVoiceChannel(this.voiceId);
				  setTimeout(() => {
					this.setPing();
					Dispatcher.unsubscribe(
					  "RTC_CONNECTION_STATE",
					  this.reconnectV2
					);
				  }, 1000);
				}
			  }
			onStop() {
			  Dispatcher.unsubscribe("RTC_CONNECTION_PING", this.checkPing);
			}
			getSettingsPanel() {
			  return SettingPanel.build(
				this.saveSettings.bind(this),
				new Slider(
				  "Ping threshold",
				  "The threshold at which the plugin should try to rejoin a voice chat.",
				  300,
				  5000,
				  this.settings["PingThreshold"],
				  (e) => {
					this.settings["PingThreshold"] = e;
				  },
				  {
					markers: [300, 500, 1000, 4999],
					stickToMarkers: false,
					onValueRender: (value) => {
					  return `${Math.floor(value)} ms`;
					},
					onMarkerRender: (value) => {
						return `${Math.floor(value)} ms`;
					  },
				  }
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
  
