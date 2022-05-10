/**
	* @name FakeDeafen
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 0.2.6
	* @invite SgKSKyh9gY
	* @description FakeDefen to Trick your Friends
	* @website https://wife-ruby.ml
	* @source https://github.com/Tharki-God/BetterDiscordPlugins
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/FakeDeafen.plugin.js
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
			name: "FakeDeafen",
			authors: [
				{
					name: "Ahlawat",
					discord_id: "887483349369765930",
					github_username: "Tharki-God",
				},
			],
			version: "0.2.6",
			description:
			"FakeDefen to Trick your Friends",
			github: "https://github.com/Tharki-God/BetterDiscordPlugins",
			github_raw:
			"https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/FakeDeafen.plugin.js",
		},
		changelog: [
			{
				title: "v0.2.3",
				items: [
					"Easier To use Now"
				]
			},
			{
				title: "v0.2.4",
				items: [
					"Reindented file"
				]
			},
			{
				title: "v0.2.6",
				items: [
					"Fixed some bugs, and made the code better looking."
				]
			},
			
		],
		main: "FakeDeafen.plugin.js",
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
								if (error)
								return require("electron").shell.openExternal(
									"https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js"
								);
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
	: (([Plugin, Api]) => {
		const plugin = (Plugin, Api) => {
			return class FakeDeafen extends Plugin {
				async onStart() {
					function sleep(ms) {
						return new Promise(resolve => setTimeout(resolve, ms));
					}
					function deafen() {
						BdApi.findModuleByProps("toggleSelfDeaf").toggleSelfDeaf();
						setTimeout(() => {  
							BdApi.alert("Deafen yourself Dumb Bitch! (^人^)", [
								"You Need to Deafen/Mute yourself before enabling this plugin",
								"This will help you retain that.",
								"Do it yourself from next time, I deafened You this time"
							]);
						}, 1500);
					}
					function fakeIt() {						
						var text = new TextDecoder("utf-8");					
						WebSocket.prototype.original = WebSocket.prototype.send;
						WebSocket.prototype.send = function(data) {
							if (Object.prototype.toString.call(data) === "[object ArrayBuffer]") {
								if (text.decode(data).includes("self_deaf")) {
									data = data.replace('"self_mute":false', 'NiceOneDiscord');								
								}
							}
							WebSocket.prototype.original.apply(this, [data]);
						}
						BdApi.showConfirmationModal("Less go. Nyaa~", 
							[`Now stop plugin!.`,`You can't join any other voice channels until the plugin is on.`,`For that you will have to Reload discord after disabling the plugin!`],
							{
								danger: true,
								confirmText: "Disable Plugin Now",
								cancelText: "I will do it later",
								onConfirm: () => {
									BdApi.Plugins.disable("FakeDeafen")
								}						
							}
						);		
					}
					if (!BdApi.findModuleByProps('isDeaf').isSelfMute() && !BdApi.findModuleByProps('isDeaf').isSelfDeaf()) { 
						await deafen()
						await sleep(1000);						
					}
					fakeIt();
				}
				onStop() {
					BdApi.showConfirmationModal("See you Later. UwU", 
						[
							`You Disabled the Plugin,`,`So Wanna Reload discord?`
						],
						{
							danger: true,
							confirmText: "Reload discord",
							cancelText: "I will do it later",
							onConfirm: () => {
								window.location.reload()
							}
							
						}
					);
					
				}
			};
		};
		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
