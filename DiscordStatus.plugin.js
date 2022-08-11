/**
 * @name DiscordStatus
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.0.8
 * @invite SgKSKyh9gY
 * @description Adds a slash command to get discord status from https://discordstatus.com
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/DiscordStatus.plugin.js
 */
/*@cc_on
	@if (@_jscript)
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
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
module.exports = (() => {
	const config = {
	  info: {
		name: "DiscordStatus",
		authors: [
		  {
			name: "Ahlawat",
			discord_id: "887483349369765930",
			github_username: "Tharki-God",
		  },
		],
		version: "1.0.8",
		description:
		  "Adds a slash command to get discord status from https://discordstatus.com",
		github: "https://github.com/Tharki-God/BetterDiscordPlugins",
		github_raw:
		  "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/DiscordStatus.plugin.js",
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
			"Get those stats nerd （︶^︶）",
		  ],
		},
		{
		  title: "v1.0.1",
		  items: ["Reindent"],
		},
		{
		  title: "v1.0.5",
		  items: ["Fully working"],
		},
	  ],
	  main: "DiscordStatus.plugin.js",
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
			DiscordModules: { MessageActions },
		  } = Library;
		  const SlashCommandsStore =
			WebpackModules.getByProps("BUILT_IN_COMMANDS");
		  const capitalize = (text) => text[0].toUpperCase() + text.slice(1);
		  return class Status extends Plugin {
		   
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
			  this.addCommand();
			}
			addCommand(){
			  SlashCommandsStore.BUILT_IN_COMMANDS.push({
				  __registerId: config.info.name,
				  applicationId: "-1",
				  name: "discord status",
				  description:
					"Returns discord status from https://discordstatus.com",
				  id: (-1 - SlashCommandsStore.BUILT_IN_COMMANDS.length).toString(),
				  target: 1,
				  type: 1,
				  predicate: () => true,
				  execute: async (_, { channel }) => {
					try {
					  const embed = await this.stats();
					  MessageActions.sendBotMessage(channel.id, "", [embed]);
					} catch (err) {
					  Logger.err(err);
					}
				  },
				  options: [],
				});
			}
			async stats() {
			  const response = await fetch(
				"https://discordstatus.com/api/v2/summary.json"
			  );
			  const data = await response.json();
			  return {
				type: "rich",
				title: data.status.description,
				description:
				  "[Discord Status](https://discordstatus.com/)\n" +
				  "**Current Incident:**\n" +
				  data.status.indicator,
				color: "6577E6",
				thumbnail: {
				  url: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/372108630_DISCORD_LOGO_400.gif",
				  proxyURL:
					"https://raw.githubusercontent.com/Tharki-God/files-random-host/main/372108630_DISCORD_LOGO_400.gif",
				  width: 400,
				  height: 400,
				},
				fields: data.components.map((component) => ({
				  name: component.name,
				  value: capitalize(component.status),
				  inline: true,
				})),
				timestamp: data.page.updated_at,
			  };
			}
			onStop() {
			  this.unregisterAllCommands(config.info.name);
			}
			unregisterAllCommands(caller) {
			  let index = SlashCommandsStore.BUILT_IN_COMMANDS.findIndex(
				(cmd) => cmd.__registerId === caller
			  );
			  while (index > -1) {
				SlashCommandsStore.BUILT_IN_COMMANDS.splice(index, 1);
				index = SlashCommandsStore.BUILT_IN_COMMANDS.findIndex(
				  (cmd) => cmd.__registerId === caller
				);
			  }
			}
		  };
		  return plugin(Plugin, Library);
		})(global.ZeresPluginLibrary.buildPlugin(config));
  })();
  /*@end@*/
  