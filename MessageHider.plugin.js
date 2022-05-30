/**
	* @name MessageHider
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 1.0.3
	* @invite SgKSKyh9gY
	* @description Get a option to hide a message by right clicking on it.
	* @website https://wife-ruby.ml
	* @source https://github.com/Tharki-God/BetterDiscordPlugins
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/MessageHider.plugin.js
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
module.exports = (_ => {
	const config = {
		info: {
			name: "MessageHider",
			authors: [
				{
					name: "Ahlawat",
					discord_id: "887483349369765930",
					github_username: "Tharki-God",
				},
				{
					name: "Kirai",
					discord_id: "872383230328832031",
					github_username: "HiddenKirai",
				},
			],
			version: "1.0.3",
			description:
			"Get a option to hide a message by right clicking on it.",
			github: "https://github.com/Tharki-God/BetterDiscordPlugins",
			github_raw:
			"https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/MessageHider.plugin.js",
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
					"Get those fake screen shot －O－"
				]
			},
			{
				title: "Bug Fix v1.0.1",
				items: [
					"Fixed settings not being saved"
				]
			},
			{
				title: "Bug Fix v1.0.2",
				items: [
					"Library Handler"
				]
			},
		],
		main: "MessageHider.plugin.js",
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
		const { Patcher, ContextMenu, Settings} = Library;		
		return class MessageHider extends Plugin {
			async onStart(){	
				this.showToast = BdApi.loadData(config.info.name, "showToast") ?? true;
				const menu = await ContextMenu.getDiscordMenu("MessageContextMenu");
				Patcher.after(
					menu,
					"default",
					(_, [props], ret) => {
						ret.props.children.splice(3, 0, ContextMenu.buildMenuItem({
							name: 'Hide Message',
							separate: false,
							id: 'HideMessageContextMenu',
							label: 'Hide Message',
							color: 'colorDanger',
							action: () => {
								const message = props.message;
								document.getElementById(
									`chat-messages-${message.id}`
								).style.display = 'none';
								if (this.showToast) {
									BdApi.showToast(`Hiding Succesfull: Message sent ${message.author.username} at ${message.timestamp._d}`, 
										{   icon: true,
											timeout: 5000,
											type: 'info' 
										}
									);
								}
							}
						}, true));
					}
				);				
			}
			onStop() {					
				Patcher.unpatchAll();
			}
			getSettingsPanel() {
				return Settings.SettingPanel.build(this.saveSettings.bind(this),
					new Settings.Switch("Popup/Toast", "Display message Hidden popup", this.showToast, (e) => {
						this.showToast = e;
					}))
			}
			saveSettings() {
				BdApi.saveData(config.info.name, "showToast", this.showToast);
			}	
		};		
		return plugin(Plugin, Library);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
