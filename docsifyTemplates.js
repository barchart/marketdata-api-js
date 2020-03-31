module.exports = {
	indexHTMLHead: '  <link rel="stylesheet" type="text/css" href="styles/override.css">\n</head>',
	sdkReference: '# SDK Reference\n',
	releasesTemplate: '<!-- releases_open -->\n',
	sdkSidebar: '<!-- sdk_open -->\n* [SDK Reference](/content/sdk_reference)\n',
	sidebar: `* [Overview](/content/product_overview)
* [Quick Start](/content/quick_start)
<!-- sdk_open -->
* [SDK Reference](/content/sdk_reference)
<!-- sdk_close -->
* [Release Notes](/content/release_notes)`,
	coverPage: (version) => {
		return `# Barchart Market Data SDK <small>JavaScript ${version}</small>

> Inject real-time market data into your JavaScript applications

[Product Overview](/content/product_overview)
[Quick Start](/content/quick_start)
`;
	},
	docsifyConfig: `window.$docsify = {
		loadSidebar: true,
		coverpage: true,
		relativePath: false,
		onlyCover: true,
		notFoundPage: true,
		subMaxLevel: 2,
		search: {
			maxAge: 86400000, // Expiration time, the default one day
			placeholder: 'Type to search',
			noData: 'No Results',
			depth: 0,
			hideOtherSidebarContent: false,
		},`,
	styles: '.sidebar .app-name {\n\ttext-align: left;\n\n\tmargin-left: 15px;\n}\n\nh2#contents + ul p {\n\tmargin: 0;\n}',
	quickStart: '# Quick Start',
	productOverview: '# Overview',
	releaseNotes: '# Release Notes\n<!-- releases_open -->\n<!-- releases_close -->',
};