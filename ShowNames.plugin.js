/**
	* @name ShowNames
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 1.0.0
	* @invite SgKSKyh9gY
	* @description Makes name visible if same as background
	* @website https://wife-ruby.ml
	* @authorLink https://discordapp.com/users/887483349369765930
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
				{
					name: "Kirai",
					discord_id: "872383230328832031",
					github_username: "HiddenKirai",
				},
			],
			version: "1.0.0",
			description:
			"Makes name visible if same as background",
			github: "https://github.com/Tharki-God/BetterDiscordPlugins",
			github_raw:
			"https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/ShowNames.plugin.js",
		},
		changelog: [
			{
				title: "v0.0.1",
				items: [
					"Idea in mind"
				]
			},
			{
				title: "v0.0.2",
				items: [
					"Base Model",
					"Not Working"
				]
			},
			{
				title: "v0.0.5",
				items: [
					"Base Model",
					"Working but buggy"
				]
			},
			{
				title: "v0.5.0",
				items: [
				 	"Intial code done"
				]
			},
			
			{
				title: "Initial Release v1.0.0",
				items: [
					"This is the initial release of the plugin :)",
					"Still need some optimization but kinda works"
				]
			}
		],
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
			const {WebpackModules, DiscordModules, DiscordSelectors, Patcher, ReactComponents, ColorConverter, Utilities, Logger}  = Api;
			return class ShowNames extends Plugin {
				LightenDarkenColor(col,amt) {
					var usePound = false;
					if ( col[0] == "#" ) {
						col = col.slice(1);
						usePound = true;
					}					
					var num = parseInt(col,16);					
					var r = (num >> 16) + amt;					
					if ( r > 255 ) r = 255;
					else if  (r < 0) r = 0;					
					var b = ((num >> 8) & 0x00FF) + amt;					
					if ( b > 255 ) b = 255;
					else if  (b < 0) b = 0;					
					var g = (num & 0x0000FF) + amt;					
					if ( g > 255 ) g = 255;
					else if  ( g < 0 ) g = 0;					
					return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
				}
				deltaE(rgbA, rgbB) {
					let labA = this.rgb2lab(rgbA);
					let labB = this.rgb2lab(rgbB);
					let deltaL = labA[0] - labB[0];
					let deltaA = labA[1] - labB[1];
					let deltaB = labA[2] - labB[2];
					let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
					let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
					let deltaC = c1 - c2;
					let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
					deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
					let sc = 1.0 + 0.045 * c1;
					let sh = 1.0 + 0.015 * c1;
					let deltaLKlsl = deltaL / (1.0);
					let deltaCkcsc = deltaC / (sc);
					let deltaHkhsh = deltaH / (sh);
					let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
					return i < 0 ? 0 : Math.sqrt(i);
				}
				rgb2lab(rgb){
					let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, x, y, z;
					r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
					g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
					b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
					x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
					y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
					z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
					x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
					y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
					z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
					return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
				}	
				sleep(ms) {
					return new Promise(resolve => setTimeout(resolve, ms));
				}
				getBackground() {
					var getBody = document.getElementsByTagName("body")[0]
					var prop = window.getComputedStyle(getBody).getPropertyValue("background-color");
					if (prop === "transparent") {
						console.log("No background colour set");
						} else {
						return prop;
					}
				}
				changeRoleColors() {					
					const bgcolor = this.getBackground();
					const bgc = JSON.parse(`[${bgcolor.split("(")[1].split(")")[0]}]`); 
					const guilds = DiscordModules.GuildStore.getGuilds();
					
					Object.entries(guilds).forEach((g)=>{
						var itemsProcessed = 0;
						let needsUpdate = false;
						Object.entries(g[1].roles).forEach((r)=>{
							itemsProcessed++;	
							if (r[1].colorString && r[1].color) {
								let roleRGB =  DiscordModules.TinyColor(r[1].colorString);
								if  ( this.deltaE(bgc, [roleRGB._r, roleRGB._g, roleRGB._b]) < 50 )	 {
									let amount;
									r[1].originalHex = r[1].colorString ;
									if (BDFDB.DiscordUtils.getTheme() === BDFDB.disCN.themelight) {amount = -50}								 
									else if (BDFDB.DiscordUtils.getTheme() === BDFDB.disCN.themedark) { amount = 50}						
									let changed = this.LightenDarkenColor(r[1].colorString, amount);
									r[1].color = ColorConverter.hex2int(changed);
									r[1].colorString = changed;
									needsUpdate	= true;					
								};
							};		
							if(itemsProcessed === Object.entries(g[1].roles).length && needsUpdate) {
								this.forceUpdate(g[0]);
								itemsProcessed = 0;
							};
						});
						
					});
				}
				checkThemes() {
					this.isLoaded = BdApi.Themes.getAll().some(t => BdApi.Themes.isEnabled(t.id));
					this.i++;
					if (this.isLoaded || this.i++ < 10) {
						clearInterval(this.checks);
						this.changeRoleColors();
					}
				}				
				async onStart() {
					this.i = 0;
					this.checks = setInterval(() => this.checkThemes(), 4000);				
				}				
				onStop() {
					clearInterval(this.checks);
					const guilds = DiscordModules.GuildStore.getGuilds();					
					Object.entries(guilds).forEach((g)=>{
						var itemsProcessed = 0;
						let needsUpdate = false;
						Object.entries(g[1].roles).forEach((r)=>{
							itemsProcessed++;
							if (r[1].colorString && r[1].color && r[1].originalHex) {						
								r[1].color = ColorConverter.hex2int(r[1].originalHex);
								r[1].colorString = r[1].originalHex;
								r[1].originalHex = null;
								needsUpdate= true;
							}
							if(itemsProcessed === Object.entries(g[1].roles).length && needsUpdate) {
								this.forceUpdate(g[0]);
								itemsProcessed = 0;
							};
							
						});
					});
				}
				forceUpdate(guildId) {	
					function changeColor (member, colorRole) { 
						if (colorRole) {
							member.colorString =  colorRole.colorString;
						} else  return;	 
					}						
					const members = DiscordModules.GuildMemberStore.getMembers(guildId)
					Object.entries(members).forEach((m)=>{
					if (!m[1].colorString) return;
						let colorRole;	
						var itemsProcessed = 0;
						let roles = DiscordModules.GuildStore.getGuild(m[1].guildId).roles
						Object.entries(roles).forEach((r)=>{
							itemsProcessed++;
							if (m[1].roles.includes(r[0]) && r[1].colorString && r[1].color && (!colorRole || colorRole.position < r[1].position)) colorRole = r[1];							
							if(itemsProcessed === Object.entries(roles).length) {
								changeColor(m[1], colorRole);
								itemsProcessed = 0;
							};
						});						
					});
				}				
			};
		};
		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/	
