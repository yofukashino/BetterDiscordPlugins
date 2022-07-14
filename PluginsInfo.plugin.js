/**
	* @name PluginsInfo
	* @author Kirai
	* @authorId 872383230328832031
	* @version 1.0.2
	* @invite SgKSKyh9gY
	* @description Adds a Slash command to send list of enabled and disabled plugins.
	* @website https://tharki-god.github.io/
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/PluginsInfo.plugin.js
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
            name: "PluginsInfo",
            authors: [{
				name: "Kirai",
				discord_id: "872383230328832031",
				github_username: "HiddenKirai",
			},
            ],
            version: "1.0.2",
            description:
            "Adds a Slash command to send list of enabled and disabled plugins.",
            github: "https://github.com/Tharki-God/BetterDiscordPlugins",
            github_raw:
            "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/PluginsInfo.plugin.js",
		},
        changelog: [{
			title: "v0.0.1",
			items: [
				"Idea in mind"
			]
            }, {
			title: "v0.0.5",
			items: [
				"Base Model"
			]
            }, {
			title: "Initial Release v1.0.0",
			items: [
				"This is the initial release of the plugin.",
				"This should be built into better discord."
			]
		}
        ],
        main: "PluginsInfo.plugin.js",
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
			
            try {
                global.ZeresPluginLibrary.PluginUpdater.checkForUpdate(config.info.name, config.info.version, config.info.github_raw);
				} catch (err) {
                console.error(this.getName(), "Plugin Updater could not be reached.", err);
			}
            BdApi.showConfirmationModal(
                "Library Missing",
				`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
					confirmText: "Download Now",
					cancelText: "Cancel",
					onConfirm: () => {
						require("request").get(
							"https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
							async(error, response, body) => {
								if (error) {
									return BdApi.showConfirmationModal("Error Downloading",
										[
											"Library plugin download failed. Manually install plugin library from the link below.",
											BdApi.React.createElement("a", {
												href: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
												target: "_blank"
											}, "Plugin Link")
										], );
								}
								await new Promise((r) =>
									require("fs").writeFile(
										require("path").join(
											BdApi.Plugins.folder,
										"0PluginLibrary.plugin.js"),
										body,
									r));
							});
					},
				});
		}
        start() {}
        stop() {}
	}
	: (([Plugin, Library]) => {
        const {
            WebpackModules
		} = Library;
        const DiscordCommands = WebpackModules.getByProps("BUILT_IN_COMMANDS");
        const sendBotMessage = WebpackModules.getByProps('sendBotMessage');
        const sendUserMessage = WebpackModules.getByProps('sendMessage');
        return class PluginsInfo extends Plugin {
            onStart() {
                DiscordCommands.BUILT_IN_COMMANDS.push({
                    __registerId: this.getName(),
                    applicationId: "-1",
                    name: "list plugins",
                    description: "Sends a list of all plugins you have.",
                    id: (-1 - DiscordCommands.BUILT_IN_COMMANDS.length).toString(),
                    type: 1,
                    target: 1,
                    predicate: () => true,
                    execute: ([args, choice], {
                        channel
					}) => {
					console.log(args, choice)
					let send = args.value;
					try {
						let message = this.getPlugins(choice.value);
						if (send) {
							sendUserMessage.sendMessage(channel.id, {
								content: message,
								tts: false,
								invalidEmojis: [],
								validNonShortcutEmojis: []
							}, undefined, {});
                            } else {
							sendBotMessage.sendBotMessage(channel.id, message);
						}
                        } catch (error) {
						console.error(error);
					}
                    },
                    options: [{
						description: "Weather you want to send this or not.",
						displayDescription: "Weather you want to send this or not.",
						displayName: "Send",
						name: "Send",
						required: true,
						type: 5
                        }, {
						description: "If you want to send either only enabled or disabled.",
						displayDescription: "If you want to send either only enabled or disabled.",
						displayName: "Which List",
						name: "Which List",
						required: true,
						choices: [{
							name: "Enabled",
							displayName: "Enabled",
							value: true,
							}, {
							name: "Disabled",
							displayName: "Disabled",
							value: false,
							}, {
							name: "Both",
							displayName: "Both",
							value: "undefined",
						}
						],
						type: 3
					},
                    ]
				});
			}
            getPlugins(boolean) {
                let plugins = BdApi.Plugins.getAll();
                let enabled = plugins.filter(pp => BdApi.Plugins.isEnabled(pp.id)).map(t => t.name).join(", ")
				let disbaled = plugins.filter(pp => !BdApi.Plugins.isEnabled(pp.id)).map(t => t.name).join(", ")
				let message = boolean == "undefined" ? `**Enabled Plugins:** \n ${enabled} \n\n **Disabled Plugins:** \n ${disbaled}` : boolean ? `**Enabled Plugins:** \n ${enabled}` : `**Disabled Plugins:** \n ${disbaled}`
				return message;
			}
            onStop() {
                this.unregisterAllCommands(this.getName());
			}
            unregisterAllCommands(caller) {
                let index = DiscordCommands.BUILT_IN_COMMANDS.findIndex((cmd => cmd.__registerId === caller));
                while (index > -1) {
                    DiscordCommands.BUILT_IN_COMMANDS.splice(index, 1);
                    index = DiscordCommands.BUILT_IN_COMMANDS.findIndex((cmd => cmd.__registerId === caller));
				}
			}
		};
        return plugin(Plugin, Library);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
