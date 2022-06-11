/**
	* @name uwuifier
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 1.0.1
	* @invite SgKSKyh9gY
	* @description Adds a slash command to uwuify the text you send.
	* @website https://tharki-god.github.io/
	* @source https://github.com/Tharki-God/BetterDiscordPlugins
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/uwuifier.plugin.js
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
            name: "uwuifier",
            authors: [{
				name: "Ahlawat",
				discord_id: "887483349369765930",
				github_username: "Tharki-God",
			},
            ],
            version: "1.0.1",
            description:
            "Adds a slash command to uwuify the text you send.",
            github: "https://github.com/Tharki-God/BetterDiscordPlugins",
            github_raw:
            "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/uwuifier.plugin.js",
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
				"This is the initial release of the plugin :)",
				"I :3 wannya *looks at you* cuddwe w-w-with my fiancee :3 (p≧w≦q)"
			]
		}
        ],
        main: "uwuifier.plugin.js",
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
        const {
            get
		} = require("request");
        const sendBotMessage = WebpackModules.getByProps('sendBotMessage');
        const sendUserMessage = WebpackModules.getByProps('sendMessage');
        return class uwuifier extends Plugin {
            onStart() {
                DiscordCommands.BUILT_IN_COMMANDS.push({
                    __registerId: this.getName(),
                    applicationId: "-1",
                    name: "uwuify",
                    description: "uwuify your text.",
                    id: (-1 - DiscordCommands.BUILT_IN_COMMANDS.length).toString(),
                    type: 1,
                    target: 1,
                    predicate: () => true,
                    execute: ([args], {
                        channel
					}) => {
					let text = args.value;
					try {
						get(
							`https://uwuifier-nattexd.vercel.app/api/uwuify/${text}`,
							async(error, response, body) => {
								if (error) {
									console.log(error);
									sendBotMessage.sendBotMessage(channel.id, "couwdn't ^-^ uwuify OwO youw message. P-P-Pwease twy UwU Again watew");
								}
								const uwufied = JSON.parse(body);
								sendUserMessage.sendMessage(channel.id, {
									content: uwufied.message,
									tts: false,
									invalidEmojis: [],
									validNonShortcutEmojis: []
								}, undefined, {});
							});
							
							} catch (error) {
							console.error(error);
					}
					},
					options: [{
						description: "The text you want uwuify. uwu <3",
						displayDescription: "The text you want uwuify. uwu <3",
						displayName: "Text",
						name: "Text",
						required: true,
						type: 3
					}
					]
				});
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
