/**
 * @name PingPong
 * @author Kirai
 * @authorId 887483349369765930
 * @version 1.0.2
 * @invite SgKSKyh9gY
 * @description Randomize Ping Number.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/Ping.plugin.js
 */
/*@cc_on
	@if (@_jscript)
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by Pinging them in the first person
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
		name: "PingPong",
		authors: [
		  {
			name: "Kirai",
			discord_id: "872383230328832031",
			github_username: "HiddenKirai",
		  },
		],
		version: "1.0.2",
		description: "Randomize Ping Number.",
		github: "https://github.com/Tharki-God/BetterDiscordPlugins",
		github_raw:
		  "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/Ping.plugin.js",
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
			"I am useless (￣m￣）",
		  ],
		},
	  ],
	  main: "Ping.plugin.js",
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
		  const { WebpackModules, Patcher } = Library;
		  const randomNo = (min, max) =>
			Math.floor(Math.random() * (max - min + 1) + min);
		  const MentionCountStore = WebpackModules.getByProps("getMentionCount");
		  return class Ping extends Plugin {
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
			  this.patchPings();
			}
			patchPings() {
			  Patcher.instead(
				MentionCountStore,
				"getMentionCount",
				(_, args, res) => {
				  return randomNo(0, 9000);
				}
			  );
			}
			onStop() {
			  Patcher.unpatchAll();
			}
		  };
		  return plugin(Plugin, Library);
		})(global.ZeresPluginLibrary.buildPlugin(config));
  })();
  /*@end@*/
  