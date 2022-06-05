/**
	* @name Rabbit
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 1.0.4
	* @invite SgKSKyh9gY
	* @description Sends Random Rabbit gif
	* @website https://wife-ruby.ml
	* @source https://github.com/Tharki-God/BetterDiscordPlugins
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/Rabbit.plugin.js
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
			name: "Rabbit",
			authors: [
				{
					name: "Ahlawat",
					discord_id: "887483349369765930",
					github_username: "Tharki-God",
				},
			],
			version: "1.0.4",
			description:
			"Sends Random rabbit gif",
			github: "https://github.com/Tharki-God/BetterDiscordPlugins",
			github_raw:
			"https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/Rabbit.plugin.js",
		},
		changelog: [
			{
				title: "v0.0.1",
				items: [
					"Idea in mind"
				]
			},
			{
				title: "v0.0.5",
				items: [
					"Base Model"
				]
			},
			{
				title: "Initial Release v1.0.0",
				items: [
					"This is the initial release of the plugin :)",
					"Stream those tiddies real nice (╹ڡ╹ )"
				]
			},
			{
				title: "v1.0.2",
				items: [
					"Code Defractor",
					"More Random"
				]
			},
			{
				title: "v1.0.3",
				items: [
					"Fixed Erros"
				]
			}
		],
		main: "Rabbit.plugin.js",
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
			}
			catch (err) {
				console.error(this.getName(), "Plugin Updater could not be reached.", err);
			}
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
									return BdApi.showConfirmationModal("Error Downloading",
										[
											"Library plugin download failed. Manually install plugin library from the link below.",
											BdApi.React.createElement("a", { href: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", target: "_blank" }, "Plugin Link")
										],
									); }
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
		start() { }
		stop() { }
	}
	: (([Plugin, Library]) => {
        const {
            WebpackModules
		} = Library;
		const DiscordCommands = WebpackModules.getByProps("BUILT_IN_COMMANDS");
        return class Rabbit extends Plugin {
            async getGif(boolean) {
                let randomizer = Math.floor(Math.random() * (45 - 0 + 1) + 0);
                let gif;
                await fetch('https://g.tenor.com/v1/random?q=rabbit&key=ZVWM77CCK1QF&limit=50').then(function (response) {
                    return response.json();
					}).then(function (data) {
                    const url = Object.entries(data.results)[randomizer][1];
                    if (!boolean) {
                        gif = {
							image: {
								url: url.media[0].gif.url,
								proxyURL: url.media[0].gif.url,
								width: url.media[0].gif.dims[0],
								height: url.media[0].gif.dims[1]
							}
						}
					} else
					gif = url.itemurl
					}).catch(function (err) {
					// There was an error
					console.warn('Something went wrong.', err);
				});
				return gif;
			}
			onStart() {				
				DiscordCommands.BUILT_IN_COMMANDS.push({
					__registerId: this.getName(),
					applicationId: "-1",
					name: "rabbit",
					description: "Sends Random Rabbit gif.",
					id: (-1 -BdApi.findModuleByProps("BUILT_IN_COMMANDS").BUILT_IN_COMMANDS.length).toString(),
					type: 1,
					target: 1,
					predicate: () => true,
					execute: (_, {
						channel
					}) => {
					let send = _[0].value;
					try {
						if (!send) {
							this.getGif(false).then((gif) => {
								BdApi.findModuleByProps('sendBotMessage').sendBotMessage(channel.id, "", [gif]);
								}).catch((error) => {
								console.error(error);
							});
							} else {
							this.getGif(true).then((gif) => {
								BdApi.findModuleByProps('sendMessage').sendMessage(channel.id, {
									content: gif,
									tts: false,
									invalidEmojis: [],
									validNonShortcutEmojis: []
								}, undefined, {});
								}).catch((error) => {
								console.error(error);
							});
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
