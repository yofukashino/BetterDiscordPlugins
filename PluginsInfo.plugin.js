/**
 * @name PluginsInfo
 * @author Kirai, Ahlawat
 * @authorId 872383230328832031
 * @version 1.0.6
 * @invite SgKSKyh9gY
 * @description Adds a Slash command to send list of enabled and disabled plugins.
 * @website https://tharki-god.github.io/
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/PluginsInfo.plugin.js
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
		name: "PluginsInfo",
		authors: [
		  {
			name: "Kirai",
			discord_id: "872383230328832031",
			github_username: "HiddenKirai",
		  },
		  {
			name: "Ahlawat",
			discord_id: "887483349369765930",
			github_username: "Tharki-God",
		  },
		],
		version: "1.0.6",
		description:
		  "Adds a Slash command to send list of enabled and disabled plugins.",
		github: "https://github.com/Tharki-God/BetterDiscordPlugins",
		github_raw:
		  "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/PluginsInfo.plugin.js",
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
			"This is the initial release of the plugin.",
			"This should be built into better discord.",
		  ],
		},
	  ],
	  main: "PluginsInfo.plugin.js",
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
			PluginUpdater,
			Logger,
			DiscordModules: { MessageActions },
		  } = Library;
		  const SlashCommandsStore =
			WebpackModules.getByProps("BUILT_IN_COMMANDS");
		  return class PluginsInfo extends Plugin {
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
			addCommand() {
			  SlashCommandsStore.BUILT_IN_COMMANDS.push({
				__registerId: config.info.name,
				applicationId: "-1",
				name: "list plugins",
				displayName: "list plugins",
				displayDescription: "Sends a list of all plugins you have.",
				description: "Sends a list of all plugins you have.",
				id: (-1 - SlashCommandsStore.BUILT_IN_COMMANDS.length).toString(),
				type: 1,
				target: 1,
				predicate: () => true,
				execute: ([send, versions, listChoice], { channel }) => {
				  try {
					const content = this.getPlugins(versions.value, listChoice.value);
					send.value
					  ? MessageActions.sendMessage(
						  channel.id,
						  {
							content,
							tts: false,
							invalidEmojis: [],
							validNonShortcutEmojis: [],
						  },
						  undefined,
						  {}
						)
					  : MessageActions.sendBotMessage(channel.id, content);
				  } catch (err) {
					Logger.err(err);
					MessageActions.sendBotMessage(channel.id, "Unable to list your plugins.");
				  }
				},
				options: [
				  {
					description: "Weather you want to send this or not.",
					displayDescription: "Weather you want to send this or not.",
					displayName: "Send",
					name: "Send",
					required: true,
					type: 5,
				  },
				  {
					description: "Whether you want to add version info.",
					displayDescription: "Whether you want to add version info.",
					displayName: "Versions",
					name: "Versions",
					required: true,
					type: 5,
				  },
				  {
					description:
					  "If you want to send either only enabled or disabled.",
					displayDescription:
					  "If you want to send either only enabled or disabled.",
					displayName: "Which List",
					name: "Which List",
					required: true,
					choices: [
					  {
						name: "Enabled",
						displayName: "Enabled",
						value: "enabled",
					  },
					  {
						name: "Disabled",
						displayName: "Disabled",
						value: "disabled",
					  },
					  {
						name: "Both",
						displayName: "Both",
						value: "default",
					  },
					],
					type: 3,
				  },
				],
			  });
			}
			getPlugins(version, list) {
			  const allPlugins = BdApi.Plugins.getAll();
			  const enabled = allPlugins.filter((p) =>
				BdApi.Plugins.isEnabled(p.id)
			  );
			  const disbaled = allPlugins.filter(
				(p) => !BdApi.Plugins.isEnabled(p.id)
			  );
			  const enabledMap = enabled
              .map((p) => (version ? `${p.name} (${p.version})` : p.name))
              .join(", ");
            const disabledMap = disbaled
              .map((p) => (version ? `${p.name} (${p.version})` : p.name))
              .join(", ");
			  switch (list) {
				case "enabled":
				  return `**Enabled Plugins(${enabled.length}):** \n ${enabledMap}`;
				  break;
				case "disabled":
				  return `**Disabled Plugins(${disbaled.length}):** \n ${disabledMap}`;
				  break;
				default:
				  return `**Enabled Plugins(${enabled.length}):** \n ${enabledMap} \n\n **Disabled Plugins(${disbaled.length}):** \n ${disabledMap}`;
			  }
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
		})(window.ZeresPluginLibrary.buildPlugin(config));
  })();
  /*@end@*/
  