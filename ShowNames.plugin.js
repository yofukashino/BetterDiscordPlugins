/**
 * @name ShowNames
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 0.1
 * @description Makes name visible if same as background
 * @website https://wife-ruby.ml
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/ShowNames.plugin.js
 */
 /*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
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
			name: "ShowNames",
			authors: [
				{
					name: "Ahlawat",
					discord_id: "887483349369765930",
					github_username: "Tharki-God",
				},
			],
			version: "0.2",
			description:
				"Makes name visible if same as background",
			github: "https://github.com/Tharki-God/BetterDiscordPlugins",
			github_raw:
				"https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/ShowNames.plugin.js",
		},
		main: "ShowNames.plugin.js",
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
				const { Patcher, DiscordModules, Settings, PluginUtilities } = Api;
				return class ShowNames extends Plugin {
					onStart() {
				
						const bg = ZeresPluginLibrary.DiscordModules.ColorConverter.hex2int("#000000")
				const gg = getComputedStyle(document.documentElement).getPropertyValue('--background-primary');
				console.log(gg)

			
						const guilds = ZeresPluginLibrary.DiscordModules.GuildStore.getGuilds();
for (const [key, value] of Object.entries(guilds)) {
  let roles = ZeresPluginLibrary.DiscordModules.GuildStore.getGuild(value.id).roles;
  for (const [key, value] of Object.entries(roles)) {
	  if (value && value.colorString) {
const rolec = ZeresPluginLibrary.DiscordModules.ColorConverter.hex2int(value.colorString);
	  if (bg - rolec <= 0){value.color = ZeresPluginLibrary.DiscordModules.ColorConverter.hex2int("#FFFFFF");
	  value.colorString = "#FFFFFF"}
	  }

  }
  
  
}
						



						
					}
					onStop() {
						
					}
				};
			};
			return plugin(Plugin, Api);
		})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
